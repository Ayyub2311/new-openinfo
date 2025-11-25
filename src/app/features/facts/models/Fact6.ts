import { IsString, IsNumber, IsArray } from "class-validator";
import { FactsVotingResult } from "./nested/FactsVotingResult";
import { FactsDecisionsWording } from "./nested/FactsDecisionsWording";
import { FactBase } from "./base/FactBase";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionTable,
} from "../components/FactBuilder";

export class Fact6 extends FactBase {
  @IsArray()
  facts_voting_results: FactsVotingResult[];

  @IsArray()
  facts_decisions_wording: FactsDecisionsWording[];

  @IsArray()
  facts_candidate_info: any[];

  @IsArray()
  facts_compensation_for_executives: any[];

  @IsString()
  base_document_changes_pdf: string;

  @IsNumber()
  meeting_type: number;

  @IsString()
  date_transaction: string;

  @IsString()
  date_minutes: string;

  @IsString()
  venue_meeting: string;

  @IsString()
  quorum_general: string;

  @IsString()
  status: string;

  @IsString()
  base_document_changes: string;

  @IsString()
  head_person_name: string;

  @IsString()
  accountant_person_name: string;

  @IsString()
  responsible_person_name: string;

  @IsString()
  pub_date: string;

  @IsString()
  fact_own_link: string;

  @IsString()
  approved_date: string;

  @IsNumber()
  type: number;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getFactsvotingresults,
        this.getFactsDecisionsWording,
        this.getFactscompensationforexecutives,
        this.getFactscandidateinfo,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact6.title"),
        items: [
          { label: this.t("Facts.fact6.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact6.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact6.meetingTypeTitle"), value: this.meeting_type },
          { label: this.t("Facts.fact6.dateTransactionTitle"), value: this.formatDate(this.date_transaction) },
          { label: this.t("Facts.fact6.dateMinutesTitle"), value: this.formatDate(this.date_minutes) },
          { label: this.t("Facts.fact6.venueMeetingTitle"), value: this.venue_meeting },
          { label: this.t("Facts.fact6.quorumGeneralTitle"), value: this.quorum_general },
        ],
      },
    };
  }

  get getFactsvotingresults(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: FactsVotingResult.getColumns, data: this.facts_voting_results } },
    };
  }

  get getFactsDecisionsWording(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact6.fullDecisionsWordingTitle"),
        items: this.facts_decisions_wording.map(fact => ({ label: null, value: fact.decisions_wording })),
      },
    };
  }

  get getFactscompensationforexecutives(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact6.executiveCompensationsTitle"),
        tableProps: {
          columns: [
            { title: this.t("Facts.fact6.personNameTitle"), dataIndex: "person_name_title" },
            { title: this.t("Facts.fact6.issuerBodyTitle"), dataIndex: "issuer_body_title" },
            { title: this.t("Facts.fact6.paymentTypeTitle"), dataIndex: "payment_type_title" },
            { title: this.t("Facts.fact6.accruedAmountTitle"), dataIndex: "accrued_amount_title" },
            { title: this.t("Facts.fact6.periodTitle"), dataIndex: "period_title" },
            { title: this.t("Facts.fact6.documentTitle"), dataIndex: "document_title" },
          ],
          data: this.facts_compensation_for_executives,
        },
      },
    };
  }
  get getFactscandidateinfo(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact6.electionTitle"),
        tableProps: {
          columns: [
            { title: this.t("Facts.fact6.personNameTitle"), dataIndex: "person_name" },
            {
              title: this.t("Facts.fact6.candidateInfoTitle"),
              colSpan: 2,
              children: [
                {
                  title: this.t("Facts.fact6.workplacePositionTitle"),
                  colSpan: 2,
                  children: [
                    { title: this.t("Facts.fact6.workplaceTitle"), dataIndex: "workplace" },
                    { title: this.t("Facts.fact6.positionTitle"), dataIndex: "position" },
                  ],
                },
                {
                  title: this.t("Facts.fact6.ownedSharesTitle"),
                  colSpan: 2,
                  children: [
                    { title: this.t("Facts.fact6.quantityTitle"), dataIndex: "quantity" },
                    { title: this.t("Facts.fact6.typeTitle"), dataIndex: "type" },
                  ],
                },
              ],
            },
            { title: this.t("Facts.fact6.votesCountTitle"), dataIndex: "votes_count" },
          ],
          data: this.facts_candidate_info,
        },
      },
    };
  }
}
