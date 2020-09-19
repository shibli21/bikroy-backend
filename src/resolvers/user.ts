import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Permissions, User } from "./../entities/user";
import { MyContext } from "../types/MyContext";
import jwt_decode from "jwt-decode";
import { json } from "express";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@InputType()
class UserInputType {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

const jwtSecret = "shibli";

@Resolver()
@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    const { token } = await req.cookies;
    let userId;
    if (token) {
      const response = jwt.verify(token, jwtSecret);
      const idS = JSON.stringify(response);
      const idP = JSON.parse(idS);
      userId = idP.userId;
    }

    if (!userId) {
      return null;
    }

    const user = await User.findOne({ id: userId });

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    res.clearCookie("token");
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserInputType,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await hash(options.password);
    const emailToLower = options.email.toLowerCase();

    let user;
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          name: options.name,
          email: emailToLower,
          password: hashedPassword,
          permission: [Permissions.USER],
        })
        .execute();

      user = await User.findOne({ where: { email: options.email } });
      // user = result ;

      const token = jwt.sign({ userId: user?.id }, jwtSecret);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 100000,
      });
    } catch (error) {
      console.log(error);

      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "already exists ",
            },
          ],
        };
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ email: email });
    if (!user) {
      return { errors: [{ field: "email", message: "user doesn't exists" }] };
    }

    const valid = await verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Password incorrect",
          },
        ],
      };
    }

    const token = jwt.sign({ userId: user?.id }, jwtSecret);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 100000000000,
    });
    return { user };
  }
}
