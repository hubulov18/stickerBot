import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export  class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    key: string;

    @Column({type: 'jsonb', nullable: true})
    meta?: object
}