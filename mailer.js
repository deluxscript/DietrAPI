// const { SMTP_URL } = process.env;
const nodemailer = require('nodemailer');

const defaultEmail = {from: 'deluxscript@gmail.com'};

const sendEmail = (emailResponse) => {
    const completeEmailData= Object.assign(defaultEmail, emailResponse);
    // const transporter = nodemailer.createTransport(SMTP_URL);
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'luphq7pzyzmca5d4@ethereal.email',
            pass: 'dPE4cu1nnWxed8tBUN'
        }
    });

    return transporter
        .sendMail(completeEmailData)
        .then(info => console.log('Message sent'))
        .catch(err => console.log('Problem Sending email'));
}


module.exports = {
    sendEmail: sendEmail
}