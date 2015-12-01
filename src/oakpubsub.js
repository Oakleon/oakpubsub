"use strict";

import _Arrify from 'arrify';
import _Gcloud from 'gcloud';
import _Promise from 'bluebird';
import _Ram from 'ramda';

//workaround for errors not propagating from async await
process.on('unhandledRejection', err => { throw err; });

/**
 * oakpubsub module.
 * @module oakpubsub
**/

 /**
  * Get a pubsub object, for use in subsequent module function calls
  * @param {Object} options passed directly to gcloud-node for i.e. authentication
  * @returns {Object} an authenticated pubsub object from gcloud-node
 **/
export function getPubsub(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a google cloud projectId is required');
    }

    return _Gcloud.pubsub(options);
}

/**
 * Remote call to create a google pubsub topic
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} topic_title - the name of the topic
 * @returns {Promise} resolving to topic returned by gcloud-node pubsub#createTopic()
**/
export function createTopic_P(pubsub, topic_title) {
    return _Promise.promisify(pubsub.createTopic, {context: pubsub})(topic_title);
}

/**
 * Get a pubsub topic, for use in subsequent module function calls
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} topic_title - the name of the topic
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Object} topic returned by gcloud-node pubsub#topic()
**/
export function getTopic(pubsub, topic_title, options) {
    return pubsub.topic(topic_title, options);
}

