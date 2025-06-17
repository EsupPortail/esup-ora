import os
import sys
import boto3
from datetime import datetime

aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
bucket_name = os.environ.get('BUCKET_INSTANCE_NAME')
endpoint_url = os.environ.get('ENDPOINT_URL')

if aws_access_key_id is None and aws_secret_access_key is None and bucket_name is None and endpoint_url is None:
    print("Une des variables d'accès au stockage S3 est non définie dans les variables d'environnement.\nContactez un administrateur.")

if len(sys.argv) != 3:
    print("Usage: full path vers votre dump and filename")
    sys.exit(1)

file_path = sys.argv[1]
object_key = sys.argv[2]

s3_client = boto3.client('s3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    endpoint_url=endpoint_url)

try:
    s3_client.upload_file(file_path, bucket_name, object_key)
    print(f'Le fichier "{file_path}" a été uploadé avec succès dans le bucket "{bucket_name}" avec la clé "{object_key}"')
except Exception as e:
    print(f'Erreur lors de l\'upload du fichier: {e}')

response = s3_client.list_objects_v2(Bucket=bucket_name)
if 'Contents' in response:
    # Création de la liste des objets à supprimer
    objects = [{'Key': obj['Key']} for obj in response['Contents']]

    print(objects)
else:
    print("No objects in " + bucket_name)
