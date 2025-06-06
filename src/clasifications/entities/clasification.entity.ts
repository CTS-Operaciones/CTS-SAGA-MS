import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
//import { Assets } from "./assets.entity";

@Entity()
export class Classifications extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name: string = "";

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date | null = null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null = null;

 /*  @OneToMany(
    () => Assets,
    (asset) => asset.classifications
  )
  assets?: Assets[];*/
} 
