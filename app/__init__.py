from flask import Flask, render_template
from flask_caching import Cache
from flask_wtf.csrf import CSRFProtect, generate_csrf, CSRFError
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from .storage.google_drive import GoogleDriveStorage
from .storage.minio_store import MinioStorage
from .services.data_service import DataService
import os
def create_app(config_object='app.config.ProdConfig'):
    app=Flask(__name__); app.config.from_object(config_object)
    force_https = os.environ.get('FLASK_ENV') == 'production'
    CSRFProtect(app); Talisman(app,content_security_policy=None, force_https=force_https); Limiter(get_remote_address,app=app,default_limits=[app.config['RATELIMIT_DEFAULT']])
    cache=Cache(app)
    app.jinja_env.globals['csrf_token'] = generate_csrf
    storage=GoogleDriveStorage(app.config['GOOGLE_DRIVE_CREDENTIALS']) if app.config['STORAGE_BACKEND']=='gdrive' else MinioStorage(app.config['MINIO_ENDPOINT'],app.config['MINIO_ACCESS_KEY'],app.config['MINIO_SECRET_KEY'],app.config['MINIO_BUCKET'],app.config['MINIO_SECURE'],app.config['MINIO_REGION'])
    app.extensions['data_service']=DataService(storage,cache=cache)
    from .menu import menu as menu_bp; from .boisson import boisson as boisson_bp; from .shop import shop as shop_bp; from .contact import contact as contact_bp; from .admin import admin as admin_bp
    app.register_blueprint(menu_bp,url_prefix='/menu'); app.register_blueprint(boisson_bp,url_prefix='/boisson'); app.register_blueprint(shop_bp,url_prefix='/shop'); app.register_blueprint(contact_bp,url_prefix='/contact'); app.register_blueprint(admin_bp,url_prefix="/admin")
    @app.route('/healthz')
    def healthz(): return {'status':'ok'}
    @app.route('/')
    def index(): return render_template('pages/index.html')
    @app.errorhandler(CSRFError)
    def handle_csrf(e):
        app.logger.warning(f"CSRF blocked: {e.description}")
        return {'description':e.description}
    return app
