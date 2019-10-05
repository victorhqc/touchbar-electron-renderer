import crypto from 'crypto';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import Reconciler from 'react-reconciler';

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto.randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

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
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function insertBeforeChild(_a) {
    var children = _a.children, newChild = _a.newChild, beforeChild = _a.beforeChild;
    var orderedChildren = children.reduce(function (prev, currentChild) {
        if (beforeChild.id === currentChild.id) {
            return __spreadArrays([newChild, currentChild], prev);
        }
        return __spreadArrays(prev, [currentChild]);
    }, []);
    return flatten(orderedChildren);
}
function removeChild(_a) {
    var children = _a.children, child = _a.child;
    return children.filter(function (childElement) { return childElement.id !== child.id; });
}

// This is a hacky workaround to solve a very simple problem.
// Atom packages doesn't get `electron` module. Only `remote`.
// But newer Electron applications doesn't get `remote`, just `electron`.
// To workaround this issue, I'm registering the instance here, and abstracting
// my hacky solution until I find a better idea.
var __NativeTouchBar__ = null;
function setNativeTouchBar(NativeTouchBar) {
    __NativeTouchBar__ = NativeTouchBar;
}
function getNativeTouchBar() {
    return __NativeTouchBar__;
}

function isTruthy(x) {
    return Boolean(x);
}

var TouchBar = /** @class */ (function () {
    function TouchBar(electronWindow, NativeTouchBar) {
        this.id = v4_1();
        this.children = [];
        this.didChildrenChange = false;
        this.electronWindow = electronWindow;
        this.instance = null;
        setNativeTouchBar(NativeTouchBar);
    }
    TouchBar.prototype.appendChild = function (child) {
        if (!child) {
            return;
        }
        this.children.push(child);
        this.didChildrenChange = true;
    };
    TouchBar.prototype.insertBefore = function (newChild, beforeChild) {
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
        this.didChildrenChange = true;
    };
    TouchBar.prototype.removeChild = function (child) {
        this.children = removeChild({
            children: this.children,
            child: child,
        });
        this.didChildrenChange = true;
    };
    TouchBar.prototype.createInitialInstance = function () {
        var nativeChildren = this.children
            .map(function (child) { return child.createInstance(); })
            .filter(isTruthy);
        var args = {
            items: nativeChildren,
        };
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar(args);
        if (!this.instance)
            return null;
        this.electronWindow.setTouchBar(this.instance);
        this.didChildrenChange = false;
        return this.instance;
    };
    // TODO: Delete me.
    TouchBar.prototype.updateInstance = function () {
        this.children.map(function (child) { return child.createInstance(); });
        this.didChildrenChange = false;
        return this.instance;
    };
    // TODO: Delete me.
    TouchBar.prototype.createInstance = function () {
        if (!this.instance || this.didChildrenChange) {
            return this.createInitialInstance();
        }
        return this.updateInstance();
    };
    TouchBar.prototype.refreshTree = function (isReRenderNeeded) {
        // Only create new touchbar when
        // - toucbbar is new.
        // - new nodes were added.
        // - node down in tree asks for a hard re-render.
        if (!this.instance || this.didChildrenChange || isReRenderNeeded) {
            return this.createInitialInstance();
        }
        return null;
    };
    TouchBar.prototype.update = function () {
        return true;
    };
    return TouchBar;
}());

var TouchBarButton = /** @class */ (function () {
    function TouchBarButton(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.props = props;
        this.children = children;
        this.id = v4_1();
        this.instance = null;
    }
    TouchBarButton.prototype.appendChild = function (child) {
        this.children = child;
    };
    TouchBarButton.prototype.insertBefore = function (child) {
        this.appendChild(child);
    };
    TouchBarButton.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarButton.prototype.update = function (_a) {
        var newProps = _a.newProps;
        this.props = newProps;
        this.updateInstance();
        // No Rerender needed when button props update.
        return false;
    };
    TouchBarButton.prototype.getNativeArgs = function () {
        var _a = this.props, onClick = _a.onClick, props = __rest(_a, ["onClick"]);
        return __assign(__assign({}, props), { label: this.children && this.children.createInstance(), click: onClick });
    };
    TouchBarButton.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (!_this.instance)
                return;
            if (_this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
    };
    TouchBarButton.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarButton(args);
        return this.instance;
    };
    return TouchBarButton;
}());

