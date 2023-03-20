/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-array-for-each */

// @PERFORMANCE-COMMENT
// for anything (component) not above-the-fold,
// lazy load them when in viewport
const imported: { [key: string]: boolean } = {};
const observer = new IntersectionObserver((entries, observerReference) => {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      const name = entry.target.nodeName.toLowerCase();
      observerReference.unobserve(entry.target);

      if (!imported[name]) {
        imported[name] = true;
        import(`./${name}`);
      }
    }
  });
});

const els = document.querySelectorAll('.dynamic-element');
els.forEach(element => {
  observer.observe(element);
});
