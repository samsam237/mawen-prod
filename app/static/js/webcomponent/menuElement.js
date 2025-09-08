//import DetailProduit from './detailProduit.js';

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
                    width: 188px;
                    height: 190;
                    padding:8px 15px;
                    cursor: pointer; /* Ajout d'un curseur de pointeur pour indiquer qu'il est cliquable */
                    background: #525150;
                    border-radius: 8px;
                    width: 200px; height:300px;
                    margin : 10px;
                }
                .service-title{
                    color: #FFD700;
                }
                .service-image{
                    width: 150px; height: 200px;
                    margin: auto;
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
        const description = this.getAttribute('description') || "Description";

        if (image) {
            this.shadowRoot.querySelector('.service-image').src = image;
        }
        if (nom) {
            this.shadowRoot.querySelector('.service-title').textContent = nom;
        }
        if (prix) {
            this.shadowRoot.querySelector('.service-description').textContent = prix;
        }

        this.shadowRoot.querySelector('.service-element').addEventListener('click', () => {
            const productComponent = document.createElement('detail-produit');
            productComponent.setAttribute('nom', nom);
            productComponent.setAttribute('prix', prix);
            productComponent.setAttribute('description', description);
            productComponent.setAttribute('image', image);
            
            this.shadowRoot.appendChild(productComponent)
            
        });
    }

}

customElements.define('menu-element', menuElement);