
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BlockTextSectionProps {
  title: string;
  content: string;
}

const BlockTextSection: React.FC<BlockTextSectionProps> = ({ title, content }) => {
  if (!content) return null;

  const formatMultilineText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="text-sm md:text-base mb-1">
        {line || <br />}
      </p>
    ));
  };

  return (
    <Card className="w-full shadow-sm mb-6">
      <CardContent className="px-4 md:px-6 py-4 md:py-6">
        <h3 className="text-xl font-medium mb-4">{title}</h3>
        <div className="p-4 rounded-md w-full">
          {formatMultilineText(content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockTextSection;
