import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char} from "./sign_char";
import {attribute_value} from "./attribute_value";
import {attribute_numeric} from "./attribute_numeric";
import {scroll_version} from "./scroll_version";


@Entity("sign_char_attribute",{schema:"SQE_DEV"})
@Index("fk_sign_char_attr_to_sign_char_idx",["sign_char_",])
@Index("fk_sign_char_attr_to_attr_value_idx",["attribute_value_",])
export class sign_char_attribute {

    @PrimaryGeneratedColumn({ 
        name:"sign_char_attribute_id"
        })
    sign_char_attribute_id:number;
        

   
    @ManyToOne(type=>sign_char, sign_char=>sign_char.sign_char_attributes,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_char_id'})
    sign_char_:sign_char | null;


   
    @ManyToOne(type=>attribute_value, attribute_value=>attribute_value.sign_char_attributes,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'attribute_value_id'})
    attribute_value_:attribute_value | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"sequence"
        })
    sequence:number;
        

   
    @OneToOne(type=>attribute_numeric, attribute_numeric=>attribute_numeric.sign_char_attribute_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    attribute_numeric:attribute_numeric | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.sign_char_attributes,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
