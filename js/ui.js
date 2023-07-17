/* 
Altimeter Practice (https://github.com/kj7rrv/altimeter-practice)
By Samuel Sloniker (sam@kj7rrv.com)
 
Based on  Skyhawk Flight Instruments (https://github.com/uw-ray/Skyhawk-Flight-Instruments)
By Raymond Blaga (raymond.blaga@gmail.com), Edward Hanna (edward.hanna@senecacollege.ca), Pavlo Kuzhel (pavlo.kuzhel@senecacollege.ca)
 
Forked from jQuery Flight Indicators (https://github.com/sebmatton/jQuery-Flight-Indicators)
By Sébastien Matton (seb_matton@hotmail.com)

Published under GPLv3 License.
*/

function Altimeter(placeholder) {
    var built = true,
    settings = {
        size : 400,
        altitude : 0,
        pressure : 29.92,
        img_directory : 'img/'
    } 

    // Altimeter - Set altitude
    function _setAltitude(altitude){
        var hand100 = altitude / 1000 * 360
        var hand1000 = altitude / 10000 * 360
        var hand10000 = altitude / 100000 * 360
        placeholder.querySelector('div.altimeter_hand100').style['transform'] = 'rotate(' + hand100 + 'deg)'
        placeholder.querySelector('div.altimeter_hand1000').style['transform'] = 'rotate(' + hand1000 + 'deg)'
        placeholder.querySelector('div.altimeter_hand10000').style['transform'] = 'rotate(' + hand10000 + 'deg)'
    }

    // Altimeter - Set pressure
    function _setPressure(pressure, milibar){

        var pressure1 = 0, pressure2 = 0
        // pressure1: 5 units = 9 degrees
        // pressure2: 0.1 units = 6 degrees

        if (pressure >= 27.1 && pressure <= 33) {
            pressure1 = (925 - 33.8639 * pressure) * 1.8
            pressure2 = (pressure - 27.1) * 60
        }

        placeholder.querySelector('div.altimeter_pressurembar').style['transform'] = 'rotate(' + pressure1 + 'deg)'
        placeholder.querySelector('div.altimeter_pressureinhg').style['transform'] = 'rotate(' + -pressure2 + 'deg)'
    }

    // Set size of instrument
    function _resize(size){
        var sz = (size < 100) ? sz = 100 : sz = size
        placeholder.querySelector("div.instrument").style["height"] = sz + "px"
        placeholder.querySelector("div.instrument").style["width"] = sz + "px"
    }

    // Creation of the instrument
    placeholder.innerHTML = '<div class="instrument altimeter"><div class="indicator_background"><img src="' + settings.img_directory + 'indicator_background_dashboard.svg" class="box" alt="" /></div><div class="indicator_background_screws"><img src="' + settings.img_directory + 'indicator_background_screws.svg" class="box" alt="" /></div><div class="indicator_inner"><div class="altimeter_pressureinhg box"><img src="' + settings.img_directory + 'altimeter_pressure_inhg.svg" class="box" alt="" /></div><div class="altimeter_pressurembar box"><img src="' + settings.img_directory + 'altimeter_pressure_mbar.svg" class="box" alt="" /></div><div class="altimeter_background box"><img src="' + settings.img_directory + 'altimeter_background.svg" class="box" alt="" /></div><div class="altimeter_hand10000 box"><img src="' + settings.img_directory + 'altimeter_hand_10000ft.svg" class="box" alt="" /></div><div class="altimeter_foreground box"><img src="' + settings.img_directory + 'altimeter_foreground.svg" class="box" alt="" /></div><div class="altimeter_hand1000 box"><img src="' + settings.img_directory + 'altimeter_hand_1000ft.svg" class="box" alt="" /></div><div class="altimeter_hand100 box"><img src="' + settings.img_directory + 'altimeter_hand_100ft.svg" class="box" alt="" /></div></div><div class="indicator_foreground"><img src="' + settings.img_directory + 'indicator_foreground.svg" class="box" alt="" /></div></div>'
    _setAltitude(settings.altitude)
    _setPressure(settings.pressure)

    _resize(settings.size);

    // Public methods
    this.setAltitude = function(altitude){_setAltitude(altitude)}
    this.setPressure = function(pressure, milibar){_setPressure(pressure, milibar)}
    this.resize = function(size){_resize(size)}
    return built
}

const main = document.querySelector("#main")
const settings = document.querySelector("#settings")
const main_link = document.querySelector("#main-link")
const settings_link = document.querySelector("#settings-link")
const altimeter = new Altimeter(document.querySelector("#altimeter"))
const input = document.querySelector("#input")
const button = document.querySelector("#button")

main_link.addEventListener("click", function(e) {
    e.preventDefault()
    main.style["display"] = "block"
    settings.style["display"] = "none"
})

settings_link.addEventListener("click", function(e) {
    e.preventDefault()
    main.style["display"] = "none"
    settings.style["display"] = "block"
})

function getValue(key, defaults) {
    const stored = localStorage.getItem(key)
    return Number((stored === null)?defaults[key]:stored)
}

const defaults = {
    "minimum": -300,
    "maximum": 18000,
    "increment": 10,
    "margin": 0,
    "show-answers": 0
}

for (const key in defaults) {
    const element = document.getElementById(key)
    if (element.attributes.type.value == "checkbox") {
        element.checked = getValue(key, defaults)
        element.addEventListener("change", function(e) {
            localStorage.setItem(e.target.id, Number(e.target.checked))
        })
    } else {
        element.value = getValue(key, defaults)
        element.addEventListener("change", function(e) {
            localStorage.setItem(e.target.id, e.target.value)
        })
    }
}

function update() {
    const min = getValue("minimum", defaults)
    const max = getValue("maximum", defaults)
    const inc = getValue("increment", defaults)

    const alt = Math.round(Math.random()**3 * (max - min) / inc) * inc + min
    altimeter.setAltitude(alt)
    return alt
}

let altitude = update()

button.addEventListener("click", function(e){
    e.preventDefault()
    if (altitude - getValue("margin", defaults) <= input.value && input.value <= altitude + getValue("margin", defaults)) {
        input.classList = ["correct"]
        setTimeout(function(){
            altitude = update()
            input.value = ""
            input.classList = []
        }, 1000)
    } else {
        input.classList = ["incorrect"]
        if (getValue("show-answers", defaults)) {
            input.value = altitude
        } else {
            setTimeout(function(){
                input.value = ""
                input.classList = []
            }, 1000)
        }
    }
})
