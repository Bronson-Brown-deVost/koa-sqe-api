import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {attribute} from "./attribute";
import {attribute_value_css} from "./attribute_value_css";
import {sign_char_attribute} from "./sign_char_attribute";


@Entity("attribute_value",{schema:"SQE_DEV"})
@Index("fk_att_val_to_att_idx",["attribute_",])
export class attribute_value {

    @PrimaryGeneratedColumn({ 
        name:"attribute_value_id"
        })
    attribute_value_id:number;
        

   
    @ManyToOne(type=>attribute, attribute=>attribute.attribute_values,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'attribute_id'})
    attribute_:attribute | null;


    @Column("varchar",{ 
        nullable:true,
        length:255,
        default:"NULL",
        name:"string_value"
        })
    string_value:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:1000,
        default:"NULL",
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>attribute_value_css, attribute_value_css=>attribute_value_css.attribute_value_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    attribute_value_csss:attribute_value_css[];
    

   
    @OneToMany(type=>sign_char_attribute, sign_char_attribute=>sign_char_attribute.attribute_value_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_attributes:sign_char_attribute[];
    
}
