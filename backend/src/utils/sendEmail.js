const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #1e293b; }
            .container { max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; }
            .header { padding: 32px 0; text-align: center; border-bottom: 1px solid #f1f5f9; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; background: linear-gradient(to right, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { padding: 40px 32px; text-align: center; }
            .lock-icon { background-color: #eef2ff; color: #4f46e5; width: 48px; height: 48px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; font-size: 24px; }
            .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
            .text { font-size: 15px; line-height: 1.6; color: #64748b; margin-bottom: 32px; }
            .otp-container { background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 32px; display: inline-block; min-width: 200px; }
            .otp-code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #4f46e5; letter-spacing: 8px; margin: 0; }
            .warning { font-size: 13px; color: #94a3b8; background-color: #f8fafc; padding: 12px; border-radius: 8px; display: inline-block; }
            .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
            .footer-links { margin-bottom: 12px; }
            .footer-link { color: #64748b; text-decoration: none; margin: 0 8px; }
        </style>
    </head>
    <body style="background-color: #f4f6f8; padding: 20px;">
        <div class="container">
            <div class="header">
                <h1>InvoicePro</h1>
            </div>
            <div class="content">
                <div class="lock-icon">🔒</div>
                <div class="title">Verification Required</div>
                <p class="text">Please use the following One-Time Password (OTP) to verify your account. This code is valid for 5 minutes.</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                </div>
                
                <div class="warning">
                    Don't share this code with anyone. <br>
                    Our team will never ask for it.
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} InvoicePro. All rights reserved.</p>
                <p>123 Business Street, Tech City, TC 90210</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"InvoicePro Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Your Verification Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`, // Fallback for clients rendering only text
        html: htmlTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendOTP;
