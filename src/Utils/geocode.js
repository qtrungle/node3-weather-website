/*
How does Asynchronous call work???
Called function ==> Call Stack ==> Node API. 
At timeout:  EventLoop moves it from Node API to Callback Queue 
When Call Stack is empty: EventLoop move it from Callback Queue to Call Stack 
Note:
js is a single threaded programming language. 
However, js has a C++ thread behind the scene (EventLoop) to handle events

In more details:
The main() is sent to the Call Stack to be executed
Then the first function in main() is called -go to Call Stack
Below is the two scenarios:

I. Blocking functions
    ==> Call Stack ==> end of the execution

    1. js executes the function in Call Stack (LIFO) until the end.
    2. Then js pops it out of the Call Stack.

II. Non-Blocking call
    ==> Call Stack ==> Node API wait for timeout
        When timeout EventLoop ==> Callback Queue 
        When Call Stack is empty EventLoop ==> Call Stack ==> end of execution

    1. As the function is a non-bloking one, js moves it to the API stack.
        It stays there until timeout then js moves it to the Callback Queue 
    2. At the mean time js will execute next function in the main()
    3. When the last function in Call Stack is removed - it should be main()
    4. Then the EventLoop will move one function at a time in the Call Back Queue 
       to the Call Stack for execution.
    5. js executes and pops it out at the end of the execution
    6. If there's a function in the CallBack Queue, eventLoop moves it to the Callback Queue,
       for execution.
       Otherwise, the execution of the app ends here.
       
*/

// mapbox.com API convert Address to Long/Lat (qtr.. or yahoo acct/bb...). Same for darksky.com
// darksky secret key: 829b23e9d6c6300063dce2d4ad932e50
// darksky call: https://api.darksky.net/forecast/829b23e9d6c6300063dce2d4ad932e50/37.8267,-122.4233?key=value&otherkey=othervalue

const request = require('request')


// mapbox.com API convert Address to Long/Lat (qtr.. or yahoo acct/bb...)
const geocode = (address, callback) => {
    // url's components
    const token = '.json?access_token=pk.eyJ1IjoicXRydW5nbGUiLCJhIjoiY2s1a2JydmU1MGNraDNrb3Zrd3FoZjU4cSJ9.UAFh5FAcK8_Ohq40OdPLKQ'
    const params = '&limit=1'    // limit one location in response
    //If user enters special chars in address, the request will fail =>  encodeURIComponent(address) fix it. 
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + token + params

    request({ url: url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location services', undefined)   
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }

    })
}


module.exports = geocode