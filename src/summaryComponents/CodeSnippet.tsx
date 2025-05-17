import React, { useEffect, useRef, useState } from "react";
import { CodeStyler, Styler } from "./scripts/CodeStyler";
import './styles/CodeSnippet.css';

export const CodeSnippet: React.FC<{ lang: string | null, title: string | null, children: React.ReactNode }> = ({ lang, title, children }) => {

  const [emoji, setEmoji] = useState('📋');
  const ref = useRef<HTMLDivElement>(null);

  const stylizeText = () => {

    let text: string = "";

    if (ref.current) {
      text = ref.current.textContent ?? "";

      // Create snippet styler
      let styler: Styler = new CodeStyler(lang ?? "default");

      // Stylize code
      let innerHTMLStyled: string = '<pre> ' + styler.getStylizedText(text) + '</pre>';

      ref.current.innerHTML = innerHTMLStyled;

    }
  }

  useEffect(() => stylizeText(), [children, lang]);

  const copyText = () => {
    setEmoji('✅');

    if (ref.current) {
      navigator.clipboard.writeText(ref.current.textContent ?? '');
    }

    setTimeout(() => {
      setEmoji("📋");
    }, 2000);
  }

  return (

    <div className="card snippet-card">
      <div className="card-head snippet-card-head">
        <div className="d-flex justify-content-between">
          <span>{title}</span>
          <span><div className="lang">{lang} <button type="button" onClick={(_) => copyText()} className="btn btn-sm snippet-btn"> {emoji}</button></div></span>
        </div>
      </div >
      <div className="card-body snippet-card-body rounded-bottom" ref={ref}>
        <pre>
          {children}
        </pre>
      </div>
    </div>
  );
}