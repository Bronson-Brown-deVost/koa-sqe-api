import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll_version} from "./scroll_version";
import {sqe_session} from "./sqe_session";
import {user_comment} from "./user_comment";
import {scroll_version_group} from "./scroll_version_group";


@Entity("user",{schema:"SQE_DEV"})
@Index("user",["user_name",],{unique:true})
export class user {

    @PrimaryGeneratedColumn({ 
        name:"user_id"
        })
    user_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        unique: true,
        length:30,
        default:"'NULL'",
        name:"user_name"
        })
    user_name:string | null;
        

    @Column("char",{ 
        nullable:true,
        length:64,
        default:"'NULL'",
        name:"pw"
        })
    pw:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        default:"NULL",
        name:"forename"
        })
    forename:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        default:"NULL",
        name:"surname"
        })
    surname:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        default:"NULL",
        name:"organization"
        })
    organization:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:255,
        default:"NULL",
        name:"email"
        })
    email:string | null;
        

    @Column("timestamp",{ 
        nullable:false,
        default:"current_timestamp()",
        name:"registration_date"
        })
    registration_date:Date;
        

    @Column("longtext",{ 
        nullable:true,
        default:"NULL",
        name:"settings"
        })
    settings:string | null;
        

    @Column("int",{ 
        nullable:false,
        default:"1",
        name:"last_scroll_version_id"
        })
    last_scroll_version_id:number;
        

   
    @OneToMany(type=>scroll_version, scroll_version=>scroll_version.user_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    scroll_versions:scroll_version[];
    

   
    @OneToMany(type=>sqe_session, sqe_session=>sqe_session.user_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sqe_sessions:sqe_session[];
    

   
    @OneToOne(type=>user_comment, user_comment=>user_comment.user_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    user_comment:user_comment | null;


   
    @ManyToMany(type=>scroll_version_group, scroll_version_group=>scroll_version_group.users)
    scroll_version_groups:scroll_version_group[];
    
}
