// components/swap/AddPlantButton.jsx
export default function AddPlantButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Tanaman
      </button>
    );
  }