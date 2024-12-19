import React from "react";

interface InputFieldProps {
  label?: string;
  labelStyle?: string;
  icon?: string;
  secureTextEntry?: boolean;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  error?: string;
  [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelStyle = "",
  icon,
  secureTextEntry = false,
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  error = "",
  ...props
}) => {
  return (
    <div className="w-full my-2">
      {label && (
        <label
          className={`block text-lg font-semibold mb-2 ${labelStyle}`}
          htmlFor={props.id || props.name}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center bg-neutral-100 rounded-full border border-neutral-200 px-4 focus-within:ring-2 focus-within:ring-green-600 ${containerStyle}`}
      >
        {icon && (
          <img
            src={icon}
            alt="icon"
            className={`w-6 h-6 mr-4 ${iconStyle}`}
          />
        )}
        <input
          id={props.id || props.name}
          type={secureTextEntry ? "password" : "text"}
          className={`flex-1 h-12 text-base font-medium text-neutral-900 bg-transparent outline-none ${inputStyle}`}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
