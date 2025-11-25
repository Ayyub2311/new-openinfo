import type { Meta, StoryObj } from "@storybook/react";
import { Settings, Upload } from "lucide-react";
import { Button } from "./Button";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="filled">Filled</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button color="default">Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">Danger</Button>
      <Button color="gray">Gray</Button>
      <Button color="export">Export</Button>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button shape="rect">Rectangle</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="pill">Pill</Button>
      <Button shape="circle" className="w-15">
        <Settings size={18} />
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button leftIcon={Upload}>Upload</Button>
      <Button rightIcon={Settings}>Settings</Button>
      <Button leftIcon={Upload} rightIcon={Settings}>
        Both Icons
      </Button>
    </div>
  ),
};

export const BorderStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button border={{ style: "solid" }}>Solid</Button>
      <Button border={{ style: "dashed" }}>Dashed</Button>
      <Button border={{ style: "dotted" }}>Dotted</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button isLoading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button active>Active</Button>
      <Button hover>Hover</Button>
    </div>
  ),
};

export const CustomBorderRadius: Story = {
  args: {
    children: "Custom Radius",
    borderRadius: 12,
  },
};
