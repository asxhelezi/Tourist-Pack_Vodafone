import type { Pack } from "@/data/packs";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export interface PackageResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  dataAmount: number;
  minutes: number;
  sms: number | null;
  durationDays: number;
  type: string;
}

export async function listPackages(): Promise<PackageResponse[]> {
  const res = await fetch(`${BACKEND_URL}/api/packages`);
  if (!res.ok) throw new Error(`Failed to load packages (${res.status})`);
  return res.json();
}

/**
 * The frontend catalogue (data/packs.ts) uses string slugs ("basic",
 * "standard", ...) while the backend needs the real numeric TravelPackage
 * id. DataSeeder seeds one backend row per frontend pack with matching
 * durationDays/dataAmount, so that pair uniquely identifies the match.
 */
export async function resolvePackageId(pack: Pack): Promise<number> {
  const packages = await listPackages();
  const match = packages.find(
    (p) => p.durationDays === pack.durationDays && p.dataAmount === pack.dataGB
  );
  if (!match) throw new Error(`No backend package matches frontend pack "${pack.id}"`);
  return match.id;
}
