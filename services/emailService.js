const transporter = require('../config/email');

class EmailService {
  static async sendNotification(contactData) {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@gntind.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;