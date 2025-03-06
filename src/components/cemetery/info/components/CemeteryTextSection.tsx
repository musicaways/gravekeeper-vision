
import React from "react";
import { Separator } from "@/components/ui/separator";
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
    <div className="w-full">
      <div className="flex items-center mb-3">
        <ScrollText className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">{title}</h3>
      </div>
      <div className="pl-7 pr-1 mb-4">
        {formatMultilineText(content)}
      </div>
      <Separator className="mb-4" />
    </div>
  );
};

export default CemeteryTextSection;
