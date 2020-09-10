import { Item } from "./../entities/item";
import {
  Resolver,
  Mutation,
  Arg,
  Field,
  ObjectType,
  InputType,
  Query,
  Int,
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
  @Query(() => Item, { nullable: true })
  async item(@Arg("id", () => Int) id: number) {
    const item = await Item.findOne({ id });
    return item;
  }

  @Query(() => [Item], { nullable: true })
  async items(): Promise<Item[] | undefined> {
    const items = await Item.find();
    return items;
  }

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