FROM node:lts
WORKDIR /app 
COPY package*.json ./
COPY . .  
RUN npm install --production=false
EXPOSE 3000 
CMD ["npm", "run", "dev"]