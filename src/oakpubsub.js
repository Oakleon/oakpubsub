"use strict";

var _Promise = require('bluebird');

var Oakpubsub = {};

Oakpubsub.init = function init(options) {

    Oakpubsub.gcloud = require('gcloud')({
      projectId: options.id,
      keyFilename: options.keyfile //TODO allow GCE scopes
    });

    Oakpubsub.pubsub = Oakpubsub.gcloud.pubsub();
}

Oakpubsub.getTopic = function getTopic(topic_title, options) {
    return Oakpubsub.pubsub.topic(topic_title, options);
}

Oakpubsub.ReallyPubSubscribe = function ReallyPubSubscribe(topic, subscription_id) {

    return Oakpubsub.CreateSubscription(topic, subscription_id)
    .catch(function(error) {

        if (error.code !== 409) {   //409: Resource already exists in the project
            throw error;
        }
        return topic.subscription(subscription_id);
    })
}

Oakpubsub.CreateSubscription = function CreateSubscription(topic, subscription_id) {

    var f = function(resolve, reject) {
        topic.subscribe(subscription_id, function(err, subscription) {
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

//ackIds may be a single string or Array of strings
Oakpubsub.ack = function ack(subscription, ackIds) {

    var f = function(resolve, reject) {

        var onComplete = function(error, apiResponse) {

            if (error) {
                return reject(error);
            }
            resolve(apiResponse);
        }
        subscription.ack(ackIds, onComplete);
    }
    return new _Promise(f);
}

module.exports = Oakpubsub;