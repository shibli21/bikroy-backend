import { Item } from "./entities/item";
import { User } from "./entities/user";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { UserResolver } from "./resolvers/user";
import "reflect-metadata";
import { createConnection } from "typeorm";
import path from "path";
import { ItemResolver } from "./resolvers/item";

const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5433,
    password: "root",
    username: "postgres",
    database: "sickfit",
    synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Item],
  });

  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ItemResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("GraphqlServer =>  http://localhost:4000/graphql");
  });
};

main().catch((err) => console.log(err));
