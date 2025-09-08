from flask import current_app
from flask_caching import Cache
from ..storage.base import StorageBackend  # fix import spacing below


def convert_google_drive_link_to_direct_src(google_drive_link):
    if not google_drive_link or 'drive.google.com' not in google_drive_link:
        return google_drive_link
    file_id = google_drive_link.split('/d/')[1].split('/')[0]
    return f"https://lh3.googleusercontent.com/d/{file_id}"


class DataService:
    def __init__(self,storage:StorageBackend,cache:Cache|None=None): self.storage=storage; self.cache=cache
    def _marketplace_key(self,name:str)->str:
        cfg=current_app.config['MARKETPLACES'][name]; backend=current_app.config['STORAGE_BACKEND']
        return f"{cfg['drive_id']}/{cfg['file_name']}" if backend=='gdrive' else cfg['key']
    def get_marketplace_data(self,name:str):
        ck=f"mkt:{name}";
        if self.cache:
            c=self.cache.get(ck)
            if c is not None: return c
        key=self._marketplace_key(name); data=self.storage.get_json(key) or {'data':[]}
        items=data.get('data') if isinstance(data,dict) else data
        
        backend=current_app.config['STORAGE_BACKEND']
        if backend == 'gdrive':
            for item in items:
                if 'image' in item:
                    item['image'] = convert_google_drive_link_to_direct_src(item['image'])

        if self.cache: self.cache.set(ck,items)
        return items
    def save_marketplace_data(self,name:str,items:list[dict])->None:
        key=self._marketplace_key(name); self.storage.put_json(key,{'data':items});
        if self.cache: self.cache.set(f"mkt:{name}",items)
    def save_image(self,key:str,data:bytes,content_type:str)->str:
        if current_app.config['STORAGE_BACKEND']=='minio':
            self.storage.put_object(key,data,content_type=content_type); return key
        import os; folder=current_app.config['UPLOAD_FOLDER']; os.makedirs(folder,exist_ok=True); path=os.path.join(folder,key.replace('/','_'))
        open(path,'wb').write(data); return path
