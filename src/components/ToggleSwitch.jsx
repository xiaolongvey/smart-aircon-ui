const ToggleSwitch = ({ checked, onChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-aircon-gray-700">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-aircon-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : checked 
            ? 'bg-aircon-blue-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch








