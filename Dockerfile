# Use the Node.js image with the specified version
FROM node:20.16.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Specify the command to run your Node.js application
CMD [ "npm", "start" ]

EXPOSE 7000
