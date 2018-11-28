import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {form_of_writing} from "./form_of_writing";
import {scroll_version} from "./scroll_version";


@Entity("scribal_font_type",{schema:"SQE_DEV"})
@Index("style_name_idx",["font_name",],{unique:true})
export class scribal_font_type {

    @PrimaryGeneratedColumn({ 
        name:"scribal_font_type_id"
        })
    scribal_font_type_id:number;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        length:45,
        default:"'???'",
        name:"font_name"
        })
    font_name:string;
        

   
    @OneToMany(type=>form_of_writing, form_of_writing=>form_of_writing.scribal_font_type_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    form_of_writings:form_of_writing[];
    

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.scribal_font_types,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
