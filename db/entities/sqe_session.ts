import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {user} from "./user";


@Entity("sqe_session",{schema:"SQE_DEV"})
@Index("fk_sqe_sesseio_to_user_idx",["user_",])
export class sqe_session {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:128,
        default:"''",
        name:"sqe_session_id"
        })
    sqe_session_id:string;
        

   
    @ManyToOne(type=>user, user=>user.sqe_sessions,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'user_id'})
    user_:user | null;


    @Column("int",{ 
        nullable:false,
        default:"1",
        name:"scroll_version_id"
        })
    scroll_version_id:number;
        

    @Column("timestamp",{ 
        nullable:false,
        default:"current_timestamp(6)",
        name:"session_start"
        })
    session_start:Date;
        

    @Column("timestamp",{ 
        nullable:true,
        default:"NULL",
        name:"last_internal_session_end"
        })
    last_internal_session_end:Date | null;
        

    @Column("longtext",{ 
        nullable:true,
        default:"NULL",
        name:"attributes"
        })
    attributes:string | null;
        

    @Column("int",{ 
        nullable:true,
        default:"0",
        name:"expires"
        })
    expires:number | null;
        

    @Column("text",{ 
        nullable:true,
        default:"NULL",
        name:"data"
        })
    data:string | null;
        
}
