import { CartItem } from "./../entities/cartItem";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Item } from "./../entities/item";
import { isAuth } from "./../middleware/isAuth";
import "reflect-metadata";
import { MyContext } from "./../types/MyContext";
import { getUserId } from "./../utils/getUserId";

@Resolver()
export class CartItemResolver {
  @Mutation(() => CartItem)
  @UseMiddleware(isAuth)
  async addToCart(@Arg("id", () => Int) id: number, @Ctx() { req }: MyContext) {
    // ! TOO MUCH CODE
    // * Have to refactor later

    const userId = await getUserId(req.cookies.token);
    const itemExistsInCart = await CartItem.findOne({
      where: {
        item: { id: id },
        user: { id: userId },
      },
    });
    if (itemExistsInCart) {
      await getConnection()
        .createQueryBuilder()
        .update(CartItem)
        .set({
          quantity: itemExistsInCart.quantity + 1,
        })
        .where("id = :id", { id: itemExistsInCart.id })
        .execute();
      const updatedCart = await CartItem.findOne(itemExistsInCart.id, {
        relations: ["user", "item"],
      });
      return updatedCart;
    }

    const createCart = await CartItem.create({
      item: { id },
      user: { id: userId },
    }).save();

    const newCart = await CartItem.findOne(createCart.id, {
      relations: ["user", "item"],
    });
    return newCart;
  }
}
