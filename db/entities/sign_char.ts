import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign} from "./sign";
import {sign_char_attribute} from "./sign_char_attribute";
import {sign_char_commentary} from "./sign_char_commentary";
import {sign_char_roi} from "./sign_char_roi";


@Entity("sign_char",{schema:"SQE_DEV"})
@Index("fk_sign_char_to_sign_idx",["sign_",])
export class sign_char {

    @PrimaryGeneratedColumn({ 
        name:"sign_char_id"
        })
    sign_char_id:number;
        

   
    @ManyToOne(type=>sign, sign=>sign.sign_chars,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_id'})
    sign_:sign | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"is_variant"
        })
    is_variant:number;
        

    @Column("char",{ 
        nullable:false,
        length:1,
        default:"''",
        name:"sign"
        })
    sign:string;
        

   
    @OneToMany(type=>sign_char_attribute, sign_char_attribute=>sign_char_attribute.sign_char_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_attributes:sign_char_attribute[];
    

   
    @OneToMany(type=>sign_char_commentary, sign_char_commentary=>sign_char_commentary.sign_char_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_commentarys:sign_char_commentary[];
    

   
    @OneToOne(type=>sign_char_roi, sign_char_roi=>sign_char_roi.sign_char_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_roi:sign_char_roi | null;

}
