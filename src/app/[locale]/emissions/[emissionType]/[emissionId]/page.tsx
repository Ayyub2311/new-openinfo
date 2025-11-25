import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Container from "@/app/shared/ui/components/Container";
import { Suspense } from "react";

import { FactBuilderContainer } from "@/app/[locale]/facts/[factNumber]/[factId]/FactBuilderContainer";
import { EmissionFactory } from "./EmissionFactory";
import { Title } from "@/app/shared/ui/components/Typography/Title";
import Divider from "@/app/shared/ui/components/Divider";
import { Badge } from "@/app/shared/ui/components/Badge";
import { Download } from "lucide-react";

interface PageProps {
  params: Promise<{
    emissionType: string;
    emissionId: string;
  }>;
}

async function EmissionPageContent({ emissionType, emissionId }: { emissionType: string; emissionId: string }) {
  const data: { content_type_name: string } & Record<string, unknown> = await FetchService.fetch(
    `/api/v2/emissions/${emissionType}/${emissionId}/`
  );

  const model = EmissionFactory.createFact(data);

  return (
    <>
      <Title level={1} className="mt-5 mb-5 text-[1.5rem] text-center">
        ПРОСПЕКТЫ ЭМИССИЙ
      </Title>
      <Divider />
      <br />
      <a download={true} target="_blank" href={`https://openinfo.uz/ru/emissions/to_pdf/${emissionId}/`}>
        <Badge variant="primary" size="lg">
          Скачать PDF <Download size={16} className="ml-2" />
        </Badge>
      </a>
      <FactBuilderContainer model={model} />
    </>
  );
}

export default async function EmissionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { emissionType, emissionId } = resolvedParams;

  return (
    <Container className="mb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <EmissionPageContent emissionType={emissionType} emissionId={emissionId} />
      </Suspense>
    </Container>
  );
}

// Optionally, you can also add generateMetadata for better SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  return {
    title: `Emission ${resolvedParams.emissionId}`,
  };
}
