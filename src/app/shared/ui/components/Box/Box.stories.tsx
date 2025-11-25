import type { Meta, StoryObj } from "@storybook/react";
import Box from ".";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Box Content",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Box Content",
  },
};

export const WithCustomClassName: Story = {
  args: {
    variant: "primary",
    className: "bg-gray-100",
    children: "Box with custom class",
  },
};
