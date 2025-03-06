
import React from "react";

interface CemeteryTextSectionProps {
  title: string;
  content: string | null;
}

const CemeteryTextSection = ({ title, content }: CemeteryTextSectionProps) => {
  if (!content) return null;

  const formatMultilineText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="text-sm md:text-base mb-1">
        {line || <br />}
      </p>
    ));
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="p-4 rounded-md w-full">
        {formatMultilineText(content)}
      </div>
    </div>
  );
};

export default CemeteryTextSection;
