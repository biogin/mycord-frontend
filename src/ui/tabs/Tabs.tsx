import React, { FunctionComponent, ReactElement, useState } from 'react';
import PropTypes from 'prop-types';
import Tab from "./Tab";

interface TabsProps {
  children: Array<ReactElement>;
  defaultTab?: string;
  className?: string;
  contentClassname?: string;
}

const Tabs: FunctionComponent<TabsProps> = ({ children, defaultTab, className, contentClassname }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || children[0]?.props?.label);

  const onClick = (label: string) => {
    setActiveTab(label);
  }

  return (
      <div className={`flex flex-col ${className && className}`}>
        <ol className='flex'>
          {children.map((child) => <Tab key={child.props.label} activeTab={activeTab} onClick={onClick} label={child.props.label} />)}
        </ol>
        <div className={`space-y-10 mt-4 ${contentClassname && contentClassname}`}>
          {children.map((child) => {
            if (child.props.label !== activeTab) {
              return undefined;
            }

            return child.props.children;
          })}
        </div>
      </div>
  );
};

Tabs.propTypes = {
  children: PropTypes.array.isRequired,
  defaultTab: PropTypes.string
}

export default Tabs;
