import _Fs from 'fs';
import _Assert from 'assert';

import _Lo from 'lodash';

import * as _Oakpubsub from '../src/oakpubsub';


function read_project_id_from_file(filename) {

    if (!_Fs.existsSync(filename)) {
        console.error('a project id is required');
        process.exit(99);
    }
    return _Fs.readFileSync(filename, {encoding: 'utf8'}).trim();
}

var _auth_filename = process.env.GCLOUD_AUTH_FILE || __dirname + '/auth-secret.json';
var _use_auth_file = _Fs.existsSync(_auth_filename);
var _project_id    = process.env.GCLOUD_PROJECT_ID || read_project_id_from_file(__dirname + '/auth-project.json');

var _topic_name        = "oakpubsub-spec-topic";
var _subscription_name = "oakpubsub-spec-subscription";

function get_init_options() {
    if (_use_auth_file) {
        return { projectId: _project_id, keyFile: _auth_filename };
    }
    return { projectId: _project_id };
}


describe('Oakpubsub', function() {

    this.slow(3000);
    this.timeout(10000);

    var pubsub;
    var topic;
    var subscription;

    //bug in gcloud library - test_message gets mutated
    var original_test_message = { data : ['this', 'is', 'a', 'test' ], attributes: { att_key: "att_value" }};
    var test_message = _Lo.clone(original_test_message);
    var test_message_id;

    after(function(done) {

        _Oakpubsub.delete_subscription(subscription)
        .then(function(r) {
            return _Oakpubsub.delete_topic(topic);
        })
        .then(function(r) {
            done();
        })
        .catch(function(e) {
            done(e);
        });
    });


    describe('#Oakpubsub.get_pubsub()', function(){
        it('authenticates and returns a pubsub object', function(){
            pubsub = _Oakpubsub.get_pubsub(get_init_options());
            _Assert(pubsub);
        });
    });

    describe('#Oakpubsub.create_topic()', function(){

        it('creates and returns a pubsub topic', function(done){
            _Oakpubsub.create_topic(pubsub, _topic_name)
            .then(function(t) {
                topic = t;
                _Assert(topic);
                _Assert(topic.projectId === _project_id);
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });


    describe('#Oakpubsub.get_topic()', function(){
        it('returns a pubsub topic', function(){
            var t2 = _Oakpubsub.get_topic(pubsub, _topic_name);
            _Assert(t2);
            _Assert(t2.projectId === _project_id);
        });
    });

    describe('#Oakpubsub.get_or_create_subscription()', function(){
        it('returns a pubsub subscription', function(done){
            _Oakpubsub.get_or_create_subscription(topic, _subscription_name)
            .then(function(s) {

                subscription = s;
                _Assert(subscription);
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });

    describe('#Oakpubsub.publish()', function(){
        it('publish a message to pubsub', function(done){

            var message_ids;

            _Oakpubsub.publish(topic, test_message)
            .then(function(response) {
                _Assert(response);
                message_ids = response[0];

                _Assert(Array.isArray(message_ids));
                _Assert(message_ids.length > 0);

                test_message_id = message_ids[0];

                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });

    describe('#Oakpubsub.pull() and ack()', function(){
        var ack_id;

        it('pulls a message from pubsub', function(done){

            _Oakpubsub.pull(subscription)
            .then(function(messages) {

                _Assert(messages);

                var m = messages[0];
                ack_id = m.ackId;

                _Assert(ack_id);
                _Assert(m.id === test_message_id);

                _Assert(_Lo.isEqual(m.data, original_test_message.data));
                _Assert(_Lo.isEqual(m.attributes, original_test_message.attributes));

                done();
            })
            .catch(function(e) {
                done(e);
            });
        });

        it('acks a message from pubsub', function(done){

            _Oakpubsub.ack(subscription, ack_id)
            .then(function(r) {
                _Assert(r);
                done();
            })
            .catch(function(e) {
                done(e);
            });
        });
    });
});
