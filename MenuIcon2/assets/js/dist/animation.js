/*Jellybo.com*/


var Jellybo = Jellybo || {};

Jellybo.MenuIcon2 = function ($, Snap, mina) {
    var defaultSettings = {
        size: 70,
        stroke: 6,
        stroke2: 1,
        color: "#fff",
        color2: "#ccc",
        noAnim: false
    };
    var eventsNames = {
        onSubmit: "event_submit",
        onItemSelect: "event_itemClick",
        onChange: "event_change",
        onItemHighlight: "event_itemHighlight"
    };
    var eventNamesArray = [];
    for (var i in eventsNames) {
        eventNamesArray.push(i);
    }
    function distribution(arr, value) {
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

    function extractListeners($e, s) {
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

    return function (e, c_settings) {
        var settings = {};
        $.extend(settings, defaultSettings);
        extendArrayExcept(settings, c_settings, eventNamesArray);

        var size = settings.size;
        var stroke = settings.stroke;
        var stroke2 = settings.stroke2;

        var sh = stroke / 2;
        var mid = size / 2;
        var color = settings.color;
        var color2 = settings.color2;

        var duration = 400;

        var $parentElem;
        var $svgElem;
        var $circ;
        var $circ2;
        var $line1;
        var $line2;
        var $line3;
        var $line2Coords = {};
        var $line1Coords = {};
        var $line3Coords = {};
        var $circleDiameter = 2 * Math.PI * (mid - sh);
        var $lineLen;
        var $lineOff;
        var noAnim = settings.noAnim;

        function drawHtml(e) {
            $parentElem = $(e);
            $parentElem.html("<div style=\"display: inline-block;\" class=\"jellyboMenuIcon001Wrapper\"><svg style=\"display: inline-block;\"></svg></div>");
            $svgElem = Snap($parentElem.find("svg")[0]);
            $svgElem.attr({
                width: size,
                height: size,
                style: "overflow: visible;"
            });
            /*$circ2 = $svgElem.circle(mid, mid, mid - sh);
            $circ2.attr({
                stroke: color2,
                fill: 'none',
                strokeWidth: stroke2,
                strokeLinecap: "round",
                strokeDasharray: $circleDiameter / 24
            });*/
            $circ = $svgElem.circle(mid, mid, mid - sh);
            $circ.attr({
                stroke: color,
                fill: 'none',
                strokeWidth: stroke,
                strokeLinecap: "round"
            });
            $circ.attr({
                'strokeDasharray': 0 + "px, " + $circleDiameter + "px",
                'strokeDashoffset': $circleDiameter / 2
            });
            hideSvg($circ);
            
            var l = ((mid - sh) * 2 * 0.65) - 2 * stroke;
            var lh = ((mid - sh) * 2 * 0.55) - 2 * stroke;
            var d = size;
            var oh = (d - lh) / 2;
            var mh = lh / 2;
            var o = (d - l) / 2;
            $lineLen = l;
            $lineOff = Math.sin(45 * Math.PI / 180) * ($lineLen / 2);
            $line1 = $svgElem.line(o, oh, o + l, oh);
            $line1Coords.start = [o, oh];
            $line1Coords.end = [o + l, oh];
            $line1.attr({
                stroke: color,
                fill: 'none',
                strokeWidth: stroke,
                strokeLinecap: "round"
            });
            $line2 = $svgElem.line(o, oh + mh, o + l, oh + mh);
            $line2Coords.start = [o, oh + mh];
            $line2Coords.end = [o + l, oh + mh];
            $line2.attr({
                stroke: color,
                fill: 'none',
                strokeWidth: stroke,
                strokeLinecap: "round"
            });
            $line3 = $svgElem.line(o, oh + (mh * 2), o + l, oh + (mh * 2));
            $line3Coords.start = [o, oh + (mh * 2)];
            $line3Coords.end = [o + l, oh + (mh * 2)];
            $line3.attr({
                stroke: color,
                fill: 'none',
                strokeWidth: stroke,
                strokeLinecap: "round"
            });
        }

        function moveCircle(e, start, end, v) {
            var x = calculatePosition(start[0], end[0], v);
            var y = calculatePosition(start[1], end[1], v);
            e.attr({
                cx: x,
                cy: y
            });
        }

        function circleCoordinates(x, y, r, p) {
            var rp = p * Math.PI / 180;
            return [x + (Math.sin(rp) * r), y - (Math.cos(rp) * r)];
        }

        function lineSize(e) {
            return Math.sqrt(Math.pow(e.start[0] - e.end[0], 2) + Math.pow(e.start[1] - e.end[1], 2));
        }
        function animate(next) {
            var q = $line2Coords.start[0] - stroke;
            var ql = $line2Coords.end[0] - $line2Coords.start[0];
            var len = $circleDiameter + q;
            var n1 = {start: [mid - $lineOff, mid - $lineOff], end: [mid + $lineOff, mid + $lineOff]};
            var n2 = {start: [mid - $lineOff, mid + $lineOff], end: [mid + $lineOff, mid - $lineOff]};
            var cOff = 0.4;
            var th = threshold(cOff, function () {
                var rot1 = 45;
                $line1.animate({x1: n1.start[0], y1: n1.start[1],
                    x2: n1.start[0] + $lineLen, y2: n1.start[1],
                    transform: 'r' + rot1 + ',' + n1.start[0] + ',' + n1.start[1]
                }, duration * (1-cOff), mina.easeinout);

                var rot2 = -45;
                $line3.animate({x1: n2.start[0], y1: n2.start[1],
                    x2: n2.start[0] + $lineLen, y2: n2.start[1],
                    transform: 'r' + rot2 + ',' + n2.start[0] + ',' + n2.start[1]
                }, duration * (1-cOff), mina.easeinout, function () {
                    $line1.attr({transform: "none", x1: n1.start[0], y1: n1.start[1], x2: n1.end[0], y2: n1.end[1]});
                    $line3.attr({transform: "none", x1: n2.start[0], y1: n2.start[1], x2: n2.end[0], y2: n2.end[1]});

                });

            });
            Snap.animate(0, 1, function (value) {
                distribution({
                    70: function (v) {
                        var value = calculatePosition(0, len, v);
                        if (value < q) {
                            var o = value;
                            $line2.attr({x1: $line2Coords.start[0] - o, x2: $line2Coords.end[0] - o});
                        } else {
                            showSvg($circ);
                            var o = value - q;
                            if (value < q + ql) {
                                $line2.attr({x2: $line2Coords.end[0] - value});
                            } else {
                                hideSvg($line2);
                            }
                            $circ.attr({
                                'strokeDasharray': o + "px, " + ($circleDiameter - o) + "px"
                            });
                        }
                    },
                    100: function () {
                        $circ.attr({
                            'strokeDasharray': $circleDiameter + "px, " + 0 + "px"
                        });
                    }
                }, value);
                th.check(value);

            }, duration, mina.easeinout, function () {
                next();
            });

        }

        function animate1(next) {
            var q = $line2Coords.start[0] - stroke;
            var ql = $line2Coords.end[0] - $line2Coords.start[0];
            var len = $circleDiameter + q;
            var cOff = 0.2;
            var th = threshold(cOff, function () {
                var rot1 = -45;
                $line1.animate({x1: $line1Coords.start[0], y1: $line1Coords.start[1],
                    x2: $line1Coords.start[0] + ($lineOff * 2), y2: $line1Coords.start[1] + ($lineOff * 2),
                    transform: 'r' + rot1 + ',' + $line1Coords.start[0] + ',' + $line1Coords.start[1]
                }, duration * (1-cOff), mina.easeinout);

                var rot2 = 45;
                $line3.animate({x1: $line3Coords.start[0], y1: $line3Coords.start[1],
                    x2: $line3Coords.start[0] + ($lineOff * 2), y2: $line3Coords.start[1] - ($lineOff * 2),
                    transform: 'r' + rot2 + ',' + $line3Coords.start[0] + ',' + $line3Coords.start[1]
                }, duration * (1-cOff), mina.easeinout, function () {
                    $line1.attr({transform: "none", x1: $line1Coords.start[0], y1: $line1Coords.start[1], x2: $line1Coords.end[0], y2: $line1Coords.end[1]});
                    $line3.attr({transform: "none", x1: $line3Coords.start[0], y1: $line3Coords.start[1], x2: $line3Coords.end[0], y2: $line3Coords.end[1]});
                });

            });
            Snap.animate(0, 1, function (value) {
                distribution({
                    90: function (v) {
                        var value = calculatePosition(0, len, v);
                        if (value < $circleDiameter) {
                            var o = value;
                            $circ.attr({
                                'strokeDasharray': ($circleDiameter - o) + "px, " + o + "px"
                            });
                            if (value > ($circleDiameter - $lineLen + stroke)) {
                                var o = value - ($circleDiameter - $lineLen + stroke);
                                showSvg($line2);
                                $line2.attr({x2: o + stroke});
                            }
                        } else {
                            hideSvg($circ);
                            var o = value - $circleDiameter;
                            var x1 = o + stroke;
                            $line2.attr({x1: x1, x2: x1 + $lineLen});
                        }
                    },
                    100: function () {
                        $line2.attr({x1: $line2Coords.start[0], x2: $line2Coords.end[0]});
                    }
                }, value);
                th.check(value);

            }, duration, mina.easeinout, function () {
                next();
            });

        }

        function setSettings(s) {
            extendArrayExcept(settings, s, eventNamesArray);
            extractListeners($parentElem, s);
        }
        var $status = 0;
        return {
            init: function () {
                drawHtml(e);
                if (!noAnim) {
                    $($parentElem).click(function () {
                        if ($(this).jellyboMenuIcon002().isOpened()) {
                            $(this).jellyboMenuIcon002().close();
                        } else {
                            $(this).jellyboMenuIcon002().open();
                        }
                    });
                }
            },
            open: function () {
                $status = 1;
                animate(function () {
                   
                });
            },
            close: function () {
                $status = 0;
                animate1(function () {
                    
                });
            },
            isOpened: function () {
                return $status === 1;
            },
            settings: setSettings

        };
    };
}($, Snap, mina);

Jellybo.BootLoader({
    pluginName: "jellyboMenuIcon002",
    animationFactory: Jellybo.MenuIcon2,
    publicFunctions: ["open", "close", "isOpened"],
    selector: ".jellybo-MenuIcon002",
    settingAttributes: ["color", "size", "stroke"]
});

Jellybo.Helpers.addCss("");
