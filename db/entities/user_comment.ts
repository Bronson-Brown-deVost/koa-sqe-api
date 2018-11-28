import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {user} from "./user";


@Entity("user_comment",{schema:"SQE_DEV"})
@Index("fk_user_comment_to_user_idx",["user_",])
export class user_comment {

    @PrimaryGeneratedColumn({ 
        name:"comment_id"
        })
    comment_id:number;
        

   
    @OneToOne(type=>user, user=>user.user_comment,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'user_id'})
    user_:user | null;


    @Column("varchar",{ 
        nullable:true,
        length:5000,
        default:"NULL",
        name:"comment_text"
        })
    comment_text:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        default:"NULL",
        name:"entry_time"
        })
    entry_time:Date | null;
        
}
