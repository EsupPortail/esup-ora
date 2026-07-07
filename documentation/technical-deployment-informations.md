# Déploiement en local d'Esup-ORA  
 
0. 
```
cp .env.example .env
```
1. Renseigner les variables du .env
2.
```
docker compose up
```
3. 
```
docker exec -it ora-backend bash  
npx prisma generate  
npx prisma migrate deploy  
```
