import { db } from "./dbService";

/**
 * MAIL SERVICE
 * 
 * In a pure client-side application (like this React app running in browser),
 * we CANNOT directly connect to an SMTP server due to browser security restrictions.
 * 
 * However, this service acts as the logic layer. In a production environment,
 * `sendMail` would make an HTTP POST request to your backend API (Node.js/Python/PHP)
 * which then handles the actual SMTP transmission.
 * 
 * For this implementation, we will:
 * 1. Validate the SMTP settings exist in DB.
 * 2. Simulate the network delay.
 * 3. Log the "Email" to the console so the admin/user can see the Link to click.
 */

interface MailOptions {
    to: string;
    subject: string;
    body: string;
}

export const sendMail = async (options: MailOptions): Promise<boolean> => {
    const settings = db.getSettings();
    
    // Check if SMTP is configured (Simulating backend check)
    if (!settings.smtpHost || !settings.smtpUser) {
        console.warn("SMTP settings missing. Please configure in Admin Dashboard.");
        // We proceed for demo purposes, but in real app this might fail.
    }

    console.group(`📧 Sending Email to: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Server: ${settings.smtpHost || 'Simulated Server'}`);
    console.log(`From: ${settings.smtpFrom || 'noreply@nanobanana.com'}`);
    console.log(`%c${options.body}`, "color: blue; font-weight: bold;");
    console.groupEnd();

    // Simulate Network Request
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 1500);
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    // In a real app, this URL points to your domain.
    // For local dev, it assumes localhost or current location.
    const baseUrl = window.location.origin;
    const resetLink = `${baseUrl}/?page=reset-password&token=${token}`;

    const body = `
    مرحباً،
    
    لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بحسابك في نانو بانانا.
    اضغط على الرابط التالي لتعيين كلمة مرور جديدة:
    
    ${resetLink}
    
    إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة.
    `;

    return sendMail({
        to: email,
        subject: 'استعادة كلمة المرور - نانو بانانا',
        body: body
    });
};

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const baseUrl = window.location.origin;
    const verifyLink = `${baseUrl}/?page=verify&token=${token}`;

    const body = `
    مرحباً ${name}،
    
    شكراً لتسجيلك في نانو بانانا. يرجى تفعيل حسابك بالضغط على الرابط أدناه:
    
    ${verifyLink}
    
    نتمنى لك تجربة ممتعة!
    `;

    return sendMail({
        to: email,
        subject: 'تفعيل الحساب - نانو بانانا',
        body: body
    });
};