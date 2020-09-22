import { userId } from "./../utils/userId";
import { MyContext } from "./../types/MyContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Item } from "./../entities/item";
import { isAuth } from "./../middleware/isAuth";

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
    const item = await Item.findOne(id, { relations: ["creator"] });
    return item;
  }

  @Query(() => [Item], { nullable: true })
  async items(): Promise<Item[] | undefined> {
    const items = await Item.find({ relations: ["creator"] });
    return items;
  }

  @Mutation(() => Item)
  @UseMiddleware(isAuth)
  async createItem(
    @Arg("input") input: ItemInput,
    @Ctx() { req }: MyContext
  ): Promise<Item | null> {
    const id = await userId(req.cookies.token);
    return Item.create({
      ...input,
      creatorId: id,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteItem(@Arg("id", () => Int) id: number) {
    const item = await Item.findOne(id);
    if (!item) {
      return false;
    }

    await Item.delete({ id });

    return true;
  }

  @Mutation(() => Item, { nullable: true })
  @UseMiddleware(isAuth)
  async updateItem(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("description", () => String) description: string,
    @Arg("price", () => Int) price: number
  ): Promise<Item | null> {
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
