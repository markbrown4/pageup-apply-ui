// YOU SHOULD ONLY MODIFY THIS FILE AT `Websites/Frontend/src/common/pageup-utils.js`, ALL OTHER LOCATIONS ARE COPIED FROM THIS FILE

(function () {
    var callbacks = [];
    var waitingOnReady = false;

    // DOMContentLoaded utility function, if DOM is ready, will run callback straight away, or else add an event listener 
    document.ready = function (callback) {
        // Don't continue if callback isn't a function
        if(typeof callback !== "function") {
            return;
        }
        
        // Save callback for later when DOM is ready
        callbacks.push(callback);

        // if document ready to go, let callbacks know
        if (isDOMReady()) {
            return notifyCallbacks();
        } else if(!waitingOnReady) {
            waitingOnReady = true;
            // first choice is DOMContentLoaded event
            document.addEventListener("DOMContentLoaded", notifyCallbacks);
            // backup is window load event
            window.addEventListener("load", notifyCallbacks);
        }
    };

    function isDOMReady() {
        return document.readyState === "complete" || document.readyState === "interactive";
    }

    // DOM's loaded, let's get on with this
    function notifyCallbacks() {
        // Remove event listeners as they're not needed anymore
        document.removeEventListener("DOMContentLoaded", notifyCallbacks);
        window.removeEventListener("load", notifyCallbacks);
        
        // Iterate through callbacks, call them and reinit array
        for (var i = 0, len = callbacks.length; i < len; i++) {
            try {
                callbacks[i]();
            } catch(e) {
                console.error("document.ready callback error: " + e);
            }
            
        }
        callbacks = [];
    }
})();


