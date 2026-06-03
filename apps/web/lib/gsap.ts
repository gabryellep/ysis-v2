export async function loadScrollTrigger() {
  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");
  const gsap = gsapModule.gsap;
  const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  return { gsap, ScrollTrigger };
}
