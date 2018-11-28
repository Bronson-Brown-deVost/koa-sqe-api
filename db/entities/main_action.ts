import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll_version} from "./scroll_version";
import {single_action} from "./single_action";


@Entity("main_action",{schema:"SQE_DEV"})
@Index("main_action_to_scroll_version_idx",["scroll_version_",])
export class main_action {

    @PrimaryGeneratedColumn({ 
        name:"main_action_id"
        })
    main_action_id:number;
        

    @Column("datetime",{ 
        nullable:true,
        default:"current_timestamp(6)",
        name:"time"
        })
    time:Date | null;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"rewinded"
        })
    rewinded:number;
        

   
    @ManyToOne(type=>scroll_version, scroll_version=>scroll_version.main_actions,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_version_id'})
    scroll_version_:scroll_version | null;


   
    @OneToMany(type=>single_action, single_action=>single_action.main_action_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    single_actions:single_action[];
    
}
