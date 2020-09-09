import "./env";
import { GraphQLServer } from "graphql-yoga";
import express from "express";
import logger from "morgan";
import schema from "./schema";
import "./passport";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares";
import { uploadMiddleware, uploadController } from "./upload";

const PORT = process.env.Port || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated })
});

server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.use("/upload", express.static("upload"));
server.express.post("/api/upload", uploadMiddleware, uploadController);

server.start(
  {
    port: PORT
  },
  () => console.log(`✅ Server running on http://localhost:${PORT}`)
);