var isEventSupported = (function (undef) {
var TAGNAMES = {
'select': 'input', 'change': 'input',
'submit': 'form', 'reset': 'form',
'error': 'img', 'load': 'img', 'abort': 'img'
};
function isEventSupported(eventName, element) {
element = element || document.createElement(TAGNAMES[eventName] || 'div');
eventName = 'on' + eventName;
var isSupported = (eventName in element);
if (!isSupported) {
if (!element.setAttribute) {
element = document.createElement('div');
}
if (element.setAttribute && element.removeAttribute) {
element.setAttribute(eventName, '');
isSupported = typeof element[eventName] == 'function';
if (typeof element[eventName] != 'undefined') {
element[eventName] = undef;
}
element.removeAttribute(eventName);
}
}
element = null;
return isSupported;
}
return isEventSupported;
})();
var Prototype = {
Version: '1.7.2',
Browser: (function () {
var ua = navigator.userAgent;
var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
return {
IE: !!window.attachEvent && !isOpera,
Opera: isOpera,
WebKit: ua.indexOf('AppleWebKit/') > -1,
Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
MobileSafari: /Apple.*Mobile/.test(ua)
}
})(),
BrowserFeatures: {
XPath: !!document.evaluate,
SelectorsAPI: !!document.querySelector,
ElementExtensions: (function () {
var constructor = window.Element || window.HTMLElement;
return !!(constructor && constructor.prototype);
})(),
SpecificElementExtensions: (function () {
if (typeof window.HTMLDivElement !== 'undefined')
return true;
var div = document.createElement('div'),
form = document.createElement('form'),
isSupported = false;
if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
isSupported = true;
}
div = form = null;
return isSupported;
})()
},
ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
emptyFunction: function () { },
K: function (x) { return x }
};
if (Prototype.Browser.MobileSafari)
Prototype.BrowserFeatures.SpecificElementExtensions = false;
var Class = (function () {
var IS_DONTENUM_BUGGY = (function () {
for (var p in { toString: 1 }) {
if (p === 'toString') return false;
}
return true;
})();
function subclass() { };
function create() {
var parent = null, properties = $A(arguments);
if (Object.isFunction(properties[0]))
parent = properties.shift();
function klass() {
this.initialize.apply(this, arguments);
}
Object.extend(klass, Class.Methods);
klass.superclass = parent;
klass.subclasses = [];
if (parent) {
subclass.prototype = parent.prototype;
klass.prototype = new subclass;
parent.subclasses.push(klass);
}
for (var i = 0, length = properties.length; i < length; i++)
klass.addMethods(properties[i]);
if (!klass.prototype.initialize)
klass.prototype.initialize = Prototype.emptyFunction;
klass.prototype.constructor = klass;
return klass;
}
function addMethods(source) {
var ancestor = this.superclass && this.superclass.prototype,
properties = Object.keys(source);
if (IS_DONTENUM_BUGGY) {
if (source.toString != Object.prototype.toString)
properties.push("toString");
if (source.valueOf != Object.prototype.valueOf)
properties.push("valueOf");
}
for (var i = 0, length = properties.length; i < length; i++) {
var property = properties[i], value = source[property];
if (ancestor && Object.isFunction(value) &&
value.argumentNames()[0] == "$super") {
var method = value;
value = (function (m) {
return function () { return ancestor[m].apply(this, arguments); };
})(property).wrap(method);
value.valueOf = (function (method) {
return function () { return method.valueOf.call(method); };
})(method);
value.toString = (function (method) {
return function () { return method.toString.call(method); };
})(method);
}
this.prototype[property] = value;
}
return this;
}
return {
create: create,
Methods: {
addMethods: addMethods
}
};
})();
(function () {
var _toString = Object.prototype.toString,
_hasOwnProperty = Object.prototype.hasOwnProperty,
NULL_TYPE = 'Null',
UNDEFINED_TYPE = 'Undefined',
BOOLEAN_TYPE = 'Boolean',
NUMBER_TYPE = 'Number',
STRING_TYPE = 'String',
OBJECT_TYPE = 'Object',
FUNCTION_CLASS = '[object Function]',
BOOLEAN_CLASS = '[object Boolean]',
NUMBER_CLASS = '[object Number]',
STRING_CLASS = '[object String]',
ARRAY_CLASS = '[object Array]',
DATE_CLASS = '[object Date]',
NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
typeof JSON.stringify === 'function' &&
JSON.stringify(0) === '0' &&
typeof JSON.stringify(Prototype.K) === 'undefined';
var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf',
'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var IS_DONTENUM_BUGGY = (function () {
for (var p in { toString: 1 }) {
if (p === 'toString') return false;
}
return true;
})();
function Type(o) {
switch (o) {
case null: return NULL_TYPE;
case (void 0): return UNDEFINED_TYPE;
}
var type = typeof o;
switch (type) {
case 'boolean': return BOOLEAN_TYPE;
case 'number': return NUMBER_TYPE;
case 'string': return STRING_TYPE;
}
return OBJECT_TYPE;
}
function extend(destination, source) {
for (var property in source)
destination[property] = source[property];
return destination;
}
function inspect(object) {
try {
if (isUndefined(object)) return 'undefined';
if (object === null) return 'null';
return object.inspect ? object.inspect() : String(object);
} catch (e) {
if (e instanceof RangeError) return '...';
throw e;
}
}
function toJSON(value) {
return Str('', { '': value }, []);
}
function Str(key, holder, stack) {
var value = holder[key];
if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
value = value.toJSON(key);
}
var _class = _toString.call(value);
switch (_class) {
case NUMBER_CLASS:
case BOOLEAN_CLASS:
case STRING_CLASS:
value = value.valueOf();
}
switch (value) {
case null: return 'null';
case true: return 'true';
case false: return 'false';
}
var type = typeof value;
switch (type) {
case 'string':
return value.inspect(true);
case 'number':
return isFinite(value) ? String(value) : 'null';
case 'object':
for (var i = 0, length = stack.length; i < length; i++) {
if (stack[i] === value) {
throw new TypeError("Cyclic reference to '" + value + "' in object");
}
}
stack.push(value);
var partial = [];
if (_class === ARRAY_CLASS) {
for (var i = 0, length = value.length; i < length; i++) {
var str = Str(i, value, stack);
partial.push(typeof str === 'undefined' ? 'null' : str);
}
partial = '[' + partial.join(',') + ']';
} else {
var keys = Object.keys(value);
for (var i = 0, length = keys.length; i < length; i++) {
var key = keys[i], str = Str(key, value, stack);
if (typeof str !== "undefined") {
partial.push(key.inspect(true) + ':' + str);
}
}
partial = '{' + partial.join(',') + '}';
}
stack.pop();
return partial;
}
}
function stringify(object) {
return JSON.stringify(object);
}
function toQueryString(object) {
return $H(object).toQueryString();
}
function toHTML(object) {
return object && object.toHTML ? object.toHTML() : String.interpret(object);
}
function keys(object) {
if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
var results = [];
for (var property in object) {
if (_hasOwnProperty.call(object, property))
results.push(property);
}
if (IS_DONTENUM_BUGGY) {
for (var i = 0; property = DONT_ENUMS[i]; i++) {
if (_hasOwnProperty.call(object, property))
results.push(property);
}
}
return results;
}
function values(object) {
var results = [];
for (var property in object)
results.push(object[property]);
return results;
}
function clone(object) {
return extend({}, object);
}
function isElement(object) {
return !!(object && object.nodeType == 1);
}
function isArray(object) {
return _toString.call(object) === ARRAY_CLASS;
}
var hasNativeIsArray = (typeof Array.isArray == 'function')
&& Array.isArray([]) && !Array.isArray({});
if (hasNativeIsArray) {
isArray = Array.isArray;
}
function isHash(object) {
return object instanceof Hash;
}
function isFunction(object) {
return _toString.call(object) === FUNCTION_CLASS;
}
function isString(object) {
return _toString.call(object) === STRING_CLASS;
}
function isNumber(object) {
return _toString.call(object) === NUMBER_CLASS;
}
function isDate(object) {
return _toString.call(object) === DATE_CLASS;
}
function isUndefined(object) {
return typeof object === "undefined";
}
extend(Object, {
extend: extend,
inspect: inspect,
toJSON: NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
toQueryString: toQueryString,
toHTML: toHTML,
keys: Object.keys || keys,
values: values,
clone: clone,
isElement: isElement,
isArray: isArray,
isHash: isHash,
isFunction: isFunction,
isString: isString,
isNumber: isNumber,
isDate: isDate,
isUndefined: isUndefined
});
})();
Object.extend(Function.prototype, (function () {
var slice = Array.prototype.slice;
function update(array, args) {
var arrayLength = array.length, length = args.length;
while (length--) array[arrayLength + length] = args[length];
return array;
}
function merge(array, args) {
array = slice.call(array, 0);
return update(array, args);
}
function argumentNames() {
var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
.replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
.replace(/\s+/g, '').split(',');
return names.length == 1 && !names[0] ? [] : names;
}
function bind(context) {
if (arguments.length < 2 && Object.isUndefined(arguments[0]))
return this;
if (!Object.isFunction(this))
throw new TypeError("The object is not callable.");
var nop = function () { };
var __method = this, args = slice.call(arguments, 1);
var bound = function () {
var a = merge(args, arguments);
var c = this instanceof bound ? this : context;
return __method.apply(c, a);
};
nop.prototype = this.prototype;
bound.prototype = new nop();
return bound;
}
function bindAsEventListener(context) {
var __method = this, args = slice.call(arguments, 1);
return function (event) {
var a = update([event || window.event], args);
return __method.apply(context, a);
}
}
function curry() {
if (!arguments.length) return this;
var __method = this, args = slice.call(arguments, 0);
return function () {
var a = merge(args, arguments);
return __method.apply(this, a);
}
}
function delay(timeout) {
var __method = this, args = slice.call(arguments, 1);
timeout = timeout * 1000;
return window.setTimeout(function () {
return __method.apply(__method, args);
}, timeout);
}
function defer() {
var args = update([0.01], arguments);
return this.delay.apply(this, args);
}
function wrap(wrapper) {
var __method = this;
return function () {
var a = update([__method.bind(this)], arguments);
return wrapper.apply(this, a);
}
}
function methodize() {
if (this._methodized) return this._methodized;
var __method = this;
return this._methodized = function () {
var a = update([this], arguments);
return __method.apply(null, a);
};
}
var extensions = {
argumentNames: argumentNames,
bindAsEventListener: bindAsEventListener,
curry: curry,
delay: delay,
defer: defer,
wrap: wrap,
methodize: methodize
};
if (!Function.prototype.bind)
extensions.bind = bind;
return extensions;
})());
(function (proto) {
function toISOString() {
return this.getUTCFullYear() + '-' +
(this.getUTCMonth() + 1).toPaddedString(2) + '-' +
this.getUTCDate().toPaddedString(2) + 'T' +
this.getUTCHours().toPaddedString(2) + ':' +
this.getUTCMinutes().toPaddedString(2) + ':' +
this.getUTCSeconds().toPaddedString(2) + 'Z';
}
function toJSON() {
return this.toISOString();
}
if (!proto.toISOString) proto.toISOString = toISOString;
if (!proto.toJSON) proto.toJSON = toJSON;
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function (str) {
return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
initialize: function (callback, frequency) {
this.callback = callback;
this.frequency = frequency;
this.currentlyExecuting = false;
this.registerCallback();
},
registerCallback: function () {
this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
},
execute: function () {
this.callback(this);
},
stop: function () {
if (!this.timer) return;
clearInterval(this.timer);
this.timer = null;
},
onTimerEvent: function () {
if (!this.currentlyExecuting) {
try {
this.currentlyExecuting = true;
this.execute();
this.currentlyExecuting = false;
} catch (e) {
this.currentlyExecuting = false;
throw e;
}
}
}
});
Object.extend(String, {
interpret: function (value) {
return value == null ? '' : String(value);
},
specialChar: {
'\b': '\\b',
'\t': '\\t',
'\n': '\\n',
'\f': '\\f',
'\r': '\\r',
'\\': '\\\\'
}
});
Object.extend(String.prototype, (function () {
var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
typeof JSON.parse === 'function' &&
JSON.parse('{"test": true}').test;
function prepareReplacement(replacement) {
if (Object.isFunction(replacement)) return replacement;
var template = new Template(replacement);
return function (match) { return template.evaluate(match) };
}
function isNonEmptyRegExp(regexp) {
return regexp.source && regexp.source !== '(?:)';
}
function gsub(pattern, replacement) {
var result = '', source = this, match;
replacement = prepareReplacement(replacement);
if (Object.isString(pattern))
pattern = RegExp.escape(pattern);
if (!(pattern.length || isNonEmptyRegExp(pattern))) {
replacement = replacement('');
return replacement + source.split('').join(replacement) + replacement;
}
while (source.length > 0) {
match = source.match(pattern)
if (match && match[0].length > 0) {
result += source.slice(0, match.index);
result += String.interpret(replacement(match));
source = source.slice(match.index + match[0].length);
} else {
result += source, source = '';
}
}
return result;
}
function sub(pattern, replacement, count) {
replacement = prepareReplacement(replacement);
count = Object.isUndefined(count) ? 1 : count;
return this.gsub(pattern, function (match) {
if (--count < 0) return match[0];
return replacement(match);
});
}
function scan(pattern, iterator) {
this.gsub(pattern, iterator);
return String(this);
}
function truncate(length, truncation) {
length = length || 30;
truncation = Object.isUndefined(truncation) ? '...' : truncation;
return this.length > length ?
this.slice(0, length - truncation.length) + truncation : String(this);
}
function strip() {
return this.replace(/^\s+/, '').replace(/\s+$/, '');
}
function stripTags() {
return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
}
function stripScripts() {
return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
}
function extractScripts() {
var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
matchOne = new RegExp(Prototype.ScriptFragment, 'im');
return (this.match(matchAll) || []).map(function (scriptTag) {
return (scriptTag.match(matchOne) || ['', ''])[1];
});
}
function evalScripts() {
return this.extractScripts().map(function (script) { return eval(script); });
}
function escapeHTML() {
return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function unescapeHTML() {
return this.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function toQueryParams(separator) {
var match = this.strip().match(/([^?#]*)(#.*)?$/);
if (!match) return {};
return match[1].split(separator || '&').inject({}, function (hash, pair) {
if ((pair = pair.split('='))[0]) {
var key = decodeURIComponent(pair.shift()),
value = pair.length > 1 ? pair.join('=') : pair[0];
if (value != undefined) {
value = value.gsub('+', ' ');
value = decodeURIComponent(value);
}
if (key in hash) {
if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
hash[key].push(value);
}
else hash[key] = value;
}
return hash;
});
}
function toArray() {
return this.split('');
}
function succ() {
return this.slice(0, this.length - 1) +
String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
}
function times(count) {
return count < 1 ? '' : new Array(count + 1).join(this);
}
function camelize() {
return this.replace(/-+(.)?/g, function (match, chr) {
return chr ? chr.toUpperCase() : '';
});
}
function capitalize() {
return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
}
function underscore() {
return this.replace(/::/g, '/')
.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
.replace(/([a-z\d])([A-Z])/g, '$1_$2')
.replace(/-/g, '_')
.toLowerCase();
}
function dasherize() {
return this.replace(/_/g, '-');
}
function inspect(useDoubleQuotes) {
var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
if (character in String.specialChar) {
return String.specialChar[character];
}
return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
});
if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
return "'" + escapedString.replace(/'/g, '\\\'') + "'";
}
function unfilterJSON(filter) {
return this.replace(filter || Prototype.JSONFilter, '$1');
}
function isJSON() {
var str = this;
if (str.blank()) return false;
str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
return (/^[\],:{}\s]*$/).test(str);
}
function evalJSON(sanitize) {
var json = this.unfilterJSON(),
cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
if (cx.test(json)) {
json = json.replace(cx, function (a) {
return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
});
}
try {
if (!sanitize || json.isJSON()) return eval('(' + json + ')');
} catch (e) { }
throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
}
function parseJSON() {
var json = this.unfilterJSON();
return JSON.parse(json);
}
function include(pattern) {
return this.indexOf(pattern) > -1;
}
function startsWith(pattern, position) {
position = Object.isNumber(position) ? position : 0;
return this.lastIndexOf(pattern, position) === position;
}
function endsWith(pattern, position) {
pattern = String(pattern);
position = Object.isNumber(position) ? position : this.length;
if (position < 0) position = 0;
if (position > this.length) position = this.length;
var d = position - pattern.length;
return d >= 0 && this.indexOf(pattern, d) === d;
}
function empty() {
return this == '';
}
function blank() {
return /^\s*$/.test(this);
}
function interpolate(object, pattern) {
return new Template(this, pattern).evaluate(object);
}
return {
gsub: gsub,
sub: sub,
scan: scan,
truncate: truncate,
strip: String.prototype.trim || strip,
stripTags: stripTags,
stripScripts: stripScripts,
extractScripts: extractScripts,
evalScripts: evalScripts,
escapeHTML: escapeHTML,
unescapeHTML: unescapeHTML,
toQueryParams: toQueryParams,
parseQuery: toQueryParams,
toArray: toArray,
succ: succ,
times: times,
camelize: camelize,
capitalize: capitalize,
underscore: underscore,
dasherize: dasherize,
inspect: inspect,
unfilterJSON: unfilterJSON,
isJSON: isJSON,
evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
include: include,
startsWith: String.prototype.startsWith || startsWith,
endsWith: String.prototype.endsWith || endsWith,
empty: empty,
blank: blank,
interpolate: interpolate
};
})());
var Template = Class.create({
initialize: function (template, pattern) {
this.template = template.toString();
this.pattern = pattern || Template.Pattern;
},
evaluate: function (object) {
if (object && Object.isFunction(object.toTemplateReplacements))
object = object.toTemplateReplacements();
return this.template.gsub(this.pattern, function (match) {
if (object == null) return (match[1] + '');
var before = match[1] || '';
if (before == '\\') return match[2];
var ctx = object, expr = match[3],
pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
match = pattern.exec(expr);
if (match == null) return before;
while (match != null) {
var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
ctx = ctx[comp];
if (null == ctx || '' == match[3]) break;
expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
match = pattern.exec(expr);
}
return before + String.interpret(ctx);
});
}
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function () {
function each(iterator, context) {
try {
this._each(iterator, context);
} catch (e) {
if (e != $break) throw e;
}
return this;
}
function eachSlice(number, iterator, context) {
var index = -number, slices = [], array = this.toArray();
if (number < 1) return array;
while ((index += number) < array.length)
slices.push(array.slice(index, index + number));
return slices.collect(iterator, context);
}
function all(iterator, context) {
iterator = iterator || Prototype.K;
var result = true;
this.each(function (value, index) {
result = result && !!iterator.call(context, value, index, this);
if (!result) throw $break;
}, this);
return result;
}
function any(iterator, context) {
iterator = iterator || Prototype.K;
var result = false;
this.each(function (value, index) {
if (result = !!iterator.call(context, value, index, this))
throw $break;
}, this);
return result;
}
function collect(iterator, context) {
iterator = iterator || Prototype.K;
var results = [];
this.each(function (value, index) {
results.push(iterator.call(context, value, index, this));
}, this);
return results;
}
function detect(iterator, context) {
var result;
this.each(function (value, index) {
if (iterator.call(context, value, index, this)) {
result = value;
throw $break;
}
}, this);
return result;
}
function findAll(iterator, context) {
var results = [];
this.each(function (value, index) {
if (iterator.call(context, value, index, this))
results.push(value);
}, this);
return results;
}
function grep(filter, iterator, context) {
iterator = iterator || Prototype.K;
var results = [];
if (Object.isString(filter))
filter = new RegExp(RegExp.escape(filter));
this.each(function (value, index) {
if (filter.match(value))
results.push(iterator.call(context, value, index, this));
}, this);
return results;
}
function include(object) {
if (Object.isFunction(this.indexOf) && this.indexOf(object) != -1)
return true;
var found = false;
this.each(function (value) {
if (value == object) {
found = true;
throw $break;
}
});
return found;
}
function inGroupsOf(number, fillWith) {
fillWith = Object.isUndefined(fillWith) ? null : fillWith;
return this.eachSlice(number, function (slice) {
while (slice.length < number) slice.push(fillWith);
return slice;
});
}
function inject(memo, iterator, context) {
this.each(function (value, index) {
memo = iterator.call(context, memo, value, index, this);
}, this);
return memo;
}
function invoke(method) {
var args = $A(arguments).slice(1);
return this.map(function (value) {
return value[method].apply(value, args);
});
}
function max(iterator, context) {
iterator = iterator || Prototype.K;
var result;
this.each(function (value, index) {
value = iterator.call(context, value, index, this);
if (result == null || value >= result)
result = value;
}, this);
return result;
}
function min(iterator, context) {
iterator = iterator || Prototype.K;
var result;
this.each(function (value, index) {
value = iterator.call(context, value, index, this);
if (result == null || value < result)
result = value;
}, this);
return result;
}
function partition(iterator, context) {
iterator = iterator || Prototype.K;
var trues = [], falses = [];
this.each(function (value, index) {
(iterator.call(context, value, index, this) ?
trues : falses).push(value);
}, this);
return [trues, falses];
}
function pluck(property) {
var results = [];
this.each(function (value) {
results.push(value[property]);
});
return results;
}
function reject(iterator, context) {
var results = [];
this.each(function (value, index) {
if (!iterator.call(context, value, index, this))
results.push(value);
}, this);
return results;
}
function sortBy(iterator, context) {
return this.map(function (value, index) {
return {
value: value,
criteria: iterator.call(context, value, index, this)
};
}, this).sort(function (left, right) {
var a = left.criteria, b = right.criteria;
return a < b ? -1 : a > b ? 1 : 0;
}).pluck('value');
}
function toArray() {
return this.map();
}
function zip() {
var iterator = Prototype.K, args = $A(arguments);
if (Object.isFunction(args.last()))
iterator = args.pop();
var collections = [this].concat(args).map($A);
return this.map(function (value, index) {
return iterator(collections.pluck(index));
});
}
function size() {
return this.toArray().length;
}
function inspect() {
return '#<Enumerable:' + this.toArray().inspect() + '>';
}
return {
each: each,
eachSlice: eachSlice,
all: all,
every: all,
any: any,
some: any,
collect: collect,
map: collect,
detect: detect,
findAll: findAll,
select: findAll,
filter: findAll,
grep: grep,
include: include,
member: include,
inGroupsOf: inGroupsOf,
inject: inject,
invoke: invoke,
max: max,
min: min,
partition: partition,
pluck: pluck,
reject: reject,
sortBy: sortBy,
toArray: toArray,
entries: toArray,
zip: zip,
size: size,
inspect: inspect,
find: detect
};
})();
function $A(iterable) {
if (!iterable) return [];
if ('toArray' in Object(iterable)) return iterable.toArray();
var length = iterable.length || 0, results = new Array(length);
while (length--) results[length] = iterable[length];
return results;
}
function $w(string) {
if (!Object.isString(string)) return [];
string = string.strip();
return string ? string.split(/\s+/) : [];
}
Array.from = $A;
(function () {
var arrayProto = Array.prototype,
slice = arrayProto.slice,
_each = arrayProto.forEach;
function each(iterator, context) {
for (var i = 0, length = this.length >>> 0; i < length; i++) {
if (i in this) iterator.call(context, this[i], i, this);
}
}
if (!_each) _each = each;
function clear() {
this.length = 0;
return this;
}
function first() {
return this[0];
}
function last() {
return this[this.length - 1];
}
function compact() {
return this.select(function (value) {
return value != null;
});
}
function flatten() {
return this.inject([], function (array, value) {
if (Object.isArray(value))
return array.concat(value.flatten());
array.push(value);
return array;
});
}
function without() {
var values = slice.call(arguments, 0);
return this.select(function (value) {
return !values.include(value);
});
}
function reverse(inline) {
return (inline === false ? this.toArray() : this)._reverse();
}
function uniq(sorted) {
return this.inject([], function (array, value, index) {
if (0 == index || (sorted ? array.last() != value : !array.include(value)))
array.push(value);
return array;
});
}
function intersect(array) {
return this.uniq().findAll(function (item) {
return array.indexOf(item) !== -1;
});
}
function clone() {
return slice.call(this, 0);
}
function size() {
return this.length;
}
function inspect() {
return '[' + this.map(Object.inspect).join(', ') + ']';
}
function indexOf(item, i) {
if (this == null) throw new TypeError();
var array = Object(this), length = array.length >>> 0;
if (length === 0) return -1;
i = Number(i);
if (isNaN(i)) {
i = 0;
} else if (i !== 0 && isFinite(i)) {
i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
}
if (i > length) return -1;
var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
for (; k < length; k++)
if (k in array && array[k] === item) return k;
return -1;
}
function lastIndexOf(item, i) {
if (this == null) throw new TypeError();
var array = Object(this), length = array.length >>> 0;
if (length === 0) return -1;
if (!Object.isUndefined(i)) {
i = Number(i);
if (isNaN(i)) {
i = 0;
} else if (i !== 0 && isFinite(i)) {
i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
}
} else {
i = length;
}
var k = i >= 0 ? Math.min(i, length - 1) :
length - Math.abs(i);
for (; k >= 0; k--)
if (k in array && array[k] === item) return k;
return -1;
}
function concat(_) {
var array = [], items = slice.call(arguments, 0), item, n = 0;
items.unshift(this);
for (var i = 0, length = items.length; i < length; i++) {
item = items[i];
if (Object.isArray(item) && !('callee' in item)) {
for (var j = 0, arrayLength = item.length; j < arrayLength; j++) {
if (j in item) array[n] = item[j];
n++;
}
} else {
array[n++] = item;
}
}
array.length = n;
return array;
}
function wrapNative(method) {
return function () {
if (arguments.length === 0) {
return method.call(this, Prototype.K);
} else if (arguments[0] === undefined) {
var args = slice.call(arguments, 1);
args.unshift(Prototype.K);
return method.apply(this, args);
} else {
return method.apply(this, arguments);
}
};
}
function map(iterator) {
if (this == null) throw new TypeError();
iterator = iterator || Prototype.K;
var object = Object(this);
var results = [], context = arguments[1], n = 0;
for (var i = 0, length = object.length >>> 0; i < length; i++) {
if (i in object) {
results[n] = iterator.call(context, object[i], i, object);
}
n++;
}
results.length = n;
return results;
}
if (arrayProto.map) {
map = wrapNative(Array.prototype.map);
}
function filter(iterator) {
if (this == null || !Object.isFunction(iterator))
throw new TypeError();
var object = Object(this);
var results = [], context = arguments[1], value;
for (var i = 0, length = object.length >>> 0; i < length; i++) {
if (i in object) {
value = object[i];
if (iterator.call(context, value, i, object)) {
results.push(value);
}
}
}
return results;
}
if (arrayProto.filter) {
filter = Array.prototype.filter;
}
function some(iterator) {
if (this == null) throw new TypeError();
iterator = iterator || Prototype.K;
var context = arguments[1];
var object = Object(this);
for (var i = 0, length = object.length >>> 0; i < length; i++) {
if (i in object && iterator.call(context, object[i], i, object)) {
return true;
}
}
return false;
}
if (arrayProto.some) {
var some = wrapNative(Array.prototype.some);
}
function every(iterator) {
if (this == null) throw new TypeError();
iterator = iterator || Prototype.K;
var context = arguments[1];
var object = Object(this);
for (var i = 0, length = object.length >>> 0; i < length; i++) {
if (i in object && !iterator.call(context, object[i], i, object)) {
return false;
}
}
return true;
}
if (arrayProto.every) {
var every = wrapNative(Array.prototype.every);
}
var _reduce = arrayProto.reduce;
function inject(memo, iterator) {
iterator = iterator || Prototype.K;
var context = arguments[2];
return _reduce.call(this, iterator.bind(context), memo);
}
if (!arrayProto.reduce) {
var inject = Enumerable.inject;
}
Object.extend(arrayProto, Enumerable);
if (!arrayProto._reverse)
arrayProto._reverse = arrayProto.reverse;
Object.extend(arrayProto, {
_each: _each,
map: map,
collect: map,
select: filter,
filter: filter,
findAll: filter,
some: some,
any: some,
every: every,
all: every,
inject: inject,
clear: clear,
first: first,
last: last,
compact: compact,
flatten: flatten,
without: without,
reverse: reverse,
uniq: uniq,
intersect: intersect,
clone: clone,
toArray: clone,
size: size,
inspect: inspect
});
var CONCAT_ARGUMENTS_BUGGY = (function () {
return [].concat(arguments)[0][0] !== 1;
})(1, 2);
if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;
if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
return new Hash(object);
};
var Hash = Class.create(Enumerable, (function () {
function initialize(object) {
this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
}
function _each(iterator, context) {
var i = 0;
for (var key in this._object) {
var value = this._object[key], pair = [key, value];
pair.key = key;
pair.value = value;
iterator.call(context, pair, i);
i++;
}
}
function set(key, value) {
return this._object[key] = value;
}
function get(key) {
if (this._object[key] !== Object.prototype[key])
return this._object[key];
}
function unset(key) {
var value = this._object[key];
delete this._object[key];
return value;
}
function toObject() {
return Object.clone(this._object);
}
function keys() {
return this.pluck('key');
}
function values() {
return this.pluck('value');
}
function index(value) {
var match = this.detect(function (pair) {
return pair.value === value;
});
return match && match.key;
}
function merge(object) {
return this.clone().update(object);
}
function update(object) {
return new Hash(object).inject(this, function (result, pair) {
result.set(pair.key, pair.value);
return result;
});
}
function toQueryPair(key, value) {
if (Object.isUndefined(value)) return key;
value = String.interpret(value);
value = value.gsub(/(\r)?\n/, '\r\n');
value = encodeURIComponent(value);
value = value.gsub(/%20/, '+');
return key + '=' + value;
}
function toQueryString() {
return this.inject([], function (results, pair) {
var key = encodeURIComponent(pair.key), values = pair.value;
if (values && typeof values == 'object') {
if (Object.isArray(values)) {
var queryValues = [];
for (var i = 0, len = values.length, value; i < len; i++) {
value = values[i];
queryValues.push(toQueryPair(key, value));
}
return results.concat(queryValues);
}
} else results.push(toQueryPair(key, values));
return results;
}).join('&');
}
function inspect() {
return '#<Hash:{' + this.map(function (pair) {
return pair.map(Object.inspect).join(': ');
}).join(', ') + '}>';
}
function clone() {
return new Hash(this);
}
return {
initialize: initialize,
_each: _each,
set: set,
get: get,
unset: unset,
toObject: toObject,
toTemplateReplacements: toObject,
keys: keys,
values: values,
index: index,
merge: merge,
update: update,
toQueryString: toQueryString,
inspect: inspect,
toJSON: toObject,
clone: clone
};
})());
Hash.from = $H;
Object.extend(Number.prototype, (function () {
function toColorPart() {
return this.toPaddedString(2, 16);
}
function succ() {
return this + 1;
}
function times(iterator, context) {
$R(0, this, true).each(iterator, context);
return this;
}
function toPaddedString(length, radix) {
var string = this.toString(radix || 10);
return '0'.times(length - string.length) + string;
}
function abs() {
return Math.abs(this);
}
function round() {
return Math.round(this);
}
function ceil() {
return Math.ceil(this);
}
function floor() {
return Math.floor(this);
}
return {
toColorPart: toColorPart,
succ: succ,
times: times,
toPaddedString: toPaddedString,
abs: abs,
round: round,
ceil: ceil,
floor: floor
};
})());
function $R(start, end, exclusive) {
return new ObjectRange(start, end, exclusive);
}
var ObjectRange = Class.create(Enumerable, (function () {
function initialize(start, end, exclusive) {
this.start = start;
this.end = end;
this.exclusive = exclusive;
}
function _each(iterator, context) {
var value = this.start, i;
for (i = 0; this.include(value) ; i++) {
iterator.call(context, value, i);
value = value.succ();
}
}
function include(value) {
if (value < this.start)
return false;
if (this.exclusive)
return value < this.end;
return value <= this.end;
}
return {
initialize: initialize,
_each: _each,
include: include
};
})());
var Abstract = {};
var Try = {
these: function () {
var returnValue;
for (var i = 0, length = arguments.length; i < length; i++) {
var lambda = arguments[i];
try {
returnValue = lambda();
break;
} catch (e) { }
}
return returnValue;
}
};
var Ajax = {
getTransport: function () {
return Try.these(
function () { return new XMLHttpRequest() },
function () { return new ActiveXObject('Msxml2.XMLHTTP') },
function () { return new ActiveXObject('Microsoft.XMLHTTP') }
) || false;
},
activeRequestCount: 0
};
Ajax.Responders = {
responders: [],
_each: function (iterator, context) {
this.responders._each(iterator, context);
},
register: function (responder) {
if (!this.include(responder))
this.responders.push(responder);
},
unregister: function (responder) {
this.responders = this.responders.without(responder);
},
dispatch: function (callback, request, transport, json) {
this.each(function (responder) {
if (Object.isFunction(responder[callback])) {
try {
responder[callback].apply(responder, [request, transport, json]);
} catch (e) { }
}
});
}
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
onCreate: function () { Ajax.activeRequestCount++ },
onComplete: function () { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
initialize: function (options) {
this.options = {
method: 'post',
asynchronous: true,
contentType: 'application/x-www-form-urlencoded',
encoding: 'UTF-8',
parameters: '',
evalJSON: true,
evalJS: true
};
Object.extend(this.options, options || {});
this.options.method = this.options.method.toLowerCase();
if (Object.isHash(this.options.parameters))
this.options.parameters = this.options.parameters.toObject();
}
});
Ajax.Request = Class.create(Ajax.Base, {
_complete: false,
initialize: function ($super, url, options) {
$super(options);
this.transport = Ajax.getTransport();
requests[requests.length] = this.transport;
this.request(url);
},
request: function (url) {
this.url = url;
this.method = this.options.method;
var params = Object.isString(this.options.parameters) ?
this.options.parameters :
Object.toQueryString(this.options.parameters);
if (!['get', 'post'].include(this.method)) {
params += (params ? '&' : '') + "_method=" + this.method;
this.method = 'post';
}
if (params && this.method === 'get') {
this.url += (this.url.include('?') ? '&' : '?') + params;
}
this.parameters = params.toQueryParams();
try {
var response = new Ajax.Response(this);
if (this.options.onCreate) this.options.onCreate(response);
Ajax.Responders.dispatch('onCreate', this, response);
this.transport.open(this.method.toUpperCase(), this.url,
this.options.asynchronous);
if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
this.transport.onreadystatechange = this.onStateChange.bind(this);
this.setRequestHeaders();
this.body = this.method == 'post' ? (this.options.postBody || params) : null;
this.transport.send(this.body);
if (!this.options.asynchronous && this.transport.overrideMimeType)
this.onStateChange();
}
catch (e) {
this.dispatchException(e);
}
},
onStateChange: function () {
var readyState = this.transport.readyState;
if (readyState > 1 && !((readyState == 4) && this._complete))
this.respondToReadyState(this.transport.readyState);
},
setRequestHeaders: function () {
var headers = {
'X-Requested-With': 'XMLHttpRequest',
'X-Prototype-Version': Prototype.Version,
'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
};
if (this.method == 'post') {
headers['Content-type'] = this.options.contentType +
(this.options.encoding ? '; charset=' + this.options.encoding : '');
if (this.transport.overrideMimeType &&
(navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005)
headers['Connection'] = 'close';
}
if (typeof this.options.requestHeaders == 'object') {
var extras = this.options.requestHeaders;
if (Object.isFunction(extras.push))
for (var i = 0, length = extras.length; i < length; i += 2)
headers[extras[i]] = extras[i + 1];
else
$H(extras).each(function (pair) { headers[pair.key] = pair.value });
}
for (var name in headers)
if (headers[name] != null)
this.transport.setRequestHeader(name, headers[name]);
},
success: function () {
var status = this.getStatus();
return !status || (status >= 200 && status < 300) || status == 304;
},
getStatus: function () {
try {
if (this.transport.status === 1223) return 204;
return this.transport.status || 0;
} catch (e) { return 0 }
},
respondToReadyState: function (readyState) {
var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);
if (state == 'Complete') {
try {
this._complete = true;
(this.options['on' + response.status]
|| this.options['on' + (this.success() ? 'Success' : 'Failure')]
|| Prototype.emptyFunction)(response, response.headerJSON);
} catch (e) {
this.dispatchException(e);
}
var contentType = response.getHeader('Content-type');
if (this.options.evalJS == 'force'
|| (this.options.evalJS && this.isSameOrigin() && contentType
&& contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
this.evalResponse();
}
try {
(this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
} catch (e) {
this.dispatchException(e);
}
if (state == 'Complete') {
this.transport.onreadystatechange = Prototype.emptyFunction;
}
},
isSameOrigin: function () {
var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
protocol: location.protocol,
domain: document.domain,
port: location.port ? ':' + location.port : ''
}));
},
getHeader: function (name) {
try {
return this.transport.getResponseHeader(name) || null;
} catch (e) { return null; }
},
evalResponse: function () {
try {
return eval((this.transport.responseText || '').unfilterJSON());
} catch (e) {
this.dispatchException(e);
}
},
dispatchException: function (exception) {
(this.options.onException || Prototype.emptyFunction)(this, exception);
Ajax.Responders.dispatch('onException', this, exception);
}
});
Ajax.Request.Events =
['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
Ajax.Response = Class.create({
initialize: function (request) {
this.request = request;
var transport = this.transport = request.transport,
readyState = this.readyState = transport.readyState;
if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
this.status = this.getStatus();
this.statusText = this.getStatusText();
this.responseText = String.interpret(transport.responseText);
this.headerJSON = this._getHeaderJSON();
}
if (readyState == 4) {
var xml = transport.responseXML;
this.responseXML = Object.isUndefined(xml) ? null : xml;
this.responseJSON = this._getResponseJSON();
}
},
status: 0,
statusText: '',
getStatus: Ajax.Request.prototype.getStatus,
getStatusText: function () {
try {
return this.transport.statusText || '';
} catch (e) { return '' }
},
getHeader: Ajax.Request.prototype.getHeader,
getAllHeaders: function () {
try {
return this.getAllResponseHeaders();
} catch (e) { return null }
},
getResponseHeader: function (name) {
return this.transport.getResponseHeader(name);
},
getAllResponseHeaders: function () {
return this.transport.getAllResponseHeaders();
},
_getHeaderJSON: function () {
var json = this.getHeader('X-JSON');
if (!json) return null;
try {
json = decodeURIComponent(escape(json));
} catch (e) {
}
try {
return json.evalJSON(this.request.options.sanitizeJSON ||
!this.request.isSameOrigin());
} catch (e) {
this.request.dispatchException(e);
}
},
_getResponseJSON: function () {
var options = this.request.options;
if (!options.evalJSON || (options.evalJSON != 'force' &&
!(this.getHeader('Content-type') || '').include('application/json')) ||
this.responseText.blank())
return null;
try {
return this.responseText.evalJSON(options.sanitizeJSON ||
!this.request.isSameOrigin());
} catch (e) {
this.request.dispatchException(e);
}
}
});
Ajax.Updater = Class.create(Ajax.Request, {
initialize: function ($super, container, url, options) {
this.container = {
success: (container.success || container),
failure: (container.failure || (container.success ? null : container))
};
options = Object.clone(options);
var onComplete = options.onComplete;
options.onComplete = (function (response, json) {
this.updateContent(response.responseText);
if (Object.isFunction(onComplete)) onComplete(response, json);
}).bind(this);
$super(url, options);
},
updateContent: function (responseText) {
var receiver = this.container[this.success() ? 'success' : 'failure'],
options = this.options;
if (!options.evalScripts) responseText = responseText.stripScripts();
if (receiver = $(receiver)) {
if (options.insertion) {
if (Object.isString(options.insertion)) {
var insertion = {}; insertion[options.insertion] = responseText;
receiver.insert(insertion);
}
else options.insertion(receiver, responseText);
}
else receiver.update(responseText);
}
}
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
initialize: function ($super, container, url, options) {
$super(options);
this.onComplete = this.options.onComplete;
this.frequency = (this.options.frequency || 2);
this.decay = (this.options.decay || 1);
this.updater = {};
this.container = container;
this.url = url;
this.start();
},
start: function () {
this.options.onComplete = this.updateComplete.bind(this);
this.onTimerEvent();
},
stop: function () {
this.updater.options.onComplete = undefined;
clearTimeout(this.timer);
(this.onComplete || Prototype.emptyFunction).apply(this, arguments);
},
updateComplete: function (response) {
if (this.options.decay) {
this.decay = (response.responseText == this.lastText ?
this.decay * this.options.decay : 1);
this.lastText = response.responseText;
}
this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
},
onTimerEvent: function () {
this.updater = new Ajax.Updater(this.container, this.url, this.options);
}
});
(function (GLOBAL) {
var UNDEFINED;
var SLICE = Array.prototype.slice;
var DIV = document.createElement('div');
function $(element) {
if (arguments.length > 1) {
for (var i = 0, elements = [], length = arguments.length; i < length; i++)
elements.push($(arguments[i]));
return elements;
}
if (Object.isString(element))
element = document.getElementById(element);
return Element.extend(element);
}
GLOBAL.$ = $;
if (!GLOBAL.Node) GLOBAL.Node = {};
if (!GLOBAL.Node.ELEMENT_NODE) {
Object.extend(GLOBAL.Node, {
ELEMENT_NODE: 1,
ATTRIBUTE_NODE: 2,
TEXT_NODE: 3,
CDATA_SECTION_NODE: 4,
ENTITY_REFERENCE_NODE: 5,
ENTITY_NODE: 6,
PROCESSING_INSTRUCTION_NODE: 7,
COMMENT_NODE: 8,
DOCUMENT_NODE: 9,
DOCUMENT_TYPE_NODE: 10,
DOCUMENT_FRAGMENT_NODE: 11,
NOTATION_NODE: 12
});
}
var ELEMENT_CACHE = {};
function shouldUseCreationCache(tagName, attributes) {
if (tagName === 'select') return false;
if ('type' in attributes) return false;
return true;
}
var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function () {
try {
var el = document.createElement('<input name="x">');
return el.tagName.toLowerCase() === 'input' && el.name === 'x';
}
catch (err) {
return false;
}
})();
var oldElement = GLOBAL.Element;
function Element(tagName, attributes) {
attributes = attributes || {};
tagName = tagName.toLowerCase();
if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
tagName = '<' + tagName + ' name="' + attributes.name + '">';
delete attributes.name;
return Element.writeAttribute(document.createElement(tagName), attributes);
}
if (!ELEMENT_CACHE[tagName])
ELEMENT_CACHE[tagName] = Element.extend(document.createElement(tagName));
var node = shouldUseCreationCache(tagName, attributes) ?
ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);
return Element.writeAttribute(node, attributes);
}
GLOBAL.Element = Element;
Object.extend(GLOBAL.Element, oldElement || {});
if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;
Element.Methods = { ByTag: {}, Simulated: {} };
var methods = {};
var INSPECT_ATTRIBUTES = { id: 'id', className: 'class' };
function inspect(element) {
element = $(element);
var result = '<' + element.tagName.toLowerCase();
var attribute, value;
for (var property in INSPECT_ATTRIBUTES) {
attribute = INSPECT_ATTRIBUTES[property];
value = (element[property] || '').toString();
if (value) result += ' ' + attribute + '=' + value.inspect(true);
}
return result + '>';
}
methods.inspect = inspect;
function visible(element) {
return $(element).style.display !== 'none';
}
function toggle(element, bool) {
element = $(element);
if (Object.isUndefined(bool))
bool = !Element.visible(element);
Element[bool ? 'show' : 'hide'](element);
return element;
}
function hide(element) {
element = $(element);
element.style.display = 'none';
return element;
}
function show(element) {
element = $(element);
element.style.display = '';
return element;
}
Object.extend(methods, {
visible: visible,
toggle: toggle,
hide: hide,
show: show
});
function remove(element) {
element = $(element);
element.parentNode.removeChild(element);
return element;
}
var SELECT_ELEMENT_INNERHTML_BUGGY = (function () {
var el = document.createElement("select"),
isBuggy = true;
el.innerHTML = "<option value=\"test\">test</option>";
if (el.options && el.options[0]) {
isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
}
el = null;
return isBuggy;
})();
var TABLE_ELEMENT_INNERHTML_BUGGY = (function () {
try {
var el = document.createElement("table");
if (el && el.tBodies) {
el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
var isBuggy = typeof el.tBodies[0] == "undefined";
el = null;
return isBuggy;
}
} catch (e) {
return true;
}
})();
var LINK_ELEMENT_INNERHTML_BUGGY = (function () {
try {
var el = document.createElement('div');
el.innerHTML = "<link />";
var isBuggy = (el.childNodes.length === 0);
el = null;
return isBuggy;
} catch (e) {
return true;
}
})();
var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;
var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
var s = document.createElement("script"),
isBuggy = false;
try {
s.appendChild(document.createTextNode(""));
isBuggy = !s.firstChild ||
s.firstChild && s.firstChild.nodeType !== 3;
} catch (e) {
isBuggy = true;
}
s = null;
return isBuggy;
})();
function update(element, content) {
element = $(element);
var descendants = element.getElementsByTagName('*'),
i = descendants.length;
while (i--) purgeElement(descendants[i]);
if (content && content.toElement)
content = content.toElement();
if (Object.isElement(content))
return element.update().insert(content);
content = Object.toHTML(content);
var tagName = element.tagName.toUpperCase();
if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
element.text = content;
return element;
}
if (ANY_INNERHTML_BUGGY) {
if (tagName in INSERTION_TRANSLATIONS.tags) {
while (element.firstChild)
element.removeChild(element.firstChild);
var nodes = getContentFromAnonymousElement(tagName, content.stripScripts());
for (var i = 0, node; node = nodes[i]; i++)
element.appendChild(node);
} else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
while (element.firstChild)
element.removeChild(element.firstChild);
var nodes = getContentFromAnonymousElement(tagName,
content.stripScripts(), true);
for (var i = 0, node; node = nodes[i]; i++)
element.appendChild(node);
} else {
element.innerHTML = content.stripScripts();
}
} else {
element.innerHTML = content.stripScripts();
}
content.evalScripts.bind(content).defer();
return element;
}
function replace(element, content) {
element = $(element);
if (content && content.toElement) {
content = content.toElement();
} else if (!Object.isElement(content)) {
content = Object.toHTML(content);
var range = element.ownerDocument.createRange();
range.selectNode(element);
content.evalScripts.bind(content).defer();
content = range.createContextualFragment(content.stripScripts());
}
element.parentNode.replaceChild(content, element);
return element;
}
var INSERTION_TRANSLATIONS = {
before: function (element, node) {
element.parentNode.insertBefore(node, element);
},
top: function (element, node) {
element.insertBefore(node, element.firstChild);
},
bottom: function (element, node) {
element.appendChild(node);
},
after: function (element, node) {
element.parentNode.insertBefore(node, element.nextSibling);
},
tags: {
TABLE: ['<table>', '</table>', 1],
TBODY: ['<table><tbody>', '</tbody></table>', 2],
TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
SELECT: ['<select>', '</select>', 1]
}
};
var tags = INSERTION_TRANSLATIONS.tags;
Object.extend(tags, {
THEAD: tags.TBODY,
TFOOT: tags.TBODY,
TH: tags.TD
});
function replace_IE(element, content) {
element = $(element);
if (content && content.toElement)
content = content.toElement();
if (Object.isElement(content)) {
element.parentNode.replaceChild(content, element);
return element;
}
content = Object.toHTML(content);
var parent = element.parentNode, tagName = parent.tagName.toUpperCase();
if (tagName in INSERTION_TRANSLATIONS.tags) {
var nextSibling = Element.next(element);
var fragments = getContentFromAnonymousElement(
tagName, content.stripScripts());
parent.removeChild(element);
var iterator;
if (nextSibling)
iterator = function (node) { parent.insertBefore(node, nextSibling) };
else
iterator = function (node) { parent.appendChild(node); }
fragments.each(iterator);
} else {
element.outerHTML = content.stripScripts();
}
content.evalScripts.bind(content).defer();
return element;
}
if ('outerHTML' in document.documentElement)
replace = replace_IE;
function isContent(content) {
if (Object.isUndefined(content) || content === null) return false;
if (Object.isString(content) || Object.isNumber(content)) return true;
if (Object.isElement(content)) return true;
if (content.toElement || content.toHTML) return true;
return false;
}
function insertContentAt(element, content, position) {
position = position.toLowerCase();
var method = INSERTION_TRANSLATIONS[position];
if (content && content.toElement) content = content.toElement();
if (Object.isElement(content)) {
method(element, content);
return element;
}
content = Object.toHTML(content);
var tagName = ((position === 'before' || position === 'after') ?
element.parentNode : element).tagName.toUpperCase();
var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());
if (position === 'top' || position === 'after') childNodes.reverse();
for (var i = 0, node; node = childNodes[i]; i++)
method(element, node);
content.evalScripts.bind(content).defer();
}
function insert(element, insertions) {
element = $(element);
if (isContent(insertions))
insertions = { bottom: insertions };
for (var position in insertions)
insertContentAt(element, insertions[position], position);
return element;
}
function wrap(element, wrapper, attributes) {
element = $(element);
if (Object.isElement(wrapper)) {
$(wrapper).writeAttribute(attributes || {});
} else if (Object.isString(wrapper)) {
wrapper = new Element(wrapper, attributes);
} else {
wrapper = new Element('div', wrapper);
}
if (element.parentNode)
element.parentNode.replaceChild(wrapper, element);
wrapper.appendChild(element);
return wrapper;
}
function cleanWhitespace(element) {
element = $(element);
var node = element.firstChild;
while (node) {
var nextNode = node.nextSibling;
if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue))
element.removeChild(node);
node = nextNode;
}
return element;
}
function empty(element) {
return $(element).innerHTML.blank();
}
function getContentFromAnonymousElement(tagName, html, force) {
var t = INSERTION_TRANSLATIONS.tags[tagName], div = DIV;
var workaround = !!t;
if (!workaround && force) {
workaround = true;
t = ['', '', 0];
}
if (workaround) {
div.innerHTML = '&#160;' + t[0] + html + t[1];
div.removeChild(div.firstChild);
for (var i = t[2]; i--;)
div = div.firstChild;
} else {
div.innerHTML = html;
}
return $A(div.childNodes);
}
function clone(element, deep) {
if (!(element = $(element))) return;
var clone = element.cloneNode(deep);
if (!HAS_UNIQUE_ID_PROPERTY) {
clone._prototypeUID = UNDEFINED;
if (deep) {
var descendants = Element.select(clone, '*'),
i = descendants.length;
while (i--)
descendants[i]._prototypeUID = UNDEFINED;
}
}
return Element.extend(clone);
}
function purgeElement(element) {
var uid = getUniqueElementID(element);
if (uid) {
Element.stopObserving(element);
if (!HAS_UNIQUE_ID_PROPERTY)
element._prototypeUID = UNDEFINED;
delete Element.Storage[uid];
}
}
function purgeCollection(elements) {
var i = elements.length;
while (i--)
purgeElement(elements[i]);
}
function purgeCollection_IE(elements) {
var i = elements.length, element, uid;
while (i--) {
element = elements[i];
uid = getUniqueElementID(element);
delete Element.Storage[uid];
delete Event.cache[uid];
}
}
if (HAS_UNIQUE_ID_PROPERTY) {
purgeCollection = purgeCollection_IE;
}
function purge(element) {
if (!(element = $(element))) return;
purgeElement(element);
var descendants = element.getElementsByTagName('*'),
i = descendants.length;
while (i--) purgeElement(descendants[i]);
return null;
}
Object.extend(methods, {
remove: remove,
update: update,
replace: replace,
insert: insert,
wrap: wrap,
cleanWhitespace: cleanWhitespace,
empty: empty,
clone: clone,
purge: purge
});
function recursivelyCollect(element, property, maximumLength) {
element = $(element);
maximumLength = maximumLength || -1;
var elements = [];
while (element = element[property]) {
if (element.nodeType === Node.ELEMENT_NODE)
elements.push(Element.extend(element));
if (elements.length === maximumLength) break;
}
return elements;
}
function ancestors(element) {
return recursivelyCollect(element, 'parentNode');
}
function descendants(element) {
return Element.select(element, '*');
}
function firstDescendant(element) {
element = $(element).firstChild;
while (element && element.nodeType !== Node.ELEMENT_NODE)
element = element.nextSibling;
return $(element);
}
function immediateDescendants(element) {
var results = [], child = $(element).firstChild;
while (child) {
if (child.nodeType === Node.ELEMENT_NODE)
results.push(Element.extend(child));
child = child.nextSibling;
}
return results;
}
function previousSiblings(element) {
return recursivelyCollect(element, 'previousSibling');
}
function nextSiblings(element) {
return recursivelyCollect(element, 'nextSibling');
}
function siblings(element) {
element = $(element);
var previous = previousSiblings(element),
next = nextSiblings(element);
return previous.reverse().concat(next);
}
function match(element, selector) {
element = $(element);
if (Object.isString(selector))
return Prototype.Selector.match(element, selector);
return selector.match(element);
}
function _recursivelyFind(element, property, expression, index) {
element = $(element), expression = expression || 0, index = index || 0;
if (Object.isNumber(expression)) {
index = expression, expression = null;
}
while (element = element[property]) {
if (element.nodeType !== 1) continue;
if (expression && !Prototype.Selector.match(element, expression))
continue;
if (--index >= 0) continue;
return Element.extend(element);
}
}
function up(element, expression, index) {
element = $(element);
if (arguments.length === 1) return $(element.parentNode);
return _recursivelyFind(element, 'parentNode', expression, index);
}
function down(element, expression, index) {
if (arguments.length === 1) return firstDescendant(element);
element = $(element), expression = expression || 0, index = index || 0;
if (Object.isNumber(expression))
index = expression, expression = '*';
var node = Prototype.Selector.select(expression, element)[index];
return Element.extend(node);
}
function previous(element, expression, index) {
return _recursivelyFind(element, 'previousSibling', expression, index);
}
function next(element, expression, index) {
return _recursivelyFind(element, 'nextSibling', expression, index);
}
function select(element) {
element = $(element);
var expressions = SLICE.call(arguments, 1).join(', ');
return Prototype.Selector.select(expressions, element);
}
function adjacent(element) {
element = $(element);
var expressions = SLICE.call(arguments, 1).join(', ');
var siblings = Element.siblings(element), results = [];
for (var i = 0, sibling; sibling = siblings[i]; i++) {
if (Prototype.Selector.match(sibling, expressions))
results.push(sibling);
}
return results;
}
function descendantOf_DOM(element, ancestor) {
element = $(element), ancestor = $(ancestor);
while (element = element.parentNode)
if (element === ancestor) return true;
return false;
}
function descendantOf_contains(element, ancestor) {
element = $(element), ancestor = $(ancestor);
if (!ancestor.contains) return descendantOf_DOM(element, ancestor);
return ancestor.contains(element) && ancestor !== element;
}
function descendantOf_compareDocumentPosition(element, ancestor) {
element = $(element), ancestor = $(ancestor);
return (element.compareDocumentPosition(ancestor) & 8) === 8;
}
var descendantOf;
if (DIV.compareDocumentPosition) {
descendantOf = descendantOf_compareDocumentPosition;
} else if (DIV.contains) {
descendantOf = descendantOf_contains;
} else {
descendantOf = descendantOf_DOM;
}
Object.extend(methods, {
recursivelyCollect: recursivelyCollect,
ancestors: ancestors,
descendants: descendants,
firstDescendant: firstDescendant,
immediateDescendants: immediateDescendants,
previousSiblings: previousSiblings,
nextSiblings: nextSiblings,
siblings: siblings,
match: match,
up: up,
down: down,
previous: previous,
next: next,
select: select,
adjacent: adjacent,
descendantOf: descendantOf,
getElementsBySelector: select,
childElements: immediateDescendants
});
var idCounter = 1;
function identify(element) {
element = $(element);
var id = Element.readAttribute(element, 'id');
if (id) return id;
do { id = 'anonymous_element_' + idCounter++ } while ($(id));
Element.writeAttribute(element, 'id', id);
return id;
}
function readAttribute(element, name) {
return $(element).getAttribute(name);
}
function readAttribute_IE(element, name) {
element = $(element);
var table = ATTRIBUTE_TRANSLATIONS.read;
if (table.values[name])
return table.values[name](element, name);
if (table.names[name]) name = table.names[name];
if (name.include(':')) {
if (!element.attributes || !element.attributes[name]) return null;
return element.attributes[name].value;
}
return element.getAttribute(name);
}
function readAttribute_Opera(element, name) {
if (name === 'title') return element.title;
return element.getAttribute(name);
}
var PROBLEMATIC_ATTRIBUTE_READING = (function () {
DIV.setAttribute('onclick', []);
var value = DIV.getAttribute('onclick');
var isFunction = Object.isArray(value);
DIV.removeAttribute('onclick');
return isFunction;
})();
if (PROBLEMATIC_ATTRIBUTE_READING) {
readAttribute = readAttribute_IE;
} else if (Prototype.Browser.Opera) {
readAttribute = readAttribute_Opera;
}
function writeAttribute(element, name, value) {
element = $(element);
var attributes = {}, table = ATTRIBUTE_TRANSLATIONS.write;
if (typeof name === 'object') {
attributes = name;
} else {
attributes[name] = Object.isUndefined(value) ? true : value;
}
for (var attr in attributes) {
name = table.names[attr] || attr;
value = attributes[attr];
if (table.values[attr])
name = table.values[attr](element, value) || name;
if (value === false || value === null)
element.removeAttribute(name);
else if (value === true)
element.setAttribute(name, name);
else element.setAttribute(name, value);
}
return element;
}
var PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES = (function () {
if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) {
return false;
}
var checkbox = document.createElement('<input type="checkbox">');
checkbox.checked = true;
var node = checkbox.getAttributeNode('checked');
return !node || !node.specified;
})();
function hasAttribute(element, attribute) {
attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
var node = $(element).getAttributeNode(attribute);
return !!(node && node.specified);
}
function hasAttribute_IE(element, attribute) {
if (attribute === 'checked') {
return element.checked;
}
return hasAttribute(element, attribute);
}
GLOBAL.Element.Methods.Simulated.hasAttribute =
PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES ?
hasAttribute_IE : hasAttribute;
function classNames(element) {
return new Element.ClassNames(element);
}
var regExpCache = {};
function getRegExpForClassName(className) {
if (regExpCache[className]) return regExpCache[className];
var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
regExpCache[className] = re;
return re;
}
function hasClassName(element, className) {
if (!(element = $(element))) return;
var elementClassName = element.className;
if (elementClassName.length === 0) return false;
if (elementClassName === className) return true;
return getRegExpForClassName(className).test(elementClassName);
}
function addClassName(element, className) {
if (!(element = $(element))) return;
if (!hasClassName(element, className))
element.className += (element.className ? ' ' : '') + className;
return element;
}
function removeClassName(element, className) {
if (!(element = $(element))) return;
element.className = element.className.replace(
getRegExpForClassName(className), ' ').strip();
return element;
}
function toggleClassName(element, className, bool) {
if (!(element = $(element))) return;
if (Object.isUndefined(bool))
bool = !hasClassName(element, className);
var method = Element[bool ? 'addClassName' : 'removeClassName'];
return method(element, className);
}
var ATTRIBUTE_TRANSLATIONS = {};
var classProp = 'className', forProp = 'for';
DIV.setAttribute(classProp, 'x');
if (DIV.className !== 'x') {
DIV.setAttribute('class', 'x');
if (DIV.className === 'x')
classProp = 'class';
}
var LABEL = document.createElement('label');
LABEL.setAttribute(forProp, 'x');
if (LABEL.htmlFor !== 'x') {
LABEL.setAttribute('htmlFor', 'x');
if (LABEL.htmlFor === 'x')
forProp = 'htmlFor';
}
LABEL = null;
function _getAttr(element, attribute) {
return element.getAttribute(attribute);
}
function _getAttr2(element, attribute) {
return element.getAttribute(attribute, 2);
}
function _getAttrNode(element, attribute) {
var node = element.getAttributeNode(attribute);
return node ? node.value : '';
}
function _getFlag(element, attribute) {
return $(element).hasAttribute(attribute) ? attribute : null;
}
DIV.onclick = Prototype.emptyFunction;
var onclickValue = DIV.getAttribute('onclick');
var _getEv;
if (String(onclickValue).indexOf('{') > -1) {
_getEv = function (element, attribute) {
var value = element.getAttribute(attribute);
if (!value) return null;
value = value.toString();
value = value.split('{')[1];
value = value.split('}')[0];
return value.strip();
};
}
else if (onclickValue === '') {
_getEv = function (element, attribute) {
var value = element.getAttribute(attribute);
if (!value) return null;
return value.strip();
};
}
ATTRIBUTE_TRANSLATIONS.read = {
names: {
'class': classProp,
'className': classProp,
'for': forProp,
'htmlFor': forProp
},
values: {
style: function (element) {
return element.style.cssText.toLowerCase();
},
title: function (element) {
return element.title;
}
}
};
ATTRIBUTE_TRANSLATIONS.write = {
names: {
className: 'class',
htmlFor: 'for',
cellpadding: 'cellPadding',
cellspacing: 'cellSpacing'
},
values: {
checked: function (element, value) {
element.checked = !!value;
},
style: function (element, value) {
element.style.cssText = value ? value : '';
}
}
};
ATTRIBUTE_TRANSLATIONS.has = { names: {} };
Object.extend(ATTRIBUTE_TRANSLATIONS.write.names,
ATTRIBUTE_TRANSLATIONS.read.names);
var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' +
'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');
for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()] = attr;
}
Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
href: _getAttr2,
src: _getAttr2,
type: _getAttr,
action: _getAttrNode,
disabled: _getFlag,
checked: _getFlag,
readonly: _getFlag,
multiple: _getFlag,
onload: _getEv,
onunload: _getEv,
onclick: _getEv,
ondblclick: _getEv,
onmousedown: _getEv,
onmouseup: _getEv,
onmouseover: _getEv,
onmousemove: _getEv,
onmouseout: _getEv,
onfocus: _getEv,
onblur: _getEv,
onkeypress: _getEv,
onkeydown: _getEv,
onkeyup: _getEv,
onsubmit: _getEv,
onreset: _getEv,
onselect: _getEv,
onchange: _getEv
});
Object.extend(methods, {
identify: identify,
readAttribute: readAttribute,
writeAttribute: writeAttribute,
classNames: classNames,
hasClassName: hasClassName,
addClassName: addClassName,
removeClassName: removeClassName,
toggleClassName: toggleClassName
});
function normalizeStyleName(style) {
if (style === 'float' || style === 'styleFloat')
return 'cssFloat';
return style.camelize();
}
function normalizeStyleName_IE(style) {
if (style === 'float' || style === 'cssFloat')
return 'styleFloat';
return style.camelize();
}
function setStyle(element, styles) {
element = $(element);
var elementStyle = element.style, match;
if (Object.isString(styles)) {
elementStyle.cssText += ';' + styles;
if (styles.include('opacity')) {
var opacity = styles.match(/opacity:\s*(\d?\.?\d*)/)[1];
Element.setOpacity(element, opacity);
}
return element;
}
for (var property in styles) {
if (property === 'opacity') {
Element.setOpacity(element, styles[property]);
} else {
var value = styles[property];
if (property === 'float' || property === 'cssFloat') {
property = Object.isUndefined(elementStyle.styleFloat) ?
'cssFloat' : 'styleFloat';
}
elementStyle[property] = value;
}
}
return element;
}
function getStyle(element, style) {
element = $(element);
style = normalizeStyleName(style);
var value = element.style[style];
if (!value || value === 'auto') {
var css = document.defaultView.getComputedStyle(element, null);
value = css ? css[style] : null;
}
if (style === 'opacity') return value ? parseFloat(value) : 1.0;
return value === 'auto' ? null : value;
}
function getStyle_Opera(element, style) {
switch (style) {
case 'height': case 'width':
if (!Element.visible(element)) return null;
var dim = parseInt(getStyle(element, style), 10);
if (dim !== element['offset' + style.capitalize()])
return dim + 'px';
return Element.measure(element, style);
default: return getStyle(element, style);
}
}
function getStyle_IE(element, style) {
element = $(element);
style = normalizeStyleName_IE(style);
var value = element.style[style];
if (!value && element.currentStyle) {
value = element.currentStyle[style];
}
if (style === 'opacity' && !STANDARD_CSS_OPACITY_SUPPORTED)
return getOpacity_IE(element);
if (value === 'auto') {
if ((style === 'width' || style === 'height') && Element.visible(element))
return Element.measure(element, style) + 'px';
return null;
}
return value;
}
function stripAlphaFromFilter_IE(filter) {
return (filter || '').replace(/alpha\([^\)]*\)/gi, '');
}
function hasLayout_IE(element) {
if (!element.currentStyle || !element.currentStyle.hasLayout)
element.style.zoom = 1;
return element;
}
var STANDARD_CSS_OPACITY_SUPPORTED = (function () {
DIV.style.cssText = "opacity:.55";
return /^0.55/.test(DIV.style.opacity);
})();
function setOpacity(element, value) {
element = $(element);
if (value == 1 || value === '') value = '';
else if (value < 0.00001) value = 0;
element.style.opacity = value;
return element;
}
function setOpacity_IE(element, value) {
if (STANDARD_CSS_OPACITY_SUPPORTED)
return setOpacity(element, value);
element = hasLayout_IE($(element));
var filter = Element.getStyle(element, 'filter'),
style = element.style;
if (value == 1 || value === '') {
filter = stripAlphaFromFilter_IE(filter);
if (filter) style.filter = filter;
else style.removeAttribute('filter');
return element;
}
if (value < 0.00001) value = 0;
style.filter = stripAlphaFromFilter_IE(filter) +
'alpha(opacity=' + (value * 100) + ')';
return element;
}
function getOpacity(element) {
return Element.getStyle(element, 'opacity');
}
function getOpacity_IE(element) {
if (STANDARD_CSS_OPACITY_SUPPORTED)
return getOpacity(element);
var filter = Element.getStyle(element, 'filter');
if (filter.length === 0) return 1.0;
var match = (filter || '').match(/alpha\(opacity=(.*)\)/);
if (match && match[1]) return parseFloat(match[1]) / 100;
return 1.0;
}
Object.extend(methods, {
setStyle: setStyle,
getStyle: getStyle,
setOpacity: setOpacity,
getOpacity: getOpacity
});
if ('styleFloat' in DIV.style) {
methods.getStyle = getStyle_IE;
methods.setOpacity = setOpacity_IE;
methods.getOpacity = getOpacity_IE;
}
var UID = 0;
GLOBAL.Element.Storage = { UID: 1 };
function getUniqueElementID(element) {
if (element === window) return 0;
if (typeof element._prototypeUID === 'undefined')
element._prototypeUID = Element.Storage.UID++;
return element._prototypeUID;
}
function getUniqueElementID_IE(element) {
if (element === window) return 0;
if (element == document) return 1;
return element.uniqueID;
}
var HAS_UNIQUE_ID_PROPERTY = ('uniqueID' in DIV);
if (HAS_UNIQUE_ID_PROPERTY)
getUniqueElementID = getUniqueElementID_IE;
function getStorage(element) {
if (!(element = $(element))) return;
var uid = getUniqueElementID(element);
if (!Element.Storage[uid])
Element.Storage[uid] = $H();
return Element.Storage[uid];
}
function store(element, key, value) {
if (!(element = $(element))) return;
var storage = getStorage(element);
if (arguments.length === 2) {
storage.update(key);
} else {
storage.set(key, value);
}
return element;
}
function retrieve(element, key, defaultValue) {
if (!(element = $(element))) return;
var storage = getStorage(element), value = storage.get(key);
if (Object.isUndefined(value)) {
storage.set(key, defaultValue);
value = defaultValue;
}
return value;
}
Object.extend(methods, {
getStorage: getStorage,
store: store,
retrieve: retrieve
});
var Methods = {}, ByTag = Element.Methods.ByTag,
F = Prototype.BrowserFeatures;
if (!F.ElementExtensions && ('__proto__' in DIV)) {
GLOBAL.HTMLElement = {};
GLOBAL.HTMLElement.prototype = DIV['__proto__'];
F.ElementExtensions = true;
}
function checkElementPrototypeDeficiency(tagName) {
if (typeof window.Element === 'undefined') return false;
if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) return false;
var proto = window.Element.prototype;
if (proto) {
var id = '_' + (Math.random() + '').slice(2),
el = document.createElement(tagName);
proto[id] = 'x';
var isBuggy = (el[id] !== 'x');
delete proto[id];
el = null;
return isBuggy;
}
return false;
}
var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY =
checkElementPrototypeDeficiency('object');
function extendElementWith(element, methods) {
for (var property in methods) {
var value = methods[property];
if (Object.isFunction(value) && !(property in element))
element[property] = value.methodize();
}
}
var EXTENDED = {};
function elementIsExtended(element) {
var uid = getUniqueElementID(element);
return (uid in EXTENDED);
}
function extend(element) {
if (!element || elementIsExtended(element)) return element;
if (element.nodeType !== Node.ELEMENT_NODE || element == window)
return element;
var methods = Object.clone(Methods),
tagName = element.tagName.toUpperCase();
if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);
extendElementWith(element, methods);
EXTENDED[getUniqueElementID(element)] = true;
return element;
}
function extend_IE8(element) {
if (!element || elementIsExtended(element)) return element;
var t = element.tagName;
if (t && (/^(?:object|applet|embed)$/i.test(t))) {
extendElementWith(element, Element.Methods);
extendElementWith(element, Element.Methods.Simulated);
extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
}
return element;
}
if (F.SpecificElementExtensions) {
extend = HTMLOBJECTELEMENT_PROTOTYPE_BUGGY ? extend_IE8 : Prototype.K;
}
function addMethodsToTagName(tagName, methods) {
tagName = tagName.toUpperCase();
if (!ByTag[tagName]) ByTag[tagName] = {};
Object.extend(ByTag[tagName], methods);
}
function mergeMethods(destination, methods, onlyIfAbsent) {
if (Object.isUndefined(onlyIfAbsent)) onlyIfAbsent = false;
for (var property in methods) {
var value = methods[property];
if (!Object.isFunction(value)) continue;
if (!onlyIfAbsent || !(property in destination))
destination[property] = value.methodize();
}
}
function findDOMClass(tagName) {
var klass;
var trans = {
"OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
"FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
"DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
"H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
"INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
"TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
"TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
"TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
"FrameSet", "IFRAME": "IFrame"
};
if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
if (window[klass]) return window[klass];
klass = 'HTML' + tagName + 'Element';
if (window[klass]) return window[klass];
klass = 'HTML' + tagName.capitalize() + 'Element';
if (window[klass]) return window[klass];
var element = document.createElement(tagName),
proto = element['__proto__'] || element.constructor.prototype;
element = null;
return proto;
}
function addMethods(methods) {
if (arguments.length === 0) addFormMethods();
if (arguments.length === 2) {
var tagName = methods;
methods = arguments[1];
}
if (!tagName) {
Object.extend(Element.Methods, methods || {});
} else {
if (Object.isArray(tagName)) {
for (var i = 0, tag; tag = tagName[i]; i++)
addMethodsToTagName(tag, methods);
} else {
addMethodsToTagName(tagName, methods);
}
}
var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype :
Element.prototype;
if (F.ElementExtensions) {
mergeMethods(ELEMENT_PROTOTYPE, Element.Methods);
mergeMethods(ELEMENT_PROTOTYPE, Element.Methods.Simulated, true);
}
if (F.SpecificElementExtensions) {
for (var tag in Element.Methods.ByTag) {
var klass = findDOMClass(tag);
if (Object.isUndefined(klass)) continue;
mergeMethods(klass.prototype, ByTag[tag]);
}
}
Object.extend(Element, Element.Methods);
Object.extend(Element, Element.Methods.Simulated);
delete Element.ByTag;
delete Element.Simulated;
Element.extend.refresh();
ELEMENT_CACHE = {};
}
Object.extend(GLOBAL.Element, {
extend: extend,
addMethods: addMethods
});
if (extend === Prototype.K) {
GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
} else {
GLOBAL.Element.extend.refresh = function () {
if (Prototype.BrowserFeatures.ElementExtensions) return;
Object.extend(Methods, Element.Methods);
Object.extend(Methods, Element.Methods.Simulated);
EXTENDED = {};
};
}
function addFormMethods() {
Object.extend(Form, Form.Methods);
Object.extend(Form.Element, Form.Element.Methods);
Object.extend(Element.Methods.ByTag, {
"FORM": Object.clone(Form.Methods),
"INPUT": Object.clone(Form.Element.Methods),
"SELECT": Object.clone(Form.Element.Methods),
"TEXTAREA": Object.clone(Form.Element.Methods),
"BUTTON": Object.clone(Form.Element.Methods)
});
}
Element.addMethods(methods);
function destroyCache_IE() {
DIV = null;
ELEMENT_CACHE = null;
}
if (window.attachEvent)
window.attachEvent('onunload', destroyCache_IE);
})(this);
(function () {
function toDecimal(pctString) {
var match = pctString.match(/^(\d+)%?$/i);
if (!match) return null;
return (Number(match[1]) / 100);
}
function getRawStyle(element, style) {
element = $(element);
var value = element.style[style];
if (!value || value === 'auto') {
var css = document.defaultView.getComputedStyle(element, null);
value = css ? css[style] : null;
}
if (style === 'opacity') return value ? parseFloat(value) : 1.0;
return value === 'auto' ? null : value;
}
function getRawStyle_IE(element, style) {
var value = element.style[style];
if (!value && element.currentStyle) {
value = element.currentStyle[style];
}
return value;
}
function getContentWidth(element, context) {
var boxWidth = element.offsetWidth;
var bl = getPixelValue(element, 'borderLeftWidth', context) || 0;
var br = getPixelValue(element, 'borderRightWidth', context) || 0;
var pl = getPixelValue(element, 'paddingLeft', context) || 0;
var pr = getPixelValue(element, 'paddingRight', context) || 0;
return boxWidth - bl - br - pl - pr;
}
if ('currentStyle' in document.documentElement) {
getRawStyle = getRawStyle_IE;
}
function getPixelValue(value, property, context) {
var element = null;
if (Object.isElement(value)) {
element = value;
value = getRawStyle(element, property);
}
if (value === null || Object.isUndefined(value)) {
return null;
}
if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
return window.parseFloat(value);
}
var isPercentage = value.include('%'), isViewport = (context === document.viewport);
if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
var style = element.style.left, rStyle = element.runtimeStyle.left;
element.runtimeStyle.left = element.currentStyle.left;
element.style.left = value || 0;
value = element.style.pixelLeft;
element.style.left = style;
element.runtimeStyle.left = rStyle;
return value;
}
if (element && isPercentage) {
context = context || element.parentNode;
var decimal = toDecimal(value), whole = null;
var isHorizontal = property.include('left') || property.include('right') ||
property.include('width');
var isVertical = property.include('top') || property.include('bottom') ||
property.include('height');
if (context === document.viewport) {
if (isHorizontal) {
whole = document.viewport.getWidth();
} else if (isVertical) {
whole = document.viewport.getHeight();
}
} else {
if (isHorizontal) {
whole = $(context).measure('width');
} else if (isVertical) {
whole = $(context).measure('height');
}
}
return (whole === null) ? 0 : whole * decimal;
}
return 0;
}
function toCSSPixels(number) {
if (Object.isString(number) && number.endsWith('px'))
return number;
return number + 'px';
}
function isDisplayed(element) {
while (element && element.parentNode) {
var display = element.getStyle('display');
if (display === 'none') {
return false;
}
element = $(element.parentNode);
}
return true;
}
var hasLayout = Prototype.K;
if ('currentStyle' in document.documentElement) {
hasLayout = function (element) {
if (!element.currentStyle.hasLayout) {
element.style.zoom = 1;
}
return element;
};
}
function cssNameFor(key) {
if (key.include('border')) key = key + '-width';
return key.camelize();
}
Element.Layout = Class.create(Hash, {
initialize: function ($super, element, preCompute) {
$super();
this.element = $(element);
Element.Layout.PROPERTIES.each(function (property) {
this._set(property, null);
}, this);
if (preCompute) {
this._preComputing = true;
this._begin();
Element.Layout.PROPERTIES.each(this._compute, this);
this._end();
this._preComputing = false;
}
},
_set: function (property, value) {
return Hash.prototype.set.call(this, property, value);
},
set: function (property, value) {
throw "Properties of Element.Layout are read-only.";
},
get: function ($super, property) {
var value = $super(property);
return value === null ? this._compute(property) : value;
},
_begin: function () {
if (this._isPrepared()) return;
var element = this.element;
if (isDisplayed(element)) {
this._setPrepared(true);
return;
}
var originalStyles = {
position: element.style.position || '',
width: element.style.width || '',
visibility: element.style.visibility || '',
display: element.style.display || ''
};
element.store('prototype_original_styles', originalStyles);
var position = getRawStyle(element, 'position'), width = element.offsetWidth;
if (width === 0 || width === null) {
element.style.display = 'block';
width = element.offsetWidth;
}
var context = (position === 'fixed') ? document.viewport :
element.parentNode;
var tempStyles = {
visibility: 'hidden',
display: 'block'
};
if (position !== 'fixed') tempStyles.position = 'absolute';
element.setStyle(tempStyles);
var positionedWidth = element.offsetWidth, newWidth;
if (width && (positionedWidth === width)) {
newWidth = getContentWidth(element, context);
} else if (position === 'absolute' || position === 'fixed') {
newWidth = getContentWidth(element, context);
} else {
var parent = element.parentNode, pLayout = $(parent).getLayout();
newWidth = pLayout.get('width') -
this.get('margin-left') -
this.get('border-left') -
this.get('padding-left') -
this.get('padding-right') -
this.get('border-right') -
this.get('margin-right');
}
element.setStyle({ width: newWidth + 'px' });
this._setPrepared(true);
},
_end: function () {
var element = this.element;
var originalStyles = element.retrieve('prototype_original_styles');
element.store('prototype_original_styles', null);
element.setStyle(originalStyles);
this._setPrepared(false);
},
_compute: function (property) {
var COMPUTATIONS = Element.Layout.COMPUTATIONS;
if (!(property in COMPUTATIONS)) {
throw "Property not found.";
}
return this._set(property, COMPUTATIONS[property].call(this, this.element));
},
_isPrepared: function () {
return this.element.retrieve('prototype_element_layout_prepared', false);
},
_setPrepared: function (bool) {
return this.element.store('prototype_element_layout_prepared', bool);
},
toObject: function () {
var args = $A(arguments);
var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
args.join(' ').split(' ');
var obj = {};
keys.each(function (key) {
if (!Element.Layout.PROPERTIES.include(key)) return;
var value = this.get(key);
if (value != null) obj[key] = value;
}, this);
return obj;
},
toHash: function () {
var obj = this.toObject.apply(this, arguments);
return new Hash(obj);
},
toCSS: function () {
var args = $A(arguments);
var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
args.join(' ').split(' ');
var css = {};
keys.each(function (key) {
if (!Element.Layout.PROPERTIES.include(key)) return;
if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;
var value = this.get(key);
if (value != null) css[cssNameFor(key)] = value + 'px';
}, this);
return css;
},
inspect: function () {
return "#<Element.Layout>";
}
});
Object.extend(Element.Layout, {
PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),
COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),
COMPUTATIONS: {
'height': function (element) {
if (!this._preComputing) this._begin();
var bHeight = this.get('border-box-height');
if (bHeight <= 0) {
if (!this._preComputing) this._end();
return 0;
}
var bTop = this.get('border-top'),
bBottom = this.get('border-bottom');
var pTop = this.get('padding-top'),
pBottom = this.get('padding-bottom');
if (!this._preComputing) this._end();
return bHeight - bTop - bBottom - pTop - pBottom;
},
'width': function (element) {
if (!this._preComputing) this._begin();
var bWidth = this.get('border-box-width');
if (bWidth <= 0) {
if (!this._preComputing) this._end();
return 0;
}
var bLeft = this.get('border-left'),
bRight = this.get('border-right');
var pLeft = this.get('padding-left'),
pRight = this.get('padding-right');
if (!this._preComputing) this._end();
return bWidth - bLeft - bRight - pLeft - pRight;
},
'padding-box-height': function (element) {
var height = this.get('height'),
pTop = this.get('padding-top'),
pBottom = this.get('padding-bottom');
return height + pTop + pBottom;
},
'padding-box-width': function (element) {
var width = this.get('width'),
pLeft = this.get('padding-left'),
pRight = this.get('padding-right');
return width + pLeft + pRight;
},
'border-box-height': function (element) {
if (!this._preComputing) this._begin();
var height = element.offsetHeight;
if (!this._preComputing) this._end();
return height;
},
'border-box-width': function (element) {
if (!this._preComputing) this._begin();
var width = element.offsetWidth;
if (!this._preComputing) this._end();
return width;
},
'margin-box-height': function (element) {
var bHeight = this.get('border-box-height'),
mTop = this.get('margin-top'),
mBottom = this.get('margin-bottom');
if (bHeight <= 0) return 0;
return bHeight + mTop + mBottom;
},
'margin-box-width': function (element) {
var bWidth = this.get('border-box-width'),
mLeft = this.get('margin-left'),
mRight = this.get('margin-right');
if (bWidth <= 0) return 0;
return bWidth + mLeft + mRight;
},
'top': function (element) {
var offset = element.positionedOffset();
return offset.top;
},
'bottom': function (element) {
var offset = element.positionedOffset(),
parent = element.getOffsetParent(),
pHeight = parent.measure('height');
var mHeight = this.get('border-box-height');
return pHeight - mHeight - offset.top;
},
'left': function (element) {
var offset = element.positionedOffset();
return offset.left;
},
'right': function (element) {
var offset = element.positionedOffset(),
parent = element.getOffsetParent(),
pWidth = parent.measure('width');
var mWidth = this.get('border-box-width');
return pWidth - mWidth - offset.left;
},
'padding-top': function (element) {
return getPixelValue(element, 'paddingTop');
},
'padding-bottom': function (element) {
return getPixelValue(element, 'paddingBottom');
},
'padding-left': function (element) {
return getPixelValue(element, 'paddingLeft');
},
'padding-right': function (element) {
return getPixelValue(element, 'paddingRight');
},
'border-top': function (element) {
return getPixelValue(element, 'borderTopWidth');
},
'border-bottom': function (element) {
return getPixelValue(element, 'borderBottomWidth');
},
'border-left': function (element) {
return getPixelValue(element, 'borderLeftWidth');
},
'border-right': function (element) {
return getPixelValue(element, 'borderRightWidth');
},
'margin-top': function (element) {
return getPixelValue(element, 'marginTop');
},
'margin-bottom': function (element) {
return getPixelValue(element, 'marginBottom');
},
'margin-left': function (element) {
return getPixelValue(element, 'marginLeft');
},
'margin-right': function (element) {
return getPixelValue(element, 'marginRight');
}
}
});
if ('getBoundingClientRect' in document.documentElement) {
Object.extend(Element.Layout.COMPUTATIONS, {
'right': function (element) {
var parent = hasLayout(element.getOffsetParent());
var rect = element.getBoundingClientRect(),
pRect = parent.getBoundingClientRect();
return (pRect.right - rect.right).round();
},
'bottom': function (element) {
var parent = hasLayout(element.getOffsetParent());
var rect = element.getBoundingClientRect(),
pRect = parent.getBoundingClientRect();
return (pRect.bottom - rect.bottom).round();
}
});
}
Element.Offset = Class.create({
initialize: function (left, top) {
this.left = left.round();
this.top = top.round();
this[0] = this.left;
this[1] = this.top;
},
relativeTo: function (offset) {
return new Element.Offset(
this.left - offset.left,
this.top - offset.top
);
},
inspect: function () {
return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
},
toString: function () {
return "[#{left}, #{top}]".interpolate(this);
},
toArray: function () {
return [this.left, this.top];
}
});
function getLayout(element, preCompute) {
return new Element.Layout(element, preCompute);
}
function measure(element, property) {
return $(element).getLayout().get(property);
}
function getHeight(element) {
return Element.getDimensions(element).height;
}
function getWidth(element) {
return Element.getDimensions(element).width;
}
function getDimensions(element) {
element = $(element);
var display = Element.getStyle(element, 'display');
if (display && display !== 'none') {
return { width: element.offsetWidth, height: element.offsetHeight };
}
var style = element.style;
var originalStyles = {
visibility: style.visibility,
position: style.position,
display: style.display
};
var newStyles = {
visibility: 'hidden',
display: 'block'
};
if (originalStyles.position !== 'fixed')
newStyles.position = 'absolute';
Element.setStyle(element, newStyles);
var dimensions = {
width: element.offsetWidth,
height: element.offsetHeight
};
Element.setStyle(element, originalStyles);
return dimensions;
}
function getOffsetParent(element) {
element = $(element);
if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
return $(document.body);
var isInline = (Element.getStyle(element, 'display') === 'inline');
if (!isInline && element.offsetParent) return $(element.offsetParent);
while ((element = element.parentNode) && element !== document.body) {
if (Element.getStyle(element, 'position') !== 'static') {
return isHtml(element) ? $(document.body) : $(element);
}
}
return $(document.body);
}
function cumulativeOffset(element) {
element = $(element);
var valueT = 0, valueL = 0;
if (element.parentNode) {
do {
valueT += element.offsetTop || 0;
valueL += element.offsetLeft || 0;
element = element.offsetParent;
} while (element);
}
return new Element.Offset(valueL, valueT);
}
function positionedOffset(element) {
element = $(element);
var layout = element.getLayout();
var valueT = 0, valueL = 0;
do {
valueT += element.offsetTop || 0;
valueL += element.offsetLeft || 0;
element = element.offsetParent;
if (element) {
if (isBody(element)) break;
var p = Element.getStyle(element, 'position');
if (p !== 'static') break;
}
} while (element);
valueL -= layout.get('margin-top');
valueT -= layout.get('margin-left');
return new Element.Offset(valueL, valueT);
}
function cumulativeScrollOffset(element) {
var valueT = 0, valueL = 0;
do {
if (element === document.body) {
var bodyScrollNode = document.documentElement || document.body.parentNode || document.body;
valueT += !Object.isUndefined(window.pageYOffset) ? window.pageYOffset : bodyScrollNode.scrollTop || 0;
valueL += !Object.isUndefined(window.pageXOffset) ? window.pageXOffset : bodyScrollNode.scrollLeft || 0;
break;
} else {
valueT += element.scrollTop || 0;
valueL += element.scrollLeft || 0;
element = element.parentNode;
}
} while (element);
return new Element.Offset(valueL, valueT);
}
function viewportOffset(forElement) {
var valueT = 0, valueL = 0, docBody = document.body;
forElement = $(forElement);
var element = forElement;
do {
valueT += element.offsetTop || 0;
valueL += element.offsetLeft || 0;
if (element.offsetParent == docBody &&
Element.getStyle(element, 'position') == 'absolute') break;
} while (element = element.offsetParent);
element = forElement;
do {
if (element != docBody) {
valueT -= element.scrollTop || 0;
valueL -= element.scrollLeft || 0;
}
} while (element = element.parentNode);
return new Element.Offset(valueL, valueT);
}
function absolutize(element) {
element = $(element);
if (Element.getStyle(element, 'position') === 'absolute') {
return element;
}
var offsetParent = getOffsetParent(element);
var eOffset = element.viewportOffset(),
pOffset = offsetParent.viewportOffset();
var offset = eOffset.relativeTo(pOffset);
var layout = element.getLayout();
element.store('prototype_absolutize_original_styles', {
position: element.getStyle('position'),
left: element.getStyle('left'),
top: element.getStyle('top'),
width: element.getStyle('width'),
height: element.getStyle('height')
});
element.setStyle({
position: 'absolute',
top: offset.top + 'px',
left: offset.left + 'px',
width: layout.get('width') + 'px',
height: layout.get('height') + 'px'
});
return element;
}
function relativize(element) {
element = $(element);
if (Element.getStyle(element, 'position') === 'relative') {
return element;
}
var originalStyles =
element.retrieve('prototype_absolutize_original_styles');
if (originalStyles) element.setStyle(originalStyles);
return element;
}
function scrollTo(element) {
element = $(element);
var pos = Element.cumulativeOffset(element);
window.scrollTo(pos.left, pos.top);
return element;
}
function makePositioned(element) {
element = $(element);
var position = Element.getStyle(element, 'position'), styles = {};
if (position === 'static' || !position) {
styles.position = 'relative';
if (Prototype.Browser.Opera) {
styles.top = 0;
styles.left = 0;
}
Element.setStyle(element, styles);
Element.store(element, 'prototype_made_positioned', true);
}
return element;
}
function undoPositioned(element) {
element = $(element);
var storage = Element.getStorage(element),
madePositioned = storage.get('prototype_made_positioned');
if (madePositioned) {
storage.unset('prototype_made_positioned');
Element.setStyle(element, {
position: '',
top: '',
bottom: '',
left: '',
right: ''
});
}
return element;
}
function makeClipping(element) {
element = $(element);
var storage = Element.getStorage(element),
madeClipping = storage.get('prototype_made_clipping');
if (Object.isUndefined(madeClipping)) {
var overflow = Element.getStyle(element, 'overflow');
storage.set('prototype_made_clipping', overflow);
if (overflow !== 'hidden')
element.style.overflow = 'hidden';
}
return element;
}
function undoClipping(element) {
element = $(element);
var storage = Element.getStorage(element),
overflow = storage.get('prototype_made_clipping');
if (!Object.isUndefined(overflow)) {
storage.unset('prototype_made_clipping');
element.style.overflow = overflow || '';
}
return element;
}
function clonePosition(element, source, options) {
options = Object.extend({
setLeft: true,
setTop: true,
setWidth: true,
setHeight: true,
offsetTop: 0,
offsetLeft: 0
}, options || {});
source = $(source);
element = $(element);
var p, delta, layout, styles = {};
if (options.setLeft || options.setTop) {
p = Element.viewportOffset(source);
delta = [0, 0];
if (Element.getStyle(element, 'position') === 'absolute') {
var parent = Element.getOffsetParent(element);
if (parent !== document.body) delta = Element.viewportOffset(parent);
}
}
if (options.setWidth || options.setHeight) {
layout = Element.getLayout(source);
}
if (options.setLeft)
styles.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
if (options.setTop)
styles.top = (p[1] - delta[1] + options.offsetTop) + 'px';
if (options.setWidth)
styles.width = layout.get('border-box-width') + 'px';
if (options.setHeight)
styles.height = layout.get('border-box-height') + 'px';
return Element.setStyle(element, styles);
}
if (Prototype.Browser.IE) {
getOffsetParent = getOffsetParent.wrap(
function (proceed, element) {
element = $(element);
if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
return $(document.body);
var position = element.getStyle('position');
if (position !== 'static') return proceed(element);
element.setStyle({ position: 'relative' });
var value = proceed(element);
element.setStyle({ position: position });
return value;
}
);
positionedOffset = positionedOffset.wrap(function (proceed, element) {
element = $(element);
if (!element.parentNode) return new Element.Offset(0, 0);
var position = element.getStyle('position');
if (position !== 'static') return proceed(element);
var offsetParent = element.getOffsetParent();
if (offsetParent && offsetParent.getStyle('position') === 'fixed')
hasLayout(offsetParent);
element.setStyle({ position: 'relative' });
var value = proceed(element);
element.setStyle({ position: position });
return value;
});
} else if (Prototype.Browser.Webkit) {
cumulativeOffset = function (element) {
element = $(element);
var valueT = 0, valueL = 0;
do {
valueT += element.offsetTop || 0;
valueL += element.offsetLeft || 0;
if (element.offsetParent == document.body) {
if (Element.getStyle(element, 'position') == 'absolute') break;
}
element = element.offsetParent;
} while (element);
return new Element.Offset(valueL, valueT);
};
}
Element.addMethods({
getLayout: getLayout,
measure: measure,
getWidth: getWidth,
getHeight: getHeight,
getDimensions: getDimensions,
getOffsetParent: getOffsetParent,
cumulativeOffset: cumulativeOffset,
positionedOffset: positionedOffset,
cumulativeScrollOffset: cumulativeScrollOffset,
viewportOffset: viewportOffset,
absolutize: absolutize,
relativize: relativize,
scrollTo: scrollTo,
makePositioned: makePositioned,
undoPositioned: undoPositioned,
makeClipping: makeClipping,
undoClipping: undoClipping,
clonePosition: clonePosition
});
function isBody(element) {
return element.nodeName.toUpperCase() === 'BODY';
}
function isHtml(element) {
return element.nodeName.toUpperCase() === 'HTML';
}
function isDocument(element) {
return element.nodeType === Node.DOCUMENT_NODE;
}
function isDetached(element) {
return element !== document.body &&
!Element.descendantOf(element, document.body);
}
if ('getBoundingClientRect' in document.documentElement) {
Element.addMethods({
viewportOffset: function (element) {
element = $(element);
if (isDetached(element)) return new Element.Offset(0, 0);
var rect = element.getBoundingClientRect(),
docEl = document.documentElement;
return new Element.Offset(rect.left - docEl.clientLeft,
rect.top - docEl.clientTop);
}
});
}
})();
(function () {
var IS_OLD_OPERA = Prototype.Browser.Opera &&
(window.parseFloat(window.opera.version()) < 9.5);
var ROOT = null;
function getRootElement() {
if (ROOT) return ROOT;
ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
return ROOT;
}
function getDimensions() {
return { width: this.getWidth(), height: this.getHeight() };
}
function getWidth() {
return getRootElement().clientWidth;
}
function getHeight() {
return getRootElement().clientHeight;
}
function getScrollOffsets() {
var x = window.pageXOffset || document.documentElement.scrollLeft ||
document.body.scrollLeft;
var y = window.pageYOffset || document.documentElement.scrollTop ||
document.body.scrollTop;
return new Element.Offset(x, y);
}
document.viewport = {
getDimensions: getDimensions,
getWidth: getWidth,
getHeight: getHeight,
getScrollOffsets: getScrollOffsets
};
})();
window.$$ = function () {
var expression = $A(arguments).join(', ');
return Prototype.Selector.select(expression, document);
};
Prototype.Selector = (function () {
function select() {
throw new Error('Method "Prototype.Selector.select" must be defined.');
}
function match() {
throw new Error('Method "Prototype.Selector.match" must be defined.');
}
function find(elements, expression, index) {
index = index || 0;
var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;
for (i = 0; i < length; i++) {
if (match(elements[i], expression) && index == matchIndex++) {
return Element.extend(elements[i]);
}
}
}
function extendElements(elements) {
for (var i = 0, length = elements.length; i < length; i++) {
Element.extend(elements[i]);
}
return elements;
}
var K = Prototype.K;
return {
select: select,
match: match,
find: find,
extendElements: (Element.extend === K) ? K : extendElements,
extendElement: Element.extend
};
})();
Prototype._original_property = window.Sizzle;
(function (window) {
var i,
support,
Expr,
getText,
isXML,
compile,
select,
outermostContext,
sortInput,
hasDuplicate,
setDocument,
document,
docElem,
documentIsHTML,
rbuggyQSA,
rbuggyMatches,
matches,
contains,
expando = "sizzle" + -(new Date()),
preferredDoc = window.document,
dirruns = 0,
done = 0,
classCache = createCache(),
tokenCache = createCache(),
compilerCache = createCache(),
sortOrder = function (a, b) {
if (a === b) {
hasDuplicate = true;
}
return 0;
},
strundefined = typeof undefined,
MAX_NEGATIVE = 1 << 31,
hasOwn = ({}).hasOwnProperty,
arr = [],
pop = arr.pop,
push_native = arr.push,
push = arr.push,
slice = arr.slice,
indexOf = arr.indexOf || function (elem) {
var i = 0,
len = this.length;
for (; i < len; i++) {
if (this[i] === elem) {
return i;
}
}
return -1;
},
booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
whitespace = "[\\x20\\t\\r\\n\\f]",
characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
identifier = characterEncoding.replace("w", "w#"),
attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",
rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
rpseudo = new RegExp(pseudos),
ridentifier = new RegExp("^" + identifier + "$"),
matchExpr = {
"ID": new RegExp("^#(" + characterEncoding + ")"),
"CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
"TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
"ATTR": new RegExp("^" + attributes),
"PSEUDO": new RegExp("^" + pseudos),
"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
"*(\\d+)|))" + whitespace + "*\\)|)", "i"),
"bool": new RegExp("^(?:" + booleans + ")$", "i"),
"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
},
rinputs = /^(?:input|select|textarea|button)$/i,
rheader = /^h\d$/i,
rnative = /^[^{]+\{\s*\[native \w/,
rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
rsibling = /[+~]/,
rescape = /'|\\/g,
runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
funescape = function (_, escaped, escapedWhitespace) {
var high = "0x" + escaped - 0x10000;
return high !== high || escapedWhitespace ?
escaped :
high < 0 ?
String.fromCharCode(high + 0x10000) :
String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
};
try {
push.apply(
(arr = slice.call(preferredDoc.childNodes)),
preferredDoc.childNodes
);
arr[preferredDoc.childNodes.length].nodeType;
} catch (e) {
push = {
apply: arr.length ?
function (target, els) {
push_native.apply(target, slice.call(els));
} :
function (target, els) {
var j = target.length,
i = 0;
while ((target[j++] = els[i++])) { }
target.length = j - 1;
}
};
}
function Sizzle(selector, context, results, seed) {
var match, elem, m, nodeType,
i, groups, old, nid, newContext, newSelector;
if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
setDocument(context);
}
context = context || document;
results = results || [];
if (!selector || typeof selector !== "string") {
return results;
}
if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
return [];
}
if (documentIsHTML && !seed) {
if ((match = rquickExpr.exec(selector))) {
if ((m = match[1])) {
if (nodeType === 9) {
elem = context.getElementById(m);
if (elem && elem.parentNode) {
if (elem.id === m) {
results.push(elem);
return results;
}
} else {
return results;
}
} else {
if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
contains(context, elem) && elem.id === m) {
results.push(elem);
return results;
}
}
} else if (match[2]) {
push.apply(results, context.getElementsByTagName(selector));
return results;
} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
push.apply(results, context.getElementsByClassName(m));
return results;
}
}
if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
nid = old = expando;
newContext = context;
newSelector = nodeType === 9 && selector;
if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
groups = tokenize(selector);
if ((old = context.getAttribute("id"))) {
nid = old.replace(rescape, "\\$&");
} else {
context.setAttribute("id", nid);
}
nid = "[id='" + nid + "'] ";
i = groups.length;
while (i--) {
groups[i] = nid + toSelector(groups[i]);
}
newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
newSelector = groups.join(",");
}
if (newSelector) {
try {
push.apply(results,
newContext.querySelectorAll(newSelector)
);
return results;
} catch (qsaError) {
} finally {
if (!old) {
context.removeAttribute("id");
}
}
}
}
}
return select(selector.replace(rtrim, "$1"), context, results, seed);
}
function createCache() {
var keys = [];
function cache(key, value) {
if (keys.push(key + " ") > Expr.cacheLength) {
delete cache[keys.shift()];
}
return (cache[key + " "] = value);
}
return cache;
}
function markFunction(fn) {
fn[expando] = true;
return fn;
}
function assert(fn) {
var div = document.createElement("div");
try {
return !!fn(div);
} catch (e) {
return false;
} finally {
if (div.parentNode) {
div.parentNode.removeChild(div);
}
div = null;
}
}
function addHandle(attrs, handler) {
var arr = attrs.split("|"),
i = attrs.length;
while (i--) {
Expr.attrHandle[arr[i]] = handler;
}
}
function siblingCheck(a, b) {
var cur = b && a,
diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
(~b.sourceIndex || MAX_NEGATIVE) -
(~a.sourceIndex || MAX_NEGATIVE);
if (diff) {
return diff;
}
if (cur) {
while ((cur = cur.nextSibling)) {
if (cur === b) {
return -1;
}
}
}
return a ? 1 : -1;
}
function createInputPseudo(type) {
return function (elem) {
var name = elem.nodeName.toLowerCase();
return name === "input" && elem.type === type;
};
}
function createButtonPseudo(type) {
return function (elem) {
var name = elem.nodeName.toLowerCase();
return (name === "input" || name === "button") && elem.type === type;
};
}
function createPositionalPseudo(fn) {
return markFunction(function (argument) {
argument = +argument;
return markFunction(function (seed, matches) {
var j,
matchIndexes = fn([], seed.length, argument),
i = matchIndexes.length;
while (i--) {
if (seed[(j = matchIndexes[i])]) {
seed[j] = !(matches[j] = seed[j]);
}
}
});
});
}
function testContext(context) {
return context && typeof context.getElementsByTagName !== strundefined && context;
}
support = Sizzle.support = {};
isXML = Sizzle.isXML = function (elem) {
var documentElement = elem && (elem.ownerDocument || elem).documentElement;
return documentElement ? documentElement.nodeName !== "HTML" : false;
};
setDocument = Sizzle.setDocument = function (node) {
var hasCompare,
doc = node ? node.ownerDocument || node : preferredDoc,
parent = doc.defaultView;
if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
return document;
}
document = doc;
docElem = doc.documentElement;
documentIsHTML = !isXML(doc);
if (parent && parent !== parent.top) {
if (parent.addEventListener) {
parent.addEventListener("unload", function () {
setDocument();
}, false);
} else if (parent.attachEvent) {
parent.attachEvent("onunload", function () {
setDocument();
});
}
}
support.attributes = assert(function (div) {
div.className = "i";
return !div.getAttribute("className");
});
support.getElementsByTagName = assert(function (div) {
div.appendChild(doc.createComment(""));
return !div.getElementsByTagName("*").length;
});
support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function (div) {
div.innerHTML = "<div class='a'></div><div class='a i'></div>";
div.firstChild.className = "i";
return div.getElementsByClassName("i").length === 2;
});
support.getById = assert(function (div) {
docElem.appendChild(div).id = expando;
return !doc.getElementsByName || !doc.getElementsByName(expando).length;
});
if (support.getById) {
Expr.find["ID"] = function (id, context) {
if (typeof context.getElementById !== strundefined && documentIsHTML) {
var m = context.getElementById(id);
return m && m.parentNode ? [m] : [];
}
};
Expr.filter["ID"] = function (id) {
var attrId = id.replace(runescape, funescape);
return function (elem) {
return elem.getAttribute("id") === attrId;
};
};
} else {
delete Expr.find["ID"];
Expr.filter["ID"] = function (id) {
var attrId = id.replace(runescape, funescape);
return function (elem) {
var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
return node && node.value === attrId;
};
};
}
Expr.find["TAG"] = support.getElementsByTagName ?
function (tag, context) {
if (typeof context.getElementsByTagName !== strundefined) {
return context.getElementsByTagName(tag);
}
} :
function (tag, context) {
var elem,
tmp = [],
i = 0,
results = context.getElementsByTagName(tag);
if (tag === "*") {
while ((elem = results[i++])) {
if (elem.nodeType === 1) {
tmp.push(elem);
}
}
return tmp;
}
return results;
};
Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
return context.getElementsByClassName(className);
}
};
rbuggyMatches = [];
rbuggyQSA = [];
if ((support.qsa = rnative.test(doc.querySelectorAll))) {
assert(function (div) {
div.innerHTML = "<select t=''><option selected=''></option></select>";
if (div.querySelectorAll("[t^='']").length) {
rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
}
if (!div.querySelectorAll("[selected]").length) {
rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
}
if (!div.querySelectorAll(":checked").length) {
rbuggyQSA.push(":checked");
}
});
assert(function (div) {
var input = doc.createElement("input");
input.setAttribute("type", "hidden");
div.appendChild(input).setAttribute("name", "D");
if (div.querySelectorAll("[name=d]").length) {
rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
}
if (!div.querySelectorAll(":enabled").length) {
rbuggyQSA.push(":enabled", ":disabled");
}
div.querySelectorAll("*,:x");
rbuggyQSA.push(",.*:");
});
}
if ((support.matchesSelector = rnative.test((matches = docElem.webkitMatchesSelector ||
docElem.mozMatchesSelector ||
docElem.oMatchesSelector ||
docElem.msMatchesSelector)))) {
assert(function (div) {
support.disconnectedMatch = matches.call(div, "div");
matches.call(div, "[s!='']:x");
rbuggyMatches.push("!=", pseudos);
});
}
rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
hasCompare = rnative.test(docElem.compareDocumentPosition);
contains = hasCompare || rnative.test(docElem.contains) ?
function (a, b) {
var adown = a.nodeType === 9 ? a.documentElement : a,
bup = b && b.parentNode;
return a === bup || !!(bup && bup.nodeType === 1 && (
adown.contains ?
adown.contains(bup) :
a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
));
} :
function (a, b) {
if (b) {
while ((b = b.parentNode)) {
if (b === a) {
return true;
}
}
}
return false;
};
sortOrder = hasCompare ?
function (a, b) {
if (a === b) {
hasDuplicate = true;
return 0;
}
var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
if (compare) {
return compare;
}
compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
a.compareDocumentPosition(b) :
1;
if (compare & 1 ||
(!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
return -1;
}
if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
return 1;
}
return sortInput ?
(indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
0;
}
return compare & 4 ? -1 : 1;
} :
function (a, b) {
if (a === b) {
hasDuplicate = true;
return 0;
}
var cur,
i = 0,
aup = a.parentNode,
bup = b.parentNode,
ap = [a],
bp = [b];
if (!aup || !bup) {
return a === doc ? -1 :
b === doc ? 1 :
aup ? -1 :
bup ? 1 :
sortInput ?
(indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
0;
} else if (aup === bup) {
return siblingCheck(a, b);
}
cur = a;
while ((cur = cur.parentNode)) {
ap.unshift(cur);
}
cur = b;
while ((cur = cur.parentNode)) {
bp.unshift(cur);
}
while (ap[i] === bp[i]) {
i++;
}
return i ?
siblingCheck(ap[i], bp[i]) :
ap[i] === preferredDoc ? -1 :
bp[i] === preferredDoc ? 1 :
0;
};
return doc;
};
Sizzle.matches = function (expr, elements) {
return Sizzle(expr, null, null, elements);
};
Sizzle.matchesSelector = function (elem, expr) {
if ((elem.ownerDocument || elem) !== document) {
setDocument(elem);
}
expr = expr.replace(rattributeQuotes, "='$1']");
if (support.matchesSelector && documentIsHTML &&
(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
(!rbuggyQSA || !rbuggyQSA.test(expr))) {
try {
var ret = matches.call(elem, expr);
if (ret || support.disconnectedMatch ||
elem.document && elem.document.nodeType !== 11) {
return ret;
}
} catch (e) { }
}
return Sizzle(expr, document, null, [elem]).length > 0;
};
Sizzle.contains = function (context, elem) {
if ((context.ownerDocument || context) !== document) {
setDocument(context);
}
return contains(context, elem);
};
Sizzle.attr = function (elem, name) {
if ((elem.ownerDocument || elem) !== document) {
setDocument(elem);
}
var fn = Expr.attrHandle[name.toLowerCase()],
val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
fn(elem, name, !documentIsHTML) :
undefined;
return val !== undefined ?
val :
support.attributes || !documentIsHTML ?
elem.getAttribute(name) :
(val = elem.getAttributeNode(name)) && val.specified ?
val.value :
null;
};
Sizzle.error = function (msg) {
throw new Error("Syntax error, unrecognized expression: " + msg);
};
Sizzle.uniqueSort = function (results) {
var elem,
duplicates = [],
j = 0,
i = 0;
hasDuplicate = !support.detectDuplicates;
sortInput = !support.sortStable && results.slice(0);
results.sort(sortOrder);
if (hasDuplicate) {
while ((elem = results[i++])) {
if (elem === results[i]) {
j = duplicates.push(i);
}
}
while (j--) {
results.splice(duplicates[j], 1);
}
}
sortInput = null;
return results;
};
getText = Sizzle.getText = function (elem) {
var node,
ret = "",
i = 0,
nodeType = elem.nodeType;
if (!nodeType) {
while ((node = elem[i++])) {
ret += getText(node);
}
} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
if (typeof elem.textContent === "string") {
return elem.textContent;
} else {
for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
ret += getText(elem);
}
}
} else if (nodeType === 3 || nodeType === 4) {
return elem.nodeValue;
}
return ret;
};
Expr = Sizzle.selectors = {
cacheLength: 50,
createPseudo: markFunction,
match: matchExpr,
attrHandle: {},
find: {},
relative: {
">": { dir: "parentNode", first: true },
" ": { dir: "parentNode" },
"+": { dir: "previousSibling", first: true },
"~": { dir: "previousSibling" }
},
preFilter: {
"ATTR": function (match) {
match[1] = match[1].replace(runescape, funescape);
match[3] = (match[4] || match[5] || "").replace(runescape, funescape);
if (match[2] === "~=") {
match[3] = " " + match[3] + " ";
}
return match.slice(0, 4);
},
"CHILD": function (match) {
match[1] = match[1].toLowerCase();
if (match[1].slice(0, 3) === "nth") {
if (!match[3]) {
Sizzle.error(match[0]);
}
match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
match[5] = +((match[7] + match[8]) || match[3] === "odd");
} else if (match[3]) {
Sizzle.error(match[0]);
}
return match;
},
"PSEUDO": function (match) {
var excess,
unquoted = !match[5] && match[2];
if (matchExpr["CHILD"].test(match[0])) {
return null;
}
if (match[3] && match[4] !== undefined) {
match[2] = match[4];
} else if (unquoted && rpseudo.test(unquoted) &&
(excess = tokenize(unquoted, true)) &&
(excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
match[0] = match[0].slice(0, excess);
match[2] = unquoted.slice(0, excess);
}
return match.slice(0, 3);
}
},
filter: {
"TAG": function (nodeNameSelector) {
var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
return nodeNameSelector === "*" ?
function () { return true; } :
function (elem) {
return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
};
},
"CLASS": function (className) {
var pattern = classCache[className + " "];
return pattern ||
(pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
classCache(className, function (elem) {
return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
});
},
"ATTR": function (name, operator, check) {
return function (elem) {
var result = Sizzle.attr(elem, name);
if (result == null) {
return operator === "!=";
}
if (!operator) {
return true;
}
result += "";
return operator === "=" ? result === check :
operator === "!=" ? result !== check :
operator === "^=" ? check && result.indexOf(check) === 0 :
operator === "*=" ? check && result.indexOf(check) > -1 :
operator === "$=" ? check && result.slice(-check.length) === check :
operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
false;
};
},
"CHILD": function (type, what, argument, first, last) {
var simple = type.slice(0, 3) !== "nth",
forward = type.slice(-4) !== "last",
ofType = what === "of-type";
return first === 1 && last === 0 ?
function (elem) {
return !!elem.parentNode;
} :
function (elem, context, xml) {
var cache, outerCache, node, diff, nodeIndex, start,
dir = simple !== forward ? "nextSibling" : "previousSibling",
parent = elem.parentNode,
name = ofType && elem.nodeName.toLowerCase(),
useCache = !xml && !ofType;
if (parent) {
if (simple) {
while (dir) {
node = elem;
while ((node = node[dir])) {
if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
return false;
}
}
start = dir = type === "only" && !start && "nextSibling";
}
return true;
}
start = [forward ? parent.firstChild : parent.lastChild];
if (forward && useCache) {
outerCache = parent[expando] || (parent[expando] = {});
cache = outerCache[type] || [];
nodeIndex = cache[0] === dirruns && cache[1];
diff = cache[0] === dirruns && cache[2];
node = nodeIndex && parent.childNodes[nodeIndex];
while ((node = ++nodeIndex && node && node[dir] ||
(diff = nodeIndex = 0) || start.pop())) {
if (node.nodeType === 1 && ++diff && node === elem) {
outerCache[type] = [dirruns, nodeIndex, diff];
break;
}
}
} else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
diff = cache[1];
} else {
while ((node = ++nodeIndex && node && node[dir] ||
(diff = nodeIndex = 0) || start.pop())) {
if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
if (useCache) {
(node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
}
if (node === elem) {
break;
}
}
}
}
diff -= last;
return diff === first || (diff % first === 0 && diff / first >= 0);
}
};
},
"PSEUDO": function (pseudo, argument) {
var args,
fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
Sizzle.error("unsupported pseudo: " + pseudo);
if (fn[expando]) {
return fn(argument);
}
if (fn.length > 1) {
args = [pseudo, pseudo, "", argument];
return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
markFunction(function (seed, matches) {
var idx,
matched = fn(seed, argument),
i = matched.length;
while (i--) {
idx = indexOf.call(seed, matched[i]);
seed[idx] = !(matches[idx] = matched[i]);
}
}) :
function (elem) {
return fn(elem, 0, args);
};
}
return fn;
}
},
pseudos: {
"not": markFunction(function (selector) {
var input = [],
results = [],
matcher = compile(selector.replace(rtrim, "$1"));
return matcher[expando] ?
markFunction(function (seed, matches, context, xml) {
var elem,
unmatched = matcher(seed, null, xml, []),
i = seed.length;
while (i--) {
if ((elem = unmatched[i])) {
seed[i] = !(matches[i] = elem);
}
}
}) :
function (elem, context, xml) {
input[0] = elem;
matcher(input, null, xml, results);
return !results.pop();
};
}),
"has": markFunction(function (selector) {
return function (elem) {
return Sizzle(selector, elem).length > 0;
};
}),
"contains": markFunction(function (text) {
return function (elem) {
return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
};
}),
"lang": markFunction(function (lang) {
if (!ridentifier.test(lang || "")) {
Sizzle.error("unsupported lang: " + lang);
}
lang = lang.replace(runescape, funescape).toLowerCase();
return function (elem) {
var elemLang;
do {
if ((elemLang = documentIsHTML ?
elem.lang :
elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
elemLang = elemLang.toLowerCase();
return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
}
} while ((elem = elem.parentNode) && elem.nodeType === 1);
return false;
};
}),
"target": function (elem) {
var hash = window.location && window.location.hash;
return hash && hash.slice(1) === elem.id;
},
"root": function (elem) {
return elem === docElem;
},
"focus": function (elem) {
return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
},
"enabled": function (elem) {
return elem.disabled === false;
},
"disabled": function (elem) {
return elem.disabled === true;
},
"checked": function (elem) {
var nodeName = elem.nodeName.toLowerCase();
return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
},
"selected": function (elem) {
if (elem.parentNode) {
elem.parentNode.selectedIndex;
}
return elem.selected === true;
},
"empty": function (elem) {
for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
if (elem.nodeType < 6) {
return false;
}
}
return true;
},
"parent": function (elem) {
return !Expr.pseudos["empty"](elem);
},
"header": function (elem) {
return rheader.test(elem.nodeName);
},
"input": function (elem) {
return rinputs.test(elem.nodeName);
},
"button": function (elem) {
var name = elem.nodeName.toLowerCase();
return name === "input" && elem.type === "button" || name === "button";
},
"text": function (elem) {
var attr;
return elem.nodeName.toLowerCase() === "input" &&
elem.type === "text" &&
((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
},
"first": createPositionalPseudo(function () {
return [0];
}),
"last": createPositionalPseudo(function (matchIndexes, length) {
return [length - 1];
}),
"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
return [argument < 0 ? argument + length : argument];
}),
"even": createPositionalPseudo(function (matchIndexes, length) {
var i = 0;
for (; i < length; i += 2) {
matchIndexes.push(i);
}
return matchIndexes;
}),
"odd": createPositionalPseudo(function (matchIndexes, length) {
var i = 1;
for (; i < length; i += 2) {
matchIndexes.push(i);
}
return matchIndexes;
}),
"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
var i = argument < 0 ? argument + length : argument;
for (; --i >= 0;) {
matchIndexes.push(i);
}
return matchIndexes;
}),
"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
var i = argument < 0 ? argument + length : argument;
for (; ++i < length;) {
matchIndexes.push(i);
}
return matchIndexes;
})
}
};
Expr.pseudos["nth"] = Expr.pseudos["eq"];
for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
Expr.pseudos[i] = createInputPseudo(i);
}
for (i in { submit: true, reset: true }) {
Expr.pseudos[i] = createButtonPseudo(i);
}
function setFilters() { }
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();
function tokenize(selector, parseOnly) {
var matched, match, tokens, type,
soFar, groups, preFilters,
cached = tokenCache[selector + " "];
if (cached) {
return parseOnly ? 0 : cached.slice(0);
}
soFar = selector;
groups = [];
preFilters = Expr.preFilter;
while (soFar) {
if (!matched || (match = rcomma.exec(soFar))) {
if (match) {
soFar = soFar.slice(match[0].length) || soFar;
}
groups.push((tokens = []));
}
matched = false;
if ((match = rcombinators.exec(soFar))) {
matched = match.shift();
tokens.push({
value: matched,
type: match[0].replace(rtrim, " ")
});
soFar = soFar.slice(matched.length);
}
for (type in Expr.filter) {
if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
(match = preFilters[type](match)))) {
matched = match.shift();
tokens.push({
value: matched,
type: type,
matches: match
});
soFar = soFar.slice(matched.length);
}
}
if (!matched) {
break;
}
}
return parseOnly ?
soFar.length :
soFar ?
Sizzle.error(selector) :
tokenCache(selector, groups).slice(0);
}
function toSelector(tokens) {
var i = 0,
len = tokens.length,
selector = "";
for (; i < len; i++) {
selector += tokens[i].value;
}
return selector;
}
function addCombinator(matcher, combinator, base) {
var dir = combinator.dir,
checkNonElements = base && dir === "parentNode",
doneName = done++;
return combinator.first ?
function (elem, context, xml) {
while ((elem = elem[dir])) {
if (elem.nodeType === 1 || checkNonElements) {
return matcher(elem, context, xml);
}
}
} :
function (elem, context, xml) {
var oldCache, outerCache,
newCache = [dirruns, doneName];
if (xml) {
while ((elem = elem[dir])) {
if (elem.nodeType === 1 || checkNonElements) {
if (matcher(elem, context, xml)) {
return true;
}
}
}
} else {
while ((elem = elem[dir])) {
if (elem.nodeType === 1 || checkNonElements) {
outerCache = elem[expando] || (elem[expando] = {});
if ((oldCache = outerCache[dir]) &&
oldCache[0] === dirruns && oldCache[1] === doneName) {
return (newCache[2] = oldCache[2]);
} else {
outerCache[dir] = newCache;
if ((newCache[2] = matcher(elem, context, xml))) {
return true;
}
}
}
}
}
};
}
function elementMatcher(matchers) {
return matchers.length > 1 ?
function (elem, context, xml) {
var i = matchers.length;
while (i--) {
if (!matchers[i](elem, context, xml)) {
return false;
}
}
return true;
} :
matchers[0];
}
function multipleContexts(selector, contexts, results) {
var i = 0,
len = contexts.length;
for (; i < len; i++) {
Sizzle(selector, contexts[i], results);
}
return results;
}
function condense(unmatched, map, filter, context, xml) {
var elem,
newUnmatched = [],
i = 0,
len = unmatched.length,
mapped = map != null;
for (; i < len; i++) {
if ((elem = unmatched[i])) {
if (!filter || filter(elem, context, xml)) {
newUnmatched.push(elem);
if (mapped) {
map.push(i);
}
}
}
}
return newUnmatched;
}
function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
if (postFilter && !postFilter[expando]) {
postFilter = setMatcher(postFilter);
}
if (postFinder && !postFinder[expando]) {
postFinder = setMatcher(postFinder, postSelector);
}
return markFunction(function (seed, results, context, xml) {
var temp, i, elem,
preMap = [],
postMap = [],
preexisting = results.length,
elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
matcherIn = preFilter && (seed || !selector) ?
condense(elems, preMap, preFilter, context, xml) :
elems,
matcherOut = matcher ?
postFinder || (seed ? preFilter : preexisting || postFilter) ?
[] :
results :
matcherIn;
if (matcher) {
matcher(matcherIn, matcherOut, context, xml);
}
if (postFilter) {
temp = condense(matcherOut, postMap);
postFilter(temp, [], context, xml);
i = temp.length;
while (i--) {
if ((elem = temp[i])) {
matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
}
}
}
if (seed) {
if (postFinder || preFilter) {
if (postFinder) {
temp = [];
i = matcherOut.length;
while (i--) {
if ((elem = matcherOut[i])) {
temp.push((matcherIn[i] = elem));
}
}
postFinder(null, (matcherOut = []), temp, xml);
}
i = matcherOut.length;
while (i--) {
if ((elem = matcherOut[i]) &&
(temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
seed[temp] = !(results[temp] = elem);
}
}
}
} else {
matcherOut = condense(
matcherOut === results ?
matcherOut.splice(preexisting, matcherOut.length) :
matcherOut
);
if (postFinder) {
postFinder(null, results, matcherOut, xml);
} else {
push.apply(results, matcherOut);
}
}
});
}
function matcherFromTokens(tokens) {
var checkContext, matcher, j,
len = tokens.length,
leadingRelative = Expr.relative[tokens[0].type],
implicitRelative = leadingRelative || Expr.relative[" "],
i = leadingRelative ? 1 : 0,
matchContext = addCombinator(function (elem) {
return elem === checkContext;
}, implicitRelative, true),
matchAnyContext = addCombinator(function (elem) {
return indexOf.call(checkContext, elem) > -1;
}, implicitRelative, true),
matchers = [function (elem, context, xml) {
return (!leadingRelative && (xml || context !== outermostContext)) || (
(checkContext = context).nodeType ?
matchContext(elem, context, xml) :
matchAnyContext(elem, context, xml));
}];
for (; i < len; i++) {
if ((matcher = Expr.relative[tokens[i].type])) {
matchers = [addCombinator(elementMatcher(matchers), matcher)];
} else {
matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
if (matcher[expando]) {
j = ++i;
for (; j < len; j++) {
if (Expr.relative[tokens[j].type]) {
break;
}
}
return setMatcher(
i > 1 && elementMatcher(matchers),
i > 1 && toSelector(
tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
).replace(rtrim, "$1"),
matcher,
i < j && matcherFromTokens(tokens.slice(i, j)),
j < len && matcherFromTokens((tokens = tokens.slice(j))),
j < len && toSelector(tokens)
);
}
matchers.push(matcher);
}
}
return elementMatcher(matchers);
}
function matcherFromGroupMatchers(elementMatchers, setMatchers) {
var bySet = setMatchers.length > 0,
byElement = elementMatchers.length > 0,
superMatcher = function (seed, context, xml, results, outermost) {
var elem, j, matcher,
matchedCount = 0,
i = "0",
unmatched = seed && [],
setMatched = [],
contextBackup = outermostContext,
elems = seed || byElement && Expr.find["TAG"]("*", outermost),
dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
len = elems.length;
if (outermost) {
outermostContext = context !== document && context;
}
for (; i !== len && (elem = elems[i]) != null; i++) {
if (byElement && elem) {
j = 0;
while ((matcher = elementMatchers[j++])) {
if (matcher(elem, context, xml)) {
results.push(elem);
break;
}
}
if (outermost) {
dirruns = dirrunsUnique;
}
}
if (bySet) {
if ((elem = !matcher && elem)) {
matchedCount--;
}
if (seed) {
unmatched.push(elem);
}
}
}
matchedCount += i;
if (bySet && i !== matchedCount) {
j = 0;
while ((matcher = setMatchers[j++])) {
matcher(unmatched, setMatched, context, xml);
}
if (seed) {
if (matchedCount > 0) {
while (i--) {
if (!(unmatched[i] || setMatched[i])) {
setMatched[i] = pop.call(results);
}
}
}
setMatched = condense(setMatched);
}
push.apply(results, setMatched);
if (outermost && !seed && setMatched.length > 0 &&
(matchedCount + setMatchers.length) > 1) {
Sizzle.uniqueSort(results);
}
}
if (outermost) {
dirruns = dirrunsUnique;
outermostContext = contextBackup;
}
return unmatched;
};
return bySet ?
markFunction(superMatcher) :
superMatcher;
}
compile = Sizzle.compile = function (selector, match ) {
var i,
setMatchers = [],
elementMatchers = [],
cached = compilerCache[selector + " "];
if (!cached) {
if (!match) {
match = tokenize(selector);
}
i = match.length;
while (i--) {
cached = matcherFromTokens(match[i]);
if (cached[expando]) {
setMatchers.push(cached);
} else {
elementMatchers.push(cached);
}
}
cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
cached.selector = selector;
}
return cached;
};
select = Sizzle.select = function (selector, context, results, seed) {
var i, tokens, token, type, find,
compiled = typeof selector === "function" && selector,
match = !seed && tokenize((selector = compiled.selector || selector));
results = results || [];
if (match.length === 1) {
tokens = match[0] = match[0].slice(0);
if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
support.getById && context.nodeType === 9 && documentIsHTML &&
Expr.relative[tokens[1].type]) {
context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
if (!context) {
return results;
} else if (compiled) {
context = context.parentNode;
}
selector = selector.slice(tokens.shift().value.length);
}
i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
while (i--) {
token = tokens[i];
if (Expr.relative[(type = token.type)]) {
break;
}
if ((find = Expr.find[type])) {
if ((seed = find(
token.matches[0].replace(runescape, funescape),
rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
))) {
tokens.splice(i, 1);
selector = seed.length && toSelector(tokens);
if (!selector) {
push.apply(results, seed);
return results;
}
break;
}
}
}
}
(compiled || compile(selector, match))(
seed,
context,
!documentIsHTML,
results,
rsibling.test(selector) && testContext(context.parentNode) || context
);
return results;
};
support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
support.detectDuplicates = !!hasDuplicate;
setDocument();
support.sortDetached = assert(function (div1) {
return div1.compareDocumentPosition(document.createElement("div")) & 1;
});
if (!assert(function (div) {
div.innerHTML = "<a href='#'></a>";
return div.firstChild.getAttribute("href") === "#";
})) {
addHandle("type|href|height|width", function (elem, name, isXML) {
if (!isXML) {
return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
}
});
}
if (!support.attributes || !assert(function (div) {
div.innerHTML = "<input/>";
div.firstChild.setAttribute("value", "");
return div.firstChild.getAttribute("value") === "";
})) {
addHandle("value", function (elem, name, isXML) {
if (!isXML && elem.nodeName.toLowerCase() === "input") {
return elem.defaultValue;
}
});
}
if (!assert(function (div) {
return div.getAttribute("disabled") == null;
})) {
addHandle(booleans, function (elem, name, isXML) {
var val;
if (!isXML) {
return elem[name] === true ? name.toLowerCase() :
(val = elem.getAttributeNode(name)) && val.specified ?
val.value :
null;
}
});
}
if (typeof define === "function" && define.amd) {
define(function () { return Sizzle; });
} else if (typeof module !== "undefined" && module.exports) {
module.exports = Sizzle;
} else {
window.Sizzle = Sizzle;
}
})(window);
; (function (engine) {
var extendElements = Prototype.Selector.extendElements;
function select(selector, scope) {
return extendElements(engine(selector, scope || document));
}
function match(element, selector) {
return engine.matches(selector, [element]).length == 1;
}
Prototype.Selector.engine = engine;
Prototype.Selector.select = select;
Prototype.Selector.match = match;
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
reset: function (form) {
form = $(form);
form.reset();
return form;
},
serializeElements: function (elements, options) {
if (typeof options != 'object') options = { hash: !!options };
else if (Object.isUndefined(options.hash)) options.hash = true;
var key, value, submitted = false, submit = options.submit, accumulator, initial;
if (options.hash) {
initial = {};
accumulator = function (result, key, value) {
if (key in result) {
if (!Object.isArray(result[key])) result[key] = [result[key]];
result[key] = result[key].concat(value);
} else result[key] = value;
return result;
};
} else {
initial = '';
accumulator = function (result, key, values) {
if (!Object.isArray(values)) { values = [values]; }
if (!values.length) { return result; }
var encodedKey = encodeURIComponent(key).gsub(/%20/, '+');
return result + (result ? "&" : "") + values.map(function (value) {
value = value.gsub(/(\r)?\n/, '\r\n');
value = encodeURIComponent(value);
value = value.gsub(/%20/, '+');
return encodedKey + "=" + value;
}).join("&");
};
}
return elements.inject(initial, function (result, element) {
if (!element.disabled && element.name) {
key = element.name; value = $(element).getValue();
if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
submit !== false && (!submit || key == submit) && (submitted = true)))) {
result = accumulator(result, key, value);
}
}
return result;
});
}
};
Form.Methods = {
serialize: function (form, options) {
return Form.serializeElements(Form.getElements(form), options);
},
getElements: function (form) {
var elements = $(form).getElementsByTagName('*');
var element, results = [], serializers = Form.Element.Serializers;
for (var i = 0; element = elements[i]; i++) {
if (serializers[element.tagName.toLowerCase()])
results.push(Element.extend(element));
}
return results;
},
getInputs: function (form, typeName, name) {
form = $(form);
var inputs = form.getElementsByTagName('input');
if (!typeName && !name) return $A(inputs).map(Element.extend);
for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
var input = inputs[i];
if ((typeName && input.type != typeName) || (name && input.name != name))
continue;
matchingInputs.push(Element.extend(input));
}
return matchingInputs;
},
disable: function (form) {
form = $(form);
Form.getElements(form).invoke('disable');
return form;
},
enable: function (form) {
form = $(form);
Form.getElements(form).invoke('enable');
return form;
},
findFirstElement: function (form) {
var elements = $(form).getElements().findAll(function (element) {
return 'hidden' != element.type && !element.disabled;
});
var firstByIndex = elements.findAll(function (element) {
return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
}).sortBy(function (element) { return element.tabIndex }).first();
return firstByIndex ? firstByIndex : elements.find(function (element) {
return /^(?:input|select|textarea)$/i.test(element.tagName);
});
},
focusFirstElement: function (form) {
form = $(form);
var element = form.findFirstElement();
if (element) element.activate();
return form;
},
request: function (form, options) {
form = $(form), options = Object.clone(options || {});
var params = options.parameters, action = form.readAttribute('action') || '';
if (action.blank()) action = window.location.href;
options.parameters = form.serialize(true);
if (params) {
if (Object.isString(params)) params = params.toQueryParams();
Object.extend(options.parameters, params);
}
if (form.hasAttribute('method') && !options.method)
options.method = form.method;
return new Ajax.Request(action, options);
}
};
Form.Element = {
focus: function (element) {
$(element).focus();
return element;
},
select: function (element) {
$(element).select();
return element;
}
};
Form.Element.Methods = {
serialize: function (element) {
element = $(element);
if (!element.disabled && element.name) {
var value = element.getValue();
if (value != undefined) {
var pair = {};
pair[element.name] = value;
return Object.toQueryString(pair);
}
}
return '';
},
getValue: function (element) {
element = $(element);
var method = element.tagName.toLowerCase();
return Form.Element.Serializers[method](element);
},
setValue: function (element, value) {
element = $(element);
var method = element.tagName.toLowerCase();
Form.Element.Serializers[method](element, value);
return element;
},
clear: function (element) {
$(element).value = '';
return element;
},
present: function (element) {
return $(element).value != '';
},
activate: function (element) {
element = $(element);
try {
element.focus();
if (element.select && (element.tagName.toLowerCase() != 'input' ||
!(/^(?:button|reset|submit)$/i.test(element.type))))
element.select();
} catch (e) { }
return element;
},
disable: function (element) {
element = $(element);
element.disabled = true;
return element;
},
enable: function (element) {
element = $(element);
element.disabled = false;
return element;
}
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function () {
function input(element, value) {
switch (element.type.toLowerCase()) {
case 'checkbox':
case 'radio':
return inputSelector(element, value);
default:
return valueSelector(element, value);
}
}
function inputSelector(element, value) {
if (Object.isUndefined(value))
return element.checked ? element.value : null;
else element.checked = !!value;
}
function valueSelector(element, value) {
if (Object.isUndefined(value)) return element.value;
else element.value = value;
}
function select(element, value) {
if (Object.isUndefined(value))
return (element.type === 'select-one' ? selectOne : selectMany)(element);
var opt, currentValue, single = !Object.isArray(value);
for (var i = 0, length = element.length; i < length; i++) {
opt = element.options[i];
currentValue = this.optionValue(opt);
if (single) {
if (currentValue == value) {
opt.selected = true;
return;
}
}
else opt.selected = value.include(currentValue);
}
}
function selectOne(element) {
var index = element.selectedIndex;
return index >= 0 ? optionValue(element.options[index]) : null;
}
function selectMany(element) {
var values, length = element.length;
if (!length) return null;
for (var i = 0, values = []; i < length; i++) {
var opt = element.options[i];
if (opt.selected) values.push(optionValue(opt));
}
return values;
}
function optionValue(opt) {
return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
}
return {
input: input,
inputSelector: inputSelector,
textarea: valueSelector,
select: select,
selectOne: selectOne,
selectMany: selectMany,
optionValue: optionValue,
button: valueSelector
};
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
initialize: function ($super, element, frequency, callback) {
$super(callback, frequency);
this.element = $(element);
this.lastValue = this.getValue();
},
execute: function () {
var value = this.getValue();
if (Object.isString(this.lastValue) && Object.isString(value) ?
this.lastValue != value : String(this.lastValue) != String(value)) {
this.callback(this.element, value);
this.lastValue = value;
}
}
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
getValue: function () {
return Form.Element.getValue(this.element);
}
});
Form.Observer = Class.create(Abstract.TimedObserver, {
getValue: function () {
return Form.serialize(this.element);
}
});
Abstract.EventObserver = Class.create({
initialize: function (element, callback) {
this.element = $(element);
this.callback = callback;
this.lastValue = this.getValue();
if (this.element.tagName.toLowerCase() == 'form')
this.registerFormCallbacks();
else
this.registerCallback(this.element);
},
onElementEvent: function () {
var value = this.getValue();
if (this.lastValue != value) {
this.callback(this.element, value);
this.lastValue = value;
}
},
registerFormCallbacks: function () {
Form.getElements(this.element).each(this.registerCallback, this);
},
registerCallback: function (element) {
if (element.type) {
switch (element.type.toLowerCase()) {
case 'checkbox':
case 'radio':
Event.observe(element, 'click', this.onElementEvent.bind(this));
break;
default:
Event.observe(element, 'change', this.onElementEvent.bind(this));
break;
}
}
}
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
getValue: function () {
return Form.Element.getValue(this.element);
}
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
getValue: function () {
return Form.serialize(this.element);
}
});
(function (GLOBAL) {
var DIV = document.createElement('div');
var docEl = document.documentElement;
var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
&& 'onmouseleave' in docEl;
var Event = {
KEY_BACKSPACE: 8,
KEY_TAB: 9,
KEY_RETURN: 13,
KEY_ESC: 27,
KEY_LEFT: 37,
KEY_UP: 38,
KEY_RIGHT: 39,
KEY_DOWN: 40,
KEY_DELETE: 46,
KEY_HOME: 36,
KEY_END: 35,
KEY_PAGEUP: 33,
KEY_PAGEDOWN: 34,
KEY_INSERT: 45
};
var isIELegacyEvent = function (event) { return false; };
if (window.attachEvent) {
if (window.addEventListener) {
isIELegacyEvent = function (event) {
return !(event instanceof window.Event);
};
} else {
isIELegacyEvent = function (event) { return true; };
}
}
var _isButton;
function _isButtonForDOMEvents(event, code) {
return event.which ? (event.which === code + 1) : (event.button === code);
}
var legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
function _isButtonForLegacyEvents(event, code) {
return event.button === legacyButtonMap[code];
}
function _isButtonForWebKit(event, code) {
switch (code) {
case 0: return event.which == 1 && !event.metaKey;
case 1: return event.which == 2 || (event.which == 1 && event.metaKey);
case 2: return event.which == 3;
default: return false;
}
}
if (window.attachEvent) {
if (!window.addEventListener) {
_isButton = _isButtonForLegacyEvents;
} else {
_isButton = function (event, code) {
return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
_isButtonForDOMEvents(event, code);
}
}
} else if (Prototype.Browser.WebKit) {
_isButton = _isButtonForWebKit;
} else {
_isButton = _isButtonForDOMEvents;
}
function isLeftClick(event) { return _isButton(event, 0) }
function isMiddleClick(event) { return _isButton(event, 1) }
function isRightClick(event) { return _isButton(event, 2) }
function element(event) {
return Element.extend(_element(event));
}
function _element(event) {
event = Event.extend(event);
var node = event.target, type = event.type,
currentTarget = event.currentTarget;
if (currentTarget && currentTarget.tagName) {
if (type === 'load' || type === 'error' ||
(type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
&& currentTarget.type === 'radio'))
node = currentTarget;
}
return node.nodeType == Node.TEXT_NODE ? node.parentNode : node;
}
function findElement(event, expression) {
var element = _element(event), selector = Prototype.Selector;
if (!expression) return Element.extend(element);
while (element) {
if (Object.isElement(element) && selector.match(element, expression))
return Element.extend(element);
element = element.parentNode;
}
}
function pointer(event) {
return { x: pointerX(event), y: pointerY(event) };
}
function pointerX(event) {
var docElement = document.documentElement,
body = document.body || { scrollLeft: 0 };
if (isEventSupported('touchstart') && event.touches) {
if (event.touches[0]) {
return event.touches[0].pageX;
} else {
return event.pageX;
}
}
return event.pageX || (event.clientX +
(docElement.scrollLeft || body.scrollLeft) -
(docElement.clientLeft || 0));
}
function pointerY(event) {
var docElement = document.documentElement,
body = document.body || { scrollTop: 0 };
if (isEventSupported('touchstart') && event.touches) {
if (event.touches[0]) {
return event.touches[0].pageY;
} else {
return event.pageY;
}
}
return event.pageY || (event.clientY +
(docElement.scrollTop || body.scrollTop) -
(docElement.clientTop || 0));
}
function stop(event) {
Event.extend(event);
event.preventDefault();
event.stopPropagation();
event.stopped = true;
}
Event.Methods = {
isLeftClick: isLeftClick,
isMiddleClick: isMiddleClick,
isRightClick: isRightClick,
element: element,
findElement: findElement,
pointer: pointer,
pointerX: pointerX,
pointerY: pointerY,
stop: stop
};
var methods = Object.keys(Event.Methods).inject({}, function (m, name) {
m[name] = Event.Methods[name].methodize();
return m;
});
if (window.attachEvent) {
function _relatedTarget(event) {
var element;
switch (event.type) {
case 'mouseover':
case 'mouseenter':
element = event.fromElement;
break;
case 'mouseout':
case 'mouseleave':
element = event.toElement;
break;
default:
return null;
}
return Element.extend(element);
}
var additionalMethods = {
stopPropagation: function () { this.cancelBubble = true },
preventDefault: function () { this.returnValue = false },
inspect: function () { return '[object Event]' }
};
Event.extend = function (event, element) {
if (!event) return false;
if (!isIELegacyEvent(event)) return event;
if (event._extendedByPrototype) return event;
event._extendedByPrototype = Prototype.emptyFunction;
var pointer = Event.pointer(event);
Object.extend(event, {
target: event.srcElement || element,
relatedTarget: _relatedTarget(event),
pageX: pointer.x,
pageY: pointer.y
});
Object.extend(event, methods);
Object.extend(event, additionalMethods);
return event;
};
} else {
Event.extend = Prototype.K;
}
if (window.addEventListener) {
Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
Object.extend(Event.prototype, methods);
}
var EVENT_TRANSLATIONS = {
mouseenter: 'mouseover',
mouseleave: 'mouseout'
};
function getDOMEventName(eventName) {
return EVENT_TRANSLATIONS[eventName] || eventName;
}
if (MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED)
getDOMEventName = Prototype.K;
function getUniqueElementID(element) {
if (element === window) return 0;
if (typeof element._prototypeUID === 'undefined')
element._prototypeUID = Element.Storage.UID++;
return element._prototypeUID;
}
function getUniqueElementID_IE(element) {
if (element === window) return 0;
if (element == document) return 1;
return element.uniqueID;
}
if ('uniqueID' in DIV)
getUniqueElementID = getUniqueElementID_IE;
function isCustomEvent(eventName) {
return eventName.include(':');
}
Event._isCustomEvent = isCustomEvent;
function getRegistryForElement(element, uid) {
var CACHE = GLOBAL.Event.cache;
if (Object.isUndefined(uid))
uid = getUniqueElementID(element);
if (!CACHE[uid]) CACHE[uid] = { element: element };
return CACHE[uid];
}
function destroyRegistryForElement(element, uid) {
if (Object.isUndefined(uid))
uid = getUniqueElementID(element);
delete GLOBAL.Event.cache[uid];
}
function register(element, eventName, handler) {
var registry = getRegistryForElement(element);
if (!registry[eventName]) registry[eventName] = [];
var entries = registry[eventName];
var i = entries.length;
while (i--)
if (entries[i].handler === handler) return null;
var uid = getUniqueElementID(element);
var responder = GLOBAL.Event._createResponder(uid, eventName, handler);
var entry = {
responder: responder,
handler: handler
};
entries.push(entry);
return entry;
}
function unregister(element, eventName, handler) {
var registry = getRegistryForElement(element);
var entries = registry[eventName];
if (!entries) return;
var i = entries.length, entry;
while (i--) {
if (entries[i].handler === handler) {
entry = entries[i];
break;
}
}
if (!entry) return;
var index = entries.indexOf(entry);
entries.splice(index, 1);
return entry;
}
function observe(element, eventName, handler) {
element = $(element);
var entry = register(element, eventName, handler);
if (entry === null) return element;
var responder = entry.responder;
if (isCustomEvent(eventName))
observeCustomEvent(element, eventName, responder);
else
observeStandardEvent(element, eventName, responder);
return element;
}
function observeStandardEvent(element, eventName, responder) {
var actualEventName = getDOMEventName(eventName);
if (element.addEventListener) {
element.addEventListener(actualEventName, responder, false);
} else {
element.attachEvent('on' + actualEventName, responder);
}
}
function observeCustomEvent(element, eventName, responder) {
if (element.addEventListener) {
element.addEventListener('dataavailable', responder, false);
} else {
element.attachEvent('ondataavailable', responder);
element.attachEvent('onlosecapture', responder);
}
}
function stopObserving(element, eventName, handler) {
element = $(element);
var handlerGiven = !Object.isUndefined(handler),
eventNameGiven = !Object.isUndefined(eventName);
if (!eventNameGiven && !handlerGiven) {
stopObservingElement(element);
return element;
}
if (!handlerGiven) {
stopObservingEventName(element, eventName);
return element;
}
var entry = unregister(element, eventName, handler);
if (!entry) return element;
removeEvent(element, eventName, entry.responder);
return element;
}
function stopObservingStandardEvent(element, eventName, responder) {
var actualEventName = getDOMEventName(eventName);
if (element.removeEventListener) {
element.removeEventListener(actualEventName, responder, false);
} else {
element.detachEvent('on' + actualEventName, responder);
}
}
function stopObservingCustomEvent(element, eventName, responder) {
if (element.removeEventListener) {
element.removeEventListener('dataavailable', responder, false);
} else {
element.detachEvent('ondataavailable', responder);
element.detachEvent('onlosecapture', responder);
}
}
function stopObservingElement(element) {
var uid = getUniqueElementID(element), registry = GLOBAL.Event.cache[uid];
if (!registry) return;
destroyRegistryForElement(element, uid);
var entries, i;
for (var eventName in registry) {
if (eventName === 'element') continue;
entries = registry[eventName];
i = entries.length;
while (i--)
removeEvent(element, eventName, entries[i].responder);
}
}
function stopObservingEventName(element, eventName) {
var registry = getRegistryForElement(element);
var entries = registry[eventName];
if (!entries) return;
delete registry[eventName];
var i = entries.length;
while (i--)
removeEvent(element, eventName, entries[i].responder);
}
function removeEvent(element, eventName, handler) {
if (isCustomEvent(eventName))
stopObservingCustomEvent(element, eventName, handler);
else
stopObservingStandardEvent(element, eventName, handler);
}
function getFireTarget(element) {
if (element !== document) return element;
if (document.createEvent && !element.dispatchEvent)
return document.documentElement;
return element;
}
function fire(element, eventName, memo, bubble) {
element = getFireTarget($(element));
if (Object.isUndefined(bubble)) bubble = true;
memo = memo || {};
var event = fireEvent(element, eventName, memo, bubble);
return Event.extend(event);
}
function fireEvent_DOM(element, eventName, memo, bubble) {
var event = document.createEvent('HTMLEvents');
event.initEvent('dataavailable', bubble, true);
event.eventName = eventName;
event.memo = memo;
element.dispatchEvent(event);
return event;
}
function fireEvent_IE(element, eventName, memo, bubble) {
var event = document.createEventObject();
event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
event.eventName = eventName;
event.memo = memo;
element.fireEvent(event.eventType, event);
return event;
}
var fireEvent = document.createEvent ? fireEvent_DOM : fireEvent_IE;
Event.Handler = Class.create({
initialize: function (element, eventName, selector, callback) {
this.element = $(element);
this.eventName = eventName;
this.selector = selector;
this.callback = callback;
this.handler = this.handleEvent.bind(this);
},
start: function () {
Event.observe(this.element, this.eventName, this.handler);
return this;
},
stop: function () {
Event.stopObserving(this.element, this.eventName, this.handler);
return this;
},
handleEvent: function (event) {
var element = Event.findElement(event, this.selector);
if (element) this.callback.call(this.element, event, element);
}
});
function on(element, eventName, selector, callback) {
element = $(element);
if (Object.isFunction(selector) && Object.isUndefined(callback)) {
callback = selector, selector = null;
}
return new Event.Handler(element, eventName, selector, callback).start();
}
Object.extend(Event, Event.Methods);
Object.extend(Event, {
fire: fire,
observe: observe,
stopObserving: stopObserving,
on: on
});
Element.addMethods({
fire: fire,
observe: observe,
stopObserving: stopObserving,
on: on
});
Object.extend(document, {
fire: fire.methodize(),
observe: observe.methodize(),
stopObserving: stopObserving.methodize(),
on: on.methodize(),
loaded: false
});
if (GLOBAL.Event) Object.extend(window.Event, Event);
else GLOBAL.Event = Event;
GLOBAL.Event.cache = {};
function destroyCache_IE() {
GLOBAL.Event.cache = null;
}
if (window.attachEvent)
window.attachEvent('onunload', destroyCache_IE);
DIV = null;
docEl = null;
})(this);
(function (GLOBAL) {
var docEl = document.documentElement;
var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
&& 'onmouseleave' in docEl;
function isSimulatedMouseEnterLeaveEvent(eventName) {
return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
(eventName === 'mouseenter' || eventName === 'mouseleave');
}
function createResponder(uid, eventName, handler) {
if (Event._isCustomEvent(eventName))
return createResponderForCustomEvent(uid, eventName, handler);
if (isSimulatedMouseEnterLeaveEvent(eventName))
return createMouseEnterLeaveResponder(uid, eventName, handler);
return function (event) {
if (!Event.cache) return;
var element = Event.cache[uid].element;
Event.extend(event, element);
handler.call(element, event);
};
}
function createResponderForCustomEvent(uid, eventName, handler) {
return function (event) {
var element = Event.cache[uid].element;
if (Object.isUndefined(event.eventName))
return false;
if (event.eventName !== eventName)
return false;
Event.extend(event, element);
handler.call(element, event);
};
}
function createMouseEnterLeaveResponder(uid, eventName, handler) {
return function (event) {
var element = Event.cache[uid].element;
Event.extend(event, element);
var parent = event.relatedTarget;
while (parent && parent !== element) {
try { parent = parent.parentNode; }
catch (e) { parent = element; }
}
if (parent === element) return;
handler.call(element, event);
}
}
GLOBAL.Event._createResponder = createResponder;
docEl = null;
})(this);
(function (GLOBAL) {
var TIMER;
function fireContentLoadedEvent() {
if (document.loaded) return;
if (TIMER) window.clearTimeout(TIMER);
document.loaded = true;
document.fire('dom:loaded');
}
function checkReadyState() {
if (document.readyState === 'complete') {
document.detachEvent('onreadystatechange', checkReadyState);
fireContentLoadedEvent();
}
}
function pollDoScroll() {
try {
document.documentElement.doScroll('left');
} catch (e) {
TIMER = pollDoScroll.defer();
return;
}
fireContentLoadedEvent();
}
if (document.readyState === 'complete') {
fireContentLoadedEvent();
return;
}
if (document.addEventListener) {
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
} else {
document.attachEvent('onreadystatechange', checkReadyState);
if (window == top) TIMER = pollDoScroll.defer();
}
Event.observe(window, 'load', fireContentLoadedEvent);
})(this);
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = { display: Element.toggle };
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
Before: function (element, content) {
return Element.insert(element, { before: content });
},
Top: function (element, content) {
return Element.insert(element, { top: content });
},
Bottom: function (element, content) {
return Element.insert(element, { bottom: content });
},
After: function (element, content) {
return Element.insert(element, { after: content });
}
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
includeScrollOffsets: false,
prepare: function () {
this.deltaX = window.pageXOffset
|| document.documentElement.scrollLeft
|| document.body.scrollLeft
|| 0;
this.deltaY = window.pageYOffset
|| document.documentElement.scrollTop
|| document.body.scrollTop
|| 0;
},
within: function (element, x, y) {
if (this.includeScrollOffsets)
return this.withinIncludingScrolloffsets(element, x, y);
this.xcomp = x;
this.ycomp = y;
this.offset = Element.cumulativeOffset(element);
return (y >= this.offset[1] &&
y < this.offset[1] + element.offsetHeight &&
x >= this.offset[0] &&
x < this.offset[0] + element.offsetWidth);
},
withinIncludingScrolloffsets: function (element, x, y) {
var offsetcache = Element.cumulativeScrollOffset(element);
this.xcomp = x + offsetcache[0] - this.deltaX;
this.ycomp = y + offsetcache[1] - this.deltaY;
this.offset = Element.cumulativeOffset(element);
return (this.ycomp >= this.offset[1] &&
this.ycomp < this.offset[1] + element.offsetHeight &&
this.xcomp >= this.offset[0] &&
this.xcomp < this.offset[0] + element.offsetWidth);
},
overlap: function (mode, element) {
if (!mode) return 0;
if (mode == 'vertical')
return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
element.offsetHeight;
if (mode == 'horizontal')
return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
element.offsetWidth;
},
cumulativeOffset: Element.Methods.cumulativeOffset,
positionedOffset: Element.Methods.positionedOffset,
absolutize: function (element) {
Position.prepare();
return Element.absolutize(element);
},
relativize: function (element) {
Position.prepare();
return Element.relativize(element);
},
realOffset: Element.Methods.cumulativeScrollOffset,
offsetParent: Element.Methods.getOffsetParent,
page: Element.Methods.viewportOffset,
clone: function (source, target, options) {
options = options || {};
return Element.clonePosition(target, source, options);
}
};
if (!document.getElementsByClassName) document.getElementsByClassName = function (instanceMethods) {
function iter(name) {
return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
}
instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
function (element, className) {
className = className.toString().strip();
var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
} : function (element, className) {
className = className.toString().strip();
var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
if (!classNames && !className) return elements;
var nodes = $(element).getElementsByTagName('*');
className = ' ' + className + ' ';
for (var i = 0, child, cn; child = nodes[i]; i++) {
if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
(classNames && classNames.all(function (name) {
return !name.toString().blank() && cn.include(' ' + name + ' ');
}))))
elements.push(Element.extend(child));
}
return elements;
};
return function (className, parentElement) {
return $(parentElement || document.body).getElementsByClassName(className);
};
}(Element.Methods);
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
initialize: function (element) {
this.element = $(element);
},
_each: function (iterator, context) {
this.element.className.split(/\s+/).select(function (name) {
return name.length > 0;
})._each(iterator, context);
},
set: function (className) {
this.element.className = className;
},
add: function (classNameToAdd) {
if (this.include(classNameToAdd)) return;
this.set($A(this).concat(classNameToAdd).join(' '));
},
remove: function (classNameToRemove) {
if (!this.include(classNameToRemove)) return;
this.set($A(this).without(classNameToRemove).join(' '));
},
toString: function () {
return $A(this).join(' ');
}
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function () {
window.Selector = Class.create({
initialize: function (expression) {
this.expression = expression.strip();
},
findElements: function (rootElement) {
return Prototype.Selector.select(this.expression, rootElement);
},
match: function (element) {
return Prototype.Selector.match(element, this.expression);
},
toString: function () {
return this.expression;
},
inspect: function () {
return "#<Selector: " + this.expression + ">";
}
});
Object.extend(Selector, {
matchElements: function (elements, expression) {
var match = Prototype.Selector.match,
results = [];
for (var i = 0, length = elements.length; i < length; i++) {
var element = elements[i];
if (match(element, expression)) {
results.push(Element.extend(element));
}
}
return results;
},
findElement: function (elements, expression, index) {
index = index || 0;
var matchIndex = 0, element;
for (var i = 0, length = elements.length; i < length; i++) {
element = elements[i];
if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
return Element.extend(element);
}
}
},
findChildElements: function (element, expressions) {
var selector = expressions.toArray().join(', ');
return Prototype.Selector.select(selector, element || document);
}
});
})();

