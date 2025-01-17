"use strict"

/*
    $ cp .env-sample .env
    $ npm init -y
    $ npm i express dotenv mongoose express-async-errors
    $ npm i morgan swagger-autogen swagger-ui-express redoc-express
    $ mkdir logs
    $ nodemon
*/
const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Logger:
app.use(require('./src/middlewares/logger'))

// Auhentication:
app.use(require('./src/middlewares/authentication'))

// findSearchSortPage / res.getModelList:
app.use(require('./src/middlewares/queryHandler'))

//* EMAIL *NODEMAILER

// const nodemailer = require('nodemailer')

// nodemailer.createTestAccount().then((data => console.log(data)))

// // Connection to MailServer/SMTP:
// const transporter = nodemailer.createTransport({
//     // SMTP
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "wsirtieron5opxi2@ethereal.email",
//         pass: "u2CzpRa2S7wWC9TASq"
//     }
// })
//   console.log(transporter)

// // SendMail
// transporter.sendMail({
//     from: "wsirtieron5opxi2@ethereal.email",
//     to: "fatihbaydar2004@gmail.com",
//     subject: "Hello",
//     text: "Hello. Welcome to our website...",
//     html: "<h3>Hello. Welcome to our website...</h3><p>How are you?</p>"
// }, function (error, success) {
//     success ? console.log("SUCCESS:", success) : console.log("ERROR:", error)
// })


//* GoogleMail
// Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:"fatihbaydar2004@gmail.com",
//         pass:"gorc mayj kltq wvpx"
//     }
// })

//* YandexMail (yandex)
// const transporter = nodemailer.createTransport({
//     service: 'yandex',
//     auth: {
//         user: 'test@yandex.com',
//         pass: '11' // your email-password
//     }
// })

// transporter.sendMail({ 
//     to: "fatihbaydar2004@gmail.com",
//     subject: "Hello",
//     text: "Hello. Welcome to our website...",
//     html: "<h3>Hello. Welcome to our website...</h3><p>How are you?</p>"
// }, function (error, success) {
//     success ? console.log("SUCCESS:", success) : console.log("ERROR:", error)
// }) 

/* ------------------------------------------------------- */
// Routes:

// routes/index.js:
app.use('/', require('./src/routes/'))

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to PIZZA API',
        docs: {
            swagger: "/documents/swagger",
            redoc: "/documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
})

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clears database.