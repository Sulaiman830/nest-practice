import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('feed_post')
export class FeedPostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ''})
    body: string;
    
    // first step
    // @Column({type : 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    // second step
    @CreateDateColumn() 
    createdAt: Date;
}