// Source and license: http://stacktracejs.org/
function printStackTrace(b){var c=(b&&b.e)?b.e:null;var e=b?!!b.guess:true;var d=new printStackTrace.implementation();var a=d.run(c);return(e)?d.guessFunctions(a):a}printStackTrace.implementation=function(){};printStackTrace.implementation.prototype={run:function(a){a=a||(function(){try{var c=__undef__<<1}catch(d){return d}})();var b=this._mode||this.mode(a);if(b==="other"){return this.other(arguments.callee)}else{return this[b](a)}},mode:function(a){if(a["arguments"]){return(this._mode="chrome")}else{if(window.opera&&a.stacktrace){return(this._mode="opera10")}else{if(a.stack){return(this._mode="firefox")}else{if(window.opera&&!("stacktrace" in a)){return(this._mode="opera")}}}}return(this._mode="other")},instrumentFunction:function(a,b,c){a=a||window;a["_old"+b]=a[b];a[b]=function(){c.call(this,printStackTrace());return a["_old"+b].apply(this,arguments)};a[b]._instrumented=true},deinstrumentFunction:function(a,b){if(a[b].constructor===Function&&a[b]._instrumented&&a["_old"+b].constructor===Function){a[b]=a["_old"+b]}},chrome:function(a){return a.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@").split("\n")},firefox:function(a){return a.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^\(/gm,"{anonymous}(").split("\n")},opera10:function(g){var k=g.stacktrace;var m=k.split("\n"),a="{anonymous}",h=/.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i,d,c,f;for(d=2,c=0,f=m.length;d<f-2;d++){if(h.test(m[d])){var l=RegExp.$6+":"+RegExp.$1+":"+RegExp.$2;var b=RegExp.$3;b=b.replace(/<anonymous function\:?\s?(\S+)?>/g,a);m[c++]=b+"@"+l}}m.splice(c,m.length-c);return m},opera:function(h){var c=h.message.split("\n"),b="{anonymous}",g=/Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i,f,d,a;for(f=4,d=0,a=c.length;f<a;f+=2){if(g.test(c[f])){c[d++]=(RegExp.$3?RegExp.$3+"()@"+RegExp.$2+RegExp.$1:b+"()@"+RegExp.$2+":"+RegExp.$1)+" -- "+c[f+1].replace(/^\s+/,"")}}c.splice(d,c.length-d);return c},other:function(h){var b="{anonymous}",g=/function\s*([\w\-$]+)?\s*\(/i,a=[],d=0,e,c;var f=10;while(h&&a.length<f){e=g.test(h.toString())?RegExp.$1||b:b;c=Array.prototype.slice.call(h["arguments"]);a[d++]=e+"("+this.stringifyArguments(c)+")";h=h.caller}return a},stringifyArguments:function(b){for(var c=0;c<b.length;++c){var a=b[c];if(a===undefined){b[c]="undefined"}else{if(a===null){b[c]="null"}else{if(a.constructor){if(a.constructor===Array){if(a.length<3){b[c]="["+this.stringifyArguments(a)+"]"}else{b[c]="["+this.stringifyArguments(Array.prototype.slice.call(a,0,1))+"..."+this.stringifyArguments(Array.prototype.slice.call(a,-1))+"]"}}else{if(a.constructor===Object){b[c]="#object"}else{if(a.constructor===Function){b[c]="#function"}else{if(a.constructor===String){b[c]='"'+a+'"'}}}}}}}}return b.join(",")},sourceCache:{},ajax:function(a){var b=this.createXMLHTTPObject();if(!b){return}b.open("GET",a,false);b.setRequestHeader("User-Agent","XMLHTTP/1.0");b.send("");return b.responseText},createXMLHTTPObject:function(){var c,a=[function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var b=0;b<a.length;b++){try{c=a[b]();this.createXMLHTTPObject=a[b];return c}catch(d){}}},isSameDomain:function(a){return a.indexOf(location.hostname)!==-1},getSource:function(a){if(!(a in this.sourceCache)){this.sourceCache[a]=this.ajax(a).split("\n")}return this.sourceCache[a]},guessFunctions:function(b){for(var d=0;d<b.length;++d){var h=/\{anonymous\}\(.*\)@(\w+:\/\/([\-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;var g=b[d],a=h.exec(g);if(a){var c=a[1],f=a[4];if(c&&this.isSameDomain(c)&&f){var e=this.guessFunctionName(c,f);b[d]=g.replace("{anonymous}",e)}}}return b},guessFunctionName:function(a,c){try{return this.guessFunctionNameFromLines(c,this.getSource(a))}catch(b){return"getSource failed with url: "+a+", exception: "+b.toString()}},guessFunctionNameFromLines:function(h,f){var c=/function ([^(]*)\(([^)]*)\)/;var g=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;var b="",d=10;for(var e=0;e<d;++e){b=f[h-e]+b;if(b!==undefined){var a=g.exec(b);if(a&&a[1]){return a[1]}else{a=c.exec(b);if(a&&a[1]){return a[1]}}}}return"(?)"}};
/**
 * Event.simulate(@element, eventName[, options]) -> Element
 * 
 * - @element: element to fire event on
 * - eventName: name of event to fire (only MouseEvents and HTMLEvents interfaces are supported)
 * - options: optional object to fine-tune event properties - pointerX, pointerY, ctrlKey, etc.
 *
 *    $('foo').simulate('click'); // => fires "click" event on an element with id=foo
 *
 **/
(function(){
  
  var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
  }
  var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }
  
  Event.simulate = function(element, eventName) {
    var options = Object.extend(Object.clone(defaultOptions), arguments[2] || { });
    var oEvent, eventType = null;
    
    element = $(element);
    
    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
      throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
      oEvent = document.createEvent(eventType);
      if (eventType == 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      }
      else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
      }
      element.dispatchEvent(oEvent);
    }
    else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      oEvent = Object.extend(document.createEventObject(), options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  }
  
  Element.addMethods({ simulate: Event.simulate });
})();
// Additional prototype Element methods
Element.addMethods({
    pad: function (element, tagName) {
        element.innerHTML = '<' + tagName + '>' + element.innerHTML + '</' + tagName + '>';
        return $(element).down(tagName);
    },
  
  // Make all child elements on the same row the same height. Generally used with lists
  // Selector is the selector to use for child elements, defaulting to "> li".
  equaliseHeight: function (container, selector, padding) {
    var container = $(container),
      els = container.select(selector || '> li'),
      currentRow = [],
      maxRowHeight = 0, padding = padding || 0, currentX;
      
    els.each(function(el) {
      // Reset the height if one exists
      el.setStyle({ height: null });
    
      var left = el.measure('left'),
        height = el.measure('height');
      
      // Moving to a new row?
      if (currentX > left) {
        //console.log(' -- New row, set heights to ' + maxRowHeight);
        // Set the height on all the items in the current row
        currentRow.invoke('setStyle', { height: (maxRowHeight + padding) + 'px' });
        // Start fresh
        maxRowHeight = 0;
        currentRow = [];
      }

      // Is this item taller than the current max?
      if (height > maxRowHeight)
        maxRowHeight = height;
      
      currentRow.push(el);
      currentX = left;
      
      //console.log('ID = ' + el.id + ', height = ' + height + ', left = ' + left + ', current max = ' + maxRowHeight);
    });
    
    // Ensure the last row is updated
    currentRow.invoke('setStyle', { height: (maxRowHeight + padding) + 'px' });
    
    return container;
  },
    clearClassNames: function (element) {
        element = $(element);
        element.className = '';
        return element;
    },
    
    dataAttributesToObject: function (el) {
      var el = $(el);
      var output = {};

      $A(el.attributes)
      // Only include attributes that begin with "data-"
      .filter(function (attrib) { return attrib.name.substr(0, 5) == 'data-' })
      .each(function (attrib) {
        var name = attrib.name.replace('data-', '').camelize();
        output[name] = attrib.value;
      });

      return output;
    }
});

