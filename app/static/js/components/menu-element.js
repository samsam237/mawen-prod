import { BaseComponent } from './base-component.js';
import { css, html } from 'lit';

/**
 * Composant pour afficher un élément du menu
 * Utilisé sur la page menu pour afficher les plats
 */
export class MenuElement extends BaseComponent {
  static properties = {
    image: { type: String },
    nom: { type: String },
    prix: { type: String },
    description: { type: String },
    disponible: { type: Boolean }
  };

  static styles = [
    BaseComponent.styles,
    css`
      :host {
        display: block;
        cursor: pointer;
      }

      .menu-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 300px;
        padding: 15px;
        background: #525150;
        border-radius: 8px;
        margin: 10px;
        transition: all 0.3s ease;
        border: 1px solid transparent;
      }

      .menu-card:hover {
        transform: translateY(-5px);
        border-color: #FFD700;
        box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
      }

      .menu-image-container {
        position: relative;
        margin-bottom: 10px;
      }

      .menu-image {
        width: 150px;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
      }

      .menu-card:hover .menu-image {
        border-color: #FFD700;
      }

      .unavailable-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .menu-title {
        color: #FFD700;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 5px 0;
        text-align: center;
      }

      .menu-price {
        color: #FFD700;
        font-size: 1.2em;
        font-weight: bold;
        margin: 5px 0;
      }

      .menu-description {
        font-size: 0.8rem;
        color: #cccccc;
        text-align: center;
        margin: 5px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      @media (max-width: 768px) {
        .menu-card {
          width: 160px;
          height: 250px;
          padding: 10px;
        }

        .menu-image {
          width: 120px;
          height: 160px;
        }

        .menu-title {
          font-size: 1rem;
        }

        .menu-price {
          font-size: 1.1em;
        }

        .menu-description {
          font-size: 0.75rem;
        }
      }
    `
  ];

  constructor() {
    super();
    this.image = '';
    this.nom = '';
    this.prix = '';
    this.description = '';
    this.disponible = true;
  }

  render() {
    return html`
      <div class="menu-card fade-in" @click="${this.handleClick}">
        <div class="menu-image-container">
          <img 
            src="${this.image}" 
            alt="${this.nom}" 
            class="menu-image"
            @error="${this.handleImageError}"
          />
          ${!this.disponible ? html`
            <div class="unavailable-badge">
              <i class="fas fa-times-circle"></i> Indisponible
            </div>
          ` : ''}
        </div>
        <h3 class="menu-title">${this.nom}</h3>
        <div class="menu-price">${this.formatPrice(this.prix)}</div>
        <p class="menu-description">${this.description}</p>
      </div>
    `;
  }

  handleClick() {
    // Créer et afficher le composant de détail du produit
    const detailComponent = document.createElement('detail-produit');
    detailComponent.setAttribute('nom', this.nom);
    detailComponent.setAttribute('prix', this.prix);
    detailComponent.setAttribute('description', this.description);
    detailComponent.setAttribute('image', this.image);
    
    document.body.appendChild(detailComponent);
  }

  handleImageError(event) {
    // Image par défaut si l'image ne charge pas
    event.target.src = '/static/image/food.svg';
  }

  // Méthodes pour les propriétés observées
  updated(changedProperties) {
    if (changedProperties.has('image')) {
      this.image = this.validateAttribute('image');
    }
    if (changedProperties.has('nom')) {
      this.nom = this.validateAttribute('nom');
    }
    if (changedProperties.has('prix')) {
      this.prix = this.validateAttribute('prix');
    }
    if (changedProperties.has('description')) {
      this.description = this.validateAttribute('description');
    }
  }
}

customElements.define('menu-element', MenuElement); 