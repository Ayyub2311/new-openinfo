"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar, ConfigProvider, Badge, Popover, Collapse, Tooltip, Spin } from "antd";
import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import ruRU from "antd/locale/ru_RU";

import { FetchService } from "@/app/shared/lib/api/fetch.service";

dayjs.locale("ru");

// Types
interface ApiCalendarEvent {
  event_date: string;
  title: string;
  description: string;
  content_type: string;
  moderator_name: string;
}

interface MappedCalendarEvent {
  type: string;
  content: string;
  description: string;
  moderator_name: string;
  full: ApiCalendarEvent;
}

export default function CalendarView() {
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [mode, setMode] = useState<CalendarMode>("month");
  const [events, setEvents] = useState<ApiCalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalendarData = async (year: number, month?: number) => {
    setLoading(true);
    try {
      const query = month ? `?year=${year}&month=${month}` : `?year=${year}`;
      const response = await FetchService.fetch<{ results: ApiCalendarEvent[] }>(
        `api/v2/surveillance/investor-calendar/${query}`
      );
      setEvents(response.results);
    } catch (error) {
      console.error("Calendar fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStatus = (type: string): string => {
    switch (type) {
      case "dividend":
        return "success";
      case "announcement":
        return "warning";
      case "system":
        return "processing";
      default:
        return "default";
    }
  };

  useEffect(() => {
    if (mode === "month") {
      fetchCalendarData(value.year(), value.month() + 1);
    } else if (mode === "year") {
      fetchCalendarData(value.year());
    }
  }, [value, mode]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, MappedCalendarEvent[]> = {};
    events.forEach(event => {
      const key = dayjs(event.event_date).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push({
        type: getBadgeStatus(event.content_type),
        content: event.title,
        description: event.description,
        moderator_name: event.moderator_name,
        full: event,
      });
    });
    return map;
  }, [events]);

  const getEventsForDate = (date: Dayjs): MappedCalendarEvent[] => {
    const key = date.format("YYYY-MM-DD");
    return eventsByDate[key] || [];
  };

  const getEventsForMonth = (date: Dayjs): MappedCalendarEvent[] => {
    const prefix = date.format("YYYY-MM");
    return Object.entries(eventsByDate)
      .filter(([key]) => key.startsWith(prefix))
      .flatMap(([_, items]) => items);
  };

  const handlePanelChange = (newDate: Dayjs, newMode: CalendarMode) => {
    setValue(newDate);
    setMode(newMode);
  };

  const renderEvents = (eventList: MappedCalendarEvent[]) => (
    <>
      {eventList.slice(0, 2).map((item, idx) => (
        <li key={idx} className="mb-1">
          <Popover
            overlay="custom-popover"
            className="custom-popover"
            trigger="click"
            content={
              <Collapse
                items={[
                  {
                    key: String(idx),
                    label: item.content,
                    children: <div dangerouslySetInnerHTML={{ __html: item.description }} />,
                  },
                ]}
              />
            }
          >
            <span>
              <Tooltip title={item.moderator_name}>
                <Badge status={item.type as any}>
                  <span className="block truncate  max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.content}
                  </span>
                </Badge>
              </Tooltip>
            </span>
          </Popover>
        </li>
      ))}

      {eventList.length > 2 && (
        <li>
          <Popover
            overlay="custom-popover"
            className="max-w-[50vw] max-h-[50vh] overflow-y-auto custom-popover"
            trigger="click"
            content={
              <Collapse
                className="max-w-[50vw] max-h-[50vh] overflow-y-auto "
                items={eventList.map((item, idx) => ({
                  key: String(idx),
                  label: item.content,
                  children: <div dangerouslySetInnerHTML={{ __html: item.description }} />,
                }))}
              />
            }
          >
            <span className="cursor-pointer text-xs text-blue-600 flex items-center">
              <span className="w-[6px] h-[6px] bg-blue-600 rounded-full mr-1"></span>+ ещё {eventList.length - 2}
            </span>
          </Popover>
        </li>
      )}
    </>
  );

  return (
    <ConfigProvider locale={ruRU}>
      <Spin spinning={loading}>
        <Calendar
          value={value}
          mode={mode}
          onPanelChange={handlePanelChange}
          cellRender={(current, info) => {
            if (info.type === "date") {
              return <ul className="list-none m-0 p-0">{renderEvents(getEventsForDate(current))}</ul>;
            }
            if (info.type === "month") {
              return <ul className="list-none m-0 p-0">{renderEvents(getEventsForMonth(current))}</ul>;
            }
            return null;
          }}
        />
      </Spin>
    </ConfigProvider>
  );
}
