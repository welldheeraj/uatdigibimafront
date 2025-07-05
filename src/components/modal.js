import { IoClose } from "react-icons/io5";

export default function Modal({
  isOpen,
  onClose,
  title = "Details",
  children,
  width = "max-w-3xl", 
     showConfirmButton = true,
  showCancelButton = true,
  confirmText = "Confirm",   
  cancelText = "Cancel",  
   onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${width} p-6 relative animate-slideUp`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>


        <div className="mt-6 flex justify-start gap-3">
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 thmbtn text-sm font-medium"
            >
              {cancelText}
            </button>
          )}

          {showConfirmButton && (
            <button
              className="px-4 py-2 thmbtn text-sm font-medium"
              onClick={onConfirm} 
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
