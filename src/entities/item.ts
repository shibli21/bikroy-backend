import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@ObjectType()
@Entity()
export class Item extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column({ type: "int" })
  price!: number;

  @Field({ defaultValue: null })
  @Column({ nullable: true })
  image!: string;

  @Field({ defaultValue: null })
  @Column({ nullable: true })
  largeImage!: string;

  @Field()
  @Column()
  creatorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.items)
  creator: User;

  @Field(() => String)
  @UpdateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
