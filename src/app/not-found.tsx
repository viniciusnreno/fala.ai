import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-md">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Empresa não encontrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifique o QR Code ou volte para a página inicial.
            </p>
            <Button asChild>
              <Link href="/">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


