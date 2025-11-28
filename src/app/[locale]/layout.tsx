import "reflect-metadata";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/app/features/header/components/Header";
import Footer from "@/app/features/footer/components/Footer";

import "@/app/globals.css";
import { NotificationWrapper } from "../shared/contexts/NotificationWrapper";
import { NextIntlClientProvider } from "next-intl";
import AuthUIMount from "../providers/AuthUIMount";

// const mulish = Mulish({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-body",
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-heading",
// });

// const DarkModeScript = () => (
//   <script
//     dangerouslySetInnerHTML={{
//       __html: `
//         try {
//           if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//             document.documentElement.classList.add('dark');
//           } else {
//             document.documentElement.classList.remove('dark');
//           }
//         } catch (e) {
//           console.log(e);
//         }
//       `,
//     }}
//   />
// );

export const metadata = {
  title: "Openinfo - Открытые данные о компаниях Узбекистана",
  description:
    "Openinfo.uz — Единый портал корпоративной информации Узбекистана. Найдите актуальные данные о компаниях, финансовой отчетности и руководстве организаций.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ru" | "uz" }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    // className={`${mulish.variable} ${poppins.variable}`}
    >

      {/* I commented DarkMode */}
      <head>{/* <DarkModeScript /> */}</head>
      <body className="bg-white dark:bg-slate-900">
        <NextIntlClientProvider messages={messages}>
          <NotificationWrapper>
            <div className="flex min-h-screen flex-col">
              <Header />
              {/* <TestModeBanner /> */}
              <main className="flex-grow bg-white dark:bg-slate-900">{children}</main>
              <Footer />
            </div>
            <AuthUIMount />
          </NotificationWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
