import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionList } from ".";
import { Badge } from "../Badge";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        label: "Name",
        value: "John Doe",
      },
      {
        label: "Email",
        value: "john@example.com",
      },
      {
        label: "Role",
        value: "Software Engineer",
      },
    ],
  },
};

export const WithReactNode: Story = {
  args: {
    items: [
      {
        label: "Status",
        value: <Badge>Active</Badge>,
      },
      {
        label: "Team",
        value: <Badge variant="primary">Frontend</Badge>,
      },
    ],
  },
};

export const WithLongValue: Story = {
  args: {
    items: [
      {
        label: "Description",
        value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
  },
};
