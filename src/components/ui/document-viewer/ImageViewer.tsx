
import { motion } from "framer-motion";

interface ImageViewerProps {
  url: string;
  title: string;
  scale: number;
  toggleControls: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
}

const ImageViewer = ({
  url,
  title,
  scale,
  toggleControls,
  handleDoubleClick
}: ImageViewerProps) => {
  const imageStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    transition: 'transform 0.2s ease-out'
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <motion.img
        src={url}
        alt={title}
        className="max-h-full max-w-full object-contain cursor-zoom-in"
        style={imageStyle}
        onClick={(e) => {
          e.stopPropagation();
          toggleControls();
        }}
        onDoubleClick={handleDoubleClick}
        draggable={false}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
    </div>
  );
};

export default ImageViewer;
