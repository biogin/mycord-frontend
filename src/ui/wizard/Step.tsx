import React, { FunctionComponent, ReactNode } from 'react';

interface StepProps {
  name: string;
  children: Array<ReactNode>;
}

const Step: FunctionComponent<StepProps> = ({ name, children }) => {
  return (
      <>
        {children}
      </>
  );
};

export default Step;
