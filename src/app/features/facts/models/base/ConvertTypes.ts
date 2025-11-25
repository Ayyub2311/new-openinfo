import { FormatDateBase } from "./FormatDateBase";

export class ConvertTypes extends FormatDateBase {
  getReorganizationMethod = (method: unknown): string => {
    const numMethod = Number(method);
    switch (numMethod) {
      case 1:
        return "судом";
      case 2:
        return "уполномоченным государственным органом по регулированию рынка ценных бумаг";
      default:
        return "иные";
    }
  };

  getIssuerTransaction = (method: unknown): string => {
    const numMethod = Number(method);
    switch (numMethod) {
      case 1:
        return "Приобретатель";

      default:
        return "Отчуждатель";
    }
  };

  getOrganConverter = (method: unknown): string => {
    const numMethod = Number(method);
    switch (numMethod) {
      case 1:
        return "общее собрание акционеров";
      case 2:
        return "наблюдательный совет";
      default:
        return "иные";
    }
  };

  getRevocationOrganConverter = (method: unknown): string => {
    const numMethod = Number(method);

    switch (numMethod) {
      case 1:
        return "судом";
      case 2:
        return "лицензирующим органом";
      default:
        return "иные";
    }
  };

  getSecurityTypes = (method: unknown): string => {
    const numMethod = Number(method);
    switch (numMethod) {
      case 1:
        return "акция простая";
      case 2:
        return "акция привилегированная";
      case 3:
        return "корпоративные облигации";
      case 4:
        return "инфраструктурные облигации";
      case 5:
      case 6:
        return "депозитные сертификаты";
      case 7:
        return "опционы";
      case 8:
        return "фьючерсы";
      default:
        return "иные";
    }
  };
}
