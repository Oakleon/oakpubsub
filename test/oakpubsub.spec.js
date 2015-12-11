import _Fs from 'fs';
import _Assert from 'assert';

import _Promise from 'bluebird';
import _R from 'ramda';

import * as _Oakpubsub from '../src/oakpubsub';

function read_project_id_from_file(filename) {

    if (!_Fs.existsSync(filename)) {
        console.error('a project id is required');
        process.exit(99);
    }
    return _Fs.readFileSync(filename, {encoding: 'utf8'}).trim();
}

let _auth_filename = process.env.GCLOUD_AUTH_FILE || __dirname + '/auth-secret.json';
let _use_auth_file = _Fs.existsSync(_auth_filename);
let _project_id    = process.env.GCLOUD_PROJECT_ID || read_project_id_from_file(__dirname + '/auth-project.json');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let rando              = getRandomInt(1,99999);
let _topic_prefix      = `oakpubsub-spec-topic`;
let _topic_name        = `${_topic_prefix}_${rando}`;
let _subscription_name = `oakpubsub-spec-subscription_${rando}`;

function get_init_options() {
    if (_use_auth_file) {
        return { projectId: _project_id, keyFilename: _auth_filename };
    }
    return { projectId: _project_id };
}

describe('Oakpubsub', function() {

    this.slow(3000);
    this.timeout(10000);

    let pubsub;
    let topic_g;
    let subscription_g;

    // bug in gcloud library - test_message gets mutated
    let original_test_message1 = _Oakpubsub.makeMessage(['this', 'is', 'a', 'test' ], { att_key: "att_value" });
    let test_message1          = _R.clone(original_test_message1);
    let test_message1_id;

    before(async () => {

        // set global var
        pubsub = _Oakpubsub.getPubsub(get_init_options());
        _Assert(pubsub);

        topic_g = await _Oakpubsub.createTopic_P(pubsub, _topic_name);
        _Assert(topic_g);
        _Assert(topic_g.name);

        subscription_g = await _Oakpubsub.createSubscription_P(topic_g, _subscription_name, {reuseExisting: true, timeout: 10000, encoding: 'utf-8'});
        _Assert(subscription_g);
    });

    // Delete test subscription and topics
    after(() => {
        let p1 = _Oakpubsub.deleteSubsMatching_P(pubsub, `^${_subscription_name}`);
        let p2 =  _Oakpubsub.deleteTopicsMatching_P(pubsub, `^${_topic_prefix}`);

        return _Promise.all([p1,p2]);
    });

    describe('#Oakpubsub.getTopic()', function(){
        it('returns a pubsub topic', function(){
            let t2 = _Oakpubsub.getTopic(pubsub, _topic_name);
            _Assert(t2);
            _Assert(t2.id === _topic_name);
        });
    });

    describe('#Oakpubsub.getorCreateTopic()', function(){
        it('returns a pubsub topic that may have already been created', function(done){
            _Oakpubsub.getOrCreateTopic_P(pubsub, _topic_name)
            .then(function(t2) {
                _Assert(t2);
                _Assert(t2.id === _topic_name);
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });

    describe('#Oakpubsub.publish_P(), pull_P(), resetMessages(), ack_P(), and pluckAcks()', function(){
        let ack_ids;

        it('publish a message to pubsub', function(done){

            let message_ids;

            _Oakpubsub.publish_P(topic_g, test_message1)
            .then(function(message_ids) {
                _Assert(message_ids);

                _Assert(Array.isArray(message_ids));
                _Assert(message_ids.length > 0);

                test_message1_id = message_ids[0];
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });

        it('pulls messages from pubsub and resets them', function(done){

            return _Oakpubsub.pull_P(subscription_g)
            .then(function(messages) {

                _Assert(messages);

                let m = messages[0];
                ack_ids = _Oakpubsub.pluckAcks(messages);

                _Assert(ack_ids[0]);
                _Assert(m.id === test_message1_id);

                _Assert(_R.equals(m.data, original_test_message1.data));
                _Assert(_R.equals(m.attributes, original_test_message1.attributes));

                return messages;
            })
            .then((messages) => {
                let ready_for_publish = _Oakpubsub.resetMessages(messages);
                let m                 = ready_for_publish[0];
                _Assert(_R.equals(m, original_test_message1));
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });

        it('acks a message from pubsub', function(done){

            _Oakpubsub.ack_P(subscription_g, ack_ids)
            .then(function(r) {
                _Assert(r);
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });

    describe('tests workflow with more message types', function(){

        it('message data=object, no attributes', async function(){

            let original_test_message2 = _Oakpubsub.makeMessage({o: 'message has object with no attributes'});
            let test_message2          = _R.clone(original_test_message2);

            await _Oakpubsub.publish_P(topic_g, test_message2);
            let messages = await _Oakpubsub.pull_P(subscription_g);
            let message  = messages.pop();

            _Assert(_R.equals(message.data, original_test_message2.data));
            _Assert(_R.equals(message.attributes, original_test_message2.attributes));

            await _Oakpubsub.ack_P(subscription_g, message.ackId);
        });

        it('array of messages: int and string', async function(){

            let d1 =100;
            let d2 = "string";

            let message1 = _Oakpubsub.makeMessage(d1);
            let message2 = _Oakpubsub.makeMessage(d2);

            await _Oakpubsub.publish_P(topic_g, [message1, message2]);
            let messages = await _Oakpubsub.pull_P(subscription_g);

            let m_ids    = messages.map(
                (m) => {    //both test the pulled data and get the ackIds
                    _Assert(m.data === d1 || m.data === d2);
                    return m.ackId;
                }
            );
            _Assert.deepStrictEqual(messages.length, 2);

            await _Oakpubsub.ack_P(subscription_g, m_ids);
        });
    });

    describe('#Oakpubsub.processTopics_P()', function(){

        //for projects with many topics
        this.timeout(20000);
        this.slow(5000);

        it('returns multiple pubsub topics', async function(){

            let num_topics  = 11;
            let topic_names = [];

            _R.range(0, num_topics).map((i) => {
                topic_names.push(`${_topic_name}_${i}`);
            });

            await _Promise.resolve(topic_names)
            .map((topic_name) => {
                return _Oakpubsub.createTopic_P(pubsub, topic_name);
            }, {concurrency: 5});

            let regex = new RegExp(`^${_topic_name}`);

            let isTestTopic = (atopic) => {
                let t_title = atopic.name.split('/').pop();
                return t_title.match(regex);
            };

            let all_test_tops = [];

            function worker_P(topics) {
                let tts       = _R.filter(isTestTopic, topics);
                all_test_tops = all_test_tops.concat(tts);
            };

            await _Oakpubsub.processTopics_P(pubsub, worker_P, {pageSize: 10});
            _Assert(all_test_tops.length >= num_topics);
        });
    });

    describe('#Oakpubsub.processSubs_P()', function(){

        //for projects with many subscriptions
        this.timeout(20000);
        this.slow(5000);

        it('returns multiple pubsub subscriptions', async function(){

            let num_subs = 11;
            let topic_name = `${_topic_name}_foobar`;
            let subscription_names = [];

            let topic = await _Oakpubsub.createTopic_P(pubsub, topic_name);

            _R.range(0, num_subs).map((i) => {
                subscription_names.push(`${_subscription_name}_${i}`);
            });

            await _Promise.resolve(subscription_names)
            .map((name) => {
                return _Oakpubsub.createSubscription_P(topic, name);
            });

            let regex = new RegExp(`^${_subscription_name}`);

            let isTestSub = (sub) => {
                let t_sub = sub.name.split('/').pop();
                return t_sub.match(regex);
            };

            let all_test_subs = [];

            function worker_P(subs) {
                let test_subs = _R.filter(isTestSub, subs);
                all_test_subs = all_test_subs.concat(test_subs);
            };

            await _Oakpubsub.processSubs_P(pubsub, worker_P, {pageSize: 10});
            _Assert(all_test_subs.length >= num_subs);
        });
    });

});
