
interface SwipeIndicatorProps {
  direction: "left" | "right";
}

const SwipeIndicator = ({ direction }: SwipeIndicatorProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none flex items-center ${direction === "right" ? "justify-start" : "justify-end"}`}>
      <div className={`bg-white/10 h-full w-20 ${direction === "right" ? "rounded-r-full" : "rounded-l-full"}`}></div>
    </div>
  );
};

export default SwipeIndicator;
