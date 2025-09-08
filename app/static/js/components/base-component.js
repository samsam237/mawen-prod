import { LitElement, html, css } from 'lit';

/**
 * Composant de base pour tous les composants de l'application
 * Fournit des styles et méthodes communes
 */
export class BaseComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Poppins', sans-serif;
    }

    /* Styles communs pour les couleurs du thème */
    .primary-color {
      color: #FFD700;
    }

    .background-dark {
      background-color: #000000;
    }

    .text-white {
      color: white;
    }

    /* Styles pour les boutons */
    .btn-primary {
      background-color: #FFD700;
      color: black;
      border: none;
      padding: 10px 20px;
      border-radius: 15px;
      font-size: 1em;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #e6c200;
    }

    /* Styles pour les cartes */
    .card {
      background: #525150;
      border-radius: 8px;
      padding: 15px;
      margin: 10px;
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
    }

    /* Styles pour les images */
    .img-responsive {
      max-width: 100%;
      height: auto;
    }

    /* Styles pour les titres */
    .title {
      color: #FFD700;
      font-size: 1.4rem;
      margin-bottom: 10px;
    }

    .subtitle {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 8px;
    }

    /* Styles pour les descriptions */
    .description {
      font-size: 0.88rem;
      color: #cccccc;
      line-height: 1.4;
    }

    /* Styles pour les prix */
    .price {
      color: #FFD700;
      font-size: 1.2em;
      font-weight: bold;
    }

    /* Animation fadeIn */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }
  `;

  /**
   * Méthode utilitaire pour formater les prix
   */
  formatPrice(price) {
    if (typeof price === 'string') {
      return price;
    }
    return `${price} €`;
  }

  /**
   * Méthode utilitaire pour gérer les clics
   */
  handleClick(event) {
    this.dispatchEvent(new CustomEvent('item-click', {
      detail: { element: this },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Méthode utilitaire pour ouvrir WhatsApp
   */
  openWhatsApp(phone = '673883084', message = '') {
    const url = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(url, '_blank');
  }

  /**
   * Méthode utilitaire pour valider les attributs
   */
  validateAttribute(name, defaultValue = '') {
    return this.getAttribute(name) || defaultValue;
  }
} 