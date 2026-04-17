import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // ✅ close on backdrop click
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {children}
      </div>
    </div>
  );
};

export default Modal;