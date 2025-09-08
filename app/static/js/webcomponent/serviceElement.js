
class ServiceElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .service-element {
                    
                }
                .service-title{
                    color: #FFD700;
                    font-size: 1.4rem;
                }
                .service-image{
                    width:80px
                }
                .service-description{
                    font-size: 0.88rem;
                }
            </style>
            <div class="service-element">
                <img src="" class="service-image" alt="service-image" />
                <div class="service-title"></div>
                <div class="service-description"></div>
            </div>
        `;
    }

    connectedCallback() {
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');
        const description = this.getAttribute('description');

        if (image) {
            this.shadowRoot.querySelector('.service-image').src = image;
        }
        if (title) {
            this.shadowRoot.querySelector('.service-title').textContent = title;
        }
        if (description) {
            this.shadowRoot.querySelector('.service-description').textContent = description;
        }
    }

}

customElements.define('service-element', ServiceElement);