const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

let transporter;

if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
  nodemailer.createTestAccount((err, account) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
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
        const testMessageUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL: %s', testMessageUrl); // eslint-disable-line no-console
        return resolve({
          message: 'Test mode. Preview email at: '+testMessageUrl,
          url: testMessageUrl,
        });
      }

      return resolve({
        message: 'Email sent! Check your inbox and click the link in the email to log in.'
      });
    });
  }
});

module.exports = {
  sendLoginToken: (to, id, token) => {
    const body = `
To log into Check One Two, click here: 
${process.env.APP_URI}/login/${id}/${token}
`;
    return send(to, 'Log in to Check One Two', body);
  },
  sendFailedCheck: (to, check, site, group) => {
    const body = `
A check on ${site.name} in group ${group.name} has the following failing items:

${check.items.map((item) => {
  if (item.status === 'pass') return '';
  return `Name: ${item.name} - Status: ${item.status}
Notes: ${item.notes}`;
})}

The check was completed by ${check.submitted_by} on ${moment(check.created_at).tz('Australia/Sydney')}.

View the check at ${process.env.URI}/checks/${check.id}
`;
    return send(to, `Check failed on ${site.name} - ${group.name}`, body);
  },
};
