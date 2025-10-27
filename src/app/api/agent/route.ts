import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Mesmo ignorando o conteúdo no MVP, validamos JSON básico
    await request.json().catch(() => ({}));
    return NextResponse.json({ message: "olá" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "olá" }, { status: 200 });
  }
}


