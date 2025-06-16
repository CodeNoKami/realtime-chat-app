import { useEffect } from 'react';

const LightBox = ({ src, onClose }) => {
   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [onClose]);

   return (
      <div
         className="fixed inset-0 z-[1000] bg-base-100/50 backdrop-blur-sm bg-opacity-80 flex items-center justify-center"
         onClick={onClose}
      >
         <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
               className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
               onClick={onClose}
               aria-label="Close lightbox"
            >
               ✕
            </button>
            <img
               src={src}
               alt="Preview"
               className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
               draggable={false}
            />
         </div>
      </div>
   );
};

export default LightBox;
