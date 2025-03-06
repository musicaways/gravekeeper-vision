
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
      <p key={i} className="text-sm md:text-base text-muted-foreground mb-1">
        {line || <br />}
      </p>
    ));
  };

  return (
    <Card className="w-full shadow-sm rounded-lg bg-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3 text-foreground">{title}</h3>
        <div className="rounded-md">
          {formatMultilineText(content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockTextSection;
