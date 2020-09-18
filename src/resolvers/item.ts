import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
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

  @Mutation(() => Item, { nullable: true })
  async updateItem(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("description", () => String) description: string,
    @Arg("price", () => Int) price: number
  ): Promise<Item | null> {
    // const isItem = Item.findOne({ id });

    // if (!isItem) {
    //   return throw new Error("No item found");
    // }

    const item = await getConnection()
      .createQueryBuilder()
      .update(Item)
      .set({ title, description, price })
      .where("id = :id", {
        id: id,
      })
      .returning("*")
      .execute();

    return item.raw[0];
  }
}
