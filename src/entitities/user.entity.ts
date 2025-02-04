import {Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import {Pack} from "./pack.entity";

enum Status {

    BUSY= 1,
    VACANT =2.
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number

    @Column({default:Status.VACANT})
    status: number;

    @Column({nullable: true})
    stage: string;

    @Column({nullable: true})
    scene: string;

    /*
    @OneToMany(type => Pack, pack => pack.id, {eager:true})
    @JoinColumn({ name: "user_id", referencedColumnName: "user_id" })
    packs: Pack[];

     */

}