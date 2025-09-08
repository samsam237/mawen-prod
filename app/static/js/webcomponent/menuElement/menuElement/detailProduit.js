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
                            width: 200px;
                            height: 200px;
                            margin-right: 20px;
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
                    </style>
                    <div class="popup">
                        <button class="close-button">&times;</button>
                        <div class="popup-title">Details Produit</div>
                        <div class="popup-content">
                            <div class="popup-image">
                                <img src="${this.getAttribute('image')}" alt="Image du produit">
                            </div>
                            <div class="popup-description">
                                <div class="popup-name">${this.getAttribute('nom')}</div>
                                <div class="popup-price">${this.getAttribute('prix')}</div>
                                <p>${this.getAttribute('description')}</p>
                            </div>
                        </div>
                    </div>
                `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.close-button').addEventListener('click', () => {
            this.remove();
        });

        // Affiche le popup par défaut
        this.shadowRoot.querySelector('.popup').style.display = 'block';
    }
}

customElements.define('detail-produit', detailProduit);