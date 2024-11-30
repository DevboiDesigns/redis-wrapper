import * as express from 'express';
import * as qs from 'qs';
import * as express_serve_static_core from 'express-serve-static-core';

/**
 * * Redis Analytics Types
 */
type RedisAnalyticsType = "registered" | "signed_in" | "signed_out" | "viewed";
/**
 * * Redis Directory Types
 */
type RedisDirectory = "view_count" | "logs" | "users" | "posts";
/**
 * * Redis Library
 */
declare class RedisLib {
    /**
     * * Singleton instance
     */
    private static instance;
    private client;
    constructor();
    /**
     * * Initialize redis client
     * @returns session details for express
     */
    initRedisClient: () => Promise<express.RequestHandler<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>> | undefined>;
    /**
     * * SET analytics value in redis
     * @param type RedisAnalyticsType
     * @param appType RedisAppType (default 'sdk')
     * @param dir RedisDirectory (default 'view_count')
     * @returns number (count)
     *
     * returns the total count value for the incremented key
     *
     */
    setAnalyticsValue: (type: RedisAnalyticsType, dir?: RedisDirectory) => Promise<number>;
    /**
     * * SET DATA value in redis
     * @param dir RedisDirectory
     * @param key string
     * @param value any
     */
    setData: (dir: RedisDirectory, key: string, value: any) => Promise<void>;
    /**
     * * SET DATA in redis with expiry
     * @param dir RedisDirectory
     * @param idKey string (key)
     * @param value string
     * @param exp number (default 3600) time to expire
     */
    setDataToExp: (dir: RedisDirectory, idKey: string, value: any, exp?: number) => Promise<void>;
    /**
     * * GET DATA value from redis
     * @param dir RedisDirectory
     * @param key string
     * @returns
     */
    getData: <T>(dir: RedisDirectory, key: string) => Promise<T | null>;
    /**
     * * SET string or number value in redis
     * @param dir RedisDirectory
     * @param key string
     * @param value string
     */
    setValue: (dir: RedisDirectory, key: string, value: string | number) => Promise<void>;
    /**
     * * SET string value value in redis with expiry
     * @param dir RedisDirectory
     * @param idKey string (key)
     * @param value string
     * @param exp number (default 3600 1 hour) time to expire
     */
    setValueToExp: (dir: RedisDirectory, idKey: string, value: string, exp?: number) => Promise<void>;
    /**
     * * GET string value from redis
     * @param dir RedisDirectory
     * @param key string
     * @returns Promise<T | null>
     */
    getValue: (dir: RedisDirectory, key: string) => Promise<string | number | null>;
    /**
     * * REMOVE string value from redis
     * @param dir RedisDirectory
     * @param key string
     */
    removeValue: (dir: RedisDirectory, key: string) => Promise<void>;
}

export { RedisLib };
