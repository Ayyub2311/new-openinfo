import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";

import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact21 extends FactBase {
  @IsString()
  name_counterparty: string;

  @IsString()
  location_counterparty: string;

  @IsString()
  share_affiliated_entity: string;

  @IsString()
  name_affiliated_entity: string;

  @IsString()
  location_affiliated_entity: string;

  @IsString()
  share_emitent: string;

  @IsString()
  decision_transaction: string;

  @IsString()
  date_decision: string;

  @IsString()
  transaction_amount: string;

  @IsString()
  date_transaction: string;

  @IsString()
  type_transaction: string;

  @IsString()
  subject_matter: string;

  @IsString()
  issuer_transaction: string;

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
    const converter = new ConvertTypes();
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact21.title"),
        items: [
          { label: this.t("Facts.fact21.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact21.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact21.name_counterparty"), value: this.name_counterparty },
          { label: this.t("Facts.fact21.location_counterparty"), value: this.location_counterparty },
          { label: this.t("Facts.fact21.share_affiliated_entity"), value: this.share_affiliated_entity },
          { label: this.t("Facts.fact21.name_affiliated_entity"), value: this.name_affiliated_entity },
          { label: this.t("Facts.fact21.location_affiliated_entity"), value: this.location_affiliated_entity },
          { label: this.t("Facts.fact21.share_emitent"), value: this.share_emitent },
          { label: this.t("Facts.fact21.decision_transaction"), value: this.decision_transaction },
          { label: this.t("Facts.fact21.date_decision"), value: this.formatDate(this.date_decision) },
          { label: this.t("Facts.fact21.transaction_amount"), value: this.transaction_amount },
          { label: this.t("Facts.fact21.date_transaction"), value: this.formatDate(this.date_transaction) },
          { label: this.t("Facts.fact21.type_transaction"), value: this.type_transaction },
          { label: this.t("Facts.fact21.subject_matter"), value: this.subject_matter },
          {
            label: this.t("Facts.fact21.issuer_transaction"),
            value: converter.getIssuerTransaction(this.issuer_transaction),
          },
        ],
      },
    };
  }
}
