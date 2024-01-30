(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("vue")) : typeof define === "function" && define.amd ? define(["vue"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.MyPlugin = factory(global2.Vue));
})(this, function(vue) {
  "use strict";
  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  var _a;
  const isClient$1 = typeof window !== "undefined";
  const isString$1 = (val) => typeof val === "string";
  const noop$1 = () => {
  };
  const isIOS = isClient$1 && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function createFilterWrapper(filter, fn2) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  function debounceFilter(ms, options = {}) {
    let timer;
    let maxTimer;
    let lastRejector = noop$1;
    const _clearTimeout = (timer2) => {
      clearTimeout(timer2);
      lastRejector();
      lastRejector = noop$1;
    };
    const filter = (invoke) => {
      const duration = resolveUnref(ms);
      const maxDuration = resolveUnref(options.maxWait);
      if (timer)
        _clearTimeout(timer);
      if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
        if (maxTimer) {
          _clearTimeout(maxTimer);
          maxTimer = null;
        }
        return Promise.resolve(invoke());
      }
      return new Promise((resolve, reject) => {
        lastRejector = options.rejectOnCancel ? reject : resolve;
        if (maxDuration && !maxTimer) {
          maxTimer = setTimeout(() => {
            if (timer)
              _clearTimeout(timer);
            maxTimer = null;
            resolve(invoke());
          }, maxDuration);
        }
        timer = setTimeout(() => {
          if (maxTimer)
            _clearTimeout(maxTimer);
          maxTimer = null;
          resolve(invoke());
        }, duration);
      });
    };
    return filter;
  }
  function identity$1(arg) {
    return arg;
  }
  function tryOnScopeDispose$1(fn2) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function useDebounceFn(fn2, ms = 200, options = {}) {
    return createFilterWrapper(debounceFilter(ms, options), fn2);
  }
  function refDebounced(value, ms = 200, options = {}) {
    const debounced = vue.ref(value.value);
    const updater = useDebounceFn(() => {
      debounced.value = value.value;
    }, ms, options);
    vue.watch(value, () => updater());
    return debounced;
  }
  function tryOnMounted(fn2, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn2);
    else if (sync)
      fn2();
    else
      vue.nextTick(fn2);
  }
  function useTimeoutFn$1(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, resolveUnref(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient$1)
        start();
    }
    tryOnScopeDispose$1(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
  }
  function unrefElement$1(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow$1 = isClient$1 ? window : void 0;
  function useEventListener$1(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (isString$1(args[0]) || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow$1;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop$1;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(() => [unrefElement$1(target), resolveUnref(options)], ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events.flatMap((event) => {
        return listeners.map((listener) => register(el, event, listener, options2));
      }));
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose$1(stop);
    return stop;
  }
  let _iOSWorkaround = false;
  function onClickOutside(target, handler, options = {}) {
    const { window: window2 = defaultWindow$1, ignore = [], capture = true, detectIframe = false } = options;
    if (!window2)
      return;
    if (isIOS && !_iOSWorkaround) {
      _iOSWorkaround = true;
      Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop$1));
    }
    let shouldListen = true;
    const shouldIgnore = (event) => {
      return ignore.some((target2) => {
        if (typeof target2 === "string") {
          return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
        } else {
          const el = unrefElement$1(target2);
          return el && (event.target === el || event.composedPath().includes(el));
        }
      });
    };
    const listener = (event) => {
      const el = unrefElement$1(target);
      if (!el || el === event.target || event.composedPath().includes(el))
        return;
      if (event.detail === 0)
        shouldListen = !shouldIgnore(event);
      if (!shouldListen) {
        shouldListen = true;
        return;
      }
      handler(event);
    };
    const cleanup = [
      useEventListener$1(window2, "click", listener, { passive: true, capture }),
      useEventListener$1(window2, "pointerdown", (e) => {
        const el = unrefElement$1(target);
        if (el)
          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
      }, { passive: true }),
      detectIframe && useEventListener$1(window2, "blur", (event) => {
        var _a2;
        const el = unrefElement$1(target);
        if (((_a2 = window2.document.activeElement) == null ? void 0 : _a2.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
          handler(event);
      })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn2) => fn2());
    return stop;
  }
  function useSupported$1(callback, sync = false) {
    const isSupported = vue.ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
  var __hasOwnProp$g = Object.prototype.hasOwnProperty;
  var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$g)
      for (var prop of __getOwnPropSymbols$g(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow$1 } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
    let observer;
    const isSupported = useSupported$1(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement$1(target), (el) => {
      cleanup();
      if (isSupported.value && window2 && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose$1(stop);
    return {
      isSupported,
      stop
    };
  }
  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues({
    linear: identity$1
  }, _TransitionPresets);
  const isFirefox = () => isClient$1 && /firefox/i.test(window.navigator.userAgent);
  const NOOP = () => {
  };
  const hasOwnProperty$c = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$c.call(val, key);
  const isArray$2 = Array.isArray;
  const isFunction$1 = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isObject$2 = (val) => val !== null && typeof val === "object";
  const objectToString$1 = Object.prototype.toString;
  const toTypeString = (value) => objectToString$1.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$e = Object.prototype;
  var hasOwnProperty$b = objectProto$e.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$e.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto$d = Object.prototype;
  var nativeObjectToString = objectProto$d.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag$3 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
  }
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var isArray = Array.isArray;
  const isArray$1 = isArray;
  var INFINITY$2 = 1 / 0;
  var symbolProto$2 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray$1(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string2) {
    var index = string2.length;
    while (index-- && reWhitespace.test(string2.charAt(index))) {
    }
    return index;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string2) {
    return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
  }
  function isObject$1(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject$1(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$1(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var INFINITY$1 = 1 / 0, MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$1 || value === -INFINITY$1) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  function identity(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject$1(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root$1["__core-js_shared__"];
  const coreJsData$1 = coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var funcProto$1 = Function.prototype;
  var funcToString$1 = funcProto$1.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto = Function.prototype, objectProto$c = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$a).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject$1(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue$1(object, key) {
    return object == null ? void 0 : object[key];
  }
  function getNative(object, key) {
    var value = getValue$1(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var WeakMap = getNative(root$1, "WeakMap");
  const WeakMap$1 = WeakMap;
  var objectCreate = Object.create;
  var baseCreate = /* @__PURE__ */ function() {
    function object() {
    }
    return function(proto) {
      if (!isObject$1(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  const baseCreate$1 = baseCreate;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  const defineProperty$1 = defineProperty;
  var baseSetToString = !defineProperty$1 ? identity : function(func, string2) {
    return defineProperty$1(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string2),
      "writable": true
    });
  };
  const baseSetToString$1 = baseSetToString;
  var setToString = shortOut(baseSetToString$1);
  const setToString$1 = setToString;
  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty$1) {
      defineProperty$1(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var objectProto$b = Object.prototype;
  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$9.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  var nativeMax$2 = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax$2(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$2(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  var objectProto$a = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$a;
    return value === proto;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var argsTag$3 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$3;
  }
  var objectProto$9 = Object.prototype;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
  var isArguments = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$8.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  const isArguments$1 = isArguments;
  function stubFalse() {
    return false;
  }
  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  const isBuffer$1 = isBuffer;
  var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$3 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$3 = "[object String]", weakMapTag$2 = "[object WeakMap]";
  var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
  typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal$1.process;
  var nodeUtil = function() {
    try {
      var types2 = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types2) {
        return types2;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  const nodeUtil$1 = nodeUtil;
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  const isTypedArray$1 = isTypedArray;
  var objectProto$8 = Object.prototype;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var nativeKeys = overArg(Object.keys, Object);
  const nativeKeys$1 = nativeKeys;
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys$1(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$6.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject$1(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$5.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray$1(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var nativeCreate = getNative(Object, "create");
  const nativeCreate$1 = nativeCreate;
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$4.call(data, key) ? data[key] : void 0;
  }
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$3.call(data, key);
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map$1 = getNative(root$1, "Map");
  const Map$2 = Map$1;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$2 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string2) {
    var result = [];
    if (string2.charCodeAt(0) === 46) {
      result.push("");
    }
    string2.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  const stringToPath$1 = stringToPath;
  function toString$1(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object) {
    if (isArray$1(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath$1(toString$1(value));
  }
  var INFINITY = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray$1(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }
  function flatRest(func) {
    return setToString$1(overRest(func, void 0, flatten), func + "");
  }
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  const getPrototype$1 = getPrototype;
  function castArray() {
    if (!arguments.length) {
      return [];
    }
    var value = arguments[0];
    return isArray$1(value) ? value : [value];
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  function baseAssignIn(object, source) {
    return object && copyObject(source, keysIn(source), object);
  }
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function stubArray() {
    return [];
  }
  var objectProto$3 = Object.prototype;
  var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  const getSymbols$1 = getSymbols;
  function copySymbols(source, object) {
    return copyObject(source, getSymbols$1(source), object);
  }
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush(result, getSymbols$1(object));
      object = getPrototype$1(object);
    }
    return result;
  };
  const getSymbolsIn$1 = getSymbolsIn;
  function copySymbolsIn(source, object) {
    return copyObject(source, getSymbolsIn$1(source), object);
  }
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols$1);
  }
  function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn, getSymbolsIn$1);
  }
  var DataView = getNative(root$1, "DataView");
  const DataView$1 = DataView;
  var Promise$1 = getNative(root$1, "Promise");
  const Promise$2 = Promise$1;
  var Set$1 = getNative(root$1, "Set");
  const Set$2 = Set$1;
  var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
  var dataViewTag$3 = "[object DataView]";
  var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$1);
  var getTag = baseGetTag;
  if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3 || Map$2 && getTag(new Map$2()) != mapTag$4 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$3;
          case mapCtorString:
            return mapTag$4;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$4;
          case weakMapCtorString:
            return weakMapTag$1;
        }
      }
      return result;
    };
  }
  const getTag$1 = getTag;
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty$2.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  var Uint8Array$1 = root$1.Uint8Array;
  const Uint8Array$2 = Uint8Array$1;
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$2(result).set(new Uint8Array$2(arrayBuffer));
    return result;
  }
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  var reFlags = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  var boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$2 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$2 = "[object String]", symbolTag$2 = "[object Symbol]";
  var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag$2:
        return cloneArrayBuffer(object);
      case boolTag$2:
      case dateTag$2:
        return new Ctor(+object);
      case dataViewTag$2:
        return cloneDataView(object, isDeep);
      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return cloneTypedArray(object, isDeep);
      case mapTag$3:
        return new Ctor();
      case numberTag$2:
      case stringTag$2:
        return new Ctor(object);
      case regexpTag$2:
        return cloneRegExp(object);
      case setTag$3:
        return new Ctor();
      case symbolTag$2:
        return cloneSymbol(object);
    }
  }
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
  }
  var mapTag$2 = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike(value) && getTag$1(value) == mapTag$2;
  }
  var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;
  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
  const isMap$1 = isMap;
  var setTag$2 = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike(value) && getTag$1(value) == setTag$2;
  }
  var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet;
  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
  const isSet$1 = isSet;
  var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG$1 = 4;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$1 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$1 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject$1(value)) {
      return value;
    }
    var isArr = isArray$1(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer$1(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet$1(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap$1(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  var CLONE_SYMBOLS_FLAG = 4;
  function clone(value) {
    return baseClone(value, CLONE_SYMBOLS_FLAG);
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$2(object), new Uint8Array$2(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray$1(object), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer$1(object)) {
      if (!isBuffer$1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function isStrictComparable(value) {
    return value === value && !isObject$1(value);
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments$1(object));
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  var now = function() {
    return root$1.Date.now();
  };
  const now$1 = now;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax$1 = Math.max, nativeMin$1 = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject$1(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax$1(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now$1());
    }
    function debounced() {
      var time = now$1(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var nativeMax = Math.max, nativeMin = Math.min;
  function findLastIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = length - 1;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
    }
    return baseFindIndex(array, baseIteratee(predicate), index, true);
  }
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isNil(value) {
    return value == null;
  }
  function isUndefined$1(value) {
    return value === void 0;
  }
  function baseSet(object, path, value, customizer) {
    if (!isObject$1(object)) {
      return object;
    }
    path = castPath(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject$1(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object, path);
      if (predicate(value, path)) {
        baseSet(result, castPath(path, object), value);
      }
    }
    return result;
  }
  function basePick(object, paths) {
    return basePickBy(object, paths, function(value, path) {
      return hasIn(object, path);
    });
  }
  var pick = flatRest(function(object, paths) {
    return object == null ? {} : basePick(object, paths);
  });
  const pick$1 = pick;
  function set(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }
  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isElement = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isStringNumber = (val) => {
    if (!isString(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };
  const escapeStringRegexp = (string2 = "") => string2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  const keysOf = (arr) => Object.keys(arr);
  const getProp = (obj, path, defaultValue) => {
    return {
      get value() {
        return get(obj, path, defaultValue);
      },
      set value(val) {
        set(obj, path, val);
      }
    };
  };
  var define_process_env_default$4 = { production: "production" };
  class ElementPlusError extends Error {
    constructor(m) {
      super(m);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m) {
    throw new ElementPlusError(`[${scope}] ${m}`);
  }
  function debugWarn(scope, message2) {
    if (define_process_env_default$4.NODE_ENV !== "production") {
      const error = isString(scope) ? new ElementPlusError(`[${scope}] ${message2}`) : scope;
      console.warn(error);
    }
  }
  const SCOPE$1 = "utils/dom/style";
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString(value)) {
      return value;
    }
    debugWarn(SCOPE$1, "binding value must be a string or number");
  }
  function scrollIntoView(container, selected) {
    if (!isClient$1)
      return;
    if (!selected) {
      container.scrollTop = 0;
      return;
    }
    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer !== null && container !== pointer && container.contains(pointer)) {
      offsetParents.push(pointer);
      pointer = pointer.offsetParent;
    }
    const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;
    if (top < viewRectTop) {
      container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }
  /*! Element Plus Icons Vue v2.3.1 */
  var arrow_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowDown",
    __name: "arrow-down",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        })
      ]));
    }
  });
  var arrow_down_default = arrow_down_vue_vue_type_script_setup_true_lang_default;
  var arrow_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowUp",
    __name: "arrow-up",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
        })
      ]));
    }
  });
  var arrow_up_default = arrow_up_vue_vue_type_script_setup_true_lang_default;
  var circle_check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCheck",
    __name: "circle-check",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
        })
      ]));
    }
  });
  var circle_check_default = circle_check_vue_vue_type_script_setup_true_lang_default;
  var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCloseFilled",
    __name: "circle-close-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
        })
      ]));
    }
  });
  var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
  var circle_close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleClose",
    __name: "circle-close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        })
      ]));
    }
  });
  var circle_close_default = circle_close_vue_vue_type_script_setup_true_lang_default;
  var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Close",
    __name: "close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        })
      ]));
    }
  });
  var close_default = close_vue_vue_type_script_setup_true_lang_default;
  var hide_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Hide",
    __name: "hide",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
        })
      ]));
    }
  });
  var hide_default = hide_vue_vue_type_script_setup_true_lang_default;
  var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "InfoFilled",
    __name: "info-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
        })
      ]));
    }
  });
  var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
  var loading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Loading",
    __name: "loading",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
        })
      ]));
    }
  });
  var loading_default = loading_vue_vue_type_script_setup_true_lang_default;
  var minus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Minus",
    __name: "minus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
        })
      ]));
    }
  });
  var minus_default = minus_vue_vue_type_script_setup_true_lang_default;
  var plus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Plus",
    __name: "plus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
        })
      ]));
    }
  });
  var plus_default = plus_vue_vue_type_script_setup_true_lang_default;
  var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SuccessFilled",
    __name: "success-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
        })
      ]));
    }
  });
  var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
  var view_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "View",
    __name: "view",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
        })
      ]));
    }
  });
  var view_default = view_vue_vue_type_script_setup_true_lang_default;
  var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "WarningFilled",
    __name: "warning-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
        })
      ]));
    }
  });
  var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
  const epPropKey = "__epPropKey";
  const definePropType = (val) => val;
  const isEpProp = (val) => isObject$2(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject$2(prop) || isEpProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
      }
      return valid;
    } : void 0;
    const epProp = {
      type,
      required: !!required,
      validator: _validator,
      [epPropKey]: true
    };
    if (hasOwn(prop, "default"))
      epProp.default = defaultValue;
    return epProp;
  };
  const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
    key,
    buildProp(option, key)
  ]));
  const iconPropType = definePropType([
    String,
    Object,
    Function
  ]);
  const TypeComponents = {
    Close: close_default,
    SuccessFilled: success_filled_default,
    InfoFilled: info_filled_default,
    WarningFilled: warning_filled_default,
    CircleCloseFilled: circle_close_filled_default
  };
  const TypeComponentsMap = {
    success: success_filled_default,
    warning: warning_filled_default,
    error: circle_close_filled_default,
    info: info_filled_default
  };
  const ValidateComponentsMap = {
    validating: loading_default,
    success: circle_check_default,
    error: circle_close_default
  };
  const withInstall = (main2, extra) => {
    main2.install = (app) => {
      for (const comp of [main2, ...Object.values(extra != null ? extra : {})]) {
        app.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main2[key] = comp;
      }
    }
    return main2;
  };
  const withInstallFunction = (fn2, name) => {
    fn2.install = (app) => {
      fn2._context = app._context;
      app.config.globalProperties[name] = fn2;
    };
    return fn2;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };
  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    delete: "Delete",
    backspace: "Backspace",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const CHANGE_EVENT = "change";
  const INPUT_EVENT = "input";
  const componentSizes = ["", "default", "small", "large"];
  const componentSizeMap = {
    large: 40,
    default: 32,
    small: 24
  };
  const getComponentSize = (size) => {
    return componentSizeMap[size || "default"];
  };
  const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
  const isKorean = (text) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text);
  const mutable = (val) => val;
  const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
  const LISTENER_PREFIX = /^on[A-Z]/;
  const useAttrs = (params = {}) => {
    const { excludeListeners = false, excludeKeys } = params;
    const allExcludeKeys = vue.computed(() => {
      return ((excludeKeys == null ? void 0 : excludeKeys.value) || []).concat(DEFAULT_EXCLUDE_KEYS);
    });
    const instance = vue.getCurrentInstance();
    if (!instance) {
      debugWarn("use-attrs", "getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function");
      return vue.computed(() => ({}));
    }
    return vue.computed(() => {
      var _a2;
      return fromPairs(Object.entries((_a2 = instance.proxy) == null ? void 0 : _a2.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
    });
  };
  const useDeprecated = ({ from, replacement, scope, version, ref, type = "API" }, condition) => {
    vue.watch(() => vue.unref(condition), (val) => {
      if (val) {
        debugWarn(scope, `[${type}] ${from} is about to be deprecated in version ${version}, please use ${replacement} instead.
For more detail, please visit: ${ref}
`);
      }
    }, {
      immediate: true
    });
  };
  var English = {
    name: "en",
    el: {
      colorpicker: {
        confirm: "OK",
        clear: "Clear",
        defaultLabel: "color picker",
        description: "current color is {color}. press enter to select a new color."
      },
      datepicker: {
        now: "Now",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        confirm: "OK",
        dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
        monthTablePrompt: "Use the arrow keys and enter to select the month",
        yearTablePrompt: "Use the arrow keys and enter to select the year",
        selectedDate: "Selected date",
        selectDate: "Select date",
        selectTime: "Select time",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        prevYear: "Previous Year",
        nextYear: "Next Year",
        prevMonth: "Previous Month",
        nextMonth: "Next Month",
        year: "",
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        week: "week",
        weeks: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat"
        },
        weeksFull: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday"
        },
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      inputNumber: {
        decrease: "decrease number",
        increase: "increase number"
      },
      select: {
        loading: "Loading",
        noMatch: "No matching data",
        noData: "No data",
        placeholder: "Select"
      },
      dropdown: {
        toggleDropdown: "Toggle Dropdown"
      },
      cascader: {
        noMatch: "No matching data",
        loading: "Loading",
        placeholder: "Select",
        noData: "No data"
      },
      pagination: {
        goto: "Go to",
        pagesize: "/page",
        total: "Total {total}",
        pageClassifier: "",
        page: "Page",
        prev: "Go to previous page",
        next: "Go to next page",
        currentPage: "page {pager}",
        prevPages: "Previous {pager} pages",
        nextPages: "Next {pager} pages",
        deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
      },
      dialog: {
        close: "Close this dialog"
      },
      drawer: {
        close: "Close this dialog"
      },
      messagebox: {
        title: "Message",
        confirm: "OK",
        cancel: "Cancel",
        error: "Illegal input",
        close: "Close this dialog"
      },
      upload: {
        deleteTip: "press delete to remove",
        delete: "Delete",
        preview: "Preview",
        continue: "Continue"
      },
      slider: {
        defaultLabel: "slider between {min} and {max}",
        defaultRangeStartLabel: "pick start value",
        defaultRangeEndLabel: "pick end value"
      },
      table: {
        emptyText: "No Data",
        confirmFilter: "Confirm",
        resetFilter: "Reset",
        clearFilter: "All",
        sumText: "Sum"
      },
      tree: {
        emptyText: "No Data"
      },
      transfer: {
        noMatch: "No matching data",
        noData: "No data",
        titles: ["List 1", "List 2"],
        filterPlaceholder: "Enter keyword",
        noCheckedFormat: "{total} items",
        hasCheckedFormat: "{checked}/{total} checked"
      },
      image: {
        error: "FAILED"
      },
      pageHeader: {
        title: "Back"
      },
      popconfirm: {
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }
    }
  };
  const buildTranslator = (locale) => (path, option) => translate(path, option, vue.unref(locale));
  const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
    var _a2;
    return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
  });
  const buildLocaleContext = (locale) => {
    const lang = vue.computed(() => vue.unref(locale).name);
    const localeRef = vue.isRef(locale) ? locale : vue.ref(locale);
    return {
      lang,
      locale: localeRef,
      t: buildTranslator(locale)
    };
  };
  const localeContextKey = Symbol("localeContextKey");
  const useLocale = (localeOverrides) => {
    const locale = localeOverrides || vue.inject(localeContextKey, vue.ref());
    return buildLocaleContext(vue.computed(() => locale.value || English));
  };
  const defaultNamespace = "el";
  const statePrefix = "is-";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("namespaceContextKey");
  const useGetDerivedNamespace = (namespaceOverrides) => {
    const derivedNamespace = namespaceOverrides || (vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block, namespaceOverrides) => {
    const namespace = useGetDerivedNamespace(namespaceOverrides);
    const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `${statePrefix}${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b,
      e,
      m,
      be: be2,
      em,
      bm,
      bem,
      is,
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const _prop = buildProp({
    type: definePropType(Boolean),
    default: null
  });
  const _event = buildProp({
    type: definePropType(Function)
  });
  const createModelToggleComposable = (name) => {
    const updateEventKey = `update:${name}`;
    const updateEventKeyRaw = `onUpdate:${name}`;
    const useModelToggleEmits2 = [updateEventKey];
    const useModelToggleProps2 = {
      [name]: _prop,
      [updateEventKeyRaw]: _event
    };
    const useModelToggle2 = ({
      indicator,
      toggleReason,
      shouldHideWhenRouteChanges,
      shouldProceed,
      onShow,
      onHide
    }) => {
      const instance = vue.getCurrentInstance();
      const { emit } = instance;
      const props = instance.props;
      const hasUpdateHandler = vue.computed(() => isFunction$1(props[updateEventKeyRaw]));
      const isModelBindingAbsent = vue.computed(() => props[name] === null);
      const doShow = (event) => {
        if (indicator.value === true) {
          return;
        }
        indicator.value = true;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onShow)) {
          onShow(event);
        }
      };
      const doHide = (event) => {
        if (indicator.value === false) {
          return;
        }
        indicator.value = false;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onHide)) {
          onHide(event);
        }
      };
      const show = (event) => {
        if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
          return;
        const shouldEmit = hasUpdateHandler.value && isClient$1;
        if (shouldEmit) {
          emit(updateEventKey, true);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doShow(event);
        }
      };
      const hide = (event) => {
        if (props.disabled === true || !isClient$1)
          return;
        const shouldEmit = hasUpdateHandler.value && isClient$1;
        if (shouldEmit) {
          emit(updateEventKey, false);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doHide(event);
        }
      };
      const onChange = (val) => {
        if (!isBoolean(val))
          return;
        if (props.disabled && val) {
          if (hasUpdateHandler.value) {
            emit(updateEventKey, false);
          }
        } else if (indicator.value !== val) {
          if (val) {
            doShow();
          } else {
            doHide();
          }
        }
      };
      const toggle = () => {
        if (indicator.value) {
          hide();
        } else {
          show();
        }
      };
      vue.watch(() => props[name], onChange);
      if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
        vue.watch(() => ({
          ...instance.proxy.$route
        }), () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        });
      }
      vue.onMounted(() => {
        onChange(props[name]);
      });
      return {
        hide,
        show,
        toggle,
        hasUpdateHandler
      };
    };
    return {
      useModelToggle: useModelToggle2,
      useModelToggleProps: useModelToggleProps2,
      useModelToggleEmits: useModelToggleEmits2
    };
  };
  createModelToggleComposable("modelValue");
  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
    });
  };
  var E = "top", R = "bottom", W = "right", P = "left", me = "auto", G = [E, R, W, P], U = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
    return t.concat([e + "-" + U, e + "-" + J]);
  }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
    return t.concat([e, e + "-" + U, e + "-" + J]);
  }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
  function C(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function H(t) {
    if (t == null)
      return window;
    if (t.toString() !== "[object Window]") {
      var e = t.ownerDocument;
      return e && e.defaultView || window;
    }
    return t;
  }
  function Q(t) {
    var e = H(t).Element;
    return t instanceof e || t instanceof Element;
  }
  function B(t) {
    var e = H(t).HTMLElement;
    return t instanceof e || t instanceof HTMLElement;
  }
  function Pe(t) {
    if (typeof ShadowRoot == "undefined")
      return false;
    var e = H(t).ShadowRoot;
    return t instanceof e || t instanceof ShadowRoot;
  }
  function Mt(t) {
    var e = t.state;
    Object.keys(e.elements).forEach(function(n) {
      var r = e.styles[n] || {}, o = e.attributes[n] || {}, i = e.elements[n];
      !B(i) || !C(i) || (Object.assign(i.style, r), Object.keys(o).forEach(function(a) {
        var s = o[a];
        s === false ? i.removeAttribute(a) : i.setAttribute(a, s === true ? "" : s);
      }));
    });
  }
  function Rt(t) {
    var e = t.state, n = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
    return Object.assign(e.elements.popper.style, n.popper), e.styles = n, e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow), function() {
      Object.keys(e.elements).forEach(function(r) {
        var o = e.elements[r], i = e.attributes[r] || {}, a = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]), s = a.reduce(function(f2, c) {
          return f2[c] = "", f2;
        }, {});
        !B(o) || !C(o) || (Object.assign(o.style, s), Object.keys(i).forEach(function(f2) {
          o.removeAttribute(f2);
        }));
      });
    };
  }
  var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
  function q(t) {
    return t.split("-")[0];
  }
  var X = Math.max, ve = Math.min, Z = Math.round;
  function ee(t, e) {
    e === void 0 && (e = false);
    var n = t.getBoundingClientRect(), r = 1, o = 1;
    if (B(t) && e) {
      var i = t.offsetHeight, a = t.offsetWidth;
      a > 0 && (r = Z(n.width) / a || 1), i > 0 && (o = Z(n.height) / i || 1);
    }
    return { width: n.width / r, height: n.height / o, top: n.top / o, right: n.right / r, bottom: n.bottom / o, left: n.left / r, x: n.left / r, y: n.top / o };
  }
  function ke(t) {
    var e = ee(t), n = t.offsetWidth, r = t.offsetHeight;
    return Math.abs(e.width - n) <= 1 && (n = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), { x: t.offsetLeft, y: t.offsetTop, width: n, height: r };
  }
  function it(t, e) {
    var n = e.getRootNode && e.getRootNode();
    if (t.contains(e))
      return true;
    if (n && Pe(n)) {
      var r = e;
      do {
        if (r && t.isSameNode(r))
          return true;
        r = r.parentNode || r.host;
      } while (r);
    }
    return false;
  }
  function N(t) {
    return H(t).getComputedStyle(t);
  }
  function Wt(t) {
    return ["table", "td", "th"].indexOf(C(t)) >= 0;
  }
  function I(t) {
    return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
  }
  function ge(t) {
    return C(t) === "html" ? t : t.assignedSlot || t.parentNode || (Pe(t) ? t.host : null) || I(t);
  }
  function at(t) {
    return !B(t) || N(t).position === "fixed" ? null : t.offsetParent;
  }
  function Bt(t) {
    var e = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
    if (n && B(t)) {
      var r = N(t);
      if (r.position === "fixed")
        return null;
    }
    var o = ge(t);
    for (Pe(o) && (o = o.host); B(o) && ["html", "body"].indexOf(C(o)) < 0; ) {
      var i = N(o);
      if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none")
        return o;
      o = o.parentNode;
    }
    return null;
  }
  function se(t) {
    for (var e = H(t), n = at(t); n && Wt(n) && N(n).position === "static"; )
      n = at(n);
    return n && (C(n) === "html" || C(n) === "body" && N(n).position === "static") ? e : n || Bt(t) || e;
  }
  function Le(t) {
    return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
  }
  function fe(t, e, n) {
    return X(t, ve(e, n));
  }
  function St(t, e, n) {
    var r = fe(t, e, n);
    return r > n ? n : r;
  }
  function st() {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  function ft(t) {
    return Object.assign({}, st(), t);
  }
  function ct(t, e) {
    return e.reduce(function(n, r) {
      return n[r] = t, n;
    }, {});
  }
  var Tt = function(t, e) {
    return t = typeof t == "function" ? t(Object.assign({}, e.rects, { placement: e.placement })) : t, ft(typeof t != "number" ? t : ct(t, G));
  };
  function Ht(t) {
    var e, n = t.state, r = t.name, o = t.options, i = n.elements.arrow, a = n.modifiersData.popperOffsets, s = q(n.placement), f2 = Le(s), c = [P, W].indexOf(s) >= 0, u = c ? "height" : "width";
    if (!(!i || !a)) {
      var m = Tt(o.padding, n), v = ke(i), l = f2 === "y" ? E : P, h = f2 === "y" ? R : W, p = n.rects.reference[u] + n.rects.reference[f2] - a[f2] - n.rects.popper[u], g = a[f2] - n.rects.reference[f2], x = se(i), y = x ? f2 === "y" ? x.clientHeight || 0 : x.clientWidth || 0 : 0, $ = p / 2 - g / 2, d = m[l], b = y - v[u] - m[h], w = y / 2 - v[u] / 2 + $, O = fe(d, w, b), j = f2;
      n.modifiersData[r] = (e = {}, e[j] = O, e.centerOffset = O - w, e);
    }
  }
  function Ct(t) {
    var e = t.state, n = t.options, r = n.element, o = r === void 0 ? "[data-popper-arrow]" : r;
    o != null && (typeof o == "string" && (o = e.elements.popper.querySelector(o), !o) || !it(e.elements.popper, o) || (e.elements.arrow = o));
  }
  var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
  function te(t) {
    return t.split("-")[1];
  }
  var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function Vt(t) {
    var e = t.x, n = t.y, r = window, o = r.devicePixelRatio || 1;
    return { x: Z(e * o) / o || 0, y: Z(n * o) / o || 0 };
  }
  function ut(t) {
    var e, n = t.popper, r = t.popperRect, o = t.placement, i = t.variation, a = t.offsets, s = t.position, f2 = t.gpuAcceleration, c = t.adaptive, u = t.roundOffsets, m = t.isFixed, v = a.x, l = v === void 0 ? 0 : v, h = a.y, p = h === void 0 ? 0 : h, g = typeof u == "function" ? u({ x: l, y: p }) : { x: l, y: p };
    l = g.x, p = g.y;
    var x = a.hasOwnProperty("x"), y = a.hasOwnProperty("y"), $ = P, d = E, b = window;
    if (c) {
      var w = se(n), O = "clientHeight", j = "clientWidth";
      if (w === H(n) && (w = I(n), N(w).position !== "static" && s === "absolute" && (O = "scrollHeight", j = "scrollWidth")), w = w, o === E || (o === P || o === W) && i === J) {
        d = R;
        var A = m && w === b && b.visualViewport ? b.visualViewport.height : w[O];
        p -= A - r.height, p *= f2 ? 1 : -1;
      }
      if (o === P || (o === E || o === R) && i === J) {
        $ = W;
        var k = m && w === b && b.visualViewport ? b.visualViewport.width : w[j];
        l -= k - r.width, l *= f2 ? 1 : -1;
      }
    }
    var D = Object.assign({ position: s }, c && qt), S = u === true ? Vt({ x: l, y: p }) : { x: l, y: p };
    if (l = S.x, p = S.y, f2) {
      var L;
      return Object.assign({}, D, (L = {}, L[d] = y ? "0" : "", L[$] = x ? "0" : "", L.transform = (b.devicePixelRatio || 1) <= 1 ? "translate(" + l + "px, " + p + "px)" : "translate3d(" + l + "px, " + p + "px, 0)", L));
    }
    return Object.assign({}, D, (e = {}, e[d] = y ? p + "px" : "", e[$] = x ? l + "px" : "", e.transform = "", e));
  }
  function Nt(t) {
    var e = t.state, n = t.options, r = n.gpuAcceleration, o = r === void 0 ? true : r, i = n.adaptive, a = i === void 0 ? true : i, s = n.roundOffsets, f2 = s === void 0 ? true : s, c = { placement: q(e.placement), variation: te(e.placement), popper: e.elements.popper, popperRect: e.rects.popper, gpuAcceleration: o, isFixed: e.options.strategy === "fixed" };
    e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ut(Object.assign({}, c, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: a, roundOffsets: f2 })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ut(Object.assign({}, c, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f2 })))), e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement });
  }
  var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
  function It(t) {
    var e = t.state, n = t.instance, r = t.options, o = r.scroll, i = o === void 0 ? true : o, a = r.resize, s = a === void 0 ? true : a, f2 = H(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
    return i && c.forEach(function(u) {
      u.addEventListener("scroll", n.update, ye);
    }), s && f2.addEventListener("resize", n.update, ye), function() {
      i && c.forEach(function(u) {
        u.removeEventListener("scroll", n.update, ye);
      }), s && f2.removeEventListener("resize", n.update, ye);
    };
  }
  var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
  }, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function be(t) {
    return t.replace(/left|right|bottom|top/g, function(e) {
      return _t[e];
    });
  }
  var zt = { start: "end", end: "start" };
  function lt(t) {
    return t.replace(/start|end/g, function(e) {
      return zt[e];
    });
  }
  function We(t) {
    var e = H(t), n = e.pageXOffset, r = e.pageYOffset;
    return { scrollLeft: n, scrollTop: r };
  }
  function Be(t) {
    return ee(I(t)).left + We(t).scrollLeft;
  }
  function Ft(t) {
    var e = H(t), n = I(t), r = e.visualViewport, o = n.clientWidth, i = n.clientHeight, a = 0, s = 0;
    return r && (o = r.width, i = r.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a = r.offsetLeft, s = r.offsetTop)), { width: o, height: i, x: a + Be(t), y: s };
  }
  function Ut(t) {
    var e, n = I(t), r = We(t), o = (e = t.ownerDocument) == null ? void 0 : e.body, i = X(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = X(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), s = -r.scrollLeft + Be(t), f2 = -r.scrollTop;
    return N(o || n).direction === "rtl" && (s += X(n.clientWidth, o ? o.clientWidth : 0) - i), { width: i, height: a, x: s, y: f2 };
  }
  function Se(t) {
    var e = N(t), n = e.overflow, r = e.overflowX, o = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + o + r);
  }
  function dt(t) {
    return ["html", "body", "#document"].indexOf(C(t)) >= 0 ? t.ownerDocument.body : B(t) && Se(t) ? t : dt(ge(t));
  }
  function ce(t, e) {
    var n;
    e === void 0 && (e = []);
    var r = dt(t), o = r === ((n = t.ownerDocument) == null ? void 0 : n.body), i = H(r), a = o ? [i].concat(i.visualViewport || [], Se(r) ? r : []) : r, s = e.concat(a);
    return o ? s : s.concat(ce(ge(a)));
  }
  function Te(t) {
    return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
  }
  function Xt(t) {
    var e = ee(t);
    return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e;
  }
  function ht(t, e) {
    return e === je ? Te(Ft(t)) : Q(e) ? Xt(e) : Te(Ut(I(t)));
  }
  function Yt(t) {
    var e = ce(ge(t)), n = ["absolute", "fixed"].indexOf(N(t).position) >= 0, r = n && B(t) ? se(t) : t;
    return Q(r) ? e.filter(function(o) {
      return Q(o) && it(o, r) && C(o) !== "body";
    }) : [];
  }
  function Gt(t, e, n) {
    var r = e === "clippingParents" ? Yt(t) : [].concat(e), o = [].concat(r, [n]), i = o[0], a = o.reduce(function(s, f2) {
      var c = ht(t, f2);
      return s.top = X(c.top, s.top), s.right = ve(c.right, s.right), s.bottom = ve(c.bottom, s.bottom), s.left = X(c.left, s.left), s;
    }, ht(t, i));
    return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
  }
  function mt(t) {
    var e = t.reference, n = t.element, r = t.placement, o = r ? q(r) : null, i = r ? te(r) : null, a = e.x + e.width / 2 - n.width / 2, s = e.y + e.height / 2 - n.height / 2, f2;
    switch (o) {
      case E:
        f2 = { x: a, y: e.y - n.height };
        break;
      case R:
        f2 = { x: a, y: e.y + e.height };
        break;
      case W:
        f2 = { x: e.x + e.width, y: s };
        break;
      case P:
        f2 = { x: e.x - n.width, y: s };
        break;
      default:
        f2 = { x: e.x, y: e.y };
    }
    var c = o ? Le(o) : null;
    if (c != null) {
      var u = c === "y" ? "height" : "width";
      switch (i) {
        case U:
          f2[c] = f2[c] - (e[u] / 2 - n[u] / 2);
          break;
        case J:
          f2[c] = f2[c] + (e[u] / 2 - n[u] / 2);
          break;
      }
    }
    return f2;
  }
  function ne(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o = r === void 0 ? t.placement : r, i = n.boundary, a = i === void 0 ? Xe : i, s = n.rootBoundary, f2 = s === void 0 ? je : s, c = n.elementContext, u = c === void 0 ? K : c, m = n.altBoundary, v = m === void 0 ? false : m, l = n.padding, h = l === void 0 ? 0 : l, p = ft(typeof h != "number" ? h : ct(h, G)), g = u === K ? Ye : K, x = t.rects.popper, y = t.elements[v ? g : u], $ = Gt(Q(y) ? y : y.contextElement || I(t.elements.popper), a, f2), d = ee(t.elements.reference), b = mt({ reference: d, element: x, strategy: "absolute", placement: o }), w = Te(Object.assign({}, x, b)), O = u === K ? w : d, j = { top: $.top - O.top + p.top, bottom: O.bottom - $.bottom + p.bottom, left: $.left - O.left + p.left, right: O.right - $.right + p.right }, A = t.modifiersData.offset;
    if (u === K && A) {
      var k = A[o];
      Object.keys(j).forEach(function(D) {
        var S = [W, R].indexOf(D) >= 0 ? 1 : -1, L = [E, R].indexOf(D) >= 0 ? "y" : "x";
        j[D] += k[L] * S;
      });
    }
    return j;
  }
  function Jt(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o = n.boundary, i = n.rootBoundary, a = n.padding, s = n.flipVariations, f2 = n.allowedAutoPlacements, c = f2 === void 0 ? Ee : f2, u = te(r), m = u ? s ? De : De.filter(function(h) {
      return te(h) === u;
    }) : G, v = m.filter(function(h) {
      return c.indexOf(h) >= 0;
    });
    v.length === 0 && (v = m);
    var l = v.reduce(function(h, p) {
      return h[p] = ne(t, { placement: p, boundary: o, rootBoundary: i, padding: a })[q(p)], h;
    }, {});
    return Object.keys(l).sort(function(h, p) {
      return l[h] - l[p];
    });
  }
  function Kt(t) {
    if (q(t) === me)
      return [];
    var e = be(t);
    return [lt(t), e, lt(e)];
  }
  function Qt(t) {
    var e = t.state, n = t.options, r = t.name;
    if (!e.modifiersData[r]._skip) {
      for (var o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? true : a, f2 = n.fallbackPlacements, c = n.padding, u = n.boundary, m = n.rootBoundary, v = n.altBoundary, l = n.flipVariations, h = l === void 0 ? true : l, p = n.allowedAutoPlacements, g = e.options.placement, x = q(g), y = x === g, $ = f2 || (y || !h ? [be(g)] : Kt(g)), d = [g].concat($).reduce(function(z, V) {
        return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u, rootBoundary: m, padding: c, flipVariations: h, allowedAutoPlacements: p }) : V);
      }, []), b = e.rects.reference, w = e.rects.popper, O = /* @__PURE__ */ new Map(), j = true, A = d[0], k = 0; k < d.length; k++) {
        var D = d[k], S = q(D), L = te(D) === U, re = [E, R].indexOf(S) >= 0, oe = re ? "width" : "height", M = ne(e, { placement: D, boundary: u, rootBoundary: m, altBoundary: v, padding: c }), T = re ? L ? W : P : L ? R : E;
        b[oe] > w[oe] && (T = be(T));
        var pe = be(T), _ = [];
        if (i && _.push(M[S] <= 0), s && _.push(M[T] <= 0, M[pe] <= 0), _.every(function(z) {
          return z;
        })) {
          A = D, j = false;
          break;
        }
        O.set(D, _);
      }
      if (j)
        for (var ue = h ? 3 : 1, xe = function(z) {
          var V = d.find(function(de) {
            var ae = O.get(de);
            if (ae)
              return ae.slice(0, z).every(function(Y) {
                return Y;
              });
          });
          if (V)
            return A = V, "break";
        }, ie = ue; ie > 0; ie--) {
          var le = xe(ie);
          if (le === "break")
            break;
        }
      e.placement !== A && (e.modifiersData[r]._skip = true, e.placement = A, e.reset = true);
    }
  }
  var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
  function gt(t, e, n) {
    return n === void 0 && (n = { x: 0, y: 0 }), { top: t.top - e.height - n.y, right: t.right - e.width + n.x, bottom: t.bottom - e.height + n.y, left: t.left - e.width - n.x };
  }
  function yt(t) {
    return [E, W, R, P].some(function(e) {
      return t[e] >= 0;
    });
  }
  function Zt(t) {
    var e = t.state, n = t.name, r = e.rects.reference, o = e.rects.popper, i = e.modifiersData.preventOverflow, a = ne(e, { elementContext: "reference" }), s = ne(e, { altBoundary: true }), f2 = gt(a, r), c = gt(s, o, i), u = yt(f2), m = yt(c);
    e.modifiersData[n] = { referenceClippingOffsets: f2, popperEscapeOffsets: c, isReferenceHidden: u, hasPopperEscaped: m }, e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": u, "data-popper-escaped": m });
  }
  var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
  function en(t, e, n) {
    var r = q(t), o = [P, E].indexOf(r) >= 0 ? -1 : 1, i = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n, a = i[0], s = i[1];
    return a = a || 0, s = (s || 0) * o, [P, W].indexOf(r) >= 0 ? { x: s, y: a } : { x: a, y: s };
  }
  function tn(t) {
    var e = t.state, n = t.options, r = t.name, o = n.offset, i = o === void 0 ? [0, 0] : o, a = Ee.reduce(function(u, m) {
      return u[m] = en(m, e.rects, i), u;
    }, {}), s = a[e.placement], f2 = s.x, c = s.y;
    e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f2, e.modifiersData.popperOffsets.y += c), e.modifiersData[r] = a;
  }
  var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
  function nn(t) {
    var e = t.state, n = t.name;
    e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
  }
  var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
  function rn(t) {
    return t === "x" ? "y" : "x";
  }
  function on(t) {
    var e = t.state, n = t.options, r = t.name, o = n.mainAxis, i = o === void 0 ? true : o, a = n.altAxis, s = a === void 0 ? false : a, f2 = n.boundary, c = n.rootBoundary, u = n.altBoundary, m = n.padding, v = n.tether, l = v === void 0 ? true : v, h = n.tetherOffset, p = h === void 0 ? 0 : h, g = ne(e, { boundary: f2, rootBoundary: c, padding: m, altBoundary: u }), x = q(e.placement), y = te(e.placement), $ = !y, d = Le(x), b = rn(d), w = e.modifiersData.popperOffsets, O = e.rects.reference, j = e.rects.popper, A = typeof p == "function" ? p(Object.assign({}, e.rects, { placement: e.placement })) : p, k = typeof A == "number" ? { mainAxis: A, altAxis: A } : Object.assign({ mainAxis: 0, altAxis: 0 }, A), D = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S = { x: 0, y: 0 };
    if (w) {
      if (i) {
        var L, re = d === "y" ? E : P, oe = d === "y" ? R : W, M = d === "y" ? "height" : "width", T = w[d], pe = T + g[re], _ = T - g[oe], ue = l ? -j[M] / 2 : 0, xe = y === U ? O[M] : j[M], ie = y === U ? -j[M] : -O[M], le = e.elements.arrow, z = l && le ? ke(le) : { width: 0, height: 0 }, V = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : st(), de = V[re], ae = V[oe], Y = fe(0, O[M], z[M]), jt = $ ? O[M] / 2 - ue - Y - de - k.mainAxis : xe - Y - de - k.mainAxis, Dt = $ ? -O[M] / 2 + ue + Y + ae + k.mainAxis : ie + Y + ae + k.mainAxis, Oe = e.elements.arrow && se(e.elements.arrow), Et = Oe ? d === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L = D == null ? void 0 : D[d]) != null ? L : 0, Pt = T + jt - Ce - Et, At = T + Dt - Ce, qe = fe(l ? ve(pe, Pt) : pe, T, l ? X(_, At) : _);
        w[d] = qe, S[d] = qe - T;
      }
      if (s) {
        var Ve, kt = d === "x" ? E : P, Lt = d === "x" ? R : W, F = w[b], he = b === "y" ? "height" : "width", Ne = F + g[kt], Ie = F - g[Lt], $e = [E, P].indexOf(x) !== -1, _e = (Ve = D == null ? void 0 : D[b]) != null ? Ve : 0, ze = $e ? Ne : F - O[he] - j[he] - _e + k.altAxis, Fe = $e ? F + O[he] + j[he] - _e - k.altAxis : Ie, Ue = l && $e ? St(ze, F, Fe) : fe(l ? ze : Ne, F, l ? Fe : Ie);
        w[b] = Ue, S[b] = Ue - F;
      }
      e.modifiersData[r] = S;
    }
  }
  var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
  function an(t) {
    return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
  }
  function sn(t) {
    return t === H(t) || !B(t) ? We(t) : an(t);
  }
  function fn(t) {
    var e = t.getBoundingClientRect(), n = Z(e.width) / t.offsetWidth || 1, r = Z(e.height) / t.offsetHeight || 1;
    return n !== 1 || r !== 1;
  }
  function cn(t, e, n) {
    n === void 0 && (n = false);
    var r = B(e), o = B(e) && fn(e), i = I(e), a = ee(t, o), s = { scrollLeft: 0, scrollTop: 0 }, f2 = { x: 0, y: 0 };
    return (r || !r && !n) && ((C(e) !== "body" || Se(i)) && (s = sn(e)), B(e) ? (f2 = ee(e, true), f2.x += e.clientLeft, f2.y += e.clientTop) : i && (f2.x = Be(i))), { x: a.left + s.scrollLeft - f2.x, y: a.top + s.scrollTop - f2.y, width: a.width, height: a.height };
  }
  function pn(t) {
    var e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
    t.forEach(function(i) {
      e.set(i.name, i);
    });
    function o(i) {
      n.add(i.name);
      var a = [].concat(i.requires || [], i.requiresIfExists || []);
      a.forEach(function(s) {
        if (!n.has(s)) {
          var f2 = e.get(s);
          f2 && o(f2);
        }
      }), r.push(i);
    }
    return t.forEach(function(i) {
      n.has(i.name) || o(i);
    }), r;
  }
  function un(t) {
    var e = pn(t);
    return ot.reduce(function(n, r) {
      return n.concat(e.filter(function(o) {
        return o.phase === r;
      }));
    }, []);
  }
  function ln(t) {
    var e;
    return function() {
      return e || (e = new Promise(function(n) {
        Promise.resolve().then(function() {
          e = void 0, n(t());
        });
      })), e;
    };
  }
  function dn(t) {
    var e = t.reduce(function(n, r) {
      var o = n[r.name];
      return n[r.name] = o ? Object.assign({}, o, r, { options: Object.assign({}, o.options, r.options), data: Object.assign({}, o.data, r.data) }) : r, n;
    }, {});
    return Object.keys(e).map(function(n) {
      return e[n];
    });
  }
  var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function $t() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return !e.some(function(r) {
      return !(r && typeof r.getBoundingClientRect == "function");
    });
  }
  function we(t) {
    t === void 0 && (t = {});
    var e = t, n = e.defaultModifiers, r = n === void 0 ? [] : n, o = e.defaultOptions, i = o === void 0 ? Ot : o;
    return function(a, s, f2) {
      f2 === void 0 && (f2 = i);
      var c = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i), modifiersData: {}, elements: { reference: a, popper: s }, attributes: {}, styles: {} }, u = [], m = false, v = { state: c, setOptions: function(p) {
        var g = typeof p == "function" ? p(c.options) : p;
        h(), c.options = Object.assign({}, i, c.options, g), c.scrollParents = { reference: Q(a) ? ce(a) : a.contextElement ? ce(a.contextElement) : [], popper: ce(s) };
        var x = un(dn([].concat(r, c.options.modifiers)));
        return c.orderedModifiers = x.filter(function(y) {
          return y.enabled;
        }), l(), v.update();
      }, forceUpdate: function() {
        if (!m) {
          var p = c.elements, g = p.reference, x = p.popper;
          if ($t(g, x)) {
            c.rects = { reference: cn(g, se(x), c.options.strategy === "fixed"), popper: ke(x) }, c.reset = false, c.placement = c.options.placement, c.orderedModifiers.forEach(function(j) {
              return c.modifiersData[j.name] = Object.assign({}, j.data);
            });
            for (var y = 0; y < c.orderedModifiers.length; y++) {
              if (c.reset === true) {
                c.reset = false, y = -1;
                continue;
              }
              var $ = c.orderedModifiers[y], d = $.fn, b = $.options, w = b === void 0 ? {} : b, O = $.name;
              typeof d == "function" && (c = d({ state: c, options: w, name: O, instance: v }) || c);
            }
          }
        }
      }, update: ln(function() {
        return new Promise(function(p) {
          v.forceUpdate(), p(c);
        });
      }), destroy: function() {
        h(), m = true;
      } };
      if (!$t(a, s))
        return v;
      v.setOptions(f2).then(function(p) {
        !m && f2.onFirstUpdate && f2.onFirstUpdate(p);
      });
      function l() {
        c.orderedModifiers.forEach(function(p) {
          var g = p.name, x = p.options, y = x === void 0 ? {} : x, $ = p.effect;
          if (typeof $ == "function") {
            var d = $({ state: c, name: g, instance: v, options: y }), b = function() {
            };
            u.push(d || b);
          }
        });
      }
      function h() {
        u.forEach(function(p) {
          return p();
        }), u = [];
      }
      return v;
    };
  }
  we();
  var mn = [Re, He, Me, Ae];
  we({ defaultModifiers: mn });
  var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
  const usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
    const stateUpdater = {
      name: "updateState",
      enabled: true,
      phase: "write",
      fn: ({ state }) => {
        const derivedState = deriveState(state);
        Object.assign(states.value, derivedState);
      },
      requires: ["computeStyles"]
    };
    const options = vue.computed(() => {
      const { onFirstUpdate, placement, strategy, modifiers } = vue.unref(opts);
      return {
        onFirstUpdate,
        placement: placement || "bottom",
        strategy: strategy || "absolute",
        modifiers: [
          ...modifiers || [],
          stateUpdater,
          { name: "applyStyles", enabled: false }
        ]
      };
    });
    const instanceRef = vue.shallowRef();
    const states = vue.ref({
      styles: {
        popper: {
          position: vue.unref(options).strategy,
          left: "0",
          top: "0"
        },
        arrow: {
          position: "absolute"
        }
      },
      attributes: {}
    });
    const destroy = () => {
      if (!instanceRef.value)
        return;
      instanceRef.value.destroy();
      instanceRef.value = void 0;
    };
    vue.watch(options, (newOptions) => {
      const instance = vue.unref(instanceRef);
      if (instance) {
        instance.setOptions(newOptions);
      }
    }, {
      deep: true
    });
    vue.watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
      destroy();
      if (!referenceElement || !popperElement)
        return;
      instanceRef.value = yn(referenceElement, popperElement, vue.unref(options));
    });
    vue.onBeforeUnmount(() => {
      destroy();
    });
    return {
      state: vue.computed(() => {
        var _a2;
        return { ...((_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.state) || {} };
      }),
      styles: vue.computed(() => vue.unref(states).styles),
      attributes: vue.computed(() => vue.unref(states).attributes),
      update: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.update();
      },
      forceUpdate: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.forceUpdate();
      },
      instanceRef: vue.computed(() => vue.unref(instanceRef))
    };
  };
  function deriveState(state) {
    const elements = Object.keys(state.elements);
    const styles = fromPairs(elements.map((element) => [element, state.styles[element] || {}]));
    const attributes = fromPairs(elements.map((element) => [element, state.attributes[element]]));
    return {
      styles,
      attributes
    };
  }
  function useTimeout() {
    let timeoutHandle;
    const registerTimeout = (fn2, delay) => {
      cancelTimeout();
      timeoutHandle = window.setTimeout(fn2, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose$1(() => cancelTimeout());
    return {
      registerTimeout,
      cancelTimeout
    };
  }
  const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 1e4),
    current: 0
  };
  const ID_INJECTION_KEY = Symbol("elIdInjection");
  const useIdInjection = () => {
    return vue.getCurrentInstance() ? vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
  };
  const useId = (deterministicId) => {
    const idInjection = useIdInjection();
    if (!isClient$1 && idInjection === defaultIdInjection) {
      debugWarn("IdInjection", `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);
    }
    const namespace = useGetDerivedNamespace();
    const idRef = vue.computed(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
  };
  let registeredEscapeHandlers = [];
  const cachedHandler = (e) => {
    const event = e;
    if (event.key === EVENT_CODE.esc) {
      registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
    }
  };
  const useEscapeKeydown = (handler) => {
    vue.onMounted(() => {
      if (registeredEscapeHandlers.length === 0) {
        document.addEventListener("keydown", cachedHandler);
      }
      if (isClient$1)
        registeredEscapeHandlers.push(handler);
    });
    vue.onBeforeUnmount(() => {
      registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
      if (registeredEscapeHandlers.length === 0) {
        if (isClient$1)
          document.removeEventListener("keydown", cachedHandler);
      }
    });
  };
  var define_process_env_default$3 = { production: "production" };
  let cachedContainer;
  const usePopperContainerId = () => {
    const namespace = useGetDerivedNamespace();
    const idInjection = useIdInjection();
    const id = vue.computed(() => {
      return `${namespace.value}-popper-container-${idInjection.prefix}`;
    });
    const selector = vue.computed(() => `#${id.value}`);
    return {
      id,
      selector
    };
  };
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };
  const usePopperContainer = () => {
    const { id, selector } = usePopperContainerId();
    vue.onBeforeMount(() => {
      if (!isClient$1)
        return;
      if (define_process_env_default$3.NODE_ENV === "test" || !cachedContainer && !document.body.querySelector(selector.value)) {
        cachedContainer = createContainer(id.value);
      }
    });
    return {
      id,
      selector
    };
  };
  const useDelayedToggleProps = buildProps({
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    autoClose: {
      type: Number,
      default: 0
    }
  });
  const useDelayedToggle = ({
    showAfter,
    hideAfter,
    autoClose,
    open,
    close
  }) => {
    const { registerTimeout } = useTimeout();
    const {
      registerTimeout: registerTimeoutForAutoClose,
      cancelTimeout: cancelTimeoutForAutoClose
    } = useTimeout();
    const onOpen = (event) => {
      registerTimeout(() => {
        open(event);
        const _autoClose = vue.unref(autoClose);
        if (isNumber(_autoClose) && _autoClose > 0) {
          registerTimeoutForAutoClose(() => {
            close(event);
          }, _autoClose);
        }
      }, vue.unref(showAfter));
    };
    const onClose = (event) => {
      cancelTimeoutForAutoClose();
      registerTimeout(() => {
        close(event);
      }, vue.unref(hideAfter));
    };
    return {
      onOpen,
      onClose
    };
  };
  const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
  const useForwardRef = (forwardRef) => {
    const setForwardRef = (el) => {
      forwardRef.value = el;
    };
    vue.provide(FORWARD_REF_INJECTION_KEY, {
      setForwardRef
    });
  };
  const useForwardRefDirective = (setForwardRef) => {
    return {
      mounted(el) {
        setForwardRef(el);
      },
      updated(el) {
        setForwardRef(el);
      },
      unmounted() {
        setForwardRef(null);
      }
    };
  };
  const zIndex = vue.ref(0);
  const defaultInitialZIndex = 2e3;
  const zIndexContextKey = Symbol("zIndexContextKey");
  const useZIndex = (zIndexOverrides) => {
    const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
    const initialZIndex = vue.computed(() => {
      const zIndexFromInjection = vue.unref(zIndexInjection);
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      zIndex.value++;
      return currentZIndex.value;
    };
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };
  function useCursor(input) {
    const selectionRef = vue.ref();
    function recordCursor() {
      if (input.value == void 0)
        return;
      const { selectionStart, selectionEnd, value } = input.value;
      if (selectionStart == null || selectionEnd == null)
        return;
      const beforeTxt = value.slice(0, Math.max(0, selectionStart));
      const afterTxt = value.slice(Math.max(0, selectionEnd));
      selectionRef.value = {
        selectionStart,
        selectionEnd,
        value,
        beforeTxt,
        afterTxt
      };
    }
    function setCursor() {
      if (input.value == void 0 || selectionRef.value == void 0)
        return;
      const { value } = input.value;
      const { beforeTxt, afterTxt, selectionStart } = selectionRef.value;
      if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0)
        return;
      let startPos = value.length;
      if (value.endsWith(afterTxt)) {
        startPos = value.length - afterTxt.length;
      } else if (value.startsWith(beforeTxt)) {
        startPos = beforeTxt.length;
      } else {
        const beforeLastChar = beforeTxt[selectionStart - 1];
        const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
        if (newIndex !== -1) {
          startPos = newIndex + 1;
        }
      }
      input.value.setSelectionRange(startPos, startPos);
    }
    return [recordCursor, setCursor];
  }
  const useSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  const SIZE_INJECTION_KEY = Symbol("size");
  const useGlobalSize = () => {
    const injectedSize = vue.inject(SIZE_INJECTION_KEY, {});
    return vue.computed(() => {
      return vue.unref(injectedSize.size) || "";
    });
  };
  function useFocusController(target, { afterFocus, beforeBlur, afterBlur } = {}) {
    const instance = vue.getCurrentInstance();
    const { emit } = instance;
    const wrapperRef = vue.shallowRef();
    const isFocused = vue.ref(false);
    const handleFocus = (event) => {
      if (isFocused.value)
        return;
      isFocused.value = true;
      emit("focus", event);
      afterFocus == null ? void 0 : afterFocus();
    };
    const handleBlur = (event) => {
      var _a2;
      const cancelBlur = isFunction$1(beforeBlur) ? beforeBlur(event) : false;
      if (cancelBlur || event.relatedTarget && ((_a2 = wrapperRef.value) == null ? void 0 : _a2.contains(event.relatedTarget)))
        return;
      isFocused.value = false;
      emit("blur", event);
      afterBlur == null ? void 0 : afterBlur();
    };
    const handleClick = () => {
      var _a2;
      (_a2 = target.value) == null ? void 0 : _a2.focus();
    };
    vue.watch(wrapperRef, (el) => {
      if (el) {
        el.setAttribute("tabindex", "-1");
      }
    });
    useEventListener$1(wrapperRef, "click", handleClick);
    return {
      wrapperRef,
      isFocused,
      handleFocus,
      handleBlur
    };
  }
  const configProviderContextKey = Symbol();
  const globalConfig = vue.ref();
  function useGlobalConfig(key, defaultValue = void 0) {
    const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
    if (key) {
      return vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = config.value) == null ? void 0 : _a2[key]) != null ? _b : defaultValue;
      });
    } else {
      return config;
    }
  }
  function useGlobalComponentSettings(block, sizeFallback) {
    const config = useGlobalConfig();
    const ns = useNamespace(block, vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.namespace) || defaultNamespace;
    }));
    const locale = useLocale(vue.computed(() => {
      var _a2;
      return (_a2 = config.value) == null ? void 0 : _a2.locale;
    }));
    const zIndex2 = useZIndex(vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.zIndex) || defaultInitialZIndex;
    }));
    const size = vue.computed(() => {
      var _a2;
      return vue.unref(sizeFallback) || ((_a2 = config.value) == null ? void 0 : _a2.size) || "";
    });
    provideGlobalConfig(vue.computed(() => vue.unref(config) || {}));
    return {
      ns,
      locale,
      zIndex: zIndex2,
      size
    };
  }
  const provideGlobalConfig = (config, app, global2 = false) => {
    var _a2;
    const inSetup = !!vue.getCurrentInstance();
    const oldConfig = inSetup ? useGlobalConfig() : void 0;
    const provideFn = (_a2 = app == null ? void 0 : app.provide) != null ? _a2 : inSetup ? vue.provide : void 0;
    if (!provideFn) {
      debugWarn("provideGlobalConfig", "provideGlobalConfig() can only be used inside setup().");
      return;
    }
    const context = vue.computed(() => {
      const cfg = vue.unref(config);
      if (!(oldConfig == null ? void 0 : oldConfig.value))
        return cfg;
      return mergeConfig(oldConfig.value, cfg);
    });
    provideFn(configProviderContextKey, context);
    provideFn(localeContextKey, vue.computed(() => context.value.locale));
    provideFn(namespaceContextKey, vue.computed(() => context.value.namespace));
    provideFn(zIndexContextKey, vue.computed(() => context.value.zIndex));
    provideFn(SIZE_INJECTION_KEY, {
      size: vue.computed(() => context.value.size || "")
    });
    if (global2 || !globalConfig.value) {
      globalConfig.value = context.value;
    }
    return context;
  };
  const mergeConfig = (a, b) => {
    var _a2;
    const keys2 = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
    const obj = {};
    for (const key of keys2) {
      obj[key] = (_a2 = b[key]) != null ? _a2 : a[key];
    }
    return obj;
  };
  const configProviderProps = buildProps({
    a11y: {
      type: Boolean,
      default: true
    },
    locale: {
      type: definePropType(Object)
    },
    size: useSizeProp,
    button: {
      type: definePropType(Object)
    },
    experimentalFeatures: {
      type: definePropType(Object)
    },
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    message: {
      type: definePropType(Object)
    },
    zIndex: Number,
    namespace: {
      type: String,
      default: "el"
    }
  });
  const messageConfig = {};
  vue.defineComponent({
    name: "ElConfigProvider",
    props: configProviderProps,
    setup(props, { slots }) {
      vue.watch(() => props.message, (val) => {
        Object.assign(messageConfig, val != null ? val : {});
      }, { immediate: true, deep: true });
      const config = provideGlobalConfig(props);
      return () => vue.renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
    }
  });
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const iconProps = buildProps({
    size: {
      type: definePropType([Number, String])
    },
    color: {
      type: String
    }
  });
  const __default__$k = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$t = /* @__PURE__ */ vue.defineComponent({
    ...__default__$k,
    props: iconProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("icon");
      const style = vue.computed(() => {
        const { size, color } = props;
        if (!size && !color)
          return {};
        return {
          fontSize: isUndefined(size) ? void 0 : addUnit(size),
          "--color": color
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
          class: vue.unref(ns).b(),
          style: vue.unref(style)
        }, _ctx.$attrs), [
          vue.renderSlot(_ctx.$slots, "default")
        ], 16);
      };
    }
  });
  var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");
  const useFormSize = (fallback, ignore = {}) => {
    const emptyRef = vue.ref(void 0);
    const size = ignore.prop ? emptyRef : useProp("size");
    const globalConfig2 = ignore.global ? emptyRef : useGlobalSize();
    const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
    return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig2.value || "");
  };
  const useFormDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = vue.inject(formContextKey, void 0);
    return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  const useFormItem = () => {
    const form = vue.inject(formContextKey, void 0);
    const formItem = vue.inject(formItemContextKey, void 0);
    return {
      form,
      formItem
    };
  };
  const useFormItemInputId = (props, {
    formItemContext,
    disableIdGeneration,
    disableIdManagement
  }) => {
    if (!disableIdGeneration) {
      disableIdGeneration = vue.ref(false);
    }
    if (!disableIdManagement) {
      disableIdManagement = vue.ref(false);
    }
    const inputId = vue.ref();
    let idUnwatch = void 0;
    const isLabeledByFormItem = vue.computed(() => {
      var _a2;
      return !!(!props.label && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
    });
    vue.onMounted(() => {
      idUnwatch = vue.watch([vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
        const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
        if (newId !== inputId.value) {
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
              formItemContext.addInputId(newId);
            }
          }
          inputId.value = newId;
        }
      }, { immediate: true });
    });
    vue.onUnmounted(() => {
      idUnwatch && idUnwatch();
      if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
        inputId.value && formItemContext.removeInputId(inputId.value);
      }
    });
    return {
      isLabeledByFormItem,
      inputId
    };
  };
  const formMetaProps = buildProps({
    size: {
      type: String,
      values: componentSizes
    },
    disabled: Boolean
  });
  const formProps = buildProps({
    ...formMetaProps,
    model: Object,
    rules: {
      type: definePropType(Object)
    },
    labelPosition: {
      type: String,
      values: ["left", "right", "top"],
      default: "right"
    },
    requireAsteriskPosition: {
      type: String,
      values: ["left", "right"],
      default: "left"
    },
    labelWidth: {
      type: [String, Number],
      default: ""
    },
    labelSuffix: {
      type: String,
      default: ""
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: Boolean,
    scrollToError: Boolean,
    scrollIntoViewOptions: {
      type: [Object, Boolean]
    }
  });
  const formEmits = {
    validate: (prop, isValid, message2) => (isArray$2(prop) || isString(prop)) && isBoolean(isValid) && isString(message2)
  };
  const SCOPE = "ElForm";
  function useFormLabelWidth() {
    const potentialLabelWidthArr = vue.ref([]);
    const autoLabelWidth = vue.computed(() => {
      if (!potentialLabelWidthArr.value.length)
        return "0";
      const max = Math.max(...potentialLabelWidthArr.value);
      return max ? `${max}px` : "";
    });
    function getLabelWidthIndex(width) {
      const index = potentialLabelWidthArr.value.indexOf(width);
      if (index === -1 && autoLabelWidth.value === "0") {
        debugWarn(SCOPE, `unexpected width ${width}`);
      }
      return index;
    }
    function registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = getLabelWidthIndex(oldVal);
        potentialLabelWidthArr.value.splice(index, 1, val);
      } else if (val) {
        potentialLabelWidthArr.value.push(val);
      }
    }
    function deregisterLabelWidth(val) {
      const index = getLabelWidthIndex(val);
      if (index > -1) {
        potentialLabelWidthArr.value.splice(index, 1);
      }
    }
    return {
      autoLabelWidth,
      registerLabelWidth,
      deregisterLabelWidth
    };
  }
  const filterFields = (fields, props) => {
    const normalized = castArray(props);
    return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
  };
  const COMPONENT_NAME$4 = "ElForm";
  const __default__$j = vue.defineComponent({
    name: COMPONENT_NAME$4
  });
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    ...__default__$j,
    props: formProps,
    emits: formEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const fields = [];
      const formSize = useFormSize();
      const ns = useNamespace("form");
      const formClasses = vue.computed(() => {
        const { labelPosition, inline } = props;
        return [
          ns.b(),
          ns.m(formSize.value || "default"),
          {
            [ns.m(`label-${labelPosition}`)]: labelPosition,
            [ns.m("inline")]: inline
          }
        ];
      });
      const addField = (field) => {
        fields.push(field);
      };
      const removeField = (field) => {
        if (field.prop) {
          fields.splice(fields.indexOf(field), 1);
        }
      };
      const resetFields = (properties = []) => {
        if (!props.model) {
          debugWarn(COMPONENT_NAME$4, "model is required for resetFields to work.");
          return;
        }
        filterFields(fields, properties).forEach((field) => field.resetField());
      };
      const clearValidate = (props2 = []) => {
        filterFields(fields, props2).forEach((field) => field.clearValidate());
      };
      const isValidatable = vue.computed(() => {
        const hasModel = !!props.model;
        if (!hasModel) {
          debugWarn(COMPONENT_NAME$4, "model is required for validate to work.");
        }
        return hasModel;
      });
      const obtainValidateFields = (props2) => {
        if (fields.length === 0)
          return [];
        const filteredFields = filterFields(fields, props2);
        if (!filteredFields.length) {
          debugWarn(COMPONENT_NAME$4, "please pass correct props!");
          return [];
        }
        return filteredFields;
      };
      const validate2 = async (callback) => validateField(void 0, callback);
      const doValidateField = async (props2 = []) => {
        if (!isValidatable.value)
          return false;
        const fields2 = obtainValidateFields(props2);
        if (fields2.length === 0)
          return true;
        let validationErrors = {};
        for (const field of fields2) {
          try {
            await field.validate("");
          } catch (fields3) {
            validationErrors = {
              ...validationErrors,
              ...fields3
            };
          }
        }
        if (Object.keys(validationErrors).length === 0)
          return true;
        return Promise.reject(validationErrors);
      };
      const validateField = async (modelProps = [], callback) => {
        const shouldThrow = !isFunction$1(callback);
        try {
          const result = await doValidateField(modelProps);
          if (result === true) {
            callback == null ? void 0 : callback(result);
          }
          return result;
        } catch (e) {
          if (e instanceof Error)
            throw e;
          const invalidFields = e;
          if (props.scrollToError) {
            scrollToField(Object.keys(invalidFields)[0]);
          }
          callback == null ? void 0 : callback(false, invalidFields);
          return shouldThrow && Promise.reject(invalidFields);
        }
      };
      const scrollToField = (prop) => {
        var _a2;
        const field = filterFields(fields, prop)[0];
        if (field) {
          (_a2 = field.$el) == null ? void 0 : _a2.scrollIntoView(props.scrollIntoViewOptions);
        }
      };
      vue.watch(() => props.rules, () => {
        if (props.validateOnRuleChange) {
          validate2().catch((err) => debugWarn(err));
        }
      }, { deep: true });
      vue.provide(formContextKey, vue.reactive({
        ...vue.toRefs(props),
        emit,
        resetFields,
        clearValidate,
        validateField,
        addField,
        removeField,
        ...useFormLabelWidth()
      }));
      expose({
        validate: validate2,
        validateField,
        resetFields,
        clearValidate,
        scrollToField
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("form", {
          class: vue.normalizeClass(vue.unref(formClasses))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var Form = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__file", "form.vue"]]);
  var define_process_env_default$2 = { production: "production" };
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn2) {
    return Function.toString.call(fn2).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  var formatRegExp = /%[sdj%]/g;
  var warning = function warning2() {
  };
  if (typeof process !== "undefined" && define_process_env_default$2 && define_process_env_default$2.NODE_ENV !== "production" && typeof window !== "undefined" && typeof document !== "undefined") {
    warning = function warning3(type4, errors) {
      if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
        if (errors.every(function(e) {
          return typeof e === "string";
        })) {
          console.warn(type4, errors);
        }
      }
    };
  }
  function convertFieldsError(errors) {
    if (!errors || !errors.length)
      return null;
    var fields = {};
    errors.forEach(function(error) {
      var field = error.field;
      fields[field] = fields[field] || [];
      fields[field].push(error);
    });
    return fields;
  }
  function format(template) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var i = 0;
    var len = args.length;
    if (typeof template === "function") {
      return template.apply(null, args);
    }
    if (typeof template === "string") {
      var str = template.replace(formatRegExp, function(x) {
        if (x === "%%") {
          return "%";
        }
        if (i >= len) {
          return x;
        }
        switch (x) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
            break;
          default:
            return x;
        }
      });
      return str;
    }
    return template;
  }
  function isNativeStringType(type4) {
    return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
  }
  function isEmptyValue(value, type4) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (type4 === "array" && Array.isArray(value) && !value.length) {
      return true;
    }
    if (isNativeStringType(type4) && typeof value === "string" && !value) {
      return true;
    }
    return false;
  }
  function asyncParallelArray(arr, func, callback) {
    var results = [];
    var total = 0;
    var arrLength = arr.length;
    function count(errors) {
      results.push.apply(results, errors || []);
      total++;
      if (total === arrLength) {
        callback(results);
      }
    }
    arr.forEach(function(a) {
      func(a, count);
    });
  }
  function asyncSerialArray(arr, func, callback) {
    var index = 0;
    var arrLength = arr.length;
    function next(errors) {
      if (errors && errors.length) {
        callback(errors);
        return;
      }
      var original = index;
      index = index + 1;
      if (original < arrLength) {
        func(arr[original], next);
      } else {
        callback([]);
      }
    }
    next([]);
  }
  function flattenObjArr(objArr) {
    var ret = [];
    Object.keys(objArr).forEach(function(k) {
      ret.push.apply(ret, objArr[k] || []);
    });
    return ret;
  }
  var AsyncValidationError = /* @__PURE__ */ function(_Error) {
    _inheritsLoose(AsyncValidationError2, _Error);
    function AsyncValidationError2(errors, fields) {
      var _this;
      _this = _Error.call(this, "Async Validation Error") || this;
      _this.errors = errors;
      _this.fields = fields;
      return _this;
    }
    return AsyncValidationError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  function asyncMap(objArr, option, func, callback, source) {
    if (option.first) {
      var _pending = new Promise(function(resolve, reject) {
        var next = function next2(errors) {
          callback(errors);
          return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
        };
        var flattenArr = flattenObjArr(objArr);
        asyncSerialArray(flattenArr, func, next);
      });
      _pending["catch"](function(e) {
        return e;
      });
      return _pending;
    }
    var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
    var objArrKeys = Object.keys(objArr);
    var objArrLength = objArrKeys.length;
    var total = 0;
    var results = [];
    var pending = new Promise(function(resolve, reject) {
      var next = function next2(errors) {
        results.push.apply(results, errors);
        total++;
        if (total === objArrLength) {
          callback(results);
          return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
        }
      };
      if (!objArrKeys.length) {
        callback(results);
        resolve(source);
      }
      objArrKeys.forEach(function(key) {
        var arr = objArr[key];
        if (firstFields.indexOf(key) !== -1) {
          asyncSerialArray(arr, func, next);
        } else {
          asyncParallelArray(arr, func, next);
        }
      });
    });
    pending["catch"](function(e) {
      return e;
    });
    return pending;
  }
  function isErrorObj(obj) {
    return !!(obj && obj.message !== void 0);
  }
  function getValue(value, path) {
    var v = value;
    for (var i = 0; i < path.length; i++) {
      if (v == void 0) {
        return v;
      }
      v = v[path[i]];
    }
    return v;
  }
  function complementError(rule, source) {
    return function(oe) {
      var fieldValue;
      if (rule.fullFields) {
        fieldValue = getValue(source, rule.fullFields);
      } else {
        fieldValue = source[oe.field || rule.fullField];
      }
      if (isErrorObj(oe)) {
        oe.field = oe.field || rule.fullField;
        oe.fieldValue = fieldValue;
        return oe;
      }
      return {
        message: typeof oe === "function" ? oe() : oe,
        fieldValue,
        field: oe.field || rule.fullField
      };
    };
  }
  function deepMerge(target, source) {
    if (source) {
      for (var s in source) {
        if (source.hasOwnProperty(s)) {
          var value = source[s];
          if (typeof value === "object" && typeof target[s] === "object") {
            target[s] = _extends({}, target[s], value);
          } else {
            target[s] = value;
          }
        }
      }
    }
    return target;
  }
  var required$1 = function required(rule, value, source, errors, options, type4) {
    if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
      errors.push(format(options.messages.required, rule.fullField));
    }
  };
  var whitespace = function whitespace2(rule, value, source, errors, options) {
    if (/^\s+$/.test(value) || value === "") {
      errors.push(format(options.messages.whitespace, rule.fullField));
    }
  };
  var urlReg;
  var getUrlRegex = function() {
    if (urlReg) {
      return urlReg;
    }
    var word = "[a-fA-F\\d:]";
    var b = function b2(options) {
      return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
    };
    var v42 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
    var v6seg = "[a-fA-F\\d]{1,4}";
    var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v42 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v42 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v42 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v42 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v42 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v42 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v42 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    var v46Exact = new RegExp("(?:^" + v42 + "$)|(?:^" + v6 + "$)");
    var v4exact = new RegExp("^" + v42 + "$");
    var v6exact = new RegExp("^" + v6 + "$");
    var ip = function ip2(options) {
      return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v42 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
    };
    ip.v4 = function(options) {
      return options && options.exact ? v4exact : new RegExp("" + b(options) + v42 + b(options), "g");
    };
    ip.v6 = function(options) {
      return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
    };
    var protocol = "(?:(?:[a-z]+:)?//)";
    var auth = "(?:\\S+(?::\\S*)?@)?";
    var ipv4 = ip.v4().source;
    var ipv6 = ip.v6().source;
    var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
    var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
    var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
    var port = "(?::\\d{2,5})?";
    var path = '(?:[/?#][^\\s"]*)?';
    var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
    urlReg = new RegExp("(?:^" + regex + "$)", "i");
    return urlReg;
  };
  var pattern$2 = {
    // http://emailregex.com/
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
    // url: new RegExp(
    //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    //   'i',
    // ),
    hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
  };
  var types = {
    integer: function integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    "float": function float(value) {
      return types.number(value) && !types.integer(value);
    },
    array: function array(value) {
      return Array.isArray(value);
    },
    regexp: function regexp(value) {
      if (value instanceof RegExp) {
        return true;
      }
      try {
        return !!new RegExp(value);
      } catch (e) {
        return false;
      }
    },
    date: function date(value) {
      return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
    },
    number: function number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    object: function object(value) {
      return typeof value === "object" && !types.array(value);
    },
    method: function method(value) {
      return typeof value === "function";
    },
    email: function email(value) {
      return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
    },
    url: function url(value) {
      return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
    },
    hex: function hex(value) {
      return typeof value === "string" && !!value.match(pattern$2.hex);
    }
  };
  var type$1 = function type(rule, value, source, errors, options) {
    if (rule.required && value === void 0) {
      required$1(rule, value, source, errors, options);
      return;
    }
    var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) > -1) {
      if (!types[ruleType](value)) {
        errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
      }
    } else if (ruleType && typeof value !== rule.type) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
  };
  var range = function range2(rule, value, source, errors, options) {
    var len = typeof rule.len === "number";
    var min = typeof rule.min === "number";
    var max = typeof rule.max === "number";
    var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var val = value;
    var key = null;
    var num = typeof value === "number";
    var str = typeof value === "string";
    var arr = Array.isArray(value);
    if (num) {
      key = "number";
    } else if (str) {
      key = "string";
    } else if (arr) {
      key = "array";
    }
    if (!key) {
      return false;
    }
    if (arr) {
      val = value.length;
    }
    if (str) {
      val = value.replace(spRegexp, "_").length;
    }
    if (len) {
      if (val !== rule.len) {
        errors.push(format(options.messages[key].len, rule.fullField, rule.len));
      }
    } else if (min && !max && val < rule.min) {
      errors.push(format(options.messages[key].min, rule.fullField, rule.min));
    } else if (max && !min && val > rule.max) {
      errors.push(format(options.messages[key].max, rule.fullField, rule.max));
    } else if (min && max && (val < rule.min || val > rule.max)) {
      errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
    }
  };
  var ENUM$1 = "enum";
  var enumerable$1 = function enumerable(rule, value, source, errors, options) {
    rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
    if (rule[ENUM$1].indexOf(value) === -1) {
      errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
    }
  };
  var pattern$1 = function pattern(rule, value, source, errors, options) {
    if (rule.pattern) {
      if (rule.pattern instanceof RegExp) {
        rule.pattern.lastIndex = 0;
        if (!rule.pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      } else if (typeof rule.pattern === "string") {
        var _pattern = new RegExp(rule.pattern);
        if (!_pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      }
    }
  };
  var rules = {
    required: required$1,
    whitespace,
    type: type$1,
    range,
    "enum": enumerable$1,
    pattern: pattern$1
  };
  var string = function string2(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value, "string") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, "string");
      if (!isEmptyValue(value, "string")) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
        rules.pattern(rule, value, source, errors, options);
        if (rule.whitespace === true) {
          rules.whitespace(rule, value, source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var method2 = function method3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var number2 = function number3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (value === "") {
        value = void 0;
      }
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var _boolean = function _boolean2(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var regexp2 = function regexp3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var integer2 = function integer3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var floatFn = function floatFn2(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var array2 = function array3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if ((value === void 0 || value === null) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, "array");
      if (value !== void 0 && value !== null) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var object2 = function object3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var ENUM = "enum";
  var enumerable2 = function enumerable3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules[ENUM](rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var pattern2 = function pattern3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value, "string") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, "string")) {
        rules.pattern(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var date2 = function date3(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value, "date") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, "date")) {
        var dateObject;
        if (value instanceof Date) {
          dateObject = value;
        } else {
          dateObject = new Date(value);
        }
        rules.type(rule, dateObject, source, errors, options);
        if (dateObject) {
          rules.range(rule, dateObject.getTime(), source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var required2 = function required3(rule, value, callback, source, options) {
    var errors = [];
    var type4 = Array.isArray(value) ? "array" : typeof value;
    rules.required(rule, value, source, errors, options, type4);
    callback(errors);
  };
  var type2 = function type3(rule, value, callback, source, options) {
    var ruleType = rule.type;
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value, ruleType) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, ruleType);
      if (!isEmptyValue(value, ruleType)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var any = function any2(rule, value, callback, source, options) {
    var errors = [];
    var validate2 = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate2) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
    }
    callback(errors);
  };
  var validators = {
    string,
    method: method2,
    number: number2,
    "boolean": _boolean,
    regexp: regexp2,
    integer: integer2,
    "float": floatFn,
    array: array2,
    object: object2,
    "enum": enumerable2,
    pattern: pattern2,
    date: date2,
    url: type2,
    hex: type2,
    email: type2,
    required: required2,
    any
  };
  function newMessages() {
    return {
      "default": "Validation error on field %s",
      required: "%s is required",
      "enum": "%s must be one of %s",
      whitespace: "%s cannot be empty",
      date: {
        format: "%s date %s is invalid for format %s",
        parse: "%s date could not be parsed, %s is invalid ",
        invalid: "%s date %s is invalid"
      },
      types: {
        string: "%s is not a %s",
        method: "%s is not a %s (function)",
        array: "%s is not an %s",
        object: "%s is not an %s",
        number: "%s is not a %s",
        date: "%s is not a %s",
        "boolean": "%s is not a %s",
        integer: "%s is not an %s",
        "float": "%s is not a %s",
        regexp: "%s is not a valid %s",
        email: "%s is not a valid %s",
        url: "%s is not a valid %s",
        hex: "%s is not a valid %s"
      },
      string: {
        len: "%s must be exactly %s characters",
        min: "%s must be at least %s characters",
        max: "%s cannot be longer than %s characters",
        range: "%s must be between %s and %s characters"
      },
      number: {
        len: "%s must equal %s",
        min: "%s cannot be less than %s",
        max: "%s cannot be greater than %s",
        range: "%s must be between %s and %s"
      },
      array: {
        len: "%s must be exactly %s in length",
        min: "%s cannot be less than %s in length",
        max: "%s cannot be greater than %s in length",
        range: "%s must be between %s and %s in length"
      },
      pattern: {
        mismatch: "%s value %s does not match pattern %s"
      },
      clone: function clone2() {
        var cloned = JSON.parse(JSON.stringify(this));
        cloned.clone = this.clone;
        return cloned;
      }
    };
  }
  var messages = newMessages();
  var Schema = /* @__PURE__ */ function() {
    function Schema2(descriptor) {
      this.rules = null;
      this._messages = messages;
      this.define(descriptor);
    }
    var _proto = Schema2.prototype;
    _proto.define = function define2(rules2) {
      var _this = this;
      if (!rules2) {
        throw new Error("Cannot configure a schema with no rules");
      }
      if (typeof rules2 !== "object" || Array.isArray(rules2)) {
        throw new Error("Rules must be an object");
      }
      this.rules = {};
      Object.keys(rules2).forEach(function(name) {
        var item = rules2[name];
        _this.rules[name] = Array.isArray(item) ? item : [item];
      });
    };
    _proto.messages = function messages2(_messages) {
      if (_messages) {
        this._messages = deepMerge(newMessages(), _messages);
      }
      return this._messages;
    };
    _proto.validate = function validate2(source_, o, oc) {
      var _this2 = this;
      if (o === void 0) {
        o = {};
      }
      if (oc === void 0) {
        oc = function oc2() {
        };
      }
      var source = source_;
      var options = o;
      var callback = oc;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback(null, source);
        }
        return Promise.resolve(source);
      }
      function complete(results) {
        var errors = [];
        var fields = {};
        function add(e) {
          if (Array.isArray(e)) {
            var _errors;
            errors = (_errors = errors).concat.apply(_errors, e);
          } else {
            errors.push(e);
          }
        }
        for (var i = 0; i < results.length; i++) {
          add(results[i]);
        }
        if (!errors.length) {
          callback(null, source);
        } else {
          fields = convertFieldsError(errors);
          callback(errors, fields);
        }
      }
      if (options.messages) {
        var messages$1 = this.messages();
        if (messages$1 === messages) {
          messages$1 = newMessages();
        }
        deepMerge(messages$1, options.messages);
        options.messages = messages$1;
      } else {
        options.messages = this.messages();
      }
      var series = {};
      var keys2 = options.keys || Object.keys(this.rules);
      keys2.forEach(function(z) {
        var arr = _this2.rules[z];
        var value = source[z];
        arr.forEach(function(r) {
          var rule = r;
          if (typeof rule.transform === "function") {
            if (source === source_) {
              source = _extends({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (typeof rule === "function") {
            rule = {
              validator: rule
            };
          } else {
            rule = _extends({}, rule);
          }
          rule.validator = _this2.getValidationMethod(rule);
          if (!rule.validator) {
            return;
          }
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = _this2.getType(rule);
          series[z] = series[z] || [];
          series[z].push({
            rule,
            value,
            source,
            field: z
          });
        });
      });
      var errorFields = {};
      return asyncMap(series, options, function(data, doIt) {
        var rule = data.rule;
        var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullField(key, schema) {
          return _extends({}, schema, {
            fullField: rule.fullField + "." + key,
            fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
          });
        }
        function cb(e) {
          if (e === void 0) {
            e = [];
          }
          var errorList = Array.isArray(e) ? e : [e];
          if (!options.suppressWarning && errorList.length) {
            Schema2.warning("async-validator:", errorList);
          }
          if (errorList.length && rule.message !== void 0) {
            errorList = [].concat(rule.message);
          }
          var filledErrors = errorList.map(complementError(rule, source));
          if (options.first && filledErrors.length) {
            errorFields[rule.field] = 1;
            return doIt(filledErrors);
          }
          if (!deep) {
            doIt(filledErrors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message !== void 0) {
                filledErrors = [].concat(rule.message).map(complementError(rule, source));
              } else if (options.error) {
                filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
              }
              return doIt(filledErrors);
            }
            var fieldsSchema = {};
            if (rule.defaultField) {
              Object.keys(data.value).map(function(key) {
                fieldsSchema[key] = rule.defaultField;
              });
            }
            fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
            var paredFieldsSchema = {};
            Object.keys(fieldsSchema).forEach(function(field) {
              var fieldSchema = fieldsSchema[field];
              var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
              paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
            });
            var schema = new Schema2(paredFieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function(errs) {
              var finalErrors = [];
              if (filledErrors && filledErrors.length) {
                finalErrors.push.apply(finalErrors, filledErrors);
              }
              if (errs && errs.length) {
                finalErrors.push.apply(finalErrors, errs);
              }
              doIt(finalErrors.length ? finalErrors : null);
            });
          }
        }
        var res;
        if (rule.asyncValidator) {
          res = rule.asyncValidator(rule, data.value, cb, data.source, options);
        } else if (rule.validator) {
          try {
            res = rule.validator(rule, data.value, cb, data.source, options);
          } catch (error) {
            console.error == null ? void 0 : console.error(error);
            if (!options.suppressValidatorError) {
              setTimeout(function() {
                throw error;
              }, 0);
            }
            cb(error.message);
          }
          if (res === true) {
            cb();
          } else if (res === false) {
            cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
          } else if (res instanceof Array) {
            cb(res);
          } else if (res instanceof Error) {
            cb(res.message);
          }
        }
        if (res && res.then) {
          res.then(function() {
            return cb();
          }, function(e) {
            return cb(e);
          });
        }
      }, function(results) {
        complete(results);
      }, source);
    };
    _proto.getType = function getType(rule) {
      if (rule.type === void 0 && rule.pattern instanceof RegExp) {
        rule.type = "pattern";
      }
      if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
        throw new Error(format("Unknown rule type %s", rule.type));
      }
      return rule.type || "string";
    };
    _proto.getValidationMethod = function getValidationMethod(rule) {
      if (typeof rule.validator === "function") {
        return rule.validator;
      }
      var keys2 = Object.keys(rule);
      var messageIndex = keys2.indexOf("message");
      if (messageIndex !== -1) {
        keys2.splice(messageIndex, 1);
      }
      if (keys2.length === 1 && keys2[0] === "required") {
        return validators.required;
      }
      return validators[this.getType(rule)] || void 0;
    };
    return Schema2;
  }();
  Schema.register = function register(type4, validator) {
    if (typeof validator !== "function") {
      throw new Error("Cannot register a validator by type, validator is not a function");
    }
    validators[type4] = validator;
  };
  Schema.warning = warning;
  Schema.messages = messages;
  Schema.validators = validators;
  const formItemValidateStates = [
    "",
    "error",
    "validating",
    "success"
  ];
  const formItemProps = buildProps({
    label: String,
    labelWidth: {
      type: [String, Number],
      default: ""
    },
    prop: {
      type: definePropType([String, Array])
    },
    required: {
      type: Boolean,
      default: void 0
    },
    rules: {
      type: definePropType([Object, Array])
    },
    error: String,
    validateStatus: {
      type: String,
      values: formItemValidateStates
    },
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ""
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      values: componentSizes
    }
  });
  const COMPONENT_NAME$3 = "ElLabelWrap";
  var FormLabelWrap = vue.defineComponent({
    name: COMPONENT_NAME$3,
    props: {
      isAutoWidth: Boolean,
      updateAll: Boolean
    },
    setup(props, {
      slots
    }) {
      const formContext = vue.inject(formContextKey, void 0);
      const formItemContext = vue.inject(formItemContextKey);
      if (!formItemContext)
        throwError(COMPONENT_NAME$3, "usage: <el-form-item><label-wrap /></el-form-item>");
      const ns = useNamespace("form");
      const el = vue.ref();
      const computedWidth = vue.ref(0);
      const getLabelWidth = () => {
        var _a2;
        if ((_a2 = el.value) == null ? void 0 : _a2.firstElementChild) {
          const width = window.getComputedStyle(el.value.firstElementChild).width;
          return Math.ceil(Number.parseFloat(width));
        } else {
          return 0;
        }
      };
      const updateLabelWidth = (action = "update") => {
        vue.nextTick(() => {
          if (slots.default && props.isAutoWidth) {
            if (action === "update") {
              computedWidth.value = getLabelWidth();
            } else if (action === "remove") {
              formContext == null ? void 0 : formContext.deregisterLabelWidth(computedWidth.value);
            }
          }
        });
      };
      const updateLabelWidthFn = () => updateLabelWidth("update");
      vue.onMounted(() => {
        updateLabelWidthFn();
      });
      vue.onBeforeUnmount(() => {
        updateLabelWidth("remove");
      });
      vue.onUpdated(() => updateLabelWidthFn());
      vue.watch(computedWidth, (val, oldVal) => {
        if (props.updateAll) {
          formContext == null ? void 0 : formContext.registerLabelWidth(val, oldVal);
        }
      });
      useResizeObserver(vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = el.value) == null ? void 0 : _a2.firstElementChild) != null ? _b : null;
      }), updateLabelWidthFn);
      return () => {
        var _a2, _b;
        if (!slots)
          return null;
        const {
          isAutoWidth
        } = props;
        if (isAutoWidth) {
          const autoLabelWidth = formContext == null ? void 0 : formContext.autoLabelWidth;
          const hasLabel = formItemContext == null ? void 0 : formItemContext.hasLabel;
          const style = {};
          if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
            const marginWidth = Math.max(0, Number.parseInt(autoLabelWidth, 10) - computedWidth.value);
            const marginPosition = formContext.labelPosition === "left" ? "marginRight" : "marginLeft";
            if (marginWidth) {
              style[marginPosition] = `${marginWidth}px`;
            }
          }
          return vue.createVNode("div", {
            "ref": el,
            "class": [ns.be("item", "label-wrap")],
            "style": style
          }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)]);
        } else {
          return vue.createVNode(vue.Fragment, {
            "ref": el
          }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]);
        }
      };
    }
  });
  const _hoisted_1$b = ["role", "aria-labelledby"];
  const __default__$i = vue.defineComponent({
    name: "ElFormItem"
  });
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    ...__default__$i,
    props: formItemProps,
    setup(__props, { expose }) {
      const props = __props;
      const slots = vue.useSlots();
      const formContext = vue.inject(formContextKey, void 0);
      const parentFormItemContext = vue.inject(formItemContextKey, void 0);
      const _size = useFormSize(void 0, { formItem: false });
      const ns = useNamespace("form-item");
      const labelId = useId().value;
      const inputIds = vue.ref([]);
      const validateState = vue.ref("");
      const validateStateDebounced = refDebounced(validateState, 100);
      const validateMessage = vue.ref("");
      const formItemRef = vue.ref();
      let initialValue = void 0;
      let isResettingField = false;
      const labelStyle = vue.computed(() => {
        if ((formContext == null ? void 0 : formContext.labelPosition) === "top") {
          return {};
        }
        const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
        if (labelWidth)
          return { width: labelWidth };
        return {};
      });
      const contentStyle = vue.computed(() => {
        if ((formContext == null ? void 0 : formContext.labelPosition) === "top" || (formContext == null ? void 0 : formContext.inline)) {
          return {};
        }
        if (!props.label && !props.labelWidth && isNested) {
          return {};
        }
        const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
        if (!props.label && !slots.label) {
          return { marginLeft: labelWidth };
        }
        return {};
      });
      const formItemClasses = vue.computed(() => [
        ns.b(),
        ns.m(_size.value),
        ns.is("error", validateState.value === "error"),
        ns.is("validating", validateState.value === "validating"),
        ns.is("success", validateState.value === "success"),
        ns.is("required", isRequired.value || props.required),
        ns.is("no-asterisk", formContext == null ? void 0 : formContext.hideRequiredAsterisk),
        (formContext == null ? void 0 : formContext.requireAsteriskPosition) === "right" ? "asterisk-right" : "asterisk-left",
        { [ns.m("feedback")]: formContext == null ? void 0 : formContext.statusIcon }
      ]);
      const _inlineMessage = vue.computed(() => isBoolean(props.inlineMessage) ? props.inlineMessage : (formContext == null ? void 0 : formContext.inlineMessage) || false);
      const validateClasses = vue.computed(() => [
        ns.e("error"),
        { [ns.em("error", "inline")]: _inlineMessage.value }
      ]);
      const propString = vue.computed(() => {
        if (!props.prop)
          return "";
        return isString(props.prop) ? props.prop : props.prop.join(".");
      });
      const hasLabel = vue.computed(() => {
        return !!(props.label || slots.label);
      });
      const labelFor = vue.computed(() => {
        return props.for || (inputIds.value.length === 1 ? inputIds.value[0] : void 0);
      });
      const isGroup = vue.computed(() => {
        return !labelFor.value && hasLabel.value;
      });
      const isNested = !!parentFormItemContext;
      const fieldValue = vue.computed(() => {
        const model = formContext == null ? void 0 : formContext.model;
        if (!model || !props.prop) {
          return;
        }
        return getProp(model, props.prop).value;
      });
      const normalizedRules = vue.computed(() => {
        const { required } = props;
        const rules2 = [];
        if (props.rules) {
          rules2.push(...castArray(props.rules));
        }
        const formRules = formContext == null ? void 0 : formContext.rules;
        if (formRules && props.prop) {
          const _rules = getProp(formRules, props.prop).value;
          if (_rules) {
            rules2.push(...castArray(_rules));
          }
        }
        if (required !== void 0) {
          const requiredRules = rules2.map((rule, i) => [rule, i]).filter(([rule]) => Object.keys(rule).includes("required"));
          if (requiredRules.length > 0) {
            for (const [rule, i] of requiredRules) {
              if (rule.required === required)
                continue;
              rules2[i] = { ...rule, required };
            }
          } else {
            rules2.push({ required });
          }
        }
        return rules2;
      });
      const validateEnabled = vue.computed(() => normalizedRules.value.length > 0);
      const getFilteredRule = (trigger) => {
        const rules2 = normalizedRules.value;
        return rules2.filter((rule) => {
          if (!rule.trigger || !trigger)
            return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.includes(trigger);
          } else {
            return rule.trigger === trigger;
          }
        }).map(({ trigger: trigger2, ...rule }) => rule);
      };
      const isRequired = vue.computed(() => normalizedRules.value.some((rule) => rule.required));
      const shouldShowError = vue.computed(() => {
        var _a2;
        return validateStateDebounced.value === "error" && props.showMessage && ((_a2 = formContext == null ? void 0 : formContext.showMessage) != null ? _a2 : true);
      });
      const currentLabel = vue.computed(() => `${props.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`);
      const setValidationState = (state) => {
        validateState.value = state;
      };
      const onValidationFailed = (error) => {
        var _a2, _b;
        const { errors, fields } = error;
        if (!errors || !fields) {
          console.error(error);
        }
        setValidationState("error");
        validateMessage.value = errors ? (_b = (_a2 = errors == null ? void 0 : errors[0]) == null ? void 0 : _a2.message) != null ? _b : `${props.prop} is required` : "";
        formContext == null ? void 0 : formContext.emit("validate", props.prop, false, validateMessage.value);
      };
      const onValidationSucceeded = () => {
        setValidationState("success");
        formContext == null ? void 0 : formContext.emit("validate", props.prop, true, "");
      };
      const doValidate = async (rules2) => {
        const modelName = propString.value;
        const validator = new Schema({
          [modelName]: rules2
        });
        return validator.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
          onValidationSucceeded();
          return true;
        }).catch((err) => {
          onValidationFailed(err);
          return Promise.reject(err);
        });
      };
      const validate2 = async (trigger, callback) => {
        if (isResettingField || !props.prop) {
          return false;
        }
        const hasCallback = isFunction$1(callback);
        if (!validateEnabled.value) {
          callback == null ? void 0 : callback(false);
          return false;
        }
        const rules2 = getFilteredRule(trigger);
        if (rules2.length === 0) {
          callback == null ? void 0 : callback(true);
          return true;
        }
        setValidationState("validating");
        return doValidate(rules2).then(() => {
          callback == null ? void 0 : callback(true);
          return true;
        }).catch((err) => {
          const { fields } = err;
          callback == null ? void 0 : callback(false, fields);
          return hasCallback ? false : Promise.reject(fields);
        });
      };
      const clearValidate = () => {
        setValidationState("");
        validateMessage.value = "";
        isResettingField = false;
      };
      const resetField = async () => {
        const model = formContext == null ? void 0 : formContext.model;
        if (!model || !props.prop)
          return;
        const computedValue = getProp(model, props.prop);
        isResettingField = true;
        computedValue.value = clone(initialValue);
        await vue.nextTick();
        clearValidate();
        isResettingField = false;
      };
      const addInputId = (id) => {
        if (!inputIds.value.includes(id)) {
          inputIds.value.push(id);
        }
      };
      const removeInputId = (id) => {
        inputIds.value = inputIds.value.filter((listId) => listId !== id);
      };
      vue.watch(() => props.error, (val) => {
        validateMessage.value = val || "";
        setValidationState(val ? "error" : "");
      }, { immediate: true });
      vue.watch(() => props.validateStatus, (val) => setValidationState(val || ""));
      const context = vue.reactive({
        ...vue.toRefs(props),
        $el: formItemRef,
        size: _size,
        validateState,
        labelId,
        inputIds,
        isGroup,
        hasLabel,
        addInputId,
        removeInputId,
        resetField,
        clearValidate,
        validate: validate2
      });
      vue.provide(formItemContextKey, context);
      vue.onMounted(() => {
        if (props.prop) {
          formContext == null ? void 0 : formContext.addField(context);
          initialValue = clone(fieldValue.value);
        }
      });
      vue.onBeforeUnmount(() => {
        formContext == null ? void 0 : formContext.removeField(context);
      });
      expose({
        size: _size,
        validateMessage,
        validateState,
        validate: validate2,
        clearValidate,
        resetField
      });
      return (_ctx, _cache) => {
        var _a2;
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "formItemRef",
          ref: formItemRef,
          class: vue.normalizeClass(vue.unref(formItemClasses)),
          role: vue.unref(isGroup) ? "group" : void 0,
          "aria-labelledby": vue.unref(isGroup) ? vue.unref(labelId) : void 0
        }, [
          vue.createVNode(vue.unref(FormLabelWrap), {
            "is-auto-width": vue.unref(labelStyle).width === "auto",
            "update-all": ((_a2 = vue.unref(formContext)) == null ? void 0 : _a2.labelWidth) === "auto"
          }, {
            default: vue.withCtx(() => [
              vue.unref(hasLabel) ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(labelFor) ? "label" : "div"), {
                key: 0,
                id: vue.unref(labelId),
                for: vue.unref(labelFor),
                class: vue.normalizeClass(vue.unref(ns).e("label")),
                style: vue.normalizeStyle(vue.unref(labelStyle))
              }, {
                default: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "label", { label: vue.unref(currentLabel) }, () => [
                    vue.createTextVNode(vue.toDisplayString(vue.unref(currentLabel)), 1)
                  ])
                ]),
                _: 3
              }, 8, ["id", "for", "class", "style"])) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["is-auto-width", "update-all"]),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(ns).e("content")),
            style: vue.normalizeStyle(vue.unref(contentStyle))
          }, [
            vue.renderSlot(_ctx.$slots, "default"),
            vue.createVNode(vue.TransitionGroup, {
              name: `${vue.unref(ns).namespace.value}-zoom-in-top`
            }, {
              default: vue.withCtx(() => [
                vue.unref(shouldShowError) ? vue.renderSlot(_ctx.$slots, "error", {
                  key: 0,
                  error: validateMessage.value
                }, () => [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(vue.unref(validateClasses))
                  }, vue.toDisplayString(validateMessage.value), 3)
                ]) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["name"])
          ], 6)
        ], 10, _hoisted_1$b);
      };
    }
  });
  var FormItem = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__file", "form-item.vue"]]);
  const ElForm = withInstall(Form, {
    FormItem
  });
  const ElFormItem = withNoopInstall(FormItem);
  let hiddenTextarea = void 0;
  const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  ${isFirefox() ? "" : "overflow:hidden !important;"}
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
  const CONTEXT_STYLE = [
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-bottom",
    "font-family",
    "font-weight",
    "font-size",
    "text-rendering",
    "text-transform",
    "width",
    "text-indent",
    "padding-left",
    "padding-right",
    "border-width",
    "box-sizing"
  ];
  function calculateNodeStyling(targetElement) {
    const style = window.getComputedStyle(targetElement);
    const boxSizing = style.getPropertyValue("box-sizing");
    const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
    const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
    const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
    return { contextStyle, paddingSize, borderSize, boxSizing };
  }
  function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a2;
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement("textarea");
      document.body.appendChild(hiddenTextarea);
    }
    const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
    hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
    let height = hiddenTextarea.scrollHeight;
    const result = {};
    if (boxSizing === "border-box") {
      height = height + borderSize;
    } else if (boxSizing === "content-box") {
      height = height - paddingSize;
    }
    hiddenTextarea.value = "";
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (isNumber(minRows)) {
      let minHeight = singleRowHeight * minRows;
      if (boxSizing === "border-box") {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    if (isNumber(maxRows)) {
      let maxHeight = singleRowHeight * maxRows;
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;
    (_a2 = hiddenTextarea.parentNode) == null ? void 0 : _a2.removeChild(hiddenTextarea);
    hiddenTextarea = void 0;
    return result;
  }
  const inputProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    size: useSizeProp,
    disabled: Boolean,
    modelValue: {
      type: definePropType([
        String,
        Number,
        Object
      ]),
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    resize: {
      type: String,
      values: ["none", "both", "horizontal", "vertical"]
    },
    autosize: {
      type: definePropType([Boolean, Object]),
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String
    },
    form: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: iconPropType
    },
    prefixIcon: {
      type: iconPropType
    },
    containerRole: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    inputStyle: {
      type: definePropType([Object, Array, String]),
      default: () => mutable({})
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  });
  const inputEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isString(value),
    input: (value) => isString(value),
    change: (value) => isString(value),
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    clear: () => true,
    mouseleave: (evt) => evt instanceof MouseEvent,
    mouseenter: (evt) => evt instanceof MouseEvent,
    keydown: (evt) => evt instanceof Event,
    compositionstart: (evt) => evt instanceof CompositionEvent,
    compositionupdate: (evt) => evt instanceof CompositionEvent,
    compositionend: (evt) => evt instanceof CompositionEvent
  };
  const _hoisted_1$a = ["role"];
  const _hoisted_2$8 = ["id", "type", "disabled", "formatter", "parser", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus"];
  const _hoisted_3$3 = ["id", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus"];
  const __default__$h = vue.defineComponent({
    name: "ElInput",
    inheritAttrs: false
  });
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    ...__default__$h,
    props: inputProps,
    emits: inputEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const rawAttrs = vue.useAttrs();
      const slots = vue.useSlots();
      const containerAttrs = vue.computed(() => {
        const comboBoxAttrs = {};
        if (props.containerRole === "combobox") {
          comboBoxAttrs["aria-haspopup"] = rawAttrs["aria-haspopup"];
          comboBoxAttrs["aria-owns"] = rawAttrs["aria-owns"];
          comboBoxAttrs["aria-expanded"] = rawAttrs["aria-expanded"];
        }
        return comboBoxAttrs;
      });
      const containerKls = vue.computed(() => [
        props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
        nsInput.m(inputSize.value),
        nsInput.is("disabled", inputDisabled.value),
        nsInput.is("exceed", inputExceed.value),
        {
          [nsInput.b("group")]: slots.prepend || slots.append,
          [nsInput.bm("group", "append")]: slots.append,
          [nsInput.bm("group", "prepend")]: slots.prepend,
          [nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
          [nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
          [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value
        },
        rawAttrs.class
      ]);
      const wrapperKls = vue.computed(() => [
        nsInput.e("wrapper"),
        nsInput.is("focus", isFocused.value)
      ]);
      const attrs = useAttrs({
        excludeKeys: vue.computed(() => {
          return Object.keys(containerAttrs.value);
        })
      });
      const { form, formItem } = useFormItem();
      const { inputId } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const inputSize = useFormSize();
      const inputDisabled = useFormDisabled();
      const nsInput = useNamespace("input");
      const nsTextarea = useNamespace("textarea");
      const input = vue.shallowRef();
      const textarea = vue.shallowRef();
      const hovering = vue.ref(false);
      const isComposing = vue.ref(false);
      const passwordVisible = vue.ref(false);
      const countStyle = vue.ref();
      const textareaCalcStyle = vue.shallowRef(props.inputStyle);
      const _ref = vue.computed(() => input.value || textarea.value);
      const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
        afterBlur() {
          var _a2;
          if (props.validateEvent) {
            (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "blur").catch((err) => debugWarn(err));
          }
        }
      });
      const needStatusIcon = vue.computed(() => {
        var _a2;
        return (_a2 = form == null ? void 0 : form.statusIcon) != null ? _a2 : false;
      });
      const validateState = vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
      const validateIcon = vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
      const passwordIcon = vue.computed(() => passwordVisible.value ? view_default : hide_default);
      const containerStyle = vue.computed(() => [
        rawAttrs.style,
        props.inputStyle
      ]);
      const textareaStyle = vue.computed(() => [
        props.inputStyle,
        textareaCalcStyle.value,
        { resize: props.resize }
      ]);
      const nativeInputValue = vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
      const showClear = vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (isFocused.value || hovering.value));
      const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (!!nativeInputValue.value || isFocused.value));
      const isWordLimitVisible = vue.computed(() => props.showWordLimit && !!attrs.value.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
      const textLength = vue.computed(() => nativeInputValue.value.length);
      const inputExceed = vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength));
      const suffixVisible = vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
      const [recordCursor, setCursor] = useCursor(input);
      useResizeObserver(textarea, (entries) => {
        onceInitSizeTextarea();
        if (!isWordLimitVisible.value || props.resize !== "both")
          return;
        const entry = entries[0];
        const { width } = entry.contentRect;
        countStyle.value = {
          right: `calc(100% - ${width + 15 + 6}px)`
        };
      });
      const resizeTextarea = () => {
        const { type, autosize } = props;
        if (!isClient$1 || type !== "textarea" || !textarea.value)
          return;
        if (autosize) {
          const minRows = isObject$2(autosize) ? autosize.minRows : void 0;
          const maxRows = isObject$2(autosize) ? autosize.maxRows : void 0;
          const textareaStyle2 = calcTextareaHeight(textarea.value, minRows, maxRows);
          textareaCalcStyle.value = {
            overflowY: "hidden",
            ...textareaStyle2
          };
          vue.nextTick(() => {
            textarea.value.offsetHeight;
            textareaCalcStyle.value = textareaStyle2;
          });
        } else {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea.value).minHeight
          };
        }
      };
      const createOnceInitResize = (resizeTextarea2) => {
        let isInit = false;
        return () => {
          var _a2;
          if (isInit || !props.autosize)
            return;
          const isElHidden = ((_a2 = textarea.value) == null ? void 0 : _a2.offsetParent) === null;
          if (!isElHidden) {
            resizeTextarea2();
            isInit = true;
          }
        };
      };
      const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
      const setNativeInputValue = () => {
        const input2 = _ref.value;
        const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;
        if (!input2 || input2.value === formatterValue)
          return;
        input2.value = formatterValue;
      };
      const handleInput = async (event) => {
        recordCursor();
        let { value } = event.target;
        if (props.formatter) {
          value = props.parser ? props.parser(value) : value;
        }
        if (isComposing.value)
          return;
        if (value === nativeInputValue.value) {
          setNativeInputValue();
          return;
        }
        emit(UPDATE_MODEL_EVENT, value);
        emit("input", value);
        await vue.nextTick();
        setNativeInputValue();
        setCursor();
      };
      const handleChange = (event) => {
        emit("change", event.target.value);
      };
      const handleCompositionStart = (event) => {
        emit("compositionstart", event);
        isComposing.value = true;
      };
      const handleCompositionUpdate = (event) => {
        var _a2;
        emit("compositionupdate", event);
        const text = (_a2 = event.target) == null ? void 0 : _a2.value;
        const lastCharacter = text[text.length - 1] || "";
        isComposing.value = !isKorean(lastCharacter);
      };
      const handleCompositionEnd = (event) => {
        emit("compositionend", event);
        if (isComposing.value) {
          isComposing.value = false;
          handleInput(event);
        }
      };
      const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
        focus();
      };
      const focus = async () => {
        var _a2;
        await vue.nextTick();
        (_a2 = _ref.value) == null ? void 0 : _a2.focus();
      };
      const blur = () => {
        var _a2;
        return (_a2 = _ref.value) == null ? void 0 : _a2.blur();
      };
      const handleMouseLeave = (evt) => {
        hovering.value = false;
        emit("mouseleave", evt);
      };
      const handleMouseEnter = (evt) => {
        hovering.value = true;
        emit("mouseenter", evt);
      };
      const handleKeydown = (evt) => {
        emit("keydown", evt);
      };
      const select = () => {
        var _a2;
        (_a2 = _ref.value) == null ? void 0 : _a2.select();
      };
      const clear = () => {
        emit(UPDATE_MODEL_EVENT, "");
        emit("change", "");
        emit("clear");
        emit("input", "");
      };
      vue.watch(() => props.modelValue, () => {
        var _a2;
        vue.nextTick(() => resizeTextarea());
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn(err));
        }
      });
      vue.watch(nativeInputValue, () => setNativeInputValue());
      vue.watch(() => props.type, async () => {
        await vue.nextTick();
        setNativeInputValue();
        resizeTextarea();
      });
      vue.onMounted(() => {
        if (!props.formatter && props.parser) {
          debugWarn("ElInput", "If you set the parser, you also need to set the formatter.");
        }
        setNativeInputValue();
        vue.nextTick(resizeTextarea);
      });
      expose({
        input,
        textarea,
        ref: _ref,
        textareaStyle,
        autosize: vue.toRef(props, "autosize"),
        focus,
        blur,
        select,
        clear,
        resizeTextarea
      });
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(vue.unref(containerAttrs), {
          class: vue.unref(containerKls),
          style: vue.unref(containerStyle),
          role: _ctx.containerRole,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }), [
          vue.createCommentVNode(" input "),
          _ctx.type !== "textarea" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createCommentVNode(" prepend slot "),
            _ctx.$slots.prepend ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "prepend"))
            }, [
              vue.renderSlot(_ctx.$slots, "prepend")
            ], 2)) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("div", {
              ref_key: "wrapperRef",
              ref: wrapperRef,
              class: vue.normalizeClass(vue.unref(wrapperKls))
            }, [
              vue.createCommentVNode(" prefix slot "),
              _ctx.$slots.prefix || _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(nsInput).e("prefix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("prefix-inner"))
                }, [
                  vue.renderSlot(_ctx.$slots, "prefix"),
                  _ctx.prefixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.prefixIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("input", vue.mergeProps({
                id: vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: vue.unref(nsInput).e("inner")
              }, vue.unref(attrs), {
                type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                disabled: vue.unref(inputDisabled),
                formatter: _ctx.formatter,
                parser: _ctx.parser,
                readonly: _ctx.readonly,
                autocomplete: _ctx.autocomplete,
                tabindex: _ctx.tabindex,
                "aria-label": _ctx.label,
                placeholder: _ctx.placeholder,
                style: _ctx.inputStyle,
                form: props.form,
                autofocus: props.autofocus,
                onCompositionstart: handleCompositionStart,
                onCompositionupdate: handleCompositionUpdate,
                onCompositionend: handleCompositionEnd,
                onInput: handleInput,
                onFocus: _cache[0] || (_cache[0] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
                onBlur: _cache[1] || (_cache[1] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
                onChange: handleChange,
                onKeydown: handleKeydown
              }), null, 16, _hoisted_2$8),
              vue.createCommentVNode(" suffix slot "),
              vue.unref(suffixVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(vue.unref(nsInput).e("suffix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("suffix-inner"))
                }, [
                  !vue.unref(showClear) || !vue.unref(showPwdVisible) || !vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.renderSlot(_ctx.$slots, "suffix"),
                    _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                      key: 0,
                      class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.suffixIcon)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                  ], 64)) : vue.createCommentVNode("v-if", true),
                  vue.unref(showClear) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("clear")]),
                    onMousedown: vue.withModifiers(vue.unref(NOOP), ["prevent"]),
                    onClick: clear
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(circle_close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(showPwdVisible) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 2,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("password")]),
                    onClick: handlePasswordVisible
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(passwordIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 3,
                    class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("count-inner"))
                    }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 3)
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  vue.unref(validateState) && vue.unref(validateIcon) && vue.unref(needStatusIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 4,
                    class: vue.normalizeClass([
                      vue.unref(nsInput).e("icon"),
                      vue.unref(nsInput).e("validateIcon"),
                      vue.unref(nsInput).is("loading", vue.unref(validateState) === "validating")
                    ])
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(validateIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 2),
            vue.createCommentVNode(" append slot "),
            _ctx.$slots.append ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "append"))
            }, [
              vue.renderSlot(_ctx.$slots, "append")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createCommentVNode(" textarea "),
            vue.createElementVNode("textarea", vue.mergeProps({
              id: vue.unref(inputId),
              ref_key: "textarea",
              ref: textarea,
              class: vue.unref(nsTextarea).e("inner")
            }, vue.unref(attrs), {
              tabindex: _ctx.tabindex,
              disabled: vue.unref(inputDisabled),
              readonly: _ctx.readonly,
              autocomplete: _ctx.autocomplete,
              style: vue.unref(textareaStyle),
              "aria-label": _ctx.label,
              placeholder: _ctx.placeholder,
              form: props.form,
              autofocus: props.autofocus,
              onCompositionstart: handleCompositionStart,
              onCompositionupdate: handleCompositionUpdate,
              onCompositionend: handleCompositionEnd,
              onInput: handleInput,
              onFocus: _cache[2] || (_cache[2] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
              onBlur: _cache[3] || (_cache[3] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
              onChange: handleChange,
              onKeydown: handleKeydown
            }), null, 16, _hoisted_3$3),
            vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              style: vue.normalizeStyle(countStyle.value),
              class: vue.normalizeClass(vue.unref(nsInput).e("count"))
            }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 7)) : vue.createCommentVNode("v-if", true)
          ], 64))
        ], 16, _hoisted_1$a)), [
          [vue.vShow, _ctx.type !== "hidden"]
        ]);
      };
    }
  });
  var Input = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__file", "input.vue"]]);
  const ElInput = withInstall(Input);
  const GAP = 4;
  const BAR_MAP = {
    vertical: {
      offset: "offsetHeight",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      size: "height",
      key: "vertical",
      axis: "Y",
      client: "clientY",
      direction: "top"
    },
    horizontal: {
      offset: "offsetWidth",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      size: "width",
      key: "horizontal",
      axis: "X",
      client: "clientX",
      direction: "left"
    }
  };
  const renderThumbStyle = ({
    move,
    size,
    bar
  }) => ({
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`
  });
  const scrollbarContextKey = Symbol("scrollbarContextKey");
  const thumbProps = buildProps({
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  });
  const COMPONENT_NAME$2 = "Thumb";
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    __name: "thumb",
    props: thumbProps,
    setup(__props) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const ns = useNamespace("scrollbar");
      if (!scrollbar)
        throwError(COMPONENT_NAME$2, "can not inject scrollbar context");
      const instance = vue.ref();
      const thumb = vue.ref();
      const thumbState = vue.ref({});
      const visible = vue.ref(false);
      let cursorDown = false;
      let cursorLeave = false;
      let originalOnSelectStart = isClient$1 ? document.onselectstart : null;
      const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
      const thumbStyle = vue.computed(() => renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar.value
      }));
      const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
      const clickThumbHandler = (e) => {
        var _a2;
        e.stopPropagation();
        if (e.ctrlKey || [1, 2].includes(e.button))
          return;
        (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
        startDrag(e);
        const el = e.currentTarget;
        if (!el)
          return;
        thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
      };
      const clickTrackHandler = (e) => {
        if (!thumb.value || !instance.value || !scrollbar.wrapElement)
          return;
        const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
        const thumbHalf = thumb.value[bar.value.offset] / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const startDrag = (e) => {
        e.stopImmediatePropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;
      };
      const mouseMoveDocumentHandler = (e) => {
        if (!instance.value || !thumb.value)
          return;
        if (cursorDown === false)
          return;
        const prevPage = thumbState.value[bar.value.axis];
        if (!prevPage)
          return;
        const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
        const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const mouseUpDocumentHandler = () => {
        cursorDown = false;
        thumbState.value[bar.value.axis] = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
        restoreOnselectstart();
        if (cursorLeave)
          visible.value = false;
      };
      const mouseMoveScrollbarHandler = () => {
        cursorLeave = false;
        visible.value = !!props.size;
      };
      const mouseLeaveScrollbarHandler = () => {
        cursorLeave = true;
        visible.value = cursorDown;
      };
      vue.onBeforeUnmount(() => {
        restoreOnselectstart();
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
      });
      const restoreOnselectstart = () => {
        if (document.onselectstart !== originalOnSelectStart)
          document.onselectstart = originalOnSelectStart;
      };
      useEventListener$1(vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
      useEventListener$1(vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              ref_key: "instance",
              ref: instance,
              class: vue.normalizeClass([vue.unref(ns).e("bar"), vue.unref(ns).is(vue.unref(bar).key)]),
              onMousedown: clickTrackHandler
            }, [
              vue.createElementVNode("div", {
                ref_key: "thumb",
                ref: thumb,
                class: vue.normalizeClass(vue.unref(ns).e("thumb")),
                style: vue.normalizeStyle(vue.unref(thumbStyle)),
                onMousedown: clickThumbHandler
              }, null, 38)
            ], 34), [
              [vue.vShow, _ctx.always || visible.value]
            ])
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var Thumb = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__file", "thumb.vue"]]);
  const barProps = buildProps({
    always: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    ratioX: {
      type: Number,
      default: 1
    },
    ratioY: {
      type: Number,
      default: 1
    }
  });
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    __name: "bar",
    props: barProps,
    setup(__props, { expose }) {
      const props = __props;
      const moveX = vue.ref(0);
      const moveY = vue.ref(0);
      const handleScroll = (wrap) => {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP;
          const offsetWidth = wrap.offsetWidth - GAP;
          moveY.value = wrap.scrollTop * 100 / offsetHeight * props.ratioY;
          moveX.value = wrap.scrollLeft * 100 / offsetWidth * props.ratioX;
        }
      };
      expose({
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(Thumb, {
            move: moveX.value,
            ratio: _ctx.ratioX,
            size: _ctx.width,
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"]),
          vue.createVNode(Thumb, {
            move: moveY.value,
            ratio: _ctx.ratioY,
            size: _ctx.height,
            vertical: "",
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"])
        ], 64);
      };
    }
  });
  var Bar = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__file", "bar.vue"]]);
  const scrollbarProps = buildProps({
    height: {
      type: [String, Number],
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    viewClass: {
      type: [String, Array],
      default: ""
    },
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: "div"
    },
    always: Boolean,
    minSize: {
      type: Number,
      default: 20
    },
    id: String,
    role: String,
    ariaLabel: String,
    ariaOrientation: {
      type: String,
      values: ["horizontal", "vertical"]
    }
  });
  const scrollbarEmits = {
    scroll: ({
      scrollTop,
      scrollLeft
    }) => [scrollTop, scrollLeft].every(isNumber)
  };
  const COMPONENT_NAME$1 = "ElScrollbar";
  const __default__$g = vue.defineComponent({
    name: COMPONENT_NAME$1
  });
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    ...__default__$g,
    props: scrollbarProps,
    emits: scrollbarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("scrollbar");
      let stopResizeObserver = void 0;
      let stopResizeListener = void 0;
      const scrollbarRef = vue.ref();
      const wrapRef = vue.ref();
      const resizeRef = vue.ref();
      const sizeWidth = vue.ref("0");
      const sizeHeight = vue.ref("0");
      const barRef = vue.ref();
      const ratioY = vue.ref(1);
      const ratioX = vue.ref(1);
      const wrapStyle = vue.computed(() => {
        const style = {};
        if (props.height)
          style.height = addUnit(props.height);
        if (props.maxHeight)
          style.maxHeight = addUnit(props.maxHeight);
        return [props.wrapStyle, style];
      });
      const wrapKls = vue.computed(() => {
        return [
          props.wrapClass,
          ns.e("wrap"),
          { [ns.em("wrap", "hidden-default")]: !props.native }
        ];
      });
      const resizeKls = vue.computed(() => {
        return [ns.e("view"), props.viewClass];
      });
      const handleScroll = () => {
        var _a2;
        if (wrapRef.value) {
          (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
          emit("scroll", {
            scrollTop: wrapRef.value.scrollTop,
            scrollLeft: wrapRef.value.scrollLeft
          });
        }
      };
      function scrollTo(arg1, arg2) {
        if (isObject$2(arg1)) {
          wrapRef.value.scrollTo(arg1);
        } else if (isNumber(arg1) && isNumber(arg2)) {
          wrapRef.value.scrollTo(arg1, arg2);
        }
      }
      const setScrollTop = (value) => {
        if (!isNumber(value)) {
          debugWarn(COMPONENT_NAME$1, "value must be a number");
          return;
        }
        wrapRef.value.scrollTop = value;
      };
      const setScrollLeft = (value) => {
        if (!isNumber(value)) {
          debugWarn(COMPONENT_NAME$1, "value must be a number");
          return;
        }
        wrapRef.value.scrollLeft = value;
      };
      const update = () => {
        if (!wrapRef.value)
          return;
        const offsetHeight = wrapRef.value.offsetHeight - GAP;
        const offsetWidth = wrapRef.value.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
        const height = Math.max(originalHeight, props.minSize);
        const width = Math.max(originalWidth, props.minSize);
        ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
        ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
        sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
        sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
      };
      vue.watch(() => props.noresize, (noresize) => {
        if (noresize) {
          stopResizeObserver == null ? void 0 : stopResizeObserver();
          stopResizeListener == null ? void 0 : stopResizeListener();
        } else {
          ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
          stopResizeListener = useEventListener$1("resize", update);
        }
      }, { immediate: true });
      vue.watch(() => [props.maxHeight, props.height], () => {
        if (!props.native)
          vue.nextTick(() => {
            var _a2;
            update();
            if (wrapRef.value) {
              (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
            }
          });
      });
      vue.provide(scrollbarContextKey, vue.reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef
      }));
      vue.onMounted(() => {
        if (!props.native)
          vue.nextTick(() => {
            update();
          });
      });
      vue.onUpdated(() => update());
      expose({
        wrapRef,
        update,
        scrollTo,
        setScrollTop,
        setScrollLeft,
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "scrollbarRef",
          ref: scrollbarRef,
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.createElementVNode("div", {
            ref_key: "wrapRef",
            ref: wrapRef,
            class: vue.normalizeClass(vue.unref(wrapKls)),
            style: vue.normalizeStyle(vue.unref(wrapStyle)),
            onScroll: handleScroll
          }, [
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: _ctx.id,
              ref_key: "resizeRef",
              ref: resizeRef,
              class: vue.normalizeClass(vue.unref(resizeKls)),
              style: vue.normalizeStyle(_ctx.viewStyle),
              role: _ctx.role,
              "aria-label": _ctx.ariaLabel,
              "aria-orientation": _ctx.ariaOrientation
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "style", "role", "aria-label", "aria-orientation"]))
          ], 38),
          !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
            key: 0,
            ref_key: "barRef",
            ref: barRef,
            height: sizeHeight.value,
            width: sizeWidth.value,
            always: _ctx.always,
            "ratio-x": ratioX.value,
            "ratio-y": ratioY.value
          }, null, 8, ["height", "width", "always", "ratio-x", "ratio-y"])) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var Scrollbar = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__file", "scrollbar.vue"]]);
  const ElScrollbar = withInstall(Scrollbar);
  const POPPER_INJECTION_KEY = Symbol("popper");
  const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
  const roleTypes = [
    "dialog",
    "grid",
    "group",
    "listbox",
    "menu",
    "navigation",
    "tooltip",
    "tree"
  ];
  const popperProps = buildProps({
    role: {
      type: String,
      values: roleTypes,
      default: "tooltip"
    }
  });
  const __default__$f = vue.defineComponent({
    name: "ElPopper",
    inheritAttrs: false
  });
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    ...__default__$f,
    props: popperProps,
    setup(__props, { expose }) {
      const props = __props;
      const triggerRef = vue.ref();
      const popperInstanceRef = vue.ref();
      const contentRef = vue.ref();
      const referenceRef = vue.ref();
      const role = vue.computed(() => props.role);
      const popperProvides = {
        triggerRef,
        popperInstanceRef,
        contentRef,
        referenceRef,
        role
      };
      expose(popperProvides);
      vue.provide(POPPER_INJECTION_KEY, popperProvides);
      return (_ctx, _cache) => {
        return vue.renderSlot(_ctx.$slots, "default");
      };
    }
  });
  var Popper = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__file", "popper.vue"]]);
  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const __default__$e = vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    ...__default__$e,
    props: popperArrowProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("popper");
      const { arrowOffset, arrowRef, arrowStyle } = vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
      vue.watch(() => props.arrowOffset, (val) => {
        arrowOffset.value = val;
      });
      vue.onBeforeUnmount(() => {
        arrowRef.value = void 0;
      });
      expose({
        arrowRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "arrowRef",
          ref: arrowRef,
          class: vue.normalizeClass(vue.unref(ns).e("arrow")),
          style: vue.normalizeStyle(vue.unref(arrowStyle)),
          "data-popper-arrow": ""
        }, null, 6);
      };
    }
  });
  var ElPopperArrow = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__file", "arrow.vue"]]);
  const NAME = "ElOnlyChild";
  const OnlyChild = vue.defineComponent({
    name: NAME,
    setup(_, {
      slots,
      attrs
    }) {
      var _a2;
      const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
      const forwardRefDirective = useForwardRefDirective((_a2 = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a2 : NOOP);
      return () => {
        var _a22;
        const defaultSlot = (_a22 = slots.default) == null ? void 0 : _a22.call(slots, attrs);
        if (!defaultSlot)
          return null;
        if (defaultSlot.length > 1) {
          debugWarn(NAME, "requires exact only one valid child.");
          return null;
        }
        const firstLegitNode = findFirstLegitChild(defaultSlot);
        if (!firstLegitNode) {
          debugWarn(NAME, "no valid child node found");
          return null;
        }
        return vue.withDirectives(vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
      };
    }
  });
  function findFirstLegitChild(node) {
    if (!node)
      return null;
    const children = node;
    for (const child of children) {
      if (isObject$2(child)) {
        switch (child.type) {
          case vue.Comment:
            continue;
          case vue.Text:
          case "svg":
            return wrapTextContent(child);
          case vue.Fragment:
            return findFirstLegitChild(child.children);
          default:
            return child;
        }
      }
      return wrapTextContent(child);
    }
    return null;
  }
  function wrapTextContent(s) {
    const ns = useNamespace("only-child");
    return vue.createVNode("span", {
      "class": ns.e("content")
    }, [s]);
  }
  const popperTriggerProps = buildProps({
    virtualRef: {
      type: definePropType(Object)
    },
    virtualTriggering: Boolean,
    onMouseenter: {
      type: definePropType(Function)
    },
    onMouseleave: {
      type: definePropType(Function)
    },
    onClick: {
      type: definePropType(Function)
    },
    onKeydown: {
      type: definePropType(Function)
    },
    onFocus: {
      type: definePropType(Function)
    },
    onBlur: {
      type: definePropType(Function)
    },
    onContextmenu: {
      type: definePropType(Function)
    },
    id: String,
    open: Boolean
  });
  const __default__$d = vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    ...__default__$d,
    props: popperTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const { role, triggerRef } = vue.inject(POPPER_INJECTION_KEY, void 0);
      useForwardRef(triggerRef);
      const ariaControls = vue.computed(() => {
        return ariaHaspopup.value ? props.id : void 0;
      });
      const ariaDescribedby = vue.computed(() => {
        if (role && role.value === "tooltip") {
          return props.open && props.id ? props.id : void 0;
        }
        return void 0;
      });
      const ariaHaspopup = vue.computed(() => {
        if (role && role.value !== "tooltip") {
          return role.value;
        }
        return void 0;
      });
      const ariaExpanded = vue.computed(() => {
        return ariaHaspopup.value ? `${props.open}` : void 0;
      });
      let virtualTriggerAriaStopWatch = void 0;
      vue.onMounted(() => {
        vue.watch(() => props.virtualRef, (virtualEl) => {
          if (virtualEl) {
            triggerRef.value = unrefElement$1(virtualEl);
          }
        }, {
          immediate: true
        });
        vue.watch(triggerRef, (el, prevEl) => {
          virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
          virtualTriggerAriaStopWatch = void 0;
          if (isElement(el)) {
            [
              "onMouseenter",
              "onMouseleave",
              "onClick",
              "onKeydown",
              "onFocus",
              "onBlur",
              "onContextmenu"
            ].forEach((eventName) => {
              var _a2;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            virtualTriggerAriaStopWatch = vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
              [
                "aria-controls",
                "aria-describedby",
                "aria-haspopup",
                "aria-expanded"
              ].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (isElement(prevEl)) {
            [
              "aria-controls",
              "aria-describedby",
              "aria-haspopup",
              "aria-expanded"
            ].forEach((key) => prevEl.removeAttribute(key));
          }
        }, {
          immediate: true
        });
      });
      vue.onBeforeUnmount(() => {
        virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = void 0;
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return !_ctx.virtualTriggering ? (vue.openBlock(), vue.createBlock(vue.unref(OnlyChild), vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          "aria-controls": vue.unref(ariaControls),
          "aria-describedby": vue.unref(ariaDescribedby),
          "aria-expanded": vue.unref(ariaExpanded),
          "aria-haspopup": vue.unref(ariaHaspopup)
        }), {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__file", "trigger.vue"]]);
  const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
  const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
  const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
  const FOCUS_AFTER_TRAPPED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const FOCUSOUT_PREVENTED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
  const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
  const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
  var define_process_env_default$1 = { production: "production" };
  const focusReason = vue.ref();
  const lastUserFocusTimestamp = vue.ref(0);
  const lastAutomatedFocusTimestamp = vue.ref(0);
  let focusReasonUserCount = 0;
  const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  };
  const getVisibleElement = (elements, container) => {
    for (const element of elements) {
      if (!isHidden(element, container))
        return element;
    }
  };
  const isHidden = (element, container) => {
    if (define_process_env_default$1.NODE_ENV === "test")
      return false;
    if (getComputedStyle(element).visibility === "hidden")
      return true;
    while (element) {
      if (container && element === container)
        return false;
      if (getComputedStyle(element).display === "none")
        return true;
      element = element.parentElement;
    }
    return false;
  };
  const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
  };
  const isSelectable = (element) => {
    return element instanceof HTMLInputElement && "select" in element;
  };
  const tryFocus = (element, shouldSelect) => {
    if (element && element.focus) {
      const prevFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
    }
  };
  function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
      copy.splice(idx, 1);
    }
    return copy;
  }
  const createFocusableStack = () => {
    let stack = [];
    const push = (layer) => {
      const currentLayer = stack[0];
      if (currentLayer && layer !== currentLayer) {
        currentLayer.pause();
      }
      stack = removeFromStack(stack, layer);
      stack.unshift(layer);
    };
    const remove = (layer) => {
      var _a2, _b;
      stack = removeFromStack(stack, layer);
      (_b = (_a2 = stack[0]) == null ? void 0 : _a2.resume) == null ? void 0 : _b.call(_a2);
    };
    return {
      push,
      remove
    };
  };
  const focusFirstDescendant = (elements, shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement)
        return;
    }
  };
  const focusableStack = createFocusableStack();
  const isFocusCausedByUserEvent = () => {
    return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
  };
  const notifyFocusReasonPointer = () => {
    focusReason.value = "pointer";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const notifyFocusReasonKeydown = () => {
    focusReason.value = "keyboard";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const useFocusReason = () => {
    vue.onMounted(() => {
      if (focusReasonUserCount === 0) {
        document.addEventListener("mousedown", notifyFocusReasonPointer);
        document.addEventListener("touchstart", notifyFocusReasonPointer);
        document.addEventListener("keydown", notifyFocusReasonKeydown);
      }
      focusReasonUserCount++;
    });
    vue.onBeforeUnmount(() => {
      focusReasonUserCount--;
      if (focusReasonUserCount <= 0) {
        document.removeEventListener("mousedown", notifyFocusReasonPointer);
        document.removeEventListener("touchstart", notifyFocusReasonPointer);
        document.removeEventListener("keydown", notifyFocusReasonKeydown);
      }
    });
    return {
      focusReason,
      lastUserFocusTimestamp,
      lastAutomatedFocusTimestamp
    };
  };
  const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent(FOCUSOUT_PREVENTED, {
      ...FOCUSOUT_PREVENTED_OPTS,
      detail
    });
  };
  const _sfc_main$j = vue.defineComponent({
    name: "ElFocusTrap",
    inheritAttrs: false,
    props: {
      loop: Boolean,
      trapped: Boolean,
      focusTrapEl: Object,
      focusStartEl: {
        type: [Object, String],
        default: "first"
      }
    },
    emits: [
      ON_TRAP_FOCUS_EVT,
      ON_RELEASE_FOCUS_EVT,
      "focusin",
      "focusout",
      "focusout-prevented",
      "release-requested"
    ],
    setup(props, { emit }) {
      const forwardRef = vue.ref();
      let lastFocusBeforeTrapped;
      let lastFocusAfterTrapped;
      const { focusReason: focusReason2 } = useFocusReason();
      useEscapeKeydown((event) => {
        if (props.trapped && !focusLayer.paused) {
          emit("release-requested", event);
        }
      });
      const focusLayer = {
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        }
      };
      const onKeydown = (e) => {
        if (!props.loop && !props.trapped)
          return;
        if (focusLayer.paused)
          return;
        const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
        const currentFocusingEl = document.activeElement;
        if (isTabbing && currentFocusingEl) {
          const container = currentTarget;
          const [first, last] = getEdges(container);
          const isTabbable = first && last;
          if (!isTabbable) {
            if (currentFocusingEl === container) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
              }
            }
          } else {
            if (!shiftKey && currentFocusingEl === last) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(first, true);
              }
            } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(last, true);
              }
            }
          }
        }
      };
      vue.provide(FOCUS_TRAP_INJECTION_KEY, {
        focusTrapRef: forwardRef,
        onKeydown
      });
      vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl;
        }
      }, { immediate: true });
      vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
        if (forwardRef2) {
          forwardRef2.addEventListener("keydown", onKeydown);
          forwardRef2.addEventListener("focusin", onFocusIn);
          forwardRef2.addEventListener("focusout", onFocusOut);
        }
        if (oldForwardRef) {
          oldForwardRef.removeEventListener("keydown", onKeydown);
          oldForwardRef.removeEventListener("focusin", onFocusIn);
          oldForwardRef.removeEventListener("focusout", onFocusOut);
        }
      });
      const trapOnFocus = (e) => {
        emit(ON_TRAP_FOCUS_EVT, e);
      };
      const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
      const onFocusIn = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (!trapContainer)
          return;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!props.trapped) {
          const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
          if (!isPrevFocusedInTrap) {
            lastFocusBeforeTrapped = relatedTarget;
          }
        }
        if (isFocusedInTrap)
          emit("focusin", e);
        if (focusLayer.paused)
          return;
        if (props.trapped) {
          if (isFocusedInTrap) {
            lastFocusAfterTrapped = target;
          } else {
            tryFocus(lastFocusAfterTrapped, true);
          }
        }
      };
      const onFocusOut = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (focusLayer.paused || !trapContainer)
          return;
        if (props.trapped) {
          const relatedTarget = e.relatedTarget;
          if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
            setTimeout(() => {
              if (!focusLayer.paused && props.trapped) {
                const focusoutPreventedEvent = createFocusOutPreventedEvent({
                  focusReason: focusReason2.value
                });
                emit("focusout-prevented", focusoutPreventedEvent);
                if (!focusoutPreventedEvent.defaultPrevented) {
                  tryFocus(lastFocusAfterTrapped, true);
                }
              }
            }, 0);
          }
        } else {
          const target = e.target;
          const isFocusedInTrap = target && trapContainer.contains(target);
          if (!isFocusedInTrap)
            emit("focusout", e);
        }
      };
      async function startTrap() {
        await vue.nextTick();
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          focusableStack.push(focusLayer);
          const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
          lastFocusBeforeTrapped = prevFocusedElement;
          const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
          if (!isPrevFocusContained) {
            const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
            trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
            trapContainer.dispatchEvent(focusEvent);
            if (!focusEvent.defaultPrevented) {
              vue.nextTick(() => {
                let focusStartEl = props.focusStartEl;
                if (!isString(focusStartEl)) {
                  tryFocus(focusStartEl);
                  if (document.activeElement !== focusStartEl) {
                    focusStartEl = "first";
                  }
                }
                if (focusStartEl === "first") {
                  focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                }
                if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                  tryFocus(trapContainer);
                }
              });
            }
          }
        }
      }
      function stopTrap() {
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
            ...FOCUS_AFTER_TRAPPED_OPTS,
            detail: {
              focusReason: focusReason2.value
            }
          });
          trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          trapContainer.dispatchEvent(releasedEvent);
          if (!releasedEvent.defaultPrevented && (focusReason2.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) {
            tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
          }
          trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          focusableStack.remove(focusLayer);
        }
      }
      vue.onMounted(() => {
        if (props.trapped) {
          startTrap();
        }
        vue.watch(() => props.trapped, (trapped) => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        });
      });
      vue.onBeforeUnmount(() => {
        if (props.trapped) {
          stopTrap();
        }
      });
      return {
        onKeydown
      };
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$4], ["__file", "focus-trap.vue"]]);
  const POSITIONING_STRATEGIES = ["fixed", "absolute"];
  const popperCoreConfigProps = buildProps({
    boundariesPadding: {
      type: Number,
      default: 0
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: void 0
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 12
    },
    placement: {
      type: String,
      values: Ee,
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    strategy: {
      type: String,
      values: POSITIONING_STRATEGIES,
      default: "absolute"
    }
  });
  const popperContentProps = buildProps({
    ...popperCoreConfigProps,
    id: String,
    style: {
      type: definePropType([String, Array, Object])
    },
    className: {
      type: definePropType([String, Array, Object])
    },
    effect: {
      type: String,
      default: "dark"
    },
    visible: Boolean,
    enterable: {
      type: Boolean,
      default: true
    },
    pure: Boolean,
    focusOnShow: {
      type: Boolean,
      default: false
    },
    trapping: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: definePropType([String, Array, Object])
    },
    popperStyle: {
      type: definePropType([String, Array, Object])
    },
    referenceEl: {
      type: definePropType(Object)
    },
    triggerTargetEl: {
      type: definePropType(Object)
    },
    stopPopperMouseEvent: {
      type: Boolean,
      default: true
    },
    ariaLabel: {
      type: String,
      default: void 0
    },
    virtualTriggering: Boolean,
    zIndex: Number
  });
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
  };
  const buildPopperOptions = (props, modifiers = []) => {
    const { placement, strategy, popperOptions } = props;
    const options = {
      placement,
      strategy,
      ...popperOptions,
      modifiers: [...genModifiers(props), ...modifiers]
    };
    deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
    return options;
  };
  const unwrapMeasurableEl = ($el) => {
    if (!isClient$1)
      return;
    return unrefElement$1($el);
  };
  function genModifiers(options) {
    const { offset, gpuAcceleration, fallbackPlacements } = options;
    return [
      {
        name: "offset",
        options: {
          offset: [0, offset != null ? offset : 12]
        }
      },
      {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      },
      {
        name: "flip",
        options: {
          padding: 5,
          fallbackPlacements
        }
      },
      {
        name: "computeStyles",
        options: {
          gpuAcceleration
        }
      }
    ];
  }
  function deriveExtraModifiers(options, modifiers) {
    if (modifiers) {
      options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
    }
  }
  const DEFAULT_ARROW_OFFSET = 0;
  const usePopperContent = (props) => {
    const { popperInstanceRef, contentRef, triggerRef, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
    const arrowRef = vue.ref();
    const arrowOffset = vue.ref();
    const eventListenerModifier = vue.computed(() => {
      return {
        name: "eventListeners",
        enabled: !!props.visible
      };
    });
    const arrowModifier = vue.computed(() => {
      var _a2;
      const arrowEl = vue.unref(arrowRef);
      const offset = (_a2 = vue.unref(arrowOffset)) != null ? _a2 : DEFAULT_ARROW_OFFSET;
      return {
        name: "arrow",
        enabled: !isUndefined$1(arrowEl),
        options: {
          element: arrowEl,
          padding: offset
        }
      };
    });
    const options = vue.computed(() => {
      return {
        onFirstUpdate: () => {
          update();
        },
        ...buildPopperOptions(props, [
          vue.unref(arrowModifier),
          vue.unref(eventListenerModifier)
        ])
      };
    });
    const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef));
    const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
    vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
    vue.onMounted(() => {
      vue.watch(() => {
        var _a2;
        return (_a2 = vue.unref(computedReference)) == null ? void 0 : _a2.getBoundingClientRect();
      }, () => {
        update();
      });
    });
    return {
      attributes,
      arrowRef,
      contentRef,
      instanceRef,
      state,
      styles,
      role,
      forceUpdate,
      update
    };
  };
  const usePopperContentDOM = (props, {
    attributes,
    styles,
    role
  }) => {
    const { nextZIndex } = useZIndex();
    const ns = useNamespace("popper");
    const contentAttrs = vue.computed(() => vue.unref(attributes).popper);
    const contentZIndex = vue.ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
    const contentClass = vue.computed(() => [
      ns.b(),
      ns.is("pure", props.pure),
      ns.is(props.effect),
      props.popperClass
    ]);
    const contentStyle = vue.computed(() => {
      return [
        { zIndex: vue.unref(contentZIndex) },
        vue.unref(styles).popper,
        props.popperStyle || {}
      ];
    });
    const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
    const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
    const updateZIndex = () => {
      contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
    };
    return {
      ariaModal,
      arrowStyle,
      contentAttrs,
      contentClass,
      contentStyle,
      contentZIndex,
      updateZIndex
    };
  };
  const usePopperContentFocusTrap = (props, emit) => {
    const trapped = vue.ref(false);
    const focusStartRef = vue.ref();
    const onFocusAfterTrapped = () => {
      emit("focus");
    };
    const onFocusAfterReleased = (event) => {
      var _a2;
      if (((_a2 = event.detail) == null ? void 0 : _a2.focusReason) !== "pointer") {
        focusStartRef.value = "first";
        emit("blur");
      }
    };
    const onFocusInTrap = (event) => {
      if (props.visible && !trapped.value) {
        if (event.target) {
          focusStartRef.value = event.target;
        }
        trapped.value = true;
      }
    };
    const onFocusoutPrevented = (event) => {
      if (!props.trapping) {
        if (event.detail.focusReason === "pointer") {
          event.preventDefault();
        }
        trapped.value = false;
      }
    };
    const onReleaseRequested = () => {
      trapped.value = false;
      emit("close");
    };
    return {
      focusStartRef,
      trapped,
      onFocusAfterReleased,
      onFocusAfterTrapped,
      onFocusInTrap,
      onFocusoutPrevented,
      onReleaseRequested
    };
  };
  const __default__$c = vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    ...__default__$c,
    props: popperContentProps,
    emits: popperContentEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        focusStartRef,
        trapped,
        onFocusAfterReleased,
        onFocusAfterTrapped,
        onFocusInTrap,
        onFocusoutPrevented,
        onReleaseRequested
      } = usePopperContentFocusTrap(props, emit);
      const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
      const {
        ariaModal,
        arrowStyle,
        contentAttrs,
        contentClass,
        contentStyle,
        updateZIndex
      } = usePopperContentDOM(props, {
        styles,
        attributes,
        role
      });
      const formItemContext = vue.inject(formItemContextKey, void 0);
      const arrowOffset = vue.ref();
      vue.provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowStyle,
        arrowRef,
        arrowOffset
      });
      if (formItemContext && (formItemContext.addInputId || formItemContext.removeInputId)) {
        vue.provide(formItemContextKey, {
          ...formItemContext,
          addInputId: NOOP,
          removeInputId: NOOP
        });
      }
      let triggerTargetAriaStopWatch = void 0;
      const updatePopper = (shouldUpdateZIndex = true) => {
        update();
        shouldUpdateZIndex && updateZIndex();
      };
      const togglePopperAlive = () => {
        updatePopper(false);
        if (props.visible && props.focusOnShow) {
          trapped.value = true;
        } else if (props.visible === false) {
          trapped.value = false;
        }
      };
      vue.onMounted(() => {
        vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
          triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
          triggerTargetAriaStopWatch = void 0;
          const el = vue.unref(triggerTargetEl || contentRef.value);
          const prevEl = vue.unref(prevTriggerTargetEl || contentRef.value);
          if (isElement(el)) {
            triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
              ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (prevEl !== el && isElement(prevEl)) {
            ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
              prevEl.removeAttribute(key);
            });
          }
        }, { immediate: true });
        vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
      });
      vue.onBeforeUnmount(() => {
        triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = void 0;
      });
      expose({
        popperContentRef: contentRef,
        popperInstanceRef: instanceRef,
        updatePopper,
        contentStyle
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          ref_key: "contentRef",
          ref: contentRef
        }, vue.unref(contentAttrs), {
          style: vue.unref(contentStyle),
          class: vue.unref(contentClass),
          tabindex: "-1",
          onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
          onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
        }), [
          vue.createVNode(vue.unref(ElFocusTrap), {
            trapped: vue.unref(trapped),
            "trap-on-focus-in": true,
            "focus-trap-el": vue.unref(contentRef),
            "focus-start-el": vue.unref(focusStartRef),
            onFocusAfterTrapped: vue.unref(onFocusAfterTrapped),
            onFocusAfterReleased: vue.unref(onFocusAfterReleased),
            onFocusin: vue.unref(onFocusInTrap),
            onFocusoutPrevented: vue.unref(onFocusoutPrevented),
            onReleaseRequested: vue.unref(onReleaseRequested)
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusin", "onFocusoutPrevented", "onReleaseRequested"])
        ], 16);
      };
    }
  });
  var ElPopperContent = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__file", "content.vue"]]);
  const ElPopper = withInstall(Popper);
  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
  const useTooltipContentProps = buildProps({
    ...useDelayedToggleProps,
    ...popperContentProps,
    appendTo: {
      type: definePropType([String, Object])
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: {
      type: Boolean,
      default: false
    },
    persistent: Boolean,
    ariaLabel: String,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: String,
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: Boolean
  });
  const useTooltipTriggerProps = buildProps({
    ...popperTriggerProps,
    disabled: Boolean,
    trigger: {
      type: definePropType([String, Array]),
      default: "hover"
    },
    triggerKeys: {
      type: definePropType(Array),
      default: () => [EVENT_CODE.enter, EVENT_CODE.space]
    }
  });
  const {
    useModelToggleProps: useTooltipModelToggleProps,
    useModelToggleEmits: useTooltipModelToggleEmits,
    useModelToggle: useTooltipModelToggle
  } = createModelToggleComposable("visible");
  const useTooltipProps = buildProps({
    ...popperProps,
    ...useTooltipModelToggleProps,
    ...useTooltipContentProps,
    ...useTooltipTriggerProps,
    ...popperArrowProps,
    showArrow: {
      type: Boolean,
      default: true
    }
  });
  const tooltipEmits = [
    ...useTooltipModelToggleEmits,
    "before-show",
    "before-hide",
    "show",
    "hide",
    "open",
    "close"
  ];
  const isTriggerType = (trigger, type) => {
    if (isArray$2(trigger)) {
      return trigger.includes(type);
    }
    return trigger === type;
  };
  const whenTrigger = (trigger, type, handler) => {
    return (e) => {
      isTriggerType(vue.unref(trigger), type) && handler(e);
    };
  };
  const __default__$b = vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: useTooltipTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("tooltip");
      const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const triggerRef = vue.ref(null);
      const stopWhenControlledOrDisabled = () => {
        if (vue.unref(controlled) || props.disabled) {
          return true;
        }
      };
      const trigger = vue.toRef(props, "trigger");
      const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onOpen));
      const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
      const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
        if (e.button === 0) {
          onToggle(e);
        }
      }));
      const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
      const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
      const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
        e.preventDefault();
        onToggle(e);
      }));
      const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
        const { code } = e;
        if (props.triggerKeys.includes(code)) {
          e.preventDefault();
          onToggle(e);
        }
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopperTrigger), {
          id: vue.unref(id),
          "virtual-ref": _ctx.virtualRef,
          open: vue.unref(open),
          "virtual-triggering": _ctx.virtualTriggering,
          class: vue.normalizeClass(vue.unref(ns).e("trigger")),
          onBlur: vue.unref(onBlur),
          onClick: vue.unref(onClick),
          onContextmenu: vue.unref(onContextMenu),
          onFocus: vue.unref(onFocus),
          onMouseenter: vue.unref(onMouseenter),
          onMouseleave: vue.unref(onMouseleave),
          onKeydown: vue.unref(onKeydown)
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
      };
    }
  });
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__file", "trigger.vue"]]);
  var define_process_env_default = { production: "production" };
  const __default__$a = vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const ns = useNamespace("tooltip");
      const contentRef = vue.ref(null);
      const destroyed = vue.ref(false);
      const {
        controlled,
        id,
        open,
        trigger,
        onClose,
        onOpen,
        onShow,
        onHide,
        onBeforeShow,
        onBeforeHide
      } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const transitionClass = vue.computed(() => {
        return props.transition || `${ns.namespace.value}-fade-in-linear`;
      });
      const persistentRef = vue.computed(() => {
        if (define_process_env_default.NODE_ENV === "test") {
          return true;
        }
        return props.persistent;
      });
      vue.onBeforeUnmount(() => {
        destroyed.value = true;
      });
      const shouldRender = vue.computed(() => {
        return vue.unref(persistentRef) ? true : vue.unref(open);
      });
      const shouldShow = vue.computed(() => {
        return props.disabled ? false : vue.unref(open);
      });
      const appendTo = vue.computed(() => {
        return props.appendTo || selector.value;
      });
      const contentStyle = vue.computed(() => {
        var _a2;
        return (_a2 = props.style) != null ? _a2 : {};
      });
      const ariaHidden = vue.computed(() => !vue.unref(open));
      const onTransitionLeave = () => {
        onHide();
      };
      const stopWhenControlled = () => {
        if (vue.unref(controlled))
          return true;
      };
      const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
        if (props.enterable && vue.unref(trigger) === "hover") {
          onOpen();
        }
      });
      const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
        if (vue.unref(trigger) === "hover") {
          onClose();
        }
      });
      const onBeforeEnter = () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        onBeforeShow == null ? void 0 : onBeforeShow();
      };
      const onBeforeLeave = () => {
        onBeforeHide == null ? void 0 : onBeforeHide();
      };
      const onAfterShow = () => {
        onShow();
        stopHandle = onClickOutside(vue.computed(() => {
          var _a2;
          return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
        }), () => {
          if (vue.unref(controlled))
            return;
          const $trigger = vue.unref(trigger);
          if ($trigger !== "hover") {
            onClose();
          }
        });
      };
      const onBlur = () => {
        if (!props.virtualTriggering) {
          onClose();
        }
      };
      let stopHandle;
      vue.watch(() => vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        }
      }, {
        flush: "post"
      });
      vue.watch(() => props.content, () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      expose({
        contentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, {
          disabled: !_ctx.teleported,
          to: vue.unref(appendTo)
        }, [
          vue.createVNode(vue.Transition, {
            name: vue.unref(transitionClass),
            onAfterLeave: onTransitionLeave,
            onBeforeEnter,
            onAfterEnter: onAfterShow,
            onBeforeLeave
          }, {
            default: vue.withCtx(() => [
              vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElPopperContent), vue.mergeProps({
                key: 0,
                id: vue.unref(id),
                ref_key: "contentRef",
                ref: contentRef
              }, _ctx.$attrs, {
                "aria-label": _ctx.ariaLabel,
                "aria-hidden": vue.unref(ariaHidden),
                "boundaries-padding": _ctx.boundariesPadding,
                "fallback-placements": _ctx.fallbackPlacements,
                "gpu-acceleration": _ctx.gpuAcceleration,
                offset: _ctx.offset,
                placement: _ctx.placement,
                "popper-options": _ctx.popperOptions,
                strategy: _ctx.strategy,
                effect: _ctx.effect,
                enterable: _ctx.enterable,
                pure: _ctx.pure,
                "popper-class": _ctx.popperClass,
                "popper-style": [_ctx.popperStyle, vue.unref(contentStyle)],
                "reference-el": _ctx.referenceEl,
                "trigger-target-el": _ctx.triggerTargetEl,
                visible: vue.unref(shouldShow),
                "z-index": _ctx.zIndex,
                onMouseenter: vue.unref(onContentEnter),
                onMouseleave: vue.unref(onContentLeave),
                onBlur,
                onClose: vue.unref(onClose)
              }), {
                default: vue.withCtx(() => [
                  !destroyed.value ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                [vue.vShow, vue.unref(shouldShow)]
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["name"])
        ], 8, ["disabled", "to"]);
      };
    }
  });
  var ElTooltipContent = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__file", "content.vue"]]);
  const _hoisted_1$9 = ["innerHTML"];
  const _hoisted_2$7 = { key: 1 };
  const __default__$9 = vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const id = useId();
      const popperRef = vue.ref();
      const contentRef = vue.ref();
      const updatePopper = () => {
        var _a2;
        const popperComponent = vue.unref(popperRef);
        if (popperComponent) {
          (_a2 = popperComponent.popperInstanceRef) == null ? void 0 : _a2.update();
        }
      };
      const open = vue.ref(false);
      const toggleReason = vue.ref();
      const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
        indicator: open,
        toggleReason
      });
      const { onOpen, onClose } = useDelayedToggle({
        showAfter: vue.toRef(props, "showAfter"),
        hideAfter: vue.toRef(props, "hideAfter"),
        autoClose: vue.toRef(props, "autoClose"),
        open: show,
        close: hide
      });
      const controlled = vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
      vue.provide(TOOLTIP_INJECTION_KEY, {
        controlled,
        id,
        open: vue.readonly(open),
        trigger: vue.toRef(props, "trigger"),
        onOpen: (event) => {
          onOpen(event);
        },
        onClose: (event) => {
          onClose(event);
        },
        onToggle: (event) => {
          if (vue.unref(open)) {
            onClose(event);
          } else {
            onOpen(event);
          }
        },
        onShow: () => {
          emit("show", toggleReason.value);
        },
        onHide: () => {
          emit("hide", toggleReason.value);
        },
        onBeforeShow: () => {
          emit("before-show", toggleReason.value);
        },
        onBeforeHide: () => {
          emit("before-hide", toggleReason.value);
        },
        updatePopper
      });
      vue.watch(() => props.disabled, (disabled) => {
        if (disabled && open.value) {
          open.value = false;
        }
      });
      const isFocusInsideContent = (event) => {
        var _a2, _b;
        const popperContent = (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.contentRef) == null ? void 0 : _b.popperContentRef;
        const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent && popperContent.contains(activeElement);
      };
      vue.onDeactivated(() => open.value && hide());
      expose({
        popperRef,
        contentRef,
        isFocusInsideContent,
        updatePopper,
        onOpen,
        onClose,
        hide
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopper), {
          ref_key: "popperRef",
          ref: popperRef,
          role: _ctx.role
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(ElTooltipTrigger, {
              disabled: _ctx.disabled,
              trigger: _ctx.trigger,
              "trigger-keys": _ctx.triggerKeys,
              "virtual-ref": _ctx.virtualRef,
              "virtual-triggering": _ctx.virtualTriggering
            }, {
              default: vue.withCtx(() => [
                _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
            vue.createVNode(ElTooltipContent, {
              ref_key: "contentRef",
              ref: contentRef,
              "aria-label": _ctx.ariaLabel,
              "boundaries-padding": _ctx.boundariesPadding,
              content: _ctx.content,
              disabled: _ctx.disabled,
              effect: _ctx.effect,
              enterable: _ctx.enterable,
              "fallback-placements": _ctx.fallbackPlacements,
              "hide-after": _ctx.hideAfter,
              "gpu-acceleration": _ctx.gpuAcceleration,
              offset: _ctx.offset,
              persistent: _ctx.persistent,
              "popper-class": _ctx.popperClass,
              "popper-style": _ctx.popperStyle,
              placement: _ctx.placement,
              "popper-options": _ctx.popperOptions,
              pure: _ctx.pure,
              "raw-content": _ctx.rawContent,
              "reference-el": _ctx.referenceEl,
              "trigger-target-el": _ctx.triggerTargetEl,
              "show-after": _ctx.showAfter,
              strategy: _ctx.strategy,
              teleported: _ctx.teleported,
              transition: _ctx.transition,
              "virtual-triggering": _ctx.virtualTriggering,
              "z-index": _ctx.zIndex,
              "append-to": _ctx.appendTo
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  _ctx.rawContent ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    innerHTML: _ctx.content
                  }, null, 8, _hoisted_1$9)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$7, vue.toDisplayString(_ctx.content), 1))
                ]),
                _ctx.showArrow ? (vue.openBlock(), vue.createBlock(vue.unref(ElPopperArrow), {
                  key: 0,
                  "arrow-offset": _ctx.arrowOffset
                }, null, 8, ["arrow-offset"])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
          ]),
          _: 3
        }, 8, ["role"]);
      };
    }
  });
  var Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__file", "tooltip.vue"]]);
  const ElTooltip = withInstall(Tooltip);
  const badgeProps = buildProps({
    value: {
      type: [String, Number],
      default: ""
    },
    max: {
      type: Number,
      default: 99
    },
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      values: ["primary", "success", "warning", "info", "danger"],
      default: "danger"
    }
  });
  const _hoisted_1$8 = ["textContent"];
  const __default__$8 = vue.defineComponent({
    name: "ElBadge"
  });
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: badgeProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("badge");
      const content = vue.computed(() => {
        if (props.isDot)
          return "";
        if (isNumber(props.value) && isNumber(props.max)) {
          return props.max < props.value ? `${props.max}+` : `${props.value}`;
        }
        return `${props.value}`;
      });
      expose({
        content
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.renderSlot(_ctx.$slots, "default"),
          vue.createVNode(vue.Transition, {
            name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
            persisted: ""
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("sup", {
                class: vue.normalizeClass([
                  vue.unref(ns).e("content"),
                  vue.unref(ns).em("content", _ctx.type),
                  vue.unref(ns).is("fixed", !!_ctx.$slots.default),
                  vue.unref(ns).is("dot", _ctx.isDot)
                ]),
                textContent: vue.toDisplayString(vue.unref(content))
              }, null, 10, _hoisted_1$8), [
                [vue.vShow, !_ctx.hidden && (vue.unref(content) || _ctx.isDot)]
              ])
            ]),
            _: 1
          }, 8, ["name"])
        ], 2);
      };
    }
  });
  var Badge = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__file", "badge.vue"]]);
  const ElBadge = withInstall(Badge);
  const buttonGroupContextKey = Symbol("buttonGroupContextKey");
  const useButton = (props, emit) => {
    useDeprecated({
      from: "type.text",
      replacement: "link",
      version: "3.0.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
    }, vue.computed(() => props.type === "text"));
    const buttonGroupContext = vue.inject(buttonGroupContextKey, void 0);
    const globalConfig2 = useGlobalConfig("button");
    const { form } = useFormItem();
    const _size = useFormSize(vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
    const _disabled = useFormDisabled();
    const _ref = vue.ref();
    const slots = vue.useSlots();
    const _type = vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
    const autoInsertSpace = vue.computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a2 = globalConfig2.value) == null ? void 0 : _a2.autoInsertSpace) != null ? _c : false;
    });
    const _props = vue.computed(() => {
      if (props.tag === "button") {
        return {
          ariaDisabled: _disabled.value || props.loading,
          disabled: _disabled.value || props.loading,
          autofocus: props.autofocus,
          type: props.nativeType
        };
      }
      return {};
    });
    const shouldAddSpace = vue.computed(() => {
      var _a2;
      const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
        const slot = defaultSlot[0];
        if ((slot == null ? void 0 : slot.type) === vue.Text) {
          const text = slot.children;
          return new RegExp("^\\p{Unified_Ideograph}{2}$", "u").test(text.trim());
        }
      }
      return false;
    });
    const handleClick = (evt) => {
      if (props.nativeType === "reset") {
        form == null ? void 0 : form.resetFields();
      }
      emit("click", evt);
    };
    return {
      _disabled,
      _size,
      _type,
      _ref,
      _props,
      shouldAddSpace,
      handleClick
    };
  };
  const buttonTypes = [
    "default",
    "primary",
    "success",
    "warning",
    "info",
    "danger",
    "text",
    ""
  ];
  const buttonNativeTypes = ["button", "submit", "reset"];
  const buttonProps = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    type: {
      type: String,
      values: buttonTypes,
      default: ""
    },
    icon: {
      type: iconPropType
    },
    nativeType: {
      type: String,
      values: buttonNativeTypes,
      default: "button"
    },
    loading: Boolean,
    loadingIcon: {
      type: iconPropType,
      default: () => loading_default
    },
    plain: Boolean,
    text: Boolean,
    link: Boolean,
    bg: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    color: String,
    dark: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: void 0
    },
    tag: {
      type: definePropType([String, Object]),
      default: "button"
    }
  });
  const buttonEmits = {
    click: (evt) => evt instanceof MouseEvent
  };
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  }
  function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
  function hue2rgb(p, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q2 - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p + (q2 - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
      g = l;
      b = l;
      r = l;
    } else {
      var q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q2;
      r = hue2rgb(p, q2, h + 1 / 3);
      g = hue2rgb(p, q2, h);
      b = hue2rgb(p, q2, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, v };
  }
  function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f2 = h - i;
    var p = v * (1 - s);
    var q2 = v * (1 - f2 * s);
    var t = v * (1 - (1 - f2) * s);
    var mod = i % 6;
    var r = [v, q2, p, p, t, v][mod];
    var g = [t, v, v, q2, p, p][mod];
    var b = [p, p, t, v, v, q2][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format2 = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format2 = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format2 = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format2 = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format2,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var TinyColor = (
    /** @class */
    function() {
      function TinyColor2(color, opts) {
        if (color === void 0) {
          color = "";
        }
        if (opts === void 0) {
          opts = {};
        }
        var _a2;
        if (color instanceof TinyColor2) {
          return color;
        }
        if (typeof color === "number") {
          color = numberInputToObject(color);
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
        this.gradientType = opts.gradientType;
        if (this.r < 1) {
          this.r = Math.round(this.r);
        }
        if (this.g < 1) {
          this.g = Math.round(this.g);
        }
        if (this.b < 1) {
          this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
      }
      TinyColor2.prototype.isDark = function() {
        return this.getBrightness() < 128;
      };
      TinyColor2.prototype.isLight = function() {
        return !this.isDark();
      };
      TinyColor2.prototype.getBrightness = function() {
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
      };
      TinyColor2.prototype.getLuminance = function() {
        var rgb = this.toRgb();
        var R2;
        var G2;
        var B2;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
          R2 = RsRGB / 12.92;
        } else {
          R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
          G2 = GsRGB / 12.92;
        } else {
          G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
          B2 = BsRGB / 12.92;
        } else {
          B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
      };
      TinyColor2.prototype.getAlpha = function() {
        return this.a;
      };
      TinyColor2.prototype.setAlpha = function(alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
      };
      TinyColor2.prototype.isMonochrome = function() {
        var s = this.toHsl().s;
        return s === 0;
      };
      TinyColor2.prototype.toHsv = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
      };
      TinyColor2.prototype.toHsvString = function() {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHsl = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
      };
      TinyColor2.prototype.toHslString = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toHex = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
      };
      TinyColor2.prototype.toHexString = function(allow3Char) {
        if (allow3Char === void 0) {
          allow3Char = false;
        }
        return "#" + this.toHex(allow3Char);
      };
      TinyColor2.prototype.toHex8 = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
      };
      TinyColor2.prototype.toHex8String = function(allow4Char) {
        if (allow4Char === void 0) {
          allow4Char = false;
        }
        return "#" + this.toHex8(allow4Char);
      };
      TinyColor2.prototype.toHexShortString = function(allowShortChar) {
        if (allowShortChar === void 0) {
          allowShortChar = false;
        }
        return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
      };
      TinyColor2.prototype.toRgb = function() {
        return {
          r: Math.round(this.r),
          g: Math.round(this.g),
          b: Math.round(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toRgbString = function() {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toPercentageRgb = function() {
        var fmt = function(x) {
          return "".concat(Math.round(bound01(x, 255) * 100), "%");
        };
        return {
          r: fmt(this.r),
          g: fmt(this.g),
          b: fmt(this.b),
          a: this.a
        };
      };
      TinyColor2.prototype.toPercentageRgbString = function() {
        var rnd = function(x) {
          return Math.round(bound01(x, 255) * 100);
        };
        return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
      };
      TinyColor2.prototype.toName = function() {
        if (this.a === 0) {
          return "transparent";
        }
        if (this.a < 1) {
          return false;
        }
        var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
          var _b = _a2[_i], key = _b[0], value = _b[1];
          if (hex === value) {
            return key;
          }
        }
        return false;
      };
      TinyColor2.prototype.toString = function(format2) {
        var formatSet = Boolean(format2);
        format2 = format2 !== null && format2 !== void 0 ? format2 : this.format;
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format2.startsWith("hex") || format2 === "name");
        if (needsAlphaFormat) {
          if (format2 === "name" && this.a === 0) {
            return this.toName();
          }
          return this.toRgbString();
        }
        if (format2 === "rgb") {
          formattedString = this.toRgbString();
        }
        if (format2 === "prgb") {
          formattedString = this.toPercentageRgbString();
        }
        if (format2 === "hex" || format2 === "hex6") {
          formattedString = this.toHexString();
        }
        if (format2 === "hex3") {
          formattedString = this.toHexString(true);
        }
        if (format2 === "hex4") {
          formattedString = this.toHex8String(true);
        }
        if (format2 === "hex8") {
          formattedString = this.toHex8String();
        }
        if (format2 === "name") {
          formattedString = this.toName();
        }
        if (format2 === "hsl") {
          formattedString = this.toHslString();
        }
        if (format2 === "hsv") {
          formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
      };
      TinyColor2.prototype.toNumber = function() {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
      };
      TinyColor2.prototype.clone = function() {
        return new TinyColor2(this.toString());
      };
      TinyColor2.prototype.lighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.brighten = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor2(rgb);
      };
      TinyColor2.prototype.darken = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.tint = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("white", amount);
      };
      TinyColor2.prototype.shade = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        return this.mix("black", amount);
      };
      TinyColor2.prototype.desaturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.saturate = function(amount) {
        if (amount === void 0) {
          amount = 10;
        }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.greyscale = function() {
        return this.desaturate(100);
      };
      TinyColor2.prototype.spin = function(amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.mix = function(color, amount) {
        if (amount === void 0) {
          amount = 50;
        }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor2(color).toRgb();
        var p = amount / 100;
        var rgba = {
          r: (rgb2.r - rgb1.r) * p + rgb1.r,
          g: (rgb2.g - rgb1.g) * p + rgb1.g,
          b: (rgb2.b - rgb1.b) * p + rgb1.b,
          a: (rgb2.a - rgb1.a) * p + rgb1.a
        };
        return new TinyColor2(rgba);
      };
      TinyColor2.prototype.analogous = function(results, slices) {
        if (results === void 0) {
          results = 6;
        }
        if (slices === void 0) {
          slices = 30;
        }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
          hsl.h = (hsl.h + part) % 360;
          ret.push(new TinyColor2(hsl));
        }
        return ret;
      };
      TinyColor2.prototype.complement = function() {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor2(hsl);
      };
      TinyColor2.prototype.monochromatic = function(results) {
        if (results === void 0) {
          results = 6;
        }
        var hsv = this.toHsv();
        var h = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
          res.push(new TinyColor2({ h, s, v }));
          v = (v + modification) % 1;
        }
        return res;
      };
      TinyColor2.prototype.splitcomplement = function() {
        var hsl = this.toHsl();
        var h = hsl.h;
        return [
          this,
          new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
          new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
        ];
      };
      TinyColor2.prototype.onBackground = function(background) {
        var fg = this.toRgb();
        var bg = new TinyColor2(background).toRgb();
        var alpha = fg.a + bg.a * (1 - fg.a);
        return new TinyColor2({
          r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
          g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
          b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
          a: alpha
        });
      };
      TinyColor2.prototype.triad = function() {
        return this.polyad(3);
      };
      TinyColor2.prototype.tetrad = function() {
        return this.polyad(4);
      };
      TinyColor2.prototype.polyad = function(n) {
        var hsl = this.toHsl();
        var h = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
          result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
      };
      TinyColor2.prototype.equals = function(color) {
        return this.toRgbString() === new TinyColor2(color).toRgbString();
      };
      return TinyColor2;
    }()
  );
  function darken(color, amount = 20) {
    return color.mix("#141414", amount).toString();
  }
  function useButtonCustomStyle(props) {
    const _disabled = useFormDisabled();
    const ns = useNamespace("button");
    return vue.computed(() => {
      let styles = {};
      const buttonColor = props.color;
      if (buttonColor) {
        const color = new TinyColor(buttonColor);
        const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
        if (props.plain) {
          styles = ns.cssVarBlock({
            "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
            "text-color": buttonColor,
            "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
            "hover-text-color": `var(${ns.cssVarName("color-white")})`,
            "hover-bg-color": buttonColor,
            "hover-border-color": buttonColor,
            "active-bg-color": activeBgColor,
            "active-text-color": `var(${ns.cssVarName("color-white")})`,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
          }
        } else {
          const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
          const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
          styles = ns.cssVarBlock({
            "bg-color": buttonColor,
            "text-color": textColor,
            "border-color": buttonColor,
            "hover-bg-color": hoverBgColor,
            "hover-text-color": textColor,
            "hover-border-color": hoverBgColor,
            "active-bg-color": activeBgColor,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
            styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
          }
        }
      }
      return styles;
    });
  }
  const __default__$7 = vue.defineComponent({
    name: "ElButton"
  });
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const buttonStyle = useButtonCustomStyle(props);
      const ns = useNamespace("button");
      const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
      expose({
        ref: _ref,
        size: _size,
        type: _type,
        disabled: _disabled,
        shouldAddSpace
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), vue.mergeProps({
          ref_key: "_ref",
          ref: _ref
        }, vue.unref(_props), {
          class: [
            vue.unref(ns).b(),
            vue.unref(ns).m(vue.unref(_type)),
            vue.unref(ns).m(vue.unref(_size)),
            vue.unref(ns).is("disabled", vue.unref(_disabled)),
            vue.unref(ns).is("loading", _ctx.loading),
            vue.unref(ns).is("plain", _ctx.plain),
            vue.unref(ns).is("round", _ctx.round),
            vue.unref(ns).is("circle", _ctx.circle),
            vue.unref(ns).is("text", _ctx.text),
            vue.unref(ns).is("link", _ctx.link),
            vue.unref(ns).is("has-bg", _ctx.bg)
          ],
          style: vue.unref(buttonStyle),
          onClick: vue.unref(handleClick)
        }), {
          default: vue.withCtx(() => [
            _ctx.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              _ctx.$slots.loading ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).is("loading"))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.loadingIcon)))
                ]),
                _: 1
              }, 8, ["class"]))
            ], 64)) : _ctx.icon || _ctx.$slots.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
              default: vue.withCtx(() => [
                _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
              ]),
              _: 3
            })) : vue.createCommentVNode("v-if", true),
            _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass({ [vue.unref(ns).em("text", "expand")]: vue.unref(shouldAddSpace) })
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 16, ["class", "style", "onClick"]);
      };
    }
  });
  var Button = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__file", "button.vue"]]);
  const buttonGroupProps = {
    size: buttonProps.size,
    type: buttonProps.type
  };
  const __default__$6 = vue.defineComponent({
    name: "ElButtonGroup"
  });
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: buttonGroupProps,
    setup(__props) {
      const props = __props;
      vue.provide(buttonGroupContextKey, vue.reactive({
        size: vue.toRef(props, "size"),
        type: vue.toRef(props, "type")
      }));
      const ns = useNamespace("button");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(`${vue.unref(ns).b("group")}`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var ButtonGroup = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__file", "button-group.vue"]]);
  const ElButton = withInstall(Button, {
    ButtonGroup
  });
  withNoopInstall(ButtonGroup);
  const nodeList = /* @__PURE__ */ new Map();
  let startClick;
  if (isClient$1) {
    document.addEventListener("mousedown", (e) => startClick = e);
    document.addEventListener("mouseup", (e) => {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick);
        }
      }
    });
  }
  function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
      excludes = binding.arg;
    } else if (isElement(binding.arg)) {
      excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
      const popperRef = binding.instance.popperRef;
      const mouseUpTarget = mouseup.target;
      const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
      const isBound = !binding || !binding.instance;
      const isTargetExists = !mouseUpTarget || !mouseDownTarget;
      const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
      const isSelf = el === mouseUpTarget;
      const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
      const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
      if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
        return;
      }
      binding.value(mouseup, mousedown);
    };
  }
  const ClickOutside = {
    beforeMount(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      nodeList.get(el).push({
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      });
    },
    updated(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      const handlers = nodeList.get(el);
      const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
      const newHandler = {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      };
      if (oldHandlerIndex >= 0) {
        handlers.splice(oldHandlerIndex, 1, newHandler);
      } else {
        handlers.push(newHandler);
      }
    },
    unmounted(el) {
      nodeList.delete(el);
    }
  };
  const REPEAT_INTERVAL = 100;
  const REPEAT_DELAY = 600;
  const vRepeatClick = {
    beforeMount(el, binding) {
      const value = binding.value;
      const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction$1(value) ? {} : value;
      let intervalId;
      let delayId;
      const handler = () => isFunction$1(value) ? value() : value.handler();
      const clear = () => {
        if (delayId) {
          clearTimeout(delayId);
          delayId = void 0;
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = void 0;
        }
      };
      el.addEventListener("mousedown", (evt) => {
        if (evt.button !== 0)
          return;
        clear();
        handler();
        document.addEventListener("mouseup", () => clear(), {
          once: true
        });
        delayId = setTimeout(() => {
          intervalId = setInterval(() => {
            handler();
          }, interval);
        }, delay);
      });
    }
  };
  const checkboxProps = {
    modelValue: {
      type: [Number, String, Boolean],
      default: void 0
    },
    label: {
      type: [String, Boolean, Number, Object],
      default: void 0
    },
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: {
      type: String,
      default: void 0
    },
    trueLabel: {
      type: [String, Number],
      default: void 0
    },
    falseLabel: {
      type: [String, Number],
      default: void 0
    },
    id: {
      type: String,
      default: void 0
    },
    controls: {
      type: String,
      default: void 0
    },
    border: Boolean,
    size: useSizeProp,
    tabindex: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    }
  };
  const checkboxEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
    change: (val) => isString(val) || isNumber(val) || isBoolean(val)
  };
  const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
  const useCheckboxDisabled = ({
    model,
    isChecked
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isLimitDisabled = vue.computed(() => {
      var _a2, _b;
      const max = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value;
      const min = (_b = checkboxGroup == null ? void 0 : checkboxGroup.min) == null ? void 0 : _b.value;
      return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
    });
    const isDisabled = useFormDisabled(vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.disabled.value) || isLimitDisabled.value));
    return {
      isDisabled,
      isLimitDisabled
    };
  };
  const useCheckboxEvent = (props, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const { formItem } = useFormItem();
    const { emit } = vue.getCurrentInstance();
    function getLabeledValue(value) {
      var _a2, _b;
      return value === props.trueLabel || value === true ? (_a2 = props.trueLabel) != null ? _a2 : true : (_b = props.falseLabel) != null ? _b : false;
    }
    function emitChangeEvent(checked, e) {
      emit("change", getLabeledValue(checked), e);
    }
    function handleChange(e) {
      if (isLimitExceeded.value)
        return;
      const target = e.target;
      emit("change", getLabeledValue(target.checked), e);
    }
    async function onClickRoot(e) {
      if (isLimitExceeded.value)
        return;
      if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
        const eventTargets = e.composedPath();
        const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
        if (!hasLabel) {
          model.value = getLabeledValue([false, props.falseLabel].includes(model.value));
          await vue.nextTick();
          emitChangeEvent(model.value, e);
        }
      }
    }
    const validateEvent = vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.validateEvent) || props.validateEvent);
    vue.watch(() => props.modelValue, () => {
      if (validateEvent.value) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn(err));
      }
    });
    return {
      handleChange,
      onClickRoot
    };
  };
  const useCheckboxModel = (props) => {
    const selfModel = vue.ref(false);
    const { emit } = vue.getCurrentInstance();
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isGroup = vue.computed(() => isUndefined(checkboxGroup) === false);
    const isLimitExceeded = vue.ref(false);
    const model = vue.computed({
      get() {
        var _a2, _b;
        return isGroup.value ? (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.modelValue) == null ? void 0 : _a2.value : (_b = props.modelValue) != null ? _b : selfModel.value;
      },
      set(val) {
        var _a2, _b;
        if (isGroup.value && isArray$2(val)) {
          isLimitExceeded.value = ((_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value) !== void 0 && val.length > (checkboxGroup == null ? void 0 : checkboxGroup.max.value);
          isLimitExceeded.value === false && ((_b = checkboxGroup == null ? void 0 : checkboxGroup.changeEvent) == null ? void 0 : _b.call(checkboxGroup, val));
        } else {
          emit(UPDATE_MODEL_EVENT, val);
          selfModel.value = val;
        }
      }
    });
    return {
      model,
      isGroup,
      isLimitExceeded
    };
  };
  const useCheckboxStatus = (props, slots, { model }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isFocused = vue.ref(false);
    const isChecked = vue.computed(() => {
      const value = model.value;
      if (isBoolean(value)) {
        return value;
      } else if (isArray$2(value)) {
        if (isObject$2(props.label)) {
          return value.map(vue.toRaw).some((o) => isEqual(o, props.label));
        } else {
          return value.map(vue.toRaw).includes(props.label);
        }
      } else if (value !== null && value !== void 0) {
        return value === props.trueLabel;
      } else {
        return !!value;
      }
    });
    const checkboxButtonSize = useFormSize(vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }), {
      prop: true
    });
    const checkboxSize = useFormSize(vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }));
    const hasOwnLabel = vue.computed(() => {
      return !!slots.default || !isNil(props.label);
    });
    return {
      checkboxButtonSize,
      isChecked,
      isFocused,
      checkboxSize,
      hasOwnLabel
    };
  };
  const setStoreValue = (props, { model }) => {
    function addToStore() {
      if (isArray$2(model.value) && !model.value.includes(props.label)) {
        model.value.push(props.label);
      } else {
        model.value = props.trueLabel || true;
      }
    }
    props.checked && addToStore();
  };
  const useCheckbox = (props, slots) => {
    const { formItem: elFormItem } = useFormItem();
    const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
    const {
      isFocused,
      isChecked,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel
    } = useCheckboxStatus(props, slots, { model });
    const { isDisabled } = useCheckboxDisabled({ model, isChecked });
    const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
      formItemContext: elFormItem,
      disableIdGeneration: hasOwnLabel,
      disableIdManagement: isGroup
    });
    const { handleChange, onClickRoot } = useCheckboxEvent(props, {
      model,
      isLimitExceeded,
      hasOwnLabel,
      isDisabled,
      isLabeledByFormItem
    });
    setStoreValue(props, { model });
    return {
      inputId,
      isLabeledByFormItem,
      isChecked,
      isDisabled,
      isFocused,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel,
      model,
      handleChange,
      onClickRoot
    };
  };
  const _hoisted_1$7 = ["id", "indeterminate", "name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$6 = ["id", "indeterminate", "disabled", "value", "name", "tabindex"];
  const __default__$5 = vue.defineComponent({
    name: "ElCheckbox"
  });
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        inputId,
        isLabeledByFormItem,
        isChecked,
        isDisabled,
        isFocused,
        checkboxSize,
        hasOwnLabel,
        model,
        handleChange,
        onClickRoot
      } = useCheckbox(props, slots);
      const ns = useNamespace("checkbox");
      const compKls = vue.computed(() => {
        return [
          ns.b(),
          ns.m(checkboxSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("bordered", props.border),
          ns.is("checked", isChecked.value)
        ];
      });
      const spanKls = vue.computed(() => {
        return [
          ns.e("input"),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("indeterminate", props.indeterminate),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(!vue.unref(hasOwnLabel) && vue.unref(isLabeledByFormItem) ? "span" : "label"), {
          class: vue.normalizeClass(vue.unref(compKls)),
          "aria-controls": _ctx.indeterminate ? _ctx.controls : null,
          onClick: vue.unref(onClickRoot)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(spanKls))
            }, [
              _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 0,
                id: vue.unref(inputId),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).e("original")),
                type: "checkbox",
                indeterminate: _ctx.indeterminate,
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                "true-value": _ctx.trueLabel,
                "false-value": _ctx.falseLabel,
                onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
                onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
                }, ["stop"]))
              }, null, 42, _hoisted_1$7)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                id: vue.unref(inputId),
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).e("original")),
                type: "checkbox",
                indeterminate: _ctx.indeterminate,
                disabled: vue.unref(isDisabled),
                value: _ctx.label,
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
                onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
                onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
                }, ["stop"]))
              }, null, 42, _hoisted_2$6)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("inner"))
              }, null, 2)
            ], 2),
            vue.unref(hasOwnLabel) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(vue.unref(ns).e("label"))
            }, [
              vue.renderSlot(_ctx.$slots, "default"),
              !_ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
              ], 64)) : vue.createCommentVNode("v-if", true)
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 8, ["class", "aria-controls", "onClick"]);
      };
    }
  });
  var Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__file", "checkbox.vue"]]);
  const _hoisted_1$6 = ["name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$5 = ["name", "tabindex", "disabled", "value"];
  const __default__$4 = vue.defineComponent({
    name: "ElCheckboxButton"
  });
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        isFocused,
        isChecked,
        isDisabled,
        checkboxButtonSize,
        model,
        handleChange
      } = useCheckbox(props, slots);
      const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
      const ns = useNamespace("checkbox");
      const activeStyle = vue.computed(() => {
        var _a2, _b, _c, _d;
        const fillValue = (_b = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.fill) == null ? void 0 : _a2.value) != null ? _b : "";
        return {
          backgroundColor: fillValue,
          borderColor: fillValue,
          color: (_d = (_c = checkboxGroup == null ? void 0 : checkboxGroup.textColor) == null ? void 0 : _c.value) != null ? _d : "",
          boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
        };
      });
      const labelKls = vue.computed(() => {
        return [
          ns.b("button"),
          ns.bm("button", checkboxButtonSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("label", {
          class: vue.normalizeClass(vue.unref(labelKls))
        }, [
          _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            "true-value": _ctx.trueLabel,
            "false-value": _ctx.falseLabel,
            onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
            onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
            onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_1$6)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 1,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            value: _ctx.label,
            onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
            onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
            onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_2$5)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]),
          _ctx.$slots.default || _ctx.label ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
            style: vue.normalizeStyle(vue.unref(isChecked) ? vue.unref(activeStyle) : void 0)
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
            ])
          ], 6)) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var CheckboxButton = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__file", "checkbox-button.vue"]]);
  const checkboxGroupProps = buildProps({
    modelValue: {
      type: definePropType(Array),
      default: () => []
    },
    disabled: Boolean,
    min: Number,
    max: Number,
    size: useSizeProp,
    label: String,
    fill: String,
    textColor: String,
    tag: {
      type: String,
      default: "div"
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const checkboxGroupEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isArray$2(val),
    change: (val) => isArray$2(val)
  };
  const __default__$3 = vue.defineComponent({
    name: "ElCheckboxGroup"
  });
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: checkboxGroupProps,
    emits: checkboxGroupEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("checkbox");
      const { formItem } = useFormItem();
      const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const changeEvent = async (value) => {
        emit(UPDATE_MODEL_EVENT, value);
        await vue.nextTick();
        emit("change", value);
      };
      const modelValue = vue.computed({
        get() {
          return props.modelValue;
        },
        set(val) {
          changeEvent(val);
        }
      });
      vue.provide(checkboxGroupContextKey, {
        ...pick$1(vue.toRefs(props), [
          "size",
          "min",
          "max",
          "disabled",
          "validateEvent",
          "fill",
          "textColor"
        ]),
        modelValue,
        changeEvent
      });
      vue.watch(() => props.modelValue, () => {
        if (props.validateEvent) {
          formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn(err));
        }
      });
      return (_ctx, _cache) => {
        var _a2;
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
          id: vue.unref(groupId),
          class: vue.normalizeClass(vue.unref(ns).b("group")),
          role: "group",
          "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.label || "checkbox-group" : void 0,
          "aria-labelledby": vue.unref(isLabeledByFormItem) ? (_a2 = vue.unref(formItem)) == null ? void 0 : _a2.labelId : void 0
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
      };
    }
  });
  var CheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__file", "checkbox-group.vue"]]);
  const ElCheckbox = withInstall(Checkbox, {
    CheckboxButton,
    CheckboxGroup
  });
  withNoopInstall(CheckboxButton);
  withNoopInstall(CheckboxGroup);
  const tagProps = buildProps({
    type: {
      type: String,
      values: ["success", "info", "warning", "danger", ""],
      default: ""
    },
    closable: Boolean,
    disableTransitions: Boolean,
    hit: Boolean,
    color: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      values: componentSizes,
      default: ""
    },
    effect: {
      type: String,
      values: ["dark", "light", "plain"],
      default: "light"
    },
    round: Boolean
  });
  const tagEmits = {
    close: (evt) => evt instanceof MouseEvent,
    click: (evt) => evt instanceof MouseEvent
  };
  const __default__$2 = vue.defineComponent({
    name: "ElTag"
  });
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: tagProps,
    emits: tagEmits,
    setup(__props, { emit }) {
      const props = __props;
      const tagSize = useFormSize();
      const ns = useNamespace("tag");
      const containerKls = vue.computed(() => {
        const { type, hit, effect, closable, round } = props;
        return [
          ns.b(),
          ns.is("closable", closable),
          ns.m(type),
          ns.m(tagSize.value),
          ns.m(effect),
          ns.is("hit", hit),
          ns.is("round", round)
        ];
      });
      const handleClose = (event) => {
        emit("close", event);
      };
      const handleClick = (event) => {
        emit("click", event);
      };
      return (_ctx, _cache) => {
        return _ctx.disableTransitions ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(vue.unref(containerKls)),
          style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
          onClick: handleClick
        }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(vue.unref(ns).e("content"))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 2),
          _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("close")),
            onClick: vue.withModifiers(handleClose, ["stop"])
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(close_default))
            ]),
            _: 1
          }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
        ], 6)) : (vue.openBlock(), vue.createBlock(vue.Transition, {
          key: 1,
          name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
          appear: ""
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(containerKls)),
              style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
              onClick: handleClick
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("content"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2),
              _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("close")),
                onClick: vue.withModifiers(handleClose, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(close_default))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 6)
          ]),
          _: 3
        }, 8, ["name"]));
      };
    }
  });
  var Tag = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "tag.vue"]]);
  const ElTag = withInstall(Tag);
  const inputNumberProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: Boolean,
    max: {
      type: Number,
      default: Number.POSITIVE_INFINITY
    },
    min: {
      type: Number,
      default: Number.NEGATIVE_INFINITY
    },
    modelValue: Number,
    readonly: Boolean,
    disabled: Boolean,
    size: useSizeProp,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: "",
      values: ["", "right"]
    },
    valueOnClear: {
      type: [String, Number, null],
      validator: (val) => val === null || isNumber(val) || ["min", "max"].includes(val),
      default: null
    },
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator: (val) => val >= 0 && val === Number.parseInt(`${val}`, 10)
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const inputNumberEmits = {
    [CHANGE_EVENT]: (cur, prev) => prev !== cur,
    blur: (e) => e instanceof FocusEvent,
    focus: (e) => e instanceof FocusEvent,
    [INPUT_EVENT]: (val) => isNumber(val) || isNil(val),
    [UPDATE_MODEL_EVENT]: (val) => isNumber(val) || isNil(val)
  };
  const _hoisted_1$5 = ["aria-label", "onKeydown"];
  const _hoisted_2$4 = ["aria-label", "onKeydown"];
  const __default__$1 = vue.defineComponent({
    name: "ElInputNumber"
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: inputNumberProps,
    emits: inputNumberEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const { t } = useLocale();
      const ns = useNamespace("input-number");
      const input = vue.ref();
      const data = vue.reactive({
        currentValue: props.modelValue,
        userInput: null
      });
      const { formItem } = useFormItem();
      const minDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue <= props.min);
      const maxDisabled = vue.computed(() => isNumber(props.modelValue) && props.modelValue >= props.max);
      const numPrecision = vue.computed(() => {
        const stepPrecision = getPrecision(props.step);
        if (!isUndefined(props.precision)) {
          if (stepPrecision > props.precision) {
            debugWarn("InputNumber", "precision should not be less than the decimal places of step");
          }
          return props.precision;
        } else {
          return Math.max(getPrecision(props.modelValue), stepPrecision);
        }
      });
      const controlsAtRight = vue.computed(() => {
        return props.controls && props.controlsPosition === "right";
      });
      const inputNumberSize = useFormSize();
      const inputNumberDisabled = useFormDisabled();
      const displayValue = vue.computed(() => {
        if (data.userInput !== null) {
          return data.userInput;
        }
        let currentValue = data.currentValue;
        if (isNil(currentValue))
          return "";
        if (isNumber(currentValue)) {
          if (Number.isNaN(currentValue))
            return "";
          if (!isUndefined(props.precision)) {
            currentValue = currentValue.toFixed(props.precision);
          }
        }
        return currentValue;
      });
      const toPrecision = (num, pre) => {
        if (isUndefined(pre))
          pre = numPrecision.value;
        if (pre === 0)
          return Math.round(num);
        let snum = String(num);
        const pointPos = snum.indexOf(".");
        if (pointPos === -1)
          return num;
        const nums = snum.replace(".", "").split("");
        const datum = nums[pointPos + pre];
        if (!datum)
          return num;
        const length = snum.length;
        if (snum.charAt(length - 1) === "5") {
          snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
        }
        return Number.parseFloat(Number(snum).toFixed(pre));
      };
      const getPrecision = (value) => {
        if (isNil(value))
          return 0;
        const valueString = value.toString();
        const dotPosition = valueString.indexOf(".");
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      };
      const ensurePrecision = (val, coefficient = 1) => {
        if (!isNumber(val))
          return data.currentValue;
        return toPrecision(val + props.step * coefficient);
      };
      const increase = () => {
        if (props.readonly || inputNumberDisabled.value || maxDisabled.value)
          return;
        const value = Number(displayValue.value) || 0;
        const newVal = ensurePrecision(value);
        setCurrentValue(newVal);
        emit(INPUT_EVENT, data.currentValue);
      };
      const decrease = () => {
        if (props.readonly || inputNumberDisabled.value || minDisabled.value)
          return;
        const value = Number(displayValue.value) || 0;
        const newVal = ensurePrecision(value, -1);
        setCurrentValue(newVal);
        emit(INPUT_EVENT, data.currentValue);
      };
      const verifyValue = (value, update) => {
        const { max, min, step, precision, stepStrictly, valueOnClear } = props;
        if (max < min) {
          throwError("InputNumber", "min should not be greater than max.");
        }
        let newVal = Number(value);
        if (isNil(value) || Number.isNaN(newVal)) {
          return null;
        }
        if (value === "") {
          if (valueOnClear === null) {
            return null;
          }
          newVal = isString(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear;
        }
        if (stepStrictly) {
          newVal = toPrecision(Math.round(newVal / step) * step, precision);
        }
        if (!isUndefined(precision)) {
          newVal = toPrecision(newVal, precision);
        }
        if (newVal > max || newVal < min) {
          newVal = newVal > max ? max : min;
          update && emit(UPDATE_MODEL_EVENT, newVal);
        }
        return newVal;
      };
      const setCurrentValue = (value, emitChange = true) => {
        var _a2;
        const oldVal = data.currentValue;
        const newVal = verifyValue(value);
        if (!emitChange) {
          emit(UPDATE_MODEL_EVENT, newVal);
          return;
        }
        if (oldVal === newVal)
          return;
        data.userInput = null;
        emit(UPDATE_MODEL_EVENT, newVal);
        emit(CHANGE_EVENT, newVal, oldVal);
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "change").catch((err) => debugWarn(err));
        }
        data.currentValue = newVal;
      };
      const handleInput = (value) => {
        data.userInput = value;
        const newVal = value === "" ? null : Number(value);
        emit(INPUT_EVENT, newVal);
        setCurrentValue(newVal, false);
      };
      const handleInputChange = (value) => {
        const newVal = value !== "" ? Number(value) : "";
        if (isNumber(newVal) && !Number.isNaN(newVal) || value === "") {
          setCurrentValue(newVal);
        }
        data.userInput = null;
      };
      const focus = () => {
        var _a2, _b;
        (_b = (_a2 = input.value) == null ? void 0 : _a2.focus) == null ? void 0 : _b.call(_a2);
      };
      const blur = () => {
        var _a2, _b;
        (_b = (_a2 = input.value) == null ? void 0 : _a2.blur) == null ? void 0 : _b.call(_a2);
      };
      const handleFocus = (event) => {
        emit("focus", event);
      };
      const handleBlur = (event) => {
        var _a2;
        data.userInput = null;
        emit("blur", event);
        if (props.validateEvent) {
          (_a2 = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a2.call(formItem, "blur").catch((err) => debugWarn(err));
        }
      };
      vue.watch(() => props.modelValue, (value, oldValue) => {
        const newValue = verifyValue(value, true);
        if (data.userInput === null && newValue !== oldValue) {
          data.currentValue = newValue;
        }
      }, { immediate: true });
      vue.onMounted(() => {
        var _a2;
        const { min, max, modelValue } = props;
        const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
        innerInput.setAttribute("role", "spinbutton");
        if (Number.isFinite(max)) {
          innerInput.setAttribute("aria-valuemax", String(max));
        } else {
          innerInput.removeAttribute("aria-valuemax");
        }
        if (Number.isFinite(min)) {
          innerInput.setAttribute("aria-valuemin", String(min));
        } else {
          innerInput.removeAttribute("aria-valuemin");
        }
        innerInput.setAttribute("aria-valuenow", data.currentValue || data.currentValue === 0 ? String(data.currentValue) : "");
        innerInput.setAttribute("aria-disabled", String(inputNumberDisabled.value));
        if (!isNumber(modelValue) && modelValue != null) {
          let val = Number(modelValue);
          if (Number.isNaN(val)) {
            val = null;
          }
          emit(UPDATE_MODEL_EVENT, val);
        }
      });
      vue.onUpdated(() => {
        var _a2, _b;
        const innerInput = (_a2 = input.value) == null ? void 0 : _a2.input;
        innerInput == null ? void 0 : innerInput.setAttribute("aria-valuenow", `${(_b = data.currentValue) != null ? _b : ""}`);
      });
      expose({
        focus,
        blur
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([
            vue.unref(ns).b(),
            vue.unref(ns).m(vue.unref(inputNumberSize)),
            vue.unref(ns).is("disabled", vue.unref(inputNumberDisabled)),
            vue.unref(ns).is("without-controls", !_ctx.controls),
            vue.unref(ns).is("controls-right", vue.unref(controlsAtRight))
          ]),
          onDragstart: _cache[1] || (_cache[1] = vue.withModifiers(() => {
          }, ["prevent"]))
        }, [
          _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            role: "button",
            "aria-label": vue.unref(t)("el.inputNumber.decrease"),
            class: vue.normalizeClass([vue.unref(ns).e("decrease"), vue.unref(ns).is("disabled", vue.unref(minDisabled))]),
            onKeydown: vue.withKeys(decrease, ["enter"])
          }, [
            vue.createVNode(vue.unref(ElIcon), null, {
              default: vue.withCtx(() => [
                vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_down_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(minus_default), { key: 1 }))
              ]),
              _: 1
            })
          ], 42, _hoisted_1$5)), [
            [vue.unref(vRepeatClick), decrease]
          ]) : vue.createCommentVNode("v-if", true),
          _ctx.controls ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            role: "button",
            "aria-label": vue.unref(t)("el.inputNumber.increase"),
            class: vue.normalizeClass([vue.unref(ns).e("increase"), vue.unref(ns).is("disabled", vue.unref(maxDisabled))]),
            onKeydown: vue.withKeys(increase, ["enter"])
          }, [
            vue.createVNode(vue.unref(ElIcon), null, {
              default: vue.withCtx(() => [
                vue.unref(controlsAtRight) ? (vue.openBlock(), vue.createBlock(vue.unref(arrow_up_default), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(plus_default), { key: 1 }))
              ]),
              _: 1
            })
          ], 42, _hoisted_2$4)), [
            [vue.unref(vRepeatClick), increase]
          ]) : vue.createCommentVNode("v-if", true),
          vue.createVNode(vue.unref(ElInput), {
            id: _ctx.id,
            ref_key: "input",
            ref: input,
            type: "number",
            step: _ctx.step,
            "model-value": vue.unref(displayValue),
            placeholder: _ctx.placeholder,
            readonly: _ctx.readonly,
            disabled: vue.unref(inputNumberDisabled),
            size: vue.unref(inputNumberSize),
            max: _ctx.max,
            min: _ctx.min,
            name: _ctx.name,
            label: _ctx.label,
            "validate-event": false,
            onWheel: _cache[0] || (_cache[0] = vue.withModifiers(() => {
            }, ["prevent"])),
            onKeydown: [
              vue.withKeys(vue.withModifiers(increase, ["prevent"]), ["up"]),
              vue.withKeys(vue.withModifiers(decrease, ["prevent"]), ["down"])
            ],
            onBlur: handleBlur,
            onFocus: handleFocus,
            onInput: handleInput,
            onChange: handleInputChange
          }, null, 8, ["id", "step", "model-value", "placeholder", "readonly", "disabled", "size", "max", "min", "name", "label", "onKeydown"])
        ], 34);
      };
    }
  });
  var InputNumber = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__file", "input-number.vue"]]);
  const ElInputNumber = withInstall(InputNumber);
  const selectGroupKey = Symbol("ElSelectGroup");
  const selectKey = Symbol("ElSelect");
  function useOption(props, states) {
    const select = vue.inject(selectKey);
    const selectGroup = vue.inject(selectGroupKey, { disabled: false });
    const isObject$12 = vue.computed(() => isObject$2(props.value));
    const itemSelected = vue.computed(() => {
      if (!select.props.multiple) {
        return isEqual2(props.value, select.props.modelValue);
      } else {
        return contains(select.props.modelValue, props.value);
      }
    });
    const limitReached = vue.computed(() => {
      if (select.props.multiple) {
        const modelValue = select.props.modelValue || [];
        return !itemSelected.value && modelValue.length >= select.props.multipleLimit && select.props.multipleLimit > 0;
      } else {
        return false;
      }
    });
    const currentLabel = vue.computed(() => {
      return props.label || (isObject$12.value ? "" : props.value);
    });
    const currentValue = vue.computed(() => {
      return props.value || props.label || "";
    });
    const isDisabled = vue.computed(() => {
      return props.disabled || states.groupDisabled || limitReached.value;
    });
    const instance = vue.getCurrentInstance();
    const contains = (arr = [], target) => {
      if (!isObject$12.value) {
        return arr && arr.includes(target);
      } else {
        const valueKey = select.props.valueKey;
        return arr && arr.some((item) => {
          return vue.toRaw(get(item, valueKey)) === get(target, valueKey);
        });
      }
    };
    const isEqual2 = (a, b) => {
      if (!isObject$12.value) {
        return a === b;
      } else {
        const { valueKey } = select.props;
        return get(a, valueKey) === get(b, valueKey);
      }
    };
    const hoverItem = () => {
      if (!props.disabled && !selectGroup.disabled) {
        select.hoverIndex = select.optionsArray.indexOf(instance.proxy);
      }
    };
    vue.watch(() => currentLabel.value, () => {
      if (!props.created && !select.props.remote)
        select.setSelected();
    });
    vue.watch(() => props.value, (val, oldVal) => {
      const { remote, valueKey } = select.props;
      if (!Object.is(val, oldVal)) {
        select.onOptionDestroy(oldVal, instance.proxy);
        select.onOptionCreate(instance.proxy);
      }
      if (!props.created && !remote) {
        if (valueKey && isObject$2(val) && isObject$2(oldVal) && val[valueKey] === oldVal[valueKey]) {
          return;
        }
        select.setSelected();
      }
    });
    vue.watch(() => selectGroup.disabled, () => {
      states.groupDisabled = selectGroup.disabled;
    }, { immediate: true });
    const { queryChange } = vue.toRaw(select);
    vue.watch(queryChange, (changes) => {
      const { query } = vue.unref(changes);
      const regexp = new RegExp(escapeStringRegexp(query), "i");
      states.visible = regexp.test(currentLabel.value) || props.created;
      if (!states.visible) {
        select.filteredOptionsCount--;
      }
    }, { immediate: true });
    return {
      select,
      currentLabel,
      currentValue,
      itemSelected,
      isDisabled,
      hoverItem
    };
  }
  const _sfc_main$6 = vue.defineComponent({
    name: "ElOption",
    componentName: "ElOption",
    props: {
      value: {
        required: true,
        type: [String, Number, Boolean, Object]
      },
      label: [String, Number],
      created: Boolean,
      disabled: Boolean
    },
    setup(props) {
      const ns = useNamespace("select");
      const id = useId();
      const containerKls = vue.computed(() => [
        ns.be("dropdown", "item"),
        ns.is("disabled", vue.unref(isDisabled)),
        {
          selected: vue.unref(itemSelected),
          hover: vue.unref(hover)
        }
      ]);
      const states = vue.reactive({
        index: -1,
        groupDisabled: false,
        visible: true,
        hitState: false,
        hover: false
      });
      const { currentLabel, itemSelected, isDisabled, select, hoverItem } = useOption(props, states);
      const { visible, hover } = vue.toRefs(states);
      const vm = vue.getCurrentInstance().proxy;
      select.onOptionCreate(vm);
      vue.onBeforeUnmount(() => {
        const key = vm.value;
        const { selected } = select;
        const selectedOptions = select.props.multiple ? selected : [selected];
        const doesSelected = selectedOptions.some((item) => {
          return item.value === vm.value;
        });
        vue.nextTick(() => {
          if (select.cachedOptions.get(key) === vm && !doesSelected) {
            select.cachedOptions.delete(key);
          }
        });
        select.onOptionDestroy(key, vm);
      });
      function selectOptionClick() {
        if (props.disabled !== true && states.groupDisabled !== true) {
          select.handleOptionSelect(vm);
        }
      }
      return {
        ns,
        id,
        containerKls,
        currentLabel,
        itemSelected,
        isDisabled,
        select,
        hoverItem,
        visible,
        hover,
        selectOptionClick,
        states
      };
    }
  });
  const _hoisted_1$4 = ["id", "aria-disabled", "aria-selected"];
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
      id: _ctx.id,
      class: vue.normalizeClass(_ctx.containerKls),
      role: "option",
      "aria-disabled": _ctx.isDisabled || void 0,
      "aria-selected": _ctx.itemSelected,
      onMouseenter: _cache[0] || (_cache[0] = (...args) => _ctx.hoverItem && _ctx.hoverItem(...args)),
      onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.selectOptionClick && _ctx.selectOptionClick(...args), ["stop"]))
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createElementVNode("span", null, vue.toDisplayString(_ctx.currentLabel), 1)
      ])
    ], 42, _hoisted_1$4)), [
      [vue.vShow, _ctx.visible]
    ]);
  }
  var Option = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$3], ["__file", "option.vue"]]);
  const _sfc_main$5 = vue.defineComponent({
    name: "ElSelectDropdown",
    componentName: "ElSelectDropdown",
    setup() {
      const select = vue.inject(selectKey);
      const ns = useNamespace("select");
      const popperClass = vue.computed(() => select.props.popperClass);
      const isMultiple = vue.computed(() => select.props.multiple);
      const isFitInputWidth = vue.computed(() => select.props.fitInputWidth);
      const minWidth = vue.ref("");
      function updateMinWidth() {
        var _a2;
        minWidth.value = `${(_a2 = select.selectWrapper) == null ? void 0 : _a2.offsetWidth}px`;
      }
      vue.onMounted(() => {
        updateMinWidth();
        useResizeObserver(select.selectWrapper, updateMinWidth);
      });
      return {
        ns,
        minWidth,
        popperClass,
        isMultiple,
        isFitInputWidth
      };
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass([_ctx.ns.b("dropdown"), _ctx.ns.is("multiple", _ctx.isMultiple), _ctx.popperClass]),
      style: vue.normalizeStyle({ [_ctx.isFitInputWidth ? "width" : "minWidth"]: _ctx.minWidth })
    }, [
      _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.ns.be("dropdown", "header"))
      }, [
        vue.renderSlot(_ctx.$slots, "header")
      ], 2)) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default"),
      _ctx.$slots.footer ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(_ctx.ns.be("dropdown", "footer"))
      }, [
        vue.renderSlot(_ctx.$slots, "footer")
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 6);
  }
  var ElSelectMenu = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$2], ["__file", "select-dropdown.vue"]]);
  function useSelectStates(props) {
    const { t } = useLocale();
    return vue.reactive({
      options: /* @__PURE__ */ new Map(),
      cachedOptions: /* @__PURE__ */ new Map(),
      disabledOptions: /* @__PURE__ */ new Map(),
      createdLabel: null,
      createdSelected: false,
      selected: props.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      selectedLabel: "",
      hoverIndex: -1,
      query: "",
      previousQuery: null,
      inputHovering: false,
      cachedPlaceHolder: "",
      currentPlaceholder: t("el.select.placeholder"),
      menuVisibleOnFocus: false,
      isOnComposition: false,
      prefixWidth: 11,
      mouseEnter: false,
      focused: false
    });
  }
  const useSelect = (props, states, ctx) => {
    const { t } = useLocale();
    const ns = useNamespace("select");
    useDeprecated({
      from: "suffixTransition",
      replacement: "override style scheme",
      version: "2.3.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/select.html#select-attributes"
    }, vue.computed(() => props.suffixTransition === false));
    const reference = vue.ref(null);
    const input = vue.ref(null);
    const iOSInput = vue.ref(null);
    const tooltipRef = vue.ref(null);
    const tagTooltipRef = vue.ref(null);
    const tags = vue.ref(null);
    const selectWrapper = vue.ref(null);
    const scrollbar = vue.ref(null);
    const hoverOption = vue.ref();
    const queryChange = vue.shallowRef({ query: "" });
    const groupQueryChange = vue.shallowRef("");
    const optionList = vue.ref([]);
    let originClientHeight = 0;
    const { form, formItem } = useFormItem();
    const readonly = vue.computed(() => !props.filterable || props.multiple || !states.visible);
    const selectDisabled = vue.computed(() => props.disabled || (form == null ? void 0 : form.disabled));
    const showClose = vue.computed(() => {
      const hasValue = props.multiple ? Array.isArray(props.modelValue) && props.modelValue.length > 0 : props.modelValue !== void 0 && props.modelValue !== null && props.modelValue !== "";
      const criteria = props.clearable && !selectDisabled.value && states.inputHovering && hasValue;
      return criteria;
    });
    const iconComponent = vue.computed(() => props.remote && props.filterable && !props.remoteShowSuffix ? "" : props.suffixIcon);
    const iconReverse = vue.computed(() => ns.is("reverse", iconComponent.value && states.visible && props.suffixTransition));
    const showStatusIconAndState = vue.computed(() => (form == null ? void 0 : form.statusIcon) && (formItem == null ? void 0 : formItem.validateState) && ValidateComponentsMap[formItem == null ? void 0 : formItem.validateState]);
    const debounce$1 = vue.computed(() => props.remote ? 300 : 0);
    const emptyText = vue.computed(() => {
      if (props.loading) {
        return props.loadingText || t("el.select.loading");
      } else {
        if (props.remote && states.query === "" && states.options.size === 0)
          return false;
        if (props.filterable && states.query && states.options.size > 0 && states.filteredOptionsCount === 0) {
          return props.noMatchText || t("el.select.noMatch");
        }
        if (states.options.size === 0) {
          return props.noDataText || t("el.select.noData");
        }
      }
      return null;
    });
    const optionsArray = vue.computed(() => {
      const list = Array.from(states.options.values());
      const newList = [];
      optionList.value.forEach((item) => {
        const index = list.findIndex((i) => i.currentLabel === item);
        if (index > -1) {
          newList.push(list[index]);
        }
      });
      return newList.length >= list.length ? newList : list;
    });
    const cachedOptionsArray = vue.computed(() => Array.from(states.cachedOptions.values()));
    const showNewOption = vue.computed(() => {
      const hasExistingOption = optionsArray.value.filter((option) => {
        return !option.created;
      }).some((option) => {
        return option.currentLabel === states.query;
      });
      return props.filterable && props.allowCreate && states.query !== "" && !hasExistingOption;
    });
    const selectSize = useFormSize();
    const collapseTagSize = vue.computed(() => ["small"].includes(selectSize.value) ? "small" : "default");
    const dropMenuVisible = vue.computed({
      get() {
        return states.visible && emptyText.value !== false;
      },
      set(val) {
        states.visible = val;
      }
    });
    vue.watch([() => selectDisabled.value, () => selectSize.value, () => form == null ? void 0 : form.size], () => {
      vue.nextTick(() => {
        resetInputHeight();
      });
    });
    vue.watch(() => props.placeholder, (val) => {
      states.cachedPlaceHolder = states.currentPlaceholder = val;
      const hasValue = props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0;
      if (hasValue) {
        states.currentPlaceholder = "";
      }
    });
    vue.watch(() => props.modelValue, (val, oldVal) => {
      if (props.multiple) {
        resetInputHeight();
        if (val && val.length > 0 || input.value && states.query !== "") {
          states.currentPlaceholder = "";
        } else {
          states.currentPlaceholder = states.cachedPlaceHolder;
        }
        if (props.filterable && !props.reserveKeyword) {
          states.query = "";
          handleQueryChange(states.query);
        }
      }
      setSelected();
      if (props.filterable && !props.multiple) {
        states.inputLength = 20;
      }
      if (!isEqual(val, oldVal) && props.validateEvent) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn(err));
      }
    }, {
      flush: "post",
      deep: true
    });
    vue.watch(() => states.visible, (val) => {
      var _a2, _b, _c, _d, _e;
      if (!val) {
        if (props.filterable) {
          if (isFunction$1(props.filterMethod)) {
            props.filterMethod("");
          }
          if (isFunction$1(props.remoteMethod)) {
            props.remoteMethod("");
          }
        }
        states.query = "";
        states.previousQuery = null;
        states.selectedLabel = "";
        states.inputLength = 20;
        states.menuVisibleOnFocus = false;
        resetHoverIndex();
        vue.nextTick(() => {
          if (input.value && input.value.value === "" && states.selected.length === 0) {
            states.currentPlaceholder = states.cachedPlaceHolder;
          }
        });
        if (!props.multiple) {
          if (states.selected) {
            if (props.filterable && props.allowCreate && states.createdSelected && states.createdLabel) {
              states.selectedLabel = states.createdLabel;
            } else {
              states.selectedLabel = states.selected.currentLabel;
            }
            if (props.filterable)
              states.query = states.selectedLabel;
          }
          if (props.filterable) {
            states.currentPlaceholder = states.cachedPlaceHolder;
          }
        }
      } else {
        (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        if (props.filterable) {
          states.filteredOptionsCount = states.optionsCount;
          states.query = props.remote ? "" : states.selectedLabel;
          (_d = (_c = iOSInput.value) == null ? void 0 : _c.focus) == null ? void 0 : _d.call(_c);
          if (props.multiple) {
            (_e = input.value) == null ? void 0 : _e.focus();
          } else {
            if (states.selectedLabel) {
              states.currentPlaceholder = `${states.selectedLabel}`;
              states.selectedLabel = "";
            }
          }
          handleQueryChange(states.query);
          if (!props.multiple && !props.remote) {
            queryChange.value.query = "";
            vue.triggerRef(queryChange);
            vue.triggerRef(groupQueryChange);
          }
        }
      }
      ctx.emit("visible-change", val);
    });
    vue.watch(() => states.options.entries(), () => {
      var _a2, _b, _c;
      if (!isClient$1)
        return;
      (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      if (props.multiple) {
        resetInputHeight();
      }
      const inputs = ((_c = selectWrapper.value) == null ? void 0 : _c.querySelectorAll("input")) || [];
      if (!props.filterable && !props.defaultFirstOption && !isUndefined(props.modelValue) || !Array.from(inputs).includes(document.activeElement)) {
        setSelected();
      }
      if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
        checkDefaultFirstOption();
      }
    }, {
      flush: "post"
    });
    vue.watch(() => states.hoverIndex, (val) => {
      if (isNumber(val) && val > -1) {
        hoverOption.value = optionsArray.value[val] || {};
      } else {
        hoverOption.value = {};
      }
      optionsArray.value.forEach((option) => {
        option.hover = hoverOption.value === option;
      });
    });
    const resetInputHeight = () => {
      vue.nextTick(() => {
        var _a2, _b;
        if (!reference.value)
          return;
        const input2 = reference.value.$el.querySelector("input");
        originClientHeight = originClientHeight || (input2.clientHeight > 0 ? input2.clientHeight + 2 : 0);
        const _tags = tags.value;
        const cssVarOfSelectSize = getComputedStyle(input2).getPropertyValue(ns.cssVarName("input-height"));
        const gotSize = Number.parseFloat(cssVarOfSelectSize) || getComponentSize(selectSize.value || (form == null ? void 0 : form.size));
        const sizeInMap = selectSize.value || gotSize === originClientHeight || originClientHeight <= 0 ? gotSize : originClientHeight;
        const isElHidden = input2.offsetParent === null;
        !isElHidden && (input2.style.height = `${(states.selected.length === 0 ? sizeInMap : Math.max(_tags ? _tags.clientHeight + (_tags.clientHeight > sizeInMap ? 6 : 0) : 0, sizeInMap)) - 2}px`);
        if (states.visible && emptyText.value !== false) {
          (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        }
      });
    };
    const handleQueryChange = async (val) => {
      if (states.previousQuery === val || states.isOnComposition)
        return;
      if (states.previousQuery === null && (isFunction$1(props.filterMethod) || isFunction$1(props.remoteMethod))) {
        states.previousQuery = val;
        return;
      }
      states.previousQuery = val;
      vue.nextTick(() => {
        var _a2, _b;
        if (states.visible)
          (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      states.hoverIndex = -1;
      if (props.multiple && props.filterable) {
        vue.nextTick(() => {
          if (!selectDisabled.value) {
            const length = input.value.value.length * 15 + 20;
            states.inputLength = props.collapseTags ? Math.min(50, length) : length;
            managePlaceholder();
          }
          resetInputHeight();
        });
      }
      if (props.remote && isFunction$1(props.remoteMethod)) {
        states.hoverIndex = -1;
        props.remoteMethod(val);
      } else if (isFunction$1(props.filterMethod)) {
        props.filterMethod(val);
        vue.triggerRef(groupQueryChange);
      } else {
        states.filteredOptionsCount = states.optionsCount;
        queryChange.value.query = val;
        vue.triggerRef(queryChange);
        vue.triggerRef(groupQueryChange);
      }
      if (props.defaultFirstOption && (props.filterable || props.remote) && states.filteredOptionsCount) {
        await vue.nextTick();
        checkDefaultFirstOption();
      }
    };
    const managePlaceholder = () => {
      if (states.currentPlaceholder !== "") {
        states.currentPlaceholder = input.value.value ? "" : states.cachedPlaceHolder;
      }
    };
    const checkDefaultFirstOption = () => {
      const optionsInDropdown = optionsArray.value.filter((n) => n.visible && !n.disabled && !n.states.groupDisabled);
      const userCreatedOption = optionsInDropdown.find((n) => n.created);
      const firstOriginOption = optionsInDropdown[0];
      states.hoverIndex = getValueIndex(optionsArray.value, userCreatedOption || firstOriginOption);
    };
    const setSelected = () => {
      var _a2;
      if (!props.multiple) {
        const option = getOption(props.modelValue);
        if ((_a2 = option.props) == null ? void 0 : _a2.created) {
          states.createdLabel = option.props.value;
          states.createdSelected = true;
        } else {
          states.createdSelected = false;
        }
        states.selectedLabel = option.currentLabel;
        states.selected = option;
        if (props.filterable)
          states.query = states.selectedLabel;
        return;
      } else {
        states.selectedLabel = "";
      }
      const result = [];
      if (Array.isArray(props.modelValue)) {
        props.modelValue.forEach((value) => {
          result.push(getOption(value));
        });
      }
      states.selected = result;
      vue.nextTick(() => {
        resetInputHeight();
      });
    };
    const getOption = (value) => {
      let option;
      const isObjectValue = toRawType(value).toLowerCase() === "object";
      const isNull = toRawType(value).toLowerCase() === "null";
      const isUndefined2 = toRawType(value).toLowerCase() === "undefined";
      for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
        const cachedOption = cachedOptionsArray.value[i];
        const isEqualValue = isObjectValue ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey) : cachedOption.value === value;
        if (isEqualValue) {
          option = {
            value,
            currentLabel: cachedOption.currentLabel,
            isDisabled: cachedOption.isDisabled
          };
          break;
        }
      }
      if (option)
        return option;
      const label = isObjectValue ? value.label : !isNull && !isUndefined2 ? value : "";
      const newOption = {
        value,
        currentLabel: label
      };
      if (props.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    };
    const resetHoverIndex = () => {
      setTimeout(() => {
        const valueKey = props.valueKey;
        if (!props.multiple) {
          states.hoverIndex = optionsArray.value.findIndex((item) => {
            return getValueKey(item) === getValueKey(states.selected);
          });
        } else {
          if (states.selected.length > 0) {
            states.hoverIndex = Math.min.apply(null, states.selected.map((selected) => {
              return optionsArray.value.findIndex((item) => {
                return get(item, valueKey) === get(selected, valueKey);
              });
            }));
          } else {
            states.hoverIndex = -1;
          }
        }
      }, 300);
    };
    const handleResize = () => {
      var _a2, _b;
      resetInputWidth();
      (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      props.multiple && resetInputHeight();
    };
    const resetInputWidth = () => {
      var _a2;
      states.inputWidth = (_a2 = reference.value) == null ? void 0 : _a2.$el.offsetWidth;
    };
    const onInputChange = () => {
      if (props.filterable && states.query !== states.selectedLabel) {
        states.query = states.selectedLabel;
        handleQueryChange(states.query);
      }
    };
    const debouncedOnInputChange = debounce(() => {
      onInputChange();
    }, debounce$1.value);
    const debouncedQueryChange = debounce((e) => {
      handleQueryChange(e.target.value);
    }, debounce$1.value);
    const emitChange = (val) => {
      if (!isEqual(props.modelValue, val)) {
        ctx.emit(CHANGE_EVENT, val);
      }
    };
    const getLastNotDisabledIndex = (value) => findLastIndex(value, (it2) => !states.disabledOptions.has(it2));
    const deletePrevTag = (e) => {
      if (e.code === EVENT_CODE.delete)
        return;
      if (e.target.value.length <= 0 && !toggleLastOptionHitState()) {
        const value = props.modelValue.slice();
        const lastNotDisabledIndex = getLastNotDisabledIndex(value);
        if (lastNotDisabledIndex < 0)
          return;
        value.splice(lastNotDisabledIndex, 1);
        ctx.emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
      }
      if (e.target.value.length === 1 && props.modelValue.length === 0) {
        states.currentPlaceholder = states.cachedPlaceHolder;
      }
    };
    const deleteTag = (event, tag) => {
      const index = states.selected.indexOf(tag);
      if (index > -1 && !selectDisabled.value) {
        const value = props.modelValue.slice();
        value.splice(index, 1);
        ctx.emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
        ctx.emit("remove-tag", tag.value);
      }
      event.stopPropagation();
      focus();
    };
    const deleteSelected = (event) => {
      event.stopPropagation();
      const value = props.multiple ? [] : "";
      if (!isString(value)) {
        for (const item of states.selected) {
          if (item.isDisabled)
            value.push(item.value);
        }
      }
      ctx.emit(UPDATE_MODEL_EVENT, value);
      emitChange(value);
      states.hoverIndex = -1;
      states.visible = false;
      ctx.emit("clear");
      focus();
    };
    const handleOptionSelect = (option) => {
      var _a2;
      if (props.multiple) {
        const value = (props.modelValue || []).slice();
        const optionIndex = getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) {
          value.push(option.value);
        }
        ctx.emit(UPDATE_MODEL_EVENT, value);
        emitChange(value);
        if (option.created) {
          states.query = "";
          handleQueryChange("");
          states.inputLength = 20;
        }
        if (props.filterable)
          (_a2 = input.value) == null ? void 0 : _a2.focus();
      } else {
        ctx.emit(UPDATE_MODEL_EVENT, option.value);
        emitChange(option.value);
        states.visible = false;
      }
      setSoftFocus();
      if (states.visible)
        return;
      vue.nextTick(() => {
        scrollToOption(option);
      });
    };
    const getValueIndex = (arr = [], value) => {
      if (!isObject$2(value))
        return arr.indexOf(value);
      const valueKey = props.valueKey;
      let index = -1;
      arr.some((item, i) => {
        if (vue.toRaw(get(item, valueKey)) === get(value, valueKey)) {
          index = i;
          return true;
        }
        return false;
      });
      return index;
    };
    const setSoftFocus = () => {
      const _input = input.value || reference.value;
      if (_input) {
        _input == null ? void 0 : _input.focus();
      }
    };
    const scrollToOption = (option) => {
      var _a2, _b, _c, _d, _e;
      const targetOption = Array.isArray(option) ? option[0] : option;
      let target = null;
      if (targetOption == null ? void 0 : targetOption.value) {
        const options = optionsArray.value.filter((item) => item.value === targetOption.value);
        if (options.length > 0) {
          target = options[0].$el;
        }
      }
      if (tooltipRef.value && target) {
        const menu = (_d = (_c = (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef) == null ? void 0 : _c.querySelector) == null ? void 0 : _d.call(_c, `.${ns.be("dropdown", "wrap")}`);
        if (menu) {
          scrollIntoView(menu, target);
        }
      }
      (_e = scrollbar.value) == null ? void 0 : _e.handleScroll();
    };
    const onOptionCreate = (vm) => {
      states.optionsCount++;
      states.filteredOptionsCount++;
      states.options.set(vm.value, vm);
      states.cachedOptions.set(vm.value, vm);
      vm.disabled && states.disabledOptions.set(vm.value, vm);
    };
    const onOptionDestroy = (key, vm) => {
      if (states.options.get(key) === vm) {
        states.optionsCount--;
        states.filteredOptionsCount--;
        states.options.delete(key);
      }
    };
    const resetInputState = (e) => {
      if (e.code !== EVENT_CODE.backspace)
        toggleLastOptionHitState(false);
      states.inputLength = input.value.value.length * 15 + 20;
      resetInputHeight();
    };
    const toggleLastOptionHitState = (hit) => {
      if (!Array.isArray(states.selected))
        return;
      const lastNotDisabledIndex = getLastNotDisabledIndex(states.selected.map((it2) => it2.value));
      const option = states.selected[lastNotDisabledIndex];
      if (!option)
        return;
      if (hit === true || hit === false) {
        option.hitState = hit;
        return hit;
      }
      option.hitState = !option.hitState;
      return option.hitState;
    };
    const handleComposition = (event) => {
      const text = event.target.value;
      if (event.type === "compositionend") {
        states.isOnComposition = false;
        vue.nextTick(() => handleQueryChange(text));
      } else {
        const lastCharacter = text[text.length - 1] || "";
        states.isOnComposition = !isKorean(lastCharacter);
      }
    };
    const handleMenuEnter = () => {
      vue.nextTick(() => scrollToOption(states.selected));
    };
    const handleFocus = (event) => {
      if (!states.focused) {
        if (props.automaticDropdown || props.filterable) {
          if (props.filterable && !states.visible) {
            states.menuVisibleOnFocus = true;
          }
          states.visible = true;
        }
        states.focused = true;
        ctx.emit("focus", event);
      }
    };
    const focus = () => {
      var _a2, _b;
      if (states.visible) {
        (_a2 = input.value || reference.value) == null ? void 0 : _a2.focus();
      } else {
        (_b = reference.value) == null ? void 0 : _b.focus();
      }
    };
    const blur = () => {
      var _a2, _b, _c;
      states.visible = false;
      (_a2 = reference.value) == null ? void 0 : _a2.blur();
      (_c = (_b = iOSInput.value) == null ? void 0 : _b.blur) == null ? void 0 : _c.call(_b);
    };
    const handleBlur = (event) => {
      var _a2, _b, _c;
      if (((_a2 = tooltipRef.value) == null ? void 0 : _a2.isFocusInsideContent(event)) || ((_b = tagTooltipRef.value) == null ? void 0 : _b.isFocusInsideContent(event)) || ((_c = selectWrapper.value) == null ? void 0 : _c.contains(event.relatedTarget))) {
        return;
      }
      states.visible && handleClose();
      states.focused = false;
      ctx.emit("blur", event);
    };
    const handleClearClick = (event) => {
      deleteSelected(event);
    };
    const handleClose = () => {
      states.visible = false;
    };
    const handleKeydownEscape = (event) => {
      if (states.visible) {
        event.preventDefault();
        event.stopPropagation();
        states.visible = false;
      }
    };
    const toggleMenu = (e) => {
      if (e && !states.mouseEnter) {
        return;
      }
      if (!selectDisabled.value) {
        if (states.menuVisibleOnFocus) {
          states.menuVisibleOnFocus = false;
        } else {
          if (!tooltipRef.value || !tooltipRef.value.isFocusInsideContent()) {
            states.visible = !states.visible;
          }
        }
        focus();
      }
    };
    const selectOption = () => {
      if (!states.visible) {
        toggleMenu();
      } else {
        if (optionsArray.value[states.hoverIndex]) {
          handleOptionSelect(optionsArray.value[states.hoverIndex]);
        }
      }
    };
    const getValueKey = (item) => {
      return isObject$2(item.value) ? get(item.value, props.valueKey) : item.value;
    };
    const optionsAllDisabled = vue.computed(() => optionsArray.value.filter((option) => option.visible).every((option) => option.disabled));
    const showTagList = vue.computed(() => props.multiple ? states.selected.slice(0, props.maxCollapseTags) : []);
    const collapseTagList = vue.computed(() => props.multiple ? states.selected.slice(props.maxCollapseTags) : []);
    const navigateOptions = (direction) => {
      if (!states.visible) {
        states.visible = true;
        return;
      }
      if (states.options.size === 0 || states.filteredOptionsCount === 0)
        return;
      if (states.isOnComposition)
        return;
      if (!optionsAllDisabled.value) {
        if (direction === "next") {
          states.hoverIndex++;
          if (states.hoverIndex === states.options.size) {
            states.hoverIndex = 0;
          }
        } else if (direction === "prev") {
          states.hoverIndex--;
          if (states.hoverIndex < 0) {
            states.hoverIndex = states.options.size - 1;
          }
        }
        const option = optionsArray.value[states.hoverIndex];
        if (option.disabled === true || option.states.groupDisabled === true || !option.visible) {
          navigateOptions(direction);
        }
        vue.nextTick(() => scrollToOption(hoverOption.value));
      }
    };
    const handleMouseEnter = () => {
      states.mouseEnter = true;
    };
    const handleMouseLeave = () => {
      states.mouseEnter = false;
    };
    const handleDeleteTooltipTag = (event, tag) => {
      var _a2, _b;
      deleteTag(event, tag);
      (_b = (_a2 = tagTooltipRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
    };
    const selectTagsStyle = vue.computed(() => ({
      maxWidth: `${vue.unref(states.inputWidth) - 32 - (showStatusIconAndState.value ? 22 : 0)}px`,
      width: "100%"
    }));
    return {
      optionList,
      optionsArray,
      hoverOption,
      selectSize,
      handleResize,
      debouncedOnInputChange,
      debouncedQueryChange,
      deletePrevTag,
      deleteTag,
      deleteSelected,
      handleOptionSelect,
      scrollToOption,
      readonly,
      resetInputHeight,
      showClose,
      iconComponent,
      iconReverse,
      showNewOption,
      collapseTagSize,
      setSelected,
      managePlaceholder,
      selectDisabled,
      emptyText,
      toggleLastOptionHitState,
      resetInputState,
      handleComposition,
      onOptionCreate,
      onOptionDestroy,
      handleMenuEnter,
      handleFocus,
      focus,
      blur,
      handleBlur,
      handleClearClick,
      handleClose,
      handleKeydownEscape,
      toggleMenu,
      selectOption,
      getValueKey,
      navigateOptions,
      handleDeleteTooltipTag,
      dropMenuVisible,
      queryChange,
      groupQueryChange,
      showTagList,
      collapseTagList,
      selectTagsStyle,
      reference,
      input,
      iOSInput,
      tooltipRef,
      tagTooltipRef,
      tags,
      selectWrapper,
      scrollbar,
      handleMouseEnter,
      handleMouseLeave
    };
  };
  var ElOptions = vue.defineComponent({
    name: "ElOptions",
    emits: ["update-options"],
    setup(_, { slots, emit }) {
      let cachedOptions = [];
      function isSameOptions(a, b) {
        if (a.length !== b.length)
          return false;
        for (const [index] of a.entries()) {
          if (a[index] != b[index]) {
            return false;
          }
        }
        return true;
      }
      return () => {
        var _a2, _b;
        const children = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
        const filteredOptions = [];
        function filterOptions(children2) {
          if (!Array.isArray(children2))
            return;
          children2.forEach((item) => {
            var _a22, _b2, _c, _d;
            const name = (_a22 = (item == null ? void 0 : item.type) || {}) == null ? void 0 : _a22.name;
            if (name === "ElOptionGroup") {
              filterOptions(!isString(item.children) && !Array.isArray(item.children) && isFunction$1((_b2 = item.children) == null ? void 0 : _b2.default) ? (_c = item.children) == null ? void 0 : _c.default() : item.children);
            } else if (name === "ElOption") {
              filteredOptions.push((_d = item.props) == null ? void 0 : _d.label);
            } else if (Array.isArray(item.children)) {
              filterOptions(item.children);
            }
          });
        }
        if (children.length) {
          filterOptions((_b = children[0]) == null ? void 0 : _b.children);
        }
        if (!isSameOptions(filteredOptions, cachedOptions)) {
          cachedOptions = filteredOptions;
          emit("update-options", filteredOptions);
        }
        return children;
      };
    }
  });
  const COMPONENT_NAME = "ElSelect";
  const _sfc_main$4 = vue.defineComponent({
    name: COMPONENT_NAME,
    componentName: COMPONENT_NAME,
    components: {
      ElInput,
      ElSelectMenu,
      ElOption: Option,
      ElOptions,
      ElTag,
      ElScrollbar,
      ElTooltip,
      ElIcon
    },
    directives: { ClickOutside },
    props: {
      name: String,
      id: String,
      modelValue: {
        type: [Array, String, Number, Boolean, Object],
        default: void 0
      },
      autocomplete: {
        type: String,
        default: "off"
      },
      automaticDropdown: Boolean,
      size: {
        type: String,
        validator: isValidComponentSize
      },
      effect: {
        type: String,
        default: "light"
      },
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: {
        type: String,
        default: ""
      },
      popperOptions: {
        type: Object,
        default: () => ({})
      },
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String
      },
      defaultFirstOption: Boolean,
      reserveKeyword: {
        type: Boolean,
        default: true
      },
      valueKey: {
        type: String,
        default: "value"
      },
      collapseTags: Boolean,
      collapseTagsTooltip: Boolean,
      maxCollapseTags: {
        type: Number,
        default: 1
      },
      teleported: useTooltipContentProps.teleported,
      persistent: {
        type: Boolean,
        default: true
      },
      clearIcon: {
        type: iconPropType,
        default: circle_close_default
      },
      fitInputWidth: Boolean,
      suffixIcon: {
        type: iconPropType,
        default: arrow_down_default
      },
      tagType: { ...tagProps.type, default: "info" },
      validateEvent: {
        type: Boolean,
        default: true
      },
      remoteShowSuffix: Boolean,
      suffixTransition: {
        type: Boolean,
        default: true
      },
      placement: {
        type: String,
        values: Ee,
        default: "bottom-start"
      },
      ariaLabel: {
        type: String,
        default: void 0
      }
    },
    emits: [
      UPDATE_MODEL_EVENT,
      CHANGE_EVENT,
      "remove-tag",
      "clear",
      "visible-change",
      "focus",
      "blur"
    ],
    setup(props, ctx) {
      const nsSelect = useNamespace("select");
      const nsInput = useNamespace("input");
      const { t } = useLocale();
      const contentId = useId();
      const states = useSelectStates(props);
      const {
        optionList,
        optionsArray,
        hoverOption,
        selectSize,
        readonly,
        handleResize,
        collapseTagSize,
        debouncedOnInputChange,
        debouncedQueryChange,
        deletePrevTag,
        deleteTag,
        deleteSelected,
        handleOptionSelect,
        scrollToOption,
        setSelected,
        resetInputHeight,
        managePlaceholder,
        showClose,
        selectDisabled,
        iconComponent,
        iconReverse,
        showNewOption,
        emptyText,
        toggleLastOptionHitState,
        resetInputState,
        handleComposition,
        onOptionCreate,
        onOptionDestroy,
        handleMenuEnter,
        handleFocus,
        focus,
        blur,
        handleBlur,
        handleClearClick,
        handleClose,
        handleKeydownEscape,
        toggleMenu,
        selectOption,
        getValueKey,
        navigateOptions,
        handleDeleteTooltipTag,
        dropMenuVisible,
        reference,
        input,
        iOSInput,
        tooltipRef,
        tagTooltipRef,
        tags,
        selectWrapper,
        scrollbar,
        queryChange,
        groupQueryChange,
        handleMouseEnter,
        handleMouseLeave,
        showTagList,
        collapseTagList,
        selectTagsStyle
      } = useSelect(props, states, ctx);
      const {
        inputWidth,
        selected,
        inputLength,
        filteredOptionsCount,
        visible,
        selectedLabel,
        hoverIndex,
        query,
        inputHovering,
        currentPlaceholder,
        menuVisibleOnFocus,
        isOnComposition,
        options,
        cachedOptions,
        optionsCount,
        prefixWidth
      } = vue.toRefs(states);
      const wrapperKls = vue.computed(() => {
        const classList = [nsSelect.b()];
        const _selectSize = vue.unref(selectSize);
        if (_selectSize) {
          classList.push(nsSelect.m(_selectSize));
        }
        if (props.disabled) {
          classList.push(nsSelect.m("disabled"));
        }
        return classList;
      });
      const tagsKls = vue.computed(() => [
        nsSelect.e("tags"),
        nsSelect.is("disabled", vue.unref(selectDisabled))
      ]);
      const tagWrapperKls = vue.computed(() => [
        nsSelect.b("tags-wrapper"),
        { "has-prefix": vue.unref(prefixWidth) && vue.unref(selected).length }
      ]);
      const inputKls = vue.computed(() => [
        nsSelect.e("input"),
        nsSelect.is(vue.unref(selectSize)),
        nsSelect.is("disabled", vue.unref(selectDisabled))
      ]);
      const iOSInputKls = vue.computed(() => [
        nsSelect.e("input"),
        nsSelect.is(vue.unref(selectSize)),
        nsSelect.em("input", "iOS")
      ]);
      const scrollbarKls = vue.computed(() => [
        nsSelect.is("empty", !props.allowCreate && Boolean(vue.unref(query)) && vue.unref(filteredOptionsCount) === 0)
      ]);
      const tagTextStyle = vue.computed(() => {
        const maxWidth = vue.unref(inputWidth) > 123 && vue.unref(selected).length > props.maxCollapseTags ? vue.unref(inputWidth) - 123 : vue.unref(inputWidth) - 75;
        return { maxWidth: `${maxWidth}px` };
      });
      const inputStyle = vue.computed(() => ({
        marginLeft: `${vue.unref(prefixWidth)}px`,
        flexGrow: 1,
        width: `${vue.unref(inputLength) / (vue.unref(inputWidth) - 32)}%`,
        maxWidth: `${vue.unref(inputWidth) - 42}px`
      }));
      vue.provide(selectKey, vue.reactive({
        props,
        options,
        optionsArray,
        cachedOptions,
        optionsCount,
        filteredOptionsCount,
        hoverIndex,
        handleOptionSelect,
        onOptionCreate,
        onOptionDestroy,
        selectWrapper,
        selected,
        setSelected,
        queryChange,
        groupQueryChange
      }));
      vue.onMounted(() => {
        states.cachedPlaceHolder = currentPlaceholder.value = props.placeholder || (() => t("el.select.placeholder"));
        if (props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0) {
          currentPlaceholder.value = "";
        }
        useResizeObserver(selectWrapper, handleResize);
        if (props.remote && props.multiple) {
          resetInputHeight();
        }
        vue.nextTick(() => {
          const refEl = reference.value && reference.value.$el;
          if (!refEl)
            return;
          inputWidth.value = refEl.getBoundingClientRect().width;
          if (ctx.slots.prefix) {
            const prefix = refEl.querySelector(`.${nsInput.e("prefix")}`);
            prefixWidth.value = Math.max(prefix.getBoundingClientRect().width + 11, 30);
          }
        });
        setSelected();
      });
      if (props.multiple && !Array.isArray(props.modelValue)) {
        ctx.emit(UPDATE_MODEL_EVENT, []);
      }
      if (!props.multiple && Array.isArray(props.modelValue)) {
        ctx.emit(UPDATE_MODEL_EVENT, "");
      }
      const popperPaneRef = vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = tooltipRef.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef;
      });
      const onOptionsRendered = (v) => {
        optionList.value = v;
      };
      return {
        isIOS,
        onOptionsRendered,
        prefixWidth,
        selectSize,
        readonly,
        handleResize,
        collapseTagSize,
        debouncedOnInputChange,
        debouncedQueryChange,
        deletePrevTag,
        deleteTag,
        handleDeleteTooltipTag,
        deleteSelected,
        handleOptionSelect,
        scrollToOption,
        inputWidth,
        selected,
        inputLength,
        filteredOptionsCount,
        visible,
        selectedLabel,
        hoverIndex,
        query,
        inputHovering,
        currentPlaceholder,
        menuVisibleOnFocus,
        isOnComposition,
        options,
        resetInputHeight,
        managePlaceholder,
        showClose,
        selectDisabled,
        iconComponent,
        iconReverse,
        showNewOption,
        emptyText,
        toggleLastOptionHitState,
        resetInputState,
        handleComposition,
        handleMenuEnter,
        handleFocus,
        focus,
        blur,
        handleBlur,
        handleClearClick,
        handleClose,
        handleKeydownEscape,
        toggleMenu,
        selectOption,
        getValueKey,
        navigateOptions,
        dropMenuVisible,
        reference,
        input,
        iOSInput,
        tooltipRef,
        popperPaneRef,
        tags,
        selectWrapper,
        scrollbar,
        wrapperKls,
        tagsKls,
        tagWrapperKls,
        inputKls,
        iOSInputKls,
        scrollbarKls,
        selectTagsStyle,
        nsSelect,
        tagTextStyle,
        inputStyle,
        handleMouseEnter,
        handleMouseLeave,
        showTagList,
        collapseTagList,
        tagTooltipRef,
        contentId,
        hoverOption
      };
    }
  });
  const _hoisted_1$3 = ["disabled", "autocomplete", "aria-activedescendant", "aria-controls", "aria-expanded", "aria-label"];
  const _hoisted_2$3 = ["disabled"];
  const _hoisted_3$2 = { style: { "height": "100%", "display": "flex", "justify-content": "center", "align-items": "center" } };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_tag = vue.resolveComponent("el-tag");
    const _component_el_tooltip = vue.resolveComponent("el-tooltip");
    const _component_el_icon = vue.resolveComponent("el-icon");
    const _component_el_input = vue.resolveComponent("el-input");
    const _component_el_option = vue.resolveComponent("el-option");
    const _component_el_options = vue.resolveComponent("el-options");
    const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
    const _component_el_select_menu = vue.resolveComponent("el-select-menu");
    const _directive_click_outside = vue.resolveDirective("click-outside");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
      ref: "selectWrapper",
      class: vue.normalizeClass(_ctx.wrapperKls),
      onMouseenter: _cache[22] || (_cache[22] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
      onMouseleave: _cache[23] || (_cache[23] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args)),
      onClick: _cache[24] || (_cache[24] = vue.withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["stop"]))
    }, [
      vue.createVNode(_component_el_tooltip, {
        ref: "tooltipRef",
        visible: _ctx.dropMenuVisible,
        placement: _ctx.placement,
        teleported: _ctx.teleported,
        "popper-class": [_ctx.nsSelect.e("popper"), _ctx.popperClass],
        "popper-options": _ctx.popperOptions,
        "fallback-placements": ["bottom-start", "top-start", "right", "left"],
        effect: _ctx.effect,
        pure: "",
        trigger: "click",
        transition: `${_ctx.nsSelect.namespace.value}-zoom-in-top`,
        "stop-popper-mouse-event": false,
        "gpu-acceleration": false,
        persistent: _ctx.persistent,
        onShow: _ctx.handleMenuEnter
      }, {
        default: vue.withCtx(() => {
          var _a2, _b;
          return [
            vue.createElementVNode("div", {
              class: "select-trigger",
              onMouseenter: _cache[20] || (_cache[20] = ($event) => _ctx.inputHovering = true),
              onMouseleave: _cache[21] || (_cache[21] = ($event) => _ctx.inputHovering = false)
            }, [
              _ctx.multiple ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref: "tags",
                tabindex: "-1",
                class: vue.normalizeClass(_ctx.tagsKls),
                style: vue.normalizeStyle(_ctx.selectTagsStyle),
                onClick: _cache[15] || (_cache[15] = (...args) => _ctx.focus && _ctx.focus(...args))
              }, [
                _ctx.collapseTags && _ctx.selected.length ? (vue.openBlock(), vue.createBlock(vue.Transition, {
                  key: 0,
                  onAfterLeave: _ctx.resetInputHeight
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(_ctx.tagWrapperKls)
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.showTagList, (item) => {
                        return vue.openBlock(), vue.createBlock(_component_el_tag, {
                          key: _ctx.getValueKey(item),
                          closable: !_ctx.selectDisabled && !item.isDisabled,
                          size: _ctx.collapseTagSize,
                          hit: item.hitState,
                          type: _ctx.tagType,
                          "disable-transitions": "",
                          onClose: ($event) => _ctx.deleteTag($event, item)
                        }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("span", {
                              class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                              style: vue.normalizeStyle(_ctx.tagTextStyle)
                            }, vue.toDisplayString(item.currentLabel), 7)
                          ]),
                          _: 2
                        }, 1032, ["closable", "size", "hit", "type", "onClose"]);
                      }), 128)),
                      _ctx.selected.length > _ctx.maxCollapseTags ? (vue.openBlock(), vue.createBlock(_component_el_tag, {
                        key: 0,
                        closable: false,
                        size: _ctx.collapseTagSize,
                        type: _ctx.tagType,
                        "disable-transitions": ""
                      }, {
                        default: vue.withCtx(() => [
                          _ctx.collapseTagsTooltip ? (vue.openBlock(), vue.createBlock(_component_el_tooltip, {
                            key: 0,
                            ref: "tagTooltipRef",
                            disabled: _ctx.dropMenuVisible,
                            "fallback-placements": ["bottom", "top", "right", "left"],
                            effect: _ctx.effect,
                            placement: "bottom",
                            teleported: _ctx.teleported
                          }, {
                            default: vue.withCtx(() => [
                              vue.createElementVNode("span", {
                                class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                              }, "+ " + vue.toDisplayString(_ctx.selected.length - _ctx.maxCollapseTags), 3)
                            ]),
                            content: vue.withCtx(() => [
                              vue.createElementVNode("div", {
                                class: vue.normalizeClass(_ctx.nsSelect.e("collapse-tags"))
                              }, [
                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.collapseTagList, (item) => {
                                  return vue.openBlock(), vue.createElementBlock("div", {
                                    key: _ctx.getValueKey(item),
                                    class: vue.normalizeClass(_ctx.nsSelect.e("collapse-tag"))
                                  }, [
                                    vue.createVNode(_component_el_tag, {
                                      class: "in-tooltip",
                                      closable: !_ctx.selectDisabled && !item.isDisabled,
                                      size: _ctx.collapseTagSize,
                                      hit: item.hitState,
                                      type: _ctx.tagType,
                                      "disable-transitions": "",
                                      style: { margin: "2px" },
                                      onClose: ($event) => _ctx.handleDeleteTooltipTag($event, item)
                                    }, {
                                      default: vue.withCtx(() => [
                                        vue.createElementVNode("span", {
                                          class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                                          style: vue.normalizeStyle({
                                            maxWidth: _ctx.inputWidth - 75 + "px"
                                          })
                                        }, vue.toDisplayString(item.currentLabel), 7)
                                      ]),
                                      _: 2
                                    }, 1032, ["closable", "size", "hit", "type", "onClose"])
                                  ], 2);
                                }), 128))
                              ], 2)
                            ]),
                            _: 1
                          }, 8, ["disabled", "effect", "teleported"])) : (vue.openBlock(), vue.createElementBlock("span", {
                            key: 1,
                            class: vue.normalizeClass(_ctx.nsSelect.e("tags-text"))
                          }, "+ " + vue.toDisplayString(_ctx.selected.length - _ctx.maxCollapseTags), 3))
                        ]),
                        _: 1
                      }, 8, ["size", "type"])) : vue.createCommentVNode("v-if", true)
                    ], 2)
                  ]),
                  _: 1
                }, 8, ["onAfterLeave"])) : vue.createCommentVNode("v-if", true),
                !_ctx.collapseTags ? (vue.openBlock(), vue.createBlock(vue.Transition, {
                  key: 1,
                  onAfterLeave: _ctx.resetInputHeight
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(_ctx.tagWrapperKls),
                      style: vue.normalizeStyle(_ctx.prefixWidth && _ctx.selected.length ? { marginLeft: `${_ctx.prefixWidth}px` } : "")
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.selected, (item) => {
                        return vue.openBlock(), vue.createBlock(_component_el_tag, {
                          key: _ctx.getValueKey(item),
                          closable: !_ctx.selectDisabled && !item.isDisabled,
                          size: _ctx.collapseTagSize,
                          hit: item.hitState,
                          type: _ctx.tagType,
                          "disable-transitions": "",
                          onClose: ($event) => _ctx.deleteTag($event, item)
                        }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("span", {
                              class: vue.normalizeClass(_ctx.nsSelect.e("tags-text")),
                              style: vue.normalizeStyle({ maxWidth: _ctx.inputWidth - 75 + "px" })
                            }, vue.toDisplayString(item.currentLabel), 7)
                          ]),
                          _: 2
                        }, 1032, ["closable", "size", "hit", "type", "onClose"]);
                      }), 128))
                    ], 6)
                  ]),
                  _: 1
                }, 8, ["onAfterLeave"])) : vue.createCommentVNode("v-if", true),
                _ctx.filterable && !_ctx.selectDisabled ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                  key: 2,
                  ref: "input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.query = $event),
                  type: "text",
                  class: vue.normalizeClass(_ctx.inputKls),
                  disabled: _ctx.selectDisabled,
                  autocomplete: _ctx.autocomplete,
                  style: vue.normalizeStyle(_ctx.inputStyle),
                  role: "combobox",
                  "aria-activedescendant": ((_a2 = _ctx.hoverOption) == null ? void 0 : _a2.id) || "",
                  "aria-controls": _ctx.contentId,
                  "aria-expanded": _ctx.dropMenuVisible,
                  "aria-label": _ctx.ariaLabel,
                  "aria-autocomplete": "none",
                  "aria-haspopup": "listbox",
                  onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.handleFocus && _ctx.handleFocus(...args)),
                  onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
                  onKeyup: _cache[3] || (_cache[3] = (...args) => _ctx.managePlaceholder && _ctx.managePlaceholder(...args)),
                  onKeydown: [
                    _cache[4] || (_cache[4] = (...args) => _ctx.resetInputState && _ctx.resetInputState(...args)),
                    _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["prevent"]), ["down"])),
                    _cache[6] || (_cache[6] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["prevent"]), ["up"])),
                    _cache[7] || (_cache[7] = vue.withKeys((...args) => _ctx.handleKeydownEscape && _ctx.handleKeydownEscape(...args), ["esc"])),
                    _cache[8] || (_cache[8] = vue.withKeys(vue.withModifiers((...args) => _ctx.selectOption && _ctx.selectOption(...args), ["stop", "prevent"]), ["enter"])),
                    _cache[9] || (_cache[9] = vue.withKeys((...args) => _ctx.deletePrevTag && _ctx.deletePrevTag(...args), ["delete"])),
                    _cache[10] || (_cache[10] = vue.withKeys(($event) => _ctx.visible = false, ["tab"]))
                  ],
                  onCompositionstart: _cache[11] || (_cache[11] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                  onCompositionupdate: _cache[12] || (_cache[12] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                  onCompositionend: _cache[13] || (_cache[13] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
                  onInput: _cache[14] || (_cache[14] = (...args) => _ctx.debouncedQueryChange && _ctx.debouncedQueryChange(...args))
                }, null, 46, _hoisted_1$3)), [
                  [vue.vModelText, _ctx.query]
                ]) : vue.createCommentVNode("v-if", true)
              ], 6)) : vue.createCommentVNode("v-if", true),
              _ctx.isIOS && !_ctx.multiple && _ctx.filterable && _ctx.readonly ? (vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                ref: "iOSInput",
                class: vue.normalizeClass(_ctx.iOSInputKls),
                disabled: _ctx.selectDisabled,
                type: "text"
              }, null, 10, _hoisted_2$3)) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_el_input, {
                id: _ctx.id,
                ref: "reference",
                modelValue: _ctx.selectedLabel,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => _ctx.selectedLabel = $event),
                type: "text",
                placeholder: typeof _ctx.currentPlaceholder === "function" ? _ctx.currentPlaceholder() : _ctx.currentPlaceholder,
                name: _ctx.name,
                autocomplete: _ctx.autocomplete,
                size: _ctx.selectSize,
                disabled: _ctx.selectDisabled,
                readonly: _ctx.readonly,
                "validate-event": false,
                class: vue.normalizeClass([_ctx.nsSelect.is("focus", _ctx.visible)]),
                tabindex: _ctx.multiple && _ctx.filterable ? -1 : void 0,
                role: "combobox",
                "aria-activedescendant": ((_b = _ctx.hoverOption) == null ? void 0 : _b.id) || "",
                "aria-controls": _ctx.contentId,
                "aria-expanded": _ctx.dropMenuVisible,
                label: _ctx.ariaLabel,
                "aria-autocomplete": "none",
                "aria-haspopup": "listbox",
                onFocus: _ctx.handleFocus,
                onBlur: _ctx.handleBlur,
                onInput: _ctx.debouncedOnInputChange,
                onPaste: _ctx.debouncedOnInputChange,
                onCompositionstart: _ctx.handleComposition,
                onCompositionupdate: _ctx.handleComposition,
                onCompositionend: _ctx.handleComposition,
                onKeydown: [
                  _cache[17] || (_cache[17] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("next"), ["stop", "prevent"]), ["down"])),
                  _cache[18] || (_cache[18] = vue.withKeys(vue.withModifiers(($event) => _ctx.navigateOptions("prev"), ["stop", "prevent"]), ["up"])),
                  vue.withKeys(vue.withModifiers(_ctx.selectOption, ["stop", "prevent"]), ["enter"]),
                  vue.withKeys(_ctx.handleKeydownEscape, ["esc"]),
                  _cache[19] || (_cache[19] = vue.withKeys(($event) => _ctx.visible = false, ["tab"]))
                ]
              }, vue.createSlots({
                suffix: vue.withCtx(() => [
                  _ctx.iconComponent && !_ctx.showClose ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass([_ctx.nsSelect.e("caret"), _ctx.nsSelect.e("icon"), _ctx.iconReverse])
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.iconComponent)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                  _ctx.showClose && _ctx.clearIcon ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 1,
                    class: vue.normalizeClass([_ctx.nsSelect.e("caret"), _ctx.nsSelect.e("icon")]),
                    onClick: _ctx.handleClearClick
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.clearIcon)))
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
                ]),
                _: 2
              }, [
                _ctx.$slots.prefix ? {
                  name: "prefix",
                  fn: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_3$2, [
                      vue.renderSlot(_ctx.$slots, "prefix")
                    ])
                  ])
                } : void 0
              ]), 1032, ["id", "modelValue", "placeholder", "name", "autocomplete", "size", "disabled", "readonly", "class", "tabindex", "aria-activedescendant", "aria-controls", "aria-expanded", "label", "onFocus", "onBlur", "onInput", "onPaste", "onCompositionstart", "onCompositionupdate", "onCompositionend", "onKeydown"])
            ], 32)
          ];
        }),
        content: vue.withCtx(() => [
          vue.createVNode(_component_el_select_menu, null, vue.createSlots({
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createVNode(_component_el_scrollbar, {
                id: _ctx.contentId,
                ref: "scrollbar",
                tag: "ul",
                "wrap-class": _ctx.nsSelect.be("dropdown", "wrap"),
                "view-class": _ctx.nsSelect.be("dropdown", "list"),
                class: vue.normalizeClass(_ctx.scrollbarKls),
                role: "listbox",
                "aria-label": _ctx.ariaLabel,
                "aria-orientation": "vertical"
              }, {
                default: vue.withCtx(() => [
                  _ctx.showNewOption ? (vue.openBlock(), vue.createBlock(_component_el_option, {
                    key: 0,
                    value: _ctx.query,
                    created: true
                  }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true),
                  vue.createVNode(_component_el_options, { onUpdateOptions: _ctx.onOptionsRendered }, {
                    default: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["onUpdateOptions"])
                ]),
                _: 3
              }, 8, ["id", "wrap-class", "view-class", "class", "aria-label"]), [
                [vue.vShow, _ctx.options.size > 0 && !_ctx.loading]
              ]),
              _ctx.emptyText && (!_ctx.allowCreate || _ctx.loading || _ctx.allowCreate && _ctx.options.size === 0) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                _ctx.$slots.empty ? vue.renderSlot(_ctx.$slots, "empty", { key: 0 }) : (vue.openBlock(), vue.createElementBlock("p", {
                  key: 1,
                  class: vue.normalizeClass(_ctx.nsSelect.be("dropdown", "empty"))
                }, vue.toDisplayString(_ctx.emptyText), 3))
              ], 64)) : vue.createCommentVNode("v-if", true)
            ]),
            _: 2
          }, [
            _ctx.$slots.header ? {
              name: "header",
              fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "header")
              ])
            } : void 0,
            _ctx.$slots.footer ? {
              name: "footer",
              fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "footer")
              ])
            } : void 0
          ]), 1024)
        ]),
        _: 3
      }, 8, ["visible", "placement", "teleported", "popper-class", "popper-options", "effect", "transition", "persistent", "onShow"])
    ], 34)), [
      [_directive_click_outside, _ctx.handleClose, _ctx.popperPaneRef]
    ]);
  }
  var Select = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__file", "select.vue"]]);
  const _sfc_main$3 = vue.defineComponent({
    name: "ElOptionGroup",
    componentName: "ElOptionGroup",
    props: {
      label: String,
      disabled: Boolean
    },
    setup(props) {
      const ns = useNamespace("select");
      const visible = vue.ref(true);
      const instance = vue.getCurrentInstance();
      const children = vue.ref([]);
      vue.provide(selectGroupKey, vue.reactive({
        ...vue.toRefs(props)
      }));
      const select = vue.inject(selectKey);
      vue.onMounted(() => {
        children.value = flattedChildren(instance.subTree);
      });
      const flattedChildren = (node) => {
        const children2 = [];
        if (Array.isArray(node.children)) {
          node.children.forEach((child) => {
            var _a2;
            if (child.type && child.type.name === "ElOption" && child.component && child.component.proxy) {
              children2.push(child.component.proxy);
            } else if ((_a2 = child.children) == null ? void 0 : _a2.length) {
              children2.push(...flattedChildren(child));
            }
          });
        }
        return children2;
      };
      const { groupQueryChange } = vue.toRaw(select);
      vue.watch(groupQueryChange, () => {
        visible.value = children.value.some((option) => option.visible === true);
      }, { flush: "post" });
      return {
        visible,
        ns
      };
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("ul", {
      class: vue.normalizeClass(_ctx.ns.be("group", "wrap"))
    }, [
      vue.createElementVNode("li", {
        class: vue.normalizeClass(_ctx.ns.be("group", "title"))
      }, vue.toDisplayString(_ctx.label), 3),
      vue.createElementVNode("li", null, [
        vue.createElementVNode("ul", {
          class: vue.normalizeClass(_ctx.ns.b("group"))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2)
      ])
    ], 2)), [
      [vue.vShow, _ctx.visible]
    ]);
  }
  var OptionGroup = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__file", "option-group.vue"]]);
  const ElSelect = withInstall(Select, {
    Option,
    OptionGroup
  });
  const ElOption = withNoopInstall(Option);
  withNoopInstall(OptionGroup);
  const messageTypes = ["success", "info", "warning", "error"];
  const messageDefaults = mutable({
    customClass: "",
    center: false,
    dangerouslyUseHTMLString: false,
    duration: 3e3,
    icon: void 0,
    id: "",
    message: "",
    onClose: void 0,
    showClose: false,
    type: "info",
    offset: 16,
    zIndex: 0,
    grouping: false,
    repeatNum: 1,
    appendTo: isClient$1 ? document.body : void 0
  });
  const messageProps = buildProps({
    customClass: {
      type: String,
      default: messageDefaults.customClass
    },
    center: {
      type: Boolean,
      default: messageDefaults.center
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: messageDefaults.dangerouslyUseHTMLString
    },
    duration: {
      type: Number,
      default: messageDefaults.duration
    },
    icon: {
      type: iconPropType,
      default: messageDefaults.icon
    },
    id: {
      type: String,
      default: messageDefaults.id
    },
    message: {
      type: definePropType([
        String,
        Object,
        Function
      ]),
      default: messageDefaults.message
    },
    onClose: {
      type: definePropType(Function),
      required: false
    },
    showClose: {
      type: Boolean,
      default: messageDefaults.showClose
    },
    type: {
      type: String,
      values: messageTypes,
      default: messageDefaults.type
    },
    offset: {
      type: Number,
      default: messageDefaults.offset
    },
    zIndex: {
      type: Number,
      default: messageDefaults.zIndex
    },
    grouping: {
      type: Boolean,
      default: messageDefaults.grouping
    },
    repeatNum: {
      type: Number,
      default: messageDefaults.repeatNum
    }
  });
  const messageEmits = {
    destroy: () => true
  };
  const instances = vue.shallowReactive([]);
  const getInstance = (id) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    const current = instances[idx];
    let prev;
    if (idx > 0) {
      prev = instances[idx - 1];
    }
    return { current, prev };
  };
  const getLastOffset = (id) => {
    const { prev } = getInstance(id);
    if (!prev)
      return 0;
    return prev.vm.exposed.bottom.value;
  };
  const getOffsetOrSpace = (id, offset) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    return idx > 0 ? 20 : offset;
  };
  const _hoisted_1$2 = ["id"];
  const _hoisted_2$2 = ["innerHTML"];
  const __default__ = vue.defineComponent({
    name: "ElMessage"
  });
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: messageProps,
    emits: messageEmits,
    setup(__props, { expose }) {
      const props = __props;
      const { Close } = TypeComponents;
      const { ns, zIndex: zIndex2 } = useGlobalComponentSettings("message");
      const { currentZIndex, nextZIndex } = zIndex2;
      const messageRef = vue.ref();
      const visible = vue.ref(false);
      const height = vue.ref(0);
      let stopTimer = void 0;
      const badgeType = vue.computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
      const typeClass = vue.computed(() => {
        const type = props.type;
        return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
      });
      const iconComponent = vue.computed(() => props.icon || TypeComponentsMap[props.type] || "");
      const lastOffset = vue.computed(() => getLastOffset(props.id));
      const offset = vue.computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value);
      const bottom = vue.computed(() => height.value + offset.value);
      const customStyle = vue.computed(() => ({
        top: `${offset.value}px`,
        zIndex: currentZIndex.value
      }));
      function startTimer() {
        if (props.duration === 0)
          return;
        ({ stop: stopTimer } = useTimeoutFn$1(() => {
          close();
        }, props.duration));
      }
      function clearTimer() {
        stopTimer == null ? void 0 : stopTimer();
      }
      function close() {
        visible.value = false;
      }
      function keydown({ code }) {
        if (code === EVENT_CODE.esc) {
          close();
        }
      }
      vue.onMounted(() => {
        startTimer();
        nextZIndex();
        visible.value = true;
      });
      vue.watch(() => props.repeatNum, () => {
        clearTimer();
        startTimer();
      });
      useEventListener$1(document, "keydown", keydown);
      useResizeObserver(messageRef, () => {
        height.value = messageRef.value.getBoundingClientRect().height;
      });
      expose({
        visible,
        bottom,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          onBeforeLeave: _ctx.onClose,
          onAfterLeave: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("destroy")),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              id: _ctx.id,
              ref_key: "messageRef",
              ref: messageRef,
              class: vue.normalizeClass([
                vue.unref(ns).b(),
                { [vue.unref(ns).m(_ctx.type)]: _ctx.type && !_ctx.icon },
                vue.unref(ns).is("center", _ctx.center),
                vue.unref(ns).is("closable", _ctx.showClose),
                _ctx.customClass
              ]),
              style: vue.normalizeStyle(vue.unref(customStyle)),
              role: "alert",
              onMouseenter: clearTimer,
              onMouseleave: startTimer
            }, [
              _ctx.repeatNum > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(ElBadge), {
                key: 0,
                value: _ctx.repeatNum,
                type: vue.unref(badgeType),
                class: vue.normalizeClass(vue.unref(ns).e("badge"))
              }, null, 8, ["value", "type", "class"])) : vue.createCommentVNode("v-if", true),
              vue.unref(iconComponent) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass([vue.unref(ns).e("icon"), vue.unref(typeClass)])
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(iconComponent))))
                ]),
                _: 1
              }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                !_ctx.dangerouslyUseHTMLString ? (vue.openBlock(), vue.createElementBlock("p", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("content"))
                }, vue.toDisplayString(_ctx.message), 3)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  vue.createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "),
                  vue.createElementVNode("p", {
                    class: vue.normalizeClass(vue.unref(ns).e("content")),
                    innerHTML: _ctx.message
                  }, null, 10, _hoisted_2$2)
                ], 2112))
              ]),
              _ctx.showClose ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 2,
                class: vue.normalizeClass(vue.unref(ns).e("closeBtn")),
                onClick: vue.withModifiers(close, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(Close))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 46, _hoisted_1$2), [
              [vue.vShow, visible.value]
            ])
          ]),
          _: 3
        }, 8, ["name", "onBeforeLeave"]);
      };
    }
  });
  var MessageConstructor = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "message.vue"]]);
  let seed = 1;
  const normalizeOptions = (params) => {
    const options = !params || isString(params) || vue.isVNode(params) || isFunction$1(params) ? { message: params } : params;
    const normalized = {
      ...messageDefaults,
      ...options
    };
    if (!normalized.appendTo) {
      normalized.appendTo = document.body;
    } else if (isString(normalized.appendTo)) {
      let appendTo = document.querySelector(normalized.appendTo);
      if (!isElement(appendTo)) {
        debugWarn("ElMessage", "the appendTo option is not an HTMLElement. Falling back to document.body.");
        appendTo = document.body;
      }
      normalized.appendTo = appendTo;
    }
    return normalized;
  };
  const closeMessage = (instance) => {
    const idx = instances.indexOf(instance);
    if (idx === -1)
      return;
    instances.splice(idx, 1);
    const { handler } = instance;
    handler.close();
  };
  const createMessage = ({ appendTo, ...options }, context) => {
    const id = `message_${seed++}`;
    const userOnClose = options.onClose;
    const container = document.createElement("div");
    const props = {
      ...options,
      id,
      onClose: () => {
        userOnClose == null ? void 0 : userOnClose();
        closeMessage(instance);
      },
      onDestroy: () => {
        vue.render(null, container);
      }
    };
    const vnode = vue.createVNode(MessageConstructor, props, isFunction$1(props.message) || vue.isVNode(props.message) ? {
      default: isFunction$1(props.message) ? props.message : () => props.message
    } : null);
    vnode.appContext = context || message._context;
    vue.render(vnode, container);
    appendTo.appendChild(container.firstElementChild);
    const vm = vnode.component;
    const handler = {
      close: () => {
        vm.exposed.visible.value = false;
      }
    };
    const instance = {
      id,
      vnode,
      vm,
      handler,
      props: vnode.component.props
    };
    return instance;
  };
  const message = (options = {}, context) => {
    if (!isClient$1)
      return { close: () => void 0 };
    if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
      return { close: () => void 0 };
    }
    const normalized = normalizeOptions(options);
    if (normalized.grouping && instances.length) {
      const instance2 = instances.find(({ vnode: vm }) => {
        var _a2;
        return ((_a2 = vm.props) == null ? void 0 : _a2.message) === normalized.message;
      });
      if (instance2) {
        instance2.props.repeatNum += 1;
        instance2.props.type = normalized.type;
        return instance2.handler;
      }
    }
    const instance = createMessage(normalized, context);
    instances.push(instance);
    return instance.handler;
  };
  messageTypes.forEach((type) => {
    message[type] = (options = {}, appContext) => {
      const normalized = normalizeOptions(options);
      return message({ ...normalized, type }, appContext);
    };
  });
  function closeAll(type) {
    for (const instance of instances) {
      if (!type || type === instance.props.type) {
        instance.handler.close();
      }
    }
  }
  message.closeAll = closeAll;
  message._context = null;
  const ElMessage = withInstallFunction(message, "$message");
  const _hoisted_1$1 = { class: "uuid-box" };
  const _hoisted_2$1 = { class: "uuid-box__header" };
  const _hoisted_3$1 = { class: "uuid-box__content" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "uuid-box",
    props: {
      title: {}
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createElementVNode("span", null, vue.toDisplayString(_ctx.title), 1),
            vue.renderSlot(_ctx.$slots, "action")
          ]),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.renderSlot(_ctx.$slots, "default")
          ])
        ]);
      };
    }
  });
  let getRandomValues;
  const rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }
  const REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  function validate(uuid) {
    return typeof uuid === "string" && REGEX.test(uuid);
  }
  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
  }
  let _nodeId;
  let _clockseq;
  let _lastMSecs = 0;
  let _lastNSecs = 0;
  function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || rng)();
      if (node == null) {
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      }
      if (clockseq == null) {
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
      }
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
    let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
    const dt2 = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt2 < 0 && options.clockseq === void 0) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt2 < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 122192928e5;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || unsafeStringify(b);
  }
  function parse(uuid) {
    if (!validate(uuid)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  }
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    const bytes = [];
    for (let i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  }
  const DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  const URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  function v35(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      var _namespace;
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (typeof namespace === "string") {
        namespace = parse(namespace);
      }
      if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes = new Uint8Array(16 + value.length);
      bytes.set(namespace);
      bytes.set(value, namespace.length);
      bytes = hashfunc(bytes);
      bytes[6] = bytes[6] & 15 | version;
      bytes[8] = bytes[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = bytes[i];
        }
        return buf;
      }
      return unsafeStringify(bytes);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
  }
  function md5(bytes) {
    if (typeof bytes === "string") {
      const msg = unescape(encodeURIComponent(bytes));
      bytes = new Uint8Array(msg.length);
      for (let i = 0; i < msg.length; ++i) {
        bytes[i] = msg.charCodeAt(i);
      }
    }
    return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
  }
  function md5ToHexEncodedArray(input) {
    const output = [];
    const length32 = input.length * 32;
    const hexTab = "0123456789abcdef";
    for (let i = 0; i < length32; i += 8) {
      const x = input[i >> 5] >>> i % 32 & 255;
      const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
      output.push(hex);
    }
    return output;
  }
  function getOutputLength(inputLength8) {
    return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
  }
  function wordsToMd5(x, len) {
    x[len >> 5] |= 128 << len % 32;
    x[getOutputLength(len) - 1] = len;
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function bytesToWords(input) {
    if (input.length === 0) {
      return [];
    }
    const length8 = input.length * 8;
    const output = new Uint32Array(getOutputLength(length8));
    for (let i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input[i / 8] & 255) << i % 32;
    }
    return output;
  }
  function safeAdd(x, y) {
    const lsw = (x & 65535) + (y & 65535);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 65535;
  }
  function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }
  function md5cmn(q2, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q2), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  const v3 = v35("v3", 48, md5);
  const uuidv3 = v3;
  const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  const native = {
    randomUUID
  };
  function v4(options, buf, offset) {
    if (native.randomUUID && !buf && !options) {
      return native.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  function f(s, x, y, z) {
    switch (s) {
      case 0:
        return x & y ^ ~x & z;
      case 1:
        return x ^ y ^ z;
      case 2:
        return x & y ^ x & z ^ y & z;
      case 3:
        return x ^ y ^ z;
    }
  }
  function ROTL(x, n) {
    return x << n | x >>> 32 - n;
  }
  function sha1(bytes) {
    const K2 = [1518500249, 1859775393, 2400959708, 3395469782];
    const H2 = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    if (typeof bytes === "string") {
      const msg = unescape(encodeURIComponent(bytes));
      bytes = [];
      for (let i = 0; i < msg.length; ++i) {
        bytes.push(msg.charCodeAt(i));
      }
    } else if (!Array.isArray(bytes)) {
      bytes = Array.prototype.slice.call(bytes);
    }
    bytes.push(128);
    const l = bytes.length / 4 + 2;
    const N2 = Math.ceil(l / 16);
    const M = new Array(N2);
    for (let i = 0; i < N2; ++i) {
      const arr = new Uint32Array(16);
      for (let j = 0; j < 16; ++j) {
        arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
      }
      M[i] = arr;
    }
    M[N2 - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
    M[N2 - 1][14] = Math.floor(M[N2 - 1][14]);
    M[N2 - 1][15] = (bytes.length - 1) * 8 & 4294967295;
    for (let i = 0; i < N2; ++i) {
      const W2 = new Uint32Array(80);
      for (let t = 0; t < 16; ++t) {
        W2[t] = M[i][t];
      }
      for (let t = 16; t < 80; ++t) {
        W2[t] = ROTL(W2[t - 3] ^ W2[t - 8] ^ W2[t - 14] ^ W2[t - 16], 1);
      }
      let a = H2[0];
      let b = H2[1];
      let c = H2[2];
      let d = H2[3];
      let e = H2[4];
      for (let t = 0; t < 80; ++t) {
        const s = Math.floor(t / 20);
        const T = ROTL(a, 5) + f(s, b, c, d) + e + K2[s] + W2[t] >>> 0;
        e = d;
        d = c;
        c = ROTL(b, 30) >>> 0;
        b = a;
        a = T;
      }
      H2[0] = H2[0] + a >>> 0;
      H2[1] = H2[1] + b >>> 0;
      H2[2] = H2[2] + c >>> 0;
      H2[3] = H2[3] + d >>> 0;
      H2[4] = H2[4] + e >>> 0;
    }
    return [H2[0] >> 24 & 255, H2[0] >> 16 & 255, H2[0] >> 8 & 255, H2[0] & 255, H2[1] >> 24 & 255, H2[1] >> 16 & 255, H2[1] >> 8 & 255, H2[1] & 255, H2[2] >> 24 & 255, H2[2] >> 16 & 255, H2[2] >> 8 & 255, H2[2] & 255, H2[3] >> 24 & 255, H2[3] >> 16 & 255, H2[3] >> 8 & 255, H2[3] & 255, H2[4] >> 24 & 255, H2[4] >> 16 & 255, H2[4] >> 8 & 255, H2[4] & 255];
  }
  const v5 = v35("v5", 80, sha1);
  const uuidv5 = v5;
  function tryOnScopeDispose(fn2) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createSingletonPromise(fn2) {
    let _promise;
    function wrapper() {
      if (!_promise)
        _promise = fn2();
      return _promise;
    }
    wrapper.reset = async () => {
      const _prev = _promise;
      _promise = void 0;
      if (_prev)
        await _prev;
    };
    return wrapper;
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, toValue(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
  }
  function unrefElement(elRef) {
    var _a2;
    const plain = toValue(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  const defaultNavigator = isClient ? window.navigator : void 0;
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events2))
      events2 = [events2];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement(target), toValue(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  function useMounted() {
    const isMounted = vue.ref(false);
    if (vue.getCurrentInstance()) {
      vue.onMounted(() => {
        isMounted.value = true;
      });
    }
    return isMounted;
  }
  function useSupported(callback) {
    const isMounted = useMounted();
    return vue.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
  function usePermission(permissionDesc, options = {}) {
    const {
      controls = false,
      navigator: navigator2 = defaultNavigator
    } = options;
    const isSupported = useSupported(() => navigator2 && "permissions" in navigator2);
    let permissionStatus;
    const desc = typeof permissionDesc === "string" ? { name: permissionDesc } : permissionDesc;
    const state = vue.ref();
    const onChange = () => {
      if (permissionStatus)
        state.value = permissionStatus.state;
    };
    const query = createSingletonPromise(async () => {
      if (!isSupported.value)
        return;
      if (!permissionStatus) {
        try {
          permissionStatus = await navigator2.permissions.query(desc);
          useEventListener(permissionStatus, "change", onChange);
          onChange();
        } catch (e) {
          state.value = "prompt";
        }
      }
      return permissionStatus;
    });
    query();
    if (controls) {
      return {
        state,
        isSupported,
        query
      };
    } else {
      return state;
    }
  }
  function useClipboard(options = {}) {
    const {
      navigator: navigator2 = defaultNavigator,
      read = false,
      source,
      copiedDuring = 1500,
      legacy = false
    } = options;
    const isClipboardApiSupported = useSupported(() => navigator2 && "clipboard" in navigator2);
    const permissionRead = usePermission("clipboard-read");
    const permissionWrite = usePermission("clipboard-write");
    const isSupported = vue.computed(() => isClipboardApiSupported.value || legacy);
    const text = vue.ref("");
    const copied = vue.ref(false);
    const timeout = useTimeoutFn(() => copied.value = false, copiedDuring);
    function updateText() {
      if (isClipboardApiSupported.value && permissionRead.value !== "denied") {
        navigator2.clipboard.readText().then((value) => {
          text.value = value;
        });
      } else {
        text.value = legacyRead();
      }
    }
    if (isSupported.value && read)
      useEventListener(["copy", "cut"], updateText);
    async function copy(value = toValue(source)) {
      if (isSupported.value && value != null) {
        if (isClipboardApiSupported.value && permissionWrite.value !== "denied")
          await navigator2.clipboard.writeText(value);
        else
          legacyCopy(value);
        text.value = value;
        copied.value = true;
        timeout.start();
      }
    }
    function legacyCopy(value) {
      const ta = document.createElement("textarea");
      ta.value = value != null ? value : "";
      ta.style.position = "absolute";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    function legacyRead() {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = document == null ? void 0 : document.getSelection) == null ? void 0 : _a2.call(document)) == null ? void 0 : _b.toString()) != null ? _c : "";
    }
    return {
      isSupported,
      text,
      copied,
      copy
    };
  }
  const _hoisted_1 = { class: "uuid-container" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "uuid-intro" }, [
    /* @__PURE__ */ vue.createElementVNode("b", null, "什么是UUID?"),
    /* @__PURE__ */ vue.createElementVNode("p", null, "UUID是通用唯一识别码（Universally Unique Identifier）的缩写，指在一台机器上生成的唯一数字，由32位16进制数字组成，形式为8-4-4-4-12。由于UUID的唯一性特征，通常用于分布式系统中对象的标识。本工具可批量生成指定数量的UUID。")
  ], -1);
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("p", { class: "input-tips" }, "本次要生成的UUID的个数, 最多不超过500个", -1);
  const _hoisted_4 = /* @__PURE__ */ vue.createElementVNode("p", { class: "input-tips" }, "指定生成的UUID的大小写形式", -1);
  const _hoisted_5 = /* @__PURE__ */ vue.createElementVNode("p", { class: "input-tips" }, "指定使用什么版本来生成的UUID", -1);
  const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("p", { class: "input-tips" }, "生成的UUID中不使用中横线 - 连接", -1);
  const _hoisted_7 = { style: { "padding": "0 10px 10px" } };
  const _hoisted_8 = {
    key: 0,
    border: "",
    class: "uuid-table"
  };
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("thead", null, [
    /* @__PURE__ */ vue.createElementVNode("th", { class: "uuid-table-cell" }, "UUID"),
    /* @__PURE__ */ vue.createElementVNode("th", { class: "uuid-table-cell" }, "version"),
    /* @__PURE__ */ vue.createElementVNode("th", { class: "uuid-table-cell uuid-table-cell__action" }, "操作")
  ], -1);
  const _hoisted_10 = { class: "uuid-table-cell" };
  const _hoisted_11 = { class: "uuid-table-cell" };
  const _hoisted_12 = { class: "uuid-table-cell uuid-table-cell__action" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "uuid",
    setup(__props) {
      const form = vue.ref({
        count: 1,
        strCase: 1,
        version: 4,
        removeSplit: false,
        data: []
      });
      const showTable = vue.ref(true);
      function handleClick() {
        const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
        const str = "abcdefghg";
        const { strCase, version, removeSplit, count } = form.value;
        switch (version) {
          case 1:
            for (let i = 0; i < count; i++) {
              let uuid = v1();
              uuid = handleCase(uuid, strCase === 1 ? "lower" : "upper");
              uuid = handleRemoveSplit(uuid, removeSplit);
              form.value.data.push({ uuid, version });
            }
            break;
          case 3:
            for (let i = 0; i < count; i++) {
              let uuid = uuidv3(str[Math.floor(Math.random() * 10)] + Date.now().toString(), MY_NAMESPACE);
              uuid = handleCase(uuid, strCase === 1 ? "lower" : "upper");
              uuid = handleRemoveSplit(uuid, removeSplit);
              form.value.data.push({ uuid, version });
            }
            break;
          case 4:
            for (let i = 0; i < count; i++) {
              let uuid = v4();
              uuid = handleCase(uuid, strCase === 1 ? "lower" : "upper");
              uuid = handleRemoveSplit(uuid, removeSplit);
              form.value.data.push({ uuid, version });
            }
            break;
          case 5:
            for (let i = 0; i < count; i++) {
              let uuid = uuidv5(str[Math.floor(Math.random() * 10)] + Date.now().toString(), MY_NAMESPACE);
              uuid = handleCase(uuid, strCase === 1 ? "lower" : "upper");
              uuid = handleRemoveSplit(uuid, removeSplit);
              form.value.data.push({ uuid, version });
            }
            break;
        }
      }
      function handleCase(data, strCase) {
        let res = "";
        switch (strCase) {
          case "lower":
            res = data.toLowerCase();
            break;
          case "upper":
            res = data.toUpperCase();
            break;
        }
        return res;
      }
      function handleRemoveSplit(data, remove) {
        if (remove) {
          return data.split("-").join("");
        }
        return data;
      }
      function handleCopy(data) {
        const { text, copy, copied, isSupported } = useClipboard({
          source: data
        });
        if (isSupported) {
          copy(data);
          if (copied) {
            ElMessage({ message: "复制成功", type: "success", duration: 1e3 });
          }
        } else {
          ElMessage({ message: "不支持复制", type: "warning", duration: 1e3 });
        }
      }
      function handleToggle() {
        showTable.value = !showTable.value;
      }
      return (_ctx, _cache) => {
        const _component_el_input = ElInput;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _hoisted_2,
          vue.createVNode(_sfc_main$1, { title: "生成器配置" }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(ElForm), {
                model: form.value,
                class: "uuid-form",
                "label-position": "right",
                "label-width": "120px",
                "label-suffix": ":"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(ElFormItem), { label: "生成个数" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ElInputNumber), {
                        modelValue: form.value.count,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.count = $event),
                        "controls-position": "right",
                        min: 1,
                        max: 500
                      }, null, 8, ["modelValue"]),
                      _hoisted_3
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(ElFormItem), { label: "生成结果" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ElSelect), {
                        modelValue: form.value.strCase,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.strCase = $event)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(ElOption), {
                            label: "UUID小写",
                            value: 1
                          }),
                          vue.createVNode(vue.unref(ElOption), {
                            label: "UUID大写",
                            value: 2
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"]),
                      _hoisted_4
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(ElFormItem), { label: "uuid版本" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ElSelect), {
                        modelValue: form.value.version,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.version = $event)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(ElOption), {
                            label: "v1",
                            value: 1
                          }),
                          vue.createVNode(vue.unref(ElOption), {
                            label: "v3",
                            value: 3
                          }),
                          vue.createVNode(vue.unref(ElOption), {
                            label: "v4",
                            value: 4
                          }),
                          vue.createVNode(vue.unref(ElOption), {
                            label: "v5",
                            value: 5
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"]),
                      _hoisted_5
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(ElFormItem), { label: "去掉中横线" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ElCheckbox), {
                        modelValue: form.value.removeSplit,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.removeSplit = $event),
                        label: "去掉UUID的中横线"
                      }, null, 8, ["modelValue"]),
                      _hoisted_6
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(ElFormItem), { label: "" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(ElButton), {
                        onClick: handleClick,
                        type: "primary"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("生成")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }),
          form.value.data.length ? (vue.openBlock(), vue.createBlock(_sfc_main$1, {
            key: 0,
            title: "生成器结果"
          }, {
            action: vue.withCtx(() => [
              vue.createElementVNode("span", null, [
                vue.createVNode(vue.unref(ElButton), {
                  type: "primary",
                  onClick: _cache[4] || (_cache[4] = ($event) => handleCopy(form.value.data.map((el) => el.uuid).join("\n")))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("复制全部")
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(ElButton), {
                  type: "success",
                  onClick: handleToggle
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(showTable.value ? "文本显示" : "表格显示"), 1)
                  ]),
                  _: 1
                })
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_7, [
                showTable.value ? (vue.openBlock(), vue.createElementBlock("table", _hoisted_8, [
                  _hoisted_9,
                  vue.createElementVNode("tbody", null, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(form.value.data, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("tr", { key: index }, [
                        vue.createElementVNode("td", _hoisted_10, vue.toDisplayString(item.uuid), 1),
                        vue.createElementVNode("td", _hoisted_11, vue.toDisplayString("v" + item.version), 1),
                        vue.createElementVNode("td", _hoisted_12, [
                          vue.createVNode(vue.unref(ElButton), {
                            type: "primary",
                            size: "small",
                            onClick: ($event) => handleCopy(item.uuid)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("复制")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ])) : (vue.openBlock(), vue.createBlock(_component_el_input, {
                  key: 1,
                  rows: 10,
                  type: "textarea",
                  value: form.value.data.map((el) => el.uuid).join("\n"),
                  readonly: ""
                }, null, 8, ["value"]))
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const main = {
    name: "uuid",
    component: _sfc_main
  };
  return main;
});
//# sourceMappingURL=main.js.map
