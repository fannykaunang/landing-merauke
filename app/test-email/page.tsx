"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  data?: {
    messageId?: string;
    response?: string;
    to?: string;
    from?: string;
  };
  config?: Record<string, string>;
}

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [configResult, setConfigResult] = useState<TestResult | null>(null);

  // Check SMTP config
  const checkConfig = async () => {
    setIsCheckingConfig(true);
    setConfigResult(null);

    try {
      const response = await fetch("/api/test-email");
      const data = await response.json();
      setConfigResult(data);
    } catch (error) {
      setConfigResult({
        success: false,
        error: "Failed to check config",
        details: String(error),
      });
    } finally {
      setIsCheckingConfig(false);
    }
  };

  // Send test email
  const sendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, error: "Masukkan alamat email tujuan" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_email: email }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to send email",
        details: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600" />
            Test Email SMTP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gunakan halaman ini untuk test konfigurasi SMTP dan mengirim email test.
          </p>
        </div>

        {/* Step 1: Check Config */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Step 1: Cek Konfigurasi SMTP
          </h2>
          <Button
            onClick={checkConfig}
            disabled={isCheckingConfig}
            variant="outline"
            className="w-full"
          >
            {isCheckingConfig ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                Cek Konfigurasi
              </>
            )}
          </Button>

          {configResult && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Konfigurasi SMTP:
              </h3>
              {configResult.config && (
                <div className="space-y-1 font-mono text-sm">
                  {Object.entries(configResult.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                      <span
                        className={
                          value.includes("NOT SET")
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">
                ⚠️ Cek terminal/console server untuk log detail
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Send Test Email */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Step 2: Kirim Email Test
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Tujuan
              </label>
              <Input
                type="email"
                placeholder="email-anda@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700/50"
              />
            </div>

            <Button
              onClick={sendTestEmail}
              disabled={isLoading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Email Test
                </>
              )}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      result.success
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {result.success ? "Email Terkirim!" : "Gagal Mengirim Email"}
                  </h3>

                  {result.success && result.data && (
                    <div className="mt-2 text-sm text-green-700 dark:text-green-400 space-y-1">
                      <p>
                        <strong>To:</strong> {result.data.to}
                      </p>
                      <p>
                        <strong>From:</strong> {result.data.from}
                      </p>
                      <p>
                        <strong>Message ID:</strong> {result.data.messageId}
                      </p>
                      <p>
                        <strong>Response:</strong> {result.data.response}
                      </p>
                    </div>
                  )}

                  {!result.success && (
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <p>
                        <strong>Error:</strong> {result.error}
                      </p>
                      {result.details && (
                        <p className="mt-1 font-mono text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-auto">
                          {result.details}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium mb-2">Tips Debugging:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cek terminal server untuk log detail error</li>
                <li>Pastikan password SMTP sudah benar di .env.local</li>
                <li>Cek folder SPAM/Junk email</li>
                <li>Pastikan port 465 tidak diblokir firewall</li>
                <li>Restart server setelah ubah .env.local</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
