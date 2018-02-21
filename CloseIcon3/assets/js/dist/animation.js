/*Jellybo.com*/


var Jellybo = Jellybo || {checkVersion: function (v) {
        if (!Jellybo.version) {
            console.log("Jellybo ERROR:  The JellyboBase library (jellybo-base.min.js) is required !");
        }
    }};

Jellybo.CloseIcon3 = function ($, Snap, mina) {
    var defaultSettings = {
        size: 70,
        stroke: 3,
        stroke2: 3,
        color: "#fff",
        color2: "#ccc"
    };
    var eventsNames = {
    };
    var eventNamesArray = [];
    Jellybo.Helpers.init(eventNamesArray, eventsNames);
    return function (e, c_settings) {
        var settings = {};
        $.extend(settings, defaultSettings);
        Jellybo.Helpers.extendArrayExcept(settings, c_settings, eventNamesArray);
        var $parentElem, $svgElem;
        var width = settings.size, height = settings.size, stroke = settings.stroke,
                stroke2 = settings.stroke2, sh = stroke / 2, color = settings.color, color2 = settings.color2,
                duration = 200, duration2 = 200, duration3 = 100, hoverAnim = settings.hoverAnim,
                $circle, $circle2, $line1, $line2, $line3, $line4, $line1Coords = {}, $line2Coords = {}, $line3Coords = {}, $line4Coords = {},
                $xCoords = {},
                cOff = .6, off = width * 0.29, off2 = width * 0.32, lineLen = width - (2 * sh) - off - off,
                lineOff = Math.sin(45 * Math.PI / 180) * (lineLen / 2), circleR = (width / 2) - sh,
                circleLen = 2 * circleR * Math.PI, circle2Len = 2 * (((width * cOff) / 2) - sh) * Math.PI,
                midX = width / 2, midY = height / 2, lineFullOff = Math.sin(45 * Math.PI / 180) * (circleR), lineFullLen = circleR * 2, lOff = 0.5;
        function drawHtml(e) {
            $parentElem = e;
            $parentElem = e;
            $parentElem.html("<div style=\"display: inline-block;\" class=\"jellyboMenuIcon006Wrapper\"><svg style=\"display: inline-block;\"></svg></div>");
            $svgElem = Snap($parentElem.find("svg")[0]);
            $svgElem.attr({
                width: width,
                height: height,
                style: "overflow: visible; cursor: pointer;"
            });
            $circle = $svgElem.circle(midX, midY, circleR);
            $circle.attr({
                stroke: color,
                fill: "none",
                strokeWidth: stroke,
                //strokeDasharray: "0px " + (circleLen ) + "px",
                //strokeLinecap: "round"
            });
            var a = lOff * lineFullLen, b = lineFullLen - a;
            $line1Coords.start = [midX + lineFullOff, midY + lineFullOff];
            $line1Coords.end = [midX - lineFullOff, midY - lineFullOff];
            $line1 = $svgElem.line($line1Coords.start[0], $line1Coords.start[1], $line1Coords.end[0], $line1Coords.end[1]);
            $line1.attr({
                stroke: color, fill: 'none', strokeWidth: stroke2, strokeLinecap: "round", strokeDasharray: a + "px " + b + "px", strokeDashoffset: (-(lineFullLen * ((1 - lOff) / 2))) + "px"
            });
            $line2Coords.start = [midX - lineFullOff, midY + lineFullOff];
            $line2Coords.end = [midX + lineFullOff, midY - lineFullOff];
            $line2 = $svgElem.line($line2Coords.start[0], $line2Coords.start[1], $line2Coords.end[0], $line2Coords.end[1]);
            $line2.attr({
                stroke: color, fill: 'none', strokeWidth: stroke2, strokeLinecap: "round", strokeDasharray: a + "px " + b + "px", strokeDashoffset: (-(lineFullLen * ((1 - lOff) / 2))) + "px"
            });
        }
        var $rotationState = 0;
        var $rotationRun = 0;
        var $rotation = 0;
        function startAnim(next) {
            var a = lOff * lineFullLen;
            Snap.animate(0, 1, function (value) {
                var v, f, o;
                v = a;
                f = (lineFullLen + 1 + ((lineFullLen * (lOff)))) - v;
                o = Jellybo.Helpers.calculatePosition((-(lineFullLen * ((1 - lOff) / 2))), -lineFullLen, value);
                $line1.attr({
                    strokeDasharray: v + "px " + f + "px",
                    strokeDashoffset: o + "px"
                });
            }, duration, mina.easeinout, function () {
                Jellybo.Helpers.hideSvg($line1);
            });
            setTimeout(function () {
                Snap.animate(0, 1, function (value) {
                    var v, f, o;
                    v = a;
                    f = (lineFullLen + 1 + ((lineFullLen * (lOff)))) - v;
                    o = Jellybo.Helpers.calculatePosition((-(lineFullLen * ((1 - lOff) / 2))), -lineFullLen, value);
                    $line2.attr({
                        strokeDasharray: v + "px " + f + "px",
                        strokeDashoffset: o + "px"
                    });
                }, duration, mina.easeinout, function () {
                    Jellybo.Helpers.hideSvg($line2);
                    setTimeout(function () {
                        Jellybo.Helpers.showSvg($line1);
                        var a = lOff * lineFullLen;
                        Snap.animate(0, 1, function (value) {
                            var v, f, o;
                            v = a;
                            f = (lineFullLen + 1 + ((lineFullLen * (lOff)))) - v;
                            o = Jellybo.Helpers.calculatePosition(((lineFullLen * (lOff))), -((lineFullLen * (lOff / 2))), value);
                            $line1.attr({
                                strokeDasharray: v + "px " + f + "px",
                                strokeDashoffset: o + "px"
                            });
                        }, duration, mina.easeinout, function () {                            
                        });
                        setTimeout(function () {
                            Jellybo.Helpers.showSvg($line2);
                            Snap.animate(0, 1, function (value) {
                                var v, f, o;
                                v = a;
                                f = (lineFullLen + 1 + ((lineFullLen * (lOff)))) - v;
                                o = Jellybo.Helpers.calculatePosition(((lineFullLen * (lOff))), -((lineFullLen * (lOff / 2))), value);
                                $line2.attr({
                                    strokeDasharray: v + "px " + f + "px",
                                    strokeDashoffset: o + "px"
                                });
                            }, duration, mina.easeinout, function () {
                                next();
                            });
                        }, duration3);
                    }, duration2);
                });
            }, duration3);

        }
        function endAnim(next) {
            next();
        }
        function openCircle() {
            $rotationRun = 1;
            $rotationState = 1;
            var animFn = startAnim;
            animFn(function () {
                $rotationState = 2;
                $rotationRun = 0;
                if ($rotation === 0) {
                    closeCircle();
                }
            });
        }
        function startRotationAnim() {
            if ($rotationRun === 0) {
                $rotationRun = 1;
                $rotation = 1;
                openCircle();
            } else {
                $rotation = 1;
            }
        }
        function closeCircle() {
            $rotationRun = 1;
            $rotationState = 3;
            var animFn = endAnim;
            animFn(function () {
                $rotationState = 0;
                $rotationRun = 0;
                if ($rotation === 1) {
                    startRotationAnim();
                }
            });
        }
        function endRotationAnim() {
            $rotation = 0;
            if ($rotationRun === 0) {
                $rotationRun = 1;
                if ($rotationState === 2) {
                    closeCircle();
                } else {
                    openCircle();
                }
            }
        }
        function eventsOn() {
            $parentElem.mouseenter(function () {
                startRotationAnim();
            }).mouseleave(function () {
                endRotationAnim();
            });
        }
        function eventsOff() {

        }
        return {
            init: function () {
                drawHtml(e);
                eventsOn();
            },
            settings: Jellybo.Helpers.settingsHelper(settings, eventNamesArray, $parentElem)
        };
    };
}($, Snap, mina);
Jellybo.BootLoader({
    pluginName: "jellyboCloseIcon003",
    animationFactory: Jellybo.CloseIcon3,
    publicFunctions: [],
    selector: ".jellybo-CloseIcon003",
    settingAttributes: ["color", "size", "stroke", "stroke2"]
});
Jellybo.Helpers.addCss("");