// CSS gradients
(function() {
  var setLinearGradient;
  
  // Figure out what prefix the current browser uses for gradients
  var tempEl = new Element('div');
  tempEl.style.cssText = 
  'background-image: -moz-linear-gradient(top, red 0%, white 100%); \
  background-image: -webkit-linear-gradient(top, red 0%, white 100%); \
  background-image: -o-linear-gradient(top, red 0%, white 100%); \
  background-image: -ms-linear-gradient(top, red 0%, white 100%); \
  background-image: linear-gradient(top, red 0%, white 100%);';
  
  var bgCss = tempEl.style.backgroundImage;
  
  // CSS gradients no supported? setGradient is a no-op.
  if (!bgCss || bgCss.indexOf('linear-') == -1) {
    Element.supportsLinearGradient = false;
    setLinearGradient = function () {};
  } else {
    Element.supportsLinearGradient = true;
    // Find the prefix
    var prefix = bgCss.substring(0, bgCss.indexOf('linear-'));
    
    setLinearGradient = function (element, gradients) {
      var element = $(element),
        gradients = gradients.split(';'),
        gradientsCss = [];
        
      if (!element)
        return;
        
      gradients.each(function (gradient) {
        gradientsCss.push(prefix + 'linear-gradient(' + gradient.trim() + ')');
      });
      
      //console.log(gradientsCss.join(', '));
      element.style.backgroundImage = gradientsCss.join(', ');
      return element;
    };
  }
  
  Element.addMethods({ setLinearGradient: setLinearGradient });
})();
var Util = {
    translate: function (key) {

        // If we're in translator mode, just return the key with tildes around it
        if (window.Page && Page.translateMode)
            return '~' + key.toUpperCase() + '~';

        // If the language dictionary is not loaded, just return the key
        if (!window.LanguageDictionary)
            return key;

        // Does this item exist?
        if (LanguageDictionary.hasOwnProperty(key))
            return LanguageDictionary[key];

        // Item wasn't found
        // If in debug mode, warn about it
        if (Page.debug)
            Util.warn('Item not found in language dictionary: ' + key);

        return key;
    },
    extend: function (destination, source) {
        for (var property in source || {})
            destination[property] = source[property];
        return destination;
    },
    toFloat: function (value) {
        value = String(value).trim();
        value = value.replace(/[^\d\.]/g, '');
        return (value == '') ? null : Number(value).toFixed(2);
    },
    roundNumber: function (number, digits) {
        var multiple = Math.pow(10, digits);
        var rndedNum = Math.round(number * multiple) / multiple;
        return rndedNum;
    },
    toDollar: function (value, decimals) {
        if (isNaN(value)) return null;
        if (decimals === undefined) decimals = 2;
        value = Number(value).toFixed(decimals);
        value = Util.addCommasForThousands(value);
        return '$' + value;
    },
    toPercentage: function (value) {
        if (isNaN(value)) return null;
        value = Number(value).toFixed(2);
        return value + '%';
    },
    toBool: function (value) {
        if (value == null || value === 'undefined')
            return false;
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number' && value >= 1) {
            return true;
        }
        if (typeof value === 'string' && value.toLowerCase() == 'true') {
            return true;
        }
        return false;
    },
    toNullableBool: function (value) {
        if (value == null || value === 'undefined')
            return null;
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number' && value >= 1) {
            return true;
        }
        if (typeof value === 'number' && value <= 0) {
            return false;
        }
        if (typeof value === 'string' && value.toLowerCase() == 'true') {
            return true;
        }
        else if (typeof value === 'string' && value.toLowerCase() == 'false') {
            return false;
        }
        return null;
    },
    isPercentage: function (value) {
        var regex = new RegExp("^\[0-9]+(\\.[0-9]+)?%?$");
        return regex.test(value);
    },
    isDollar: function (value) {
        var regex = new RegExp("^\\$?\[0-9]+(\\.[0-9]+)?$");
        return regex.test(value);
    },
    addCommasForThousands: function (nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    setCookie: function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    getCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function (name) {
        Util.createCookie(name, "", -1);
    },

    // Below URL gets set in inline <script> tag in page.
    errorHandlerUrl: (window.location.pathname.toLowerCase().indexOf('/beta') === 0 ? '/beta' : '') + '/_js/ErrorLogger.ashx',
    // Handle JavaScript errors - Log them to the database
    errorHandler: function (msg, url, lineNumber, col, error) {
        try {
            // Don't log "Script error." if there's no other information (URL or line number) as
            // these are practically impossible to debug
            // Bugs life: Ignore errors on line 1
            if ((!url || url === 'undefined') || (!lineNumber || lineNumber === '0' || lineNumber === '1' || lineNumber === 0 || lineNumber === 1))
                return;

            // IE10 throws this but we can't work out why, and can't replicate.
            // Doesn't seem to affect page
            if (msg === 'NotFoundError' && lineNumber == 1) {
                return;
            }

            var stacktrace;
            try {
                stacktrace = error.stack;  
            }
            catch (ex) {
                stacktrace = 'Not available';
            }

            // Errors due to chrome extensions and internal Chrome functions like "extractForms" are not our fault!
            if (stacktrace.indexOf('chrome-extension://') !== -1 || stacktrace.indexOf('extractForms') !== -1) {
                return;
            }

            Util.postErrorHandler(msg, url, lineNumber, stacktrace);
        }
        catch (ex) {
            // Bugs Life: Don't show the users as they can't do anything about error handler caused an error!
        }

        return false;
    },
    postErrorHandler: function (msg, url, lineNumber, stacktrace) {
        try {
            new Ajax.Request(Util.errorHandlerUrl, {
                method: 'post',
                parameters: {
                    sErrorMessage: msg,
                    sAffectedPage: location.pathname,
                    sQueryString: location.search,
                    sJavaScriptFile: url,
                    lLine: lineNumber,
                    sStackTrace: stacktrace,
                    sReferer: document.referrer,
                    sFormData: Util.getAllFormData()
                }
            });
        }
        catch (ex) {
            // Oops, the error handler caused an error!
            alert('Error occured while handling error: ' + (ex.message || ex) + ' for error ' + msg);
        }

        return false;
    },
    log: function () {
        // Only log in debug mode if we have a console
        if (!Page.debug || !window.console)
            return;

        // Pass the call straight through to console.log
        if (console.log.apply)
            console.log.apply(console, arguments);
        else {
            // In Internet Explorer, console.log isn't a regular function.
            // It doesn't inherit from the Function prototype (console.log instanceof Function returns false).
            // so you can't do .apply(...). IE you kill me. :(
            var fnCall = 'console.log(' + Object.toJSON(Util.toArray(arguments)) + ')';
            eval(fnCall);
        }
    },
    warn: function (msg) {
        if (Page.debug)
            console.warn(msg);

        // Just pass through to the errorHandler script to log to the server.
        Util.errorHandler(msg);
    },
    forEach: function (items, fn) {
        for (var i = 0, ii = items.length; i < ii; i++) fn(items[i]);
    },
    toArray: function (items) {
        var results = [];
        Util.forEach(items, function (item) {
            results.push(item);
        });
        return results;
    },
    parseHTML: function (html) {
        var el, tag;
        html = html.trim();
        tag = html.substr(html.indexOf('<') + 1, html.indexOf('>') - 1);
        if (tag == 'tr') {
            el = document.createElement('div');
            el.innerHTML = '<table><tbody>' + html + '</tbody></table>';
            el = el.childNodes[0].childNodes[0];
        }
        else if (tag == 'li') {
            el = document.createElement('ul');
            el.innerHTML = html;
        }
        else {
            el = document.createElement('div');
            el.innerHTML = html;
        }
        return Util.toArray(el.childNodes);
    },
    appendHTML: function (parent, html) {
        var children = Util.parseHTML(html);
        Util.forEach(children, function (child) {
            parent.appendChild(child);
        });
    },
    generateGuid: function () {
        // From http://stackoverflow.com/a/2117523/210370
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    queryStringParams: function () {
        var urlParams = {},
      match,
      pl = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
      query = window.location.search.substring(1);

        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }

        return urlParams;
    },
    deepClone: function (data) {
        return Object.toJSON(data).evalJSON();
    },
    // get all form data
    getAllFormData: function () {
        var data = '';

        if ($$('form').length > 0) {
            for (var i = 0; i < $$('form').length; i++) {
                data += $$('form')[i].serialize();
            }
        }

        return data;
    },

    isMobileSafari: function () {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
    },
    formatForUrl: function (value) {
        return value
      .toLowerCase()
        // Underscores are used to separate the ID and title and will break the URL if used in the title. Replace them with hyphens.
      .replace(/_/g, ' ')
        // Remove any unwanted characters
      .replace(/[^\w\s]/g, '')
        // Trim whitespace from the ends
      .trim()
        // Replace all other whitespace with hyphens
      .replace(/\s+/g, '-');
    },

    /**
    * From http://stackoverflow.com/a/9493060/210370
    * Converts an HSL color value to RGB. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes h, s, and l are contained in the set [0, 1] and
    * returns r, g, and b in the set [0, 255].
    *
    * @param   Number  h       The hue
    * @param   Number  s       The saturation
    * @param   Number  l       The lightness
    * @return  Array           The RGB representation
    */
    hslToRgb: function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    },
    rgb2hex: function (rgb) {
        if (rgb.search("rgb") == -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    },
    isMobile: function () {
        var index = navigator.appVersion.indexOf("Mobile");
        if (index == -1) {
            return false;
        } else {
            return true;
        }
    },
    getSubString: function (string, length) {
        if (string.length > length) {
            return string = string.substring(0, length) + "...";
        }
        else {
            return string;
        }
    },
    escapeHtml: function (string) {

        // WOWW IE IS SO GUD
        var pre = document.createElement("pre");

        pre.appendChild(document.createTextNode(string));

        return pre.innerHTML;
    },
    uniqueBy: function (arr, fn) {
        var unique = {};
        var distinct = [];
        arr.forEach(function (x) {
            var key = fn(x);
            if (!unique[key]) {
                distinct.push(key);
                unique[key] = true;
            }
        });
        return distinct;
    },

    updateQueryString: function (key, value, url) {
        http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter#answer-11654596

            if (!url) url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    },

    resizeContainer: function(resizeFunc, resizehandlerName) {

        var resizeTimer;

        var resizer = function () {
            this.name = resizehandlerName;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeFunc, 100);
        };

        var handlerRefObj = { name: resizehandlerName, functionHandler: resizer};
        this.addResizeEventHandler(handlerRefObj);

    },

    clearResizeContainer: function (resizehandlerName) {
        var arrayObjIndex;

        for (var i = 0; i < this.EventHandlerArray.length; i++) {
            if (this.EventHandlerArray[i]['name'] === resizehandlerName) {
                arrayObjIndex = i;
                break;
            }
        }
   
        if (arrayObjIndex !=null && arrayObjIndex >= 0) {
            var arrayObj = this.EventHandlerArray[arrayObjIndex];
            Event.stopObserving(window, 'resize', arrayObj["functionHandler"]);

            //remove from tracking array
            this.EventHandlerArray.splice(arrayObjIndex,1);
        }
    },

    addResizeEventHandler: function (arrayObj) {

        var containsKey = false;
        for (var i = 0; i < this.EventHandlerArray.length; i++) {
            if (this.EventHandlerArray[i]['name'] === arrayObj["name"]) {
                containsKey = true;
                break;
            }
        }

        if (containsKey == false) {
            this.EventHandlerArray.push(arrayObj);
            Event.observe(window, 'resize', arrayObj["functionHandler"]);
        }
    },

    addEvent: function (obj, type, fn) {
        if (obj && obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj && obj.attachEvent) {
            obj.attachEvent('on' + type, fn);
        }
    }

};