var TouchBarColor = /** @class */ (function () {
    function TouchBarColor(_a) {
        var children = _a.children;
        this.id = v4_1();
        this.children = children;
    }
    TouchBarColor.prototype.appendChild = function (text) {
        this.children = text;
    };
    TouchBarColor.prototype.insertBefore = function (text) {
        this.appendChild(text);
    };
    TouchBarColor.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (newProps.children) {
            this.appendChild(newProps.children);
        }
        return false;
    };
    TouchBarColor.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarColor.prototype.createInstance = function () {
        if (!this.children)
            return null;
        return this.children.createInstance();
    };
    return TouchBarColor;
}());

var TouchBarColorPicker = /** @class */ (function () {
    function TouchBarColorPicker(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children || [];
        this.instance = null;
    }
    TouchBarColorPicker.prototype.appendChild = function (child) {
        this.children.push(child);
    };
    TouchBarColorPicker.prototype.insertBefore = function (newChild, beforeChild) {
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
    };
    TouchBarColorPicker.prototype.removeChild = function (child) {
        this.children = removeChild({
            children: this.children,
            child: child,
        });
    };
    TouchBarColorPicker.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        this.updateInstance();
        // No rerender needed when color-picker props change.
        return false;
    };
    TouchBarColorPicker.prototype.getNativeArgs = function () {
        var _a = this.props, onChange = _a.onChange, selected = _a.selected, props = __rest(_a, ["onChange", "selected"]);
        return __assign(__assign({}, props), { change: onChange, selectedColor: selected, availableColors: this.children
                .map(function (child) { return child.createInstance(); })
                .filter(isTruthy) });
    };
    TouchBarColorPicker.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        return this.instance;
    };
    TouchBarColorPicker.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarColorPicker(args);
        return this.instance;
    };
    return TouchBarColorPicker;
}());

var TouchBarGroup = /** @class */ (function () {
    function TouchBarGroup() {
        this.id = v4_1();
        this.children = [];
        this.didChildrenChange = false;
        this.instance = null;
    }
    TouchBarGroup.prototype.update = function () {
        return this.updateInstance();
    };
    TouchBarGroup.prototype.appendChild = function (child) {
        this.didChildrenChange = true;
        this.children.push(child);
    };
    TouchBarGroup.prototype.insertBefore = function (newChild, beforeChild) {
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
        this.didChildrenChange = true;
    };
    TouchBarGroup.prototype.removeChild = function (child) {
        this.children = removeChild({
            children: this.children,
            child: child,
        });
        this.didChildrenChange = true;
    };
    TouchBarGroup.prototype.updateInstance = function () {
        var isRerenderNeeded = false;
        if (this.didChildrenChange) {
            isRerenderNeeded = true;
        }
        this.didChildrenChange = false;
        return isRerenderNeeded;
    };
    TouchBarGroup.prototype.createInstance = function () {
        var nativeChildren = this.children
            .map(function (child) { return child.createInstance(); })
            .filter(isTruthy);
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        var args = {
            items: new NativeTouchBar({ items: nativeChildren }),
        };
        this.instance = new NativeTouchBar.TouchBarGroup(args);
        this.didChildrenChange = false;
        return this.instance;
    };
    return TouchBarGroup;
}());

