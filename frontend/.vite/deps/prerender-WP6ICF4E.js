import {
  K,
  _,
  k,
  l
} from "./chunk-OXECWYFW.js";
import "./chunk-5WRI5ZAA.js";

// node_modules/preact-render-to-string/dist/index.module.js
var r = "diffed";
var o = "__c";
var i = "__s";
var a = "__c";
var c = "__k";
var s = "__d";
var u = "__s";
var l2 = /[\s\n\\/='"\0<>]/;
var f = /^(xlink|xmlns|xml)([A-Z])/;
var p = /^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/;
var h = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/;
var d = /* @__PURE__ */ new Set(["draggable", "spellcheck"]);
function v(e) {
  void 0 !== e.__g ? e.__g |= 8 : e[s] = true;
}
function m(e) {
  void 0 !== e.__g ? e.__g &= -9 : e[s] = false;
}
function _2(e) {
  return void 0 !== e.__g ? !!(8 & e.__g) : true === e[s];
}
var y = /["&<]/;
function g(e) {
  if (0 === e.length || false === y.test(e)) return e;
  for (var t = 0, n = 0, r2 = "", o2 = ""; n < e.length; n++) {
    switch (e.charCodeAt(n)) {
      case 34:
        o2 = "&quot;";
        break;
      case 38:
        o2 = "&amp;";
        break;
      case 60:
        o2 = "&lt;";
        break;
      default:
        continue;
    }
    n !== t && (r2 += e.slice(t, n)), r2 += o2, t = n + 1;
  }
  return n !== t && (r2 += e.slice(t, n)), r2;
}
var b = {};
var x = /* @__PURE__ */ new Set(["animation-iteration-count", "border-image-outset", "border-image-slice", "border-image-width", "box-flex", "box-flex-group", "box-ordinal-group", "column-count", "fill-opacity", "flex", "flex-grow", "flex-negative", "flex-order", "flex-positive", "flex-shrink", "flood-opacity", "font-weight", "grid-column", "grid-row", "line-clamp", "line-height", "opacity", "order", "orphans", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "widows", "z-index", "zoom"]);
var k2 = /[A-Z]/g;
function w(e) {
  var t = "";
  for (var n in e) {
    var r2 = e[n];
    if (null != r2 && "" !== r2) {
      var o2 = "-" == n[0] ? n : b[n] || (b[n] = n.replace(k2, "-$&").toLowerCase()), i2 = ";";
      "number" != typeof r2 || o2.startsWith("--") || x.has(o2) || (i2 = "px;"), t = t + o2 + ":" + r2 + i2;
    }
  }
  return t || void 0;
}
function C() {
  this.__d = true;
}
function A(e, t) {
  return { __v: e, context: t, props: e.props, setState: C, forceUpdate: C, __d: true, __h: new Array(0) };
}
function S(e, t, n) {
  if (!e.s) {
    if (n instanceof L) {
      if (!n.s) return void (n.o = S.bind(null, e, t));
      1 & t && (t = n.s), n = n.v;
    }
    if (n && n.then) return void n.then(S.bind(null, e, t), S.bind(null, e, 2));
    e.s = t, e.v = n;
    const r2 = e.o;
    r2 && r2(e);
  }
}
var L = (function() {
  function e() {
  }
  return e.prototype.then = function(t, n) {
    var r2 = new e(), o2 = this.s;
    if (o2) {
      var i2 = 1 & o2 ? t : n;
      if (i2) {
        try {
          S(r2, 1, i2(this.v));
        } catch (e2) {
          S(r2, 2, e2);
        }
        return r2;
      }
      return this;
    }
    return this.o = function(e2) {
      try {
        var o3 = e2.v;
        1 & e2.s ? S(r2, 1, t ? t(o3) : o3) : n ? S(r2, 1, n(o3)) : S(r2, 2, o3);
      } catch (e3) {
        S(r2, 2, e3);
      }
    }, r2;
  }, e;
})();
function E(e) {
  return e instanceof L && 1 & e.s;
}
function j(e, t, n) {
  for (var r2; ; ) {
    var o2 = e();
    if (E(o2) && (o2 = o2.v), !o2) return i2;
    if (o2.then) {
      r2 = 0;
      break;
    }
    var i2 = n();
    if (i2 && i2.then) {
      if (!E(i2)) {
        r2 = 1;
        break;
      }
      i2 = i2.s;
    }
    if (t) {
      var a2 = t();
      if (a2 && a2.then && !E(a2)) {
        r2 = 2;
        break;
      }
    }
  }
  var c2 = new L(), s2 = S.bind(null, c2, 2);
  return (0 === r2 ? o2.then(l3) : 1 === r2 ? i2.then(u2) : a2.then(f2)).then(void 0, s2), c2;
  function u2(r3) {
    i2 = r3;
    do {
      if (t && (a2 = t()) && a2.then && !E(a2)) return void a2.then(f2).then(void 0, s2);
      if (!(o2 = e()) || E(o2) && !o2.v) return void S(c2, 1, i2);
      if (o2.then) return void o2.then(l3).then(void 0, s2);
      E(i2 = n()) && (i2 = i2.v);
    } while (!i2 || !i2.then);
    i2.then(u2).then(void 0, s2);
  }
  function l3(e2) {
    e2 ? (i2 = n()) && i2.then ? i2.then(u2).then(void 0, s2) : u2(i2) : S(c2, 1, i2);
  }
  function f2() {
    (o2 = e()) ? o2.then ? o2.then(l3).then(void 0, s2) : l3(o2) : S(c2, 1, i2);
  }
}
function T(e, t) {
  try {
    var n = e();
  } catch (e2) {
    return t(true, e2);
  }
  return n && n.then ? n.then(t.bind(null, false), t.bind(null, true)) : t(false, n);
}
var D;
var P;
var $;
var U;
var Z = function(a2, s2) {
  try {
    var u2 = l[i];
    l[i] = true, D = l.__b, P = l[r], $ = l.__r, U = l.unmount;
    var l3 = _(k, null);
    return l3[c] = [a2], Promise.resolve(T(function() {
      return Promise.resolve(O(a2, s2 || F, false, void 0, l3, true, void 0)).then(function(e) {
        var t, n = (function() {
          if (W(e)) {
            var n2 = function() {
              var e2 = o2.join(H);
              return t = 1, e2;
            }, r2 = 0, o2 = e, i2 = j(function() {
              return !!o2.some(function(e2) {
                return e2 && "function" == typeof e2.then;
              }) && r2++ < 25;
            }, void 0, function() {
              return Promise.resolve(Promise.all(o2)).then(function(e2) {
                o2 = e2.flat();
              });
            });
            return i2 && i2.then ? i2.then(n2) : n2();
          }
        })();
        return n && n.then ? n.then(function(n2) {
          return t ? n2 : e;
        }) : t ? n : e;
      });
    }, function(t, n) {
      if (l[o] && l[o](a2, M), l[i] = u2, M.length = 0, t) throw n;
      return n;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var F = {};
var M = [];
var W = Array.isArray;
var z = Object.assign;
var H = "";
var N = "<!--$s-->";
var q = "<!--/$s-->";
function I(e, t) {
  var n, r2 = e.type, o2 = true;
  return e[a] ? (o2 = false, (n = e[a]).state = n[u]) : n = new r2(e.props, t), e[a] = n, n.__v = e, n.props = e.props, n.context = t, v(n), null == n.state && (n.state = F), null == n[u] && (n[u] = n.state), r2.getDerivedStateFromProps ? n.state = z({}, n.state, r2.getDerivedStateFromProps(n.props, n.state)) : o2 && n.componentWillMount ? (n.componentWillMount(), n.state = n[u] !== n.state ? n[u] : n.state) : !o2 && n.componentWillUpdate && n.componentWillUpdate(), $ && $(e), n.render(n.props, n.state, t);
}
function O(t, r2, o2, i2, s2, y2, b2) {
  if (null == t || true === t || false === t || t === H) return H;
  var x2 = typeof t;
  if ("object" != x2) return "function" == x2 ? H : "string" == x2 ? g(t) : t + H;
  if (W(t)) {
    var k3, C2 = H;
    s2[c] = t;
    for (var S2 = t.length, L2 = 0; L2 < S2; L2++) {
      var E2 = t[L2];
      if (null != E2 && "boolean" != typeof E2) {
        var j2, T2 = O(E2, r2, o2, i2, s2, y2, b2);
        "string" == typeof T2 ? C2 += T2 : (k3 || (k3 = new Array(S2)), C2 && k3.push(C2), C2 = H, W(T2) ? (j2 = k3).push.apply(j2, T2) : k3.push(T2));
      }
    }
    return k3 ? (C2 && k3.push(C2), k3) : C2;
  }
  if (void 0 !== t.constructor) return H;
  t.__ = s2, D && D(t);
  var Z2 = t.type, M2 = t.props;
  if ("function" == typeof Z2) {
    var B, V, K2, J = r2;
    if (Z2 === k) {
      if ("tpl" in M2) {
        for (var Q = H, X = 0; X < M2.tpl.length; X++) if (Q += M2.tpl[X], M2.exprs && X < M2.exprs.length) {
          var Y = M2.exprs[X];
          if (null == Y) continue;
          "object" != typeof Y || void 0 !== Y.constructor && !W(Y) ? Q += Y : Q += O(Y, r2, o2, i2, t, y2, b2);
        }
        return Q;
      }
      if ("UNSTABLE_comment" in M2) return "<!--" + g(M2.UNSTABLE_comment) + "-->";
      V = M2.children;
    } else {
      if (null != (B = Z2.contextType)) {
        var ee = r2[B.__c];
        J = ee ? ee.props.value : B.__;
      }
      var te = Z2.prototype && "function" == typeof Z2.prototype.render;
      if (te) V = /**#__NOINLINE__**/
      I(t, J), K2 = t[a];
      else {
        t[a] = K2 = /**#__NOINLINE__**/
        A(t, J);
        for (var ne = 0; _2(K2) && ne++ < 25; ) {
          m(K2), $ && $(t);
          try {
            V = Z2.call(K2, M2, J);
          } catch (e) {
            throw y2 && (t._suspended = true), e;
          }
        }
        v(K2);
      }
      if (null != K2.getChildContext && (r2 = z({}, r2, K2.getChildContext())), te && l.errorBoundaries && (Z2.getDerivedStateFromError || K2.componentDidCatch)) {
        V = null != V && V.type === k && null == V.key && null == V.props.tpl ? V.props.children : V;
        try {
          return O(V, r2, o2, i2, t, y2, false);
        } catch (e) {
          return Z2.getDerivedStateFromError && (K2[u] = Z2.getDerivedStateFromError(e)), K2.componentDidCatch && K2.componentDidCatch(e, F), _2(K2) ? (V = I(t, r2), null != (K2 = t[a]).getChildContext && (r2 = z({}, r2, K2.getChildContext())), O(V = null != V && V.type === k && null == V.key && null == V.props.tpl ? V.props.children : V, r2, o2, i2, t, y2, b2)) : H;
        } finally {
          P && P(t), U && U(t);
        }
      }
    }
    V = null != V && V.type === k && null == V.key && null == V.props.tpl ? V.props.children : V;
    try {
      var re = O(V, r2, o2, i2, t, y2, b2);
      return P && P(t), l.unmount && l.unmount(t), t._suspended ? "string" == typeof re ? N + re + q : W(re) ? (re.unshift(N), re.push(q), re) : re.then(function(e) {
        return N + e + q;
      }) : re;
    } catch (n) {
      if (!y2 && b2 && b2.onError) {
        var oe = b2.onError(n, t, function(e, t2) {
          return O(e, r2, o2, i2, t2, y2, b2);
        });
        if (void 0 !== oe) return oe;
        var ie = l.__e;
        return ie && ie(n, t), H;
      }
      if (!y2) throw n;
      if (!n || "function" != typeof n.then) throw n;
      return n.then(function e() {
        try {
          var n2 = O(V, r2, o2, i2, t, y2, b2);
          return t._suspended ? N + n2 + q : n2;
        } catch (t2) {
          if (!t2 || "function" != typeof t2.then) throw t2;
          return t2.then(e);
        }
      });
    }
  }
  var ae, ce = "<" + Z2, se = H;
  for (var ue in M2) {
    var le = M2[ue];
    if ("function" != typeof (le = G(le) ? le.value : le) || "class" === ue || "className" === ue) {
      switch (ue) {
        case "children":
          ae = le;
          continue;
        case "key":
        case "ref":
        case "__self":
        case "__source":
          continue;
        case "htmlFor":
          if ("for" in M2) continue;
          ue = "for";
          break;
        case "className":
          if ("class" in M2) continue;
          ue = "class";
          break;
        case "defaultChecked":
          ue = "checked";
          break;
        case "defaultSelected":
          ue = "selected";
          break;
        case "defaultValue":
        case "value":
          switch (ue = "value", Z2) {
            case "textarea":
              ae = le;
              continue;
            case "select":
              i2 = le;
              continue;
            case "option":
              i2 != le || "selected" in M2 || (ce += " selected");
          }
          break;
        case "dangerouslySetInnerHTML":
          se = le && le.__html;
          continue;
        case "style":
          "object" == typeof le && (le = w(le));
          break;
        case "acceptCharset":
          ue = "accept-charset";
          break;
        case "httpEquiv":
          ue = "http-equiv";
          break;
        default:
          if (f.test(ue)) ue = ue.replace(f, "$1:$2").toLowerCase();
          else {
            if (l2.test(ue)) continue;
            "-" !== ue[4] && !d.has(ue) || null == le ? o2 ? h.test(ue) && (ue = "panose1" === ue ? "panose-1" : ue.replace(/([A-Z])/g, "-$1").toLowerCase()) : p.test(ue) && (ue = ue.toLowerCase()) : le += H;
          }
      }
      null != le && false !== le && (ce = true === le || le === H ? ce + " " + ue : ce + " " + ue + '="' + ("string" == typeof le ? g(le) : le + H) + '"');
    }
  }
  if (l2.test(Z2)) throw new Error(Z2 + " is not a valid HTML tag name in " + ce + ">");
  if (se || ("string" == typeof ae ? se = g(ae) : null != ae && false !== ae && true !== ae && (se = O(ae, r2, "svg" === Z2 || "foreignObject" !== Z2 && o2, i2, t, y2, b2))), P && P(t), U && U(t), !se && R.has(Z2)) return ce + "/>";
  var fe = "</" + Z2 + ">", pe = ce + ">";
  return W(se) ? [pe].concat(se, [fe]) : "string" != typeof se ? [pe, se, fe] : pe + se + fe;
}
var R = /* @__PURE__ */ new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
function G(e) {
  return null !== e && "object" == typeof e && "function" == typeof e.peek && "value" in e;
}

// node_modules/preact-iso/src/prerender.js
var vnodeHook;
var old = l.vnode;
l.vnode = (vnode) => {
  if (old) old(vnode);
  if (vnodeHook) vnodeHook(vnode);
};
async function prerender(vnode, options) {
  options = options || {};
  const props = options.props;
  if (typeof vnode === "function") {
    vnode = _(vnode, props);
  } else if (props) {
    vnode = K(vnode, props);
  }
  let links = /* @__PURE__ */ new Set();
  vnodeHook = ({ type, props: props2 }) => {
    if (type === "a" && props2 && props2.href && (!props2.target || props2.target === "_self")) {
      links.add(props2.href);
    }
  };
  try {
    let html = await Z(vnode);
    html += `<script type="isodata"><\/script>`;
    return { html, links };
  } finally {
    vnodeHook = null;
  }
}
function locationStub(path) {
  globalThis.location = {};
  const u2 = new URL(path, "http://localhost");
  for (const i2 in u2) {
    try {
      globalThis.location[i2] = /to[A-Z]/.test(i2) ? u2[i2].bind(u2) : String(u2[i2]);
    } catch {
    }
  }
}
export {
  prerender as default,
  locationStub
};
//# sourceMappingURL=prerender-WP6ICF4E.js.map
