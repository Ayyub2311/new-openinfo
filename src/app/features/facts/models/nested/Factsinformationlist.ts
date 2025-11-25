import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factsinformationlist {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  akt_name: string;

  @IsString()
  pub_date: string;

  @IsNumber()
  sum: number;

  @IsNumber()
  prosent: number;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factsinformationlist>[] {
    const columns: TableColumn<Factsinformationlist>[] = [
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
