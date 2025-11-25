import type { Meta, StoryObj } from "@storybook/react";
import PieChart from ".";

const meta = {
  title: "Charts/PieChart",
  component: PieChart,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    percentage: {
      control: { type: "range", min: 0, max: 100 },
      description: "The percentage to fill the chart",
    },
    size: {
      control: { type: "range", min: 50, max: 300 },
      description: "The size of the chart in pixels",
    },
    strokeWidth: {
      control: { type: "range", min: 2, max: 20 },
      description: "The width of the stroke",
    },
    bgColor: {
      control: "color",
      description: "The background circle color",
    },
    fillColor: {
      control: "color",
      description: "The fill circle color",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 75,
    size: 100,
    strokeWidth: 8,
    bgColor: "#E6F0FF",
    fillColor: "#3B82F6",
  },
};

export const Large: Story = {
  args: {
    percentage: 90,
    size: 200,
    strokeWidth: 12,
    bgColor: "#E6F0FF",
    fillColor: "#3B82F6",
  },
};

export const Small: Story = {
  args: {
    percentage: 45,
    size: 60,
    strokeWidth: 4,
    bgColor: "#E6F0FF",
    fillColor: "#3B82F6",
  },
};

export const CustomColors: Story = {
  args: {
    percentage: 88,
    size: 120,
    strokeWidth: 8,
    bgColor: "#FFE4E4",
    fillColor: "#EF4444",
  },
};

export const FullCircle: Story = {
  args: {
    percentage: 100,
    size: 100,
    strokeWidth: 8,
    bgColor: "#E6F0FF",
    fillColor: "#3B82F6",
  },
};

export const EmptyCircle: Story = {
  args: {
    percentage: 0,
    size: 100,
    strokeWidth: 8,
    bgColor: "#E6F0FF",
    fillColor: "#3B82F6",
  },
};