var TouchBarLabel = /** @class */ (function () {
    function TouchBarLabel(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children;
        this.instance = null;
    }
    TouchBarLabel.prototype.appendChild = function (text) {
        this.children = text;
    };
    TouchBarLabel.prototype.insertBefore = function (text) {
        this.children = text;
    };
    TouchBarLabel.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarLabel.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        this.updateInstance();
        // No rerender needed when props change.
        return false;
    };
    TouchBarLabel.prototype.getNativeArgs = function () {
        var _a = this.props, color = _a.color, props = __rest(_a, ["color"]);
        return __assign(__assign({}, props), { textColor: color, label: (this.children && this.children.createInstance()) || '' });
    };
    TouchBarLabel.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        return this.instance;
    };
    TouchBarLabel.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarLabel(args);
        return this.instance;
    };
    return TouchBarLabel;
}());

var TouchBarPopover = /** @class */ (function () {
    function TouchBarPopover(props) {
        this.id = v4_1();
        this.props = props;
        this.children = [];
        this.didChildrenChange = false;
        this.instance = null;
        this.builtChildrenInstances = [];
    }
    TouchBarPopover.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarPopover.prototype.appendChild = function (child) {
        this.children.push(child);
        this.didChildrenChange = true;
    };
    TouchBarPopover.prototype.insertBefore = function (newChild, beforeChild) {
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
        this.didChildrenChange = true;
    };
    TouchBarPopover.prototype.removeChild = function (child) {
        this.children = removeChild({
            children: this.children,
            child: child,
        });
        this.didChildrenChange = true;
    };
    TouchBarPopover.prototype.getNativeArgs = function (buildItems) {
        if (buildItems === void 0) { buildItems = true; }
        var _a = this.props, hideCloseButton = _a.hideCloseButton, props = __rest(_a, ["hideCloseButton"]);
        // TODO: Figure out why some children are react components already.
        // This means that `createInstance` does not exist!
        this.builtChildrenInstances = !buildItems
            ? this.builtChildrenInstances
            : this.children
                .filter(function (child) { return child.createInstance; })
                .map(function (child) {
                return child.createInstance();
            })
                .filter(isTruthy);
        return __assign(__assign({}, props), { 
            // if `hideCloseButton` is truthy, then `showCloseButton` is false.
            showCloseButton: hideCloseButton ? false : true, items: this.builtChildrenInstances });
    };
    TouchBarPopover.prototype.updateInstance = function () {
        var _this = this;
        var isRerenderNeeded = false;
        var args = this.getNativeArgs(false);
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (key === 'items') {
                return;
            }
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        if (this.didChildrenChange) {
            isRerenderNeeded = true;
        }
        this.didChildrenChange = false;
        return isRerenderNeeded;
    };
    TouchBarPopover.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarPopover(__assign(__assign({}, args), { items: new NativeTouchBar({ items: args.items }) }));
        this.didChildrenChange = false;
        return this.instance;
    };
    return TouchBarPopover;
}());

