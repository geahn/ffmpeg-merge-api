# Use a imagem base do Node.js
FROM node:16

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Limpe o cache do npm e instale as dependências
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copie todos os arquivos do diretório atual para o diretório de trabalho no contêiner
COPY . .

# Exponha a porta que o servidor vai usar
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["node", "merge.js"]
