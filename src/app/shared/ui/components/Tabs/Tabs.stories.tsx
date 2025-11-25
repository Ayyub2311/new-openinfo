import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from ".";
import { Tab } from "./types";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs: Tab[] = [
  {
    id: "tab1",
    label: "Account",
    content: <div className="p-4">Account settings and preferences</div>,
  },
  {
    id: "tab2",
    label: "Password",
    content: <div className="p-4">Password and security settings</div>,
  },
  {
    id: "tab3",
    label: "Notifications",
    content: <div className="p-4">Manage your notification preferences</div>,
  },
  {
    id: "tab4",
    label: "Billing",
    content: <div className="p-4">Billing history and payment methods</div>,
  },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
  },
};

export const WithDefaultTab: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: "tab2",
  },
};

export const WithCustomClass: Story = {
  args: {
    tabs: sampleTabs,
    className: "max-w-2xl mx-auto",
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      ...sampleTabs,
      {
        id: "tab5",
        label: "Privacy",
        content: <div className="p-4">Privacy settings</div>,
      },
      {
        id: "tab6",
        label: "API Keys",
        content: <div className="p-4">Manage API keys</div>,
      },
      {
        id: "tab7",
        label: "Team",
        content: <div className="p-4">Team management</div>,
      },
      {
        id: "tab8",
        label: "Integration",
        content: <div className="p-4">Third-party integrations</div>,
      },
    ],
  },
};