var nop = function () { };
var TouchBarScrubber = /** @class */ (function () {
    function TouchBarScrubber(props) {
        this.id = v4_1();
        this.props = props;
        this.children = [];
        this.didChildrenChange = false;
        this.instance = null;
        this.builtChildrenInstances = [];
    }
    TouchBarScrubber.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarScrubber.prototype.appendChild = function (child) {
        this.didChildrenChange = true;
        this.children.push(child);
    };
    TouchBarScrubber.prototype.insertBefore = function (newChild, beforeChild) {
        this.didChildrenChange = true;
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
    };
    TouchBarScrubber.prototype.removeChild = function (child) {
        this.didChildrenChange = true;
        this.children = removeChild({
            children: this.children,
            child: child,
        });
    };
    TouchBarScrubber.prototype.getNativeArgs = function (buildItems) {
        if (buildItems === void 0) { buildItems = true; }
        var _a = this.props, onSelect = _a.onSelect, onHighlight = _a.onHighlight, debounceTime = _a.debounceTime, selectedStyle = _a.selectedStyle, overlayStyle = _a.overlayStyle, continuous = _a.continuous, showArrowButtons = _a.showArrowButtons, mode = _a.mode, props = __rest(_a, ["onSelect", "onHighlight", "debounceTime", "selectedStyle", "overlayStyle", "continuous", "showArrowButtons", "mode"]);
        this.builtChildrenInstances = !buildItems
            ? this.builtChildrenInstances
            : this.children.map(function (child) { return child.createInstance(); });
        return __assign(__assign({}, props), { 
            // If not debounced, it causes serious performance issues
            select: (onSelect && debounce(onSelect, debounceTime || 250)) || nop, highlight: (onHighlight && debounce(onHighlight, debounceTime || 250)) || nop, items: this.builtChildrenInstances, selectedStyle: selectedStyle || '', overlayStyle: overlayStyle || '', mode: mode || '', continuous: continuous || false, showArrowButtons: showArrowButtons || false });
    };
    TouchBarScrubber.prototype.updateInstance = function () {
        var _this = this;
        // this.didChildrenChange = true;
        var isRerenderNeeded = false;
        var args = this.getNativeArgs(false);
        // Update new/deleted items
        if (this.didChildrenChange) {
            isRerenderNeeded = true;
        }
        // Update instance.
        Object.keys(args).forEach(function (key) {
            // Avoid updating functions as there's not a really easy way to know if they changed.
            if (key === 'select' || key === 'highlight' || key === 'items') {
                return;
            }
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        this.didChildrenChange = false;
        return isRerenderNeeded;
    };
    TouchBarScrubber.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarScrubber(args);
        return this.instance;
    };
    return TouchBarScrubber;
}());
var Style;
(function (Style) {
    Style["Background"] = "background";
    Style["Outline"] = "outline";
})(Style || (Style = {}));
var Mode;
(function (Mode) {
    Mode["Fixed"] = "fixed";
    Mode["Free"] = "free";
})(Mode || (Mode = {}));

var TouchBarScrubItem = /** @class */ (function () {
    function TouchBarScrubItem(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children;
        this.instance = null;
    }
    TouchBarScrubItem.prototype.appendChild = function (child) {
        this.children = child;
    };
    TouchBarScrubItem.prototype.insertBefore = function (child) {
        return this.appendChild(child);
    };
    TouchBarScrubItem.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarScrubItem.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        this.updateInstance();
        // No rerender needed when color-picker props change.
        return false;
    };
    TouchBarScrubItem.prototype.getNativeArgs = function () {
        return __assign(__assign({}, this.props), { label: this.children && this.children.createInstance() });
    };
    TouchBarScrubItem.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        return this.instance;
    };
    TouchBarScrubItem.prototype.createInstance = function () {
        this.instance = __assign(__assign({}, this.props), { label: this.children && this.children.createInstance() });
        return this.instance;
    };
    return TouchBarScrubItem;
}());

var TouchBarSegment = /** @class */ (function () {
    function TouchBarSegment(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children;
        this.instance = null;
    }
    TouchBarSegment.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarSegment.prototype.appendChild = function (label) {
        this.children = label;
    };
    TouchBarSegment.prototype.insertBefore = function (label) {
        this.appendChild(label);
    };
    TouchBarSegment.prototype.replaceText = function (label) {
        this.appendChild(label);
    };
    TouchBarSegment.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarSegment.prototype.getNativeArgs = function () {
        var _a = this.props, disabled = _a.disabled, props = __rest(_a, ["disabled"]);
        return __assign(__assign({}, props), { enabled: disabled ? false : true, label: this.children && this.children.createInstance() });
    };
    TouchBarSegment.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        // When an update happens in a segment, a hard re-render is needed*
        return true;
    };
    TouchBarSegment.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        this.instance = args;
        return this.instance;
    };
    return TouchBarSegment;
}());

