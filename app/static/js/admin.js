/**
 * Scripts pour l'interface d'administration MAWEN HOUSE
 * Gestion des interactions et fonctionnalités admin
 */

// Configuration globale
const ADMIN_CONFIG = {
    apiBase: '/admin',
    animations: {
        duration: 300,
        easing: 'ease-out'
    },
    messages: {
        success: 'Opération réussie !',
        error: 'Une erreur est survenue.',
        confirm: 'Êtes-vous sûr de vouloir continuer ?'
    }
};

// Classe principale pour l'administration
class AdminInterface {
    constructor() {
        this.currentMarketplace = null;
        this.currentItemId = null;
        this.itemsData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupResponsive();
        console.log('Interface d\'administration initialisée');
    }

    setupEventListeners() {
        // Gestion des messages flash
        this.setupFlashMessages();
        
        // Gestion des modals
        this.setupModals();
        
        // Gestion des formulaires
        this.setupForms();
        
        // Gestion des filtres
        this.setupFilters();
        
        // Gestion des uploads d'images
        this.setupImageUploads();
    }

    setupFlashMessages() {
        // Auto-fermeture des messages flash
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                if (alert.classList.contains('alert-dismissible')) {
                    const closeBtn = alert.querySelector('.btn-close');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }, 5000);
        });
    }

    setupModals() {
        // Initialisation des modals Bootstrap
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            new bootstrap.Modal(modal);
        });
    }

    setupForms() {
        // Validation des formulaires
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    setupFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterItems());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterItems());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterItems());
        }
    }

    setupImageUploads() {
        const imageInputs = document.querySelectorAll('input[type="file"]');
        imageInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleImageUpload(e));
        });
    }

    setupAnimations() {
        // Animation d'entrée pour les éléments
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observer les cartes et éléments
        document.querySelectorAll('.item-card, .stat-card, .action-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupResponsive() {
        // Gestion du menu mobile
        const burgerMenu = document.querySelector('.burger-menu');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (burgerMenu && sidebar) {
            burgerMenu.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }

        // Fermer le sidebar en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (sidebar && burgerMenu && !sidebar.contains(e.target) && !burgerMenu.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }

    // Validation des formulaires
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Ce champ est requis');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Validation spécifique pour les emails
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Email invalide');
                isValid = false;
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Filtrage des éléments
    filterItems() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        
        const items = document.querySelectorAll('.item-card');
        
        items.forEach(item => {
            const itemData = JSON.parse(item.dataset.item || '{}');
            const matchesSearch = itemData.nom?.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || itemData.categorie === categoryFilter;
            const matchesStatus = !statusFilter || itemData.disponible?.toString() === statusFilter;
            
            if (matchesSearch && matchesCategory && matchesStatus) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Gestion des uploads d'images
    handleImageUpload(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        
        if (file && preview) {
            // Validation du type de fichier
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                this.showNotification('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.', 'error');
                event.target.value = '';
                return;
            }

            // Validation de la taille (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification('L\'image est trop volumineuse. Taille maximum : 2MB.', 'error');
                event.target.value = '';
                return;
            }

            // Aperçu de l'image
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Opérations CRUD
    async createItem(marketplace, itemData) {
        try {
            if (!marketplace) {
                throw new Error('Marketplace non spécifiée');
            }

            const formData = new FormData();
            Object.keys(itemData).forEach(key => {
                formData.append(key, itemData[key]);
            });

            const response = await fetch(`${ADMIN_CONFIG.apiBase}/${marketplace}/items`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Élément créé avec succès !', 'success');
                return result.item;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification(`Erreur lors de la création : ${error.message}`, 'error');
            throw error;
        }
    }

    async updateItem(marketplace, itemId, itemData) {
        try {
            const response = await fetch(`${ADMIN_CONFIG.apiBase}/${marketplace}/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Élément mis à jour avec succès !', 'success');
                return result.item;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification(`Erreur lors de la mise à jour : ${error.message}`, 'error');
            throw error;
        }
    }

    async deleteItem(marketplace, itemId) {
        if (!confirm(ADMIN_CONFIG.messages.confirm)) {
            return false;
        }

        try {
            const response = await fetch(`${ADMIN_CONFIG.apiBase}/${marketplace}/items/${itemId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Élément supprimé avec succès !', 'success');
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showNotification(`Erreur lors de la suppression : ${error.message}`, 'error');
            throw error;
        }
    }

    async toggleAvailability(marketplace, itemId) {
        try {
            if (!marketplace || !itemId) {
                throw new Error('Paramètres manquants');
            }

            const response = await fetch(`${ADMIN_CONFIG.apiBase}/${marketplace}/items/${itemId}/toggle`, {
                method: 'POST'
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Disponibilité mise à jour !', 'success');
                setTimeout(() => location.reload(), 500);
                return result.item;
            } else {
                throw new Error(result.error || 'Erreur lors du changement de statut');
            }
        } catch (error) {
            console.error('Erreur toggle:', error);
            this.showNotification(`Erreur lors de la mise à jour : ${error.message}`, 'error');
            throw error;
        }
    }

    // Gestion des modals
    openAddModal() {
        this.currentItemId = null;
        
        // Définir le marketplace si pas encore défini
        if (!this.currentMarketplace) {
            const pathParts = window.location.pathname.split('/');
            const marketplaceIndex = pathParts.indexOf('admin') + 1;
            if (pathParts[marketplaceIndex] && pathParts[marketplaceIndex] !== 'login' && pathParts[marketplaceIndex] !== 'logout') {
                this.currentMarketplace = pathParts[marketplaceIndex];
            }
        }
        
        const modalTitle = document.getElementById('modalTitle');
        const itemForm = document.getElementById('itemForm');
        const imagePreview = document.getElementById('imagePreview');
        const itemModal = document.getElementById('itemModal');
        
        if (modalTitle) modalTitle.textContent = 'Ajouter un élément';
        if (itemForm) itemForm.reset();
        if (imagePreview) imagePreview.src = '/static/image/food.svg';
        if (itemModal) new bootstrap.Modal(itemModal).show();
    }

    openEditModal(itemId) {
        this.currentItemId = itemId;
        
        // Récupérer les données depuis le template
        const itemsData = window.itemsData || [];
        const item = itemsData.find(i => i.id === itemId);
        
        if (!item) {
            this.showNotification('Élément non trouvé', 'error');
            return;
        }

        const modalTitle = document.getElementById('modalTitle');
        const itemName = document.getElementById('itemName');
        const itemDescription = document.getElementById('itemDescription');
        const itemPrice = document.getElementById('itemPrice');
        const itemCategory = document.getElementById('itemCategory');
        const itemAvailable = document.getElementById('itemAvailable');
        const imagePreview = document.getElementById('imagePreview');
        const itemModal = document.getElementById('itemModal');

        if (modalTitle) modalTitle.textContent = 'Modifier l\'élément';
        if (itemName) itemName.value = item.nom || '';
        if (itemDescription) itemDescription.value = item.description || '';
        if (itemPrice) itemPrice.value = item.prix || '';
        if (itemCategory) itemCategory.value = item.categorie || '';
        if (itemAvailable) itemAvailable.checked = item.disponible !== false;
        if (imagePreview) imagePreview.src = item.image || '/static/image/food.svg';
        if (itemModal) new bootstrap.Modal(itemModal).show();
    }

    async saveItem() {
        const form = document.getElementById('itemForm');
        if (!form) {
            this.showNotification('Formulaire non trouvé', 'error');
            return;
        }

        const formData = new FormData(form);
        
        // Validation des champs requis
        const nom = formData.get('nom');
        const prix = formData.get('prix');
        
        if (!nom || !prix) {
            this.showNotification('Veuillez remplir tous les champs obligatoires (Nom et Prix)', 'error');
            return;
        }

        const itemData = {
            nom: nom,
            description: formData.get('description'),
            prix: prix,
            categorie: formData.get('categorie'),
            disponible: formData.get('disponible') === 'on'
        };

        try {
            if (!this.currentMarketplace) {
                // Essayer de déterminer le marketplace depuis l'URL
                const pathParts = window.location.pathname.split('/');
                const marketplaceIndex = pathParts.indexOf('admin') + 1;
                if (pathParts[marketplaceIndex] && pathParts[marketplaceIndex] !== 'login' && pathParts[marketplaceIndex] !== 'logout') {
                    this.currentMarketplace = pathParts[marketplaceIndex];
                } else {
                    throw new Error('Marketplace non trouvée');
                }
            }

            if (this.currentItemId) {
                await this.updateItem(this.currentMarketplace, this.currentItemId, itemData);
            } else {
                await this.createItem(this.currentMarketplace, itemData);
            }
            
            // Fermer le modal et recharger la page
            const modal = document.getElementById('itemModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
            setTimeout(() => location.reload(), 500);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            this.showNotification(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
        }
    }

    async confirmDelete(itemId) {
        try {
            if (!this.currentMarketplace) {
                // Essayer de déterminer le marketplace depuis l'URL
                const pathParts = window.location.pathname.split('/');
                const marketplaceIndex = pathParts.indexOf('admin') + 1;
                if (pathParts[marketplaceIndex] && pathParts[marketplaceIndex] !== 'login' && pathParts[marketplaceIndex] !== 'logout') {
                    this.currentMarketplace = pathParts[marketplaceIndex];
                } else {
                    throw new Error('Marketplace non trouvée');
                }
            }

            const success = await this.deleteItem(this.currentMarketplace, itemId);
            if (success) {
                const deleteModal = document.getElementById('deleteModal');
                if (deleteModal) {
                    const modalInstance = bootstrap.Modal.getInstance(deleteModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
                setTimeout(() => location.reload(), 500);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showNotification(`Erreur lors de la suppression: ${error.message}`, 'error');
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Créer une notification toast
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Ajouter au DOM
        document.body.appendChild(toast);

        // Animation d'entrée
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-suppression
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Utilitaires
    resetFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (statusFilter) statusFilter.value = '';

        this.filterItems();
    }

    formatPrice(price) {
        if (typeof price === 'string') {
            return price;
        }
        return `${price} €`;
    }

    // Initialisation des données
    setItemsData(data) {
        this.itemsData = data;
    }

    setCurrentMarketplace(marketplace) {
        this.currentMarketplace = marketplace;
    }
}

// Initialisation de l'interface
document.addEventListener('DOMContentLoaded', function() {
    window.adminInterface = new AdminInterface();
    
    // Déterminer le marketplace actuel depuis l'URL
    const pathParts = window.location.pathname.split('/');
    const marketplaceIndex = pathParts.indexOf('admin') + 1;
    if (pathParts[marketplaceIndex] && pathParts[marketplaceIndex] !== 'login' && pathParts[marketplaceIndex] !== 'logout') {
        window.adminInterface.setCurrentMarketplace(pathParts[marketplaceIndex]);
    }
    
    // Gestion de la sidebar responsive
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Fonction pour ouvrir/fermer la sidebar
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            // Mode mobile
            adminSidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
        } else {
            // Mode desktop - redirection vers le dashboard
            window.location.href = '/admin/';
        }
    }
    
    // Événement pour ouvrir la sidebar via le logo
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Fermer la sidebar en cliquant sur l'overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            adminSidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        });
    }
    
    // Fermer la sidebar en cliquant sur un lien (mobile)
    const sidebarLinks = document.querySelectorAll('.admin-sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                adminSidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
            }
        });
    });
    
    // Marquer le lien actif dans la sidebar
    const currentPath = window.location.pathname;
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Exposer les fonctions globales pour les templates
    window.openAddModal = () => {
        if (window.adminInterface) {
            window.adminInterface.openAddModal();
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.saveItem = () => {
        if (window.adminInterface) {
            window.adminInterface.saveItem();
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.editItem = (itemId) => {
        if (window.adminInterface) {
            window.adminInterface.openEditModal(itemId);
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.deleteItem = (itemId) => {
        if (window.adminInterface) {
            window.adminInterface.currentItemId = itemId;
            new bootstrap.Modal(document.getElementById('deleteModal')).show();
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.confirmDelete = () => {
        if (window.adminInterface) {
            window.adminInterface.confirmDelete(window.adminInterface.currentItemId);
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.toggleAvailability = (itemId) => {
        if (window.adminInterface) {
            window.adminInterface.toggleAvailability(window.adminInterface.currentMarketplace, itemId);
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.resetFilters = () => {
        if (window.adminInterface) {
            window.adminInterface.resetFilters();
        } else {
            console.error('Interface admin non initialisée');
        }
    };
    
    window.filterItems = () => {
        if (window.adminInterface) {
            window.adminInterface.filterItems();
        } else {
            console.error('Interface admin non initialisée');
        }
    };
});

// Styles pour les notifications toast
const toastStyles = `
<style>
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--secondary-gray-dark);
    border: 1px solid var(--primary-gold);
    border-radius: 8px;
    padding: 15px 20px;
    color: var(--primary-white);
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.toast-notification.show {
    transform: translateX(0);
}

.toast-notification.toast-success {
    border-color: var(--success);
}

.toast-notification.toast-error {
    border-color: var(--error);
}

.toast-notification.toast-warning {
    border-color: var(--warning);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toast-content i {
    font-size: 1.2rem;
}

.toast-success .toast-content i {
    color: var(--success);
}

.toast-error .toast-content i {
    color: var(--error);
}

.toast-warning .toast-content i {
    color: var(--warning);
}

.toast-close {
    background: none;
    border: none;
    color: var(--secondary-gray-light);
    cursor: pointer;
    padding: 5px;
    margin-left: auto;
    transition: color 0.3s ease;
}

.toast-close:hover {
    color: var(--primary-white);
}

@media (max-width: 768px) {
    .toast-notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', toastStyles); 