import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputField = ({ 
  label, 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  error = null,
  required = false,
  icon = null
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <motion.input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          animate={focused ? { scale: 1.01, boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)' } : { scale: 1 }}
          className={`block w-full px-4 py-2 rounded-md border ${error ? 'border-red-500' : focused ? 'border-blue-400' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${icon ? 'pl-10' : ''}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
