import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Fungsi untuk membuat transporter (dipanggil saat kirim email, bukan saat startup)
function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.merauke.go.id",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // false untuk port 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  });
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
}

// Send OTP email
export async function sendOTPEmail(
  to: string,
  otp: string,
  type: "login" | "register" | "reset_password" = "login"
): Promise<boolean> {
  const typeLabels = {
    login: "Masuk",
    register: "Pendaftaran",
    reset_password: "Reset Password",
  };

  const subject = `[Portal Merauke] Kode OTP ${typeLabels[type]} Anda`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 500px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 16px 16px 0 0;">
              <div style="display: inline-block; padding: 12px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; margin-bottom: 16px;">
                <img width="50" height="50" src="https://izakod-asn.merauke.go.id/Lambang_Kabupaten_Merauke.png">
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                Portal Website & Aplikasi
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Kabupaten Merauke
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px; font-weight: 600; text-align: center;">
                Kode Verifikasi ${typeLabels[type]}
              </h2>
              <p style="margin: 0 0 32px; color: #64748b; font-size: 15px; line-height: 1.6; text-align: center;">
                Gunakan kode OTP di bawah ini untuk melanjutkan proses ${typeLabels[
                  type
                ].toLowerCase()}. Kode ini berlaku selama <strong>5 menit</strong>.
              </p>
              
              <!-- OTP Code Box -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%); border: 2px dashed #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                  Kode OTP Anda
                </p>
                <p style="margin: 0; color: #1e40af; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </p>
              </div>
              
              <!-- Warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  <strong>⚠️ Peringatan Keamanan:</strong><br>
                  Jangan bagikan kode OTP ini kepada siapapun termasuk petugas. Kode ini bersifat rahasia dan hanya untuk Anda.
                </p>
              </div>
              
              <p style="margin: 0; color: #94a3b8; font-size: 13px; text-align: center; line-height: 1.6;">
                Jika Anda tidak meminta kode ini, abaikan email ini atau hubungi administrator.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.6;">
                © ${new Date().getFullYear()} Pemerintah Kabupaten Merauke<br>
                Dinas Komunikasi dan Informatika
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
Portal Website & Aplikasi Kabupaten Merauke

Kode Verifikasi ${typeLabels[type]}

Gunakan kode OTP di bawah ini untuk melanjutkan proses ${typeLabels[
    type
  ].toLowerCase()}:

${otp}

Kode ini berlaku selama 5 menit.

PERINGATAN: Jangan bagikan kode OTP ini kepada siapapun.

---
© ${new Date().getFullYear()} Pemerintah Kabupaten Merauke
Dinas Komunikasi dan Informatika
  `;

  try {
    const transporter = createTransporter();

    // Log untuk debugging
    console.log("=== Sending OTP Email ===");
    console.log("To:", to);
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);

    await transporter.sendMail({
      from: `"Portal Merauke" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

// Send login notification email
export async function sendLoginNotificationEmail(
  to: string,
  ipAddress: string,
  userAgent: string
): Promise<boolean> {
  const subject = "[Portal Merauke] Notifikasi Login Baru";

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 500px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                Portal Website & Aplikasi
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">
                ✅ Login Berhasil
              </h2>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6;">
                Akun Anda baru saja digunakan untuk login pada:
              </p>
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
                  <strong>Waktu:</strong> ${new Date().toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
                <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
                  <strong>IP Address:</strong> ${ipAddress}
                </p>
                <p style="margin: 0; color: #475569; font-size: 14px;">
                  <strong>Browser:</strong> ${userAgent.slice(0, 100)}...
                </p>
              </div>
              <p style="color: #94a3b8; font-size: 13px;">
                Jika ini bukan Anda, segera hubungi administrator.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portal Merauke" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`✅ Login notification email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending login notification:", error);
    return false;
  }
}
