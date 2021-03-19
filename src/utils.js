// conditional click listener: only listens if user sets a clickToScroll param
// event is dispatched here because slot events don't bubble how I thought they would
export function conditional(node, condition) {
  function sendClick() {
    node.dispatchEvent(
      new CustomEvent("scrollTo", {
        bubbles: true,
        detail: condition,
      })
    );
  }
  
  function update(condition) {
    if (condition) {
      node.addEventListener("click", sendClick);
    } else {
      node.removeEventListener("click", sendClick);
    }
  }

  update(condition);

  return {
    update,
    destroy() {
      node.removeEventListener("click", sendClick);
    },
  };
}


// check for prefers-reduced-motion
export function PRM() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}