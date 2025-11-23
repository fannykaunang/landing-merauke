// lib/models/visitor-log-model.ts
import { executeInsert } from "@/lib/helpers/db-helpers";

export interface VisitorLogInput {
  userAgentType?: string | null;
  userAgentName?: string | null;
  userAgentVersion?: string | null;
  userAgentPlatform?: string | null;
  userAgentString?: string | null;
  ipAddress?: string | null;
  currentUrl?: string | null;
}

export async function createVisitorLog(data: VisitorLogInput): Promise<number> {
  return executeInsert(
    `
      INSERT INTO visitor_logs (
        UserAgentType,
        UserAgentName,
        UserAgentVersion,
        UserAgentPlatform,
        UserAgentString,
        IPAddress,
        CurrentURL,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `,
    [
      data.userAgentType ?? null,
      data.userAgentName ?? null,
      data.userAgentVersion ?? null,
      data.userAgentPlatform ?? null,
      data.userAgentString ?? null,
      data.ipAddress ?? null,
      data.currentUrl ?? null,
    ]
  );
}
