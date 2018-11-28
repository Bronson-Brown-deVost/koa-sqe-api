import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char} from "./sign_char";
import {attribute} from "./attribute";
import {scroll_version} from "./scroll_version";


@Entity("sign_char_commentary",{schema:"SQE_DEV"})
@Index("fk_scc_to_attribute_idx",["attribute_",])
@Index("sign_char_id",["sign_char_",])
export class sign_char_commentary {

    @PrimaryGeneratedColumn({ 
        name:"sign_char_commentary_id"
        })
    sign_char_commentary_id:number;
        

   
    @ManyToOne(type=>sign_char, sign_char=>sign_char.sign_char_commentarys,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_char_id'})
    sign_char_:sign_char | null;


   
    @ManyToOne(type=>attribute, attribute=>attribute.sign_char_commentarys,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'attribute_id'})
    attribute_:attribute | null;


    @Column("longtext",{ 
        nullable:false,
        default:"''",
        name:"commentary"
        })
    commentary:string;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.sign_char_commentarys,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
