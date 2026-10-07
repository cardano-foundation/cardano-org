export function difference(...arrays) {
  return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)));
}

export function sortBy(array, getter) {
  function compareBy(getter) {
    return (a, b) =>
      getter(a) > getter(b) ? 1 : getter(b) > getter(a) ? -1 : 0;
  }

  const sortedArray = [...array];
  sortedArray.sort(compareBy(getter));
  return sortedArray;
}

// "smooth" unless the visitor asked the system for reduced motion
export function scrollBehavior() {
  if (typeof window === "undefined" || !window.matchMedia) return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function scrollToElement(el, offset = -100) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top, behavior: scrollBehavior() });
}

export function toggleListItem(list, item) {
  const itemIndex = list.indexOf(item);
  if (itemIndex === -1) {
    return list.concat(item);
  } else {
    const newList = [...list];
    newList.splice(itemIndex, 1);
    return newList;
  }
}