/**
 * Remote call to get or create a topic
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} topic_title - the name of the topic
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to the topic returned by gcloud-node pubsub#createTopic()
**/
export function getOrCreateTopic_P(pubsub, topic_title, options) {

    return createTopic_P(pubsub, topic_title, options)
    .catch(function(error) {
        if (!error.code || error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return getTopic(pubsub, topic_title, options);
    });
}

/**
 * Remote call to get or create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {string} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to the subscription returned by gcloud-node pubsub#createTopic()
**/
export function getOrCreateSubscription_P(topic, subscription_id, options) {

    console.log('deprecated: getOrCreateSubscription_P() - use createSubscription_P() with reuseExisting option');

    return createSubscription_P(topic, subscription_id, options)
    .catch(function(error) {

        if (!error.code || error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return getSubscription(topic, subscription_id, options);
    });
}

/**
 * Gets a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {string} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options: autoAck and interval
 * @returns {Object} returns a subscription from gcloud-node topic#subscription()
**/
export function getSubscription(topic, subscription_id, options) {
    return topic.subscription(subscription_id, options);
}

/**
 * Remote call to create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {string} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options: ackDeadlineSeconds, autoAck, interval, reuseExisting
 * @returns {Promise} resolving to subscription returned by gcloud-node topic#subscribe()
**/
export function createSubscription_P(topic, subscription_id, options) {
    return _Promise.promisify(topic.subscribe, {context: topic})(subscription_id, options);
}

/**
 * Remote call to publish a message
 * @param {Object} topic gcloud-node topic object
 * @param {(Object|Object[])} messages - the message(s) to pass to gcloude-node topic#publish()
 * @returns {Promise} resolving to array of message ids returned by gcloud-node topic#publish()
**/
export function publish_P(topic, messages) {
    return _Promise.promisify(topic.publish, {context: topic})(messages);
}

/**
 * Remote call to delete a topic
 * @param {Object} topic gcloud-node topic object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node topic#delete()
**/
export function deleteTopic_P(topic) {
    return _Promise.promisify(topic.delete, {context: topic})();
}

/**
 * Remote call to delete a subscription
 * @param {Object} subscription gcloud-node subscription object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#delete()
**/
export function deleteSubscription_P(subscription) {
    return _Promise.promisify(subscription.delete, {context: subscription})();
}

/**
 * Remote call to acknowledge completion of message processing
 * @param {Object} subscription gcloud-node subscription object
 * @param {(string|string[])} acknowledge IDs
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#ack()
**/
export function ack_P(subscription, ackIds) {

    if (Array.isArray(ackIds) && !ackIds.length) {
        return _Promise.resolve();
    }
    return _Promise.promisify(subscription.ack, {context: subscription})(ackIds);
}

/**
 * Remote call to pull messages from server
 * @param {Object} subscription gcloud-node subscription object
 * @param {Object} [options] - additional gcloud-node options for subscription#pull()
 * @returns {Promise} resolving to array of messages returned by gcloud-node subscription#pull()
**/
export function pull_P(subscription, options = {}) {
    return _Promise.promisify(subscription.pull, {context: subscription})(options);
}

/**
 * Utility to create a message object
 * @param {(string|number|array|Object)} data to publish (gcloud-node will JSON encode/decode for you)
 * @param {Object} [attributes] - additional key-value attributes attached to the message
 * @returns {Object} message object that can be used in publish_P()
**/
export function makeMessage(data, attributes = undefined) {
    return {data, attributes};
}

/**
 * Utility to pluck ackIds from messages
 * @param {(Object|Object[])} message or messages returned by pull_P()
 * @returns {string[]} array of ackIds, can be passed to ack_P()
**/
export function pluckAcks(messages) {
    messages = _Arrify(messages);
    return _Ram.pluck('ackId')(messages);
}

/**
 * Utility to create an array of message objects from previously pulled messages, useful for pubsub message passing
 * @param {Object[]} messages returned by pull_P()
 * @returns {Object[]} messages that can be used in publish_P()
**/
export function resetMessages(messages) {
    messages = _Arrify(messages);
    return messages.map(resetMessage);
}

/**
 * Utility to create a publishable message object from a previously pulled message
 * @param {Object} message returned by pull_P()
 * @returns {Object} message object that can be used in publish_P()
**/
export function resetMessage(message) {
    return {data: message.data, attributes: message.attributes};
}

/**
 * Helper to get multiple pubsub topics and process them asynchronously
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {(Promise|function)} worker_P - a function or promise processing each array of topics
 * @param {Object} [query_options] - additional gcloud-node pubsub query options for pubsub.getTopics()
 * @returns {Promise} resolving to the final apiResponse
**/
export function processTopics_P(pubsub, worker_P, query_options = {}) {

    query_options.autoPaginate = false;

    let fun = function(resolve, reject) {

        async function onComplete(error, topics, nextQuery, apiResponse) {

            if (error) {
                return reject(error);
            }

            await worker_P(topics);

            if (!nextQuery) {
                return resolve(apiResponse);
            }
            pubsub.getTopics(nextQuery, onComplete);
        };
        pubsub.getTopics(query_options, onComplete);
    };

    return new _Promise(fun);
}

/**
 * Helper to get multiple pubsub subscriptions and process them asynchronously
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {(Promise|function)} worker_P - a function or promise processing each array of subscriptions
 * @param {Object} [query_options] - additional gcloud-node pubsub query options for pubsub.getSubscriptions()
 * @returns {Promise} resolving to the final apiResponse
**/
export function processSubs_P(pubsub, worker_P, query_options = {}) {

    query_options.autoPaginate = false;

    let fun = function(resolve, reject) {

        async function onComplete(error, subscriptions, nextQuery, apiResponse) {

            if (error) {
                return reject(error);
            }

            await worker_P(subscriptions);

            if (!nextQuery) {
                return resolve(apiResponse);
            }
            pubsub.getSubscriptions(nextQuery, onComplete);
        };
        pubsub.getSubscriptions(query_options, onComplete);
    };

    return new _Promise(fun);
}

/**
 * Helper to get delete pubsub topics matching a regular expression, using processTopics_P and deleteTopic_P
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} regex javascript regular expression in string format, e.g. '^match_me'
 * @param {integer} [page_size] number of topics to fetch per response (default: 100)
 * @param {integer} [concurrency] max number of topics to delete simultaneously (default: 5)
 * @returns {Promise} resolving to the final apiResponse
**/
export function deleteTopicsMatching_P(pubsub, regex, page_size = 100, concurrency = 5) {

    if (typeof(regex) !== 'string') {
        throw TypeError("regex must be a string");
    }

    regex = new RegExp(regex);

    function isTopicMatching(topic) {
        let t_title = topic.name.split('/').pop();
        return t_title.match(regex);
    }

    function delete_P(alltopics) {

        let del_topics = _Ram.filter(isTopicMatching, alltopics);

        return _Promise.resolve(del_topics)
            .map((topic) => {
                return deleteTopic_P(topic);
            }, {concurrency});
    };

    return processTopics_P(pubsub, delete_P, {pageSize: page_size});
}

/**
 * Helper to get delete pubsub subscriptions matching a regular expression, using processSubs_P and deleteSubscription_P
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} regex javascript regular expression matching subscription name in string format, e.g. '^match_me'
 * @param {integer} [page_size] number of subscriptions to fetch per response (default: 100)
 * @param {integer} [concurrency] max number of subscriptions to delete simultaneously (default: 5)
 * @returns {Promise} resolving to the final apiResponse
**/
export function deleteSubsMatching_P(pubsub, regex, page_size = 100, concurrency = 5) {

    if (typeof(regex) !== 'string') {
        throw TypeError("regex must be a string");
    }

    regex = new RegExp(regex);

    function isSubscriptionMatching(subscription) {
        let s_name = subscription.name.split('/').pop();
        return s_name.match(regex);
    }

    function delete_P(allsubs) {

        let del_subs = _Ram.filter(isSubscriptionMatching, allsubs);

        return _Promise.resolve(del_subs)
            .map((sub) => {
                return deleteSubscription_P(sub);
            }, {concurrency});
    };

    return processSubs_P(pubsub, delete_P, {pageSize: page_size});
}
