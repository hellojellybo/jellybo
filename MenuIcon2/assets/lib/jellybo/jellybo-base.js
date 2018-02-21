var Jellybo = Jellybo || {};

Jellybo._prefix = "jellybo";

Jellybo.version = 0.9;

Jellybo.checkVersion = function(v){
   if(!(Jellybo.version && Jellybo.version >= v)){
       console.log("Jellybo ERROR: Please use the latest JellyboBase library (jellybo-base.min.js). Version >="+v+"!");
   }
};

Jellybo.checkBase = function(v){
   if(!window.$){
       console.log("Jellybo ERROR: Please include jQuery library before animation! ");
   }
   if(Jellybo.baseLoaded){
       console.log("Jellybo ERROR: Please include JellyboBase library only once and the latest version! ");
   }
};

Jellybo.checkBase();

Jellybo.BootLoader = function ($) {
    var defaultSettings = {
        pluginName: "",
        animationFactory: null,
        publicFunctions: null,
        selector: "",
        settingAttributes: null
    };
    var _prefix = Jellybo._prefix;
    return function (c_settings) {
        var settings = {};
        $.extend(settings, defaultSettings, c_settings);
        var dataName = _prefix + "animation_plugin_" + settings.pluginName;

        function proxyEachFunction(es, fn) {
            return function () {
                var retval = null;
                var args = arguments;
                es.each(function () {
                    var obj = $(this).data(dataName);
                    retval = obj[fn].apply(obj, args);
                });
                return retval;
            };
        }
        function proxyObject(es) {
            var obj = {};
            for (var i in settings.publicFunctions) {
                obj[settings.publicFunctions[i]] = proxyEachFunction(es, settings.publicFunctions[i]);
            }
            return obj;
        }
        function proxyFunction(obj, fn) {
            return function () {
                return obj[fn].apply(obj, arguments);
            };
        }
        function createPluginObject(e, init_args) {
            var args = {};
            for (var i in settings.settingAttributes) {
                var attr = settings.settingAttributes[i].toString().toLowerCase();
                if (e.data(attr)) {
                    args[attr] = e.data(attr);
                }
            }
            if (init_args.length === 1) {
                $.extend(args, init_args[0]);
            }
            var anim = settings.animationFactory(e, args);
            var obj = {};
            anim.init();
            obj.settings = proxyFunction(anim, "settings");
            for (var i in settings.publicFunctions) {
                obj[settings.publicFunctions[i]] = proxyFunction(anim, settings.publicFunctions[i]);
            }
            return obj;
        }
        function plugin() {
            return function () {
                var args = arguments;
                this.each(function () {
                    if (!$(this).data(dataName)) {
                        $(this).data(dataName, createPluginObject($(this), args));
                    } else {
                        if (args.length === 1 && $.isPlainObject(args[0])) {
                            $(this).data(dataName).settings(args[0]);
                        }
                    }
                });
                return proxyObject(this);
            };
        }
        function registerPlugin() {
            $.fn[settings.pluginName] = plugin();
        }
        return function () {
            registerPlugin();
            $(function () {
                $(settings.selector)[settings.pluginName]();
            });
            return null;
        }();
    };
}($);

