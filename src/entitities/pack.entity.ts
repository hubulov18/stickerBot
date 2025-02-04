import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Pack {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({type: 'boolean', default: false})
    in_process: boolean;

    @Column()
    userId: number;

    /*
    @ManyToOne(() => User, user => user.packs)
    @JoinColumn()
    user: number
*/
}