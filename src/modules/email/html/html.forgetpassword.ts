const ForgotPasswordEmailHTML = (resetUrl: string): string => {
  return `<div style="background-color: #e3f2fd; padding: 40px; font-family: 'Segoe UI', sans-serif; color: #0d47a1;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15); border: 1px solid #90caf9;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="NextMerce Logo" width="60" style="margin-bottom: 10px;" />
          <h2 style="margin: 0; color: #1565c0;">Password Reset Request</h2>
          <p style="font-size: 14px; color: #1976d2;">NextMerce - Smart eCommerce Platform</p>
        </div>
  
        <!-- Greeting -->
        <p style="font-size: 16px; line-height: 1.6;">
          Hello there 👋,
        </p>
  
        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset the password for your <strong>NextMerce</strong> account.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If you request a password reset, please click the button below to confirm your request:
        </p>
          <!-- Confirm Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" style="background-color: #1976d2; color: white; padding: 14px 30px; font-size: 16px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ✔️ Confirm reset password
        </a>
      </div>
  
        <hr style="border: none; border-top: 1px solid #bbdefb; margin: 40px 0;">
  
        <!-- Footer -->
        <p style="font-size: 13px; color: #1976d2;">
          If you didn’t request a password reset, you can safely ignore this email.
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

export default ForgotPasswordEmailHTML;
