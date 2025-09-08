import os
from datetime import timedelta
class BaseConfig:
    SECRET_KEY=os.environ.get('SECRET_KEY','change-me'); DEBUG=os.environ.get('FLASK_DEBUG','0')=='1'; TESTING=False
    PERMANENT_SESSION_LIFETIME=timedelta(hours=int(os.environ.get('SESSION_LIFETIME_HOURS','8')))
    SESSION_COOKIE_SECURE=os.environ.get('SESSION_COOKIE_SECURE','1')=='1'; SESSION_COOKIE_HTTPONLY=True; # SESSION_COOKIE_SAMESITE=os.environ.get('SESSION_COOKIE_SAMESITE','Lax') #SESSION_COOKIE_SAMESITE=os.environ.get('SESSION_COOKIE_SAMESITE','None')
    MAX_CONTENT_LENGTH=int(os.environ.get('MAX_CONTENT_LENGTH',str(16*1024*1024))); UPLOAD_FOLDER=os.environ.get('UPLOAD_FOLDER','app/static/uploads'); ALLOWED_EXTENSIONS=set((os.environ.get('ALLOWED_EXTENSIONS') or 'png,jpg,jpeg,gif,webp').split(','))
    ADMIN_EMAIL=os.environ.get('ADMIN_EMAIL','admin@example.com'); ADMIN_PASSWORD_HASH=os.environ.get('ADMIN_PASSWORD_HASH',''); ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'admin123'
    STORAGE_BACKEND=os.environ.get('STORAGE_BACKEND','gdrive')
    GOOGLE_DRIVE_CREDENTIALS=os.environ.get('GOOGLE_DRIVE_CREDENTIALS','./config/keys.json')
    MINIO_ENDPOINT=os.environ.get('MINIO_ENDPOINT','127.0.0.1:9000'); MINIO_ACCESS_KEY=os.environ.get('MINIO_ACCESS_KEY','minioadmin'); MINIO_SECRET_KEY=os.environ.get('MINIO_SECRET_KEY','minioadmin'); MINIO_SECURE=os.environ.get('MINIO_SECURE','0')=='1'; MINIO_BUCKET=os.environ.get('MINIO_BUCKET','mawenhouse'); MINIO_REGION=os.environ.get('MINIO_REGION','us-east-1')
    CACHE_TYPE='SimpleCache' if not os.environ.get('REDIS_URL') else 'RedisCache'; CACHE_DEFAULT_TIMEOUT=int(os.environ.get('CACHE_DEFAULT_TIMEOUT','180')); CACHE_REDIS_URL=os.environ.get('REDIS_URL','')
    RATELIMIT_DEFAULT=os.environ.get('RATELIMIT_DEFAULT','100 per 10 minutes')
    MARKETPLACES={'menu':{'name':'Menu','drive_id':os.environ.get('DRIVE_ID_MENU',''),'file_name':'db.json','key':'menu/db.json'},'boisson':{'name':'Boisson','drive_id':os.environ.get('DRIVE_ID_BOISSON',''),'file_name':'db.json','key':'boisson/db.json'},'shop':{'name':'Boutique','drive_id':os.environ.get('DRIVE_ID_SHOP',''),'file_name':'db.json','key':'shop/db.json'}}
class DevConfig(BaseConfig): DEBUG=True
class TestConfig(BaseConfig): TESTING=True; DEBUG=True
class ProdConfig(BaseConfig): DEBUG=False
