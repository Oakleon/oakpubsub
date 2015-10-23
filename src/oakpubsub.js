"use strict";

var _Gcloud  = require('gcloud');
var _Promise = require('bluebird');

var Oakpubsub = {};

Oakpubsub.get_pubsub = function get_pubsub(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a pubsub projectId is required');
    }

    return _Gcloud.pubsub(options);
}

Oakpubsub.get_topic = function get_topic(pubsub, topic_title, options) {
    return pubsub.topic(topic_title, options);
}

Oakpubsub.create_topic = function create_topic(pubsub, topic_title) {

    var f = function(resolve, reject) {

        var onComplete = function(error, topic, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve(topic);
        }
        pubsub.createTopic(topic_title, onComplete);
    }
    return new _Promise(f);
}

Oakpubsub.get_or_create_subscription = function get_or_create_subscription(topic, subscription_id, options) {

    return Oakpubsub.create_subscription(topic, subscription_id, options)
    .catch(function(error) {

        if (!error.code || error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return topic.subscription(subscription_id, options);
    })
}

Oakpubsub.create_subscription = function create_subscription(topic, subscription_id, options) {

    var f = function(resolve, reject) {
        topic.subscribe(subscription_id, options, function(err, subscription) {
            if (err) {
                return reject(err);
            }
            resolve (subscription);
        })
    }
    return new _Promise(f);
}

Oakpubsub.publish = function publish(topic, message) {

    var f = function(resolve, reject) {

        var onComplete = function(error, messageIds, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve([messageIds, apiResponse]);
        }
        topic.publish(message, onComplete);
    }
    return new _Promise(f);
}

Oakpubsub.delete_topic = function delete_topic(topic) {


    var f = function(resolve, reject) {

        var onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }

            resolve(apiResponse);
        }

        topic.delete(onComplete);
    }
    return new _Promise(f);
}

Oakpubsub.delete_subscription = function delete_subscription(subscription) {


    var f = function(resolve, reject) {

        var onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }

            resolve(apiResponse);
        }

        subscription.delete(onComplete);
    }
    return new _Promise(f);
}

//ackIds may be a single string or Array of strings
Oakpubsub.ack = function ack(subscription, ackIds) {

    var f = function(resolve, reject) {

        var onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve(apiResponse);
        }

        if (Array.isArray(ackIds) && !ackIds.length) {
            return resolve();
        }

        return subscription.ack(ackIds, onComplete);
    }
    return new _Promise(f);
}

Oakpubsub.pull = function pull(subscription, options) {

    options = options || {};

    var f = function(resolve, reject) {

        var onComplete = function(err, messages, apiResponse) {

            if (err) {
                return reject(err);
            }
            return resolve(messages);
        }
        subscription.pull(options, onComplete);
    }
    return new _Promise(f);
}

module.exports = Oakpubsub;
