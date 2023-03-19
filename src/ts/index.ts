/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-array-for-each */
/* global document */
// eslint-disable-next-line import/no-unresolved
import '@/scss/index.scss';
import webpackLogo from '@/images/icon-square-small.jpg?as=webp';

const logo = document.createElement('img');
const header = document.querySelector('header');
header?.prepend(logo);
logo.src = webpackLogo;
logo.alt = 'Webpack Logo';
logo.height = 100;
logo.width = 100;

document
  ?.querySelector('#footer-copyright')
  ?.append(
    document.createTextNode(new Date().getFullYear() as unknown as string)
  );

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