// Holds reference to the observed resize funtion handlers, allows us to have multiple functions
// observing the resize event but to unobserve specific handlers rather than all in one hit
Util.EventHandlerArray = [];

// Backwards compatibility ("T" shouldn't be uppercase)
Util.Translate = Util.translate;

Util.IEVersion = (function () {
    var undef, v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');
    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
    return v > 4 ? v : undef;
}());

Util.ChosenCompatible = (function () {
    return (Util.IEVersion != 6 && Util.IEVersion != 7 && !Util.isMobile());
}());

// IE 10 no longer supports conditional comments in HTML, but does support JavaScript conditional comments
// This will have to be revisited once IE 11 comes out... :(
if (/*@cc_on!@*/false && !Util.IEVersion) {
    Util.IEVersion = 10;
    document.documentElement.className = document.documentElement.className.replace('non-ie', 'ie ie10');
}

// IE 11 no longer supports conditional comments in Javascript, and the userAgent name has changed
// This will have to be revisited once IE 12 comes out... :(
if (!!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/))) {
    Util.IEVersion = navigator.userAgent.match(/(rv:\d\d)/gi)[0].replace('rv:', '');
}

if (Util.IEVersion) Util.emptyHTML = function (el) {
    while (el.hasChildNodes()) el.removeChild(el.lastChild);
}
else Util.emptyHTML = function (el) {
    el.innerHTML = '';
}
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, ''); // IE you kill me.
    }
}


