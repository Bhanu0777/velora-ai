import gsap from 'gsap';

export function animateFadeIn(element: HTMLElement | null, delay = 0) {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0, y: 6 },
    { opacity: 1, y: 0, duration: 0.25, delay, ease: 'power2.out' }
  );
}

export function animateSlideInRight(element: HTMLElement | null) {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0, x: 24 },
    { opacity: 1, x: 0, duration: 0.28, ease: 'power3.out' }
  );
}

export function animateBranchSwitch(element: HTMLElement | null) {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0.2, filter: 'blur(3px)' },
    { opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' }
  );
}

