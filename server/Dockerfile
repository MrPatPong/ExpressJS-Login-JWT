# Use an official Node.js runtime as the base image
FROM node:18-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY prisma ./prisma/
# Copy the rest of the application
COPY . .

RUN npx prisma generate --schema=prisma/postgres.prisma
RUN npx prisma generate --schema=prisma/mongo.prisma
# RUN npx prisma db push

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

# ARG MONGO_VERSION

# FROM mongo:${MONGO_VERSION}

# # we take over the default & start mongo in replica set mode in a background task
# ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip 0.0.0.0 & MONGOD_PID=$!; \
# # we prepare the replica set with a single node and prepare the root user config
# INIT_REPL_CMD="rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
# # we wait for the replica set to be ready and then submit the command just above
# until ($MONGO_COMMAND admin --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD"); do sleep 1; done; \
# # we are done but we keep the container by waiting on signals from the mongo task
# echo "REPLICA SET ONLINE"; wait $MONGOD_PID;
