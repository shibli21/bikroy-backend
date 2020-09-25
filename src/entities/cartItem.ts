import { User } from "./user";
import { Item } from "./item";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class CartItem extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ default: 1 })
  quantity!: number;

  @Field()
  @ManyToOne(() => Item, {
    onDelete: "CASCADE",
  })
  item!: Item;

  @Field()
  @ManyToOne(() => User, (user) => user.cart)
  user!: User;
}