var nop$1 = function () { };
var TouchBarSegmentedControl = /** @class */ (function () {
    function TouchBarSegmentedControl(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children || [];
        this.instance = null;
        this.didChildrenChange = false;
        this.builtChildrenInstances = [];
    }
    TouchBarSegmentedControl.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarSegmentedControl.prototype.appendChild = function (child) {
        this.children.push(child);
        this.didChildrenChange = true;
    };
    TouchBarSegmentedControl.prototype.insertBefore = function (newChild, beforeChild) {
        this.children = insertBeforeChild({
            children: this.children,
            newChild: newChild,
            beforeChild: beforeChild,
        });
        this.didChildrenChange = true;
    };
    TouchBarSegmentedControl.prototype.removeChild = function (child) {
        this.children = removeChild({
            children: this.children,
            child: child,
        });
        this.didChildrenChange = true;
    };
    TouchBarSegmentedControl.prototype.getSegments = function (buildItems) {
        if (!buildItems) {
            return this.builtChildrenInstances;
        }
        return this.children.map(function (child) { return child.createInstance(); });
    };
    TouchBarSegmentedControl.prototype.getNativeArgs = function (buildItems) {
        if (buildItems === void 0) { buildItems = true; }
        var _a = this.props, onChange = _a.onChange, selected = _a.selected, props = __rest(_a, ["onChange", "selected"]);
        return __assign(__assign({}, props), { change: onChange || nop$1, selectedIndex: selected, segments: this.getSegments(buildItems) });
    };
    TouchBarSegmentedControl.prototype.updateInstance = function () {
        var _this = this;
        var isRerenderNeeded = false;
        if (this.didChildrenChange) {
            isRerenderNeeded = true;
        }
        var args = this.getNativeArgs(false);
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (key === 'items' || key === 'segments') {
                return;
            }
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        this.didChildrenChange = false;
        return isRerenderNeeded;
    };
    TouchBarSegmentedControl.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarSegmentedControl(args);
        this.didChildrenChange = false;
        return this.instance;
    };
    return TouchBarSegmentedControl;
}());

var TouchBarSlider = /** @class */ (function () {
    function TouchBarSlider(_a) {
        var children = _a.children, props = __rest(_a, ["children"]);
        this.id = v4_1();
        this.props = props;
        this.children = children;
        this.instance = null;
    }
    TouchBarSlider.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarSlider.prototype.appendChild = function (child) {
        this.children = child;
    };
    TouchBarSlider.prototype.insertBefore = function (child) {
        this.appendChild(child);
    };
    TouchBarSlider.prototype.removeChild = function () {
        this.children = undefined;
    };
    TouchBarSlider.prototype.getNativeArgs = function () {
        var _a = this.props, onChange = _a.onChange, props = __rest(_a, ["onChange"]);
        return __assign(__assign({}, props), { label: this.children && this.children.createInstance(), 
            // If not debounced, it causes serious performance issues
            change: onChange && debounce(onChange, props.debounceTime || 0) });
    };
    TouchBarSlider.prototype.updateInstance = function () {
        var _this = this;
        var args = this.getNativeArgs();
        // Update instance.
        Object.keys(args).forEach(function (key) {
            if (_this.instance && _this.instance[key] !== args[key]) {
                _this.instance[key] = args[key];
            }
        });
        return false;
    };
    TouchBarSlider.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarSlider(args);
        return this.instance;
    };
    return TouchBarSlider;
}());

