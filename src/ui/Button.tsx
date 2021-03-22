import React, { ReactNode } from 'react';

interface ButtonProps {
  type: any;
  filled?: boolean;
  text?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;

  click?(e: React.SyntheticEvent): void;
}

const Button = ({
                  type = 'button',
                  filled = false,
                  text,
                  click,
                  className,
                  children,
                  disabled = false
                }: ButtonProps) => {
  return (
      <button
          type={type}
          onClick={click ? click : () => {
          }}
          disabled={disabled}
          className={`btn ${disabled && 'pointer-events-none'} ${!disabled && !filled && `hover:bg-secondary hover:text-primary`} rounded w-full border-2 disabled:opacity-50 ${filled ? `btn-secondary ${!disabled && `hover:text-blue-600 hover:bg-primary`}` : ``} ${className ? className : ''}`}>
        {text || children}
      </button>
  );
};

export default Button;
