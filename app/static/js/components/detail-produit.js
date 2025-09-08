import { BaseComponent } from './base-component.js';
import { css, html } from 'lit';

/**
 * Composant modal pour afficher les détails d'un produit
 * S'affiche en popup quand on clique sur un élément du menu
 */
export class DetailProduit extends BaseComponent {
  static properties = {
    nom: { type: String },
    prix: { type: String },
    description: { type: String },
    image: { type: String },
    isVisible: { type: Boolean }
  };

  static styles = [
    BaseComponent.styles,
    css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }

      .popup {
        position: relative;
        background-color: #1a1a1a;
        color: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border: 2px solid #FFD700;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .close-button {
        position: absolute;
        top: 15px;
        right: 20px;
        background-color: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #FFD700;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .close-button:hover {
        background-color: rgba(255, 215, 0, 0.1);
        transform: scale(1.1);
      }

      .popup-title {
        color: #FFD700;
        font-size: 1.8em;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 600;
      }

      .popup-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        align-items: start;
      }

      .popup-image {
        text-align: center;
      }

      .popup-image img {
        max-width: 100%;
        max-height: 300px;
        border-radius: 10px;
        border: 2px solid #FFD700;
        object-fit: cover;
      }

      .popup-description-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .popup-name {
        font-size: 2em;
        font-weight: bold;
        margin: 0;
        color: white;
      }

      .popup-price {
        color: #FFD700;
        font-size: 1.5em;
        font-weight: bold;
        margin: 0;
      }

      .popup-description {
        font-size: 1rem;
        line-height: 1.6;
        color: #cccccc;
        margin: 0;
      }

      .contact-button {
        background-color: #FFD700;
        color: black;
        border: none;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .contact-button:hover {
        background-color: #e6c200;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
      }

      @media (max-width: 768px) {
        .popup {
          padding: 20px;
          margin: 20px;
        }

        .popup-content {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .popup-title {
          font-size: 1.5em;
        }

        .popup-name {
          font-size: 1.5em;
        }

        .popup-price {
          font-size: 1.3em;
        }

        .contact-button {
          padding: 12px 25px;
          font-size: 1em;
        }
      }
    `
  ];

  constructor() {
    super();
    this.nom = '';
    this.prix = '';
    this.description = '';
    this.image = '';
    this.isVisible = true;
  }

  render() {
    if (!this.isVisible) {
      return html``;
    }

    return html`
      <div class="overlay" @click="${this.handleOverlayClick}">
        <div class="popup" @click="${this.handlePopupClick}">
          <button class="close-button" @click="${this.close}">&times;</button>
          <div class="popup-title">Détails du Produit</div>
          <div class="popup-content">
            <div class="popup-image">
              <img 
                src="${this.image}" 
                alt="${this.nom}"
                @error="${this.handleImageError}"
              />
            </div>
            <div class="popup-description-container">
              <h2 class="popup-name">${this.nom}</h2>
              <div class="popup-price">${this.formatPrice(this.prix)}</div>
              <p class="popup-description">${this.description}</p>
              <button class="contact-button" @click="${this.handleContactClick}">
                <i class="fab fa-whatsapp"></i> Contactez-nous
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleOverlayClick(event) {
    if (event.target.classList.contains('overlay')) {
      this.close();
    }
  }

  handlePopupClick(event) {
    // Empêcher la fermeture quand on clique sur le popup lui-même
    event.stopPropagation();
  }

  close() {
    this.isVisible = false;
    // Supprimer l'élément du DOM après l'animation
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  handleContactClick() {
    const message = `Bonjour ! Je suis intéressé(e) par ${this.nom} (${this.formatPrice(this.prix)}). Pouvez-vous me donner plus d'informations ?`;
    this.openWhatsApp('673883084', message);
  }

  handleImageError(event) {
    // Image par défaut si l'image ne charge pas
    event.target.src = '/static/image/food.svg';
  }

  // Méthodes pour les propriétés observées
  updated(changedProperties) {
    if (changedProperties.has('nom')) {
      this.nom = this.validateAttribute('nom');
    }
    if (changedProperties.has('prix')) {
      this.prix = this.validateAttribute('prix');
    }
    if (changedProperties.has('description')) {
      this.description = this.validateAttribute('description');
    }
    if (changedProperties.has('image')) {
      this.image = this.validateAttribute('image');
    }
  }
}

customElements.define('detail-produit', DetailProduit); 