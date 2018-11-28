import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char_attribute} from "./sign_char_attribute";


@Entity("attribute_numeric",{schema:"SQE_DEV"})
@Index("value",["value",])
export class attribute_numeric {

   
    @OneToOne(type=>sign_char_attribute, sign_char_attribute=>sign_char_attribute.attribute_numeric,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_char_attribute_id'})
    sign_char_attribute_:sign_char_attribute | null;


    @Column("float",{ 
        nullable:true,
        default:"0",
        precision:12,
        name:"value"
        })
    value:number | null;
        
}
