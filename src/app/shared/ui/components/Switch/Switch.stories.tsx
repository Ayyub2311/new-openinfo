import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta = {
  title: "Components/UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
    label: "Switch",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Checked Switch",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="sm" label="Small Switch" />
      <Switch size="md" label="Medium Switch" />
      <Switch size="lg" label="Large Switch" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch checked color="blue" label="Blue Switch" />
      <Switch checked color="green" label="Green Switch" />
      <Switch checked color="red" label="Red Switch" />
      <Switch checked color="purple" label="Purple Switch" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled Switch",
  },
};

export const NoLabel: Story = {
  args: {
    checked: false,
  },
};
