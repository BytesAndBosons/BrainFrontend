import React from 'react';

interface SummaryBoxProps {
  title?: string;
  children: React.ReactNode;
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ title = 'Summary', children }) => {
  return (
    <div className="summary-box">
      <div className="summary-box-head">{title}</div>
      <div className="summary-box-body">
        {children}
      </div>
    </div>
  );
};