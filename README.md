# oakpubsub
A partial [gcloud-node](https://github.com/GoogleCloudPlatform/gcloud-node) (google cloud) pubsub wrapper with bluebird promises. Only does minimally what we need, no guarantees expressed or implied. Pull Requests for expanded functions/features are welcome.

# API Reference
oakpubsub module.


* [oakpubsub](#module_oakpubsub)
  * [.get_pubsub(options)](#module_oakpubsub.get_pubsub) ⇒ <code>Object</code>
  * [.get_topic(pubsub, topic_title, [options])](#module_oakpubsub.get_topic) ⇒ <code>Object</code>
  * [.create_topic_P(pubsub, topic_title)](#module_oakpubsub.create_topic_P) ⇒ <code>Object</code>
  * [.get_or_create_subscription_P(topic, subscription_id, [options])](#module_oakpubsub.get_or_create_subscription_P) ⇒ <code>Object</code>
  * [.get_subscription(topic, subscription_id, [options])](#module_oakpubsub.get_subscription) ⇒ <code>Object</code>
  * [.create_subscription_P(topic, subscription_id, [options])](#module_oakpubsub.create_subscription_P) ⇒ <code>Object</code>
  * [.publish_P(topic, message)](#module_oakpubsub.publish_P) ⇒ <code>Object</code>
  * [.delete_topic_P(topic)](#module_oakpubsub.delete_topic_P) ⇒ <code>Object</code>
  * [.delete_subscription_P(subscription)](#module_oakpubsub.delete_subscription_P) ⇒ <code>Object</code>
  * [.ack_P(subscription, acknowledge)](#module_oakpubsub.ack_P) ⇒ <code>Object</code>
  * [.pull_P(subscription, [options])](#module_oakpubsub.pull_P) ⇒ <code>Object</code>

<a name="module_oakpubsub.get_pubsub"></a>
### oakpubsub.get_pubsub(options) ⇒ <code>Object</code>
Get a pubsub object, for use in subsequent module function calls

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - an authenticated pubsub object from gcloud-node  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | passed directly to gcloud-node for i.e. authentication |

<a name="module_oakpubsub.get_topic"></a>
### oakpubsub.get_topic(pubsub, topic_title, [options]) ⇒ <code>Object</code>
Get a pubsub topic, for use in subsequent module function calls

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - an authenticated pubsub object from gcloud-node  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| topic_title | <code>Object</code> | the name of the topic |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub.create_topic_P"></a>
### oakpubsub.create_topic_P(pubsub, topic_title) ⇒ <code>Object</code>
Remote call to create a google pubsub topic

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to the topic returned by gcloud-node pubsub#createTopic()  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| topic_title | <code>Object</code> | the name of the topic |

<a name="module_oakpubsub.get_or_create_subscription_P"></a>
### oakpubsub.get_or_create_subscription_P(topic, subscription_id, [options]) ⇒ <code>Object</code>
Remote call to get or create a subscription

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to the subscription returned by gcloud-node pubsub#createTopic()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>Object</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub.get_subscription"></a>
### oakpubsub.get_subscription(topic, subscription_id, [options]) ⇒ <code>Object</code>
Gets a subscription

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - returns a subscription from gcloud-node topic#subscription()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>Object</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub.create_subscription_P"></a>
### oakpubsub.create_subscription_P(topic, subscription_id, [options]) ⇒ <code>Object</code>
Remote call to create a subscription

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to the subscription returned by gcloud-node topic#subscribe()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>Object</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub.publish_P"></a>
### oakpubsub.publish_P(topic, message) ⇒ <code>Object</code>
Remote call to publish a message

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to [messageIds, apiResponse] returned by gcloud-node topic#publish()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| message | <code>Object</code> | the message to pass to gcloude-node topic#publish() |

<a name="module_oakpubsub.delete_topic_P"></a>
### oakpubsub.delete_topic_P(topic) ⇒ <code>Object</code>
Remote call to delete a topic

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to apiResponse returned by gcloud-node topic#delete()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |

<a name="module_oakpubsub.delete_subscription_P"></a>
### oakpubsub.delete_subscription_P(subscription) ⇒ <code>Object</code>
Remote call to delete a subscription

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to apiResponse returned by gcloud-node subscription#delete()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |

<a name="module_oakpubsub.ack_P"></a>
### oakpubsub.ack_P(subscription, acknowledge) ⇒ <code>Object</code>
Remote call to acknowledge completion of message processing

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to apiResponse returned by gcloud-node subscription#ack()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |
| acknowledge | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | IDs |

<a name="module_oakpubsub.pull_P"></a>
### oakpubsub.pull_P(subscription, [options]) ⇒ <code>Object</code>
Remote call to pull messages from server

**Kind**: static method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - a promise resolving to messages returned by gcloud-node subscription#pull()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |
| [options] | <code>Object</code> | additional gcloud-node options for subscription#pull() |


# Update Docs
```
jsdoc2md --template doc/README.hbs src/oakpubsub.js  > README.md
```

Perhaps this first means you have to:
```
npm install -g jsdoc-to-markdown
```
