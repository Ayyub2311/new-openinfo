import type { Meta, StoryObj } from "@storybook/react";
import Toggle from ".";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    isOn: false,
  },
};

export const Enabled: Story = {
  args: {
    isOn: true,
  },
};

export const Disabled: Story = {
  args: {
    isOn: false,
    disabled: true,
  },
};

export const DisabledAndOn: Story = {
  args: {
    isOn: true,
    disabled: true,
  },
};
