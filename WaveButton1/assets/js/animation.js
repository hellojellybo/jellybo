var Jellybo = Jellybo || {checkVersion: function (v) {
        if (!Jellybo.version) {
            console.log("Jellybo ERROR:  The JellyboBase library (jellybo-base.min.js) is required !");
        }
    }};


Jellybo.WaveButton1 = function ($, Snap, mina) {
    var defaultSettings = {
        width: 250, 
        height: 50,
        size: 70,
        stroke: 5,
        stroke2: 2,
        color: "rgb(109,25,225)",
        color2: "#fff",
        text: "Explore",
        schema: 0,
        t1: -110, 
        t2: -85,
        no_border: false
    };
    var eventsNames = {
    };
    var eventNamesArray = [];
    Jellybo.Helpers.init(eventNamesArray, eventsNames);
    return function (e, c_settings) {
        var settings = {};
        $.extend(settings, defaultSettings);
        Jellybo.Helpers.extendArrayExcept(settings, c_settings, eventNamesArray);
        var $parentElem, $textElem, $svgElem, $jsvgElem, $path, $wElem, schema = settings.schema, 
                width = settings.width, ww = 800*width / 300,
                height = settings.height, hh = 500*height / 65,
                t1 = settings.t1*height / 65,
                text = settings.text, color=settings.color,color2=settings.color2,
                t2 = settings.t2*height / 65, iconHelper, duration = 900;
        var d1 = "M 0 "+hh+" L 0 "+(height*250/65)+" C "+(ww/2)+" "+(height*350/65)+" "+(ww/2)+" "+(height*200/65)+" "+ww+" "+(height*250/65)+" L "+ww+" "+hh+" ";
        var d2 = "M 0 "+hh+" L 0 "+(height*270/65)+" C "+(ww/2)+" "+(height*200/65)+" "+(ww/1.7)+" "+(height*350/65)+" "+ww+" "+(height*270/65)+" L "+ww+" "+hh+" ";
        function drawHtml(e) {
            $parentElem = e;
            $parentElem.html('<div class="jellyboWaveBtn1-wrapper"><div class="jellyboWaveBtn1-inner"><svg viewBox="0 0 '+ww+' '+hh+'" ></svg><div class="jellyboWaveBtn1-innerTable"><span class="jellyboWaveBtn1-text"></span></div></div></div>');
            $jsvgElem = $parentElem.find("svg");
            $svgElem = Snap($jsvgElem[0]);
            $jsvgElem.css({transform: "translate(0px," + t1 + "px)", fill: color});
            $path = $svgElem.path(d1);            
            $textElem = $parentElem.find(".jellyboWaveBtn1-text");
            $textElem.text(text);
            $textElem.css({color:color2});
            $wElem = $parentElem.find(".jellyboWaveBtn1-wrapper");
            $wElem.css({ width: width, height: height});
            if(!settings.no_border){
                $wElem.css({borderColor:color});
            }else{
                $wElem.css({border:"0"});
            }
            iconHelper = Jellybo.Helpers.iconHelper1($parentElem, open, close);
        }
        var $loop = 0;
        var $loopIter = 0;
        var $isLoop = 0;
        function startLoop() {
            $loop = 1;
            if ($isLoop === 0) {
                $isLoop = 1;
                var d = $loopIter % 2 === 0 ? d2 : d1;
                $path.animate({d: d}, duration, mina.easeinout, function () {
                    $loopIter++;
                    $isLoop = 0;
                    if ($loop === 1) {
                        startLoop();
                    }
                });
            }
        }
        function stopLoop() {
            $loop = 0;
        }
        var calc = Jellybo.Helpers.calculatePosition;
        function killableAnim(fn, d, ease, fin) {
            var isAlive = 1;
            Snap.animate(0, 1, function (value) {
                if (isAlive) {
                    fn(value);
                }
            }, d, ease, function () {
                if (isAlive) {
                    fin();
                }
            });
            return {
                kill: function () {
                    isAlive = 0;
                }
            };
        }
        var closeAnim = null;
        var t = t1;
        function open(next) {
            if (closeAnim) {
                closeAnim.kill();
            }
            var t0 = t;
            Snap.animate(0, 1, function (value) {
                t = calc(t0, t2, value);
                $jsvgElem.css({transform: "translate(0px," + t + "px)"});
            }, 500, mina.easeinout, function () {
                next();
            });
            startLoop();
        }
        function close(next) {
            var t0 = t;
            closeAnim = killableAnim(function (value) {
                t = calc(t0, t1, value);
                $jsvgElem.css({transform: "translate(0px," + t + "px)"});
            }, 2500, mina.easeinout, function () {
                stopLoop();
            });
            next();
        }
        return {
            init: function () {
                drawHtml(e);
                iconHelper.eventsOn();
            },
            settings: Jellybo.Helpers.settingsHelper(settings, eventNamesArray, $parentElem)
        };
    };
}($, Snap, mina);
Jellybo.BootLoader({
    pluginName: "jellyboWaveButton001",
    animationFactory: Jellybo.WaveButton1,
    publicFunctions: [],
    selector: ".jellybo-WaveButton001",
    settingAttributes: ["no_border","color", "color2", "width", "height", "text"]
});
