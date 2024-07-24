FROM node:14

WORKDIR /app

# Copy only package.json and package-lock.json initially
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Reinstall bcrypt (with production flag) to avoid unnecessary development dependencies
RUN npm install bcrypt --build-from-source --production

# Copy the rest of the application code
COPY . .

# Expose the port on which the app will run
EXPOSE 8080

# Set environment variables
ENV DOCKERIZE_VERSION v0.7.0

# Install dockerize for waiting on the database
RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

# Use dockerize to wait for the database before starting the application
CMD dockerize -wait tcp://db:3306 -timeout 60m npm start
