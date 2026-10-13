export const otpEmailTemplate = (name: string, otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${name},</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
      <br />
      <p>— Personal Finance Tracker Team</p>
    </div>
  `;
};
