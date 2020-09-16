import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Item } from "./../entities/item";

@InputType()
class ItemInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
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

  @Mutation(() => Boolean)
  async deleteItem(@Arg("id", () => Int) id: number) {
    const item = await Item.findOne(id);
    if (!item) {
      return false;
    }

    await Item.delete({ id });

    return true;
  }
}
