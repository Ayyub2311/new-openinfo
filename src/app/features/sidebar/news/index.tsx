import { Text } from "@/app/shared/ui/components/Typography/Text";
import React from "react";

interface NewsProps {
  title: string;
  date: string;
}

const Post: React.FC<NewsProps> = ({ title, date }) => {
  return (
    <div className="border-b border-gray-300 py-4">
      <Text className="text-lg font-medium">{title}</Text>
      <Text className="text-gray-500 text-sm">{date}</Text>
    </div>
  );
};

const News: React.FC = () => {
  const posts = [
    { title: "Lorem ipsum dolor sit amet consectetur. Parturient elit a magna", date: "Aug 18, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur", date: "Aug 22, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur. Parturient elit a magna", date: "Aug 23, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur. Parturient elit a magna", date: "Aug 26, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur.", date: "Aug 28, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur.", date: "Aug 31, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur.", date: "Aug 31, 2024" },
    { title: "Lorem ipsum dolor sit amet consectetur. Parturient elit a magna", date: "Sep 04, 2024" },
  ];

  return (
    <div className="font-sans">
      {posts.map((post, index) => (
        <Post key={index} title={post.title} date={post.date} />
      ))}
    </div>
  );
};

export default News;
