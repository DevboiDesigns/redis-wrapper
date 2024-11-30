import { config } from "dotenv"
config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.prod",
})

// ENV
const IS_CONTAINER = process.env.IS_CONTAINER || "false"
const IS_LOCAL = process.env.IS_LOCAL || "false"
// REDIS
const SESSION_SECRET = process.env.SESSION_SECRET || "session_secret"
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "redis_password"
const REDIS_PORT = process.env.REDIS_PORT || 63676
const REDIS_HOST = process.env.REDIS_HOST || "redis_host"
const REDIS_LOCAL_URL =
  IS_CONTAINER === "true" ? "redis://redis:6379" : "redis://localhost:6389" // localhost for not running in a container or the image name if running in a container

export {
  IS_LOCAL,
  // REDIS SECRET
  SESSION_SECRET,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_LOCAL_URL,
}
