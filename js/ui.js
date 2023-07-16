/* 
Altimeter Practice (https://github.com/kj7rrv/altimeter-practice)
By Samuel Sloniker (sam@kj7rrv.com)
 
Based on  Skyhawk Flight Instruments (https://github.com/uw-ray/Skyhawk-Flight-Instruments)
By Raymond Blaga (raymond.blaga@gmail.com), Edward Hanna (edward.hanna@senecacollege.ca), Pavlo Kuzhel (pavlo.kuzhel@senecacollege.ca)
 
Forked from jQuery Flight Indicators (https://github.com/sebmatton/jQuery-Flight-Indicators)
By Sébastien Matton (seb_matton@hotmail.com)

Published under GPLv3 License.
*/

(function($) {

    "use strict";

    function Altimeter( placeholder, options ) {

        var built = true,
        settings = $.extend({
            size : 400,
            altitude : 0,
            pressure : 30,
            img_directory : 'img/'
            }, options 
        )

        // Altimeter - Set altitude
        function _setAltitude(altitude){
            var hand100 = altitude / 1000 * 360;
            var hand1000 = altitude / 10000 * 360;
            var hand10000 = altitude / 100000 * 360;
            placeholder.each(function(){
                $(this).find('div.instrument.altimeter div.altimeter_hand100').css('transform', 'rotate(' + hand100 + 'deg)');
                $(this).find('div.instrument.altimeter div.altimeter_hand1000').css('transform', 'rotate(' + hand1000 + 'deg)');
                $(this).find('div.instrument.altimeter div.altimeter_hand10000').css('transform', 'rotate(' + hand10000 + 'deg)');
            });    
        }

        // Altimeter - Set pressure (by default inHg; set milibar to true if you wish to use mbar)
        function _setPressure(pressure, milibar){

            var pressure1 = 0, pressure2 = 0;
            // pressure1: 5 units = 9 degrees
            // pressure2: 0.1 units = 6 degrees

            if (milibar !== true) {
                if (pressure >= 27.1 && pressure <= 33) {
                    pressure1 = (925 - 33.8639 * pressure) * 1.8;
                    pressure2 = (pressure - 27.1) * 60;
                }
            } else {
                if (pressure >= 925 && pressure <= 1120) {
                    pressure1 = (925 - pressure) * 1.8;
                    pressure2 = (pressure * 0.0295300 - 27.1) * 60;
                }
            }

            placeholder.each(function(){
                $(this).find('div.instrument.altimeter div.altimeter_pressurembar').css('transform', 'rotate(' + pressure1 + 'deg)');
            });    
            placeholder.each(function(){
                $(this).find('div.instrument.altimeter div.altimeter_pressureinhg').css('transform', 'rotate(' + -pressure2 + 'deg)');
            });            

        }

        // Set size of instrument
        function _resize(size){
            var sz = (size < 100) ? sz = 100 : sz = size;
            placeholder.each(function(){
                $(this).find('div.instrument').css({height : sz, width : sz});
            });
        }

        // Creation of the instrument
        placeholder.each(function(){
            $(this).html('<div class="instrument altimeter"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="indicator_inner"><div class="altimeter_pressureinhg box"><img src="' + settings.img_directory + 'altimeter_pressure_inhg.svg" class="box" alt="" /></div><div class="altimeter_pressurembar box"><img src="' + settings.img_directory + 'altimeter_pressure_mbar.svg" class="box" alt="" /></div><div class="altimeter_background box"><img src="' + settings.img_directory + 'altimeter_background.svg" class="box" alt="" /></div><div class="altimeter_hand10000 box"><img src="' + settings.img_directory + 'altimeter_hand_10000ft.svg" class="box" alt="" /></div><div class="altimeter_foreground box"><img src="' + settings.img_directory + 'altimeter_foreground.svg" class="box" alt="" /></div><div class="altimeter_hand1000 box"><img src="' + settings.img_directory + 'altimeter_hand_1000ft.svg" class="box" alt="" /></div><div class="altimeter_hand100 box"><img src="' + settings.img_directory + 'altimeter_hand_100ft.svg" class="box" alt="" /></div></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>');
            _setAltitude(settings.altitude);
            _setPressure(settings.pressure);

            _resize(settings.size);
        });

        // Public methods
        this.setAltitude = function(altitude){_setAltitude(altitude);}
        this.setPressure = function(pressure, milibar){_setPressure(pressure, milibar);}
        this.resize = function(size){_resize(size);}
        return built;
    };

    // Extension to jQuery
    $.altimeter = function(placeholder, options){
        var altimeter = new Altimeter($(placeholder), options);
        return altimeter;
    };

    $.fn.altimeter = function(data, options){
        return this.each(function(){
            $.altimeter(this, options);
        });
    };

}( jQuery ));

const altimeter = $.altimeter('#altimeter')
const input = document.querySelector("#input")
const button = document.querySelector("#button")

function update(min, max, inc) {
    const alt = Math.round(Math.random()**3 * (max - min) / inc) * inc + min
    altimeter.setAltitude(alt)
    return alt
}

altimeter.setPressure(29.92)
let altitude = update(0, 18000, 10)

button.addEventListener("click", function(e){
    e.preventDefault()
    if (input.value == altitude) {
        input.classList = ["correct"]
        setTimeout(function(){
            altitude = update(0, 18000, 10)
            input.value = ""
            input.classList = []
        }, 1000)
    } else {
        input.classList = ["incorrect"]
        setTimeout(function(){
            input.value = ""
            input.classList = []
        }, 1000)
    }
})
