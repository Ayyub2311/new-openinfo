import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factsterminationpower {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  question_name: string;

  @IsString()
  work_place: string;

  @IsString()
  position: string;

  @IsNumber()
  num_aksiya: number;

  @IsString()
  type_aksiya: string;

  @IsString()
  other_work_place: string;

  @IsString()
  other_position: string;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factsterminationpower>[] {
    const columns: TableColumn<Factsterminationpower>[] = [
      {
        title: "Ф.И.О. лица или полное наименование доверительного управляющего",
        dataIndex: "question_name",
      },
      {
        title: "Место работы, должность",
        colSpan: 2,
        children: [
          {
            title: "Местонахождение (почтовый адрес)",
            dataIndex: "work_place",
          },
          {
            title: "Должность",
            dataIndex: "position",
          },
        ],
      },
      {
        title: "Принадлежащие акции",
        colSpan: 2,
        children: [
          {
            title: "Тип",
            dataIndex: "type_aksiya",
          },
          {
            title: "Количество",
            dataIndex: "num_aksiya",
          },
        ],
      },
      {
        title: "Работа в других организациях",
        colSpan: 2,
        children: [
          {
            title: "Место",
            dataIndex: "other_position",
          },
          {
            title: "Должность",
            dataIndex: "other_work_place",
          },
        ],
      },
    ];

    return columns;
  }
}
