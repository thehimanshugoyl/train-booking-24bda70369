/**
 * Service for sending real email & SMS OTPs with fallback developer simulation.
 */

interface SendOtpResult {
  success: boolean;
  message: string;
  delivered: boolean;
  previewOtp?: string;
}

export async function sendEmailOtp(
  email: string,
  otp: string,
  name?: string
): Promise<SendOtpResult> {
  const recipientName = name || "Passenger";
  console.log(`[GADDVYA EMAIL OTP] Sending OTP ${otp} to ${email} for ${recipientName}`);

  // 1. Check for Resend API Key (https://resend.com)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "GADDVYA <onboarding@resend.dev>",
          to: [email],
          subject: `${otp} is your GADDVYA Verification Code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1a16; color: #ffffff; padding: 32px; border-radius: 18px; border: 1px solid #1f473c;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <h1 style="color: #34d399; font-size: 26px; margin: 0; letter-spacing: 2px;">GADDVYA</h1>
              </div>
              <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Official Indian Railways Passenger Authentication Service</p>
              <div style="background: #153b31; border: 1px solid #245a4c; padding: 24px; border-radius: 14px; margin: 24px 0; text-align: center;">
                <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 12px;">Hello ${recipientName}, your verification code is:</p>
                <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #eec574; font-family: monospace;">${otp}</div>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 14px;">This code will expire in 10 minutes. Do not share it with anyone.</p>
              </div>
              <p style="color: #64748b; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} GADDVYA Indian Railways Reservation Systems.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        return {
          success: true,
          delivered: true,
          message: `Real verification email sent to ${email}`,
        };
      } else {
        const errorText = await res.text();
        console.warn("[Resend Error]", errorText);
      }
    } catch (err) {
      console.error("[Email Delivery Failed]", err);
    }
  }

  // 2. Check for Brevo API Key (Sendinblue)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "GADDVYA", email: process.env.EMAIL_FROM || "no-reply@gaddvya.com" },
          to: [{ email, name: recipientName }],
          subject: `${otp} is your GADDVYA Verification Code`,
          htmlContent: `<p>Your GADDVYA OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`,
        }),
      });

      if (res.ok) {
        return {
          success: true,
          delivered: true,
          message: `Real verification email sent via Brevo to ${email}`,
        };
      }
    } catch (err) {
      console.error("[Brevo Error]", err);
    }
  }

  // Developer simulation preview
  return {
    success: true,
    delivered: false,
    message: `Verification code generated for ${email}. (Add RESEND_API_KEY or SMTP credentials in .env.local for live inbox delivery).`,
    previewOtp: otp,
  };
}

export async function sendPhoneOtp(
  phone: string,
  otp: string
): Promise<SendOtpResult> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10); // Standard 10-digit Indian mobile
  console.log(`[GADDVYA SMS OTP] Sending OTP ${otp} to +91 ${cleanPhone}`);

  // 1. Fast2SMS API (Popular Indian SMS gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: cleanPhone,
        }),
      });

      const data = await res.json();
      if (data.return) {
        return {
          success: true,
          delivered: true,
          message: `SMS OTP delivered to +91 ${cleanPhone}`,
        };
      }
    } catch (err) {
      console.error("[Fast2SMS Error]", err);
    }
  }

  // 2. Twilio SMS Gateway
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");
      const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

      const params = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `[GADDVYA] ${otp} is your verification OTP for Indian Railways ticket booking. Valid for 10 minutes.`,
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (res.ok) {
        return {
          success: true,
          delivered: true,
          message: `SMS delivered via Twilio to +91 ${cleanPhone}`,
        };
      }
    } catch (err) {
      console.error("[Twilio Error]", err);
    }
  }

  // Developer simulation preview
  return {
    success: true,
    delivered: false,
    message: `SMS OTP generated for +91 ${cleanPhone}. (Add FAST2SMS_API_KEY or Twilio credentials in .env.local for live SMS).`,
    previewOtp: otp,
  };
}
