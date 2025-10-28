import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="w-full max-w-2xl p-6">
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="tracking-tight">Fala.AI</CardTitle>
                <CardDescription className="text-primary">
                  Escaneie o QR Code e deixe seu feedback
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gere um QR para sua empresa e direcione seus clientes para uma página de feedback
              com um agente de IA.
            </p>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exemplo:</p>
                <p className="font-medium">/c/ferrerinha</p>
              </div>
              <Button asChild>
                <Link href="/c/ferrerinha">Ir para ferrerinha</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
