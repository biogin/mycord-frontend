import React, { forwardRef, ReactNode, Ref } from 'react';

interface ButtonProps {
  type?: any;
  filled?: boolean;
  text?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  fluid?: boolean;
  loading?: boolean;

  click?(e: React.SyntheticEvent): void;
}

const Button = forwardRef(
    ({
       type = 'button',
       filled = false,
       text,
       click,
       className,
       children,
       disabled = false,
       fluid = true,
       loading = false
     }: ButtonProps, ref: Ref<any>) => {
      return (
          <button
              ref={ref}
              type={type}
              onClick={click ? click : () => {}}
              disabled={disabled || loading}
              className={`btn ${disabled && 'pointer-events-none'} z-10 ${!disabled && !filled && `hover:bg-secondary hover:text-primary`} ${fluid && `w-full`} rounded border-2 border-secondary disabled:opacity-50 ${filled ? `btn-secondary ${!disabled && `hover:text-secondary hover:bg-primary`}` : ``} ${className ? className : ''}`}>
            {text || children}
            <img className={`w-10 hidden ${loading && 'block'}`} />
          </button>
      );
    });

export default Button;
