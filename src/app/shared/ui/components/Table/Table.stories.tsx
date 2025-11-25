import type { Meta, StoryObj } from "@storybook/react";
import { Table } from ".";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["developer", "nice"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["designer"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["manager"],
  },
];

export const Basic: Story = {
  args: {
    columns: [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
    ],
    data,
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
      },
      {
        title: "Tags",
        dataIndex: "tags",
        render: (tags: string[]) => (
          <div className="flex gap-1">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {tag}
              </span>
            ))}
          </div>
        ),
      },
    ],
    data,
  },
};

export const GroupedColumns: Story = {
  args: {
    columns: [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Information",
        colSpan: 2,
        children: [
          {
            title: "Age",
            dataIndex: "age",
          },
          {
            title: "Address",
            dataIndex: "address",
          },
        ],
      },
    ],
    data,
  },
};

export const CustomAlignment: Story = {
  args: {
    columns: [
      {
        title: "Name",
        dataIndex: "name",
        align: "left",
      },
      {
        title: "Age",
        dataIndex: "age",
        align: "center",
      },
      {
        title: "Address",
        dataIndex: "address",
        align: "right",
      },
    ],
    data,
  },
};

export const Loading: Story = {
  args: {
    ...Basic.args,
    loading: true,
  },
};

export const Borderless: Story = {
  args: {
    ...Basic.args,
    bordered: false,
  },
};
