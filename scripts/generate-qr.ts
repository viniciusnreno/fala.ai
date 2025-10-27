#!/usr/bin/env tsx

import path from "node:path";
import fs from "node:fs";
import QRCode from "qrcode";

function parseArgs(): { baseUrl: string; companyId: string } {
  const args = process.argv.slice(2);
  const dict = Object.fromEntries(
    args.map((arg) => {
      const [k, v] = arg.replace(/^--/, "").split("=");
      return [k, v];
    })
  );
  const baseUrl = dict.baseUrl;
  const companyId = dict.companyId;
  if (!baseUrl || !companyId) {
    console.error("Uso: tsx scripts/generate-qr.ts --baseUrl=<URL> --companyId=<id>");
    process.exit(1);
  }
  return { baseUrl, companyId };
}

async function main() {
  const { baseUrl, companyId } = parseArgs();
  const url = `${baseUrl.replace(/\/$/, "")}/c/${companyId}`;
  const outDir = path.join(process.cwd(), "public", "qrs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${companyId}.png`);
  await QRCode.toFile(outPath, url, { width: 512, margin: 2 });
  console.log(`QR gerado: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


