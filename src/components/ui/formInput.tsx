import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: React.ReactNode;
}

const FormInput = ({
  label,
  rightElement,
  className = "",
  ...props
}: FormInputProps) => {
  return (
    <div className="form-control w-full">
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-medium text-white">{label}</label>
        {rightElement}
      </div>
      <input
        className={`w-full px-4 py-3 bg-black border border-[#FF6500]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500] focus:border-transparent text-white placeholder-gray-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export default FormInput;
