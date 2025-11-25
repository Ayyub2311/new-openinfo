import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionRC,
} from "@/app/features/facts/components/FactBuilder";
import { TableData } from "@/app/shared/ui/components/Table";

export class Fact40 extends FactBase {
  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsString()
  description_changes: string;

  @IsString()
  date_registration: string;

  @IsString()
  securities_type: string;

  @IsString()
  securities_count_before: string;

  @IsString()
  securities_count_after: string;

  @IsString()
  total_issue_amount_before: string;

  @IsString()
  total_issue_amount_after: string;

  @IsString()
  state_reg_pub_date: string;

  @IsString()
  state_reg_num: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact1,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact1(): FactBuilderSectionRC {
    return {
      component: "react-content",
      content: (
        <table>
          <tbody>
            <tr>
              <TableData bordered>{this.t("Facts.fact40.titleFactNumber")}</TableData>
              <TableData bordered colSpan={2}>
                {this.fact_number}
              </TableData>
            </tr>
            <tr>
              <TableData bordered>Наименование существенного факта:</TableData>
              <TableData bordered colSpan={2}>
                {this.fact_title}
              </TableData>
            </tr>
            <tr>
              <TableData bordered rowSpan={2}>
                Количество ценных бумаг:
              </TableData>
              <TableData bordered>До внесения изменений и (или) дополнений в решение о выпуске ценных бумаг</TableData>
              <TableData bordered>
                После внесения изменений и (или) дополнений в решение о выпуске ценных бумаг
              </TableData>
            </tr>
            <tr>
              <TableData bordered>462362066</TableData>
              <TableData bordered>411770169</TableData>
            </tr>
          </tbody>
        </table>
      ),
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: "Информация о существенном факте",
        items: [
          { label: this.t("Facts.fact40.fact_number"), value: this.fact_number },
          { label: "Наименование существенного факта:", value: this.fact_title },
          { label: "Дата принятия решения:", value: this.decision_date?.split("-").reverse().join(".") },
          {
            label: "Основание для внесения изменений и (или) дополнений в решение о выпуске ценных бумаг:",
            value: this.body_decided,
          },
          {
            label: "Тип ценных бумаг:",
            value: this.securities_type,
          },
          {
            label: "Количество ценных бумаг (до изменений):",
            value: this.securities_count_before,
          },
          {
            label: "Количество ценных бумаг (после изменений):",
            value: this.securities_count_after,
          },
          {
            label: "Общая сумма выпуска (до изменений):",
            value: this.total_issue_amount_before,
          },
          {
            label: "Общая сумма выпуска (после изменений):",
            value: this.total_issue_amount_after,
          },
          {
            label: "Дата государственной регистрации выпуска:",
            value: this.state_reg_pub_date?.split("-").reverse().join("."),
          },
          {
            label: "Государственный регистрационный номер выпуска:",
            value: this.state_reg_num,
          },
        ],
      },
    };
  }
}
