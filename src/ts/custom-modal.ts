/* eslint-disable @typescript-eslint/no-non-null-assertion */
class CustomModal extends HTMLElement {
  private _wasFocused!: Element | null;

  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.close = this.close.bind(this);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(isOpen) {
    this.shadowRoot?.querySelector('.parent')?.classList.toggle('open', isOpen);
    this.shadowRoot
      ?.querySelector('.parent')
      ?.setAttribute('aria-hidden', `${!isOpen}`);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute('open', '');
      document.addEventListener('keydown', this.onEscape);
      this.focus();
      this.shadowRoot?.querySelector('button')?.focus();
    } else {
      (this._wasFocused as HTMLElement)?.focus();
      this.removeAttribute('open');
      document.removeEventListener('keydown', this.onEscape);
      this.close();
    }
  }

  attributeChangedCallback(
    attributeName: string,
    oldValue: boolean,
    newValue: boolean
  ) {
    if (newValue !== oldValue) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line security/detect-object-injection, @typescript-eslint/no-explicit-any
      (this as any)[attributeName] = this.hasAttribute(attributeName);
    }
  }

  connectedCallback() {
    this.render();
  }

  close() {
    if (this.open !== false) {
      this.open = false;
    }
  }

  onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      ?.querySelector('button')
      ?.removeEventListener('click', this.close);
    this.shadowRoot
      ?.querySelector('.overlay')
      ?.removeEventListener('click', this.close);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .parent {
          opacity: 0;
          z-index: 1;
        }

        .parent:not(.open) {
          visibility: hidden;
        }

        ::slotted(*) {
          margin: 0 !important;
        }

        #title {
          margin: 0;
        }

        .parent.open {
          align-items: center;
          display: flex;
          justify-content: center;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 1;
          visibility: visible;
        }

        .overlay {
          background: rgba(0, 0, 0, 0.8);
          height: 100%;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
        }

        .modal {
          background: #ffffff;
          max-width: 300px;
          padding: 1rem;
          position: fixed;
        }

        @media (min-width: 992px) {
          .modal {
            background: #ffffff;
            max-width: 600px;
            padding: 1rem;
            position: fixed;
          }
        }

        button {
          all: unset;
          cursor: pointer;
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        button:focus {
          border: 2px solid blue;
        }
      </style>
      <div class="parent">
        <div class="overlay"></div>
        <div
          class="modal"
          role="dialog"
          aria-labelledby="title"
          aria-describedby="content">
          <button class="close" aria-label="Close">✖️</button>
          <h1 id="title"><slot name="heading"></slot></h1>
          <div id="content" class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot
      ?.querySelector('button')
      ?.addEventListener('click', this.close);
    this.shadowRoot
      ?.querySelector('.overlay')
      ?.addEventListener('click', this.close);
    this.open = this.open;
  }
}

customElements.define('custom-modal', CustomModal);

const button = document.querySelector('#launch-modal');
button?.addEventListener('click', () => {
  (document.querySelector('custom-modal')! as CustomModal).open = true;
});
