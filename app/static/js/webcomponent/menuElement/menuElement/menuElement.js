import DetailProduit from './detailProduit.js';

class menuElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .service-element {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    cursor: pointer; /* Ajout d'un curseur de pointeur pour indiquer qu'il est cliquable */
                }
                .service-title{
                    color: #FFD700;
                }
            </style>
            <div class="service-element">
                <img src="" class="service-image" alt="service-image" />
                <div class="service-title"></div>
                <div class="service-description"></div>
                <div class="service-prix"></div>
            </div>
        `;
    }

    connectedCallback() {
        const image = this.getAttribute('image') || "img";
        const nom = this.getAttribute('nom') || "nom";
        const prix = this.getAttribute('prix') || "prix";

        if (image) {
            this.shadowRoot.querySelector('.service-image').src = image;
        }
        if (nom) {
            this.shadowRoot.querySelector('.service-title').textContent = nom;
        }
        if (prix) {
            this.shadowRoot.querySelector('.service-description').textContent = prix;
        }

        // Ajout de l'event listener pour le clic
        this.shadowRoot.querySelector('.service-element').addEventListener('click', () => {
             
            new DetailProduit();
        });
    }

}

customElements.define('service-element',menuElement);