var getSize = function (_a) {
    var small = _a.small, large = _a.large, flexible = _a.flexible;
    if (small) {
        return 'small';
    }
    if (large) {
        return 'large';
    }
    if (flexible) {
        return 'flexible';
    }
    return undefined;
};
var TouchBarSpacer = /** @class */ (function () {
    function TouchBarSpacer(props) {
        this.id = v4_1();
        this.props = props;
        this.instance = null;
    }
    TouchBarSpacer.prototype.update = function (_a) {
        var newProps = _a.newProps;
        if (isEqual(newProps, this.props)) {
            return false;
        }
        this.props = newProps;
        return this.updateInstance();
    };
    TouchBarSpacer.prototype.appendChild = function () {
        // do nothing.
    };
    TouchBarSpacer.prototype.insertBefore = function () {
        // do nothing.
    };
    TouchBarSpacer.prototype.removeChild = function () {
        // do nothing.
    };
    TouchBarSpacer.prototype.getNativeArgs = function () {
        var _a = this.props, small = _a.small, large = _a.large, flexible = _a.flexible, props = __rest(_a, ["small", "large", "flexible"]);
        var sizeByProps = getSize({ small: small, large: large, flexible: flexible });
        return __assign(__assign({}, props), { size: sizeByProps });
    };
    TouchBarSpacer.prototype.updateInstance = function () {
        // Hard re-render needed.
        return true;
    };
    TouchBarSpacer.prototype.createInstance = function () {
        var args = this.getNativeArgs();
        var NativeTouchBar = getNativeTouchBar();
        if (!NativeTouchBar)
            return null;
        this.instance = new NativeTouchBar.TouchBarSpacer(args);
        return this.instance;
    };
    return TouchBarSpacer;
}());

var TouchBarText = /** @class */ (function () {
    function TouchBarText(text) {
        this.id = v4_1();
        this.text = text;
    }
    TouchBarText.prototype.replaceText = function (text) {
        this.text = text;
    };
    TouchBarText.prototype.createInstance = function () {
        return this.text;
    };
    return TouchBarText;
}());

function createTouchBarElement(type, props) {
    switch (type) {
        case 'button':
        case 'touchbar-button':
            return new TouchBarButton(props);
        case 'color':
        case 'touchbar-color':
            return new TouchBarColor(props);
        case 'color-picker':
        case 'touchbar-color-picker':
            return new TouchBarColorPicker(props);
        case 'group':
        case 'touchbar-group':
            return new TouchBarGroup();
        case 'label':
        case 'touchbar-label':
            return new TouchBarLabel(props);
        case 'popover':
        case 'touchbar-popover':
            return new TouchBarPopover(props);
        case 'scrubber':
        case 'touchbar-scrubber':
            return new TouchBarScrubber(props);
        case 'scrub-item':
        case 'touchbar-scrub-item':
            return new TouchBarScrubItem(props);
        case 'segment':
        case 'touchbar-segment':
            return new TouchBarSegment(props);
        case 'segmented-control':
        case 'touchbar-segmented-control':
            return new TouchBarSegmentedControl(props);
        case 'slider':
        case 'touchbar-slider':
            return new TouchBarSlider(props);
        case 'spacer':
        case 'touchbar-spacer':
            return new TouchBarSpacer(props);
        default:
            return null;
    }
}

