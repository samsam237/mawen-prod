import json
import os
from flask import current_app
from werkzeug.utils import secure_filename
from PIL import Image
import io
import uuid

def allowed_file(filename):
    """Vérifie si l'extension du fichier est autorisée"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def optimize_image(image_file, max_size=(800, 800), quality=85):
    """Optimise une image pour le web"""
    try:
        image = Image.open(image_file)
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        return output
    except Exception as e:
        print(f"Erreur lors de l'optimisation de l'image: {e}")
        return None

def save_image(marketplace, image_file, filename):
    """Sauvegarde une image optimisée sur Minio"""
    if not allowed_file(filename):
        return None, "File type not allowed"

    optimized_image = optimize_image(image_file)
    if not optimized_image:
        return None, "Failed to optimize image"

    secure_name = secure_filename(filename)
    name, ext = os.path.splitext(secure_name)
    final_filename = f"{name}_{uuid.uuid4().hex}{ext}"
    
    key = f"{marketplace}/{final_filename}"
    
    data_service = current_app.extensions['data_service']
    try:
        image_url = data_service.save_image(key, optimized_image.getvalue(), 'image/jpeg')
        # Construire l'URL publique
        # Note: This assumes the MINIO_ENDPOINT is accessible from the user's browser.
        # In a real production environment, you might have a different public URL.
        public_url = f"http://{current_app.config['MINIO_ENDPOINT']}/{current_app.config['MINIO_BUCKET']}/{key}"
        return public_url, None
    except Exception as e:
        print(f"Error saving image to Minio: {e}")
        return None, str(e)

def get_marketplace_data(marketplace):
    """Récupère les données d'une marketplace."""
    data_service = current_app.extensions['data_service']
    return data_service.get_marketplace_data(marketplace)

def save_marketplace_data(marketplace, data):
    """Sauvegarde les données d'une marketplace."""
    data_service = current_app.extensions['data_service']
    data_service.save_marketplace_data(marketplace, data)
    return True

def create_item(marketplace, item_data, image_file=None):
    """Crée un nouvel élément dans une marketplace"""
    try:
        image_url = None
        if image_file and image_file.filename:
            image_url, error = save_image(marketplace, image_file, image_file.filename)
            if error:
                return None, error
        
        data = get_marketplace_data(marketplace)
        
        new_item = {
            'id': str(uuid.uuid4()),
            'nom': item_data.get('nom', ''),
            'description': item_data.get('description', ''),
            'prix': item_data.get('prix', ''),
            'categorie': item_data.get('categorie', ''),
            'image': image_url or item_data.get('image', ''),
            'disponible': item_data.get('disponible', True)
        }
        
        data.append(new_item)
        
        if save_marketplace_data(marketplace, data):
            return new_item, None
        else:
            return None, "Erreur lors de la sauvegarde"
            
    except Exception as e:
        return None, str(e)

def update_item(marketplace, item_id, item_data, image_file=None):
    """Met à jour un élément existant"""
    try:
        image_url = None
        if image_file and image_file.filename:
            image_url, error = save_image(marketplace, image_file, image_file.filename)
            if error:
                return None, error
        
        data = get_marketplace_data(marketplace)
        
        item_index = None
        for i, item in enumerate(data):
            if str(item.get('id')) == str(item_id):
                item_index = i
                break
        
        if item_index is None:
            return None, "Élément non trouvé"
        
        data[item_index].update({
            'nom': item_data.get('nom', data[item_index].get('nom', '')),'description': item_data.get('description', data[item_index].get('description', '')),'prix': item_data.get('prix', data[item_index].get('prix', '')),'categorie': item_data.get('categorie', data[item_index].get('categorie', '')),'disponible': item_data.get('disponible', data[item_index].get('disponible', True))
        })
        
        if image_url:
            data[item_index]['image'] = image_url
        
        if save_marketplace_data(marketplace, data):
            return data[item_index], None
        else:
            return None, "Erreur lors de la sauvegarde"
            
    except Exception as e:
        return None, str(e)

def delete_item(marketplace, item_id):
    """Supprime un élément"""
    try:
        data = get_marketplace_data(marketplace)
        
        item_index = None
        for i, item in enumerate(data):
            if str(item.get('id')) == str(item_id):
                item_index = i
                break
        
        if item_index is None:
            return False, "Élément non trouvé"
        
        data.pop(item_index)
        
        if save_marketplace_data(marketplace, data):
            return True, None
        else:
            return False, "Erreur lors de la sauvegarde"
            
    except Exception as e:
        return False, str(e)

def toggle_item_availability(marketplace, item_id):
    """Bascule la disponibilité d'un élément"""
    try:
        data = get_marketplace_data(marketplace)
        
        item_index = None
        for i, item in enumerate(data):
            if str(item.get('id')) == str(item_id):
                item_index = i
                break
        
        if item_index is None:
            return None, "Élément non trouvé"
        
        data[item_index]['disponible'] = not data[item_index].get('disponible', True)
        
        if save_marketplace_data(marketplace, data):
            return data[item_index], None
        else:
            return None, "Erreur lors de la sauvegarde"
            
    except Exception as e:
        return None, str(e)