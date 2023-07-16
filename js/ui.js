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
