import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {attribute_value} from "./attribute_value";
import {sign_char_commentary} from "./sign_char_commentary";


@Entity("attribute",{schema:"SQE_DEV"})
export class attribute {

    @PrimaryGeneratedColumn({ 
        name:"attribute_id"
        })
    attribute_id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"name"
        })
    name:string;
        

    @Column("enum",{ 
        nullable:true,
        default:"NULL",
        enum:["BOOLEAN","NUMBER","STRING"],
        name:"type"
        })
    type:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:1000,
        default:"NULL",
        name:"description"
        })
    description:string | null;
        

   
    @OneToMany(type=>attribute_value, attribute_value=>attribute_value.attribute_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    attribute_values:attribute_value[];
    

   
    @OneToMany(type=>sign_char_commentary, sign_char_commentary=>sign_char_commentary.attribute_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_commentarys:sign_char_commentary[];
    
}
