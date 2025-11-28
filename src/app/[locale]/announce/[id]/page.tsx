import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Container from "@/app/shared/ui/components/Container";
import Divider from "@/app/shared/ui/components/Divider";
import { Title } from "@/app/shared/ui/components/Typography/Title";
import { Calendar, Download, Building, MapPin, Mail, Link as LinkIcon, Clock } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Response {
  id: number;
  organization_name: string;
  organization_short_name_text: string;
  organization_inn: string;
  org_ticket_number: any;
  org_location: string;
  org_address: string;
  org_email: string;
  org_website: string;
  announcementlang: Array<any>;
  title: string;
  an_type: string;
  body: string;
  status: string;
  own_link: string;
  pub_date: string;
  watched: number;
  approved_date: any;
  meeting_date: string;
  refusal_reason: any;
  corrections_reason: any;
  organization: number;
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function formatMeetingDate(timestamp: string | null) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function PageAnnounce({ params }: PageProps) {
  const { id } = await params;
  const response = await FetchService.fetch<Response>(`/api/v2/announcement/main/${id}/`);

  return (
    <Container className="mt-6 mb-14">
      <div className="flex flex-col gap-6">
        {/* Header with title and badges */}
        <div className="flex flex-col gap-4">
          {/* <div className="flex items-center gap-2">
            <Badge variant={getTypeBadgeVariant(response.an_type)}>{getTypeDisplayText(response.an_type)}</Badge>
            <Badge variant={getStatusBadgeVariant(response.status)}>
              {response.status === "approved" ? "Одобрено эмитентом" : "На рассмотрении"}
            </Badge>
          </div> */}

          <Title level={1}>{capitalizeFirstLetter(response.title)}</Title>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building size={16} />
            <span>{response.organization_name}</span>
          </div>
        </div>

        <Divider />

        {/* Metadata section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="font-medium">Дата публикации:</span>
              <span>{formatDate(response.pub_date)}</span>
            </div>

            {response.meeting_date && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="font-medium">Дата встречи:</span>
                <span>{formatMeetingDate(response.meeting_date)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="font-medium">Адрес:</span>
              <span>{response.org_address}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {response.org_email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="font-medium">Email:</span>
                <Link href={`mailto:${response.org_email}`} className="text-blue-600 hover:underline">
                  {response.org_email}
                </Link>
              </div>
            )}

            {response.org_website && (
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-gray-500" />
                <span className="font-medium">Сайт:</span>
                <Link
                  href={
                    response.org_website.startsWith("http") ? response.org_website : `https://${response.org_website}`
                  }
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {response.org_website}
                </Link>
              </div>
            )}

            {response.own_link && (
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-gray-500" />
                <span className="font-medium">Источник:</span>
                <Link
                  href={response.own_link.startsWith("http") ? response.own_link : `https://${response.own_link}`}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {response.own_link}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://openinfo.uz/ru/announce/to_pdf/${id}/`}
            download
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Скачать PDF
          </a>
        </div>

        <Divider />

        {/* Content */}
        <div
          className="prose max-w-none text-justify leading-relaxed"
          style={{
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.6",
            fontSize: "16px",
            color: "#333",
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: response.body }}
            className="[&>p]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:text-center
                      [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5
                      [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-2 [&>.important]:bg-gray-50 [&>.important]:p-4
                      [&>.important]:rounded-xl [&>.important]:my-6"
          />
        </div>

        {/* Organization info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Информация об организации</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Название:</p>
              <p>{response.organization_name}</p>
            </div>
            <div>
              <p className="font-medium">Короткое название:</p>
              <p>{response.organization_short_name_text}</p>
            </div>
            <div>
              <p className="font-medium">ИНН:</p>
              <p>{response.organization_inn}</p>
            </div>
            <div>
              <p className="font-medium">Адрес:</p>
              <p>{response.org_address}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default PageAnnounce;
