// components/modal/Modal1.jsx

const Modal1 = ({ title, fileUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-6xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={fileUrl}
            title="PDF Preview"
            className="w-full h-full"
            frameBorder="0"
          >
            Your browser does not support iframes
          </iframe>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal1;
