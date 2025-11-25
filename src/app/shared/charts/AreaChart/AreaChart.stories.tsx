import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart } from "./index";
import { AreaChartProps } from "./types";

const meta: Meta<AreaChartProps> = {
  title: "Charts/AreaChart",
  component: AreaChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AreaChartProps>;

const defaultData = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 35 },
  { label: "Apr", value: 55 },
  { label: "May", value: 40 },
  { label: "Jun", value: 60 },
  { label: "Jul", value: 50 },
  { label: "Aug", value: 75 },
];

export const Default: Story = {
  args: {
    data: defaultData,
  },
};

export const CustomColors: Story = {
  args: {
    data: defaultData,
    areaColor: {
      from: "#10B981",
      to: "#D1FAE5",
    },
    lineColor: "#059669",
  },
};

export const NoGrid: Story = {
  args: {
    data: defaultData,
    grid: {
      show: false,
    },
  },
};

export const DashedGrid: Story = {
  args: {
    data: defaultData,
    grid: {
      dashArray: "4",
      color: "#94A3B8",
      opacity: 0.5,
    },
  },
};

export const CustomSize: Story = {
  args: {
    data: defaultData,
    width: 500,
    height: 300,
    padding: {
      top: 30,
      right: 30,
      bottom: 50,
      left: 70,
    },
  },
};

export const NoLabels: Story = {
  args: {
    data: defaultData,
    showLabels: false,
    grid: {
      showLabels: false,
    },
  },
};

export const CustomFormatter: Story = {
  args: {
    data: defaultData.map(d => ({ ...d, value: d.value * 1000 })),
    grid: {
      labelFormatter: (value: number) => `$${value.toLocaleString()}`,
    },
  },
};
