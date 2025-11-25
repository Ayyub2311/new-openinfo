import { FactFactory } from "@/app/features/facts/models/FactFactory";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Container from "@/app/shared/ui/components/Container";
import { Suspense } from "react";
import { FactBuilderContainer } from "./FactBuilderContainer";
import { FactTitle } from "@/app/features/facts/components/FactTitle";

interface PageProps {
  params: Promise<{
    factNumber: string;
    factId: string;
  }>;
}

async function FactPageContent({ factNumber, factId }: { factNumber: string; factId: string }) {
  const data: { fact_number: number } & Record<string, unknown> = await FetchService.fetch(
    `/api/v2/disclosure/fact${factNumber}/${factId}/`
  );

  const model = FactFactory.createFact(data);

  return (
    <>
      <FactTitle number={model.fact_number} title={model.fact_title} />
      <FactBuilderContainer model={model} />
    </>
  );
}

export default async function FactPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { factNumber, factId } = resolvedParams;

  return (
    <Container className="mb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <FactPageContent factNumber={factNumber} factId={factId} />
      </Suspense>
    </Container>
  );
}

// Optionally, you can also add generateMetadata for better SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  return {
    title: `Fact ${resolvedParams.factNumber}`,
  };
}
