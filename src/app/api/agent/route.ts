import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    const companyId = typeof body?.companyId === "string" ? body.companyId : undefined;

    if (!prompt) {
      return NextResponse.json({ message: "Forneça um prompt válido." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Configuração ausente. Defina a variável de ambiente OPENAI_API_KEY nas envs (Vercel).",
        },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const systemPrompt =
      "Você é a Maite, assistente virtual do Mercado Ferreirinha, especializada em coletar, esclarecer e estruturar feedbacks de clientes. Responda sempre em Português do Brasil, de forma clara e objetiva.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          // Contexto simples opcional: empresa
          ...(companyId ? [{ role: "system", content: `Empresa: ${companyId}` }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.log(errText);
      return NextResponse.json(
        { message: "Não foi possível obter resposta agora. Tente novamente mais tarde." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as any;
    const content: string = data?.choices?.[0]?.message?.content?.trim?.() || "olá";

    return NextResponse.json({ message: content }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro inesperado. Tente novamente." },
      { status: 500 }
    );
  }
}


