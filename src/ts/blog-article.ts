/* eslint-disable @typescript-eslint/no-non-null-assertion */
class BlogArticle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.render();
  }

  get fetchpriority() {
    return this.getAttribute('fetchpriority') || 'low';
  }

  set fetchpriority(value) {
    this.setAttribute('fetchpriority', value);
  }

  get post() {
    return this.getAttribute('post') || '20';
  }

  set post(value) {
    this.setAttribute('post', value);
  }

  get img() {
    return this.getAttribute('img') || '12';
  }

  set img(value) {
    this.setAttribute('img', value);
  }

  async connectedCallback() {
    const post = await fetch(`https://dummyjson.com/posts/${this.post}`)
      .then(response => response.json())
      .catch(error => console.error(error));

    const parentSlot = this.shadowRoot?.querySelectorAll('slot');
    const title = parentSlot![1]?.assignedNodes()[0];
    title!.textContent = post.title;
    const body = parentSlot![2]?.assignedNodes()[0];
    body!.textContent = post.body;
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        article {
          margin-top: 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, auto));
          align-items: start;
          row-gap: 1rem;
          column-gap: 2rem;
          max-width: 992px;
        }

        ::slotted([slot="header"]) {
          margin-top: 0 !important;
        }
      </style>

      <article>
        <slot name="image"></slot>
        <div></div>
        <section>
          <slot name="header"></slot>
          <slot name="content"></slot>
        </section>
      </article>
    `;
    this.shadowRoot!.querySelector('slot[name="image"]')?.setAttribute(
      'hidden',
      ''
    );
    const image = this.shadowRoot?.querySelector('div');
    image!.innerHTML = `
      <picture>
        <source media="(min-width: 992px)" height="300" width="450" srcset="https://picsum.photos/id/${this.img}/450/300.webp" type="image/webp">
        <source media="(min-width: 992px)" height="300" width="450" srcset="https://picsum.photos/id/${this.img}/450/300" type="image/jpg">
        <source media="(min-width: 576px)" height="200" width="300" srcset="https://picsum.photos/id/${this.img}/300/200.webp" type="image/webp">
        <source media="(min-width: 576px)" height="200" width="300" srcset="https://picsum.photos/id/${this.img}/300/200" type="image/jpg">
        <source media="(min-width: 0px)" height="100" width="150" srcset="https://picsum.photos/id/${this.img}/150/100.webp" type="image/webp">
        <source media="(min-width: 0px)" height="100" width="150" srcset="https://picsum.photos/id/${this.img}/150/100" type="image/jpg">
        <img fetchpriority="${this.fetchpriority}" src="https://picsum.photos/id/${this.img}/150/100" alt="Nature picture">
      </picture>
    `;
  }
}

customElements.define('blog-article', BlogArticle);
