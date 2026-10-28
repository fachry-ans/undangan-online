import React, { useRef, useState, useEffect } from 'react';

export type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'blur-up'
  | 'flip-up'
  | 'image-reveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds (default 1200ms for slow, cinematic feel)
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 900,
  threshold = 0.05,
  className = '',
  style = {},
  once = true, // Once revealed, stay visible for smooth reading
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Check if element is already in viewport on mount (e.g. top sections)
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight * 0.95 && rect.bottom >= 0) {
      setIsVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -25px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Initial hidden states before scroll trigger
  const getInitialStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'fade-up':
        return {
          opacity: 0,
          transform: 'translate3d(0, 30px, 0)',
          filter: 'blur(6px)',
        };
      case 'fade-down':
        return {
          opacity: 0,
          transform: 'translate3d(0, -30px, 0)',
          filter: 'blur(6px)',
        };
      case 'fade-left':
        return {
          opacity: 0,
          transform: 'translate3d(55px, 0, 0)',
        };
      case 'fade-right':
        return {
          opacity: 0,
          transform: 'translate3d(-55px, 0, 0)',
        };
      case 'zoom-in':
        return {
          opacity: 0,
          transform: 'scale3d(0.86, 0.86, 1)',
        };
      case 'zoom-out':
        return {
          opacity: 0,
          transform: 'scale3d(1.12, 1.12, 1)',
        };
      case 'blur-up':
        return {
          opacity: 0,
          transform: 'translate3d(0, 36px, 0)',
          filter: 'blur(10px)',
        };
      case 'flip-up':
        return {
          opacity: 0,
          transform: 'perspective(1000px) rotateX(25deg) translate3d(0, 30px, 0)',
        };
      case 'image-reveal':
        return {
          opacity: 0,
          clipPath: 'inset(10% 0 0)',
          transform: 'scale3d(1.035, 1.035, 1)',
        };
      default:
        return { opacity: 0 };
    }
  };

  // Revealed states when scrolled into view (slow, smooth cubic-bezier)
  const getVisibleStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'fade-up':
      case 'fade-down':
      case 'fade-left':
      case 'fade-right':
        return {
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          filter: 'blur(0px)',
        };
      case 'zoom-in':
      case 'zoom-out':
        return {
          opacity: 1,
          transform: 'scale3d(1, 1, 1)',
        };
      case 'blur-up':
        return {
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          filter: 'blur(0px)',
        };
      case 'flip-up':
        return {
          opacity: 1,
          transform: 'perspective(1000px) rotateX(0deg) translate3d(0, 0, 0)',
        };
      case 'image-reveal':
        return {
          opacity: 1,
          clipPath: 'inset(0)',
          transform: 'scale3d(1, 1, 1)',
        };
      default:
        return { opacity: 1 };
    }
  };

  const transitionStyle: React.CSSProperties = {
    transitionProperty: 'opacity, transform, filter, clip-path',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'opacity, transform, filter, clip-path',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...getInitialStyle(),
        ...(isVisible ? getVisibleStyle() : {}),
        ...transitionStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
