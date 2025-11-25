import type { Meta, StoryObj } from "@storybook/react";
import { Title } from ".";

const meta: Meta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Primary: Story = {
  args: {
    children: "Primary Title",
    level: 1,
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Title",
    level: 2,
    variant: "secondary",
  },
};

export const Level3: Story = {
  args: {
    children: "Level 3 Title",
    level: 3,
    variant: "primary",
  },
};

export const CustomClassName: Story = {
  args: {
    children: "Custom Styled Title",
    level: 1,
    className: "text-red-500 italic",
  },
};
