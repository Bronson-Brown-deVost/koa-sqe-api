import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {attribute_value} from "./attribute_value";


@Entity("attribute_value_css",{schema:"SQE_DEV"})
@Index("fk_attribute_value_css_to_attribute_value",["attribute_value_",])
export class attribute_value_css {

    @PrimaryGeneratedColumn({ 
        name:"attribute_value_css_id"
        })
    attribute_value_css_id:number;
        

   
    @ManyToOne(type=>attribute_value, attribute_value=>attribute_value.attribute_value_csss,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'attribute_value_id'})
    attribute_value_:attribute_value | null;


    @Column("varchar",{ 
        nullable:true,
        length:250,
        default:"NULL",
        name:"css"
        })
    css:string | null;
        
}
