"use strict";

import _Gcloud from 'gcloud';
import _Promise from 'bluebird';


export function get_pubsub(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a pubsub projectId is required');
    }

    return _Gcloud.pubsub(options);
}

export function get_topic(pubsub, topic_title, options) {
    return pubsub.topic(topic_title, options);
}

export function create_topic(pubsub, topic_title) {

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

export function get_or_create_subscription(topic, subscription_id, options) {

    return create_subscription(topic, subscription_id, options)
    .catch(function(error) {

        if (!error.code || error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return topic.subscription(subscription_id, options);
    });
}

export function create_subscription(topic, subscription_id, options) {

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

export function publish(topic, message) {

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

export function delete_topic(topic) {

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

export function delete_subscription(subscription) {

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

//ackIds may be a single string or Array of strings
export function ack(subscription, ackIds) {

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

export function pull(subscription, options) {

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
