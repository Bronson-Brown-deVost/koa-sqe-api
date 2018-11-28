import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign} from "./sign";
import {line} from "./line";
import {scroll_version} from "./scroll_version";


@Entity("line_to_sign",{schema:"SQE_DEV"})
@Index("line_sign_idx",["sign_","line_",],{unique:true})
@Index("fk_line_to_sign_to_line_idx",["line_",])
export class line_to_sign {

    @PrimaryGeneratedColumn({ 
        name:"line_to_sign_id"
        })
    line_to_sign_id:number;
        

   
    @OneToOne(type=>sign, sign=>sign.line_to_sign,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_id'})
    sign_:sign | null;


   
    @OneToOne(type=>line, line=>line.line_to_sign,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'line_id'})
    line_:line | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.line_to_signs,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
