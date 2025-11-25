import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact3 extends FactBase {
  @IsNumber()
  reorganization_method: number;

  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsNumber()
  stock_holders_count: number;

  @IsString()
  date_of_reorganization: string;

  @IsString()
  date_of_write_to_register: string;

  @IsString()
  term_of_request: string;

  @IsString()
  order_request: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        super.getSectionOrganizationLeadership,
      ],
    };
  }
  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: "Информация о существенном факте",
        items: [
          { label: "Номер существенного факта:", value: this.fact_number },
          { label: "Наименование существенного факта:", value: this.fact_title },
          {
            label: "Местонахождение (почтовый адрес), действовавшее до изменения:",
            value: this.body_decided,
          },
          { label: "Орган эмитента, принявший решение:", value: this.body_decided },
          { label: "Способ реорганизации:", value: this.body_decided },
        ],
      },
    };
  }
}
