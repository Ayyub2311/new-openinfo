import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from ".";
import { Bell, Check, X, AlertCircle } from "lucide-react";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    dot: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Badge",
  },
};

export const WithDot: Story = {
  args: {
    dot: true,
    children: "With Dot",
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: Bell,
    children: "Notifications",
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: Check,
    children: "Completed",
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: Bell,
    rightIcon: Check,
    children: "Both Icons",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Badge size="sm">Small Badge</Badge>
      <Badge size="md">Medium Badge</Badge>
      <Badge size="lg">Large Badge</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="primary" leftIcon={Bell} dot>
        12 Notifications
      </Badge>
      <Badge variant="success" rightIcon={Check}>
        Task Complete
      </Badge>
      <Badge variant="warning" leftIcon={AlertCircle}>
        Warning Alert
      </Badge>
      <Badge variant="danger" rightIcon={X}>
        Error Occurred
      </Badge>
    </div>
  ),
};
