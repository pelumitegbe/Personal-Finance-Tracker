export interface InputProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  fixLength?: number;
  required?: boolean;
  label: string;
  minLength?: number;
  maxLength?: number;
  name: string;
  onChange: (name: string, value: string | boolean) => void;
  placeholder?: string;
  reqType?: string;
  style?: object;
  type?: string;
  validationHandler: (name: string, error: string) => void;
  value: unknown;
  labelDisplayed: boolean;
  size?: string;
  labelClassName?: string;
  min?: string | number;
  max?: string | number;
}

export interface FileProps {
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  onChange: (name: string, value: File[] | boolean) => void;
  bgColor?: string;
  style?: React.CSSProperties;
  validationHandler: (name: string, error: string) => void;
  value: File[] | boolean;
  size?: string;
}

export interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  title: string;
  size?: string;
  bgColor?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}

export interface StoreButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  title: string;
  size?: string;
  bgColor?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  icon?: string;
}

export interface FormData {
  [key: string]: string | boolean | { required?: boolean; value: unknown };
}
export interface Errors {
  [key: string]: string;
}

export interface FormGroupProps {
  children: JSX.Element[] | JSX.Element;
  onSubmit: () => void;
  setErrors: (errors: Errors) => void; // Updated this line
  validation?: FormData; // Updated this line
  // validation?: (name: string, error: string) => void;
  errors: Errors;
  className?: string;
}


export interface ModalProps {
  isVisible: boolean;
  title: string;
  content: JSX.Element[] | JSX.Element;
  footer?: string;
  onClose: () => void;
  size?: string;
  theme?: string;
}

export interface AlertProps {
  title: string;
  text?: string;
  subText?: string;
  autoClose: boolean;
  type: string;
}

export interface Alert {
  type: "success" | "error" | "warning";
  title: string;
  text?: string;
  subText?: string;
}

export type AlertContextType = {
  alerts: Alert[];
  showAlert: (alert: Alert) => void;
  hideAlert: () => void;
};

export interface SelectProps {
  filter?: string;
  filterValue?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  onChange: (name: string, value: string | boolean) => void;
  style?: object;
  data: string[];
  validationHandler: (name: string, error: string) => void;
  value: unknown;
  size: string;
  labelClassName?: string;
  title: string;
}

export interface TextareaProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  label: string;
  name: string;
  onChange: (name: string, value: string | boolean) => void;
  placeholder?: string;
  style?: object;
  validationHandler: (name: string, error: string) => void;
  value: string;
  size?: string;
  labelClassName?: string;
}

export interface LoginFormProps {
  setIsLogin: (isLogin: boolean) => void;
}
