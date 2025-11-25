import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber } from "class-validator";

export class FactsVotingResult {
  @IsNumber()
  id: number;

  @IsString()
  num: string;

  @IsString()
  question_name: string;

  @IsNumber()
  yes_percent: number;

  @IsNumber()
  yes_sum: number;

  @IsNumber()
  no_percent: number;

  @IsNumber()
  no_sum: number;

  @IsNumber()
  abstentions_percent: number;

  @IsNumber()
  abstentions_sum: number;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<FactsVotingResult>[] {
    const columns: TableColumn<FactsVotingResult>[] = [
      {
        title: "Вопросы, поставленные на голосование",
        dataIndex: "question_name",
      },
      {
        title: "Итоги голосования",
        colSpan: 3,
        children: [
          {
            title: "За",
            colSpan: 2,
            children: [
              { title: "%", dataIndex: "yes_percent" },
              { title: "Количество", dataIndex: "yes_sum" },
            ],
          },
          {
            title: "Против",
            colSpan: 2,
            children: [
              { title: "%", dataIndex: "no_percent" },
              { title: "Количество", dataIndex: "no_sum" },
            ],
          },
          {
            title: "Воздержались",
            colSpan: 2,
            children: [
              { title: "%", dataIndex: "abstentions_percent" },
              { title: "Количество", dataIndex: "abstentions_sum" },
            ],
          },
        ],
      },
    ];

    return columns;
  }
}
