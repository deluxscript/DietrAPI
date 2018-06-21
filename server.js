const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const cors = require('cors');
const jwt = require("jsonwebtoken");
var waterfall = require('async-waterfall');
var crypto = require('crypto')


// Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const forgetpassword = require('./controllers/forgetpassword');
const sendEmail = require('./mailer.js')


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'delux',
        password: '',
        database: 'dietrdb'

    }
});

const randomString = length => {
    let text = '';
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789_-.";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const app = express();


//......................Start of Middleware.............................

app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });

//......................End of Middleware.............................


app.get("/", (req, res) => {
    res.send('this is dope');
})

app.post('/register', (req, res) => {register.registerHandler(req, res, db, bcrypt)})

app.post('/signin', (req, res) => {signin.signinHandler(req, res, db, bcrypt, jwt)})

app.put('/forgetpassword', (req, res) => {forgetpassword.forgetPasswordHandler(req, res, db, bcrypt, sendEmail, jwt, randomString, waterfall, crypto)})

// app.put('/forgetpassword', (req, res, sendEmail) => {
//     const { email } = req.body;
//     if(!req.body)
//         return res.status(400).json('No request body');
//     if(!email)
//         return res.status(400).json('No request body email');

//     const resettoken = randomString(40);
//     const emailResponse = {
//         to: email,
//         subject:  'Dietr Password reset',
//         text: `Kindly reset your password by following this link: localhost:3001/resetpassword/${resettoken}`,
//         html: `<p>Kindly reset your password by following this link:</p> <p>localhost:3001/resetpassword/${resettoken}</p>`,
//     };

//     return 
//         if(error)
//             return res.send(error);
//         else {
//             sendEmail(emailResponse);
//             return res.status(200).json('Email sent');
//         }
// })

app.listen(3001, () => {
    console.log('App is running on port 3001');
})
