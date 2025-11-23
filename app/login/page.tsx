// app/login/page.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  ArrowLeft,
  Loader2,
  Shield,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";

type Step = "email" | "otp" | "success";

interface FormError {
  type: "error" | "warning" | "success";
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const logVisit = async () => {
      try {
        await fetch("/api/visitor-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUrl: window.location.href }),
        });
      } catch (err) {
        console.error("Failed to record visitor log:", err);
      }
    };

    logVisit();
  }, []);

  // Fetch CSRF token on mount
  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/csrf");
      const data = await response.json();
      if (data.success) {
        setCsrfToken(data.data.csrf_token);
      }
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
    }
  }, []);

  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === "otp") {
      setCanResend(true);
    }
  }, [countdown, step]);

  // Handle email submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError({ type: "error", message: "Masukkan alamat email yang valid" });
      return;
    }

    setIsLoading(true);

    try {
      // Refresh CSRF token before request
      await fetchCSRFToken();

      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, csrf_token: csrfToken }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError({
          type: "warning",
          message: data.error || "Terlalu banyak percobaan. Coba lagi nanti.",
        });
        return;
      }

      if (!response.ok) {
        setError({
          type: "error",
          message: data.error || "Gagal mengirim OTP",
        });
        return;
      }

      // If email not registered, show error and stay on email step
      if (!data?.data?.email) {
        setError({ type: "error", message: "Email tidak terdaftar" });
        return;
      }

      // Refresh CSRF token for next step
      await fetchCSRFToken();

      setStep("otp");
      setCountdown(300); // 5 minutes
      setCanResend(false);
      setError({
        type: "success",
        message: "Kode OTP telah dikirim ke email Anda",
      });

      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error("Email submit error:", err);
      setError({ type: "error", message: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (value && index === 5 && newOtp.every((digit) => digit)) {
      handleOtpSubmit(newOtp.join(""));
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      handleOtpSubmit(pastedData);
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join("");

    if (code.length !== 6) {
      setError({ type: "error", message: "Masukkan 6 digit kode OTP" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, csrf_token: csrfToken }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError({
          type: "warning",
          message: data.error || "Terlalu banyak percobaan. Coba lagi nanti.",
        });
        return;
      }

      if (!response.ok) {
        setError({
          type: "error",
          message: data.error || "Kode OTP tidak valid",
        });
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }

      await refreshUser();
      setStep("success");

      // Redirect after success
      setTimeout(() => {
        router.push("/backend/dashboard");
      }, 2000);
    } catch (err) {
      console.error("OTP verify error:", err);
      setError({ type: "error", message: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetchCSRFToken();

      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, csrf_token: csrfToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          type: "error",
          message: data.error || "Gagal mengirim ulang OTP",
        });
        return;
      }

      await fetchCSRFToken();
      setCountdown(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setError({ type: "success", message: "Kode OTP baru telah dikirim" });
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError({ type: "error", message: "Gagal mengirim ulang OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Portal Website & Aplikasi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Kabupaten Merauke
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-8">
            {/* Step: Email */}
            {step === "email" && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Masuk ke Akun
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Masukkan email Anda untuk menerima kode OTP
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alamat Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@merauke.go.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl ${
                        error.type === "error"
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          : error.type === "warning"
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                          : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      }`}>
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error.message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Kode OTP
                        <KeyRound className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Step: OTP */}
            {step === "otp" && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Verifikasi OTP
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Masukkan kode 6 digit yang dikirim ke
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                    {email}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* OTP Input */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        disabled={isLoading}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                      />
                    ))}
                  </div>

                  {/* Countdown */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Kode berlaku:{" "}
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCountdown(countdown)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Kode OTP telah kadaluarsa
                      </p>
                    )}
                  </div>

                  {error && (
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl ${
                        error.type === "error"
                          ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                          : error.type === "warning"
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                          : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      }`}>
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{error.message}</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => handleOtpSubmit()}
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        Verifikasi
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Resend & Back buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp(["", "", "", "", "", ""]);
                        setError(null);
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" />
                      Ganti email
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isLoading}
                      className={`text-sm flex items-center gap-1 ${
                        canResend
                          ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}>
                      <RefreshCw className="w-4 h-4" />
                      Kirim ulang
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step: Success */}
            {step === "success" && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Login Berhasil!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Mengalihkan ke dashboard...
                </p>
                <div className="mt-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                </div>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Dilindungi dengan enkripsi end-to-end
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Pemerintah Kabupaten Merauke
        </p>
      </footer>
    </div>
  );
}
