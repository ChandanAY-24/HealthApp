// GSAP Motion Configurations & Helpers
import gsap from 'gsap';

export const animateFadeIn = (element: HTMLElement | null, delay = 0) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.35, delay, ease: 'power2.out' }
  );
};

export const animateBarReshape = (elements: NodeListOf<SVGElement> | SVGElement[]) => {
  if (!elements || elements.length === 0) return;
  gsap.fromTo(
    elements,
    { scaleY: 0.2, transformOrigin: 'bottom' },
    { scaleY: 1, duration: 0.5, stagger: 0.015, ease: 'back.out(1.2)' }
  );
};

export const animatePulseLine = (path: SVGPathElement | null) => {
  if (!path) return;
  const len = path.getTotalLength ? path.getTotalLength() : 400;
  gsap.fromTo(
    path,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }
  );
};

export const animateModalEnter = (modal: HTMLElement | null) => {
  if (!modal) return;
  gsap.fromTo(
    modal,
    { opacity: 0, scale: 0.95, y: 10 },
    { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }
  );
};
