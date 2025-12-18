export class FormatDateBase {
  private months: Record<"en" | "ru" | "uz", string[]> = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ru: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"]
  };

  private getLang(locale?: string): "en" | "ru" | "uz" {
    if (!locale) return "en";
    if (locale.startsWith("ru")) return "ru";
    if (locale.startsWith("uz")) return "uz";
    return "en";
  }

  private parse(dateString: string, locale?: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const lang = this.getLang(locale);
    return {
      day: String(date.getDate()).padStart(2, "0"),
      month: this.months[lang][date.getMonth()],
      year: date.getFullYear(),
      hours: String(date.getHours()).padStart(2, "0"),
      minutes: String(date.getMinutes()).padStart(2, "0"),
    };
  }

   // const day = String(date.getDate()).padStart(2, "0");
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const year = date.getFullYear();

    formatDate(dateString: string, locale?: string): string {
    const { day, month, year } = this.parse(dateString, locale);
    return `${day} ${month} ${year}`;
  }

  formatDateFull(dateString: string, locale?: string): string {
    const { day, month, year, hours, minutes } = this.parse(dateString, locale);
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
}

export const converter = new FormatDateBase();
    

