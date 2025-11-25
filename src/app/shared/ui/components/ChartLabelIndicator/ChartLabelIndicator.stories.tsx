import type { Meta, StoryObj } from "@storybook/react";
import { ChartLabelIndicator } from "./ChartLabelIndicator";

const meta = {
  title: "Components/ChartLabelIndicator",
  component: ChartLabelIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartLabelIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "bg-sky-700",
    size: "sm",
  },
};

export const Secondary: Story = {
  args: {
    color: "bg-gray-700",
    size: "sm",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ChartLabelIndicator color="bg-sky-700" size="sm" />
      <ChartLabelIndicator color="bg-sky-700" size="md" />
      <ChartLabelIndicator color="bg-sky-700" size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ChartLabelIndicator color="bg-sky-700" size="md" />
      <ChartLabelIndicator color="bg-green-700" size="md" />
      <ChartLabelIndicator color="bg-amber-300" size="md" />
      <ChartLabelIndicator color="bg-green-400" size="md" />
    </div>
  ),
};
