var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// src/config/env.keys.ts
var import_dotenv = __toESM(require_main());
(0, import_dotenv.config)({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.prod"
});
var IS_CONTAINER = process.env.IS_CONTAINER || "false";
var IS_LOCAL = process.env.IS_LOCAL || "false";
var SESSION_SECRET = process.env.SESSION_SECRET || "session_secret";
var REDIS_PASSWORD = process.env.REDIS_PASSWORD || "redis_password";
var REDIS_PORT = process.env.REDIS_PORT || 63676;
var REDIS_HOST = process.env.REDIS_HOST || "redis_host";
var REDIS_LOCAL_URL = IS_CONTAINER === "true" ? "redis://redis:6379" : "redis://localhost:6389";

// src/libs/redis.lib.ts
import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
var RedisLib = class _RedisLib {
  constructor() {
    this.client = null;
    /**
     * * Initialize redis client
     * @returns session details for express
     */
    this.initRedisClient = () => __async(this, null, function* () {
      if (!this.client) {
        if (IS_LOCAL === "true") {
          console.debug("Redis client created locally", REDIS_LOCAL_URL);
          this.client = createClient({ url: REDIS_LOCAL_URL });
        } else {
          console.debug("Redis client created in production");
          this.client = createClient({
            password: REDIS_PASSWORD,
            socket: {
              host: REDIS_HOST,
              port: +REDIS_PORT
            }
          });
        }
        const sessionStore = new RedisStore({ client: this.client });
        const sessionDetails = session({
          store: sessionStore,
          secret: SESSION_SECRET,
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false }
        });
        this.client.on(
          "error",
          (err) => console.error(`Error creating redis clinet: ${err}`)
          // log.error(`Error creating redis clinet: ${err}`)
        );
        try {
          yield this.client.connect();
          return sessionDetails;
        } catch (error) {
          console.error("Error occurred while initializing redis");
          throw error;
        }
      }
    });
    /**
     * * Close redis client
     * @returns void
     */
    this.close = () => __async(this, null, function* () {
      if (!this.client) {
        throw new Error("Redis client not initialized");
      }
      yield this.client.disconnect();
    });
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
    this.setAnalyticsValue = (type, dir = "view_count") => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const keyPath = `analytics:${dir}:${type}`;
        const count = yield this.client.incr(keyPath);
        return count;
      } catch (error) {
        console.error(`Error occurred while setting value for key: ${type}`);
        throw error;
      }
    });
    /**
     * * SET DATA value in redis
     * @param dir RedisDirectory
     * @param key string
     * @param value any
     */
    this.setData = (dir, key, value) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const keyPath = `${dir}:${key}`;
        yield this.client.set(keyPath, JSON.stringify(value));
      } catch (error) {
        console.error(`Error occurred while setting value for key: ${key}`);
        throw error;
      }
    });
    /**
     * * SET DATA in redis with expiry
     * @param dir RedisDirectory
     * @param idKey string (key)
     * @param value string
     * @param exp number (default 3600) time to expire
     */
    this.setDataToExp = (dir, idKey, value, exp = 3600) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const keyPath = `${dir}:${idKey}`;
        yield this.client.setEx(keyPath, exp, JSON.stringify(value));
      } catch (error) {
        console.error(
          `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
        );
        throw error;
      }
    });
    /**
     * * GET DATA value from redis
     * @param dir RedisDirectory
     * @param key string
     * @returns
     */
    this.getData = (dir, key) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const value = yield this.client.get(`${dir}:${key}`);
        if (value == null) {
          return null;
        }
        return JSON.parse(value);
      } catch (error) {
        console.error(
          `Error occurred while getting value for dir & key: ${dir} : ${key}`
        );
        throw error;
      }
    });
    /**
     * * SET string or number value in redis
     * @param dir RedisDirectory
     * @param key string
     * @param value string
     */
    this.setValue = (dir, key, value) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const keyPath = `${dir}:${key}`;
        yield this.client.set(keyPath, value);
      } catch (error) {
        console.error(`Error occurred while setting value for key: ${key}`);
        throw error;
      }
    });
    /**
     * * SET string value value in redis with expiry
     * @param dir RedisDirectory
     * @param idKey string (key)
     * @param value string
     * @param exp number (default 3600 1 hour) time to expire
     */
    this.setValueToExp = (dir, idKey, value, exp = 3600) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const keyPath = `${dir}:${idKey}`;
        yield this.client.setEx(keyPath, exp, value);
      } catch (error) {
        console.error(
          `Error occurred while setting value for dir & key: ${dir} : ${idKey}`
        );
        throw error;
      }
    });
    /**
     * * GET string value from redis
     * @param dir RedisDirectory
     * @param key string
     * @returns Promise<T | null>
     */
    this.getValue = (dir, key) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        const value = yield this.client.get(`${dir}:${key}`);
        if (!value == null) {
          return null;
        }
        return value;
      } catch (error) {
        console.error(
          `Error occurred while getting value for dir & key: ${dir} : ${key}`
        );
        throw error;
      }
    });
    /**
     * * REMOVE string value from redis
     * @param dir RedisDirectory
     * @param key string
     */
    this.removeValue = (dir, key) => __async(this, null, function* () {
      try {
        if (!this.client) {
          throw new Error("Redis client not initialized");
        }
        yield this.client.del(`${dir}:${key}`);
      } catch (error) {
        console.error(
          `Error occurred while deleting value for dir & key: ${dir} : ${key}`
        );
        throw error;
      }
    });
    if (_RedisLib.instance) {
      return _RedisLib.instance;
    }
    _RedisLib.instance = this;
  }
};
export {
  RedisLib
};
//# sourceMappingURL=index.mjs.map