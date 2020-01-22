console.log('Client side JS file is loaded')

// document.querySelector('byName')
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')

// document.querySelector('#byElementID')
const msgOne = document.querySelector('#msg-1')
const msgTwo = document.querySelector('#msg-2')

// Also document.querySelector('.byClass')

// For testing: msgOne.textContent = 'From js script'

/*
Below e = event and e,preventDefault() ==> prevent the browser to refresh the page!!!
*/
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    /*
    This part is provide by route "/weather" in server app.js
    if (!location) {
        console.log('You must provide an address!')
    }
    */

    msgOne.textContent = 'Loading...'
    msgTwo.textContent = ''
    fetch('http://localhost:3000/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                msgOne.textContent = data.error
            } else {
                // console.log(data.location)
                // console.log(data.forecast)
                msgOne.textContent = data.location
                msgTwo.textContent = data.forecast
            }
        })
    })
})