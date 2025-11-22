import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to_email } = body;

    if (!to_email) {
      return NextResponse.json(
        { success: false, error: "to_email is required" },
        { status: 400 }
      );
    }

    // Log configuration (tanpa password)
    console.log("=== SMTP Configuration ===");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_FROM:", process.env.SMTP_FROM);
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "***SET***" : "NOT SET");
    console.log("==========================");

    // Create transporter - sesuai dengan konfigurasi VB.NET
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
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

    // Verify connection
    console.log("Verifying SMTP connection...");
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully!");
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", verifyError);
      return NextResponse.json(
        {
          success: false,
          error: "SMTP connection failed",
          details: String(verifyError),
        },
        { status: 500 }
      );
    }

    // Send test email
    console.log("Sending test email to:", to_email);
    
    const info = await transporter.sendMail({
      from: `"Portal Merauke Test" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: to_email,
      subject: "🧪 Test Email - Portal Merauke",
      text: "Ini adalah email test dari Portal Merauke. Jika Anda menerima email ini, konfigurasi SMTP sudah benar!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2563eb;">🧪 Test Email Berhasil!</h2>
            <p>Ini adalah email test dari <strong>Portal Merauke</strong>.</p>
            <p>Jika Anda menerima email ini, konfigurasi SMTP sudah <span style="color: green; font-weight: bold;">BENAR</span>!</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Dikirim pada: ${new Date().toLocaleString("id-ID")}<br>
              From: ${process.env.SMTP_USER}<br>
              Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      data: {
        messageId: info.messageId,
        response: info.response,
        to: to_email,
        from: process.env.SMTP_USER,
      },
    });
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

// GET endpoint untuk cek konfigurasi tanpa kirim email
export async function GET() {
  const config = {
    SMTP_HOST: process.env.SMTP_HOST || "NOT SET",
    SMTP_PORT: process.env.SMTP_PORT || "NOT SET",
    SMTP_SECURE: process.env.SMTP_SECURE || "NOT SET",
    SMTP_USER: process.env.SMTP_USER || "NOT SET",
    SMTP_FROM: process.env.SMTP_FROM || "NOT SET",
    SMTP_PASS: process.env.SMTP_PASS ? "✅ SET" : "❌ NOT SET",
  };

  return NextResponse.json({
    success: true,
    message: "SMTP Configuration (check terminal for details)",
    config,
  });
}