window.onerror = Util.errorHandler;

// Native prototype extensions
String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Date.prototype.AddDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.AddHours = function (hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

Date.prototype.AddMilliseconds = function (milliseconds) {
    this.setMilliseconds(this.getMilliseconds() + milliseconds);
    return this;
};

Date.prototype.AddMinutes = function (minutes) {
    this.setMinutes(this.getMinutes() + minutes, this.getSeconds(), this.getMilliseconds());
    return this;
};

Date.prototype.AddMonths = function (months) {
    this.setMonth(this.getMonth() + months, this.getDate());
    return this;
};

Date.prototype.AddSeconds = function (seconds) {
    this.setSeconds(this.getSeconds() + seconds, this.getMilliseconds());
    return this;
};

Date.prototype.AddYears = function (years) {
    this.setFullYear(this.getFullYear() + years);
    return this;
};


// Based off https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
    Object.create = function (o) {
        function F() { }
        F.prototype = o;
        return new F();
    };
}

// Add the MVC AntiForgeryToken ('__RequestVerificationToken') to all AJAX POST Request Headers to mitigate Cross Site Request Forgery
Ajax.Request.prototype.setRequestHeaders =
    Ajax.Request.prototype.setRequestHeaders.wrap(
        function (original) {

            // This sometimes caused a crash in IE8, wrap in try/catch
            try {
                // Do extra stuff first
                if (this.method.toLowerCase() === 'post') {
                    var requestVerificationToken = $$('[name="__RequestVerificationToken"]');
                    if (typeof requestVerificationToken[0] !== "undefined")
                        this.transport.setRequestHeader('x-request-verification-token', requestVerificationToken[0].value);
                    else
                        this.transport.setRequestHeader('x-request-verification-token', 'This value might be required! Add <%= PupAntiForgeryTokensExtension.PupAntiForgeryTokens() %> in asp.net or @Html.PupAntiForgeryTokens() in asp.net mvc.');

                    var antiXsrfToken = $$('[name="__AntiXsrfToken"]');
                    if (typeof antiXsrfToken[0] !== "undefined")
                        this.transport.setRequestHeader('x-anti-xsrf-token', antiXsrfToken[0].value);
                    else
                        this.transport.setRequestHeader('x-anti-xsrf-token', 'This value might be required in classic ASP! Call SetAntiXsrfTokenHtml() in classic asp.');
                }
            } catch (err) {

            }

            // Then call original (as 'Ajax.Request.prototype.setRequestHeaders.wrap' replaces the original definition)
            original();
        });

// Callbacks shared by all Prototype AJAX requests - http://prototypejs.org/api/ajax/responders
Ajax.Responders.register({
    // Log exceptions in AJAX requests - Prototype eats them by default
    onException: function (requester, ex) {
        try {
            // Don't log exceptions if they were during error logging (don't want to get stuck in an infinite loop!)
            if (requester.url == Util.errorHandlerUrl)
                return;

            var msg = 'Exception in AJAX callback: ' + ex.name + ': ' + (ex.message || ex.description || ex.toString());
            var fileName = ex.fileName || '';
            var line = ex.lineNumber || 0;
            var stack = ex.stack || '';
            stack += '\n\nAJAX Request URL: ' + (requester.method || '').toUpperCase() + ' to ' + requester.url;
            stack += '\nPOST data: ' + requester.body;

            Util.postErrorHandler(msg, fileName, line, stack);

            // Ensure error appears in debug console
            if (window.console && console.error)
                console.error(stack || msg);
        } catch (innerEx) {
            // Oops, the error handler caused an error!
            alert('Error occured while handling error: ' + (innerEx.message || innerEx) + ' for error ' + msg);
        }
    }
});

(function () {
    // Make sure we don't break anything by leaving any console.log or console.warn calls in the JavaScript!
    if (!window.console)
        window.console = {};

    ['log', 'dir', 'error', 'debug', 'warn'].each(function (fn) {
        if (!window.console[fn])
            window.console[fn] = Prototype.emptyFunction
    });

    // Enable HTML5 elements in old IE
    if (Util.IEVersion < 9) {
        ['header', 'footer', 'section', 'aside', 'nav', 'article', 'time', 'hgroup'].each(function (tag) {
            document.createElement(tag);
        });
    }

    // Show loading indicators
    Ajax.Responders.register({
        onCreate: function () {
            if (document && document.body)
                $(document.body).addClassName('backgroundLoading');
        },
        onComplete: function () {
            if (document && document.body)
                $(document.body).removeClassName('backgroundLoading');
        }
    })
})();

var Controls = {

    init: function (container) {

        if (!container)
            return;

        // Matches "control-something"
        var typeRegex = /control-([a-z0-9\-]+)(\s|$)/gi;

        var controls = [];
        container.select('.init').each(function (el) {
            // Grab the control name based on class, and convert to PascalCase
            var removeInit = false;
            var cls = typeRegex.exec(el.className);
            while (cls && cls.length > 0) {
                var control_name = cls[1].camelize().ucfirst();
                try {
                    if (Page.debug) console.log('new Controls.' + control_name + '() for ' + el.identify());
                    var ctrl = new Controls[control_name](el);
                    controls.push(ctrl);
                    //can't remoe it now, 
                    //otherwise, typeRegex.lastIndex will be invalid since the classname is changed
                    removeInit = true;
                } catch(ex) {
                    alert('Could not load control ' + control_name + ': ' + (ex && ex.message));
                    throw 'Could not load control ' + control_name + ': ' + (ex && ex.message);
                }
                cls = typeRegex.exec(el.className);
            }

            if (removeInit) {
                el.removeClassName('init');
            }

        }, this);

        controls.each(function(ctrl, index) {
            if (ctrl.afterInit) {
                ctrl.afterInit();
            }
        });

        container.fire('pu:controlinitialized');
    }
};



/**
* Base class for all controls
*/
Controls.Base = Class.create({
    container: null,
    defaults: {},
    settings: null,

    /**
    * Initialise the control instance
    * @param  HTMLElement Container element for the control
    * @param  hash    Settings for the control (optional)
    */
    initialize: function (container, settings) {
        this.container = container;
        // Create a copy of the defaults, then extend them with the specified settings
        // Settings can come from data attributes, or from the settings parameter.
        this.settings = Object.clone(this.defaults);
        Util.extend(this.settings, container.dataAttributesToObject());
        if (settings) {
            Util.extend(this.settings, settings);
        }
        this.container.Control = this;
    }
});

var Page = {
    // Enable debug mode on development
    debug: location.hostname.indexOf('dev') !== -1,
    initialized: false,
    init: function (container) {
        container = $(container || document.body);

        //Red-773 MultiAdder must be called before controls.init
        if (typeof Controls.PUMultiAdder !== 'undefined') {
            if (!this._multiAdder) {
                this._multiAdder = new Controls.PUMultiAdder(container);
            }
            this._multiAdder.init(container);
        }

        Controls.init(container);
        Page.initialized = true;
    },
    loadPartial: function (container, url, options) {

        options = Util.extend({
            onComplete: function (xhr) {
                Page.init(container);

                options.onUpdate();
            },
            onUpdate: function () { },
            onFailure: function (xhr) {
                container.innerHTML = Util.translate('PARTIAL_PAGE_UPDATE_FAILURE');
            },
            method: 'post'
        }, options);
        new Ajax.Updater(container, url, options);
    },
    launchNewWindow: function (url, width, height) {
        var sWindowName = 'external';

        //20070516  HL  Case 8021 Launch new window 30px from top of screen
        var lWinLeft = (screen.width - width) / 2;
        var lWinTop = ((screen.availHeight - height) / 2) - 30;

        oWindow = window.open(url, sWindowName, 'width=' + width + ',height=' + height + ',resizable=yes,scrollbars=yes,menubar=no,status=yes,top=' + lWinTop + ',left=' + lWinLeft);
        setTimeout('oWindow.focus();', 250);
    },
    deleteFile: function (browseWrapperID, viewWrapperID, documentContainerID) {
        var browseWrapper = $(browseWrapperID);
        var viewWrapper = $(viewWrapperID);
        var documentContainer = $(documentContainerID);

        if(documentContainer) {documentContainer.value = ''; }

        if(viewWrapper) { viewWrapper.style.display = 'none'; }

        if(browseWrapper) { browseWrapper.style.display = ''; }
    },
    positionElementOnScreen: function (el) { },
  scrollToTop: function() {
    window.scrollTo(0, 0);
    // Are we not in an iframe? We're done.
    if (parent.window.location === window.location)
      return;
      
    // We're in an iframe, so we need to scroll to where the iframe is.
    // Find the iframe
    var iframe;
    parent.$$('iframe').each(function(el) {
      if (el.contentWindow.location === window.location)
        iframe = el;
    });
    // Ensure an iframe was found
    if (!iframe)
      return;
      
    // Scroll the parent to the top of the iframe
    parent.window.scrollTo(0, iframe.cumulativeOffset().top);
  },
    initAnalytics: function (instId, account) {
    window._gaq = [
      ['_setAccount', account],
      ['_trackPageview'],
      ['_trackEvent', 'Client', instId],
      ['_setCustomVar', 1, 'Client', instId, 1]
    ];
    // Load Google Analytics API asynchronously
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  },
    trackOnPageEvent: function (value) {
        var uniquePrefix = String.fromCharCode.apply(null, (new Date().getTime().toString()).match(/([0-9]{1,4})/g).map(function (x) { return Number(x) + 192; }));
        var fieldAnalyticsData = uniquePrefix + ";";
        if (document.querySelectorAll) {
            var trackedElements = document.querySelectorAll('*[data-analytics-track-as]');
            for (var trackedElementIndex = 0; trackedElementIndex < trackedElements.length; trackedElementIndex++) {
                var element = trackedElements[trackedElementIndex];
                var trackingName = element.getAttribute('data-analytics-track-as');
                var trackingValue = (element.nodeName.toUpperCase() === 'INPUT' && (element.getAttribute('type').toLowerCase() === 'checkbox' || element.getAttribute('type').toLowerCase() === 'radio') ? element.checked : element.value);
                trackingValue = (typeof trackingValue === 'undefined' || trackingValue === null) ? trackingValue = "" : String(trackingValue);
                fieldAnalyticsData += (trackingName || '').replace('[^a-zA-Z0-9]', '') + ':' + (trackingValue || '').replace('[^a-zA-Z0-9]', '') + ';';
            }
        }

        /* See:
         * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking
         * (all methods on there can also be window._gaq.push(['_trackEvent', ...params]) onto the async _gaq queue as well)
         * Also: https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables (expand 'Traditional (ga.js) Snippet' sections to see applicable code)
         */
        if (window._gat && typeof window._gat._getTrackers === 'function') {
            var trackers = window._gat._getTrackers();
            if (trackers && trackers[0]) {
                var tracker = trackers[0];
                tracker._setCustomVar(5, 'Fields', fieldAnalyticsData, 3);
                tracker._trackEvent(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1), value);
            }
        }
        else {
            window._gaq.push(['_setCustomVar', 5, 'Fields', fieldAnalyticsData, 3]);
            window._gaq.push(['_trackEvent', window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1), value])
            var _WebForm_DoPostBackWithOptions = WebForm_DoPostBackWithOptions;
            WebForm_DoPostBackWithOptions = function (args) { setTimeout(function () { _WebForm_DoPostBackWithOptions(args) }, 1000); }
        }
    },
    antiDoubleClick: function () {
        /*
        * James Rhodes, Case 00039513, 5/12/2012
        *
        * This fixes double-click issues on all submit buttons across the site.  When a submit button is
        * clicked, it is replaced with a clone that is disabled and the original is hidden.  This allows
        * the form submit to complete correctly.
        *
        * This code in theory should be safe to apply across the whole site, but for now should be
        * manually included on pages where double click issues are known (to avoid doing a re-test
        * of the entire site).
        */
        document.ready( function () {
            var buttons = $$("[type=submit]");
            buttons.each(function (b) {
                b.onclick = function () {
                    /* If we disable the button straight up, the form won't submit.  If we force
                    * a form submission after that, ASP.NET can't tell what buttons was pushed. */
                    var original = b;
                    var clone = b.cloneNode();
                    clone.id = "";
                    clone.name = "";
                    clone.disabled = true;
                    original.parentNode.insertBefore(clone, original);
                    original.style.display = "none";
                    return true;
                };
            });
        });
    },
    displayLoadingDiv: function(divLoading) {
        divLoading.style.display = "";
    }
}

document.ready( function () {
    Page.init();
});

var requests = [];

Event.observe(window, 'unload', function () {

    if (requests) {

        for (i = 0; i < requests.length; i++) {
            requests[i].onreadystatechange = function () { };
            requests[i].abort();
            Ajax.activeRequestCount--;

        }
    }
});
var newwin;
var oWindow;

// Set and read cookies (these functions copied from PageUpPeople\_js\login.js)
function ReadCookie(cookieName) {
    var theCookie = "" + document.cookie;
    var ind = theCookie.indexOf(cookieName);
    if (ind == -1 || cookieName == "") return "";
    var ind1 = theCookie.indexOf(';', ind);
    if (ind1 == -1) ind1 = theCookie.length;
    return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
}

function SetCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
  ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}

// Define the help URL. Used when calling the RH_ShowHelp to launch
// contextual help. (function is in RoboHelp_CSH.js)
var sHelpURL = '../help/help.asp?helpID=';

function launchwin(winurl,winname,winfeatures)
{
  newwin = window.open(winurl,winname,winfeatures);
  setTimeout('newwin.focus();',250);
}

//called when the logout button is pressed.
function logout(sURL)
{
  //If user is being controlled
  if(parent.frames["ControlPageUP"])
  {
    parent.document.location='../manageUsers/controlReturn.asp';
  }
  else
  {
    //changed to now just change the location to the url that's passed
    document.location = sURL;
  }
}

function timeMachine(oHistory)
{
  var sURL = oHistory[oHistory.selectedIndex].value;
  document.location = "../" + sURL;
}

function globalQuickSearchLaunch(oSearchItem, sSp)
{
  var sSearchItem = oSearchItem.value;
  var sNewSearchItem = oSearchItem.value;
  if (sSearchItem.length > 0)
  {
    if (sSearchItem.indexOf("&") > 0)
    {
      var aSearchItemArray = sSearchItem.split("&");
      sNewSearchItem = "";
      for (i = 0; i < aSearchItemArray.length; i++)
      {
        sNewSearchItem = sNewSearchItem + aSearchItemArray[i];
        if (i != (aSearchItemArray.length - 1))
        {
          sNewSearchItem = sNewSearchItem + escape('&');
        }
      }
    }
  }

  var sURL = "../quickSearch/quickSearchDialog.aspx?sp=" + sSp + "&sSearchItem=" + escape(sNewSearchItem)

  if (sSearchItem=="" || sSearchItem=="Quick Search"){
    alert("Please enter a value to search on.");
    oSearchItem.focus();
  }
  else {
    launchDefaultDialog(sURL);
  }

}

function globalQuickSearchRedirect(sUrl) {
    document.location = sUrl
}

function globalQuickSearchCheckEnter(Event,oSearchItem, sSp)
{
  if (Event.keyCode==13) {

    Event.returnValue = false;
    Event.cancel = true;

    globalQuickSearchLaunch(oSearchItem, sSp)
  }
}

//launches a dialog using dialog.asp
function launchDefaultDialog(sURL, lHeight, lWidth, bResize, bScroll)
{
  //call launchDialog and pass the url to dialog.asp with sURL encoded
  //20061204 - Wayne - Case 7060 - encrpytion was resulting in a + symbol at the end of sURL and the escape function doesn't encode +
  launchDialog("../dialog/dialog.asp?sSource=" + encodeURIComponent(sURL), lHeight, lWidth, bResize, bScroll);
}


function launchDialog(sURL, lHeight, lWidth, bResize, bScroll){
    var oArgs = new Object();
    var sParams;

    sParams = "status: yes; help: no; ";

    if (bResize)
    {
        sParams += "resizable: yes;";
    }
    else
    {
        sParams += "resizable: no;";
    }

    if (bScroll)
    {
        sParams += "scroll: yes;";
    }
    else
    {
        sParams += "scroll: no;";
    }

    //set defaults
    if (lHeight == null)
    {
      lHeight = 300;
    }
    if (lWidth == null)
    {
      lWidth = 600;
    }

    oArgs.oDocument = window;

   bFocus = false;
   window.showModalDialog(sURL, oArgs, "dialogWidth: " + lWidth + "px; dialogHeight: " + lHeight + "px; " + sParams);
  }

function getParentWindow()
{
  var oParentWindow;

  if (!parent.window.dialogArguments)
  {
    //window, not dialog
    oParentWindow = self.opener;
    
    //if the parent window has been closed return null because it no longer exists
    if (oParentWindow.closed)
    {
      oParentWindow = null;
    }
  }
  else
  {
    //dialog
    oParentWindow = parent.window.dialogArguments.oDocument;
  }

  return oParentWindow;
}

function closeDialog()
{
  parent.window.close();
}

function launchNewWindow(sURL, lHeight, lWidth, sWindowName)
{
  if (sWindowName == null)
  {
    sWindowName = 'external';
  }

  //20070516  HL  Case 8021 Launch new window 30px from top of screen
  var lWinLeft = (screen.width - lWidth) / 2;
  var lWinTop = ((screen.availHeight - lHeight) / 2) - 30;

  oWindow = window.open(sURL, sWindowName, 'width=' + lWidth + ',height=' + lHeight + ',resizable=yes,scrollbars=yes,menubar=no,status=yes,top=' + lWinTop + ',left=' + lWinLeft);
  setTimeout('oWindow.focus();',250);
}

function highlightRow(tableRow)
{
  tableRow.style.backgroundColor = "#DFDFDF";
}

function unHighlightRow(tableRow)
{
  tableRow.style.backgroundColor = "";
}

function saveState(objectID, value)
{
  document.cookie=(pageID + "." + objectID + "=" + value + ";expires=Tuesday, 30-Apr-2024 08:00:00 GMT");
}

//This is used for the resizeable dialogs. It resizes the dialog to the same size of the content
function SetDialogHeight()
{
  var lContentHeight;
  var intDialogHeight; 
  var strDialogHeight = window.dialogHeight;

  if (window.dialogHeight)
  {
    //take of px of the end of the height
    intDialogHeight = parseInt(strDialogHeight.substring(0,strDialogHeight.length - 2));

    //set content height from the scrollable height + the topbar and button area height
    lContentHeight = GetContentHeight();

    //add 10 pixels to the difference as we want some padding at the bottom of the content
    var intWindowDiff =  (intDialogHeight - document.body.offsetHeight) + 10;

    //resize the dialog.
    //Waynee: There is a bug in IE6 that causes in the window moving back to it's original position when the dialog was opened. Bug was fixed in IE7
    //Attempted to use self.screenLeft and self.screenTop to position it was too hard to get it not to move around
    window.dialogHeight = (lContentHeight + intWindowDiff) + "px";
  }
  else
  {
    //not a dialog, set window height 
    SetWindowHeight();
  }
}

//Convoluted function to get the window height in IE. (There is a window.dialogHeight property
//but not a window.height property. Why??)
function SetWindowHeight()
{
    var intLeft;
    var intTop;
    var lMaxHeight;
    var lContentHeight 
    
    //get the height of the page
    lContentHeight = GetContentHeight();
    
  //get the length and widht of the window padding (the grey stuff of the window)
    var objChromeDims = GetWindowChrome();
  
    var intOuterWidth = GetInnerWindowWidth() + objChromeDims.x;

    var lNewHeight = lContentHeight + objChromeDims.y;

    //set max height as available height - 10 for spacing
    lMaxHeight = screen.availHeight - 10;

    //make sure the height is not bigger than the available space on the screen
    if (lNewHeight > lMaxHeight)
    {
        lNewHeight = lMaxHeight;
    }
    
    //get the position to move to
    intLeft = (screen.width - intOuterWidth) / 2;
    intTop = (screen.availHeight - lNewHeight) / 2;

    //resize window
    window.resizeTo(intOuterWidth, lNewHeight);

    //move window to center of screen
    window.moveTo(intLeft, intTop);
}

//Gets the height of the content in a dialog
function GetContentHeight()
{
    var lHeight;
    var oContent = document.getElementById("page");
    
    //set content height from the scrollable height + the topbar and button area height
    lHeight = oContent.scrollHeight + GetTopBarHeight() + GetButtonAreaHeight();
    
    return lHeight;
}

//Returns the height and width of the space between the content of the window
//and the edge of the window
function GetWindowChrome()
{
  // IE doesn't support any properties for getting outer width
  // so need to use convoluted window resizing
  var lDiffX, lDiffY;
  var lWinX = GetInnerWindowWidth()
  var lWinY = GetInnerWindowHeight();;

  //resize the window to the size of the inner content
  window.resizeTo( lWinX, lWinY );

  //get the diff between before and after the resize
  lDiffX = lWinX - GetInnerWindowWidth();
  lDiffY = lWinY - GetInnerWindowHeight();

  //resize back to normal now that we have the diff
  window.resizeTo( lWinX + lDiffX, lWinY + lDiffY );


  //return an object containing "x" and "y" properties
  return {x:lDiffX, y:lDiffY};
}


//Returns the height of the document in the window
function GetInnerWindowHeight()
{
    var x,y;

    if (self.innerHeight) // all except Explorer
    {
          x = self.innerWidth;
          y = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight)
          // Explorer 6 Strict Mode
    {
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
    }
    else if (document.body) // other Explorers
    {
          x = document.body.clientWidth;
          y = document.body.clientHeight;
    }

    return y;
}


//Returns the width of the document in the window
function GetInnerWindowWidth()
{
    var x,y;

    if (self.innerHeight) // all except Explorer
    {
          x = self.innerWidth;
          y = self.innerHeight;
    }

    else if (document.documentElement && document.documentElement.clientHeight)
          // Explorer 6 Strict Mode
    {
          x = document.documentElement.clientWidth;
          y = document.documentElement.clientHeight;
    }
    else if (document.body) // other Explorers
    {
          x = document.body.clientWidth;
          y = document.body.clientHeight;
    }

    return x;
}

//get the height of the dialog top bar
function GetTopBarHeight()
{
  var oTopBarElement;
  var lTopBarHeight;

  lTopBarHeight = 0;

  oTopBarElement = document.getElementById("dialogTopBar");

  if (oTopBarElement)
  {
    lTopBarHeight = oTopBarElement.clientHeight;
  }

  return lTopBarHeight;
}

//get the height of the PUButtonArea
function GetButtonAreaHeight()
{
  var oButtonAreaElement;
  var lButtonAreaHeight;

  oButtonAreaElement = document.getElementById("PUButtonArea");
  lButtonAreaHeight = 0;

  if (oButtonAreaElement)
  {
    lButtonAreaHeight = oButtonAreaElement.clientHeight;
  }

  return lButtonAreaHeight;
}

//set the height of the scrollable section of the dialog
function setScrollableHeight()
{
  var oPageElement;
  var lDialogHeight;
  var lTopBarHeight;
  var lButtonAreaHeight;

  oPageElement = document.getElementById("page");

  //check whether to resize
  if (oPageElement)
  {
    lButtonAreaHeight = GetButtonAreaHeight();
    lTopBarHeight = GetTopBarHeight();

    //obtain dialog window height
    lHeight = document.body.clientHeight;


    //set the height of the scrollable div to the window height minus the padding
    oPageElement.style.height = (lHeight - lButtonAreaHeight - lTopBarHeight) + "px";
  }
}

// Returns the X position of an object
function getPosX(obj)
{
  var curleft = 0;
  if (obj.offsetParent)
  {
    while (obj.offsetParent)
    {
      curleft += obj.offsetLeft;
      obj = obj.offsetParent;
    }
  }
  else if (obj.x)
    curleft += obj.x;
  return curleft;
}

