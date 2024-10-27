# Live shopping streaming application

I assume we are fine with `almost` realtime video streaming experience, which means we can afford several seconds of delay for a sake of scalability.

I also assume we are going to design a distributed system, to be able to scale horizontally.



Requirements:
# Scalability -  the system should support large number of concurrent users for:

### `Consuming video` 
The requirement should be met due to CDN distribution of video content. I assume, for 1 session, there will 1 streamer (host), which produces the video content. This stream should be consumed by some media server. We can use Red5 or Wowza Streaming Engine (I don't have much experience with video streaming, so I rely on articles in the web).

The purpose of the media server is to:
    - receive a video stream,
    - split it into small chunks,
    - transcode it to a series of different quality copies of video
    - upload them to some scalable storage
Next, these chunks of video content will be available to customers via CDN, which ensures scalability and low delay

### `Placing orders`
We expect our customers to place orders on our products during a streaming session. 
To satisfy our customers' needs, we should provide an API to serve their requests, specifically - the ones to place their orders. We expect high frequency and amount of this request.

To sustain this load, our `Application Servers` should be present in several instances (copies). 

To distribute load across all available instances we should put them behind a load balancer. Fleet of application servers should be monitored, at least for vital stats like CPU\Disk\Memory\Network, and adjusted accordingly (scale up or down)
   
At this point simple placing a lot of orders should not be a problem;

# Real-Time inventory management:
Because of possible fewer amount of product items available, than the amount of customers, we should provide users with a fair information regarding availability of products.

I assume we cannot afford to query Products DB each moment of time, so we need some trade-off here.


Whenever availability of the products changes, we can emit event-notification, which should be propagated across our system.
Subscribers of this event will react accordingly.

I'd emit an event with a payload, representing an availability of a specific product.
This event should be handled by a consumer, which will put\update this data in cache.

To deliver new availability to our clients, we can use WebSockets. Client applications (web,mobile, whatever) should stay connected to a websocket gateway, during the whole session of a streaming event.

We might need several `websocket gateway` instances to be able to keep connection with `each` user present.

To trigger this availability for several WS gateways I also would use Pub\Sub. WS gateways are intended to read current availability from cache, and push it our end-users' client apps.

# Fairness Mechanism
To handle high amount of requests from users we are going to use a group of application servers. Each instance is able to place an order.

To process these orders in fair way, we have 2 options:
- use traditional queue service, with a single consumer instance - this will ensure orders are processed in FIFO order. But this is not scalable approach, which will result in slow processing, and eventually growing amount of unprocessed orders. So this option is not a fit
- use streams (like Kafka). With correct events (orders) distribution, we can organize concurrent processing of all orders, but also keep the processing sequential for the same product. We have to properly select partion-key, which in our case probably will be `productId`

The approach with streams also solves inventory hogging issue, because possible huge chunk of same orders will be processed by its own consumer, without blocking other consumers. It highly depends on amount of topic-partitions, and there is still a chance some products will be "blocked" by others. In this case, orders will be processed in FIFO, which is also kind of fair.

To prevent hogging by a few users, we can adjust partition key, making it, for example `userId`, which will result in sequential processing of orders created by the same user.

And also - `rate limiting` of course, which can be handled by `ApiGateway`

# Technologies & Frameworks

It highly depends on team setup and maturity of project.

My general recommendations are:
- application servers, websocket gateways, workers, consumers
    - can be implement in most of modern languages. Just let the team choose according to their skills. Most languages provides the same set of features. Even if something becomes extremely required from another ecosystem, you can always implement this specific feature in that other language, due to distributed system approach.

    - we should consider pros & cons of serverless (lambda\cloud functions), because of their price advantage

    - due to expected high amount of IO operations (placing orders, viewing products, etc) it is good choice to use asynchronous runtime (Nodejs, async Python, GO, etc)

- Client applications
    - Same as application servers - check your team's setup, and pick the required stack. I suppose any modern UI framework (React\Angular\Vue) will fit greatly. I'm not familiar with mobile app ecosystems, but it is still a client app. Just stick to a mature ecosystem

- Infrastructure dependencies - `Api Gateway, CDN, LoadBalancer, file storage, autoscaling groups`
    - I would pick services provided by a cloud provider. For example - `AWS Api Gateway, Cloudfront, ALB, S3`. Other cloud providers has similar services. Yes, we might have a vendor lock eventually, but at the very begging of product's lifecycle we are interested to launch it ASAP. To have a product is better than have none.

- Service communication
    - I'd use async communication whenever it is possible, instead of request-response model (http, graphql...). Async communication allows the system to be scalable and more resilient
    - For system-wide events - we should consider how many subcsribers for an event we expect, whether we need a strict order, history. Possible solutions are RabbitMq, Redis, Kafka, SQS\SNS, others.
    - For order processing I would stick to Kafka, because of message order within topic-partitions. This will save us a lot of time\money\reputation, reducing amount of `race conditions` within the system

- Cache
    I'd go with Redis, because 
    - it can be used as a cache, and also as a Pub\Sub channel
    - can be used as distributed lock storage
    - the less different infrastructure dependencies we have, the better & cheaper it will be

- DB
    - I have experience with Postgres & MongoDB. AFAIK both of them can sustain significant load. Both of them now allows to run ACID transactions. I would go with postgres because of strong data consistency. It is better to fail early, then fail at some critical moment. Mistakes are much cheaper during development stage, then in production environment.

- Media Server
    - Unfortunately, I don't have much experience with video stream processing, so I can rely only on data from the web. AFAIK we can use Red5 or Wowza Streaming Engine. I would also check if a cloud provider has some suitable service (I'm sure they do have one).