var isReRenderNeeded = false;
var HostConfig = {
    now: Date.now,
    supportsMutation: true,
    supportsPersistence: false,
    noTimeout: false,
    isPrimaryRenderer: true,
    supportsHydration: false,
    getPublicInstance: function getPublicInstance() {
        return {};
    },
    getRootHostContext: function getRootHostContext() {
        return {};
    },
    getChildHostContext: function getChildHostContext() {
        return {};
    },
    shouldSetTextContent: function shouldSetTextContent() {
        return false;
    },
    // scheduleTimeout: setTimeout,
    // cancelTimeout: clearTimeout,
    scheduleDeferredCallback: function (callback, options) {
        setTimeout(function () { return callback(); }, options ? options.timeout : 0);
    },
    // scheduleDeferredCallback: setTimeout,
    cancelDeferredCallback: clearTimeout,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    createTextInstance: function createTextInstance(newText) {
        return new TouchBarText(newText);
    },
    createInstance: function createInstance(type, newProps) {
        return createTouchBarElement(type, newProps);
    },
    appendInitialChild: function appendInitialChild(parent, child) {
        parent.appendChild(child);
    },
    finalizeInitialChildren: function finalizeInitialChildren() {
        return true;
    },
    prepareForCommit: function prepareForCommit() {
        // do nothing.
    },
    resetAfterCommit: function resetAfterCommit(root) {
        root.refreshTree(isReRenderNeeded);
        isReRenderNeeded = false;
    },
    appendChildToContainer: function appendChildToContainer(parent, child) {
        parent.appendChild(child);
    },
    appendChild: function appendChild(parent, child) {
        parent.appendChild(child);
    },
    insertBefore: function insertBefore(parent, child, beforeChild) {
        // parentInstance, child, beforeChild
        parent.insertBefore(child, beforeChild);
    },
    removeChild: function removeChild(parent, child) {
        // parentInstance, child
        parent.removeChild(child);
    },
    removeChildFromContainer: function removeChildFromContainer(container, child) {
        // container, child
        container.removeChild(child);
    },
    insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {
        container.insertBefore(child, beforeChild);
    },
    prepareUpdate: function prepareUpdate(_instance, _type, oldProps, newProps) {
        // A prop was deleted or deleted.
        if (Object.keys(oldProps).length > Object.keys(newProps).length ||
            Object.keys(oldProps).length < Object.keys(newProps).length) {
            return newProps;
        }
        var diff = Object.keys(oldProps).reduce(function (prev, key) {
            var _a;
            if (oldProps[key] !== newProps[key]) {
                return __assign(__assign({}, prev), (_a = {}, _a[key] = newProps[key], _a));
            }
            return prev;
        }, {});
        if (Object.keys(diff).length > 0) {
            return diff;
        }
        return {};
    },
    commitUpdate: function commitUpdate(instance, _updatePayload, type, oldProps, newProps) {
        var forceRerender = instance.update({ type: type, newProps: newProps, oldProps: oldProps });
        if (forceRerender) {
            isReRenderNeeded = true;
        }
    },
    // TODO: Figure out how passive effects work. This dummy callbacks somehow work but no idea why
    // or how.
    // schedulePassiveEffects: function schedulePassiveEffects(wrapped: Function) {
    //   return wrapped();
    // },
    // cancelPassiveEffects: function cancelPassiveEffects() {
    //   // do nothing.
    // },
    commitTextUpdate: function commitTextUpdate(textInstance, _oldText, newText) {
        textInstance.replaceText(newText);
    },
    commitMount: function commitMount() {
        // do nothing.
    },
    resetTextContent: function resetTextContent() {
        // do nothing.
    },
    shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(_type, nextProps) {
        return !!nextProps.hidden;
    },
};
var reconcilerInstance = Reconciler(HostConfig);
var TouchBarRenderer = {
    render: function (element, renderDom, callback) {
        // element: This is the react element for App component
        // renderDom: This is the host root element to which the rendered app will be attached.
        // callback: if specified will be called after render is done.
        // Disables async rendering, read more about it here:
        // https://github.com/facebook/react/issues/13206#issuecomment-407535077
        var isAsync = false;
        var hydrate = false;
        // Creates root fiber node.
        var container = reconcilerInstance.createContainer(renderDom, isAsync, hydrate);
        // Since there is no parent (since this is the root fiber). We set parentComponent to null.
        var parentComponent = null;
        // Start reconcilation and render the result
        reconcilerInstance.updateContainer(element, container, parentComponent, callback);
    },
};

export { TouchBarRenderer as ReactTouchBar, TouchBar, TouchBarButton, TouchBarColor, TouchBarColorPicker, TouchBarGroup, TouchBarLabel, TouchBarPopover, TouchBarScrubItem, TouchBarScrubber, TouchBarSegment, TouchBarSegmentedControl, TouchBarSlider, TouchBarSpacer, TouchBarText };