// Returns the Y position of an object
function getPosY(obj)
{
  var curtop = 0;
  if (obj.offsetParent)
  {
    while (obj.offsetParent)
    {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
  }
  else if (obj.y)
    curtop += obj.y;
  return curtop;
}

// Adds an event to an object, this function supports
// multiple browsers and should be used instead of document.attachEvent
function addEvent(obj, eventType, functionPointer){
  if(document.addEventListener){ // Mozilla and others
    obj.addEventListener(eventType, functionPointer, false);
  }
  else if(document.attachEvent){ // IE windows
    obj.attachEvent("on" + eventType, functionPointer);
  }
  else{ // IE mac
    eval("obj.on" + eventType + " = functionPointer");
  }
}

// Removes an event from an object
function removeEvent(obj, eventType, functionPointer){
  if(document.addEventListener){
    obj.removeEventListener(eventType, functionPointer, false);
  }
  else if(document.attachEvent){
    obj.detachEvent("on" + eventType, functionPointer);
  }
  else{
    eval("obj.on" + eventType + " = null");
  }
 } 

function launchHelp(sHelpID)
  {
    launchwin(sHelpURL + sHelpID, 'Help' ,'toolbar=no, height=800, width=1000');
  }

// Called by a dialog to tell the underlying page that data may have been updated
// It will show a 'Please refresh' message if this is the case.
function DataUpdated(strGridId)
{
    // If this is for a specific grid then display the refresh message for the grid
    if(document.getElementById("DataUpdated_" + strGridId))
    {
        document.getElementById("DataUpdated_" + strGridId).style.display = "";
    }
    // If this is for the whole page then display that message
    else if(document.getElementById("DataUpdated_"))
    {
        document.getElementById("DataUpdated_").style.display = "";
    }
}
 
// Refreshes the page, called by Grids and TreeViews
function RefreshNow()
{    
    // Set the innerhtml to nothing to make it look like it is refreshing
    document.body.innerHTML = '';
    url = document.location.toString();
    // Dialogs won't refresh if there is a hash in the URL
    url = url.replace("#","");
    document.location = url;
}

function ResizeDialog()
{
    if (window.resizable = 1)
    {
        SetDialogHeight();
    }
}

//gets a reference to the parent window, and checks if the guid passed in to this function matches
//the guid of the parent page.  if it does, return true - this will allow javascript functions to process
//data on the parent page.  If it's false, it shouldn't process data on the parent page because the parent may have changed.
function pageGUIDValid(strGUID)
{
  var blnValid;
  var objParent;
  
  blnValid = false;
  objParent = getParentWindow();
  
  if (objParent)
  {
    //check if guid exists - may have navigated away from pageup page in parent window.
    if (objParent.glb_sPageGUID)
    {
      if ((objParent.glb_sPageGUID.value == strGUID) && (objParent.glb_sPageGUID.value != ''))
      {
        blnValid = true;
      }
    }
  }
  
  return blnValid;
}

// This function is used to check if a form has been submitted to prevent multi submissions.
var bSubmit = false;

  function submitted()
  {
    if(bSubmit == false)
    {
      bSubmit = true;
      return true;
    }
    else
    {
      return false;
    }
  }


var Util = Util || {};
Util.Translate = function (key) {

    // If we're in translator mode, just return the key with tildes around it
    if (window.Page && Page.translateMode)
        return '~' + key.toUpperCase() + '~';

    // If the language dictionary is not loaded, just return the key
    if (!window.LanguageDictionary)
        return key;

    return LanguageDictionary.hasOwnProperty(key) ? LanguageDictionary[key] : key;
}
// This JScript File should contain all javascript used by controls

// MUST NOT USE PROTOTYPE FUNCTIONS as this is included in clients websites 
// and prototype can clash with existing scripts.

// *************************************************************************** //
// This section of the JS file contains generic javascript functions for
// manipulating controls
// *************************************************************************** //

//****************************************
// Function:  PUControl_ShowHideControl
// Purpose:   This function hides or displays the control specified in sID, depending on the value of the 
//            control oControl, and the value of oControl, specified by sValue.
//            If the value of oControl and sValue match, the control sID is displayed
// Param:     oControl - the control the user is interacting with
//            sValue - value you want oControl to be so sID is shown, otherwise it is hidden
//            sID - ID of the control you want to show/hide
// Returns:   none
//****************************************
function PUControl_ShowHideControl( oControl, sValue, sID)
{
   // Find the object
   var oObject = document.getElementById(sID);

   // Check if the value of oControl equals sValue
   if (oControl.value == sValue)
   {
     // Show the object
     oObject.style.display = "";
   }
   else
   {
     // Hide the object
     oObject.style.display = "none";
   }
}


//****************************************
// Function:  PUControl_ClearContols
// Purpose:   This function clears the values in oClearControls, if the value oControl matches sValue
// Param:     oControl - the control the user is interacting with
//            sValue - Value of which you want the control to be for the contols in oClearContols to then be cleared
//            oClearContols - IDs of the controls you want to clear
// Returns:   none
//****************************************
function PUControl_ClearContols(oControl, sValue, oClearContols )
{
  // Check if the value of oControl equals sValue
  if (oControl.value == sValue)
  {
    // Loop through the controls and clear their values
    for ( var lCounter=0, lSize=oClearContols.length; lCounter<lSize; ++lCounter )
    {
      document.getElementById(oClearContols[lCounter]).value = "";
    }
  }
}

// *************************************************************************** //
// This section of the JS file contains javascript functions used by PUFORM
// *************************************************************************** //

//****************************************
// Function:  PUFORM_UpdateCharactersRemaining
// Purpose:   This function updates the character text that follows a text box or text area
//            informing a user how many characters remaining when entering text into a control
// Param:     oControl - the control the user is entering text into
//            lmaxLength - Number of characters that are allowed
//            sCharCountLabel - Text that is displayed saying how many characters have been entered 
// Returns:   True if a character can't be added
//****************************************
function PUFORM_UpdateCharactersRemaining(oControl, lmaxLength, sCharCountLabel)
{
  var bClipped = false;
  
  //Check if we have reached the character limit
  if (oControl.value.length > lmaxLength)
  {
    // Yes, truncate the input to the limit
    oControl.value = oControl.value.substring(0,lmaxLength)

    // Update the text to say how many characters remaining, hightlighted in red
    document.getElementById(oControl.name + '_lCharCountLabel').innerHTML = '<font color="red">' + sCharCountLabel + ':</font>'
    document.getElementById(oControl.name + '_lCharCounter').innerHTML = '<font color="red">0</font>'
    bClipped = true;
  }
  else
  {
    // No, Update the text to say how many characters remaining
    document.getElementById(oControl.name + '_lCharCountLabel').innerHTML = sCharCountLabel + ':'
    document.getElementById(oControl.name + '_lCharCounter').innerHTML = lmaxLength - oControl.value.length
  }
  return bClipped;
}

//****************************************
// Function:  PUDateField_ValidateDate(oDateField)
// Purpose:   Converts a date in the format or 12/5/1982 to 12 May 1982 so no confusion between USA and AUS dates
// Param:     oDateField - The text box that the date is displayed in
// Returns:   Nothing
//****************************************
  function PUDateField_ValidateDate(oDateField)
  {
    //used to determine which date to highlight on the calendar
    var bDateValid;
    bDateValid = false;
    var bFlipDate;
    var sDate;
    if(oDateField.value != '')
    {
      sDate = oDateField.value;
      //replace out .'s for dates formated 1.06.04
      var aMonths = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
      var aWeekdays = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
      sDate = sDate.replace(/[.]/g,"/");
      //remove days of week;
      sDate = sDate.replace("Monday ","");
      var x=0;
      for (x=0; x<7; x++)
      {
        sDate = sDate.replace(aWeekdays[x] + " ","");
        sDate = sDate.replace(aWeekdays[x].toLowerCase() + " ","");
        sDate = sDate.replace(aWeekdays[x].substr(0,3) + " ","");
        sDate = sDate.replace(aWeekdays[x].substr(0,3).toLowerCase() + " ","");
        sDate = sDate.replace(aWeekdays[x].substr(0,4) + " ","");
        sDate = sDate.replace(aWeekdays[x].substr(0,4).toLowerCase() + " ","");
      }
      var oDate = new Date(sDate)

      if(oDate.toString() != 'NaN')
      {
        bDateValid = true;
        var oRE = new RegExp('[^A-Za-z0-9_\s]');
        var aDelimiter = oRE.exec(sDate);
        // was a delimiter found?
        if(aDelimiter != null && aDelimiter.length > 0)
        {
          // yes, split the date
          var aDate = sDate.split(aDelimiter[0]);
          // are there 3 components?
          if(aDate.length == 3)
          {
            // yes, are the date and the month numeric
            if(!isNaN(aDate[0]) && !isNaN(aDate[1]) && !isNaN(aDate[2]))
            {
              oDateField.value = aDate[0] + ' ' + aMonths[aDate[1] - 1] + ' ' + aDate[2];
              return;
            }
          }
          else
          {
              return;
          }
        }
        else
        {
          bDateValid = false;
          return;
        }
        oDateField.value = oDate.getDate() + ' ' + aMonths[oDate.getMonth()] + ' ' + PUDateField_GetCorrectYear(oDate);
      }
      oDateField.blur;
    }
    else
    {
        bDateValid = true;
        return;
    }
  }

function PUDateField_GetCorrectYear(oDate)
{ 
    return (oDate.getYear() < 1000) ? oDate.getYear() + 1900 : oDate.getYear(); 
}

function PopulateSearchField(strSearchDescID, strSearchID, strClientID, strId, strDescription, strInfoTitle, strInfo, blnShowInfoPanel)
{
    document.getElementById(strSearchID).value=strId;
    document.getElementById(strSearchDescID).value=strDescription;

    if(blnShowInfoPanel)
    {
        if(strInfo == '')
        {
            document.getElementById(strSearchDescID + '_InfoDetailTitle').innerHTML=strInfoTitle
        }
        else
        {
            document.getElementById(strSearchDescID + '_InfoDetailTitle').innerHTML= "<a onClick=\"toggleFieldDetails('" + strClientID + "');return false;\" class=\"blueLink\">" + strInfoTitle + "</a>";
        }
        
        document.getElementById(strSearchDescID + '_InfoDetail').innerHTML=strInfo;
        document.getElementById(strSearchDescID + '_InfoDetailImage').style.display="";
    }
    else
    {
        document.getElementById(strSearchDescID).style.textDecoration = 'underline';
    }
}

document.ready(function() {
    if(typeof Sys != 'undefined')
    {
        var pgRegMgr = Sys.WebForms.PageRequestManager.getInstance();
        pgRegMgr.add_endRequest(EndAsyncHandler);
    }
});

function EndAsyncHandler(pgRegMgr) {
    var panelsToRefresh = $(pgRegMgr._panelsToRefreshIDs);
    if (panelsToRefresh != null) {
        panelsToRefresh.each(function(panel) {
            //Because the panelsToRefresh only return .NET unique IDs 
            //we need to convert the ID to a client ID
            var index = pgRegMgr._updatePanelIDs.indexOf(panel);
            var ID = pgRegMgr._updatePanelClientIDs[index];
            PUCalendar.initWithinElement(ID);
        });
    }
}
function BeginAsyncHandler(pgRegMgr) {
}

function launchNewWindow(url, width, height) {
    var sWindowName = 'external';

    //20070516  HL  Case 8021 Launch new window 30px from top of screen
    var lWinLeft = (screen.width - width) / 2;
    var lWinTop = ((screen.availHeight - height) / 2) - 30;

    oWindow = window.open(url, sWindowName, 'width=' + width + ',height=' + height + ',resizable=yes,scrollbars=yes,menubar=no,status=yes,top=' + lWinTop + ',left=' + lWinLeft);
    setTimeout('oWindow.focus();', 250);
}

function deleteFile(browseWrapperID, viewWrapperID, documentContainerID) {
    var browseWrapper = $(browseWrapperID);
    var viewWrapper = $(viewWrapperID);
    var documentContainer = $(documentContainerID);

    if (documentContainer) { documentContainer.value = ''; }

    if (viewWrapper) { viewWrapper.style.display = 'none'; }

    if (browseWrapper) { browseWrapper.style.display = ''; }
}

/* jumplist menu for mobile */

function MobileMenu() {
    // if the page has breadcrumb
    if ($$('nav').length == 1) {
        var pageTitle;
        if ($$('.heading').length != 0) {
            pageTitle = $$('.heading')[0].textContent;
        } else {
            pageTitle = "Menu";
        }
        
        $$('.dr-label')[0].insert(pageTitle);
        
        [].slice.call(document.querySelectorAll('.dr-menu')).forEach(function (el, i) {
            var trigger = el.querySelector('div.dr-trigger'),
                icon = trigger.querySelector('span.dr-icon-menu'),
                open = false;
            trigger.addEventListener('click', function (event) {
                if (open) {
                    el.setAttribute('aria-expanded', 'false');
                    event.stopPropagation();
                    open = false;
                    el.className = el.className.replace(/\bdr-menu-open\b/, '');
                    return false;
                } else {
                    el.setAttribute('aria-expanded', 'true');
                    el.className += ' dr-menu-open';
                    open = true;
                }
            }, false);

            // IE to continue to function as it previously did, it will not get focus to the nav bar
            if (!Util.IEVersion || Util.IEVersion === '') {
                el.addEventListener('keyup', function (e) {
                    handleMenuTriggerKeyup(e, trigger);
                });

                // 1023px matches the media query per the css which triggers change in menu display
                // located in Apply\0\applicationForm\_css\GenericStyles.less
                var mediaQuery = '(max-width: 1023px)';
                var mediaQueryList = window.matchMedia(mediaQuery);
                handleMediaQueryChange(mediaQueryList.matches, el);
                mediaQueryList.addEventListener('change', function(event){
                    handleMediaQueryChange(event.matches, el)
                });
                
                var crumbs = el.querySelector('ul.crumbs');
                if (crumbs) {
                    crumbs.addEventListener('keyup', function (e) {
                        handleCrumbsKeyUp(e, trigger, el);
                    });
                }
            }
        });
    }
}

// Initialisation of various controls on the page
document.ready( function () {
    // IE6,7,8 don't support CSS media query
    if (Util.IEVersion != 6 && Util.IEVersion != 7 && Util.IEVersion != 8) {
        MobileMenu();
    }

    // polyfill for closest for IE11
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (Element.prototype.matches.call(el, s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    $(document).on('keyup', '[data-toggle="dropdown"]', function(e) {
        checkIfEscapeToCloseMenu(e);
    });
    $(document).on('keyup', '.dropdown-menu', function(e) {
        checkIfEscapeToCloseMenu(e);
    });
    
    // When we click on the x in alert panels we want them to close, our implementation of the bootstrap jquery plugin
    $(document.body).on('click', '[data-dismiss="alert"]', function (e) {
        $(e.target).up('.alert').remove();
    });

    $(document.body).on('click', '.dropdown', function (e) {
        toggleDropDown(e);
    });

    var listItems = document.getElementsByClassName('dropdown-menu');
    Array.prototype.forEach.call(listItems, function (el, i) {
        el.addEventListener('focusout',
            function (event) {
                if (event.relatedTarget != null) {
                    var element = $(event.relatedTarget).up('ul.dropdown-menu');
                    if (!element)
                        toggleDropDown(event);
                }
            });
    });

    // Chosen dropdown lists - Doesn't support IE 6 or 7, and don't use Chosen on mobile browsers
    if (Util.IEVersion != 6 && Util.IEVersion != 7 && !Util.isMobile()) {
        var selects = $$(".chzn-select");
        selects.each(function (select) {
            var width = (select.getWidth() || 220) + 20;

            // Don't set width on date dropdowns - This is explicitly set in stylesheet
            if (!$(select).hasClassName('month') && !$(select).hasClassName('year') && !$(select).hasClassName('day'))
                select.setStyle({ width: width + 'px' });

            new Chosen(select);
        });
    }

    if (Util.isMobile()) {
        var selects = $$(".chzn-select");
        selects.each(function (select) {
            if (select.getWidth() < 768)
                select.setStyle({ width: '90%' });
        });

        var dropdowns = $$(".dropdownEdit");
        dropdowns.each(function(dropdown) {
                dropdown.writeAttribute("readonly", "readonly");
        });
    }

    if (Util.IEVersion == 6) {
        $$('.row div[class^="span"]:last-child').each(function (item) { item.addClassName('last-child'); });
        $$('[class*="span"]').each(function (item) { item.addClassName('margin-left-20'); });
        $$(':button[class="btn"], :reset[class="btn"], :submit[class="btn"], input[type="button"], input[type="submit"]').each(function (item) { item.addClassName('button-reset'); });
        $$(':checkbox, input[type="radio"]').each(function (item) { item.addClassName('input-checkbox'); });
        $$('select[multiple],select[size]').each(function (item) { item.addClassName('select-height'); });
        $$('[class^="icon-"], [class*=" icon-"]').each(function (item) { item.addClassName('icon-sprite'); });
        $$('.pagination li:first-child a').each(function (item) { item.addClassName('pagination-first-child'); });
        $$('input[type="image"]').each(function (item) { item.addClassName('input-image'); });
    }
    
    // add menu click event handler
    if ($("mainInner")) {
        if ($("mainInner").down('.btn-navbar'))
            $("mainInner").down('.btn-navbar').observe("click", menuOpenClose.bind(this));
    }
});

function menuOpenClose() {
    var targetElem = $("mainInner").down(".nav-collapse");
    if (targetElem) {
        targetElem.toggleClassName("expanded");
    }

    var navbarButtonElem = $("mainInner").down("#NavbarButton");
    if (navbarButtonElem && navbarButtonElem.hasAttribute("aria-pressed")) {
        if (navbarButtonElem.getAttribute("aria-pressed") === "true") {
            navbarButtonElem.setAttribute("aria-pressed", "false");
        } else {
            navbarButtonElem.setAttribute("aria-pressed", "true");
        }
    }
}

function checkIfEscapeToCloseMenu(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        var dropdown = $(e.target).closest('.dropdown');
        if (dropdown) {
            var dropdownToggle = dropdown.getElementsByClassName('dropdown-toggle')[0];
            if (dropdownToggle && dropdown.classList.contains('open')) {
                dropdownToggle.click();
            }
        }
    }
}

function handleMenuTriggerKeyup(e, trigger) {
    if (trigger) {
        if (e.key === 'Enter') {
            trigger.click();
            return;
        }
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (e.target.classList.contains('dr-menu-open')) {
                trigger.click();
            }
            return;
        }
    }
}

function handleCrumbsKeyUp(e, trigger, menu) {
    if (trigger) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (menu.classList.contains('dr-menu-open')) {
                trigger.click();
                menu.focus();
            }
        }
    }
}

function handleMediaQueryChange(mediaMatches, el) {
    if (mediaMatches) {
        // we are not in desktop mode
        // set tabindex to 0 as we want users to be able to tab to the nav bar because of the way the
        // menu is rendered when not in desktop mode (does expand / collapse)
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-expanded', 'false');
        el.setAttribute('role', 'application');
    } else {
        // we are in desktop mode
        // set tabindex to -1 as we dont want users to be able to tab to the nav bar in desktop mode because of the way the
        // menu is rendered when in desktop mode (does not expand / collapse)
        el.setAttribute('tabindex', '-1'); 
        el.removeAttribute('aria-expanded');
        el.removeAttribute('role');
    }
}

function toggleDropDown(e) {
    var dropdown = $(e.target).up('.dropdown');
    dropdown.toggleClassName('open');
    var toggle = dropdown.getElementsByClassName('dropdown-toggle')[0];
    if (toggle) {
        if (dropdown.classList.contains('open')) {
            toggle.setAttribute('aria-expanded', 'true');
        } else {
            toggle.setAttribute('aria-expanded', 'false');
        }
    }
}
// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.7
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function() {
  var SelectParser;

  SelectParser = (function() {

    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) this.parsed[group_position].children += 1;
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  this.SelectParser = SelectParser;

}).call(this);

/*
Chosen source: generate output using 'cake build'
Copyright (c) 2011 by Harvest
*/

(function() {
  var AbstractChosen, root;

  root = this;

  AbstractChosen = (function() {

    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      this.set_default_values();
      this.is_multiple = this.form_field.multiple;
      this.default_text_default = this.is_multiple ? "Select Some Options" : "Select an Option";
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.finish_setup();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.choices = 0;
      return this.results_none_found = this.options.no_results_text || "No results match";
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (!this.active_field) {
        return setTimeout((function() {
          return _this.container_mousedown();
        }), 50);
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, style;
      if (!option.disabled) {
        option.dom_id = this.container_id + "_o_" + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) classes.push("result-selected");
        if (option.group_array_index != null) classes.push("group-option");
        if (option.classes !== "") classes.push(option.classes);
        style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
        return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
      } else {
        return "";
      }
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) return this.result_select(evt);
          break;
        case 27:
          if (this.results_showing) this.results_hide();
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.generate_field_id = function() {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };

    AbstractChosen.prototype.generate_random_char = function() {
      var chars, newchar, rand;
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
      rand = Math.floor(Math.random() * chars.length);
      return newchar = chars.substring(rand, rand + 1);
    };

    return AbstractChosen;

  })();

  root.AbstractChosen = AbstractChosen;

}).call(this);

/*
Chosen source: generate output using 'cake build'
Copyright (c) 2011 by Harvest
*/

