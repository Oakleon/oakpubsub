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
export function get_pubsub(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a google cloud projectId is required');
    }

    return _Gcloud.pubsub(options);
}

/**
 * Get a pubsub topic, for use in subsequent module function calls
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {Object} topic_title - the name of the topic
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Object} an authenticated pubsub object from gcloud-node
 */
export function get_topic(pubsub, topic_title, options) {
    return pubsub.topic(topic_title, options);
}

/**
 * Remote call to create a google pubsub topic
 * @param {Object} pubsub gcloud-node pubsub object
 * @param {Object} topic_title - the name of the topic
 * @returns {Promise} resolving to the topic returned by gcloud-node pubsub#createTopic()
 */
export function create_topic_P(pubsub, topic_title) {

    let f = function(resolve, reject) {

        let onComplete = function(error, topic, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve(topic);
        };
        pubsub.createTopic(topic_title, onComplete);
    };
    return new _Promise(f);
}

/**
 * Remote call to get or create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {Object} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to the subscription returned by gcloud-node pubsub#createTopic()
 */
export function get_or_create_subscription_P(topic, subscription_id, options) {

    return create_subscription_P(topic, subscription_id, options)
    .catch(function(error) {

        if (!error.code || error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return get_subscription(topic, subscription_id, options);
    });
}

/**
 * Gets a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {Object} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Object} returns a subscription from gcloud-node topic#subscription()
 */
export function get_subscription(topic, subscription_id, options) {
    return topic.subscription(subscription_id, options);
}

/**
 * Remote call to create a subscription
 * @param {Object} topic gcloud-node topic object
 * @param {Object} subscription_id - the name of the subscription
 * @param {Object} [options] - additional gcloud-node options
 * @returns {Promise} resolving to the subscription returned by gcloud-node topic#subscribe()
 */
export function create_subscription_P(topic, subscription_id, options) {

    let f = function(resolve, reject) {
        topic.subscribe(subscription_id, options, function(err, subscription) {
            if (err) {
                return reject(err);
            }
            resolve (subscription);
        });
    };
    return new _Promise(f);
}

/**
 * Remote call to publish a message
 * @param {Object} topic gcloud-node topic object
 * @param {Object} message - the message to pass to gcloude-node topic#publish()
 * @returns {Promise} resolving to [messageIds, apiResponse] returned by gcloud-node topic#publish()
 */
export function publish_P(topic, message) {

    let f = function(resolve, reject) {

        let onComplete = function(error, messageIds, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve([messageIds, apiResponse]);
        };
        topic.publish(message, onComplete);
    };
    return new _Promise(f);
}

/**
 * Remote call to delete a topic
 * @param {Object} topic gcloud-node topic object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node topic#delete()
 */
export function delete_topic_P(topic) {

    let f = function(resolve, reject) {

        let onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }

            resolve(apiResponse);
        };

        topic.delete(onComplete);
    };
    return new _Promise(f);
}

/**
 * Remote call to delete a subscription
 * @param {Object} subscription gcloud-node subscription object
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#delete()
 */
export function delete_subscription_P(subscription) {

    let f = function(resolve, reject) {

        let onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }

            resolve(apiResponse);
        };

        subscription.delete(onComplete);
    };
    return new _Promise(f);
}

/**
 * Remote call to acknowledge completion of message processing
 * @param {Object} subscription gcloud-node subscription object
 * @param {(string|string[])} acknowledge IDs
 * @returns {Promise} resolving to apiResponse returned by gcloud-node subscription#ack()
 */
export function ack_P(subscription, ackIds) {

    let f = function(resolve, reject) {

        let onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve(apiResponse);
        };

        if (Array.isArray(ackIds) && !ackIds.length) {
            return resolve();
        }

        return subscription.ack(ackIds, onComplete);
    };
    return new _Promise(f);
}

/**
 * Remote call to pull messages from server
 * @param {Object} subscription gcloud-node subscription object
 * @param {Object} [options] - additional gcloud-node options for subscription#pull()
 * @returns {Promise} resolving to messages returned by gcloud-node subscription#pull()
 */
export function pull_P(subscription, options) {

    options = options || {};

    let f = function(resolve, reject) {

        let onComplete = function(err, messages, apiResponse) {

            if (err) {
                return reject(err);
            }
            return resolve(messages);
        };
        subscription.pull(options, onComplete);
    };
    return new _Promise(f);
}
