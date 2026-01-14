import { ArrowRight } from 'lucide-react';

export default function ButtonPrimary({ children, className = '', ...props }) {
  return (
    <button
      className={`btn-arrow-primary btn btn-primary text-gray-300 w-100 round-8 ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={24} className="arrow-icon" />
    </button>
  );
}
