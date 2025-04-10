import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModalPopup = ({
  type,
  title,
  message,
  duration = 3000,
  navigatePath = null,
  autoClose = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

//   for navigation 
const navigate = useNavigate();

  // Handle auto-close after specified duration
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      // Call navigation callback if provided
      if (navigatePath) {
        navigate(navigatePath);
      }
    }, 300); // Allow time for exit animation
  };

  if (!isVisible && !document.getElementById('modal-portal')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
      <div
        className={`relative mx-auto max-w-md rounded-lg shadow-xl transition-all duration-300 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${
          type === 'success' ? 'bg-gray-900 border-2 border-green-600' : 'bg-gray-900 border-2 border-red-600'
        }`}
      >
        <div className="p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`rounded-full p-3 ${
              type === 'success' ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              {type === 'success' ? (
                <CheckCircle size={40} className="text-green-500" />
              ) : (
                <AlertCircle size={40} className="text-red-500" />
              )}
            </div>
            
            <h3 className={`text-xl font-semibold ${
              type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {title}
            </h3>
            
            <p className="text-gray-300 mt-2 max-w-xs">
              {message}
            </p>
            
            <button
              onClick={handleClose}
              className={`mt-4 px-6 py-2 rounded-md font-medium transition-colors ${
                type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;

// // Demo component to show how to use the modal
// const PopupDemo = () => {
//   const [activeModal, setActiveModal] = useState(null);
  
//   // Function that would handle navigation in a real app
//   const handleNavigation = (path) => {
//     console.log(`Navigating to: ${path}`);
//     // In a real app, you would use your navigation method here
//     // Example if using window location: window.location.href = path;
//   };
  
//   const showSuccessModal = () => {
//     setActiveModal({
//       type: 'success',
//       title: 'Operation Successful',
//       message: 'Your action has been completed successfully!',
//       navigatePath: '/dashboard' // The path you want to navigate to
//     });
//   };
  
//   const showFailureModal = () => {
//     setActiveModal({
//       type: 'error',
//       title: 'Operation Failed',
//       message: 'There was a problem completing your request. Please try again.',
//       navigatePath: '/error-details'
//     });
//   };
  
//   const closeModal = () => {
//     setActiveModal(null);
//   };
  
//   return (
//     <div className="flex flex-col items-center justify-center p-6 bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold text-white mb-6">Modal Popup Demo</h1>
      
//       <div className="flex space-x-4">
//         <button 
//           onClick={showSuccessModal}
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//         >
//           Show Success Modal
//         </button>
        
//         <button 
//           onClick={showFailureModal}
//           className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Show Error Modal
//         </button>
//       </div>
      
//       {activeModal && (
//         <ModalPopup
//           type={activeModal.type}
//           title={activeModal.title}
//           message={activeModal.message}
//           onClose={closeModal}
//           onNavigate={handleNavigation}
//           navigatePath={activeModal.navigatePath}
//           duration={3000} // 3 seconds auto-close
//         />
//       )}
//     </div>
//   );
// };

// export default PopupDemo;