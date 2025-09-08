from flask import render_template, request, jsonify, flash, redirect, url_for, session, current_app
from . import admin
from .auth import login_required, admin_login, admin_logout, is_admin_logged_in
from .crud import (
    get_marketplace_data, create_item, update_item, delete_item, 
    toggle_item_availability, save_image
)

@admin.route('/')
@login_required
def dashboard():
    """Tableau de bord principal"""
    marketplaces = current_app.config['MARKETPLACES']
    stats = {}
    
    # Récupérer les statistiques pour chaque marketplace
    for key, config in marketplaces.items():
        data = get_marketplace_data(key)
        
        # S'assurer que data est une liste
        if not isinstance(data, list):
            print(f"Erreur: data pour {key} n'est pas une liste: {type(data)}")
            data = []
        
        stats[key] = {
            'name': config['name'],
            'total': len(data),
            'disponible': len([item for item in data if isinstance(item, dict) and item.get('disponible', True)]),
            'indisponible': len([item for item in data if isinstance(item, dict) and not item.get('disponible', True)])
        }
    
    return render_template('admin/dashboard.html', stats=stats, marketplaces=marketplaces)

@admin.route('/login', methods=['GET', 'POST'])
def login():
    """Page de connexion administrateur"""
    if is_admin_logged_in():
        return redirect(url_for('admin.dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if admin_login(email, password):
            flash('Connexion réussie !', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('admin.dashboard'))
        else:
            flash('Email ou mot de passe incorrect.', 'error')
    
    return render_template('admin/login.html')

@admin.route('/logout')
def logout():
    """Déconnexion administrateur"""
    admin_logout()
    flash('Vous avez été déconnecté.', 'info')
    return redirect(url_for('admin.login'))

@admin.route('/<marketplace>')
@login_required
def marketplace(marketplace):
    """Gestion d'une marketplace spécifique"""
    if marketplace not in current_app.config['MARKETPLACES']:
        flash('Marketplace non trouvée.', 'error')
        return redirect(url_for('admin.dashboard'))
    
    config = current_app.config['MARKETPLACES'][marketplace]
    data = get_marketplace_data(marketplace)
    
    # S'assurer que data est une liste et filtrer les éléments valides
    if not isinstance(data, list):
        print(f"Erreur: data pour {marketplace} n'est pas une liste: {type(data)}")
        data = []
    
    # Filtrer pour ne garder que les dictionnaires valides
    valid_items = []
    for item in data:
        if isinstance(item, dict) and 'nom' in item:
            valid_items.append(item)
        else:
            print(f"Élément invalide ignoré: {item}")
    
    return render_template('admin/marketplace.html', 
                         marketplace=marketplace, 
                         config=config, 
                         items=valid_items)

# API Routes pour les opérations CRUD

@admin.route('/<marketplace>/items', methods=['GET'])
@login_required
def get_items(marketplace):
    """Récupère tous les éléments d'une marketplace"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    data = get_marketplace_data(marketplace)
    return jsonify({'items': data})

@admin.route('/<marketplace>/items', methods=['POST'])
@login_required
def add_item(marketplace):
    """Ajoute un nouvel élément"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    try:
        # Récupérer les données du formulaire
        item_data = {
            'nom': request.form.get('nom', ''),
            'description': request.form.get('description', ''),
            'prix': request.form.get('prix', ''),
            'categorie': request.form.get('categorie', ''),
            'disponible': request.form.get('disponible', 'true').lower() == 'true'
        }
        
        # Récupérer l'image si fournie
        image_file = request.files.get('image')
        
        # Créer l'élément
        new_item, error = create_item(marketplace, item_data, image_file)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({'success': True, 'item': new_item}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin.route('/<marketplace>/items/<item_id>', methods=['PUT'])
@login_required
def update_item_route(marketplace, item_id):
    """Met à jour un élément existant"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    try:
        # Récupérer les données JSON
        item_data = request.get_json()
        
        # Mettre à jour l'élément
        updated_item, error = update_item(marketplace, item_id, item_data)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({'success': True, 'item': updated_item}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin.route('/<marketplace>/items/<item_id>', methods=['DELETE'])
@login_required
def delete_item_route(marketplace, item_id):
    """Supprime un élément"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    try:
        success, error = delete_item(marketplace, item_id)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin.route('/<marketplace>/items/<item_id>/toggle', methods=['POST'])
@login_required
def toggle_availability(marketplace, item_id):
    """Bascule la disponibilité d'un élément"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    try:
        updated_item, error = toggle_item_availability(marketplace, item_id)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({'success': True, 'item': updated_item}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin.route('/<marketplace>/upload', methods=['POST'])
@login_required
def upload_image(marketplace):
    """Upload d'image pour un élément"""
    if marketplace not in current_app.config['MARKETPLACES']:
        return jsonify({'error': 'Marketplace non trouvée'}), 404
    
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'Aucune image fournie'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'Aucune image sélectionnée'}), 400
        
        # Sauvegarder l'image
        image_url, error = save_image(marketplace, image_file, image_file.filename)
        
        if error:
            return jsonify({'error': error}), 500
        
        return jsonify({'success': True, 'image_url': image_url}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 