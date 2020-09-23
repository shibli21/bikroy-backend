import { CartItem } from "./cartItem";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Item } from "./item";

export enum Permissions {
  ADMIN,
  USER,
  ITEMCREATE,
  ITEMDELETE,
  ITEMUPDATE,
  PERMISSIONUPDATE,
}
registerEnumType(Permissions, {
  name: "Permissions",
});

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column("bigint", { nullable: true })
  resetTokenExpiry: number;

  @Field(() => Permissions)
  @Column({
    type: "enum",
    enum: Permissions,
  })
  permission: [Permissions];

  @Field(() => CartItem, { defaultValue: [] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cart: CartItem[];

  @OneToMany(() => Item, (item) => item.creator)
  items: Item[];

  @Field(() => String)
  @UpdateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
