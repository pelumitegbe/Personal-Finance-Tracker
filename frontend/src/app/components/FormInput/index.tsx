import React from 'react';
import {FormInputProps} from "../../interface"


const FormInput: React.FC<FormInputProps> = ({ name, value, type, onChange, placeholder, disabled= false}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{padding:"0.5rem", border:"none", outline:"none", borderBottom:"1px solid #d0d0d0", fontSize:"14px", width:"100%"}}
    />
  );
};

export default FormInput;
