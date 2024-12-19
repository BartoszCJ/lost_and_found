import React from "react";
import { ButtonProps } from "../types/type";


const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border border-neutral-300";
    default:
      return "bg-[#33b249]"; // Domyślny kolor
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-gray-500";
    case "secondary":
      return "text-gray-200";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white"; // Domyślny kolor tekstu
  }
};

const CustomButton: React.FC<ButtonProps> = ({
  onClick,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}) => (
  <button
    onClick={onClick}
    className={`w-full rounded-full p-5 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(
      bgVariant
    )} ${className}`}
    {...props}
  >
    {IconLeft && <IconLeft className="mr-2 w-5 h-5" />}

    <span className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
      {title}
    </span>
    {IconRight && <IconRight className="ml-2 w-5 h-5" />}
  </button>
);

export default CustomButton;
