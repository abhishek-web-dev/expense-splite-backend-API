const sgMail = require('@sendgrid/mail');

const sendGridAPIkey = process.env.emailApiKey;

sgMail.setApiKey(sendGridAPIkey);

const sendEmailFunction = (email,subject,message)=> {

    sgMail.send({
        to: email,
        from: 'abhidevproject@gmail.com',
        subject: subject,
        // text: ``,
        html: message,
    });

};


// call for testing
//sendEmailFunction('abhisheksuccess00@gmail.com','Abhishek','Welcome Email','');


module.exports = {
    sendEmailFunction: sendEmailFunction
};
