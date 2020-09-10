import { Item } from "./../entities/item";
import {
  Resolver,
  Mutation,
  Arg,
  Field,
  ObjectType,
  InputType,
} from "type-graphql";

@InputType()
class ItemInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  image: string;

  @Field()
  largeImage: string;
}

@Resolver()
export class ItemResolver {
  //   @Mutation(() => Item)
  //   createItem(
  //     @Arg("title", () => String)
  //     title: string
  //   ): Promise<Item | null> {
  //     return Item.create({
  //       title: title,
  //     }).save();
  //   }
  @Mutation(() => Item)
  async createItem(
    @Arg("input")
    input: ItemInput
  ): Promise<Item | null> {
    return Item.create({
      ...input,
    }).save();
  }
}
