# Use an official node runtime as the parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY package*.json ./

# Install any needed packages
RUN npm install

# If you're using `npm ci` in a CI/CD, consider using the following command instead:
# RUN npm ci --only=production

# Bundle the app source
COPY . .

# Expose port 3000 for the app
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
