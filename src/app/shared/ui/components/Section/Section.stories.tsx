import type { Meta, StoryObj } from "@storybook/react";
import { Mail, AlertCircle, Bell } from "lucide-react";
import Section from ".";

const meta: Meta<typeof Section> = {
  title: "Components/Section",
  component: Section,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    title: "Default Section",
    children: <p>This is the default section content</p>,
  },
};

export const WithIcon: Story = {
  args: {
    title: "Section with Icon",
    children: <p>This section has an icon</p>,
    icon: Mail,
    showIcon: true,
  },
};

export const CustomIcon: Story = {
  args: {
    title: "Custom Icon Section",
    children: <p>This section has a custom icon with styling</p>,
    icon: AlertCircle,
    showIcon: true,
    iconClassName: "w-6 h-6 text-red-500",
  },
};

export const ComplexContent: Story = {
  args: {
    title: "Complex Content Section",
    children: (
      <div className="space-y-4">
        <p>This section contains multiple elements</p>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span>Notification item</span>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Action Button</button>
      </div>
    ),
  },
};
