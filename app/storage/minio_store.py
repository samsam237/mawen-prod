from typing import Any
import json,io
from minio import Minio; from minio.error import S3Error
from .base import StorageBackend
class MinioStorage(StorageBackend):
    def __init__(self,endpoint,access_key,secret_key,bucket,secure=False,region=None):
        self.client=Minio(endpoint,access_key=access_key,secret_key=secret_key,secure=secure,region=region); self.bucket=bucket
        if not self.client.bucket_exists(bucket): self.client.make_bucket(bucket)
    def get_json(self,key:str):
        try:
            res=self.client.get_object(self.bucket,key); data=res.read(); res.close(); res.release_conn()
            return json.loads(data.decode('utf-8'))
        except S3Error as e:
            if e.code=='NoSuchKey': return None
            raise
    def put_json(self,key:str,data:Any)->None:
        body=io.BytesIO(json.dumps(data,ensure_ascii=False,indent=2).encode('utf-8'))
        self.client.put_object(self.bucket,key,data=body,length=body.getbuffer().nbytes,content_type='application/json')
    def get_object(self,key:str)->bytes:
        res=self.client.get_object(self.bucket,key); data=res.read(); res.close(); res.release_conn(); return data
    def put_object(self,key:str,data:bytes,content_type:str|None=None)->None:
        body=io.BytesIO(data); self.client.put_object(self.bucket,key,data=body,length=body.getbuffer().nbytes,content_type=content_type or 'application/octet-stream')
