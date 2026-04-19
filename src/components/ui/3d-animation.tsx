import React, { useEffect, useRef } from 'react';

interface PoemAnimationProps {
  poemHTML: string;
  backgroundImageUrl?: string;
  boyImageUrl?: string;
}

export const PoemAnimation = ({ poemHTML, backgroundImageUrl, boyImageUrl }: PoemAnimationProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function adjust() {
      if (!contentRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / 1000;
      const scaleY = vh / 562;
      const scale = Math.min(scaleX, scaleY) * 0.95;
      contentRef.current.style.transform = `scale(${scale < 1 ? scale : 1})`;
    }
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  // Repeat text to fill the long scroll distance
  const repeated = Array(25).fill(poemHTML).join('&nbsp;&nbsp;&#10022;&nbsp;&nbsp;');

  return (
    <div className="pa-root">
      <div className="pa-outer">
        <div ref={contentRef} className="pa-content">
          <div className="pa-stage">

            <div className="pa-hue" aria-hidden="true" />

            {backgroundImageUrl && (
              <img
                className="pa-bg"
                src={backgroundImageUrl}
                alt=""
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}
            {boyImageUrl && (
              <img
                className="pa-char"
                src={boyImageUrl}
                alt=""
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}

            {/* Main cube */}
            <div className="pa-scene">
              <div className="pa-cube">
                <div className="pa-face pa-top" />
                <div className="pa-face pa-bottom" />
                <div className="pa-face pa-left pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
                <div className="pa-face pa-right pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
                <div className="pa-face pa-front" />
                <div className="pa-face pa-back pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
              </div>
            </div>

            {/* Reflection */}
            <div className="pa-scene pa-reflect">
              <div className="pa-cube">
                <div className="pa-face pa-top" />
                <div className="pa-face pa-bottom" />
                <div className="pa-face pa-left pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
                <div className="pa-face pa-right pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
                <div className="pa-face pa-front" />
                <div className="pa-face pa-back pa-text">
                  <p dangerouslySetInnerHTML={{ __html: repeated }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
