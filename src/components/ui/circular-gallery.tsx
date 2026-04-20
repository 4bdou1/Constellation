import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

export interface GalleryItem {
  name: string;
  quote: string;
  photo: string;
  color: string;
  id: string;
  video?: string;
}

function PreloadLink({ src }: { src: string }) {
  useEffect(() => {
    if (!src) return;
    const existing = document.querySelector(`link[href="${src}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    }
  }, [src]);
  return null;
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  onItemClick?: (id: string) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 320, autoRotateSpeed = 0.012, onItemClick, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const el = sectionRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const sectionH = el.offsetHeight - window.innerHeight;
          const scrolled = Math.max(0, -rect.top);
          const progress = sectionH > 0 ? Math.min(scrolled / sectionH, 1) : 0;
          setRotation(progress * 360);
        }

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) setRotation(prev => prev + autoRotateSpeed);
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };
      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div ref={sectionRef} style={{ height: '300vh' }}>
        <div
          style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            ref={ref}
            role="region"
            aria-label="Circular friend gallery"
            className={className}
            style={{ perspective: '1200px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            {...props}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {items.map((item, i) => {
                const itemAngle = i * anglePerItem;
                const totalRotation = rotation % 360;
                const relativeAngle = (itemAngle + totalRotation + 360) % 360;
                const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;
                const opacity = Math.max(0.25, 1 - (normalizedAngle / 180) * 0.85);
                const isCentered = normalizedAngle < 35 && !isScrolling;

                return (
                  <button
                    key={item.id}
                    aria-label={`View ${item.name}`}
                    onClick={() => onItemClick?.(item.id)}
                    style={{
                      position: 'absolute',
                      width: '200px',
                      height: '280px',
                      transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-100px',
                      marginTop: '-140px',
                      opacity,
                      transition: 'opacity 0.3s linear',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${item.color}44` }}>
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.1) 100%)' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: item.color, marginBottom: '4px' }}>
                          {item.name}
                        </p>
                        <p style={{ fontFamily: 'sans-serif', fontSize: '11px', lineHeight: 1.5, color: '#fff8e799', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.quote}
                        </p>
                      </div>
                    </div>
                    {isCentered && item.video && <PreloadLink src={item.video} />}
                  </button>
                );
              })}
            </div>
          </div>
          <p style={{ position: 'absolute', bottom: '24px', fontFamily: 'sans-serif', fontSize: '11px', color: 'rgba(255,216,155,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            scroll to rotate · tap to open
          </p>
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';
export { CircularGallery };
