import React from 'react';

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

const Content: React.FC<ContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`h-full overflow-y-auto crt-scroll ${className}`}>
      {children}
    </div>
  );
};

export default Content; 