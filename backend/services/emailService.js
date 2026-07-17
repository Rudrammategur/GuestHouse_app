const nodemailer = require("nodemailer");

let transporter;

async function initializeTransporter() {

    const testAccount =
        await nodemailer.createTestAccount();

    console.log("Ethereal User:", testAccount.user);
    console.log("Ethereal Password:", testAccount.pass);

    transporter = nodemailer.createTransport({

        host: "smtp.ethereal.email",
        port: 587,

        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }

    });

}

async function sendEmail(
    to,
    subject,
    html
) {

    if (!transporter) {

        await initializeTransporter();

    }

    const info =
        await transporter.sendMail({

            from: '"Guest House System" <rudrammategur5@gmail.com>',
            to,
            subject,
            html

        });

    console.log(
        "Preview URL:",
        nodemailer.getTestMessageUrl(info)
    );

}

module.exports = {
    sendEmail
};