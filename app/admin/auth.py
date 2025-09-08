from functools import wraps
from flask import session, redirect, url_for, flash, request, current_app
import hashlib
import os

def hash_password(password):
    """Hash un mot de passe avec salt"""
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt + key

def verify_password(stored_password, provided_password):
    """Vérifie un mot de passe"""
    salt = stored_password[:32]
    stored_key = stored_password[32:]
    key = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, 100000)
    return stored_key == key

def login_required(f):
    """Décorateur pour protéger les routes admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            flash('Veuillez vous connecter pour accéder à l\'administration.', 'error')
            return redirect(url_for('admin.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_login(email, password):
    """Authentification administrateur"""
    config = current_app.config
    
    if email == config['ADMIN_EMAIL'] and password == config['ADMIN_PASSWORD']:
        session['admin_logged_in'] = True
        session['admin_email'] = email
        session.permanent = True
        return True
    return False

def admin_logout():
    """Déconnexion administrateur"""
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)

def is_admin_logged_in():
    """Vérifie si l'admin est connecté"""
    return session.get('admin_logged_in', False) 