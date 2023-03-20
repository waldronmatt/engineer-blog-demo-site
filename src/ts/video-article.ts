/* eslint-disable @typescript-eslint/no-non-null-assertion */
class VideoArticle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.render();
  }

  async connectedCallback() {
    const post = await fetch('https://dummyjson.com/posts/20')
      .then(response => response.json())
      .catch(error => console.error(error));

    const parentSlot = this.shadowRoot?.querySelectorAll('slot');
    const title = parentSlot![1]?.assignedNodes()[0];
    title!.textContent = post.title;
    const body = parentSlot![2]?.assignedNodes()[0];
    body!.textContent = post.body;
    this.shadowRoot
      ?.querySelector('.play')
      ?.addEventListener('click', () => this.renderCorrectVideoSize());

    window.addEventListener('resize', () => {
      this.renderCorrectVideoSize();
    });
  }

  renderCorrectVideoSize() {
    const image = this.shadowRoot?.querySelector('div');

    if (
      window.matchMedia('(min-width: 576px)').matches &&
      window.matchMedia('(max-width: 991px)').matches
    ) {
      image!.innerHTML = `
        <video controls width="300" autoplay="true">
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
        </video>
      `;
    } else if (window.matchMedia('(min-width: 992px)').matches) {
      image!.innerHTML = `
        <video controls width="450" autoplay="true">
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
        </video>
      `;
    } else {
      image!.innerHTML = `
        <video controls width="150" autoplay="true">
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
        </video>
      `;
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      ?.querySelector('.play')
      ?.removeEventListener('click', () => this.renderCorrectVideoSize());

    // eslint-disable-next-line unicorn/no-invalid-remove-event-listener
    window.removeEventListener('resize', () => this.renderCorrectVideoSize());
  }

  // @PERFORMANCE-COMMENT
  // when the video comes into view and is lazy loaded and
  // while the user clicks on the video image placeholder, this will give
  // enough time for the video to download in the background
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

        div {
          position: relative;
          width: fit-content;
        }

        .play::before {
          content: '';
          width: auto;
          display: block;
        }

        .play {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 3px solid #fff;
          background-color: #000;
          cursor: pointer;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .play::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
          left: 5px;
          width: 0;
          height: 0;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-left: 20px solid #fff;
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
    // @PERFORMANCE-COMMENT
    // swap out placeholder images for actual ones below
    this.shadowRoot!.querySelector('slot[name="image"]')?.setAttribute(
      'hidden',
      ''
    );
    const image = this.shadowRoot?.querySelector('div');
    // @PERFORMANCE-COMMENT
    // use 'source' element to optimize image sizes on different viewports
    //
    // use srcset to load optimized webp images if browsers support
    //
    // define width and height to reduce fouc while browser is loading images
    image!.innerHTML = `
      <picture>
        <source media="(min-width: 992px)" height="300" width="450" srcset="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" type="image/jpg">
        <source media="(min-width: 576px)" height="200" width="300" srcset="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" type="image/jpg">
        <source media="(min-width: 0px)" height="100" width="150" srcset="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" type="image/jpg">
        <img src="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" alt="Big Buck Bunny Video">
      </picture>
      <div class='play'></div>
    `;
  }
}

customElements.define('video-article', VideoArticle);
