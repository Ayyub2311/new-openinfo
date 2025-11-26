"use client";

import { useEffect, useState } from "react";

import { CardProps } from "@/app/shared/ui/components/Card/types";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { ErrorMessage } from "../ErrorMessage";
import { LoadingSkeleton } from "../NewsLoadingSkeleton";
import { CardGrid } from "@/app/shared/ui/components/Card/CardGrid";
import Container from "@/app/shared/ui/components/Container";

const fetchNewsData = async (imageSize: number) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const endpoint = `/api/v2/disclosure/fact-statistics/?start_date=${formatDate(
    startDate
  )}&end_date=${formatDate(endDate)}`;

  const data = await FetchService.fetch<{ top_watched_facts: any[] }>(endpoint);

  // Map and transform data
  return data.top_watched_facts.map(fact => ({
    title: fact.fact_title,
    subtitle: new Date(fact.pub_date).toLocaleDateString("ru-RU", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),

    width: imageSize,
    height: imageSize,
    fact_number: fact.fact_number,
    object_id: fact.object_id,
    org_id: fact.organization,
    org_short_name: fact.organization_short_name,
    logoFile: fact.logo ? `https://openinfo.uz/media/${fact.logo}` : undefined,
  }));
};

export const NewsGrid = () => {
  const [items, setItems] = useState<CardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(60);

  // Adjust image size based on screen width
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640)
        setImageSize(50); // mobile
      else if (width < 1024)
        setImageSize(60); // tablet
      else setImageSize(80); // desktop
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      console.log("Fetching news data...");
      try {
        const newsItems = await fetchNewsData(imageSize);
        setItems(newsItems);
      } catch (err) {
        console.error("Failed to load facts:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [imageSize]);

  if (isLoading) return <LoadingSkeleton imageSize={imageSize} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Container className="w-full"style={{
      padding: "0"
    }}>
      <CardGrid items={items} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" />
    </Container>
  );
};
