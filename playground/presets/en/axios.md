# Axios README

> Source: [axios/axios](https://github.com/axios/axios/blob/v1.x/README.md). Local snapshot retrieved on 2026-10-13, with excerpts covering features, installation, usage examples, the API, and request configuration; badges and sponsorship material are omitted. MIT license; the complete notice appears at the end.

## Features

- Make [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) from the browser.
- Make [http](https://nodejs.org/api/http.html) requests from Node.js.
- Use the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API for asynchronous request handling.
- Intercept requests and responses to add custom logic or transform data.
- Transform request and response data.
- Cancel requests with built-in cancellation APIs.
- Serialize and parse [JSON](https://www.json.org/json-en.html) data.
- Serialize data objects to `multipart/form-data` or `application/x-www-form-urlencoded`.
- Add client-side protection against [Cross-Site Request Forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery).

## Installing

### Package manager

Using npm:

```bash
$ npm install axios
```

Using yarn:

```bash
$ yarn add axios
```

Using pnpm:

```bash
$ pnpm add axios
```

Using bun:

```bash
$ bun add axios
```

Using Deno:

```bash
$ deno add axios
```

Once the package is installed, import it with `import` or `require`:

```js
import axios, { isCancel, AxiosError } from 'axios';
```

You can also use the default export, since the named export is just a re-export from the Axios factory:

```js
import axios from 'axios';

console.log(axios.isCancel('something'));
```

If you use `require` for importing, **only the default export is available**:

```js
const axios = require('axios');

console.log(axios.isCancel('something'));
```

Some bundlers and ES6 linters need this form:

```js
import { default as axios } from 'axios';
```

In custom or legacy environments, you can import the bundle directly:

```js
const axios = require('axios/dist/browser/axios.cjs'); // browser commonJS bundle (ES2017)
// const axios = require('axios/dist/node/axios.cjs'); // node commonJS bundle (ES2017)
```

### CDN

Using jsDelivr CDN (ES5 UMD browser module):

```html
<script src="https://cdn.jsdelivr.net/npm/axios@1.20.0/dist/axios.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/axios@1.20.0/dist/axios.min.js"></script>
```

## Example

```js
import axios from 'axios';
//const axios = require('axios'); // legacy way

try {
  const response = await axios.get('/user?ID=12345');
  console.log(response);
} catch (error) {
  console.error(error);
}

// Optionally the request above could also be done as
axios
  .get('/user', {
    params: {
      ID: 12345,
    },
    timeout: 5000, // 5 seconds. See "Handling Timeouts" below for matching error handling
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    // Example: GET request with query parameters
    const response = await axios.get('/user', {
      params: {
        ID: 12345,
      },
    });

    // Using the `params` option improves readability and automatically formats query strings

    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

> Note: Set a `timeout` in production. Without one, a stalled request can hang
> indefinitely. See [Handling Timeouts](#handling-timeouts) for the matching error handling.

> Note: `async/await` is part of ECMAScript 2017 and is not supported in Internet
> Explorer and older browsers, so use with caution.

Performing a `POST` request

```js
const response = await axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone',
});
console.log(response);
```

Performing multiple concurrent requests

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()]).then(function (results) {
  const acct = results[0];
  const perm = results[1];
});
```

## axios API

Requests can be made by passing the relevant config to `axios`.

##### axios(config)

```js
// Send a POST request
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
});
```

```js
// GET request for remote image in node.js
import fs from 'fs';
const response = await axios({
  method: 'get',
  url: 'https://bit.ly/2mTM3nY',
  responseType: 'stream',
});
response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
```

##### axios(url[, config])

```js
// Send a GET request (default method)
axios('/user/12345');
```

### Request method aliases

For convenience, aliases have been provided for all common request methods.

##### axios.request(config)

##### axios.get(url[, config])

##### axios.delete(url[, config])

##### axios.head(url[, config])

##### axios.options(url[, config])

##### axios.post(url[, data[, config]])

##### axios.put(url[, data[, config]])

##### axios.patch(url[, data[, config]])

###### Note

When using the alias methods `url`, `method`, and `data` properties don't need to be specified in config.

### Concurrency (deprecated)

Use `Promise.all` instead of these helpers.

Helper functions for dealing with concurrent requests.

axios.all(iterable)
axios.spread(callback)

### Creating an instance

You can create a new instance of axios with a custom config.

##### axios.create([config])

```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```

### Instance methods

The following instance methods are available. Axios merges the specified config with the instance config.

##### axios#request(config)

##### axios#get(url[, config])

##### axios#delete(url[, config])

##### axios#head(url[, config])

##### axios#options(url[, config])

##### axios#post(url[, data[, config]])

##### axios#put(url[, data[, config]])

##### axios#patch(url[, data[, config]])

##### axios#getUri([config])

## Request config

### Security notice: decompression-bomb protection is opt-in

By default `maxContentLength` and `maxBodyLength` are `-1` (unlimited). A malicious or compromised server can return a tiny gzip/deflate/brotli/zstd body that expands to gigabytes and exhaust the Node.js process.

If you call servers you do not fully trust, **set a cap**:

```js
axios.defaults.maxContentLength = 10 * 1024 * 1024; // 10 MB
axios.defaults.maxBodyLength = 10 * 1024 * 1024;
```

See the [security guide](https://axios.rest/pages/misc/security.html) for details.

These config options are available for requests. Only `url` is required. Requests default to `GET` when `method` is not set.

```js
{
  // `url` is the server URL for the request
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default

  // Axios prepends `baseURL` to `url` unless `url` is absolute and `allowAbsoluteUrls` is set to true.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to the methods of that instance.
  // `baseURL` is not a security boundary. If `url` is attacker-controlled, validate it
  // before passing it to axios. Relative URLs can contain `..` segments that resolve
  // outside an intended path prefix after the final URL is parsed.
  // HTTP(S) URLs must include `//` after the protocol. Values such as
  // `https:example.com` and `https:/example.com` are rejected with ERR_INVALID_URL.
  baseURL: 'https://some-domain.com/api/',

  // `allowAbsoluteUrls` determines whether or not absolute URLs will override a configured `baseUrl`.
  // When set to true (default), absolute values for `url` will override `baseUrl`.
  // When set to false, absolute values for `url` will always be prepended by `baseUrl`.
  allowAbsoluteUrls: true,

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `parseReviver` is an optional function passed as the
  // second argument (reviver) to JSON.parse()
  parseReviver: function (key, value, context) {
    // In modern environments, context.source provides the raw JSON string
    // allowing for precision-safe parsing of BigInt
    if (typeof value === 'number' && context?.source) {
      const isInteger = Number.isInteger(value);
      const isUnsafe = !Number.isSafeInteger(value);
      const isValidIntegerString = /^-?\d+$/.test(context.source);

      if (isInteger && isUnsafe && isValidIntegerString) {
        try {
          return BigInt(context.source);
        } catch {
          // Fallback: return original value if parsing fails
        }
      }
    }
    return value;
  },

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `paramsSerializer` is an optional config that allows you to customize serializing `params`.
  paramsSerializer: {

    // Custom encoder function which sends key/value pairs in an iterative fashion.
    encode?: (param: string): string => { /* Do custom operations here and return transformed string */ },

    // Custom serializer function for the entire parameter. Allows the user to mimic pre 1.x behaviour.
    serialize?: (params: Record<string, any>, options?: ParamsSerializerOptions ),

    // Configuration for formatting array indexes in the params.
    indexes: false, // Three available options: (1) indexes: null (leads to no brackets), (2) (default) indexes: false (leads to empty brackets), (3) indexes: true (leads to brackets with indexes).

    // Maximum object nesting depth when serializing params. Payloads deeper than this throw an
    // AxiosError with code ERR_FORM_DATA_DEPTH_EXCEEDED. Default: 100. Set to Infinity to disable.
    maxDepth: 100

  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH'
  // `data` is request-specific: axios does not inherit or deep-merge it from defaults.
  // To add shared body fields, use a request interceptor or transformRequest.
  // When no `transformRequest` is set, it must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - React Native: FormData
  // - Node only: Stream, Buffer, FormData (form-data package)
  data: {
    firstName: 'Fred'
  },

  // `formDataHeaderPolicy` controls how node.js FormData#getHeaders() is copied.
  // 'legacy' (default) copies all returned headers for v1 compatibility.
  // 'content-only' copies only Content-Type and Content-Length.
  formDataHeaderPolicy: 'legacy',

  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, Axios aborts it.
  timeout: 1000, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  // This only controls whether the browser sends credentials.
  // It does not control whether the XSRF header is added.
  withCredentials: false, // default

  // `adapter` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see lib/adapters/README.md)
  adapter: function (config) {
    /* ... */
  },
  // Also, you can set the name of the built-in adapter, or provide an array with their names
  // to choose the first available in the environment
  adapter: 'xhr', // 'fetch' | 'http' | ['xhr', 'http', 'fetch']

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // If `auth` is omitted, the Node.js HTTP and fetch adapters can read
  // HTTP Basic auth credentials from the request URL, for example
  // `https://user:pass@example.com`. Axios decodes percent-encoded URL
  // credentials, and `auth` takes precedence over URL-embedded credentials.
  // The Node.js HTTP adapter preserves Basic auth on same-origin redirects
  // and strips it on cross-origin redirects.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  // options are: 'ascii', 'ASCII', 'ansi', 'ANSI', 'binary', 'BINARY', 'base64', 'BASE64', 'base64url',
  // 'BASE64URL', 'hex', 'HEX', 'latin1', 'LATIN1', 'ucs-2', 'UCS-2', 'ucs2', 'UCS2', 'utf-8', 'UTF-8',
  // 'utf8', 'UTF8', 'utf16le', 'UTF16LE'
  responseEncoding: 'utf8', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for the xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `withXSRFToken` defines whether to send the XSRF header in browser requests.
  // `undefined` (default) - set XSRF header only for the same origin requests
  // `true` - always set XSRF header, including for cross-origin requests
  // `false` - never set XSRF header
  // function - resolve with custom logic; receives the internal config object
  withXSRFToken: boolean | undefined | ((config: InternalAxiosRequestConfig) => boolean | undefined),

  // `withXSRFToken` controls whether Axios reads the XSRF cookie and sets the XSRF header.
  // - `undefined` (default): the XSRF header is set only for same-origin requests.
  // - `true`: attempt to set the XSRF header for all requests (including cross-origin).
  // - `false`: never set the XSRF header.
  // - function: a callback that receives the request `config` and returns `true`,
  //   `false`, or `undefined` to decide per-request behavior.
  //
  // Note about `withCredentials`: `withCredentials` controls whether cross-site
  // requests include credentials (cookies and HTTP auth). In older Axios versions,
  // setting `withCredentials: true` implicitly caused Axios to set the XSRF header
  // for cross-origin requests. Newer Axios separates these concerns: to allow the
  // XSRF header to be sent for cross-origin requests you should set both
  // `withCredentials: true` and `withXSRFToken: true`.
  //
  // Example:
  // axios.get('/user', { withCredentials: true, withXSRFToken: true });

  // `onUploadProgress` allows handling of progress events for uploads
  // browser & node.js
  onUploadProgress: function ({loaded, total, progress, bytes, estimated, rate, upload = true}) {
    // Do whatever you want with the Axios progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  // browser & node.js
  onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
    // Do whatever you want with the Axios progress event
  },

  // `maxContentLength` defines the max size of the response content in bytes.
  // It is enforced by the Node.js HTTP adapter and the fetch adapter.
  maxContentLength: 2000,

  // `maxBodyLength` defines the max size of the request content in bytes.
  // It is enforced by the Node.js HTTP adapter and the fetch adapter when the body length can be determined.
  maxBodyLength: 2000,

  // `redact` masks matching config keys when AxiosError#toJSON() is called.
  // Matching is case-insensitive and recursive. It does not change the request.
  redact: ['authorization', 'password'],

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` or is set to
  // `null`, Axios resolves the promise; otherwise, Axios rejects it.
  // Explicit `validateStatus: undefined` resolves every status by default for
  // backward compatibility. Set `transitional.validateStatusUndefinedResolves`
  // to `false` to make explicit `undefined` behave as if this option was omitted.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, Axios follows no redirects.
  maxRedirects: 21, // default

  // `sensitiveHeaders` (Node only option) lists custom secret-bearing headers
  // (such as `X-API-Key`) to remove from cross-origin redirects. Matching is
  // case-insensitive. Same-origin redirects keep these headers. If
  // `maxRedirects` is 0, this option is not used.
  sensitiveHeaders: ['X-API-Key'],

  // `beforeRedirect` defines a function that Axios calls before redirect.
  // Use this to adjust the request options upon redirecting,
  // to inspect the latest response headers,
  // or to cancel the request by throwing an error
  // If maxRedirects is set to 0, `beforeRedirect` is not used.

  beforeRedirect: (options, { headers }) => {
    if (
      options.hostname === "example.com" &&
      options.protocol === "https:"
    ) {
      options.auth = "user:password";
    }
  },
  // Security note:
  // The `beforeRedirect` hook runs after sensitive headers are stripped during redirects.
  // `follow-redirects` removes credentials on protocol downgrades
  // (HTTPS to HTTP). Because `beforeRedirect` runs after that step,
  // re-injecting credentials without checking the destination can expose
  // sensitive data. Only add credentials for trusted HTTPS destinations.

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  //
  // Security: when `socketPath` is set, hostname/port of the URL are ignored,
  // which bypasses hostname-based SSRF protections. Never derive `socketPath`
  // from untrusted input. Use `allowedSocketPaths` (below) to restrict accepted
  // socket paths for defense-in-depth.
  socketPath: null, // default

  // `allowedSocketPaths` restricts which `socketPath` values are accepted.
  // Accepts a string or array of strings. Entries and the incoming socketPath
  // are compared after path.resolve(). A mismatch throws AxiosError with code
  // `ERR_BAD_OPTION_VALUE`. When null/undefined, no restriction is applied.
  allowedSocketPaths: null, // default

  // `transport` determines the transport method for the request.
  // If defined, Axios uses it. Otherwise, if `maxRedirects` is 0,
  // Axios uses the default `http` or `https` library, depending on the protocol specified in `protocol`.
  // Otherwise, Axios uses the `httpFollow` or `httpsFollow` library, again depending on the protocol,
  // which can handle redirects.
  transport: undefined, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default before Node.js v19.0.0. After Node.js
  // v19.0.0, you no longer need to customize the agent to enable `keepAlive` because
  // `http.globalAgent` has `keepAlive` enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` defines the hostname, port, and protocol of the proxy server.
  // You can also define your proxy using the conventional `http_proxy` and
  // `https_proxy` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a `no_proxy` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use `false` to disable proxies, ignoring environment variables.
  // On Node.js versions with native environment proxy support, axios defers
  // environment proxy handling to Node when the selected agent has `proxyEnv`
  // enabled, including processes started with `NODE_USE_ENV_PROXY=1`,
  // `--use-env-proxy`, or `NODE_OPTIONS=--use-env-proxy`. Custom agents without
  // `proxyEnv` continue to use axios environment proxy resolution. Explicit
  // `proxy` config is still handled by axios.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // For `http://` targets, axios sends the request to the proxy in
  // forward-proxy mode and stamps `Proxy-Authorization` onto the request
  // headers (overwriting any user-supplied `Proxy-Authorization` header).
  // For `https://` targets, axios establishes a CONNECT tunnel through the
  // proxy and performs TLS end-to-end with the origin; `Proxy-Authorization`
  // is sent on the CONNECT request only, never on the wrapped TLS request,
  // so the proxy never sees the URL, headers, or body. Axios forwards
  // `httpsAgent` TLS options such as `ca`, `cert`, `key`, and
  // `rejectUnauthorized` to the generated tunneling agent, so they still apply
  // to the origin TLS connection.
  // If you supply an `HttpsProxyAgent`, axios leaves tunneling to that agent.
  // If the proxy server uses HTTPS, then you must set the protocol to `https`.
  // A user-supplied `Host` header in `headers` is preserved when forwarding
  // through a proxy (case-insensitive match on `host`/`Host`/`HOST`); this
  // lets you target a virtual host that differs from the request URL, for
  // example, hitting `127.0.0.1:4000` while having the proxy treat the
  // request as `example.com`. If no `Host` header is supplied, axios
  // defaults it to the request URL's `hostname:port` as before. The Host
  // header is only set in forward-proxy mode (HTTP targets); for HTTPS
  // tunneling the Host header is sent inside the TLS connection, not seen
  // by the proxy.
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  }),

  // an alternative way to cancel Axios requests using AbortController
  signal: new AbortController().signal,

  // `decompress` indicates whether or not the response body should be decompressed
  // automatically. If set to `true` will also remove the 'content-encoding' header
  // from the responses objects of all decompressed responses
  // Axios supports gzip, deflate, brotli, and zstd when the current Node.js
  // runtime provides the corresponding zlib decompressor.
  // - Node only (XHR cannot turn off decompression)
  decompress: true, // default

  // `insecureHTTPParser` boolean.
  // Indicates where to use an insecure HTTP parser that accepts invalid HTTP headers.
  // This may allow interoperability with non-conformant HTTP implementations.
  // Using the insecure parser should be avoided.
  // see options https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_http_request_url_options_callback
  // see also https://nodejs.org/en/blog/vulnerability/february-2020-security-releases/#strict-http-header-parsing-none
  insecureHTTPParser: undefined, // default

  // transitional options for backward compatibility that may be removed in the newer versions
  transitional: {
    // silent JSON parsing mode
    // `true`  - ignore JSON parsing errors and set response.data to null if parsing failed (old behaviour)
    // `false` - throw SyntaxError if JSON parsing failed
    // Important: this option only takes effect when `responseType` is explicitly set to 'json'.
    // When `responseType` is omitted (defaults to no value), axios uses `forcedJSONParsing`
    // to attempt JSON parsing, but will silently return the raw string on failure regardless
    // of this setting. To have invalid JSON throw errors, use:
    //   { responseType: 'json', transitional: { silentJSONParsing: false } }
    silentJSONParsing: true, // default value for the current Axios version

    // try to parse the response string as JSON even if `responseType` is not 'json'
    forcedJSONParsing: true,

    // throw ETIMEDOUT error instead of generic ECONNABORTED on request timeouts
    clarifyTimeoutError: false,

    // keep explicit `validateStatus: undefined` resolving every response status
    // for backward compatibility. Set to false to make explicit undefined behave
    // as if validateStatus was omitted.
    validateStatusUndefinedResolves: true,

    // advertise `zstd` in the default Accept-Encoding header when the current
    // Node.js runtime supports zstd decompression. Axios still decompresses
    // zstd responses when support exists and `decompress` is true.
    advertiseZstdAcceptEncoding: false,

    // use the legacy interceptor request/response ordering
    legacyInterceptorReqResOrdering: true, // default
  },

  env: {
    // The FormData class to be used to automatically serialize the payload into a FormData object
    FormData: window?.FormData || global?.FormData
  },

  formSerializer: {
      visitor: (value, key, path, helpers) => {}; // custom visitor function to serialize form values
      dots: boolean; // use dots instead of brackets format
      metaTokens: boolean; // keep special endings like {} in parameter key
      indexes: boolean; // array indexes format null - no brackets, false - empty brackets, true - brackets with indexes
      maxDepth: 100; // maximum object nesting depth; throws AxiosError (ERR_FORM_DATA_DEPTH_EXCEEDED) if exceeded. Set to Infinity to disable.
  },

  // http adapter only (node.js)
  maxRate: [
    100 * 1024, // 100KB/s upload limit,
    100 * 1024  // 100KB/s download limit
  ]
}
```

For custom secret-bearing headers in Node.js, list them in `sensitiveHeaders` so Axios removes them when following a redirect to another origin:

```js
axios.get('https://api.example.com/users', {
  headers: { 'X-API-Key': 'secret' },
  sensitiveHeaders: ['X-API-Key'],
});
```

### Strict RFC 3986 percent-encoding for query params

By default, axios decodes `%3A`, `%24`, `%2C` and `%20` back to `:`, `$`, `,` and `+` for readability (the `+` follows the `application/x-www-form-urlencoded` convention for spaces in query strings). These characters are valid in a query component under [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-3.4), so the default output is correct, but some backends require strict percent-encoding and reject the readable form.

Override the default encoder via `paramsSerializer.encode`:

```js
// Per-request: emit strict RFC 3986 percent-encoding for query values
axios.get('/foo', {
  params: { filter: JSON.stringify({ startedAt: '2026-01-23' }) },
  paramsSerializer: { encode: encodeURIComponent },
});

// Or set it on the instance defaults
const client = axios.create({
  paramsSerializer: { encode: encodeURIComponent },
});
```

## License

```text
# Copyright (c) 2014-present Matt Zabriskie & Collaborators

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
