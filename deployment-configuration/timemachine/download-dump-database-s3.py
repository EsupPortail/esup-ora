import os
import sys
import boto3

aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
bucket_name = os.environ.get('BUCKET_INSTANCE_NAME')
endpoint_url = os.environ.get('ENDPOINT_URL')

if aws_access_key_id is None and aws_secret_access_key is None and bucket_name is None and endpoint_url is None:
    print("Une des variables d'accès au stockage S3 est non définie dans les variables d'environnement.\nContactez un administrateur.")

if len(sys.argv) != 2:
    print("Usage: object key dump from bucket name")
    sys.exit(1)

object_key = sys.argv[1]

s3_client = boto3.client('s3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    endpoint_url=endpoint_url)


responsev2 = s3_client.list_objects_v2(Bucket=bucket_name)

if 'Contents' in responsev2:
    # Création de la liste des objets à supprimer
    objects = [{'Key': obj['Key']} for obj in responsev2['Contents']]

    print(objects)
else:
    print("No objects in " + bucket_name)

download_path = "./" + object_key

try:
    s3_client.download_file(bucket_name, object_key, download_path)
    print(f'L\'objet "{object_key}" a été téléchargé avec succès depuis le bucket "{bucket_name}" vers "{download_path}"')
except Exception as e:
    print(f'Erreur lors du téléchargement de l\'objet: {e}')
