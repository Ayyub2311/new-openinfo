import type { Meta, StoryObj } from "@storybook/react";
import FormItem from ".";
import Input from "../Input";

const meta = {
  title: "Components/FormItem",
  component: FormItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
  },
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    children: <Input placeholder="Enter value" />,
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    required: true,
    children: <Input placeholder="Enter value" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Field with Error",
    error: "This field is required",
    children: <Input className="border-red-500" placeholder="Enter value" />,
  },
};
