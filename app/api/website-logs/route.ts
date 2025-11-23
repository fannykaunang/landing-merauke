import { NextRequest, NextResponse } from "next/server";

import { createWebsiteLog } from "@/lib/models/website-log-model";

interface WebsiteLogBody {
  websiteId?: number;
  currentUrl?: string;
}

const parseUserAgent = (userAgent: string | null) => {
  const ua = userAgent || "Unknown";
  const normalized = ua.toLowerCase();

  let name = "Unknown";
  let version = "Unknown";

  const extractVersion = (pattern: RegExp) => {
    const match = ua.match(pattern);
    return match?.[1] ?? "Unknown";
  };

  if (normalized.includes("edg/")) {
    name = "Edge";
    version = extractVersion(/Edg\/([\d\.]+)/);
  } else if (normalized.includes("chrome/")) {
    name = "Chrome";
    version = extractVersion(/Chrome\/([\d\.]+)/);
  } else if (normalized.includes("firefox/")) {
    name = "Firefox";
    version = extractVersion(/Firefox\/([\d\.]+)/);
  } else if (normalized.includes("safari/")) {
    name = "Safari";
    version = extractVersion(/Version\/([\d\.]+)/);
  } else if (normalized.includes("opr/") || normalized.includes("opera")) {
    name = "Opera";
    version = extractVersion(/(?:OPR|Opera)\/([\d\.]+)/);
  }

  let platform = "Unknown";
  if (normalized.includes("windows")) {
    platform = "Windows";
  } else if (normalized.includes("mac os x")) {
    platform = "macOS";
  } else if (normalized.includes("android")) {
    platform = "Android";
  } else if (normalized.includes("iphone") || normalized.includes("ipad")) {
    platform = "iOS";
  } else if (normalized.includes("linux")) {
    platform = "Linux";
  }

  const type =
    normalized.includes("mobile") || normalized.includes("android")
      ? "Mobile"
      : "Desktop";

  return { name, version, platform, type, userAgentString: ua };
};

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return (request as unknown as { ip?: string }).ip || null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WebsiteLogBody;
    const { websiteId, currentUrl } = body;

    if (!websiteId) {
      return NextResponse.json(
        { success: false, error: "Website ID wajib diisi" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent");
    const parsedUA = parseUserAgent(userAgent);
    const ipAddress = getClientIp(request);

    await createWebsiteLog({
      websiteId,
      userAgentType: parsedUA.type,
      userAgentName: parsedUA.name,
      userAgentVersion: parsedUA.version,
      userAgentPlatform: parsedUA.platform,
      userAgentString: parsedUA.userAgentString,
      ipAddress,
      time: new Date(),
      currentUrl: currentUrl ?? request.headers.get("referer"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating website log:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan log website" },
      { status: 500 }
    );
  }
}
