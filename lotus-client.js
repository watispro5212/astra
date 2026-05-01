// ==UserScript==
// @name         lotus client
// @version      v1.4
// @author       zylex/stary
// @description  lotus nice plant
// @icon         https://static.wikia.nocookie.net/official-florrio/images/a/a8/Lotus_%28Unique%29.png/revision/latest/scale-to-width/360?cb=20250119191651
// @match        *://*.moomoo.io/*
// @run-at       document_start
// @grant        none
// ==/UserScript==

// MSGPACK FOR THE SCRIPT:
!function (t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else { var r; r = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, r.msgpack = t() } }(function () {
    return function t(r, e, n) { function i(f, u) { if (!e[f]) { if (!r[f]) { var a = "function" == typeof require && require; if (!u && a) return a(f, !0); if (o) return o(f, !0); var s = new Error("Cannot find module '" + f + "'"); throw s.code = "MODULE_NOT_FOUND", s } var c = e[f] = { exports: {} }; r[f][0].call(c.exports, function (t) { var e = r[f][1][t]; return i(e ? e : t) }, c, c.exports, t, r, e, n) } return e[f].exports } for (var o = "function" == typeof require && require, f = 0; f < n.length; f++)i(n[f]); return i }({
        1: [function (t, r, e) { e.encode = t("./encode").encode, e.decode = t("./decode").decode, e.Encoder = t("./encoder").Encoder, e.Decoder = t("./decoder").Decoder, e.createCodec = t("./ext").createCodec, e.codec = t("./codec").codec }, { "./codec": 10, "./decode": 12, "./decoder": 13, "./encode": 15, "./encoder": 16, "./ext": 20 }], 2: [function (t, r, e) { (function (Buffer) { function t(t) { return t && t.isBuffer && t } r.exports = t("undefined" != typeof Buffer && Buffer) || t(this.Buffer) || t("undefined" != typeof window && window.Buffer) || this.Buffer }).call(this, t("buffer").Buffer) }, { buffer: 29 }], 3: [function (t, r, e) { function n(t, r) { for (var e = this, n = r || (r |= 0), i = t.length, o = 0, f = 0; f < i;)o = t.charCodeAt(f++), o < 128 ? e[n++] = o : o < 2048 ? (e[n++] = 192 | o >>> 6, e[n++] = 128 | 63 & o) : o < 55296 || o > 57343 ? (e[n++] = 224 | o >>> 12, e[n++] = 128 | o >>> 6 & 63, e[n++] = 128 | 63 & o) : (o = (o - 55296 << 10 | t.charCodeAt(f++) - 56320) + 65536, e[n++] = 240 | o >>> 18, e[n++] = 128 | o >>> 12 & 63, e[n++] = 128 | o >>> 6 & 63, e[n++] = 128 | 63 & o); return n - r } function i(t, r, e) { var n = this, i = 0 | r; e || (e = n.length); for (var o = "", f = 0; i < e;)f = n[i++], f < 128 ? o += String.fromCharCode(f) : (192 === (224 & f) ? f = (31 & f) << 6 | 63 & n[i++] : 224 === (240 & f) ? f = (15 & f) << 12 | (63 & n[i++]) << 6 | 63 & n[i++] : 240 === (248 & f) && (f = (7 & f) << 18 | (63 & n[i++]) << 12 | (63 & n[i++]) << 6 | 63 & n[i++]), f >= 65536 ? (f -= 65536, o += String.fromCharCode((f >>> 10) + 55296, (1023 & f) + 56320)) : o += String.fromCharCode(f)); return o } function o(t, r, e, n) { var i; e || (e = 0), n || 0 === n || (n = this.length), r || (r = 0); var o = n - e; if (t === this && e < r && r < n) for (i = o - 1; i >= 0; i--)t[i + r] = this[i + e]; else for (i = 0; i < o; i++)t[i + r] = this[i + e]; return o } e.copy = o, e.toString = i, e.write = n }, {}], 4: [function (t, r, e) { function n(t) { return new Array(t) } function i(t) { if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t); else if (o.isArrayBuffer(t)) t = new Uint8Array(t); else { if ("string" == typeof t) return o.from.call(e, t); if ("number" == typeof t) throw new TypeError('"value" argument must not be a number') } return Array.prototype.slice.call(t) } var o = t("./bufferish"), e = r.exports = n(0); e.alloc = n, e.concat = o.concat, e.from = i }, { "./bufferish": 8 }], 5: [function (t, r, e) { function n(t) { return new Buffer(t) } function i(t) { if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t); else if (o.isArrayBuffer(t)) t = new Uint8Array(t); else { if ("string" == typeof t) return o.from.call(e, t); if ("number" == typeof t) throw new TypeError('"value" argument must not be a number') } return Buffer.from && 1 !== Buffer.from.length ? Buffer.from(t) : new Buffer(t) } var o = t("./bufferish"), Buffer = o.global, e = r.exports = o.hasBuffer ? n(0) : []; e.alloc = o.hasBuffer && Buffer.alloc || n, e.concat = o.concat, e.from = i }, { "./bufferish": 8 }], 6: [function (t, r, e) { function n(t, r, e, n) { var o = a.isBuffer(this), f = a.isBuffer(t); if (o && f) return this.copy(t, r, e, n); if (c || o || f || !a.isView(this) || !a.isView(t)) return u.copy.call(this, t, r, e, n); var s = e || null != n ? i.call(this, e, n) : this; return t.set(s, r), s.length } function i(t, r) { var e = this.slice || !c && this.subarray; if (e) return e.call(this, t, r); var i = a.alloc.call(this, r - t); return n.call(this, i, 0, t, r), i } function o(t, r, e) { var n = !s && a.isBuffer(this) ? this.toString : u.toString; return n.apply(this, arguments) } function f(t) { function r() { var r = this[t] || u[t]; return r.apply(this, arguments) } return r } var u = t("./buffer-lite"); e.copy = n, e.slice = i, e.toString = o, e.write = f("write"); var a = t("./bufferish"), Buffer = a.global, s = a.hasBuffer && "TYPED_ARRAY_SUPPORT" in Buffer, c = s && !Buffer.TYPED_ARRAY_SUPPORT }, { "./buffer-lite": 3, "./bufferish": 8 }], 7: [function (t, r, e) { function n(t) { return new Uint8Array(t) } function i(t) { if (o.isView(t)) { var r = t.byteOffset, n = t.byteLength; t = t.buffer, t.byteLength !== n && (t.slice ? t = t.slice(r, r + n) : (t = new Uint8Array(t), t.byteLength !== n && (t = Array.prototype.slice.call(t, r, r + n)))) } else { if ("string" == typeof t) return o.from.call(e, t); if ("number" == typeof t) throw new TypeError('"value" argument must not be a number') } return new Uint8Array(t) } var o = t("./bufferish"), e = r.exports = o.hasArrayBuffer ? n(0) : []; e.alloc = n, e.concat = o.concat, e.from = i }, { "./bufferish": 8 }], 8: [function (t, r, e) { function n(t) { return "string" == typeof t ? u.call(this, t) : a(this).from(t) } function i(t) { return a(this).alloc(t) } function o(t, r) { function n(t) { r += t.length } function o(t) { a += w.copy.call(t, u, a) } r || (r = 0, Array.prototype.forEach.call(t, n)); var f = this !== e && this || t[0], u = i.call(f, r), a = 0; return Array.prototype.forEach.call(t, o), u } function f(t) { return t instanceof ArrayBuffer || E(t) } function u(t) { var r = 3 * t.length, e = i.call(this, r), n = w.write.call(e, t); return r !== n && (e = w.slice.call(e, 0, n)), e } function a(t) { return d(t) ? g : y(t) ? b : p(t) ? v : h ? g : l ? b : v } function s() { return !1 } function c(t, r) { return t = "[object " + t + "]", function (e) { return null != e && {}.toString.call(r ? e[r] : e) === t } } var Buffer = e.global = t("./buffer-global"), h = e.hasBuffer = Buffer && !!Buffer.isBuffer, l = e.hasArrayBuffer = "undefined" != typeof ArrayBuffer, p = e.isArray = t("isarray"); e.isArrayBuffer = l ? f : s; var d = e.isBuffer = h ? Buffer.isBuffer : s, y = e.isView = l ? ArrayBuffer.isView || c("ArrayBuffer", "buffer") : s; e.alloc = i, e.concat = o, e.from = n; var v = e.Array = t("./bufferish-array"), g = e.Buffer = t("./bufferish-buffer"), b = e.Uint8Array = t("./bufferish-uint8array"), w = e.prototype = t("./bufferish-proto"), E = c("ArrayBuffer") }, { "./buffer-global": 2, "./bufferish-array": 4, "./bufferish-buffer": 5, "./bufferish-proto": 6, "./bufferish-uint8array": 7, isarray: 34 }], 9: [function (t, r, e) { function n(t) { return this instanceof n ? (this.options = t, void this.init()) : new n(t) } function i(t) { for (var r in t) n.prototype[r] = o(n.prototype[r], t[r]) } function o(t, r) { function e() { return t.apply(this, arguments), r.apply(this, arguments) } return t && r ? e : t || r } function f(t) { function r(t, r) { return r(t) } return t = t.slice(), function (e) { return t.reduce(r, e) } } function u(t) { return s(t) ? f(t) : t } function a(t) { return new n(t) } var s = t("isarray"); e.createCodec = a, e.install = i, e.filter = u; var c = t("./bufferish"); n.prototype.init = function () { var t = this.options; return t && t.uint8array && (this.bufferish = c.Uint8Array), this }, e.preset = a({ preset: !0 }) }, { "./bufferish": 8, isarray: 34 }], 10: [function (t, r, e) { t("./read-core"), t("./write-core"), e.codec = { preset: t("./codec-base").preset } }, { "./codec-base": 9, "./read-core": 22, "./write-core": 25 }], 11: [function (t, r, e) { function n(t) { if (!(this instanceof n)) return new n(t); if (t && (this.options = t, t.codec)) { var r = this.codec = t.codec; r.bufferish && (this.bufferish = r.bufferish) } } e.DecodeBuffer = n; var i = t("./read-core").preset, o = t("./flex-buffer").FlexDecoder; o.mixin(n.prototype), n.prototype.codec = i, n.prototype.fetch = function () { return this.codec.decode(this) } }, { "./flex-buffer": 21, "./read-core": 22 }], 12: [function (t, r, e) { function n(t, r) { var e = new i(r); return e.write(t), e.read() } e.decode = n; var i = t("./decode-buffer").DecodeBuffer }, { "./decode-buffer": 11 }], 13: [function (t, r, e) { function n(t) { return this instanceof n ? void o.call(this, t) : new n(t) } e.Decoder = n; var i = t("event-lite"), o = t("./decode-buffer").DecodeBuffer; n.prototype = new o, i.mixin(n.prototype), n.prototype.decode = function (t) { arguments.length && this.write(t), this.flush() }, n.prototype.push = function (t) { this.emit("data", t) }, n.prototype.end = function (t) { this.decode(t), this.emit("end") } }, { "./decode-buffer": 11, "event-lite": 31 }], 14: [function (t, r, e) { function n(t) { if (!(this instanceof n)) return new n(t); if (t && (this.options = t, t.codec)) { var r = this.codec = t.codec; r.bufferish && (this.bufferish = r.bufferish) } } e.EncodeBuffer = n; var i = t("./write-core").preset, o = t("./flex-buffer").FlexEncoder; o.mixin(n.prototype), n.prototype.codec = i, n.prototype.write = function (t) { this.codec.encode(this, t) } }, { "./flex-buffer": 21, "./write-core": 25 }], 15: [function (t, r, e) { function n(t, r) { var e = new i(r); return e.write(t), e.read() } e.encode = n; var i = t("./encode-buffer").EncodeBuffer }, { "./encode-buffer": 14 }], 16: [function (t, r, e) { function n(t) { return this instanceof n ? void o.call(this, t) : new n(t) } e.Encoder = n; var i = t("event-lite"), o = t("./encode-buffer").EncodeBuffer; n.prototype = new o, i.mixin(n.prototype), n.prototype.encode = function (t) { this.write(t), this.emit("data", this.read()) }, n.prototype.end = function (t) { arguments.length && this.encode(t), this.flush(), this.emit("end") } }, { "./encode-buffer": 14, "event-lite": 31 }], 17: [function (t, r, e) { function n(t, r) { return this instanceof n ? (this.buffer = i.from(t), void (this.type = r)) : new n(t, r) } e.ExtBuffer = n; var i = t("./bufferish") }, { "./bufferish": 8 }], 18: [function (t, r, e) { function n(t) { t.addExtPacker(14, Error, [u, i]), t.addExtPacker(1, EvalError, [u, i]), t.addExtPacker(2, RangeError, [u, i]), t.addExtPacker(3, ReferenceError, [u, i]), t.addExtPacker(4, SyntaxError, [u, i]), t.addExtPacker(5, TypeError, [u, i]), t.addExtPacker(6, URIError, [u, i]), t.addExtPacker(10, RegExp, [f, i]), t.addExtPacker(11, Boolean, [o, i]), t.addExtPacker(12, String, [o, i]), t.addExtPacker(13, Date, [Number, i]), t.addExtPacker(15, Number, [o, i]), "undefined" != typeof Uint8Array && (t.addExtPacker(17, Int8Array, c), t.addExtPacker(18, Uint8Array, c), t.addExtPacker(19, Int16Array, c), t.addExtPacker(20, Uint16Array, c), t.addExtPacker(21, Int32Array, c), t.addExtPacker(22, Uint32Array, c), t.addExtPacker(23, Float32Array, c), "undefined" != typeof Float64Array && t.addExtPacker(24, Float64Array, c), "undefined" != typeof Uint8ClampedArray && t.addExtPacker(25, Uint8ClampedArray, c), t.addExtPacker(26, ArrayBuffer, c), t.addExtPacker(29, DataView, c)), s.hasBuffer && t.addExtPacker(27, Buffer, s.from) } function i(r) { return a || (a = t("./encode").encode), a(r) } function o(t) { return t.valueOf() } function f(t) { t = RegExp.prototype.toString.call(t).split("/"), t.shift(); var r = [t.pop()]; return r.unshift(t.join("/")), r } function u(t) { var r = {}; for (var e in h) r[e] = t[e]; return r } e.setExtPackers = n; var a, s = t("./bufferish"), Buffer = s.global, c = s.Uint8Array.from, h = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 } }, { "./bufferish": 8, "./encode": 15 }], 19: [function (t, r, e) { function n(t) { t.addExtUnpacker(14, [i, f(Error)]), t.addExtUnpacker(1, [i, f(EvalError)]), t.addExtUnpacker(2, [i, f(RangeError)]), t.addExtUnpacker(3, [i, f(ReferenceError)]), t.addExtUnpacker(4, [i, f(SyntaxError)]), t.addExtUnpacker(5, [i, f(TypeError)]), t.addExtUnpacker(6, [i, f(URIError)]), t.addExtUnpacker(10, [i, o]), t.addExtUnpacker(11, [i, u(Boolean)]), t.addExtUnpacker(12, [i, u(String)]), t.addExtUnpacker(13, [i, u(Date)]), t.addExtUnpacker(15, [i, u(Number)]), "undefined" != typeof Uint8Array && (t.addExtUnpacker(17, u(Int8Array)), t.addExtUnpacker(18, u(Uint8Array)), t.addExtUnpacker(19, [a, u(Int16Array)]), t.addExtUnpacker(20, [a, u(Uint16Array)]), t.addExtUnpacker(21, [a, u(Int32Array)]), t.addExtUnpacker(22, [a, u(Uint32Array)]), t.addExtUnpacker(23, [a, u(Float32Array)]), "undefined" != typeof Float64Array && t.addExtUnpacker(24, [a, u(Float64Array)]), "undefined" != typeof Uint8ClampedArray && t.addExtUnpacker(25, u(Uint8ClampedArray)), t.addExtUnpacker(26, a), t.addExtUnpacker(29, [a, u(DataView)])), c.hasBuffer && t.addExtUnpacker(27, u(Buffer)) } function i(r) { return s || (s = t("./decode").decode), s(r) } function o(t) { return RegExp.apply(null, t) } function f(t) { return function (r) { var e = new t; for (var n in h) e[n] = r[n]; return e } } function u(t) { return function (r) { return new t(r) } } function a(t) { return new Uint8Array(t).buffer } e.setExtUnpackers = n; var s, c = t("./bufferish"), Buffer = c.global, h = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 } }, { "./bufferish": 8, "./decode": 12 }], 20: [function (t, r, e) { t("./read-core"), t("./write-core"), e.createCodec = t("./codec-base").createCodec }, { "./codec-base": 9, "./read-core": 22, "./write-core": 25 }], 21: [function (t, r, e) { function n() { if (!(this instanceof n)) return new n } function i() { if (!(this instanceof i)) return new i } function o() { function t(t) { var r = this.offset ? p.prototype.slice.call(this.buffer, this.offset) : this.buffer; this.buffer = r ? t ? this.bufferish.concat([r, t]) : r : t, this.offset = 0 } function r() { for (; this.offset < this.buffer.length;) { var t, r = this.offset; try { t = this.fetch() } catch (t) { if (t && t.message != v) throw t; this.offset = r; break } this.push(t) } } function e(t) { var r = this.offset, e = r + t; if (e > this.buffer.length) throw new Error(v); return this.offset = e, r } return { bufferish: p, write: t, fetch: a, flush: r, push: c, pull: h, read: s, reserve: e, offset: 0 } } function f() { function t() { var t = this.start; if (t < this.offset) { var r = this.start = this.offset; return p.prototype.slice.call(this.buffer, t, r) } } function r() { for (; this.start < this.offset;) { var t = this.fetch(); t && this.push(t) } } function e() { var t = this.buffers || (this.buffers = []), r = t.length > 1 ? this.bufferish.concat(t) : t[0]; return t.length = 0, r } function n(t) { var r = 0 | t; if (this.buffer) { var e = this.buffer.length, n = 0 | this.offset, i = n + r; if (i < e) return this.offset = i, n; this.flush(), t = Math.max(t, Math.min(2 * e, this.maxBufferSize)) } return t = Math.max(t, this.minBufferSize), this.buffer = this.bufferish.alloc(t), this.start = 0, this.offset = r, 0 } function i(t) { var r = t.length; if (r > this.minBufferSize) this.flush(), this.push(t); else { var e = this.reserve(r); p.prototype.copy.call(t, this.buffer, e) } } return { bufferish: p, write: u, fetch: t, flush: r, push: c, pull: e, read: s, reserve: n, send: i, maxBufferSize: y, minBufferSize: d, offset: 0, start: 0 } } function u() { throw new Error("method not implemented: write()") } function a() { throw new Error("method not implemented: fetch()") } function s() { var t = this.buffers && this.buffers.length; return t ? (this.flush(), this.pull()) : this.fetch() } function c(t) { var r = this.buffers || (this.buffers = []); r.push(t) } function h() { var t = this.buffers || (this.buffers = []); return t.shift() } function l(t) { function r(r) { for (var e in t) r[e] = t[e]; return r } return r } e.FlexDecoder = n, e.FlexEncoder = i; var p = t("./bufferish"), d = 2048, y = 65536, v = "BUFFER_SHORTAGE"; n.mixin = l(o()), n.mixin(n.prototype), i.mixin = l(f()), i.mixin(i.prototype) }, { "./bufferish": 8 }], 22: [function (t, r, e) { function n(t) { function r(t) { var r = s(t), n = e[r]; if (!n) throw new Error("Invalid type: " + (r ? "0x" + r.toString(16) : r)); return n(t) } var e = c.getReadToken(t); return r } function i() { var t = this.options; return this.decode = n(t), t && t.preset && a.setExtUnpackers(this), this } function o(t, r) { var e = this.extUnpackers || (this.extUnpackers = []); e[t] = h.filter(r) } function f(t) { function r(r) { return new u(r, t) } var e = this.extUnpackers || (this.extUnpackers = []); return e[t] || r } var u = t("./ext-buffer").ExtBuffer, a = t("./ext-unpacker"), s = t("./read-format").readUint8, c = t("./read-token"), h = t("./codec-base"); h.install({ addExtUnpacker: o, getExtUnpacker: f, init: i }), e.preset = i.call(h.preset) }, { "./codec-base": 9, "./ext-buffer": 17, "./ext-unpacker": 19, "./read-format": 23, "./read-token": 24 }], 23: [function (t, r, e) { function n(t) { var r = k.hasArrayBuffer && t && t.binarraybuffer, e = t && t.int64, n = T && t && t.usemap, B = { map: n ? o : i, array: f, str: u, bin: r ? s : a, ext: c, uint8: h, uint16: p, uint32: y, uint64: g(8, e ? E : b), int8: l, int16: d, int32: v, int64: g(8, e ? A : w), float32: g(4, m), float64: g(8, x) }; return B } function i(t, r) { var e, n = {}, i = new Array(r), o = new Array(r), f = t.codec.decode; for (e = 0; e < r; e++)i[e] = f(t), o[e] = f(t); for (e = 0; e < r; e++)n[i[e]] = o[e]; return n } function o(t, r) { var e, n = new Map, i = new Array(r), o = new Array(r), f = t.codec.decode; for (e = 0; e < r; e++)i[e] = f(t), o[e] = f(t); for (e = 0; e < r; e++)n.set(i[e], o[e]); return n } function f(t, r) { for (var e = new Array(r), n = t.codec.decode, i = 0; i < r; i++)e[i] = n(t); return e } function u(t, r) { var e = t.reserve(r), n = e + r; return _.toString.call(t.buffer, "utf-8", e, n) } function a(t, r) { var e = t.reserve(r), n = e + r, i = _.slice.call(t.buffer, e, n); return k.from(i) } function s(t, r) { var e = t.reserve(r), n = e + r, i = _.slice.call(t.buffer, e, n); return k.Uint8Array.from(i).buffer } function c(t, r) { var e = t.reserve(r + 1), n = t.buffer[e++], i = e + r, o = t.codec.getExtUnpacker(n); if (!o) throw new Error("Invalid ext type: " + (n ? "0x" + n.toString(16) : n)); var f = _.slice.call(t.buffer, e, i); return o(f) } function h(t) { var r = t.reserve(1); return t.buffer[r] } function l(t) { var r = t.reserve(1), e = t.buffer[r]; return 128 & e ? e - 256 : e } function p(t) { var r = t.reserve(2), e = t.buffer; return e[r++] << 8 | e[r] } function d(t) { var r = t.reserve(2), e = t.buffer, n = e[r++] << 8 | e[r]; return 32768 & n ? n - 65536 : n } function y(t) { var r = t.reserve(4), e = t.buffer; return 16777216 * e[r++] + (e[r++] << 16) + (e[r++] << 8) + e[r] } function v(t) { var r = t.reserve(4), e = t.buffer; return e[r++] << 24 | e[r++] << 16 | e[r++] << 8 | e[r] } function g(t, r) { return function (e) { var n = e.reserve(t); return r.call(e.buffer, n, S) } } function b(t) { return new P(this, t).toNumber() } function w(t) { return new R(this, t).toNumber() } function E(t) { return new P(this, t) } function A(t) { return new R(this, t) } function m(t) { return B.read(this, t, !1, 23, 4) } function x(t) { return B.read(this, t, !1, 52, 8) } var B = t("ieee754"), U = t("int64-buffer"), P = U.Uint64BE, R = U.Int64BE; e.getReadFormat = n, e.readUint8 = h; var k = t("./bufferish"), _ = t("./bufferish-proto"), T = "undefined" != typeof Map, S = !0 }, { "./bufferish": 8, "./bufferish-proto": 6, ieee754: 32, "int64-buffer": 33 }], 24: [function (t, r, e) { function n(t) { var r = s.getReadFormat(t); return t && t.useraw ? o(r) : i(r) } function i(t) { var r, e = new Array(256); for (r = 0; r <= 127; r++)e[r] = f(r); for (r = 128; r <= 143; r++)e[r] = a(r - 128, t.map); for (r = 144; r <= 159; r++)e[r] = a(r - 144, t.array); for (r = 160; r <= 191; r++)e[r] = a(r - 160, t.str); for (e[192] = f(null), e[193] = null, e[194] = f(!1), e[195] = f(!0), e[196] = u(t.uint8, t.bin), e[197] = u(t.uint16, t.bin), e[198] = u(t.uint32, t.bin), e[199] = u(t.uint8, t.ext), e[200] = u(t.uint16, t.ext), e[201] = u(t.uint32, t.ext), e[202] = t.float32, e[203] = t.float64, e[204] = t.uint8, e[205] = t.uint16, e[206] = t.uint32, e[207] = t.uint64, e[208] = t.int8, e[209] = t.int16, e[210] = t.int32, e[211] = t.int64, e[212] = a(1, t.ext), e[213] = a(2, t.ext), e[214] = a(4, t.ext), e[215] = a(8, t.ext), e[216] = a(16, t.ext), e[217] = u(t.uint8, t.str), e[218] = u(t.uint16, t.str), e[219] = u(t.uint32, t.str), e[220] = u(t.uint16, t.array), e[221] = u(t.uint32, t.array), e[222] = u(t.uint16, t.map), e[223] = u(t.uint32, t.map), r = 224; r <= 255; r++)e[r] = f(r - 256); return e } function o(t) { var r, e = i(t).slice(); for (e[217] = e[196], e[218] = e[197], e[219] = e[198], r = 160; r <= 191; r++)e[r] = a(r - 160, t.bin); return e } function f(t) { return function () { return t } } function u(t, r) { return function (e) { var n = t(e); return r(e, n) } } function a(t, r) { return function (e) { return r(e, t) } } var s = t("./read-format"); e.getReadToken = n }, { "./read-format": 23 }], 25: [function (t, r, e) { function n(t) { function r(t, r) { var n = e[typeof r]; if (!n) throw new Error('Unsupported type "' + typeof r + '": ' + r); n(t, r) } var e = s.getWriteType(t); return r } function i() { var t = this.options; return this.encode = n(t), t && t.preset && a.setExtPackers(this), this } function o(t, r, e) { function n(r) { return e && (r = e(r)), new u(r, t) } e = c.filter(e); var i = r.name; if (i && "Object" !== i) { var o = this.extPackers || (this.extPackers = {}); o[i] = n } else { var f = this.extEncoderList || (this.extEncoderList = []); f.unshift([r, n]) } } function f(t) { var r = this.extPackers || (this.extPackers = {}), e = t.constructor, n = e && e.name && r[e.name]; if (n) return n; for (var i = this.extEncoderList || (this.extEncoderList = []), o = i.length, f = 0; f < o; f++) { var u = i[f]; if (e === u[0]) return u[1] } } var u = t("./ext-buffer").ExtBuffer, a = t("./ext-packer"), s = t("./write-type"), c = t("./codec-base"); c.install({ addExtPacker: o, getExtPacker: f, init: i }), e.preset = i.call(c.preset) }, { "./codec-base": 9, "./ext-buffer": 17, "./ext-packer": 18, "./write-type": 27 }], 26: [function (t, r, e) { function n(t) { return t && t.uint8array ? i() : m || E.hasBuffer && t && t.safe ? f() : o() } function i() { var t = o(); return t[202] = c(202, 4, p), t[203] = c(203, 8, d), t } function o() { var t = w.slice(); return t[196] = u(196), t[197] = a(197), t[198] = s(198), t[199] = u(199), t[200] = a(200), t[201] = s(201), t[202] = c(202, 4, x.writeFloatBE || p, !0), t[203] = c(203, 8, x.writeDoubleBE || d, !0), t[204] = u(204), t[205] = a(205), t[206] = s(206), t[207] = c(207, 8, h), t[208] = u(208), t[209] = a(209), t[210] = s(210), t[211] = c(211, 8, l), t[217] = u(217), t[218] = a(218), t[219] = s(219), t[220] = a(220), t[221] = s(221), t[222] = a(222), t[223] = s(223), t } function f() { var t = w.slice(); return t[196] = c(196, 1, Buffer.prototype.writeUInt8), t[197] = c(197, 2, Buffer.prototype.writeUInt16BE), t[198] = c(198, 4, Buffer.prototype.writeUInt32BE), t[199] = c(199, 1, Buffer.prototype.writeUInt8), t[200] = c(200, 2, Buffer.prototype.writeUInt16BE), t[201] = c(201, 4, Buffer.prototype.writeUInt32BE), t[202] = c(202, 4, Buffer.prototype.writeFloatBE), t[203] = c(203, 8, Buffer.prototype.writeDoubleBE), t[204] = c(204, 1, Buffer.prototype.writeUInt8), t[205] = c(205, 2, Buffer.prototype.writeUInt16BE), t[206] = c(206, 4, Buffer.prototype.writeUInt32BE), t[207] = c(207, 8, h), t[208] = c(208, 1, Buffer.prototype.writeInt8), t[209] = c(209, 2, Buffer.prototype.writeInt16BE), t[210] = c(210, 4, Buffer.prototype.writeInt32BE), t[211] = c(211, 8, l), t[217] = c(217, 1, Buffer.prototype.writeUInt8), t[218] = c(218, 2, Buffer.prototype.writeUInt16BE), t[219] = c(219, 4, Buffer.prototype.writeUInt32BE), t[220] = c(220, 2, Buffer.prototype.writeUInt16BE), t[221] = c(221, 4, Buffer.prototype.writeUInt32BE), t[222] = c(222, 2, Buffer.prototype.writeUInt16BE), t[223] = c(223, 4, Buffer.prototype.writeUInt32BE), t } function u(t) { return function (r, e) { var n = r.reserve(2), i = r.buffer; i[n++] = t, i[n] = e } } function a(t) { return function (r, e) { var n = r.reserve(3), i = r.buffer; i[n++] = t, i[n++] = e >>> 8, i[n] = e } } function s(t) { return function (r, e) { var n = r.reserve(5), i = r.buffer; i[n++] = t, i[n++] = e >>> 24, i[n++] = e >>> 16, i[n++] = e >>> 8, i[n] = e } } function c(t, r, e, n) { return function (i, o) { var f = i.reserve(r + 1); i.buffer[f++] = t, e.call(i.buffer, o, f, n) } } function h(t, r) { new g(this, r, t) } function l(t, r) { new b(this, r, t) } function p(t, r) { y.write(this, t, r, !1, 23, 4) } function d(t, r) { y.write(this, t, r, !1, 52, 8) } var y = t("ieee754"), v = t("int64-buffer"), g = v.Uint64BE, b = v.Int64BE, w = t("./write-uint8").uint8, E = t("./bufferish"), Buffer = E.global, A = E.hasBuffer && "TYPED_ARRAY_SUPPORT" in Buffer, m = A && !Buffer.TYPED_ARRAY_SUPPORT, x = E.hasBuffer && Buffer.prototype || {}; e.getWriteToken = n }, { "./bufferish": 8, "./write-uint8": 28, ieee754: 32, "int64-buffer": 33 }], 27: [function (t, r, e) { function n(t) { function r(t, r) { var e = r ? 195 : 194; _[e](t, r) } function e(t, r) { var e, n = 0 | r; return r !== n ? (e = 203, void _[e](t, r)) : (e = -32 <= n && n <= 127 ? 255 & n : 0 <= n ? n <= 255 ? 204 : n <= 65535 ? 205 : 206 : -128 <= n ? 208 : -32768 <= n ? 209 : 210, void _[e](t, n)) } function n(t, r) { var e = 207; _[e](t, r.toArray()) } function o(t, r) { var e = 211; _[e](t, r.toArray()) } function v(t) { return t < 32 ? 1 : t <= 255 ? 2 : t <= 65535 ? 3 : 5 } function g(t) { return t < 32 ? 1 : t <= 65535 ? 3 : 5 } function b(t) { function r(r, e) { var n = e.length, i = 5 + 3 * n; r.offset = r.reserve(i); var o = r.buffer, f = t(n), u = r.offset + f; n = s.write.call(o, e, u); var a = t(n); if (f !== a) { var c = u + a - f, h = u + n; s.copy.call(o, o, c, u, h) } var l = 1 === a ? 160 + n : a <= 3 ? 215 + a : 219; _[l](r, n), r.offset += n } return r } function w(t, r) { if (null === r) return A(t, r); if (I(r)) return Y(t, r); if (i(r)) return m(t, r); if (f.isUint64BE(r)) return n(t, r); if (u.isInt64BE(r)) return o(t, r); var e = t.codec.getExtPacker(r); return e && (r = e(r)), r instanceof l ? U(t, r) : void D(t, r) } function E(t, r) { return I(r) ? k(t, r) : void w(t, r) } function A(t, r) { var e = 192; _[e](t, r) } function m(t, r) { var e = r.length, n = e < 16 ? 144 + e : e <= 65535 ? 220 : 221; _[n](t, e); for (var i = t.codec.encode, o = 0; o < e; o++)i(t, r[o]) } function x(t, r) { var e = r.length, n = e < 255 ? 196 : e <= 65535 ? 197 : 198; _[n](t, e), t.send(r) } function B(t, r) { x(t, new Uint8Array(r)) } function U(t, r) { var e = r.buffer, n = e.length, i = y[n] || (n < 255 ? 199 : n <= 65535 ? 200 : 201); _[i](t, n), h[r.type](t), t.send(e) } function P(t, r) { var e = Object.keys(r), n = e.length, i = n < 16 ? 128 + n : n <= 65535 ? 222 : 223; _[i](t, n); var o = t.codec.encode; e.forEach(function (e) { o(t, e), o(t, r[e]) }) } function R(t, r) { if (!(r instanceof Map)) return P(t, r); var e = r.size, n = e < 16 ? 128 + e : e <= 65535 ? 222 : 223; _[n](t, e); var i = t.codec.encode; r.forEach(function (r, e, n) { i(t, e), i(t, r) }) } function k(t, r) { var e = r.length, n = e < 32 ? 160 + e : e <= 65535 ? 218 : 219; _[n](t, e), t.send(r) } var _ = c.getWriteToken(t), T = t && t.useraw, S = p && t && t.binarraybuffer, I = S ? a.isArrayBuffer : a.isBuffer, Y = S ? B : x, C = d && t && t.usemap, D = C ? R : P, O = { boolean: r, function: A, number: e, object: T ? E : w, string: b(T ? g : v), symbol: A, undefined: A }; return O } var i = t("isarray"), o = t("int64-buffer"), f = o.Uint64BE, u = o.Int64BE, a = t("./bufferish"), s = t("./bufferish-proto"), c = t("./write-token"), h = t("./write-uint8").uint8, l = t("./ext-buffer").ExtBuffer, p = "undefined" != typeof Uint8Array, d = "undefined" != typeof Map, y = []; y[1] = 212, y[2] = 213, y[4] = 214, y[8] = 215, y[16] = 216, e.getWriteType = n }, { "./bufferish": 8, "./bufferish-proto": 6, "./ext-buffer": 17, "./write-token": 26, "./write-uint8": 28, "int64-buffer": 33, isarray: 34 }], 28: [function (t, r, e) { function n(t) { return function (r) { var e = r.reserve(1); r.buffer[e] = t } } for (var i = e.uint8 = new Array(256), o = 0; o <= 255; o++)i[o] = n(o) }, {}], 29: [function (t, r, e) {
            (function (r) {
                "use strict"; function n() { try { var t = new Uint8Array(1); return t.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength } catch (t) { return !1 } } function i() { return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823 } function o(t, r) { if (i() < r) throw new RangeError("Invalid typed array length"); return Buffer.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(r), t.__proto__ = Buffer.prototype) : (null === t && (t = new Buffer(r)), t.length = r), t } function Buffer(t, r, e) { if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer)) return new Buffer(t, r, e); if ("number" == typeof t) { if ("string" == typeof r) throw new Error("If encoding is specified then the first argument must be a string"); return s(this, t) } return f(this, t, r, e) } function f(t, r, e, n) { if ("number" == typeof r) throw new TypeError('"value" argument must not be a number'); return "undefined" != typeof ArrayBuffer && r instanceof ArrayBuffer ? l(t, r, e, n) : "string" == typeof r ? c(t, r, e) : p(t, r) } function u(t) { if ("number" != typeof t) throw new TypeError('"size" argument must be a number'); if (t < 0) throw new RangeError('"size" argument must not be negative') } function a(t, r, e, n) { return u(r), r <= 0 ? o(t, r) : void 0 !== e ? "string" == typeof n ? o(t, r).fill(e, n) : o(t, r).fill(e) : o(t, r) } function s(t, r) { if (u(r), t = o(t, r < 0 ? 0 : 0 | d(r)), !Buffer.TYPED_ARRAY_SUPPORT) for (var e = 0; e < r; ++e)t[e] = 0; return t } function c(t, r, e) { if ("string" == typeof e && "" !== e || (e = "utf8"), !Buffer.isEncoding(e)) throw new TypeError('"encoding" must be a valid string encoding'); var n = 0 | v(r, e); t = o(t, n); var i = t.write(r, e); return i !== n && (t = t.slice(0, i)), t } function h(t, r) { var e = r.length < 0 ? 0 : 0 | d(r.length); t = o(t, e); for (var n = 0; n < e; n += 1)t[n] = 255 & r[n]; return t } function l(t, r, e, n) { if (r.byteLength, e < 0 || r.byteLength < e) throw new RangeError("'offset' is out of bounds"); if (r.byteLength < e + (n || 0)) throw new RangeError("'length' is out of bounds"); return r = void 0 === e && void 0 === n ? new Uint8Array(r) : void 0 === n ? new Uint8Array(r, e) : new Uint8Array(r, e, n), Buffer.TYPED_ARRAY_SUPPORT ? (t = r, t.__proto__ = Buffer.prototype) : t = h(t, r), t } function p(t, r) { if (Buffer.isBuffer(r)) { var e = 0 | d(r.length); return t = o(t, e), 0 === t.length ? t : (r.copy(t, 0, 0, e), t) } if (r) { if ("undefined" != typeof ArrayBuffer && r.buffer instanceof ArrayBuffer || "length" in r) return "number" != typeof r.length || H(r.length) ? o(t, 0) : h(t, r); if ("Buffer" === r.type && Q(r.data)) return h(t, r.data) } throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.") } function d(t) { if (t >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes"); return 0 | t } function y(t) { return +t != t && (t = 0), Buffer.alloc(+t) } function v(t, r) { if (Buffer.isBuffer(t)) return t.length; if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength; "string" != typeof t && (t = "" + t); var e = t.length; if (0 === e) return 0; for (var n = !1; ;)switch (r) { case "ascii": case "latin1": case "binary": return e; case "utf8": case "utf-8": case void 0: return q(t).length; case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return 2 * e; case "hex": return e >>> 1; case "base64": return X(t).length; default: if (n) return q(t).length; r = ("" + r).toLowerCase(), n = !0 } } function g(t, r, e) { var n = !1; if ((void 0 === r || r < 0) && (r = 0), r > this.length) return ""; if ((void 0 === e || e > this.length) && (e = this.length), e <= 0) return ""; if (e >>>= 0, r >>>= 0, e <= r) return ""; for (t || (t = "utf8"); ;)switch (t) { case "hex": return I(this, r, e); case "utf8": case "utf-8": return k(this, r, e); case "ascii": return T(this, r, e); case "latin1": case "binary": return S(this, r, e); case "base64": return R(this, r, e); case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return Y(this, r, e); default: if (n) throw new TypeError("Unknown encoding: " + t); t = (t + "").toLowerCase(), n = !0 } } function b(t, r, e) { var n = t[r]; t[r] = t[e], t[e] = n } function w(t, r, e, n, i) { if (0 === t.length) return -1; if ("string" == typeof e ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, isNaN(e) && (e = i ? 0 : t.length - 1), e < 0 && (e = t.length + e), e >= t.length) { if (i) return -1; e = t.length - 1 } else if (e < 0) { if (!i) return -1; e = 0 } if ("string" == typeof r && (r = Buffer.from(r, n)), Buffer.isBuffer(r)) return 0 === r.length ? -1 : E(t, r, e, n, i); if ("number" == typeof r) return r = 255 & r, Buffer.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, r, e) : Uint8Array.prototype.lastIndexOf.call(t, r, e) : E(t, [r], e, n, i); throw new TypeError("val must be string, number or Buffer") } function E(t, r, e, n, i) { function o(t, r) { return 1 === f ? t[r] : t.readUInt16BE(r * f) } var f = 1, u = t.length, a = r.length; if (void 0 !== n && (n = String(n).toLowerCase(), "ucs2" === n || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) { if (t.length < 2 || r.length < 2) return -1; f = 2, u /= 2, a /= 2, e /= 2 } var s; if (i) { var c = -1; for (s = e; s < u; s++)if (o(t, s) === o(r, c === -1 ? 0 : s - c)) { if (c === -1 && (c = s), s - c + 1 === a) return c * f } else c !== -1 && (s -= s - c), c = -1 } else for (e + a > u && (e = u - a), s = e; s >= 0; s--) { for (var h = !0, l = 0; l < a; l++)if (o(t, s + l) !== o(r, l)) { h = !1; break } if (h) return s } return -1 } function A(t, r, e, n) { e = Number(e) || 0; var i = t.length - e; n ? (n = Number(n), n > i && (n = i)) : n = i; var o = r.length; if (o % 2 !== 0) throw new TypeError("Invalid hex string"); n > o / 2 && (n = o / 2); for (var f = 0; f < n; ++f) { var u = parseInt(r.substr(2 * f, 2), 16); if (isNaN(u)) return f; t[e + f] = u } return f } function m(t, r, e, n) { return G(q(r, t.length - e), t, e, n) } function x(t, r, e, n) { return G(W(r), t, e, n) } function B(t, r, e, n) { return x(t, r, e, n) } function U(t, r, e, n) { return G(X(r), t, e, n) } function P(t, r, e, n) { return G(J(r, t.length - e), t, e, n) } function R(t, r, e) { return 0 === r && e === t.length ? Z.fromByteArray(t) : Z.fromByteArray(t.slice(r, e)) } function k(t, r, e) { e = Math.min(t.length, e); for (var n = [], i = r; i < e;) { var o = t[i], f = null, u = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1; if (i + u <= e) { var a, s, c, h; switch (u) { case 1: o < 128 && (f = o); break; case 2: a = t[i + 1], 128 === (192 & a) && (h = (31 & o) << 6 | 63 & a, h > 127 && (f = h)); break; case 3: a = t[i + 1], s = t[i + 2], 128 === (192 & a) && 128 === (192 & s) && (h = (15 & o) << 12 | (63 & a) << 6 | 63 & s, h > 2047 && (h < 55296 || h > 57343) && (f = h)); break; case 4: a = t[i + 1], s = t[i + 2], c = t[i + 3], 128 === (192 & a) && 128 === (192 & s) && 128 === (192 & c) && (h = (15 & o) << 18 | (63 & a) << 12 | (63 & s) << 6 | 63 & c, h > 65535 && h < 1114112 && (f = h)) } } null === f ? (f = 65533, u = 1) : f > 65535 && (f -= 65536, n.push(f >>> 10 & 1023 | 55296), f = 56320 | 1023 & f), n.push(f), i += u } return _(n) } function _(t) { var r = t.length; if (r <= $) return String.fromCharCode.apply(String, t); for (var e = "", n = 0; n < r;)e += String.fromCharCode.apply(String, t.slice(n, n += $)); return e } function T(t, r, e) { var n = ""; e = Math.min(t.length, e); for (var i = r; i < e; ++i)n += String.fromCharCode(127 & t[i]); return n } function S(t, r, e) { var n = ""; e = Math.min(t.length, e); for (var i = r; i < e; ++i)n += String.fromCharCode(t[i]); return n } function I(t, r, e) { var n = t.length; (!r || r < 0) && (r = 0), (!e || e < 0 || e > n) && (e = n); for (var i = "", o = r; o < e; ++o)i += V(t[o]); return i } function Y(t, r, e) { for (var n = t.slice(r, e), i = "", o = 0; o < n.length; o += 2)i += String.fromCharCode(n[o] + 256 * n[o + 1]); return i } function C(t, r, e) { if (t % 1 !== 0 || t < 0) throw new RangeError("offset is not uint"); if (t + r > e) throw new RangeError("Trying to access beyond buffer length") } function D(t, r, e, n, i, o) { if (!Buffer.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance'); if (r > i || r < o) throw new RangeError('"value" argument is out of bounds'); if (e + n > t.length) throw new RangeError("Index out of range") } function O(t, r, e, n) { r < 0 && (r = 65535 + r + 1); for (var i = 0, o = Math.min(t.length - e, 2); i < o; ++i)t[e + i] = (r & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i) } function L(t, r, e, n) { r < 0 && (r = 4294967295 + r + 1); for (var i = 0, o = Math.min(t.length - e, 4); i < o; ++i)t[e + i] = r >>> 8 * (n ? i : 3 - i) & 255 } function M(t, r, e, n, i, o) { if (e + n > t.length) throw new RangeError("Index out of range"); if (e < 0) throw new RangeError("Index out of range") } function N(t, r, e, n, i) { return i || M(t, r, e, 4, 3.4028234663852886e38, -3.4028234663852886e38), K.write(t, r, e, n, 23, 4), e + 4 } function F(t, r, e, n, i) { return i || M(t, r, e, 8, 1.7976931348623157e308, -1.7976931348623157e308), K.write(t, r, e, n, 52, 8), e + 8 } function j(t) {
                    if (t = z(t).replace(tt, ""), t.length < 2) return ""; for (; t.length % 4 !== 0;)t += "="; return t
                } function z(t) { return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "") } function V(t) { return t < 16 ? "0" + t.toString(16) : t.toString(16) } function q(t, r) { r = r || 1 / 0; for (var e, n = t.length, i = null, o = [], f = 0; f < n; ++f) { if (e = t.charCodeAt(f), e > 55295 && e < 57344) { if (!i) { if (e > 56319) { (r -= 3) > -1 && o.push(239, 191, 189); continue } if (f + 1 === n) { (r -= 3) > -1 && o.push(239, 191, 189); continue } i = e; continue } if (e < 56320) { (r -= 3) > -1 && o.push(239, 191, 189), i = e; continue } e = (i - 55296 << 10 | e - 56320) + 65536 } else i && (r -= 3) > -1 && o.push(239, 191, 189); if (i = null, e < 128) { if ((r -= 1) < 0) break; o.push(e) } else if (e < 2048) { if ((r -= 2) < 0) break; o.push(e >> 6 | 192, 63 & e | 128) } else if (e < 65536) { if ((r -= 3) < 0) break; o.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128) } else { if (!(e < 1114112)) throw new Error("Invalid code point"); if ((r -= 4) < 0) break; o.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128) } } return o } function W(t) { for (var r = [], e = 0; e < t.length; ++e)r.push(255 & t.charCodeAt(e)); return r } function J(t, r) { for (var e, n, i, o = [], f = 0; f < t.length && !((r -= 2) < 0); ++f)e = t.charCodeAt(f), n = e >> 8, i = e % 256, o.push(i), o.push(n); return o } function X(t) { return Z.toByteArray(j(t)) } function G(t, r, e, n) { for (var i = 0; i < n && !(i + e >= r.length || i >= t.length); ++i)r[i + e] = t[i]; return i } function H(t) { return t !== t } var Z = t("base64-js"), K = t("ieee754"), Q = t("isarray"); e.Buffer = Buffer, e.SlowBuffer = y, e.INSPECT_MAX_BYTES = 50, Buffer.TYPED_ARRAY_SUPPORT = void 0 !== r.TYPED_ARRAY_SUPPORT ? r.TYPED_ARRAY_SUPPORT : n(), e.kMaxLength = i(), Buffer.poolSize = 8192, Buffer._augment = function (t) { return t.__proto__ = Buffer.prototype, t }, Buffer.from = function (t, r, e) { return f(null, t, r, e) }, Buffer.TYPED_ARRAY_SUPPORT && (Buffer.prototype.__proto__ = Uint8Array.prototype, Buffer.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, { value: null, configurable: !0 })), Buffer.alloc = function (t, r, e) { return a(null, t, r, e) }, Buffer.allocUnsafe = function (t) { return s(null, t) }, Buffer.allocUnsafeSlow = function (t) { return s(null, t) }, Buffer.isBuffer = function (t) { return !(null == t || !t._isBuffer) }, Buffer.compare = function (t, r) { if (!Buffer.isBuffer(t) || !Buffer.isBuffer(r)) throw new TypeError("Arguments must be Buffers"); if (t === r) return 0; for (var e = t.length, n = r.length, i = 0, o = Math.min(e, n); i < o; ++i)if (t[i] !== r[i]) { e = t[i], n = r[i]; break } return e < n ? -1 : n < e ? 1 : 0 }, Buffer.isEncoding = function (t) { switch (String(t).toLowerCase()) { case "hex": case "utf8": case "utf-8": case "ascii": case "latin1": case "binary": case "base64": case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return !0; default: return !1 } }, Buffer.concat = function (t, r) { if (!Q(t)) throw new TypeError('"list" argument must be an Array of Buffers'); if (0 === t.length) return Buffer.alloc(0); var e; if (void 0 === r) for (r = 0, e = 0; e < t.length; ++e)r += t[e].length; var n = Buffer.allocUnsafe(r), i = 0; for (e = 0; e < t.length; ++e) { var o = t[e]; if (!Buffer.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers'); o.copy(n, i), i += o.length } return n }, Buffer.byteLength = v, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function () { var t = this.length; if (t % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits"); for (var r = 0; r < t; r += 2)b(this, r, r + 1); return this }, Buffer.prototype.swap32 = function () { var t = this.length; if (t % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits"); for (var r = 0; r < t; r += 4)b(this, r, r + 3), b(this, r + 1, r + 2); return this }, Buffer.prototype.swap64 = function () { var t = this.length; if (t % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits"); for (var r = 0; r < t; r += 8)b(this, r, r + 7), b(this, r + 1, r + 6), b(this, r + 2, r + 5), b(this, r + 3, r + 4); return this }, Buffer.prototype.toString = function () { var t = 0 | this.length; return 0 === t ? "" : 0 === arguments.length ? k(this, 0, t) : g.apply(this, arguments) }, Buffer.prototype.equals = function (t) { if (!Buffer.isBuffer(t)) throw new TypeError("Argument must be a Buffer"); return this === t || 0 === Buffer.compare(this, t) }, Buffer.prototype.inspect = function () { var t = "", r = e.INSPECT_MAX_BYTES; return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">" }, Buffer.prototype.compare = function (t, r, e, n, i) { if (!Buffer.isBuffer(t)) throw new TypeError("Argument must be a Buffer"); if (void 0 === r && (r = 0), void 0 === e && (e = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), r < 0 || e > t.length || n < 0 || i > this.length) throw new RangeError("out of range index"); if (n >= i && r >= e) return 0; if (n >= i) return -1; if (r >= e) return 1; if (r >>>= 0, e >>>= 0, n >>>= 0, i >>>= 0, this === t) return 0; for (var o = i - n, f = e - r, u = Math.min(o, f), a = this.slice(n, i), s = t.slice(r, e), c = 0; c < u; ++c)if (a[c] !== s[c]) { o = a[c], f = s[c]; break } return o < f ? -1 : f < o ? 1 : 0 }, Buffer.prototype.includes = function (t, r, e) { return this.indexOf(t, r, e) !== -1 }, Buffer.prototype.indexOf = function (t, r, e) { return w(this, t, r, e, !0) }, Buffer.prototype.lastIndexOf = function (t, r, e) { return w(this, t, r, e, !1) }, Buffer.prototype.write = function (t, r, e, n) { if (void 0 === r) n = "utf8", e = this.length, r = 0; else if (void 0 === e && "string" == typeof r) n = r, e = this.length, r = 0; else { if (!isFinite(r)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported"); r = 0 | r, isFinite(e) ? (e = 0 | e, void 0 === n && (n = "utf8")) : (n = e, e = void 0) } var i = this.length - r; if ((void 0 === e || e > i) && (e = i), t.length > 0 && (e < 0 || r < 0) || r > this.length) throw new RangeError("Attempt to write outside buffer bounds"); n || (n = "utf8"); for (var o = !1; ;)switch (n) { case "hex": return A(this, t, r, e); case "utf8": case "utf-8": return m(this, t, r, e); case "ascii": return x(this, t, r, e); case "latin1": case "binary": return B(this, t, r, e); case "base64": return U(this, t, r, e); case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return P(this, t, r, e); default: if (o) throw new TypeError("Unknown encoding: " + n); n = ("" + n).toLowerCase(), o = !0 } }, Buffer.prototype.toJSON = function () { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) } }; var $ = 4096; Buffer.prototype.slice = function (t, r) { var e = this.length; t = ~~t, r = void 0 === r ? e : ~~r, t < 0 ? (t += e, t < 0 && (t = 0)) : t > e && (t = e), r < 0 ? (r += e, r < 0 && (r = 0)) : r > e && (r = e), r < t && (r = t); var n; if (Buffer.TYPED_ARRAY_SUPPORT) n = this.subarray(t, r), n.__proto__ = Buffer.prototype; else { var i = r - t; n = new Buffer(i, void 0); for (var o = 0; o < i; ++o)n[o] = this[o + t] } return n }, Buffer.prototype.readUIntLE = function (t, r, e) { t = 0 | t, r = 0 | r, e || C(t, r, this.length); for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);)n += this[t + o] * i; return n }, Buffer.prototype.readUIntBE = function (t, r, e) { t = 0 | t, r = 0 | r, e || C(t, r, this.length); for (var n = this[t + --r], i = 1; r > 0 && (i *= 256);)n += this[t + --r] * i; return n }, Buffer.prototype.readUInt8 = function (t, r) { return r || C(t, 1, this.length), this[t] }, Buffer.prototype.readUInt16LE = function (t, r) { return r || C(t, 2, this.length), this[t] | this[t + 1] << 8 }, Buffer.prototype.readUInt16BE = function (t, r) { return r || C(t, 2, this.length), this[t] << 8 | this[t + 1] }, Buffer.prototype.readUInt32LE = function (t, r) { return r || C(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3] }, Buffer.prototype.readUInt32BE = function (t, r) { return r || C(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]) }, Buffer.prototype.readIntLE = function (t, r, e) { t = 0 | t, r = 0 | r, e || C(t, r, this.length); for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);)n += this[t + o] * i; return i *= 128, n >= i && (n -= Math.pow(2, 8 * r)), n }, Buffer.prototype.readIntBE = function (t, r, e) { t = 0 | t, r = 0 | r, e || C(t, r, this.length); for (var n = r, i = 1, o = this[t + --n]; n > 0 && (i *= 256);)o += this[t + --n] * i; return i *= 128, o >= i && (o -= Math.pow(2, 8 * r)), o }, Buffer.prototype.readInt8 = function (t, r) { return r || C(t, 1, this.length), 128 & this[t] ? (255 - this[t] + 1) * -1 : this[t] }, Buffer.prototype.readInt16LE = function (t, r) { r || C(t, 2, this.length); var e = this[t] | this[t + 1] << 8; return 32768 & e ? 4294901760 | e : e }, Buffer.prototype.readInt16BE = function (t, r) { r || C(t, 2, this.length); var e = this[t + 1] | this[t] << 8; return 32768 & e ? 4294901760 | e : e }, Buffer.prototype.readInt32LE = function (t, r) { return r || C(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24 }, Buffer.prototype.readInt32BE = function (t, r) { return r || C(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3] }, Buffer.prototype.readFloatLE = function (t, r) { return r || C(t, 4, this.length), K.read(this, t, !0, 23, 4) }, Buffer.prototype.readFloatBE = function (t, r) { return r || C(t, 4, this.length), K.read(this, t, !1, 23, 4) }, Buffer.prototype.readDoubleLE = function (t, r) { return r || C(t, 8, this.length), K.read(this, t, !0, 52, 8) }, Buffer.prototype.readDoubleBE = function (t, r) { return r || C(t, 8, this.length), K.read(this, t, !1, 52, 8) }, Buffer.prototype.writeUIntLE = function (t, r, e, n) { if (t = +t, r = 0 | r, e = 0 | e, !n) { var i = Math.pow(2, 8 * e) - 1; D(this, t, r, e, i, 0) } var o = 1, f = 0; for (this[r] = 255 & t; ++f < e && (o *= 256);)this[r + f] = t / o & 255; return r + e }, Buffer.prototype.writeUIntBE = function (t, r, e, n) { if (t = +t, r = 0 | r, e = 0 | e, !n) { var i = Math.pow(2, 8 * e) - 1; D(this, t, r, e, i, 0) } var o = e - 1, f = 1; for (this[r + o] = 255 & t; --o >= 0 && (f *= 256);)this[r + o] = t / f & 255; return r + e }, Buffer.prototype.writeUInt8 = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[r] = 255 & t, r + 1 }, Buffer.prototype.writeUInt16LE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : O(this, t, r, !0), r + 2 }, Buffer.prototype.writeUInt16BE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : O(this, t, r, !1), r + 2 }, Buffer.prototype.writeUInt32LE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = 255 & t) : L(this, t, r, !0), r + 4 }, Buffer.prototype.writeUInt32BE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : L(this, t, r, !1), r + 4 }, Buffer.prototype.writeIntLE = function (t, r, e, n) { if (t = +t, r = 0 | r, !n) { var i = Math.pow(2, 8 * e - 1); D(this, t, r, e, i - 1, -i) } var o = 0, f = 1, u = 0; for (this[r] = 255 & t; ++o < e && (f *= 256);)t < 0 && 0 === u && 0 !== this[r + o - 1] && (u = 1), this[r + o] = (t / f >> 0) - u & 255; return r + e }, Buffer.prototype.writeIntBE = function (t, r, e, n) { if (t = +t, r = 0 | r, !n) { var i = Math.pow(2, 8 * e - 1); D(this, t, r, e, i - 1, -i) } var o = e - 1, f = 1, u = 0; for (this[r + o] = 255 & t; --o >= 0 && (f *= 256);)t < 0 && 0 === u && 0 !== this[r + o + 1] && (u = 1), this[r + o] = (t / f >> 0) - u & 255; return r + e }, Buffer.prototype.writeInt8 = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[r] = 255 & t, r + 1 }, Buffer.prototype.writeInt16LE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : O(this, t, r, !0), r + 2 }, Buffer.prototype.writeInt16BE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : O(this, t, r, !1), r + 2 }, Buffer.prototype.writeInt32LE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24) : L(this, t, r, !0), r + 4 }, Buffer.prototype.writeInt32BE = function (t, r, e) { return t = +t, r = 0 | r, e || D(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), Buffer.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : L(this, t, r, !1), r + 4 }, Buffer.prototype.writeFloatLE = function (t, r, e) { return N(this, t, r, !0, e) }, Buffer.prototype.writeFloatBE = function (t, r, e) { return N(this, t, r, !1, e) }, Buffer.prototype.writeDoubleLE = function (t, r, e) { return F(this, t, r, !0, e) }, Buffer.prototype.writeDoubleBE = function (t, r, e) { return F(this, t, r, !1, e) }, Buffer.prototype.copy = function (t, r, e, n) { if (e || (e = 0), n || 0 === n || (n = this.length), r >= t.length && (r = t.length), r || (r = 0), n > 0 && n < e && (n = e), n === e) return 0; if (0 === t.length || 0 === this.length) return 0; if (r < 0) throw new RangeError("targetStart out of bounds"); if (e < 0 || e >= this.length) throw new RangeError("sourceStart out of bounds"); if (n < 0) throw new RangeError("sourceEnd out of bounds"); n > this.length && (n = this.length), t.length - r < n - e && (n = t.length - r + e); var i, o = n - e; if (this === t && e < r && r < n) for (i = o - 1; i >= 0; --i)t[i + r] = this[i + e]; else if (o < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i)t[i + r] = this[i + e]; else Uint8Array.prototype.set.call(t, this.subarray(e, e + o), r); return o }, Buffer.prototype.fill = function (t, r, e, n) { if ("string" == typeof t) { if ("string" == typeof r ? (n = r, r = 0, e = this.length) : "string" == typeof e && (n = e, e = this.length), 1 === t.length) { var i = t.charCodeAt(0); i < 256 && (t = i) } if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string"); if ("string" == typeof n && !Buffer.isEncoding(n)) throw new TypeError("Unknown encoding: " + n) } else "number" == typeof t && (t = 255 & t); if (r < 0 || this.length < r || this.length < e) throw new RangeError("Out of range index"); if (e <= r) return this; r >>>= 0, e = void 0 === e ? this.length : e >>> 0, t || (t = 0); var o; if ("number" == typeof t) for (o = r; o < e; ++o)this[o] = t; else { var f = Buffer.isBuffer(t) ? t : q(new Buffer(t, n).toString()), u = f.length; for (o = 0; o < e - r; ++o)this[o + r] = f[o % u] } return this }; var tt = /[^+\/0-9A-Za-z-_]/g
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, { "base64-js": 30, ieee754: 32, isarray: 34 }], 30: [function (t, r, e) { "use strict"; function n(t) { var r = t.length; if (r % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4"); return "=" === t[r - 2] ? 2 : "=" === t[r - 1] ? 1 : 0 } function i(t) { return 3 * t.length / 4 - n(t) } function o(t) { var r, e, i, o, f, u, a = t.length; f = n(t), u = new h(3 * a / 4 - f), i = f > 0 ? a - 4 : a; var s = 0; for (r = 0, e = 0; r < i; r += 4, e += 3)o = c[t.charCodeAt(r)] << 18 | c[t.charCodeAt(r + 1)] << 12 | c[t.charCodeAt(r + 2)] << 6 | c[t.charCodeAt(r + 3)], u[s++] = o >> 16 & 255, u[s++] = o >> 8 & 255, u[s++] = 255 & o; return 2 === f ? (o = c[t.charCodeAt(r)] << 2 | c[t.charCodeAt(r + 1)] >> 4, u[s++] = 255 & o) : 1 === f && (o = c[t.charCodeAt(r)] << 10 | c[t.charCodeAt(r + 1)] << 4 | c[t.charCodeAt(r + 2)] >> 2, u[s++] = o >> 8 & 255, u[s++] = 255 & o), u } function f(t) { return s[t >> 18 & 63] + s[t >> 12 & 63] + s[t >> 6 & 63] + s[63 & t] } function u(t, r, e) { for (var n, i = [], o = r; o < e; o += 3)n = (t[o] << 16) + (t[o + 1] << 8) + t[o + 2], i.push(f(n)); return i.join("") } function a(t) { for (var r, e = t.length, n = e % 3, i = "", o = [], f = 16383, a = 0, c = e - n; a < c; a += f)o.push(u(t, a, a + f > c ? c : a + f)); return 1 === n ? (r = t[e - 1], i += s[r >> 2], i += s[r << 4 & 63], i += "==") : 2 === n && (r = (t[e - 2] << 8) + t[e - 1], i += s[r >> 10], i += s[r >> 4 & 63], i += s[r << 2 & 63], i += "="), o.push(i), o.join("") } e.byteLength = i, e.toByteArray = o, e.fromByteArray = a; for (var s = [], c = [], h = "undefined" != typeof Uint8Array ? Uint8Array : Array, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", p = 0, d = l.length; p < d; ++p)s[p] = l[p], c[l.charCodeAt(p)] = p; c["-".charCodeAt(0)] = 62, c["_".charCodeAt(0)] = 63 }, {}], 31: [function (t, r, e) { function n() { if (!(this instanceof n)) return new n } !function (t) { function e(t) { for (var r in s) t[r] = s[r]; return t } function n(t, r) { return u(this, t).push(r), this } function i(t, r) { function e() { o.call(n, t, e), r.apply(this, arguments) } var n = this; return e.originalListener = r, u(n, t).push(e), n } function o(t, r) { function e(t) { return t !== r && t.originalListener !== r } var n, i = this; if (arguments.length) { if (r) { if (n = u(i, t, !0)) { if (n = n.filter(e), !n.length) return o.call(i, t); i[a][t] = n } } else if (n = i[a], n && (delete n[t], !Object.keys(n).length)) return o.call(i) } else delete i[a]; return i } function f(t, r) { function e(t) { t.call(o) } function n(t) { t.call(o, r) } function i(t) { t.apply(o, s) } var o = this, f = u(o, t, !0); if (!f) return !1; var a = arguments.length; if (1 === a) f.forEach(e); else if (2 === a) f.forEach(n); else { var s = Array.prototype.slice.call(arguments, 1); f.forEach(i) } return !!f.length } function u(t, r, e) { if (!e || t[a]) { var n = t[a] || (t[a] = {}); return n[r] || (n[r] = []) } } "undefined" != typeof r && (r.exports = t); var a = "listeners", s = { on: n, once: i, off: o, emit: f }; e(t.prototype), t.mixin = e }(n) }, {}], 32: [function (t, r, e) { e.read = function (t, r, e, n, i) { var o, f, u = 8 * i - n - 1, a = (1 << u) - 1, s = a >> 1, c = -7, h = e ? i - 1 : 0, l = e ? -1 : 1, p = t[r + h]; for (h += l, o = p & (1 << -c) - 1, p >>= -c, c += u; c > 0; o = 256 * o + t[r + h], h += l, c -= 8); for (f = o & (1 << -c) - 1, o >>= -c, c += n; c > 0; f = 256 * f + t[r + h], h += l, c -= 8); if (0 === o) o = 1 - s; else { if (o === a) return f ? NaN : (p ? -1 : 1) * (1 / 0); f += Math.pow(2, n), o -= s } return (p ? -1 : 1) * f * Math.pow(2, o - n) }, e.write = function (t, r, e, n, i, o) { var f, u, a, s = 8 * o - i - 1, c = (1 << s) - 1, h = c >> 1, l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1, d = n ? 1 : -1, y = r < 0 || 0 === r && 1 / r < 0 ? 1 : 0; for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (u = isNaN(r) ? 1 : 0, f = c) : (f = Math.floor(Math.log(r) / Math.LN2), r * (a = Math.pow(2, -f)) < 1 && (f--, a *= 2), r += f + h >= 1 ? l / a : l * Math.pow(2, 1 - h), r * a >= 2 && (f++, a /= 2), f + h >= c ? (u = 0, f = c) : f + h >= 1 ? (u = (r * a - 1) * Math.pow(2, i), f += h) : (u = r * Math.pow(2, h - 1) * Math.pow(2, i), f = 0)); i >= 8; t[e + p] = 255 & u, p += d, u /= 256, i -= 8); for (f = f << i | u, s += i; s > 0; t[e + p] = 255 & f, p += d, f /= 256, s -= 8); t[e + p - d] |= 128 * y } }, {}], 33: [function (t, r, e) { (function (Buffer) { var t, r, n, i; !function (e) { function o(t, r, n) { function i(t, r, e, n) { return this instanceof i ? v(this, t, r, e, n) : new i(t, r, e, n) } function o(t) { return !(!t || !t[F]) } function v(t, r, e, n, i) { if (E && A && (r instanceof A && (r = new E(r)), n instanceof A && (n = new E(n))), !(r || e || n || g)) return void (t.buffer = h(m, 0)); if (!s(r, e)) { var o = g || Array; i = e, n = r, e = 0, r = new o(8) } t.buffer = r, t.offset = e |= 0, b !== typeof n && ("string" == typeof n ? x(r, e, n, i || 10) : s(n, i) ? c(r, e, n, i) : "number" == typeof i ? (k(r, e + T, n), k(r, e + S, i)) : n > 0 ? O(r, e, n) : n < 0 ? L(r, e, n) : c(r, e, m, 0)) } function x(t, r, e, n) { var i = 0, o = e.length, f = 0, u = 0; "-" === e[0] && i++; for (var a = i; i < o;) { var s = parseInt(e[i++], n); if (!(s >= 0)) break; u = u * n + s, f = f * n + Math.floor(u / B), u %= B } a && (f = ~f, u ? u = B - u : f++), k(t, r + T, f), k(t, r + S, u) } function P() { var t = this.buffer, r = this.offset, e = _(t, r + T), i = _(t, r + S); return n || (e |= 0), e ? e * B + i : i } function R(t) { var r = this.buffer, e = this.offset, i = _(r, e + T), o = _(r, e + S), f = "", u = !n && 2147483648 & i; for (u && (i = ~i, o = B - o), t = t || 10; ;) { var a = i % t * B + o; if (i = Math.floor(i / t), o = Math.floor(a / t), f = (a % t).toString(t) + f, !i && !o) break } return u && (f = "-" + f), f } function k(t, r, e) { t[r + D] = 255 & e, e >>= 8, t[r + C] = 255 & e, e >>= 8, t[r + Y] = 255 & e, e >>= 8, t[r + I] = 255 & e } function _(t, r) { return t[r + I] * U + (t[r + Y] << 16) + (t[r + C] << 8) + t[r + D] } var T = r ? 0 : 4, S = r ? 4 : 0, I = r ? 0 : 3, Y = r ? 1 : 2, C = r ? 2 : 1, D = r ? 3 : 0, O = r ? l : d, L = r ? p : y, M = i.prototype, N = "is" + t, F = "_" + N; return M.buffer = void 0, M.offset = 0, M[F] = !0, M.toNumber = P, M.toString = R, M.toJSON = P, M.toArray = f, w && (M.toBuffer = u), E && (M.toArrayBuffer = a), i[N] = o, e[t] = i, i } function f(t) { var r = this.buffer, e = this.offset; return g = null, t !== !1 && 0 === e && 8 === r.length && x(r) ? r : h(r, e) } function u(t) { var r = this.buffer, e = this.offset; if (g = w, t !== !1 && 0 === e && 8 === r.length && Buffer.isBuffer(r)) return r; var n = new w(8); return c(n, 0, r, e), n } function a(t) { var r = this.buffer, e = this.offset, n = r.buffer; if (g = E, t !== !1 && 0 === e && n instanceof A && 8 === n.byteLength) return n; var i = new E(8); return c(i, 0, r, e), i.buffer } function s(t, r) { var e = t && t.length; return r |= 0, e && r + 8 <= e && "string" != typeof t[r] } function c(t, r, e, n) { r |= 0, n |= 0; for (var i = 0; i < 8; i++)t[r++] = 255 & e[n++] } function h(t, r) { return Array.prototype.slice.call(t, r, r + 8) } function l(t, r, e) { for (var n = r + 8; n > r;)t[--n] = 255 & e, e /= 256 } function p(t, r, e) { var n = r + 8; for (e++; n > r;)t[--n] = 255 & -e ^ 255, e /= 256 } function d(t, r, e) { for (var n = r + 8; r < n;)t[r++] = 255 & e, e /= 256 } function y(t, r, e) { var n = r + 8; for (e++; r < n;)t[r++] = 255 & -e ^ 255, e /= 256 } function v(t) { return !!t && "[object Array]" == Object.prototype.toString.call(t) } var g, b = "undefined", w = b !== typeof Buffer && Buffer, E = b !== typeof Uint8Array && Uint8Array, A = b !== typeof ArrayBuffer && ArrayBuffer, m = [0, 0, 0, 0, 0, 0, 0, 0], x = Array.isArray || v, B = 4294967296, U = 16777216; t = o("Uint64BE", !0, !0), r = o("Int64BE", !0, !1), n = o("Uint64LE", !1, !0), i = o("Int64LE", !1, !1) }("object" == typeof e && "string" != typeof e.nodeName ? e : this || {}) }).call(this, t("buffer").Buffer) }, { buffer: 29 }], 34: [function (t, r, e) { var n = {}.toString; r.exports = Array.isArray || function (t) { return "[object Array]" == n.call(t) } }, {}]
    }, {}, [1])(1)
});

// FOR LESS ERRORS:
let $ = window.$;
const {
    sin,
    cos,
    min,
    max,
    random,
    floor,
    trunc,
    ceil,
    round,
    tan,
    PI,
    sqrt,
    abs,
    pow,
    log,
    LN2,
    atan2,
    SQRT2,
    acos,
    sign,
    hypot
} = Math;
let autoQuadSpike = false;
let betraying = false;
let friendList = [];

// FOR MAP OP:
$("#mapDisplay").css({
    background: `url('https://i.imgur.com/fgFsQJp.png')`
});

// FOR FRAME:
let framer = false;
let nearPlayers = [];
function getEl(id) {
    return document.getElementById(id);
}
let config = window.config;

// CLIENT:
config.clientSendRate = 0;
config.serverUpdateRate = 9;

// UI:
config.deathFadeout = 0;
config.playerCapacity = 9999;
config.gatherAngle = Math.PI / 2.6;
// CHECK IN SERVERS:
config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
config.isNormal = window.location.hostname == "moomoo.io";
config.isMohMoh = window.location.hostname == "mohmoh-js.onrender.com";
config.hathuWorld = window.location.hostname == "zuuworldio.vercel.app";

// CUSTOMIZATION:
config.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
config.weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}, {
    id: 4,
    src: "_e",
    poison: true,
    heal: true,
    xp: 24000,
    val: 1.18
}];

// VISUAL:
config.anotherVisual = false;
config.useWebGl = false;
config.resetRender = true;

// MENU:
let isPageLoaded = document.readyState === "complete";
window.addEventListener("load", function () {
    isPageLoaded = true;
});
const defaultConfigs = {
    // HEAL:
    doPingHeal: true,
    shouldHeal: true,
    // PLAYER ANTI TRAP:
    antiTrap: true,
    // PLAYER AUTOPUSH:
    autoPush: true,
    // BOTS:
    botcount: 40,
    botname: "oleg",
    ranBotName: true,
    botMovementMode: "Normal",
    botHatsMode: "Normal",
    botWeaponType: "Hammer",
    botPlacement: false,
    distToTT: 150,
    botChatSpam: false,
    botSpamDelay: 0,
    // MISC:
    autoRespawn: true,
    autoGrind: false,
    // FUNNY CHAT:
    happyModLier: false,
    kllChatMessage: "ggeznoob",
    killChat: true,
    // HAT STUFF:
    alwaysFlipper: false,
    autoTurret: true,
    // DIR:
    lockPlayerDirection: true,
    // PACKET:
    placementPakcetLimited: true,
    packLim: 120,
    // VISUALS:
    moysePlayerDirection: true,
    // PLAYER VISUALS:
    transParentPlayer: 1,
    playersWeaponRange: false,
    playerInsideCircle: true,
    // OBJECT VISUALS:
    transparentobject: 1,
    dMarks: true,
    markOutline: false,
    marksTypes: "All",
    markSize: 0.7,
    // VOLCANO STUFF:
    dVolcanZone: true,
    dVolcDamageZone: true,
    dVolcFarmZone: true,
    // RELOAD BARS:
    reloadBars: true,
    turretReloadBar: true,
    secondaryReloadBar: true,
    primaryReloadBar: true,
    // INFO OF PLAYERS
    playerInfo: true,
    // UI NAME/HEALTH/SID/SHAME:
    dName: true,
    dShame: false,
    dSid: false,
    dHealth: true,
    // CLOWN FADE:
    gChatGear: true,
    // ZOOM:
    wheelZoom: true,
    zoomLevel: 1,
    // COMBAT:
    autoPlace: true,
    autoReplace: true,
    autoPrePlace: true,
    // NORMAL CHASE PLACER:
    chasePlacer: false,
    opvisualsPlayer: true,
    revTick: true,
    spikeTick: true,
    predictTick: true,
    // TRAP LOGIC SAFETY:
    autoPushSpam: true,
    antiPush: true,
    // INSTA/HIT STUFF:
    autoInsta: false,
    ShameInsta: false,
    AutoBullSpam: false,
    x18ksync: true,
    doChatMirror: false,
    // MENU/THEME:
    darkMode: true,
    accentColor: "#696ACB",
    useGradient: false,
    gradientColors: ["#696ACB", "#9B59B6"],
    gradientAngle: 135,
    gradientAnimated: false,
    gradientSpeed: 3,
    customBgPrimary: "#40454E",
    customBgSecondary: "#373C45",
    customBgTertiary: "#2D3037",
    customTextPrimary: "#ffffff",
    customTextSecondary: "#858A92"
};
let configs = {};
try {
    const saved = localStorage.getItem("modMenuConfigs");
    configs = saved ? {
        ...defaultConfigs,
        ...JSON.parse(saved)
    } : {
        ...defaultConfigs
    };
} catch (e) {
    configs = {
        ...defaultConfigs
    };
}
function saveConfigs() {
    localStorage.setItem("modMenuConfigs", JSON.stringify(configs));
}
const SVGIcons = {
    combat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/></svg>`,
    visual: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    bots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>`,
    misc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    theme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
    chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    drag: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`
};
class ThemeManager {
    static get isDark() {
        return configs.darkMode;
    }
    static applyTheme() {
        const root = document.documentElement;
        if (configs.darkMode) {
            root.style.setProperty("--menu-bg-primary", configs.customBgPrimary || "#40454E");
            root.style.setProperty("--menu-bg-secondary", configs.customBgSecondary || "#373C45");
            root.style.setProperty("--menu-bg-tertiary", configs.customBgTertiary || "#2D3037");
            root.style.setProperty("--menu-bg-input", "#30303A");
            root.style.setProperty("--menu-text-primary", configs.customTextPrimary || "#ffffff");
            root.style.setProperty("--menu-text-secondary", configs.customTextSecondary || "#858A92");
        } else {
            root.style.setProperty("--menu-bg-primary", "#ffffff");
            root.style.setProperty("--menu-bg-secondary", "#f0f0f0");
            root.style.setProperty("--menu-bg-tertiary", "#e0e0e0");
            root.style.setProperty("--menu-bg-input", "#f5f5f5");
            root.style.setProperty("--menu-text-primary", "#1a1a1a");
            root.style.setProperty("--menu-text-secondary", "#666666");
        }
        if (configs.useGradient && configs.gradientColors.length >= 2) {
            root.style.setProperty("--menu-accent-rgb", this.hexToRgb(configs.gradientColors[0]));
            const gradient = `linear-gradient(${configs.gradientAngle}deg, ${configs.gradientColors.join(", ")})`;
            root.style.setProperty("--menu-accent", gradient);
            root.style.setProperty("--menu-accent-solid", configs.gradientColors[0]);
            root.classList.add("menu-gradient-mode");
        } else {
            root.style.setProperty("--menu-accent-rgb", this.hexToRgb(configs.accentColor));
            root.style.setProperty("--menu-accent", configs.accentColor);
            root.style.setProperty("--menu-accent-solid", configs.accentColor);
            root.classList.remove("menu-gradient-mode");
        }
        root.style.setProperty("--menu-gradient-speed", `${configs.gradientSpeed}s`);
        if (configs.gradientAnimated && configs.useGradient) {
            root.classList.add("menu-animated-gradient");
        } else {
            root.classList.remove("menu-animated-gradient");
        }
    }
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
        } else {
            return "105, 106, 203";
        }
    }
    static resetToDefault() {
        configs.darkMode = true;
        configs.accentColor = "#696ACB";
        configs.useGradient = false;
        configs.gradientColors = ["#696ACB", "#9B59B6"];
        configs.gradientAngle = 135;
        configs.gradientAnimated = false;
        configs.gradientSpeed = 3;
        configs.customBgPrimary = "#40454E";
        configs.customBgSecondary = "#373C45";
        configs.customBgTertiary = "#2D3037";
        configs.customTextPrimary = "#ffffff";
        configs.customTextSecondary = "#858A92";
        saveConfigs();
        this.applyTheme();
    }
}
class HTML {
    static idCounter = 0;
    static registeredElements = [];
    static openDropdownId = null;
    static documentClickHandler = null;
    static generateId(prefix) {
        return `menu_${prefix}_${++this.idCounter}`;
    }
    static section(title, content, defaultOpen = true) {
        const id = this.generateId("section");
        const contentId = this.generateId("section_content");
        this.registeredElements.push({
            id,
            contentId,
            type: "section",
            init: () => {
                const titleEl = document.getElementById(id);
                const contentEl = document.getElementById(contentId);
                if (!titleEl || !contentEl) {
                    return;
                }
                if (!defaultOpen) {
                    contentEl.style.maxHeight = "0";
                    contentEl.style.opacity = "0";
                    contentEl.classList.add("collapsed");
                    titleEl.classList.add("collapsed");
                }
                titleEl.addEventListener("click", () => {
                    const isCollapsed = contentEl.classList.contains("collapsed");
                    if (isCollapsed) {
                        contentEl.style.maxHeight = contentEl.scrollHeight + "px";
                        contentEl.style.opacity = "1";
                        contentEl.classList.remove("collapsed");
                        titleEl.classList.remove("collapsed");
                        setTimeout(() => {
                            if (!contentEl.classList.contains("collapsed")) {
                                contentEl.style.maxHeight = "none";
                            }
                        }, 300);
                    } else {
                        contentEl.style.maxHeight = contentEl.scrollHeight + "px";
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                contentEl.style.maxHeight = "0";
                                contentEl.style.opacity = "0";
                                contentEl.classList.add("collapsed");
                                titleEl.classList.add("collapsed");
                            });
                        });
                    }
                });
            }
        });
        return `
            <div class="menu_section">
                <div class="menu_section_title" id="${id}">
                    <span>${title}</span>
                    <span class="menu_section_chevron">${SVGIcons.chevronUp}</span>
                </div>
                <div class="menu_section_content" id="${contentId}">
                    ${content}
                </div>
            </div>
        `;
    }
    static checkBox(name, desc, configKey, onChange = null) {
        const id = this.generateId("checkbox");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "checkbox",
            init: () => {
                const el = document.getElementById(id);
                if (!el) {
                    return;
                }
                el.checked = configs[configKey];
                el.addEventListener("change", () => {
                    configs[configKey] = el.checked;
                    saveConfigs();
                    if (onChange) {
                        onChange(el.checked);
                    }
                });
            }
        });
        return `
            <div class="menu_setting_row">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <label class="menu_toggle">
                    <input type="checkbox" id="${id}" ${configs[configKey] ? "checked" : ""}>
                    <span class="menu_toggle_slider"></span>
                </label>
            </div>
        `;
    }
    static textInput(name, desc, configKey, maxlength = 15, onChange = null) {
        const id = this.generateId("text");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "text",
            init: () => {
                const el = document.getElementById(id);
                if (!el) {
                    return;
                }
                el.value = configs[configKey] || "";
                el.addEventListener("input", () => {
                    configs[configKey] = el.value;
                    saveConfigs();
                    if (onChange) {
                        onChange(el.value);
                    }
                });
            }
        });
        return `
            <div class="menu_setting_row">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <input type="text" class="menu_text_input" id="${id}" value="${configs[configKey] || ""}" maxlength="${maxlength}" placeholder="...">
            </div>
        `;
    }
    static slider(name, desc, configKey, min = 0, max = 100, step = 1, unit = "", onChange = null) {
        const id = this.generateId("slider");
        const valueId = this.generateId("slider_value");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "slider",
            init: () => {
                const el = document.getElementById(id);
                const valueEl = document.getElementById(valueId);
                if (!el || !valueEl) {
                    return;
                }
                el.value = configs[configKey] ?? min;
                valueEl.textContent = (configs[configKey] ?? min) + unit;
                const updateTrack = () => {
                    const percent = (el.value - min) / (max - min) * 100;
                    el.style.setProperty("--slider-percent", `${percent}%`);
                };
                updateTrack();
                el.addEventListener("input", () => {
                    configs[configKey] = parseFloat(el.value);
                    valueEl.textContent = el.value + unit;
                    updateTrack();
                    saveConfigs();
                    if (onChange) {
                        onChange(parseFloat(el.value));
                    }
                });
            }
        });
        return `
            <div class="menu_setting_row menu_setting_row_vertical">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <div class="menu_slider_wrap">
                    <input type="range" class="menu_slider" id="${id}" min="${min}" max="${max}" step="${step}" value="${configs[configKey] ?? min}">
                    <span class="menu_slider_value" id="${valueId}">${configs[configKey] ?? min}${unit}</span>
                </div>
            </div>
        `;
    }
    static dropdown(name, desc, configKey, options, onChange = null) {
        const id = this.generateId("dropdown");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "dropdown",
            options,
            onChange,
            init: () => {
                const wrapper = document.getElementById(id);
                if (!wrapper) {
                    return;
                }
                const selected = wrapper.querySelector(".menu_dropdown_selected");
                selected.textContent = configs[configKey] || options[0];
                wrapper.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.openDropdownId === id) {
                        this.closeDropdown();
                    } else {
                        this.openDropdown(id, options, configKey, onChange);
                    }
                });
            }
        });
        return `
            <div class="menu_setting_row">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <div class="menu_dropdown" id="${id}">
                    <span class="menu_dropdown_selected">${configs[configKey] || options[0]}</span>
                    <span class="menu_dropdown_arrow">${SVGIcons.chevronDown}</span>
                </div>
            </div>
        `;
    }
    static openDropdown(wrapperId, options, configKey, onChange) {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) {
            return;
        }
        const rect = wrapper.getBoundingClientRect();
        const portal = document.getElementById("menu_dropdown_portal");
        let optionsHtml = options.map(opt => `
            <div class="menu_dropdown_option ${configs[configKey] === opt ? "selected" : ""}" data-value="${opt}">${opt}</div>
        `).join("");
        portal.innerHTML = `<div class="menu_dropdown_list">${optionsHtml}</div>`;
        portal.style.display = "block";
        portal.style.top = rect.bottom + 5 + "px";
        portal.style.left = rect.left + "px";
        portal.style.width = rect.width + "px";
        const list = portal.querySelector(".menu_dropdown_list");
        list.offsetHeight;
        requestAnimationFrame(() => {
            list.classList.add("open");
        });
        wrapper.classList.add("open");
        this.openDropdownId = wrapperId;
        portal.querySelectorAll(".menu_dropdown_option").forEach(opt => {
            opt.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                const value = opt.dataset.value;
                configs[configKey] = value;
                wrapper.querySelector(".menu_dropdown_selected").textContent = value;
                saveConfigs();
                if (onChange) {
                    onChange(value);
                }
                this.closeDropdown();
            });
        });
        setTimeout(() => {
            this.documentClickHandler = e => {
                if (!e.target.closest(".menu_dropdown") && !e.target.closest("#menu_dropdown_portal")) {
                    this.closeDropdown();
                }
            };
            document.addEventListener("click", this.documentClickHandler, true);
        }, 10);
    }
    static closeDropdown() {
        if (this.documentClickHandler) {
            document.removeEventListener("click", this.documentClickHandler, true);
            this.documentClickHandler = null;
        }
        const portal = document.getElementById("menu_dropdown_portal");
        if (!portal) {
            return;
        }
        const list = portal.querySelector(".menu_dropdown_list");
        if (list) {
            list.classList.remove("open");
        }
        if (this.openDropdownId) {
            const wrapper = document.getElementById(this.openDropdownId);
            if (wrapper) {
                wrapper.classList.remove("open");
            }
        }
        setTimeout(() => {
            if (portal) {
                portal.style.display = "none";
                portal.innerHTML = "";
            }
        }, 150);
        this.openDropdownId = null;
    }
    static buttonMenu(buttons) {
        const id = this.generateId("btnmenu");
        this.registeredElements.push({
            id,
            type: "buttonmenu",
            buttons,
            init: () => {
                buttons.forEach((btn, i) => {
                    const el = document.getElementById(`${id}_btn_${i}`);
                    if (el && btn.onClick) {
                        el.addEventListener("click", btn.onClick);
                    }
                });
            }
        });
        const btnsHtml = buttons.map((btn, i) => `
            <button class="menu_grid_btn" id="${id}_btn_${i}">${btn.text}</button>
        `).join("");
        return `
            <div class="menu_btn_grid" id="${id}" style="--btn-count: ${buttons.length}">
                ${btnsHtml}
            </div>
        `;
    }
    static selector(name, desc, configKey, options, onChange = null) {
        const id = this.generateId("selector");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "selector",
            init: () => {
                const container = document.getElementById(id);
                if (!container) {
                    return;
                }
                const buttons = container.querySelectorAll(".menu_selector_btn");
                buttons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        buttons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        configs[configKey] = btn.dataset.value;
                        saveConfigs();
                        if (onChange) {
                            onChange(btn.dataset.value);
                        }
                    });
                });
            }
        });
        const btnsHtml = options.map(opt => `
            <button class="menu_selector_btn ${configs[configKey] === opt ? "active" : ""}" data-value="${opt}">${opt}</button>
        `).join("");
        return `
            <div class="menu_setting_row menu_setting_row_vertical">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <div class="menu_selector" id="${id}">
                    ${btnsHtml}
                </div>
            </div>
        `;
    }
    static colorPicker(name, desc, configKey, onChange = null) {
        const id = this.generateId("color");
        const descHtml = desc ? `<div class="menu_setting_desc">${desc}</div>` : "";
        this.registeredElements.push({
            id,
            configKey,
            type: "color",
            init: () => {
                const el = document.getElementById(id);
                const preview = document.getElementById(id + "_preview");
                if (!el) {
                    return;
                }
                el.value = configs[configKey] || "#696ACB";
                if (preview) {
                    preview.style.background = el.value;
                }
                el.addEventListener("input", () => {
                    configs[configKey] = el.value;
                    if (preview) {
                        preview.style.background = el.value;
                    }
                    saveConfigs();
                    if (onChange) {
                        onChange(el.value);
                    }
                    ThemeManager.applyTheme();
                });
            }
        });
        return `
            <div class="menu_setting_row">
                <div class="menu_setting_info">
                    <div class="menu_setting_name">${name}</div>
                    ${descHtml}
                </div>
                <div class="menu_color_wrap">
                    <div class="menu_color_preview" id="${id}_preview" style="background: ${configs[configKey] || "#696ACB"}"></div>
                    <input type="color" class="menu_color_input" id="${id}" value="${configs[configKey] || "#696ACB"}">
                </div>
            </div>
        `;
    }
    static themeMode() {
        const id = this.generateId("thememode");
        this.registeredElements.push({
            id,
            type: "thememode",
            init: () => {
                const container = document.getElementById(id);
                if (!container) {
                    return;
                }
                const buttons = container.querySelectorAll(".menu_theme_btn");
                buttons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        buttons.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        configs.darkMode = btn.dataset.theme === "dark";
                        saveConfigs();
                        ThemeManager.applyTheme();
                    });
                });
            }
        });
        return `
            <div class="menu_theme_selector" id="${id}">
                <button class="menu_theme_btn ${configs.darkMode ? "active" : ""}" data-theme="dark">
                    <div class="menu_theme_preview dark"></div>
                    <span>Dark</span>
                </button>
                <button class="menu_theme_btn ${!configs.darkMode ? "active" : ""}" data-theme="light">
                    <div class="menu_theme_preview light"></div>
                    <span>Light</span>
                </button>
            </div>
        `;
    }
    static gradientEditor() {
        const id = this.generateId("gradient");
        this.registeredElements.push({
            id,
            type: "gradient",
            init: () => {
                const container = document.getElementById(id);
                if (!container) {
                    return;
                }
                const preview = container.querySelector(".menu_gradient_preview");
                const colorsWrap = container.querySelector(".menu_gradient_colors");
                const addBtn = container.querySelector(".menu_gradient_add");
                const angleSlider = container.querySelector(".menu_gradient_angle");
                const angleValue = container.querySelector(".menu_gradient_angle_val");
                const speedSlider = container.querySelector(".menu_gradient_speed");
                const speedValue = container.querySelector(".menu_gradient_speed_val");
                const animToggle = container.querySelector(".menu_gradient_anim");
                const directionPad = container.querySelector(".menu_gradient_direction");
                const directionDot = container.querySelector(".menu_gradient_dot");
                let colors = [...(configs.gradientColors || ["#696ACB", "#9B59B6"])];
                let dragIdx = null;
                const updatePreview = () => {
                    const gradient = `linear-gradient(${configs.gradientAngle}deg, ${colors.join(", ")})`;
                    preview.style.background = gradient;
                    configs.gradientColors = [...colors];
                    saveConfigs();
                    ThemeManager.applyTheme();
                };
                const updateDotPosition = () => {
                    const angle = (configs.gradientAngle - 90) * (Math.PI / 180);
                    const radius = 32;
                    const x = 40 + Math.cos(angle) * radius;
                    const y = 40 + Math.sin(angle) * radius;
                    directionDot.style.left = x + "px";
                    directionDot.style.top = y + "px";
                };
                const renderColors = () => {
                    colorsWrap.innerHTML = "";
                    colors.forEach((color, i) => {
                        const item = document.createElement("div");
                        item.className = "menu_gradient_color_item";
                        item.draggable = true;
                        item.dataset.index = i;
                        item.innerHTML = `
                            <div class="menu_gradient_drag">${SVGIcons.drag}</div>
                            <input type="color" class="menu_gradient_color_input" value="${color}">
                            ${colors.length > 2 ? `<button class="menu_gradient_remove">${SVGIcons.minus}</button>` : ""}
                        `;
                        const input = item.querySelector("input");
                        input.addEventListener("input", () => {
                            colors[i] = input.value;
                            updatePreview();
                        });
                        const removeBtn = item.querySelector(".menu_gradient_remove");
                        if (removeBtn) {
                            removeBtn.addEventListener("click", () => {
                                colors.splice(i, 1);
                                renderColors();
                                updatePreview();
                            });
                        }
                        item.addEventListener("dragstart", () => {
                            dragIdx = i;
                            item.classList.add("dragging");
                        });
                        item.addEventListener("dragend", () => {
                            item.classList.remove("dragging");
                            dragIdx = null;
                        });
                        item.addEventListener("dragover", e => {
                            e.preventDefault();
                            if (dragIdx !== null && dragIdx !== i) {
                                const dragged = colors[dragIdx];
                                colors.splice(dragIdx, 1);
                                colors.splice(i, 0, dragged);
                                dragIdx = i;
                                renderColors();
                                updatePreview();
                            }
                        });
                        colorsWrap.appendChild(item);
                    });
                    addBtn.classList.toggle("disabled", colors.length >= 4);
                };
                addBtn.addEventListener("click", () => {
                    if (colors.length < 4) {
                        colors.push("#888888");
                        renderColors();
                        updatePreview();
                    }
                });
                angleSlider.value = configs.gradientAngle || 135;
                angleValue.textContent = `${configs.gradientAngle || 135}°`;
                angleSlider.addEventListener("input", () => {
                    configs.gradientAngle = parseInt(angleSlider.value);
                    angleValue.textContent = `${angleSlider.value}°`;
                    updateDotPosition();
                    updatePreview();
                });
                speedSlider.value = configs.gradientSpeed || 3;
                speedValue.textContent = `${configs.gradientSpeed || 3}s`;
                speedSlider.addEventListener("input", () => {
                    configs.gradientSpeed = parseInt(speedSlider.value);
                    speedValue.textContent = `${speedSlider.value}s`;
                    saveConfigs();
                    ThemeManager.applyTheme();
                });
                animToggle.checked = configs.gradientAnimated;
                animToggle.addEventListener("change", () => {
                    configs.gradientAnimated = animToggle.checked;
                    saveConfigs();
                    ThemeManager.applyTheme();
                });
                let isDragging = false;
                const handleDrag = e => {
                    if (!isDragging) {
                        return;
                    }
                    const rect = directionPad.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
                    let degrees = Math.round(angle * 180 / Math.PI + 90);
                    if (degrees < 0) {
                        degrees += 360;
                    }
                    configs.gradientAngle = degrees;
                    angleSlider.value = degrees;
                    angleValue.textContent = `${degrees}°`;
                    updateDotPosition();
                    updatePreview();
                };
                directionDot.addEventListener("mousedown", e => {
                    e.preventDefault();
                    isDragging = true;
                });
                document.addEventListener("mousemove", handleDrag);
                document.addEventListener("mouseup", () => isDragging = false);
                renderColors();
                updateDotPosition();
                updatePreview();
            }
        });
        return `
            <div class="menu_gradient_editor" id="${id}">
                <div class="menu_gradient_top">
                    <div class="menu_gradient_preview"></div>
                    <div class="menu_gradient_direction">
                        <div class="menu_gradient_dot"></div>
                    </div>
                </div>
                <div class="menu_gradient_control">
                    <span>Angle</span>
                    <input type="range" class="menu_gradient_angle" min="0" max="360" value="${configs.gradientAngle || 135}">
                    <span class="menu_gradient_angle_val">${configs.gradientAngle || 135}°</span>
                    </div>
                <br>
                <div class="menu_gradient_colors"></div>
                <button class="menu_gradient_add">${SVGIcons.plus} Add Color</button>
                <div class="menu_gradient_controls">
                    <div class="menu_gradient_control">
                        <label class="menu_toggle small">
                            <input type="checkbox" class="menu_gradient_anim" ${configs.gradientAnimated ? "checked" : ""}>
                            <span class="menu_toggle_slider"></span>
                        </label>
                        <span>Animate</span>
                    </div>
                    <div class="menu_gradient_control">
                        <span>Speed</span>
                        <input type="range" class="menu_gradient_speed" min="1" max="15" value="${configs.gradientSpeed || 3}">
                        <span class="menu_gradient_speed_val">${configs.gradientSpeed || 3}s</span>
                    </div>
                </div>
            </div>
        `;
    }
    static resetButton() {
        const id = this.generateId("reset");
        this.registeredElements.push({
            id,
            type: "reset",
            init: () => {
                const btn = document.getElementById(id);
                if (!btn) {
                    return;
                }
                btn.addEventListener("click", () => {
                    if (confirm("Reset all theme settings to default?")) {
                        ThemeManager.resetToDefault();
                        //location.reload();
                    }
                });
            }
        });
        return `
            <button class="menu_reset_btn" id="${id}">
                ${SVGIcons.reset}
                <span>Reset to Default</span>
            </button>
        `;
    }
    static initAll() {
        this.registeredElements.forEach(el => {
            try {
                if (el.init) {
                    el.init();
                }
            } catch (e) {
                console.error("Init error:", e);
            }
        });
    }
}
let menuOpen = false;
let autogathering = false;
function toggleMenu() {
    menuOpen = !menuOpen;
    const menu = document.getElementById("mod_menu");
    if (menuOpen) {
        menu.style.display = "flex";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                menu.classList.add("open");
            });
        });
    } else {
        menu.classList.remove("open");
        HTML.closeDropdown();
        setTimeout(() => {
            if (!menuOpen) {
                menu.style.display = "none";
            }
        }, 300);
    }
}

//${HTML.slider('Sensitivity', 'Adjust mouse sensitivity.', 'sensitivity', 0, 100, 1, '%')}

function createMenu() {
    const dropdownPortal = document.createElement("div");
    dropdownPortal.id = "menu_dropdown_portal";
    document.body.appendChild(dropdownPortal);
    const menu = document.createElement("div");
    menu.id = "mod_menu";
    menu.innerHTML = `
        <div class="menu_content">
            <div class="menu_sidebar">
                <div class="menu_logo">
                    <span>Lotus Client</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 4" width="20" height="16">
                        <path d="M3.67339,2.456a.02.02,0,0,0-.002.03969c.0292.00575.04095.048.03248.07548-.01017.033-.04472.04383-.07183.05357a.94373.94373,0,0,1-.18521.03948,2.37753,2.37753,0,0,0-.38178.06827.6208.6208,0,0,0-.284.17043L2.7796,2.9047a.40657.40657,0,0,0-.01141-.18883.43464.43464,0,0,0-.18089-.2313.5748.5748,0,0,0-.1291-.06083.19178.19178,0,0,1-.12621-.093l-.00587.00134a.12317.12317,0,0,0,.00624.04174l-.00516.00086a.692.692,0,0,0-.23273.11083A.35767.35767,0,0,0,1.98594,2.65l-.04086-.11554c-.02485-.07036-.05138-.14016-.07452-.21123-.01143-.03512-.02084-.07035-.0342-.10464a1.1289,1.1289,0,0,1-.05312-.12878.00719.00719,0,0,0-.0143.00117c-.00172.03084-.0082.05908-.0107.08879a.79226.79226,0,0,0-.17868.34617l-.03343-.0571c-.03313-.05773-.05955-.12009-.09518-.17615A.63315.63315,0,0,0,1.192,2.06392a.906.906,0,0,0-.33806-.0832c-.06575-.00459-.13147-.00426-.19732-.0043-.07215,0-.14437-.00463-.21632-.00337L.43919,1.9797a.50147.50147,0,0,0,.04975.01923,1.67215,1.67215,0,0,1,.18328.21428c.05352.07635.09384.16191.142.242a1.25027,1.25027,0,0,0,.34.37488,1.01905,1.01905,0,0,0,.37276.161h-.0002c-.10532.00038-.20923.00438-.31457-.00364a.759.759,0,0,1-.26767-.05153C.93665,2.93233.92894,2.94322.93274,2.951a.14448.14448,0,0,0,.04334.05264,1.65147,1.65147,0,0,0,.19124.20835.854.854,0,0,0,.24949.13548q.03337.01261.06707.02213a2.175,2.175,0,0,0-.29409.04856,2.91,2.91,0,0,0-.45286.16521,1.54446,1.54446,0,0,1-.23833.09089.435.435,0,0,1-.09987.01039C.35351,3.68034.30963,3.66677.26544,3.65863a3.42182,3.42182,0,0,0,.31608-.21327C.63967,3.40976.7,3.37557.76033,3.34469a1.04739,1.04739,0,0,1,.20515-.05961c.01314-.00369.01282-.02667-.00182-.027a.90026.90026,0,0,0-.20222.03451.73021.73021,0,0,0-.19215.06361.944.944,0,0,0-.17252.11795c-.06118.052-.09851.12955-.1676.16976a.01388.01388,0,0,0-.00378.02115L.22419,3.66486.22356,3.667.232,3.67053a.26362.26362,0,0,0,.13567.06265c.062.01456.12563.0227.18813.03461A2.26061,2.26061,0,0,0,.999,3.80442a1.3661,1.3661,0,0,0,.39477-.06252A1.01517,1.01517,0,0,0,1.74205,3.583c.00956-.00788-.00141-.02155-.01093-.01769a1.6063,1.6063,0,0,1-.35661.1228A2.4898,2.4898,0,0,1,.984,3.71c-.098-.00028-.196-.00628-.29386-.01183l.02306-.00373c.16734-.03181.32743-.0956.49335-.134.15915-.03685.32015-.04159.48021-.06818a.83429.83429,0,0,0,.40615-.18476c.01958-.01609-.003-.05218-.02416-.0391a.60251.60251,0,0,1-.2695.075A.73228.73228,0,0,1,1.694,3.321c-.08235-.02374-.16514-.05112-.24533-.08262a2.4361,2.4361,0,0,1-.2339-.11676c-.04648-.02428-.09182-.04834-.13507-.07656l.02926.00512a1.65371,1.65371,0,0,0,.32984.014,1.00164,1.00164,0,0,1,.58592.02724.01525.01525,0,0,0,.01167.00166l.01813.0129a.017.017,0,0,0,.01174.004c.02836.02894.06.05537.09045.08708.00782.00815.01843-.00268.0123-.01214a.91762.91762,0,0,1-.11077-.45c-.00866-.17751.142-.26969.27647-.32027a.02027.02027,0,0,0,.01161-.01134A.2801.2801,0,0,0,2.42669,2.48a.8472.8472,0,0,1,.206.16872A.38193.38193,0,0,1,2.7,2.93291a.3642.3642,0,0,1-.12274.20614.51035.51035,0,0,0-.08928-.0292.24284.24284,0,0,0-.162.01947.187.187,0,0,0-.14226.18561c.0003.005.00717.00567.00722.00043a.13123.13123,0,0,1,.14179-.12984.6162.6162,0,0,1,.08767.03936c.02711.01122.05411.02242.08169.03218a1.601,1.601,0,0,0,.19795.05052c.061.01314.11972.03645.18011.0529.17541.04779.45826.06617.53634-.16277a.02361.02361,0,0,0-.04169-.02161c-.16927.23871-.498.10237-.70218.00674L2.64,3.16736a.41428.41428,0,0,0,.0323-.03988A.41167.41167,0,0,0,2.732,3.04335l.00327-.00406a.68029.68029,0,0,1,.16229-.13989,1.1268,1.1268,0,0,1,.42837-.13163c.06816-.01127.13658-.02222.2044-.03606a1.02232,1.02232,0,0,0-.21122.18914.89583.89583,0,0,1-.34322.28386c-.0111.004-.00819.023.00374.02a.80886.80886,0,0,0,.34642-.21284c.10777-.10163.37958-.345.39491-.36469C3.76744,2.58747,3.76865,2.45471,3.67339,2.456Zm-2.0308.48279a1.30519,1.30519,0,0,1-.41469-.21825,1.29352,1.29352,0,0,1-.17965-.15658C.98816,2.499.936,2.42625.87662,2.36079a4.5071,4.5071,0,0,0-.3449-.349c.02859.00782.05748.01458.08571.02178.057.01454.11523.02574.17289.03689a1.88473,1.88473,0,0,1,.33937.08874.67678.67678,0,0,1,.27212.1957,1.56783,1.56783,0,0,1,.11662.14714c.02188.03273.04213.06673.06269.10048l.00583.03007a.47736.47736,0,0,0,.1041.1985.33433.33433,0,0,0,.08392.06442.41771.41771,0,0,0,.09058.0533A.01526.01526,0,0,0,1.88017,2.924c-.01972-.02855-.04779-.04688-.06612-.07752-.01343-.02245-.02385-.04709-.03634-.07016a.51392.51392,0,0,1-.06408-.1723.67492.67492,0,0,1,.046-.35831.43274.43274,0,0,0,.01321.07512,1.68463,1.68463,0,0,0,.07433.2144c.03023.07179.06491.141.09467.21312l.01907.04881a.68235.68235,0,0,0,.0252.182.27337.27337,0,0,0,.015.04036A2.0695,2.0695,0,0,0,1.64259,2.93875Z"/>
                        <path d="M4.14251,3.76689a.72979.72979,0,0,0-.6108-.557c-.0227-.0019-.02421.03578-.0019.03856a.62318.62318,0,0,1,.51315.48976,1.05657,1.05657,0,0,1-.249.03385,1.5937,1.5937,0,0,1-.28569-.02864c-.0993-.01851-.19844-.04056-.29817-.05592-.0649-.01-.13005-.01414-.19532-.01793q.02573-.01108.05129-.0245a.70268.70268,0,0,0,.22737-.17415c.0061-.0078-.00015-.02086-.00978-.01583-.07186.03756-.13114.099-.20392.13644a.38547.38547,0,0,1-.26869.02122A1.33638,1.33638,0,0,1,2.327,3.391c-.01037-.00736-.02448.00931-.01459.01886a1.06711,1.06711,0,0,0,.39537.28765.49622.49622,0,0,1-.29252.00024.32411.32411,0,0,1-.15348-.09222,1.20435,1.20435,0,0,1-.1152-.13959l-.00508.0038a1.171,1.171,0,0,0,.11893.183.61207.61207,0,0,0,.14316.14433.34237.34237,0,0,0,.39526-.08434l.01014.0004a.46229.46229,0,0,0,.11461-.01288,2.643,2.643,0,0,1,.2988.091,2.67988,2.67988,0,0,0,.30728.07782.91253.91253,0,0,0,.58811-.04642A.05307.05307,0,0,0,4.14251,3.76689Z"/>
                        <path d="M4.47931,2.428a.81926.81926,0,0,0-.23439-.0148,2.075,2.075,0,0,0-.22727.04672,1.34951,1.34951,0,0,0-.22233.06782c-.01092.00434-.00448.02509.00669.02129a1.3222,1.3222,0,0,1,.21291-.05394.8666.8666,0,0,1,.23078.004c.07283.00737.14531.01228.21785.023.04328.00638.08777.00876.13161.01381a1.325,1.325,0,0,1-.13854.01568,1.63346,1.63346,0,0,0-.24868.04311,1.42075,1.42075,0,0,0-.44384.18916c-.00746.00473-.00192.01718.006.01322a1.58674,1.58674,0,0,1,.48108-.11281,1.19629,1.19629,0,0,0,.23119-.0507Q4.54571,2.61,4.609,2.58583a3.09028,3.09028,0,0,1-.63357.35948,2.82445,2.82445,0,0,1-.3655.13034,3.79734,3.79734,0,0,1-.37371.11221l.00046.00674a1.89747,1.89747,0,0,0,.3902-.02815,2.38915,2.38915,0,0,0,.38-.13056,5.48157,5.48157,0,0,0,.771-.51974C4.77807,2.51618,4.55756,2.44361,4.47931,2.428Z"/>
                        <path d="M3.8367,1.55056c.0042-.01-.00822-.01934-.014-.00942-.03393.05813-.1179.06768-.17533.07662-.072.01121-.14447.019-.21669.02827a.8037.8037,0,0,0-.37463.1159.94515.94515,0,0,0-.23921.31988.869.869,0,0,0-.1374.37739.01707.01707,0,1,0,.034.002.88271.88271,0,0,1,.16892-.40167.63948.63948,0,0,1,.30238-.2555,1.91411,1.91411,0,0,1,.39542-.08811.3637.3637,0,0,0,.20355-.08782,1.10917,1.10917,0,0,1-.22986.27153A2.54918,2.54918,0,0,0,3.215,2.2053a1.9135,1.9135,0,0,0-.20438.34421.87956.87956,0,0,1-.22352.32513c-.0095.00742.00144.02481.0115.01862a.88723.88723,0,0,0,.26448-.26768c.07824-.11776.1368-.2496.22409-.36051A4.40317,4.40317,0,0,1,3.613,1.91824a1.07418,1.07418,0,0,0,.15417-.19345c-.01.02221-.02.04425-.02915.066-.03025.07174-.05915.144-.08916.21583-.029.06951-.057.13765-.08224.209a.92758.92758,0,0,1-.04618.1135c-.0176.03443-.04054.06587-.05482.10207a.01329.01329,0,0,0,.02091.0149,1.3032,1.3032,0,0,0,.13979-.17888.90211.90211,0,0,0,.12218-.21547,1.12171,1.12171,0,0,0,.06857-.233c.01457-.08319.01288-.16405.02045-.24751l.00286-.00881A.01136.01136,0,0,0,3.8367,1.55056Z"/>
                        <path d="M2.68862,1.53835c-.05338-.07384-.113-.1422-.17185-.21075-.02755-.32.1-.06488-.08388-.09568-.03655-.03929-.07435-.05959-.08079-.12149a.00661.00661,0,0,0-.013-.00077.50307.50307,0,0,0-.00934.09078,2.07468,2.07468,0,0,0-.20786.21731,1.27008,1.27008,0,0,0-.17643.23087.46713.46713,0,0,0-.05769.27276A1.13772,1.13772,0,0,0,1.715,1.804c-.18127-.10093-.46472-.12859-.54632-.36576-.00147-.00428-.0078-.00258-.00782.00178a.31088.31088,0,0,0,.03925.1474c.03143.21-.05.51224.12863.662.01675.014.03644-.01.0289-.02852a1.14512,1.14512,0,0,1-.08011-.31971,1.33091,1.33091,0,0,0-.05125-.27153.43007.43007,0,0,0,.04357.05231,1.16122,1.16122,0,0,0,.29353.16221,3.05988,3.05988,0,0,1,.27812.20617.50218.50218,0,0,1,.20588.244c.01166.03995.06108.0286.05767-.013a.49615.49615,0,0,0-.15554-.3035.65718.65718,0,0,1,.11439-.33339c.03934-.07372.07995-.14578.12575-.21493.04368-.06595.0947-.12279.14342-.1833a.22645.22645,0,0,0,.03268.08945,2.01825,2.01825,0,0,0,.16867.20556.93732.93732,0,0,1,.25157.49494c.00266.03069.04261.023.046-.00376A.68793.68793,0,0,0,2.68862,1.53835Z"/>
                        <path d="M1.95814,2.32819c-.01332-.0057-.02193.01094-.018.023a.365.365,0,0,0,.06061.09372.30234.30234,0,0,1,.04623.12035.01476.01476,0,0,0,.02893.00172A.24246.24246,0,0,0,1.95814,2.32819Z"/>
                        <path d="M2.23669,2.40821A.264.264,0,0,1,2.226,2.31878a.31419.31419,0,0,0,.00183-.051.27172.27172,0,0,0-.041-.112.01314.01314,0,0,0-.0248.00208A.229.229,0,0,0,2.1493,2.289a.28426.28426,0,0,0,.02555.05984c.01129.02313.0184.04815.028.07224C2.21091,2.4415,2.24223,2.43,2.23669,2.40821Z"/>
                        <path d="M2.43882,2.23337c-.007-.04578-.01609-.12606-.05792-.15032l-.01019-.00061c-.03809.02786-.02425.0913-.00811.13a.71218.71218,0,0,1,.04283.11069.85238.85238,0,0,1,.01646.11934.02.02,0,0,0,.03984-.00326A1.25806,1.25806,0,0,0,2.43882,2.23337Z"/>
                        <path d="M2.55958,2.12917a.0113.0113,0,0,0-.02247.00184c-.00121.02591-.0273.05264-.03613.07647a.30862.30862,0,0,0-.01821.09715.45.45,0,0,0,.01171.08992.61739.61739,0,0,0,.01515.09338.01059.01059,0,0,0,.02-.00168c.00879-.03244.00564-.06547.01241-.09859.00609-.02975.01608-.0587.02215-.08848a.51647.51647,0,0,0,.01452-.08494A.33308.33308,0,0,0,2.55958,2.12917Z"/>
                        <path d="M2.84686,2.397c-.031.04979-.07491.08613-.10973.1321-.0324.04277-.06264.07479-.04861.13347.00461.01931.02977.034.04424.016a.82549.82549,0,0,0,.10243-.11844.40786.40786,0,0,0,.03639-.15439A.01341.01341,0,0,0,2.84686,2.397Z"/>
                        <path d="M2.65631,2.25978c-.00066-.01134-.01346-.02207-.02237-.01178a.23.23,0,0,0-.05647.11672.321.321,0,0,0,.018.15473.01541.01541,0,0,0,.03064-.00251c.00511-.04143.02056-.0781.0253-.11986A.78142.78142,0,0,0,2.65631,2.25978Z"/>
                        <path d="M2.88538,2.63972c-.01952.01478-.04236.02363-.06147.04037a.391.391,0,0,0-.04828.05495.15723.15723,0,0,0-.03286.12588.02188.02188,0,0,0,.0429.00255.36111.36111,0,0,1,.0568-.0963c.00986-.0139.02153-.02654.03086-.04085.014-.02154.0196-.04629.03154-.06837A.01351.01351,0,0,0,2.88538,2.63972Z"/>
                        <path d="M2.14671,2.43814a.189.189,0,0,0-.03951-.08208c-.01052-.01487-.02759.0022-.02286.01708a.3616.3616,0,0,1,.01087.07774c.00182.02374.00666.04532.01.06875A.01419.01419,0,0,0,2.1316,2.525.13133.13133,0,0,0,2.14671,2.43814Z"/>
                        <path d="M2.35113,2.27333c-.01028-.02474-.03061-.03555-.04864-.052-.00383-.00349-.0097.00164-.00863.00651a.60719.60719,0,0,1,.00686.10411.14793.14793,0,0,1,.0014.02956c-.00392.013-.01831.02191-.02618.03218a.01559.01559,0,0,0,.011.02359.05428.05428,0,0,0,.0419-.02615A.15415.15415,0,0,0,2.358,2.34362.12159.12159,0,0,0,2.35113,2.27333Z"/>
                        <path d="M2.01432,2.61449a.3152.3152,0,0,0-.04746-.124.00717.00717,0,0,0-.01369.00312.68378.68378,0,0,0,.0252.24716A.01465.01465,0,0,0,2.006,2.73847.24491.24491,0,0,0,2.01432,2.61449Z"/>
                    </svg>
                </div>
                <div class="menu_nav">
                    <div class="menu_nav_item active" data-tab="combat">
                        <span class="menu_nav_icon">${SVGIcons.combat}</span>
                        <span>Combat</span>
                    </div>
                    <div class="menu_nav_item" data-tab="visual">
                        <span class="menu_nav_icon">${SVGIcons.visual}</span>
                        <span>Visual</span>
                    </div>
                    <div class="menu_nav_item" data-tab="bots">
                        <span class="menu_nav_icon">${SVGIcons.bots}</span>
                        <span>Bots</span>
                    </div>
                    <div class="menu_nav_item" data-tab="misc">
                        <span class="menu_nav_icon">${SVGIcons.misc}</span>
                        <span>Misc</span>
                    </div>
                    <div class="menu_nav_item" data-tab="themes">
                        <span class="menu_nav_icon">${SVGIcons.theme}</span>
                        <span>Themes</span>
                    </div>
                </div>
            </div>
            <div class="menu_main">
                <div class="menu_tab active" data-tab="combat">
                    ${HTML.section("Placements", `
                        ${HTML.checkBox("auto Place", "automatically places objects when near enemy", "autoPlace")}
                        ${HTML.checkBox("auto Replace", "automatically replaces objects when they get killed", "autoReplace")}
                        ${HTML.checkBox("auto Pre-Place", "automatically preplaces object on perfect time of the server", "autoPrePlace")}
                        <br>
                        ${HTML.checkBox("Chase Placers", "", "chasePlacer")}
                        <br>
                        ${HTML.checkBox("Packet Limit", "Restricts the work of placers if it goes beyond the required number of packages.<br>The work is limited by usage priorities.", "placementPakcetLimited")}
                        ${HTML.textInput("Pakcet Limit Num", "Set packet limit.", "packLim", 4)}
                    `)}

                    ${HTML.section("inTrap", `
                        ${HTML.checkBox("anti Push", "Continuesly hits the enemy away from you with daggers or bat", "antiPush")}
                        ${HTML.checkBox("autoPushSpam", "spam hits enemy with daggers when there in trap with spike damage", "autoPushSpam")}
                        ${HTML.checkBox("antiTrap", "places objects behind you when in trap", "antiTrap")}
                    `)}

                    ${HTML.section("A close fight", `
                        ${HTML.checkBox("Auto Insta", "automatically insta`s an enemy", "autoInsta")}
                        ${HTML.checkBox("Insta to Shames", "automatically insta`s enemy above on high shame", "ShameInsta")}
                        ${HTML.checkBox("Auto Bull Spam", "automatically spam hits on enemy with bull", "AutoBullSpam")}
                    `)}
                    ${HTML.section("Spike Tick", `
                        ${HTML.checkBox("Spike Tick", "hits when enemy gets spike damage", "spikeTick")}
                        ${HTML.checkBox("Reverse Ticked", "reverse insta on enemy", "revTick")}
                    `)}
                    ${HTML.section("Tick", `
                        ${HTML.checkBox("Spike Sync", "hits on sync with spike or enemy", "predictTick")}
                    `)}
                    ${HTML.section("Auto Sync", `
                        ${HTML.checkBox("x18k Sync", "sync when damage is kill worthy", "x18ksync")}
                    `)}
                    ${HTML.section("Auto Play", `
                        ${HTML.checkBox("AutoPlay", "automatically plays the game for you", "autoplayer")}
                        ${HTML.selector("Combat Style", "choose custom autoplay style", "autoplayerstyle", ["Auto", "Camp", "Safe", "Aggressive", "Balanced"])}
                    `)}
                </div>
                <div class="menu_tab" data-tab="visual">
                    ${HTML.section("Display", `
                        ${HTML.checkBox("Name", "Show names", "dName")}
                        ${HTML.checkBox("Shame Count", "Show shame count for players.", "dShame")}
                        ${HTML.checkBox("Player Sid", "Show sids for players.", "dSid")}
                        ${HTML.checkBox("Player Info", "Show infos for player.", "playerInfo")}
                        ${HTML.textInput("Visible player", "Set custom transparancy on players.", "transParentPlayer", 3)}
                        ${HTML.checkBox("Stary visuals player", "this so smooth", "opvisualsPlayer")}
                        <br>
                        ${HTML.checkBox("Weapon Range", "shows range of weapon", "playersWeaponRange")}
                        ${HTML.checkBox("Player HitBox", "shows the hitbox of player", "playerInsideCircle")}
                        <br>
                        ${HTML.checkBox("Ghost Clown Hat", "Predict clown gear.", "gChatGear")}
                    `)}
                    ${HTML.section("Chat", `
                        ${HTML.checkBox("Mirror chat", "copies others chat.", "doChatMirror")}
                    `)}
                    ${HTML.section("Bars", `
                        ${HTML.checkBox("Health Bar", "Show hp of players.", "dHealth")}
                        <br>
                        ${HTML.checkBox("Reloads Bars", "Show and hide is Pri/Sec/Turr reload bars.", "reloadBars")}
                        <br>
                        ${HTML.checkBox("Turret Reload Bar", "Show turret reload.", "turretReloadBar")}
                        ${HTML.checkBox("Secondary Reload Bar", "Show healthBar of players.", "secondaryReloadBar")}
                        ${HTML.checkBox("Primary Reload Bar", "Show healthBar of players.", "primaryReloadBar")}
                    `)}
                    ${HTML.section("Marks", `
                        ${HTML.checkBox("Dispaly Marks", "Shows labels on objects to indicate", "dMarks")}
                        ${HTML.checkBox("Dispaly Marks Outline", "Shows outline of the mark", "markOutline")}
                        ${HTML.selector("Mark Type", "The choice of which players tags will be shown.", "marksTypes", ["All", "Team", "Nears"])}
                        ${HTML.slider("Marks Size", "Сhanging the size of the marak.", "markSize", 0.2, 3, 0.1)}
                        ${HTML.textInput("Visible Objects", "Set custom transparent objects.", "transparentobject", 3)}
                    `)}
                    ${HTML.section("Volcano", `
                        ${HTML.checkBox("Volcano range of animals", "Show volcano range box of animals", "dVolcanZone")}
                        ${HTML.checkBox("Damage zone volcano", "Show damage zone of volcano", "dVolcDamageZone")}
                        ${HTML.checkBox("Farm box animals", "Show the perfect box the farm animals", "dVolcFarmZone")}
                    `)}
                    ${HTML.section("Zoom", `
                        ${HTML.checkBox("Scroll Zoom", "Use the zoom on the mouse wheel.", "wheelZoom")}
                        ${HTML.textInput("Zoom Level", "Set custom zoom level.", "zoomLevel", 3)}
                    `)}
                    ${HTML.section("Aim", `
                        ${HTML.checkBox("Mouse Dir", "Show mouse direct Instead of real player dir.", "moysePlayerDirection")}
                    `)}
                </div>
                <div class="menu_tab" data-tab="bots">
                    ${HTML.section("Connected", `
                        ${HTML.buttonMenu([{
        text: "Send Bots",
        onClick: () => window.spawnBots(configs.botcount)
    }, {
        text: "Stop Spawning",
        onClick: () => window.stopBotSpawning()
    }, {
        text: "Close Bots",
        onClick: () => window.disconnectAll()
    }])}
                        ${HTML.textInput("Bot Count", "Number of bots to spawn.", "botcount", 2)}
                    `)}
                    ${HTML.section("Name", `
                        ${HTML.textInput("Bot Name", "Name for spawned bots.", "botname", 15)}
                        ${HTML.checkBox("Random Bot Name", "Random names for spawned bots.", "ranBotName")}
                    `)}
                    ${HTML.section("Behavior", `
                        ${HTML.selector("Bot Mode", "Select bot behavior mode.", "botMovementMode", ["Normal", "Mouse", "Circle", "Copy", "Clear", "Stay"])}
                        ${HTML.textInput("Bot Dist", "Distance to target.", "distToTT", 4)}
                        ${HTML.checkBox("Gold Bot", "Bots got 0 iq to game", "goldBots")}
                        ${HTML.checkBox("Auto Mills", "Bots automatically place mills while moving (limit: 7 normal / 299 sandbox)", "autoMills")}
                        <br>
                        ${HTML.selector("Bot Hats", "Select bot hats mode.", "botHatsMode", ["Normal", "Animals", "Police"])}
                        ${HTML.checkBox("Assasin Bot", "Equips assasin gear when you do stop move very usefull also funni for trolling.", "assassinGearBot")}
                        ${HTML.checkBox("Auto Placer", "Bots will automatically places objects such as spikes/traps.<br>Not Realized NOW.", "botPlacement")}
                    `)}
                    ${HTML.section("Chat Spam", `
                        ${HTML.checkBox("Enable Chat Spam", "Bots will spam chat messages.", "botChatSpam", (enabled) => {
        if (enabled) {
            window.startChatSpam();
        } else {
            window.stopChatSpam();
        }
    })}
                        ${HTML.textInput("Spam Delay (ms)", "Delay between each bot sending message.", "botSpamDelay", 6)}
                        <div id="chatSpamMessages" style="margin-top: 8px;">
                            <div class="spam-msg-row" style="display: flex; gap: 5px; margin-bottom: 5px; align-items: center;">
                                <input type="text" class="menu_text_input spam-message" placeholder="Message 1" maxlength="30" style="flex: 1; width: auto;">
                            </div>
                        </div>
                        ${HTML.buttonMenu([{
        text: "+ Add Message",
        onClick: () => window.addSpamMessage()
    }, {
        text: "Send Once",
        onClick: () => window.sendBotChatOnce()
    }])}
                    `)}
                    ${HTML.section("Upgrade", `
                        ${HTML.checkBox("Player Auto Upgrade", "Automatically upgrade player with same weapon type as bots", "playerAutoUpgrade")}
                        ${HTML.selector("Bot Weapons Type", "Select bot weapon type.", "botWeaponType", ["Musket", "Hammer", "Dagger", "Bat", "Sword", "Stick"])}
                    `)}
                </div>
                <div class="menu_tab" data-tab="misc">
                    ${HTML.section("General", `
                        ${HTML.checkBox("Auto Respawn", "Automatically respawn on death.", "autoRespawn")}
                        ${HTML.checkBox("Auto Grind", "Automatically placing teleportes/turrets for farm.", "autoGrind")}
                        ${HTML.checkBox("Auto Steal", "automatically finishes off animals", "autoSteal")}
                    `)}
                    ${HTML.section("Chat", `
                        ${HTML.checkBox("Fake Mode", "Uses auto chats from Happy mod.<br>Also applies to Kill-Chat.", "happyModLier")}
                        ${HTML.textInput("Kill Chat Messages", "Kill chat message.", "kllChatMessage", 30)}
                        ${HTML.checkBox("Auto Kill Chat", "Say message on kill.", "killChat")}
                    `)}
                    ${HTML.section("Heal", `
                        ${HTML.checkBox("Ping Heal", "do u", "doPingHeal")}
                        ${HTML.checkBox("Should Heal", "do u", "shouldHeal")}
                    `)}
                    ${HTML.section("Hats", `
                        ${HTML.checkBox("Always Flipper", "Uses a swimming mask regardless of the fact that the enemy may be in the range of 300.", "alwaysFlipper")}
                        ${HTML.checkBox("Auto Turret", "Shit for bully noobs.", "autoTurret")}
                    `)}
                    ${HTML.section("Aim", `
                        ${HTML.checkBox("Lock Dir", "Help to Safe packets.", "lockPlayerDirection")}
                    `)}
                </div>
                <div class="menu_tab" data-tab="themes">
                    ${HTML.section("Theme Mode", `
                        ${HTML.themeMode()}
                    `)}
                    ${HTML.section("Accent Color", `
                        ${HTML.colorPicker("Primary Color", "Main accent color for UI.", "accentColor")}
                        ${HTML.checkBox("Use Gradient", "Enable gradient as accent color.", "useGradient", () => ThemeManager.applyTheme())}
                    `)}
                    ${HTML.section("Gradient Editor", `
                        ${HTML.gradientEditor()}
                    `)}
                    ${HTML.section("Custom Colors", `
                        ${HTML.colorPicker("Background Primary", "Main background color.", "customBgPrimary")}
                        ${HTML.colorPicker("Background Secondary", "Secondary background.", "customBgSecondary")}
                        ${HTML.colorPicker("Background Tertiary", "Tertiary background.", "customBgTertiary")}
                        ${HTML.colorPicker("Text Primary", "Main text color.", "customTextPrimary")}
                        ${HTML.colorPicker("Text Secondary", "Secondary text color.", "customTextSecondary")}
                    `, false)}
                    ${HTML.section("Reset", `
                        ${HTML.resetButton()}
                    `, false)}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);
    menu.querySelectorAll(".menu_nav_item").forEach(item => {
        item.addEventListener("click", () => {
            const tab = item.dataset.tab;
            menu.querySelectorAll(".menu_nav_item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            menu.querySelectorAll(".menu_tab").forEach(t => t.classList.remove("active"));
            menu.querySelector(`.menu_tab[data-tab="${tab}"]`).classList.add("active");
            HTML.closeDropdown();
        });
    });
    document.addEventListener("keydown", e => {
        if (e.keyCode === 27 && !document.activeElement.matches("input")) {
            if (!isPageLoaded) {
                event.preventDefault();
                event.stopPropagation();
            }
            toggleMenu();
        }
    });
    ThemeManager.applyTheme();
    HTML.initAll();
}
const styles = `
#upgradeHolder {
    top: 55px;
}

#upgradeCounter {
    top: 128px;
}

:root {
    --menu-bg-primary: #40454E;
    --menu-bg-secondary: #373C45;
    --menu-bg-tertiary: #2D3037;
    --menu-bg-input: #30303A;
    --menu-text-primary: #ffffff;
    --menu-text-secondary: #858A92;
    --menu-accent: #696ACB;
    --menu-accent-solid: #696ACB;
    --menu-accent-rgb: 105, 106, 203;
    --menu-gradient-speed: 3s;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.menu-animated-gradient .menu_accent_bg {
    background-size: 200% 200% !important;
    animation: gradientShift var(--menu-gradient-speed) ease infinite !important;
}

#mod_menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

#mod_menu.open {
    background: rgba(0, 0, 0, 0.5);
}

#mod_menu .menu_content {
    display: flex;
    width: 820px;
    height: 520px;
    background: var(--menu-bg-primary);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}

#mod_menu.open .menu_content {
    transform: scale(1);
    opacity: 1;
}

.menu_sidebar {
    width: 200px;
    background: var(--menu-bg-secondary);
    display: flex;
    flex-direction: column;
}

.menu_logo {
    padding: 20px;
    font-size: 20px;
    font-weight: 700;
    color: var(--menu-text-primary);
    text-align: center;
}

.menu_logo {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    font-size: 20px;
    font-weight: 700;
    color: var(--menu-text-primary);
    text-align: center;
}

.menu_logo svg {
    width: 38px;
    height: 38px;
    fill: currentColor;
}

.menu_nav {
    flex: 1;
    padding: 10px 0;
}

.menu_nav_item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    color: var(--menu-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.menu_nav_item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--menu-accent);
    transform: scaleY(0);
    transition: transform 0.2s;
}

.menu_nav_item:hover {
    background: var(--menu-bg-tertiary);
    color: var(--menu-text-primary);
}

.menu_nav_item.active {
    background: var(--menu-bg-tertiary);
    color: var(--menu-text-primary);
}

.menu_nav_item.active::before {
    transform: scaleY(1);
}

.menu-gradient-mode .menu_nav_item.active::before {
    background: var(--menu-accent);
}

.menu_nav_icon {
    width: 20px;
    height: 20px;
}

.menu_nav_icon svg {
    width: 100%;
    height: 100%;
}

.menu_main {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.menu_tab {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: translateX(20px);
    transition: all 0.3s;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.menu_tab::-webkit-scrollbar {
    display: none;
}

.menu_tab.active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
}

.menu_section {
    margin-bottom: 8px;
}

.menu_section_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0px;
    color: var(--menu-text-secondary);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
}

.menu_section_title:hover {
    color: var(--menu-text-primary);
}

.menu_section_title.collapsed .menu_section_chevron {
    transform: rotate(180deg);
}

.menu_section_chevron {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
}

.menu_section_chevron svg {
    width: 100%;
    height: 100%;
}

.menu_section_content {
    overflow: hidden;
    transition: max-height 0.3s, opacity 0.3s;
}

.menu_section_content.collapsed {
    max-height: 0 !important;
    opacity: 0;
}

.menu_setting_row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    margin: 6px 0;
    background: var(--menu-bg-secondary);
    border-radius: 10px;
    transition: background 0.2s;
}

.menu_setting_row:hover {
    background: var(--menu-bg-tertiary);
}

.menu_setting_row_vertical {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
}

.menu_setting_info {
    flex: 1;
    min-width: 0;
}

.menu_setting_name {
    color: var(--menu-text-primary);
    font-size: 14px;
    font-weight: 500;
}

.menu_setting_desc {
    color: var(--menu-text-secondary);
    font-size: 11px;
    margin-top: 4px;
    line-height: 1.4;
}

.menu_toggle {
    position: relative;
    width: 46px;
    height: 24px;
    flex-shrink: 0;
}

.menu_toggle.small {
    width: 36px;
    height: 20px;
}

.menu_toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.menu_toggle_slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--menu-bg-input);
    border-radius: 24px;
    transition: 0.3s;
}

.menu_toggle_slider::before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: var(--menu-text-secondary);
    border-radius: 50%;
    transition: 0.3s;
}

.menu_toggle.small .menu_toggle_slider::before {
    height: 14px;
    width: 14px;
}

.menu_toggle input:checked + .menu_toggle_slider {
    background: var(--menu-accent);
}

.menu_toggle input:checked + .menu_toggle_slider::before {
    transform: translateX(22px);
    background: var(--menu-text-primary);
}

.menu_toggle.small input:checked + .menu_toggle_slider::before {
    transform: translateX(16px);
}

.menu_text_input {
    width: 120px;
    height: 36px;
    padding: 0 12px;
    background: var(--menu-bg-input);
    border: 2px solid transparent;
    border-radius: 8px;
    color: var(--menu-text-primary);
    font-size: 13px;
    text-align: center;
    outline: none;
    transition: border 0.2s;
}

.menu_text_input:focus {
    border-color: var(--menu-accent-solid);
}

.menu_text_input::placeholder {
    color: var(--menu-text-secondary);
}

.menu_slider_wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu_slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: var(--menu-bg-input);
    border-radius: 3px;
    outline: none;
    --slider-percent: 50%;
}

.menu_slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(to right, var(--menu-accent-solid) var(--slider-percent), var(--menu-bg-input) var(--slider-percent));
}

.menu_slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--menu-accent);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
    margin-top: -6px;
}

.menu_slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}

.menu_slider_value {
    min-width: 45px;
    color: var(--menu-text-primary);
    font-size: 13px;
    font-weight: 500;
    text-align: right;
}

.menu_dropdown {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    min-width: 130px;
    background: var(--menu-bg-input);
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: border 0.2s;
    user-select: none;
}

.menu_dropdown:hover,
.menu_dropdown.open {
    border-color: var(--menu-accent-solid);
}

.menu_dropdown_selected {
    flex: 1;
    color: var(--menu-text-primary);
    font-size: 13px;
}

.menu_dropdown_arrow {
    width: 14px;
    height: 14px;
    color: var(--menu-text-secondary);
    transition: transform 0.2s;
}

.menu_dropdown.open .menu_dropdown_arrow {
    transform: rotate(180deg);
}

.menu_dropdown_arrow svg {
    width: 100%;
    height: 100%;
}

#menu_dropdown_portal {
    position: fixed;
    z-index: 99999999;
    display: none;
    pointer-events: auto;
}

.menu_dropdown_list {
    background: var(--menu-bg-input);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px) scaleY(0.8);
    transform-origin: top;
    transition: all 0.15s ease-out;
    pointer-events: auto;
}

.menu_dropdown_list::-webkit-scrollbar {
    display: none;
}

.menu_dropdown_list.open {
    max-height: 250px;
    opacity: 1;
    transform: translateY(0) scaleY(1);
    overflow-y: auto;
}

.menu_dropdown_option {
    padding: 12px 14px;
    color: var(--menu-text-primary);
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;
}

.menu_dropdown_option:hover {
    background: rgba(var(--menu-accent-rgb), 0.3);
}

.menu_dropdown_option.selected {
    background: var(--menu-accent);
}

.menu_btn_grid {
    display: grid;
    grid-template-columns: repeat(var(--btn-count), 1fr);
    gap: 8px;
    margin: 6px 0;
}

.menu_grid_btn {
    padding: 14px;
    background: var(--menu-bg-secondary);
    border: none;
    border-radius: 8px;
    color: var(--menu-text-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.menu_grid_btn:hover {
    background: var(--menu-accent);
    transform: translateY(-2px);
}

.menu_selector {
    display: flex;
    background: var(--menu-bg-input);
    border-radius: 8px;
    overflow: hidden;
}

.menu_selector_btn {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: none;
    color: var(--menu-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.menu_selector_btn:last-child {
    border-right: none;
}

.menu_selector_btn:hover {
    color: var(--menu-text-primary);
    background: rgba(var(--menu-accent-rgb), 0.2);
}

.menu_selector_btn.active {
    color: var(--menu-text-primary);
    background: var(--menu-accent);
}

.menu_color_wrap {
    position: relative;
    width: 50px;
    height: 36px;
}

.menu_color_preview {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 2px solid var(--menu-bg-tertiary);
    pointer-events: none;
}

.menu_color_input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.menu_theme_selector {
    display: flex;
    gap: 12px;
    margin: 6px 0;
}

.menu_theme_btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background: var(--menu-bg-secondary);
    border: 3px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.menu_theme_btn:hover {
    background: var(--menu-bg-tertiary);
}

.menu_theme_btn.active {
    border-color: var(--menu-accent-solid);
}

.menu_theme_btn span {
    color: var(--menu-text-primary);
    font-size: 14px;
    font-weight: 500;
}

.menu_theme_preview {
    width: 80px;
    height: 50px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.menu_theme_preview.dark {
    background: linear-gradient(135deg, #40454E 50%, #373C45 50%);
}

.menu_theme_preview.light {
    background: linear-gradient(135deg, #ffffff 50%, #f0f0f0 50%);
}

.menu_gradient_editor {
    margin: 6px 0;
    padding: 16px;
    background: var(--menu-bg-secondary);
    border-radius: 12px;
}

.menu_gradient_top {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
}

.menu_gradient_preview {
    flex: 1;
    height: 80px;
    border-radius: 10px;
    background: linear-gradient(135deg, #696ACB, #9B59B6);
}

.menu_gradient_direction {
    position: relative;
    width: 80px;
    height: 80px;
    background: var(--menu-bg-input);
    border-radius: 10px;
    flex-shrink: 0;
}

.menu_gradient_dot {
    position: absolute;
    width: 16px;
    height: 16px;
    background: var(--menu-accent);
    border-radius: 50%;
    cursor: grab;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    transition: box-shadow 0.1s;
    z-index: 1;
}

.menu_gradient_dot:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.menu_gradient_dot:active {
    cursor: grabbing;
}

.menu_gradient_colors {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.menu_gradient_color_item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--menu-bg-input);
    border-radius: 8px;
    cursor: grab;
    transition: all 0.2s;
}

.menu_gradient_color_item.dragging {
    opacity: 0.5;
    transform: scale(0.98);
}

.menu_gradient_drag {
    width: 16px;
    height: 16px;
    color: var(--menu-text-secondary);
}

.menu_gradient_drag svg {
    width: 100%;
    height: 100%;
}

.menu_gradient_color_input {
    width: 100px;
    height: 28px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: transparent;
    padding: 0;
}

.menu_gradient_color_input::-webkit-color-swatch-wrapper {
    padding: 0;
}

.menu_gradient_color_input::-webkit-color-swatch {
    border-radius: 4px;
    border: none;
}

.menu_gradient_remove {
    margin-left: auto;
    width: 26px;
    height: 26px;
    background: #ff5555;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: opacity 0.2s;
}

.menu_gradient_remove:hover {
    opacity: 0.8;
}

.menu_gradient_remove svg {
    width: 14px;
    height: 14px;
}

.menu_gradient_add {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 2px dashed var(--menu-text-secondary);
    border-radius: 8px;
    color: var(--menu-text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 12px;
}

.menu_gradient_add:hover:not(.disabled) {
    border-color: var(--menu-accent-solid);
    color: var(--menu-accent-solid);
}

.menu_gradient_add.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.menu_gradient_add svg {
    width: 16px;
    height: 16px;
}

.menu_gradient_controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu_gradient_control {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu_gradient_control > span {
    min-width: 50px;
    color: var(--menu-text-secondary);
    font-size: 12px;
}

.menu_gradient_control input[type="range"] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: var(--menu-bg-input);
    border-radius: 2px;
    outline: none;
}

.menu_gradient_control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: var(--menu-accent-solid);
    border-radius: 50%;
    cursor: pointer;
}

.menu_gradient_angle_val,
.menu_gradient_speed_val {
    min-width: 35px;
    text-align: right;
    color: var(--menu-text-primary);
    font-size: 12px;
    font-weight: 500;
}

.menu_reset_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px;
    margin: 6px 0;
    background: #ff5555;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.menu_reset_btn:hover {
    background: #ff3333;
    transform: translateY(-2px);
}

.menu_reset_btn svg {
    width: 18px;
    height: 18px;
}

.menu-gradient-mode .menu_toggle input:checked + .menu_toggle_slider,
.menu-gradient-mode .menu_selector_btn.active,
.menu-gradient-mode .menu_grid_btn:hover,
.menu-gradient-mode .menu_nav_item.active::before {
    background: var(--menu-accent) !important;
}

.menu-gradient-mode .menu_slider::-webkit-slider-thumb {
    background: var(--menu-accent) !important;
}

.menu-gradient-mode .menu_gradient_dot {
    background: var(--menu-accent-solid) !important;
}

.menu-animated-gradient .menu_toggle input:checked + .menu_toggle_slider,
.menu-animated-gradient .menu_selector_btn.active,
.menu-animated-gradient .menu_grid_btn:hover,
.menu-animated-gradient .menu_nav_item.active::before,
.menu-animated-gradient .menu_dropdown_option.selected,
.menu-animated-gradient .menu_gradient_preview {
    background-size: 200% 200% !important;
    animation: gradientShift var(--menu-gradient-speed) ease infinite !important;
}
`;
function initMenuCode() {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    createMenu();
    setTimeout(() => window.initSpamMessages && window.initSpamMessages(), 100);
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenuCode);
} else {
    initMenuCode();
}

// ============ BOT CONTROLLER GUI ============
window.botControllerGUIVisible = false;
window.botControllerServers = [];
window.botControllerQueue = [];
window.botControllerBots = {};
window.botControllerIframe = null;
window.botControllerWS = null;

window.connectBotControllerWS = () => {
    if (window.botControllerWS && window.botControllerWS.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket('wss://o6zptdi2mza0l3sdhh2gr89q-production.up.railway.app');
    window.botControllerWS = ws;

    ws.onopen = () => {
        window.bcgLog('🔗 Connected');
    };

    ws.onmessage = (e) => {
        try {
            const msg = JSON.parse(e.data);

            switch (msg.type) {
                case 'init':
                    // Full initial state
                    window.botControllerBots = msg.data.status.servers || {};
                    window.botControllerQueue = msg.data.queue || [];
                    window.updateBotControllerStatusFromWS(msg.data.status);
                    // Load chat state
                    if (msg.data.chat) {
                        window.bcgUpdateChatFromWS(msg.data.chat);
                    }
                    // Load logs
                    if (msg.data.logs) {
                        msg.data.logs.forEach(log => window.bcgLogDirect('[' + log.time + '] ' + log.msg));
                    }
                    break;

                case 'status':
                    window.botControllerBots = msg.data.servers || {};
                    window.updateBotControllerStatusFromWS(msg.data);
                    break;

                case 'queue':
                    // Queue updated by another client
                    window.botControllerQueue = msg.data || [];
                    window.updateBotControllerUI();
                    break;

                case 'chat':
                    // Chat updated by another client
                    window.bcgUpdateChatFromWS(msg.data);
                    break;

                case 'log':
                    // New log from server
                    window.bcgLogDirect('[' + msg.data.time + '] ' + msg.data.msg);
                    break;
            }
        } catch (err) { }
    };

    ws.onclose = () => {
        window.bcgLog('❌ Disconnected');
        window.botControllerWS = null;
        if (window.botControllerIframe) {
            setTimeout(window.connectBotControllerWS, 2000);
        }
    };

    ws.onerror = () => {
        ws.close();
    };
};

// Send message to server via WebSocket
window.bcgSend = (type, data) => {
    if (window.botControllerWS && window.botControllerWS.readyState === WebSocket.OPEN) {
        window.botControllerWS.send(JSON.stringify({ type, data }));
    }
};

window.disconnectBotControllerWS = () => {
    if (window.botControllerWS) {
        window.botControllerWS.close();
        window.botControllerWS = null;
    }
};

window.toggleBotControllerGUI = () => {
    if (window.botControllerIframe) {
        window.botControllerIframe.remove();
        window.botControllerIframe = null;
        window.disconnectBotControllerWS();
    } else {
        window.createBotControllerGUI();
    }
};

window.createBotControllerGUI = () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'botControllerIframe';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999999;background:rgba(0,0,0,0.8)';
    document.body.appendChild(iframe);
    window.botControllerIframe = iframe;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;background:transparent;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.bcg-container{background:linear-gradient(135deg,#0f0f1a,#1a1a2e);border-radius:16px;padding:20px;width:1000px;max-height:90vh;overflow-y:auto;position:relative;border:1px solid rgba(100,100,255,0.2);display:flex;gap:20px}.bcg-left{flex:1}.bcg-right{width:280px}.bcg-close{position:absolute;top:10px;right:15px;font-size:28px;cursor:pointer;color:#888;transition:color 0.2s;z-index:10}.bcg-close:hover{color:#f55}.bcg-title{text-align:center;margin-bottom:15px;font-size:24px;background:linear-gradient(135deg,#5af,#a5f);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.bcg-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:15px}.bcg-stat{background:rgba(0,0,0,0.3);padding:12px;border-radius:10px;text-align:center}.bcg-stat-value{font-size:24px;font-weight:bold;color:#5f5}.bcg-stat-label{font-size:11px;color:#888;margin-top:3px}.bcg-section{margin-bottom:15px}.bcg-section-title{color:#5af;font-size:14px;margin-bottom:8px;border-bottom:1px solid rgba(100,100,255,0.2);padding-bottom:5px}.bcg-servers{background:rgba(0,0,0,0.3);border-radius:10px;padding:10px;max-height:150px;overflow-y:auto}.bcg-region{margin-bottom:10px}.bcg-region-title{font-size:12px;color:#888;text-transform:uppercase;margin-bottom:6px;font-weight:bold}.bcg-server-cards{display:flex;flex-wrap:wrap;gap:6px}.bcg-server{background:rgba(40,40,60,0.8);border:2px solid transparent;border-radius:8px;padding:8px 12px;cursor:pointer;min-width:80px;text-align:center;transition:all 0.2s;color:#fff}.bcg-server:hover{border-color:rgba(100,100,255,0.3);transform:scale(1.02)}.bcg-server.queued{border-color:#fa0;background:rgba(250,160,0,0.2)}.bcg-server.bombed{border-color:#f55;background:rgba(255,50,50,0.2)}.bcg-server.full{opacity:0.5}.bcg-server-name{font-weight:bold;font-size:13px}.bcg-server-players{font-size:11px;color:#888;margin-top:2px}.bcg-server-players.full{color:#f55}.bcg-server-players.busy{color:#fa0}.bcg-server-players.free{color:#5f5}.bcg-btns{display:flex;gap:8px;margin-bottom:10px}.bcg-btn{flex:1;padding:12px;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;color:#fff;transition:all 0.2s}.bcg-btn:hover{transform:scale(1.02);opacity:0.9}.bcg-btn-spam{background:#00b894}.bcg-btn-all{background:#6c5ce7}.bcg-btn-stop{background:#e74c3c}.bcg-btn-refresh{background:#636e72}.bcg-log{background:rgba(0,0,0,0.4);border-radius:8px;padding:10px;height:60px;overflow-y:auto;font-family:monospace;font-size:11px;color:#aaa}.bcg-log div{padding:2px 0}.bcg-queue-bar{background:rgba(0,0,0,0.4);border-radius:8px;height:24px;overflow:hidden;margin-bottom:12px;position:relative}.bcg-queue-fill{height:100%;background:linear-gradient(90deg,#00b894,#55efc4);transition:width 0.3s}.bcg-queue-text{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;text-shadow:0 0 4px rgba(0,0,0,0.5)}.bcg-server-list{max-height:calc(100vh - 200px);overflow-y:auto}.bcg-server-item{background:rgba(30,30,45,0.8);padding:8px 10px;border-radius:8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#fff}.bcg-server-item.has-bots{border-left:3px solid #f55;background:rgba(255,50,50,0.1)}.bcg-server-item.in-queue{border-left:3px solid #fa0;background:rgba(250,160,0,0.1)}.bcg-stop-btn{background:#e74c3c;border:none;color:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px}.bcg-chat{background:rgba(0,0,0,0.3);border-radius:8px;padding:10px}.bcg-chat-textarea{width:100%;height:50px;background:rgba(0,0,0,0.4);border:1px solid rgba(100,100,255,0.2);border-radius:6px;color:#fff;padding:8px;font-size:12px;resize:none}.bcg-chat-controls{display:flex;gap:8px;margin-top:8px;align-items:center}.bcg-chat-toggle{background:#6c5ce7;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px}.bcg-chat-toggle.active{background:#00b894}.bcg-chat-delay{background:rgba(0,0,0,0.4);border:1px solid rgba(100,100,255,0.2);border-radius:6px;color:#fff;padding:6px;width:70px;text-align:center;font-size:12px}.bcg-chat-label{color:#888;font-size:11px}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:rgba(0,0,0,0.2);border-radius:3px}::-webkit-scrollbar-thumb{background:rgba(100,100,255,0.4);border-radius:3px}</style></head><body><div class="bcg-container"><span class="bcg-close" id="closeBtn">×</span><div class="bcg-left"><h1 class="bcg-title">🎮 Lotus Bot Controller</h1><div class="bcg-stats"><div class="bcg-stat"><div class="bcg-stat-value" id="bcgSpammed">0</div><div class="bcg-stat-label">Spammed</div></div><div class="bcg-stat"><div class="bcg-stat-value" id="bcgQueue">0</div><div class="bcg-stat-label">Queue</div></div><div class="bcg-stat"><div class="bcg-stat-value" id="bcgTokens">0</div><div class="bcg-stat-label">Tokens</div></div><div class="bcg-stat"><div class="bcg-stat-value" id="bcgProxies">0</div><div class="bcg-stat-label">Proxies</div></div></div><div class="bcg-queue-bar"><div class="bcg-queue-fill" id="bcgQueueBar"></div><div class="bcg-queue-text" id="bcgQueueText">0/2500</div></div><div class="bcg-section"><div class="bcg-section-title">🎯 Select Servers</div><div class="bcg-servers" id="bcgServers">Loading...</div></div><div class="bcg-section"><div class="bcg-section-title">⚡ Controls</div><div class="bcg-btns"><button class="bcg-btn bcg-btn-spam" id="spamQueueBtn">🚀 Spam Queue</button><button class="bcg-btn bcg-btn-all" id="spamAllBtn">🌍 Spam ALL</button></div><div class="bcg-btns"><button class="bcg-btn bcg-btn-stop" id="stopAllBtn">⛔ Stop All</button><button class="bcg-btn bcg-btn-refresh" id="refreshBtn">🔄 Refresh</button></div></div><div class="bcg-section"><div class="bcg-section-title">💬 Auto Chat</div><div class="bcg-chat"><textarea class="bcg-chat-textarea" id="bcgChatMessages" placeholder="Messages (one per line, max 30 chars)"></textarea><div class="bcg-chat-controls"><button class="bcg-chat-toggle" id="bcgChatToggle">OFF</button><span class="bcg-chat-label">Delay:</span><input type="number" class="bcg-chat-delay" id="bcgChatDelay" value="2000" min="500" step="100"><span class="bcg-chat-label">ms</span></div></div></div><div class="bcg-section"><div class="bcg-section-title">📝 Log</div><div class="bcg-log" id="bcgLog"></div></div></div><div class="bcg-right"><div class="bcg-section"><div class="bcg-section-title">🌐 Server List</div><div class="bcg-server-list" id="bcgServerList"></div></div></div></div><script>const parent=window.parent;document.getElementById('closeBtn').onclick=()=>parent.toggleBotControllerGUI();document.getElementById('spamQueueBtn').onclick=()=>parent.bcgSpamQueue();document.getElementById('spamAllBtn').onclick=()=>parent.bcgSpamAll();document.getElementById('stopAllBtn').onclick=()=>parent.bcgStopAll();document.getElementById('refreshBtn').onclick=()=>{parent.loadBotControllerServers();};document.getElementById('bcgChatToggle').onclick=()=>parent.bcgToggleChat();document.getElementById('bcgChatDelay').onchange=()=>parent.bcgUpdateChat();let chatTimeout;document.getElementById('bcgChatMessages').oninput=()=>{clearTimeout(chatTimeout);chatTimeout=setTimeout(()=>parent.bcgUpdateChat(),500);};<\/script></body></html>`);
    doc.close();

    setTimeout(() => {
        window.loadBotControllerServers();
        window.connectBotControllerWS();
    }, 100);
};

// Chat state
window.bcgChatEnabled = false;

window.bcgToggleChat = () => {
    window.bcgChatEnabled = !window.bcgChatEnabled;
    window.bcgUpdateChat();
};

window.bcgUpdateChat = () => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    const messages = doc.getElementById('bcgChatMessages')?.value || '';
    const delay = parseInt(doc.getElementById('bcgChatDelay')?.value) || 2000;
    window.bcgSend('setChat', { messages, enabled: window.bcgChatEnabled, delay });
};

window.bcgUpdateChatFromWS = (data) => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    window.bcgChatEnabled = data.enabled;
    const btn = doc.getElementById('bcgChatToggle');
    if (btn) {
        btn.textContent = data.enabled ? 'ON' : 'OFF';
        btn.classList.toggle('active', data.enabled);
    }
    const delayInput = doc.getElementById('bcgChatDelay');
    if (delayInput) delayInput.value = data.delay || 2000;
    const textarea = doc.getElementById('bcgChatMessages');
    if (textarea && data.messages && data.messages.length > 0) {
        textarea.value = data.messages.join('\n');
    }
};

window.bcgLog = (msg) => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    const log = doc.getElementById('bcgLog');
    if (log) log.innerHTML = '<div>[' + new Date().toLocaleTimeString() + '] ' + msg + '</div>' + log.innerHTML;
};

// Direct log without timestamp (used for server logs that already have timestamp)
window.bcgLogDirect = (msg) => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    const log = doc.getElementById('bcgLog');
    if (log) log.innerHTML = '<div>' + msg + '</div>' + log.innerHTML;
};

window.updateBotControllerStatusFromWS = (data) => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    if (!doc) return;
    const spammed = doc.getElementById('bcgSpammed');
    const tokens = doc.getElementById('bcgTokens');
    const proxies = doc.getElementById('bcgProxies');
    const queueBar = doc.getElementById('bcgQueueBar');
    const queueText = doc.getElementById('bcgQueueText');
    if (spammed) spammed.textContent = Object.keys(data.servers || {}).length;
    if (tokens) tokens.textContent = data.queueSize || 0;
    if (proxies) proxies.textContent = data.proxiesAvailable || 0;
    const max = data.config?.TOKEN_QUEUE_MAX || 2500;
    const pct = Math.min(100, (data.queueSize / max) * 100);
    if (queueBar) queueBar.style.width = pct + '%';
    if (queueText) queueText.textContent = data.queueSize + '/' + max;
    window.updateBotControllerUI();
};

window.loadBotControllerServers = async () => {
    try {
        const res = await fetch('https://api.moomoo.io/servers', {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', 'Referer': 'https://moomoo.io/' }
        });
        window.botControllerServers = await res.json();
        window.updateBotControllerUI();
    } catch (e) { window.bcgLog('❌ Error loading servers'); }
};

window.updateBotControllerUI = () => {
    if (!window.botControllerIframe) return;
    const doc = window.botControllerIframe.contentDocument || window.botControllerIframe.contentWindow.document;
    const container = doc.getElementById('bcgServers');
    if (!container) return;
    const regions = {};
    window.botControllerServers.forEach(s => {
        if (!regions[s.region]) regions[s.region] = [];
        regions[s.region].push(s);
    });
    const rn = { 'frankfurt': '🇩🇪', 'london': '🇬🇧', 'siliconvalley': '🇺🇸 SV', 'miami': '🇺🇸 MI', 'sydney': '🇦🇺', 'singapore': '🇸🇬' };
    let h = '';
    for (const r in regions) {
        h += '<div class="bcg-region"><div class="bcg-region-title">' + (rn[r] || r) + '</div><div class="bcg-server-cards">';
        regions[r].forEach(s => {
            const cap = s.playerCapacity || 40;
            const p = s.playerCount / cap;
            const f = p >= 1;
            const pc = f ? 'full' : p >= 0.7 ? 'busy' : 'free';
            const b = window.botControllerBots[s.key] || 0;
            const qIdx = window.botControllerQueue.findIndex(q => q.serverKey === s.key);
            const isQueued = qIdx >= 0;
            h += '<div class="bcg-server' + (f ? ' full' : '') + (isQueued ? ' queued' : '') + (b > 0 ? ' bombed' : '') + '" onclick="window.parent.bcgToggleQueue(\'' + s.key + '\',\'' + s.region + '\')">';
            h += '<div class="bcg-server-name">' + s.name + '</div>';
            h += '<div class="bcg-server-players ' + pc + '">' + s.playerCount + '/' + cap + '</div>';
            h += '</div>';
        });
        h += '</div></div>';
    }
    container.innerHTML = h;
    doc.getElementById('bcgQueue').textContent = window.botControllerQueue.length;

    const list = doc.getElementById('bcgServerList');
    if (list) {
        let listHtml = '';
        // First show bombed servers
        window.botControllerServers.forEach(s => {
            const b = window.botControllerBots[s.key] || 0;
            if (b > 0) {
                const cap = s.playerCapacity || 40;
                listHtml += '<div class="bcg-server-item has-bots"><div><b>' + s.name + '</b><br><span style="color:#666;font-size:10px">' + s.region + ' • 💣 ' + b + ' bots</span></div><div><button class="bcg-stop-btn" onclick="window.parent.bcgStopServer(\'' + s.key + '\')">Stop</button></div></div>';
            }
        });
        // Then show queued servers
        window.botControllerQueue.forEach(q => {
            const s = window.botControllerServers.find(srv => srv.key === q.serverKey);
            if (s && !window.botControllerBots[s.key]) {
                listHtml += '<div class="bcg-server-item in-queue"><div><b>' + s.name + '</b><br><span style="color:#666;font-size:10px">' + s.region + ' • ⏳ In Queue</span></div></div>';
            }
        });
        if (!listHtml) {
            listHtml = '<div style="text-align:center;color:#666;padding:20px">No active servers</div>';
        }
        list.innerHTML = listHtml;
    }
};

window.bcgToggleQueue = (key, region) => {
    const b = window.botControllerBots[key] || 0;
    if (b > 0) { return; } // Already bombed, server will reject
    // Send to server via WebSocket - server will broadcast to all clients
    window.bcgSend('toggleQueue', { serverKey: key, region });
};

window.bcgSpamQueue = async () => {
    if (window.botControllerQueue.length === 0) { return; }
    try {
        await fetch('https://o6zptdi2mza0l3sdhh2gr89q-production.up.railway.app/spam-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Server uses shared queue
        });
        // Server will clear queue and broadcast
    } catch (e) { }
};

window.bcgSpamAll = async () => {
    try {
        await fetch('https://o6zptdi2mza0l3sdhh2gr89q-production.up.railway.app/spam-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    } catch (e) { }
};

window.bcgStopAll = async () => {
    try {
        await fetch('https://o6zptdi2mza0l3sdhh2gr89q-production.up.railway.app/stop', { method: 'POST' });
        window.loadBotControllerServers();
    } catch (e) { }
};

window.bcgStopServer = async (key) => {
    try {
        await fetch('https://o6zptdi2mza0l3sdhh2gr89q-production.up.railway.app/stop-server', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverKey: key })
        });
        window.loadBotControllerServers();
    } catch (e) { }
};

// PAKCETS AND WS:
let WS = undefined;
let socketID = undefined;
let secPacket = 0;
let secMax = 120;
let secTime = 1000;
let legit = false;
let firstSend = {
    sec: false
};
let game = {
    tick: 0,
    tickQueue: [],
    tickBase: function (set, tick) {
        if (this.tickQueue[this.tick + tick]) {
            this.tickQueue[this.tick + tick].push(set);
        } else {
            this.tickQueue[this.tick + tick] = [set];
        }
    },
    tickRate: 1000 / config.serverUpdateRate,
    tickSpeed: 0,
    lastTick: performance.now()
};
let modConsole = [];
function validID(id, Default, arr) {
    const num = +id;
    if (Number.isInteger(num) && String(num) === String(id) && (!arr || arr.length > num)) {
        return num;
    } else if (Default === undefined) {
        return "NaN";
    } else {
        return Default;
    }
}
let dontSend = false;
let fpsTimer = {
    last: 0,
    time: 0,
    ltime: 0
};
let lastMoveDir = undefined;
let lastsp = ["cc", 1, "__proto__"];
let aiAutoPlace = false;
let autoTpShitAi = false;
let boostType = "evee";
WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function (message) {
    // Check if WebSocket is open before sending
    if (this.readyState !== WebSocket.OPEN) {
        return;
    }
    if (!WS) {
        WS = this;
        WS.addEventListener("message", function (msg) {
            getMessage(msg);
        });
        WS.addEventListener("close", event => {
            if (event.code == 4001) {
                window.location.reload();
            }
        });
    }
    if (WS == this) {
        dontSend = false;

        // EXTRACT DATA ARRAY:
        let data = new Uint8Array(message);
        let parsed = window.msgpack.decode(data);
        let type = parsed[0];
        data = parsed[1];

        // SEND MESSAGE:
        if (type == "6") {
            if (data[0]) {
                let message = data[0];
                if (message == ".fl") {
                    game.tickBase(() => {
                        packet("6", friendList.join(), "settings");
                    }, 6);
                } else if (message.startsWith(".remove -friend -")) {
                    let a = validID(message.replace(".remove -friend -", ""), null);
                    if (typeof a === "number" && friendList.includes(a)) {
                        friendList.splice(friendList.indexOf(a));
                        game.tickBase(() => {
                            packet("6", a + " Removed From Friendlist.", "settings");
                        }, 6);
                    } else {
                        game.tickBase(() => {
                            packet("6", "\"" + message.replace(".fl -r -", "") + "\" is not a number.", "settings");
                        }, 6);
                    }
                }
                if (message.startsWith(".add -friend -")) {
                    let a = Number(message.replace(".add -friend -", ""));
                    if (!Number.isNaN(a) && Number.isInteger(a) && a > 0 && a <= 50) {
                        let as = findPlayerBySID(a);
                        friendList.push(a);
                        game.tickBase(() => {
                            packet("6", (as?.name?.length <= 9 ? as.name : a) + " Added To Friendlist.", "settings");
                        }, 6);
                    } else {
                        game.tickBase(() => {
                            packet("6", "\"" + message.replace(".fl -a -", "") + "\" is not a number.", "settings");
                        }, 6);
                    }
                }
                if (message.startsWith(".a -")) {
                    let mode = message.replace(".a -", "");
                    if (mode === "evee" || mode === "2018") {
                        if (boostType === mode) {
                            boostType = null;
                        } else {
                            boostType = mode;
                        }
                        game.tickBase(() => {
                            packet("6", `BoostType: ${boostType ? boostType : "Disabled"}`, "settings");
                        }, 6);
                    }
                }
                if (message == ".a -aip" || message == ".a -pi") {
                    // cheatEnable
                    let a;
                    aiAutoPlace = !aiAutoPlace;
                    game.tickBase(() => {
                        packet("6", `ai AutoPlace ${aiAutoPlace ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a -leg" || message == ".a -le") {
                    // legit
                    let a;
                    legit = !legit;
                    game.tickBase(() => {
                        packet("6", `LegitMode ${legit ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a -tpa" || message == ".a -tp") {
                    // cheatEnable
                    let a;
                    autoTpShitAi = !autoTpShitAi;
                    game.tickBase(() => {
                        packet("6", `ai AutoTP ${autoTpShitAi ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a -ap" || message == ".a -place") {
                    // cheatEnable
                    let a;
                    configs.autoPlace = !configs.autoPlace;
                    game.tickBase(() => {
                        packet("6", `autoPlace ${configs.autoPlace ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a -fr" || message == ".a -frame") {
                    // cheatEnable
                    let a;
                    framer = !framer;
                    game.tickBase(() => {
                        packet("6", `frame ${framer ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a" || data[0].startsWith(".") && message != "." && message != "...") {
                    dontSend = true;
                }
                if (message == ".a" || data[0].startsWith(".") && message != "." && message != "...") {
                    dontSend = true;
                }
                if (message == ".a -rp" || message == ".a -rep") {
                    // cheatEnable
                    let a;
                    configs.autoReplace = !configs.autoReplace;
                    game.tickBase(() => {
                        packet("6", `autoReplace ${configs.autoReplace ? "Enabled." : "Disabled."}`, "settings");
                    }, 6);
                }
                if (message == ".a -fill" || message == ".a -fillmenu") {
                    window.toggleBotControllerGUI();
                    dontSend = true;
                }
                // ANTI PROFANITY:
                let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
                let tmpString;
                profanity.forEach(profany => {
                    if (data[0].indexOf(profany) > -1) {
                        tmpString = "";
                        for (let i = 0; i < profany.length; ++i) {
                            if (i == 1) {
                                tmpString += String.fromCharCode(0);
                            }
                            tmpString += profany[i];
                        }
                        let re = new RegExp(profany, "g");
                        data[0] = data[0].replace(re, tmpString);
                    }
                });

                // FIX CHAT:
                data[0] = data[0].slice(0, 30);
            }
        } else if (type == "L") {
            // MAKE SAME CLAN:
            data[0] = data[0] + String.fromCharCode(0).repeat(7);
            data[0] = data[0].slice(0, 7);
        } else if (type == "M") {
            // APPLY CYAN COLOR:
            data[0].name = data[0].name == "" ? "unknown" : data[0].name;
            data[0].moofoll = true;
            data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
            lastsp = [data[0].name, data[0].moofoll, data[0].skin];
        } else if (type == "D") {
            if (my.lastDir == data[0] || [null, undefined].includes(data[0])) {
                dontSend = true;
            } else {
                my.lastDir = data[0];
            }
        } else if (type == "F") {
            if (!data[2]) {
                dontSend = true;
            } else if (![null, undefined].includes(data[1])) {
                my.lastDir = data[1];
            }
        } else if (type == "K") {
            if (!data[1]) {
                dontSend = true;
            }
        } else if (type == "S") {
            instaC.wait = !instaC.wait;
            dontSend = true;
        } else if (type == "9") {
            if (data[1]) {
                if (player.moveDir == data[0]) {
                    dontSend = true;
                }
                player.moveDir = data[0];
            } else {
                dontSend = true;
            }
        }
        if (!dontSend) {
            let binary = window.msgpack.encode([type, data]);
            this.nsend(binary);

            // START COUNT:
            if (!firstSend.sec) {
                firstSend.sec = true;
                setTimeout(() => {
                    firstSend.sec = false;
                    secPacket = 0;
                }, secTime);
            }
            if (secPacket == 100) { }
            secPacket++;
        }
    } else {
        this.nsend(message);
    }
};
function packet(type) {
    // EXTRACT DATA ARRAY:
    let data = Array.prototype.slice.call(arguments, 1);

    // SEND MESSAGE:
    let binary = window.msgpack.encode([type, data]);
    WS.send(binary);
}
let io = {
    send: packet
};
function getMessage(message) {
    let data = new Uint8Array(message.data);
    let parsed = window.msgpack.decode(data);
    let type = parsed[0];
    data = parsed[1];
    let events = {
        A: setInitData,
        C: setupGame,
        D: addPlayer,
        E: removePlayer,
        a: updatePlayers,
        G: updateLeaderboard,
        H: loadGameObject,
        I: loadAI,
        J: animateAI,
        K: gatherAnimation,
        L: wiggleGameObject,
        M: shootTurret,
        N: updatePlayerValue,
        O: updateHealth,
        P: killPlayer,
        Q: killObject,
        R: killObjects,
        S: updateItemCounts,
        T: updateAge,
        U: updateUpgrades,
        V: updateItems,
        X: addProjectile,
        2: allianceNotification,
        3: setPlayerTeam,
        4: setAlliancePlayers,
        5: updateStoreItems,
        6: receiveChat,
        7: updateMinimap,
        8: showText,
        9: pingMap,
        0: pingSocketResponse
    };
    if (type == "io-init") {
        socketID = data[0];
    } else if (events[type]) {
        events[type].apply(undefined, data);
    }
}

// GLOBAL VALUES:
function resetMoveDir() {
    keys = {};
    packet("e");
}
let allChats = [];
let ticks = {
    tick: 0,
    delay: 0,
    time: [],
    manage: []
};
let ais = [];
let players = [];
let alliances = [];
let danger = [];
let alliancePlayers = [];
let allianceNotifications = [];
let gameObjects = [];
let trapBreaked = false;
let trapBreakedTick = 0;
let liztobj = [];
let projectiles = [];
let deadPlayers = [];
let loopIndex = 0;
let loopHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];
let LoopPolice = 0;
let policeHats = [8, 15];
let player;
let playerSID;
let tmpObj;
let enemy = [];
let nears = [];
let near = [];
let musketSync = false;
let my = {
    reloaded: false,
    waitHit: 0,
    autoAim: false,
    revAim: false,
    ageInsta: true,
    reSync: false,
    bullTick: true,
    anti0Tick: 0,
    antiSync: false,
    safePrimary: function (tmpObj) {
        return [0, 8].includes(tmpObj.primaryIndex);
    },
    safeSecondary: function (tmpObj) {
        return [10, 11, 14].includes(tmpObj.secondaryIndex);
    },
    lastDir: 0,
    predictSpikes: 0,
    antiInsta: false
};

// FIND OBJECTS BY ID/SID:
function findID(tmpObj, tmp) {
    return tmpObj.find(THIS => THIS.id == tmp);
}
function findSID(tmpObj, tmp) {
    return tmpObj.find(THIS => THIS.sid == tmp);
}
function findPlayerByID(id) {
    return findID(players, id);
}
function findPlayerBySID(sid) {
    return findSID(players, sid);
}
function findAIBySID(sid) {
    return findSID(ais, sid);
}
function findObjectBySid(sid) {
    return findSID(gameObjects, sid);
}
function findProjectileBySid(sid) {
    return findSID(gameObjects, sid);
}
let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();
let chatButton = getEl("chatButton");
chatButton.remove();
let gameCanvas = getEl("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
let mapDisplay = getEl("mapDisplay");
let mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
let storeMenu = getEl("storeMenu");
let enterGame = getEl("enterGame");
let linksContainer = getEl("linksContainer2");
linksContainer.remove();
let partyButton = getEl("partyButton");
partyButton.remove();
let joinPartyButton = getEl("joinPartyButton");
joinPartyButton.remove();
let gameName = getEl("gameName");
let mainMenu = getEl("mainMenu");
let storeHolder = getEl("storeHolder");
let upgradeHolder = getEl("upgradeHolder");
let upgradeCounter = getEl("upgradeCounter");
let chatBox = getEl("chatBox");
chatBox.autocomplete = "off";
chatBox.style.textAlign = "center";
chatBox.style.width = "18em";
let chatHolder = getEl("chatHolder");
let actionBar = getEl("actionBar");
let leaderboardData = getEl("leaderboardData");
let itemInfoHolder = getEl("itemInfoHolder");
itemInfoHolder.remove();
let menuCardHolder = getEl("menuCardHolder");
let diedText = getEl("diedText");
let screenWidth;
let screenHeight;
let maxScreenWidth = config.maxScreenWidth;
let maxScreenHeight = config.maxScreenHeight;
let pixelDensity = 1;
let delta;
let now;
let lastUpdate = performance.now();
let camX;
let camY;
let tmpDir;
let mouseX = 0;
let mouseY = 0;
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;
let outlineColor = "#525252";
let darkOutlineColor = "#3d3f42";
let outlineWidth = 5.5;

// REMOVE UIS:
[/*AD: */"#adCard", /*"#promoImgHolder",*/".fc-ccpa-root", "#wideAdCard", "#pre-content-container", "#videoad", "#ot-sdk-btn-floating"
    ///*gameUIS: */ "#chatButton", "#leaderboardButton", "#itemInfoHolder", "#resDisplay", "#ageText", "#ageBarContainer",
].forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
});
const setupCard = getEl("setupCard");

// ALTCHA BYPASS:
let altcha = document.getElementById("altcha");
let checkbox = document.getElementById("altcha_checkbox");
let verifying = false;
let token = null;
enterGame.classList.add("disabled");
enterGame.style.color = "#CCC";
enterGame.style.backgroundColor = "#666";
enterGame.style.pointerEvents = "none";
window.addEventListener("load", () => {
    enterGame.textContent = "Generate...";
    const handleStateChange = e => {
        if (e?.detail?.state === "verified") {
            token = e.detail.payload;
            enterGame.textContent = "Enter Game";
            enterGame.classList.remove("disabled");
            enterGame.style.color = "";
            enterGame.style.backgroundColor = "";
            enterGame.style.pointerEvents = "auto";
            clearInterval(intervalId);
        }
    };
    const checkAltcha = () => {
        if (token) {
            return;
        }
        if (enterGame.classList.contains("disabled") && !verifying) {
            verifying = true;
            altcha.style.display = "none";
            checkbox.click();
            setTimeout(() => {
                verifying = false;
            }, 1000);
        } else if (!enterGame.classList.contains("disabled")) {
            enterGame.textContent = "Enter Game";
        }
    };
    altcha.addEventListener("statechange", handleStateChange);
    const intervalId = setInterval(checkAltcha, 1000);
});
let firstSetup = true;
let keys = {};
let moveKeys = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0]
};
let attackState = 0;
let inGame = false;
let macro = {};
let mills = {
    place: 0,
    placeSpawnPads: 0
};
let lastDir;
let lastLeaderboardData = [];
var omgRealPinggg;
var awdwdwd = window.pingTime || 90;
function getRealisticPing() {
    let variation = Math.random() * 25 - 12.5;
    awdwdwd += variation;
    awdwdwd = Math.max(50, Math.min(250, awdwdwd));
    if (Math.random() < 0.05) {
        awdwdwd += Math.random() * 50;
    }
    return Math.round(awdwdwd);
}
function calculateStuff(values) {
    if (!Array.isArray(values) || values.length === 0) {
        return 0;
    }
    let sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
        return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
    } else {
        return sortedValues[mid];
    }
}
let ms = {
    min: NaN,
    max: NaN,
    avg: 0,
    count: 0,
    total: 0,
    history: []
};
let fpsHistory = [];
let fpsMin = 0;
let fpsMax = 0;
let tpsHistory = [];
let tpsMin = 0;
let tpsMax = 0;
let cpsHistory = [];
let cpsMin = 0;
let cpsMax = 0;
let secPacketsHistory = [];
let dangerAids = 0;
function pingSocketResponse() {
    const pingDisplay = document.getElementById("pingDisplay");
    let pingTime = Number(window.pingTime.toFixed(3));
    if (isNaN(ms.min) || pingTime < ms.min) {
        ms.min = pingTime;
    }
    if (isNaN(ms.max) || pingTime > ms.max) {
        ms.max = pingTime;
    }
    ms.total += pingTime;
    ms.count++;
    ms.avg = Number((ms.total / ms.count).toFixed(3));
    ms.history.push(pingTime);
    if (ms.history.length > 30) {
        ms.history.shift();
    }
    let rollingAvg = Number((ms.history.reduce((a, b) => a + b, 0) / ms.history.length).toFixed(3));
    let fps = Math.floor(fpsTimer.ltime);
    fpsHistory.push(fps);
    if (fpsHistory.length > 30) {
        fpsHistory.shift();
    }
    fpsMin = Math.min(...fpsHistory);
    fpsMax = Math.max(...fpsHistory);
    let tps = inGame ? game.tickRate || 20 : 0;
    tpsHistory.push(tps);
    if (tpsHistory.length > 30) {
        tpsHistory.shift();
    }
    tpsMin = Math.min(...tpsHistory);
    tpsMax = Math.max(...tpsHistory);
    let packets = secPacket || 0;
    secPacketsHistory.push(packets);
    if (secPacketsHistory.length > 30) {
        secPacketsHistory.shift();
    }
    let packetsAvg = Number((secPacketsHistory.reduce((a, b) => a + b, 0) / secPacketsHistory.length).toFixed(2));
    pingDisplay.innerText = `Ping: ${pingTime} | Avg: ${ms.avg} | Min: ${ms.min} | Max: ${ms.max} | FPS: ${fps} | danger: ${dangerAids} | Packets: ${packets} | Packet Avg:${packetsAvg}`;
}
let placeVisible = [];

/** CLASS CODES */

class Utils {
    constructor() {
        // MATH UTILS:
        let mathABS = Math.abs;
        let mathCOS = Math.cos;
        let mathSIN = Math.sin;
        let mathPOW = Math.pow;
        let mathSQRT = Math.sqrt;
        let mathATAN2 = Math.atan2;
        let mathPI = Math.PI;
        let _this = this;

        // GLOBAL UTILS:
        this.round = function (n, v) {
            return Math.round(n * v) / v;
        };
        this.toRad = function (angle) {
            return angle * (mathPI / 180);
        };
        this.toAng = function (radian) {
            return radian / (mathPI / 180);
        };
        this.randInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.randFloat = function (min, max) {
            return Math.random() * (max - min + 1) + min;
        };
        this.lerp = function (value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        };
        this.decel = function (val, cel) {
            if (val > 0) {
                val = Math.max(0, val - cel);
            } else if (val < 0) {
                val = Math.min(0, val + cel);
            }
            return val;
        };
        this.getDistance = function (x1, y1, x2, y2) {
            return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
        };
        this.getDist = function (tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3
            };
            return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
        };
        this.randomAngle = function (e) {
            let t = random() * Math.PI * 2;
            if (e !== undefined) {
                const spread = Math.PI;
                t = e + (random() * 2 - 1) * spread;
            }
            t = t % (Math.PI * 2);
            if (t < 0) {
                t += Math.PI * 2;
            }
            return t;
        };
        this.getDirection = function (x1, y1, x2, y2) {
            return mathATAN2(y1 - y2, x1 - x2);
        };
        this.getDirect = function (tmp1, tmp2, type1, type2) {
            let tmpXY1 = {
                x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3
            };
            let tmpXY2 = {
                x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3
            };
            return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
        };
        this.getAngle = function (pointA, pointB) {
            return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
        };
        this.getAngleDist = function (a, b) {
            let p = mathABS(b - a) % (mathPI * 2);
            if (p > mathPI) {
                return mathPI * 2 - p;
            } else {
                return p;
            }
        };
        this.isNumber = function (n) {
            return typeof n == "number" && !isNaN(n) && isFinite(n);
        };
        this.isString = function (s) {
            return s && typeof s == "string";
        };
        this.kFormat = function (num) {
            if (num > 999) {
                return (num / 1000).toFixed(1) + "k";
            } else {
                return num;
            }
        };
        this.sFormat = function (num) {
            let fixs = [{
                num: 1000,
                string: "k"
            }, {
                num: 1000000,
                string: "m"
            }, {
                num: 1000000000,
                string: "b"
            }, {
                num: 1000000000000,
                string: "q"
            }].reverse();
            let sp = fixs.find(v => num >= v.num);
            if (!sp) {
                return num;
            }
            return (num / sp.num).toFixed(1) + sp.string;
        };
        this.capitalizeFirst = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        this.fixTo = function (n, v) {
            return parseFloat(n.toFixed(v));
        };
        this.sortByPoints = function (a, b) {
            return parseFloat(b.points) - parseFloat(a.points);
        };
        this.lineInRect = function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
            let minX = x1;
            let maxX = x2;
            if (x1 > x2) {
                minX = x2;
                maxX = x1;
            }
            if (maxX > recX2) {
                maxX = recX2;
            }
            if (minX < recX) {
                minX = recX;
            }
            if (minX > maxX) {
                return false;
            }
            let minY = y1;
            let maxY = y2;
            let dx = x2 - x1;
            if (Math.abs(dx) > 1e-7) {
                let a = (y2 - y1) / dx;
                let b = y1 - a * x1;
                minY = a * minX + b;
                maxY = a * maxX + b;
            }
            if (minY > maxY) {
                let tmp = maxY;
                maxY = minY;
                minY = tmp;
            }
            if (maxY > recY2) {
                maxY = recY2;
            }
            if (minY < recY) {
                minY = recY;
            }
            if (minY > maxY) {
                return false;
            }
            return true;
        };
        this.containsPoint = function (element, x, y) {
            let bounds = element.getBoundingClientRect();
            let left = bounds.left + window.scrollX;
            let top = bounds.top + window.scrollY;
            let width = bounds.width;
            let height = bounds.height;
            let insideHorizontal = x > left && x < left + width;
            let insideVertical = y > top && y < top + height;
            return insideHorizontal && insideVertical;
        };
        this.mousifyTouchEvent = function (event) {
            let touch = event.changedTouches[0];
            event.screenX = touch.screenX;
            event.screenY = touch.screenY;
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        };
        this.hookTouchEvents = function (element, skipPrevent) {
            let preventDefault = !skipPrevent;
            let isHovering = false;
            // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
            let passive = false;
            element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
            element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
            element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
            element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);
            function touchStart(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (element.onmouseover) {
                    element.onmouseover(e);
                }
                isHovering = true;
            }
            function touchMove(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (_this.containsPoint(element, e.pageX, e.pageY)) {
                    if (!isHovering) {
                        if (element.onmouseover) {
                            element.onmouseover(e);
                        }
                        isHovering = true;
                    }
                } else if (isHovering) {
                    if (element.onmouseout) {
                        element.onmouseout(e);
                    }
                    isHovering = false;
                }
            }
            function touchEnd(e) {
                _this.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (isHovering) {
                    if (element.onclick) {
                        element.onclick(e);
                    }
                    if (element.onmouseout) {
                        element.onmouseout(e);
                    }
                    isHovering = false;
                }
            }
        };
        this.removeAllChildren = function (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        };
        this.generateElement = function (config) {
            let element = document.createElement(config.tag || "div");
            function bind(configValue, elementValue) {
                if (config[configValue]) {
                    element[elementValue] = config[configValue];
                }
            }
            bind("text", "textContent");
            bind("html", "innerHTML");
            bind("class", "className");
            for (let key in config) {
                switch (key) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                element[key] = config[key];
            }
            if (element.onclick) {
                element.onclick = this.checkTrusted(element.onclick);
            }
            if (element.onmouseover) {
                element.onmouseover = this.checkTrusted(element.onmouseover);
            }
            if (element.onmouseout) {
                element.onmouseout = this.checkTrusted(element.onmouseout);
            }
            if (config.style) {
                element.style.cssText = config.style;
            }
            if (config.hookTouch) {
                this.hookTouchEvents(element);
            }
            if (config.parent) {
                config.parent.appendChild(element);
            }
            if (config.children) {
                for (let i = 0; i < config.children.length; i++) {
                    element.appendChild(config.children[i]);
                }
            }
            return element;
        };
        this.checkTrusted = function (callback) {
            return function (ev) {
                if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                    callback(ev);
                } else {
                    //console.error("Event is not trusted.", ev);
                }
            };
        };
        this.randomString = function (length) {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        this.countInArray = function (array, val) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i] === val) {
                    count++;
                }
            }
            return count;
        };
        this.hexToRgb = function (hex) {
            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
        };
        this.getRgb = function (r, g, b) {
            return [r / 255, g / 255, b / 255].join(", ");
        };
    }
}
;
class Animtext {
    constructor() {
        // INIT
        this.init = function (x, y, scale, speed, life, text, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.scale = scale;
            this.startScale = scale;
            this.maxScale = scale * 1.5;
            this.scaleSpeed = 0.7;
            this.speed = speed;
            this.life = life;
            this.startLife = life;
            this.text = text;
            this.randomX = Math.floor(Math.random() * 2);
            this.moveSpeed = 10;
        };

        // UPDATE
        this.update = function (delta) {
            if (this.life > 0) {
                this.life -= delta;
                this.y -= this.speed * delta;
                this.scale += this.scaleSpeed * delta;
                if (this.scale >= this.maxScale) {
                    this.scale = this.maxScale;
                    this.scaleSpeed *= -1;
                } else if (this.scale <= this.startScale) {
                    this.scale = this.startScale;
                    this.scaleSpeed = 0;
                }
                if (this.life < 0) {
                    this.life = 0;
                }
            }
        };

        // RENDER
        this.render = function (ctxt, xOff, yOff, value) {
            if (this.life <= 0) {
                return;
            }
            const alpha = Math.max(0, this.life / this.startLife);
            ctxt.globalAlpha = alpha;
            ctxt.fillStyle = this.color;
            ctxt.font = this.scale + "px Hammersmith One";
            ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
            ctxt.globalAlpha = 1;
        };
    }
}
class Textmanager {
    // TEXT MANAGER:
    constructor() {
        this.texts = [];
        this.stack = [];

        // UPDATE:
        this.update = function (delta, ctxt, xOff, yOff) {
            ctxt.textBaseline = "middle";
            ctxt.textAlign = "center";
            for (let i = 0; i < this.texts.length; ++i) {
                if (this.texts[i].life) {
                    this.texts[i].update(delta);
                    this.texts[i].render(ctxt, xOff, yOff);
                }
            }
        };

        // SHOW TEXT:
        this.showText = function (x, y, scale, speed, life, text, color) {
            let tmpText;
            for (let i = 0; i < this.texts.length; ++i) {
                if (!this.texts[i].life) {
                    tmpText = this.texts[i];
                    break;
                }
            }
            if (!tmpText) {
                tmpText = new Animtext();
                this.texts.push(tmpText);
            }
            tmpText.init(x, y, scale, speed, life, text, color);
        };
    }
}
class GameObject {
    constructor(sid) {
        this.sid = sid;

        // INIT:
        this.init = function (x, y, dir, scale, type, data, owner) {
            data = data || {};
            this.sentTo = {};
            this.gridLocations = [];
            this.active = true;
            this.render = true;
            this.doUpdate = data.doUpdate;
            this.x = x;
            this.y = y;
            this.realScale = this.type <= 1 && this.type !== null ? this.scale * 0.6 : this.scale;
            this.dir = dir;
            this.lastDir = dir;
            this.xWiggle = 0;
            this.yWiggle = 0;
            this.visScale = scale;
            this.scale = scale;
            this.type = type;
            this.id = data.id;
            this.owner = owner;
            this.name = data.name;
            this.isItem = this.id != undefined;
            this.group = data.group;
            this.maxHealth = data.health;
            this.health = this.maxHealth;
            this.layer = 2;
            if (this.group != undefined) {
                this.layer = this.group.layer;
            } else if (this.type == 0) {
                this.layer = 3;
            } else if (this.type == 2) {
                this.layer = 0;
            } else if (this.type == 4) {
                this.layer = -1;
            }
            this.colDiv = data.colDiv || 1;
            this.blocker = data.blocker;
            this.ignoreCollision = data.ignoreCollision;
            this.dontGather = data.dontGather;
            this.hideFromEnemy = data.hideFromEnemy;
            this.friction = data.friction;
            this.projDmg = data.projDmg;
            this.dmg = data.dmg;
            this.pDmg = data.pDmg;
            this.pps = data.pps;
            this.zIndex = data.zIndex || 0;
            this.turnSpeed = data.turnSpeed;
            this.req = data.req;
            this.trap = data.trap;
            this.healCol = data.healCol;
            this.teleport = data.teleport;
            this.boostSpeed = data.boostSpeed;
            this.projectile = data.projectile;
            this.shootRange = data.shootRange;
            this.shootRate = data.shootRate;
            this.shootCount = this.shootRate;
            this.assumeBreak = false;
            this.spawnPoint = data.spawnPoint;
            this.onNear = 0;
            this.breakObj = false;
            this.alpha = data.alpha || 1;
            this.maxAlpha = data.alpha || 1;
            this.damaged = 0;
        };

        // GET HIT:
        this.changeHealth = function (amount, doer) {
            this.health += amount;
            return this.health <= 100;
        };

        // GET SCALE:
        this.getScale = function (sM, ig) {
            sM = sM || 1;
            return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : sM * 0.6) * (ig ? 1 : this.colDiv);
        };
        this.GS = function () {
            return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ? 1 : 0.6) * this.colDiv + (((this.type == 1 && this.y >= config.mapScale - config.snowBiomeTop) || this.teleport || (this.isEnemy && (this.trap || this.dmg))) ? 35 + player.maxSpeed / 1.5 : 0);
        };
        // VISIBLE TO PLAYER:
        this.visibleToPlayer = function (player) {
            return !this.hideFromEnemy || this.owner && (this.owner == player || this.owner.team && player.team == this.owner.team);
        };

        // UPDATE:
        this.update = function (delta) {
            if (this.active) {
                if (this.xWiggle) {
                    this.xWiggle *= Math.pow(0.99, delta);
                }
                if (this.yWiggle) {
                    this.yWiggle *= Math.pow(0.99, delta);
                }
                if (this.turnSpeed && this.name === "spinning spikes") {
                    // for spinning shitty
                    this.dir += delta * 0.0005;
                }
            } else if (this.alive) {
                this.alpha -= delta / (200 / this.maxAlpha);
                this.visScale += delta / (this.scale / 2.5);
                if (this.alpha <= 0) {
                    this.alpha = 0;
                    this.alive = false;
                }
            }
        };

        // CHECK TEAM:
        this.isTeamObject = function (tmpObj) {
            if (this.owner == null) {
                return true;
            } else {
                return this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid);
            }
        };
    }
}
class Items {
    constructor() {
        // ITEM GROUPS:
        this.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: true,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: true,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: true,
            limit: 7,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: true,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: true,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: true,
            limit: 12,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: true,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: true,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: true,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: true,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: true,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: true,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: true,
            limit: 2,
            layer: -1
        }];

        // PROJECTILES:
        this.projectiles = [{
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 25,
            speed: 1.6,
            scale: 103,
            range: 1000
        }, {
            indx: 1,
            layer: 1,
            dmg: 25,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 35,
            speed: 2.5,
            scale: 103,
            range: 1200
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 30,
            speed: 2,
            scale: 103,
            range: 1200
        }, {
            indx: 1,
            layer: 1,
            dmg: 16,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "bullet_1",
            dmg: 50,
            speed: 3.6,
            scale: 160,
            range: 1400
        }];

        // WEAPONS:
        this.weapons = [{
            id: 0,
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources",
            src: "hammer_1",
            length: 140,
            width: 140,
            xOff: -3,
            yOff: 18,
            dmg: 25,
            range: 65,
            gather: 1,
            speed: 300
        }, {
            id: 1,
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate",
            src: "axe_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 30,
            spdMult: 1,
            range: 70,
            gather: 2,
            speed: 400
        }, {
            id: 2,
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources",
            src: "great_axe_1",
            length: 140,
            width: 140,
            xOff: -8,
            yOff: 25,
            dmg: 35,
            spdMult: 1,
            range: 75,
            gather: 4,
            speed: 400
        }, {
            id: 3,
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed",
            src: "sword_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 46,
            dmg: 35,
            spdMult: 0.85,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 4,
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage",
            src: "samurai_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 59,
            dmg: 40,
            spdMult: 0.8,
            range: 118,
            gather: 1,
            speed: 300
        }, {
            id: 5,
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon",
            src: "spear_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 45,
            knock: 0.2,
            spdMult: 0.82,
            range: 142,
            gather: 1,
            speed: 700
        }, {
            id: 6,
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon",
            src: "bat_1",
            iPad: 1.3,
            length: 110,
            width: 180,
            xOff: -8,
            yOff: 53,
            dmg: 20,
            knock: 0.7,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 7,
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon",
            src: "dagger_1",
            iPad: 0.8,
            length: 110,
            width: 110,
            xOff: 18,
            yOff: 0,
            dmg: 20,
            knock: 0.1,
            range: 65,
            gather: 1,
            hitSlow: 0.1,
            spdMult: 1.13,
            speed: 100
        }, {
            id: 8,
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak",
            src: "stick_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 1,
            spdMult: 1,
            range: 70,
            gather: 7,
            speed: 400
        }, {
            id: 9,
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            src: "bow_1",
            req: ["wood", 4],
            length: 120,
            width: 120,
            xOff: -6,
            yOff: 0,
            Pdmg: 25,
            projectile: 0,
            spdMult: 0.75,
            speed: 600
        }, {
            id: 10,
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures",
            src: "great_hammer_1",
            length: 140,
            width: 140,
            xOff: -9,
            yOff: 25,
            dmg: 10,
            Pdmg: 10,
            spdMult: 0.88,
            range: 75,
            sDmg: 7.5,
            gather: 1,
            speed: 400
        }, {
            id: 11,
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage",
            src: "shield_1",
            length: 120,
            width: 120,
            shield: 0.2,
            xOff: 6,
            yOff: 0,
            Pdmg: 0,
            spdMult: 0.7
        }, {
            id: 12,
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            src: "crossbow_1",
            req: ["wood", 5],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 35,
            projectile: 2,
            spdMult: 0.7,
            speed: 700
        }, {
            id: 13,
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            src: "crossbow_2",
            req: ["wood", 10],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 30,
            projectile: 3,
            spdMult: 0.7,
            speed: 230
        }, {
            id: 14,
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies",
            src: "grab_1",
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 0,
            Pdmg: 0,
            steal: 250,
            knock: 0.2,
            spdMult: 1.05,
            range: 125,
            gather: 0,
            speed: 700
        }, {
            id: 15,
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            src: "musket_1",
            req: ["stone", 10],
            aboveHand: true,
            rec: 0.35,
            armS: 0.6,
            hndS: 0.3,
            hndD: 1.6,
            length: 205,
            width: 205,
            xOff: 25,
            yOff: 0,
            Pdmg: 50,
            projectile: 5,
            hideProjectile: true,
            spdMult: 0.6,
            speed: 1500
        }];

        // ITEMS:
        this.list = [{
            group: this.groups[0],
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10],
            consume: function (doer) {
                return doer.changeHealth(20, doer);
            },
            scale: 22,
            holdOffset: 15,
            healing: 20,
            itemID: 0,
            itemAID: 16
        }, {
            age: 3,
            group: this.groups[0],
            name: "apple",
            desc: "restores 40 health when consumed",
            req: ["food", 15],
            consume: function (doer) {
                return doer.changeHealth(40, doer);
            },
            scale: 27,
            holdOffset: 15,
            healing: 40,
            itemID: 1,
            itemAID: 17
        }, {
            age: 7,
            group: this.groups[0],
            name: "apple",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25],
            consume: function (doer) {
                if (doer.changeHealth(30, doer) || doer.health < 100) {
                    doer.dmgOverTime.dmg = -10;
                    doer.dmgOverTime.doer = doer;
                    doer.dmgOverTime.time = 5;
                    return true;
                }
                return false;
            },
            scale: 27,
            holdOffset: 15,
            healing: 30,
            itemID: 2,
            itemAID: 18
        }, {
            group: this.groups[1],
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10],
            projDmg: true,
            health: 380,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 3,
            itemAID: 19
        }, {
            age: 3,
            group: this.groups[1],
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25],
            health: 900,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 4,
            itemAID: 20
        }, {
            age: 7,
            group: this.groups[1],
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35],
            health: 1500,
            scale: 52,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 5,
            itemAID: 21
        }, {
            group: this.groups[2],
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5],
            health: 400,
            dmg: 20,
            scale: 49,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 6,
            itemAID: 22
        }, {
            age: 5,
            group: this.groups[2],
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10],
            health: 500,
            dmg: 35,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 7,
            itemAID: 23
        }, {
            age: 9,
            group: this.groups[2],
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15],
            health: 600,
            dmg: 30,
            pDmg: 5,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 8,
            itemAID: 24
        }, {
            age: 9,
            group: this.groups[2],
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20],
            health: 500,
            dmg: 45,
            turnSpeed: 0.003,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 9,
            itemAID: 25
        }, {
            group: this.groups[3],
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10],
            health: 400,
            pps: 1,
            turnSpeed: 0.0016,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 45,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 10,
            itemAID: 26
        }, {
            age: 5,
            group: this.groups[3],
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20],
            health: 500,
            pps: 1.5,
            turnSpeed: 0.0025,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 11,
            itemAID: 27
        }, {
            age: 8,
            group: this.groups[3],
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50],
            health: 800,
            pps: 2,
            turnSpeed: 0.005,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 12,
            itemAID: 28
        }, {
            age: 5,
            group: this.groups[4],
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100],
            iconLineMult: 12,
            scale: 65,
            holdOffset: 20,
            placeOffset: 0,
            itemID: 13,
            itemAID: 29
        }, {
            age: 5,
            group: this.groups[11],
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150],
            iconLineMult: 12,
            colDiv: 0.5,
            scale: 110,
            holdOffset: 50,
            placeOffset: -15,
            itemID: 14,
            itemAID: 30
        }, {
            age: 4,
            group: this.groups[5],
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30],
            trap: true,
            ignoreCollision: true,
            hideFromEnemy: true,
            health: 500,
            colDiv: 0.2,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            alpha: 0.6,
            itemID: 15,
            itemAID: 31
        }, {
            age: 4,
            group: this.groups[6],
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5],
            ignoreCollision: true,
            boostSpeed: 1.5,
            health: 150,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 16,
            itemAID: 32
        }, {
            age: 7,
            group: this.groups[7],
            doUpdate: true,
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150],
            health: 800,
            projectile: 1,
            shootRange: 700,
            shootRate: 2200,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 17,
            itemAID: 33
        }, {
            age: 7,
            group: this.groups[8],
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20],
            ignoreCollision: true,
            zIndex: 1,
            health: 300,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 18,
            itemAID: 34
        }, {
            age: 7,
            group: this.groups[9],
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10],
            ignoreCollision: true,
            healCol: 15,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 19,
            itemAID: 35
        }, {
            age: 9,
            group: this.groups[10],
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100],
            health: 400,
            ignoreCollision: true,
            spawnPoint: true,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 20,
            itemAID: 36
        }, {
            age: 7,
            group: this.groups[12],
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25],
            ignoreCollision: true,
            blocker: 300,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 21,
            itemAID: 37
        }, {
            age: 7,
            group: this.groups[13],
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60],
            ignoreCollision: true,
            teleport: true,
            health: 200,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 22,
            itemAID: 38
        }];

        // CHECK ITEM ID:
        this.checkItem = {
            index: function (id, myItems) {
                if ([0, 1, 2].includes(id)) {
                    return 0;
                } else if ([3, 4, 5].includes(id)) {
                    return 1;
                } else if ([6, 7, 8, 9].includes(id)) {
                    return 2;
                } else if ([10, 11, 12].includes(id)) {
                    return 3;
                } else if ([13, 14].includes(id)) {
                    return 5;
                } else if ([15, 16].includes(id)) {
                    return 4;
                } else if ([17, 18, 19, 21, 22].includes(id)) {
                    if ([13, 14].includes(myItems)) {
                        return 6;
                    } else {
                        return 5;
                    }
                } else if (id == 20) {
                    if ([13, 14].includes(myItems)) {
                        return 7;
                    } else {
                        return 6;
                    }
                } else {
                    return undefined;
                }
            }
        };

        // ASSIGN IDS:
        for (let i = 0; i < this.list.length; ++i) {
            this.list[i].id = i;
            if (this.list[i].pre) {
                this.list[i].pre = i - this.list[i].pre;
            }
        }

        // TROLOLOLOL:
        if (typeof window !== "undefined") {
            function shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
            //shuffle(this.list);
        }
    }
}
class Objectmanager {
    constructor(GameObject, liztobj, UTILS, config, players, server) {
        let mathFloor = Math.floor;
        let mathABS = Math.abs;
        let mathCOS = Math.cos;
        let mathSIN = Math.sin;
        let mathPOW = Math.pow;
        let mathSQRT = Math.sqrt;
        this.ignoreAdd = false;
        this.hitObj = [];

        // DISABLE OBJ:
        this.disableObj = function (obj) {
            obj.active = false;
        };

        // ADD NEW:
        let tmpObj;
        this.add = function (sid, x, y, dir, s, type, data, setSID, owner) {
            tmpObj = findObjectBySid(sid);
            if (!tmpObj) {
                tmpObj = gameObjects.find(tmp => !tmp.active);
                if (!tmpObj) {
                    tmpObj = new GameObject(sid);
                    gameObjects.push(tmpObj);
                }
            }
            if (setSID) {
                tmpObj.sid = sid;
            }
            tmpObj.init(x, y, dir, s, type, data, owner);
        };

        // DISABLE BY SID:
        this.disableBySid = function (sid) {
            let find = findObjectBySid(sid);
            if (find) {
                this.disableObj(find);
            }
        };

        // REMOVE ALL FROM PLAYER:
        this.removeAllItems = function (sid, server) {
            gameObjects.filter(tmp => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach(tmp => this.disableObj(tmp));
        };

        // CHECK IF PLACABLE:
        this.checkItemLocation = function (x, y, s, sM, indx, ignoreWater, placer) {
            let cantPlace = liztobj.find(tmp => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) {
                return false;
            }
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) {
                return false;
            }
            return true;
        };
        this.checkItemLocationPrePlace = function (x, y, s, sM, indx, ignoreWater, placer, objToIgnore) {
            let cantPlace = liztobj.find(tmp => tmp.sid != objToIgnore.sid && tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) {
                return false;
            }
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) {
                return false;
            }
            return true;
        };
        this.preplaceCheck = function (x, y, s, sM, indx, ignoreWater, object) {
            let cantPlace = gameObjects.find(tmp => tmp.sid != object.sid && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
            if (cantPlace) {
                return false;
            }
            if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) {
                return false;
            }
            return UTILS.getDistance(x, y, object.x, object.y) <= s + object.scale;
        };
        this.useHammer = function (object) {
            if (player.weapons[1] == 10) {
                if (object) {
                    if (object.health > 0 && object.health <= items.weapons[player.weapons[0]].dmg && objectManager.canHit(player, object, player.weapons[0]) && ![5, 8].includes(player.weapons[0])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
        // CHECK COLL2:
        this.checkCollision2 = function (entity1, entity2) {
            let deltaX = entity1.x2 - entity2.x;
            let deltaY = entity1.y2 - entity2.y;
            let collisionRadius = 35 + (entity2.realScale ? entity2.realScale : entity2.scale);
            if (Math.abs(deltaX) <= collisionRadius || Math.abs(deltaY) <= collisionRadius) {
                collisionRadius = 35 + (entity2.getScale ? entity2.getScale() : entity2.scale);
                let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) - collisionRadius;
                if (distance <= 0) {
                    if (entity2.zIndex > entity1.zIndex) {
                        entity2.zIndex = entity1.zIndex;
                    }
                    return true;
                }
            }
            return false;
        };
        this.canBeBroken = function (object) {
            if (!inGame || !object || !enemy.length) {
                return;
            }
            let playerWeapon = player.weapons[this.useHammer(object) ? 1 : 0];
            let playerVariant = player[(playerWeapon < 9 ? "prima" : "seconda") + "ryVariant"];
            let playerVariantDmg = playerVariant != undefined ? config.weaponVariants[playerVariant].val : 1;
            let enemyWeapon = near.secondaryIndex != undefined && near.primaryIndex != undefined ? near.secondaryIndex == 10 && (object.health > items.weapons[near.weapons[0]].dmg || near.primaryIndex == 5) ? near.secondaryIndex : near.primaryIndex : 10;
            let enemyVariant = near.secondaryIndex != undefined && near.primaryIndex != undefined ? near[(enemyWeapon < 9 ? "prima" : "seconda") + "ryVariant"] : 3;
            let enemyVariantDmg = config.weaponVariants[enemyVariant].val;
            let playerDamage = items.weapons[playerWeapon].dmg;
            let enemyDamage = items.weapons[enemyWeapon].dmg;
            let tank = 3.3;
            let damageThreat = 0;
            if (near.reloads[enemyWeapon] == 0 && this.canHit(near, object, enemyWeapon, 24)) {
                damageThreat += enemyDamage * tank * enemyVariantDmg * (items.weapons[playerWeapon].sDmg || 1);
            }
            if (player.reloads[playerWeapon] == 0 && (clicks.right || traps.inTrap)) {
                damageThreat += playerDamage * tank * playerVariantDmg * (items.weapons[playerWeapon].sDmg || 1);
            }
            if (object.health <= damageThreat) {
                return true;
            }
            return false;
        };
        this.hitsToBreak = function (object, who) {
            if (!inGame || !object || !enemy.length || !who) {
                return;
            }
            let weapon = this.useHammer(object, who) ? who.weapons[1] : who.weapons[0];
            let variant = who[(weapon < 9 ? "prima" : "seconda") + "ryVariant"];
            let variantDmg = variant != undefined ? config.weaponVariants[variant].val : 1.18;
            let damage = items.weapons[weapon].dmg;
            let tank = 3.3;

            // Calculate hits required for player
            let effectiveDamage = damage * tank * variantDmg * (items.weapons[weapon].sDmg || 1);
            return Math.ceil(object.health / effectiveDamage);
        };
        this.canHit = function (player, object, weapon, moreSafe = 0) {
            return UTILS.getDist(player, object, 2, 0) <= items.weapons[weapon].range + object.scale + moreSafe;
        };
    }
}
class Projectile {
    constructor(players, ais, objectManager, items, config, UTILS, server) {
        // INIT:
        this.init = function (indx, x, y, dir, spd, dmg, rng, scl, owner) {
            this.active = true;
            this.tickActive = true;
            this.indx = indx;
            this.x = x;
            this.y = y;
            this.x2 = x;
            this.y2 = y;
            this.dir = dir;
            this.skipMov = true;
            this.speed = spd;
            this.dmg = dmg;
            this.scale = scl;
            this.range = rng;
            this.r2 = rng;
            this.owner = owner;
        };

        // UPDATE:
        this.update = function (delta) {
            if (this.active) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x += tmpSpeed * Math.cos(this.dir);
                    this.y += tmpSpeed * Math.sin(this.dir);
                    this.range -= tmpSpeed;
                    if (this.range <= 0) {
                        this.x += this.range * Math.cos(this.dir);
                        this.y += this.range * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.range = 0;
                        this.active = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
        this.tickUpdate = function (delta) {
            if (this.tickActive) {
                let tmpSpeed = this.speed * delta;
                if (!this.skipMov) {
                    this.x2 += tmpSpeed * Math.cos(this.dir);
                    this.y2 += tmpSpeed * Math.sin(this.dir);
                    this.r2 -= tmpSpeed;
                    if (this.r2 <= 0) {
                        this.x2 += this.r2 * Math.cos(this.dir);
                        this.y2 += this.r2 * Math.sin(this.dir);
                        tmpSpeed = 1;
                        this.r2 = 0;
                        this.tickActive = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
    }
}
;
class Store {
    constructor() {
        // STORE HATS:
        this.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for winners"
        }, {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around"
        }, {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers"
        }, {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army"
        }, {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz"
        }, {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe"
        }, {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky"
        }, {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect"
        }, {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect"
        }, {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1
        }, {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true
        }, {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3
        }, {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush"
        }, {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 6,
            name: "Soldier Helmet",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75
        }, {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1
        }, {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1
        }, {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5
        }, {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96
        }, {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7
        }, {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16
        }, {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6
        }, {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        }, {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1
        }, {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5
        }, {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45
        }, {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500
            },
            spdMult: 0.7
        }, {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78
        }, {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4
        }, {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2
        }, {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3
        }, {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a players gold when you kill them",
            goldSteal: 0.5
        }, {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2
        }, {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000
        }];

        // STORE ACCESSORIES:
        this.accessories = [{
            id: 12,
            name: "Snowball",
            price: 1000,
            scale: 105,
            xOff: 18,
            desc: "no effect"
        }, {
            id: 9,
            name: "Tree Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 10,
            name: "Stone Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            desc: "no effect"
        }, {
            id: 8,
            name: "Cow Cape",
            price: 2000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 11,
            name: "Monkey Tail",
            price: 2000,
            scale: 97,
            xOff: 25,
            desc: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: 0.2
        }, {
            id: 17,
            name: "Apple Basket",
            price: 3000,
            scale: 80,
            xOff: 12,
            desc: "slowly regenerates health over time",
            healthRegen: 1
        }, {
            id: 6,
            name: "Winter Cape",
            price: 3000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 4,
            name: "Skull Cape",
            price: 4000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 5,
            name: "Dash Cape",
            price: 5000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 2,
            name: "Dragon Cape",
            price: 6000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 1,
            name: "Super Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 7,
            name: "Troll Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 14,
            name: "Thorns",
            price: 10000,
            scale: 115,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 15,
            name: "Blockades",
            price: 10000,
            scale: 95,
            xOff: 15,
            desc: "no effect"
        }, {
            id: 20,
            name: "Devils Tail",
            price: 10000,
            scale: 95,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 16,
            name: "Sawblade",
            price: 12000,
            scale: 90,
            spin: true,
            xOff: 0,
            desc: "deal damage to players that damage you",
            dmg: 0.15
        }, {
            id: 13,
            name: "Angel Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 19,
            name: "Shadow Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "increased movement speed",
            spdMult: 1.1
        }, {
            id: 18,
            name: "Blood Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "restores health when you deal damage",
            healD: 0.2
        }, {
            id: 21,
            name: "Corrupt X Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "deal damage to players that damage you",
            dmg: 0.25
        }];
    }
}
;
class ProjectileManager {
    constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
        this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
            var tmpData = items.projectiles[indx];
            var tmpProj;
            for (var i = 0; i < projectiles.length; ++i) {
                if (!projectiles[i].active) {
                    tmpProj = projectiles[i];
                    break;
                }
            }
            if (!tmpProj) {
                tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                tmpProj.sid = projectiles.length;
                projectiles.push(tmpProj);
            }
            tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
            tmpProj.ignoreObj = ignoreObj;
            tmpProj.layer = layer || tmpData.layer;
            tmpProj.src = tmpData.src;
            return tmpProj;
        };
    }
}
class AiManager {
    // AI MANAGER:
    constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
        // AI TYPES:
        this.aiTypes = [{
            id: 0,
            src: "cow_1",
            killScore: 150,
            health: 500,
            weightM: 0.8,
            speed: 0.00095,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 50]
        }, {
            id: 1,
            src: "pig_1",
            killScore: 200,
            health: 800,
            weightM: 0.6,
            speed: 0.00085,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 80]
        }, {
            id: 2,
            name: "Bull",
            src: "bull_2",
            hostile: true,
            dmg: 20,
            killScore: 1000,
            health: 1800,
            weightM: 0.5,
            speed: 0.00094,
            turnSpeed: 0.00074,
            scale: 78,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 3,
            name: "Bully",
            src: "bull_1",
            hostile: true,
            dmg: 20,
            killScore: 2000,
            health: 2800,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.0008,
            scale: 90,
            viewRange: 900,
            chargePlayer: true,
            drop: ["food", 400]
        }, {
            id: 4,
            name: "Wolf",
            src: "wolf_1",
            hostile: true,
            dmg: 8,
            killScore: 500,
            health: 300,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.002,
            scale: 84,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 200]
        }, {
            id: 5,
            name: "Quack",
            src: "chicken_1",
            dmg: 8,
            killScore: 2000,
            noTrap: true,
            health: 300,
            weightM: 0.2,
            speed: 0.0018,
            turnSpeed: 0.006,
            scale: 70,
            drop: ["food", 100]
        }, {
            id: 6,
            name: "MOOSTAFA",
            nameScale: 50,
            src: "enemy",
            hostile: true,
            dontRun: true,
            fixedSpawn: true,
            spawnDelay: 60000,
            noTrap: true,
            colDmg: 100,
            dmg: 40,
            killScore: 8000,
            health: 18000,
            weightM: 0.4,
            speed: 0.0007,
            turnSpeed: 0.01,
            scale: 80,
            spriteMlt: 1.8,
            leapForce: 0.9,
            viewRange: 1000,
            hitRange: 210,
            hitDelay: 1000,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 7,
            name: "Treasure",
            hostile: true,
            nameScale: 35,
            src: "crate_1",
            fixedSpawn: true,
            spawnDelay: 120000,
            colDmg: 200,
            killScore: 5000,
            health: 20000,
            weightM: 0.1,
            speed: 0,
            turnSpeed: 0,
            scale: 70,
            spriteMlt: 1
        }, {
            id: 8,
            name: "MOOFIE",
            src: "wolf_2",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 4,
            spawnDelay: 30000,
            noTrap: true,
            nameScale: 35,
            dmg: 10,
            colDmg: 100,
            killScore: 3000,
            health: 7000,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.002,
            scale: 90,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 1000]
        }, {
            id: 9,
            name: "💀MOOFIE",
            src: "wolf_2",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 50,
            spawnDelay: 60000,
            noTrap: true,
            nameScale: 35,
            dmg: 12,
            colDmg: 100,
            killScore: 3000,
            health: 9000,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: true,
            drop: ["food", 3000],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9
        }, {
            id: 10,
            name: "💀Wolf",
            src: "wolf_1",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 50,
            spawnDelay: 30000,
            dmg: 10,
            killScore: 700,
            health: 500,
            weightM: 0.45,
            speed: 0.00115,
            turnSpeed: 0.0025,
            scale: 88,
            viewRange: 1440,
            chargePlayer: true,
            drop: ["food", 400],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9
        }, {
            id: 11,
            name: "💀Bully",
            src: "bull_1",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 50,
            dmg: 20,
            killScore: 5000,
            health: 5000,
            spawnDelay: 100000,
            weightM: 0.45,
            speed: 0.00115,
            turnSpeed: 0.0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: true,
            drop: ["food", 800],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9
        }];

        // SPAWN AI:
        this.spawn = function (x, y, dir, index) {
            let tmpObj = ais.find(tmp => !tmp.active);
            if (!tmpObj) {
                tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                ais.push(tmpObj);
            }
            tmpObj.init(x, y, dir, index, this.aiTypes[index]);
            return tmpObj;
        };
    }
}
;
class AI {
    constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
        this.sid = sid;
        this.isAI = true;
        this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);

        // INIT:
        this.init = function (x, y, dir, index, data) {
            this.x = x;
            this.y = y;
            this.startX = data.fixedSpawn ? x : null;
            this.startY = data.fixedSpawn ? y : null;
            this.xVel = 0;
            this.yVel = 0;
            this.zIndex = 0;
            this.lowHealth = false;
            this.dir = dir;
            this.dirPlus = 0;
            this.showName = "aaa";
            this.index = index;
            this.src = data.src;
            if (data.name) {
                this.name = data.name;
            }
            this.weightM = data.weightM;
            this.speed = data.speed;
            this.killScore = data.killScore;
            this.turnSpeed = data.turnSpeed;
            this.scale = data.scale;
            this.maxHealth = data.health;
            this.leapForce = data.leapForce;
            this.health = this.maxHealth;
            this.chargePlayer = data.chargePlayer;
            this.viewRange = data.viewRange;
            this.drop = data.drop;
            this.dmg = data.dmg;
            this.hostile = data.hostile;
            this.dontRun = data.dontRun;
            this.hitRange = data.hitRange;
            this.hitDelay = data.hitDelay;
            this.hitScare = data.hitScare;
            this.spriteMlt = data.spriteMlt;
            this.nameScale = data.nameScale;
            this.colDmg = data.colDmg;
            this.noTrap = data.noTrap;
            this.spawnDelay = data.spawnDelay;
            this.hitWait = 0;
            this.waitCount = 1000;
            this.moveCount = 0;
            this.targetDir = 0;
            this.active = true;
            this.alive = true;
            this.runFrom = null;
            this.chargeTarget = null;
            this.dmgOverTime = {};
        };
        let tmpRatio = 0;
        let animIndex = 0;
        this.animate = function (delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else if (animIndex == 0) {
                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                    if (tmpRatio >= 1) {
                        tmpRatio = 1;
                        animIndex = 1;
                    }
                } else {
                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                }
            }
        };

        // ANIMATION:
        this.startAnim = function () {
            this.animTime = this.animSpeed = 600;
            this.targetAngle = Math.PI * 0.8;
            tmpRatio = 0;
            animIndex = 0;
        };
    }
}
;
class addCh {
    constructor(x, y, chat, tmpObj) {
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.active = true;
        this.alive = false;
        this.chat = chat;
        this.owner = tmpObj;
    }
}
;
class DeadPlayer {
    constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
        this.x = x;
        this.y = y;
        this.lastDir = dir;
        this.dir = dir + Math.PI;
        this.buildIndex = buildIndex;
        this.weaponIndex = weaponIndex;
        this.weaponVariant = weaponVariant;
        this.skinColor = skinColor;
        this.scale = scale;
        this.visScale = 0;
        this.name = name;
        this.alpha = 1;
        this.active = true;
        this.animate = function (delta) {
            let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
            if (d2 > 0.01) {
                this.dir += d2 / 20;
            } else {
                this.dir = this.lastDir;
            }
            if (this.visScale < this.scale) {
                this.visScale += delta / (this.scale / 2);
                if (this.visScale >= this.scale) {
                    this.visScale = this.scale;
                }
            }
            this.alpha -= delta / 30000;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.active = false;
            }
        };
    }
}
;
class Player {
    constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
        this.id = id;
        this.sid = sid;
        this.tmpScore = 0;
        this.team = null;
        this.latestSkin = 0;
        this.oldSkinIndex = 0;
        this.lastReloadedTick = 0;
        this.skinIndex = 0;
        this.latestTail = 0;
        this.oldTailIndex = 0;
        this.tailIndex = 0;
        this.usingWhiteout = false;
        // HIT TIMINGS:
        this.hitTime = 0;
        this.lastHit = 0;
        this.hitTick = 0;
        this.showName = "NOOO";
        this.tails = {};
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].price <= 0) {
                this.tails[accessories[i].id] = 1;
            }
        }
        this.skins = {};
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].price <= 0) {
                this.skins[hats[i].id] = 1;
            }
        }
        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = 0;
        this.hitSpike = 0;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.dist2 = 0;
        this.aim2 = 0;
        this.maxSpeed = 1;
        this.chat = {
            message: null,
            count: 0
        };
        this.hacking = false;
        this.hackerPoints = {
            autoheal: -1,
            hatChanger: -1,
            sold: false,
            tank: false,
            normalHats: false,
            autoAim: -1
        };
        this.macroPoints = {
            qHold: -1,
            hatMacro: -1,
            tank: false
        };
        this.happymod = false;
        this.backupNobull = true;
        this.circle = false;
        this.circleRad = 200;
        this.circleRadSpd = 0.1;
        this.cAngle = 0;
        // SPAWN:
        this.spawn = function (moofoll) {
            this.spikeDamage = 0;
            this.attacked = false;
            this.timeDamaged = 0;
            this.canSync = false;
            this.timeHealed = 100;
            this.pinge = 0;
            this.millPlace = "NOOO";
            this.lastshamecount = 0;
            this.death = false;
            this.spinDir = 0;
            this.syncThreats = 0;
            this.sync = false;
            this.antiBull = 0;
            this.poisonCounter = 0;
            this.bullTimer = 0;
            this.poisonTimer = 0;
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.gatherIndex = 0;
            this.shooting = {};
            this.shootIndex = 9;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.weaponCode = 0;
            this.weaponVariant = 0;
            this.primaryHit = 0;
            this.secondaryHit = 0;
            this.turretTick = 0;
            this.primaryIndex = undefined;
            this.secondaryIndex = undefined;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.x = 0;
            this.y = 0;
            this.oldXY = {
                x: 0,
                y: 0
            };
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.damaged = 0;
            this.scale = config.playerScale;
            this.speed = config.playerSpeed;
            this.resetMoveDir();
            this.resetResources(moofoll);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [3000];
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0
            };
            this.primaryReloaded = true;
            this.secondaryReloaded = true;
            this.bowThreat = {
                9: 0,
                12: 0,
                13: 0,
                15: 0
            };
            this.damageThreat = 0;
            this.inTrap = false;
            this.lastTrap = false;
            this.escaped = false;
            this.canEmpAnti = false;
            this.empAnti = false;
            this.soldierAnti = false;
            this.poisonTick = 0;
            this.bullTick = 0;
            this.setPoisonTick = false;
            this.setBullTick = false;
            this.needTick = 0;
            this.antiTimer = 2;
            this.qHeld = false;
            this.rightHandThrust = 0;
            this.leftHandThrust = 0;
            this.polearmThrust = 0;
        };

        // RESET MOVE DIR:
        this.resetMoveDir = function () {
            this.moveDir = undefined;
        };

        // RESET RESOURCES:
        this.resetResources = function (moofoll) {
            for (let i = 0; i < config.resourceTypes.length; ++i) {
                this[config.resourceTypes[i]] = moofoll ? 100 : 0;
            }
        };

        // ADD ITEM:
        this.getItemType = function (id) {
            let findindx = this.items.findIndex(ids => ids == id);
            if (findindx != -1) {
                return findindx;
            } else {
                return items.checkItem.index(id, this.items);
            }
        };

        // SET DATA:
        this.setData = function (data) {
            this.id = data[0];
            this.sid = data[1];
            this.name = data[2];
            this.x = data[3];
            this.y = data[4];
            this.dir = data[5];
            this.health = data[6];
            this.maxHealth = data[7];
            this.scale = data[8];
            this.skinColor = data[9];
        };

        // UPDATE POISON TICK:
        this.updateTimer = function (plaguemask = true) {
            this.bullTimer -= 1;
            if (this.bullTimer <= 0) {
                this.setBullTick = false;
                this.bullTick = game.tick - 1;
                this.bullTimer = config.serverUpdateRate;
            }
            this.poisonTimer -= 1;
            if (this.poisonTimer < 0) {
                this.setPoisonTick = false;
                this.poisonTick = game.tick - 1;
                this.poisonTimer = config.serverUpdateRate;
                plaguemask = true;
                setTimeout(() => {
                    plaguemask = false;
                }, 1000);
            } else if (this.poisonTimer >= 0) {
                plaguemask = false;
            }
        };
        this.update = function (delta) {
            if (this.active) {
                // MOVE:
                let gear = {
                    skin: findID(hats, this.skinIndex),
                    tail: findID(accessories, this.tailIndex)
                };
                let spdMult = (this.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? gear.skin.spdMult || 1 : 1) * (gear.tail ? gear.tail.spdMult || 1 : 1) * (this.y <= config.snowBiomeTop ? gear.skin && gear.skin.coldM ? 1 : config.snowSpeed : 1) * this.slowMult;
                /* velocity calculation */
                this.xVel = (this.x2 - this.oldPos.x2) / delta;
                this.yVel = (this.y2 - this.oldPos.y2) / delta;
                // River Multiplier
                if (!this.zIndex && this.y >= config.mapScale / 2 - config.riverWidth / 2 && this.y <= config.mapScale / 2 + config.riverWidth / 2) {
                    spdMult *= gear.skin && gear.skin.watrImm ? 0.75 : 0.33;
                    this.xVel += gear.skin && gear.skin.watrImm ? config.waterCurrent * 0.4 * delta : config.waterCurrent * delta;
                }
                // acceleration
                // get the { x , y } of the direction where your going when u move
                var xDir = this.moveDir != undefined ? Math.cos(this.moveDir) : 0; // get the x direction
                var yDir = this.moveDir != undefined ? Math.sin(this.moveDir) : 0; // get the y direction
                // this uh check the len so it wont go faster in diagonals
                var len = Math.hypot(xDir, yDir);
                // normalize the Dir so it wont go faster i think?  that what i found in google/gpt
                if (len) {
                    xDir /= len;
                    yDir /= len;
                }
                ;
                // if theres direction(!undefined) then multiply by speed
                if (xDir) {
                    this.xVel += xDir * this.speed * spdMult;
                }
                if (yDir) {
                    this.yVel += yDir * this.speed * spdMult;
                }
                // decelaration
                if (this.xVel) {
                    this.xVel *= Math.pow(config.playerDecel, delta);
                    if (this.xVel <= 0.01 && this.xVel >= -0.01) {
                        this.xVel = 0;
                    }
                }
                if (this.yVel) {
                    this.yVel *= Math.pow(config.playerDecel, delta);
                    if (this.yVel <= 0.01 && this.yVel >= -0.01) {
                        this.yVel = 0;
                    }
                }
                // apply the { location + velocity * time } = predicted location using velocity :thumbsup:
                this.xlvel = this.x2 + this.xVel * delta;
                this.ylvel = this.y2 + this.yVel * delta;
                // collision detector
                gameObjects.filter(o => o.active && !o.ignoreCollision).forEach(o => {
                    let dx = this.xlvel - o.x;
                    let dy = this.ylvel - o.y;
                    let sca = 35 + (o.getScale ? o.getScale() : o.scale);
                    if (Math.abs(dx) <= sca || Math.abs(dy) <= sca) {
                        let tmpInt = Math.max(0, sca - UTILS.getDistance(0, 0, dx, dy));
                        if (tmpInt) {
                            let tmpAngle = Math.atan2(dy, dx);
                            let ma = Math.min(tmpInt, delta);
                            if (!o.isTeamObject(this) && o.dmg > 0 && o.name.includes("spikes") || o.type == 1 && o.y >= 12000) {
                                ma *= 1.5;
                            }
                            this.xlvel += Math.cos(tmpAngle) * ma;
                            this.ylvel += Math.sin(tmpAngle) * ma;
                        }
                    }
                });
                this.maxSpeed = spdMult;
            }
        };

        // GATHER ANIMATION:
        let tmpRatio = 0;
        let animIndex = 0;
        this.animate = function (delta) {
            if (this.animTime > 0) {
                this.animTime -= delta;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    this.polearmThrust = 0;
                    this.rightHandThrust = 0;
                    this.leftHandThrust = 0;
                    tmpRatio = 0;
                    animIndex = 0;
                } else {
                    let isPolearm = this.weaponIndex === 5;
                    if (isPolearm) {
                        if (animIndex == 0) {
                            tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                            this.polearmThrust = UTILS.lerp(0, 1, Math.min(1, tmpRatio));
                            this.rightHandThrust = UTILS.lerp(0, 35, Math.min(1, tmpRatio));
                            this.leftHandThrust = UTILS.lerp(0, 25, Math.min(1, tmpRatio));
                            if (tmpRatio >= 1) {
                                tmpRatio = 1;
                                animIndex = 1;
                            }
                        } else {
                            tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                            this.polearmThrust = UTILS.lerp(0, 1, Math.max(0, tmpRatio));
                            this.rightHandThrust = UTILS.lerp(0, 35, Math.max(0, tmpRatio));
                            this.leftHandThrust = UTILS.lerp(0, 25, Math.max(0, tmpRatio));
                        }
                        this.dirPlus = 0;
                    } else if (animIndex == 0) {
                        tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                        if (tmpRatio >= 1) {
                            tmpRatio = 1;
                            animIndex = 1;
                        }
                    } else {
                        tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                        this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                    }
                }
            }
        };

        // GATHER ANIMATION:
        this.startAnim = function (didHit, index) {
            this.animTime = this.animSpeed = items.weapons[index].speed;
            this.targetAngle = index == 5 ? -Math.PI / 8 : didHit ? -config.hitAngle : -Math.PI;
            tmpRatio = 0;
            animIndex = 0;
        };

        // CAN SEE:
        this.canSee = function (other) {
            if (!other) {
                return false;
            }
            let dx = Math.abs(other.x - this.x) - other.scale;
            let dy = Math.abs(other.y - this.y) - other.scale;
            return dx <= config.maxScreenWidth / 2 * 1.3 && dy <= config.maxScreenHeight / 2 * 1.3;
        };

        // SHAME SYSTEM:
        this.judgeShame = function () {
            this.lastshamecount = this.shameCount;
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let timeSinceHit = Date.now() - this.hitTime;
                    this.hitTime = 0;
                    if (timeSinceHit < 120) {
                        this.shameCount++;
                        if (game.tick - this.oldHitTime < 2 && (this.guessDangerShame < this.shameCount || this.guessDangerShame >= 7 || game.tick - this.lastGuess > 2700)) {
                            this.guessDangerShame = this.shameCount;
                            this.lastGuess = game.tick;
                        }
                        if (this.healTime == 1) {
                            this.hackerPoints.autoheal += 2;
                        }
                        if (this.buildIndex != 0) {
                            if (this.qHeld) {
                                this.macroPoints.qHold += 4;
                            } else {
                                this.qHeld = true;
                                game.tickBase(() => {
                                    this.qHeld = false;
                                }, 10);
                                this.macroPoints.qHold++;
                            }
                        }
                    } else {
                        if (this.guessDangerShame == this.shameCount && this.oldHealth <= 35) {
                            this.dangerShame = this.shameCount;
                        } else {
                            this.guessDangerShame = this.shameCount;
                        }
                        this.shameCount = Math.max(0, this.shameCount - 2);
                        this.macroPoints.qHold -= 0.3;
                        this.qHeld = false;
                        if (this.healTime == 2) {
                            this.hackerPoints.autoheal += 3;
                        } else if (this.healTime > 3) {
                            this.hackerPoints.autoheal -= this.primaryIndex && this.primary.id == 0 ? 10 : 30;
                        }
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = Date.now();
                this.lastHit = Date.now();
                this.hitTick = game.tick;
            }
        };
        this.addShameTimer = function () {
            this.shameCount = 0;
            this.shameTimer = 30;
            let interval = setInterval(() => {
                this.shameTimer--;
                if (this.shameTimer <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        };

        // CHECK TEAM:
        this.isTeam = function (tmpObj) {
            return this == tmpObj || this.team && this.team == tmpObj.team;
        };

        // FOR THE PLAYER:
        this.findAllianceBySid = function (sid) {
            if (this.team) {
                return alliancePlayers.find(THIS => THIS === sid);
            } else {
                return null;
            }
        };
        this.checkCanInsta = function (nobull) {
            let totally = 0;
            if (this.alive && inGame) {
                let primary = {
                    weapon: this.weapons[0],
                    variant: this.primaryVariant,
                    dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg
                };
                let secondary = {
                    weapon: this.weapons[1],
                    variant: this.secondaryVariant,
                    dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg
                };
                let bull = this.skins[7] && !nobull ? 1.5 : 1;
                let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                    totally += primary.dmg * pV * bull;
                }
                if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                    totally += secondary.dmg;
                }
                if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                    totally += 25;
                }
                totally *= near.skinIndex == 6 ? 0.75 : 1;
                return totally;
            }
            return 0;
        };

        // UPDATE WEAPONS INFO:
        this.manageWeapons = function () {
            if (this.weaponIndex < 9) {
                this.primaryIndex = this.weaponIndex;
                this.primaryVariant = this.weaponVariant;
                this.primaryDmg = Math.round(items.weapons[this.primaryIndex].dmg * 1.5 * (config.weaponVariants[this.primaryVariant].val || 1));
            } else if (this.weaponIndex > 8) {
                this.secondaryIndex = this.weaponIndex;
                this.secondaryVariant = this.weaponVariant;
            }

            if (this.secondaryIndex !== undefined) {
                this.shootIndex = this.secondaryIndex;
            }
        };

        // UPDATE WEAPON RELOAD:
        this.manageReload = function () {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = 2500 - game.tickRate;
            } else if (this.reloads[53] > 0) {
                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
            }
            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                        if (this == player) {
                            if (configs.autoGrind) {
                                if (config.isNormal) {
                                    checkPlace(player.getItemType(22), getSafeDir() + Math.PI / 4);
                                    checkPlace(player.getItemType(22), getSafeDir() - Math.PI / 4);
                                } else {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(player.getItemType(22), i);
                                    }
                                }
                            }
                        }
                        if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                            this.antiBull++;
                            game.tickBase(() => {
                                this.antiBull = 0;
                            }, 1);
                        }
                    }
                }
                if (this.weaponIndex < 9) {
                    this.primaryReloaded = this.reloads[this.weaponIndex] < ms[this.sid == player.sid ? "avg" : "max"];
                } else {
                    this.secondaryReloaded = this.reloads[this.weaponIndex] < ms[this.sid == player.sid ? "avg" : "max"];
                }
            }
        };

        // FOR ANTI INSTA:
        this.addDamageThreat = function () {
            let damageThreat = 0;
            nears.forEach(tmpObj => {
                let primary = {
                    weapon: tmpObj.primaryIndex,
                    variant: tmpObj.primaryVariant,
                    dmg: 0
                };
                let secondary = {
                    weapon: tmpObj.secondaryIndex,
                    variant: tmpObj.secondaryVariant,
                    dmg: 0
                };
                primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                secondary.dmg = secondary.weapon == undefined ? 50 : items.weapons[secondary.weapon].Pdmg;
                let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                if (primary.weapon == undefined || tmpObj.reloads[primary.weapon] == 0) {
                    primary.dmg = primary.dmg * pV * 1.5;
                } else {
                    primary.dmg = 0;
                }
                if (secondary.weapon == undefined || tmpObj.reloads[secondary.weapon] == 0) {
                    secondary.dmg = secondary.dmg * sV;
                } else {
                    secondary.dmg = 0;
                }

                // DMG FOR SPIKES:
                if (my.predictSpikes > 0) {
                    let detectIt = (secondary.weapon == 10 ? 45 : 35) * my.predictSpikes;
                    damageThreat += detectIt;
                    this.mostDamageThreat += detectIt;
                    my.predictSpikes = 0;
                }
                if (tmpObj.reloads[53] == 0) {
                    secondary.dmg += 25;
                }
                damageThreat += Math.max(primary.dmg, secondary.dmg);
                if (player.poisonCounter > 0) {
                    damageThreat += 5;
                }

                // PRO DMG PROJECTILE ROB:
                if (projectile.count) {
                    damageThreat += projectile.dmg;
                    player.chat.message = "projectile dmg: " + projectile.dmg;
                    player.chat.count = 500;
                }
            });
            this.mostDamageThreat = damageThreat;
            damageThreat *= this.skinIndex == 6 && !instaC.isTrue ? 0.75 : 1;
            this.damageThreat = damageThreat;
        };
    }
}
;

// SOME CODES:
function sendUpgrade(index) {
    player.reloads[index] = 0;
    packet("H", index);
}
function storeEquip(id, index) {
    packet("c", 0, id, index);
}
function storeBuy(id, index) {
    packet("c", 1, id, index);
}
function Hg(e, t) {
    buyEquip(e, 0);
    buyEquip(t, 1);
}
function buyEquip(id, index) {
    let nID = player.skins[6] ? 6 : 0;
    if (player.alive && inGame) {
        if (index == 0) {
            if (player.skins[id]) {
                if (player.latestSkin != id) {
                    packet("c", 0, id, 0);
                    /*                 } else {
          if (player.latestSkin != nID) {
              packet("c", 0, nID, 0);
          } */
                }
            }
        } else if (index == 1) {
            if (player.tails[id]) {
                if (player.latestTail != id) {
                    packet("c", 0, id, 1);
                }
            }
        }
    }
}
function selectToBuild(index, wpn) {
    packet("z", index, wpn);
}
function selectWeapon(index, isPlace) {
    if (!isPlace) {
        player.weaponCode = index;
    }
    packet("z", index, 1);
}
function sendAutoGather() {
    packet("K", 1, 1);
}
function sendAtck(id, angle) {
    packet("F", id, angle, 1);
}
let lastRadDir = 0;
function place(id, rad) {
    try {
        if (id == undefined) {
            return;
        }
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 99)) {
            (selectToBuild(player.items[id]), sendAtck(1, rad), selectWeapon(player.weaponCode, 1));

            // place vis:
            const obj = { x: tmpX, y: tmpY, name: item.name, scale: item.scale, dir: rad };
            placeVisible.push(obj);
            lastRadDir = obj.dir;
            game.tickBase(() => placeVisible.shift(), 1);
        }
    } catch (e) { }
}
let canPlacess = [];
function checkPlace(id, rad) {
    try {
        if (id == undefined) {
            return;
        }
        let item = items.list[player.items[id]];
        if (!item) {
            return;
        }
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            place(id, rad, 1);
        }
    } catch (e) { }
}
function checkCanPlacedIt(id, rad) {
    if (id == undefined) {
        return false;
    }
    let item = items.list[player.items[id]];
    if (!item) {
        return false;
    }
    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
    let tmpX = player.x2 + tmpS * Math.cos(rad);
    let tmpY = player.y2 + tmpS * Math.sin(rad);
    const canPlaceHere = objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player);
    return canPlaceHere;
};
let lastPlaceRad = 0;
function woawAvisual(id, rad) {
    if (id == undefined) {
        return false;
    }
    let item = items.list[player.items[id]];
    if (!item) {
        return false;
    }
    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
    let tmpX = player.x2 + tmpS * Math.cos(rad);
    let tmpY = player.y2 + tmpS * Math.sin(rad);
    const obj = {
        x: tmpX,
        y: tmpY,
        name: item.name,
        scale: item.scale,
        dir: rad
    };
    canPlacess.push(obj);
    lastPlaceRad = obj.dir;
    game.tickBase(() => canPlacess.shift(), 1);
};
function hatProbablitySafety(damageTick = 0) {
    // soldier probability:
    if (player.latestSkin == 6) {
        damageTick = 0.75;
    } else {
        damageTick = 0;
    }
    // emp probability:
    if (player.latestSkin != 22) {
        damageTick = 1;
    }
    let inRange = gameObjects.some(o => o && o.name == "turret" && UTILS.getDistance(player.x, player.y, o.x, o.y) <= o.shootRange);
    hats.forEach(h => h.antiTurret = inRange ? 1 : 0);
    return damageTick;
}

// HEAL STUFF:
function healthBased() {
    if (player.health == 100) {
        return 0;
    }
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
    }
    return 0;
}
function getAttacker(ci) {
    let cC = enemy.filter(cK => {
        if (cK.attacked) {
            let cd = cK.weaponIndex;
            let ck = cd > 8 ? items.weapons[cd].Pdmg : items.weapons[cd].dmg;
            let cQ = cK[(cd < 9 ? "prima" : "seconda") + "ryVariant"];
            ck *= (player.skinIndex == 6 ? 0.75 : 1) * (cK.skinIndex == 7 ? 1.5 : 1) * (cK.tailIndex == 11 ? 0.2 : 1) * config.weaponVariants[cQ].val;
            if (ci == ck) {
                if (player.skinIndex != 23) {
                    player.poisonCounter = cQ == 3 ? 5 : cK.skinIndex == 21 ? 6 : player.poisonCounter;
                }
                return true;
            }
        }
        return false;
    });
    return cC;
}
function healer(healTick = 0) {
    // shitty
    for (let c = 0; c < healthBased(); c++) {
        place(0, getAttackDir());
    }
    for (let i = 0; i < healTick; i++) {
        place(0, getAttackDir());
    }
}

// anti sync healing kekeke
function antiSyncHealing(timearg) {
    my.antiSync = true;
    let healInterval = setInterval(() => {
        if (player.shameCount < 5) {
            place(0, getAttackDir());
        }
    }, 75);
    setTimeout(() => {
        clearInterval(healInterval);
        setTimeout(() => {
            my.antiSync = false;
        }, game.tickRate);
    }, game.tickRate);
}
function getDist(e, t) {
    try {
        return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return Infinity;
    }
}
function checkCanPlace(id, rad) {
    try {
        if (id == undefined) {
            return;
        }
        let item = items.list[player.items[id]];
        let tmpS = player.scale + item.scale + (item.placeOffset || 0);
        let tmpX = player.x2 + tmpS * Math.cos(rad);
        let tmpY = player.y2 + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            return true;
        } else {
            return false;
        }
    } catch (e) { }
}
//idk
function findAllianceBySid(sid) {
    for (let i = 0; i < alliancePlayers.length; i += 2) {
        if (alliancePlayers[i] == sid) {
            return alliancePlayers[i];
        }
    }
    return null;
}
function applCxC(value) {
    if (player.health == 100) {
        return 0;
    }
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil(value / items.list[player.items[0]].healing);
    }
    return 0;
}
function calcDmg(value) {
    if (value * player.skinIndex == 6) {
        return 0.75;
    } else {
        return 1;
    }
}
function isPositionValid(position) {
    const playerX = player.x2;
    const playerY = player.y2;
    const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
    return distToPosition > 35;
}
function calculatePossibleTrapPositions(x, y, radius) {
    const trapPositions = [];
    const numPositions = 16;
    for (let i = 0; i < numPositions; i++) {
        const angle = Math.PI * 2 * i / numPositions;
        const offsetX = x + radius * Math.cos(angle);
        const offsetY = y + radius * Math.sin(angle);
        const position = [offsetX, offsetY];
        if (!trapPositions.some(pos => isPositionTooClose(position, pos))) {
            trapPositions.push(position);
        }
    }
    return trapPositions;
}
function isPositionTooClose(position1, position2, minDistance = 50) {
    const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
    return dist < minDistance;
}
function biomeGearddd(hatID) {
    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
        return player.skins[31] ? 31 : player.skins[6] ? 6 : 0;
    } else if (player.y2 <= config.snowBiomeTop) {
        return player.skins[15] ? 15 : player.skins[6] ? 6 : 0;
    } else {
        return player.skins[12] ? 12 : player.skins[6] ? 6 : 0;
    }
}
function biomeGear(mover, returns, id) {
    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
        if (returns) {
            return 31;
        }
        buyEquip(31, 0);
    } else if (player.y2 <= config.snowBiomeTop) {
        buyEquip(15, 0);
    } else {
        buyEquip(12, 0);
    }
    if (returns) {
        return 0;
    }
}
function woah(mover) {
    buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
}
let info = {};
let spikeKT = function () {
    return player.weapons[1] == 10 && (info.health > items.weapons[player.weapons[0]].dmg || player.weapons[0] == 5);
};
function sendAtck2(id, angle, sender) {
    packet("F", id, angle, 1, "sendAtck2");
}
let aimSpike = 0;
let nearspiker = false;
let prePlaceVis = [];
function checkCanPrePlace(id, rad, obj, loose, pre = true) {
    try {
        if (id == undefined) {
            return false;
        }
        let item = items.list[player.items[id]];
        let tmpS = 35 + item.scale + (item.placeOffset || 0);
        let tmpX = player[pre ? "x3" : "x2"] + tmpS * Math.cos(rad);
        let tmpY = player[pre ? "y3" : "y2"] + tmpS * Math.sin(rad);
        if (objectManager.checkItemLocationPrePlace(tmpX, tmpY, item.scale, loose ? 0.5 : 0.6, item.id, false, player, obj)) {
            prePlaceVis.push({
                x: tmpX,
                y: tmpY,
                name: item.name,
                scale: item.scale,
                dir: rad
            });
            game.tickBase(() => {
                prePlaceVis.shift();
            }, 1);
            return true;
        } else {
            return false;
        }
    } catch (e) { }
}
function revHit(angle) {
    if (angle == undefined) {
        angle = near.aim2;
    }
    instaC.isTrue = true;
    buyEquip(53, 0);
    game.tickBase(() => {
        if (UTILS.getAngleDist(angle - near.aim2) <= 0.5) {
            my.autoAim = 1;
        } else {
            packet("D", angle, "hitBull");
        }
        if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        sendAutoGather(1);
        game.tickBase(() => {
            instaC.isTrue = false;
        }, 1);
    }, 1);
}
let placeReset = 0; // for best results

function checkRel(type, smigul) {
    // stary lazy to do is reload all 1 by 1
    if (type == "sec") {
        if (reloadPercent(smigul, smigul.secondaryIndex) === 1) {
            return true;
        }
    } else if (type == "pri") {
        if (reloadPercent(smigul, smigul.primaryIndex) === 1) {
            return true;
        }
    } else if (type == "pritur") {
        if (reloadPercent(smigul, smigul.primaryIndex) === 1 && reloadPercent(smigul, 53) === 1) {
            return true;
        }
    } else if (type == "sectur") {
        if (reloadPercent(smigul, smigul.secondaryIndex) === 1 && reloadPercent(smigul, 53) === 1) {
            return true;
        }
    } else if (type == "prisec") {
        if (reloadPercent(smigul, smigul.primaryIndex) === 1 && reloadPercent(smigul, smigul.secondaryIndex) === 1) {
            return true;
        }
    } else if (type == "tur") {
        if (reloadPercent(smigul, 53) === 1) {
            return true;
        }
    } else if (type == "all") {
        if (reloadPercent(smigul, smigul.primaryIndex) === 1 && reloadPercent(smigul, smigul.secondaryIndex) === 1 && reloadPercent(smigul, 53) === 1) {
            return true;
        }
    }
    return false;
}
// Essential CODE
let doStuffPingSet = [];
function smartTick(tick) {
    doStuffPingSet.push(tick);
}
class Combat {
    constructor(UTILS, items) {
        this.findSpikeHit = {
            x: 0,
            y: 0,
            spikePosX: 0,
            spikePosY: 0,
            canHit: false,
            spikes: []
        };
        this.spikesNearEnemy = [];
        this.doSpikeHit = function () {
            if (enemy.length) {
                let nTrap = gameObjects.find(e => e.active && e.name == "pit trap" && e.isTeamObject(player) && UTILS.getDistance(e.x, e.y, near.x2, near.y2) <= 50);
                let knocked = 0.3 + (items.weapons[player.weapons[0]].knock || 0);
                let dirs = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
                let iXy = {
                    x: near.x2 + knocked * Math.cos(dirs) * 224,
                    y: near.y2 + knocked * Math.sin(dirs) * 224
                };
                if (near.dist2 < items.weapons[player.weapons[0]].range + 70 && !nTrap && near) {
                    this.findSpikeHit.x = iXy.x;
                    this.findSpikeHit.y = iXy.y;
                }
                this.findSpikeHit.spikes = gameObjects.filter(e => e.active && e.dmg && e.owner.sid == player.sid && UTILS.getDistance(e.x, e.y, iXy.x, iXy.y) <= 35 + e.scale);
                for (let i = 0; i < this.findSpikeHit.spikes.length; i++) {
                    let obj = this.findSpikeHit.spikes[i];
                    const pSdist = UTILS.getDist(player, obj, 0, 0);
                    const nSdist = UTILS.getDist(near, obj, 0, 0);
                    const nSdist2 = UTILS.getDist(obj, near, 0, 0);
                    if (pSdist > nSdist && nSdist2 < 35 + obj.scale + player.scale && (player.primaryDmg >= 35 && player.skinIndex != 6 || player.primaryDmg >= 51)) {
                        if (obj && !nTrap && near && near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && player.reloads[player.weapons[0]] == 0) {
                            this.findSpikeHit.canHit = true;
                            this.findSpikeHit.spikePosX = obj.x;
                            this.findSpikeHit.spikePosY = obj.y;
                            if (this.findSpikeHit.canHit) {
                                instaC.canSpikeTick = true;
                                instaC.syncHit = true;
                                if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                    instaC.revTick = true;
                                }
                            }
                            smartTick(() => {
                                smartTick(() => {
                                    this.findSpikeHit.spikePosX = 0;
                                    this.findSpikeHit.spikePosY = 0;
                                    this.findSpikeHit.canHit = false;
                                });
                            });
                        }
                    } else {
                        this.findSpikeHit.spikePosX = 0;
                        this.findSpikeHit.spikePosY = 0;
                        this.findSpikeHit.canHit = false;
                    }
                }
            }
        };
    }
}
let predictObjects = [];
function checkPlacementLimit(item) {
    if (!item) {
        return false;
    }
    const groupId = item.group?.id;
    const count = player.itemCounts[groupId] ?? 0;
    const limit = config.isSandbox ? 299 : item.group?.limit ?? 99;
    return count < limit;
}
function getConfig(id, angle, useVelocity = false) {
    const item = items.list[id];
    if (!item) {
        return null;
    }
    const dist = 35 + item.scale + (item.placeOffset || 0);
    return {
        x: player.x2 + (useVelocity ? player.xVel : 0) + Math.cos(angle) * dist,
        y: player.y2 + (useVelocity ? player.yVel : 0) + Math.sin(angle) * dist,
        scale: item.scale
    };
}
function canPlace(id, angle, objects = gameObjects, useVelocity = false) {
    const item = items.list[id];
    if (!item) {
        return false;
    }
    if (!checkPlacementLimit(item)) {
        return false;
    }
    const cfg = getConfig(id, angle, useVelocity);
    if (!cfg) {
        return false;
    }
    return objectManager.checkItemLocation(cfg.x, cfg.y, cfg.scale, 0.6, id, false, player, objects);
}
function checkPredictObjects(angles) {
    for (let object of angles.filter(object => object.perfect)) {
        addPredictObject(object.id, object.angle, false);
    }
    for (let object of angles.filter(object => object.placeable)) {
        addPredictObject(object.id, object.angle, false);
    }
}
function getPerfectAngles(angles) {
    for (let i in angles) {
        angles[i].perfect = false;
        if (i < 1) {
            continue;
        }
        if (angles[i].placeable && !angles[i - 1].placeable) {
            angles[i].perfect = true;
        }
        if (angles[i - 1].placeable && !angles[i].placeable) {
            angles[i - 1].perfect = true;
        }
    }
}
function addPredictObject(id, angle, preplace = false) {
    const cfg = getConfig(id, angle);
    if (!cfg) {
        return;
    }
    for (const o of predictObjects) {
        if (UTILS.getDistance(cfg.x, cfg.y, o.x, o.y) < cfg.scale + o.scale) {
            return;
        }
    }
    predictObjects.push({
        id,
        angle,
        x: cfg.x,
        y: cfg.y,
        scale: cfg.scale,
        preplace
    });
}
function findBestAngle(id, aimAngle) {
    const maxSweep = Math.PI / 2;
    const coarseStep = Math.PI / 24;
    const fineStep = Math.PI / 48;
    let bestAngle = null;
    const tested = [];
    function test(angle) {
        const ok = canPlace(id, angle);
        tested.push({
            id,
            angle,
            placeable: ok
        });
        if (ok && bestAngle === null) {
            bestAngle = angle;
        }
        return ok;
    }
    if (test(aimAngle)) {
        return {
            angle: aimAngle,
            tested
        };
    }
    for (let off = coarseStep; off <= maxSweep; off += coarseStep) {
        for (const a of [aimAngle + off, aimAngle - off]) {
            if (test(a)) {
                for (let f = -coarseStep; f <= coarseStep; f += fineStep) {
                    test(a + f);
                }
            }
        }
    }
    return {
        angle: bestAngle,
        tested
    };
}
function AngleFinderPlace(id, aimAngle) {
    const res = findBestAngle(id, aimAngle);
    if (res.angle !== null) {
        place(id, res.angle, 1);
        return true;
    }
    return false;
}
function secondaryCheck(id, radian) {
    try {
        var item = items.list[id];
        var tmpS = player.scale + item.scale + (item.placeOffset || 0);
        var tmpX = player.x2 + tmpS * Math.cos(radian);
        var tmpY = player.y2 + tmpS * Math.sin(radian);
        if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
            if (
                player.itemCounts[item.group.id] == undefined
                    ? true
                    : player.itemCounts[item.group.id] <
                    (true
                        ? 99
                        : item.group.limit
                            ? 99
                            : 99)
            ) {
                return true
            }
        }
    } catch (e) {

    }
}

const AngleSystem = new (class {
    constructor() {
        this.TAU = Math.PI * 2;
    }

    normalize(angle) {
        angle %= this.TAU;
        return angle < 0 ? angle + this.TAU : angle;
    }

    angleDiff(a, b) {
        let d = Math.abs(a - b) % this.TAU;
        return d > Math.PI ? this.TAU - d : d;
    }

    clamp(angle) {
        while (angle < 0) angle += this.TAU;
        while (angle >= this.TAU) angle -= this.TAU;
        return angle;
    }

    midpoint(a, b) {
        let d = this.angleDiff(a, b);
        return this.normalize(a + d / 2 * (this.normalize(b - a) > Math.PI ? -1 : 1));
    }

    fullSweep(step = Math.PI / 36) {
        let angles = [];
        for (let a = 0; a < this.TAU; a += step) {
            angles.push(this.normalize(a));
        }
        return angles;
    }

    partialSweep(center, range, step = Math.PI / 36) {
        let angles = [];
        let start = center - range;
        let end = center + range;

        for (let a = start; a <= end; a += step) {
            angles.push(this.normalize(a));
        }
        return angles;
    }

    buildBlockedAngles({ objects, origin, itemScale, extraOffset = 0 }) {
        let blocked = [];

        for (let o of objects) {
            if (!o.active) continue;

            let dx = o.x - origin.x;
            let dy = o.y - origin.y;
            let d = Math.hypot(dx, dy);

            let scale = o.isItem
                ? o.scale
                : (o.scale !== 80 && o.scale !== 85 && o.scale !== 90 || o.type === 1)
                    ? o.scale * 0.4
                    : o.scale;

            let r = itemScale + scale + extraOffset;

            if (d <= r) continue;

            let base = Math.atan2(dy, dx);
            let phi = Math.acos(Math.min(1, r / d));
            if (isNaN(phi)) continue;

            let a1 = this.normalize(base - phi);
            let a2 = this.normalize(base + phi);

            if (a1 > a2) {
                blocked.push([a1, this.TAU]);
                blocked.push([0, a2]);
            } else {
                blocked.push([a1, a2]);
            }
        }

        return this.mergeAngles(blocked);
    }

    mergeAngles(angles) {
        if (!angles.length) return [];

        angles.sort((a, b) => a[0] - b[0]);

        let merged = [angles[0]];
        for (let i = 1; i < angles.length; i++) {
            let last = merged[merged.length - 1];
            if (last[1] >= angles[i][0]) {
                last[1] = Math.max(last[1], angles[i][1]);
            } else {
                merged.push(angles[i]);
            }
        }
        return merged;
    }

    getFreeAngles(blocked) {
        let free = [];
        let last = 0;

        for (let b of blocked) {
            if (b[0] > last) free.push([last, b[0]]);
            last = b[1];
        }

        if (last < this.TAU) free.push([last, this.TAU]);

        return free;
    }

    validateAngles(angles, validateFn, maxCount = Infinity) {
        let valid = [];
        for (let a of angles) {
            if (validateFn(a)) {
                valid.push(this.normalize(a));
                if (valid.length >= maxCount) break;
            }
        }
        return valid;
    }

    gatherAngles({ sweepAngles, validateFn, maxCount = Infinity }) {
        return this.validateAngles(sweepAngles, validateFn, maxCount);
    }

    bestAngle(freeAngles, target) {
        if (!freeAngles.length) return target;

        let best = target;
        let bestScore = -Infinity;

        for (let [a1, a2] of freeAngles) {
            let mid = (a1 + a2) * 0.5;
            let width = a2 - a1;
            let score = width * 2 - this.angleDiff(mid, target);

            if (score > bestScore) {
                bestScore = score;
                best = this.normalize(mid);
            }
        }
        return best;
    }

    closestAngle(angles, target) {
        if (!angles.length) return target;

        let best = angles[0];
        let bestDist = this.angleDiff(best, target);

        for (let a of angles) {
            let d = this.angleDiff(a, target);
            if (d < bestDist) {
                bestDist = d;
                best = a;
            }
        }
        return best;
    }

    smartSearch({ target, step = Math.PI / 42, maxRange = Math.PI, validateFn }) {
        if (validateFn(target)) return target;

        let steps = Math.floor(maxRange / step);

        for (let i = 1; i <= steps; i++) {
            let off = i * step;

            let a1 = this.normalize(target + off);
            if (validateFn(a1)) return a1;

            let a2 = this.normalize(target - off);
            if (validateFn(a2)) return a2;
        }
        return null;
    }
})();


class Traps {
    constructor(UTILS, items) {
        this.dist = 0;
        this.aim = 0;
        this.inTrap = false;
        this.replaced = false;
        this.antiTrapped = false;
        this.canAppleInsta = false;
        this.info = {};
        this._syncLoop = false;
        this._currentServerTick = 0;
        this.preplaceLatch = { // buffer
            active: false,
            angle: 0,
            buildId: 4,
            expireTick: 0
        };

        this.notFast = function () {
            return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
        };

        this.testCanPlace = function (id, first = -(Math.PI / 2), repeat = Math.PI / 2, plus = Math.PI / 18, radian, replacer, yaboi) {
            try {
                let item = items.list[player.items[id]];
                let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                let counts = {
                    attempts: 0,
                    placed: 0
                };
                let tmpObjects = [];
                gameObjects.forEach(p => {
                    tmpObjects.push({
                        x: p.x,
                        y: p.y,
                        active: p.active,
                        blocker: p.blocker,
                        scale: p.scale,
                        isItem: p.isItem,
                        type: p.type,
                        colDiv: p.colDiv,
                        getScale: function (sM, ig) {
                            sM = sM || 1;
                            return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : sM * 0.6) * (ig ? 1 : this.colDiv);
                        }
                    });
                });
                for (let i = first; i < repeat; i += plus) {
                    counts.attempts++;
                    let relAim = radian + i;
                    let tmpX = player.x2 + tmpS * Math.cos(relAim);
                    let tmpY = player.y2 + tmpS * Math.sin(relAim);
                    let cantPlace = tmpObjects.find(tmp => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                    if (cantPlace) {
                        continue;
                    }
                    if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) {
                        continue;
                    }
                    if (!replacer && yaboi) {
                        if (yaboi.inTrap) {
                            if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                place(2, relAim, 1);
                            } else if (player.items[4] == 15) {
                                place(4, relAim, 1);
                            }
                        } else if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                            place(2, relAim, 1);
                        } else if (player.items[4] == 15) {
                            place(4, relAim, 1);
                        }
                    } else {
                        place(id, relAim, 1);
                    }
                    tmpObjects.push({
                        x: tmpX,
                        y: tmpY,
                        active: true,
                        blocker: item.blocker,
                        scale: item.scale,
                        isItem: true,
                        type: null,
                        colDiv: item.colDiv,
                        getScale: function () {
                            return this.scale;
                        }
                    });
                    if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                        counts.placed++;
                    }
                }
                if (counts.placed > 0 && replacer && item.dmg) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.spikeTick && [4, 5].includes(player.primaryIndex)) {
                        instaC.canSpikeTick = true;
                    }
                }
            } catch (err) { }
        };
        this.checkSpikeTick = function () {
            try {
                if (![3, 4, 5].includes(near.primaryIndex)) {
                    return false;
                }
                if (true || autoPush.active ? false : near.primaryIndex == undefined ? true : near.reloads[near.primaryIndex] > game.tickRate) {
                    return false;
                }
                // more range for safe. also testing near.primaryIndex || 5
                if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.8) {
                    let item = items.list[9];
                    let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                    let danger = 0;
                    let counts = {
                        attempts: 0,
                        block: `unblocked`
                    };
                    for (let i = -1; i <= 1; i += 1 / 10) {
                        counts.attempts++;
                        let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                        let tmpX = near.x2 + tmpS * Math.cos(relAim);
                        let tmpY = near.y2 + tmpS * Math.sin(relAim);
                        let cantPlace = gameObjects.find(tmp => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                        if (cantPlace) {
                            continue;
                        }
                        if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) {
                            continue;
                        }
                        danger++;
                        dangerAids++;
                        counts.block = `blocked`;
                        break;
                    }
                    if (danger) {
                        my.anti0Tick = 4;
                        buyEquip(6, 0);
                        buyEquip(6, 0);
                        buyEquip(6, 0);
                        player.chat.message = "AntiSpikeTick " + near.sid;
                        player.chat.count = 2000;
                        return true;
                    }
                }
            } catch (err) {
                return null;
            }
            return false;
        };
        this.protect = function (aim, angles) {
            if (!configs.antiTrap || !enemy.length) {
                return;
            }
            let wowie = aim + Math.PI;
            this.tryPlaceItem(2, -Math.PI / 2, Math.PI / 2, Math.PI / 18, wowie);
            this.tryPlaceItem(3, -Math.PI / 2, Math.PI / 2, Math.PI / 18, wowie);
            if (player.items[4]) {
                this.tryPlaceItem(4, -Math.PI / 2, Math.PI / 2, Math.PI / 18, wowie);
            }
            this.antiTrapped = true;
        };
        this.checkPerfAngle = function (findObj = [], returnDir, pre) {
            const item = items.list[player.items[2]];
            const angle = UTILS.getDirect(near, near.inTrap, 2, 0);
            const perfectPlace = {
                x: near.inTrap.x + Math.cos(angle) * (35 + item.scale),
                y: near.inTrap.y + Math.sin(angle) * (35 + item.scale)
            };
            const bestSpikeAngle = UTILS.getDirect(perfectPlace, player, 0, 2);
            const tmpS = 35 + item.scale + (item.placeOffset ?? 0);
            const playerX = player[pre ? "x3" : "x2"];
            const playerY = player[pre ? "y3" : "y2"];
            const tmpX = playerX + tmpS * Math.cos(bestSpikeAngle);
            const tmpY = playerY + tmpS * Math.sin(bestSpikeAngle);
            const dist = UTILS.getDistance(tmpX, tmpY, near.x3, near.y3);
            if (checkCanPrePlace(2, bestSpikeAngle, findObj) && dist < item.scale + 35) {
                if (!returnDir) {
                    if (player.weapons[0] != 8) {
                        revHit(near.aim3);
                    }
                    place(2, bestSpikeAngle);
                    return true;
                } else {
                    return bestSpikeAngle;
                }
            } else {
                for (let i = 0; i < 15; i++) {
                    const magnitude = (i + 1 >> 1) * 7; // same as Math.ceil(i / 2) * 6
                    const ayochilltfoutyo = i === 0 ? 0 : i % 2 === 1 ? -magnitude : magnitude;
                    const randomAngle = near.aim3 + UTILS.toRad(ayochilltfoutyo);
                    const tmpX2 = playerX + tmpS * Math.cos(randomAngle);
                    const tmpY2 = playerY + tmpS * Math.sin(randomAngle);
                    const dist2 = UTILS.getDistance(tmpX2, tmpY2, near.x2, near.y2);
                    if (checkCanPrePlace(2, randomAngle, findObj) && dist2 < item.scale + 35) {
                        if (!returnDir) {
                            if (player.weapons[0] != 8) {
                                revHit(near.aim2);
                            }
                            place(2, randomAngle);
                            return true;
                        } else {
                            return randomAngle;
                        }
                    }
                }
            }
            return false;
        };

        // angle scanning codes
        this.normalizeAngle = function (a) {
            a %= Math.PI * 2;
            if (a < 0) {
                return a + Math.PI * 2;
            } else {
                return a;
            }
        };

        this.angleDiff = function (a, b) {
            let d = Math.abs(a - b) % (Math.PI * 2);
            if (d > Math.PI) {
                return Math.PI * 2 - d;
            } else {
                return d;
            }
        };

        this.buildBlockedAngles = function (type) {
            let res = [];
            let item = items.list[type];
            if (!item) {
                return res;
            }
            let offset = player.scale + item.scale + (item.placeOffset || 0);
            let objs = gameObjects.filter(o => o.active && UTILS.getDist(o, player, 0, 2) <= offset + o.scale + 80);
            for (let o of objs) {
                let scale = o.isItem ? o.scale : o.scale !== 80 && o.scale !== 85 && o.scale !== 90 || o.type === 1 ? o.scale * 0.4 : o.scale;
                let r = item.scale + scale + 1;
                let d = UTILS.getDist(o, player, 0, 2);
                if (d <= r) {
                    continue;
                }
                let base = Math.atan2(o.y - player.y2, o.x - player.x2);
                let phi = Math.acos(Math.min(1, r / d));
                if (isNaN(phi)) {
                    continue;
                }
                let a1 = this.normalizeAngle(base - phi);
                let a2 = this.normalizeAngle(base + phi);
                if (a1 > a2) {
                    res.push([a1, Math.PI * 2]);
                    res.push([0, a2]);
                } else {
                    res.push([a1, a2]);
                }
            }
            res.sort((a, b) => a[0] - b[0]);
            let merged = [];
            for (let r of res) {
                if (!merged.length || merged[merged.length - 1][1] < r[0]) {
                    merged.push([r[0], r[1]]);
                } else {
                    merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
                }
            }
            return merged;
        };

        this.getFreeAngles = function (blocked) {
            let free = [];
            let last = 0;
            for (let b of blocked) {
                if (b[0] > last) {
                    free.push([last, b[0]]);
                }
                last = b[1];
            }
            if (last < Math.PI * 2) {
                free.push([last, Math.PI * 2]);
            }
            return free;
        };

        this.getBestAngle = function (type, target) {
            let blocked = this.buildBlockedAngles(type);
            if (!blocked.length) {
                return target;
            }
            let free = this.getFreeAngles(blocked);
            if (!free.length) {
                return target;
            }
            let best = target;
            let bestScore = -1000000000;
            for (let f of free) {
                let mid = (f[0] + f[1]) * 0.5;
                let width = f[1] - f[0];
                let score = width * 2 - this.angleDiff(mid, target);
                if (score > bestScore) {
                    bestScore = score;
                    best = mid;
                }
            }
            return best;
        };

        this.tryPlaceSmart = function (id, aimAngle) {
            const step = Math.PI / 42;
            const maxSteps = Math.floor(Math.PI / step);
            if (canPlace(id, aimAngle)) {
                place(id, aimAngle, 1);
                return true;
            }
            for (let i = 1; i <= maxSteps; i++) {
                const off = i * step;
                if (canPlace(id, aimAngle + off)) {
                    place(id, aimAngle + off, 1);
                    return true;
                }
                if (canPlace(id, aimAngle - off)) {
                    place(id, aimAngle - off, 1);
                    return true;
                }
            }
            return false;
        };

        this.tryPlaceItem = function (itemId, target, useSmart = true, smartFirst = false) {
            if (!itemId) {
                return false;
            }
            const item = items.list[itemId];
            if (!checkPlacementLimit(item)) {
                return false;
            }
            const aimAngle = UTILS.getDirect(target, player, 0, 2);
            if (smartFirst && useSmart) {
                if (this.tryPlaceSmart(itemId, aimAngle)) {
                    return true;
                }
                return AngleFinderPlace(itemId, aimAngle);
            }
            if (AngleFinderPlace(itemId, aimAngle)) {
                return true;
            }
            if (useSmart) {
                return this.tryPlaceSmart(itemId, aimAngle);
            }
            return false;
        };

        this.autoPlace = function () {
            if (config.isSandbox && configs.autoPlace) {
                if (secPacket > 70) return;
                let near2 = { inTrap: false };
                const nearInTrap = liztobj.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= near.scale + e.getScale() + 5).sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))[0];
                if (nearInTrap) near2.inTrap = true;
                if (near.dist2 > 450 || player.items[4] !== 15) return;
                const baseAim = near.aim2;

                const sweepAndPlace = ({ center, range, step, itemId }) => {
                    const sweep = range === null ? AngleSystem.fullSweep(step) : AngleSystem.partialSweep(center, range, step);
                    const valid = AngleSystem.gatherAngles({
                        sweepAngles: sweep.map(a => AngleSystem.normalize(a + center)),
                        validateFn: a => checkCanPlace(itemId, a),
                        maxCount: 4
                    });

                    for (let a of valid) {
                        place(itemId, a, 1);
                    }
                };

                if (near.dist2 <= 138 && traps.canAppleInsta) {
                    this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 36, baseAim, 0);
                    sweepAndPlace({ center: baseAim, range: null, step: Math.PI / 36, itemId: 2 });
                } else {
                    if (near2.inTrap) {
                        if (near.dist3 <= 130) {
                            this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 36, baseAim, 0);
                        }

                        const range = near.dist2 <= 220 ? Math.PI / 1.5 : null;
                        sweepAndPlace({ center: baseAim, range, step: Math.PI / 36, itemId: 2 });
                    } else if (player.items[4] === 15 && near.dist3 <= 450) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, baseAim);
                        sweepAndPlace({ center: baseAim, range: null, step: Math.PI / 24, itemId: 4 });
                    } else if (near.dist2 <= 150) {
                        sweepAndPlace({ center: baseAim, range: Math.PI / 1.5, step: Math.PI / 36, itemId: 2 });
                    } else {
                        sweepAndPlace({ center: baseAim, range: Math.PI / 1.5, step: Math.PI / 1.5, itemId: 2 });
                    }
                }

                placeReset++;
            } else if (config.isNormal && configs.autoPlace && !boostSpike) {
                // all rest here second part of autoplace
                let perfSpike;
                let perfSpikeAngle;
                let trapSpike;
                if (near && near.dist2) {
                    /*if (true) {*/
                    let placedOnPerfectAngle = false;
                    const itemZpyke = items.list[player.items[2]];
                    const itemTarp = items.list[player.items[4]];
                    if (near.inTrap) {
                        placedOnPerfectAngle = this.checkPerfAngle();
                        if (!placedOnPerfectAngle) {
                            if (near.dist2 <= 270) {
                                const direct = UTILS.getDirect(player, near.inTrap, 2, 0);
                                if (!checkPlace(2, direct)) {
                                    checkPlace(2, direct - Math.random() * 0.5 - 0.25);
                                    checkPlace(2, direct + Math.random() * 0.5 - 0.25);
                                }
                            }
                        }
                    } else {
                        let placed = false;
                        let tmpSZpyke = 30 + itemZpyke.scale;
                        let possiblePlaceAngles = [];
                        if (near.dist3 <= tmpSZpyke + 40) {
                            const dx = near.x2 - player.x;
                            const dy = near.y2 - player.y;
                            const dist = Math.hypot(dx, dy); // or Math.sqrt(dx*dx + dy*dy)
                            const radius = 35 + itemZpyke.scale;
                            const angleDiffEdge = Math.asin(radius / dist);
                            const ouchies = liztobj.filter(e => e.dmg && !e.isTeamObject(near) && e.active || e.type == 1 && e.y >= 12000);
                            const step = 0.25;
                            const maxOffset = Math.min(angleDiffEdge, 3);
                            let indx = 0;
                            while (indx * step / 2 <= maxOffset) {
                                const jump = indx === 0 ? 0 : (indx % 2 === 1 ? -1 : 1) * Math.ceil(indx / 2) * step;
                                const randomAngle = near.aim3 + jump;
                                indx++;
                                const placePos = {
                                    x: player.x2 + tmpSZpyke * Math.cos(randomAngle),
                                    y: player.y2 + tmpSZpyke * Math.sin(randomAngle)
                                };
                                const bounceDirection = UTILS.getDirect(near, placePos, 2, 0);
                                const bouncePos = {
                                    x: near.x3 + Math.cos(bounceDirection) * 45,
                                    y: near.y3 + Math.sin(bounceDirection) * 45
                                };
                                const hitSpike = ouchies.filter(e => UTILS.getDist(e, bouncePos, 0, 0) <= e.realScale + 35);
                                for (let i = 0; i < hitSpike.length; i++) {
                                    let a = hitSpike[i];
                                    if (UTILS.getDist(placePos, near, 0, 2) <= radius) {
                                        const newBouncePos = {
                                            x: near.x3 + Math.cos(bounceDirection + Math.PI) * 40,
                                            y: near.y3 + Math.sin(bounceDirection + Math.PI) * 40
                                        };
                                        if (ouchies.find(b => !hitSpike.some(h => h.sid === b.sid) && UTILS.getDist(bouncePos, b) <= b.scale + 45)) {
                                            selectToBuild(2);
                                            sendAtck2(1, randomAngle + Math.random() * 0.3 - 0.15);
                                            sendAtck2(1, randomAngle + Math.random() * 0.3 - 0.15);
                                            sendAtck2(1, randomAngle + Math.random() * 0.3 - 0.15);
                                            instaC.canSpikeTick = true;
                                            placed = true;
                                            return;
                                        }
                                    }
                                }
                                if (hitSpike.length) {
                                    possiblePlaceAngles.push({
                                        diff: UTILS.getAngleDist(placePos, near.aim3),
                                        angle: randomAngle,
                                        obj: hitSpike[0]
                                    });
                                }
                            }
                            if (possiblePlaceAngles.length) {
                                if (possiblePlaceAngles.length > 1) {
                                    let bestPos = possiblePlaceAngles.sort((a, b) => b.diff - a.diff)[0];
                                    selectToBuild(2);
                                    sendAtck2(1, bestPos.aim + Math.random() * 0.3 - 0.15);
                                    sendAtck2(1, bestPos.aim + Math.random() * 0.3 - 0.15);
                                    sendAtck2(1, bestPos.aim + Math.random() * 0.3 - 0.15);
                                    instaC.canSpikeTick = true;
                                    placed = true;
                                    return;
                                } else {
                                    selectToBuild(2);
                                    const aim = possiblePlaceAngles[0].aim;
                                    sendAtck2(1, aim + Math.random() * 0.3 - 0.15);
                                    sendAtck2(1, aim + Math.random() * 0.3 - 0.15);
                                    sendAtck2(1, aim + Math.random() * 0.3 - 0.15);
                                    instaC.canSpikeTick = true;
                                    placed = true;
                                    return;
                                }
                            }
                        }
                        let placedTrap = false;
                        if (!placed) {
                            perfSpikeAngle = undefined;
                            if (player.items[4] == 15 && near.dist3 <= 125) {
                                let item = items.list[15];
                                let tmp = {
                                    x: undefined,
                                    y: undefined
                                };
                                tmp.x = player.x3 + Math.cos(near.aim3) * 80;
                                tmp.y = player.y3 + Math.sin(near.aim3) * 80;
                                let trapScale = 10;
                                if (UTILS.getDist(tmp, near, 0, 3) <= 45) {
                                    if (!checkPlace(4, near.aim2)) {
                                        for (let i = 0; i < 5; i++) {
                                            const magnitude = (i + 1 >> 1) * 10; // same as Math.ceil(i / 2) * 6
                                            const ayochilltfoutyo = i === 0 ? 0 : i % 2 === 1 ? -magnitude : magnitude;
                                            const randomAngle = near.aim3 + UTILS.toRad(ayochilltfoutyo);
                                            if (checkCanPlace(4, randomAngle) && Math.hypot(near.x - (player.x3 + Math.cos(randomAngle) * 80), near.y - (player.y3 + Math.sin(randomAngle) * 80)) <= 45) {
                                                placedTrap = true;
                                                checkPlace(4, randomAngle);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (!placedTrap) {
                                if (near.dist2 <= (player.items[4] && player.items[4] == 16 ? 130 : 100) || near.dist3 <= (player.items[4] && player.items[4] == 16 ? 115 : 95)) {
                                    checkPlace(2, near.aim2 + Math.PI + Math.random() * 0.4 - 0.2);
                                    checkPlace(2, near.aim2 - Math.PI / 3 + Math.random() * 0.4 - 0.2);
                                    checkPlace(2, near.aim2 + Math.PI / 3 + Math.random() * 0.4 - 0.2);
                                } else if (near.dist2 <= 150 || near.dist3 <= 130) {
                                    checkPlace(2, near.aim2 - Math.PI / 0.75 + Math.random() * 0.4 - 0.2);
                                    checkPlace(2, near.aim2 + Math.PI / 0.75 + Math.random() * 0.4 - 0.2);
                                    if (!macro.f && (configs.autoBoost || player.items[4] == 15)) {
                                        checkPlace(4, near.aim2 + Math.random() * 0.5 - 0.25);
                                    }
                                } else if (!macro.f && near.dist3 <= (configs.chasePlacer ? 140 : 190) && player.items[4] && player.items[4] == 15) {
                                    checkPlace(4, near.aim2 + Math.random() * 2 - 1);
                                } else if (!configs.chasePlacer && near.dist2 <= 250 && player.items[4] && player.items[4] == 15) {
                                    if (!macro.f) {
                                        checkPlace(4, near.aim2 - Math.PI / 3 + Math.random() * 0.5 - 0.25);
                                    }
                                    if (!macro.f) {
                                        checkPlace(4, near.aim2 + Math.PI / 3 + Math.random() * 0.5 - 0.25);
                                    }
                                }
                            }
                        }
                    }
                } else if (true) {
                    if (near.dist2 && near.dist2 <= 90) {
                        if (checkCanPlace(2, near.aim2 + Math.PI) && checkCanPlace(2, near.aim2 + Math.PI + Math.PI / 1.5) && checkCanPlace(2, near.aim2 + Math.PI + Math.PI / 1.5)) {
                            checkPlace(2, near.aim2 + Math.PI);
                            checkPlace(2, near.aim2 + Math.PI + Math.PI / 1.5);
                            checkPlace(2, near.aim2 + Math.PI - Math.PI / 1.5);
                        } else {
                            checkPlace(2, near.aim2);
                            checkPlace(2, near.aim2 + Math.PI / 1.5);
                            checkPlace(2, near.aim2 - Math.PI / 1.5);
                        }
                    }
                }
            }
        };

        this.omgcooldmg = function (obj, user) {
            let wIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
            let wId = user.weapons[wIndex];
            if (player.reloads[wId] || !user.visible) return 0;
            let w = items.weapons[wId];
            if (!w) return 0;
            let inRange = UTILS.getDist(obj.x, obj.y, user.x2, user.y2) <= obj.scale + w.range;
            return inRange ? w.dmg * (w.sDmg || 1) * 3.3 : 0;
        };

        this.preplacer = function () {
            if (!inGame || !configs.autoPrePlace || !player || !enemy.length || !gameObjects.length) return;

            let breakables = [];
            for (let obj of gameObjects) {
                if (!obj.active || obj.health <= 0) continue;
                if (UTILS.getDist(obj, player, 0, 2) > player.scale + obj.scale * 2) continue;
                if (obj.health <= this.omgcooldmg(obj, player)) breakables.push(obj);
            }

            if (!breakables.length) {
                this.preplaceLatch.active = false;
                this.preplaceLatch.targetId = null;
                return;
            }

            breakables.sort((a, b) => a.health - b.health);
            let targets = breakables.slice(0, 2);
            let priorities = this.preplaceAngle(breakables, breakables[0]);

            for (let g of targets) {
                let angle = Math.atan2(g.y - player.y2, g.x - player.x2);
                let nearTrap = gameObjects.filter(o => o.trap && o.active && o.isTeamObject(player) && UTILS.getDist(o, g, 0, 2) <= g.scale + o.getScale() + 15).sort((a, b) => UTILS.getDist(a, g, 0, 2) - UTILS.getDist(b, g, 0, 2))[0];

                let buildId = 4;
                if (traps.inTrap) {
                    for (let p of priorities) {
                        if (p === "spike") {
                            buildId = 2;
                            break;
                        }
                    }
                } else if (nearTrap && [6, 7, 8].includes(player.primaryIndex)) {
                    buildId = 2;
                } else if (!traps.inTrap && near.dist3 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.8 && [4, 5].includes(player.primaryIndex) && checkRel("pri", player)) {
                    buildId = 2;
                } else if (!traps.inTrap && nearTrap && checkRel("pri", player) && ![6, 7, 8].includes(player.primaryIndex)) {
                    buildId = 2;
                } else {
                    for (let p of priorities) {
                        if (p === "spike") {
                            buildId = 2;
                            break;
                        }
                    }
                }

                this.preplaceLatch.active = true;
                this.preplaceLatch.angle = angle;
                this.preplaceLatch.buildId = buildId;
                this.preplaceLatch.targetId = g.id;
                this.preplaceLatch.expireTick = this._currentServerTick + 1;
            }

            if (!this.preplaceLatch.active) return;

            let valid = gameObjects.some(o => o.id === this.preplaceLatch.targetId && o.active && o.health > 0);
            if (!valid) {
                this.preplaceLatch.active = false;
                return;
            }

            if (this._currentServerTick <= this.preplaceLatch.expireTick && near.dist2 <= 300) {
                place(this.preplaceLatch.buildId, this.preplaceLatch.angle);
                woawAvisual(this.preplaceLatch.buildId, this.preplaceLatch.angle);
            } else {
                this.preplaceLatch.active = false;
            }
        };

        this.syncWithServerTicks = function () { // handle pre-tick
            if (this._syncLoop) return;
            this._syncLoop = true;

            const tickLen = 1000 / 9;
            let lastSentTick = -1;
            const loop = () => {
                if (!this._syncLoop) return;
                const ping = Math.max(0, window.pingTime || 0);
                const now = performance.now();
                const serverNow = now - ping / 2;
                const serverTick = Math.floor(serverNow / tickLen);

                this._currentServerTick = serverTick;
                if (serverTick !== lastSentTick) {
                    lastSentTick = serverTick;
                    if (inGame && configs.autoPrePlace && enemy.length) this.preplacer();
                }
                const nextTickTime = (serverTick + 1) * tickLen;
                const nextSendTime = nextTickTime + ping / 2 - 2;
                const delay = Math.max(1, nextSendTime - performance.now());
                setTimeout(loop, delay);
            };
            loop();
        };

        // angle scanning codes
        this.createTempObject = function () {
            return { x: 0, y: 0, scale: 0 }
        };
        this.getPosFromAngle = function (item, angle) {
            let x, y, scale;
            item = items.list[item];
            x = player.x2 + (item.scale + player.scale + (item.placeOffset || 0)) * Math.cos(angle);
            y = player.y2 + (item.scale + player.scale + (item.placeOffset || 0)) * Math.sin(angle);
            scale = item.scale;
            return {
                x,
                y,
                scale
            };
        };
        this.manageAngles = function (angles) {
            angles.sort((a, b) => a[0] - b[0]);
            let mergedAngles = [angles[0]];
            for (let i = 1; i < angles.length; i++) {
                let last = mergedAngles[mergedAngles.length - 1];
                if (last[1] >= angles[i][0]) {
                    last[1] = Math.max(last[1], angles[i][1]);
                } else {
                    mergedAngles.push(angles[i]);
                }
            }
            return mergedAngles;
        }
        this.makeAngles = function (building, type) {
            let buildings = building.filter(obj => UTILS.getDist(obj, player, 0, 2) <= player.scale + items.list[type].scale + obj.scale + 50 && obj.active);
            let allAngles = [], scale, offset = player.scale + items.list[type].scale + (items.list[type].placeOffset || 0);
            for (let i = 0; i < buildings.length; i++) {
                let scale
                if (!buildings[i].isItem) {
                    if ((buildings[i].scale != 80 && buildings[i].scale != 85 && buildings[i].scale != 90 || buildings[i].type == 1)) {
                        scale = buildings[i].scale * 0.40

                    } else {
                        scale = buildings[i].scale
                    }
                } else {
                    scale = buildings[i].scale
                }
                let angles = [], dist = (items.list[type].scale + scale + 1), dPTB = UTILS.getDist(buildings[i], player, 0, 2), cosLaw;
                if (dPTB > dist + offset) {
                    cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dist, 2)) - Math.pow(dPTB, 2)) / (2 * dist * offset))
                    cosLaw = Math.asin((dist * Math.sin(cosLaw)) / dPTB)
                } else {
                    cosLaw = Math.acos(((Math.pow(offset, 2) + Math.pow(dPTB, 2)) - Math.pow(dist, 2)) / (2 * dPTB * offset))
                }
                let aPTB = Math.atan2(buildings[i].y - player.y2, buildings[i].x - player.x2)
                let ang1 = (aPTB - cosLaw), ang2 = (aPTB + cosLaw)
                if (!isNaN(cosLaw)) {
                    angles.push(ang1)
                    angles.push(ang2)
                    angles.push(buildings[i])
                }
                allAngles.push(angles)
            }

            for (let i = 0; i < allAngles.length * 3; i++) {
                allAngles = this.manageAngles(allAngles)

            }
            if (!allAngles.length) {
                allAngles = [0, 0.0001]
            }
            for (let i = 0; i < allAngles.length; i++) {
                if (allAngles != false) {
                    if (!secondaryCheck(type, allAngles[i][0]) || !secondaryCheck(type, allAngles[i][1])) {
                        allAngles = false
                    }
                }
            }
            return allAngles
        }
        this.findNearestAngle = function (angles, targetAngle) {
            let closestAngle = null;
            let closestDist = Infinity;
            for (let i = 0; i < angles.length; i++) {
                let angle1 = angles[i][0];
                let angle2 = angles[i][1];
                let dist1 = Math.min(Math.abs(angle1 - targetAngle), 2 * Math.PI - Math.abs(angle1 - targetAngle));
                let dist2 = Math.min(Math.abs(angle2 - targetAngle), 2 * Math.PI - Math.abs(angle2 - targetAngle));
                if (dist1 < closestDist) {
                    closestDist = dist1;
                    closestAngle = angle1;
                }
                if (dist2 < closestDist) {
                    closestDist = dist2;
                    closestAngle = angle2;
                }
            }
            return closestAngle;
        }
        this.calculateAngles = function (initAngleRad) {
            let angles = [initAngleRad];
            for (let i = 1; i < 4; i++) {
                let angleOffset = (Math.PI / 2) * i;
                let newAngle = (initAngleRad + angleOffset) % (2 * Math.PI);
                angles.push(newAngle);
            }
            return angles;
        }
        this.calculateAngle = function (baseAngleRad, numOffsets = 1) {
            numOffsets = Math.min(numOffsets, 3);
            return Array.from({ length: numOffsets + 1 }, (_, i) => {
                let angleOffset = (Math.PI / 2) * i;
                return (baseAngleRad + angleOffset) % (2 * Math.PI);
            });
        }
        this.refineAngles = function (type) {
            const clampAngle = function (angle) {
                while (angle < 0) {
                    angle += 2 * Math.PI;
                }
                while (angle >= 2 * Math.PI) {
                    angle -= 2 * Math.PI;
                }
                return angle;
            }
            let buildings = gameObjects.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x));
            let buildingsInRange = buildings.filter(obj => UTILS.getDist(obj, player, 0, 2) <= player.scale + items.list[type].scale + obj.scale + 50 && obj.active);
            let allAngles = [];
            let offset = player.scale + items.list[type].scale + (items.list[type].placeOffset || 0);
            buildingsInRange.forEach(building => {
                let scale = building.isItem ? building.scale : building.scale !== 80 && building.scale !== 85 && building.scale !== 90 || building.type === 1 ? building.scale * 0.40 : building.scale;
                let dist = items.list[type].scale + scale + 1;
                let dPTB = UTILS.getDist(building, player, 0, 2);
                let cosLaw = (dPTB > dist + offset) ? Math.asin((dist * Math.sin(Math.acos((offset ** 2 + dist ** 2 - dPTB ** 2) / (2 * dist * offset)))) / dPTB) :
                    Math.acos((offset ** 2 + dPTB ** 2 - dist ** 2) / (2 * dPTB * offset));
                let aPTB = Math.atan2(building.y - player.y2, building.x - player.x2);
                let ang1 = clampAngle(aPTB - cosLaw);
                let ang2 = clampAngle(aPTB + cosLaw);
                // we sort angles based on proximity so we can avoid overlapping
                if (!isNaN(ang1) && !isNaN(ang2)) {
                    allAngles.push([ang1, ang2]);
                }
            });
            // now it should return atleast 1 valid angle
            if (allAngles.length > 0) {
                return allAngles.flatMap(anglePair => anglePair).filter(angle => typeof angle === 'number');
            } else {
                return this.calculateAngles(UTILS.getAngle(near, player, 2, 2)); // just incase it allAngles cant find a valid angle
            }
        }
        this.getClosestAngle = function (anglesArray, targetDirection) {
            if (!anglesArray.length) return targetDirection;
            let closestAngle = anglesArray.reduce((closest, current) => {
                return Math.abs(current - targetDirection) < Math.abs(closest - targetDirection) ? current : closest;
            });
            return closestAngle;
        };
        this.preplaceAngle = function (filteredGameObjects, objWithLowestHealth) {
            let priorityResults = [];
            let trapCandidates = [];
            let spikeCandidates = [];
            let buildings = gameObjects.filter(object => UTILS.getDist(object, player, 0, 2) <= 300);
            let spikeAngles = this.refineAngles(2) || this.makeAngles(buildings, player.items[2]);
            let trapAngles = [];
            if (player.items[4]) trapAngles = this.makeAngles(buildings, player.items[4]) || this.refineAngles(4);
            if (traps.inTrap) {
                spikeCandidates = filteredGameObjects
                    .filter(obj => obj.dmg && obj.active && UTILS.getDist(obj, this.info, 0, 0) <= (player.scale + this.info.scale + obj.scale + 5))
                    .sort((a, b) => UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2));
                if (spikeCandidates.length > 0) {
                    let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(spikeCandidates[0], player, 0, 2));
                    priorityResults.push(["spike", spikeCandidates[0], spikeAngle]);
                } else {
                    trapCandidates = filteredGameObjects
                        .filter(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= (near.scale + obj.getScale() + 15))
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                    if (trapCandidates.length > 0) {
                        let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(trapCandidates[0], player, 0, 2));
                        priorityResults.push(["trap", trapCandidates[0], trapAngle]);
                    } else {
                        let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(objWithLowestHealth, player, 0, 2));
                        priorityResults.push(["spike", objWithLowestHealth, spikeAngle]);
                    }
                }
            } else {
                trapCandidates = filteredGameObjects
                    .filter(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= (near.scale + obj.getScale() + 15))
                    .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                if (trapCandidates.length > 0) {
                    let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(trapCandidates[0], player, 0, 2));
                    priorityResults.push(["trap", trapCandidates[0], trapAngle]);
                    spikeCandidates = filteredGameObjects
                        .filter(obj => obj.dmg && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, trapCandidates[0], 0, 0) <= (near.scale + trapCandidates[0].scale + obj.scale + 5))
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                    if (spikeCandidates.length > 0) {
                        let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(spikeCandidates[0], player, 0, 2));
                        priorityResults.push(["spike", spikeCandidates[0], spikeAngle]);
                    }
                } else {
                    let spikeAngle = this.getClosestAngle(spikeAngles, UTILS.getDirect(objWithLowestHealth, player, 0, 2));
                    priorityResults.push(["spike", objWithLowestHealth, spikeAngle]);
                    let secondaryObject = filteredGameObjects.find(obj => obj !== objWithLowestHealth && obj.health > 0);
                    if (secondaryObject) {
                        let trapAngle = this.getClosestAngle(trapAngles, UTILS.getDirect(secondaryObject, player, 0, 2));
                        priorityResults.push(["trap", secondaryObject, trapAngle]);
                    }
                }
            }

            return priorityResults.slice(0, 2);
        };

        this.replacer = function (findobj) {
            if (!findobj || !configs.autoReplace) {
                return;
            }
            if (!inGame) {
                return;
            }
            if (this.antiTrapped) {
                return;
            }
            game.tickBase(() => {
                let objAim = UTILS.getDirect(findobj, player, 0, 2);
                let objDst = UTILS.getDist(findobj, player, 0, 2);
                if (configs.autoGrind && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                if (objDst <= (config.isNormal ? 200 : 400) && near.dist2 <= (config.isNormal ? 200 : 400)) {
                    let danger = this.checkSpikeTick();
                    if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.8) {
                        this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 24, objAim, 1);
                    } else if (player.items[4] == 15) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, objAim, 1);
                    }
                    this.replaced = true;
                }
            }, 1);
        };
    }
};

const TICK_INTERVAL = game.tickRate;

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

let queuedActions = [];

function queueNextTick(fn) {
    queuedActions.push(fn);
}

function flushQueuedActions() {
    const actions = queuedActions;
    queuedActions = [];
    for (let i = 0; i < actions.length; i++) {
        try { actions[i](); } catch (e) { console.error(e); }
    }
}

function runPre() {
    if (!inGame) return;
    if (configs.autoPrePlace) traps.preplacer();
    flushQueuedActions();
}

function tickLoop() {
    let nextTick = performance.now();

    async function loop() {
        nextTick += TICK_INTERVAL;

        runPre();

        let wait = nextTick - performance.now();
        if (wait < 0) wait = 0;

        await delay(wait);
        loop();
    }

    loop();
}
class Instakill {
    constructor() {
        if (secPacket > 60) {
            return;
        }
        this.wait = false;
        this.can = false;
        this.isTrue = false;
        this.nobull = false;
        this.ticking = false;
        this.canSpikeTick = false;
        this.startTick = false;
        this.readyTick = false;
        this.revTick = false;
        this.syncHit = false;
        this.changeType = function (type) {
            this.wait = false;
            this.isTrue = true;
            my.autoAim = true;
            if (type == "rev") {
                if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                buyEquip(53, 0);
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    place(2, getAttackDir());
                    if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else if (type == "normal") {
                if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(0, 1);
                sendAutoGather();
                game.tickBase(() => {
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                    let hat = 0;
                    if (player.reloads[53] == 0) hat = 53;
                    else hat = 6;
                    buyEquip(hat, 0);
                    buyEquip(0, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else {
                setTimeout(() => {
                    this.isTrue = false;
                    my.autoAim = false;
                }, 50);
            }
        };

        this.spikeTickType = function () {
            this.isTrue = true;
            my.autoAim = true;
            if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            sendAutoGather();
            game.tickBase(() => {
                if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                buyEquip(53, 0);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };

        this.counterType = function () {
            this.isTrue = true;
            my.autoAim = true;
            if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(53, 0);
                buyEquip(21, 1);
                if ([9, 12, 13, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0) {
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                }
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };

        this.hammerCounterType = function () {
            this.isTrue = true;
            my.autoAim = true;
            if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(7, 0);
                if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[0]);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };

        this.antiCounterType = function () {
            my.autoAim = true;
            this.isTrue = true;
            if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
            buyEquip(6, 0);
            buyEquip(21, 1);
            io.send("D", near.aim2);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                buyEquip(21, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }, 1);
        };
        this.syncTry = function () {
            if (player.reloads[53] == 0) {
                buyEquip(53, 0);
            }
            game.tickBase(() => {
                this.isTrue = true;
                my.autoAim = true;
                if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                sendAutoGather();
                game.tickBase(() => {
                    my.autoAim = false;
                    this.isTrue = false;
                    sendAutoGather();
                }, 1);
            }, 2);
        };
        this.rangeType = function (type) {
            this.isTrue = true;
            my.autoAim = true;
            if (type == "ageInsta") {
                my.ageInsta = false;
                if (player.items[5] == 18) {
                    place(5, near.aim2);
                }
                packet("9", undefined, 1);
                buyEquip(22, 0);
                game.tickBase(() => {
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                    if (player.reloads[53] == 0) {
                        buyEquip(53, 0);
                    }
                    sendAutoGather();
                    game.tickBase(() => {
                        sendUpgrade(12);
                        if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                        if (player.reloads[53] == 0) {
                            buyEquip(53, 0);
                        }
                        game.tickBase(() => {
                            sendUpgrade(15);
                            if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0) {
                                buyEquip(53, 0);
                            }
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }, 1);
                    }, 1);
                }, 1);
            } else {
                if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                    if (player.reloads[53] == 0) {
                        buyEquip(53, 0);
                    }
                } else {
                    buyEquip(20, 0);
                }
                buyEquip(11, 1);
                sendAutoGather();
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }, 1);
            }
        };
        this.oneTickType = function () {
            this.isTrue = true;
            my.autoAim = true;
            if (player.reloads[53] == 0) {
                buyEquip(53, 0);
            }
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                packet("9", near.aim2, 1);
                sendAutoGather();
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("9", undefined, 1);
                }, 1);
            }, 1);
        };
        this.threeOneTickType = function () {
            this.isTrue = true;
            my.autoAim = true;
            if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
            biomeGear();
            buyEquip(1000, 1);
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                buyEquip(1000, 1);
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(1000, 1);
                    sendAutoGather();
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("9", undefined, 1);
                    }, 1);
                }, 1);
            }, 1);
        };
        this.kmTickType = function () {
            this.isTrue = true;
            my.autoAim = true;
            my.revAim = true;
            if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(1000, 1);
            sendAutoGather();
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(1000, 1);
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("9", undefined, 1);
                }, 1);
            }, 1);
        };
        this.boostTickType = function () {
            this.isTrue = true;
            my.autoAim = true;
            this.ticking = true;
            biomeGear();
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                if (player.weapons[1] == 15) {
                    my.revAim = true;
                }
                if (player.weaponIndex !== player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                buyEquip(53, 0);
                if ([9, 12, 13, 15].includes(player.weapons[1])) {
                    sendAutoGather();
                }
                packet("9", near.aim2, 1);
                place(4, near.aim2);
                game.tickBase(() => {
                    my.revAim = false;
                    if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    if (![9, 12, 13, 15].includes(player.weapons[1])) {
                        sendAutoGather();
                    }
                    packet("9", near.aim2, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        this.ticking = false;
                        packet("9", undefined, 1);
                    }, 1);
                }, 1);
            }, 1);
        };
        this.gotoGoal = function (goto, OT) {
            let slowDists = weeeee => weeeee * config.playerScale;
            let goal = {
                a: goto - OT,
                b: goto + OT,
                c: goto - slowDists(1),
                d: goto + slowDists(1),
                e: goto - slowDists(2),
                f: goto + slowDists(2),
                g: goto - slowDists(4),
                h: goto + slowDists(4)
            };
            let bQ = function (wwww, awwww) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                    buyEquip(31, 0);
                } else {
                    buyEquip(wwww, awwww);
                }
            };
            if (enemy.length) {
                boostInstaTick = true;
                let dst = near.dist2;
                this.ticking = true;
                if (dst >= goal.a && dst <= goal.b) {
                    bQ(6, 0);
                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                        if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                    }
                    return {
                        dir: undefined,
                        action: 1
                    };
                } else {
                    if (dst < goal.a) {
                        if (dst >= goal.g) {
                            if (dst >= goal.e) {
                                if (dst >= goal.c) {
                                    bQ(40, 0);
                                    if (false) {
                                        if (player.buildIndex != player.items[1]) {
                                            selectToBuild(player.items[1]);
                                        }
                                    } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                } else {
                                    bQ(40, 0);
                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(40, 0);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2 + Math.PI,
                            action: 0
                        };
                    } else if (dst > goal.b) {
                        if (dst <= goal.h) {
                            if (dst <= goal.f) {
                                if (dst <= goal.d) {
                                    bQ(40, 0);
                                    if (false) {
                                        if (player.buildIndex != player.items[1]) {
                                            selectToBuild(player.items[1]);
                                        }
                                    } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                } else {
                                    bQ(40, 0);
                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                bQ(40, 0);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                if (player.weaponIndex !== player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2,
                            action: 0
                        };
                    }
                    return {
                        dir: undefined,
                        action: 0
                    };
                }
            } else {
                this.ticking = false;
                boostInstaTick = false;
                return {
                    dir: undefined,
                    action: 0
                };
            }
        };
        /** wait 1 tick for better quality */
        this.bowMovement = function () {
            let moveMent = this.gotoGoal(685, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.rangeType("ageInsta");
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        };
        this.tickMovement = function () {
            let moveMent = this.gotoGoal(238, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        };
        this.kmTickMovement = function () {
            let moveMent = this.gotoGoal(240, 3);
            if (moveMent.action) {
                if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % config.serverUpdateRate == 8) {
                    this.kmTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        };
        this.boostTickMovement = function () {
            let moveMent = this.gotoGoal(372, 3);
            if (moveMent.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("9", moveMent.dir, 1);
                }
            } else {
                packet("9", moveMent.dir, 1);
            }
        };
        /** wait 1 tick for better quality */
        this.perfCheck = function (pl, nr) {
            if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) {
                return false;
            }
            if (![9, 12, 13, 15].includes(player.weapons[1])) {
                return true;
            }
            let pjs = {
                x: nr.x2 + Math.cos(nr.aim2 + Math.PI) * 65,
                y: nr.y2 + Math.sin(nr.aim2 + Math.PI) * 65
            };
            if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                return true;
            }
            let finds = ais.filter(tmp => tmp.visible).find(tmp => {
                if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) {
                return false;
            }
            finds = liztobj.filter(tmp => tmp.active).find(tmp => {
                let tmpScale = tmp.getScale();
                if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                    return true;
                }
            });
            if (finds) {
                return false;
            }
            return true;
        };
    }
}
;
class Autobuy {
    constructor(buyHat, buyAcc) {
        this.hat = function () {
            buyHat.forEach(id => {
                let find = findID(hats, id);
                if (find && !player.skins[id] && player.points >= find.price) {
                    packet("c", 1, id, 0);
                }
            });
        };
        this.acc = function () {
            buyAcc.forEach(id => {
                let find = findID(accessories, id);
                if (find && !player.tails[id] && player.points >= find.price) {
                    packet("c", 1, id, 1);
                }
            });
        };
    }
}
;
class Autoupgrade {
    constructor() {
        this.sb = function (upg) {
            upg(3);
            upg(17);
            upg(31);
            upg(23);
            upg(9);
            upg(38);
        };
        this.kh = function (upg) {
            upg(3);
            upg(17);
            upg(31);
            upg(23);
            upg(10);
            upg(38);
            upg(4);
            upg(25);
        };
        this.pb = function (upg) {
            upg(5);
            upg(17);
            upg(32);
            upg(23);
            upg(9);
            upg(38);
        };
        this.ph = function (upg) {
            upg(5);
            upg(17);
            upg(32);
            upg(23);
            upg(10);
            upg(38);
            upg(28);
            upg(25);
        };
        this.db = function (upg) {
            upg(7);
            upg(17);
            upg(31);
            upg(23);
            upg(9);
            upg(34);
        };
        /* old functions */
        this.km = function (upg) {
            upg(7);
            upg(17);
            upg(31);
            upg(23);
            upg(10);
            upg(38);
            upg(4);
            upg(15);
        };
    }
}
;
class Damages {
    constructor(items) {
        // 0.75 1 1.125 1.5
        this.calcDmg = function (dmg, val) {
            return dmg * val;
        };
        this.getAllDamage = function (dmg) {
            return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
        };
        this.weapons = [];
        for (let i = 0; i < items.weapons.length; i++) {
            let wp = items.weapons[i];
            let name = wp.name.split(" ").length <= 1 ? wp.name : wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1];
            this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
            this[name] = this.weapons[i];
        }
    }
}

/** CLASS CODES */
// jumpscare code warn
let tmpList = [];

// LOADING:
let UTILS = new Utils();
let items = new Items();
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();
let sCombat = new Combat(UTILS, items);
let traps = new Traps(UTILS, items);
let spikes = {
    aim: 0,
    shitAim: 0,
    inRange: false,
    info: {}
};
let instaC = new Instakill();
let autoBuy = new Autobuy([6, 15, 31], [11]);
let autoUpgrade = new Autoupgrade();
let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;
let runAtNextTick = [];
function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
    let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
    let projOffset = config.playerScale * 2;
    let projXY = {
        x: indx == 1 ? x : x - projOffset * Math.cos(dir),
        y: indx == 1 ? y : y - projOffset * Math.sin(dir)
    };
    let nearPlayer = players.filter(e => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function (a, b) {
        return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
    })[0];
    if (nearPlayer) {
        if (indx == 1) {
            nearPlayer.shooting[53] = 1;
        } else {
            nearPlayer.shootIndex = weaponIndx;
            nearPlayer.shooting[1] = 1;
            antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
        }
    }
}
let projectileCount = 0;
let projectile = {
    count: 0,
    dmg: 0
};
let musketCount = 0;
// antiProj function with added anti-sync-healing codes
function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
    if (!tmpObj.isTeam(player)) {
        tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
        if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
            tmpObj.bowThreat[weaponIndex]++;
            if (index == 5) {
                musketCount++;
            }
            if (tmpObj.dist2 > 234) {
                projectile.count++;
                projectile.dmg += items.projectiles[index].dmg;
            }
            setTimeout(() => {
                tmpObj.bowThreat[weaponIndex]--;
                musketCount--;
                if (projectile.count > 0) {
                    projectile.count--;
                    projectile.dmg -= items.projectiles[index].dmg;
                }
            }, range / speed);
            if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                if (player.weapons[1] == 11) {
                    packet("D", tmpObj.aim2);
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                } else {
                    place(3, tmpObj.aim2);
                    buyEquip(6, 0);
                    player.chat.message = `bow Detect: ${tmpObj.bowThreat}`;
                    player.chat.count = 2000;
                    if (!my.antiSync) {
                        antiSyncHealing(4);
                        packet("9", tmpObj.aim2 + 3.141592653589793 / 2, 1);
                        game.tickBase(() => {
                            packet("9", undefined, 1);
                        }, 2);
                    }
                }
            } else if (projectileCount >= 2 || projectile.count >= 4) {
                if (player.weapons[1] == 11) {
                    packet("D", tmpObj.aim2);
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(player.weapons[1]);
                } else {
                    place(3, tmpObj.aim2);
                    buyEquip(6, 0);
                    player.chat.message = `projectTick: ${projectileCount}`;
                    player.chat.count = 2000;
                    packet("9", tmpObj.aim2 + 3.141592653589793 / 2, 1);
                    antiSyncHealing(2);
                    game.tickBase(() => {
                        packet("9", undefined, 1);
                    }, 4);
                    if (!my.antiSync) {
                        antiSyncHealing(4);
                    }
                }
            }
        }
    }
}
// SHOW ITEM INFO:
function showItemInfo(item, isWeapon, isStoreItem) {
    if (player && item) {
        UTILS.removeAllChildren(itemInfoHolder);
        itemInfoHolder.classList.add("visible");
        UTILS.generateElement({
            id: "itemInfoName",
            text: UTILS.capitalizeFirst(item.name),
            parent: itemInfoHolder
        });
        UTILS.generateElement({
            id: "itemInfoDesc",
            text: item.desc,
            parent: itemInfoHolder
        });
        if (isStoreItem) {

        } else if (isWeapon) {
            UTILS.generateElement({
                class: "itemInfoReq",
                text: !item.type ? "primary" : "secondary",
                parent: itemInfoHolder
            });
        } else {
            for (let i = 0; i < item.req.length; i += 2) {
                UTILS.generateElement({
                    class: "itemInfoReq",
                    html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                    parent: itemInfoHolder
                });
            }
            if (item.group.limit) {
                UTILS.generateElement({
                    class: "itemInfoLmt",
                    text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                    parent: itemInfoHolder
                });
            }
        }
    } else {
        itemInfoHolder.classList.remove("visible");
    }
}
// GUIDE:
let controllingTouch = {
    id: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
};
let attackingTouch = {
    id: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
};
const guideCard = getEl("guideCard");
const settingsButton = getEl("settingsButton");
let settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
function updateGuide() {
    if (usingTouch) {
        guideCard.classList.add("touch");
    } else {
        guideCard.classList.remove("touch");
    }
}
// idk wha tis
function toggleSettings() {
    if (guideCard.classList.contains("showing")) {
        guideCard.classList.remove("showing");
        settingsButtonTitle.innerText = "Settings";
    } else {
        guideCard.classList.add("showing");
        settingsButtonTitle.innerText = "Close";
    }
}
// RESIZE:
window.addEventListener("resize", UTILS.checkTrusted(resize));
function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
    gameCanvas.width = screenWidth * pixelDensity;
    gameCanvas.height = screenHeight * pixelDensity;
    gameCanvas.style.width = screenWidth + "px";
    gameCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(
        scaleFillNative, 0,
        0, scaleFillNative,
        (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
        (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
    );
}
resize();
const mals = document.getElementById('touch-controls-fullscreen');
mals.style.display = 'block';
// i hard skid antimoo codes here bc i lazy translate bundle code for nice names kekekekke
// TOUCH INPUT:
var usingTouch;
setUsingTouch(false);
function setUsingTouch(using) {
    usingTouch = using;
    updateGuide();
}
window.setUsingTouch = setUsingTouch;
mals.addEventListener("touchmove", UTILS.checkTrusted(touchMove), false);
function touchMove(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (let i = 0; i < ev.changedTouches.length; i++) {
        let t = ev.changedTouches[i];
        if (t.identifier == controllingTouch.id) {
            controllingTouch.currentX = t.pageX;
            controllingTouch.currentY = t.pageY;
            sendMoveDir();
        } else if (t.identifier == attackingTouch.id) {
            attackingTouch.currentX = t.pageX;
            attackingTouch.currentY = t.pageY;
            attackState = 1;
        }
    }
}
mals.addEventListener("touchstart", UTILS.checkTrusted(touchStart), false);
function touchStart(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (let i = 0; i < ev.changedTouches.length; i++) {
        let t = ev.changedTouches[i];
        if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
            controllingTouch.id = t.identifier;
            controllingTouch.startX = controllingTouch.currentX = t.pageX;
            controllingTouch.startY = controllingTouch.currentY = t.pageY;
            sendMoveDir();
        } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
            attackingTouch.id = t.identifier;
            attackingTouch.startX = attackingTouch.currentX = t.pageX;
            attackingTouch.startY = attackingTouch.currentY = t.pageY;
            if (player.buildIndex < 0) {
                attackState = 1;
                clicks.right = !clicks.right;
            }
        }
    }
}
mals.addEventListener("touchend", UTILS.checkTrusted(touchEnd), false);
mals.addEventListener("touchcancel", UTILS.checkTrusted(touchEnd), false);
mals.addEventListener("touchleave", UTILS.checkTrusted(touchEnd), false);
function touchEnd(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setUsingTouch(true);
    for (var i = 0; i < ev.changedTouches.length; i++) {
        var t = ev.changedTouches[i];
        if (t.identifier == controllingTouch.id) {
            controllingTouch.id = -1;
            sendMoveDir();
        } else if (t.identifier == attackingTouch.id) {
            attackingTouch.id = -1;
            if (player.buildIndex >= 0) {
                attackState = 1;
            }
            attackState = 0;
        }
    }
}
mals.addEventListener("mousemove", gameInput, false);
function gameInput(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
let clicks = {
    left: false,
    middle: false,
    right: false
};
mals.addEventListener("mousedown", mouseDown, false);
function mouseDown(e) {
    if (attackState != 1) {
        attackState = 1;
        if (e.button == 0) {
            clicks.left = true;
        } else if (e.button == 1 || e.key === "b") {
            clicks.middle = true;
        } else if (e.button == 2) {
            clicks.right = true;
        }
    }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
function mouseUp(e) {
    if (attackState != 0) {
        attackState = 0;
        if (e.button == 0) {
            clicks.left = false;
        } else if (e.button == 1 || e.key === "b") {
            clicks.middle = false;
        } else if (e.button == 2) {
            clicks.right = false;
        }
    }
}
if (configs.wheelZoom) {
    mals.addEventListener("wheel", wheel, false);
}
/*idk mb is need shit
function wheel(e) {
    if (e.deltaY < 0) {
        configs.zoomLevel -= 0.05;
        maxScreenWidth = config.maxScreenWidth * configs.zoomLevel;
        maxScreenHeight = config.maxScreenHeight * configs.zoomLevel;
        resize();
    } else {
        configs.zoomLevel += 0.05;
        maxScreenWidth = config.maxScreenWidth * configs.zoomLevel;
        maxScreenHeight = config.maxScreenHeight * configs.zoomLevel;
        resize();
    }
}*/

let targetZoom = 1;
let currentZoom = 1;
const zoomSpeed = 0.05;
function wheel(e) {
    const zoomLevel = Math.max(parseFloat(configs.zoomLevel) || 1, 0.5);
    const power = zoomLevel * 0.94;
    if (e.deltaY > 0) {
        targetZoom *= power;
    } else {
        targetZoom /= power;
    }
}
function updateZoom() {
    currentZoom += (targetZoom - currentZoom) * zoomSpeed;
    if (configs.wheelZoom) {
        maxScreenWidth = originalScreenWidth * currentZoom;
        maxScreenHeight = originalScreenHeight * currentZoom;
    } else if (maxScreenWidth !== originalScreenWidth || maxScreenHeight !== originalScreenHeight) {
        maxScreenWidth = originalScreenWidth;
        maxScreenHeight = originalScreenHeight;
    }
    resize();
    requestAnimationFrame(updateZoom);
}
const originalScreenWidth = maxScreenWidth;
const originalScreenHeight = maxScreenHeight;
updateZoom();

// INPUT UTILS:
function getMoveDir() {
    let dx = 0, dy = 0;
    if (controllingTouch.id != -1) {
        dx += controllingTouch.currentX - controllingTouch.startX;
        dy += controllingTouch.currentY - controllingTouch.startY;
    } else {
        for (let key in moveKeys) {
            let tmpDir = moveKeys[key];
            dx += !!keys[key] * tmpDir[0];
            dy += !!keys[key] * tmpDir[1];
        }
    }
    return dx == 0 && dy == 0 ? undefined : UTILS.fixTo(Math.atan2(dy, dx), 2);
}
function getSafeDir() {
    if (!player) {
        return 0;
    }
    if (!player.lockDir) {
        lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
    }
    return lastDir || 0;
}
let plusDir = 0;
let lastSpin = Date.now();
function getAttackDir() {
    if (!player) {
        return 0;
    } else if (game.tick % 3 === 0) {
        plusDir += UTILS.fixTo(Math.random() * Math.PI, 1);
    }
    if (legit) {
        packet("D", getSafeDir());
    } else if (my.autoAim || clicks.left && player.reloads[player.weapons[0]] == 0) {
        lastDir = configs.autoGrind ? getSafeDir() : enemy.length ? near.aim2 : getSafeDir();
    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = getSafeDir();
    } else if (traps.inTrap) {
        return traps.aim;
    } else if (spikes.inRange) {
        return spikes.aim;
    } else if (!autos.stopspin) {
        return plusDir;
    } else if (!player.lockDir) {
        if (configs.lockPlayerDirection) {
            return lastDir;
        }
        if (!player.lockDir && autos.stopspin) {
            lastDir = lastDir;
        }
    }
    return lastDir;
}
function getVisualDir() {
    if (!player) {
        return 0;
    } else if (game.tick % 3 === 0) {
        plusDir += UTILS.fixTo(Math.random() * Math.PI, 1);
    }
    if (legit) {
        packet("D", getSafeDir());
    } else
        // DIR SHIT:
        if (my.autoAim || clicks.left && player.reloads[player.weapons[0]] == 0 && near.dist2 <= 300) {
            if (configs.autoGrind) {
                return getSafeDir();
            } else if (enemy.length) {
                return near.aim2;
            } else {
                return getSafeDir();
            }
        } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            return getSafeDir();
        } else if (!autos.stopspin) {
            return plusDir;
        } else if (traps.inTrap) {
            return traps.aim;
        } else if (spikes.inRange) {
            return spikes.aim;
        } else if (!player.lockDir) {
            if (!player.lockDir && autos.stopspin) {
                lastDir = lastDir;
            }
        }
    lastDir = getSafeDir();
    return lastDir;
}

// KEYS:
const keysActive = () => {
    return allianceMenu.style.display != "block" && chatHolder.style.display != "block";
};
let openMenu = false;
let spikeSpam = false;
let autoPlaceLoop = false;
function toRad(angle) {
    return angle * 0.01745329251;
}
let follow = ang => {
    packet("9", ang);
};
let botBreakAll = true;
let platFormPlacer = false;
let autoPilot = false;
function keyDown(event) {
    let keyNum = event.which || event.keyCode || 0;
    if (player && player.alive && keysActive()) {
        if (!keys[keyNum]) {
            keys[keyNum] = 1;
            macro[event.key] = 1;
            if (event.key == "p") {
                configs.botMovementMode === "Stay";
            } else if (keyNum == 69) {
                sendAutoGather();
            } else if (event.key == "H") {
                botBreakAll = !botBreakAll;
            } else if (keyNum == 67) {
                updateMapMarker();
            } else if (event.key == "O") {
                autoQuadSpike = !autoQuadSpike;
            } else if (event.key == "j") {
                boostSpike = true;
            } else if (event.key == "r") {
                pingMap();
            } else if (event.key == "p") {
                let lastBotMovementMode = null; // stores the memory
                if (configs.botMovementMode !== "Stay") (lastBotMovementMode = configs.botMovementMode, configs.botMovementMode = "Stay");
                else configs.botMovementMode = lastBotMovementMode || "Normal";
            } else if (event.key == "Y") {
                if (autoPilot) {
                    sendChat(`autoPilot: ${autoPilot}.`);
                } else {
                    sendChat(`autoPilot: ${autoPilot}.`);
                }
                autoPilot = !autoPilot;
                if (autoPilot) {
                    pathFind.active = true;
                    pathFind.chaseNear = true;
                } else {
                    pathFind.active = false;
                    pathFind.chaseNear = false;
                }
            } else if (event.key == "L") {
                const botCount = configs.botcount || 1;
                window.spawnBots(botCount);
            } else if (event.key == "U") {
                window.disconnectAll();
            } else if (event.key == "i") {
                let near = null;
                if (enemy.length > 0) {
                    near = enemy.reduce((closest, current) => {
                        if (closest.dist2 < current.dist2) {
                            return closest;
                        } else {
                            return current;
                        }
                    });
                }
                if (near) {
                    for (let bot of allBots) {
                        if (bot) {
                            bot.syncMusket(near);
                        }
                    }
                }
            } else if (event.key == "P") {
                platFormPlacer = !platFormPlacer;
            } else if (event.key === "x") {
                player.lockDir = !player.lockDir;
            } else if (player.weapons[keyNum - 49] != undefined) {
                player.weaponCode = player.weapons[keyNum - 49];
            } else if (moveKeys[keyNum]) {
                sendMoveDir();
            } else if (event.key == "b") {
                autoPlaceLoop = true;
            } else if (event.key == "T" && !legit) {
                framer = !framer;
                let note = document.createElement("div");
                note.textContent = framer ? "Framer: ON" : "Framer: OFF";
                note.style.position = "fixed";
                note.style.top = "20px";
                note.style.right = "20px";
                note.style.padding = "6px 10px";
                note.style.background = framer ? "rgba(60,180,90,0.8)" : "rgba(180,60,60,0.8)";
                note.style.color = "#fff";
                note.style.fontFamily = "Arial, sans-serif";
                note.style.fontSize = "14px";
                note.style.borderRadius = "6px";
                note.style.zIndex = 9999;
                document.body.appendChild(note);
                setTimeout(() => note.remove(), 1000);
            } else if (event.key == "m" && !legit) {
                mills.placeSpawnPads = !mills.placeSpawnPads;
            } else if (event.key == "p") {
                clicks.middle = true;
            } else if (event.key == "z" && !legit) {
                mills.place = !mills.place;
            } else if (event.key == "Z") {
                if (typeof window.debug == "function") {
                    window.debug();
                }
            } else if (keyNum == 32) {
                packet("F", 1, getSafeDir(), 1);
                packet("F", 0, getSafeDir(), 1);
            }
        }
    }
}
addEventListener("keydown", UTILS.checkTrusted(keyDown));
function keyUp(event) {
    if (player && player.alive) {
        let keyNum = event.which || event.keyCode || 0;
        if (keyNum == 13) { } else if (keysActive()) {
            if (keys[keyNum]) {
                keys[keyNum] = 0;
                macro[event.key] = 0;
                if (moveKeys[keyNum]) {
                    sendMoveDir();
                } else if (event.key == "b") {
                    autoPlaceLoop = false;
                } else if (event.key == "j") {
                    boostSpike = false;
                } else if (event.key == "p") {
                    clicks.middle = false;
                }
            }
        }
    }
}
window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
let newMoveDir;
function sendMoveDir() {
    if (found) {
        packet("9", undefined, 1);
    } else {
        newMoveDir = getMoveDir();
        if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
            if (!autoPush.active && !found) {
                packet("9", newMoveDir, 1);
            }
            lastMoveDir = newMoveDir;
        }
    }
}

// BUTTON EVENTS:
function bindEvents() { }
bindEvents();

// ITEM COUNT DISPLAY:
let isItemSetted = [];
function updateItemCountDisplay(index = undefined) {
    for (let i = 3; i < items.list.length; ++i) {
        let id = items.list[i].group.id;
        let tmpI = items.weapons.length + i;
        if (!isItemSetted[tmpI]) {
            isItemSetted[tmpI] = document.createElement("div");
            isItemSetted[tmpI].id = "itemCount" + tmpI;
            getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
            isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
        } else if (index == id) {
            isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
        }
    }
}

// PATH SHIT:
var EasyStar = function (e) {
    var o = {};
    function r(t) {
        if (o[t]) {
            return o[t].exports;
        }
        var n = o[t] = {
            i: t,
            l: false,
            exports: {}
        };
        e[t].call(n.exports, n, n.exports, r);
        n.l = true;
        return n.exports;
    }
    r.m = e;
    r.c = o;
    r.d = function (t, n, e) {
        if (!r.o(t, n)) {
            Object.defineProperty(t, n, {
                enumerable: true,
                get: e
            });
        }
    };
    r.r = function (t) {
        if (typeof Symbol != "undefined" && Symbol.toStringTag) {
            Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(t, "__esModule", {
            value: true
        });
    };
    r.t = function (n, t) {
        if (t & 1) {
            n = r(n);
        }
        if (t & 8) {
            return n;
        }
        if (t & 4 && typeof n == "object" && n && n.__esModule) {
            return n;
        }
        var e = Object.create(null);
        r.r(e);
        Object.defineProperty(e, "default", {
            enumerable: true,
            value: n
        });
        if (t & 2 && typeof n != "string") {
            for (var o in n) {
                r.d(e, o, function (t) {
                    return n[t];
                }.bind(null, o));
            }
        }
        return e;
    };
    r.n = function (t) {
        var n = t && t.__esModule ? function () {
            return t.default;
        } : function () {
            return t;
        };
        r.d(n, "9", n);
        return n;
    };
    r.o = function (t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
    };
    r.p = "/bin/";
    return r(r.s = 0);
}([function (t, n, e) {
    var P = {};
    var M = e(1);
    var _ = e(2);
    var A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function () {
        var c;
        var i;
        var f;
        var s = 1.4;
        var p = false;
        var u = {};
        var o = {};
        var r = {};
        var l = {};
        var a = true;
        var h = {};
        var d = [];
        var y = Number.MAX_VALUE;
        var v = false;
        this.setAcceptableTiles = function (t) {
            if (t instanceof Array) {
                f = t;
            } else if (!isNaN(parseFloat(t)) && isFinite(t)) {
                f = [t];
            }
        };
        this.enableSync = function () {
            p = true;
        };
        this.disableSync = function () {
            p = false;
        };
        this.enableDiagonals = function () {
            v = true;
        };
        this.disableDiagonals = function () {
            v = false;
        };
        this.setGrid = function (t) {
            c = t;
            for (var n = 0; n < c.length; n++) {
                for (var e = 0; e < c[0].length; e++) {
                    o[c[n][e]] ||= 1;
                }
            }
        };
        this.setTileCost = function (t, n) {
            o[t] = n;
        };
        this.setAdditionalPointCost = function (t, n, e) {
            if (r[n] === undefined) {
                r[n] = {};
            }
            r[n][t] = e;
        };
        this.removeAdditionalPointCost = function (t, n) {
            if (r[n] !== undefined) {
                delete r[n][t];
            }
        };
        this.removeAllAdditionalPointCosts = function () {
            r = {};
        };
        this.setDirectionalCondition = function (t, n, e) {
            if (l[n] === undefined) {
                l[n] = {};
            }
            l[n][t] = e;
        };
        this.removeAllDirectionalConditions = function () {
            l = {};
        };
        this.setIterationsPerCalculation = function (t) {
            y = t;
        };
        this.avoidAdditionalPoint = function (t, n) {
            if (u[n] === undefined) {
                u[n] = {};
            }
            u[n][t] = 1;
        };
        this.stopAvoidingAdditionalPoint = function (t, n) {
            if (u[n] !== undefined) {
                delete u[n][t];
            }
        };
        this.enableCornerCutting = function () {
            a = true;
        };
        this.disableCornerCutting = function () {
            a = false;
        };
        this.stopAvoidingAllAdditionalPoints = function () {
            u = {};
        };
        this.findPath = function (t, n, e, o, r) {
            function i(t) {
                if (p) {
                    r(t);
                } else {
                    setTimeout(function () {
                        r(t);
                    });
                }
            }
            if (f === undefined) {
                throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            }
            if (c === undefined) {
                throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            }
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1) {
                throw new Error("Your start or end point is outside the scope of your grid.");
            }
            if (t !== e || n !== o) {
                var s = c[o][e];
                var u = false;
                for (var l = 0; l < f.length; l++) {
                    if (s === f[l]) {
                        u = true;
                        break;
                    }
                }
                if (u !== false) {
                    var a = new M();
                    a.openList = new A(function (t, n) {
                        return t.bestGuessDistance() - n.bestGuessDistance();
                    });
                    a.isDoneCalculating = false;
                    a.nodeHash = {};
                    a.startX = t;
                    a.startY = n;
                    a.endX = e;
                    a.endY = o;
                    a.callback = i;
                    a.openList.push(O(a, a.startX, a.startY, null, 1));
                    o = E++;
                    h[o] = a;
                    d.push(o);
                    return o;
                }
                i(null);
            } else {
                i([]);
            }
        };
        this.cancelPath = function (t) {
            return t in h && (delete h[t], true);
        };
        this.calculate = function () {
            if (d.length !== 0 && c !== undefined && f !== undefined) {
                for (i = 0; i < y; i++) {
                    if (d.length === 0) {
                        return;
                    }
                    if (p) {
                        i = 0;
                    }
                    var t = d[0];
                    var n = h[t];
                    if (n !== undefined) {
                        if (n.openList.size() !== 0) {
                            var e = n.openList.pop();
                            if (n.endX !== e.x || n.endY !== e.y) {
                                if ((e.list = 0) < e.y) {
                                    T(n, e, 0, -1, +b(e.x, e.y - 1));
                                }
                                if (e.x < c[0].length - 1) {
                                    T(n, e, 1, 0, +b(e.x + 1, e.y));
                                }
                                if (e.y < c.length - 1) {
                                    T(n, e, 0, 1, +b(e.x, e.y + 1));
                                }
                                if (e.x > 0) {
                                    T(n, e, -1, 0, +b(e.x - 1, e.y));
                                }
                                if (v) {
                                    if (e.x > 0 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e))) {
                                        T(n, e, -1, -1, s * b(e.x - 1, e.y - 1));
                                    }
                                    if (e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e))) {
                                        T(n, e, 1, 1, s * b(e.x + 1, e.y + 1));
                                    }
                                    if (e.x < c[0].length - 1 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e))) {
                                        T(n, e, 1, -1, s * b(e.x + 1, e.y - 1));
                                    }
                                    if (e.x > 0 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e))) {
                                        T(n, e, -1, 1, s * b(e.x - 1, e.y + 1));
                                    }
                                }
                            } else {
                                var o = [];
                                o.push({
                                    x: e.x,
                                    y: e.y
                                });
                                for (var r = e.parent; r != null;) {
                                    o.push({
                                        x: r.x,
                                        y: r.y
                                    });
                                    r = r.parent;
                                }
                                o.reverse();
                                n.callback(o);
                                delete h[t];
                                d.shift();
                            }
                        } else {
                            n.callback(null);
                            delete h[t];
                            d.shift();
                        }
                    } else {
                        d.shift();
                    }
                }
            }
        };
        function T(t, n, e, o, r) {
            e = n.x + e;
            o = n.y + o;
            if ((u[o] === undefined || u[o][e] === undefined) && !!g(c, f, e, o, n)) {
                if ((o = O(t, e, o, n, r)).list === undefined) {
                    o.list = 1;
                    t.openList.push(o);
                } else if (n.costSoFar + r < o.costSoFar) {
                    o.costSoFar = n.costSoFar + r;
                    o.parent = n;
                    t.openList.updateItem(o);
                }
            }
        }
        function g(t, n, e, o, r) {
            var i = l[o] && l[o][e];
            if (i) {
                var s = x(r.x - e, r.y - o);
                if (!function () {
                    for (var t = 0; t < i.length; t++) {
                        if (i[t] === s) {
                            return true;
                        }
                    }
                    return false;
                }()) {
                    return false;
                }
            }
            for (var u = 0; u < n.length; u++) {
                if (t[o][e] === n[u]) {
                    return true;
                }
            }
            return false;
        }
        function x(t, n) {
            if (t === 0 && n === -1) {
                return P.TOP;
            }
            if (t === 1 && n === -1) {
                return P.TOP_RIGHT;
            }
            if (t === 1 && n === 0) {
                return P.RIGHT;
            }
            if (t === 1 && n === 1) {
                return P.BOTTOM_RIGHT;
            }
            if (t === 0 && n === 1) {
                return P.BOTTOM;
            }
            if (t === -1 && n === 1) {
                return P.BOTTOM_LEFT;
            }
            if (t === -1 && n === 0) {
                return P.LEFT;
            }
            if (t === -1 && n === -1) {
                return P.TOP_LEFT;
            }
            throw new Error("These differences are not valid: " + t + ", " + n);
        }
        function b(t, n) {
            return r[n] && r[n][t] || o[c[n][t]];
        }
        function O(t, n, e, o, r) {
            if (t.nodeHash[e] !== undefined) {
                if (t.nodeHash[e][n] !== undefined) {
                    return t.nodeHash[e][n];
                }
            } else {
                t.nodeHash[e] = {};
            }
            var i = m(n, e, t.endX, t.endY);
            var r = o !== null ? o.costSoFar + r : 0;
            var i = new _(o, n, e, r, i);
            return t.nodeHash[e][n] = i;
        }
        function m(t, n, e, o) {
            var r;
            var i;
            if (v) {
                if ((r = Math.abs(t - e)) < (i = Math.abs(n - o))) {
                    return s * r + i;
                } else {
                    return s * i + r;
                }
            } else {
                return (r = Math.abs(t - e)) + (i = Math.abs(n - o));
            }
        }
    };
    P.TOP = "TOP";
    P.TOP_RIGHT = "TOP_RIGHT";
    P.RIGHT = "RIGHT";
    P.BOTTOM_RIGHT = "BOTTOM_RIGHT";
    P.BOTTOM = "BOTTOM";
    P.BOTTOM_LEFT = "BOTTOM_LEFT";
    P.LEFT = "LEFT";
    P.TOP_LEFT = "TOP_LEFT";
}, function (t, n) {
    t.exports = function () {
        this.pointsToAvoid = {};
        this.startX;
        this.callback;
        this.startY;
        this.endX;
        this.endY;
        this.nodeHash = {};
        this.openList;
    };
}, function (t, n) {
    t.exports = function (t, n, e, o, r) {
        this.parent = t;
        this.x = n;
        this.y = e;
        this.costSoFar = o;
        this.simpleDistanceToTarget = r;
        this.bestGuessDistance = function () {
            return this.costSoFar + this.simpleDistanceToTarget;
        };
    };
}, function (t, n, e) {
    t.exports = e(4);
}, function (u, T, t) {
    var g;
    var x;
    (function () {
        var t;
        var p;
        var l;
        var h;
        var d;
        var n;
        var a;
        var e;
        var y;
        var v;
        var o;
        var r;
        var i;
        var c;
        var f;
        function s(t) {
            this.cmp = t ?? p;
            this.nodes = [];
        }
        l = Math.floor;
        v = Math.min;
        p = function (t, n) {
            if (t < n) {
                return -1;
            } else if (n < t) {
                return 1;
            } else {
                return 0;
            }
        };
        y = function (t, n, e, o, r) {
            var i;
            if (e == null) {
                e = 0;
            }
            if (r == null) {
                r = p;
            }
            if (e < 0) {
                throw new Error("lo must be non-negative");
            }
            for (o == null && (o = t.length); e < o;) {
                if (r(n, t[i = l((e + o) / 2)]) < 0) {
                    o = i;
                } else {
                    e = i + 1;
                }
            }
            [].splice.apply(t, [e, e - e].concat(n));
            return n;
        };
        n = function (t, n, e) {
            if (e == null) {
                e = p;
            }
            t.push(n);
            return c(t, 0, t.length - 1, e);
        };
        d = function (t, n) {
            var e;
            var o;
            if (n == null) {
                n = p;
            }
            e = t.pop();
            if (t.length) {
                o = t[0];
                t[0] = e;
                f(t, 0, n);
            } else {
                o = e;
            }
            return o;
        };
        e = function (t, n, e) {
            var o;
            if (e == null) {
                e = p;
            }
            o = t[0];
            t[0] = n;
            f(t, 0, e);
            return o;
        };
        a = function (t, n, e) {
            var o;
            if (e == null) {
                e = p;
            }
            if (t.length && e(t[0], n) < 0) {
                n = (o = [t[0], n])[0];
                t[0] = o[1];
                f(t, 0, e);
            }
            return n;
        };
        h = function (e, t) {
            var n;
            var o;
            var r;
            var i;
            var s;
            var u;
            if (t == null) {
                t = p;
            }
            s = [];
            o = 0;
            r = (i = function () {
                u = [];
                for (var t = 0, n = l(e.length / 2); n >= 0 ? t < n : n < t; n >= 0 ? t++ : t--) {
                    u.push(t);
                }
                return u;
            }.apply(this).reverse()).length;
            for (; o < r; o++) {
                n = i[o];
                s.push(f(e, n, t));
            }
            return s;
        };
        i = function (t, n, e) {
            if (e == null) {
                e = p;
            }
            if ((n = t.indexOf(n)) !== -1) {
                c(t, 0, n, e);
                return f(t, n, e);
            }
        };
        o = function (t, n, e) {
            var o;
            var r;
            var i;
            var s;
            var u;
            if (e == null) {
                e = p;
            }
            if (!(r = t.slice(0, n)).length) {
                return r;
            }
            h(r, e);
            i = 0;
            s = (u = t.slice(n)).length;
            for (; i < s; i++) {
                o = u[i];
                a(r, o, e);
            }
            return r.sort(e).reverse();
        };
        r = function (t, n, e) {
            var o;
            var r;
            var i;
            var s;
            var u;
            var l;
            var a;
            var c;
            var f;
            if (e == null) {
                e = p;
            }
            if (n * 10 <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) {
                    return i;
                }
                r = i[i.length - 1];
                s = 0;
                l = (a = t.slice(n)).length;
                for (; s < l; s++) {
                    if (e(o = a[s], r) < 0) {
                        y(i, o, 0, null, e);
                        i.pop();
                        r = i[i.length - 1];
                    }
                }
                return i;
            }
            h(t, e);
            f = [];
            u = 0;
            c = v(n, t.length);
            for (; c >= 0 ? u < c : c < u; c >= 0 ? ++u : --u) {
                f.push(d(t, e));
            }
            return f;
        };
        c = function (t, n, e, o) {
            var r;
            var i;
            var s;
            if (o == null) {
                o = p;
            }
            r = t[e];
            while (n < e && o(r, i = t[s = e - 1 >> 1]) < 0) {
                t[e] = i;
                e = s;
            }
            return t[e] = r;
        };
        f = function (t, n, e) {
            var o;
            var r;
            var i;
            var s;
            var u;
            if (e == null) {
                e = p;
            }
            r = t.length;
            i = t[u = n];
            o = n * 2 + 1;
            while (o < r) {
                if ((s = o + 1) < r && !(e(t[o], t[s]) < 0)) {
                    o = s;
                }
                t[n] = t[o];
                o = (n = o) * 2 + 1;
            }
            t[n] = i;
            return c(t, u, n, e);
        };
        s.push = n;
        s.pop = d;
        s.replace = e;
        s.pushpop = a;
        s.heapify = h;
        s.updateItem = i;
        s.nlargest = o;
        s.nsmallest = r;
        s.prototype.push = function (t) {
            return n(this.nodes, t, this.cmp);
        };
        s.prototype.pop = function () {
            return d(this.nodes, this.cmp);
        };
        s.prototype.peek = function () {
            return this.nodes[0];
        };
        s.prototype.contains = function (t) {
            return this.nodes.indexOf(t) !== -1;
        };
        s.prototype.replace = function (t) {
            return e(this.nodes, t, this.cmp);
        };
        s.prototype.pushpop = function (t) {
            return a(this.nodes, t, this.cmp);
        };
        s.prototype.heapify = function () {
            return h(this.nodes, this.cmp);
        };
        s.prototype.updateItem = function (t) {
            return i(this.nodes, t, this.cmp);
        };
        s.prototype.clear = function () {
            return this.nodes = [];
        };
        s.prototype.empty = function () {
            return this.nodes.length === 0;
        };
        s.prototype.size = function () {
            return this.nodes.length;
        };
        s.prototype.clone = function () {
            var t = new s();
            t.nodes = this.nodes.slice(0);
            return t;
        };
        s.prototype.toArray = function () {
            return this.nodes.slice(0);
        };
        s.prototype.insert = s.prototype.push;
        s.prototype.top = s.prototype.peek;
        s.prototype.front = s.prototype.peek;
        s.prototype.has = s.prototype.contains;
        s.prototype.copy = s.prototype.clone;
        t = s;
        g = [];
        if ((x = typeof (x = function () {
            return t;
        }) == "function" ? x.apply(T, g) : x) !== undefined) {
            u.exports = x;
        }
    }).call(this);
}]);
let easystar = new EasyStar.js();
var retrappable = false;
var RealPush = false;
let pathFindTest = [];
let grid = [];
let pathFind = {
    active: false,
    grid: 40,
    scale: 1440,
    x: 14400,
    y: 14400,
    chaseNear: false,
    attempts: 0,
    show: false,
    paths: [],
    array: [],
    lastX: this.grid / 2,
    lastY: this.grid / 2,
    finded: false,
    showLine: true,
};
let omgPathFind = false;
// AUTOPUSH:
let autoPush = new class {
    constructor() {
        this.active = false;
        this.data = {};
    }
    update() {
        let trap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= near.scale + tmp.getScale() + 5).sort(function (a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (!trap) {
            if (this.active) {
                this.active = false;
                packet("9", lastMoveDir || undefined, 1);
            }
            return;
        }
        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, trap, 0, 0) <= near.scale + trap.scale + tmp.scale).sort(function (a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (!spike) {
            if (this.active) {
                this.active = false;
                packet("9", lastMoveDir || undefined, 1);
            }
            return;
        }
        let antiAngrySpikes = gameObjects.some(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, trap, 0, 0) <= near.scale + tmp.scale + 40);
        if (antiAngrySpikes) {
            buyEquip(6, 0);
        }
        let pos = {
            x: spike.x + Math.cos(UTILS.getDirect(near, spike, 2, 0)) * 250,
            y: spike.y + Math.sin(UTILS.getDirect(near, spike, 2, 0)) * 250,
            x2: spike.x + (UTILS.getDist(near, spike, 2, 0) + player.scale * 1.5) * Math.cos(UTILS.getDirect(near, spike, 2, 0)),
            y2: spike.y + (UTILS.getDist(near, spike, 2, 0) + player.scale * 1.5) * Math.sin(UTILS.getDirect(near, spike, 2, 0))
        };
        let finds = gameObjects.filter(tmp => tmp.active).find(tmp => {
            let tmpScale = tmp.getScale();
            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                return true;
            }
        });
        if (finds) {
            if (this.active) {
                this.active = false;
                packet("9", lastMoveDir || undefined, 1);
            }
        } else {
            this.active = true;
            this.data = {
                x: spike.x,
                y: spike.y,
                x2: pos.x2,
                y2: pos.y2
            };
            const pos4 = {
                x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale * 1) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale * 1) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
            };
            const pos5 = {
                x: pos4.x2 + Math.cos(30),
                y: pos4.y2 + Math.sin(30)
            };
            let scale = (player.scale / 10);
            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                packet("9", near.aim2, 1);
            } else if (near.dist2 <= 100) {
                packet("9", UTILS.getDirect(pos, player, 2, 2), 1);
            } else { // opi :DDD
                omgPathFind = true;
                Pathfinder(pos5, 0, 0);
            }
        }
    };
}();
// MOVEMENT:
function move(e) {
    packet("9", e, 1);
}
function setMoveDir(e) {
    move(e);
    game.tickBase(() => move(lastMoveDir), 1);
}
let tracker = {
    draw3: {
        active: false,
        x: 0,
        y: 0,
        scale: 0
    },
    draw2: {
        active: false,
        x: 0,
        y: 0,
        scale: 0
    },
    moveDir: undefined,
    lastPos: {
        x: 0,
        y: 0
    }
};
const dodgeSpike = (j = player, u = tracker, U = UTILS) => {
    if (traps.inTrap) return;

    let hd = gameObjects.find(e => e.dmg && e.active && !e.isTeamObject(j) && U.getDist(e, j, 0, 3) <= (j.scale * 2 + e.getScale()));

    if (!hd) {
        if (u.draw3.active) u.draw3.active = false;
        return;
    }
    u.draw3 = {
        active: true,
        x: hd.x,
        y: hd.y,
        scale: hd.getScale() || hd.scale,
    };
    let w = UTILS.getDirect(hd, j, 0, 2);
    let a = getMoveDir();
    if (Math.abs(w - a) < Math.PI / 2) {
        setMoveDir(null);
    }
};

// ADD DEAD PLAYER:
function addDeadPlayer(tmpObj) {
    deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
}

// SET INIT DATA:
function setInitData(data) {
    alliances = data.teams;
}

// SETUP GAME:
function setupGame(yourSID) {
    keys = {};
    macro = {};
    playerSID = yourSID;
    attackState = 0;
    inGame = true;
    packet("F", 0, getAttackDir(), 1);
    my.ageInsta = true;
    if (firstSetup) {
        firstSetup = false;
        gameObjects.length = 0;
        liztobj.length = 0;
    }
}
let followType = null;
function getBotCount() {
    if (!bots || !bots.length) {
        return 0;
    }
    return bots.filter(bot => bot.inGame).length;
}
// ADD NEW PLAYER:
function addPlayer(data, isYou) {
    let tmpPlayer = findPlayerByID(data[0]);
    if (!tmpPlayer) {
        tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories);
        players.push(tmpPlayer);
    }
    tmpPlayer.spawn(isYou ? true : null);
    tmpPlayer.visible = false;
    tmpPlayer.oldPos = {
        x2: undefined,
        y2: undefined
    };
    tmpPlayer.x2 = undefined;
    tmpPlayer.y2 = undefined;
    tmpPlayer.x3 = undefined;
    tmpPlayer.y3 = undefined;
    tmpPlayer.setData(data);
    if (isYou) {
        if (!player) {
            resize();
        }
        player = tmpPlayer;
        camX = player.x;
        camY = player.y;
        my.lastDir = 0;
        updateItems();
        updateAge(); //getEl("priXP").innerHTML = "Primary XP: 0 / not found";
        //getEl("secXP").innerHTML = "Secondary XP: 0 / not found";
        primaryXP = 0;
        secondaryXP = 0;
        // FOR RESYNC SHITTY;
        if (player.skins[7]) {
            my.reSync = true;
        }
    }
}
let pointsPerSec = 0;
function getAngleDiff(a, b) {
    let diff = a - b;
    while (diff > Math.PI) {
        diff -= Math.PI * 2;
    }
    while (diff < -Math.PI) {
        diff += Math.PI * 2;
    }
    return Math.abs(diff);
}
let lastWindmillTick = 0;
function calculatePointsPerSec(player) {
    if (!player) {
        pointsPerSec = 0;
        ppsDisplay.textContent = `Gold per sec: 0`;
        return;
    }
    let totalPPS = 0;
    const now = performance.now();
    if (now - lastWindmillTick >= 1000) {
        lastWindmillTick = now;
        const item = items.list[player.items[3]];
        if (item) {
            const millsCount = player.itemCounts[item.group.id] || 0;
            totalPPS += millsCount * (item.pps || 1);
        }
        if (player.skinIndex === 14) {
            totalPPS += 1.5;
        }
    }
    for (let obj of gameObjects) {
        if (obj.type !== 3) {
            continue;
        }
        const dx = obj.x - player.x2;
        const dy = obj.y - player.y2;
        const distance = Math.hypot(dx, dy);
        const weapon = items.weapons[player.weaponIndex];
        if (distance > weapon.range + obj.scale) {
            continue;
        }
        const angleToObj = Math.atan2(dy, dx);
        const angleDiff = getAngleDiff(player.d2, angleToObj);
        if (angleDiff <= Math.PI / 6 && player.reloads[player.weaponIndex] === 0) {
            totalPPS += 5;
        }
    }
    pointsPerSec = totalPPS;
    ppsDisplay.textContent = `Gold per sec: ${pointsPerSec.toFixed(1)}`;
}
// REMOVE PLAYER:
function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            players.splice(i, 1);
            break;
        }
    }
}
function heal() {
    for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
        place(0, getAttackDir());
    }
}
var trackers = [];
var mode = arr => arr.reduce((a, b, i, arr) => arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b, null);
class healTracker {
    constructor(hp, id) {
        this.id = id;
        this.oldhp = hp;
        this.dmgPromises = [];
        this.list = [];
        this.diesTo = [];
        this.pings = [];
        this.ping = 0;
        this.text = `no information gathered`;
    }
    isRealPing(gap) {
        return Math.abs(this.ping - gap) < 40;
    }
    calculate() {
        let pushList = [];
        let rl = [];
        let bullspams = [];
        let stopAntiAt = [];
        let mb = 0;
        let lh = null;
        let shameDown = 0;
        let mshame = false;
        for (let i = 0, e; i < this.list.length; i++) {
            e = this.list[i];
            if (e.dmg < 45 && e.dmg >= 40 && e.type == "slow" && this.isRealPing(e.gap - 1000 / 9) && !pushList.includes("nobull")) {
                pushList.push("nobull");
            } else if (e.dmg >= 45) {
                if (lh - e.delay2 < 400) {
                    if (e.type == "fast" && e.clown > shameDown) {
                        shameDown = e.clown;
                        mb++;
                    } else if (e.type == "slow" && lh - e.delay2 < 260) {
                        mshame = true;
                    } else if (e.type == "slow") {
                        stopAntiAt.push(e.clown);
                        bullspams.push(mb);
                        mb = 0;
                    }
                }
                lh = e.delay2;
            }
        }
        bullspams.push(mb);
        if (bullspams.length > 0) {
            pushList.push(["bullspam", Math.max(bullspams)]);
        }
        pushList.push(["shamePerInsta", mshame ? -2 : 1]);
        if (stopAntiAt.length > 0) {
            let mostCommon = mode(stopAntiAt);
            pushList.push(["stopAntiAt", mostCommon]);
        }
        ;
        return pushList;
    }
    updateElem(array, item) {
        let a = array.findIndex(e => e[0] == item[0]);
        if (a === -1) {
            array.push(item);
        } else {
            array[a] = item;
        }
        return array;
    }
    assign(array, renew) {
        for (let i = 0; i < renew.length; i++) {
            array = this.updateElem(array, renew[i]);
        }
        return array;
    }
    track(obj) {
        this.list.push(obj);
        if (obj.type == "slow") {
            this.pings.push(obj.gap - 1000 / 9);
            if (this.pings.length > 20) {
                this.pings.shift();
            }
            this.ping = Math.round(this.pings.reduce((a, b) => a + b, 0) / this.pings.length);
        }
        ;
        if (this.list.length > 15) {
            this.list.shift();
        }
        ;
        let calc = this.calculate();
        if (calc.length > 0) {
            this.diesTo = this.assign(this.diesTo, calc);
            //console.log(this.diesTo);
            try {
                this.text = `dies to ${this.diesTo.map(e => e.join(" ")).join(",")}`;
            } catch (e) {
                this.text = "";
            }
            ;
        }
        ;
    }
    add(hp, clown) {
        let type = this.healthType(hp, this.oldhp);
        let dmg = this.oldhp - hp;
        this.oldhp = hp;
        if (type === "damage") {
            let i = this.dmgPromises.length;
            let res = null;
            let delay = Date.now();
            let scope = trackers[this.id];
            new Promise(function (r) {
                scope.dmgPromises.push(r);
                setTimeout(r, 1000, false);
            }).then(function (bool) {
                scope.dmgPromises.splice(i, 1);
                if (!bool) {
                    return;
                }
                let gap = Date.now() - delay;
                let obj = {
                    delay1: delay,
                    delay2: Date.now(),
                    gap,
                    dmg: dmg,
                    type: gap < 1000 / 9 ? "fast" : "slow",
                    clown
                };
                scope.track(obj);
            });
            trackers[this.id] = scope;
        } else if (this.dmgPromises.length) {
            this.dmgPromises.forEach(e => e(true));
            this.dmgPromises = [];
        }
    }
    healthType(health, oldhealth) {
        if (health < oldhealth) {
            return "damage";
        } else {
            return "heal";
        }
    }
    update(hp, clown) {
        this.add(hp, clown);
    }
}

// UPDATE HEALTH:
let damages = [];
let damageTick = 0;
let shitReshame = 0;

function updateHealth(sid, value) {
    let tmpObj = findPlayerBySID(sid);
    let _0x4d01f8 = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
    };
    if (!tmpObj) {
        return;
    }
    let _0x5613f1 = tmpObj.health;
    tmpObj.oldHealth = _0x5613f1;
    tmpObj.health = value;
    tmpObj.judgeShame();
    if (_0x5613f1 > value) {
        tmpObj.timeDamaged = Date.now();
        if (tmpObj === near) {
            let _0x192cb4 = _0x5613f1 - value;
            let _0x3b271c = tmpObj.shameCount;
            if (tmpObj.skinIndex === 7 && (_0x192cb4 === 5 || tmpObj.latestTail === 13 && _0x192cb4 === 2)) {
                tmpObj.bullTick = game.tick;
            }
        }
        tmpObj.damaged = _0x5613f1 - value;
        advHeal.push([sid, value, tmpObj.damaged]);
    } else if (tmpObj !== player) {
        tmpObj.maxShameCount = Math.max(tmpObj.maxShameCount, tmpObj.shameCount);
    }
    if (nears.length && tmpObj.shameCount <= 5 && nears.some(_0x483cb6 => [9, 12, 13, 15].includes(_0x4d01f8.weapon))) {
        if (near.reloads[near.secondaryIndex] == 0) {
            my.empAnti = true;
            my.soldierAnti = false;
        } else {
            my.soldierAnti = true;
            my.empAnti = false;
        }
    }
    // PING DETECT:
    if (trackers[tmpObj.id]) {
        trackers[tmpObj.id].update(value, tmpObj.shameCount);
    } else {
        trackers[tmpObj.id] = new healTracker(value, tmpObj.id, tmpObj.shameCount);
    }
}

let lastHeal = 0;

// KILL PLAYER:
function killPlayer() {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y
    };
    if (typeof playerUpgraded !== "undefined") {
        playerUpgraded = 0;
    }
}
// UPDATE PLAYER ITEM VALUES:
function updateItemCounts(index, value) {
    if (player) {
        player.itemCounts[index] = value;
    }
}

// UPDATE AGE KEKEKE:
let ageText = getEl("ageText");
let ageBarContainer = getEl("ageBarContainer");
if (config.isSandbox) {
    ageText.remove();
    ageBarContainer.remove();
}
var ageBarBody = getEl("ageBarBody");
function updateAge(xp, mxp, age) {
    if (xp != undefined) {
        player.XP = xp;
    }
    if (mxp != undefined) {
        player.maxXP = mxp;
    }
    if (age != undefined) {
        player.age = age;
    }
    if (config.isSandbox) {
        return;
    }

    // OP TEXTED:
    ageText.innerHTML = "Level " + player.age;

    // FOR OP DO SMOOTH XP GAIN:
    ageBarBody.style.transition = "1s";
    ageBarBody.style.width = player.XP / player.maxXP * 100 + "%";
}

// UPDATE UPGRADES:
let playerUpgraded = 0;
function updateUpgrades(points, age) {
    player.upgradePoints = points;
    player.upgrAge = age;
    if (points > 0) {
        if (configs.playerAutoUpgrade && playerUpgraded < 8) {
            let upgradeId = null;
            if (configs.botWeaponType == "Musket") {
                const upgrades = [5, 17, 31, 27, 9, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            } else if (configs.botWeaponType == "Hammer") {
                const upgrades = [5, 17, 31, 27, 10, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            } else if (configs.botWeaponType == "Stick") {
                const upgrades = [8, 17, 31, 27, 9, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            } else if (configs.botWeaponType == "Dagger") {
                const upgrades = [7, 17, 31, 27, 9, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            } else if (configs.botWeaponType == "Bat") {
                const upgrades = [6, 17, 31, 27, 9, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            } else if (configs.botWeaponType == "Sword") {
                const upgrades = [3, 17, 31, 27, 9, 34, 12, 15];
                upgradeId = upgrades[playerUpgraded];
            }
            if (upgradeId !== null) {
                packet("H", upgradeId);
                playerUpgraded++;
                return;
            }
        }
        tmpList.length = 0;
        UTILS.removeAllChildren(upgradeHolder); // WEAPONS KEKE:
        for (let i = 0; i < items.weapons.length; ++i) {
            if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                let e = UTILS.generateElement({
                    id: "upgradeItem" + i,
                    class: "actionBarItem",
                    onmouseout: function () {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                tmpList.push(i);
            }
        }
        for (let i = 0; i < items.list.length; ++i) {
            if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                let tmpI = (items.weapons.length + i);
                let e = UTILS.generateElement({
                    id: "upgradeItem" + tmpI,
                    class: "actionBarItem",
                    onmouseout: function () {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                tmpList.push(tmpI);
            }
        }
        for (let i = 0; i < tmpList.length; i++) {
            (function (i) {
                let tmpItem = getEl('upgradeItem' + i);
                tmpItem.onclick = UTILS.checkTrusted(function () {
                    packet("H", i);
                });
                UTILS.hookTouchEvents(tmpItem);
            })(tmpList[i]);
        }
        if (tmpList.length) {
            upgradeHolder.style.display = "block";
            upgradeCounter.style.display = "block";
            upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
        } else {
            upgradeHolder.style.display = "none";
            upgradeCounter.style.display = "none";
            showItemInfo();
        }
    } else {
        upgradeHolder.style.display = "none";
        upgradeCounter.style.display = "none";
        showItemInfo();
    }
}
function toR(Rad) {
    if (Rad * Math.PI / 180 % (Math.PI * 2) > Math.PI) {
        return Math.PI - Rad * Math.PI / 180 % (Math.PI * 2);
    } else {
        return Rad * Math.PI / 180 % (Math.PI * 2);
    }
}
function toD(Dar) {
    if (Dar / Math.PI * 360 % 360 >= 360) {
        return Dar / Math.PI * 360 % 360 - 360;
    } else {
        return Dar / Math.PI * 360 % 360;
    }
}
function calculateWeaponDamage(type, variant) {
    const weapon = items.weapons[type];
    if (weapon) {
        if (weapon.projectile) {
            return weapon.dmg;
        } else {
            return weapon.dmg * config.weaponVariants[variant].val;
        }
    } else {
        return 0;
    }
}
// ANTI SPIKE TICKED AFTER OUT TRAP:
function spikeTickThreat() {
    for (let i = 0; i < nears; i++) {
        let tmpNear = nears[i];
        if (tmpNear) {
            let n = tmpNear.primaryIndex;
            let a = tmpNear.primaryVariant;
            let l = reloadPercent(tmpNear, n);
            let o = calculateWeaponDamage(n, a) * 1.5;
            let r = items.list[9];
            if (l == 1 && o + r.dmg >= 100 && UTILS.getDist(tmpNear, player, 0, 2) <= 100 + r.scale * 2) {
                return true;
            }
        }
    }
    return false;
}
function antiSPbyOutTrap(object) {
    if (spikeTickThreat() && traps.inTrap) {
        buyEquip(6, 0);
    }
}

// KILL OBJECT:
function killObject(sid) {
    let findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);
    if (player) {
        if (enemy.length && near.dist2 <= 232) {
            antiSPbyOutTrap(findObj);
        }
        // LOOP KEKE:
        if (configs.autoReplace) {
            traps.replacer(findObj);
        }
    }
}

// KILL ALL OBJECTS BY A PLAYER:
function killObjects(sid) {
    if (player) {
        objectManager.removeAllItems(sid);
    }
}
function fgdo(a, b) {
    return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
}
function setTickout(doo, timeout) {
    if (!ticks.manage[ticks.tick + timeout]) {
        ticks.manage[ticks.tick + timeout] = [doo];
    } else {
        ticks.manage[ticks.tick + timeout].push(doo);
    }
}
function caf(e, t) {
    try {
        return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return 0;
    }
}
let found = false;
let autos = {
    insta: {
        todo: false,
        wait: false,
        count: 4,
        shame: 5
    },
    bull: false,
    antibull: 0,
    reloaded: false,
    stopspin: true
};
let waitTicks = [];

function getDistance(x, y, x2, y2) {
    return Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);
}

let damageByPoisonTick = 0;
let predictDamage = {
    poison: 0
};
function resetPredictDamages() {
    for (const i in predictDamage) {
        predictDamage[i] = 0;
    }
}
function getPredictDamage() {
    let damage = 0;
    for (let i in predictDamage) {
        damage += predictDamage[i];
    }
    return damage;
}
function predictHeal(howManyCookieToEat) {
    for (let i = 0; i < howManyCookieToEat; i++) {
        place(0, getAttackDir());
    }
}
let ping = {
    acc: 0
};
function hasHit(enemy, weaponID) {
    if (weaponID == 53) {
        return game.tick - enemy.turretHit <= 2;
    }
    if (weaponID < 9) {
        if (game.tick - enemy.primaryHit <= 2) {
            return true;
        }
    } else if (game.tick - enemy.secondaryhit <= 2) {
        return true;
    }
    return false;
}
/* let healed = false;
function checkInsta(enemy) {
    const turretHit = hasHit(enemy, 53);
    if (enemy.dist2 <= 350) {
        if (hasHit(enemy, enemy.primaryIndex) && [3, 4, 5].includes(enemy.primaryIndex)) {
            if (hasHit(enemy, enemy.secondaryIndex)) {
                buyEquip(6, 0)
                return true;
            }
        }
        if (hasHit(enemy, enemy.secondaryIndex)) {
            if (hasHit(enemy, enemy.primaryIndex) && [3, 4, 5].includes(enemy.primaryIndex)) {
                buyEquip(6, 0)
                return true;
            }
        }
    }
}
let wowdmg;
let lastHeal = 0;
// better heal made in 5 mins cuz yurios dev have brain damage
setInterval(() => {
    if (inGame && player) {
        if (player.health < 100 && !healed) {
            let timeSinceHit = Date.now() - lastHeal;
            let healDelay = 120 - ms.avg / 2;

            let potentialDamage = 0;
            let canUseEMP = true;
            let hasSpikeDamage = false;

            if (enemy.length > 0) {
                enemy.forEach(tmpEnemy => {
                    let enemyDmg = 0;

                    let primaryDmg = items.weapons[tmpEnemy.primaryIndex]?.dmg || 0;
                    let primaryVariant = tmpEnemy.primaryVariant;
                    let primaryMult = primaryVariant !== undefined ? config.weaponVariants[primaryVariant].val : 1;

                    let secondaryDmg = items.weapons[tmpEnemy.secondaryIndex]?.Pdmg || 0;
                    let secondaryVariant = tmpEnemy.secondaryVariant;
                    let secondaryMult = secondaryVariant !== undefined ? config.weaponVariants[secondaryVariant].val : 1;

                    if (tmpEnemy.primaryReloaded && tmpEnemy.reloads[tmpEnemy.primaryIndex] > 0.7) {
                        enemyDmg += primaryDmg * primaryMult * 1.5;

                        if (tmpEnemy.inTrap || player.inTrap) {
                            hasSpikeDamage = true;
                        }
                    }

                    if (tmpEnemy.secondaryReloaded && tmpEnemy.reloads[tmpEnemy.secondaryIndex] > 0.7) {
                        enemyDmg += secondaryDmg * secondaryMult;

                        if (!items.weapons[tmpEnemy.secondaryIndex]?.projectile) {
                            canUseEMP = false;
                        }
                    }

                    if (tmpEnemy.reloads[53] > 0.7) {
                        enemyDmg += 25;
                    }
                    if (checkInsta(tmpEnemy)) {
                        enemyDmg += primaryDmg * primaryMult * 1.5;
                    }
                    potentialDamage += enemyDmg;
                });

                if (player.skinIndex === 6) {
                    potentialDamage *= 0.75;
                }
            }

            let missingHealth = 100 - player.health;
            if (timeSinceHit > 120 - ms.avg / 2 && !healed) {
                healed = true;
                healers();
            }
            if (player.health - potentialDamage <= 0 && !healed && player.shameCount <= 5) {
                if (canUseEMP && player.skins[22] && player.skinIndex !== 6 && timeSinceHit > healDelay) {
                    buyEquip(22, 0);
                    healed = true;
                    healers();
                } else if (player.skins[6] && !hasSpikeDamage && timeSinceHit > healDelay) {
                    buyEquip(6, 0);
                    healed = true;
                    healers();
                } else if (timeSinceHit > 50 - ms.avg / 2 && player.shameCount <= 5) {
                    healed = true;
                    healers();
                }
            } else if (timeSinceHit > healDelay && !healed) {
                healed = true;
                healers();
            } else if (player.health < 60 && !healed && timeSinceHit > 90 - ms.avg / 2 && player.shameCount <= 5) {
                healed = true;
                healers();
            } else if (timeSinceHit > healDelay && !healed) {
                healed = true;
                healers();
            } else if (player.health < 40 && !healed && timeSinceHit > 50 - ms.avg / 2 && player.shameCount <= 5) {
                healed = true;
                healers();
            } else if (timeSinceHit > 120 - ms.avg / 2 && !healed) {
                healed = true;
                healers();
            } else if (player.health <= 50 && !healed && timeSinceHit > 50 - ms.avg / 2 && player.shameCount <= 5) {
                healed = true;
                healers();
            } else if (timeSinceHit > 120 - ms.avg / 2 && !healed) {
                healed = true;
                healers();
            } else if (timeSinceHit > 120 - ms.avg / 2 && !healed) {
                healed = true;
                healers();
            }
        }
    }
}); */
let healed = false;
setInterval(() => {
    if (inGame) {
        if (player && player.alive && player.health < 100 && !healed && !my.antiInsta) {
            if (ping <= 69) {
                if (Date.now() - player.lastHit >= 120) {
                    healed = true;
                    healer();
                }
            } else if (game.tick - player.hitTick > 1) {
                healed = true;
                healer();
            }
            if (healed) {
                return;
            }
            if (player.shameCount < 7) {
                if (!enemy.length) {
                    if (player.health <= 45) {
                        healed = true;
                        healer();
                    }
                } else if (player.inTrap && player.hitSpike) {
                    healed = true;
                    predictHeal(2);
                } else if (player.health <= 69 && player.health <= player.damageThreat) {
                    healed = true;
                    healer();
                }
            }
        }
    }
});
let nearestSpike;
function antiSpike() {
    const spike = gameObjects.find(object => (object.type == 1 && object.y >= 12000 || object.dmg && !object.isTeamObject(player)) && UTILS.getDist(object, player, 0, 3) <= object.getScale() + player.scale);
    if (spike) {
        player.addDamageThreat(spike.dmg || 35);
    }
    if (!enemy.length) {
        return;
    }
    traps.checkSpikeTick();
    if (spike && checkRel("pri", near) && [3, 4, 5].includes(near.primaryIndex) && near.dist2 < 210) {
        if (player.inTrap) {
            if (!player[(player.weaponIndex < 9 ? "primary" : "secondary") + "Reloaded"]) {
                my.anti0tick = 1;
            }
        } else {
            my.anti0Tick = 2;
        }
    }
}
let originalScales = {
    width: 1920,
    height: 1080
};
function kbAnti() {
    if (!inGame || !player.alive || !enemy.length) {
        return false;
    }
    let noTrap = traps.inTrap;
    if (noTrap) {
        return false;
    }
    let w1 = near.weapons[0];
    let w2 = near.weapons[1];
    if (!items.weapons[w1]) {
        return false;
    }
    let w1Range = items.weapons[w1].range;
    if (near.dist2 - near.scale * 1.8 > w1Range) {
        return false;
    }
    let pKnock = (items.weapons[w1].knock || 0) + 0.3;
    let sKnock = ![undefined, 9, 12, 13, 15].includes(w2) ? items.weapons[w2].knock || 0 : 0;
    let pReach = pKnock * w1Range + near.scale * 2;
    let sReach = ![undefined, 9, 12, 13, 15].includes(w2) ? sKnock * items.weapons[w2].range + near.scale * 2 - 10 : w2 != undefined ? 60 : 0;
    let comboReach = pReach + sReach;
    let fullReach = near.reloads[53] == 0 ? comboReach + 75 : comboReach;
    let angle = near.angle;
    let px = near.x3 + Math.cos(angle) * pReach;
    let py = near.y3 + Math.sin(angle) * pReach;
    let sx = near.x3 + Math.cos(angle) * sReach;
    let sy = near.y3 + Math.sin(angle) * sReach;
    let ix = near.x3 + Math.cos(angle) * comboReach;
    let iy = near.y3 + Math.sin(angle) * comboReach;
    let tx = near.x3 + Math.cos(angle) * fullReach;
    let ty = near.y3 + Math.sin(angle) * fullReach;
    for (let tmp of gameObjects) {
        if (!tmp || !tmp.active) {
            continue;
        }
        if (tmp.isTeamObject && tmp.isTeamObject(player)) {
            continue;
        }
        if (!tmp.dmg && tmp.type != 1) {
            continue;
        }
        if (tmp.type == 1 && tmp.y < 12000) {
            continue;
        }
        let spikeRange = tmp.getScale ? tmp.getScale(0.6, tmp.isItem) + near.scale : near.scale * 2;
        let d1 = UTILS.getDist({
            x: px,
            y: py
        }, tmp, 0, 0);
        let d2 = UTILS.getDist({
            x: ix,
            y: iy
        }, tmp, 0, 0);
        let d3 = UTILS.getDist({
            x: tx,
            y: ty
        }, tmp, 0, 0);
        if (near.reloads[w1] == 0 && d1 < spikeRange) {
            return "primary KB";
        }
        if (near.reloads[w1] == 0 && near.reloads[w2] == 0 && near.dist2 <= items.weapons[w2]?.range + near.scale * 1.8 && d2 < spikeRange) {
            return "anti KB Insta";
        }
        if (near.reloads[w1] < 60 && d3 < spikeRange * 0.9) {
            return "future KB";
        }
    }
    return false;
}
function checkWeaponDmg(_, sold = true, tank = true) {
    const {
        primaryVariant: v,
        weapons: [weapon]
    } = _;
    const pV = v ? config.weaponVariants[v].val : 1;
    const e = tank && player.skins[40] ? 3.3 : 1;
    return items.weapons[weapon].dmg * e * pV;
}
function reloadPercent(e, t) {
    if (t == 53) {
        if (!e.reloads || e.reloads[53] == null) {
            return 0;
        }
        return 1 - e.reloads[53] / 2500;
    }
    if (!items.weapons[t]) {
        return 1;
    }
    let i = items.weapons[t].speed;
    return 1 - e.reloads[t] / i;
}
let lastReloadState = {};
function boostBreaker() {
    if (!autoPlaceLoop || !inGame || !player || !player.items) {
        return;
    }
    if (player.items[4] !== 16) {
        return;
    }
    for (let slot = 0; slot < 2; slot++) {
        const weaponIndex = player.weapons[slot];
        if (weaponIndex === undefined) {
            continue;
        }
        const reload = player.reloads[weaponIndex] ?? 1;
        const lastReload = lastReloadState[weaponIndex] ?? 1;
        const justFinished = reload === 0 && lastReload > 0;
        if (justFinished) {
            const slotToUse = player.weapons[1] === 10 ? 1 : 0;
            if (player.weaponIndex !== slotToUse) selectWeapon(slotToUse);
            checkPlace(4, getSafeDir());
            buyEquip(40, 0);
            sendAutoGather();
            game.tickBase(() => {
                buyEquip(6, 0);
                sendAutoGather();
            }, 1);
        }
        lastReloadState[weaponIndex] = reload;
    }
}
setInterval(boostBreaker, 111);
function boostOption(type) {
    if (type == "evee") {
        packet("9", near.aim2, 1);
        if (near.dist2 > 200) {
            place(4, near.aim2);
        }
        if (near.dist2 < 100) {
            place(2, near.aim2 + toRad(90));
            place(2, near.aim2 - toRad(90));
        }
        if (near.dist2 < 90) {
            place(2, near.aim2);
        }
        if (near.dist2 < 220) {
            place(2, near.aim2 + toRad(90));
            place(2, near.aim2 - toRad(90));
            place(2, near.aim2 + toRad(180));
        }
    } else if (type == "2018") {
        packet("9", near.aim2, 1);
        place(4, near.aim2);
        place(2, near.aim2 + toRad(90));
        place(2, near.aim2 - toRad(90));
    }
}
let boostInstaTick = false;
let teams = [];
let boostSpike = false;
function weaponDmg(_, near, sold = 1, bull = 1) {
    const {
        primaryVariant: v,
        weapons: [weapon]
    } = _;
    const pV = v ? config.weaponVariants[v].val : 1;
    const soldMult = near && sold && near.skinIndex === 6 ? 0.75 : 1;
    const bullMult = bull && _.skins[7] ? 1.5 : 1;
    return items.weapons[weapon].dmg * bullMult * pV * soldMult;
}

// HEALING:
function soldierMult() {
    if (player.latestSkin == 6) {
        return 0.75;
    } else {
        return 1;
    }
}
var SyncWithServerTick = new class {
    constructor() {
        this.C_TICK_DEL = 1000 / config.serverUpdateRate + window.pingTime / 2;
        this.perfectTickTime = Date.now();
    }
    syncGameLoop = async () => {
        const suppressDelay = Date.now() - window.pingTime + (this.C_TICK_DEL + ~~(window.pingTime / this.C_TICK_DEL)) * this.C_TICK_DEL;
        return new Promise(accept => {
            const intervalId = setInterval(() => {
                if (this.perfectTickTime > Date.now()) {
                    return;
                }
                accept();
                traps.autoPlace();
                clearInterval(intervalId);
            });
        });
    };
}();
let nearInfo = [];
let queuedTicks = [];
function handleTick() {
    for (let i = 0; i < queuedTicks.length; i++) {
        queuedTicks[i]();
    }
    queuedTicks = [];
}
function queueCurrentTick(action) {
    queuedTicks.push(action);
}

let bullTickedYaas = false;
let advHeal = [];

// UPDATE WEAPON XP: (by zerty :DDD)
let primaryWeapon = null;
let secondaryWeapon = null;
let resources = {
    wood: 0,
    stone: 0,
    food: 0,
    score: 0
};
let primaryXP = 0;
let secondaryXP = 0;
let maxPrimaryXP = 0;
let maxSecondaryXP = 0;
const xpThresholds = [3000, 7000, 12000, Infinity];
function addXP(amount) {
    if (player.weaponIndex === player.primaryIndex) {
        primaryXP += amount;
    } else {
        secondaryXP += amount;
    }
}
const foodDisplay = getEl("foodDisplay");
const woodDisplay = getEl("woodDisplay");
const stoneDisplay = getEl("stoneDisplay");
const scoreDisplay = getEl("scoreDisplay");
scoreDisplay.style = `
  bottom: 150px;
`;
function updateWeaponXP() {
    if (primaryWeapon !== player.primaryIndex) {
        primaryXP = 0;
        primaryWeapon = player.primaryIndex;
    }
    if (secondaryWeapon !== player.secondaryIndex) {
        secondaryXP = 0;
        secondaryWeapon = player.secondaryIndex;
    }
    const stone = Number(stoneDisplay.innerHTML);
    const food = Number(foodDisplay.innerHTML);
    const wood = Number(woodDisplay.innerHTML);
    if (stone > resources.stone) {
        addXP(stone - resources.stone);
        resources.stone = stone;
    }
    if (food > resources.food) {
        addXP(food - resources.food);
        resources.food = food;
    }
    if (wood > resources.wood) {
        addXP(wood - resources.wood);
        resources.wood = wood;
    }
    const maxXP = xpThresholds[player.weaponVariant] || 3000;
    if (player.weaponIndex === player.primaryIndex) {
        maxPrimaryXP = maxXP;
    }
    if (player.weaponIndex === player.secondaryIndex) {
        maxSecondaryXP = maxXP;
    }

    //getEl("priXP").innerHTML = "Primary XP: " + primaryXP + " / " + maxPrimaryXP;
    //getEl("secXP").innerHTML = "Secondary XP: " + secondaryXP + " / " + maxSecondaryXP;
    updateProgressBar(priXPBar, primaryXP, true);
    if (player.weaponIndex === player.secondaryIndex) {
        updateProgressBar(secXPBar, secondaryXP, false);
    }
}

// HERE NOW:
function fHypot(x, y) {
    return Math.sqrt(x * x + y * y);
}
function dist(a, b, type) {
    if (!a || !b) return Infinity;
    const ax = a.x2 ?? a.x;
    const ay = a.y2 ?? a.y;
    const bx = b.x2 ?? b.x;
    const by = b.y2 ?? b.y;
    const adjust = type === "player" ? -63 : type === "object" ? -(b?.scale ?? 0) : 0;
    return fHypot(ax - bx, ay - by) + adjust;
}
function inRange(tmp, target, range, shit) {
    return dist(tmp, target, "player") <= range || shit && dist(tmp?.vel?.real, target?.vel?.real, "player") <= range;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff > Math.PI) {
        diff -= Math.PI * 2;
    }
    while (diff < -Math.PI) {
        diff += Math.PI * 2;
    }
    return a + diff * t;
}
function predictEnemyHat(enemy, simulationTicks = 5, decay = 0.7) {
    if (!enemy.reloads[enemy.primaryIndex] || enemy.reloads[enemy.secondaryIndex] || enemy.reloads[53] || !enemy.skinIndex) {
        return enemy.skinIndex;
    }
    let currentHat = enemy.skinIndex;
    const hatScores = {};
    for (let t = 0; t < simulationTicks; t++) {
        const primaryReady = enemy.reloads[enemy.primaryIndex] === 0;
        const secondaryReady = enemy.reloads[enemy.secondaryIndex] === 0;
        const turretReady = enemy.reloads[53] === 0;
        const hatProbabilities = {};
        if (primaryReady && secondaryReady && turretReady) {
            hatProbabilities[22] = 0.7;
            hatProbabilities[6] = 0.2;
            hatProbabilities[currentHat] = 0.1;
        } else {
            hatProbabilities[currentHat] = 0.6;
            hatProbabilities[6] = 0.3;
            hatProbabilities[22] = 0.1;
        }
        if (near.inTrap) {
            hatProbabilities[currentHat] += 0.1;
        }
        if (enemy.speed > 3) {
            hatProbabilities[22] += 0.05;
        }
        const sum = Object.values(hatProbabilities).reduce((a, b) => a + b, 0);
        for (let h in hatProbabilities) {
            hatProbabilities[h] /= sum;
        }
        for (let h in hatProbabilities) {
            hatScores[h] = (hatScores[h] || 0) * decay + hatProbabilities[h];
        }
        currentHat = Number(Object.entries(hatProbabilities).sort((a, b) => b[1] - a[1])[0][0]);
    }
    return Number(Object.entries(hatScores).sort((a, b) => b[1] - a[1])[0][0]);
}

function nodePathToGridPath(nodes) {
    const out = [];
    const t = pathFind.scale / pathFind.grid;
    const ox = player.x2 - pathFind.scale / 2;
    const oy = player.y2 - pathFind.scale / 2;
    for (const n of nodes) {
        out.push({
            x: Math.floor((n.x - ox) / t),
            y: Math.floor((n.y - oy) / t)
        });
    }
    return out;
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
        this.closed = false;
        this.visited = false;
        this.threat = 0;
        this.clear = 0;
        this.neighbors = [];
    }
}

class BinaryHeap {
    constructor(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    size() { return this.content.length; }
    push(el) { this.content.push(el); this.sinkDown(this.content.length - 1); }
    pop() {
        const result = this.content[0];
        const end = this.content.pop();
        if (this.content.length) { this.content[0] = end; this.bubbleUp(0); }
        return result;
    }
    rescoreElement(node) {
        const i = this.content.indexOf(node);
        if (i !== -1) this.sinkDown(i);
    }
    sinkDown(n) {
        const el = this.content[n];
        while (n > 0) {
            const p = ((n + 1) >> 1) - 1;
            const parent = this.content[p];
            if (this.scoreFunction(el) < this.scoreFunction(parent)) {
                this.content[p] = el;
                this.content[n] = parent;
                n = p;
            } else break;
        }
    }
    bubbleUp(n) {
        const len = this.content.length;
        const el = this.content[n];
        const score = this.scoreFunction(el);
        while (true) {
            let swap = null;
            const c1 = (n << 1) + 1;
            const c2 = c1 + 1;
            if (c1 < len && this.scoreFunction(this.content[c1]) < score) swap = c1;
            if (c2 < len && this.scoreFunction(this.content[c2]) < (swap === null ? score : this.scoreFunction(this.content[c1]))) swap = c2;
            if (swap === null) break;
            this.content[n] = this.content[swap];
            this.content[swap] = el;
            n = swap;
        }
    }
}

class PathfinderClass {
    constructor() {
        this.step = 60; // bigger step = fewer nodes
        this.rangeX = 900;
        this.rangeY = 900;
        this.nodes = [];
        this.lastPlayerPos = { x: 0, y: 0 };
    }

    distSq(a, b) { return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; }

    getPath(start, end) {
        // rebuild nodes only if player moved far enough
        const dx = start.x - this.lastPlayerPos.x;
        const dy = start.y - this.lastPlayerPos.y;
        if (!this.nodes.length || dx * dx + dy * dy > this.step * this.step) {
            this.nodes = this.buildNodes(start);
            this.lastPlayerPos = { ...start };
        }

        const open = new BinaryHeap(n => n.f);
        const startNode = this.closestNode(start);
        open.push(startNode);

        while (open.size()) {
            const current = open.pop();
            current.closed = true;

            if (this.distSq(current, end) < this.step * this.step) {
                const path = [];
                let n = current;
                while (n.parent) { path.push(n); n = n.parent; }
                return path.reverse();
            }

            for (const nb of current.neighbors) {
                if (nb.closed) continue;
                const cost = current.g + Math.sqrt(this.distSq(current, nb)) + nb.threat * 1.5 - nb.clear * 1.2;
                if (!nb.visited || cost < nb.g) {
                    nb.visited = true;
                    nb.parent = current;
                    nb.g = cost;
                    nb.h = Math.sqrt(this.distSq(nb, end));
                    nb.f = nb.g + nb.h;
                    if (!open.content.includes(nb)) open.push(nb);
                    else open.rescoreElement(nb);
                }
            }
        }

        return [];
    }

    buildNodes(start) {
        const out = [];
        for (let dx = -this.rangeX; dx <= this.rangeX; dx += this.step) {
            for (let dy = -this.rangeY; dy <= this.rangeY; dy += this.step) {
                const x = start.x + dx;
                const y = start.y + dy;
                const n = new Node(x, y);
                if (!this.isValid(n)) continue;
                n.threat = this.calcThreat(n);
                n.clear = this.calcClear(n);
                out.push(n);
            }
        }

        // precompute neighbors for each node
        for (const n of out) {
            n.neighbors = out.filter(nb => nb !== n && this.distSq(n, nb) <= this.step * 2);
        }

        return out;
    }

    closestNode(pos) {
        let best = null, bd = Infinity;
        for (const n of this.nodes) {
            const d = this.distSq(pos, n);
            if (d < bd) { bd = d; best = n; }
        }
        return best;
    }

    isValid(node) {
        if (node.x < 35 || node.x > 14365 || node.y < 35 || node.y > 14365) return false;
        for (const obj of gameObjects) {
            if (!obj.active || obj.ignoreCollision) continue;
            const r = (obj.getScale ? obj.getScale() : obj.scale) + player.scale * 0.75;
            if (this.distSq(node, obj) <= r * r) return false;
        }
        return true;
    }

    calcThreat(node) {
        let t = 0;
        for (const obj of gameObjects) {
            if (!obj.active || !obj.dmg || obj.isTeamObject(player)) continue;
            const d = Math.sqrt(this.distSq(node, obj));
            const r = (obj.getScale ? obj.getScale() : obj.scale) + player.scale;
            if (d < r + 40) t += 200;
            else if (d < r + 120) t += 80;
        }
        return t;
    }

    calcClear(node) {
        let c = 0;
        for (const obj of gameObjects) if (obj.active && this.distSq(node, obj) < this.step * this.step) c++;
        return Math.max(0, 8 - c);
    }
}

const pf = new PathfinderClass();
let trapRetreatTimer = 0;

function Pathfinder() {
    if (!player.alive || !enemy.length) { pathFind.array = []; return; }
    const target = pathFind.chaseNear && near && near.active ? near : pathFind && pathFind.x ? pathFind : null;
    if (!target) { pathFind.array = []; return; }

    const tx = target.x2 || target.x;
    const ty = target.y2 || target.y;
    const dist = getDistance(player.x2, player.y2, tx, ty);
    let desired = { x: tx, y: ty };

    if (traps.inTrap) {
        if (!trapRetreatTimer) trapRetreatTimer = Date.now();
        const ang = Math.atan2(player.y2 - ty, player.x2 - tx);
        const retreatDistance = Math.min(220, (Date.now() - trapRetreatTimer) / 3);
        desired = { x: player.x2 + Math.cos(ang) * retreatDistance, y: player.y2 + Math.sin(ang) * retreatDistance };
        if (retreatDistance >= 220) trapRetreatTimer = 0;
    } else trapRetreatTimer = 0;
    if (player.primaryIndex === 5 && player.primaryVariant >= 2 && checkRel("tur", player)) { // velocity onetick pvp
        if (dist < 200) { const ang = Math.atan2(player.y2 - ty, player.x2 - tx); desired = { x: player.x2 + Math.cos(ang) * 160, y: player.y2 + Math.sin(ang) * 160 }; }
    } else if (near.inTrap && (player.primaryIndex === 4 || player.primaryIndex === 5)) {
        if (dist <= 100) {
            if (checkCanPlacedIt(2, near)) { pathFind.array = []; packet("9", undefined, 1); return; }
            else { const ang = Math.atan2(ty - player.y2, tx - player.x2); desired = { x: player.x2 - Math.cos(ang) * 35, y: player.y2 - Math.sin(ang) * 35 }; }
        }
    } else if (player.primaryIndex === 4 || player.primaryIndex === 5) {
        if (dist <= 100) {
            if (checkCanPlacedIt(2, target)) { pathFind.array = []; packet("9", undefined, 1); return; }
            else { const ang = Math.atan2(ty - player.y2, tx - player.x2); desired = { x: player.x2 - Math.cos(ang) * 40, y: player.y2 - Math.sin(ang) * 40 }; }
        }
    }

    const path = pf.getPath({ x: player.x2, y: player.y2 }, desired);
    if (!path.length) { packet("9", UTILS.getDirect(target, player, 0, 2), 1); pathFind.array = []; return; }

    pathFind.array = nodePathToGridPath(path);
    packet("9", UTILS.getDirect(path[0], player, 0, 2), 1);
}

class AutoplayManager {
    constructor(player, gameObjects, ctx) {
        this.player = player;
        this.gameObjects = gameObjects;
        this.ctx = ctx;

        this.pathfinder = new PathfinderClass();
        this.currentMode = "balanced"; // default
        this.forcedMode = null;
        this.safezones = [];
        this.dangerzones = [];
        this.target = null;
        this.path = [];
        this.trapRetreatTimer = 0;
        this.strafeDir = 1;
    }

    setMode(mode) {
        if (["camping", "safe", "aggressive", "balanced"].includes(mode))
            this.currentMode = mode;
    }

    forceMode(mode) {
        if (["camping", "safe", "aggressive", "balanced"].includes(mode))
            this.forcedMode = mode;
    }

    getActiveMode() {
        return this.forcedMode || this.currentMode;
    }

    updateZones() {
        this.safezones = this.gameObjects.filter(obj => obj.active && obj.isSafeZone);
        this.dangerzones = this.gameObjects.filter(obj => obj.active && obj.isDangerZone);
    }

    getClosestSafezone() {
        if (!this.safezones.length) return null;
        let best = null, bd = Infinity;
        for (const zone of this.safezones) {
            const d = this.distSq(this.player, zone);
            if (d < bd) { bd = d; best = zone; }
        }
        return best;
    }

    getNearestEnemy() {
        const enemies = this.gameObjects.filter(obj => obj.active && obj.isEnemy && obj.alive);
        if (!enemies.length) return null;
        let nearest = null, nd = Infinity;
        for (const e of enemies) {
            const d = this.distSq(this.player, e);
            if (d < nd) { nd = d; nearest = e; }
        }
        return nearest;
    }

    computePath(targetPos) {
        const start = { x: this.player.x2, y: this.player.y2 };
        const path = this.pathfinder.getPath(start, targetPos);
        this.path = path;
        return path;
    }

    getNextMove() {
        if (!this.path || !this.path.length) return null;
        return this.path[0];
    }

    strafe() {
        const dir = this.strafeDir;
        this.strafeDir *= -1;
        const angle = Math.random() * Math.PI * 2;
        return {
            x: this.player.x2 + Math.cos(angle) * 40 * dir,
            y: this.player.y2 + Math.sin(angle) * 40 * dir
        };
    }

    tick(autoMode = true) {
        if (!this.player.alive) { this.path = []; return; }

        this.updateZones();
        if (autoMode) this.autoDecideMode();

        const mode = this.getActiveMode();
        const enemy = this.getNearestEnemy();
        const safezone = this.getClosestSafezone();

        let desiredPos = { x: this.player.x2, y: this.player.y2 };

        switch (mode) {
            case "camping": // gay
                if (safezone) desiredPos = { x: safezone.x, y: safezone.y };
                if (enemy && this.distSq(enemy, safezone) < 200 ** 2) desiredPos = { x: enemy.x, y: enemy.y };
                else desiredPos = this.strafe();
                break;

            case "safe":
                if (enemy) desiredPos = { x: enemy.x, y: enemy.y };
                else if (safezone) desiredPos = { x: safezone.x, y: safezone.y };
                break;

            case "aggressive":
                if (enemy) desiredPos = { x: enemy.x, y: enemy.y };
                break;

            case "balanced":
                if (enemy && this.distSq(enemy, this.player) < 300 ** 2) desiredPos = { x: enemy.x, y: enemy.y };
                else if (safezone) desiredPos = { x: safezone.x, y: safezone.y };
                else desiredPos = this.strafe();
                break;
        }

        if (traps.inTrap) {
            if (!this.trapRetreatTimer) this.trapRetreatTimer = Date.now();
            const ang = Math.atan2(this.player.y2 - desiredPos.y, this.player.x2 - desiredPos.x);
            const retreatDist = Math.min(220, (Date.now() - this.trapRetreatTimer) / 3);
            desiredPos = { x: this.player.x2 + Math.cos(ang) * retreatDist, y: this.player.y2 + Math.sin(ang) * retreatDist };
            if (retreatDist >= 220) this.trapRetreatTimer = 0;
        } else this.trapRetreatTimer = 0;
        const path = this.computePath(desiredPos);
        if (!path.length) {
            packet("9", UTILS.getDirect(enemy || desiredPos, this.player, 0, 2), 1);
            return;
        }

        const nextMove = this.getNextMove();
        packet("9", UTILS.getDirect(nextMove, this.player, 0, 2), 1);
        if (this.distSq(nextMove, this.player) < 20 ** 2) this.path.shift();
    }

    autoDecideMode() {
        const enemy = this.getNearestEnemy();
        if (!enemy) {
            this.currentMode = "camping";
            return;
        }
        const dist = Math.sqrt(this.distSq(this.player, enemy));
        if (dist < 250) this.currentMode = "aggressive";
        else if (dist < 500) this.currentMode = "balanced";
        else this.currentMode = "safe";
    }

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Safezones
        for (const sz of this.safezones) {
            ctx.fillStyle = "green";
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(sz.x, sz.y, sz.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dangerzones
        for (const dz of this.dangerzones) {
            ctx.fillStyle = "red";
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(dz.x, dz.y, dz.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Path
        if (this.path.length) {
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            let color = "white";
            switch (this.getActiveMode()) {
                case "camping": color = "darkblue"; break;
                case "safe": color = "teal"; break;
                case "aggressive": color = "pink"; break;
                case "balanced": color = "purple"; break;
            }

            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(this.player.x2, this.player.y2);
            for (const p of this.path) ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    }

    distSq(a, b) { return (a.x - b.x) ** 2 + (a.y - b.y) ** 2; }
}

let autoplayManager = null;

function initAutoplay(player, gameObjects, ctx = null) {
    autoplayManager = new AutoplayManager(player, gameObjects, ctx);
}



function autoplay() {
    if (!autoplayManager) return;
    const checkbox = document.getElementById("autoplayer");
    const selector = document.getElementById("autoplayerstyle");
    if (!checkbox || !selector) return;
    if (!checkbox.checked) return;
    const selectedStyle = selector.value;
    switch (selectedStyle) {
        case "Auto":
            autoplayManager.forcedMode = null;
            break;
        case "Camp":
            autoplayManager.forceMode("camping");
            break;
        case "Safe":
            autoplayManager.forceMode("safe");
            break;
        case "Aggressive":
            autoplayManager.forceMode("aggressive");
            break;
        case "Balanced":
            autoplayManager.forceMode("balanced");
            break;
        default:
            autoplayManager.forcedMode = null;
    }
    autoplayManager.tick(true);
    autoplayManager.render();
}
let daggerSpam = false;

// PLAYER SPEED:
function speedMult(_) {
    let i = (((_.buildIndex < 0) + 1) / 2) * (items.weapons[_.weaponIndex]?.spdMult || 1) * (_.skinIndex && hats.find(s => s.id == _.skinIndex)?.spdMult || 1)
        * (_.tailIndex && accessories.find(r => r.id == _.tailIndex)?.spdMult || 1)
        * (_.y2 <= config.snowBiomeTop ? _.skinIndex && hats.find(p => p.id == _.skinIndex)?.coldM ? 1 : .75 : 1) * 1;
    !_.zIndex && _.y2 >= config.mapScale / 2 - config.riverWidth / 2 && _.y2 <= config.mapScale / 2 + config.riverWidth / 2 &&
        (_.skinIndex && hats.find(s => s.id == _.skinIndex).watrImm ? (i *= 0.75) : (i *= 0.33));

    return i;
}

let safeDataPlayer = [];
// UPDATE PLAYER VEL MOVEMENT:
const decayRate = pow(0.993, 111);
function calcVelMovement(_, ang, set, docalc, time = 111) {
    if (!_.vel) {
        _.vel = {
            accel: {}, decel: {}, boostCoords: {}, boostVel: {},
            nextVel: {}, real: {}, current: {}, fullDecel: {}
        };
    }

    if (!docalc) {
        if (_.sid == player.sid && ang !== 0 && !ang) {
            ang = player.moveDir;
        } else if (player.inTrap && _.sid == player.sid) {
            ang = undefined;
        } else if (!ang && ang !== 0) {
            ang = _.movDir;
        }
    }

    let cosX = ang !== undefined ? cos(ang) : 0;
    let sinY = ang !== undefined ? sin(ang) : 0;

    let len = cosX * cosX + sinY * sinY;
    if (len > 0) {
        len = sqrt(len);
        cosX /= len;
        sinY /= len;
    }

    if (!set) set = _;
    let mult = speedMult(set);

    _.speedXD = cosX * 0.0016 * mult * time;
    _.speedYD = sinY * 0.0016 * mult * time;

    _.predX = _.speedXD * time;
    _.predY = _.speedYD * time;

    let velXD = _.xVel * pow(0.993, time);
    let velYD = _.yVel * pow(0.993, time);

    let velX = velXD + _.predX;
    let velY = velYD + _.predY;

    {
        let e = velX, t = velY;
        let cx = _.x2, cy = _.y2;
        for (let i = 0; i < 50; i++) {
            let e2 = e * decayRate;
            let t2 = t * decayRate;
            if (e === e2 && t === t2) break;
            e = e2;
            t = t2;
            cx += e;
            cy += t;
        }
        _.vel.fullDecel.x = cx;
        _.vel.fullDecel.y = cy;
        _.vel.fullDecel.type = "full decel";
    }

    // accel
    _.vel.accel.x = _.x2 + velX;
    _.vel.accel.y = _.y2 + velY;
    _.vel.accel.type = "accel";

    // decel
    _.vel.decel.x = _.x2 + velXD;
    _.vel.decel.y = _.y2 + velYD;
    _.vel.decel.type = "decel";

    // current
    _.vel.current.x = _.x2;
    _.vel.current.y = _.y2;
    _.vel.current.type = "current";

    _.vel.nextVel.x = velX;
    _.vel.nextVel.y = velY;
    _.vel.nextVel.type = "nextVel";

    _.vel.vel = round(sqrt(velX * velX + velY * velY));

    let boostxVel = time * 1.5 * cosX;
    let boostyVel = time * 1.5 * sinY;
    _.vel.boostCoords.x = _.x2 + boostxVel;
    _.vel.boostCoords.y = _.y2 + boostyVel;
    _.vel.boostVel.x = boostxVel;
    _.vel.boostVel.y = boostyVel;

    let real = _.vel.accel;
    if (safeDataPlayer[_.sid]?.vel !== undefined && _ != player) {
        let distA = UTILS.getDist(_, safeDataPlayer[_.sid].vel.accel);
        let distB = UTILS.getDist(_, safeDataPlayer[_.sid].vel.decel);
        if (distA > distB && UTILS.getAngleDist(_.movDir, _.pmovDir) <= 0.3) {
            real = _.vel.decel;
        }
    }

    if (_ == player) {
        if (player.moveDir == null) {
            real = _.vel.decel;
        } else {
            real = _.vel.accel;
        }
    }
    _.vel.real = real;

    _.vel.spd = mult;

    return _.vel;
}
traps.syncWithServerTicks();
async function updatePlayers(data, sid) {
    omgPathFind = false;
    predictObjects = [];
    autoplay();
    // RESET SHI:
    for (let d of players) {
        if (d.spikeDamage <= 0) {
            continue;
        }
        d.spikeDamage = 0;
    }
    //updateAngleVis();
    calculatePointsPerSec(player);
    mouseXY();

    if (lastBullTick) {
        countBTicks++;
        if (lastBullTick != prevBullTick) {
            countBTicks = 0;
            prevBullTick = lastBullTick;
        }
    }
    await SyncWithServerTick.syncGameLoop();
    placeReset = 0;
    if (boostSpike && boostType) {
        boostOption(boostType);
    }
    if (autoPlace) {
        autoPlace = false;
    }
    // DANGER CACULATION PURE VISUAL:
    if (player.shameCount >= 5) {
        dangerAids += 5;
    } else if (enemy.length && player.shameCount >= 5 && near.shameCount >= 5) {
        dangerAids += 2.5;
    }

    // HATS:
    if (player.skinIndex == 22) {
        dangerAids = 5;
    } else if (player.skinIndex == 6) {
        dangerAids = 1.125;
    } else if (enemy.length && near.dist2 <= 400) {
        dangerAids = 1.2;
    } else {
        dangerAids = 0;
    }
    dangerAids = 0; // reset action
    damages = [];
    game.tick++;
    enemy = [];
    nears = [];
    near = [];
    game.tickSpeed = performance.now() - game.lastTick;
    game.lastTick = performance.now();
    players.forEach(tmp => {
        tmp.forcePos = !tmp.visible;
        tmp.visible = false;
        if (tmp.timeHealed - tmp.timeDamaged > 0 && tmp.lastshamecount < tmp.shameCount) {
            tmp.pinge = tmp.timeHealed - tmp.timeDamaged;
        }
    });
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            const lastX = tmpObj.x2;
            const lastY = tmpObj.y2;
            if (tmpObj !== player) safeDataPlayer[tmpObj.sid] = tmpObj;
            tmpObj.t1 = tmpObj.t2 === undefined ? game.lastTick : tmpObj.t2;
            tmpObj.t2 = game.lastTick;
            tmpObj.oldPos.x2 = tmpObj.x2;
            tmpObj.oldPos.y2 = tmpObj.y2;
            tmpObj.x1 = tmpObj.x;
            tmpObj.y1 = tmpObj.y;
            tmpObj.x2 = data[i + 1];
            tmpObj.y2 = data[i + 2];
            tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
            tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
            tmpObj.d1 = tmpObj.d2 === undefined ? data[i + 3] : tmpObj.d2;
            tmpObj.d2 = data[i + 3];
            tmpObj.dt = 0;

            // vel shitty:
            tmpObj.xVel = tmpObj.x2 * 2 - lastX;
            tmpObj.yVel = tmpObj.y2 * 2 - lastY;
            tmpObj.vel = calcVelMovement(tmpObj);

            tmpObj.buildIndex = data[i + 4];
            tmpObj.weaponIndex = data[i + 5];
            tmpObj.oldWeaponIndex = tmpObj.weaponIndex;
            tmpObj.weaponVariant = data[i + 6];
            tmpObj.team = data[i + 7];
            tmpObj.isLeader = data[i + 8];
            tmpObj.oldSkinIndex = tmpObj.skinIndex;
            tmpObj.oldTailIndex = tmpObj.tailIndex;
            tmpObj.skinIndex = data[i + 9];
            tmpObj.tailIndex = data[i + 10];
            tmpObj.iconIndex = data[i + 11];
            tmpObj.zIndex = data[i + 12];
            tmpObj.visible = true;
            let gear = {
                skin: findID(hats, this.skinIndex),
                tail: findID(accessories, this.tailIndex)
            }
            let spdMult = 37 * ((tmpObj.weaponIndex != 0) ? items.weapons[tmpObj.weaponIndex].spdMult : 1) * ((hats.find(e => e.id == tmpObj.skinIndex && e.spdMult)) ? hats.find(e => e.id == tmpObj.skinIndex).spdMult : 1) * ((accessories.find(e => e.id == tmpObj.tailIndex && e.spdMult)) ? accessories.find(e => e.id == tmpObj.tailIndex).spdMult : 1) * ((tmpObj.y < config.snowBiomeTop) ? tmpObj.skinIndex == 15 ? 1 : .75 : 1);
            tmpObj.maxSpeed = ~~(spdMult);
            tmpObj.update(game.tickSpeed);
            tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
            tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
            tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
            tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
            tmpObj.damageThreat = 0;
            tmpObj.hitSpike = 0;
            // ANTI SYNC SHIT:
            if (tmpObj == player) {
                tmpObj.syncThreats = 0;
            }
            tmpObj.guessHack = tmpObj.usingWhiteout ? "whiteout" : tmpObj.happymod ? "Happy" : tmpObj.xwareRemake ? "x-ware" : tmpObj.onetickMod ? "Onetick" : tmpObj.annaRemake ? "Anna" : tmpObj.dangerShame == 1 ? "Star" : undefined;
            if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                tmpObj.addShameTimer();
            }
            if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                tmpObj.shameTimer = 0;
                tmpObj.shameCount = 0;
                if (tmpObj == player) {
                    healer();
                }
            }
            let cK = gameObjects.filter(cd => cd.trap && cd.active && UTILS.getDist(cd, player, 0, 2) <= player.scale + cd.getScale() + 3 && !cd.isTeamObject(player)).sort(function (cd, ck) {
                return UTILS.getDist(cd, player, 0, 2) - UTILS.getDist(ck, player, 0, 2);
            })[0];
            if (cK) {
                cK.hideFromEnemy = false;
            }
            tmpObj.lastTrap = tmpObj.inTrap;
            tmpObj.inTrap = cK;
            tmpObj.escaped = !tmpObj.inTrap && tmpObj.lastTrap;
            if (tmpObj.sid != player.sid) {
                if (tmpObj.oldSkinIndex != tmpObj.skinIndex && UTILS.getAngleDist(tmpObj.d2, tmpObj.d3) > 0.1) {
                    tmpObj.macroPoints.hatMacro += 5;
                } else if (tmpObj.oldSkinIndex != tmpObj.skinIndex) {
                    tmpObj.macroPoints.hatMacro -= 4;
                }
            }
            if (tmpObj == player) {
                if (liztobj.length) {
                    let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= tmpObj.scale + e.getScale() + 5 && !e.isTeamObject(tmpObj)).sort(function (a, b) {
                        return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                    })[0];
                    if (nearTrap) {
                        traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                        traps.aim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);
                        if (!legit) {
                            traps.protect(caf(nearTrap, tmpObj) - Math.PI);
                        }
                        traps.inTrap = true;
                        traps.info = nearTrap;
                    } else {
                        traps.inTrap = false;
                        traps.info = {};
                    }
                    let spike = gameObjects.filter(e => ["spikes", "greater spikes", "spinning spikes", "poison spikes", "teleporter"].includes(e.name || e.dmg) && e.active && UTILS.getDist(e, player, 0, 3) <= player.scale + e.scale + 40 && !e.isTeamObject(player)).sort((a, b) => {
                        return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                    })[0];
                    let forPerfectRange = gameObjects.filter(e => ["spikes", "greater spikes", "spinning spikes", "poison spikes", "teleporter"].includes(e.name || e.dmg) && e.active && UTILS.getDist(e, player, 0, 3) <= player.scale + e.scale + 80 && !e.isTeamObject(player)).sort((a, b) => {
                        return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                    })[0];
                    if (forPerfectRange) {
                        spikes.aim = UTILS.getDirect(forPerfectRange, player, 0, 2);
                    }
                    if (enemy.length && spike && near.skinIndex == 7) {
                        dangerAids += 4;
                        buyEquip(6, 0);
                        player.chat.message = "predict Incoming SpikeTick";
                        player.chat.count = 2000;
                    }
                    if (spike && !traps.inTrap) {
                        spikes.inRange = true;
                    } else {
                        spikes.inRange = false;
                    }
                } else {
                    traps.inTrap = false;
                    spikes.inRange = false;
                }
            }
            if (tmpObj.weaponIndex < 9) {
                tmpObj.primaryIndex = tmpObj.weaponIndex;
                tmpObj.primaryVariant = tmpObj.weaponVariant;
            } else if (tmpObj.weaponIndex > 8) {
                tmpObj.secondaryIndex = tmpObj.weaponIndex;
                tmpObj.secondaryVariant = tmpObj.weaponVariant;
            }
            nearPlayers.push(tmpObj);
        }
        i += 13;
    }
    let ai = ais.find(e => e.active && e.health > 0 && e.visible && e.lowHealth && UTILS.getDist(player, e, 2, 2) <= items.weapons[player.weapons[0]].range + e.scale + 50);
    if (ai) {
        buyEquip(0, 1);
    }
    if (textManager.stack.length) {
        let stacks = [];
        let notstacks = [];
        let num = 0;
        let num2 = 0;
        let pos = {
            x: null,
            y: null
        };
        let pos2 = {
            x: null,
            y: null
        };
        textManager.stack.forEach(text => {
            if (text.value >= 0) {
                if (num == 0) {
                    pos = {
                        x: text.x,
                        y: text.y
                    };
                }
                num += Math.abs(text.value);
            } else {
                if (num2 == 0) {
                    pos2 = {
                        x: text.x,
                        y: text.y
                    };
                }
                num2 += Math.abs(text.value);
            }
        });
        if (num2 > 0) {
            textManager.showText(pos2.x, pos2.y, Math.max(43, Math.min(50, num2)), 0.18, 1500, num2, "#8ecc51");
        }
        if (num > 0) {
            textManager.showText(pos.x, pos.y, Math.max(43, Math.min(50, num)), 0.18, 1500, num, "#fff");
        }
        textManager.stack = [];
    }
    if (runAtNextTick.length) {
        runAtNextTick.forEach(tmp => {
            checkProjectileHolder(...tmp);
        });
        runAtNextTick = [];
    }
    nearPlayers.length = 0;
    for (let i = 0; i < nearPlayers.length; i++) {
        let tmp = nearPlayers[i];
        if (tmp.sid == player.sid) {
            continue;
        }
        tmp.notHacking = tmp.hackerPoints.autoheal < -4 && tmp.macroPoints.hatMacro <= 0;
        tmp.hacking = tmp.hackerPoints.autoheal > 3;
        tmp.macroing = tmp.macroPoints.hatMacro > 4;
        if (tmp.notHacking) {
            tmp.hacking = false;
        }
        if (tmp.hacking) {
            tmp.hacker = true;
        } else {
            tmp.hacker = false;
        }
        if (tmp.notHacking) {
            tmp.hacker = false;
            tmp.macroing = false;
        }
    }
    for (let i = 0; i < data.length;) {
        tmpObj = findPlayerBySID(data[i]);
        if (tmpObj) {
            if (!tmpObj.isTeam(player)) {
                enemy.push(tmpObj);
                if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + player.scale * 2) {
                    nears.push(tmpObj);
                }
            } else if (tmpObj.sid !== player.sid) {
                teams.push(tmpObj);
            }
            tmpObj.manageReload();
            if (tmpObj != player) {
                tmpObj.addDamageThreat(player);
            }
        }
        i += 13;
    }
    if (player && player.alive) {
        updateWeaponXP();
        if (enemy.length) {
            near = enemy.sort(function (tmp1, tmp2) {
                return tmp1.dist2 - tmp2.dist2;
            })[0];
            if (!legit && teams.length && !bots.length) {
                teams.forEach(teammate => {
                    let tmp = near;
                    if (UTILS.getDistance(tmp.x2, tmp.y2, teammate.x2, teammate.y2) <= 200 && UTILS.getDistance(tmp.x2, tmp.y2, player.x2, player.y2) <= 200) {
                        if (teammate.weaponIndex === teammate.primaryIndex && player.weaponIndex === player.primaryIndex && player.reloads[player.primaryIndex] === 0 && teammate.reloads[teammate.primaryIndex] === 0) {
                            traps.wompwomp = false;
                            clicks.left = true;
                            top.lastSync = Date.now();
                            game.tickBase(() => {
                                clicks.left = false;
                            }, 2);
                        }
                    }
                });
            }

            // ANTI SYNC:
            nears.forEach(e => {
                if (e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0 && e.primaryIndex != undefined && e.reloads[e.primaryIndex] == 0) {
                    player.syncThreats++;
                }
            });
        }
        antiSpike();
        if (game.tickQueue[game.tick]) {
            game.tickQueue[game.tick].forEach(action => {
                action();
            });
            game.tickQueue[game.tick] = null;
        }
        if (advHeal.length) {
            advHeal.forEach(updHealth => {
                if (window.pingTime < 150) {
                    let sid = updHealth[0];
                    let value = updHealth[1];
                    let _0x3ee11b = 100 - value;
                    let damaged = updHealth[2];
                    tmpObj = findPlayerBySID(sid);
                    let bullTicked = false;
                    if (tmpObj == player) {
                        if (tmpObj.skinIndex == 7 && (damaged == 5 || tmpObj.latestTail == 13 && damaged == 2)) {
                            if (my.reSync) {
                                my.reSync = false;
                                tmpObj.setBullTick = true;
                            }
                            bullTicked = true;
                        }
                        if (inGame) {
                            let attackers = getAttacker(damaged);
                            let gearDmgs = [0.25, 0.45].map(val => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let includeSpikeDmgs = enemy.length ? !bullTicked && gearDmgs.includes(damaged) && near.skinIndex == 11 : false;
                            let healTimeout = 140 - window.pingTime;
                            let dmg = 100 - player.health;
                            let slowHeal = function (timer, heal) {
                                if (!heal) {
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                } else {
                                    game.tickBase(() => {
                                        healer();
                                    }, 2);
                                }
                            };
                            if (true) {
                                if (enemy.length) {
                                    if ([0, 7, 8].includes(near.primaryIndex)) {
                                        if (damaged < 75) {
                                            slowHeal(healTimeout);
                                        } else {
                                            healer();
                                        }
                                    }
                                    if ([1, 2, 6].includes(near.primaryIndex)) {
                                        if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (near.primaryIndex == 3) {
                                        if (near.secondaryIndex == 15) {
                                            if (near.primaryVariant < 2) {
                                                if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1) {
                                                    tmpObj.canEmpAnti = true;
                                                    tmpObj.antiTimer = game.tick;
                                                    healer();
                                                } else {
                                                    slowHeal(healTimeout);
                                                }
                                            } else if (damaged > 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1) {
                                                tmpObj.canEmpAnti = true;
                                                tmpObj.antiTimer = game.tick;
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (near.primaryIndex == 4) {
                                        if (near.primaryVariant >= 1) {
                                            if (damaged >= 10 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 3) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if ([undefined, 5].includes(near.primaryIndex)) {
                                        if (near.secondaryIndex == 10) {
                                            if (dmg >= (includeSpikeDmgs ? 10 : 20) && tmpObj.damageThreat + dmg >= 80 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                                            if (dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if ([undefined || 15].includes(near.secondaryIndex)) {
                                            if (damaged > (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 25 && game.tick - player.antiTimer > 1) {
                                                if (tmpObj.shameCount < 5) {
                                                    healer();
                                                } else {
                                                    slowHeal(healTimeout);
                                                }
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if ([9, 12, 13].includes(near.secondaryIndex)) {
                                            if (dmg >= 25 && player.damageThreat + dmg >= 70 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if (damaged > 25 && player.damageThreat + dmg >= 95) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (near.primaryIndex == 6) {
                                        if (near.secondaryIndex == 15) {
                                            if (damaged >= 25 && tmpObj.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else if (damaged >= 70 && tmpObj.shameCount < 4) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (damaged >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) {
                                        instaC.canCounter = true;
                                    }
                                } else if (damaged >= 70) {
                                    healer();
                                } else {
                                    slowHeal(healTimeout);
                                }
                            } else {
                                if (damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && game.tick - player.antiTimer > 1) {
                                    if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                                        tmpObj.canEmpAnti = true;
                                    } else {
                                        player.soldierAnti = true;
                                    }
                                    tmpObj.antiTimer = game.tick;
                                    let shame = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                                    if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                                        slowHeal(healTimeout);
                                    } else {
                                        slowHeal(healTimeout, 1);
                                    }
                                } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                                    slowHeal(healTimeout);
                                } else {
                                    slowHeal(healTimeout, 1);
                                }
                                if (damaged >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) {
                                    instaC.canCounter = true;
                                }
                            }
                        } else if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || tmpObj.latestTail == 13 && tmpObj.damaged == 2)) {
                            tmpObj.setPoisonTick = true;
                        }
                    }
                } else {
                    let [_0x6f8614, _0x10c26a, _0x49df09] = updHealth;
                    let _0x481338 = 100 - _0x10c26a;
                    let tmpObj = findPlayerBySID(_0x6f8614);
                    let _0x5d5acd = false;
                    if (tmpObj == player) {
                        if (tmpObj.skinIndex == 7 && (_0x49df09 == 5 || tmpObj.latestTail == 13 && _0x49df09 == 2)) {
                            if (my.reSync) {
                                my.reSync = false;
                                tmpObj.setBullTick = true;
                                _0x5d5acd = true;
                            }
                        }
                        if (inGame) {
                            let _0x25ff42 = getAttacker(_0x49df09);
                            let _0x3ef9d2 = [0.25, 0.45].map(tmp => tmp * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let _0x3b0780 = enemy.length ? !_0x5d5acd && _0x3ef9d2.includes(_0x49df09) && near.skinIndex == 11 : false;
                            let healTimeout = 60;
                            let _0x4d4c05 = 100 - player.health;
                            let _0x299c0b = [2, 5][[0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1];
                            let slowheal2 = function (timer, heal) {
                                if (!heal) {
                                    setTimeout(() => healer(), timer);
                                } else {
                                    game.tickBase(() => healer(), 2);
                                }
                            };
                            if (true) {
                                let damaged = [0, 7, 8].includes(near.primaryIndex) ? _0x49df09 < 75 : [1, 2, 6].includes(near.primaryIndex) ? _0x49df09 >= 25 && player.damageThreat + _0x4d4c05 >= 95 && tmpObj.shameCount < 5 : [undefined, 5].includes(near.primaryIndex) ? _0x4d4c05 >= (_0x3b0780 ? 15 : 20) && tmpObj.damageThreat + _0x4d4c05 >= 50 && tmpObj.shameCount < 6 : near.primaryIndex == 3 && near.secondaryIndex == 15 ? _0x49df09 >= 35 && player.damageThreat + _0x4d4c05 >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1 : near.primaryIndex == 4 ? near.primaryVariant >= 1 ? _0x49df09 >= 10 && player.damageThreat + _0x4d4c05 >= 95 && tmpObj.shameCount < 4 : _0x49df09 >= 35 && player.damageThreat + _0x4d4c05 >= 95 && tmpObj.shameCount < 3 : near.primaryIndex == 6 && near.secondaryIndex == 15 ? _0x49df09 >= 25 && tmpObj.damageThreat + _0x4d4c05 >= 95 && tmpObj.shameCount < 4 : _0x49df09 >= 25 && player.damageThreat + _0x4d4c05 >= 95;
                                if (damaged) {
                                    healer();
                                } else {
                                    slowheal2(healTimeout);
                                }
                            } else {
                                let _0x69a8d3 = _0x49df09 >= (_0x3b0780 ? 8 : 25) && _0x4d4c05 + player.damageThreat >= 80 && game.tick - player.antiTimer > 1;
                                if (_0x69a8d3) {
                                    if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                                        tmpObj.canEmpAnti = true;
                                    } else {
                                        player.soldierAnti = true;
                                    }
                                    tmpObj.antiTimer = game.tick;
                                    if (tmpObj.shameCount < _0x299c0b) {
                                        healer();
                                    } else {
                                        slowheal2(healTimeout, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                                    }
                                } else {
                                    slowheal2(healTimeout, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                                }
                            }
                        } else if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || tmpObj.latestTail == 13 && tmpObj.damaged == 2)) {
                            tmpObj.setPoisonTick = true;
                        }
                    }
                }
            });
            advHeal = [];
        }
        /*         if (advHeal.length) {
            advHeal.forEach(updHealth => {
                let sid = updHealth[0];
                let value = updHealth[1];
                let damaged = updHealth[2];
                tmpObj = findPlayerBySID(sid);
                let bullTicked = false;
                if (tmpObj.health <= 0) {
                    if (!tmpObj.death) {
                        tmpObj.death = true;
                        addDeadPlayer(tmpObj);
                    }
                }
                let nearSpike = gameObjects.find(obj => ((obj.type == 1 && obj.y >= 12000) || (obj.dmg && !obj.isTeamObject(tmpObj))) && UTILS.getDist(obj, tmpObj, 0, 2) <= obj.scale + tmpObj.scale + 1);
                if (nearSpike && damaged == nearSpike.dmg * (tmpObj.skinIndex == 6 ? 0.75 : 1)) tmpObj.hitSpike = nearSpike.dmg || 35;
                if (tmpObj == player) {
                    if (tmpObj.skinIndex == 7 && (damaged == 5 || tmpObj.latestTail == 13 && damaged == 2)) {
                        if (my.reSync) {
                            my.reSync = false;
                            tmpObj.setBullTick = true;
                        }
                        bullTicked = true;
                    }
                    if (inGame) {
                        let attackers = getAttacker(damaged);
                        let gearDmgs = [0.25, 0.45].map(val => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                        let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                        let earlySendTick = (game.tickRate - window.pingTime / 2 - 1);
                        let healTimeout = configs.doPingHeal ? (earlySendTick + window.pingTime / 2) : 1000 / 9;
                        let dmg = 100 - player.health;
                        let slowHeal = function (timer) {
                            setTimeout(() => {
                                healer();
                            }, timer);
                        };
                        if (configs.shouldHeal) {
                            if (attackers.length) {
                                let by = attackers.filter(tmp => {
                                    if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                                        tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                                        if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                            return tmp;
                                        }
                                    }
                                });
                                let slpererere = [];
                                let slaeaeppe = [];
                                if (near.primaryIndex == 7 && near.secondaryIndex == 15 && player.reloads[player.weapons[1]] == 0) {
                                    slpererere = true;
                                    slaeaeppe = false;
                                } else if (near.primaryIndex == 7 && near.secondaryIndex != 15 && damaged <= 30 || near.primaryIndex == 7 && near.secondaryIndex != 15 && damaged <= 30 && player.skinIndex == 7) {
                                    slaeaeppe = true;
                                    slpererere = false;
                                } else {
                                    slaeaeppe = false;
                                    slpererere = false;
                                }
                                let lol = [];
                                if (by.length) {
                                    let maxDamage = includeSpikeDmgs ? 10 : 10;
                                    if (damaged > maxDamage && game.tick - tmpObj.antiTimer > 1 && slaeaeppe == false || near.primaryVariant >= 2 && near.primaryIndex == 5 && near.secondaryIndex == 10 && [7, 8, 9, 10, 11, 12, 13].includes(Math.round(damaged))) {
                                        tmpObj.canEmpAnti = true;
                                        tmpObj.antiTimer = game.tick;
                                        let shame = 4;
                                        if (tmpObj.shameCount < shame) {
                                            healer();
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    slowHeal(healTimeout);
                                }
                            } else {
                                slowHeal(healTimeout);
                            }
                        } else if (damaged >= (includeSpikeDmgs ? 8 : 20) && tmpObj.damageThreat >= 25 && game.tick - tmpObj.antiTimer > 1) {
                            tmpObj.canEmpAnti = true;
                            tmpObj.antiTimer = game.tick;
                            let shame = 5;
                            if (tmpObj.shameCount < 6) {
                                healer();
                            } else {
                                slowHeal(healTimeout);
                            }
                        } else {
                            if (near.primaryIndex == 3) {
                                if (near.secondaryIndex == 15) {
                                    if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) healer()
                                    else slowHeal(healTimeout)
                                }
                            }
                            if ([undefined, 5].includes(near.primaryIndex)) {
                                if (near.secondaryIndex == 10) {
                                    if (dmg >= (includeSpikeDmgs ? 10 : 20) && tmpObj.damageThreat + dmg >= 80 && tmpObj.shameCount < 6) {
                                        healer()
                                    } else slowHeal(healTimeout)
                                } else if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                                    if (dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6) {
                                        healer()
                                    } else slowHeal(healTimeout)
                                } else if ([undefined || 15].includes(near.secondaryIndex)) {
                                    if (damaged > (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 25 && (game.tick - player.antiTimer) > 1) {
                                        if (tmpObj.shameCount < 5) {
                                            healer()
                                        } else slowHeal(healTimeout)
                                    } else slowHeal(healTimeout)
                                } else if ([9, 12, 13].includes(near.secondaryIndex) && near.dist2 <= 350) {
                                    if (dmg >= 25 && player.damageThreat + dmg >= 70 && tmpObj.shameCount < 6) {
                                        healer()
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                }
                            } else slowHeal(healTimeout);
                        }
                    }
                } else if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || tmpObj.latestTail == 13 && tmpObj.damaged == 2)) {
                    tmpObj.setPoisonTick = true;
                }
            });
            if (player.skinIndex == 7 && tmpObj.damaged == 5) {
                buyEquip(6, 0);
            }
            advHeal = [];
        } */
        players.forEach(tmp => {
            if (!tmp.visible && player != tmp) {
                tmp.reloads = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    53: 0
                };
            }
            if (tmp.setBullTick) {
                tmp.bullTimer = 0;
            }
            if (tmp.setPoisonTick) {
                tmp.poisonTimer = 0;
            }
            tmp.updateTimer();
        });
        if (inGame) {
            if (enemy.length) {
                sCombat.findSpikeHit.x = 0;
                sCombat.findSpikeHit.y = 0;

                // Auto Knock Back:
                sCombat.doSpikeHit();
                sCombat.findSpikeHit.spikes = [];

                // ENEMY DATA MENU:
                if (!dataMenuOpen) {
                    toggleDataMenu();
                }
                let t = trackers[near.id];
                let ping = t ? t.ping : "0";
                let lastPrimary = near?.primaryIndex;
                let lastSecondary = near?.secondaryIndex;
                document.getElementById("database").innerHTML = `
                            Name: ${near?.name} <br>
                            Ping: ${ping}<br>
                            Shame: ${tmpObj?.shameCount || "0"} <br>
                            Primary: ${items?.weapons[lastPrimary]?.name} <br>
                            Secondary: ${items?.weapons[lastSecondary]?.name}
                        `;
            } else if (!enemy.length) {
                if (dataMenuOpen) {
                    toggleDataMenu();
                }
                document.getElementById("database").innerHTML = `No Information`;
            }

            // TOGGLE BOTS MENU:
            if (bots.length) {
                if (!botMenuOpen) {
                    toggleBotMenu();
                }
            } else if (botMenuOpen) {
                toggleBotMenu();
            }
            // ENEMYS:
            if (enemy.length) {
                function ch(e) {
                    packet("6", e.slice(0, 30));
                }
                // Anti Sync:
                if (!legit && player.syncThreats >= 2 && !my.antiSync) {
                    sendChat("sync detect test");
                    dangerAids += 5;
                    if (near.reloads[53] == 0 || near.skinIndex == 7) {
                        antiSyncHealing(3);
                    }
                } else if (!legit && player.syncThreats >= 4 && !my.antiSync) {
                    sendChat("multibox stupid tactic");
                    dangerAids += near.sid * 2;
                    if (near.shooting[1] > 0) {
                        antiSyncHealing(5);
                    }
                }
                // Anti Insta:
                if (!legit && player.canEmpAnti) {
                    player.canEmpAnti = false;
                    if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                        if (near.reloads[53] == 0) {
                            dangerAids = 1;
                            player.empAnti = true;
                            player.soldierAnti = false;
                            if (true) {
                                //anti insta
                                buyEquip(22, 0);
                                buyEquip(21, 1);
                            }
                        } else {
                            player.empAnti = false;
                            dangerAids = 0.5;
                            player.soldierAnti = true;
                            if (true) {
                                //anti insta
                                buyEquip(6, 0);
                                buyEquip(21, 1);
                            }
                        }
                    }
                }
                let prehit = liztobj.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= tmp.scale + near.scale).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (prehit) {
                    if (!legit && near.dist3 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
                        if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                            instaC.revTick = true;
                        }
                    }
                }

                if (near && !instaC.isTrue && !my.waitHit) {
                    let syncCount = 0;
                    let myPlayerDamage = 0;
                    let allyDamage = 0;

                    if (player.reloads[player.weapons[0]] == 0 && inRange(player, near, items.weapons[player.weapons[0]].range, true)) {
                        myPlayerDamage += player.primaryDmg;
                    }

                    for (let tmpPlayer of players.filter((tmp) => tmp !== player && tmp.isTeam(player))) {
                        const temateNear = enemy.sort((a, b) => UTILS.getDist(tmpPlayer, a, 0, 2) - UTILS.getDist(tmpPlayer, b, 0, 2))[0];
                        if (!temateNear || near.sid != temateNear.sid) continue;

                        if (inRange(tmpPlayer, near, items.weapons[tmpPlayer.weapons[0]].range, true) && tmpPlayer.reloads[tmpPlayer.weapons[0]] == 0) {
                            allyDamage += tmpPlayer.primaryDmg;
                        }

                        if (configs.x18ksync && tmpPlayer.shooting[1] && tmpPlayer.shootIndex == 15) {
                            syncCount++;
                        }
                    }

                    if (((myPlayerDamage + allyDamage) * 0.75) > 100) {
                        instaC.canSpikeTick();
                    } else if (player.weapons[1] == 15 && player.reloads[player.weapons[1]] <= game.tickRate && syncCount >= 1) {
                        instaC.rangeType();
                    }
                }

                let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < tmp.scale + player.scale + 8).sort(function (a, b) {
                    return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                })[0];
                if (!legit && antiSpikeTick && near.primaryIndex != 7 && near.primaryIndex != 8 && near.primaryIndex != 6) {
                    if (near.dist2 <= items.weapons[5].range + near.scale * 2.5 || near.dist2 <= items.weapons[4].range + near.scale * 2.5) {
                        my.anti0Tick = 3;
                        dangerAids += 3;
                        buyEquip(6, 0);
                        buyEquip(6, 0);
                    }
                }
            }
            if (player.checkCanInsta(false) >= (player.weapons[1] == 10 ? 95 : 100) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && instaC.wait && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && instaC.perfCheck(player, near)) {
                instaC.can = true;
            } else {
                instaC.can = false;
            }
            if (!legit) {
                if (macro.q) {
                    place(0, getAttackDir());
                }
                if (macro.f) {
                    place(4, getSafeDir());
                }
                if (macro.v) {
                    place(2, getSafeDir());
                }
                if (macro.y) {
                    place(5, getSafeDir());
                }
                if (macro.h) {
                    place(player.getItemType(22), getSafeDir());
                }
                if (macro.n) {
                    place(3, getSafeDir());
                }
            }
            if (legit) {
                if (macro.f) {
                    selectToBuild(player.items[4]);
                }
                if (macro.v) {
                    selectToBuild(player.items[2]);
                }
                if (macro.h) {
                    selectToBuild(player.items[5]);
                }
                if (macro.r) {
                    buyEquip(7, 0);
                }
                if (macro.t) {
                    buyEquip(53, 0);
                }
                if (macro.g) {
                    buyEquip(6, 0);
                }
                if (macro.y) {
                    biomeGear();
                }
            }
            function CheckSnowBiome() {
                if (player.y2 <= config.snowBiomeTop) {
                    return true;
                } else {
                    return false;
                }
            }
            function SpeedMill() {
                if (player.skinIndex === 12 && player.tailIndex === 11 && player.weaponIndex === 7) {
                    return player.maxSpeed / player.spdMult || 1;
                }
                const isTail11 = player.tailIndex === 11;
                const isSnow = CheckSnowBiome() && player.skinIndex !== 15;
                const weapon = player.weaponIndex;
                if (isTail11) {
                    if (isSnow || weapon === 10 || weapon === 3 || weapon === 4) {
                        return player.maxSpeed / player.spdMult || (weapon === 5 ? 4 : 3);
                    } else {
                        return player.maxSpeed / player.spdMult || 2;
                    }
                } else if (isSnow || weapon === 10 || weapon === 4 || weapon === 5) {
                    return player.maxSpeed / player.spdMult || 4;
                } else {
                    return player.maxSpeed / player.spdMult || 3;
                }
            }
            let CheckMaxSpeed = SpeedMill();
            let item = items.list[player.items[3]];
            let millsCount = player.itemCounts[item.group.id];
            let maxCount = config.isSandbox ? 298 : 0;
            if (game.tick % CheckMaxSpeed == 0) {
                if (mills.place) {
                    let plcAng = 1.2;
                    for (let i = -plcAng; i <= plcAng; i += plcAng) {
                        checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i, 1);
                    }
                    if ((millsCount ?? 0) >= maxCount) {
                        // logic so can use for antitrap
                        mills.place = false;
                    }
                } else if (mills.placeSpawnPads) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(20), i);
                    }
                }
            }
            if (!legit && instaC.can) {
                instaC.changeType(player.weapons[1] == 10 ? "rev" : "normal");
            }
            if (instaC.canSpikeTick) {
                instaC.canSpikeTick = false;
                if (instaC.revTick) {
                    instaC.revTick = false;
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                        instaC.changeType("rev");
                    }
                } else if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    instaC.spikeTickType();
                    if (instaC.syncHit) { }
                }
            }
            if (!daggerSpam && !legit && spikes.inRange) {
                if (player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                    selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                }
                if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                    sendAutoGather();
                    buyEquip(player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? onetick ? 6 : 40 : 6, 0);
                    my.waitHit = 1;
                    setTimeout(() => {
                        sendAutoGather();
                        buyEquip(6, 0);
                        my.waitHit = 0;
                    }, game.tickRate + window.pingTime / 2 - 1);
                }
            }
            if (!daggerSpam && !clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                function ultraAttack() {
                    for (let i = 0; i < 1; i++) {
                        sendAtck(1);
                        sendAtck(0);
                    }
                    selectWeapon(player.weaponCode, 1);
                }
                if (legit) {
                    ultraAttack();
                } else {
                    if (player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                        selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                    }
                    if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                        sendAutoGather();
                        my.waitHit = 1;
                        setTimeout(() => {
                            sendAutoGather();
                            my.waitHit = 0;
                        }, game.tickRate + window.pingTime / 2 - 1);
                    }
                }
            }

            // NEAREST SPIKE:
            nearestSpike = null;
            let nearestDistSq = Infinity;
            for (let i = 0; i < gameObjects.length; i++) {
                let obj = gameObjects[i];
                if (!obj.active) {
                    continue;
                }
                if (obj.name !== "spikes" && obj.name !== "greater spikes" && obj.name !== "spinning spikes" && obj.name !== "poison spikes") {
                    continue;
                }
                if (!obj.owner || isAlly(obj.owner.sid)) {
                    continue;
                }
                let dx = obj.x - player.x;
                let dy = obj.y - player.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < (player.scale + obj.scale + 25) ** 2 && distSq < nearestDistSq) {
                    nearestDistSq = distSq;
                    nearestSpike = obj;
                }
            }
            if (!daggerSpam && !legit && traps.inTrap && !my.autoAim) {
                if (!clicks.left && !clicks.right && !instaC.isTrue) {
                    if (nearestSpike) {
                        if (items.weapons[player.weapons[0]].speed <= 400 && nearestSpike.health <= items.weapons[player.weapons[0]].dmg && UTILS.getDistance(player.x2, player.y2, nearestSpike.x, nearestSpike.y) <= items.weapons[player.weapons[0]].range + nearestSpike.scale) {
                            player.weaponCode = player.weapons[0];
                        }
                        if (player.weapons[1] == 10 && UTILS.getDistance(player.x2, player.y2, nearestSpike.x, nearestSpike.y) <= items.weapons[player.weapons[1]].range + nearestSpike.scale) {
                            player.weaponCode = player.weapons[1];
                        } else {
                            player.weaponCode = player.weapons[0];
                        }
                        traps.aim = UTILS.getDirect(nearestSpike, player, 0, 2);
                    } else {
                        player.weaponCode = traps.notFast() ? player.weapons[1] : player.weapons[0];
                    }
                    if (player.weaponIndex != player.weaponCode || player.buildIndex > -1) {
                        selectWeapon(player.weaponCode);
                    }
                    if (player.reloads[player.weaponCode] == 0) {
                        buyEquip(player.reloads[player.weaponCode] == 0 ? onetick ? 6 : 40 : 6, 0);
                        sendAutoGather();
                        setTimeout(() => {
                            sendAutoGather();
                            buyEquip(6, 0);
                        }, game.tickRate + window.pingTime / 2 - 1);
                    }
                }
            }
            if (onetick) {
                buyEquip(6, 0);
            } //antitick

            if (!legit && clicks.middle && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                    if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                        instaC.bowMovement();
                    } else {
                        instaC.rangeType();
                    }
                }
            }

            // AUTO TRAP TICK:
            let enemyTrapped = gameObjects.filter(object => object.active && object.id == 15 && UTILS.getDistance(near.x2, near.y2, object.x, object.y) <= 50 && object.owner.sid != near.sid)[0];
            const lasthHitTrap = () => {
                let health = checkWeaponDmg(player, true, true);
                const dmg = enemyTrapped.health <= health;
                return dmg;
            };
            if (enemy.length && !traps.inTrap && enemyTrapped && checkRel("sec", player) && player.weapons[1] == 10 && near.dist2 <= 138) {
                if (lasthHitTrap() && enemyTrapped && !traps.inTrap) {
                    if (checkCanPlacedIt(2, near)) {
                        traps.canAppleInsta = true;
                        place(2, near.aim2);
                        checkPlace(2, near.aim2);
                        if (checkRel("prisec", player) && player.skins[7] && player.skins[53] && player.skins[40]) {
                            my.autoAim = true;
                            sendAutoGather();
                            buyEquip(40, 0);
                            player.weaponCode = player.weapons[1];
                            if (player.weaponIndex !== player.weaponCode) selectWeapon(player.weaponCode);
                            game.tickBase(() => {
                                buyEquip(7, 0);
                                player.weaponCode = player.weapons[0];
                                if (player.weaponIndex !== player.weaponCode) selectWeapon(player.weaponCode);
                                game.tickBase(() => {
                                    buyEquip(53, 0);
                                    sendAutoGather();
                                    my.autoAim = false;
                                    traps.canAppleInsta = false;
                                }, 1);
                            }, 1);
                        }
                    }
                }
            }

            // SMARTEST VELOCITY TICK:
            if (framer && checkRel("pritur", player)) {
                if (enemy.length && player && player.alive) {
                    function getGear(player) {
                        return {
                            skin: findID(hats, player.skinIndex) || {},
                            tail: findID(accessories, player.tailIndex) || {}
                        };
                    }
                    let gear = getGear(player);
                    let spdMult = (player.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[player.weaponIndex].spdMult || 1) * (gear.skin ? gear.skin.spdMult || 1 : 1) * (gear.tail ? gear.tail.spdMult || 1 : 1) * (player.y2 <= config.snowBiomeTop ? gear.skin && gear.skin.coldM ? 1 : config.snowSpeed : 1) * player.slowMult;

                    // biome shit
                    if (!player.zIndex && player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        if (player.skin && player.skin.watrImm) {
                            spdMult *= 0.75;
                            player.xVel += delta * 0.00044000000000000007;
                        } else {
                            spdMult *= 0.33;
                            player.xVel += delta * 0.0011;
                        }
                    }

                    // move keke
                    let xVel = player.moveDir !== undefined ? cos(player.moveDir) : 0;
                    let yVel = player.moveDir !== undefined ? sin(player.moveDir) : 0;
                    let length = sqrt(xVel * xVel + yVel * yVel);
                    if (length !== 0) {
                        xVel /= length;
                        yVel /= length;
                    }

                    // more speed :DDD
                    if (xVel) {
                        player.xVel += xVel * player.maxSpeed * spdMult * delta;
                    }
                    if (yVel) {
                        player.yVel += yVel * player.maxSpeed * spdMult * delta;
                    }
                    if (near && near.alive && near.weaponIndex !== undefined) {
                        const tmpSpd = (near.weightM || 1) * 0.3 + (items.weapons[near.weaponIndex].knock || 0);
                        const tmpDir = UTILS.getDirection(player.x2, player.y2, near.x2, near.y2); // push away
                        player.xVel += tmpSpd * cos(tmpDir);
                        player.yVel += tmpSpd * sin(tmpDir);
                    }

                    // velocity kekeke
                    const minimumOTRange = 1000 / 9 * 1.5 + 35;
                    const maximumOTRange = 1000 / 9 * 1.5 + 80;
                    const velocitySmoothing = 0.3;
                    const rotationSmoothing = 0.25;
                    const myPos = {
                        x: player.x2,
                        y: player.y2
                    };
                    const enemyPos = {
                        x: near.x2,
                        y: near.y2
                    };
                    const distance = UTILS.getDistance(myPos.x, myPos.y, enemyPos.x, enemyPos.y);
                    const rawMyVel = {
                        x: (myPos.x - (player.prevX2 || myPos.x)) / (delta || 1),
                        y: (myPos.y - (player.prevY2 || myPos.y)) / (delta || 1)
                    };
                    const rawEnemyVel = {
                        x: (enemyPos.x - (near.prevX2 || enemyPos.x)) / (delta || 1),
                        y: (enemyPos.y - (near.prevY2 || enemyPos.y)) / (delta || 1)
                    };
                    if (!player.smoothVel) {
                        player.smoothVel = {
                            ...rawMyVel
                        };
                    }
                    if (!near.smoothVel) {
                        near.smoothVel = {
                            ...rawEnemyVel
                        };
                    }
                    player.smoothVel.x = lerp(player.smoothVel.x, rawMyVel.x, velocitySmoothing);
                    player.smoothVel.y = lerp(player.smoothVel.y, rawMyVel.y, velocitySmoothing);
                    near.smoothVel.x = lerp(near.smoothVel.x, rawEnemyVel.x, velocitySmoothing);
                    near.smoothVel.y = lerp(near.smoothVel.y, rawEnemyVel.y, velocitySmoothing);
                    player.prevX2 = myPos.x;
                    player.prevY2 = myPos.y;
                    near.prevX2 = enemyPos.x;
                    near.prevY2 = enemyPos.y;
                    const timeToReach = distance / (hypot(player.smoothVel.x, player.smoothVel.y) || 1);
                    const predictedEnemyPos = {
                        x: enemyPos.x + near.smoothVel.x * timeToReach,
                        y: enemyPos.y + near.smoothVel.y * timeToReach
                    };
                    const predictedMyPos = {
                        x: myPos.x + player.smoothVel.x * timeToReach,
                        y: myPos.y + player.smoothVel.y * timeToReach
                    };
                    let predictiveDirection = UTILS.getDirect(predictedEnemyPos, predictedMyPos, 2, 2);
                    if (!player.smoothDir) {
                        player.smoothDir = predictiveDirection;
                    }
                    player.smoothDir = lerpAngle(player.smoothDir, predictiveDirection, rotationSmoothing);
                    let detectOnetick = false;
                    if (near.weaponIndex === 5 && near.primaryVariant >= 2 && near.reloads[near.primaryIndex] == 0 && near.reloads[53] == 0 && (near.skinIndex === 7 || near.skinIndex === 53)) {
                        if (near.skinIndex !== 6 && near.skinIndex !== 22) {
                            detectOnetick = true;
                        }
                    }
                    let dist = UTILS.getDirect(near, player, 2, 2);
                    const canAutoMove = !detectOnetick && !traps.inTrap && distance > minimumOTRange && distance < maximumOTRange;
                    const turretCheck = () => {
                        if (!enemy.length) {
                            return false;
                        }
                        const soldier = near.skinIndex === 6;
                        const emp = near.skinIndex === 22;
                        const normal = !soldier && !emp;
                        const checkEnemy = near.dist2 > 140 && near.dist2 <= 700;
                        const turretReady = player.skins[53] && checkRel("tur", player);
                        const canKill = soldier && near.health <= 19 || emp && near.health <= 0 || normal && near.health <= 25;
                        return checkEnemy && turretReady && canKill && (game.tick - player.bullTick) % 9 === 0;
                    };
                    let turretHit = turretCheck();
                    if (player.primaryIndex == 5 && player.primaryVariant >= 2 && checkRel("pri", player)) {
                        const oneTick = checkRel("tur", player) && (near.health >= 61 && near.skinIndex == 6 || near.health >= 81 && near.skinIndex != 22);
                        if (oneTick && canAutoMove) {
                            instaC.oneTickType();
                        }
                    }
                    const lASTHITENEMY = () => {
                        let dmgPot = checkWeaponDmg(player, true, true);
                        let dmg = near.health <= dmgPot;
                        return dmg;
                    };
                    const bullHit = near.health >= 26 && (near.health <= 60 && near.skinIndex == 6 || near.health <= 80) && near.dist2 <= items.weapons[player.primaryIndex].range + player.scale * 1.8;
                    if (bullHit && checkRel("pri", player)) {
                        if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                        sendAutoGather();
                        my.autoAim = true;
                        buyEquip(7, 0);
                        game.tickBase(() => {
                            my.autoAim = false;
                            sendAutoGather();
                        }, 1);
                    }
                    if (turretHit) {
                        buyEquip(53, 0);
                    }
                }
            }
            if (!legit && macro.t && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? player.reloads[player.weapons[1]] == 0 : true) && (player.weapons[0] == 5 || player.weapons[0] == 4 && player.weapons[1] == 15)) {
                    instaC[player.weapons[0] == 4 && player.weapons[1] == 15 ? "kmTickMovement" : "tickMovement"]();
                }
            }
            if (!legit && macro.c && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? player.reloads[player.weapons[1]] == 0 : true)) {
                    instaC.boostTickMovement();
                }
            }
            if (!traps.canAppleInsta && !legit && !spikes.inRange && player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue) {
                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    if (!my.reloaded) {
                        my.reloaded = true;
                        let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                        if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[fastSpeed]);
                        }
                    }
                } else {
                    my.reloaded = false;
                    if (player.reloads[player.weapons[0]] > 0) {
                        if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                        if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[1]);
                        }
                        if ([9, 12, 13, 15].includes(player.weaponIndex)) {
                            if (!autos.stopspin) {
                                setTimeout(() => {
                                    autos.stopspin = true;
                                }, 400);
                            }
                            autos.stopspin = false;
                        }
                    }
                }
            }
            let forceSoldier = false;
            let spikeSync = kbAnti();
            if (!legit && spikeSync) {
                if (spikeSync === "anti Kb Insta" && (![9, 12, 13, 15].includes(player.weapons[1]) || items.weapons[player.weapons[1]] && near.dist2 <= items.weapons[player.weapons[1]].range + player.scale * 1.8)) {
                    forceSoldier = true;
                } else if (spikeSync === "primary KB") {
                    forceSoldier = true;
                }
                if (forceSoldier && player.skinIndex !== 6) {
                    buyEquip(6, 0);
                }
            }

            if (!legit && !instaC.isTrue && traps.inTrap) {
                packet("D", traps.aim);
            } else if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                packet("D", getAttackDir());
            }
            if (bullTickedYaas) {
                bullTickedYaas = false;
            }

            if (near.health <= 0) {
                textManager.showText(player.x2, player.y2, 60, 0.18, 1000, "☠️");
            }

            // opi:
            function enemyInSpike(enemy) {
                return gameObjects.some(obj => obj.active && (obj.id > 5 && obj.id < 10) && !obj.isTeamObject(enemy) && UTILS.getDist(obj, enemy, 0, 2) <= obj.scale + enemy.scale * 1.8);
            }

            if (configs.autoPushSpam && autoPush.active && enemy.length && enemyInSpike(near) && player.weapons[0] == 7) {
                daggerSpam = true;
                my.autoAim = true;
                sendAutoGather();
                if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                game.tickBase(() => {
                    sendAutoGather();

                    buyEquip(6, 0);
                    my.autoAim = false;
                    daggerSpam = false;
                }, 1);
            }

            // ANTI PUSH DAG/BAT:
            if (configs.antiPush && [6, 7].includes(player.weapons[0]) && traps.inTrap && nearestSpike) {
                if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8) {
                    daggerSpam = true;
                    my.autoAim = true;
                    if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                    buyEquip(6, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        my.autoAim = false;
                        sendAutoGather();
                        buyEquip(6, 0);
                        daggerSpam = false;
                    }, 1);
                }
            }

            // SMART BULL SPAM: me op trust :DDD
            if (configs.AutoBullSpam) {
                if (!clicks.right || !traps.inTrap) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8) {
                        if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        sendAutoGather();
                        my.autoAim = true;
                        game.tickBase(() => {
                            my.autoAim = false;
                            sendAutoGather();
                            buyEquip(6, 0);
                        }, 1);
                    }
                }
            }

            // AUTO INSTA:
            if (configs.autoInsta) {
                const primaryWeapon = player.weapons[0];
                const secondaryWeapon = player.weapons[1];
                const inRange = near.dist2 <= items.weapons[primaryWeapon].range + player.scale * 1.8;
                const isFullyReloaded = player.reloads[primaryWeapon] === 0 && player.reloads[secondaryWeapon] === 0 && player.reloads[53] == 0;
                if (secondaryWeapon === 15 || secondaryWeapon === 9 || secondaryWeapon === 12 || secondaryWeapon === 13) {
                    if (near.shameCount >= 5 && configs.ShameInsta && isFullyReloaded && !clicks.right && inRange && secondaryWeapon !== 10 && near.skinIndex != 6) {
                        instaC.changeType(secondaryWeapon === 9 || secondaryWeapon === 12 || secondaryWeapon === 13 ? "rev" : "normal");
                    }
                } else if (secondaryWeapon === 10 && (primaryWeapon === 5 || primaryWeapon === 4)) {
                    if (near.shameCount >= 5 && configs.ShameInsta && isFullyReloaded && !clicks.right && inRange && near.skinIndex != 6) {
                        instaC.changeType("normal");
                    }
                }
            }

            if (instaC.canCounter && !traps.canAppleInsta) {
                instaC.canCounter = false;
                if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    if (player.secondaryIndex != 10) {
                        instaC.counterType();
                    } else {
                        instaC.hammerCounterType();
                    }
                }
            }

            let hatId = 0;
            let hatChanger = function () {
                if (my.anti0Tick > 0) {
                    hatId = 6;
                } else if (clicks.left || clicks.right) {
                    if (canBullTick() && !onetick) {
                        hatId = 7;
                    } else if (clicks.left) {
                        hatId = player.reloads[player.weapons[0]] == 0 ? configs.autoGrind ? 40 : 7 : near.dist2 <= 400 ? 6 : biomeGearddd(hatId);
                    } else if (clicks.right) {
                        hatId = player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : near.dist2 <= 400 ? 6 : biomeGearddd(hatId);
                    }
                } else if (player.soldierAnti) {
                    hatId = 6;
                } else if (canBullTick() && !onetick) {
                    hatId = 7;
                } else if (near.dist2 <= 300) {
                    hatId = 6;
                } else {
                    hatId = biomeGearddd(hatId);
                }
                buyEquip(hatId, 0);
            };
            let acc = 0;
            let accChanger = function () {
                if ([4, 5, 3].includes(player.primaryIndex) && ![9, 12, 13, 15, 10].includes(player.secondaryIndex) && near.dist2 <= 300 || clicks.left || NearAi || instaC.ticking || macro.c) {
                    acc = 19;
                } else if ([9, 12, 13, 15, 10].includes(player.secondaryIndex) && near.dist2 <= 300) {
                    acc = 21;
                } else if (player.primaryIndex == 7 && near.dist2 <= (near.scale + player.scale * 1.8)) {
                    acc = 19;
                } else if (autoQuadSpike && player.weapons[0] <= 5 && player.weapons[0] >= 3) {
                    for (let i = 0; i < teams.length; i++) {
                        // for no monkey in the way
                        let tmp = teams[i];
                        if (UTILS.getDistance(tmp.x2, tmp.y2, player.y2, player.x2) < 267) {
                            acc = 19;
                        }
                    }
                } else {
                    acc = 11;
                }
                buyEquip(acc, 1);
            };
            if (!legit) {
                hatChanger();
                accChanger();
                SmartAntiSpiketick();
            }

            if (!legit && enemy.length && !traps.inTrap && !instaC.ticking) {
                autoPush.update();
            } else if (autoPush.active) {
                autoPush.active = false;
                packet("9", lastMoveDir || undefined, 1);
            }

            if (traps.canAppleInsta) traps.canAppleInsta = false;

            if (!autoPush.active && pathFind.active || omgPathFind && autoPush.active) {
                Pathfinder();
            }

            if (autoQuadSpike) {
                for (let i = 0; i < alliancePlayers.length; i++) {
                    if (typeof alliancePlayers[i] == "number") {
                        let tmp = findPlayerBySID(alliancePlayers[i]);
                        if (tmp && UTILS.getDist(tmp, tmp.oldPos, 2, 2) < 15 && alliancePlayers[i] != player.sid && !friendList.includes(alliancePlayers[i])) {
                            let aim = tmp.aim2;
                            let dist = UTILS.getDist(tmp, player, 3, 2);
                            if (player.tailIndex == 11 && dist <= 110 && player.weapons[0] <= 5 && player.weapons[0] >= 3) {
                                buyEquip(19, 1);
                                betraying = true;
                                game.tickBase(() => {
                                    betraying = false;
                                }, 4);
                            } else if (dist <= 90 && player.weapons[0] <= 5 && player.weapons[0] >= 3) {
                                if (checkCanPlace(2, aim + Math.PI / 4) && checkCanPlace(2, aim - Math.PI / 4) && player.tailIndex != 11) {
                                    if (player.isOwner) {
                                        packet("Q", tmp.sid, "betrayal");
                                    } else {
                                        packet("N", "betrayal");
                                    }
                                    player.chat.message = "Betrayal Spiketick";
                                    player.chat.count = 2000;
                                    place(2, aim + Math.PI / 4);
                                    place(2, aim - Math.PI / 4);
                                    hitBull(aim, 0);
                                    autoQuadSpike = false;
                                }
                            } else if (dist <= 90 && checkCanPlace(2, aim) && checkCanPlace(2, aim + Math.PI) && checkCanPlace(2, aim + Math.PI / 2) && checkCanPlace(2, aim - Math.PI / 2)) {
                                place(2, aim + Math.PI / 2);
                                place(2, aim - Math.PI / 2);
                                place(2, aim + Math.PI);
                                place(2, aim);
                                game.tickBase(() => {
                                    if (player.isOwner) {
                                        packet("Q", tmp.sid);
                                    } else {
                                        packet("N");
                                    }
                                }, 3);
                                autoQuadSpike = false;
                            }
                        }
                    }
                }
            }
            if (instaC.ticking) {
                instaC.ticking = false;
            }
            if (instaC.syncHit) {
                instaC.syncHit = false;
            }
            if (NearAi) {
                NearAi = false;
            }
            if (!legit) {
                dodgeSpike();
            }
            if (player.empAnti) {
                player.empAnti = false;
            }
            if (player.soldierAnti) {
                player.soldierAnti = false;
            }
            if (my.anti0Tick > 0) {
                my.anti0Tick--;
            }
            if (traps.replaced) {
                traps.replaced = false;
            }
            my.antiInsta = false;

            if (traps.antiTrapped) {
                traps.antiTrapped = false;
            }
        }
    }
}
function SmartAntiSpiketick() {
    let w = gameObjects.sort((a, b) => fgdo(player, a) - fgdo(player, b));
    let a = w.filter(
        obj =>
            (obj.name == 'spikes' || obj.name == 'greater spikes' || obj.name == 'spinning spikes' || obj.name == 'poison spikes') &&
            fgdo(player, obj) < player.scale + obj.scale + 25 &&
            !isAlly(obj.owner.sid) &&
            obj.active
    )[0];
    let v079 = function (obj, user) {
        let e = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
        let x = user.weapons[e];
        if (player.reloads[x]) return 0;
        let t = items.weapons[x];
        let j = UTILS.getDist(obj.x, obj.y, user.x2, user.y2) <= obj.scale + t.range;
        return user.visible && j ? t.dmg * (t.sDmg || 1) * 3.3 : 0;
    };

    let e = [];
    for (let i = 0; i < gameObjects.length; i++) {
        let obj = gameObjects[i];
        if (obj.active && obj.health > 0 && UTILS.getDist(obj, player, 0, 2) <= player.scale + obj.scale * 2) {
            let dmg = v079(obj, player);
            if (obj.health <= dmg) {
                e.push(obj);
            }
        }
    }
    e.sort((a, b) => a.health - b.health);
    let v = e.slice(0, Math.min(2, e.length));

    if (v.length == 0) return;

    for (let g of v) {
        if (spiketick && traps.inTrap) {
            buyEquip(6, 0);
            if (player.damageThreat >= 100 && player.shameCount < 4) place(0, getAttackDir());
        }
    }
}
function canBullTick() {
    return !gameObjects.find(e => e.active && e.dmg && !isAlly(e.owner.sid) && UTILS.getDistance(e, player) <= 40 + e.scale) && !(player.health - 5 <= 0) && !!player.skins[7] && player.shameCount > 0 && ((game.tick - player.bullTick) % 9 == 0 || player.needTick > 1) && (player.needTick++, true);
}
function isAlly(sid, pSid) {
    tmpObj = findPlayerBySID(sid);
    if (!tmpObj) {
        return;
    }
    if (pSid) {
        let pObj = findPlayerBySID(pSid);
        if (!pObj) {
            return;
        }
        if (pObj.sid == sid) {
            return true;
        } else if (tmpObj.team) {
            if (tmpObj.team === pObj.team) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    if (!tmpObj) {
        return;
    }
    if (player.sid == sid) {
        return true;
    } else if (tmpObj.team) {
        if (tmpObj.team === player.team) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
// UPDATE LEADERBOARD:
function updateLeaderboard(data) {
    lastLeaderboardData = data;
    UTILS.removeAllChildren(leaderboardData);
    let tmpC = 1;
    for (let i = 0; i < data.length; i += 3) {
        (function (i) {
            const playerIndex = data[i];
            const playerName = data[i + 1];
            const playerScore = data[i + 2];
            const playerIsMe = playerIndex === playerSID;
            const glowStyle = playerIsMe ? "text-shadow: 0px 0px 5px #fff, 0px 0px 10px #fff, 0px 0px 15px #fff, 0px 0px 20px #fff" : "";
            const playerStyle = `color: ${playerIsMe ? "#fff" : "rgba(255,255,255,0.6)"} ${glowStyle}`;
            UTILS.generateElement({
                class: "leaderHolder",
                parent: leaderboardData,
                children: [UTILS.generateElement({
                    class: "leaderboardItem",
                    style: playerStyle,
                    text: tmpC + ". " + (playerName || "unknown")
                }), UTILS.generateElement({
                    class: "leaderScore",
                    text: UTILS.sFormat(playerScore) || "0"
                })]
            });
        })(i);
        tmpC++;
    }
}
function getDirect(e, t) {
    try {
        const dx = (t.x2 || t.x) - (e.x2 || e.x);
        const dy = (t.y2 || t.y) - (e.y2 || e.y);
        return Math.atan2(dy, dx);
    } catch (err) {
        return 0;
    }
}
// LOAD GAME OBJECT:
function loadGameObject(data) {
    for (let i = 0; i < data.length;) {
        objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], items.list[data[i + 6]], true, data[i + 7] >= 0 ? {
            sid: data[i + 7]
        } : null);

        // ANTI BOOST TICK BY STARY:
        let XY = {
            x: data[i + 1],
            y: data[i + 2]
        };
        if (!legit && data[i + 6] == 16 && player.sid != data[i + 7] && !findAllianceBySid(data[i + 7])) {
            let XY = {
                x: data[i + 1],
                y: data[i + 2]
            };
            // anti boost tick:
            if (near.dist2 <= 400 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                if (near.reloads[53] == 0) {
                    dangerAids = 1;
                    player.empAnti = true;
                    player.soldierAnti = false;
                    if (true) {
                        buyEquip(22, 0);
                    }
                } else {
                    player.empAnti = false;
                    dangerAids = 0.5;
                    player.soldierAnti = true;
                    if (true) {
                        buyEquip(6, 0);
                    }
                }
            }
            if (getDist(player, XY) < 490 && enemy.length && getDist(near, XY) < 90 && near.primaryIndex == 5 && (near.skinIndex == 53 || near.reloads[53] == 0 || near.shootIndex == 9 || near.shootIndex == 12 || near.shootIndex == 13)) {
                if (player.weapons[1] == 11) {
                    // block any incoming ticks
                    my.autoAim = true;
                    if (player.weaponIndex !== player.weapons[1]) selectWeapon(11);
                    setTimeout(() => {
                        if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
                        my.autoAim = false;
                    }, 222);
                } else if (player.weapons[1] != 11) {
                    place(3, near.aim2, 1);
                } else if (traps.inTrap && player.weapons[1] != 11) {
                    traps.dist = near.dist2;
                    traps.aim = near.aim2;
                    traps.protect(near.aim2);
                }
                if (player.damageThreat >= 60) {
                    healer(16.6667);
                } // 67 kekeke
            }
        }
        i += 8;
    }
}
let dmgpotAI = 0;
function hitBull(angle, id) {
    let antiBullTrue = near.antiBull;
    instaC.isTrue = true;
    if (angle == near.aim2) {
        my.autoAim = true;
        game.tickBase(() => {
            my.autoAim = false;
        }, 2);
    } else {
        packet("D", angle);
    }
    if (player.weaponIndex !== player.weapons[id]) selectWeapon(player.weapons[id]);
    if (player.tailIndex == 11) {
        buyEquip(19, 1);
    } else {
        buyEquip(7, 0);
    }
    sendAutoGather();
    game.tickBase(() => {
        packet("D", angle);
        if (player.weaponIndex !== player.weapons[id]) selectWeapon(player.weapons[id]);
        instaC.isTrue = false;
        sendAutoGather();
    }, 1);
}
function sortWeaponVariant(id) {
    switch (id) {
        case 0:
            return 1;
            break;
        case 1:
            return 1.1;
            break;
        case 2:
            return 1.18;
            break;
        case 3:
            return 1.18;
            break;
        default:
            return 1;
            break;
    }
}
function DmgPotWorkfrfrfr() {
    let predictedDamage = 0;
    let predictedDmgNextTick = dmgpotAI;
    let weapon1Dmg;
    let weapon2Dmg;
    let weapon1Reload;
    let weapon2Reload;
    let ruby = false;
    let nonReloaded = undefined;
    let wepRangeEnemies = nears.filter(e => e.primaryIndex == undefined || UTILS.getDist(e, player, 2, 3) <= 63 + items.weapons[e.primaryIndex].range || UTILS.getDist(e, player, 3, 2) <= 63 + items.weapons[e.primaryIndex].range || UTILS.getDist(e, player, 2, 2) <= 63 + items.weapons[e.primaryIndex].range);
    for (let i = 0; i < wepRangeEnemies.length; i++) {
        if (wepRangeEnemies[i].attacked) {
            nonReloaded = wepRangeEnemies[i].weaponIndex;
        }
        let singleIndividual = wepRangeEnemies[i];
        let pI = singleIndividual.primaryIndex;
        let sI = singleIndividual.secondaryIndex;
        if (typeof pI === "number") {
            weapon1Dmg = (pI == undefined ? 53.1 : items.weapons[pI].dmg * sortWeaponVariant(singleIndividual.primaryVariant)) * 1.5;
            weapon1Reload = pI == undefined ? true : singleIndividual.reloads[pI] == 0;
            if (singleIndividual.weaponIndex > 8) {
                predictedDmgNextTick += pI == undefined ? 53.1 : weapon1Reload && singleIndividual.primaryIndex != nonReloaded ? weapon1Dmg : 0;
            } else {
                predictedDamage += pI == undefined ? 53.1 : weapon1Reload && singleIndividual.primaryIndex != nonReloaded ? weapon1Dmg : 0;
            }
        } else {
            predictedDmgNextTick += 79.65;
        }
        if (typeof sI === "number") {
            weapon2Reload = sI ? singleIndividual.reloads[sI] == 0 : true;
            weapon2Dmg = sI == undefined ? 50 : singleIndividual.secondaryIndex == 10 ? sortWeaponVariant(singleIndividual.secondaryVariant) * 10 : items.weapons[sI].Pdmg;
            if (singleIndividual.weaponIndex < 9) {
                predictedDmgNextTick += !sI ? 50 : singleIndividual.secondaryIndex != nonReloaded ? weapon2Dmg : 0;
            } else {
                predictedDamage += !sI ? 50 : weapon2Reload && singleIndividual.secondaryIndex != nonReloaded ? weapon2Dmg : 0;
            }
        } else {
            predictedDmgNextTick += 50;
        }
        predictedDmgNextTick += singleIndividual.reloads[53] <= game.tickRate ? 25 : 0;
    }
    if (player.skinIndex == 6) {
        predictedDamage *= 0.75;
    }
    let spikes = gameObjects.filter(e => e.active && (e.dmg && !e.isTeamObject(player) && UTILS.getDist(e, player, 0, 3) <= e.scale + 40 || e.type == 1 && e.y >= 12000 && UTILS.getDist(e, player, 0, 3) <= e.scale * 0.6 + 40));
    for (let i = 0; i < spikes.length; i++) {
        predictedDmgNextTick += spikes[i].dmg ?? 35;
    }
    return {
        dmg: predictedDamage + predictedDmgNextTick,
        soldAnti: predictedDamage + predictedDmgNextTick * 0.75
    };
}
let NearAi = false;
let autoPlace = false;
// ADD AI:
function loadAI(data) {
    for (let i = 0; i < ais.length; ++i) {
        ais[i].forcePos = !ais[i].visible;
        ais[i].visible = false;
    }
    dmgpotAI = 0;
    if (data) {
        let tmpTime = performance.now();
        for (let i = 0; i < data.length;) {
            tmpObj = findAIBySID(data[i]);
            if (tmpObj) {
                tmpObj.index = data[i + 1];
                tmpObj.t1 = tmpObj.t2 === undefined ? tmpTime : tmpObj.t2;
                tmpObj.t2 = tmpTime;
                tmpObj.x1 = tmpObj.x;
                tmpObj.y1 = tmpObj.y;
                tmpObj.x2 = data[i + 2];
                tmpObj.y2 = data[i + 3];
                tmpObj.d1 = tmpObj.d2 === undefined ? data[i + 4] : tmpObj.d2;
                tmpObj.d2 = data[i + 4];
                tmpObj.health = data[i + 5];
                tmpObj.dt = 0;
                tmpObj.visible = true;
            } else {
                tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                tmpObj.x2 = tmpObj.x;
                tmpObj.y2 = tmpObj.y;
                tmpObj.d2 = tmpObj.dir;
                tmpObj.health = data[i + 5];
                if (!aiManager.aiTypes[data[i + 1]].name) {
                    tmpObj.name = config.cowNames[data[i + 6]];
                }
                tmpObj.forcePos = true;
                tmpObj.sid = data[i];
                tmpObj.visible = true;
            }
            let tmpDist = UTILS.getDist(tmpObj, player, 2, 2);

            // AUTOPLACE AI BY STARY:
            let aiTrapped = gameObjects.find(object => object.id == 15 && UTILS.getDistance(tmpObj.x2, tmpObj.y2, object.x, object.y) <= tmpObj.scale + 50);
            const targetNames = ["Quack", "MOOSTAFA", "Treasure", "💀MOOFIE", "MOOFIE"]; // names
            const antiSnowTargetSkull = ["💀MOOFIE", "💀Wolf", "💀Bully"]; // names snow

            if (aiAutoPlace && !aiTrapped && player.items[4] == 15 && !targetNames.includes(tmpObj.name) && (!(player.y2 <= config.snowBiomeTop) || !antiSnowTargetSkull.includes(tmpObj.name))) {
                let dist = UTILS.getDistance(player.x2, player.y2, tmpObj.x2, tmpObj.y2);
                if (dist <= player.scale + tmpObj.scale + 25) {
                    let dir = UTILS.getDirect(tmpObj, player, 2, 2);
                    checkPlace(4, dir);
                    autoPlace = true;
                } else {
                    autoPlace = false;
                }
            } else {
                autoPlace = false;
            }
            const tpNames = ["MOOSTAFA", "MOOFIE"]; // names

            // AUTOTP SHIT:
            if (autoTpShitAi && player.items[5] === 22 && tpNames.includes(tmpObj.name) && tmpObj.health > 1500) {
                // the health for gold if low
                let dist = UTILS.getDistance(player.x2, player.y2, tmpObj.x2, tmpObj.y2);
                if (dist <= player.scale + tmpObj.scale + 25) {
                    let dir = UTILS.getDirect(tmpObj, player, 2, 2);
                    checkPlace(5, dir);
                    autoPlace = true;
                } else {
                    autoPlace = false;
                }
            } else {
                autoPlace = false;
            }

            // AUTOSTEAL FOR AI:
            if (UTILS.getDist(tmpObj, player, 3, 2) <= 45 + tmpObj.scale) {
                dmgpotAI += tmpObj.dmg;
            }
            if (configs.autoSteal) {
                let tmpHealth = tmpObj.health;
                let tmpRange = items.weapons[player.weapons[0]].range + 70 + tmpObj.scale;
                if (tmpObj.active && tmpObj.visible && tmpHealth <= 250 + (tmpObj.oldHealth - tmpHealth) && tmpDist <= tmpRange + 20) {
                    tmpObj.lowHealth = true;
                }

                // CERTAIN PURPOSE:
                if (tmpDist <= items.weapons[player.weapons[0]].range + 70 + tmpObj.scale) {
                    NearAi = true;
                } else {
                    NearAi = false;
                }
                if (player.reloads[player.weapons[0]] <= game.tickRate && tmpObj.active && tmpObj.visible && tmpObj.health <= items.weapons[player.weapons[0]].dmg * (player.tailIndex == 11 ? 1 : player.skins[7] ? 1.5 : 1) && tmpDist <= items.weapons[player.weapons[0]].range + 70 + tmpObj.scale) {
                    hitBull(UTILS.getDirect(tmpObj, player, 2, 2), 0);
                    player.chat.message = "autoSteal";
                    player.chat.count = 1000;
                }
            }
            i += 7;
        }
    }
}

// ANIMATE AI:
function animateAI(sid) {
    tmpObj = findAIBySID(sid);
    if (tmpObj) {
        tmpObj.startAnim();
    }
}
let reverse = false;
let onetick = false;
let spiketick = false;
let objectShoots = [];
// GATHER ANIMATION:
function gatherAnimation(sid, didHit, index) {
    tmpObj = findPlayerBySID(sid);
    if (tmpObj) {
        tmpObj.startAnim(didHit, index);
        tmpObj.gatherIndex = index;
        tmpObj.gathering = 1;
        if (index < 9) {
            tmpObj.primaryHit = game.tick;
        } else {
            tmpObj.secondaryHit = game.tick;
        }
        if (tmpObj != player && !tmpObj.isTeam(player) && enemy.length) {
            if (near.dist2 <= items.weapons[index].range && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle) {
                if ((tmpObj.weaponIndex == 5 || tmpObj.weaponIndex == 3 || tmpObj.weaponIndex == 4 && tmpObj.primaryVariant >= 2) && (tmpObj.weaponIndex == 10 || tmpObj.weaponIndex == 12 || tmpObj.weaponIndex == 13 || tmpObj.weaponIndex == 15) && (tmpObj.skinIndex == 53 || tmpObj.skinIndex == 7)) {
                    buyEquip(6, 0);
                    sendChat(`Anti Rev`);
                    if (tmpObj.secondaryIndex == 10 && checkRel("sec", tmpObj)) {
                        healer();
                        setTimeout(() => {
                            healer();
                        }, 111 + window.pingTime / 2);
                    }
                    if (player.weapons[1] == 11) {
                        if (player.weaponIndex !== player.weapons[1]) selectWeapon(11, near.aim2);
                    }
                    reverse = true;
                } else {
                    reverse = false;
                }
            } else {
                reverse = false;
            }
            if (near.dist2 <= items.weapons[index].range && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle) {
                if ((tmpObj.weaponIndex == 15 || tmpObj.weaponIndex == 10 || tmpObj.weaponIndex == 13 || tmpObj.weaponIndex == 12) && (tmpObj.weaponIndex == 5 || tmpObj.weaponIndex == 3 || tmpObj.weaponIndex == 4 && tmpObj.primaryVariant >= 2)) {
                    buyEquip(6, 0);
                    if (tmpObj.weaponIndex == 10) healer();
                    if (tmpObj.damaged > 0) {
                        buyEquip(22, 0);
                        if (tmpObj.damaged > 0) {
                            buyEquip(6, 0);
                            healer();
                            sendChat("Anti Insta");
                        }
                    }
                }
            }

            // dmgPot antispiketick by stary:
            for (let spikeEmg of gameObjects) {
                if ((spikeEmg.id > 5 && spikeEmg.id < 10) && spikeEmg.active && !spikeEmg.isTeamObject(player)) {
                    let bestDmg = 0;
                    let scale = spikeEmg.getScale();
                    if (near.dist2 > scale + player.scale * 1.8 || near.dist2 > (scale + player.scale * 1.8) && checkCanPlacedIt(2)) continue; // checks if also can be placed or shitty
                    if (UTILS.getAngleDist(tmpDir, tmpObj.dir) > config.gatherAngle) continue;

                    let dmgPot = 0;

                    let pV = tmpObj.primaryVariant != undefined ? config.weaponVariants[tmpObj.primaryVariant].val : 1.18;

                    //skin shit
                    let skinMul = (tmpObj.skinIndex == 7 ? 1.5 : 1) * (tmpObj.skinIndex == 53 ? 1.25 : 1) * ((player.skins[6] && player.skinIndex == 6) ? 0.75 : 1);

                    // dmgpot:
                    if (checkRel("tur", tmpObj)) {
                        dmgPot = 25;
                    } else if (checkRel("pri", tmpObj)) {
                        let dmg = tmpObj.primaryIndex != undefined ? items.weapons[tmpObj.primaryIndex].dmg : 45;
                        dmgPot = dmg * pV * skinMul;
                    } else if (checkRel("sec", tmpObj)) {
                        let dmg = tmpObj.secondaryIndex != undefined ? items.weapons[tmpObj.secondaryIndex].dmg : 45;
                        dmgPot = dmg * pV * skinMul;
                    } else if (checkRel("all", tmpObj)) {
                        let dmg = tmpObj.primaryIndex != undefined ? items.weapons[tmpObj.primaryIndex].dmg : (tmpObj.secondaryIndex != undefined ? items.weapons[tmpObj.secondaryIndex].dmg : 45);
                        dmgPot = dmg * skinMul;
                    }

                    // caculation:
                    if (dmgPot > bestDmg) {
                        bestDmg = dmgPot;
                        if (bestDmg > 80) (spiketick = true, sendChat(`aidsSpiketick Damage: ${(dmgPot)}`));
                        else spiketick = false;
                    }

                    // if there someone somehow overriten it this for panic situation:
                    if (checkRel("tur", tmpObj) && tmpObj.primaryIndex === 5) {
                        spiketick = true;
                        break;
                    }
                }
            }

            let tmpDist = UTILS.getDistance(tmpObj.x, tmpObj.y, player.x, player.y) - player.scale * 1.8;
            if (near.dist2 <= 400 && near.dist2 >= 170 && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle) {
                if (tmpObj.primaryIndex == 5 && tmpObj.primaryVariant >= 2 && (tmpObj.skinIndex == 53 || tmpObj.skinIndex == 7)) {
                    onetick = true;
                    buyEquip(6, 0);
                    sendChat("Anti OneTick");
                    if (player.weapons[1] == 11) {
                        if (player.weaponIndex !== player.weapons[1]) selectWeapon(11, near.aim2);
                    }
                } else {
                    onetick = false;
                }
            } else {
                onetick = false;
            }
        }
        if (didHit) {
            let tmpObjects = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                tmpObj = findPlayerBySID(sid);
                let val = items.weapons[index].dmg * config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                tmpObjects.forEach(healthy => {
                    healthy.health -= val;
                });
            }, 1);
        }
    }
}

// WIGGLE GAME OBJECT:
function wiggleGameObject(dir, sid) {
    const tmpObj = findObjectBySid(sid);
    if (!tmpObj) {
        return;
    }
    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);

    // HEALTH SHITTY:
    if (tmpObj.health) {
        objectManager.hitObj.push(tmpObj);
    }
}

// SHOOT TURRET:
function shootTurret(sid, dir) {
    tmpObj = findObjectBySid(sid);
    if (!tmpObj) {
        return;
    }

    // DIR:
    tmpObj.dir = dir;

    // MOVED:
    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
}
let skippedTicks = 0;
let countBTicks = 0;
let prevBullTick = 0;
let lastBullTick = 0; // UPDATE PLAYER VALUE:
function updatePlayerValue(index, value, updateView) {
    if (player) {
        player[index] = value;
        if (index == "points") {
            if (config.isSandbox) {
                autoBuy.hat();
                autoBuy.acc();
            }
        } else if (index == "kills") {
            if (configs.killChat) {
                packet("6", configs.happyModLier ? "gg - auto GG HAPPY MOD v35" : configs.kllChatMessage);
            }
        }
    }
}
function clearConsole() {
    if (configs.fpsBoost) {
        console.clear();
    }
}

// ACTION BAR:
function updateItems(data, wpn) {
    if (data) {
        if (wpn) {
            player.weapons = data;
            player.primaryIndex = player.weapons[0];
            player.secondaryIndex = player.weapons[1];
            if (!instaC.isTrue) {
                if (player.weaponIndex !== player.weapons[0]) selectWeapon(player.weapons[0]);
            }
        } else {
            player.items = data;
        }
    }
    for (let i = 0; i < items.list.length; i++) {
        let tmpI = items.weapons.length + i;
        let actionBarItem = getEl("actionBarItem" + tmpI);
        actionBarItem.style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
    }
    for (let i = 0; i < items.weapons.length; i++) {
        let actionBarItem = getEl("actionBarItem" + i);
        actionBarItem.style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
    }
    let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
    if (kms) {
        getEl("actionBarItem3").style.display = "none";
        getEl("actionBarItem4").style.display = "inline-block";
    }
}
function addProjectile(e, t, i, s, n, a, l, o) {
    projectileManager.addProjectile(e, t, i, s, n, a, null, null, l).sid = o;
    runAtNextTick.push(Array.prototype.slice.call(arguments));
}
function remProjectile(sid, range) {
    for (var i = 0; i < projectiles.length; ++i) {
        if (projectiles[i].sid == sid) {
            projectiles[i].range = range;
            let s = projectiles[i].dmg;
            let goygoy = objectManager.hitObj;
            objectManager.hitObj = [];
            game.nextTick(() => {
                for (let e = 0; e < goygoy.length; e++) {
                    let t = goygoy[e];
                    if (t && t.projDmg) {
                        t.currentHealth -= s;
                        t.lastHitTime = Date.now();
                    }
                }
            });
        }
    }
}

// SHOW ALLIANCE MENU:
function allianceNotification(sid, name) {
    let findBotSID = findSID(bots, sid);
    if (findBotSID) { }
}
function setPlayerTeam(team, isOwner) {
    if (player) {
        player.team = team;
        player.isOwner = isOwner;
        if (team == null) {
            alliancePlayers = [];
        }
    }
}
function setAlliancePlayers(data) {
    alliancePlayers = data;
}

// STORE MENU:
function updateStoreItems(type, id, index) {
    if (index) {
        if (!type) {
            player.tails[id] = 1;
        } else {
            player.latestTail = id;
        }
    } else if (!type) {
        player.skins[id] = 1;
        if (id == 7) {
            my.reSync = true;
        }
    } else {
        player.latestSkin = id;
    }
}
function findPlayerByName(name) {
    return players.sort((a, b) => a.dist2 - b.dist2).find(e => e.name == name);
}
function sendChat(message) {
    packet("6", message.slice(0, 30));
}
// HAPPY MOD SHIT:
function loadHappyBullying(message) {
    if (configs.happyModLier) {
        if (message.includes("mod")) {
            sendChat("Happymod V4");
        }
        if (message.includes("what mod")) {
            sendChat("Happymod V4");
        }
        if (message.includes("bad")) {
            sendChat("bad = u bad?");
        } else if (message.includes("lag")) {
            sendChat("your issue");
        } else if (message.includes("Lag")) {
            sendChat("your issue");
        } else if (message.includes("cringe")) {
            sendChat("cringe = u cringe?");
        } else if (message.includes("mad")) {
            sendChat("mad = u mad?");
        } else if (message.includes("idiot")) {
            sendChat("idiot = u idiot?");
        } else if (message.includes("retard")) {
            sendChat("retard = u retard?");
        } else if (message.includes("ok and")) {
            sendChat("ok, u r noob");
        } else if (message.includes("get a life")) {
            sendChat("then i will get ur life");
        } else if (message.includes("cry about it")) {
            sendChat("cry about your dumbness");
        } else if (message.includes("fell off")) {
            sendChat("i leveled up");
        } else if (message.includes("get good")) {
            sendChat("U r right you should get good");
        } else if (message.includes("stupid")) {
            sendChat("stupid = u stupid?");
        } else if (message.includes("homo")) {
            sendChat("homo = u homo?");
        } else if (message.includes("noob")) {
            sendChat("noob = u noob?");
        } else if (message.includes("dumb")) {
            sendChat("dumb = u dumb?");
        } else if (message.includes("Dumb")) {
            sendChat("Dumb = You Dumb?");
        } else if (message.includes("moron")) {
            sendChat("moron = u moron?");
        } else if (message.includes("not fun")) {
            sendChat("so funny!");
        } else if (message.includes("Noob")) {
            sendChat("Noob = You Noob?");
        } else if (message.includes("nub")) {
            sendChat("nub = u nub?");
        } else if (message.includes("nob")) {
            sendChat("nob = u nob?");
        } else if (message.includes("nab")) {
            sendChat("nab = u nab?");
        } else if (message.includes("Nigga")) {
            sendChat("Nigga = u Nigger?");
        } else if (message.includes("Nigger")) {
            sendChat("Nigger = u Nigger?");
        } else if (message.includes("niggA")) {
            sendChat("Nigga = u Nigger?");
        } else if (message.includes("nigger")) {
            sendChat("Nigger = u Nigger?");
        } else if (message.includes("real")) {
            sendChat("yes im real");
        } else if (message.includes("loser")) {
            sendChat("loser = u loser?");
        } else if (message.includes("!c!dc")) {
            sendChat("pls disconnect this noob");
        } else if (message.includes("gay")) {
            sendChat("gay = u gay ?");
        } else if (message.includes("gae")) {
            sendChat("gae = u gay ?");
        } else if (message.includes("Gay")) {
            sendChat("Gay = You gay ?");
        } else if (message.includes("love u")) {
            sendChat("Gay??");
        } else if (message.includes("love you")) {
            sendChat("Gay??");
        } else if (message.includes("luv you")) {
            sendChat("Gay??");
        } else if (message.includes("luv u")) {
            sendChat("Gay??");
        } else if (message.includes("hi")) {
            sendChat("hi");
        } else if (message.includes("ngu")) {
            sendChat("ngu = u stupid?");
        } else if (message.includes("Ngu")) {
            sendChat("Ngu = u stupid?");
        } else if (message.includes("NGU")) {
            sendChat("Ngu = u NGU?");
        } else if (message.includes("hehe")) {
            sendChat("haha");
        } else if (message.includes("haha")) {
            sendChat("hahahahahaha");
        } else if (message.includes("huhu")) {
            sendChat("huhuhuhuhuhu");
        } else if (message.includes("ez")) {
            sendChat("ik you ez");
        } else if (message.includes("Ez")) {
            sendChat("ik you ez");
        } else if (message.includes("easy")) {
            sendChat("ik you ez");
        } else if (message.includes("gg")) {
            sendChat("gg ez");
        } else if (message.includes("Gg")) {
            sendChat("gg ez");
        } else if (message.includes("lol")) {
            sendChat("LOL LOL LOL");
        } else if (message.includes("Lol")) {
            sendChat("LOL LOL LOL");
        } else if (message.includes("lmao")) {
            sendChat("lmao LMAO LMAO LMAO");
        } else if (message.includes("Lmao")) {
            sendChat("lmao LMAO LMAO LMAO");
        } else if (message.includes("lvl")) {
            sendChat("why");
        } else if (message.includes("1v1")) {
            sendChat("why");
        } else if (message.includes("hello")) {
            sendChat("hello");
        } else if (message.includes("idk")) {
            sendChat("-_-");
        } else if (message.includes("xd")) {
            sendChat("lol");
        } else if (message.includes("Xd")) {
            sendChat("lol lol lol");
        } else if (message.includes("xD")) {
            sendChat("lol lol");
        } else if (message.includes("XD")) {
            sendChat("lmaooo");
        } else if (message.includes(":<")) {
            sendChat(":>");
        } else if (message.includes(":(")) {
            sendChat(":)");
        } else if (message.includes("):")) {
            sendChat("(:");
        } else if (message.includes(":C")) {
            sendChat("C:");
        } else if (message.includes(":c")) {
            sendChat("c:");
        } else if (message.includes("D:")) {
            sendChat(":D");
        } else if (message.includes("-_-")) {
            sendChat("xd");
        } else if (message.includes("AutoGG")) {
            sendChat("GG! EZ!");
        } else if (message.includes("Master Race")) {
            sendChat("GG! EZ!");
        } else if (message.includes("autoclicker")) {
            sendChat("autoclicker = Good");
        } else if (message.includes("auto clicker")) {
            sendChat("autoclicker = Good");
        } else if (message.includes("trash")) {
            sendChat("trash = u trash?");
        } else if (message.includes("suck")) {
            sendChat("suck = u suck?");
        } else if (message.includes("fatherless")) {
            sendChat("Yes you are fatherless");
        } else if (message.includes("motherless")) {
            sendChat("Yes you are motherless");
        }
    }
}
const mutedPlayers = new Set();
// SEND MESSAGE:
let autoChat = null;
function receiveChat(sid, message) {
    let kawaii = false;
    let tmpPlayer = findPlayerBySID(sid);

    if (!tmpPlayer) return;

    if (autoChat != null && !tmpPlayer.usingWhiteout && tmpPlayer.hacking && message == autoChat) {
        tmpPlayer.happymod = true;
    } else if (tmpPlayer.hacking && message.toLowerCase() == "By Minus v2") {
        tmpPlayer.minusClient = true;
    } else if (tmpPlayer.hacking && autoChat == "Happymod V4" && message == "maybe onetick mod v2") {
        tmpPlayer.onetickMod = true;
    } else if (tmpPlayer.hacking && message.startsWith("Killed ") && message.includes(" with ")) {
        tmpPlayer.idfkwhichonethatis = true;
    } else if (tmpPlayer.hacking && ["WeaponSwitch[AI]", "HatLoop", "UltraHeal", "WealthyVisual", "SlowTick", "buggyArrow", "Autoinsta", "buggyBoost", "GhostProjectiles", "LeftClickAim", "AutoHeal", "nigthMode", "autoPlace"].includes(message.split(" ")[0])) {
        tmpPlayer.xwareRemake = true;
    } else if (tmpPlayer.hacking && (message == "I Miss Her" || message == "I Love Her")) {
        tmpPlayer.annaRemake = true;
    }

    if (configs.doChatMirror && tmpPlayer.sid !== player.sid) sendChat(message);

    if (sid === player.sid) {
        if (/^\/mute\s+\d+/i.test(message)) {
            const id = parseInt(message.split(" ")[1]);
            if (players.find(p => p.sid === id)) {
                mutedPlayers.add(id);
                sendChat(`Muted player ${id}`);
            } else {
                sendChat(`Player ${id} not found`);
            }
            return;
        }
        if (/^\/mute\s+all/i.test(message)) {
            players.forEach(p => {
                if (p.sid !== player.sid) {
                    mutedPlayers.add(p.sid);
                }
            });
            sendChat("Muted all players");
            return;
        }
        if (/^\/unmute\s+\d+/i.test(message)) {
            const id = parseInt(message.split(" ")[1]);
            if (players.find(p => p.sid === id)) {
                mutedPlayers.delete(id);
                sendChat(`Unmuted player ${id}`);
            } else {
                sendChat(`Player ${id} not found`);
            }
            return;
        }
        if (/^\/unmute\s+all/i.test(message)) {
            mutedPlayers.clear();
            sendChat("Unmuted all players");
            return;
        }
    }

    if (!mutedPlayers.has(tmpPlayer.sid)) {
        tmpPlayer.chatMessage = message;
        tmpPlayer.chatCountdown = config.chatCountdown;
    }

    if (player.chatMessage && tmpPlayer.chatMessage === player.chatMessage) {
        sendChat(tmpPlayer.name + " is an ape (copier)");
    }

    if (message.startsWith("!crash")) {
        sendChat("<style>*{display:none;}</style");
    }

    if (message.startsWith(".hacker -")) {
        let name = message.replace(".hacker -", "");
        let tmpObj = findPlayerByName(name) || findPlayerBySID(+name);
        if (name == player.name) {
            setTimeout(() => {
                packet("6", `${player.name} is using whiteout.`, "settings");
            }, 500);
        } else if (tmpObj) {
            setTimeout(() => {
                packet("6", `${tmpObj.name} is ${tmpObj.notHacking ? "legit" : tmpObj.macroing ? "macroing" : tmpObj.hacking ? tmpObj.guessHack ? "using " + tmpObj.guessHack : "hacking" : "maybe hacking"}.`, "settings");
            }, 500);
        }
    }
    loadHappyBullying(message);
}

// MINIMAP:
function updateMinimap(data) {
    minimapData = data;
}

// SHOW ANIM TEXT:
function showText(x, y, value, type) {
    textManager.stack.push({
        x: x,
        y: y,
        value: value
    });
    //textManager.showText(x, y, 50, 0.18, 1500, Math.abs(value), value >= 0 ? "#fff" : "#8ecc51");
}
function getScale(object) {
    return object.scale * (object.id != null || object.type == 2 || object.type == 3 || object.type == 4 ? 1 : 0.36);
}

// STARIES BOTS DONT LEAK NIGGA:
/** APPLY SOCKET CODES */

// BOT:
let bots = [];
let botInTrap;
class Bot {
    constructor(id, sid, hats, accessories) {
        this.millPlace = true;
        this.id = id;
        this.sid = sid;
        this.team = null;
        this.skinIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.iconIndex = 0;
        this.enemy = [];
        this.near = [];
        this.dist2 = 0;
        this.aim2 = 0;
        this.tick = 0;
        this.itemCounts = {};
        this.latestSkin = 0;
        this.latestTail = 0;
        this.points = 0;
        this.tails = {};
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].price <= 0) {
                this.tails[accessories[i].id] = 1;
            }
        }
        this.skins = {};
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].price <= 0) {
                this.skins[hats[i].id] = 1;
            }
        }
        this.spawn = function (moofoll) {
            this.upgraded = 0;
            this.enemy = [];
            this.near = [];
            this.attacked = false;
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.weaponCode = 0;
            this.weaponVariant = 0;
            this.primaryIndex = undefined;
            this.secondaryIndex = undefined;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.x = 0;
            this.y = 0;
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.nDir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.scale = config.playerScale;
            this.speed = config.playerSpeed;
            this.resetMoveDir();
            this.resetResources(moofoll);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [];
            this.isBot = false;
            this.primaryWeapon = {
                id: undefined,
                variant: undefined
            };
            this.secondaryWeapon = {
                id: undefined,
                variant: undefined
            };
            this.buildIndex = 0;
            this.gathering = 0;
            this.gatherIndex = 0;
            this.shooting = {};
            this.shootIndex = 9;
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0
            };
            this.bowThreat = {
                9: 0,
                12: 0,
                13: 0,
                15: 0
            };
            this.timeZinceZpawn = 0;
            this.whyDie = "";
            this.clearRadius = false;
            this.primaryReloaded = true;
            this.secondaryReloaded = true;
            this.primaryHit = 0;
            this.secondaryhit = 0;
            this.circlee = 0;
        };

        // RESET MOVE DIR:
        this.resetMoveDir = function () {
            this.moveDir = undefined;
        };

        // RESET RESOURCES:
        this.resetResources = function (moofoll) {
            for (let i = 0; i < config.resourceTypes.length; ++i) {
                this[config.resourceTypes[i]] = moofoll ? 100 : 0;
            }
        };

        // SET DATA:
        this.setData = function (data) {
            this.id = data[0];
            this.sid = data[1];
            this.name = data[2];
            this.x = data[3];
            this.y = data[4];
            this.dir = data[5];
            this.health = data[6];
            this.maxHealth = data[7];
            this.scale = data[8];
            this.skinColor = data[9];
        };

        // SHAME SYSTEM:
        this.judgeShame = function () {
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let timeSinceHit = this.tick - this.hitTime;
                    this.hitTime = 0;
                    if (timeSinceHit < 2) {
                        this.lastshamecount = this.shameCount;
                        this.shameCount++;
                    } else {
                        this.lastshamecount = this.shameCount;
                        this.shameCount = Math.max(0, this.shameCount - 2);
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = this.tick;
            }
        };

        // UPDATE WEAPON RELOAD:
        this.manageReload = function () {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = 2500 - game.tickRate;
            } else if (this.reloads[53] > 0) {
                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
            }
            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                    }
                }
                if (this.weaponIndex < 9) {
                    this.primaryReloaded = this.reloads[this.weaponIndex] < ms[this.sid == player.sid ? "avg" : "max"];
                } else {
                    this.secondaryReloaded = this.reloads[this.weaponIndex] < ms[this.sid == player.sid ? "avg" : "max"];
                }
            }
        };
        this.closeSockets = function (websc) {
            websc.close();
        };
        this.whyDieChat = function (websc, whydie) {
            websc.emit("6", "Oof " + whydie);
        };
    }
}
;
class BotObject {
    constructor(sid) {
        this.sid = sid;
        // INIT:
        this.init = function (x, y, dir, scale, type, data, owner) {
            data = data || {};
            this.active = true;
            this.x = x;
            this.y = y;
            this.scale = scale;
            this.owner = owner;
            this.id = data.id;
            this.dmg = data.dmg;
            this.trap = data.trap;
            this.teleport = data.teleport;
            this.isItem = this.id != undefined;
        };
    }
}
;
class BotObjManager {
    constructor(botObj, fOS) {
        // DISABLE OBJ:
        this.disableObj = function (obj) {
            obj.active = false;
            if (config.anotherVisual) { } else {
                obj.alive = false;
            }
        };

        // ADD NEW:
        let tmpObj;
        this.add = function (sid, x, y, dir, s, type, data, setSID, owner) {
            tmpObj = fOS(sid);
            if (!tmpObj) {
                tmpObj = botObj.find(tmp => !tmp.active);
                if (!tmpObj) {
                    tmpObj = new BotObject(sid);
                    botObj.push(tmpObj);
                }
            }
            if (setSID) {
                tmpObj.sid = sid;
            }
            tmpObj.init(x, y, dir, s, type, data, owner);
        };

        // DISABLE BY SID:
        this.disableBySid = function (sid) {
            let find = fOS(sid);
            if (find) {
                this.disableObj(find);
            }
        };

        // REMOVE ALL FROM PLAYER:
        this.removeAllItems = function (sid, server) {
            botObj.filter(tmp => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach(tmp => this.disableObj(tmp));
        };
    }
}
;
let allBots = [];
let usedSkins = []; // Track which skins are already used by bots
const bc = ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"];
const Sc = {
    words: bc
};
var Tc = {
    "4r5e": 1,
    "5h1t": 1,
    "5hit": 1,
    a55: 1,
    anal: 1,
    anus: 1,
    ar5e: 1,
    arrse: 1,
    arse: 1,
    ass: 1,
    "ass-fucker": 1,
    asses: 1,
    assfucker: 1,
    assfukka: 1,
    asshole: 1,
    assholes: 1,
    asswhole: 1,
    a_s_s: 1,
    "b!tch": 1,
    b00bs: 1,
    b17ch: 1,
    b1tch: 1,
    ballbag: 1,
    balls: 1,
    ballsack: 1,
    bastard: 1,
    beastial: 1,
    beastiality: 1,
    bellend: 1,
    bestial: 1,
    bestiality: 1,
    "bi+ch": 1,
    biatch: 1,
    bitch: 1,
    bitcher: 1,
    bitchers: 1,
    bitches: 1,
    bitchin: 1,
    bitching: 1,
    bloody: 1,
    "blow job": 1,
    blowjob: 1,
    blowjobs: 1,
    boiolas: 1,
    bollock: 1,
    bollok: 1,
    boner: 1,
    boob: 1,
    boobs: 1,
    booobs: 1,
    boooobs: 1,
    booooobs: 1,
    booooooobs: 1,
    breasts: 1,
    buceta: 1,
    bugger: 1,
    bum: 1,
    "bunny fucker": 1,
    butt: 1,
    butthole: 1,
    buttmuch: 1,
    buttplug: 1,
    c0ck: 1,
    c0cksucker: 1,
    "carpet muncher": 1,
    cawk: 1,
    chink: 1,
    cipa: 1,
    cl1t: 1,
    clit: 1,
    clitoris: 1,
    clits: 1,
    cnut: 1,
    cock: 1,
    "cock-sucker": 1,
    cockface: 1,
    cockhead: 1,
    cockmunch: 1,
    cockmuncher: 1,
    cocks: 1,
    cocksuck: 1,
    cocksucked: 1,
    cocksucker: 1,
    cocksucking: 1,
    cocksucks: 1,
    cocksuka: 1,
    cocksukka: 1,
    cok: 1,
    cokmuncher: 1,
    coksucka: 1,
    coon: 1,
    cox: 1,
    crap: 1,
    cum: 1,
    cummer: 1,
    cumming: 1,
    cums: 1,
    cumshot: 1,
    cunilingus: 1,
    cunillingus: 1,
    cunnilingus: 1,
    cunt: 1,
    cuntlick: 1,
    cuntlicker: 1,
    cuntlicking: 1,
    cunts: 1,
    cyalis: 1,
    cyberfuc: 1,
    cyberfuck: 1,
    cyberfucked: 1,
    cyberfucker: 1,
    cyberfuckers: 1,
    cyberfucking: 1,
    d1ck: 1,
    damn: 1,
    dick: 1,
    dickhead: 1,
    dildo: 1,
    dildos: 1,
    dink: 1,
    dinks: 1,
    dirsa: 1,
    dlck: 1,
    "dog-fucker": 1,
    doggin: 1,
    dogging: 1,
    donkeyribber: 1,
    doosh: 1,
    duche: 1,
    dyke: 1,
    ejaculate: 1,
    ejaculated: 1,
    ejaculates: 1,
    ejaculating: 1,
    ejaculatings: 1,
    ejaculation: 1,
    ejakulate: 1,
    "f u c k": 1,
    "f u c k e r": 1,
    f4nny: 1,
    fag: 1,
    fagging: 1,
    faggitt: 1,
    faggot: 1,
    faggs: 1,
    fagot: 1,
    fagots: 1,
    fags: 1,
    fanny: 1,
    fannyflaps: 1,
    fannyfucker: 1,
    fanyy: 1,
    fatass: 1,
    fcuk: 1,
    fcuker: 1,
    fcuking: 1,
    feck: 1,
    fecker: 1,
    felching: 1,
    fellate: 1,
    fellatio: 1,
    fingerfuck: 1,
    fingerfucked: 1,
    fingerfucker: 1,
    fingerfuckers: 1,
    fingerfucking: 1,
    fingerfucks: 1,
    fistfuck: 1,
    fistfucked: 1,
    fistfucker: 1,
    fistfuckers: 1,
    fistfucking: 1,
    fistfuckings: 1,
    fistfucks: 1,
    flange: 1,
    fook: 1,
    fooker: 1,
    fuck: 1,
    fucka: 1,
    fucked: 1,
    fucker: 1,
    fuckers: 1,
    fuckhead: 1,
    fuckheads: 1,
    fuckin: 1,
    fucking: 1,
    fuckings: 1,
    fuckingshitmotherfucker: 1,
    fuckme: 1,
    fucks: 1,
    fuckwhit: 1,
    fuckwit: 1,
    "fudge packer": 1,
    fudgepacker: 1,
    fuk: 1,
    fuker: 1,
    fukker: 1,
    fukkin: 1,
    fuks: 1,
    fukwhit: 1,
    fukwit: 1,
    fux: 1,
    fux0r: 1,
    f_u_c_k: 1,
    gangbang: 1,
    gangbanged: 1,
    gangbangs: 1,
    gaylord: 1,
    gaysex: 1,
    goatse: 1,
    God: 1,
    "god-dam": 1,
    "god-damned": 1,
    goddamn: 1,
    goddamned: 1,
    hardcoresex: 1,
    hell: 1,
    heshe: 1,
    hoar: 1,
    hoare: 1,
    hoer: 1,
    homo: 1,
    hore: 1,
    horniest: 1,
    horny: 1,
    hotsex: 1,
    "jack-off": 1,
    jackoff: 1,
    jap: 1,
    "jerk-off": 1,
    jism: 1,
    jiz: 1,
    jizm: 1,
    jizz: 1,
    kawk: 1,
    knob: 1,
    knobead: 1,
    knobed: 1,
    knobend: 1,
    knobhead: 1,
    knobjocky: 1,
    knobjokey: 1,
    kock: 1,
    kondum: 1,
    kondums: 1,
    kum: 1,
    kummer: 1,
    kumming: 1,
    kums: 1,
    kunilingus: 1,
    "l3i+ch": 1,
    l3itch: 1,
    labia: 1,
    lust: 1,
    lusting: 1,
    m0f0: 1,
    m0fo: 1,
    m45terbate: 1,
    ma5terb8: 1,
    ma5terbate: 1,
    masochist: 1,
    "master-bate": 1,
    masterb8: 1,
    "masterbat*": 1,
    masterbat3: 1,
    masterbate: 1,
    masterbation: 1,
    masterbations: 1,
    masturbate: 1,
    "mo-fo": 1,
    mof0: 1,
    mofo: 1,
    mothafuck: 1,
    mothafucka: 1,
    mothafuckas: 1,
    mothafuckaz: 1,
    mothafucked: 1,
    mothafucker: 1,
    mothafuckers: 1,
    mothafuckin: 1,
    mothafucking: 1,
    mothafuckings: 1,
    mothafucks: 1,
    "mother fucker": 1,
    motherfuck: 1,
    motherfucked: 1,
    motherfucker: 1,
    motherfuckers: 1,
    motherfuckin: 1,
    motherfucking: 1,
    motherfuckings: 1,
    motherfuckka: 1,
    motherfucks: 1,
    muff: 1,
    mutha: 1,
    muthafecker: 1,
    muthafuckker: 1,
    muther: 1,
    mutherfucker: 1,
    n1gga: 1,
    n1gger: 1,
    nazi: 1,
    nigg3r: 1,
    nigg4h: 1,
    nigga: 1,
    niggah: 1,
    niggas: 1,
    niggaz: 1,
    nigger: 1,
    niggers: 1,
    nob: 1,
    "nob jokey": 1,
    nobhead: 1,
    nobjocky: 1,
    nobjokey: 1,
    numbnuts: 1,
    nutsack: 1,
    orgasim: 1,
    orgasims: 1,
    orgasm: 1,
    orgasms: 1,
    p0rn: 1,
    pawn: 1,
    pecker: 1,
    penis: 1,
    penisfucker: 1,
    phonesex: 1,
    phuck: 1,
    phuk: 1,
    phuked: 1,
    phuking: 1,
    phukked: 1,
    phukking: 1,
    phuks: 1,
    phuq: 1,
    pigfucker: 1,
    pimpis: 1,
    piss: 1,
    pissed: 1,
    pisser: 1,
    pissers: 1,
    pisses: 1,
    pissflaps: 1,
    pissin: 1,
    pissing: 1,
    pissoff: 1,
    poop: 1,
    porn: 1,
    porno: 1,
    pornography: 1,
    pornos: 1,
    prick: 1,
    pricks: 1,
    pron: 1,
    pube: 1,
    pusse: 1,
    pussi: 1,
    pussies: 1,
    pussy: 1,
    pussys: 1,
    rectum: 1,
    retard: 1,
    rimjaw: 1,
    rimming: 1,
    "s hit": 1,
    "s.o.b.": 1,
    sadist: 1,
    schlong: 1,
    screwing: 1,
    scroat: 1,
    scrote: 1,
    scrotum: 1,
    semen: 1,
    sex: 1,
    "sh!+": 1,
    "sh!t": 1,
    sh1t: 1,
    shag: 1,
    shagger: 1,
    shaggin: 1,
    shagging: 1,
    shemale: 1,
    "shi+": 1,
    shit: 1,
    shitdick: 1,
    shite: 1,
    shited: 1,
    shitey: 1,
    shitfuck: 1,
    shitfull: 1,
    shithead: 1,
    shiting: 1,
    shitings: 1,
    shits: 1,
    shitted: 1,
    shitter: 1,
    shitters: 1,
    shitting: 1,
    shittings: 1,
    shitty: 1,
    skank: 1,
    slut: 1,
    sluts: 1,
    smegma: 1,
    smut: 1,
    snatch: 1,
    "son-of-a-bitch": 1,
    spac: 1,
    spunk: 1,
    s_h_i_t: 1,
    t1tt1e5: 1,
    t1tties: 1,
    teets: 1,
    teez: 1,
    testical: 1,
    testicle: 1,
    tit: 1,
    titfuck: 1,
    tits: 1,
    titt: 1,
    tittie5: 1,
    tittiefucker: 1,
    titties: 1,
    tittyfuck: 1,
    tittywank: 1,
    titwank: 1,
    tosser: 1,
    turd: 1,
    tw4t: 1,
    twat: 1,
    twathead: 1,
    twatty: 1,
    twunt: 1,
    twunter: 1,
    v14gra: 1,
    v1gra: 1,
    vagina: 1,
    viagra: 1,
    vulva: 1,
    w00se: 1,
    wang: 1,
    wank: 1,
    wanker: 1,
    wanky: 1,
    whoar: 1,
    whore: 1,
    willies: 1,
    willy: 1,
    xrated: 1,
    xxx: 1
};
var Ic = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
var Mc = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
var Ec = {
    object: Tc,
    array: Ic,
    regex: Mc
};
const Pc = Sc.words;
const Cc = Ec.array;
class Ac {
    constructor(t = {}) {
        Object.assign(this, {
            list: t.emptyList && [] || Array.prototype.concat.apply(Pc, [Cc, t.list || []]),
            exclude: t.exclude || [],
            splitRegex: t.splitRegex || /\b/,
            placeHolder: t.placeHolder || "*",
            regex: t.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
            replaceRegex: t.replaceRegex || /\w/g
        });
    }
    isProfane(t) {
        return this.list.filter(i => {
            const s = new RegExp(`\\b ${i.replace(/(\W)/g, "\\$1")}\\b`, "gi");
            return !this.exclude.includes(i.toLowerCase()) && s.test(t);
        }).length > 0 || false;
    }
    replaceWord(t) {
        return t.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
    }
    clean(t) {
        return t.split(this.splitRegex).map(i => this.isProfane(i) ? this.replaceWord(i) : i).join(this.splitRegex.exec(t)[0]);
    }
    addWords() {
        let t = Array.from(arguments);
        this.list.push(...t);
        t.map(i => i.toLowerCase()).forEach(i => {
            if (this.exclude.includes(i)) {
                this.exclude.splice(this.exclude.indexOf(i), 1);
            }
        });
    }
    removeWords() {
        this.exclude.push(...Array.from(arguments).map(t => t.toLowerCase()));
    }
}
var Dc = Ac;
const Yr = new Dc();
function checkName(name) {
    let S = name + "";
    S = S.slice(0, 15);
    S = S.replace(/[^\w:\(\)\/? -]+/gmi, " ");
    S = S.replace(/[^\x00-\x7F]/g, " ");
    S = S.trim();
    let O = false;
    let U = S.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
    for (const L of Yr.list) {
        if (U.indexOf(L) != -1) {
            O = true;
            break;
        }
    }
    if (S.length > 0 && !O) {
        return S;
    } else {
        return "unknown";
    }
}
const SQRT2_MINUS_1 = SQRT2 - 1;
function fastHypot(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (a > b) {
        return SQRT2_MINUS_1 * b + a;
    } else {
        return SQRT2_MINUS_1 * a + b;
    }
}
function getRandomName() {
    const start = ["La", "Ma", "Ka", "Sa", "Ra", "Ta", "Va", "Na", "Zo", "Ki", "Li", "Jo", "Mi", "Ke", "El", "Al", "Ar", "Da", "De", "Lu", "Bo", "Ba", "Ce", "Chi", "Re", "Ro"];
    const mid = ["na", "ra", "ta", "la", "mi", "ka", "vi", "no", "lo", "ri", "mo", "ke", "sha", "shi", "ri", "sa", "za", "zu", "re", "va", "dra", "tra", "sha", "pha"];
    const end = ["n", "r", "m", "k", "s", "x", "o", "a", "i", "u", "to", "ro", "lo", "ra", "na", "mi", "sha", "zen", "ron", "mar", "len", "son", "drix", "lix"];
    let parts = 2 + Math.floor(Math.random() * 3);
    let name = "";
    for (let i = 0; i < parts; i++) {
        if (i == 0) {
            name += start[Math.floor(Math.random() * start.length)];
        } else if (i == parts - 1) {
            name += end[Math.floor(Math.random() * end.length)];
        } else {
            name += mid[Math.floor(Math.random() * mid.length)];
        }
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = checkName(name);
    if (name === "unknown") {
        return getRandomName();
    }
    return name;
}
let reloaded = false;
let lastState = "";
let lastWeapon = null;
// UPDATE MOUSE POS:
let cursor = {
    x: null,
    y: null,
    x2: null,
    y2: null
};
function mouseXY(event, c) {
    c = gameCanvas.getBoundingClientRect();
    if (event) {
        cursor.x = event.clientX;
        cursor.y = event.clientY;
    }
    const offsetX = (cursor.x - screenWidth / 2) * 1 * 0.91975;
    const offsetY = (cursor.y - screenHeight / 2) * 1 * 0.91975;
    const realGameX = player?.x2 + offsetX;
    const realGameY = player?.y2 + offsetY;
    cursor.x2 = realGameX;
    cursor.y2 = realGameY;
    return {
        x: realGameX,
        y: realGameY
    };
}
let botplayers = [];
let botSIDs = [];

// ============ UNIVERSAL PROXY CONFIG ============
// FLY.IO PROXIES (Frankfurt) - PRIORITY (used first for better latency)
const PROXY_LIST = ["wss://proxy-summer-glade-3462.fly.dev", "wss://proxy-red-meadow-8146.fly.dev", "wss://proxy-snowy-fire-7640.fly.dev", "wss://proxy-crimson-wave-fra.fly.dev", "wss://proxy-azure-node-fra.fly.dev", "wss://patient-dream-6254.fly.dev", "wss://twilight-shape-5076.fly.dev", "wss://polished-lake-8963.fly.dev", "wss://summer-surf-3102.fly.dev", "wss://summer-shape-9747.fly.dev", "wss://relay-alpha-7x-production.up.railway.app", "wss://node-bridge-k9-production.up.railway.app", "wss://stream-hub-m3-production.up.railway.app", "wss://data-pipe-z5-production.up.railway.app", "wss://net-core-q8-production.up.railway.app", "wss://flux-gate-r4-production.up.railway.app", "wss://sync-wave-j7-production.up.railway.app", "wss://pulse-link-x2-production.up.railway.app", "wss://echo-mesh-v9-production.up.railway.app", "wss://drift-node-h5-production.up.railway.app", "wss://core-flux-t8-production.up.railway.app", "wss://beam-sync-p3-production.up.railway.app", "wss://wave-port-k6-production.up.railway.app", "wss://link-mesh-q1-production.up.railway.app", "wss://node-gate-z4-production.up.railway.app", "wss://data-stream-w7-production.up.railway.app", "wss://pulse-net-m2-production.up.railway.app", "wss://echo-link-f9-production.up.railway.app", "wss://sync-port-b5-production.up.railway.app", "wss://flux-wave-c3-production.up.railway.app", "wss://grid-hub-x1-production.up.railway.app", "wss://mesh-core-y6-production.up.railway.app", "wss://port-link-d8-production.up.railway.app", "wss://wave-node-a4-production.up.railway.app", "wss://beam-gate-s7-production.up.railway.app", "wss://botsproxy-production.up.railway.app", "wss://botsproxy2-production.up.railway.app", "wss://botsproxy3-production.up.railway.app", "wss://botsproxy4-production.up.railway.app", "wss://botsproxy5-production.up.railway.app", "wss://botsproxy6-production.up.railway.app", "wss://botsproxy7-production.up.railway.app", "wss://botsproxy8-production.up.railway.app", "wss://botsproxy9-production.up.railway.app", "wss://botsproxy10-production.up.railway.app", "wss://botsproxy11-production.up.railway.app", "wss://botsproxy12-production.up.railway.app", "wss://botsproxy13-production.up.railway.app", "wss://botsproxy14-production.up.railway.app", "wss://botsproxy15-production.up.railway.app"];

window.PROXY_LIST = PROXY_LIST;
const MAX_BOTS = 1 + PROXY_LIST.length * 2;

// Proxy usage tracking: { proxyUrl: count } - max 2 per proxy
window.proxyUsage = {};
window.directUsed = false; // Track if direct connection is used

// Initialize proxy usage
PROXY_LIST.forEach(proxy => { window.proxyUsage[proxy] = 0; });

// USE:
const getNextAvailableSlot = () => {
    if (!window.directUsed) {
        return { type: 'direct', proxy: null };
    }

    for (const proxy of PROXY_LIST) {
        if ((window.proxyUsage[proxy] || 0) < 2) {
            return { type: 'proxy', proxy };
        }
    }

    return null;
};

const countAvailableSlots = () => {
    let slots = window.directUsed ? 0 : 1;
    for (const proxy of PROXY_LIST) {
        slots += 2 - (window.proxyUsage[proxy] || 0);
    }
    return slots;
};

window.serverPlayerCount = 1;
window.botsInQueue = 0;

class Alt {
    constructor() {
        this.core_count = 4;
    }

    async getChallenge() {
        const response = await fetch("https://api.moomoo.io/verify");
        return await response.json();
    }

    getWorkerCode() {
        return `
            const K = new Uint32Array([
                0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
                0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
                0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
                0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
                0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
                0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
                0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
                0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
            ]);

            function sha256(message) {
                const bytes = new TextEncoder().encode(message);
                const len = bytes.length;
                const bitLen = len * 8;
                const padLen = (len % 64 < 56 ? 56 : 120) - (len % 64);
                const padded = new Uint8Array(len + padLen + 8);
                padded.set(bytes);
                padded[len] = 0x80;
                const view = new DataView(padded.buffer);
                view.setUint32(padded.length - 4, bitLen, false);
                let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
                const w=new Uint32Array(64);
                for(let i=0;i<padded.length;i+=64){
                    for(let j=0;j<16;j++) w[j]=view.getUint32(i+j*4,false);
                    for(let j=16;j<64;j++){
                        const s0=((w[j-15]>>>7)|(w[j-15]<<25))^((w[j-15]>>>18)|(w[j-15]<<14))^(w[j-15]>>>3);
                        const s1=((w[j-2]>>>17)|(w[j-2]<<15))^((w[j-2]>>>19)|(w[j-2]<<13))^(w[j-2]>>>10);
                        w[j]=(w[j-16]+s0+w[j-7]+s1)>>>0;
                    }
                    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
                    for(let j=0;j<64;j++){
                        const S1=((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7));
                        const ch=(e&f)^(~e&g);
                        const temp1=(h+S1+ch+K[j]+w[j])>>>0;
                        const S0=((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10));
                        const maj=(a&b)^(a&c)^(b&c);
                        const temp2=(S0+maj)>>>0;
                        h=g;g=f;f=e;e=(d+temp1)>>>0;d=c;c=b;b=a;a=(temp1+temp2)>>>0;
                    }
                    h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;
                    h3=(h3+d)>>>0;h4=(h4+e)>>>0;h5=(h5+f)>>>0;h6=(h6+g)>>>0;h7=(h7+h)>>>0;
                }
                return [h0,h1,h2,h3,h4,h5,h6,h7].map(h=>h.toString(16).padStart(8,'0')).join('');
            }

            let challenge=null,salt=null;

            self.onmessage=e=>{
                const data=e.data;
                if(data.init){challenge=data.challenge;salt=data.salt;self.postMessage({ready:true});return;}
                const{start,end}=data;
                for(let i=start;i<=end;i++){
                    if(sha256(salt+i)===challenge){self.postMessage({found:i});return;}
                }
                self.postMessage({done:true});
            };
        `;
    }

    async solveChallenge(challengeData) {
        const { challenge, salt, maxnumber } = challengeData;
        const workerCode = this.getWorkerCode();
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const blobUrl = URL.createObjectURL(blob);
        const workers = [];
        for (let i = 0; i < this.core_count; i++) workers.push(new Worker(blobUrl));
        const segment = Math.ceil(maxnumber / this.core_count);

        return new Promise((resolve, reject) => {
            let solved = false;
            let done = 0;
            const tasks = workers.map((_, i) => ({
                start: i * segment,
                end: Math.min(maxnumber, (i + 1) * segment - 1)
            }));
            const cleanup = () => {
                workers.forEach(w => w.terminate());
                URL.revokeObjectURL(blobUrl);
            };
            workers.forEach((w, i) => {
                w.onmessage = msg => {
                    const d = msg.data;
                    if (d.ready) { w.postMessage(tasks[i]); return; }
                    if (d.found != null && !solved) {
                        solved = true;
                        cleanup();
                        resolve({ number: d.found });
                        return;
                    }
                    if (d.done) {
                        done++;
                        if (!solved && done === workers.length) {
                            cleanup();
                            reject("not solved");
                        }
                    }
                };
                w.postMessage({ init: true, challenge, salt });
            });
        });
    }

    static createPayload(Data, Sol) {
        return btoa(JSON.stringify({
            algorithm: "SHA-256",
            challenge: Data.challenge,
            salt: Data.salt,
            number: Sol.number,
            signature: Data.signature
        }));
    }

    async generate() {
        const data = await this.getChallenge();
        const sol = await this.solveChallenge(data);
        return `alt:${Alt.createPayload(data, sol)}`;
    }
}

const altGenerator = new Alt();

const tokenQueue = [];
let generating = false;

async function generateNextToken() {
    if (generating || tokenQueue.length === 0) return;
    generating = true;
    const resolve = tokenQueue.shift();
    const token = await altGenerator.generate();
    generating = false;
    resolve(token);
    setTimeout(generateNextToken, 150);
}

function getToken() {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return Promise.resolve("local-token");
    }
    return new Promise(res => {
        tokenQueue.push(res);
        generateNextToken();
    });
}

window.spawnBots = async count => {
    window.stopSpawning = false; // Reset stop flag when starting new spawn
    const urlBase = WS.url.split("token=")[0];
    let remaining = Math.min(count, countAvailableSlots());
    if (remaining <= 0) return;
    window.botsInQueue += remaining;

    while (remaining-- > 0 && !window.stopSpawning) {
        const slot = getNextAvailableSlot();
        if (!slot) { window.botsInQueue--; continue; }

        const token = await getToken();
        if (window.stopSpawning) { window.botsInQueue--; break; } // Check again after await

        const targetUrl = `${urlBase}token=${encodeURIComponent(token)}`;

        if (slot.type === "direct") {
            window.directUsed = true;
            connectBot(targetUrl, null);
        } else {
            window.proxyUsage[slot.proxy]++;
            connectBot(`${slot.proxy}/?target=${encodeURIComponent(targetUrl)}`, slot.proxy);
        }

        window.botsInQueue--;
        await new Promise(r => setTimeout(r, 50));
    }
    window.botsInQueue = 0; // Clean up
};

window.stopSpawning = false;
window.stopBotSpawning = () => {
    window.stopSpawning = true;
    window.botsInQueue = 0;
};

window.disconnectAll = () => {
    window.directUsed = false;
    PROXY_LIST.forEach(proxy => {
        window.proxyUsage[proxy] = 0;
    });
    window.stopChatSpam();
    for (let i in allBots) {
        allBots[i].close();
        delete allBots[i];
    }
};

// Chat Spam Functions
window.chatSpamInterval = null;

window.saveSpamMessages = () => {
    const messages = window.getSpamMessages();
    localStorage.setItem("botSpamMessages", JSON.stringify(messages));
};

window.loadSpamMessages = () => {
    try {
        const saved = localStorage.getItem("botSpamMessages");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
};

window.initSpamMessages = () => {
    const saved = window.loadSpamMessages();
    if (saved.length === 0) return;

    const container = document.getElementById("chatSpamMessages");
    if (!container) return;

    const firstInput = container.querySelector(".spam-message");
    if (firstInput && saved[0]) {
        firstInput.value = saved[0];
    }

    for (let i = 1; i < saved.length; i++) {
        const row = document.createElement("div");
        row.className = "spam-msg-row";
        row.style.cssText = "display: flex; gap: 5px; margin-bottom: 5px; align-items: center;";
        row.innerHTML = `
            <input type="text" class="menu_text_input spam-message" placeholder="Message ${i + 1}" maxlength="30" style="flex: 1; width: auto;" value="${saved[i]}">
            <button onclick="this.parentElement.remove(); window.updateMessagePlaceholders(); window.saveSpamMessages();" style="padding: 5px 10px; border-radius: 4px; border: none; background: #e74c3c; color: white; cursor: pointer; height: 36px;">X</button>
        `;
        container.appendChild(row);
    }
};

window.updateMessagePlaceholders = () => {
    const inputs = document.querySelectorAll(".spam-message");
    inputs.forEach((input, index) => {
        input.placeholder = `Message ${index + 1}`;
    });
};

window.addSpamMessage = () => {
    const container = document.getElementById("chatSpamMessages");
    if (container) {
        const currentCount = container.querySelectorAll(".spam-msg-row").length;
        const row = document.createElement("div");
        row.className = "spam-msg-row";
        row.style.cssText = "display: flex; gap: 5px; margin-bottom: 5px; align-items: center;";
        row.innerHTML = `
            <input type="text" class="menu_text_input spam-message" placeholder="Message ${currentCount + 1}" maxlength="30" style="flex: 1; width: auto;">
            <button onclick="this.parentElement.remove(); window.updateMessagePlaceholders(); window.saveSpamMessages();" style="padding: 5px 10px; border-radius: 4px; border: none; background: #e74c3c; color: white; cursor: pointer; height: 36px;">X</button>
        `;
        container.appendChild(row);
        row.querySelector(".spam-message").addEventListener("input", window.saveSpamMessages);
    }
};

window.getSpamMessages = () => {
    const inputs = document.querySelectorAll(".spam-message");
    const messages = [];
    inputs.forEach(input => {
        if (input.value.trim()) {
            messages.push(input.value.trim());
        }
    });
    return messages;
};

window.sendBotChatOnce = () => {
    const messages = window.getSpamMessages();
    if (messages.length === 0) return;

    const botDelay = parseInt(configs.botSpamDelay) || 0;
    const msgDelay = 2500;

    const activeBots = allBots.filter(bot => bot.readyState === WebSocket.OPEN);
    if (activeBots.length === 0) return;

    // Pętla - powtarzaj wysyłanie wiadomości
    const sendLoop = () => {
        if (!configs.botChatSpam) return; // Stop jeśli wyłączono

        if (botDelay === 0) {
            messages.forEach((msg, msgIndex) => {
                const msgTime = msgIndex * msgDelay;
                setTimeout(() => {
                    activeBots.forEach(bot => {
                        if (bot.readyState === WebSocket.OPEN) {
                            bot.send(new Uint8Array([...window.msgpack.encode(["6", [msg.slice(0, 30)]])]));
                        }
                    });
                }, msgTime);
            });
        } else {
            activeBots.forEach((bot, botIndex) => {
                const botStartTime = botIndex * botDelay;
                messages.forEach((msg, msgIndex) => {
                    const msgTime = msgIndex * msgDelay;
                    const totalDelay = botStartTime + msgTime;
                    setTimeout(() => {
                        if (bot.readyState === WebSocket.OPEN) {
                            bot.send(new Uint8Array([...window.msgpack.encode(["6", [msg.slice(0, 30)]])]));
                        }
                    }, totalDelay);
                });
            });
        }
    };

    sendLoop(); // Wyślij raz (Send Once)
};

window.startChatSpam = () => {
    const botDelay = parseInt(configs.botSpamDelay) || 0;
    allBots.forEach((bot, index) => {
        if (bot.readyState === WebSocket.OPEN && !bot.spamInterval) {
            setTimeout(() => {
                window.startBotSpamLoop(bot);
            }, index * botDelay);
        }
    });
};

window.stopChatSpam = () => {
    if (window.chatSpamInterval) {
        clearInterval(window.chatSpamInterval);
        window.chatSpamInterval = null;
    }
    allBots.forEach(bot => {
        if (bot.spamInterval) {
            clearInterval(bot.spamInterval);
            bot.spamInterval = null;
        }
    });
};

window.startBotSpamLoop = (bot) => {
    if (bot.spamInterval) return;

    const msgDelay = 2500;
    let msgIndex = 0;

    // Wyślij pierwszą wiadomość od razu
    const initialMessages = window.getSpamMessages();
    if (initialMessages.length === 0) return;

    if (bot.readyState === WebSocket.OPEN && configs.botChatSpam) {
        const msg = initialMessages[0];
        bot.send(new Uint8Array([...window.msgpack.encode(["6", [msg.slice(0, 30)]])]));
        msgIndex = 1;
    }

    bot.spamInterval = setInterval(() => {
        if (bot.readyState !== WebSocket.OPEN || !configs.botChatSpam) {
            clearInterval(bot.spamInterval);
            bot.spamInterval = null;
            return;
        }
        // Pobierz wiadomości na bieżąco żeby nowe też działały
        const messages = window.getSpamMessages();
        if (messages.length === 0) return;

        const msg = messages[msgIndex % messages.length];
        bot.send(new Uint8Array([...window.msgpack.encode(["6", [msg.slice(0, 30)]])]));
        msgIndex++;
    }, msgDelay);
};

// BOT CONNECT FUNCTION AND COMBAT LOGIC:
async function connectBot(url, proxyUrl) {
    const isProxy = proxyUrl !== null;
    const proxyName = isProxy ? proxyUrl.split("//")[1].split(".")[0] : "DIRECT";
    const bot = new WebSocket(url);
    bot.binaryType = "arraybuffer";
    bot.onopen = () => {
        console.log(`[Bot] Connected via ${proxyName}`);
        bot.spawn();
    };
    bot.proxyUrl = proxyUrl; // Store proxy URL for disconnect tracking

    allBots.push(bot);

    // VARIABLE CLASS:
    let botPlayer = new Map();
    let spamming = false;
    let name = configs.ranBotName ? getRandomName() : configs.botname;
    let botObj = [];
    let nearObj = [];
    let syncing = false;
    let botCheckGather = false;
    let damageShit = 0;
    let isAutoFollowOn = false;
    let targetPlayerId = null;
    let nearObjs;
    let bD = {
        x: 0,
        y: 0,
        inGame: false,
        closeSocket: false,
        whyDie: ""
    };
    let oldXY = {
        x: 0,
        y: 0
    };
    let izauto = 0;
    let millsCount;
    var enemy = [];
    let autoChattings = false;
    var nearBotPlayer = [];
    let bhats = [{
        id: 0,
        type: 0
    }, {
        id: 0,
        type: 1
    }];
    let target = null;
    let objectbreak = null;
    let autoBreak = false;
    let wasBreaking = false; // Track previous breaking state
    let aeaeaeaeaeaeaeeaaeaeae = configs.autoMills;
    let waitForHit = false;
    let followTarget = null;
    let clanPeoples = [];
    let botObjManager = new BotObjManager(botObj, function (sid) {
        return findSID(botObj, sid);
    });
    let autoAim = false;

    /*     let botPlaceClass = new botAutoplace(UTILS, items, botPlayer, bot, nearBotPlayer);
  let C_TICK_DEL = 1000 / config.serverUpdateRate
let perfectTickTime = Date.now();
  bot.syncGameLoop = async () => {
    const suppressDelay = Date.now() - window.pingTime + (C_TICK_DEL + ~~(window.pingTime / C_TICK_DEL)) * C_TICK_DEL;
    return new Promise(accept => {
        const intervalId = setInterval(() => {
            if (perfectTickTime > Date.now()) return;
            accept();
            botPlaceClass.autoPlace();
            clearInterval(intervalId);
        });
    });
} */

    // BUFFER:
    bot.first = true;
    bot.botSID;

    // X18K VARIABLE NOT FOR USE FOR NOW:
    bot.moveRan = {
        angle: UTILS.randomAngle(),
        x: 0,
        y: 0,
        lastChange: 0
    };

    // BOT CLASS FUNCTIONS:
    bot.emit = function (type) {
        if (bot.readyState !== WebSocket.OPEN) {
            return;
        }
        let data = Array.prototype.slice.call(arguments, 1);
        let binary = window.msgpack.encode([type, data]);
        bot.send(binary);
    };

    // SPAWNS THE BOT:
    bot.spawn = function () {
        // Unique skin for each bot (0-10, total 11 skins including cyan secret)
        let availableSkins = [];
        for (let i = 0; i <= 10; i++) {
            if (!usedSkins.includes(i)) {
                availableSkins.push(i);
            }
        }
        let botSkin;
        if (availableSkins.length > 0) {
            botSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
            usedSkins.push(botSkin);
        } else {
            botSkin = Math.floor(Math.random() * 11);
        }
        bot.mySkin = botSkin;
        bot.emit("M", {
            name: name,
            moofoll: 1,
            skin: botSkin
        });
    };

    // ANGLE:
    bot.caf = function (e, t) {
        try {
            return atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
        } catch (e) {
            return 0;
        }
    };

    // DISTANCE
    bot.cdf = function (e, t) {
        try {
            return hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
        } catch (e) {
            return Infinity;
        }
    };

    // UPGRADES THE ITEM:
    bot.upgradeItem = function (id) {
        bot.emit("H", id);
    };

    // FOR AUTOHEAL:
    bot.heal = function (e, t = [20, 40, 30]) {
        for (let n = e; n < 100; n += t[botPlayer.items[0]]) {
            bot.place(0, null);
        }
    };

    // BOUGHT THE HAT?:
    bot.isBoughtHat = function (id, type) {
        for (let i in bhats) {
            if (bhats[i].id == id && bhats[i].type == type) {
                return true;
            }
        }
    };
    bot.chat = function (message) {
        bot.emit("6", message.slice(0, 30));
    };

    // DIR OF BOT:
    let dirSS = 0;
    let bullHit = false;
    bot.getDir = function () {
        if (musketSync || bullHit || autoAim) {
            dirSS = atan2(nearBotPlayer.y2 - botPlayer.y2, nearBotPlayer.x2 - botPlayer.x2) || nearBotPlayer.aim2;
        } else if (autoBreak && (!musketSync || !bullHit || !autoAim)) {
            dirSS = atan2(objectbreak.y - botPlayer.y2, objectbreak.x - botPlayer.x2);
        } else if (botPlayer.weapons[0] != 8 && nearObjs != null && nearObjs.length > 0 && (!autoBreak || !musketSync || !bullHit || !autoAim || followType == null)) {
            const target = nearObjs[0];
            const aimDir = UTILS.getDirect(target, botPlayer, 0, 2);
            dirSS = aimDir;
        } else if (UTILS.getDistance(player.x2, player.y2, botPlayer.x2, botPlayer.y2) <= 300 && configs.botMovementMode == "Copy" && (!autoBreak || !musketSync || !bullHit || !autoAim || followType == null)) {
            botPlayer.dir = player.dir;
            dirSS = botPlayer.dir;
        }
        return dirSS;
    };

    // BUYS HAT:
    bot.hat = function (id) {
        if (botPlayer.latestSkin != id) {
            if (bot.isBoughtHat(id, 0)) {
                bot.emit("c", 0, id, 0);
            } else if (bot.canBuy(id, 0)) {
                bot.emit("c", 1, id, 0);
                bot.emit("c", 0, id, 0);
            } else if (botPlayer.latestSkin != id) {
                bot.emit("c", 0, id, 0);
            }
        }
    };

    // CHECKS IF CAN BUY KEKEKE:
    bot.canBuy = function (id, type) {
        if (type == 1) {
            for (let i in accessories) {
                if (accessories[i].id == id && botPlayer.points >= accessories[i].price) {
                    return true;
                }
            }
        } else {
            for (let i in hats) {
                if (hats[i].id == id && botPlayer.points >= hats[i].price) {
                    return true;
                }
            }
        }
    };

    // BUYS ACC:
    bot.acc = function (id) {
        if (botPlayer.latestTail != id) {
            if (bot.isBoughtHat(id, 1)) {
                bot.emit("c", 0, id, 1);
            } else if (bot.canBuy(id, 1)) {
                bot.emit("c", 1, id, 1);
                bot.emit("c", 0, id, 1);
            } else if (botPlayer.latestTail != id) {
                bot.emit("c", 0, id, 1);
            }
        }
    };

    // BOT PLACER PLANS:
    /*
                make autoplace
                make platform placer
                make replacer
                make autoReload
                */

    bot.place = function (id, a) {
        let item = items.list[botPlayer.items[id]];
        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 99)) {
            bot.emit("z", botPlayer.items[id]);
            bot.emit("F", 1, a);
            bot.emit("z", botPlayer.weaponIndex, true);
        }
    };
    bot.bullHit = function () {
        autoAim = true;
        setTimeout(() => {
            bullHit = true;
            waitForHit = true;
            bot.weapon(botPlayer.weapons[0]);
            bot.hat(7);
            bot.emit("F", 1);
            bot.emit("F", 0);
            setTimeout(() => {
                bullHit = false;
                autoAim = false;
            }, 111);
            setTimeout(() => {
                waitForHit = false;
                if (configs.botWeaponType == "Hammer") {
                    bot.emit("z", 10, true);
                }
            }, 750);
        }, 50);
    };
    bot.musketSHoot = function () {
        autoAim = true;
        setTimeout(() => {
            musketSync = true;
            waitForHit = true;
            bot.emit("z", botPlayer.weapons[1], true);
            bot.hat(53);
            bot.emit("F", 1);
            bot.emit("F", 0);
            setTimeout(() => {
                musketSync = false;
                autoAim = false;
            }, 111);
            setTimeout(() => {
                bot.emit("z", botPlayer.weapons[0], true);
                waitForHit = false;
            }, 2000);
        }, 50);
    };
    bot.buye = function (id, index) {
        if (botPlayer.alive && botPlayer.inGame) {
            if (index == 0) {
                if (botPlayer.skins[id]) {
                    if (botPlayer.latestSkin != id) {
                        bot.emit("c", 0, id, 0);
                    }
                } else {
                    let find = findID(hats, id);
                    if (find) {
                        if (botPlayer.points >= find.price) {
                            bot.emit("c", 1, id, 0);
                            bot.emit("c", 0, id, 0);
                        } else if (botPlayer.latestSkin != configs.botHatsMode === "Animals" ? loopHats[loopIndex++] : configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 0) {
                            bot.emit("c", 0, configs.botHatsMode === "Animals" ? loopHats[loopIndex++] : configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 0, 0);
                        }
                    } else if (botPlayer.latestSkin != configs.botHatsMode === "Animals" ? loopHats[loopIndex++] : configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 0) {
                        bot.emit("c", 0, configs.botHatsMode === "Animals" ? loopHats[loopIndex++] : configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 0, 0);
                    }
                }
            } else if (index == 1) {
                if (botPlayer.tails[id]) {
                    if (botPlayer.latestTail != id) {
                        bot.emit("c", 0, id, 1);
                    }
                } else {
                    let find = findID(accessories, id);
                    if (find) {
                        if (botPlayer.points >= find.price) {
                            bot.emit("c", 1, id, 1);
                            bot.emit("c", 0, id, 1);
                        } else if (botPlayer.latestTail != 0) {
                            bot.emit("c", 0, 0, 1);
                        }
                    } else if (botPlayer.latestTail != 0) {
                        bot.emit("c", 0, 0, 1);
                    }
                }
            }
        }
    };
    bot.weapon = function (id) {
        botPlayer.weaponIndex = id;
        bot.emit("z", id, 1);
    };
    bot.dir = function (angle) {
        bot.emit("D", angle);
        botPlayer.lastDir = angle;
    };
    bot.hit = function (angle) {
        bot.emit("F", 1, angle);
        bot.emit("F", 0, angle);
    };
    bot.autogather = function (debug) {
        if (!debug) {
            bot.hitting = !bot.hitting;
        }
        bot.emit("K", 1);
    };
    bot.predictEnemyTraps = [];
    bot.objects = [];
    bot.gameObjects = [];
    // X18K MILL PLACE:
    bot.mill = {
        x: 0,
        y: 0
    };
    bot.old = {
        x: 0,
        y: 0
    };
    bot.moveDirection = 0;
    bot.isAlly = function (sid) {
        if (botPlayer.team) {
            for (let i = 0; i < clanPeoples.length; i += 2) {
                if (clanPeoples[i] == sid) {
                    return true;
                }
            }
        }
    };
    bot.platFormPlace = function () {
        if (!waitForHit) {
            if (botPlayer.items[5] == 18) {
                for (let i = 0; i < 4; i++) {
                    let angle = toRad(i * 90);
                    bot.checkPlace(5, angle);
                }
            }
        }
    };
    bot.syncMusket = function (a) {
        if (!aeaeaeaeaeaeaeeaaeaeae && !waitForHit) {
            bot.musketSHoot();
        }
    };
    bot.autoBreakFc = function () {
        let trap = gameObjects.filter(object => object.active && object.id == 15 && UTILS.getDistance(botPlayer.x2, botPlayer.y2, object.x, object.y) <= 50 && object.owner.sid != botPlayer.sid && !bot.isAlly(object.owner.sid))[0];
        let spike = gameObjects.filter(object => object.active && object.id > 5 && object.id < 10 && UTILS.getDistance(botPlayer.x2, botPlayer.y2, object.x, object.y) <= botPlayer.scale + object.scale + 40 && object.owner.sid != botPlayer.sid && !bot.isAlly(object.owner.sid))[0];
        if (trap) {
            autoBreak = true;
            objectbreak = trap;
        } else if (spike) {
            autoBreak = true;
            objectbreak = spike;
        }
    };
    bot.isItemLimit = function (id) {
        let group = items.list[id].group;
        if (window.location.host == "sandbox.moomoo.io") {
            let limit = group.sandboxLimit || 99;
            if (botPlayer.itemCounts[group.id] >= limit) {
                return true;
            }
        } else if (botPlayer.itemCounts[group.id] >= group.limit) {
            return true;
        }
    };
    bot.checkPlace = function (id, a) {
        if (bot.canPlace(id, a) && bot.checkEnemyTraps(id, a)) {
            bot.place(id, a);
            bot.addEnemyTrap(id, a);
        }
    };

    // DDODGE OBJECTS:
    bot.dodgeSpike = function () {
        if (traps.inTrap) {
            return;
        }
        let aspike = gameObjects.find(obj => obj.dmg && obj.active && !obj.isTeamObject(player) && UTILS.getDist(obj, player, 0, 3) <= player.scale * 2 + obj.getScale());
        if (!aspike) {
            if (tracker.draw3.active) {
                tracker.draw3.active = false;
            }
            return;
        }
        tracker.draw3 = {
            active: true,
            x: aspike.x,
            y: aspike.y,
            scale: aspike.getScale() || aspike.scale
        };
        let spikeDir = UTILS.getDirect(aspike, player, 0, 2);
        setMoveDir(spikeDir + Math.PI);
    };
    bot.checkEnemyTraps = function (id, angle) {
        let config = {
            x: botPlayer.x2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * cos(angle),
            y: botPlayer.y2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * sin(angle),
            scale: items.list[id].scale
        };
        for (let i in bot.predictEnemyTraps) {
            let object = bot.predictEnemyTraps[i];
            if (object && getDistance(config.x, config.y, object.x, object.y) < config.scale + object.scale) {
                return false;
            }
        }
        return true;
    };
    bot.addEnemyTrap = function (item_id, angle) {
        let id = 15;
        let config = {
            x: botPlayer.x2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * cos(angle),
            y: botPlayer.y2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * sin(angle),
            scale: items.list[id].scale
        };
        for (let i in bot.predictEnemyTraps) {
            let object = bot.predictEnemyTraps[i];
            if (object && getDistance(config.x, config.y, object.x, object.y) < config.scale + object.scale) {
                return;
            }
        }
        bot.predictEnemyTraps.push({
            id: id,
            name: items.list[id].name,
            placeOffset: items.list[id].placeOffset,
            x: config.x,
            y: config.y,
            scale: config.scale,
            time: Date.now(),
            health: items.list[id].health,
            maxHealth: items.list[id].health
        });
    };
    bot.removeEnemyTraps = function () {
        for (let i in bot.predictEnemyTraps) {
            let object = bot.predictEnemyTraps[i];
            if (object && (bot.isTrapCollision(object) || getDistance(botPlayer.x2, botPlayer.y2, object.x, object.y) <= 50 || Date.now() - object.time > 1000)) {
                delete bot.predictEnemyTraps[i];
            }
        }
    };
    bot.updategameObjects = function () {
        bot.gameObjects = [];
        for (let i in bot.objects) {
            if (getDistance(botPlayer.x2, botPlayer.y2, bot.objects[i].x, bot.objects[i].y) < 1000) {
                bot.gameObjects.push(bot.objects[i]);
            }
        }
    };
    bot.isTrapCollision = function (object) {
        for (let i in bot.gameObjects) {
            if (getDistance(bot.gameObjects[i].x, bot.gameObjects[i].y, object.x, object.y) < object.scale + getScale(bot.gameObjects[i])) {
                return true;
            }
        }
        return false;
    };
    bot.canPlace = function (id, angle) {
        let config = {
            x: botPlayer.x2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * cos(angle),
            y: botPlayer.y2 + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * sin(angle),
            scale: items.list[id].scale
        };
        if (bot.isItemLimit(id) || id != 18 && config.y > 6838 && config.y < 7562) {
            return false;
        }
        for (let i in bot.gameObjects) {
            let object = bot.gameObjects[i];
            let scale = object.id == 21 ? 300 : getScale(object);
            if (getDistance(config.x, config.y, object.x, object.y) < config.scale + scale) {
                return false;
            }
        }
        return true;
    };
    bot.CheckSnowBiome = function () {
        if (botPlayer.y2 <= config.snowBiomeTop) {
            return true;
        } else {
            return false;
        }
    };
    bot.SpeedMill = function () {
        if (botPlayer.skinIndex == 12 && botPlayer.tailIndex == 11 && botPlayer.weaponIndex == 7) {
            return 1;
        } else if (botPlayer.tailIndex == 11) {
            if (bot.CheckSnowBiome() && botPlayer.skinIndex != 15 || botPlayer.weaponIndex == 10 || botPlayer.weaponIndex == 3 || player.weaponIndex == 4) {
                if (botPlayer.weaponIndex == 5) {
                    return 4;
                } else {
                    return 3;
                }
            } else {
                return 2;
            }
        } else if (bot.CheckSnowBiome() && botPlayer.skinIndex != 15 || botPlayer.weaponIndex == 10 || botPlayer.weaponIndex == 4 || botPlayer.weaponIndex == 5 || botPlayer.weaponIndex == 5) {
            return 4;
        } else {
            return 3;
        }
    };

    /*bot.hitShiity = function() {
    const count = getBotCount();
    if ((!autoBreak || !waitForHit || !musketSync || followType == null) && botPlayer.weapons[0] == 5 && count >= 2 && UTILS.getDistance(nearBotPlayer.x2, nearBotPlayer.y2, botPlayer.x2, botPlayer.y2) <=
        items.weapons[botPlayer.weapons[0]].range + nearBotPlayer.scale) {
        bot.bullHit();
    }
}
  bot.syncHitKE = function() {
    // SYNC:
    if (enemy.length && !waitForHit && !musketSync) {
        if (nearBotPlayer.dist2 <= 200 && nearBotPlayer.dist2 <= 200 &&
            botPlayer.reloads[botPlayer.weapons[0]] == 0 && player.reloads[player.weapons[0]] === 0) {
            bot.bullHit();
            instaC.canSpikeTick = true;
        }
    }
};*/

    let runAtNextTick = [];
    function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
        let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
        let projOffset = 70;
        let projXY = {
            x: indx == 1 ? x : x - projOffset * Math.cos(dir),
            y: indx == 1 ? y : y - projOffset * Math.sin(dir)
        };
        let nearBot = players.filter(e => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function (a, b) {
            return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
        })[0];
        if (nearBot) {
            if (indx == 1) {
                nearBot.shooting[53] = 1;
            } else {
                nearBot.shootIndex = weaponIndx;
                nearBot.shooting[1] = 1;
                bot.antiProj(nearBot, dir, range, speed, indx, weaponIndx);
            }
        }
    }

    // antiProj for bot no died
    bot.antiProj = function (tmpObj, dir, range, speed, index, weaponIndex) {
        if (!tmpObj.isTeam(botPlayer)) {
            tmpDir = UTILS.getDirect(botPlayer, tmpObj, 2, 2);
            if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                tmpObj.bowThreat[weaponIndex]++;
                if (index == 5) {
                    musketCount++;
                }
                setTimeout(() => {
                    tmpObj.bowThreat[weaponIndex]--;
                    musketCount--;
                }, range / speed);
                if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                    bot.place(3, tmpObj.aim2);
                } else if (projectileCount >= 2) {
                    bot.place(3, tmpObj.aim2);
                }
            }
        }
    };
    bot.biomeGear = function (mover, returns, id) {
        if (botPlayer.y2 >= config.mapScale / 2 - config.riverWidth / 2 && botPlayer.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
            if (returns) {
                return 31;
            }
            bot.buye(31, 0);
        } else if (botPlayer.y2 <= config.snowBiomeTop) {
            bot.buye(configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 15, 0);
        } else {
            bot.buye(configs.botHatsMode === "Animals" ? loopHats[loopIndex++] : configs.botHatsMode === "Police" ? policeHats[LoopPolice++] : 6, 0);

            //if (configs.botHatsMode === "Normal") {
            //    bot.hat(6, 0);
            //}
        }
        if (returns) {
            return 0;
        }
    };
    bot.testCanPlace = function (id, first = -(Math.PI / 2), repeat = Math.PI / 2, plus = Math.PI / 18, radian = 0, replacer = false, yaboi = null) {
        const item = items.list[botPlayer.items[id]];
        if (!item) {
            return;
        }
        let tmpS = botPlayer.scale + item.scale + (item.placeOffset || 0);
        let counts = {
            attempts: 0,
            placed: 0
        };
        let tmpObjects = gameObjects.map(p => ({
            x: p.x,
            y: p.y,
            active: p.active,
            blocker: p.blocker,
            scale: p.scale,
            isItem: p.isItem,
            type: p.type,
            colDiv: p.colDiv,
            getScale(sM = 1, ig = false) {
                return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : sM * 0.6) * (ig ? 1 : this.colDiv);
            }
        }));
        for (let i = first; i < repeat; i += plus) {
            counts.attempts++;
            let relAim = radian + i;
            let tmpX = botPlayer.x2 + tmpS * Math.cos(relAim);
            let tmpY = botPlayer.y2 + tmpS * Math.sin(relAim);
            let cantPlace = tmpObjects.find(tmp => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
            if (cantPlace) {
                continue;
            }
            if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) {
                continue;
            }
            if (!replacer && yaboi) {
                if (yaboi.inTrap) {
                    if (UTILS.getAngleDist(nearBotPlayer.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                        bot.place(2, relAim, 1);
                    } else if (botPlayer.items[4] === 15) {
                        bot.place(4, relAim, 1);
                    }
                } else if (UTILS.getAngleDist(nearBotPlayer.aim2, relAim) <= config.gatherAngle / 1.5) {
                    bot.place(2, relAim, 1);
                } else if (botPlayer.items[4] === 15) {
                    bot.place(4, relAim, 1);
                }
            } else {
                bot.place(id, relAim, 1);
            }
            tmpObjects.push({
                x: tmpX,
                y: tmpY,
                active: true,
                blocker: item.blocker,
                scale: item.scale,
                isItem: true,
                type: null,
                colDiv: item.colDiv,
                getScale() {
                    return this.scale;
                }
            });
        }
    };
    bot.botplace = function () {
        if (nearBotPlayer.dist2 <= 450 && botPlayer.items[4] === 15) {
            const sweepBestAngle = (start, step) => {
                for (let i = start; i < Math.PI * 2; i += step) {
                    bot.checkPlace(2, nearBotPlayer.aim2 + i);
                }
            };
            let nearInTrap = gameObjects.filter(object => object.id == 15 && UTILS.getDistance(nearBotPlayer.x2, nearBotPlayer.y2, object.x, object.y) <= 50 && object.owner.sid != nearBotPlayer.sid && bot.isAlly(object.owner.sid))[0];
            if (nearInTrap) {
                if (nearBotPlayer.dist2 <= 130) {
                    bot.testCanPlace(2, 0, Math.PI * 2, Math.PI / 36, nearBotPlayer.aim2, 0);
                }
                if (nearBotPlayer.dist2 <= 220) {
                    sweepBestAngle(0, Math.PI / 1.5);
                } else {
                    sweepBestAngle(Math.PI / 1.5, Math.PI / 1.5);
                }
            } else if (player.items[4] === 15) {
                if (nearBotPlayer.dist2 <= 450) {
                    bot.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, nearBotPlayer.aim2);
                }
            } else if (nearBotPlayer.dist2 <= 150) {
                sweepBestAngle(0, Math.PI / 1.5);
            } else {
                sweepBestAngle(Math.PI / 1.5, Math.PI / 1.5);
            }
        }
    };
    var SyncWithServerTick = new class {
        constructor() {
            this.C_TICK_DEL = 1000 / config.serverUpdateRate;
            this.perfectTickTime = Date.now();
        }
        syncGameLoop = async () => {
            const suppressDelay = Date.now() - window.pingTime + (this.C_TICK_DEL + ~~(window.pingTime / this.C_TICK_DEL)) * this.C_TICK_DEL;
            return new Promise(accept => {
                const intervalId = setInterval(() => {
                    if (this.perfectTickTime > Date.now()) {
                        return;
                    }
                    accept();
                    bot.botplace();
                    clearInterval(intervalId);
                });
            });
        };
    }();
    /*     bot.reloadHit = function(type) { // who needs reloads anyway
    if (type == "tank" && !waitForHit) {
        waitForHit = true;
          bot.emit("F", 1);
        bot.emit("F", 0);
          if (configs.botconfigs.botWeaponType === "Hammer") bot.emit("z", 10, true);
        else bot.emit("z", 5, true);
          bot.hat(botPlayer.reloads[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]] == 0 ? 40 : 6);
    } else {
        if (configs.botconfigs.botWeaponType === "Hammer") {
            setTimeout(() => {
                waitForHit = false;
            }, 400);
        } else {
            setTimeout(() => {
                waitForHit = false;
            }, 700);
        }
    }
      if (type == "bull" && !waitForHit) {
        waitForHit = true;
          bot.emit("F", 1);
        bot.emit("F", 0);
        bot.emit("z", 5, true);
          bot.hat(botPlayer.reloads[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]] == 0 ? 7 : 6);
    } else {
        setTimeout(() => {
            waitForHit = false;
        }, 700);
    }
} */

    bot.onmessage = async function (message, isYou) {
        let data = new Uint8Array(message.data);
        let parsed = window.msgpack.decode(data);
        let type = parsed[0];
        data = parsed[1];
        if (type == "io-init") {
            bot.spawn();
        }
        if (type == "C") {
            bot.botSID = data[0];
            botSIDs.push(bot.botSID);
        }
        if (type == "E") {
            for (var i = 0; i < botplayers.length; i++) {
                if (botplayers[i].id == data[0]) {
                    botplayers.splice(i, 1);
                    break;
                }
            }
        }
        if (type == "D") {
            if (data[1]) {
                botPlayer = new Bot(data[0][0], data[0][1], hats, accessories, botplayers);
                botplayers.push(botPlayer);
                botPlayer.setData(data[0]);
                botPlayer.inGame = true;
                botPlayer.alive = true;
                botPlayer.x2 = undefined;
                botPlayer.y2 = undefined;
                botPlayer.spawn(isYou);
                botPlayer.oldHealth = 100;
                botPlayer.health = 100;
                botPlayer.showName = "YEAHHH";
                oldXY = {
                    x: data[0][3],
                    y: data[0][4]
                };
                if (isYou) {
                    // smart gather fixer:
                    bot.autogather(false);
                }
                bD.inGame = true;
                if (bot.first) {
                    bot.first = false;
                    bots.push(bD);
                }
                // Auto start chat spam if enabled
                if (configs.botChatSpam && !bot.spamInterval) {
                    setTimeout(() => window.startBotSpamLoop(bot), 500);
                }
            }
        }
        if (type == "P") {
            botPlayer.inGame = false;
            botPlayer.alive = false;
            bD.inGame = false;
            // Auto respawn after 1 second
            setTimeout(() => {
                if (bot.readyState === WebSocket.OPEN) {
                    bot.spawn();
                }
            }, 1000);
        }
        if (type == "4") {
            clanPeoples = data[0];
        }
        if (type == "a") {
            let tmpData = data[0];
            botPlayer.tick++;
            for (let i = 0; i < botplayers.length; ++i) {
                botplayers[i].visible = false;
            }
            enemy = [];
            bot.showName = "YEAHHH";
            nearObj = [];
            for (let i = 0; i < tmpData.length;) {
                if (tmpData[i] == botPlayer.sid) {
                    botPlayer.lastXY = {
                        x: botPlayer.x2,
                        y: botPlayer.y2
                    };
                    botPlayer.x2 = tmpData[i + 1];
                    botPlayer.y2 = tmpData[i + 2];
                    botPlayer.d2 = tmpData[i + 3];
                    botPlayer.speed = fastHypot(botPlayer.x2 - tmpData[i + 1], botPlayer.y2 - tmpData[i + 2]);
                    botPlayer.aim2 = UTILS.getDirect(botPlayer, player, 2, 2);
                    botPlayer.buildIndex = tmpData[i + 4];
                    botPlayer.weaponIndex = tmpData[i + 5];
                    botPlayer.weaponVariant = tmpData[i + 6];
                    botPlayer.team = tmpData[i + 7];
                    botPlayer.isLeader = tmpData[i + 8];
                    botPlayer.skinIndex = tmpData[i + 9];
                    botPlayer.tailIndex = tmpData[i + 10];
                    botPlayer.iconIndex = tmpData[i + 11];
                    botPlayer.zIndex = tmpData[i + 12];
                    botPlayer.visible = true;
                    bD.x2 = botPlayer.x2;
                    bD.y2 = botPlayer.y2;
                }
                i += 13;
            }
            for (let i = 0; i < tmpData.length;) {
                tmpObj = findPlayerBySID(tmpData[i]);
                if (tmpObj) {
                    if (!tmpObj.isTeam(botPlayer)) {
                        enemy.push(tmpObj);
                        if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + botPlayer.scale * 2) {
                            nears.push(tmpObj);
                        }
                    }
                }
                i += 13;
            }

            // RELOADS:
            botPlayer.manageReload();
            if (runAtNextTick.length) {
                runAtNextTick.forEach(tmp => {
                    checkProjectileHolder(...tmp);
                });
                runAtNextTick = [];
            }

            // FALSE:
            if (autoBreak) {
                autoBreak = false;
            }

            // LOOP: (autoBreak disabled for gold bots)
            if (!configs.goldBots) {
                bot.autoBreakFc();
            }
            bot.removeEnemyTraps();
            bot.updategameObjects();
            if (botPlayer.alive && botPlayer.inGame) {
                // DIR:
                bot.emit("D", bot.getDir());
                if (enemy.length > 0) {
                    // enemy detect is working no need more kekeke
                    //console.log("enemy found");
                    enemy.sort((p1, p2) => p1.dist2 - p2.dist2);
                    nearBotPlayer = enemy[0];
                } else {
                    nearBotPlayer = [];
                }
                if (player.team !== botPlayer.team) {
                    if (!player.team && botPlayer.team) {
                        // for if not in same clan anymore
                        bot.emit("N");
                        botPlayer.team = null;
                    } else if (player.team && botPlayer.team !== player.team) {
                        // joins my clan
                        bot.emit("b", player.team);
                        botPlayer.team = player.team;
                    }
                }
                let weaponIndex = botPlayer.weapons[1] === 10 ? 1 : 0;
                let allyShit;
                if (!botBreakAll) {
                    allyShit = gameObjects.filter(object => object.active && (object.id == 15 || object.id > 5 && object.id < 10 || object.id == 18) && UTILS.getDist(object, botPlayer, 0, 2) <= items.weapons[botPlayer.weapons[weaponIndex]].range + getScale(object) && bot.isAlly(object.owner.sid))[0];
                }
                nearObjs = gameObjects.filter(e => e.active && !allyShit && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= items.weapons[botPlayer.weapons[weaponIndex]].range + getScale(e)).sort(function (a, b) {
                    return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                });
                if (!waitForHit && botPlayer.weapons[0] != 8 && config.isSandbox && (!autoAim || !musketSync || !bullHit || !autoBreak) && nearObjs && nearObjs.length > 0 && botPlayer.reloads[botPlayer.weapons[weaponIndex]] === 0) {
                    bot.emit("z", botPlayer.weapons[weaponIndex], true);
                    bot.emit("F", 1);
                    bot.emit("F", 0);
                }

                // HEAL:
                if (!configs.goldBots && botPlayer.skinIndex != 45 && botPlayer.health != 100) {
                    if (botPlayer.health >= 64.5) {
                        setTimeout(() => {
                            bot.heal(botPlayer.health)
                        }, 85);
                    } else {
                        bot.heal(botPlayer.health);
                    }
                }
                if (!isProxy && !configs.goldBots && game.tick - damageShit > 0 && botPlayer.health !== 100) {
                    bot.heal();
                }
                if (platFormPlacer && (!autoAim || !musketSync || !bullHit || !autoBreak)) {
                    // opi
                    bot.platFormPlace();
                }
                if (configs.botMovementMode === "Copy" && UTILS.getDistance(player.x2, player.y2, botPlayer.x2, botPlayer.y2) <= 200 && (!autoAim || !musketSync || !bullHit || !autoBreak)) {
                    botPlayer.dir = player.dir;
                    if (clicks.left && !waitForHit) {
                        waitForHit = true;
                        bot.emit("F", 1, botPlayer.dir, 1);
                        bot.emit("F", 0, botPlayer.dir, 1);
                        bot.emit("z", 5, true);
                        bot.hat(botPlayer.reloads[botPlayer.weapons[0]] == 0 ? 7 : 6);
                    } else if (!clicks.left) {
                        setTimeout(() => {
                            waitForHit = false;
                        }, 700);
                    }
                    if (clicks.right && !waitForHit) {
                        waitForHit = true;
                        bot.emit("F", 1, botPlayer.dir, 1);
                        bot.emit("F", 0, botPlayer.dir, 1);
                        if (configs.botWeaponType === "Hammer") {
                            bot.emit("z", 10, true);
                        } else {
                            bot.emit("z", 5, true);
                        }
                        bot.hat(botPlayer.reloads[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]] == 0 ? 40 : 6);
                    } else if (!clicks.right) {
                        if (configs.botWeaponType === "Hammer") {
                            setTimeout(() => {
                                waitForHit = false;
                            }, 400);
                        } else {
                            setTimeout(() => {
                                waitForHit = false;
                            }, 700);
                        }
                    }
                    botPlayer.weaponIndex = player.weaponCode; // op copy
                    if (!waitForHit || !musketSync || !autoBreak || !autoAim) {
                        bot.emit("z", botPlayer.weaponIndex, true);
                    }
                }

                // BOTS HATS:
                // Priority 1: Destroying objects with tank gear (40)
                let shouldUseTankGear = false;
                if (!waitForHit && autoBreak && objectbreak && getDistance(botPlayer.x2, botPlayer.y2, objectbreak.x, objectbreak.y) <= items.weapons[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]].range + getScale(objectbreak) && botPlayer.reloads[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]] == 0) {
                    shouldUseTankGear = true;
                } else if (botPlayer.weapons[0] != 8 && !waitForHit && nearObjs && nearObjs.length > 0 && botPlayer.reloads[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]] == 0) {
                    shouldUseTankGear = true;
                }
                if (shouldUseTankGear) {
                    // Force tank gear for destroying objects
                    bot.hat(40);
                    wasBreaking = true;
                } else if (wasBreaking) {
                    bot.hat(6, 0);
                    wasBreaking = false;
                } else if (botPlayer.shameCount > 0 && botPlayer.skinIndex != 45 && nearBotPlayer.skinIndex != 53) {
                    bot.hat(7);
                } else if (configs.botMovementMode === "Stay" && configs.assassinGearBot && !(nearBotPlayer.dist2 <= 269) && botPlayer.health == 100) {
                    bot.hat(56);
                } else if (nearBotPlayer.dist2 <= 300) {
                    bot.hat(6, 0);
                } else {
                    bot.biomeGear(1);
                }
                if (UTILS.getDistance(player.x2, player.y2, botPlayer.x2, botPlayer.y2) <= 300) {
                    botPlayer.tailIndex = player.tailIndex;
                    bot.acc(botPlayer.tailIndex, 1);
                } else {
                    bot.acc(11, 1);
                }
                if (!waitForHit || !autoAim || !musketSync || !bullHit) {
                    if (autoBreak && objectbreak && getDistance(botPlayer.x2, botPlayer.y2, objectbreak.x, objectbreak.y) <= items.weapons[botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0]].range + getScale(objectbreak)) {
                        let breakWeapon = botPlayer.weapons[1] == 10 ? botPlayer.weapons[1] : botPlayer.weapons[0];
                        if (botPlayer.weaponIndex != breakWeapon) {
                            bot.weapon(breakWeapon);
                        }
                        bot.hit(atan2(objectbreak.y - botPlayer.y2, objectbreak.x - botPlayer.x2));
                    }
                }
                if (autoChattings) {
                    bot.autoChat("sand");
                }

                // AUTO MILLS:
                let item = items.list[botPlayer.items[3]];
                millsCount = botPlayer.itemCounts[item.group.id];
                let millLimit = config.isSandbox ? 180 : 2;

                // Reset mill mode when autoMills is enabled
                if (configs.autoMills && !aeaeaeaeaeaeaeeaaeaeae && (millsCount == null || millsCount < millLimit)) {
                    aeaeaeaeaeaeaeeaaeaeae = true;
                }

                // AUTO MILLS PLACEMENT (only if enabled and not at limit)
                if ((millsCount ?? 0) < millLimit && configs.autoMills && configs.botMovementMode !== "Stay") {
                    if ((config.isNormal ? configs.goldBots && UTILS.getDistance(player.x2, player.y2, botPlayer.x2, botPlayer.y2) <= 250 : true) && botPlayer.moveDir != null) {
                        let angle = botPlayer.moveDir + toRad(180);
                        bot.checkPlace(3, angle - toRad(items.list[botPlayer.items[3]].scale + items.list[botPlayer.items[3]].scale / 2));
                        bot.checkPlace(3, angle + toRad(items.list[botPlayer.items[3]].scale + items.list[botPlayer.items[3]].scale / 2));
                        bot.checkPlace(3, angle);
                        oldXY = {
                            x: botPlayer.x2,
                            y: botPlayer.y2
                        };
                    }
                }
                if (!configs.autoMills || (millsCount ?? 0) >= millLimit) {
                    aeaeaeaeaeaeaeeaaeaeae = false;
                }
                if (configs.botMovementMode === "Stay") {
                    bot.emit("9", undefined);
                    botPlayer.moveDir = null;
                } else if (configs.goldBots) {
                    let dx = player.x2 - botPlayer.x2;
                    let dy = player.y2 - botPlayer.y2;
                    let dist = Math.hypot(dx, dy);
                    let angleToPlayer = Math.atan2(dy, dx);
                    let goldBotDist = (configs.distToTT || 150) - 50;
                    botPlayer.moveDir = angleToPlayer;
                    if (dist >= goldBotDist) {
                        bot.emit("9", botPlayer.moveDir);
                    } else {
                        bot.emit("9", undefined);
                    }
                } else if (configs.autoMills && aeaeaeaeaeaeaeeaaeaeae) {
                    if (Date.now() - bot.moveRan.lastChange >= 10000 || sqrt(pow(bot.moveRan.y - botPlayer.y2, 2) + pow(bot.moveRan.x - botPlayer.x2, 2)) > 3300) {
                        let dir = UTILS.randomAngle(botPlayer.moveDir || 0);
                        if (botPlayer.moveDir != dir) {
                            botPlayer.moveDir = dir;
                            bot.emit("9", botPlayer.moveDir);
                            bot.moveRan.y = botPlayer.y2;
                            bot.moveRan.x = botPlayer.x2;
                            bot.moveRan.lastChange = Date.now();
                        }
                    }
                } else {
                    if (followType !== null) {
                        if (Math.hypot(botPlayer.x2 - player.x2, botPlayer.y2 - player.y2) <= 800) {
                            // do nothing so keeps same
                        } else {
                            followType = null;
                        }
                    }

                    // GO TO PLAYER:
                    if (configs.botMovementMode !== "Stay") {
                        let px = botPlayer.x2 ?? botPlayer.x;
                        let py = botPlayer.y2 ?? botPlayer.y;
                        let targetObj = null
                        if (followType !== null) {
                            let nearest = null
                            let minDist = Infinity

                            for (let tmp of gameObjects) {
                                if (tmp.type == followType) {
                                    let ox = tmp.x2 ?? tmp.x
                                    let oy = tmp.y2 ?? tmp.y
                                    let dist = UTILS.getDistance(ox, oy, px, py)
                                    if (dist < minDist) {
                                        minDist = dist
                                        nearest = tmp
                                    }
                                }
                            }

                            if (nearest) targetObj = nearest
                        }
                        if (targetObj) {
                            let ox = targetObj.x2 ?? targetObj.x
                            let oy = targetObj.y2 ?? targetObj.y
                            let dist = UTILS.getDistance(ox, oy, px, py)
                            let angle = Math.atan2(oy - py, ox - px)

                            if (dist > targetObj.scale + botPlayer.scale) {
                                bot.emit("9", angle, 1);
                                if (botPlayer.weapons[1] == 10) bot.emit("z", 10, true);
                                else bot.emit("z", botPlayer.weapons[0], true);
                            } else {
                                bot.emit("9", null, 0);
                                if (!waitForHit || !musketSync || !bullHit || !autoAim) {
                                    bot.emit("D", angle);
                                    if (botPlayer.weapons[1] == 10) bot.emit("z", 10, true);
                                    else bot.emit("z", botPlayer.weapons[0], true);
                                    bot.emit("F", 1);
                                    bot.emit("F", 0);
                                }
                            }
                        } else {
                            let followTarget = player;
                            if (isAutoFollowOn && targetPlayerId !== null) {
                                followTarget = players.find(p => p.sid === targetPlayerId) || player;
                            }

                            let playerObject = gameObjects.filter(object => object.active && object.owner && object.owner.sid == player.sid).sort((a, b) => UTILS.getDistance(botPlayer.x2, botPlayer.y2, a.x, a.y) - UTILS.getDistance(botPlayer.x2, botPlayer.y2, b.x, b.y))[0];

                            let fx = followTarget.x2 ?? followTarget.x;
                            let fy = followTarget.y2 ?? followTarget.y;
                            let dx = fx - px;
                            let dy = fy - py;
                            let dist = Math.hypot(dx, dy);
                            let angle = Math.atan2(dy, dx);

                            let angleObj = null;
                            let distObj = null;

                            if (playerObject) {
                                let ox = playerObject.x;
                                let oy = playerObject.y;

                                let odx = ox - px;
                                let ody = oy - py;

                                distObj = Math.hypot(odx, ody);
                                angleObj = Math.atan2(ody, odx);
                            }
                            if (configs.botMovementMode == "Copy") {
                                botPlayer.moveDir = angle;
                                if (dist >= configs.distToTT) {
                                    bot.emit("9", angle);
                                } else {
                                    bot.emit("9", followTarget.moveDir);
                                }
                            } else if (configs.botMovementMode == "Circle") {
                                let radius = configs.distToTT;
                                let target;
                                if (dist > radius + 35) {
                                    target = followTarget;
                                } else {
                                    let ang = Math.atan2(py - followTarget.y2, px - followTarget.x2) + toRad(10);
                                    target = {
                                        x: followTarget.x + radius * cos(ang),
                                        y: followTarget.y + radius * sin(ang)
                                    };
                                }
                                bot.emit("9", Math.atan2(target.y - py, target.x - px));
                            } else if (configs.botMovementMode == "Clear") {
                                // Find nearest ENEMY object to destroy (ALL objects not owned by player/allies)
                                let enemyObject = gameObjects.filter(object => object.active && object.owner && object.owner.sid != player.sid && object.owner.sid != botPlayer.sid && !bot.isAlly(object.owner.sid)).sort((a, b) => UTILS.getDistance(botPlayer.x2, botPlayer.y2, a.x, a.y) - UTILS.getDistance(botPlayer.x2, botPlayer.y2, b.x, b.y))[0];
                                if (enemyObject) {
                                    let ex = enemyObject.x;
                                    let ey = enemyObject.y;
                                    let edx = ex - px;
                                    let edy = ey - py;
                                    let enemyDist = Math.hypot(edx, edy);
                                    let enemyAngle = Math.atan2(edy, edx);
                                    let weaponRange = items.weapons[botPlayer.weapons[0]].range || 60;
                                    let objectScale = enemyObject.scale || enemyObject.getScale?.() || 35;
                                    let safeDistance = weaponRange + objectScale - 10;
                                    botPlayer.moveDir = enemyAngle;
                                    if (enemyDist > safeDistance) {
                                        bot.emit("9", enemyAngle);
                                    } else {
                                        bot.emit("9", undefined);
                                        if (!waitForHit && !autoAim) {
                                            bot.emit("D", enemyAngle);
                                            bot.emit("F", 1);
                                            bot.emit("F", 0);
                                        }
                                    }
                                } else {
                                    // No enemy object found, stay near player
                                    botPlayer.moveDir = angle;
                                    if (dist >= configs.distToTT) {
                                        bot.emit("9", angle);
                                    } else {
                                        bot.emit("9", undefined);
                                    }
                                }
                            } else if (configs.botMovementMode == "Normal") {
                                botPlayer.moveDir = angle;
                                if (dist >= configs.distToTT) {
                                    bot.emit("9", angle);
                                } else {
                                    bot.emit("9", undefined);
                                }
                            } else if (configs.botMovementMode == "Mouse") {
                                let x = mouseX - gameCanvas.width / 2;
                                let y = mouseY - gameCanvas.height / 2;
                                let dx = player.x2 - botPlayer.x2 + x;
                                let dy = player.y2 - botPlayer.y2 + y;
                                let pos = Math.atan2(dy, dx);
                                bot.emit("9", pos);
                            } else {
                                bot.emit("9", undefined);
                            }
                        }
                    }
                }
            }
        }
        if (type == "H") {
            let tmpData = data[0];
            for (let i = 0; i < tmpData.length;) {
                botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4], tmpData[i + 5], items.list[tmpData[i + 6]], true, tmpData[i + 7] >= 0 ? {
                    sid: tmpData[i + 7]
                } : null);
                i += 8;
            }
        }
        if (type == "N") {
            let index = data[0];
            let value = data[1];
            if (botPlayer) {
                botPlayer[index] = value;
            }
        }
        if (type == "O") {
            if (data[0] == botPlayer.sid) {
                let damage = botPlayer.health - data[1];
                botPlayer.oldHealth = botPlayer.health;
                botPlayer.health = data[1];
                botPlayer.judgeShame();
                if (botPlayer.oldHealth > botPlayer.health) {
                    damageShit = game.tick + 1;
                    if (!isProxy && !configs.goldBots && botPlayer.skinIndex != 45 && botPlayer.shameCount <= 5) {
                        if (botPlayer.health <= 35) {
                            bot.heal(botPlayer.health);
                        } else if (botPlayer.health <= 65) {
                            setTimeout(() => bot.heal(botPlayer.health), 50);
                        } else {
                            setTimeout(() => bot.heal(botPlayer.health), 85);
                        }
                    }
                } else if ([20, 30, 35, 45, 15, 22.5, 26.25, 33.75].includes(damage)) {
                    // for safety
                    if (botPlayer.skinIndex != 6) {
                        bot.hat(6);
                    }
                }
            }
        }
        if (type == "Q") {
            let sid = data[0];
            botObjManager.disableBySid(sid);
        }
        if (type == "R") {
            let sid = data[0];
            if (botPlayer.alive) {
                botObjManager.removeAllItems(sid);
            }
        }
        if (type == "S") {
            let index = data[0];
            let value = data[1];
            if (botPlayer) {
                botPlayer.itemCounts[index] = value;
            }
        }
        if (type == "6") {
            let id = data[0];
            let mzg = (data[1] + "").trim().toLowerCase();
            if (player && id == player.sid) {
                if (mzg === "!stop") {
                    followType = null;
                } else if (mzg === "!wood") {
                    followType = 0;
                } else if (mzg === "!food") {
                    followType = 1;
                } else if (mzg === "!stone") {
                    followType = 2;
                } else if (mzg === "!gold") {
                    followType = 3;
                }
                if (mzg === "!w") {
                    aeaeaeaeaeaeaeeaaeaeae = !aeaeaeaeaeaeaeeaaeaeae;
                }
            }
            if (player && id == player.sid) {
                if (/!follow\s+\d+/i.test(mzg)) {
                    let followId = parseInt(mzg.split(" ")[1]);
                    let target = players.find(obj => obj.sid === followId);
                    if (target) {
                        isAutoFollowOn = true;
                        targetPlayerId = followId;
                    }
                }
                if (/!unfollow/i.test(mzg)) {
                    isAutoFollowOn = false;
                    targetPlayerId = null;
                }
            }
        }
        if (type == "U") {
            if (data[0] > 0 && botPlayer.upgraded < 8) {
                if (configs.botWeaponType == "Musket") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(5);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(9);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                } else if (configs.botWeaponType == "Hammer") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(5);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(10);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                } else if (configs.botWeaponType == "Stick") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(8);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(9);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                } else if (configs.botWeaponType == "Dagger") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(7);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(9);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                } else if (configs.botWeaponType == "Bat") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(6);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(9);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                } else if (configs.botWeaponType == "Sword") {
                    if (botPlayer.upgraded == 0) {
                        bot.upgradeItem(3);
                    } else if (botPlayer.upgraded == 1) {
                        bot.upgradeItem(17);
                    } else if (botPlayer.upgraded == 2) {
                        bot.upgradeItem(31);
                    } else if (botPlayer.upgraded == 3) {
                        bot.upgradeItem(27);
                    } else if (botPlayer.upgraded == 4) {
                        bot.upgradeItem(9);
                    } else if (botPlayer.upgraded == 5) {
                        bot.upgradeItem(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.upgradeItem(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.upgradeItem(15);
                    }
                }
                botPlayer.upgraded++;
            }
        }
        if (type == "K") {
            if (data[0] == botPlayer.sid) {
                botPlayer.gatherIndex = data[2];
                botPlayer.gathering = 1;
            }
        }
        if (type == "X") {
            runAtNextTick.push(data);
        }
        if (type == "V") {
            let tmpData = data[0];
            let wpn = data[1];
            if (tmpData) {
                if (wpn) {
                    botPlayer.weapons = tmpData;
                } else {
                    botPlayer.items = tmpData;
                }
            }
        }
        if (type == "5") {
            let type = data[0];
            let id = data[1];
            let index = data[2];
            if (index) {
                if (!type) {
                    botPlayer.tails[id] = 1;
                } else {
                    botPlayer.latestTail = id;
                }
            } else if (!type) {
                botPlayer.skins[id] = 1;
            } else {
                botPlayer.latestSkin = id;
            }
            bhats.push({
                id: id,
                type: index
            });
        }
    };
    bot.onclose = function () {
        botPlayer.inGame = false;
        bD.inGame = false;

        // Release skin when bot disconnects
        if (bot.mySkin !== undefined) {
            let skinIndex = usedSkins.indexOf(bot.mySkin);
            if (skinIndex > -1) {
                usedSkins.splice(skinIndex, 1);
            }
        }
        if (!bot.slotReleased) {
            bot.slotReleased = true;
            if (isProxy && proxyUrl) {
                window.proxyUsage[proxyUrl] = Math.max(0, (window.proxyUsage[proxyUrl] || 1) - 1);
            } else if (!isProxy) {
                window.directUsed = false;
            }
        }
    };
}

// RENDER LEAF:
function renderLeaf(x, y, l, r, ctxt) {
    let endX = x + l * Math.cos(r);
    let endY = y + l * Math.sin(r);
    let width = l * 0.4;
    ctxt.moveTo(x, y);
    ctxt.beginPath();
    ctxt.quadraticCurveTo((x + endX) / 2 + width * Math.cos(r + Math.PI / 2), (y + endY) / 2 + width * Math.sin(r + Math.PI / 2), endX, endY);
    ctxt.quadraticCurveTo((x + endX) / 2 - width * Math.cos(r + Math.PI / 2), (y + endY) / 2 - width * Math.sin(r + Math.PI / 2), x, y);
    ctxt.closePath();
    ctxt.fill();
    ctxt.stroke();
}

// RENDER CIRCLE:
function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, Math.PI * 2);
    if (!dontFill) {
        tmpContext.fill();
    }
    if (!dontStroke) {
        tmpContext.stroke();
    }
}
function getDir(a, b) {
    // point, target
    return atan2((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x)); // Math.atan2(y, x) parameters
}
function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
    tmpContext = tmpContext || mainContext;
    tmpContext.beginPath();
    tmpContext.arc(x, y, scale, 0, Math.PI * 2);
    if (!dontFill) {
        tmpContext.fill();
    }
    if (!dontStroke) {
        tmpContext.stroke();
    }
}

// RENDER STAR SHAPE:
function renderStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x;
    let y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}
function renderHealthStar(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x;
    let y;
    let step = Math.PI / spikes;
    ctxt.beginPath();
    ctxt.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer;
        y = Math.sin(rot) * outer;
        ctxt.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * inner;
        y = Math.sin(rot) * inner;
        ctxt.lineTo(x, y);
        rot += step;
    }
    ctxt.lineTo(0, -outer);
    ctxt.closePath();
}

// RENDER RECTANGLE:
function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) {
        ctxt.fillRect(x - w / 2, y - h / 2, w, h);
    }
    if (!dontStroke) {
        ctxt.strokeRect(x - w / 2, y - h / 2, w, h);
    }
}
function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
    if (!dontFill) {
        ctxt.fillRect(x - w / 2, y - h / 2, w, h);
    }
    if (!dontStroke) {
        ctxt.strokeRect(x - w / 2, y - h / 2, w, h);
    }
}

// RENDER RECTCIRCLE:
function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
    ctxt.save();
    ctxt.translate(x, y);
    seg = Math.ceil(seg / 2);
    for (let i = 0; i < seg; i++) {
        renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
        ctxt.rotate(Math.PI / seg);
    }
    ctxt.restore();
}

// RENDER BLOB:
function renderBlob(ctxt, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x;
    let y;
    let step = Math.PI / spikes;
    let tmpOuter;
    ctxt.beginPath();
    ctxt.moveTo(0, -inner);
    for (let i = 0; i < spikes; i++) {
        tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
        ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter, Math.cos(rot + step * 2) * inner, Math.sin(rot + step * 2) * inner);
        rot += step * 2;
    }
    ctxt.lineTo(0, -inner);
    ctxt.closePath();
}

// RENDER TRIANGLE:
function renderTriangle(s, ctx) {
    ctx = ctx || mainContext;
    let h = s * (Math.sqrt(3) / 2);
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(-s / 2, h / 2);
    ctx.lineTo(s / 2, h / 2);
    ctx.lineTo(0, -h / 2);
    ctx.fill();
    ctx.closePath();
}

// PREPARE MENU BACKGROUND:
function prepareMenuBackground() {
    let tmpMid = config.mapScale / 2;
    let shift = 750;
    objectManager.add(0, tmpMid + shift, tmpMid + 200, 0, config.treeScales[3], 0);
    objectManager.add(1, tmpMid + shift, tmpMid - 480, 0, config.treeScales[3], 0);
    objectManager.add(2, tmpMid + 300 + shift, tmpMid + 450, 0, config.treeScales[3], 0);
    objectManager.add(3, tmpMid - 950 + shift, tmpMid - 130, 0, config.treeScales[2], 0);
    objectManager.add(4, tmpMid - 750 + shift, tmpMid - 400, 0, config.treeScales[3], 0);
    objectManager.add(5, tmpMid - 700 + shift, tmpMid + 400, 0, config.treeScales[2], 0);
    objectManager.add(6, tmpMid + 800 + shift, tmpMid - 200, 0, config.treeScales[3], 0);
    objectManager.add(7, tmpMid - 260 + shift, tmpMid + 340, 0, config.bushScales[3], 1);
    objectManager.add(8, tmpMid + 760 + shift, tmpMid + 310, 0, config.bushScales[3], 1);
    objectManager.add(9, tmpMid - 800 + shift, tmpMid + 100, 0, config.bushScales[3], 1);
    objectManager.add(10, tmpMid - 800 + shift, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(11, tmpMid + 650 + shift, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
    objectManager.add(12, tmpMid - 400 + shift, tmpMid - 450, 0, config.rockScales[2], 2);
}
const speed = 1;
// RENDER PLAYERS:
function renderDeadPlayers(xOffset, yOffset) {
    mainContext.fillStyle = "#91b2db";
    const currentTime = Date.now();
    deadPlayers.filter(dead => dead.active).forEach(dead => {
        if (!dead.startTime) {
            dead.startTime = currentTime;
            dead.angle = 0;
            dead.radius = 0.1;
        }
        const timeElapsed = currentTime - dead.startTime;
        const maxAlpha = 1;
        dead.alpha = Math.max(0, maxAlpha - timeElapsed / 3000);
        dead.animate(delta);
        mainContext.globalAlpha = dead.alpha;
        mainContext.strokeStyle = outlineColor;
        mainContext.save();
        mainContext.translate(dead.x - xOffset, dead.y - yOffset);
        dead.radius -= 0.001;
        dead.angle += 0.0174533;
        const moveSpeed = 1;
        const x = dead.radius * Math.cos(dead.angle);
        const y = dead.radius * Math.sin(dead.angle);
        dead.x += x * moveSpeed;
        dead.y += y * moveSpeed;
        mainContext.rotate(dead.angle);
        renderDeadPlayer(dead, mainContext);
        mainContext.restore();
        mainContext.fillStyle = "#91b2db";
        if (timeElapsed >= 3000) {
            dead.active = false;
            dead.startTime = null;
        }
    });
}
function renderPlayers(xOffset, yOffset, zIndex) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#91b2db";
    for (var i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.zIndex == zIndex) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += delta * 0.002;
                tmpDir = tmpObj == player && configs.moysePlayerDirection ? getSafeDir() : tmpObj.dir || 0;
                mainContext.globalAlpha = configs.transParentPlayer;
                const count = getBotCount();
                mainContext.save();
                mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                if (count >= 0 && botSIDs.includes(tmpObj.sid) || configs.opvisualsPlayer) {
                    mainContext.globalAlpha = 0.26;
                    mainContext.shadowBlur = 8;
                    mainContext.shadowColor = "rgb(0, 0, 0, .7)";
                }
                mainContext.rotate(tmpDir + tmpObj.dirPlus);
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
                if (tmpObj == player && player.skinIndex == 56) {
                    // for see player
                    mainContext.save();
                    mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale + 25);
                    mainContext.rotate(tmpDir + tmpObj.dirPlus + Math.PI * 90 / 180);
                    mainContext.globalAlpha = 0.7;
                    renderSkin2(56, mainContext, null, tmpObj);
                    mainContext.restore();
                }
                if (configs.playersWeaponRange && !botSIDs.includes(tmpObj.sid)) {
                    const weaponRange = items.weapons[tmpObj.weaponIndex].range;
                    const color = dangerAids >= 5 ? "#FF0000" : dangerAids >= 2.5 ? "#FFFF00" : "#00FF00";
                    mainContext.save();
                    mainContext.globalAlpha = 0.5;
                    mainContext.strokeStyle = tmpObj == player ? color : "#FFA500";
                    mainContext.lineWidth = 5;
                    mainContext.beginPath();
                    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, weaponRange, 0, Math.PI * 2);
                    mainContext.stroke();
                    mainContext.restore();
                }
                if (configs.playerInsideCircle && tmpObj == player) {
                    const color = dangerAids >= 5 ? "#FF0000" : dangerAids >= 2.5 ? "#FFFF00" : "#00FF00";
                    mainContext.save();
                    mainContext.globalAlpha = 0.5;
                    mainContext.fillStyle = color;
                    mainContext.beginPath();
                    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, player.scale + 5.666667, 0, Math.PI * 2);
                    mainContext.fill();
                    mainContext.restore();
                }
                if (configs.gChatGear && tmpObj.shameCount > 0) {
                    // is for faded clown gear kekeke
                    const s = 7;
                    const sFr = Math.min(tmpObj.shameCount / s, 1);
                    const sF = 0.5 - Math.cos(sFr * Math.PI) * 0.5;
                    mainContext.save();
                    mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale + 25);
                    mainContext.rotate(tmpDir + tmpObj.dirPlus + Math.PI * 90 / 180);
                    mainContext.globalAlpha = 0.2 + sF * 0.5;
                    renderSkin2(45, mainContext, null, tmpObj);
                    mainContext.restore();
                }
            }
        }
    }
}
function renderDeadPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.save();
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = Math.PI / 4 * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndS || 1 : 1;
    let oHandDist = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndD || 1 : 1;
    if (obj.deadFade === undefined) {
        obj.deadFade = 1;
    }
    obj.deadFade -= 0.01;
    if (obj.deadFade <= 0) {
        obj.deadFade = 0;
        obj.deadRemove = true;
    }
    ctxt.globalAlpha = obj.deadFade;
    ctxt.shadowBlur = 8;
    ctxt.shadowColor = "rgba(0, 0, 0, 0.6)";
    if (obj.tailIndex > 0) {
        renderTail(obj.tailIndex, ctxt, obj);
    }
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant || 0].src || "", obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    ctxt.fillStyle = "#d6d6d6";
    renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14);
    renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14);
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant || 0].src || "", obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }
    if (obj.buildIndex >= 0) {
        let tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }
    ctxt.fillStyle = `rgba(190,190,190,${obj.deadFade * 0.8})`;
    renderCircle(0, 0, obj.scale, ctxt);
    if (obj.skinIndex > 0) {
        ctxt.rotate(Math.PI / 2);
        renderSkin(obj.skinIndex, ctxt, null, obj);
    }
    ctxt.restore();
}

// RENDER PLAYER:
function renderPlayer(obj, ctxt) {
    ctxt = ctxt || mainContext;
    ctxt.lineWidth = outlineWidth;
    ctxt.lineJoin = "miter";
    let handAngle = Math.PI / 4 * (items.weapons[obj.weaponIndex].armS || 1);
    let oHandAngle = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndS || 1 : 1;
    let oHandDist = obj.buildIndex < 0 ? items.weapons[obj.weaponIndex].hndD || 1 : 1;
    let isPolearm = obj.weaponIndex === 5;
    if (isPolearm) {
        handAngle = Math.PI / 2.5;
        oHandAngle = 2.2;
    }
    let weaponThrust = isPolearm ? obj.polearmThrust * 25 : 0;
    let thrustAngle = -Math.PI / 1.8;
    let rightHandThrustX = isPolearm ? -(obj.rightHandThrust / 5) * Math.sin(thrustAngle) : -3;
    let rightHandThrustY = isPolearm ? -(obj.rightHandThrust / 5) * Math.cos(thrustAngle) : 5;
    let leftHandThrustX = isPolearm ? -(obj.leftHandThrust / 5) * Math.sin(thrustAngle) : 0;
    let leftHandThrustY = isPolearm ? -obj.leftHandThrust * Math.cos(thrustAngle) : 0;
    const katanaMusket = obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15;

    // TAIL/CAPE:
    if (obj.tailIndex > 0) {
        renderTail(obj.tailIndex, ctxt, obj);
    }

    // WEAPON BELLOW HANDS:
    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
        ctxt.save();
        if (isPolearm) {
            ctxt.rotate(thrustAngle);
            ctxt.translate(0, weaponThrust);
        }
        renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale - (isPolearm ? 56 : 0), isPolearm ? -10 : 0, ctxt);
        ctxt.restore();
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], ctxt);
        }
    }

    // HANDS:
    ctxt.fillStyle = config.skinColors[obj.skinColor];
    if (isPolearm) {
        let rightHandXPos = -obj.scale * Math.cos(handAngle) + rightHandThrustX;
        let rightHandYPos = obj.scale * Math.sin(handAngle) + rightHandThrustY;
        renderCircle(rightHandXPos, rightHandYPos, 14);
        let leftHandXPos = -obj.scale * oHandDist * Math.cos(handAngle * oHandAngle) + 8 + leftHandThrustX;
        let leftHandYPos = obj.scale * oHandDist * Math.sin(handAngle * oHandAngle) + leftHandThrustY;
        renderCircle(leftHandXPos, leftHandYPos, 14);
    } else {
        renderCircle(obj.scale * Math.cos(handAngle), obj.scale * Math.sin(handAngle), 14);
        renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14);
    }

    // WEAPON ABOVE HANDS:
    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
            renderProjectile(obj.scale, 0, items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
        }
    }

    // BUILD ITEM:
    if (obj.buildIndex >= 0) {
        const tmpSprite = getItemSprite(items.list[obj.buildIndex]);
        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
    }

    // BODY:
    renderCircle(0, 0, obj.scale, ctxt);

    // SKIN:
    if (obj.skinIndex > 0) {
        ctxt.rotate(Math.PI / 2);
        renderSkin(obj.skinIndex, ctxt, null, obj);
    }
}

// RENDER NORMAL SKIN
var skinSprites2 = {};
var skinPointers2 = {};
function renderSkin2(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        //tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin || skinPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin2(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

// RENDER SKIN:
function renderTextureSkin(index, ctxt, parentSkin, owner) {
    if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setSkinTextureImage(index, "hat", index);
        skinSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}
function setSkinTextureImage(id, type, id2) {
    if (type == "acc") {
        return ".././img/accessories/access_" + id + ".png";
    } else if (type == "hat") {
        return ".././img/hats/hat_" + id + ".png";
    } else {
        return ".././img/weapons/" + id + ".png";
    }
}
// RENDER SKINS:
let skinSprites = {};
let skinPointers = {};
let tmpSkin;
function renderSkin(index, ctxt, parentSkin, owner) {
    tmpSkin = skinSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
        skinSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

// RENDER TAIL:
var newAccImgs = {
    21: "https://i.imgur.com/4ddZert.png",
    19: "https://i.imgur.com/sULkUZT.png"
};
function setTailTextureImage(id, type, id2) {
    if (true) {
        if (newAccImgs[id] && type == "acc") {
            return newAccImgs[id];
        } else if (type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if (type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    } else if (type == "acc") {
        return ".././img/accessories/access_" + id + ".png";
    } else if (type == "hat") {
        return ".././img/hats/hat_" + id + ".png";
    } else {
        return ".././img/weapons/" + id + ".png";
    }
}
function renderTailTextureImage(index, ctxt, owner) {
    if (!(tmpSkin = accessSprites[index + (txt ? "lol" : 0)])) {
        var tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setTailTextureImage(index, "acc");
        //".././img/accessories/access_" + index + ".png";
        accessSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin) {
            ctxt.rotate(owner.skinRot);
        }
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}
let accessSprites = {};
let accessPointers = {};
var txt = true;
function renderTail(index, ctxt, owner) {
    tmpSkin = accessSprites[index];
    if (!tmpSkin) {
        let tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    let tmpObj = accessPointers[index];
    if (!tmpObj) {
        for (let i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin) {
            ctxt.rotate(owner.skinRot);
        }
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}
var accessSprites2 = {};
var accessPointers2 = {};
function renderTail2(index, ctxt, owner) {
    tmpSkin = accessSprites2[index];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
        accessSprites2[index] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = accessPointers2[index];
    if (!tmpObj) {
        for (var i = 0; i < accessories.length; ++i) {
            if (accessories[i].id == index) {
                tmpObj = accessories[i];
                break;
            }
        }
        accessPointers2[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.save();
        ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
        if (tmpObj.spin) {
            ctxt.rotate(owner.skinRot);
        }
        ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
        ctxt.restore();
    }
}

// RENDER TOOL:
let toolSprites = {};
function renderTool(obj, variant, x, y, ctxt) {
    let tmpSrc = obj.src + (variant || "");
    let tmpSprite = toolSprites[tmpSrc];
    if (!tmpSprite) {
        tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        };
        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
        toolSprites[tmpSrc] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        ctxt.drawImage(tmpSprite, x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2, obj.length, obj.width);
    }
}
function renderProjectiles(e, t, i) {
    for (var s = 0; s < projectiles.length; ++s) {
        if ((tmpObj = projectiles[s]).active && tmpObj.layer == e) {
            tmpObj.update(delta);
            if (tmpObj.active && isOnScreen(tmpObj.x - t, tmpObj.y - i, tmpObj.scale)) {
                mainContext.save();
                mainContext.translate(tmpObj.x - t, tmpObj.y - i);
                mainContext.rotate(tmpObj.dir);
                renderProjectile(0, 0, tmpObj, mainContext, 1);
                mainContext.restore();
            }
        }
    }
}

// RENDER PROJECTILE:
let projectileSprites = {}; //fz iz zexy

function renderProjectile(x, y, obj, ctxt, debug) {
    if (obj.src) {
        let tmpSrc = items.projectiles[obj.indx].src;
        let tmpSprite = projectileSprites[tmpSrc];
        if (!tmpSprite) {
            tmpSprite = new Image();
            tmpSprite.onload = function () {
                this.isLoaded = true;
            };
            tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
            projectileSprites[tmpSrc] = tmpSprite;
        }
        if (tmpSprite.isLoaded) {
            ctxt.drawImage(tmpSprite, x - obj.scale / 2, y - obj.scale / 2, obj.scale, obj.scale);
        }
    } else if (obj.indx == 1) {
        ctxt.fillStyle = "#939393";
        renderCircle(x, y, obj.scale, ctxt);
    }
}

// RENDER AI:
let aiSprites = {};
function renderAI(obj, ctxt) {
    let tmpIndx = obj.index;
    let tmpSprite = aiSprites[tmpIndx];
    if (!tmpSprite) {
        let tmpImg = new Image();
        tmpImg.onload = function () {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
        tmpSprite = tmpImg;
        aiSprites[tmpIndx] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
        let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
        ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
    }
}

// RENDER WATER BODIES:
function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
    // MIDDLE RIVER:
    let tmpW = config.riverWidth + padding;
    let tmpY = config.mapScale / 2 - yOffset - tmpW / 2;
    if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
        ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
    }
}

// RENDER GAME OBJECTS:
var gameObjectSprites = {};
var mathPI = Math.PI;
var mathPI2 = mathPI * 2;
function getResSprite(obj) {
    var biomeID = obj.y >= config.mapScale - config.snowBiomeTop ? 2 : obj.y <= config.snowBiomeTop ? 1 : 0;
    var tmpIndex = obj.type + "_" + obj.scale + "_" + biomeID;
    var tmpSprite = gameObjectSprites[tmpIndex];
    if (!tmpSprite) {
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.1 + outlineWidth;
        var tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(UTILS.randFloat(0, Math.PI));
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        let colors = [["#b1d959", "#95b946"], ["#bade6e", "#aac76b"], ["#a7d544", "#86a63f"], ["#b4db62", "#9ebf57"]];
        let select = colors[Math.floor(Math.random() * colors.length)];
        if (obj.type == 0) {
            var tmpScale;
            for (var i = 0; i < 2; ++i) {
                tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !biomeID ? !i ? "#9ebf57" : "#b4db62" : !i ? "#e3f1f4" : "#fff";
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                }
            }
        } else if (obj.type == 1) {
            if (biomeID == 2) {
                tmpContext.fillStyle = "#606060";
                renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = "#89a54c";
                renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                tmpContext.fillStyle = "#a5c65b";
                renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
            } else {
                renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                tmpContext.fill();
                tmpContext.stroke();
                tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                var tmpRange;
                var berries = 4;
                var rotVal = mathPI2 / berries;
                for (var i = 0; i < berries; ++i) {
                    tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                    renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(10, 12), tmpContext);
                }
            }
        } else if (obj.type == 2 || obj.type == 3) {
            tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#938d77" : "#939393" : "#e0c655";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = obj.type == 2 ? biomeID == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        gameObjectSprites[tmpIndex] = tmpSprite;
    }
    return tmpSprite;
}

// GET ITEM SPRITE:
let itemSprites = [];
function getItemSprite(obj, asIcon) {
    let tmpSprite = itemSprites[obj.id];
    if (!tmpSprite || asIcon) {
        let blurScale = 0;
        let tmpCanvas = document.createElement("canvas");
        let reScale = !asIcon && obj.name == "windmill" ? items.list[4].scale : obj.scale;
        tmpCanvas.width = tmpCanvas.height = reScale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(asIcon ? 0 : Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth * (asIcon ? tmpCanvas.width / 81 : 1);
        if (obj.name == "apple") {
            tmpContext.fillStyle = "#c15555";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fillStyle = "#89a54c";
            let leafDir = -(Math.PI / 2);
            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, tmpContext);
        } else if (obj.name == "apple") {
            tmpContext.fillStyle = "#cca861";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fillStyle = "#937c4b";
            let chips = 4;
            let rotVal = Math.PI * 2 / chips;
            let tmpRange;
            for (let i = 0; i < chips; ++i) {
                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
            }
        } else if (obj.name == "apple") {
            tmpContext.fillStyle = "#f4f3ac";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fillStyle = "#c3c28b";
            let chips = 4;
            let rotVal = Math.PI * 2 / chips;
            let tmpRange;
            for (let i = 0; i < chips; ++i) {
                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
            }
        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
            tmpContext.fillStyle = obj.name == "castle wall" ? "#83898e" : obj.name == "wood wall" ? "#a5974c" : "#939393";
            let sides = obj.name == "castle wall" ? 4 : 3;
            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = obj.name == "castle wall" ? "#9da4aa" : obj.name == "wood wall" ? "#c9b758" : "#bcbcbc";
            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
            let tmpScale = obj.scale * 0.6;
            renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, tmpScale, tmpContext);
            tmpContext.fillStyle = "#c3af45";
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, reScale, tmpContext);
            tmpContext.fillStyle = "#c9b758";
            renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, reScale * 0.5, tmpContext);
        } else if (obj.name == "mine") {
            tmpContext.fillStyle = "#939393";
            renderStar(tmpContext, 3, obj.scale, obj.scale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#bcbcbc";
            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
            tmpContext.fill();
        } else if (obj.name == "sapling") {
            for (let i = 0; i < 2; ++i) {
                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                tmpContext.fillStyle = !i ? "#9ebf57" : "#b4db62";
                tmpContext.fill();
                if (!i) {
                    tmpContext.stroke();
                }
            }
        } else if (obj.name == "pit trap") {
            tmpContext.fillStyle = "#a5974c";
            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = outlineColor;
            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        } else if (obj.name == "boost pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#dbd97d";
            renderTriangle(obj.scale * 1, tmpContext);
        } else if (obj.name == "turret") {
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#939393";
            let tmpLen = 50;
            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
        } else if (obj.name == "platform") {
            tmpContext.fillStyle = "#cebd5f";
            let tmpCount = 4;
            let tmpS = obj.scale * 2;
            let tmpW = tmpS / tmpCount;
            let tmpX = -(obj.scale / 2);
            for (let i = 0; i < tmpCount; ++i) {
                renderRect(tmpX - tmpW / 2, 0, tmpW, obj.scale * 2, tmpContext);
                tmpContext.fill();
                tmpContext.stroke();
                tmpX += tmpS / tmpCount;
            }
        } else if (obj.name == "healing pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
        } else if (obj.name == "spawn pad") {
            tmpContext.fillStyle = "#7e7f82";
            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#71aad6";
            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        } else if (obj.name == "blocker") {
            tmpContext.fillStyle = "#7e7f82";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.rotate(Math.PI / 4);
            tmpContext.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
        } else if (obj.name == "teleporter") {
            tmpContext.fillStyle = "#7e7f82";
            renderCircle(0, 0, obj.scale, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.rotate(Math.PI / 4);
            tmpContext.fillStyle = "#d76edb";
            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
        }
        tmpSprite = tmpCanvas;
        if (!asIcon) {
            itemSprites[obj.id] = tmpSprite;
        }
    }
    return tmpSprite;
}
function getItemSprite2(obj, tmpX, tmpY) {
    let tmpContext = mainContext;
    let reScale = obj.name == "windmill" ? items.list[4].scale : obj.scale;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(obj.dir);
    tmpContext.strokeStyle = outlineColor;
    tmpContext.lineWidth = outlineWidth;
    if (obj.name == "apple") {
        tmpContext.fillStyle = "#c15555";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#89a54c";
        let leafDir = -(Math.PI / 2);
        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, tmpContext);
    } else if (obj.name == "apple") {
        tmpContext.fillStyle = "#cca861";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#937c4b";
        let chips = 4;
        let rotVal = Math.PI * 2 / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "apple") {
        tmpContext.fillStyle = "#f4f3ac";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c3c28b";
        let chips = 4;
        let rotVal = Math.PI * 2 / chips;
        let tmpRange;
        for (let i = 0; i < chips; ++i) {
            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), UTILS.randInt(4, 5), tmpContext, true);
        }
    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
        tmpContext.fillStyle = obj.name == "castle wall" ? "#83898e" : obj.name == "wood wall" ? "#a5974c" : "#939393";
        let sides = obj.name == "castle wall" ? 4 : 3;
        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = obj.name == "castle wall" ? "#9da4aa" : obj.name == "wood wall" ? "#c9b758" : "#bcbcbc";
        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
        let tmpScale = obj.scale * 0.6;
        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, reScale * 0.5, tmpContext);
    } else if (obj.name == "mine") {
        tmpContext.fillStyle = "#939393";
        renderStar(tmpContext, 3, obj.scale, obj.scale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#bcbcbc";
        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "sapling") {
        for (let i = 0; i < 2; ++i) {
            let tmpScale = obj.scale * (!i ? 1 : 0.5);
            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
            tmpContext.fillStyle = !i ? "#9ebf57" : "#b4db62";
            tmpContext.fill();
            if (!i) {
                tmpContext.stroke();
            }
        }
    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = outlineColor;
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    } else if (obj.name == "boost pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#dbd97d";
        renderTriangle(obj.scale * 1, tmpContext);
    } else if (obj.name == "turret") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - tmpW / 2, 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }
    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
    }
    tmpContext.restore();
}
let objSprites = [];
function getObjSprite(obj) {
    let tmpSprite = objSprites[obj.id];
    if (!tmpSprite) {
        // let blurScale = isNight ? 20 : 0;
        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + 0;
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
        tmpContext.rotate(Math.PI / 2);
        tmpContext.strokeStyle = outlineColor;
        tmpContext.lineWidth = outlineWidth;
        // if (isNight) {
        //     tmpContext.shadowBlur = 20;
        //     tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
        // }
        if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
            let tmpScale = obj.scale * 0.6;
            renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = "#a5974c";
            renderCircle(0, 0, tmpScale, tmpContext);
            tmpContext.fillStyle = "#c3af45";
            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        } else if (obj.name == "pit trap") {
            tmpContext.fillStyle = "#a5974c";
            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
            tmpContext.fill();
            tmpContext.stroke();
            tmpContext.fillStyle = outlineColor;
            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
            tmpContext.fill();
        }
        tmpSprite = tmpCanvas;
        objSprites[obj.id] = tmpSprite;
    }
    return tmpSprite;
}

function coolNeonPlace(obj, tmpContext, tmpX, tmpY) {
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(lastPlaceRad);
    tmpContext.lineJoin = "round";
    tmpContext.lineCap = "round";

    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        let color = "#FF0000";
        let tmpScale = obj.scale * 0.6;

        tmpContext.globalAlpha = 0.5;
        tmpContext.fillStyle = "rgba(0, 0, 0, 0.5)";
        tmpContext.shadowBlur = 15;
        tmpContext.shadowColor = color;
        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();

        tmpContext.globalAlpha = 1;
        tmpContext.lineWidth = obj.name == "spikes" ? 4 : 5;
        tmpContext.strokeStyle = color;
        tmpContext.shadowBlur = 35;
        tmpContext.shadowColor = color;
        tmpContext.stroke();
    } else if (obj.name == "pit trap") {
        let color = "#00FFFF";
        let s = obj.scale;

        tmpContext.globalAlpha = 0.5;
        tmpContext.fillStyle = "rgba(0, 0, 0, 0.5)";
        tmpContext.shadowBlur = 15;
        tmpContext.shadowColor = color;
        renderStar(tmpContext, 3, s * 1.1, s * 1.1);
        tmpContext.fill();

        tmpContext.globalAlpha = 1;
        tmpContext.lineWidth = 5;
        tmpContext.strokeStyle = color;
        tmpContext.shadowBlur = 35;
        tmpContext.shadowColor = color;
        tmpContext.stroke();
    }

    tmpContext.restore();
}

// OBJECT ON SCREEN:
function isOnScreen(x, y, s) {
    return x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y, s, maxScreenHeight);
}
const Ye = {
    animationTime: 0,
    land: null,
    lava: null,
    x: 13960,
    y: 13960
};
function Do(e, t, i) {
    const n = e.lineWidth || 0;
    i /= 2;
    e.beginPath();
    let s = Math.PI * 2 / t;
    for (let r = 0; r < t; r++) {
        e.lineTo(i + (i - n / 2) * Math.cos(s * r), i + (i - n / 2) * Math.sin(s * r));
    }
    e.closePath();
}
function drawVolcanoSprite() {
    const t = 640;
    const i = document.createElement("canvas");
    i.width = t;
    i.height = t;
    const n = i.getContext("2d");
    n.strokeStyle = "#3e3e3e";
    n.lineWidth = 11;
    n.fillStyle = "#7f7f7f";
    Do(n, 10, t);
    n.fill();
    n.stroke();
    Ye.land = i;
    const s = document.createElement("canvas");
    const r = 200;
    s.width = r;
    s.height = r;
    const o = s.getContext("2d");
    o.strokeStyle = "#525252";
    o.lineWidth = 8.8;
    o.fillStyle = "#f54e16";
    o.strokeStyle = "#f56f16";
    Do(o, 10, r);
    o.fill();
    o.stroke();
    Ye.lava = s;
}
drawVolcanoSprite();
function drawVolcano(context, x, y) {
    const e = player.x - maxScreenWidth / 2;
    const t = player.y - maxScreenHeight / 2;
    Ye.animationTime += delta;
    Ye.animationTime %= 3200;
    const i = 1600;
    const n = 1.7 + Math.abs(i - Ye.animationTime) / i * 0.3;
    const s = n * 100;
    context.drawImage(Ye.land, x - 320, y - 320, 640, 640);
    context.drawImage(Ye.lava, x - s, y - s, s * 2, s * 2);
}

// RENDER GAME OBJECTS:
function renderGameObjects(layer, xOffset, yOffset) {
    let tmpSprite;
    let tmpX;
    let tmpY;
    for (let i = 0; i < gameObjects.length; ++i) {
        tmpObj = gameObjects[i];
        if (tmpObj.active) {
            tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
            tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
            if (layer == 0) {
                tmpObj.update(delta);
            }
            let dist = false;
            if (inGame) {
                dist = UTILS.getDistance(player.x, player.y, tmpObj.x, tmpObj.y) < 1200;
            } else {
                dist = true;
            }
            if (dist && tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                mainContext.globalAlpha = tmpObj.hideFromEnemy ? 0.6 : 1;
                if (tmpObj.isItem) {
                    tmpSprite = getItemSprite(tmpObj);
                    mainContext.globalAlpha = configs.transparentobject;
                    mainContext.save();
                    mainContext.translate(tmpX, tmpY);
                    mainContext.rotate(tmpObj.dir);
                    mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                    if (tmpObj.blocker) {
                        mainContext.strokeStyle = "#db6e6e";
                        mainContext.globalAlpha = 0.3;
                        mainContext.lineWidth = 6;
                        renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                    }
                    mainContext.restore();
                } else {
                    tmpSprite = getResSprite(tmpObj);
                    if (tmpObj.type === 4) {
                        drawVolcano(mainContext, tmpX, tmpY);
                    } else {
                        mainContext.drawImage(tmpSprite, tmpX - tmpSprite.width / 2, tmpY - tmpSprite.height / 2);
                    }
                }
            }
        }
    }

    // PLACE VISIBLE:
    if (layer === 0) {
        if (placeVisible.length) {
            placeVisible.forEach((places) => {
                tmpX = places.x - xOffset;
                tmpY = places.y - yOffset;
                markObject(places, tmpX, tmpY);
            });
        }
    }
}

function markObject(tmpObj, tmpX, tmpY) {
    getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
}

// GET MARK SPRITE:
function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
    let center = {
        x: screenWidth / 2,
        y: screenHeight / 2,
    };
    tmpContext.lineWidth = outlineWidth;
    mainContext.globalAlpha = .26;
    tmpContext.strokeStyle = outlineColor;
    tmpContext.save();
    tmpContext.translate(tmpX, tmpY);
    tmpContext.rotate(lastRadDir);
    tmpContext.shadowBlur = 14;
    tmpContext.shadowColor = "rgba(0, 0, 0, 0.5)"; // here needs the shitty color yk

    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
        tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
        var tmpScale = (obj.scale * 0.6);
        renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, tmpScale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
        /*
    let color = "#FF0000";
    let tmpScale = obj.scale * 0.6;

    tmpContext.globalAlpha = 0.5;
    tmpContext.fillStyle = "rgba(0, 0, 0, 0.5)";
    tmpContext.shadowBlur = 15;
    tmpContext.shadowColor = color;
    renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
    tmpContext.fill();

    tmpContext.globalAlpha = 1;
    tmpContext.lineWidth = obj.name == "spikes" ? 4 : 5;
    tmpContext.strokeStyle = color;
    tmpContext.shadowBlur = 35;
    tmpContext.shadowColor = color;
    tmpContext.stroke(); */
    } else if (obj.name == "turret") {
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#939393";
        let tmpLen = 50;
        renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();

    } else if (obj.name == "teleporter") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#d76edb";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);

    } else if (obj.name == "platform") {
        tmpContext.fillStyle = "#cebd5f";
        let tmpCount = 4;
        let tmpS = obj.scale * 2;
        let tmpW = tmpS / tmpCount;
        let tmpX = -(obj.scale / 2);
        for (let i = 0; i < tmpCount; ++i) {
            renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
            tmpContext.fill();
            tmpContext.stroke();
            tmpX += tmpS / tmpCount;
        }

    } else if (obj.name == "healing pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);

    } else if (obj.name == "spawn pad") {
        tmpContext.fillStyle = "#7e7f82";
        renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = "#71aad6";
        renderCircle(0, 0, obj.scale * 0.6, tmpContext);

    } else if (obj.name == "blocker") {
        tmpContext.fillStyle = "#7e7f82";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.rotate(Math.PI / 4);
        tmpContext.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);

    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale, tmpContext);
        tmpContext.fillStyle = "#c9b758";
        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
        tmpContext.fillStyle = "#a5974c";
        renderCircle(0, 0, obj.scale * 0.5, tmpContext);

    } else if (obj.name == "pit trap") {
        tmpContext.fillStyle = "#a5974c";
        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
        tmpContext.fill();
        tmpContext.stroke();
        tmpContext.fillStyle = outlineColor;
        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
        tmpContext.fill();
    }

    tmpContext.restore();
}

function renderPlaceCool(xOffset, yOffset) {
    for (let obj of canPlacess) {
        mainContext.save();
        mainContext.globalAlpha = 0.6;
        mainContext.translate(obj.x - xOffset, obj.y - yOffset);
        coolNeonPlace(obj, mainContext, 0, 0);
        mainContext.shadowBlur = 15;
        mainContext.shadowColor = "black";
        mainContext.restore();
    }
}

/* function angleCircle(obj, ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffa500";
    ctx.lineWidth = 2;
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffa500";
    ctx.arc(0, 0, obj.scale, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
} */

// FOR RENDER TRAP AND SPIKE BUT ME NO LIKE IS NOW:
/* function preshit(obj, ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    const isSpike = obj.name.includes("spike");
    const isTrap = obj.name === "pit trap";
    const color = isSpike ? "#ff6262" : isTrap ? "#62ffff" : "#ffffff";

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = color;

    ctx.shadowColor = color;
    ctx.shadowBlur = obj.scale * 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, obj.scale, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
} */

// RENDER MINIMAP:
class MapPing {
    constructor(color, scale) {
        this.init = function (x, y) {
            this.scale = 0;
            this.x = x;
            this.y = y;
            this.active = true;
        };
        this.update = function (ctxt, delta) {
            if (this.active) {
                this.scale += delta * 0.05;
                if (this.scale >= scale) {
                    this.active = false;
                } else {
                    ctxt.globalAlpha = 1 - Math.max(0, this.scale / scale);
                    ctxt.beginPath();
                    ctxt.arc(this.x / config.mapScale * mapDisplay.width, this.y / config.mapScale * mapDisplay.width, this.scale, 0, Math.PI * 2);
                    ctxt.stroke();
                }
            }
        };
        this.color = color;
    }
}
function pingMap(x, y) {
    tmpPing = mapPings.find(pings => !pings.active);
    if (!tmpPing) {
        tmpPing = new MapPing("#fff", config.mapPingScale);
        mapPings.push(tmpPing);
    }
    tmpPing.init(x, y);
}
function updateMapMarker() {
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}

/* function renderBlocks(obj, nearbyMap) {
    const tmpX = obj.x / config.mapScale * mapDisplay.width;
    const tmpY = obj.y / config.mapScale * mapDisplay.height;

    if (obj.type >= 0 && obj.type <= 2) {
        const cluster = nearbyMap.get(obj);
        if (!cluster || cluster.length === 0) return;
    }

    if (obj.type === 3) {
        mainContext.save();
        mapContext.fillStyle = "#ffee33";
        renderCircle(tmpX, tmpY, 3, mapContext, true);
        mainContext.restore();
        return;
    }

    switch (obj.type) {
        case 0:
            mainContext.save();
            mapContext.fillStyle = obj.y >= config.mapScale - config.snowBiomeTop ? "#6a64af" : "#8ecc51";
            renderCircle(tmpX, tmpY, 4, mapContext, true);
            mainContext.restore();
            break;
        case 1:
            mainContext.save();
            mapContext.fillStyle = "#ff3333";
            renderCircle(tmpX, tmpY, 3.5, mapContext, true);
            mainContext.restore();
            break;
        case 2:
            mainContext.save();
            mapContext.fillStyle = "#7f7f7f";
            renderCircle(tmpX, tmpY, 3.5, mapContext, true);
            mainContext.restore();
            break;
    }
} */
function renderMinimap(delta, volcanoBoss) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

        // RENDER PINGS:
        mapContext.lineWidth = 4;
        for (let i = 0; i < mapPings.length; ++i) {
            tmpPing = mapPings[i];
            mapContext.strokeStyle = tmpPing.color;
            tmpPing.update(mapContext, delta);
        }

        /*         const NEARBY_DIST_SQ = 200 * 200;
    const nearbyMap = new Map();
    const clusterObjs = gameObjects.filter(o => o.type >= 0 && o.type <= 2);
    for (let i = 0; i < clusterObjs.length; i++) {
        const objA = clusterObjs[i];
        for (let j = i + 1; j < clusterObjs.length; j++) {
            const objB = clusterObjs[j];
            const dx = objA.x - objB.x;
            const dy = objA.y - objB.y;
            if (dx * dx + dy * dy <= NEARBY_DIST_SQ) {
                if (!nearbyMap.has(objA)) nearbyMap.set(objA, []);
                if (!nearbyMap.has(objB)) nearbyMap.set(objB, []);
                nearbyMap.get(objA).push(objB);
                nearbyMap.get(objB).push(objA);
            }
        }
    }
    for (let obj of gameObjects) {
        if (obj.type >= 0 && obj.type <= 2 && (!nearbyMap.has(obj) || nearbyMap.get(obj).length === 0)) continue;
        renderBlocks(obj, nearbyMap);
    } */

        // DEATH LOCATION:
        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", lastDeath.x / config.mapScale * mapDisplay.width, lastDeath.y / config.mapScale * mapDisplay.height);
        }

        // RENDER BOTS:
        if (bots.length) {
            bots.forEach(tmp => {
                if (tmp.inGame) {
                    mapContext.globalAlpha = 1;
                    mapContext.strokeStyle = "#fff";
                    renderCircle(tmp.x2 / config.mapScale * mapDisplay.width, tmp.y2 / config.mapScale * mapDisplay.height, 7, mapContext, false, true);
                }
            });
        }

        // MAP MARKER:
        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("o", mapMarker.x / config.mapScale * mapDisplay.width, mapMarker.y / config.mapScale * mapDisplay.height);
        }
        const yScaleFactor = mapDisplay.height / 14400;
        const xScaleFactor = mapDisplay.width / 14400;

        // VOLCANO:
        mapContext.globalAlpha = 1;
        mapContext.beginPath();
        mapContext.fillStyle = "#7f7f7f";
        mapContext.strokeStyle = "#4a4a4a";
        mapContext.lineWidth = 4;
        mapContext.arc(xScaleFactor * 13960, yScaleFactor * 13960, config.volcanoScale * xScaleFactor + 1.5, 0, Math.PI * 2);
        mapContext.fill();
        mapContext.stroke();
        mapContext.beginPath();
        mapContext.fillStyle = "#F54E16";
        mapContext.strokeStyle = "#2b2b2b";
        mapContext.lineWidth = 3;
        mapContext.arc(xScaleFactor * 13960, yScaleFactor * 13960, config.volcanoScale * xScaleFactor, 0, Math.PI * 2);
        mapContext.fill();
        mapContext.stroke();

        // BOSS ARENA:
        mapContext.globalAlpha = 1;
        function dot(x, y) {
            mapContext.beginPath();
            mapContext.arc(x * xScaleFactor, y * yScaleFactor, 1.5, 0, Math.PI * 2);
            mapContext.fillStyle = "#7f7f7f";
            mapContext.strokeStyle = "#4a4a4a";
            mapContext.lineWidth = 2;
            mapContext.fill();
            mapContext.stroke();
        }
        dot(6364.3, 13285);
        dot(6364.3, 13115);
        dot(6398.5, 12948.5);
        dot(6398.5, 13451.5);
        dot(6465.5, 12792.3);
        dot(6685.8, 12535.7);
        dot(6562.6, 12652.8);
        dot(6465.5, 13607.7);
        dot(6562.6, 13747.2);
        dot(6685.8, 13864.3);
        dot(6830.1, 13954.2);
        dot(6989.5, 14013.2);
        dot(7157.5, 14038.9);
        dot(7971.9, 12868.7);
        dot(8022.8, 13030.9);
        dot(8208, 13200);
        dot(7872, 13200);
        dot(8022.8, 13369.1);
        dot(7889.4, 13679.9);
        dot(7971.9, 13531.3);
        dot(7778.7, 13808.8);
        dot(7491.7, 13987.7);
        dot(7644.3, 13912.9);
        dot(7327.2, 14030.3);
        dot(6830.1, 12445.8);
        dot(6989.5, 12386.8);
        dot(7157.5, 12361.1);
        dot(7327.2, 12369.7);
        dot(7491.7, 12412.3);
        dot(7644.3, 12487.1);
        dot(7778.7, 12591.2);
        dot(7889.4, 12720.1);

        // RENDER PLAYERS
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#ffffff";
        renderCircle(player.x / config.mapScale * mapDisplay.width, player.y / config.mapScale * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255,255,255,0.35)";
        if (player.team && minimapData) {
            for (let i = 0; i < minimapData.length;) {
                renderCircle(minimapData[i] / config.mapScale * mapDisplay.width, minimapData[i + 1] / config.mapScale * mapDisplay.height, 7, mapContext, true);
                i += 2;
            }
        }
    }
}

// ICONS:
let crossHairs = ["", ""];
let crossHairSprites = {};
let iconSprites = {};
let icons = ["crown", "skull"];
function loadIcons() {
    for (let i = 0; i < icons.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        };
        tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
        iconSprites[icons[i]] = tmpSprite;
    }
    for (let i = 0; i < crossHairs.length; ++i) {
        let tmpSprite = new Image();
        tmpSprite.onload = function () {
            this.isLoaded = true;
        };
        tmpSprite.src = crossHairs[i];
        crossHairSprites[i] = tmpSprite;
    }
}
loadIcons();
function cdf(e, t) {
    try {
        return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
    } catch (e) {
        return Infinity;
    }
}

// UIS:
const gameUI = document.getElementById("gameUI");
const mainContainer = document.createElement("div");
mainContainer.id = "menuformenusaeaeae";
mainContainer.style.cssText = `
    position: fixed;
    left: 20px;
    top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
`;

// ENEMY DATA MENU:
var datatitle;
class DataMenu {
    static init() {
        datatitle = document.createElement("div");
        var mainf = document.createElement("div");
        datatitle.style.cssText = `
            padding: 10px;
            background: rgba(20, 20, 20, 0.2);
            border-radius: 8px;
            width: 200px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: top;
            overflow: hidden;
        `;
        const title = document.createElement("div");
        title.id = "helpText";
        title.textContent = "Enemy Data";
        title.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            cursor: pointer;
            user-select: none;
        `;
        mainf.style.cssText = `
            font-size: 14px;
            color: rgb(255, 255, 255);
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: top;
        `;
        datatitle.appendChild(title);
        datatitle.appendChild(mainf);
        title.addEventListener("click", () => toggleDataMenu());
        return {
            add: function (e) {
                let object = document.createElement(e.tag || `span`);
                object.id = e.id || ``;
                object.style = e.style || ``;
                object.innerHTML = e.html || ``;
                mainf.appendChild(object);
                return object;
            },
            writeStyle: function (e) {
                datatitle.style.cssText += e;
            },
            contentElement: mainf,
            container: datatitle
        };
    }
}
var datamenu = DataMenu.init();
datamenu.add({
    tag: "div",
    id: "database",
    html: `No Information`
});

// BOTS MENU:
const botMenu = document.createElement("div");
botMenu.id = "botMenu";
botMenu.style.cssText = `
    width: 200px;
    padding: 10px;
    background: rgba(20, 20, 20, 0.2);
    border-radius: 8px;
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
    overflow: hidden;
`;
const botTitle = document.createElement("div");
botTitle.textContent = "Bots Info";
botTitle.style.cssText = `
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
    cursor: pointer;
    user-select: none;
`;
botMenu.appendChild(botTitle);
const botContent = document.createElement("div");
botContent.id = "botContent";
botContent.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
`;
const weaponDiv = document.createElement("div");
weaponDiv.id = "botWeaponType";
botContent.appendChild(weaponDiv);
const countDiv = document.createElement("div");
countDiv.id = "botCount";
botContent.appendChild(countDiv);
const moveDiv = document.createElement("div");
moveDiv.id = "moveType";
botContent.appendChild(moveDiv);
const gatherDiv = document.createElement("div");
gatherDiv.id = "gather";
botContent.appendChild(gatherDiv);
const dwdw = document.createElement("div");
dwdw.id = "distance";
botContent.appendChild(dwdw);
const dwdwdwd = document.createElement("div");
dwdwdwd.id = "assassin";
botContent.appendChild(dwdwdwd);
const dwdwdw = document.createElement("div");
dwdwdw.id = "botType";
botContent.appendChild(dwdwdw);
botMenu.appendChild(botContent);
botTitle.addEventListener("click", () => toggleBotMenu());

// STATUS MENU:
const statsMenu = document.createElement("div");
statsMenu.id = "statsMenu";
statsMenu.style.cssText = `
    width: 200px;
    padding: 10px;
    background: rgba(20, 20, 20, 0.2);
    border-radius: 8px;
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
`;
const statsTitle = document.createElement("div");
statsTitle.textContent = "Stats";
statsTitle.style.cssText = `
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 4px;
`;
statsMenu.appendChild(statsTitle);

// Gold per sec
const ppsDisplay = document.createElement("div");
ppsDisplay.id = "ppsDisplay";
ppsDisplay.style.cssText = `
    padding: 6px 10px;
    background: rgba(40, 40, 40, 0.25);
    border-radius: 6px;
    text-align: center;
    color: #fff;
    order: 1;
`;
ppsDisplay.textContent = `Gold per sec: 0`;

// XP Container
const xpContainer = document.createElement("div");
xpContainer.style.cssText = `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    order: 2;
`;
function createProgressBar(id, label) {
    const container = document.createElement("div");
    container.id = id + "Container";
    container.style.cssText = `
        padding: 4px;
        background: rgba(40, 40, 40, 0.25);
        border-radius: 6px;
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: top;
    `;
    const labelDiv = document.createElement("div");
    labelDiv.style.cssText = `
        font-size: 11px;
        margin-bottom: 4px;
        text-align: center;
        opacity: 0.8;
    `;
    labelDiv.textContent = label;
    const progressBarBg = document.createElement("div");
    progressBarBg.style.cssText = `
        position: relative;
        width: 100%;
        height: 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        overflow: hidden;
    `;
    const progressBarFill = document.createElement("div");
    progressBarFill.id = id + "Fill";
    progressBarFill.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0%;
        background: #ccc;
        border-radius: 4px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                    background 0.3s ease,
                    box-shadow 0.3s ease;
        box-shadow: 0 0 8px rgba(204, 204, 204, 0.6);
    `;
    const progressText = document.createElement("div");
    progressText.id = id + "Text";
    progressText.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 11px;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        white-space: nowrap;
        max-width: calc(100% - 4px);
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 1;
    `;
    progressText.textContent = "0";
    progressBarBg.appendChild(progressBarFill);
    progressBarBg.appendChild(progressText);
    container.appendChild(labelDiv);
    container.appendChild(progressBarBg);
    return {
        element: container,
        fill: progressBarFill,
        text: progressText
    };
}
const priXPBar = createProgressBar("priXP", "PRIMARY");
const secXPBar = createProgressBar("secXP", "SECONDARY");
xpContainer.appendChild(priXPBar.element);
xpContainer.appendChild(secXPBar.element);
statsMenu.appendChild(ppsDisplay);
statsMenu.appendChild(xpContainer);
mainContainer.appendChild(datatitle);
mainContainer.appendChild(botMenu);
mainContainer.appendChild(statsMenu);
gameUI.appendChild(mainContainer);
let dataMenuOpen = true;
let botMenuOpen = true;
function toggleDataMenu() {
    dataMenuOpen = !dataMenuOpen;
    const content = datamenu.contentElement;
    const container = datamenu.container;
    if (dataMenuOpen) {
        container.style.pointerEvents = "auto";
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.transform = "scaleY(0)";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = "1";
                content.style.transform = "scaleY(1)";
            });
        });
        setTimeout(() => {
            if (dataMenuOpen) {
                content.style.maxHeight = "none";
            }
        }, 300);
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        requestAnimationFrame(() => {
            content.style.maxHeight = "0";
            content.style.opacity = "0";
            content.style.transform = "scaleY(0)";
        });
        setTimeout(() => {
            if (!dataMenuOpen) {
                container.style.pointerEvents = "none";
            }
        }, 300);
    }
}
function toggleBotMenu() {
    botMenuOpen = !botMenuOpen;
    const content = botContent;
    if (botMenuOpen) {
        botMenu.style.pointerEvents = "auto";
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.transform = "scaleY(0)";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = "1";
                content.style.transform = "scaleY(1)";
            });
        });
        setTimeout(() => {
            if (botMenuOpen) {
                content.style.maxHeight = "none";
            }
        }, 300);
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        requestAnimationFrame(() => {
            content.style.maxHeight = "0";
            content.style.opacity = "0";
            content.style.transform = "scaleY(0)";
        });
        setTimeout(() => {
            if (!botMenuOpen) {
                botMenu.style.pointerEvents = "none";
            }
        }, 300);
    }
}
datamenu.contentElement.style.transformOrigin = "top";
botContent.style.transformOrigin = "top";

// XP PROGRESS BARS:
const colors = ["#ccc", "#f7cf45", "#86b5ff", "#ff716f"];
const priArrToMax = [8];
const secArrToMax = [9, 11, 12, 13, 14, 15];
let priCloseProgress = false;
let secCloseProgress = false;
let priMaxTimer = null;
let secMaxTimer = null;
let priPrevXP = 0;
let secPrevXP = 0;
function toggleProgressBar(container, show) {
    if (show) {
        container.style.maxHeight = "0px";
        container.style.opacity = "0";
        container.style.transform = "scaleY(0)";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                container.style.maxHeight = container.scrollHeight + "px";
                container.style.opacity = "1";
                container.style.transform = "scaleY(1)";
            });
        });
        setTimeout(() => {
            container.style.maxHeight = "none";
        }, 300);
    } else {
        container.style.maxHeight = container.scrollHeight + "px";
        requestAnimationFrame(() => {
            container.style.maxHeight = "0";
            container.style.opacity = "0";
            container.style.transform = "scaleY(0)";
        });
    }
}
function updateProgressBar(bar, xp, isPrimary) {
    const variant = isPrimary ? player?.primaryVariant || 0 : player?.secondaryVariant || 0;
    const weaponIndex = isPrimary ? player?.weapons[0] || 0 : player?.weapons[1] || 0;
    const maxArray = isPrimary ? priArrToMax : secArrToMax;
    const isMaxWeapon = maxArray.includes(weaponIndex);
    if (isMaxWeapon) {
        const colorIndex = Math.min(variant, 3);
        const color = colors[colorIndex];
        bar.fill.style.width = "100%";
        bar.fill.style.background = color;
        bar.fill.style.boxShadow = `0 0 12px ${color}`;
        bar.text.textContent = "Can't Upgrade";
        return;
    }
    let procents = 0;
    let valueColor = 0;
    let closeProgress = false;
    if (xp >= 12000) {
        closeProgress = true;
        procents = 100;
        valueColor = 3;
    } else if (xp >= 7000) {
        procents = (xp - 7000) / 5000 * 100;
        valueColor = 2;
    } else if (xp >= 3000) {
        procents = (xp - 3000) / 4000 * 100;
        valueColor = 1;
    } else {
        procents = xp / 3000 * 100;
        valueColor = 0;
    }
    const color = colors[valueColor];
    bar.fill.style.width = procents + "%";
    bar.fill.style.background = color;
    bar.fill.style.boxShadow = `0 0 12px ${color}`;
    bar.text.textContent = closeProgress ? "MAX" : Math.floor(xp).toString();
    if (isPrimary) {
        /*
if (xp < priPrevXP && priCloseProgress) {
    priCloseProgress = false;
    if (priMaxTimer) clearTimeout(priMaxTimer);
    toggleProgressBar(bar.element, true);
}
  if (closeProgress && !priCloseProgress) {
    priCloseProgress = true;
    priMaxTimer = setTimeout(() => {
        toggleProgressBar(bar.element, false);
    }, 10000);
}
*/

        priPrevXP = xp;
    } else {
        /*
if (xp < secPrevXP && secCloseProgress) {
    secCloseProgress = false;
    if (secMaxTimer) clearTimeout(secMaxTimer);
    toggleProgressBar(bar.element, true);
}
  if (closeProgress && !secCloseProgress) {
    secCloseProgress = true;
    secMaxTimer = setTimeout(() => {
        toggleProgressBar(bar.element, false);
    }, 10000);
}
*/

        secPrevXP = xp;
    }
}
function updateBotMenu() {
    countDiv.textContent = "count: " + (getBotCount() || "none");
    weaponDiv.textContent = "weapon: " + (configs.botWeaponType || "Age tool");
    moveDiv.textContent = "move: " + (configs.botMovementMode || "none");
    dwdw.textContent = "distance move: " + configs.distToTT;
    dwdwdwd.textContent = "Hat: " + configs.botHatsMode;
    let showings = "";
    if (followType === 0) {
        showings = "wood";
    } else if (followType === 1) {
        showings = "food";
    } else if (followType === 2) {
        showings = "stone";
    } else if (followType === 3) {
        showings = "gold";
    }
    gatherDiv.textContent = "gatherType: " + (showings || "none");
    //if (config?.isNormal) dwdwdw.textContent = "bottype: " + (typeBotNormal || "none");
}

function drawPathLine() {
    if (!autoPilot || path.length < 2) return;

    mainContext.save();
    mainContext.lineWidth = 4;
    mainContext.strokeStyle = "white";
    mainContext.beginPath();

    for (let i = 0; i < path.length; i++) {
        const node = path[i];

        const x = node.x - player.x + player.x2;
        const y = node.y - player.y + player.y2;

        if (i === 0) mainContext.moveTo(x, y);
        else mainContext.lineTo(x, y);
    }

    mainContext.stroke();
    mainContext.restore();
}


if (!window.predictionLine) {
    window.predictionLine = {
        points: [],
        points2: [],
        numPoints: 20,
        initialized: false
    };
}

function updateFindSpikeHitsRender(mainContext, xOffset, yOffset) {
    if (!player || !enemy.length || !near) return;

    const predLine = window.predictionLine;
    const nearX = near.x2;
    const nearY = near.y2;
    const playerX = player.x2;
    const playerY = player.y2;
    const nearScale = near.scale || 35;

    let enemyVelX = 0;
    let enemyVelY = 0;
    if (near.oldPos?.x2 != null && near.oldPos?.y2 != null) {
        enemyVelX = nearX - near.oldPos.x2;
        enemyVelY = nearY - near.oldPos.y2;
    }

    const predictedX = nearX + enemyVelX * 10;
    const predictedY = nearY + enemyVelY * 10;

    let hasSpike = false;
    let targetSpikes = [];
    let knockbackX = 0;
    let knockbackY = 0;

    const weapon = items.weapons[player.weapons[0]];
    const weaponRange = weapon?.range || 0;
    const canHitEnemy = near.dist2 <= weaponRange + nearScale * 1.8;

    if (canHitEnemy && player.reloads?.[player.weapons[0]] === 0) {
        const knockDir = Math.atan2(nearY - playerY, nearX - playerX);
        const knockDistance = (0.3 + (weapon?.knock || 0)) * 200;

        knockbackX = nearX + Math.cos(knockDir) * knockDistance;
        knockbackY = nearY + Math.sin(knockDir) * knockDistance;

        const playerToEnemy = UTILS.getDistance(playerX, playerY, nearX, nearY);

        const allMySpikes = gameObjects.filter(obj => {
            if (!obj.active || !obj.dmg) return false;
            if (obj.owner?.sid !== player.sid && !isAlly(obj.owner?.sid)) return false;

            const dirToSpike = Math.atan2(obj.y - nearY, obj.x - nearX);
            if (UTILS.getAngleDist(knockDir, dirToSpike) > 1.05) return false;

            if (UTILS.getDistance(playerX, playerY, obj.x, obj.y) <= playerToEnemy - 20) return false;

            const distToKnockback = UTILS.getDistance(obj.x, obj.y, knockbackX, knockbackY);
            return distToKnockback <= obj.scale * 3.5 + nearScale * 2;
        });

        if (allMySpikes.length >= 2) {
            let bestPair = null;
            let bestScore = Infinity;

            for (let i = 0; i < allMySpikes.length; i++) {
                const spike1 = allMySpikes[i];
                for (let j = i + 1; j < allMySpikes.length; j++) {
                    const spike2 = allMySpikes[j];

                    const distBetween = UTILS.getDistance(spike1.x, spike1.y, spike2.x, spike2.y);
                    if (distBetween < 20 || distBetween > nearScale * 5) continue;

                    const dx = spike2.x - spike1.x;
                    const dy = spike2.y - spike1.y;
                    const lenSq = dx * dx + dy * dy;

                    let t = ((knockbackX - spike1.x) * dx + (knockbackY - spike1.y) * dy) / lenSq;
                    t = Math.max(0, Math.min(1, t));

                    const closestX = spike1.x + t * dx;
                    const closestY = spike1.y + t * dy;
                    const distToLine = UTILS.getDistance(knockbackX, knockbackY, closestX, closestY);

                    const hitRadius = Math.max(spike1.scale, spike2.scale) + nearScale + 15;
                    if (distToLine > hitRadius || t < 0.15 || t > 0.85) continue;

                    const dist1 = UTILS.getDistance(spike1.x, spike1.y, knockbackX, knockbackY);
                    const dist2 = UTILS.getDistance(spike2.x, spike2.y, knockbackX, knockbackY);
                    const maxHitDist = Math.max(spike1.scale, spike2.scale) * 2.5 + nearScale;
                    if (dist1 > maxHitDist || dist2 > maxHitDist) continue;

                    const centerX = (spike1.x + spike2.x) / 2;
                    const centerY = (spike1.y + spike2.y) / 2;
                    const dirToCenter = Math.atan2(centerY - nearY, centerX - nearX);
                    const angleToCenter = UTILS.getAngleDist(knockDir, dirToCenter);
                    if (angleToCenter > 0.785) continue;

                    const score = dist1 + dist2 + distToLine * 2 + angleToCenter * 100;
                    if (score < bestScore) {
                        bestScore = score;
                        bestPair = [spike1, spike2];
                    }
                }
            }

            if (bestPair) {
                targetSpikes = bestPair;
                hasSpike = true;
            }
        }

        if (!hasSpike && allMySpikes.length > 0) {
            const closest = allMySpikes.reduce((a, b) =>
                UTILS.getDistance(a.x, a.y, knockbackX, knockbackY) <
                    UTILS.getDistance(b.x, b.y, knockbackX, knockbackY) ? a : b
            );

            const dirToSpike = Math.atan2(closest.y - nearY, closest.x - nearX);
            if (UTILS.getAngleDist(knockDir, dirToSpike) <= 0.785) {
                const dist = UTILS.getDistance(closest.x, closest.y, knockbackX, knockbackY);
                if (dist <= closest.scale + nearScale + 15) {
                    targetSpikes = [closest];
                    hasSpike = true;
                }
            }
        }
    }

    const hasTwoSpikes = targetSpikes.length === 2;
    const targetX = hasSpike ? targetSpikes[0].x : predictedX;
    const targetY = hasSpike ? targetSpikes[0].y : predictedY;
    const targetX2 = hasTwoSpikes ? targetSpikes[1].x : 0;
    const targetY2 = hasTwoSpikes ? targetSpikes[1].y : 0;

    let curve1X = 0, curve1Y = 0, curve2X = 0, curve2Y = 0;

    if (hasTwoSpikes) {
        const centerX = (targetX + targetX2) / 2;
        const centerY = (targetY + targetY2) / 2;
        const dirToCenter = Math.atan2(centerY - nearY, centerX - nearX);
        const perpAngle1 = dirToCenter - Math.PI / 2;
        const perpAngle2 = dirToCenter + Math.PI / 2;
        const curveStrength = 35;
        curve1X = Math.cos(perpAngle1) * curveStrength;
        curve1Y = Math.sin(perpAngle1) * curveStrength;
        curve2X = Math.cos(perpAngle2) * curveStrength;
        curve2Y = Math.sin(perpAngle2) * curveStrength;
    }

    const numPoints = predLine.numPoints;
    if (!predLine.initialized || predLine.points.length !== numPoints) {
        predLine.points = Array.from({ length: numPoints }, (_, i) => {
            const t = i / (numPoints - 1);
            return { x: nearX + (targetX - nearX) * t, y: nearY + (targetY - nearY) * t };
        });
        predLine.initialized = true;
    }

    if (hasTwoSpikes && predLine.points2.length !== numPoints) {
        predLine.points2 = Array.from({ length: numPoints }, (_, i) => {
            const t = i / (numPoints - 1);
            return { x: nearX + (targetX2 - nearX) * t, y: nearY + (targetY2 - nearY) * t };
        });
    } else if (!hasTwoSpikes) {
        predLine.points2 = [];
    }

    const deltaFactor = Math.min((delta || 16.67) / 16.67, 2);

    const updateLine = (points, tgtX, tgtY, curveX, curveY) => {
        const len = points.length;
        for (let i = 0; i < len; i++) {
            const t = i / (len - 1);
            const mt = 1 - t;
            let goalX, goalY;

            if (hasSpike) {
                const ctrlX = (nearX + tgtX) / 2 + curveX;
                const ctrlY = (nearY + tgtY) / 2 + curveY - 30;
                goalX = mt * mt * nearX + 2 * mt * t * ctrlX + t * t * tgtX;
                goalY = mt * mt * nearY + 2 * mt * t * ctrlY + t * t * tgtY;
            } else {
                goalX = nearX + (tgtX - nearX) * t;
                goalY = nearY + (tgtY - nearY) * t;
            }

            const smooth = (0.15 + (i / len) * 0.2) * deltaFactor;
            points[i].x += (goalX - points[i].x) * smooth;
            points[i].y += (goalY - points[i].y) * smooth;
        }
    };

    updateLine(predLine.points, targetX, targetY, curve1X, curve1Y);
    if (hasTwoSpikes) updateLine(predLine.points2, targetX2, targetY2, curve2X, curve2Y);

    mainContext.save();

    const drawDottedLine = (points, isSecondary) => {
        if (points.length < 2) return;

        const dotRadius = hasSpike ? 3 : 2;
        const dotSpacing = 8;
        const color1 = isSecondary ? "rgba(255, 140, 80, 0.95)" : "rgba(255, 90, 90, 0.95)";
        const color2 = isSecondary ? "rgba(255, 100, 50, 0.6)" : "rgba(255, 60, 60, 0.6)";
        const blueColor1 = "rgba(120, 200, 255, 0.9)";
        const blueColor2 = "rgba(80, 160, 255, 0.5)";

        let totalLength = 0;
        const segments = [];

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i], p2 = points[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            segments.push({ p1, p2, len, startLen: totalLength });
            totalLength += len;
        }

        if (totalLength < 1) return;

        const numDots = Math.floor(totalLength / dotSpacing);

        for (let i = 0; i < numDots; i++) {
            const distance = (i / numDots) * totalLength;
            const t = i / numDots;

            let x = 0, y = 0;
            for (const seg of segments) {
                if (distance >= seg.startLen && distance <= seg.startLen + seg.len) {
                    const localT = (distance - seg.startLen) / seg.len;
                    x = seg.p1.x + (seg.p2.x - seg.p1.x) * localT;
                    y = seg.p1.y + (seg.p2.y - seg.p1.y) * localT;
                    break;
                }
            }

            const sizeMod = Math.sin(t * Math.PI);
            const radius = dotRadius * (0.5 + sizeMod * 0.5);
            const alpha = 0.4 + sizeMod * 0.6;

            const gradient = mainContext.createRadialGradient(
                x - xOffset, y - yOffset, 0,
                x - xOffset, y - yOffset, radius * 1.5
            );

            if (hasSpike) {
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);
            } else {
                gradient.addColorStop(0, blueColor1);
                gradient.addColorStop(1, blueColor2);
            }

            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = gradient;
            mainContext.beginPath();
            mainContext.arc(x - xOffset, y - yOffset, radius * 1.5, 0, Math.PI * 2);
            mainContext.fill();
        }

        mainContext.globalAlpha = 0.3;
        mainContext.strokeStyle = hasSpike ? color2 : blueColor2;
        mainContext.lineWidth = 1.5;
        mainContext.setLineDash([3, 5]);
        mainContext.beginPath();
        mainContext.moveTo(points[0].x - xOffset, points[0].y - yOffset);
        for (let i = 1; i < points.length; i++) {
            mainContext.lineTo(points[i].x - xOffset, points[i].y - yOffset);
        }
        mainContext.stroke();
        mainContext.setLineDash([]);
        mainContext.globalAlpha = 1;
    };

    if (hasSpike && hasTwoSpikes) {
        const s1 = targetSpikes[0], s2 = targetSpikes[1];
        const angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
        const r1 = s1.scale + 10;
        const r2 = s2.scale + 10;

        mainContext.beginPath();
        mainContext.arc(s1.x - xOffset, s1.y - yOffset, r1, angle + Math.PI / 2, angle - Math.PI / 2, false);
        mainContext.arc(s2.x - xOffset, s2.y - yOffset, r2, angle - Math.PI / 2, angle + Math.PI / 2, false);
        mainContext.closePath();

        const capsuleGradient = mainContext.createLinearGradient(
            s1.x - xOffset, s1.y - yOffset,
            s2.x - xOffset, s2.y - yOffset
        );
        capsuleGradient.addColorStop(0, "rgba(255, 80, 80, 0.12)");
        capsuleGradient.addColorStop(0.5, "rgba(255, 50, 50, 0.18)");
        capsuleGradient.addColorStop(1, "rgba(255, 80, 80, 0.12)");

        mainContext.fillStyle = capsuleGradient;
        mainContext.fill();

    } else if (hasSpike && targetSpikes.length === 1) {
        const spike = targetSpikes[0];
        const sx = spike.x - xOffset;
        const sy = spike.y - yOffset;

        const circleGradient = mainContext.createRadialGradient(sx, sy, 0, sx, sy, spike.scale + 12);
        circleGradient.addColorStop(0, "rgba(255, 50, 50, 0.15)");
        circleGradient.addColorStop(1, "rgba(255, 50, 50, 0.05)");

        mainContext.fillStyle = circleGradient;
        mainContext.beginPath();
        mainContext.arc(sx, sy, spike.scale + 10, 0, Math.PI * 2);
        mainContext.fill();
    }

    drawDottedLine(predLine.points, false);
    if (hasTwoSpikes) drawDottedLine(predLine.points2, true);

    mainContext.restore();
}


// UPDATE GAME:
function updateGame() {
    if (inGame) {
        if (loopIndex >= loopHats.length) {
            loopIndex = 0;
        } else if (LoopPolice >= policeHats.length) {
            LoopPolice = 0;
        }
    }
    if (gameObjects.length && inGame) {
        gameObjects.forEach(tmp => {
            if (UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) <= 1200) {
                if (!liztobj.includes(tmp)) {
                    liztobj.push(tmp);
                    tmp.render = true;
                }
            } else if (liztobj.includes(tmp)) {
                if (UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                    tmp.render = false;
                    const index = liztobj.indexOf(tmp);
                    if (index > -1) {
                        liztobj.splice(index, 1);
                    }
                }
            } else if (UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                tmp.render = false;
                const index = liztobj.indexOf(tmp);
                if (index > -1) {
                    liztobj.splice(index, 1);
                }
            } else {
                tmp.render = false;
                const index = liztobj.indexOf(tmp);
                if (index > -1) {
                    liztobj.splice(index, 1);
                }
            }
        });
    }
    // RENDER JEKE:
    if (config.resetRender) {
        mainContext.beginPath();
        mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
    mainContext.globalAlpha = 1;

    // MOVE CAMERA:
    if (player) {
        if (false) {
            camX = player.x;
            camY = player.y;
        } else {
            let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
            let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
            let camSpd = Math.min(tmpDist * 0.0045 * delta, tmpDist);
            if (tmpDist > 0.05) {
                camX += camSpd * Math.cos(tmpDir);
                camY += camSpd * Math.sin(tmpDir);
            } else {
                camX = player.x;
                camY = player.y;
            }
        }
    } else {
        camX = config.mapScale / 2 + config.riverWidth;
        camY = config.mapScale / 2;
    }

    // INTERPOLATE PLAYERS AND AI:
    let lastTime = now - 1000 / config.serverUpdateRate;
    let tmpDiff;
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        if (tmpObj && tmpObj.visible) {
            if (tmpObj.forcePos) {
                tmpObj.x = tmpObj.x2;
                tmpObj.y = tmpObj.y2;
                tmpObj.dir = tmpObj.d2;
            } else {
                let total = tmpObj.t2 - tmpObj.t1;
                let fraction = lastTime - tmpObj.t1;
                let ratio = fraction / total;
                let rate = 170;
                tmpObj.dt += delta;
                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                tmpDiff = tmpObj.x2 - tmpObj.x1;
                tmpObj.x = tmpObj.x1 + tmpDiff * tmpRate;
                tmpDiff = tmpObj.y2 - tmpObj.y1;
                tmpObj.y = tmpObj.y1 + tmpDiff * tmpRate;
                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
            }
        }
    }

    // RENDER CORDS:
    let xOffset = camX - maxScreenWidth / 2;
    let yOffset = camY - maxScreenHeight / 2; // RENDER BACKGROUND:
    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth, maxScreenHeight - (config.snowBiomeTop - yOffset));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, config.mapScale - config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, config.mapScale - config.snowBiomeTop - yOffset, maxScreenWidth, maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
    }

    // RENDER WATER AREAS:
    if (!firstSetup) {
        waterMult += waterPlus * config.waveSpeed * delta;
        if (waterMult >= config.waveMax) {
            waterMult = config.waveMax;
            waterPlus = -1;
        } else if (waterMult <= 1) {
            waterMult = waterPlus = 1;
        }
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "#dbc666";
        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
        mainContext.fillStyle = "#91b2db";
        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
    }

    // RENDER DEAD PLAYERS:
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderDeadPlayers(xOffset, yOffset); // RENDER BOTTOM LAYER:
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderGameObjects(-1, xOffset, yOffset); // RENDER PROJECTILES:
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = outlineWidth;
    renderProjectiles(0, xOffset, yOffset); // RENDER PLAYERS:
    renderPlayers(xOffset, yOffset, 0);

    // RENDER AI:
    mainContext.globalAlpha = 1;
    for (let i = 0; i < ais.length; ++i) {
        tmpObj = ais[i];
        if (tmpObj.active && tmpObj.visible) {
            tmpObj.animate(delta);
            mainContext.save();
            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - Math.PI / 2);
            renderAI(tmpObj, mainContext);
            mainContext.restore();
        }
    }

    // RENDER SHITTY KEKEK:
    renderGameObjects(0, xOffset, yOffset);
    renderProjectiles(1, xOffset, yOffset);
    renderGameObjects(1, xOffset, yOffset);
    renderPlayers(xOffset, yOffset, 1);
    renderGameObjects(2, xOffset, yOffset);
    renderGameObjects(3, xOffset, yOffset);
    /*     for (let i = 0; i < gameObjects.length; i++) {
    let shitty = gameObjects[i];
    if (shitty.group !== undefined && shitty.owner?.sid > 0 && shitty.active) {
        mainContext.fillStyle = isAlly(shitty.owner.sid)? "#93d1fa" : "#d38595";
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        mainContext.font = "22px Lilita One";
        mainContext.strokeStyle = "#212123";
        mainContext.strokeText(shitty.owner.sid.toString(), shitty.x - xOffset, shitty.y - yOffset + shitty.scale - 20);
        mainContext.fillText(shitty.owner.sid.toString(), shitty.x - xOffset, shitty.y - yOffset + shitty.scale - 20);
    }
} */
    // MAP BOUNDARIES:
    mainContext.fillStyle = "#000";
    mainContext.globalAlpha = 0.09;
    if (xOffset <= 0) {
        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
    }
    if (config.mapScale - xOffset <= maxScreenWidth) {
        let tmpY = Math.max(0, -yOffset);
        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
    }
    if (yOffset <= 0) {
        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
    }
    if (config.mapScale - yOffset <= maxScreenHeight) {
        let tmpX = Math.max(0, -xOffset);
        let tmpMin = 0;
        if (config.mapScale - xOffset <= maxScreenWidth) {
            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
        }
        mainContext.fillRect(tmpX, config.mapScale - yOffset, maxScreenWidth - tmpX - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
    }

    /*// COOL GHOST PLAYER BY (SLAUGTHERHOUSE AND STARY):
if (player && player.alive) {
    const now = Date.now();
    const prevSmooth = { x: player.smoothX || player.x, y: player.smoothY || player.y };
    const velocity = Math.hypot(player.x - prevSmooth.x, player.y - prevSmooth.y);
    const velocityBuffer = [...(player.velocityBuffer || []).slice(-3), velocity];
    const avgVelocity = velocityBuffer.reduce((a, b) => a + b, 0) / velocityBuffer.length;
    const distance = Math.hypot(player.x - prevSmooth.x, player.y - prevSmooth.y);
    const deltaTime = Math.min(now - (player.lastUpdateTime || now), 50) / 1000;
      player.velocityBuffer = velocityBuffer;
    player.lastUpdateTime = now;
    player.smoothingFactor = Math.max(1, Math.min((player.smoothingFactor || 1) + deltaTime * (distance > 70 ? 2 : -1), 2));
      const dx = player.x - prevSmooth.x;
    const dy = player.y - prevSmooth.y;
    const currentDist = Math.hypot(dx, dy);
    const maxDist = 70 + Math.min(avgVelocity * 0.3, 30);
      if (currentDist > maxDist) {
        const a = Math.atan2(dy, dx);
        const tx = player.x - Math.cos(a) * maxDist;
        const ty = player.y - Math.sin(a) * maxDist;
        const f = Math.min(0.08, 0.01 + (currentDist / maxDist) * 0.02) * player.smoothingFactor;
        player.smoothX = prevSmooth.x + (tx - prevSmooth.x) * f;
        player.smoothY = prevSmooth.y + (ty - prevSmooth.y) * f;
    } else {
        const f = Math.max(0.01, 0.03 - (currentDist / maxDist) * 0.01) * player.smoothingFactor;
        player.smoothX = prevSmooth.x + dx * f;
        player.smoothY = prevSmooth.y + dy * f;
    }
      const predictionScale = 1.55;
    const velX = player.x - player.smoothX;
    const velY = player.y - player.smoothY;
      let ghostX = player.smoothX + velX * predictionScale;
    let ghostY = player.smoothY + velY * predictionScale;
      const ghostPlayer = {
        ...player,
        x: ghostX,
        y: ghostY,
        x2: ghostX,
        y2: ghostY
    };
      if (config && config.skinColors && player.skinIndex != null) {
        ghostPlayer.color = config.skinColors[player.skinIndex];
    }
      mainContext.save();
      mainContext.globalAlpha = 1;
    mainContext.translate(ghostX - xOffset, ghostY - yOffset);
    mainContext.rotate(player.dir + (player.dirPlus || 0));
    mainContext.shadowColor = "transparent";
    mainContext.shadowBlur = 0;
    mainContext.filter = "brightness(1.05) contrast(1.1)";
    renderPlayer(ghostPlayer, mainContext);
    mainContext.filter = "none";
    mainContext.restore();
    mainContext.globalAlpha = 1;
}*/
    renderPlaceCool(xOffset, yOffset);
    if (player && autoQuadSpike) {
        let nearestTeammate;
        for (let i = 0; i < teams.length; i++) {
            let tmp = teams[i];
            if (tmp.sid != player.sid) {
                if (!nearestTeammate || tmp && !friendList.includes(tmp.sid) && tmp.dist2 < nearestTeammate.dist2) {
                    nearestTeammate = tmp;
                }
            }
        }
        if (nearestTeammate) {
            mainContext.globalAlpha = 0.67;
            let dx = nearestTeammate.x - xOffset;
            let dy = nearestTeammate.y - yOffset;
            mainContext.save();
            mainContext.strokeStyle = "#ff0000";
            mainContext.lineWidth = 3;
            renderCircle(dx, dy, 40, mainContext, false, true);
            mainContext.beginPath();
            mainContext.moveTo(dx - 30, dy);
            mainContext.lineTo(dx + 30, dy);
            mainContext.moveTo(dx, dy - 30);
            mainContext.lineTo(dx, dy + 30);
            mainContext.stroke();
            mainContext.restore();
        }
    }

    // RENDER DAY/NIGHT TIME:
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "rgb(0, 0, 70, 0.67)" /* 67 kid keke */;
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

    updateFindSpikeHitsRender(mainContext, xOffset, yOffset);

    //automoveline:
    if (typeof autoMoveAngle === 'number') {
        mainContext.lineWidth = 3;
        mainContext.globalAlpha = 1;
        mainContext.lineCap = "round";
        mainContext.strokeStyle = "#fff";
        mainContext.beginPath();
        mainContext.moveTo(player.x - xOffset, player.y - yOffset);
        mainContext.lineTo(player.x - xOffset + Math.cos(autoMoveAngle) * 100, player.y - yOffset + Math.sin(autoMoveAngle) * 100);
        mainContext.stroke();
    }

    // RENDER PLAYER AND AI UI:
    // NAME:
    mainContext.strokeStyle = darkOutlineColor;
    mainContext.globalAlpha = 1;
    for (let i = 0; i < players.length + ais.length; ++i) {
        tmpObj = players[i] || ais[i - players.length];
        const count = getBotCount();
        if (tmpObj.visible) {
            mainContext.strokeStyle = darkOutlineColor;
            if (tmpObj.skinIndex != 10 || tmpObj === player || tmpObj.team && tmpObj.team === player.team) {
                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || "");
                if (tmpText != "") {
                    mainContext.fillStyle = "white";
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineJoin = "round";
                    if (configs.dName && (!(count >= 0) || !botSIDs.includes(tmpObj.sid))) {
                        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One"; /* OG scale is 30, changed to 23 for smaller and visible namescale */
                        mainContext.fillStyle = "#fff";
                        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                        mainContext.strokeText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY); /* * 0.6 to basically uhh put it up ( 0.6 is the perfect one for me ) */
                        mainContext.fillText(tmpText, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                    }
                    if (configs.dShame && (!(count >= 0) || !botSIDs.includes(tmpObj.sid))) {
                        let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || "");
                        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                        //mainContext.fillStyle = "white";
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? (tmpObj.nameScale || 30) * 2.75 : tmpObj.nameScale || 30);
                        mainContext.strokeText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                        mainContext.fillText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                    }

                    // UNDER TEXT:
                    if (tmpObj && configs.playerInfo && (!(count >= 0) || !botSIDs.includes(tmpObj.sid))) {
                        let underY = tmpObj.y - yOffset + tmpObj.scale + config.nameY + 35;
                        mainContext.globalAlpha = 1;
                        mainContext.font = tmpObj == player ? "18px Hammersmith One" : "20px Hammersmith One";
                        //mainContext.fillStyle = "#fff";
                        mainContext.textBaseline = "top";
                        mainContext.lineWidth = 8;
                        let text;
                        if (tmpObj == player) {
                            const infoArr = [player.empAnti, player.soldierAnti, player.latestSkin, player.latestTail];
                            text = `[${infoArr.join(", ")}]`;
                        } else {
                            text = `[${tmpObj.skinIndex}, ${tmpObj.tailIndex || 0}, ${tmpObj.damageThreat}]`;
                        }
                        mainContext.strokeText(text, tmpObj.x - xOffset, underY);
                        mainContext.fillText(text, tmpObj.x - xOffset, underY);
                    }

                    // SID:
                    if (configs.dSid && tmpObj.isPlayer) {
                        mainContext.font = "20px Hammersmith One";
                        //mainContext.fillStyle = "#fff";
                        mainContext.textBaseline = "middle";
                        mainContext.lineWidth = 5;
                        mainContext.strokeText(tmpObj.sid, tmpObj.x - xOffset, tmpObj.y - yOffset);
                        mainContext.fillText(tmpObj.sid, tmpObj.x - xOffset, tmpObj.y - yOffset);
                    }

                    // ICONS:
                    if (configs.iconsRea_l) {
                        if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
                            let tmpS = config.crownIconScale;
                            let tmpX = tmpObj.x - xOffset - tmpS / 2 - mainContext.measureText(tmpText).width / 2 - config.crownPad;
                            mainContext.drawImage(iconSprites.crown, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY - tmpS / 2 - 5, tmpS, tmpS);
                        }
                        if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
                            let tmpS = config.crownIconScale;
                            let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad;
                            mainContext.drawImage(iconSprites.skull, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY - tmpS / 2 - 5, tmpS, tmpS);
                        }
                        if (tmpObj.isPlayer && instaC.wait && near === tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length) {
                            let tmpS = tmpObj.scale * 2.2;
                            mainContext.drawImage(tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0], tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                        }
                    }
                }
                if (tmpObj.isPlayer && configs.reloadBars && (!(count >= 0) || !botSIDs.includes(tmpObj.sid))) {
                    let reloads = {
                        primary: tmpObj.primaryIndex == undefined ? 1 : (items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed,
                        secondary: tmpObj.secondaryIndex == undefined ? 1 : (items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed,
                        turret: (2500 - tmpObj.reloads[53]) / 2500
                    };
                    if (configs.secondaryReloadBar) {
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13, config.healthBarWidth - 5 + config.healthBarPad * 2, 17, 8);
                        mainContext.fill();
                        const p = Math.min(Math.max(reloads.secondary, 0), 1);
                        const eased = Math.pow(p, 0.85);
                        mainContext.fillStyle = p >= 0.99 ? "#f0f0f0" : `hsl(210, 8%, ${22 + eased * 40}%)`;
                        mainContext.roundRect(tmpObj.x - xOffset + 5, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13 + config.healthBarPad, config.healthBarWidth * reloads.secondary + 1 - 5, 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                    }
                    if (configs.primaryReloadBar) {
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13, config.healthBarWidth + config.healthBarPad * 2 - 5, 17, 8);
                        mainContext.fill();
                        const p = Math.min(Math.max(reloads.primary, 0), 1);
                        const eased = Math.pow(p, 0.85);
                        mainContext.fillStyle = p >= 0.99 ? "#f0f0f0" : `hsl(210, 8%, ${22 + eased * 40}%)`;
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 13 + config.healthBarPad, config.healthBarWidth * reloads.primary + 1 - 5, 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                    }
                    if (configs.turretReloadBar) {
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                        mainContext.fill();
                        mainContext.fillStyle = "#a9a9a9";
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth, tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad, config.healthBarWidth * 2 * reloads.turret, 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                    }
                }
                if (tmpObj.health > 0 && configs.dHealth && (!(count >= 0) || !botSIDs.includes(tmpObj.sid))) {
                    const barWidth = configs.opvisualsPlayer ? 50 : config.healthBarWidth * 2;
                    const barHeight = 17;
                    const pad = config.healthBarPad;
                    const y = tmpObj.y - yOffset + tmpObj.scale + config.nameY;

                    mainContext.fillStyle = darkOutlineColor;
                    mainContext.roundRect(tmpObj.x - xOffset - barWidth / 2, y, barWidth, barHeight, 8);
                    mainContext.fill();

                    if (tmpObj === player || tmpObj.team && tmpObj.team === player.team) {
                        mainContext.shadowColor = "#8ecc51";
                        mainContext.shadowBlur = 8;
                        mainContext.fillStyle = "#8ecc51";
                    } else {
                        mainContext.shadowColor = "#cc5151";
                        mainContext.shadowBlur = 8;
                        mainContext.fillStyle = "#cc5151";
                    }

                    mainContext.roundRect(tmpObj.x - xOffset - barWidth / 2, y + pad, barWidth * (tmpObj.health / tmpObj.maxHealth), barHeight - pad * 2, 7);
                    mainContext.fill();
                    mainContext.shadowBlur = 0;

                    if (tmpObj === player && configs.opvisualsPlayer) {
                        mainContext.shadowColor = "#8ecc51";
                        mainContext.shadowBlur = 8;
                        mainContext.fillStyle = "#8ecc51";
                        mainContext.font = "17px Arial";
                        mainContext.textBaseline = "middle";

                        mainContext.textAlign = "right";
                        mainContext.fillText("<<", tmpObj.x - xOffset - barWidth / 2 - 4, y + barHeight / 2);

                        mainContext.textAlign = "left";
                        mainContext.fillText(">>", tmpObj.x - xOffset + barWidth / 2 + 4, y + barHeight / 2);
                        mainContext.shadowBlur = 0;
                    }
                }
            }
        }
    }
    mainContext.globalAlpha = 1;
    if (player) {
        if (autoPush.active) {
            mainContext.lineWidth = 4.5;
            mainContext.strokeStyle = "white";
            mainContext.beginPath();
            mainContext.moveTo(player.x2 - xOffset, player.y2 - yOffset);
            mainContext.lineTo(autoPush.data.x2 - xOffset, autoPush.data.y2 - yOffset);
            mainContext.lineTo(autoPush.data.x - xOffset, autoPush.data.y - yOffset);
            mainContext.stroke();
        }
        // PATHFINDER LINE:
        if (omgPathFind || pathFind.active) {
            if (pathFind.array && (packet("9", near.aim2) ? enemy.length : true)) {
                mainContext.lineWidth = player.scale / 5;
                mainContext.globalAlpha = .67;
                mainContext.strokeStyle = pathFind.active ? "purple" : "cyan";
                mainContext.beginPath();
                pathFind.array.forEach((path, i) => {
                    let pathXY = {
                        x: (pathFind.scale / pathFind.grid) * path.x,
                        y: (pathFind.scale / pathFind.grid) * path.y
                    }
                    let render = {
                        x: ((player.x2 - (pathFind.scale / 2)) + pathXY.x) - xOffset,
                        y: ((player.y2 - (pathFind.scale / 2)) + pathXY.y) - yOffset
                    }
                    if (i == 0) {
                        mainContext.moveTo(render.x, render.y);
                    } else {
                        mainContext.lineTo(render.x, render.y);
                    }
                });
                mainContext.stroke();
            }
        }
    }

    // RENDER ANIM TEXTS:
    textManager.update(delta, mainContext, xOffset, yOffset);

    // RENDER CHAT MESSAGES:
    for (let i = 0; i < players.length; ++i) {
        tmpObj = players[i];
        if (tmpObj.visible) {
            if (tmpObj.chatCountdown > 0) {
                tmpObj.chatCountdown -= delta;
                if (tmpObj.chatCountdown <= 0) {
                    tmpObj.chatCountdown = 0;
                }
                mainContext.font = "32px Hammersmith One";
                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let tmpX = tmpObj.x - xOffset;
                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                let tmpH = 47;
                let tmpW = tmpSize.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                mainContext.fill();
                mainContext.fillStyle = "#fff";
                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
            }
            if (tmpObj.chat.count > 0) {
                tmpObj.chat.count -= delta;
                if (tmpObj.chat.count <= 0) {
                    tmpObj.chat.count = 0;
                }
                mainContext.font = "32px Hammersmith One";
                let tmpSize = mainContext.measureText(tmpObj.chat.message);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let tmpX = tmpObj.x - xOffset;
                let tmpY = tmpObj.y - tmpObj.scale - yOffset + 180;
                let tmpH = 47;
                let tmpW = tmpSize.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                mainContext.fill();
                mainContext.fillStyle = "#ffffff99";
                mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
            } else {
                tmpObj.chat.count = 0;
            }
        }
    }
    if (allChats.length) {
        allChats.filter(ch => ch.active).forEach(ch => {
            if (!ch.alive) {
                if (ch.alpha <= 1) {
                    ch.alpha += delta / 250;
                    if (ch.alpha >= 1) {
                        ch.alpha = 1;
                        ch.alive = true;
                    }
                }
            } else {
                ch.alpha -= delta / 5000;
                if (ch.alpha <= 0) {
                    ch.alpha = 0;
                    ch.active = false;
                }
            }
            if (ch.active) {
                mainContext.font = "20px Ubuntu";
                let tmpSize = mainContext.measureText(ch.chat);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let tmpX = ch.x - xOffset;
                let tmpY = ch.y - yOffset - 90;
                let tmpH = 40;
                let tmpW = tmpSize.width + 15;
                mainContext.globalAlpha = ch.alpha;
                mainContext.fillStyle = ch.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
                mainContext.strokeStyle = "rgb(25, 25, 25)";
                mainContext.strokeText(ch.owner.name, tmpX, tmpY - 45);
                mainContext.fillText(ch.owner.name, tmpX, tmpY - 45);
                mainContext.lineWidth = 5;
                mainContext.fillStyle = "#ccc";
                mainContext.strokeStyle = "rgb(25, 25, 25)";
                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                mainContext.stroke();
                mainContext.fill();
                mainContext.fillStyle = "#fff";
                mainContext.strokeStyle = "#000";
                mainContext.strokeText(ch.chat, tmpX, tmpY);
                mainContext.fillText(ch.chat, tmpX, tmpY);
                ch.y -= delta / 100;
            }
        });
    }
    mainContext.globalAlpha = 1;

    // VOLCANO DAMAGE ZONE:
    if (configs.dVolcDamageZone) {
        mainContext.globalAlpha = 1;
        mainContext.beginPath();
        mainContext.lineWidth = 4;
        mainContext.strokeStyle = "rgba(255, 0, 0, 0.5)";
        mainContext.arc(13960 - xOffset, 13960 - yOffset, 1440, Math.PI * 0.901, Math.PI * 1.599);
        mainContext.stroke();
    }

    // VOLC ZONE
    if (configs.dVolcanZone) {
        mainContext.beginPath();
        mainContext.lineWidth = 20;
        mainContext.strokeStyle = "red";
        mainContext.globalAlpha = 0.2;
        mainContext.lineJoin = "round";
        mainContext.lineCap = "round";
        mainContext.moveTo(12400 - xOffset, 12400 - yOffset);
        mainContext.lineTo(14400 - xOffset, 12400 - yOffset);
        mainContext.moveTo(12400 - xOffset, 12400 - yOffset);
        mainContext.lineTo(12400 - xOffset, 14400 - yOffset);
        mainContext.stroke();
        mainContext.closePath();
    }
    if (configs.dVolcFarmZone) {
        mainContext.globalAlpha = 0.18;
        mainContext.fillStyle = "orange";
        mainContext.fillRect(12400 - xOffset, 12400 - yOffset, 1560 - 1440 / Math.sqrt(2), 1560 - 1440 / Math.sqrt(2));
        mainContext.globalAlpha = 1;
    }
    if (configs.dMarks) {
        // CIRCLINGs:
        for (let i = 0; i < gameObjects.length; i++) {
            let e = gameObjects[i];
            let dist = false;
            if (inGame) {
                dist = UTILS.getDistance(player.x, player.y, e.x, e.y) < 1200;
            } else {
                dist = true;
            }
            if (inGame && dist && e.active && e.health > 0 && (configs.marksTypes === "All" ? true : configs.marksTypes === "Team" ? e.isTeamObject(player) : !e.isTeamObject(player))) {
                if (player && e.owner && e.owner.sid == player.sid) {
                    mainContext.fillStyle = "#8ecc51";
                } else if (e.isTeamObject(player)) {
                    mainContext.fillStyle = "#518ecc";
                } else {
                    mainContext.fillStyle = "#cc5151";
                }

                // CIRCLE AND GLOW:
                mainContext.save();
                mainContext.beginPath();
                mainContext.arc(e.x - xOffset, e.y - yOffset, e.scale * 0.35 * configs.markSize, 0, Math.PI * 2);
                mainContext.shadowBlur = 15;
                mainContext.shadowColor = mainContext.fillStyle;
                mainContext.fill();
                mainContext.restore();
                if (configs.markOutline) {
                    mainContext.beginPath();
                    mainContext.arc(e.x - xOffset, e.y - yOffset, e.scale * 0.35 * configs.markSize, 0, Math.PI * 2);
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.lineWidth = 2;
                    mainContext.stroke();
                }
            }
        }
    }

    // RENDER MINIMAP:
    renderMinimap(delta);

    // RENDER CONTROLS:
    if (controllingTouch.id !== -1) renderControl(controllingTouch.startX, controllingTouch.startY, controllingTouch.currentX, controllingTouch.currentY);
    if (attackingTouch.id !== -1) renderControl(attackingTouch.startX, attackingTouch.startY, attackingTouch.currentX, attackingTouch.currentY);
}
// RENDER CONTROL:
function renderControl(startX, startY, currentX, currentY) {
    mainContext.save();
    mainContext.setTransform(1, 0, 0, 1, 0, 0);
    mainContext.scale(pixelDensity, pixelDensity);
    var controlRadius = 50;
    mainContext.beginPath();
    mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
    mainContext.closePath();
    mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
    mainContext.fill();
    var offsetX = currentX - startX;
    var offsetY = currentY - startY;
    var mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    var divisor = mag > controlRadius ? (mag / controlRadius) : 1;
    offsetX /= divisor;
    offsetY /= divisor;
    mainContext.beginPath();
    mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
    mainContext.closePath();
    mainContext.fillStyle = "white";
    mainContext.fill();
    mainContext.restore();
}
// UPDATE & ANIMATE:
window.requestAnimFrame = function () {
    return null;
};
window.rAF = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 9);
    };
}();
function doUpdate() {
    now = performance.now();
    delta = now - lastUpdate;
    lastUpdate = now;
    let timer = performance.now();
    let diff = timer - fpsTimer.last;
    if (diff >= 1000) {
        fpsTimer.ltime = fpsTimer.time * (1000 / diff);
        fpsTimer.last = timer;
        fpsTimer.time = 0;
    }
    fpsTimer.time++;
    updateGame();
    updateBotMenu();
    initAutoplay(player, gameObjects, updateGame);
    window.rAF(doUpdate);
}
prepareMenuBackground();
doUpdate();
window.debug = function () {
    my.waitHit = 0;
    my.autoAim = false;
    instaC.isTrue = false;
    traps.inTrap = false;
    autoPlaceLoop = false;
    itemSprites = [];
    objSprites = [];
    gameObjectSprites = [];
};