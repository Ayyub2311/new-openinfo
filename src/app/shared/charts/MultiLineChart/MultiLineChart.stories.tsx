import type { Meta, StoryObj } from "@storybook/react";
import { MultiLineChart } from ".";
import { LineDataSet } from "../types";

const meta: Meta<typeof MultiLineChart> = {
  title: "Charts/MultiLineChart",
  component: MultiLineChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MultiLineChart>;

const generateMockData = (count: number): LineDataSet[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return [
    {
      name: "2023",
      color: "#3B82F6",
      data: months.slice(0, count).map(month => ({
        label: month,
        value: Math.round(Math.random() * 1000 + 500),
      })),
    },
    {
      name: "2024",
      color: "#10B981",
      data: months.slice(0, count).map(month => ({
        label: month,
        value: Math.round(Math.random() * 1000 + 700),
      })),
    },
  ];
};

export const Default: Story = {
  args: {
    datasets: generateMockData(12),
  },
};

export const CustomStyling: Story = {
  args: {
    datasets: generateMockData(6),
    width: 600,
    height: 300,
    padding: { top: 30, right: 30, bottom: 50, left: 70 },
    grid: {
      color: "#94A3B8",
      opacity: 0.3,
      dashArray: "5,5",
    },
    dots: {
      radius: 6,
      fill: "#F8FAFC",
    },
    lineSmoothing: 0.5,
    labelClassName: "text-sm fill-slate-600",
  },
};

export const NoGrid: Story = {
  args: {
    datasets: generateMockData(12),
    grid: {
      show: false,
    },
  },
};

export const NoDots: Story = {
  args: {
    datasets: generateMockData(12),
    dots: {
      show: false,
    },
  },
};

export const NoSmoothing: Story = {
  args: {
    datasets: generateMockData(12),
    lineSmoothing: 0,
  },
};
