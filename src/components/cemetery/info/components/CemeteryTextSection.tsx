
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
    <div className="w-full py-2">
      <h3 className="text-base font-medium mb-2 flex items-center gap-2 text-foreground">
        <ScrollText className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <div className="rounded-md bg-muted/20 p-4">
        {formatMultilineText(content)}
      </div>
      <Separator className="mt-4 bg-slate-200" />
    </div>
  );
};

export default CemeteryTextSection;
