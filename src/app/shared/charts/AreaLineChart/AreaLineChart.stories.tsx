import type { Meta, StoryObj } from "@storybook/react";
import { AreaLineChart } from ".";

const meta = {
  title: "Charts/AreaLineChart",
  component: AreaLineChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AreaLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 35 },
  { label: "Apr", value: 60 },
  { label: "May", value: 25 },
  { label: "Jun", value: 80 },
];

export const Default: Story = {
  args: {
    data: defaultData,
    width: 800,
    height: 400,
  },
};

export const Curved: Story = {
  args: {
    ...Default.args,
    lineType: "curved",
  },
};

export const CustomColors: Story = {
  args: {
    ...Default.args,
    colors: {
      line: "#10B981",
      area: {
        from: "#10B981",
        to: "#ECFDF5",
      },
      dots: {
        border: "#10B981",
        fill: "#FFFFFF",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    width: 400,
    height: 200,
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  },
};

export const HighDensity: Story = {
  args: {
    data: Array.from({ length: 24 }, (_, i) => ({
      label: `Hour ${i}`,
      value: Math.random() * 100,
    })),
    width: 800,
    height: 400,
  },
};
