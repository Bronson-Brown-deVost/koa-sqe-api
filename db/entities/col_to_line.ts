import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {col} from "./col";
import {line} from "./line";
import {scroll_version} from "./scroll_version";


@Entity("col_to_line",{schema:"SQE_DEV"})
@Index("col_line_idx",["col_","line_",],{unique:true})
@Index("fk_col_to_line_to_line_idx",["line_",])
export class col_to_line {

    @PrimaryGeneratedColumn({ 
        name:"col_to_line_id"
        })
    col_to_line_id:number;
        

   
    @OneToOne(type=>col, col=>col.col_to_line,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'col_id'})
    col_:col | null;


   
    @OneToOne(type=>line, line=>line.col_to_line,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'line_id'})
    line_:line | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.col_to_lines,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
