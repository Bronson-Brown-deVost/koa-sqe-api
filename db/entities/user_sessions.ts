import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("user_sessions",{schema:"SQE_DEV"})
export class user_sessions {

    @PrimaryGeneratedColumn({ 
        name:"session_id"
        })
    session_id:number;
        

    @Column("smallint",{ 
        nullable:false,
        primary:true,
        name:"user_id"
        })
    user_id:number;
        

    @Column("char",{ 
        nullable:true,
        length:56,
        default:"NULL",
        name:"session_key"
        })
    session_key:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        default:"NULL",
        name:"session_start"
        })
    session_start:Date | null;
        

    @Column("datetime",{ 
        nullable:true,
        default:"NULL",
        name:"session_end"
        })
    session_end:Date | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"NULL",
        name:"current"
        })
    current:boolean | null;
        
}
