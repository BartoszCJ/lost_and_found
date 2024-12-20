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
  showpasswordstrength?: boolean; // Opcjonalnie, jeśli chcemy wyświetlać siłę hasła
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
  showpasswordstrength = false,
  ...props
}) => {
  // Funkcja do obliczania siły hasła
  const calculatePasswordStrength = (password: string): string => {
    if (password.length < 6) return "Słabe";
    if (password.match(/[A-Z]/) && password.match(/\d/) && password.length >= 8)
      return "Silne";
    return "Średnie";
  };

  // Wyliczamy siłę hasła tylko, jeśli jest to pole hasła i ustawiono `showpasswordstrength
  // `
  const passwordStrength =
    secureTextEntry && showpasswordstrength && props.value
      ? calculatePasswordStrength(props.value)
      : "";

  // Dynamiczne klasy CSS dla obramowania
  const borderClass = error
    ? "border-red-500"
    : secureTextEntry && showpasswordstrength && props.value
    ? passwordStrength === "Słabe"
      ? "border-red-500"
      : passwordStrength === "Silne"
      ? "border-green-500"
      : "border-yellow-500"
    : "border-neutral-200";

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
        className={`flex items-center bg-neutral-100 rounded-full border px-4 focus-within:ring-1 focus-within:ring-green-600 ${borderClass} ${containerStyle}`}
      >
        {icon && (
          <img src={icon} alt="icon" className={`w-6 h-6 mr-4 ${iconStyle}`} />
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
      {/* Wskaźnik siły hasła */}
      {secureTextEntry && showpasswordstrength && props.value && (
        <p
          className={`text-sm mt-1 ${
            passwordStrength === "Silne"
              ? "text-green-500"
              : passwordStrength === "Słabe"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          Siła hasła: {passwordStrength}
        </p>
      )}
    </div>
  );
};

export default InputField;
