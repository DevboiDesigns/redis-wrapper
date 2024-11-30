# Redis API Wrapper

## Overview

This library provides a wrapper around Redis to facilitate common operations such as setting and getting values, managing sessions, and handling analytics data. It uses `redis` for Redis client operations, `connect-redis` for session store, and `express-session` for session management.

## Environment Variables

The following environment variables are used to configure the Redis client:

- `SESSION_SECRET`: Secret key for session management.
- `REDIS_PASSWORD`: Password for Redis authentication.
- `REDIS_HOST`: Hostname for the Redis server.
- `REDIS_PORT`: Port number for the Redis server.
- `IS_LOCAL`: Flag to indicate if the environment is local.
- `IS_CONTAINER`: Flag to indicate if the app is running in a docker container.
- `REDIS_LOCAL_URL`: URL for the local Redis server.

These variables are imported from the [env.keys.ts](src/config/env.keys.ts) file.

## Types

### RedisAnalyticsType

Defines the types of analytics data that can be stored in Redis:

- `"registered"`
- `"signed_in"`
- `"signed_out"`
- `"viewed"`

### RedisDirectory

Defines the directories (or namespaces) used in Redis:

- `"view_count"`
- `"logs"`
- `"users"`
- `"posts"`

## Usage

To use this library, import the `RedisLib` class and initialize it:

```typescript
import RedisLib from "./libs/redis.lib"

// Initialize Redis client
const redisLib = new RedisLib()
await redisLib.initRedisClient()
```

## Methods

`initRedisClient`

- Initializes the Redis client and sets up session management.

`setAnalyticsValue`

- Sets an analytics value in Redis.

`setData`

- Sets a data value in Redis.

`setDataWithExpiry`

- Sets a data value in Redis with an expiry time.

`setValue`

- Sets a string or number value in Redis.

`setValueToExp`

- Sets a string value in Redis with an expiry time.

`getData`

- Gets a data value from Redis.

`getValue`

- Gets a string or number value from Redis.

`removeValue`

- Removes a value from Redis.
