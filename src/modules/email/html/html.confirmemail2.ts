const VerifyEmailCodeHTML = (code: string): string => {
  return `<div style="background-color: #e3f2fd; padding: 40px; font-family: 'Segoe UI', sans-serif; color: #0d47a1;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15); border: 1px solid #90caf9;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="NextMerce Logo" width="60" style="margin-bottom: 10px;" />
          <h2 style="margin: 0; color: #1565c0;">Verify Your Email</h2>
          <p style="font-size: 14px; color: #1976d2;">Secure your account with a verification code</p>
        </div>
  
        <!-- Greeting -->
        <p style="font-size: 16px; line-height: 1.6;">
          Hello there 👋,
        </p>
  
        <p style="font-size: 16px; line-height: 1.6;">
          To complete your email verification for <strong>NextMerce</strong>, please use the code below:
        </p>
  
        <!-- Code Section -->
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; margin-bottom: 10px; color: #1565c0;">Your verification code is:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0d47a1; margin: 0;">
            ${code}
          </p>
        </div>
  
        <p style="font-size: 14px; color: #1565c0;">
          This code is valid for a limited time. Please enter it promptly to verify your email address.
        </p>
  
        <hr style="border: none; border-top: 1px solid #bbdefb; margin: 40px 0;">
  
        <!-- Footer -->
        <p style="font-size: 13px; color: #1976d2;">
          If you didn’t request this email, you can safely ignore it.
        </p>
        <p style="font-size: 13px; color: #1976d2;">
          Best regards,<br />
          <strong>NextMerce Team</strong>
        </p>
  
        <div style="text-align: center; font-size: 12px; color: #90a4ae; margin-top: 30px;">
          <p>© ${new Date().getFullYear()} NextMerce. All rights reserved.</p>
        </div>
      </div>
    </div>`;
};

export default VerifyEmailCodeHTML;