Jellybo.Helpers = function ($) {
    function init(eventNamesArray, eventsNames) {
        for (var i in eventsNames) {
            eventNamesArray.push(i);
        }
    }
    function distributionArr(arr, value) {
        var l = 0;
        for (var i in arr) {
            var len = arr[i].pos / 100;
            if (value > l && value <= len) {
                var v = (value - l) / (len - l);
                if ($.isFunction(arr[i].fn)) {
                    arr[i].fn(v);
                }
            }
            l = len;
        }
    }
    function distribution(arr, value) {
        if ($.isArray(arr)) {
            return distributionArr(arr, value);
        } else {
            var l = 0;
            for (var i in arr) {
                var len = i / 100;
                if (value > l && value <= len) {
                    var v = (value - l) / (len - l);
                    if ($.isFunction(arr[i])) {
                        arr[i](v);
                    }
                }
                l = len;
            }
        }
    }

    function threshold(t, fn) {
        function thresholdInstance() {
            var run = 0;
            return {
                check: function (v) {
                    if (v >= t && run === 0) {
                        fn();
                        run = 1;
                    }
                }
            };
        }
        return thresholdInstance();
    }

    function extractListeners(eventsNames, $e, s) {
        function listener(event, fn) {
            $e.on(event, function () {
                if ($.isFunction(fn)) {
                    fn.apply(this, arguments);
                } else {
                    window[fn].apply(this, arguments);
                }
            });
        }
        for (var i in s) {
            for (var j in eventsNames) {
                if (i.toString().toLowerCase() === j.toString().toLowerCase()) {
                    listener(eventsNames[j], s[i]);
                }
            }
        }
    }
    function hideSvg(e) {
        e.attr({
            visibility: "hidden"
        });
    }
    function showSvg(e) {
        e.attr({
            visibility: "visible"
        });
    }
    function extendArrayExcept(dest, src, except) {
        for (var i in src) {
            if ($.inArray(i, except) < 0) {
                dest[i] = src[i];
            }
        }
    }
    function bezier(x1, y1, x2, y2, duration) {

        var epsilon = (1000 / 60 / duration) / 4;

        var curveX = function (t) {
            var v = 1 - t;
            return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
        };

        var curveY = function (t) {
            var v = 1 - t;
            return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
        };

        var derivativeCurveX = function (t) {
            var v = 1 - t;
            return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
        };

        return function (t) {

            var x = t, t0, t1, t2, x2, d2, i;

            // First try a few iterations of Newton's method -- normally very fast.
            for (t2 = x, i = 0; i < 8; i++) {
                x2 = curveX(t2) - x;
                if (Math.abs(x2) < epsilon)
                    return curveY(t2);
                d2 = derivativeCurveX(t2);
                if (Math.abs(d2) < 1e-6)
                    break;
                t2 = t2 - x2 / d2;
            }

            t0 = 0;
            t1 = 1;
            t2 = x;

            if (t2 < t0)
                return curveY(t0);
            if (t2 > t1)
                return curveY(t1);

            // Fallback to the bisection method for reliability.
            while (t0 < t1) {
                x2 = curveX(t2);
                if (Math.abs(x2 - x) < epsilon)
                    return curveY(t2);
                if (x > x2)
                    t0 = t2;
                else
                    t1 = t2;
                t2 = (t1 - t0) * .5 + t0;
            }

            // Failure
            return curveY(t2);

        };

    }
    function calculatePosition(from, to, value) {
        return from + ((to - from) * value);
    }

    function animate3dMatrix(Snap, mina, e, arr, duration, callback) {
        var distObj = [];
        var prev = arr.steps[0].matrix3d;
        for (var i in arr.steps) {
            function change(prev, arr) {
                return function (v) {

                    var output = [];
                    for (var i in arr) {
                        var p = prev === null ? 0 : prev[i];
                        output.push(calculatePosition(p, arr[i], v));
                    }
                    e.css("transform", "matrix3d(" + (output.join(",") + ")"));
                };
            }
            distObj.push({pos: arr.steps[i].pos, fn: change(prev, arr.steps[i].matrix3d)});
            prev = arr.steps[i].matrix3d;
        }
        distObj[0].fn(0);

        Snap.animate(0, 1, function (value) {
            distribution(distObj, value);

        }, duration, mina.linear, callback);
    }

    function animate2dMatrixAndCalcOrigin(Snap, mina, e, arr, duration, callback) {
        var distObj = [];
        var prev = arr.steps[0].matrix;
        for (var i in arr.steps) {
            function change(prev, arr) {
                return function (v) {
                    var output = [];
                    for (var i in arr) {
                        var p = prev === null ? 0 : prev[i];
                        output.push(calculatePosition(p, arr[i], v));
                    }
                    var m = Snap.matrix.apply(null, output);

                    var p = m.toTransformString().split(",");
                    p.pop();
                    p.pop();
                    e.transform(p.join(","));
                };
            }
            distObj.push({pos: arr.steps[i].pos, fn: change(prev, arr.steps[i].matrix)});
            prev = arr.steps[i].matrix;
        }
        distObj[0].fn(0);

        Snap.animate(0, 1, function (value) {
            distribution(distObj, value);
        }, duration, mina.linear, callback);
    }
    
    function animateScaleByCoords(Snap, mina, e, arr, duration, callback, animFn) {
        var distObj = [];
        var prev = getScale(arr[0].objs);
        function getScale(arr){
            var f = ["s","S"];
            for(var i in arr){
                if(f.indexOf(arr[i].type) !== -1){
                    return arr[i].args;
                }
            }
            return [];
        }
        for (var i in arr) {
            function change(prev, arr) {
                return function (v) {
                    var output = [];
                    for (var i in arr) {
                        var p = prev === null ? 0 : prev[i];
                        output.push(calculatePosition(p, arr[i], v));
                    }
                    var p = output.slice();
                    p.pop();
                    p.pop();
                    var str = "s"+p.join(",");
                    //console.log(str,p);
                    e.transform(str);
                };
            }
            distObj.push({pos: arr[i].pos, fn: change(prev, getScale(arr[i].objs))});
            prev = getScale(arr[i].objs);
        }
        distObj[0].fn(0);

        Snap.animate(0, 1, function (value) {
            distribution(distObj, value);
            if(animFn){
                animFn(value);
            }
        }, duration, mina.linear, callback);
    }
    
    function animate2dMatrixJquery(Snap, mina, e, arr, duration, callback) {
        var distObj = [];
        var prev = arr.steps[0].matrix;
        for (var i in arr.steps) {
            function change(prev, arr) {
                return function (v) {
                    var output = [];
                    for (var i in arr) {
                        var p = prev === null ? 0 : prev[i];
                        output.push(calculatePosition(p, arr[i], v));
                    }
                    $(e).css("transform","matrix("+output.join(",")+")");
                };
            }
            distObj.push({pos: arr.steps[i].pos, fn: change(prev, arr.steps[i].matrix)});
            prev = arr.steps[i].matrix;
        }
        distObj[0].fn(0);

        Snap.animate(0, 1, function (value) {
            distribution(distObj, value);
        }, duration, mina.linear, callback);
    }
    
    function moveLine(e, x1, y1, x2, y2, xx1, yy1, xx2, yy2, v) {
        e.attr({
            x1: calculatePosition(x1, xx1, v),
            y1: calculatePosition(y1, yy1, v),
            x2: calculatePosition(x2, xx2, v),
            y2: calculatePosition(y2, yy2, v)
        });
    }
    function circlePointCoordinates(x, y, r, p) {
        var rp = p * Math.PI / 180;
        return [x + (Math.sin(rp) * r), y - (Math.cos(rp) * r)];
    }

    function lineSize(e) {
        return Math.sqrt(Math.pow(e.start[0] - e.end[0], 2) + Math.pow(e.start[1] - e.end[1], 2));
    }
    function moveCircle(e, start, end, v) {
        var x = calculatePosition(start[0], end[0], v);
        var y = calculatePosition(start[1], end[1], v);
        e.attr({
            cx: x,
            cy: y
        });
    }
    function addCss(css) {
        var style = $('<style>' + css + '</style>');
        if ($('html head').length === 0) {
            $('html').append("<head></head>");
        }
        $('html head').append(style);
    }
    var animationCounter = 0;
    function addAnimationRule(animationCss, duration) {
        animationCounter++;
        var classname = Jellybo._prefix + "animationClass_" + animationCounter;
        var animationname = Jellybo._prefix + "animation_" + animationCounter;
        addCss("." + classname + "{-webkit-animation: " + animationname + " " + duration + "ms linear both; " +
                "animation: " + animationname + " " + duration + "ms linear both;} " +
                "@keyframes " + animationname + " {" + animationCss + "} " +
                "@-webkit-keyframes " + animationname + " {" + animationCss + "} ");
        return classname;
    }
    function addBounceJsRule(animationCss, duration) {
        var cName = addAnimationRule(animationCss, duration);
        addCss("." + cName + "{-webkit-transform-origin: center center;transform-origin: center center;}");
        return cName;
    }
    function settingsHelper(settings, eventNamesArray, $parentElem) {
        return function (s) {
            extendArrayExcept(settings, s, eventNamesArray);
            extractListeners($parentElem, s);
        };
    }
    return {
        init: init,
        distribution: distribution,
        threshold: threshold,
        extractListeners: extractListeners,
        hideSvg: hideSvg,
        showSvg: showSvg,
        extendArrayExcept: extendArrayExcept,
        bezier: bezier,
        calculatePosition: calculatePosition,
        animate3dMatrix: animate3dMatrix,
        animate2dMatrixAndCalcOrigin: animate2dMatrixAndCalcOrigin,
        animate2dMatrixJquery:animate2dMatrixJquery,
        animateScaleByCoords:animateScaleByCoords,
        moveLine: moveLine,
        circlePointCoordinates: circlePointCoordinates,
        lineSize: lineSize,
        moveCircle: moveCircle,
        addCss: addCss,
        addAnimationRule: addAnimationRule,
        addBounceJsRule: addBounceJsRule,
        settingsHelper:settingsHelper

    };
}($);

Jellybo.baseLoaded = true;
