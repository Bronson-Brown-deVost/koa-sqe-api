import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {col_to_line} from "./col_to_line";
import {line_data} from "./line_data";
import {line_to_sign} from "./line_to_sign";


@Entity("line",{schema:"SQE_DEV"})
export class line {

    @PrimaryGeneratedColumn({ 
        name:"line_id"
        })
    line_id:number;
        

   
    @OneToOne(type=>col_to_line, col_to_line=>col_to_line.line_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    col_to_line:col_to_line | null;


   
    @OneToOne(type=>line_data, line_data=>line_data.line_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    line_data:line_data | null;


   
    @OneToOne(type=>line_to_sign, line_to_sign=>line_to_sign.line_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    line_to_sign:line_to_sign | null;

}
