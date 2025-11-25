import type { Meta, StoryObj } from "@storybook/react";
import Divider from ".";

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: args => (
    <div className="w-64">
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: args => (
    <div className="h-32">
      <Divider {...args} />
    </div>
  ),
};
