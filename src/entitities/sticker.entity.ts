import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Sticker {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "json" })
    file: IFile
}