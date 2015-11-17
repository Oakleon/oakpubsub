# oakpubsub
A partial [gcloud-node](https://github.com/GoogleCloudPlatform/gcloud-node) (google cloud) pubsub wrapper with bluebird promises, in functional style. Only does minimally what we need, no guarantees expressed or implied. Pull Requests for expanded functions/features are welcome.

See tests for usage.

Use care when doing mass deletes of topics or subscriptions, an incorrect regular expression could destroy data. It would be nice if google pubsub supported namespaces to avoid potential clobbering.

Tested with node v4 LTS

## API Reference
oakpubsub module.


* [oakpubsub](#module_oakpubsub)
  * [~getPubsub(options)](#module_oakpubsub..getPubsub) ⇒ <code>Object</code>
  * [~createTopic_P(pubsub, topic_title)](#module_oakpubsub..createTopic_P) ⇒ <code>Promise</code>
  * [~getTopic(pubsub, topic_title, [options])](#module_oakpubsub..getTopic) ⇒ <code>Object</code>
  * [~getOrCreateTopic_P(pubsub, topic_title, [options])](#module_oakpubsub..getOrCreateTopic_P) ⇒ <code>Promise</code>
  * [~getOrCreateSubscription_P(topic, subscription_id, [options])](#module_oakpubsub..getOrCreateSubscription_P) ⇒ <code>Promise</code>
  * [~getSubscription(topic, subscription_id, [options])](#module_oakpubsub..getSubscription) ⇒ <code>Object</code>
  * [~createSubscription_P(topic, subscription_id, [options])](#module_oakpubsub..createSubscription_P) ⇒ <code>Promise</code>
  * [~publish_P(topic, messages)](#module_oakpubsub..publish_P) ⇒ <code>Promise</code>
  * [~deleteTopic_P(topic)](#module_oakpubsub..deleteTopic_P) ⇒ <code>Promise</code>
  * [~deleteSubscription_P(subscription)](#module_oakpubsub..deleteSubscription_P) ⇒ <code>Promise</code>
  * [~ack_P(subscription, acknowledge)](#module_oakpubsub..ack_P) ⇒ <code>Promise</code>
  * [~pull_P(subscription, [options])](#module_oakpubsub..pull_P) ⇒ <code>Promise</code>
  * [~makeMessage(data, [attributes])](#module_oakpubsub..makeMessage) ⇒ <code>Object</code>
  * [~processTopics_P(pubsub, worker_P, [query_options])](#module_oakpubsub..processTopics_P) ⇒ <code>Promise</code>
  * [~processSubs_P(pubsub, worker_P, [query_options])](#module_oakpubsub..processSubs_P) ⇒ <code>Promise</code>
  * [~deleteTopicsMatching_P(pubsub, regex, [page_size], [concurrency])](#module_oakpubsub..deleteTopicsMatching_P) ⇒ <code>Promise</code>
  * [~deleteSubsMatching_P(pubsub, regex, [page_size], [concurrency])](#module_oakpubsub..deleteSubsMatching_P) ⇒ <code>Promise</code>

<a name="module_oakpubsub..getPubsub"></a>
### oakpubsub~getPubsub(options) ⇒ <code>Object</code>
Get a pubsub object, for use in subsequent module function calls

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - an authenticated pubsub object from gcloud-node  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | passed directly to gcloud-node for i.e. authentication |

<a name="module_oakpubsub..createTopic_P"></a>
### oakpubsub~createTopic_P(pubsub, topic_title) ⇒ <code>Promise</code>
Remote call to create a google pubsub topic

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to topic returned by gcloud-node pubsub#createTopic()  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| topic_title | <code>string</code> | the name of the topic |

<a name="module_oakpubsub..getTopic"></a>
### oakpubsub~getTopic(pubsub, topic_title, [options]) ⇒ <code>Object</code>
Get a pubsub topic, for use in subsequent module function calls

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - topic returned by gcloud-node pubsub#topic()  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| topic_title | <code>string</code> | the name of the topic |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub..getOrCreateTopic_P"></a>
### oakpubsub~getOrCreateTopic_P(pubsub, topic_title, [options]) ⇒ <code>Promise</code>
Remote call to get or create a topic

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the topic returned by gcloud-node pubsub#createTopic()  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| topic_title | <code>string</code> | the name of the topic |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub..getOrCreateSubscription_P"></a>
### oakpubsub~getOrCreateSubscription_P(topic, subscription_id, [options]) ⇒ <code>Promise</code>
Remote call to get or create a subscription

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the subscription returned by gcloud-node pubsub#createTopic()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>string</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options |

<a name="module_oakpubsub..getSubscription"></a>
### oakpubsub~getSubscription(topic, subscription_id, [options]) ⇒ <code>Object</code>
Gets a subscription

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - returns a subscription from gcloud-node topic#subscription()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>string</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options: autoAck and interval |

<a name="module_oakpubsub..createSubscription_P"></a>
### oakpubsub~createSubscription_P(topic, subscription_id, [options]) ⇒ <code>Promise</code>
Remote call to create a subscription

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to subscription returned by gcloud-node topic#subscribe()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| subscription_id | <code>string</code> | the name of the subscription |
| [options] | <code>Object</code> | additional gcloud-node options: ackDeadlineSeconds, autoAck, interval, reuseExisting |

<a name="module_oakpubsub..publish_P"></a>
### oakpubsub~publish_P(topic, messages) ⇒ <code>Promise</code>
Remote call to publish a message

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to array of message ids returned by gcloud-node topic#publish()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |
| messages | <code>Object</code> &#124; <code>Array.&lt;Object&gt;</code> | the message(s) to pass to gcloude-node topic#publish() |

<a name="module_oakpubsub..deleteTopic_P"></a>
### oakpubsub~deleteTopic_P(topic) ⇒ <code>Promise</code>
Remote call to delete a topic

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse returned by gcloud-node topic#delete()  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>Object</code> | gcloud-node topic object |

<a name="module_oakpubsub..deleteSubscription_P"></a>
### oakpubsub~deleteSubscription_P(subscription) ⇒ <code>Promise</code>
Remote call to delete a subscription

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse returned by gcloud-node subscription#delete()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |

<a name="module_oakpubsub..ack_P"></a>
### oakpubsub~ack_P(subscription, acknowledge) ⇒ <code>Promise</code>
Remote call to acknowledge completion of message processing

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse returned by gcloud-node subscription#ack()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |
| acknowledge | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | IDs |

<a name="module_oakpubsub..pull_P"></a>
### oakpubsub~pull_P(subscription, [options]) ⇒ <code>Promise</code>
Remote call to pull messages from server

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to array of messages returned by gcloud-node subscription#pull()  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | gcloud-node subscription object |
| [options] | <code>Object</code> | additional gcloud-node options for subscription#pull() |

<a name="module_oakpubsub..makeMessage"></a>
### oakpubsub~makeMessage(data, [attributes]) ⇒ <code>Object</code>
Utility to create a message object

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Object</code> - message object that can be used in publish_P()  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> &#124; <code>number</code> &#124; <code>array</code> &#124; <code>Object</code> | to publish (gcloud-node will JSON encode/decode for you) |
| [attributes] | <code>Object</code> | additional key-value attributes attached to the message |

<a name="module_oakpubsub..processTopics_P"></a>
### oakpubsub~processTopics_P(pubsub, worker_P, [query_options]) ⇒ <code>Promise</code>
Helper to get multiple pubsub topics and process them asynchronously

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the final apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| worker_P | <code>Promise</code> &#124; <code>function</code> | a function or promise processing each array of topics |
| [query_options] | <code>Object</code> | additional gcloud-node pubsub query options |

<a name="module_oakpubsub..processSubs_P"></a>
### oakpubsub~processSubs_P(pubsub, worker_P, [query_options]) ⇒ <code>Promise</code>
Helper to get multiple pubsub subscriptions and process them asynchronously

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the final apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| worker_P | <code>Promise</code> &#124; <code>function</code> | a function or promise processing each array of subscriptions |
| [query_options] | <code>Object</code> | additional gcloud-node pubsub query options |

<a name="module_oakpubsub..deleteTopicsMatching_P"></a>
### oakpubsub~deleteTopicsMatching_P(pubsub, regex, [page_size], [concurrency]) ⇒ <code>Promise</code>
Helper to get delete pubsub topics matching a regular expression, using processTopics_P and deleteTopic_P

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the final apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| regex | <code>string</code> | javascript regular expression in string format, e.g. '^match_me' |
| [page_size] | <code>integer</code> | number of topics to fetch per response (default: 100) |
| [concurrency] | <code>integer</code> | max number of topics to delete simultaneously (default: 5) |

<a name="module_oakpubsub..deleteSubsMatching_P"></a>
### oakpubsub~deleteSubsMatching_P(pubsub, regex, [page_size], [concurrency]) ⇒ <code>Promise</code>
Helper to get delete pubsub subscriptions matching a regular expression, using processSubs_P and deleteSubscription_P

**Kind**: inner method of <code>[oakpubsub](#module_oakpubsub)</code>  
**Returns**: <code>Promise</code> - resolving to the final apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| pubsub | <code>Object</code> | gcloud-node pubsub object |
| regex | <code>string</code> | javascript regular expression matching subscription name in string format, e.g. '^match_me' |
| [page_size] | <code>integer</code> | number of subscriptions to fetch per response (default: 100) |
| [concurrency] | <code>integer</code> | max number of subscriptions to delete simultaneously (default: 5) |


## Update Docs
```
jsdoc2md --template doc/README.hbs build/oakpubsub.js  > README.md
```

Perhaps this would be helpful:
```
npm install -g jsdoc-to-markdown
```

## Development

Either use the atom babel package, or use gulp and babel to transpile from src to build.

### Test

`npm test`
or
`npm run testwatch`
or
`npm test -- watch`


### Atom Setup Tips

Use of the atom editor is not required. But if you choose to use atom here are some tips.

#### Install Atom Packages
`apm install linter linter-eslint language-babel editorconfig`

#### linter Settings
* Uncheck `Lint on fly`

#### linter-eslint Settings
* check `Disable When NoEslintrc File In Path`
* uncheck `Use Global Eslint` (unchecking seems to be necessary in order to use es2016)

#### language-babel Settings
* check `Transpile On Save`
* `src` in `Babel Source Path`
* `build` in `Babel Transpile Path`
* put `runtime` in `Optional Transformers`
