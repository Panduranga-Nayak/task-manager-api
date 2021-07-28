const mailgun = require("mailgun-js");

const DOMAIN = 'sandboxe99fe54b9a934c2aa31df540761b72bf.mailgun.org';
const api_key = process.env.SEND_API

const mg = mailgun({apiKey: api_key, domain: DOMAIN});

const sendWelcomeEmail = (email, name)=>{
    const data = {
        from: 'Excited User <me@samples.mailgun.org>',
        to: email,
        subject: 'Welcome to Task Manager',
        text: `Welcome to the app, ${name}. Let Me know how you get along with the app`
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
}

const sendCancellationEmail = (email, name)=>{
    const data = {
        from: '<me@samples.mailgun.org>',
        to: email,
        subject: 'We Are Sad To Let You Go',
        text: `We are sad to let you go, ${name}. Let us know why u left`
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}