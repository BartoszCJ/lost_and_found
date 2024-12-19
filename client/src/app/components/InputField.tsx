import React from "react";

interface InputFieldProps {
  label?: string; // Etykieta nad polem
  labelStyle?: string; // Dodatkowe style dla etykiety
  iconLeft?: string; // Ścieżka do ikony po lewej stronie
  iconRight?: string; // Ścieżka do ikony po prawej stronie
  secureTextEntry?: boolean; // Czy pole jest hasłem
  containerStyle?: string; // Dodatkowe style dla kontenera
  inputStyle?: string; // Dodatkowe style dla inputa
  iconStyle?: string; // Dodatkowe style dla ikony
  [key: string]: any; // Dodatkowe właściwości dla <input>
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelStyle = "",
  iconLeft,
  iconRight,
  secureTextEntry = false,
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  ...props
}) => {
  return (
    <div className="my-2 w-full">
      {/* Etykieta */}
      {label && (
        <label className={`text-lg font-semibold mb-3 block ${labelStyle}`}>
          {label}
        </label>
      )}

      {/* Kontener z ikoną i polem */}
      <div
        className={`flex items-center bg-neutral-100 rounded-full border border-neutral-200 px-4 ${containerStyle}`}
      >
        {/* Ikona po lewej stronie */}
        {iconLeft && (
          <img
            src={iconLeft}
            alt="icon-left"
            className={`w-6 h-6 mr-2 ${iconStyle}`}
          />
        )}

        {/* Pole tekstowe */}
        <input
          type={secureTextEntry ? "password" : "text"}
          className={`flex-1 h-12 text-base font-medium text-left text-neutral-900 bg-transparent border-none focus:outline-none focus:ring-0 ${inputStyle}`}
          {...props}
        />

        {/* Ikona po prawej stronie */}
        {iconRight && (
          <img
            src={iconRight}
            alt="icon-right"
            className={`w-6 h-6 ml-2 ${iconStyle}`}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
