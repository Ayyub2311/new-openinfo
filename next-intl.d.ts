import type en from "./messages/en.json";
import type { ReactNode } from "react";

type Messages = typeof en;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKeys = NestedKeyOf<Messages>;

declare module "next-intl" {
  type Messages = Record<string, Messages>;

  // export function useTranslations(namespace?: string): {
  //   (key: TranslationKeys, values?: Record<string, any>): string;
  //   raw(key: TranslationKeys): string;
  //   rich(key: TranslationKeys, values?: Record<string, any>): ReactNode;
  // };

  export function useTranslations(namespace?: string): {
    (key: string, values?: string): string; // Изменили TranslationKeys на string
    raw(key: string): string; // Изменили TranslationKeys на string
    rich(key: string, values?: Record<string, any>): ReactNode;
  };

  // Add useLocale function
  export function useLocale(): string;

  // NextIntlClientProvider
  export interface NextIntlClientProviderProps {
    children: ReactNode;
    locale?: string;
    messages?: Record<string, any>;
    timeZone?: string;
    now?: Date;
    formats?: Record<string, any>;
    onError?: (error: Error) => void;
    getMessageFallback?: (options: { namespace?: string; key: string; error: Error }) => string;
  }

  export function NextIntlClientProvider(props: NextIntlClientProviderProps): ReactNode;
}

declare global {
  type IntlMessages = Messages;
}
