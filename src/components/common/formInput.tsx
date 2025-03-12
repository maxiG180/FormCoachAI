import React from "react";

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  rightElement?: React.ReactNode;
}

const FormInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  rightElement,
}: FormInputProps) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-sm sm:text-base text-base-content/70">
        {label}
      </span>
      {rightElement}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input input-bordered w-full text-sm sm:text-base"
      required={required}
    />
  </div>
);

export default FormInput;
