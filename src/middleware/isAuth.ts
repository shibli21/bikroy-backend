import jwt from "jsonwebtoken";
import { MyContext } from "./../types/MyContext";
import { MiddlewareFn } from "type-graphql";

const jwtSecret = "shibli";
export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { token } = await context.req.cookies;
  let userId;
  if (token) {
    const response = jwt.verify(token, jwtSecret);
    const idS = JSON.stringify(response);
    const idP = JSON.parse(idS);
    userId = idP.userId;
  }

  if (!userId) {
    throw new Error("not authenticated");
  }
  return next();
};
