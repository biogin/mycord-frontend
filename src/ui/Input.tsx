import React, { FunctionComponent } from 'react';

interface InputProps {
  type: string;
  value: string;
  name: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  rounded?: boolean;
  errored?: boolean;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;

  onChange(e: any): void;
}

const Input: FunctionComponent<InputProps> = ({
                                                name,
                                                type,
                                                onChange,
                                                value,
                                                className,
                                                placeholder,
                                                required = true,
                                                autoComplete,
                                                rounded = false,
                                                errored = false,
                                                errorMessage,
                                                disabled = false
                                              }) => {
  return (
      <>
        <input id={name} name={name} value={value} onChange={onChange} type={type}
               autoComplete={autoComplete} required={required}
               className={`h-full ${className ? className : ''} ${disabled ? 'disabled:opacity-50' : ''} outline-blue appearance-none ${rounded ? 'rounded' : ''} ${errored ? 'border-red-400' : ''} relative block w-full px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none sm:text-sm`}
               placeholder={placeholder}
               disabled={disabled}
        />
        {errored && errorMessage && <p className='text-red-200'>{errorMessage}</p>}
      </>
  );
}
;

export default Input;
