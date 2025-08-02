import React, { useRef, useEffect } from 'react';
import { parse, HtmlGenerator } from 'latex.js';
import './styles/TexSnippet.css';

interface LatexCardProps {
  title?: string;
  tex?: string;
}

export const TexSnippet: React.FC<LatexCardProps> = ({ title = '', tex = '' }) => {
  const latexCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!latexCardRef.current) return;

    const latex = `$${tex}$`;
    const generator = new HtmlGenerator();
    const formula = parse(latex, { generator }).domFragment();

    while (latexCardRef.current.firstChild) {
      latexCardRef.current.removeChild(latexCardRef.current.firstChild);
    }
    latexCardRef.current.appendChild(formula);
  }, [tex]);

  return (
    <div className="card tex-card">
      <div className="card-head tex-card-head rounded-top">{title}</div>
      <div 
        ref={latexCardRef} 
        className="card-body tex-card-body rounded-bottom formula overflow-x-auto overflow-y-hidden"
      ></div>
    </div>
  );
};