import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {main_action} from "./main_action";


@Entity("single_action",{schema:"SQE_DEV"})
@Index("fk_single_action_to_main_idx",["main_action_",])
export class single_action {

    @PrimaryGeneratedColumn({ 
        name:"single_action_id"
        })
    single_action_id:string;
        

   
    @ManyToOne(type=>main_action, main_action=>main_action.single_actions,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'main_action_id'})
    main_action_:main_action | null;


    @Column("enum",{ 
        nullable:false,
        enum:["add","delete"],
        name:"action"
        })
    action:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        default:"''",
        name:"table"
        })
    table:string;
        

    @Column("int",{ 
        nullable:false,
        default:"0",
        name:"id_in_table"
        })
    id_in_table:number;
        
}
