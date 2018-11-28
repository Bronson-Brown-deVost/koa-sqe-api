import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll} from "./scroll";
import {scroll_version} from "./scroll_version";


@Entity("scroll_data",{schema:"SQE_DEV"})
@Index("fk_scroll_to_master_scroll_idx",["scroll_",])
export class scroll_data {

    @PrimaryGeneratedColumn({ 
        name:"scroll_data_id"
        })
    scroll_data_id:number;
        

   
    @ManyToOne(type=>scroll, scroll=>scroll.scroll_datas,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_id'})
    scroll_:scroll | null;


    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"name"
        })
    name:string | null;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.scroll_datas,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
