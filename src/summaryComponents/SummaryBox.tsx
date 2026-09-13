import React from 'react';

interface SummaryBoxProps {
  title?: string;
  children: React.ReactNode;
}

export const SummaryBox: React.FC<SummaryBoxProps> = ({ title = 'Summary', children }) => {
  return (
    <div className="summary-box">
      <div className="summary-box-head"><b>{title}</b></div>
      <div className="summary-box-body">
        {children}
      </div>
    </div>
  );
};