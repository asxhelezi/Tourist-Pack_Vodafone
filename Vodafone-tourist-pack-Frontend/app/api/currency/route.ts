import { NextResponse } from "next/server";
import { getRates } from "@/lib/currencyProvider";

export async function GET() {
  const payload = await getRates();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=43200",
    },
  });
}
