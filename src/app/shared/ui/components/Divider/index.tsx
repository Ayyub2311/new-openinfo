const Divider: React.FC<{ orientation?: "horizontal" | "vertical" }> = ({ orientation = "horizontal" }) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`
        border border-zinc-100
        ${isVertical ? "h-full w-px" : "w-full h-px"}
      `}
    />
  );
};

export default Divider;
