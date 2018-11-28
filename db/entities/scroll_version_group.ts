import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll} from "./scroll";
import {scroll_version} from "./scroll_version";
import {user} from "./user";


@Entity("scroll_version_group",{schema:"SQE_DEV"})
@Index("fk_sv_group_to_scroll_idx",["scroll_",])
export class scroll_version_group {

    @PrimaryGeneratedColumn({ 
        name:"scroll_version_group_id"
        })
    scroll_version_group_id:number;
        

   
    @ManyToOne(type=>scroll, scroll=>scroll.scroll_version_groups,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_id'})
    scroll_:scroll | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"locked"
        })
    locked:number;
        

   
    @OneToMany(type=>scroll_version, scroll_version=>scroll_version.scroll_version_group_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    scroll_versions:scroll_version[];
    

   
    @ManyToMany(type=>user, user=>user.scroll_version_groups,{  nullable:false, })
    @JoinTable()
    users:user[];
    
}
