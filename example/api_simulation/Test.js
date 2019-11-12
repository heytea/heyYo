(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
    typeof define === 'function' && define.amd ? define(['react'], factory) :
      (global.test = factory(global.React));
}(this, (function (React) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
    __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
        t[p[i]] = s[p[i]];
    return t;
  }

  var Test = /** @class */ (function (_super) {
    __extends(Test, _super);
    function Test() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    Test.prototype.render = function () {
      var _a = this.props, _b = _a.children, children = _b === void 0 ? null : _b, args = __rest(_a, ["children"]);
      return (React.createElement("div", __assign({}, args, { id: "l-full" }),
        React.createElement("h2", null, "\u6807\u98982"),
        React.createElement("div", { className: "b-content-wp" },
          React.createElement("div", { className: "b-content" }, children))));
    };
    return Test;
  }(React.Component));

  return Test;

})));
