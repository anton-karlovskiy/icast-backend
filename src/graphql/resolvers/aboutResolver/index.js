
import nodemailer from 'nodemailer';

const aboutResolver = {
  Mutation: {
    createContactUs: (_, { contactUsInfo }, __) => {
      try {
        console.log('[src graphql resolvers aboutResolver createContactUs] contactUsInfo => ', contactUsInfo);
        // const sendmail = require('sendmail')();

        // sendmail({
        //     from: process.env.SERVICE_GMAIL,
        //     to: process.env.CONTACT_US_EMAIL,
        //     subject: `Contact from ICast`,
        //     html: `<h2>Contact details</h2><br>
        //             <h3>name: ${contactUsInfo.username}</h3><br>
        //             <h3>email: ${contactUsInfo.email}</h3><br>
        //             <h3>phone number: ${contactUsInfo.phoneNumber}</h3><br>
        //             <h3>message: ${contactUsInfo.message}</h3><br>`
        //   }, function(error, reply) {
        //     if (error) {
        //       console.log('[src graphql resolvers aboutResolver createContactUs] error => ', error);
        //       return false;
        //     }
        //     console.log('[src graphql resolvers aboutResolver createContactUs] email sent => ', info.response, repl);
        //     return true;
        // });
        const transporter = nodemailer.createTransport({
          service: 'smtp.gmail.com',
          auth: {
            user: process.env.SERVICE_GMAIL,
            pass: process.env.SERVICE_GMAIL_PASS
          }
        });
        const mailOptions = {
          from: process.env.SERVICE_GMAIL,
          to: process.env.CONTACT_US_EMAIL,
          text: 'Contact from ICast',
          subject: `Contact from ICast`,
          html: `<h2>Contact details</h2><br>
                  <h3>name: ${contactUsInfo.username}</h3><br>
                  <h3>email: ${contactUsInfo.email}</h3><br>
                  <h3>phone number: ${contactUsInfo.phoneNumber}</h3><br>
                  <h3>message: ${contactUsInfo.message}</h3><br>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('[src graphql resolvers aboutResolver createContactUs] error => ', error);
            return false;
          } else {
            console.log('[src graphql resolvers aboutResolver createContactUs] email sent => ', info.response);
            return true;
          }
        });
      } catch (error) {
        console.log('[src graphql resolvers aboutResolver createContactUs] error => ', error);
        return false;
      }
    }
  }
};

export default aboutResolver;
