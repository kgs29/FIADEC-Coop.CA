import React from "react";

interface Props {
  title?: string;
  color?: "red" | "yellow" | "blue" | "green";
}

const Banner: React.FC<Props> = ({ title, color }) => {
  const colorMap = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-900",
    green: "bg-primary",
  };
  const textColorMap = {
    red: "text-white",
    yellow: "text-black",
    blue: "text-white",
    green: "text-white",
  };

  const bgColor = color ? colorMap[color] : "bg-secondary";
  const textColor = color ? textColorMap[color] : "bg-secondary";

  return (
    <div className={`w-full h-48 ${bgColor} ${textColor}`}>
      {title && <div className="px-10 font-bold text-2xl pt-7">{title}</div>}
    </div>
  );
};

export default Banner;
