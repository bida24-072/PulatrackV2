import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>{children}</div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors w-full flex justify-center items-center gap-2";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    secondary: "bg-gold-500 text-white hover:bg-gold-600",
    outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
};

export const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition-all" {...props} />
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 bg-white" {...props}>
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export const Progress = ({ value, max = 100, className = "" }) => {
  const percentage = Math.min(100, (value / max) * 100) || 0;
  const color = percentage > 80 ? 'bg-red-500' : 'bg-teal-600';
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};
