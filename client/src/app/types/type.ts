export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "employee" | "admin";
  createdAt: string;
}
export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  status: "Zwrocony" | "Znaleziony" | "Przypisany" | "Zarchiwizowany";
  dateFound: string;
}

export interface LostReport {
  id: number;
  userId: number;
  itemId?: number;
  dateReported: string;
  status: "pending" | "matched" | "resolved";
}
export interface OwnershipClaim {
  id: number;
  itemId: number;
  userId: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  dateSubmitted: string;
  verifiedBy?: number;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// types/type.ts
export interface InputFieldProps {
  label?: string;
  labelStyle?: string;
  icon?: string;
  secureTextEntry?: boolean;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  [key: string]: unknown; // Dodatkowe właściwości
}

export interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "success" | "outline";
  textVariant?: "default" | "primary" | "secondary" | "danger" | "success";
  IconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
  IconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  [key: string]: unknown;
}
