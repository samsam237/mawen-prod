// Configuration et imports pour Lit
import { LitElement, html, css } from 'lit';

// Import de tous les composants
import './components/index.js';

// Configuration globale pour Lit
window.LitElement = LitElement;
window.html = html;
window.css = css;

// Fonction utilitaire pour créer des composants dynamiquement
window.createComponent = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

// Fonction pour initialiser les composants sur une page
window.initComponents = () => {
  console.log('Composants Lit initialisés');
};

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  window.initComponents();
}); 