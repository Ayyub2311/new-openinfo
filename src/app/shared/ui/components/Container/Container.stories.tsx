import type { Meta, StoryObj } from "@storybook/react";
import Container from ".";

const meta = {
  title: "Components/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Default Container Content</div>,
  },
};

export const Small: Story = {
  args: {
    maxWidth: "sm",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Small Container</div>,
  },
};

export const Medium: Story = {
  args: {
    maxWidth: "md",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Medium Container</div>,
  },
};

export const Large: Story = {
  args: {
    maxWidth: "lg",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Large Container</div>,
  },
};

export const ExtraLarge: Story = {
  args: {
    maxWidth: "xl",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Extra Large Container</div>,
  },
};

export const TwoExtraLarge: Story = {
  args: {
    maxWidth: "2xl",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">2XL Container</div>,
  },
};

export const Full: Story = {
  args: {
    maxWidth: "full",
    children: <div className="h-32 bg-gray-200 flex items-center justify-center">Full Width Container</div>,
  },
};