(function() {
  var Chosen, get_side_border_padding, root,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = this;

  Chosen = (function(_super) {

    __extends(Chosen, _super);

    function Chosen() {
      Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function() {
      return this.is_rtl = this.form_field.hasClassName("chzn-rtl");
    };

    Chosen.prototype.finish_setup = function() {
      return this.form_field.addClassName("chzn-done");
    };

    Chosen.prototype.set_default_values = function() {
      Chosen.__super__.set_default_values.call(this);
      this.single_temp = new Template('<a href="javascript:void(0)" class="chzn-single"><span>#{default}</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
      this.multi_temp = new Template('<ul class="chzn-choices"><li class="search-field"><input type="text" value="#{default}" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
      this.choice_temp = new Template('<li class="search-choice" id="#{id}"><span>#{choice}</span><a href="javascript:void(0)" class="search-choice-close" rel="#{position}"></a></li>');
      return this.no_results_temp = new Template('<li class="no-results">' + this.results_none_found + ' "<span>#{terms}</span>"</li>');
    };

    Chosen.prototype.set_up_html = function() {
      var base_template, container_props, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.identify().replace(/(:|\.)/g, '_') + "_chzn";
      this.f_width = this.form_field.getStyle("width") ? parseInt(this.form_field.getStyle("width"), 10) : this.form_field.getWidth();
      container_props = {
        'id': this.container_id,
        'class': "chzn-container" + (this.is_rtl ? ' chzn-rtl' : ''),
        'style': 'width: ' + this.f_width + 'px'
      };
      this.default_text = this.form_field.readAttribute('data-placeholder') ? this.form_field.readAttribute('data-placeholder') : this.default_text_default;
      base_template = this.is_multiple ? new Element('div', container_props).update(this.multi_temp.evaluate({
        "default": this.default_text
      })) : new Element('div', container_props).update(this.single_temp.evaluate({
        "default": this.default_text
      }));
      this.form_field.hide().insert({
        after: base_template
      });
      this.container = $(this.container_id);
      this.container.addClassName("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      this.dropdown = this.container.down('div.chzn-drop');
      dd_top = this.container.getHeight();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.setStyle({
        "width": dd_width + "px",
        "top": dd_top + "px"
      });
      this.search_field = this.container.down('input');
      this.search_results = this.container.down('ul.chzn-results');
      this.search_field_scale();
      this.search_no_results = this.container.down('li.no-results');
      if (this.is_multiple) {
        this.search_choices = this.container.down('ul.chzn-choices');
        this.search_container = this.container.down('li.search-field');
      } else {
        this.search_container = this.container.down('div.chzn-search');
        this.selected_item = this.container.down('.chzn-single');
        sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
        this.search_field.setStyle({
          "width": sf_width + "px"
        });
      }
      this.results_build();
      this.set_tab_index();
      return this.form_field.fire("liszt:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.observe("mousedown", function(evt) {
        return _this.container_mousedown(evt);
      });
      this.container.observe("mouseup", function(evt) {
        return _this.container_mouseup(evt);
      });
      this.container.observe("mouseenter", function(evt) {
        return _this.mouse_enter(evt);
      });
      this.container.observe("mouseleave", function(evt) {
        return _this.mouse_leave(evt);
      });
      this.search_results.observe("mouseup", function(evt) {
        return _this.search_results_mouseup(evt);
      });
      this.search_results.observe("mouseover", function(evt) {
        return _this.search_results_mouseover(evt);
      });
      this.search_results.observe("mouseout", function(evt) {
        return _this.search_results_mouseout(evt);
      });
      this.form_field.observe("liszt:updated", function(evt) {
        return _this.results_update_field(evt);
      });
      this.search_field.observe("blur", function(evt) {
        return _this.input_blur(evt);
      });
      this.search_field.observe("keyup", function(evt) {
        return _this.keyup_checker(evt);
      });
      this.search_field.observe("keydown", function(evt) {
        return _this.keydown_checker(evt);
      });
      if (this.is_multiple) {
        this.search_choices.observe("click", function(evt) {
          return _this.choices_click(evt);
        });
        return this.search_field.observe("focus", function(evt) {
          return _this.input_focus(evt);
        });
      } else {
        return this.container.observe("click", function(evt) {
          return evt.preventDefault();
        });
      }
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field.disabled;
      if (this.is_disabled) {
        this.container.addClassName('chzn-disabled');
        this.search_field.disabled = true;
        if (!this.is_multiple) {
          this.selected_item.stopObserving("focus", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClassName('chzn-disabled');
        this.search_field.disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.observe("focus", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink = evt != null ? evt.target.hasClassName("search-choice-close") : false;
        if (evt && evt.type === "mousedown") evt.stop();
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) this.search_field.clear();
            document.observe("click", this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (evt.target === this.selected_item || evt.target.up("a.chzn-single"))) {
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return this.pending_destroy_click = false;
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR") return this.results_reset(evt);
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClassName("chzn-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      document.stopObserving("click", this.click_test_action);
      if (!this.is_multiple) {
        this.selected_item.tabIndex = this.search_field.tabIndex;
        this.search_field.tabIndex = -1;
      }
      this.active_field = false;
      this.results_hide();
      this.container.removeClassName("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      if (!this.is_multiple && !this.active_field) {
        this.search_field.tabIndex = this.selected_item.tabIndex;
        this.selected_item.tabIndex = -1;
      }
      this.container.addClassName("chzn-container-active");
      this.active_field = true;
      this.search_field.value = this.search_field.value;
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      if (evt.target.up('#' + this.container_id)) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.select("li.search-choice").invoke("remove");
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.down("span").update(this.default_text);
        if (this.form_field.options.length <= this.disable_search_threshold) {
          this.container.addClassName("chzn-container-single-nosearch");
        } else {
          this.container.removeClassName("chzn-container-single-nosearch");
        }
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.down("span").update(data.html);
            if (this.allow_single_deselect) this.single_deselect_control_build();
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.update(content);
      return this.parsing = false;
    };

    Chosen.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + group.label.escapeHTML() + '</li>';
      } else {
        return "";
      }
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      this.result_clear_highlight();
      this.result_highlight = el;
      this.result_highlight.addClassName("highlighted");
      maxHeight = parseInt(this.search_results.getStyle('maxHeight'), 10);
      visible_top = this.search_results.scrollTop;
      visible_bottom = maxHeight + visible_top;
      high_top = this.result_highlight.positionedOffset().top;
      high_bottom = high_top + this.result_highlight.getHeight();
      if (high_bottom >= visible_bottom) {
        return this.search_results.scrollTop = (high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0;
      } else if (high_top < visible_top) {
        return this.search_results.scrollTop = high_top;
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClassName('highlighted');
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClassName('chzn-single-with-drop');
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      }
      dd_top = this.is_multiple ? this.container.getHeight() : this.container.getHeight() - 1;
      this.dropdown.setStyle({
        "top": dd_top + "px",
        "left": 0
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.value = this.search_field.value;
      return this.winnow_results();
    };

    Chosen.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClassName('chzn-single-with-drop');
      }
      this.result_clear_highlight();
      this.dropdown.setStyle({
        "left": "-9000px"
      });
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        if (this.is_multiple) {
          return this.search_field.tabIndex = ti;
        } else {
          this.selected_item.tabIndex = ti;
          return this.search_field.tabIndex = -1;
        }
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.value = this.default_text;
        return this.search_field.addClassName("default");
      } else {
        this.search_field.value = "";
        return this.search_field.removeClassName("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) {
        this.result_highlight = target;
        return this.result_select(evt);
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) return this.result_do_highlight(target);
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if (evt.target.hasClassName('active-result') || evt.target.up('.active-result')) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !(evt.target.hasClassName('search-choice') || evt.target.up('.search-choice')) && !this.results_showing) {
        return this.results_show();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice_id, link,
        _this = this;
      choice_id = this.container_id + "_c_" + item.array_index;
      this.choices += 1;
      this.search_container.insert({
        before: this.choice_temp.evaluate({
          id: choice_id,
          choice: item.html,
          position: item.array_index
        })
      });
      link = $(choice_id).down('a');
      return link.observe("click", function(evt) {
        return _this.choice_destroy_link_click(evt);
      });
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy(evt.target);
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      this.choices -= 1;
      this.show_search_field_default();
      if (this.is_multiple && this.choices > 0 && this.search_field.value.length < 1) {
        this.results_hide();
      }
      this.result_deselect(link.readAttribute("rel"));
      return link.up('li').remove();
    };

    Chosen.prototype.results_reset = function(evt) {
      this.form_field.options[0].selected = true;
      this.selected_item.down("span").update(this.default_text);
      this.show_search_field_default();
      evt.target.remove();
      if (typeof Event.simulate === 'function') this.form_field.simulate("change");
      if (this.active_field) return this.results_hide();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results.descendants(".result-selected").invoke("removeClassName", "result-selected");
          this.result_single_selected = high;
        }
        high.addClassName("result-selected");
        position = high.id.substr(high.id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;

          try {
        this.form_field.options[item.options_index].selected = true;
          } catch(e) {
              // We are trying to diagnose why the above line is failing
              var errorStr = "For bugs life 20130207: Error in chosen result_select. form_field is: ";
              
              if(this.form_field && this.form_field.id) {
                  errorStr += this.form_field.id;

                  errorStr += " Options are: ";
                  
                  if(this.form_field.options && this.form_field.options.length) {
                    errorStr += this.form_field.options.toString();
                  }
                  else {
                      errorStr += "undefined";
                  }
              }
              else {
                  errorStr += "undefined";
              }

              errorStr += " Item option index is: ";
              
              if(item && item.options_index) {
                errorStr += item.options_index;
              }
              else {
                errorStr += "undefined";
              }

              throw errorStr;
          } 
        
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.down("span").update(item.html);
          if (this.allow_single_deselect) this.single_deselect_control_build();
        }
        if (!(evt.metaKey && this.is_multiple)) this.results_hide();
        this.search_field.value = "";
        if (typeof Event.simulate === 'function') {
          this.form_field.simulate("change");
        }
        return this.search_field_scale();
      }
    };

    Chosen.prototype.result_activate = function(el) {
      return el.addClassName("active-result");
    };

    Chosen.prototype.result_deactivate = function(el) {
      return el.removeClassName("active-result");
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      result_data.selected = false;
      this.form_field.options[result_data.options_index].selected = false;
      result = $(this.container_id + "_o_" + pos);
      result.removeClassName("result-selected").addClassName("active-result").show();
      this.result_clear_highlight();
      this.winnow_results();
      if (typeof Event.simulate === 'function') this.form_field.simulate("change");
      return this.search_field_scale();
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (this.allow_single_deselect && !this.selected_item.down("abbr")) {
        return this.selected_item.down("span").insert({
          after: "<abbr class=\"search-choice-close\"></abbr>"
        });
      }
    };

    Chosen.prototype.winnow_results = function() {
      var found, option, part, parts, regex, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len2, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.value === this.default_text ? "" : this.search_field.value.strip().escapeHTML();
      regex = new RegExp('^' + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $(option.dom_id).hide();
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              if ($(result_id).innerHTML !== text) $(result_id).update(text);
              this.result_activate($(result_id));
              if (option.group_array_index != null) {
                $(this.results_data[option.group_array_index].dom_id).setStyle({
                  display: 'list-item'
                });
              }
            } else {
              if ($(result_id) === this.result_highlight) {
                this.result_clear_highlight();
              }
              this.result_deactivate($(result_id));
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };

    Chosen.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.clear();
      lis = this.search_results.select("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        if (li.hasClassName("group-result")) {
          _results.push(li.show());
        } else if (!this.is_multiple || !li.hasClassName("result-selected")) {
          _results.push(this.result_activate(li));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high;
      if (!this.result_highlight) {
        if (!this.is_multiple) {
          do_high = this.search_results.down(".result-selected.active-result");
        }
        if (!(do_high != null)) {
          do_high = this.search_results.down(".active-result");
        }
        if (do_high != null) return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      return this.search_results.insert(this.no_results_temp.evaluate({
        terms: terms
      }));
    };

    Chosen.prototype.no_results_clear = function() {
      var nr, _results;
      nr = null;
      _results = [];
      while (nr = this.search_results.down(".no-results")) {
        _results.push(nr.remove());
      }
      return _results;
    };

    Chosen.prototype.keydown_arrow = function() {
      var actives, nexts, sibs;
      actives = this.search_results.select("li.active-result");
      if (actives.length) {
        if (!this.result_highlight) {
          this.result_do_highlight(actives.first());
        } else if (this.results_showing) {
          sibs = this.result_highlight.nextSiblings();
          nexts = sibs.intersect(actives);
          if (nexts.length) this.result_do_highlight(nexts.first());
        }
        if (!this.results_showing) return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var actives, prevs, sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        sibs = this.result_highlight.previousSiblings();
        actives = this.search_results.select("li.active-result");
        prevs = sibs.intersect(actives);
        if (prevs.length) {
          return this.result_do_highlight(prevs.first());
        } else {
          if (this.choices > 0) this.results_hide();
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.down("a"));
        return this.clear_backstroke();
      } else {
        this.pending_backstroke = this.search_container.siblings("li.search-choice").last();
        return this.pending_backstroke.addClassName("search-choice-focus");
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClassName("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) this.clear_backstroke();
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.value.length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) this.result_select(evt);
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.getStyle(style) + ";";
        }
        div = new Element('div', {
          'style': style_block
        }).update(this.search_field.value.escapeHTML());
        document.body.appendChild(div);
        w = Element.measure(div, 'width') + 25;
        div.remove();
        if (w > this.f_width - 10) w = this.f_width - 10;
        this.search_field.setStyle({
          'width': w + 'px'
        });
        dd_top = this.container.getHeight();
        return this.dropdown.setStyle({
          "top": dd_top + "px"
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

  root.Chosen = Chosen;

  if (Prototype.Browser.IE) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      Prototype.BrowserFeatures['Version'] = new Number(RegExp.$1);
    }
  }

  get_side_border_padding = function(elmt) {
    var layout, side_border_padding;
    layout = new Element.Layout(elmt);
    return side_border_padding = layout.get("border-left") + layout.get("border-right") + layout.get("padding-left") + layout.get("padding-right");
  };

  root.get_side_border_padding = get_side_border_padding;

}).call(this);

//This global variable is used as a master list of which fields contain validation errors.  It is reset on every page load, and then 
//validation items are re-added when a callback is processed.
var _objValidationErrorHashTable = new Object();

function ProcessCallBackError(arg, context)
{
    eval(arg);
}

function GetFormData()
{
    var strArgs = "";
    var objElement;
    for(i = 0; i < document.forms[0].elements.length; i++)
    {
        if(strArgs != "")
        {
            strArgs += "&";
        }
        objElement = document.forms[0].elements[i];
        
        // Only return elements that are visible
        if( objElement.style.display != 'none')
        {
            switch(objElement.type)
            {
                case "radio":
                    if (objElement.checked)
                        strArgs += objElement.id + "=" + CallbackEscape(objElement.value);
                    break;
                case "checkbox":
                    strArgs += objElement.name + "=" + CallbackEscape(objElement.checked);
                    break;
                case "select-one":
                    strArgs += objElement.name + "=" + CallbackEscape(objElement[objElement.selectedIndex].value);
                    break;
                default:
                    strArgs += objElement.id + "=" + CallbackEscape(objElement.value);
                    break;
            }
        }
    }
    return strArgs;
}

function CallbackEscape(sArgs)
{
    // Remove '&' characters because callbacks use them to split the key/value pairs
    // %cb_amp% chosen to identify it as a callback escape sequence, and it is highly unlikely it will appear in user input
    
    // Need to convert input into a string (so we can use replace function) in case true/false values are passed in
    sArgs = String(sArgs);
    
    sArgs = sArgs.replace(/&/g, "%cb_amp%");
    
    // Remove '=' characters because callbacks use them to split keys/values
    // %cb_eql% chosen to identify it as a callback escape sequence, and it is highly unlikely it will appear in user input
    sArgs = sArgs.replace(/=/g, "%cb_eql%");

    return sArgs;

}

// Colons and semi colons are used to delimit callback values, so this function is used to escape them in case they are contained in user input
function CallbackEscapeColons(sArgs)
{    
    // Need to convert input into a string (so we can use replace function) in case true/false values are passed in
    sArgs = String(sArgs);
    sArgs = sArgs.replace(/:/g, "%cb_cln%");
    sArgs = sArgs.replace(/;/g, "%cb_scln%");

    return sArgs;

}

function StartClientCallback()
{
    var strArgs = "";
    var objElement;
    
    for(i = 0; i < document.forms[0].elements.length; i++)
    { 
        objElement = document.forms[0].elements[i];
        if (objElement.type=="button")
        { 
          //  objElement.disabled = true;
        }
    }
}

function EndClientCallback()
{
    var strArgs = "";
    var objElement;
    
    for(j = 0; j < document.forms[0].elements.length; j++)
    {
        objElement = document.forms[0].elements[j];
             
        if (objElement.type=="button")
        {
          //   objElement.disabled = false;
        }
    }
}



function ProcessCallBack(arg, context)
{
    eval(arg);
    EndClientCallback();
}

//Adds a value to the global list of validation errors.  The label id is added, and the original color of the label.
//The label color is then changed to red to identify that there is a validation error with the field associated with it.
function AddFieldError(strLabelId)
{
  var objLabel;
  objLabel = document.getElementById(strLabelId);
  
  if (objLabel)
  {
    _objValidationErrorHashTable[strLabelId] = objLabel.style.color;
    objLabel.style.color = 'red';
  }
}

//This is called on every page load, from PUBasePage.  It resets the color of every label back to it's original color, then recreates
//the object that contains all the validation errors to effectively clear them all out.  The validation errors are then added back
//in as a callback is processed.
function ClearFieldErrors()
{
  var objLabel;

  for (var strLabelId in _objValidationErrorHashTable)
  {
    objLabel = document.getElementById(strLabelId);
    
    if (objLabel)
    {
      objLabel.style.color = _objValidationErrorHashTable[strLabelId];
    }
  }
  
  _objValidationErrorHashTable = new Object();
}

var oPopupInfoHtml = new Object();
var bClosePopupOnClick = true;
var strCurrentPopupID = "";

//creates a dynamic menu using a list of actions passed into the function.
function LaunchPopupMenu(oLink, strCallbackArguements, strMenuAction)
{
    var lMENUWIDTH = 350;
    var lXOFFSET = 210;
    var lYOFFSET = 0;

    var lXPos = getPosX(oLink);
    var lYPos = getPosY(oLink);
    var oPage = $(document.body);
    var oMenu = document.getElementById('popupMenu');

    var oMenuContent;
    var oIframe;

    lYOFFSET += getPosY(oPage);

    if (!oMenu)
    {
        //create menu
        oMenu = document.createElement('div');
        oMenu.className = 'AppMenuActions';
        oMenu.id = 'popupMenu';
        oMenu.style.width = lMENUWIDTH + 'px';
       
        oMenuContent = document.createElement('div');
        oMenuContent.className = 'AppMenuActionsContent';
        oMenuContent.id = 'popupMenuContent';
        oMenu.appendChild(oMenuContent);
        oPage.appendChild(oMenu);
        
        //set up iframe to be used in background to cover up selects
        oIframe = document.createElement('iframe');
        oIframe.id = 'popupMenuIframe';                               
        oIframe.style.scrolling = 'no';
        oIframe.style.zIndex = 1;
        oIframe.style.position = 'absolute';               
        oIframe.src = 'javascript:\'\';';
        oPage.appendChild(oIframe);

        //add page click event        
        if($$('body')[0].addEventListener)
        {
            $$('body')[0].addEventListener('click', MousePopupMenuPageClicked, false);
            oMenu.addEventListener('click', MousePopupMenuPageClicked, false);
        }
        else
        {
            document.body.attachEvent("onclick", MousePopupMenuPageClicked);
            //add popup menu event
            oMenu.attachEvent("onclick", MousePopupMenuPopupClicked);
        }              
    }
    
    //check if menu is not equal to current one
    if (strCurrentPopupID != oLink.id)
    {            
        //figure out whether to put the menu to the left or right
        if (lMENUWIDTH + lXPos > document.body.clientWidth)
        {        
            //align left
            oMenu.style.left = (lXPos - lXOFFSET) + 'px';
        }
        else
        {
            //align right
            oMenu.style.left = (lXPos) + 'px';
        }
    
        //re postion
        oMenu.style.display = '';       
        oMenu.style.top = (lYPos - lYOFFSET) + 'px';                
                    
        //get html for new menu
        if (oPopupInfoHtml[oLink.id] == undefined)
        {        
            //add please wait (dont store result)
            SetHtmlInPopup('Please wait')
        
            //launch callback
            SingleCallBack(oLink.id, strCallbackArguements, strMenuAction);            
        }
        else
        {                                             
            SetPopupInfoHTML(oLink.id, oPopupInfoHtml[oLink.id])
        } 
        
        strCurrentPopupID = oLink.id;
        
        //don't close the menu
        bClosePopupOnClick = false;   
    }    
}  

//fired when the popup menu is clicked
function MousePopupMenuPopupClicked()
{
    //don't close the popup when the page event is fired
    bClosePopupOnClick = false;
}

//fired when the page is clicked
function MousePopupMenuPageClicked()
{
    if (bClosePopupOnClick)
    {
        ClosePopupMenu();
    }
    
    bClosePopupOnClick = true;        
}

//close the popup menu
function ClosePopupMenu()
{
    document.getElementById('popupMenu').style.display = 'none';         
    document.getElementById('popupMenuIframe').style.display = 'none';
    strCurrentPopupID = "";
}

//this is called from the callback   
function SetPopupInfoHTML(strId, sHTML)
{
    //set in object (if coming from callback)
    oPopupInfoHtml[strId] = sHTML
        
    SetHtmlInPopup(sHTML);    
}

//set the html directly in the popup (doesn't store the result)
function SetHtmlInPopup(sHTML)
{
    var oIframe = document.getElementById('popupMenuIframe');
    var oMenu = document.getElementById('popupMenu');
                          
    document.getElementById('popupMenuContent').innerHTML = sHTML;          
               
    //set iframe height/width and position    
    oIframe.style.left = oMenu.style.left;
    oIframe.style.top =oMenu.style.top; 
    
    //set width (subtract scroll bar space)
    oIframe.style.width = oMenu.clientWidth - 20;
    oIframe.style.height = oMenu.clientHeight - 20;
     
    //show content
    oMenu.style.display = '';
    oIframe.style.display = '';  
}

//Fired when an item in the menu is clicked.
function PopupMenuItemClick(oObject)
{    
    var sURL, sLaunchType;
    var lHeight,lWidth;
    
    //get url
    sURL = oObject.attributes.getNamedItem('url').value;
    
    lHeight = oObject.attributes.getNamedItem('lHeight');
    lWidth = oObject.attributes.getNamedItem('lWidth');
    sLaunchType = oObject.attributes.getNamedItem('launchType');
    
    if (lHeight != null)
    {
        lHeight = lHeight.value;
    }
    
    if (lWidth != null)
    {
        lWidth = lWidth.value;
    }
    
    //hide menu
    MousePopupMenuPageClicked();
    
    //launch
    if (sLaunchType != null && sLaunchType.value == "Window")
    {
        launchNewWindow(sURL, lHeight, lWidth);
    }
    else
    {
        launchDefaultDialog(sURL, lHeight, lWidth);
    }
}       

//Need special case for job. The app card can be launched from a popup
//meaning the job card would the launch in the popup instead of main parent.
function PopupCloseAndRedirect(sUrl)
{
    var oParent;
    var oGrandParent;
    
    //get parent window
    oParent = getParentWindow();
    
    //if the parent has a name it means its a popup    
    if(oParent.name != "" && oParent.name != null)
    {
      //so get the real parent
      oGrandParent = oParent.getParentWindow();
      
      //close the popup
      oParent.closeDialog();
      
      //set the parent to be the real parent not the popup
      oParent = oGrandParent;
    }
    
    //redriect the parent to the URL passed
    oParent.location = sUrl;
    
    //close the dialog.
    closeDialog();
}


function FailedAuthentication(redirectUrl) {
    window.location = redirectUrl;
}

/* When any form is opened, remove the frosting we may have had shown while it was loading (using a function from frosting.js)*/
function FormOpened() {
    defrostPage();
}

function FormRunnerBootstrap(uiUrl) {
    if (!endsWith(uiUrl, "/")) {
        uiUrl = uiUrl + "/";
    }

    var formRunnerJavascript = uiUrl + "libs/form-runner/assets/form-runner.min.js";
    var formRunnerStylesheet = uiUrl + "libs/form-runner/assets/form-runner.css";

    LoadScript("form-integration-scripts", formRunnerJavascript, FormIntegrationBootstrap);
    LoadCSS("form-integration-styles", formRunnerStylesheet);
}

function FormRunnerBootstrapCSS(uiUrl) {
    if (!endsWith(uiUrl, "/")) {
        uiUrl = uiUrl + "/";
    }

    var formRunnerStylesheet = uiUrl + "libs/form-runner/assets/form-runner.css";

    LoadCSS("form-integration-styles", formRunnerStylesheet);
}

// Reasons why we have our own endsWith implementation:
// * Doesn't create a substring
// * Uses native indexOf function for fastest results
// * Skip unnecessary comparisons using the second parameter of indexOf to skip ahead
// **** Works in Internet Explorer :(
// * NO Regex complications
// http://stackoverflow.com/questions/280634/endswith-in-javascript
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) > -1;
}

// load css in content loaded via ajax.
function LoadCSS(id, resource) {
    if (!document.getElementById(id)) {
        var tag = document.createElement("link");
        tag.href = resource;
        tag.rel = "stylesheet";
        tag.type = "text/css";
        tag.setAttribute("exclude-takeover", "exclude");
        tag.id = id;
        document.getElementsByTagName("head")[0].appendChild(tag);
    }
}

// load js content with optional callback.
function LoadScript(id, resource, callback) {
    if (!document.getElementById(id)) {
        var script = document.createElement("script");
        script.src = resource;
        script.type = "text/javascript";

        // Handle Script loading
        var scriptHasBeenLoaded = false;

        if (callback !== undefined) {
            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function() {
                if (!scriptHasBeenLoaded && (!this.readyState ||
                    this.readyState === "loaded" || this.readyState === "complete")) {
                    scriptHasBeenLoaded = true;
                    callback();
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                }
            };
        }

        script.id = id;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}

// Angularise the form-integration tag added to the dom after angular itself has loaded.
function FormIntegrationBootstrap() {
    if (window.angular) {
        window.angular.element(document).ready(function() {

            var apps = document.getElementsByClassName("form-bootstrap");
            var i;
            for (i = 0; i < apps.length; i++) {

                var mod = apps[i].getAttribute("form-app");
                angular.bootstrap(apps[i], [mod]);
            }
        });
    }
}

function FormSubmission(sApiV2ApplicationStatusEndpoint, sLocksmithProtectedTicket, sUrlPrefix) {

    var errorHandler = function(apiV2ApplicationStatusEndpoint, status, responseText, location, reject) {

        Util.postErrorHandler("Error occurred calling APIv2 endpoint " + apiV2ApplicationStatusEndpoint + " (status " + status + "):" + responseText,
            location,
            0,
            "FormSubmission");

        if (typeof reject === "function")
            reject("Error occurred calling APIv2 endpoint");
    };

    var getRedirectUrl = function (response) {

        var redirectUrl = null;
        // handle XML
        if (response.responseXML != null && response.responseXML.firstChild.textContent.indexOf("pageuppeople") !== -1)
            redirectUrl = sUrlPrefix + response.responseXML.firstChild.textContent;
        // handle Text
        else if (response.responseText != null && response.responseText.indexOf("pageuppeople") !== -1)
            redirectUrl = sUrlPrefix + response.responseText.replace(/['"]+/g, '');

        return redirectUrl;
    };

    var promise = new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open("POST", sApiV2ApplicationStatusEndpoint + "?access_token=" + sLocksmithProtectedTicket, true);
        xhr.timeout = 60000; // miliseconds, after which the ready state will resolve to DONE, and the status will be zero

        xhr.onreadystatechange = function() { // Call a function when the state changes.

            if (xhr.readyState === XMLHttpRequest.DONE) {

                if (xhr.status === 200) {

                    var redirectUrl = getRedirectUrl(this);
                    if (redirectUrl)
                        window.top.location.href = redirectUrl;
                    else
                        window.location.reload(true);

                } else {

                    errorHandler(sApiV2ApplicationStatusEndpoint,
                        xhr.status,
                        this.responseText,
                        document.location,
                        reject);
                }
            }
        };

        xhr.send();
    });

    return promise;
}

/**
 * Used in home.asp to display a 'loading' overlay when waiting for a new starter form to open up.
 * Mostly borrowed from employee_services.js, but cut down.
 */

function frostPage()
{
    var container = $('loadingFrost');

    if (!container)
    {
        container = document.createElement("div");
        $(container).addClassName('loadingFrost');

        if (container.setAttribute)
            container.setAttribute('id', "loadingFrost");
        else
            container.id = "loadingFrost";

        document.body.appendChild(container);

        container.style.height = getPageSizeWithScroll() + "px";
    }

    return container;
}

function defrostPage()
{
    var container = $('loadingFrost');
    if (container) {
        container.hide();
    }
}

function getPageSizeWithScroll(win)
{
    var win = win || window;
    if (win.innerHeight && win.scrollMaxY)
    {
        // Firefox
        yWithScroll = win.innerHeight + win.scrollMaxY;
    }
    else if (win.document.body.scrollHeight > win.document.body.offsetHeight)
    {
        // all but Explorer Mac
        yWithScroll = win.document.body.scrollHeight;
    }
    else
    {
        // works in Explorer 6 Strict, Mozilla (not FF) and Safari
        yWithScroll = win.document.body.offsetHeight;
    }

    return yWithScroll;
}
!function (t) { function e() { } function n(t, e) { return function () { t.apply(e, arguments) } } function o(t) { if ("object" != typeof this) throw new TypeError("Promises must be constructed via new"); if ("function" != typeof t) throw new TypeError("not a function"); this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], s(t, this) } function r(t, e) { for (; 3 === t._state;) t = t._value; return 0 === t._state ? void t._deferreds.push(e) : (t._handled = !0, void a(function () { var n = 1 === t._state ? e.onFulfilled : e.onRejected; if (null === n) return void (1 === t._state ? i : f)(e.promise, t._value); var o; try { o = n(t._value) } catch (r) { return void f(e.promise, r) } i(e.promise, o) })) } function i(t, e) { try { if (e === t) throw new TypeError("A promise cannot be resolved with itself."); if (e && ("object" == typeof e || "function" == typeof e)) { var r = e.then; if (e instanceof o) return t._state = 3, t._value = e, void u(t); if ("function" == typeof r) return void s(n(r, e), t) } t._state = 1, t._value = e, u(t) } catch (i) { f(t, i) } } function f(t, e) { t._state = 2, t._value = e, u(t) } function u(t) { 2 === t._state && 0 === t._deferreds.length && a(function () { t._handled || d(t._value) }); for (var e = 0, n = t._deferreds.length; n > e; e++) r(t, t._deferreds[e]); t._deferreds = null } function c(t, e, n) { this.onFulfilled = "function" == typeof t ? t : null, this.onRejected = "function" == typeof e ? e : null, this.promise = n } function s(t, e) { var n = !1; try { t(function (t) { n || (n = !0, i(e, t)) }, function (t) { n || (n = !0, f(e, t)) }) } catch (o) { if (n) return; n = !0, f(e, o) } } var l = setTimeout, a = "function" == typeof setImmediate && setImmediate || function (t) { l(t, 0) }, d = function (t) { "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t) }; o.prototype["catch"] = function (t) { return this.then(null, t) }, o.prototype.then = function (t, n) { var o = new this.constructor(e); return r(this, new c(t, n, o)), o }, o.all = function (t) { var e = Array.prototype.slice.call(t); return new o(function (t, n) { function o(i, f) { try { if (f && ("object" == typeof f || "function" == typeof f)) { var u = f.then; if ("function" == typeof u) return void u.call(f, function (t) { o(i, t) }, n) } e[i] = f, 0 === --r && t(e) } catch (c) { n(c) } } if (0 === e.length) return t([]); for (var r = e.length, i = 0; i < e.length; i++) o(i, e[i]) }) }, o.resolve = function (t) { return t && "object" == typeof t && t.constructor === o ? t : new o(function (e) { e(t) }) }, o.reject = function (t) { return new o(function (e, n) { n(t) }) }, o.race = function (t) { return new o(function (e, n) { for (var o = 0, r = t.length; r > o; o++) t[o].then(e, n) }) }, o._setImmediateFn = function (t) { a = t }, o._setUnhandledRejectionFn = function (t) { d = t }, "undefined" != typeof module && module.exports ? module.exports = o : t.Promise || (t.Promise = o) }(this);
var pu_search = [];

if (window.jQuery){
  (function ($) {

      $(document).ready(function () {
      jQuery('.pu-select').each(function (elem) {
          var cb = new combobox(this.id, true);
          pu_search.push({ "id": this.id, "cb": cb });
      });
  });
  })(jQuery);
}


function keyCodes() {
  this.backspace  = 8;
  this.tab        = 9;
  this.enter      = 13;
  this.shift      = 16; 
  this.ctrl       = 17; 
  this.alt        = 18; 
  this.esc        = 27;
  this.space      = 32;
  this.pageup     = 33;
  this.pagedown   = 34;
  this.end        = 35;
  this.home       = 36;
  this.left       = 37;
  this.up         = 38;
  this.right      = 39; 
  this.down       = 40; 

} 


function combobox(id, editable) {

  // Define the object properties
  this.$id = jQuery('#' + id);  // The jQuery object of the div containing the combobox
  this.editable = editable;  // True if the edit box is editable
  this.keys = new keyCodes();

  // Store jQuery objects for the elements of the combobox
  this.$edit = jQuery('#' + id + "-edit");  // The jQuery object of the edit box
  this.$postBack = jQuery('#' + id + "-postback");  // The jQuery object of the postback value


  this.$button = jQuery('#' + id + '-button');  // The jQuery object of the button
  this.$list = jQuery('#' + id + '-list');  // The jQuery object of the option list
  this.$options = this.$list.find('li');  // An array of jQuery objects for the combobox options

  this.$selected; // the current value of the combobox
  this.$focused; // the currently selected option in the combo list
  this.timer = null; // stores the close list timer that is set when combo looses focus

  this.init();

  this.bindHandlers();

}

combobox.prototype.init = function() {

  // Hide the list of options
  this.closeList(false);

  // If the edit box is to be readonly, aria-readonly must be defined as true
  if (this.editable == false) {
    this.$edit.attr('aria-readonly', 'false');
  }

  // Set initial value for the edit box
  this.$selected = this.$options.filter('.selected');

  if (this.$selected.length > 0) {
    this.$edit.val(this.$selected.text());
  }

} 

combobox.prototype.bindHandlers = function() {

  var thisObj = this;

  ///////////////// bind editbox handlers /////////////////////////

  this.$edit.on('keydown', function(e) {
    return thisObj.handleEditKeyDown(jQuery(this), e);
  });

  this.$edit.on('keyup', function(e) {
    return thisObj.handleEditKeyUp(jQuery(this), e);
  });

  this.$edit.on('keypress', function(e) {
    return thisObj.handleEditKeyPress(jQuery(this), e);
  });

  this.$edit.on('blur', function(e) {
    return thisObj.handleComboBlur(jQuery(this), e);
  });

  this.$edit.on('click', function(e) {
    return thisObj.handleButtonClick(jQuery(this), e);
  });
  
    this.$edit.on('mousedown', function(e) {
    return thisObj.handleButtonMouseDown(jQuery(this), e);
  });
 
  ///////////////// bind handlers for the button /////////////////////////
  
  this.$button.on('click', function(e) {
    return thisObj.handleButtonClick(jQuery(this), e);
  });
  
    

  this.$button.on('mouseover', function(e) {
    return thisObj.handleButtonMouseOver(jQuery(this), e);
  });

  this.$button.on('mouseout', function(e) {
    return thisObj.handleButtonMouseOut(jQuery(this), e);
  });

  this.$button.on('mousedown', function(e) {
    return thisObj.handleButtonMouseDown(jQuery(this), e);
  });

  this.$button.on('mouseup', function(e) {
    return thisObj.handleButtonMouseUp(jQuery(this), e);
  });

  ///////////////// bind listbox handlers /////////////////////////

  this.$list.on('focus', function(e) {
    return thisObj.handleComboFocus(jQuery(this), e);
  });

  this.$list.on('blur', function(e) {
    return thisObj.handleComboBlur(jQuery(this), e);
  });

  ///////////////// bind list option handlers /////////////////////////

  this.$options.on('click', function(e) {
    return thisObj.handleOptionClick(jQuery(this), e);
  });
  


} 

combobox.prototype.isOpen = function() {

  if (this.$list.attr('aria-expanded') == 'true') {
    return true;
  }
  else {
    return false;
  }

}

combobox.prototype.closeList = function(restore) {

  var $curOption = this.$options.filter('.selected');
  if (restore == true) {
    $curOption = this.$selected;

    // remove the selected class from the other list items
    this.$options.removeClass('selected');

    // add selected class to the stored selection
    $curOption.addClass('selected');
  }

  this.$list.hide().attr('aria-expanded', 'false');
  this.$edit.attr('aria-expanded', 'false');
  // Reset list options that were hidden due to search
  this.$options = this.$list.find('li').removeClass('hidden')

} 

combobox.prototype.openList = function(restore) {

  var $curOption = this.$options.filter('.selected');

  if (restore == true) {
    $curOption = this.$selected;

    // remove the selected class from the other list items
    this.$options.removeClass('selected');

    // add selected class to the stored selection
    $curOption.addClass('selected');
  }

  this.$list.show().attr('aria-expanded', 'true');
  this.$edit.attr('aria-expanded', 'true');

  if (this.$selected.length == 0) {

    // select the first item
    this.selectOption(this.$options.first());
    $curOption = this.$selected;
  }

  // scroll to the currently selected option
  this.$list.scrollTop(this.calcOffset($curOption));

} 

combobox.prototype.toggleList = function(restore) {

  if (this.isOpen() == true) {

    this.closeList(restore);
  }
  else {
    this.openList(restore);
  }

}

combobox.prototype.clearSelection = function() {
  this.selectOption(this.$options.filter('.selected'));
}

combobox.prototype.selectOption = function($id) {

  var currentValue = this.$postBack.val();

  // don't do anything if nothing is selected because it does not
  // exist in the selection list
  if ($id.length == 0)
    return;
    
  if (currentValue == $id.attr("data-value")) {
    this.$edit.val($id.text()); 
    return;
  }

  // remove the selected class from the list
  this.$options.removeClass('selected');
  
  // add the selected class to the new option
  $id.addClass('selected');

  // store the newly selected option
  this.$selected = $id;     
 
  // update the edit box
  this.$edit.val($id.text());
  this.$edit.trigger('select');
  this.$postBack.val($id.attr("data-value"));
  this.$postBack.trigger('change');

  // reset the option list
  this.$options = this.$list.find('li').removeClass('hidden');
} 

combobox.prototype.calcOffset = function($id) {
  var offset = 0;
  var selectedNdx = this.$options.index($id);

  for (var ndx = 0; ndx < selectedNdx; ndx++) {
    if (this.$options.eq(ndx).not('[class=hidden]')) {
      offset += this.$options.eq(ndx).outerHeight();
    }
  }

  return offset;

} 

combobox.prototype.handleButtonClick = function($id,  e) {

  e.stopPropagation();
  return false;

}

combobox.prototype.handleButtonMouseOver = function($id,  e) {

  e.stopPropagation();
  return false;

} 

combobox.prototype.handleButtonMouseOut = function($id,  e) {

  e.stopPropagation();
  return false;

} 

combobox.prototype.handleButtonMouseDown = function($id,  e) {

  // toggle the display of the option list
  this.toggleList(true);

  // Set focus on the edit box
  this.$edit.trigger('focus');

  e.stopPropagation();
  return false;

}

combobox.prototype.handleButtonMouseUp = function($id,  e) {

  e.stopPropagation();
  return false;

}

combobox.prototype.handleEditKeyDown = function($id,  e) {

  var $curOption = this.$options.filter('.selected');
  var curNdx = this.$options.index($curOption);
  switch(e.keyCode) {
    case this.keys.tab: {
      // store the current selection
      this.selectOption($curOption);

      if (this.isOpen() == true) {
        // Close the option list
        this.closeList(false);
      }
     

      // allow tab to propagate
      return true;
    }
    case this.keys.esc: {
      // Do not change combobox value

      // Restore the edit box to the selected value
      this.$edit.val(this.$selected.text());

      // Select the text
      this.$edit.trigger('select');

      this.$options = this.$list.find('li').removeClass('hidden');

      if (this.isOpen() == true) {

        // Close the option list
        this.closeList(true);
      }

      e.stopPropagation();
      return false;
    }
    case this.keys.enter: {
      if (e.shiftKey || e.altKey || e.ctrlKey) {
        // do nothing
        return true;
      }

      if (this.isOpen() == false) {
        // open the option list
        this.openList(false);
      }
      else {
        // store the new selection
        this.selectOption($curOption);

        // Close the option list
        this.closeList(false);
      }

      e.stopPropagation();
      return false;
    }
    case this.keys.up: {
      
      var $curOption = this.$options.filter('.selected');

      if (e.shiftKey || e.ctrlKey) {
        // do nothing
        return true;
      }

      if (e.altKey) {
        // alt+up toggles the list

        if (this.isOpen() == true) {

          this.selectOption($curOption);
        }
        
        // toggle the list
        this.toggleList(false);
      }
      else {
        // move to the previous item in the list
      
        if (curNdx > 0) {
          var $prev = this.$options.eq(curNdx - 1);

          // remove the selected class from the current selection
          $curOption.removeClass('selected');

          // Add the selected class to the new selection
          $prev.addClass('selected');

          // Change the text in the edit box
          this.$edit.val($prev.text());
          this.$postBack.val($prev.attr("data-value"));
          this.$postBack.trigger('change');
          
          // Select the text
          this.$edit.trigger('select');
          

          if (this.isOpen() == true) {
            // scroll the list window to the new option
            this.$list.scrollTop(this.calcOffset($prev));
          }
        }
      }

      e.stopPropagation();
      return false;
    }
    case this.keys.down: {
      if (e.shiftKey || e.ctrlKey) {
        // do nothing
        return true;
      }

      if (e.altKey) {
        // alt+up toggles the list

        if (this.isOpen() == true) {
          // Restore the edit box to the selected value
          this.$edit.val(this.$selected.text());
          this.$postBack.val(this.$selected.attr("data-value"));
          this.$postBack.trigger('change');
          // Select the text
          this.$edit.trigger('select');

          // alt+up toggles the list
          this.closeList(true);
        }
        else {
          // alt+up toggles the list
          this.openList(false);
        }
      }
      else {
        // move to the next item in the list

        if (curNdx != this.$options.length - 1) {
          var $prev = this.$options.eq(curNdx + 1);

          // remove the selected class from the current selection
          this.$options.eq(curNdx).removeClass('selected');

          // Add the selected class to the new selection
          $prev.addClass('selected');

          // Change the text in the edit box
          this.$edit.val($prev.text());
          // Select the text
          
          this.$edit.trigger('select');
          this.$postBack.val($prev.attr("data-value"));
          this.$postBack.trigger('change');

          if (this.isOpen() == true) {
            // scroll the list window to the new option
            this.$list.scrollTop(this.calcOffset($prev));
          }
        }
      }

      e.stopPropagation();
      return false;
    }
  }

  return true;

} 

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

combobox.prototype.handleEditKeyUp = function($id,  e) {

  var thisObj = this;
  var val = this.$edit.val();
  var re = new RegExp(escapeRegExp(val), 'i');

  if (e.ctrlKey || e.altKey) {
    // do nothing
    return true;
  }

  switch (e.keyCode) {
    case this.keys.shift:
    case this.keys.ctrl:
    case this.keys.alt:
    case this.keys.esc: 
    case this.keys.tab:
    case this.keys.enter:
    case this.keys.left:
    case this.keys.right:
    case this.keys.up:
    case this.keys.down:
    case this.keys.home:
    case this.keys.end: {
      // do nothing
      return true;
    }
  }

  // repopulate the list make all items visible and remove the selection highlighting
  this.$options = this.$list.find('li').removeClass('hidden').removeClass('selected');

  if (val.length == 0) {
    // if the list box is visible, scroll to the top
    if (this.isOpen() == true) {
      this.$list.scrollTop(0);
    }
  }
  else {
    // recreate the list including only options that match
    // what the user typed
    this.$options = this.$options.filter(function(index) {
      if (re.test(jQuery(this).text()) == true) {
        return true;
      }
      else {
        // hide those entries that do not match
        jQuery(this).addClass('hidden');

        return false;
      }
    });
  }
  
  if (this.$options.length > 0) {
    var $newOption = this.$options.first();

    // Reset the highlighting for the list
    this.$options.removeClass('selected');

    $newOption.addClass('selected');
  }

  // Show the list if it is hidden
  if (this.isOpen() == false) {
    this.openList(false);
  }

  e.stopPropagation();
  return false;
} 

combobox.prototype.handleEditKeyPress = function($id,  e) {

  var curNdx = this.$options.index($id);

  if (e.altKey && (e.keyCode == this.keys.up || e.keyCode == this.keys.down)) {
    e.stopPropagation();
    return false;
  }

  if (!e.shiftKey){
    switch(e.keyCode) {
      case this.keys.enter:
      case this.keys.up:
      case this.keys.down: {
        e.stopPropagation();
        return false;
      }
    }
  }

  return true;

} 

combobox.prototype.handleOptionClick = function($id,  e) {

  // select the clicked item
  this.selectOption($id);

  // set focus on the edit box
  this.$edit.trigger('focus');

  // close the list
  this.closeList(false);

  this.$options = this.$list.find('li').removeClass('hidden');

  e.stopPropagation();
  return false;  

} 

combobox.prototype.handleComboFocus = function($id,  e) {

    var key = $id[0].id.replace('-list', '');
    var instance = pu_search.find(function (elem) {
        return elem.id === key;
    });

    if (instance != null) {
        window.clearTimeout(instance.cb.timer);

        // set focus on the edit box
        this.$edit.trigger('focus');

        e.stopPropagation();
    }
    return false;

} 

combobox.prototype.handleComboBlur = function($id,  e) {

  if ($id[0].id.search("-edit") != -1 && e.relatedTarget !== this.$list[0])
  {
    if (this.$postBack.val() != $id[0].value)
    {
      var option = this.$list.find('li[data-value="' + this.$postBack.val() + '"]');
      if (option && option.length > 0) {
        $id[0].value = option[0].textContent;
      }
      else {
        $id[0].value = this.$postBack.val();
      }
    }
  }
  
  var key = $id[0].id.replace("-edit", "");
  var instance = pu_search.find(function (elem) {
      return elem.id === key;
  });  // store the currently selected value
    

  // close the list box
  if (this.isOpen() == true && instance != null) {
      this.timer = window.setTimeout(function () { instance.cb.closeList(false); }, 40);
  }

  e.stopPropagation();
  return false;

} 
function buildDropDown(sDivName, items, defaultText, name, onchange, readonly, isRequired){
    var onchangeHandler = '';
    if (onchange != '') {
      onchangeHandler = 'onchange=' + onchange + ';';
    }

    var html = "<input " + readonly + " autocomplete='off' id='" + sDivName + "-edit' class='" + sDivName + "_edit form-control  dropdownEdit' type='text' tabindex='0' role='combobox' aria-labelledby='" + sDivName + "_label'  aria-autocomplete='inline' aria-owns='" + sDivName + "-list' aria-required='" + isRequired.toLowerCase() + "' />";
    html = html + "<div id='" + sDivName + "-button-label' class='hidden'>Open list</div><span class='input-group-btn'><button id='" + sDivName + "-button' aria-labelledby='" + sDivName + "-button-label' aria-controls='" + sDivName +  "-list' tabindex='-1' class='btn' type='button'><span class='caret'></span></button></span>";
    html = html + "<input type='hidden'  name='" + name + "' id='" + sDivName + "-postback' class='hidden dropdownvalue'" + onchangeHandler + "  value />";
    html = html + "<ul id='" + sDivName + "-list' class='cb_list' tabindex='-1' role='listbox' aria-expanded='true' >";
    html = html + "<li role='option' data-value='' class='cb_option selected' >" + defaultText + "</li>";
    for (i = 0; i < items.length; i++){
        html = html + "<li role='option' data-value='" +  items[i][0] + "' class='cb_option' >" + items[i][1] + "</li>";
    }
    html = html + "</ul>";
    return html;      
}


function attachToDom(sDivName, html, container){
      var span = container.parentNode;
      span.innerHTML = '';
      delete span.children[0];
      var temp = document.createElement('div');
      temp.setAttribute('id', sDivName);
      temp.setAttribute('class', 'input-group cb pu-select');
      temp.innerHTML = html;
      span.appendChild(temp);
      pu_search = pu_search.filter(function(el) { return el.id !== sDivName});
      pu_search.push({ 'id': sDivName, 'cb': new combobox(sDivName, true)});
}

function removeSelected(fieldid){
      var element = document.getElementById(fieldid+"-list")
      if (element)
      {
        selectedOption = element.getElementsByClassName('selected')[0];
        if(selectedOption){
          if(selectedOption.classList){
            selectedOption.classList.remove("selected");
          }
          else{
            selectedOption.className = "cb_option";//support for IE9 or earlier
          }
        }
          

        defaultOption = element.getElementsByTagName("li");
        if(defaultOption && defaultOption.length > 0){
          if(defaultOption[0].classList){
              defaultOption[0].classList.add("selected");
          }
          else{
              defaultOption[0].className = "cb_option selected";//support for IE9 or earlier
          }
        }      
          
      }
      var result = pu_search.filter(function(el) { return el.id === fieldid });

      if (result && result.length > 0)
        result[0].cb.clearSelection();
}
function InitializeFlareHRContainer(props) {
    console.info('#### InitializeFlareHRContainer');
    var flareContainerID = props.flareContainerID;
    var formRunnerHeaderControl = props.formRunnerHeaderControl;
    var formRunnerBootstrapUiUrl = props.formRunnerBootstrapUiUrl;

    HidePageElementsExceptForContainer(flareContainerID);

    // trigger any intializers here
    if (FormRunnerBootstrapCSS) {
        FormRunnerBootstrapCSS(formRunnerBootstrapUiUrl);
        // Show formRunner controls
        formRunnerHeaderControl.show();
    }
}

function HidePageElementsExceptForContainer(containerControlID) {
    var containerControl = document.getElementById(containerControlID);
    
    // Get all parent controls recursively until root
    var containerControlParents = [];
    for (element = containerControl; element && element !== document; element = element.parentNode) {
        containerControlParents.push(element);
    }

    // Selector to get all elements except for the container control and its child nodes
    document.querySelectorAll(`body *:not(#${containerControlID} *)`)
        .forEach((element) => {
            // Exclude elements that are parents of the container control
            if (!containerControlParents.includes(element))
                element.hide();
        });
}

function AttachFlareIframeEvents(props) {
    var submitButtonControl = props.submitButtonControl;
    var iframeControl = props.iFrameControl;

    console.info('#### InitializeFlareHRContainer: attachFlareIframeEvents');
    const messageSender = 'flare';

    // Copied from FlareHR documentations. 
    // ref: https://sandbox-partner.flarehr.com/portal/#/doc/general/workflows
    window.addEventListener(
        'message',
        (event) => {
            const { data } = event;
            if (!data || data.sender !== messageSender) {
                return;
            }

            switch (data.type) {
                case 'contentResized':
                    const minHeight = 600;
                    const borderOffset = 4; // Required to remove iframe scroll bar as the iframe borders take up 4px
                    iframeControl.height = data.height >= minHeight ? data.height + borderOffset : minHeight;
                    iframeControl.width = data.width >= 0 ? data.width : iframeControl.width;
                    break;
                case 'pageNavigated':
                    window.scroll(iframeControl.offsetLeft, iframeControl.offsetTop);
                    break;
                case 'stepSubmitSuccess':
                    break;
                case 'workflowSubmitSuccess':
                    console.log('workflowSubmitSuccess');
                    submitButtonControl.click();
                    break;
                default:
                    break;
            }
        },
        false
    );
}

function NavigateToFlareForm(flareFormUrl) {
    window.location = flareFormUrl;
}
