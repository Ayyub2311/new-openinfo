import { IsString, IsOptional } from "class-validator";
import { FactBase } from "./base/FactBase";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionRC,
} from "@/app/features/facts/components/FactBuilder";
import { TableData } from "@/app/shared/ui/components/Table";

const NOT_EXIST_DATE = "-";

export class Fact32 extends FactBase {
  @IsString()
  person_emitet: string;

  @IsString()
  date_solution: string;

  @IsString()
  date_parsect: string;

  @IsString()
  sum_aksiya: string;

  @IsString()
  one_procent: string;

  @IsString()
  sum_aksiya2: string;

  @IsString()
  one_procent2: string;

  @IsString()
  sum_per: string;

  @IsString()
  percentage_nominal: string;

  @IsString()
  sum_per2: string;

  @IsString()
  percentage_nominal2: string;

  @IsString()
  status: string;

  @IsOptional()
  start_date_common_shares: any;

  @IsOptional()
  end_date_common_shares: any;

  @IsOptional()
  start_date_ordinary_shares: any;

  @IsOptional()
  end_date_ordinary_shares: any;

  @IsString()
  start_date_other_securities: string;

  @IsString()
  end_date_other_securities: string;

  @IsOptional()
  start_date_other_securities2: any;

  @IsOptional()
  end_date_other_securities2: any;

  @IsString()
  form_of_payment: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getSectionInformationOnMaterialFact1,
        this.getSectionInformationOnMaterialFact2,
        this.getSectionInformationOnMaterialFact3,
        this.getSectionInformationOnMaterialFact4,
        this.getSectionInformationOnMaterialFact5,
        this.getSectionInformationOnMaterialFact6,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.title"),
        items: [
          { label: this.t("Facts.fact32.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact32.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact32.person_emitet"), value: this.person_emitet },
          {
            label: this.t("Facts.fact32.date_solution"),
            value: this.date_solution ? this.formatDate(this.date_solution) : NOT_EXIST_DATE,
          },
          {
            label: this.t("Facts.fact32.date_parsect"),
            value: this.date_parsect ? this.formatDate(this.date_parsect) : NOT_EXIST_DATE,
          },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact1(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.dividends_common"),
        items: [
          { label: this.t("Facts.fact32.sum_aksiya"), value: this.sum_aksiya },
          { label: this.t("Facts.fact32.one_procent"), value: this.one_procent },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact2(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.dividends_preferred"),
        items: [
          { label: this.t("Facts.fact32.sum_aksiya2"), value: this.sum_aksiya2 },
          { label: this.t("Facts.fact32.one_procent2"), value: this.one_procent2 },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact3(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.corporate_bonds"),
        items: [
          { label: this.t("Facts.fact32.sum_per"), value: this.sum_per },
          { label: this.t("Facts.fact32.percentage_nominal"), value: this.percentage_nominal },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact4(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.infrastructure_bonds"),
        items: [
          { label: this.t("Facts.fact32.sum_per2"), value: this.sum_per2 },
          { label: this.t("Facts.fact32.percentage_nominal2"), value: this.percentage_nominal2 },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact5(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact32.payment_dates"),
        items: [],
      },
    };
  }

  get getSectionInformationOnMaterialFact6(): FactBuilderSectionRC {
    return {
      component: "react-content",
      content: (
        <table>
          <tbody>
            <tr>
              <TableData bordered>{this.t("Facts.fact32.security_type")}</TableData>
              <TableData bordered>{this.t("Facts.fact32.start_date")}</TableData>
              <TableData bordered>{this.t("Facts.fact32.end_date")}</TableData>
            </tr>
            <tr>
              <TableData bordered>{this.t("Facts.fact32.common_shares")}</TableData>
              <TableData bordered>
                {this.start_date_common_shares ? this.formatDate(this.start_date_common_shares) : NOT_EXIST_DATE}
              </TableData>
              <TableData bordered>
                {this.end_date_common_shares ? this.formatDate(this.end_date_common_shares) : NOT_EXIST_DATE}
              </TableData>
            </tr>
            <tr>
              <TableData bordered>{this.t("Facts.fact32.preferred_shares")}</TableData>
              <TableData bordered>
                {this.start_date_ordinary_shares ? this.formatDate(this.start_date_ordinary_shares) : NOT_EXIST_DATE}
              </TableData>
              <TableData bordered>
                {this.end_date_ordinary_shares ? this.formatDate(this.end_date_ordinary_shares) : NOT_EXIST_DATE}
              </TableData>
            </tr>
            <tr>
              <TableData bordered>{this.t("Facts.fact32.corporate_bonds")}</TableData>
              <TableData bordered>
                {this.start_date_other_securities ? this.formatDate(this.start_date_other_securities) : NOT_EXIST_DATE}
              </TableData>
              <TableData bordered>
                {this.end_date_other_securities ? this.formatDate(this.end_date_other_securities) : NOT_EXIST_DATE}
              </TableData>
            </tr>
            <tr>
              <TableData bordered>{this.t("Facts.fact32.infrastructure_bonds")}</TableData>
              <TableData bordered>
                {this.start_date_other_securities2
                  ? this.formatDate(this.start_date_other_securities2)
                  : NOT_EXIST_DATE}
              </TableData>
              <TableData bordered>
                {this.end_date_other_securities2 ? this.formatDate(this.end_date_other_securities2) : NOT_EXIST_DATE}
              </TableData>
            </tr>
            <tr>
              <TableData bordered colSpan={2}>
                {this.t("Facts.fact32.form_of_payment")}
              </TableData>
              <TableData bordered>{this.form_of_payment}</TableData>
            </tr>
          </tbody>
        </table>
      ),
    };
  }
}
