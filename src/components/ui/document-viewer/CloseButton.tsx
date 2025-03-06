
import { X } from "lucide-react";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button 
      className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
      onClick={onClose}
      aria-label="Chiudi visualizzatore"
    >
      <X className="h-6 w-6" />
    </button>
  );
};

export default CloseButton;
