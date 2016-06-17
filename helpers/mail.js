  var mailer = require("nodemailer");
var path = require('path');

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "kanyaepic@gmail.com",
        pass: "1993@*4:11"
    }
});

function sendMail(to, body, name, id, callback){
  var html = '', subject = '';

  switch(body){
    case 0:
      link = "http://elancurry-dev.herokuapp.com/api/sendfile/"+id
      subject = "Elancurry - Forgot Password",
      html = "Hello " + name + ", <br> Please click <a href="+ link + ">here</a> to change your password";
      break;
  }

  var mail = {
      from: "VaaNanba TholKodu <noreply.vaananba@gmail.com>",
      to: to,
      subject: subject,
      html: html
  }

  smtpTransport.sendMail(mail, function(error, response){
      if(error){
          console.log(error);
          callback(1);
      } else{
          console.log("Mail sent: " + response.message);
          smtpTransport.close();
          callback(0);
      }
  });
}

exports.sendMail = sendMail;
