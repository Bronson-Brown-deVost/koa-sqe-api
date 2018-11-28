import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("user_contributions",{schema:"SQE_DEV"})
export class user_contributions {

    @PrimaryGeneratedColumn({ 
        name:"contribution_id"
        })
    contribution_id:number;
        

    @Column("smallint",{ 
        nullable:true,
        default:"NULL",
        name:"user_id"
        })
    user_id:number | null;
        

    @Column("mediumtext",{ 
        nullable:true,
        default:"NULL",
        name:"contribution"
        })
    contribution:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        default:"NULL",
        name:"entry_time"
        })
    entry_time:Date | null;
        
}
