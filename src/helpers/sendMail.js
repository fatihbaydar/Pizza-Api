"use strict"

const nodemailer = require('nodemailer')

module.exports = function (to, title, message) {

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
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"fatihbaydar2004@gmail.com",
            pass:"gorc mayj kltq wvpx"
        }
    })

    //* YandexMail (yandex)
    // const transporter = nodemailer.createTransport({
    //     service: 'yandex',
    //     auth: {
    //         user: 'test@yandex.com',
    //         pass: '11' // your email-password
    //     }
    // })

    transporter.sendMail({ 
        to: to,
        subject: title,
        text: message,
        html: message
    }, function (error, success) {
        success ? console.log("SUCCESS:", success) : console.log("ERROR:", error)
    }) 
}