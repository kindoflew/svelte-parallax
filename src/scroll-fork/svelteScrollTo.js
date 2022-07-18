// fork of https://github.com/langbamit/svelte-scrollto
import { cubicInOut } from 'svelte/easing';
import { noop, loop, now } from 'svelte/internal';
import _ from './helper.js';

const defaultOptions = {
  container: 'body',
  duration: 500,
  delay: 0,
  offset: 0,
  easing: cubicInOut,
  onStart: noop,
  onDone: noop,
  onAborting: noop,
  scrollX: false,
  scrollY: true,
};

const abortEvents = [
  'mousedown',
  'wheel',
  'DOMMouseScroll',
  'mousewheel',
  'keydown',
  'touchmove',
];

const _scrollTo = (options) => {
  let {
    offset,
    duration,
    delay,
    easing,
    x = 0,
    y = 0,
    scrollX,
    scrollY,
    onStart,
    onDone,
    container,
    onAborting,
    element,
  } = options;

  if (typeof offset === 'function') {
    offset = offset();
  }

  const cumulativeOffsetContainer = _.cumulativeOffset(container);
  const cumulativeOffsetTarget = element
    ? _.cumulativeOffset(element)
    : { top: y, left: x };

  const initialX = _.scrollLeft(container);
  const initialY = _.scrollTop(container);

  const targetX =
    cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
  const targetY =
    cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

  const diffX = targetX - initialX;
  const diffY = targetY - initialY;

  let scrolling = true;
  let started = false;
  let start_time = now() + delay;
  let end_time = start_time + duration;

  function scrollToTopLeft(element, top, left) {
    if (scrollX) _.scrollLeft(element, left);
    if (scrollY) _.scrollTop(element, top);
  }

  function start(delayStart) {
    if (!delayStart) {
      started = true;
      onStart(element, { x, y });
    }
    _.addListeners(container, abortEvents, stop, { passive: true });
  }

  function tick(progress) {
    scrollToTopLeft(
      container,
      initialY + diffY * progress,
      initialX + diffX * progress
    );
  }

  function stop() {
    scrolling = false;
    _.removeListeners(container, abortEvents, stop);
  }

  loop((now) => {
    if (!started && now >= start_time) {
      start(false);
    }

    if (started && now >= end_time) {
      tick(1);
      stop();
      onDone(element, { x, y });
      return false;
    }

    if (!scrolling) {
      onAborting(element, { x, y });
      return false;
    }
    if (started) {
      const p = now - start_time;
      const t = 0 + 1 * easing(p / duration);
      tick(t);
    }

    return true;
  });

  start(delay);

  tick(0);

  return stop;
};

const proceedOptions = (options) => {
  let opts = _.extend({}, defaultOptions, options);
  opts.container = _.$(opts.container);
  opts.element = _.$(opts.element);
  return opts;
};

const scrollContainerHeight = (containerElement) => {
  if (
    containerElement &&
    containerElement !== document &&
    containerElement !== document.body
  ) {
    return containerElement.scrollHeight - containerElement.offsetHeight;
  } else {
    let body = document.body;
    let html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }
};

export const setGlobalOptions = (options) => {
  _.extend(defaultOptions, options || {});
};

export const scrollTo = (options) => {
  return _scrollTo(proceedOptions(options));
};

export const scrollToBottom = (options) => {
  options = proceedOptions(options);

  return _scrollTo(
    _.extend(options, {
      element: null,
      y: scrollContainerHeight(options.container),
    })
  );
};

export const scrollToTop = (options) => {
  options = proceedOptions(options);

  return _scrollTo(
    _.extend(options, {
      element: null,
      y: 0,
    })
  );
};

export const makeScrollToAction = (scrollToFunc) => {
  return (node, options) => {
    let current = options;
    const handle = (e) => {
      e.preventDefault();
      scrollToFunc(
        typeof current === 'string' ? { element: current } : current
      );
    };
    _.addListeners(node, ['click', 'touchstart'], handle);
    return {
      update(options) {
        current = options;
      },
      destroy() {
        _.removeListeners(node, ['click', 'touchstart'], handle);
      },
    };
  };
};

export const scrollto = makeScrollToAction(scrollTo);
export const scrolltotop = makeScrollToAction(scrollToTop);
export const scrolltobottom = makeScrollToAction(scrollToBottom);
