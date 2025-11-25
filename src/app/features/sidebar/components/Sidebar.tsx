"use client";
import React from "react";
import QuotesContainer from "../quotes/QuotesContainer";
import WatchlistContainer from "../watchlist/WatchlistContainer";
import NotificationsContainer from "../notification";
import Calculator from "../tariff";

export const sidebarItems = [
  {
    id: "quotes",
    label: "quotes",
    icon: "/assets/sidebar-icons/quotes.svg",
    component: <QuotesContainer />,
  },
  {
    id: "watchlist",
    label: "watchlist",
    icon: "/assets/sidebar-icons/watchlist.svg",
    component: <WatchlistContainer />,
  },
  {
    id: "notifications",
    label: "notifications",
    icon: "/assets/sidebar-icons/notifications.svg",
    component: <NotificationsContainer />,
  },
  // {
  //   id: "brokers",
  //   label: "Каталог брокеров",
  //   icon: "/assets/sidebar-icons/brokers.svg",
  //   component: <BrokerCatalog />,
  // },
  // { id: "news", label: "Последние новости", icon: "/assets/sidebar-icons/news.svg", component: <News /> },
  // { id: "tools", label: "Инструменты", icon: "/assets/sidebar-icons/tools.svg", component: <ToolsContainer /> },
  { id: "tariff", label: "fees", icon: "/assets/sidebar-icons/tariff.svg", component: <Calculator /> },
];
