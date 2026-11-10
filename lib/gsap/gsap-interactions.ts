import gsap from 'gsap';

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animateMessageEntrance(element: HTMLElement | null) {
  if (!element || isReducedMotion()) return;
  gsap.killTweensOf(element);
  gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform' }
  );
}

export function animateBranchShift(element: HTMLElement | null, direction: 'left' | 'right' = 'right') {
  if (!element || isReducedMotion()) return;
  const xOffset = direction === 'right' ? 14 : -14;
  gsap.fromTo(
    element,
    { opacity: 0.3, x: xOffset, filter: 'blur(3px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.26, ease: 'power2.out' }
  );
}

export function animateSidebarToggle(element: HTMLElement | null, isOpen: boolean) {
  if (!element || isReducedMotion()) return;
  gsap.to(element, {
    width: isOpen ? 280 : 0,
    opacity: isOpen ? 1 : 0,
    duration: 0.28,
    ease: 'power3.inOut',
  });
}

export function animateArenaReveal(leftPanel: HTMLElement | null, rightPanel: HTMLElement | null) {
  if (isReducedMotion()) return;
  const tl = gsap.timeline();
  if (leftPanel) {
    tl.fromTo(
      leftPanel,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' },
      0
    );
  }
  if (rightPanel) {
    tl.fromTo(
      rightPanel,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' },
      0.06
    );
  }
}

export function animateComposerFocus(element: HTMLElement | null, isFocused: boolean) {
  if (!element || isReducedMotion()) return;
  gsap.to(element, {
    borderColor: isFocused ? 'rgba(193, 123, 84, 0.65)' : 'rgba(52, 56, 48, 0.8)',
    boxShadow: isFocused ? '0 0 16px -4px rgba(193, 123, 84, 0.15)' : 'none',
    duration: 0.2,
    ease: 'power1.out',
  });
}

