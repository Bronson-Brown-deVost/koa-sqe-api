import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {col} from "./col";
import {scroll_version} from "./scroll_version";


@Entity("col_data",{schema:"SQE_DEV"})
@Index("fk_col_data_to_col_idx",["col_",])
export class col_data {

    @PrimaryGeneratedColumn({ 
        name:"col_data_id"
        })
    col_data_id:number;
        

   
    @ManyToOne(type=>col, col=>col.col_datas,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'col_id'})
    col_:col | null;


    @Column("varchar",{ 
        nullable:false,
        length:45,
        default:"''''''",
        name:"name"
        })
    name:string;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.col_datas,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
