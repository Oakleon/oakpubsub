"use strict";

import _Gcloud from 'gcloud';
import _Promise from 'bluebird';

/**
 * oakpubsub module.
 * @module oakpubsub
 */


 /**
  * Get a pubsub object, for use in subsequent module function calls
  * @param {Object} options passed directly to gcloud-node for i.e. authentication
  * @returns {Object} an authenticated pubsub object from gcloud-node
  */
export function getPubsub(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a google cloud projectId is required');
    }

    return _Gcloud.pubsub(options);
}

/**
 * Get a pubsub topic, for use in subsequent module function calls
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} topic_title - the name of the topic
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Object} an authenticated pubsub object from gcloud-node
 */
export function getTopic(pubsub, topic_title, options) {
    return pubsub.topic(topic_title, options);
}

/**
 * Remote call to create a google pubsub topic
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {string} topic_title - the name of the topic
 * @returns {Promise} resolving to [topic, apiResponse] returned by gcloud-node pubsub#createTopic()
 */
export function createTopic_P(pubsub, topic_title) {
    return _Promise.promisify(pubsub.createTopic, pubsub)(topic_title);
}

/**
 * Remote call to get or create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {string} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to the subscription returned by gcloud-node pubsub#createTopic()
 */
export function getOrCreateSubscription_P(topic, subscription_id, options) {

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
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Object} returns a subscription from gcloud-node topic#subscription()
 */
export function getSubscription(topic, subscription_id, options) {
    return topic.subscription(subscription_id, options);
}

/**
 * Remote call to create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {string} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to [subscription, apiResponse] returned by gcloud-node topic#subscribe()
 */
export function createSubscription_P(topic, subscription_id, options) {
    return _Promise.promisify(topic.subscribe, topic)(subscription_id, options);
}

/**
 * Remote call to publish a message
 * @param {Object} topic gcloud-node topic object
 * @param {(Object|Object[])} message - the message(s) to pass to gcloude-node topic#publish()
 * @returns {Promise} resolving to [messageIds, apiResponse] returned by gcloud-node topic#publish()
 */
export function publish_P(topic, message) {
    return _Promise.promisify(topic.publish, topic)(message);
}

/**
 * Remote call to delete a topic
 * @param {Object} topic gcloud-node topic object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node topic#delete()
 */
export function deleteTopic_P(topic) {
    return _Promise.promisify(topic.delete, topic)();
}

/**
 * Remote call to delete a subscription
 * @param {Object} subscription gcloud-node subscription object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#delete()
 */
export function deleteSubscription_P(subscription) {
    return _Promise.promisify(subscription.delete, subscription)();
}

/**
 * Remote call to acknowledge completion of message processing
 * @param {Object} subscription gcloud-node subscription object
 * @param {(string|string[])} acknowledge IDs
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#ack()
 */
export function ack_P(subscription, ackIds) {

    if (Array.isArray(ackIds) && !ackIds.length) {
        return _Promise.resolve();
    }
    return _Promise.promisify(subscription.ack, subscription)(ackIds);
}

/**
 * Remote call to pull messages from server
 * @param {Object} subscription gcloud-node subscription object
 * @param {Object} [options] - additional gcloud-node options for subscription#pull()
 * @returns {Promise} resolving to [messages, apiResponse] returned by gcloud-node subscription#pull()
 */
export function pull_P(subscription, options) {
    options = options || {};
    return _Promise.promisify(subscription.pull, subscription)(options);
}
