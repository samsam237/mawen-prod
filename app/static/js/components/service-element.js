import { BaseComponent } from './base-component.js';
import { css, html } from 'lit';

/**
 * Composant pour afficher un service
 * Utilisé sur la page d'accueil pour présenter les services du restaurant
 */
export class ServiceElement extends BaseComponent {
  static properties = {
    image: { type: String },
    title: { type: String },
    description: { type: String }
  };

  static styles = [
    BaseComponent.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
        max-width: 250px;
      }

      .service-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 215, 0, 0.2);
        transition: all 0.3s ease;
      }

      .service-card:hover {
        transform: translateY(-5px);
        border-color: #FFD700;
        box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
      }

      .service-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid #FFD700;
      }

      .service-title {
        color: #FFD700;
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0;
      }

      .service-description {
        font-size: 0.88rem;
        color: #cccccc;
        line-height: 1.5;
        margin: 0;
        text-align: center;
      }

      @media (max-width: 768px) {
        :host {
          max-width: 200px;
        }

        .service-card {
          padding: 15px;
        }

        .service-image {
          width: 60px;
          height: 60px;
        }

        .service-title {
          font-size: 1.2rem;
        }

        .service-description {
          font-size: 0.8rem;
        }
      }
    `
  ];

  constructor() {
    super();
    this.image = '';
    this.title = '';
    this.description = '';
  }

  render() {
    return html`
      <div class="service-card fade-in">
        <img 
          src="${this.image}" 
          alt="${this.title}" 
          class="service-image"
          @error="${this.handleImageError}"
        />
        <h3 class="service-title">${this.title}</h3>
        <p class="service-description">${this.description}</p>
      </div>
    `;
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
    if (changedProperties.has('title')) {
      this.title = this.validateAttribute('title');
    }
    if (changedProperties.has('description')) {
      this.description = this.validateAttribute('description');
    }
  }
}

customElements.define('service-element', ServiceElement); 