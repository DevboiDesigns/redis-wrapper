import {
  SESSION_SECRET,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  IS_LOCAL,
  REDIS_LOCAL_URL,
} from "../config/env.keys"
import { createClient, RedisClientType } from "redis"
import RedisStore from "connect-redis"
import session from "express-session"
// import log from "./logger.lib"

/**
 * * Redis Analytics Types
 */
type RedisAnalyticsType = "registered" | "signed_in" | "signed_out" | "viewed"

/**
 * * Redis Directory Types
 */
type RedisDirectory = "view_count" | "logs" | "users" | "posts"

/**
 * * Redis Library
 */
export default class RedisLib {
  /**
   * * Singleton instance
   */
  private static instance: RedisLib
  private client: RedisClientType | null = null
  constructor() {
    if (RedisLib.instance) {
      return RedisLib.instance
    }
    RedisLib.instance = this
  }

  /**
   * * Initialize redis client
   * @returns session details for express
   */
  initRedisClient = async () => {
    if (!this.client) {
      if (IS_LOCAL === "true") {
        console.debug("Redis client created locally", REDIS_LOCAL_URL)
        this.client = createClient({ url: REDIS_LOCAL_URL })
      } else {
        console.debug("Redis client created in production")
        this.client = createClient({
          password: REDIS_PASSWORD,
          socket: {
            host: REDIS_HOST,
            port: +REDIS_PORT,
          },
        })
      }
      const sessionStore = new RedisStore({ client: this.client })
      const sessionDetails = session({
        store: sessionStore,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
      this.client.on(
        "error",
        (err: any) => console.error(`Error creating redis clinet: ${err}`)
        // log.error(`Error creating redis clinet: ${err}`)
      )
      try {
        await this.client.connect()
        return sessionDetails
      } catch (error) {
        console.error("Error occurred while initializing redis")
        // log.error("Error occurred while initializing redis")
        throw error
      }
    }
  }

  /**
   * * Close redis client
   * @returns void
   */
  close = async () => {
    if (!this.client) {
      throw new Error("Redis client not initialized")
    }
    await this.client.disconnect()
  }

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
  setAnalyticsValue = async (
    type: RedisAnalyticsType,
    dir: RedisDirectory = "view_count"
  ): Promise<number> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const keyPath = `analytics:${dir}:${type}`
      const count = await this.client.incr(keyPath)
      // responds with count value for the incremented key
      return count
    } catch (error) {
      console.error(`Error occurred while setting value for key: ${type}`)
      // log.error(`Error occurred while setting value for key: ${type}`)
      throw error
    }
  }

  /**
   * * SET DATA value in redis
   * @param dir RedisDirectory
   * @param key string
   * @param value any
   */
  setData = async (
    dir: RedisDirectory,
    key: string,
    value: any
  ): Promise<void> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const keyPath = `${dir}:${key}`
      await this.client.set(keyPath, JSON.stringify(value))
    } catch (error) {
      console.error(`Error occurred while setting value for key: ${key}`)
      // log.error(`Error occurred while setting value for key: ${key}`)
      throw error
    }
  }

  /**
   * * SET DATA in redis with expiry
   * @param dir RedisDirectory
   * @param idKey string (key)
   * @param value string
   * @param exp number (default 3600) time to expire
   */
  setDataToExp = async (
    dir: RedisDirectory,
    idKey: string,
    value: any,
    exp: number = 3600
  ): Promise<void> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const keyPath = `${dir}:${idKey}`
      await this.client.setEx(keyPath, exp, JSON.stringify(value))
    } catch (error) {
      console.error(
        `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
      )
      // log.error(
      //   `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
      // )
      throw error
    }
  }

  /**
   * * GET DATA value from redis
   * @param dir RedisDirectory
   * @param key string
   * @returns
   */
  getData = async <T>(dir: RedisDirectory, key: string): Promise<T | null> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const value = await this.client.get(`${dir}:${key}`)
      if (value == null) {
        return null
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error(
        `Error occurred while getting value for dir & key: ${dir} : ${key}`
      )
      // log.error(
      //   `Error occurred while getting value for dir & key: ${dir} : ${key}`
      // )
      throw error
    }
  }

  /**
   * * SET string or number value in redis
   * @param dir RedisDirectory
   * @param key string
   * @param value string
   */
  setValue = async (
    dir: RedisDirectory,
    key: string,
    value: string | number
  ): Promise<void> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const keyPath = `${dir}:${key}`
      await this.client.set(keyPath, value)
    } catch (error) {
      console.error(`Error occurred while setting value for key: ${key}`)
      // log.error(`Error occurred while setting value for key: ${key}`)
      throw error
    }
  }

  /**
   * * SET string value value in redis with expiry
   * @param dir RedisDirectory
   * @param idKey string (key)
   * @param value string
   * @param exp number (default 3600 1 hour) time to expire
   */
  setValueToExp = async (
    dir: RedisDirectory,
    idKey: string,
    value: string,
    exp: number = 3600 // 1 hour,
  ): Promise<void> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const keyPath = `${dir}:${idKey}`
      await this.client.setEx(keyPath, exp, value)
    } catch (error) {
      console.error(
        `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
      )
      // log.error(
      //   `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
      // )
      throw error
    }
  }

  /**
   * * GET string value from redis
   * @param dir RedisDirectory
   * @param key string
   * @returns Promise<T | null>
   */
  getValue = async (
    dir: RedisDirectory,
    key: string
  ): Promise<string | number | null> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      const value = await this.client.get(`${dir}:${key}`)
      if (!value == null) {
        return null
      }
      return value
    } catch (error) {
      console.error(
        `Error occurred while getting value for dir & key: ${dir} : ${key}`
      )
      // log.error(
      //   `Error occurred while getting value for dir & key: ${dir} : ${key}`
      // )
      throw error
    }
  }

  /**
   * * REMOVE string value from redis
   * @param dir RedisDirectory
   * @param key string
   */
  removeValue = async (dir: RedisDirectory, key: string): Promise<void> => {
    try {
      if (!this.client) {
        throw new Error("Redis client not initialized")
      }
      await this.client.del(`${dir}:${key}`)
    } catch (error) {
      console.error(
        `Error occurred while deleting value for dir & key: ${dir} : ${key}`
      )
      // log.error(
      //   `Error occurred while deleting value for dir & key: ${dir} : ${key}`
      // )
      throw error
    }
  }
}
