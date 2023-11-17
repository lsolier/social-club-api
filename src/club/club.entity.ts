import { MemberEntity } from "src/member/member.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    foundationDate: Date;
    
    @Column()
    image: string;
    
    @Column()
    description: string;

    @ManyToMany(() => MemberEntity, memeber => memeber.clubs)
    @JoinTable()
    members: MemberEntity[]

}
