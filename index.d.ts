declare module 'svelte-parallax' {
  import { SvelteComponentTyped } from 'svelte';

  interface ParallaxLayerProps {
    /** rate that the layer scrolls relative to `scrollY` */
    rate?: number;
    /** offset from top of container when layer is in viewport */
    offset?: number;
    /** how many sections the layer spans */
    span?: number;
    /** a function that receives a number representing the intersecting progress of a layer */
    onProgress?: (progress: number) => void;
    // $$restProps
    [key: string]: any;
  }
  export class ParallaxLayer extends SvelteComponentTyped<ParallaxLayerProps> {}

	interface StickyLayerProps {
    /** offset bounds where layer is sticky */
    offset?: { top?: number, bottom?: number };
    /** a function that receives a number representing the sticky progress of a layer */
    onProgress?: (progress: number) => void;
    // $$restProps
    [key: string]: any;
  }
  export class StickyLayer extends SvelteComponentTyped<StickyLayerProps> {}

  interface ParallaxProps {
    /** the number of sections the container spans */
    sections?: number;
    /** the height of a section, defaults to `window.innerHeight` */
    sectionHeight?: number;
    /** spring config object */
    config?: {
      stiffness?: number;
      damping?: number;
    };
    /** threshold of effect start/end when container enters/exits viewport */
    threshold?: {
      top?: number;
      bottom?: number;
    };
    /** a function that receives a number representing the scroll progress of the container */
    onProgress?: (progress: number) => void;
    /** a function that receives "scrollTop" -- the number of pixels scrolled between each threshold */
    onScroll?: (scrollTop: number) => void;
    /** disable parallax effect, layers will be frozen at target position */
    disabled?: boolean;
    // $$restProps
    [key: string]: any;
  }
  export class Parallax extends SvelteComponentTyped<ParallaxProps> {
    /** instance method for auto-scrolling to a section */
    scrollTo(
      /** the section to scroll to (not zero-indexed) */
      section: number,
      /** optional scroll animation config object */
      opts?: {
        /** valid CSS selector to focus on after scroll */
        selector?: string;
        /** duration of scroll in milliseconds */
        duration?: number;
        /** easing function, import from `'svelte/easing'` */
        easing?: (t: number) => number;
      }
    ): void;
  }
}
