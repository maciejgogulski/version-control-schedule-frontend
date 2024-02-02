# Use an official Node.js runtime as a base image
FROM node:19-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the application code to the container
COPY . .

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

