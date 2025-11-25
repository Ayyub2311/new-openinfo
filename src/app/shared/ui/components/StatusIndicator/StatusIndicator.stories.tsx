import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "./StatusIndicator";

const meta = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    status: "active",
    size: "sm",
    pulse: true,
  },
};

export const Inactive: Story = {
  args: {
    status: "inactive",
    size: "sm",
    pulse: false,
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    size: "sm",
    pulse: true,
  },
};

export const Error: Story = {
  args: {
    status: "error",
    size: "sm",
    pulse: true,
  },
};

export const WithoutPulse: Story = {
  args: {
    status: "active",
    size: "sm",
    pulse: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusIndicator status="active" size="sm" pulse />
      <StatusIndicator status="active" size="md" pulse />
      <StatusIndicator status="active" size="lg" pulse />
    </div>
  ),
};
