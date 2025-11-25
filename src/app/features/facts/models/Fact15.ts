import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact15 extends FactBase {
  @IsString()
  body_of_issuer: string;

  @IsString()
  purpose_loan: string;

  @IsString()
  date_receipt: string;

  @IsNumber()
  loan_amount: number;

  @IsNumber()
  loan_capital: number;

  @IsString()
  name_of_bank: string;

  @IsString()
  maturity_loan: string;

  @IsString()
  description_collateral: string;

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
        title: this.t("Facts.fact15.title"),
        items: [
          { label: this.t("Facts.fact15.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact15.factTitle"), value: this.fact_title },
          { label: this.t("Facts.fact15.bodyOfIssuerTitle"), value: this.body_of_issuer },
          { label: this.t("Facts.fact15.purposeLoanTitle"), value: this.purpose_loan },
          { label: this.t("Facts.fact15.dateReceiptTitle"), value: this.date_receipt?.split("-").reverse().join(".") },
          {
            label: this.t("Facts.fact15.loanAmountTitle"),
            value: new Intl.NumberFormat("ru-RU").format(this.loan_amount),
          },
          { label: this.t("Facts.fact15.loanCapitalTitle"), value: this.loan_capital },
          { label: this.t("Facts.fact15.nameOfBankTitle"), value: this.name_of_bank },
          { label: this.t("Facts.fact15.maturityLoanTitle"), value: this.maturity_loan },
          { label: this.t("Facts.fact15.descriptionCollateralTitle"), value: this.description_collateral },
        ],
      },
    };
  }
}
