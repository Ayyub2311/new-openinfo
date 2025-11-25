import type { Meta, StoryObj } from "@storybook/react";
import Radio from ".";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controls the checked state of the radio button",
    },
    disabled: {
      control: "boolean",
      description: "Controls the disabled state of the radio button",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "Size of the radio button",
    },
    label: {
      control: "text",
      description: "Label text for the radio button",
    },
    value: {
      control: "text",
      description: "Value associated with the radio button",
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default size stories
export const Default: Story = {
  args: {
    label: "Продажа",
    value: "sale",
    checked: false,
    size: "default",
  },
};

export const DefaultChecked: Story = {
  args: {
    ...Default.args,
    checked: true,
  },
};

// Small size stories
export const Small: Story = {
  args: {
    label: "Продажа",
    value: "sale",
    checked: false,
    size: "small",
  },
};

export const SmallChecked: Story = {
  args: {
    ...Small.args,
    checked: true,
  },
};

// Show all variants
export const AllVariants: Partial<Story> = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Radio label="Default Unchecked" value="default1" size="default" />
        <Radio label="Default Checked" value="default2" checked size="default" />
      </div>
      <div className="flex gap-4">
        <Radio label="Small Unchecked" value="small1" size="small" />
        <Radio label="Small Checked" value="small2" checked size="small" />
      </div>
    </div>
  ),
};
