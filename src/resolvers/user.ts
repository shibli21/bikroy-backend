import "reflect-metadata";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "HELLO YOU";
  }
}
