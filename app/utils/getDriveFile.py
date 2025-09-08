
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import json
import re

def download_google_drive_file(directory_id, file_name, service_account_key_file):
    """
    Télécharge un fichier depuis Google Drive en utilisant une clé de compte de service.
    
    Args:
        directory_id (str): ID du répertoire contenant le fichier.
        file_name (str): Nom du fichier à télécharger.
        service_account_key_file (str): Chemin du fichier contenant la clé du compte de service.
    
    Returns:
        dict: Informations sur le fichier téléchargé, avec les clés 'name', 'type', 'size' et 'data'.
    """
    # Charger les informations d'identification depuis le fichier de clé de compte de service
    creds = service_account.Credentials.from_service_account_info(
        info=json.load(open(service_account_key_file, 'r')), 
        scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    
    # Créer le service Google Drive
    drive_service = build('drive', 'v3', credentials=creds)
        
    try:
        # Récupérer la liste des fichiers dans le répertoire
        response = drive_service.files().list(
            q=f"'{directory_id}' in parents and name = '{file_name}'",
            fields='files(id, name, mimeType)',
            pageSize=1
        ).execute()
        files = response.get('files', [])
        
        # Vérifier si le fichier a été trouvé
        if not files:
            raise Exception(f"Fichier '{file_name}' non trouvé.")
        
        # Récupérer le fichier
        target_file = files[0]
        file_id = target_file['id']
        
        # Télécharger le contenu du fichier
        file_stream = io.BytesIO()
        request = drive_service.files().get_media(fileId=file_id)
        downloader = MediaIoBaseDownload(file_stream, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            print(f'Download {int(status.progress() * 100)}%.')
        
        # Préparer les informations sur le fichier
        file_data = {
            'name': target_file['name'],
            'type': target_file['mimeType'],
            'size': len(file_stream.getvalue()),
            'data': file_stream.getvalue().decode('utf-8') 
        }
        
        return file_data
    
    except Exception as e:
        print(f'Erreur lors du téléchargement du fichier depuis Google Drive : {e}')
        raise e
    
    
def convert_unicode_escape_to_char(input_string):
    """
    Convertit une chaîne contenant des séquences d'échappement Unicode sous la forme
    \\uXXXX en caractères correspondants.

    Args:
        input_string (str): La chaîne contenant des séquences Unicode à convertir.

    Returns:
        str: La chaîne avec les séquences Unicode converties en caractères réels.
    """
    # Utiliser une expression régulière pour rechercher toutes les séquences \uXXXX
    unicode_escape_pattern = r'u([0-9a-fA-F]{4})'

    # Remplacer chaque séquence \uXXXX par le caractère correspondant
    converted_string = re.sub(unicode_escape_pattern, lambda m: chr(int(m.group(1), 16)), input_string)

    return converted_string

if __name__ == '__main__':    
    res = download_google_drive_file ("1UIJeEao2EODma0E6b_Qcl5Hx_418QTvh",".json","../../config/keys.json")
    print (res)
    
