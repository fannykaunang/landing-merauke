// app/api/visitor-logs/route.ts
import { NextRequest, NextResponse } from "next/server";

import { createVisitorLog } from "@/lib/models/visitor-log-model";

interface UserAgentInfo {
  type: string | null;
  name: string | null;
  version: string | null;
  platform: string | null;
}

const parseUserAgent = (
  userAgent: string | null,
  platformHint: string | null
): UserAgentInfo => {
  if (!userAgent) {
    return {
      type: null,
      name: null,
      version: null,
      platform: platformHint,
    };
  }

  const normalizedPlatform = platformHint?.replace(/"/g, "") ?? null;

  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
  const type = isMobile ? "Mobile" : "Desktop";

  let name: string | null = null;
  let version: string | null = null;

  const browserMatchers: { name: string; regex: RegExp }[] = [
    { name: "Edge", regex: /Edg\/(\S+)/ },
    { name: "Chrome", regex: /Chrome\/(\S+)/ },
    { name: "Firefox", regex: /Firefox\/(\S+)/ },
    { name: "Safari", regex: /Version\/(\S+).*Safari/ },
  ];

  for (const matcher of browserMatchers) {
    const match = userAgent.match(matcher.regex);
    if (match) {
      name = matcher.name;
      version = match[1];
      break;
    }
  }

  let platform: string | null = normalizedPlatform;

  if (!platform) {
    if (/windows/i.test(userAgent)) platform = "Windows";
    else if (/mac os x/i.test(userAgent)) platform = "macOS";
    else if (/android/i.test(userAgent)) platform = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = "iOS";
    else if (/linux/i.test(userAgent)) platform = "Linux";
  }

  return { type, name, version, platform };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request
      .json()
      .catch(() => ({} as { currentUrl?: string | null }));
    const currentUrl =
      body.currentUrl || request.headers.get("referer") || null;

    const userAgent = request.headers.get("user-agent");
    const platformHint = request.headers.get("sec-ch-ua-platform");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || null;

    const parsedUserAgent = parseUserAgent(userAgent, platformHint);

    await createVisitorLog({
      userAgentType: parsedUserAgent.type,
      userAgentName: parsedUserAgent.name,
      userAgentVersion: parsedUserAgent.version,
      userAgentPlatform: parsedUserAgent.platform,
      userAgentString: userAgent,
      ipAddress,
      currentUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording visitor log:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data pengunjung" },
      { status: 500 }
    );
  }
}
