from typing import Any,Optional; import io,json
from google.oauth2 import service_account; from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload,MediaIoBaseDownload
from .base import StorageBackend
class GoogleDriveStorage(StorageBackend):
    def __init__(self,credentials_path:str):
        scopes=['https://www.googleapis.com/auth/drive']
        self.creds=service_account.Credentials.from_service_account_file(credentials_path,scopes=scopes)
        self.service=build('drive','v3',credentials=self.creds,cache_discovery=False)
    def _find_file(self,folder_id:str,name:str)->Optional[str]:
        q=f"'{folder_id}' in parents and name = '{name}' and trashed = false"
        res=self.service.files().list(q=q,fields='files(id,name)').execute(); files=res.get('files',[])
        return files[0]['id'] if files else None
    def get_json(self,key:str):
        folder_id,name=key.split('/',1); fid=self._find_file(folder_id,name); 
        if not fid: return None
        req=self.service.files().get_media(fileId=fid); buf=io.BytesIO(); dl=MediaIoBaseDownload(buf,req); done=False
        while not done: status,done=dl.next_chunk()
        buf.seek(0); return json.loads(buf.read().decode('utf-8'))
    def put_json(self,key:str,data:Any):
        folder_id,name=key.split('/',1); fid=self._find_file(folder_id,name)
        body=io.BytesIO(json.dumps(data,ensure_ascii=False,indent=2).encode('utf-8')); media=MediaIoBaseUpload(body,mimetype='application/json',resumable=False)
        if fid: self.service.files().update(fileId=fid,media_body=media).execute()
        else: self.service.files().create(body={'name':name,'parents':[folder_id]},media_body=media,fields='id').execute()
    def get_object(self,key:str)->bytes:
        folder_id,name=key.split('/',1); fid=self._find_file(folder_id,name); 
        if not fid: raise FileNotFoundError(key)
        req=self.service.files().get_media(fileId=fid); buf=io.BytesIO(); dl=MediaIoBaseDownload(buf,req); done=False
        while not done: status,done=dl.next_chunk()
        buf.seek(0); return buf.read()
    def put_object(self,key:str,data:bytes,content_type:str|None=None)->None:
        folder_id,name=key.split('/',1); body=io.BytesIO(data); media=MediaIoBaseUpload(body,mimetype=content_type or 'application/octet-stream',resumable=False)
        fid=self._find_file(folder_id,name)
        if fid: self.service.files().update(fileId=fid,media_body=media).execute()
        else: self.service.files().create(body={'name':name,'parents':[folder_id]},media_body=media,fields='id').execute()
