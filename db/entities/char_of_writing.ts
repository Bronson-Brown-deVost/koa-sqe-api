import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {form_of_writing} from "./form_of_writing";
import {kerning_of_char} from "./kerning_of_char";
import {scroll_version} from "./scroll_version";


@Entity("char_of_writing",{schema:"SQE_DEV"})
@Index("form_char",["form_of_writing_","unicode_char",],{unique:true})
@Index("form_of_writing",["form_of_writing_",])
@Index("char",["unicode_char",])
export class char_of_writing {

    @PrimaryGeneratedColumn({ 
        name:"char_of_writing_id"
        })
    char_of_writing_id:number;
        

   
    @OneToOne(type=>form_of_writing, form_of_writing=>form_of_writing.char_of_writing,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'form_of_writing_id'})
    form_of_writing_:form_of_writing | null;


    @Column("char",{ 
        nullable:false,
        length:1,
        default:"''",
        name:"unicode_char"
        })
    unicode_char:string;
        

    @Column("smallint",{ 
        nullable:false,
        default:"0",
        name:"line_offset"
        })
    line_offset:number;
        

    @Column("text",{ 
        nullable:true,
        default:"NULL",
        name:"commentary"
        })
    commentary:string | null;
        

   
    @OneToOne(type=>kerning_of_char, kerning_of_char=>kerning_of_char.chars_of_writing_char_of_writing_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    kerning_of_char:kerning_of_char | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.char_of_writings,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
