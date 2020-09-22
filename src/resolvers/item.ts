import { getUserId } from "./../utils/getUserId";
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
    const userId = await getUserId(req.cookies.token);
    return Item.create({
      ...input,
      creatorId: userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteItem(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = await getUserId(req.cookies.token);
    const item = await Item.findOne({
      where: {
        id: id,
        creatorId: userId,
      },
    });

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
