import { notFound } from "next/navigation";
import { companies } from "@/lib/companies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Chat from "./Chat";

export const dynamic = "force-dynamic";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = companies[companyId];
  if (!company) return notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <main className="w-full max-w-2xl">
        <Card className="rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <Badge variant="secondary">ID: {company.id}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Chat companyId={company.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


