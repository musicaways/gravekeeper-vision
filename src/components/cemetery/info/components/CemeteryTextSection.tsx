
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

interface CemeteryTextSectionProps {
  title: string;
  content: string | null;
}

const CemeteryTextSection = ({ title, content }: CemeteryTextSectionProps) => {
  if (!content) return null;

  const formatMultilineText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">
        {line || <br />}
      </p>
    ));
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-foreground">
          <ScrollText className="h-5 w-5 text-primary" />
          {title}
        </h3>
        <div className="rounded-md bg-muted/30 p-4">
          {formatMultilineText(content)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CemeteryTextSection;
