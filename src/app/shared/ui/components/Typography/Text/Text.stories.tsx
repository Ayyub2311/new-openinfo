import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta = {
  title: "components/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "inverse", "accent", "success", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  args: {
    children: "Primary Text",
    variant: "primary",
    size: "md",
    weight: "normal",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Text",
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary Text",
    variant: "tertiary",
  },
};

export const Inverse: Story = {
  args: {
    children: "Inverse Text",
    variant: "inverse",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Accent: Story = {
  args: {
    children: "Accent Text",
    variant: "accent",
  },
};

export const Success: Story = {
  args: {
    children: "Success Text",
    variant: "success",
  },
};

export const Link: Story = {
  args: {
    children: "Link Text",
    variant: "link",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text size="xs">Extra Small Text</Text>
      <Text size="sm">Small Text</Text>
      <Text size="md">Medium Text</Text>
      <Text size="lg">Large Text</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text weight="normal">Normal Weight</Text>
      <Text weight="medium">Medium Weight</Text>
      <Text weight="semibold">Semibold Weight</Text>
      <Text weight="bold">Bold Weight</Text>
    </div>
  ),
};
