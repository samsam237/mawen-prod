class detailProduit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: black;
                    color: white;
                    padding: 20px;
                    border-radius: 5px;
                    display: none; /* Initialement caché */
                    z-index: 100; /* Assurez-vous qu'il est au-dessus d'autres éléments */
                }
                .popup-title {
                    color: #FFD700; /* Couleur or */
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: white;
                }
                .popup-content {
                    display: flex;
                    align-items: center;
                }
                .popup-image {
                    margin-right: 20px;
                }
                .popup-image img{
                    max-width:200px; max-height:200px;
                }
                .popup-description {
                    flex: 1;
                }
                .popup-name {
                    font-size: 2em;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .popup-price {
                    color: #FFD700; /* Couleur or */
                    font-size: 1.2em;
                    margin-bottom: 10px;
                }

                .contact-button {
                    background-color: #FFD700; /* Couleur or */
                    color: black;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 15px; /* Sommets arrondis */
                    font-size: 1em;
                    cursor: pointer;
                    margin-top: 20px;
                }
            </style>
            <div class="popup">
                <button class="close-button">&times;</button>
                <div class="popup-title">Details Produit</div>
                <div class="popup-content">
                    <div class="popup-image">
                        <img src="" alt="Image du produit">
                    </div>
                    <div class="popup-description-container">
                        <div class="popup-name"></div>
                        <div class="popup-price"></div>
                        <p class="popup-description"></p>
                        <button class="contact-button"> Contactez nous </button>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {        
        const closeButton = this.shadowRoot.querySelector('.close-button');
        const contactButton = this.shadowRoot.querySelector('.contact-button');

        this.shadowRoot.querySelector('.popup-image img').src = this.getAttribute('image');
        this.shadowRoot.querySelector('.popup-price').textContent = this.getAttribute('prix');
        this.shadowRoot.querySelector('.popup-name').textContent = this.getAttribute('nom');
        this.shadowRoot.querySelector('.popup-description').textContent = this.getAttribute('description');

        closeButton.addEventListener('click', () => {
            this.remove();
        });

        contactButton.addEventListener('click', () => {
            window.open('https://wa.me/673883084', '_blank');
        });

        this.shadowRoot.querySelector('.popup').style.display = 'block';
    }
}

customElements.define('detail-produit', detailProduit);