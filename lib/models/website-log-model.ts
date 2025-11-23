import { executeInsert } from "@/lib/helpers/db-helpers";

export interface WebsiteLogCreateInput {
  userAgentType?: string | null;
  userAgentName?: string | null;
  userAgentVersion?: string | null;
  userAgentPlatform?: string | null;
  userAgentString?: string | null;
  ipAddress?: string | null;
  time?: Date;
  currentUrl?: string | null;
  websiteId: number;
}

export async function createWebsiteLog(
  data: WebsiteLogCreateInput
): Promise<number> {
  return executeInsert(
    `
      INSERT INTO website_logs (
        UserAgentType,
        UserAgentName,
        UserAgentVersion,
        UserAgentPlatform,
        UserAgentString,
        IPAddress,
        Time,
        CurrentURL,
        WebsiteID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.userAgentType ?? null,
      data.userAgentName ?? null,
      data.userAgentVersion ?? null,
      data.userAgentPlatform ?? null,
      data.userAgentString ?? null,
      data.ipAddress ?? null,
      data.time ?? new Date(),
      data.currentUrl ?? null,
      data.websiteId,
    ]
  );
}
