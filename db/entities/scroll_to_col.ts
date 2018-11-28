import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll} from "./scroll";
import {col} from "./col";
import {scroll_version} from "./scroll_version";


@Entity("scroll_to_col",{schema:"SQE_DEV"})
@Index("scroll_col_idx",["scroll_","col_",],{unique:true})
@Index("fk_scroll_to_column_to_column_idx",["col_",])
export class scroll_to_col {

    @PrimaryGeneratedColumn({ 
        name:"scroll_to_col_id"
        })
    scroll_to_col_id:number;
        

   
    @OneToOne(type=>scroll, scroll=>scroll.scroll_to_col,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_id'})
    scroll_:scroll | null;


   
    @OneToOne(type=>col, col=>col.scroll_to_col,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'col_id'})
    col_:col | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.scroll_to_cols,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
