import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {col_data} from "./col_data";
import {col_sequence} from "./col_sequence";
import {col_to_line} from "./col_to_line";
import {scroll_to_col} from "./scroll_to_col";


@Entity("col",{schema:"SQE_DEV"})
export class col {

    @PrimaryGeneratedColumn({ 
        name:"col_id"
        })
    col_id:number;
        

   
    @OneToMany(type=>col_data, col_data=>col_data.col_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    col_datas:col_data[];
    

   
    @OneToMany(type=>col_sequence, col_sequence=>col_sequence.col_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    col_sequences:col_sequence[];
    

   
    @OneToOne(type=>col_to_line, col_to_line=>col_to_line.col_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    col_to_line:col_to_line | null;


   
    @OneToOne(type=>scroll_to_col, scroll_to_col=>scroll_to_col.col_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    scroll_to_col:scroll_to_col | null;

}
