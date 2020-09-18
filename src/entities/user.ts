import { Field, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

enum Permissions {
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

  @Field({ nullable: true })
  @Column()
  resetToken?: string;

  @Field({ nullable: true })
  @Column()
  resetTokenExpiry?: string;

  @Field(() => Permissions, { nullable: true })
  @Column({
    type: "enum",
    enum: Permissions,
  })
  permission?: [Permissions];

  @Field(() => String)
  @UpdateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
