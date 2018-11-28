import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {col} from "./col";
import {scroll_version} from "./scroll_version";


@Entity("col_sequence",{schema:"SQE_DEV"})
@Index("fk_cs_to_col_idx",["col_",])
export class col_sequence {

    @PrimaryGeneratedColumn({ 
        name:"col_sequence_id"
        })
    col_sequence_id:number;
        

   
    @ManyToOne(type=>col, col=>col.col_sequences,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'col_id'})
    col_:col | null;


    @Column("smallint",{ 
        nullable:false,
        default:"0",
        name:"position"
        })
    position:number;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.col_sequences,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
