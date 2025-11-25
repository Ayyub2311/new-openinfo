"use client";
import SidebarSubscriptions from "./SidebarSubscriptions";
import Tabs from "@/app/shared/ui/components/Tabs";
import { Tab } from "@/app/shared/ui/components/Tabs/types";
import SidebarSubscribedLists from "./SubscribedLists";
export default function NotificationsContainer() {
  const tabs: Tab[] = [
    {
      id: "subscriptions",
      label: "Подписка",
      content: <SidebarSubscriptions />,
    },
    {
      id: "subscribed_list",
      label: "Подписанные организации",
      content: <SidebarSubscribedLists />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
}
