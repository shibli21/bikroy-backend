import { hash } from "argon2";
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

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "HELLO YOU";
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
      getConnection()
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

      const result = await User.findOne({ where: { email: options.email } });
      user = result as any;

      const token = jwt.sign({ userId: result?.id }, "asdasdasdasdasd");
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 100000,
      });
    } catch (error) {
      console.log(error);

      if (error.code === "ER_DUP_ENTRY") {
        return {
          errors: [
            {
              field: "username",
              message: "already exists ",
            },
          ],
        };
      }
    }

    return { user };
  }
}
