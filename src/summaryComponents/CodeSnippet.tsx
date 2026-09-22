import React, { useEffect, useRef, useState } from "react";
import { CodeStyler, Styler } from "./scripts/CodeStyler";

// Number of lines shown before the snippet is collapsed behind a "Show more" toggle
const LINE_THRESHOLD = 15;

export const CodeSnippet: React.FC<{ lang: string | null, title: string | null, children: React.ReactNode }> = ({ lang, title, children }) => {

  const [emoji, setEmoji] = useState('📋');
  const [expanded, setExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const stylizeText = () => {

    let text: string = "";

    if (ref.current) {
      text = ref.current.textContent ?? "";

      setLineCount(text.trim().split("\n").length);

      // Create snippet styler
      let styler: Styler = new CodeStyler(lang ?? "default");

      // Stylize code
      let innerHTMLStyled: string = '<pre> ' + styler.getStylizedText(text) + '</pre>';

      ref.current.innerHTML = innerHTMLStyled;

    }
  }

  useEffect(() => stylizeText(), [children, lang]);

  const isLong = lineCount > LINE_THRESHOLD;
  const isClamped = isLong && !expanded;

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
      <div className={`snippet-body-wrapper${isClamped ? ' clamped' : ''}`}>
        <div className={`card-body snippet-card-body${isLong ? '' : ' rounded-bottom'}`} ref={ref}>
          <pre>
            {children}
          </pre>
        </div>
      </div>
      {isLong && (
        <div
          className="card-head snippet-card-head snippet-card-footer rounded-bottom"
          onClick={() => setExpanded(!expanded)}
          role="button"
        >
          <div className="d-flex justify-content-center">
            <span>{expanded ? 'Show less' : `Show more (${lineCount - LINE_THRESHOLD} more lines)`}</span>
          </div>
        </div>
      )}
    </div>
  );
}