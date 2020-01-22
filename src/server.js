/*
npm i request@2.88.0
For testing: 
    nodemon src/app.js -e js, hbs
    ==> all changes in files with suffix js or hbs will force nodemon to restart.

Templates are in templates/views folder  and  Partial templates are in templates/partials
Use app.set() to set views folder path   and  hbs.registerPartials() to set partials folder path
hbs template: {{varName}}                and  hbs partial template: {{>partialTemplare}}
*/

// Express server

// Require zone
const path = require('path')
const express = require('express')
const hbs = require('hbs')

// Copy dir Utils from weather-app to web-server/src
// Impoer geocode and forecast objects
const geocode = require('./Utils/geocode')
const forecast = require('./Utils/forecast')

const app = express()
// Heroku provides process.env.PORT
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public')     
const viewsPath = path.join(__dirname, '../templates/views')    
const partialsPath = path.join(__dirname, '../templates/partials')   

// Dynamic template ==> hbs.js(handlebars.js)
// Setup handlebars engine and views location
app.set('view engine', 'hbs')   
app.set('views', viewsPath)     
hbs.registerPartials(partialsPath)

// Setup static/public folder
app.use(express.static(publicDirPath))

// Route handler are TOP DOWN executed 
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    })   
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })   
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Andrew Mead',
        msg: 'Need some help?'
    })   
})

// All router under /help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMsg: 'Help article not found!'
    })     
})


// The client.script calls this route !!!
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address!"
        })
    }

    // Use detructuring => {latitude, longitude, location} = {} 
    // Must assign a empty object as default value. 
    // Otherwise when the object is undefined, the destructuring failed! ==> the web server crashes. 
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
        
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            errors: "You must provide a search term!"
        })
    }
    console.log(req.query.search)
    res.send({
      products: []
    })
})


// Must be the last route => no route above found ==> error 404.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMsg: 'Page not found!'
    })   
})

// Start web server
app.listen(port, () => {
    console.log('Server is up on port' +  port + '!')
})   
