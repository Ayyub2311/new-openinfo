import { ReportFactory } from "@/app/features/reports/models/ReportFactory";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Container from "@/app/shared/ui/components/Container";
import { Suspense } from "react";
import { ReportBuilderContainer } from "./ReportBuilderContainer";
import { ReportTitle } from "@/app/features/reports/components/ReportTitle";

interface PageProps {
  params: Promise<{
    reportCategory: string;
    reportType: string;
    reportId: string;
  }>;
}

async function ReportPageContent({
  reportCategory,
  reportType,
  reportId,
}: {
  reportCategory: string;
  reportType: string;
  reportId: string;
}) {
  const data: {
    reportId: number;
    reporting_year?: string;
    quarter_no?: string;
  } & Record<string, unknown> = await FetchService.fetch(
    `/api/v2/reports/${reportCategory}/${reportType}/${reportId}/`
  );

  const model = ReportFactory.createReport({
    ...data,
    category: reportCategory,
    type: reportType,
    id: data.reportId,
  });

  // Extract year from reporting_year (format: "YYYY-MM-DD")
  const year = data.reporting_year?.split("-")[0] || new Date().getFullYear().toString();

  return (
    <>
      <ReportTitle
        type={reportType as "annual" | "quarter"} // correct now
        category={reportCategory as "jsc" | "bank" | "insurance" | "llc"} // correct now
        year={year}
        quarter={data.quarter_no}
      />

      <ReportBuilderContainer model={model} />
    </>
  );
}

export default async function ReportPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { reportCategory, reportType, reportId } = resolvedParams;

  return (
    <Container className="mb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ReportPageContent reportCategory={reportCategory} reportType={reportType} reportId={reportId} />
      </Suspense>
    </Container>
  );
}

// Optionally, you can also add generateMetadata for better SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  return {
    title: `Report ${resolvedParams.reportType}`,
  };
}
