/*
     * JavaScript MD5
     * https://github.com/blueimp/JavaScript-MD5
     *
     * Copyright 2011, Sebastian Tschan
     * https://blueimp.net
     *
     * Licensed under the MIT license:
     * https://opensource.org/licenses/MIT
     */

    /* global define, module */
    import {
      hexMD5,
      rawMD5,
      hexHMACMD5,
      rawHMACMD5
    } from './md5/core.js';

    let md5FunctionSingleton;

    (function (root, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(factory);
      } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
      } else {
        root.md5 = factory();
        md5FunctionSingleton = root.md5;
      }
    })(
      typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
         
        ? global
         
        : typeof self !== 'undefined'
         
        ? self
        : this || {},
      function () {
        'use strict';

        function coreApi(string, key, raw) {
          if (!key) {
            if (!raw) {
              return hexMD5(string);
            }
            return rawMD5(string);
          }
          if (!raw) {
            return hexHMACMD5(key, string);
          }
          return rawHMACMD5(key, string);
        }
        md5FunctionSingleton = coreApi;
        return coreApi;
      }
    );

    export default function md5(string, key, raw) {
      if (typeof md5FunctionSingleton === 'function') {
        return md5FunctionSingleton(string, key, raw);
      }
      if (typeof window !== 'undefined' && typeof window.md5 === 'function') {
        return window.md5(string, key, raw);
      }
      // Fallback for environments where the UMD pattern might not set md5FunctionSingleton correctly.
      // This is less likely with the robust root detection.
      // Or if directly imported as ESM without UMD execution (e.g. in a test environment)
      if (!key) {
        if (!raw) {
          return hexMD5(string);
        }
        return rawMD5(string);
      }
      if (!raw) {
        return hexHMACMD5(key, string);
      }
      return rawHMACMD5(key, string);
    }

