const nodemailer = require('nodemailer');

let transporter;

if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
      },
    });
  });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const send = (to, subject, body) => new Promise((resolve, reject) => {
  if (!transporter) {
    setTimeout(() => resolve(send(to, subject, body)), 500);
  } else {
    const opts = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: body,
    };

    transporter.sendMail(opts, (error, info) => {
      if (error) return reject(error);

      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // eslint-disable-line no-console
      }

      return resolve();
    });
  }
});

module.exports = {
  sendLoginToken: (to, id, token) => {
    const body = `
To log into Check One Two, click here: 
${process.env.URI}/v1/users/${id}/login?token=${token}
`;
    return send(to, 'Log in to Check One Two', body);
  },
};
