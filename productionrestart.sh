npm run build 

cd server 
NODE_ENV=production pm2 restart ./bin/www
