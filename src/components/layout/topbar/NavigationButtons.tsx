
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "../../ui/button";

interface NavigationButtonsProps {
  onMenuClick?: () => void;
  showBackButton?: boolean;
  onBackClick: () => void;
}

const NavigationButtons = ({ 
  onMenuClick, 
  showBackButton = false,
  onBackClick
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center">
      {onMenuClick && (
        <Button onClick={onMenuClick} variant="ghost" size="icon" className="ml-1" aria-label="Menu" type="button">
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {showBackButton && (
        <Button onClick={onBackClick} variant="ghost" size="icon" aria-label="Torna indietro" type="button">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
