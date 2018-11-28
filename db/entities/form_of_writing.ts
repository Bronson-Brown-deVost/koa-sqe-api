import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scribe} from "./scribe";
import {scribal_font_type} from "./scribal_font_type";
import {char_of_writing} from "./char_of_writing";
import {scroll_version} from "./scroll_version";


@Entity("form_of_writing",{schema:"SQE_DEV"})
@Index("fk_form_to_scribe_idx",["scribes_scribe_",])
@Index("fk_form_to_char_style_idx",["scribal_font_type_",])
export class form_of_writing {

    @PrimaryGeneratedColumn({ 
        name:"form_of_writing_id"
        })
    form_of_writing_id:number;
        

   
    @ManyToOne(type=>scribe, scribe=>scribe.form_of_writings,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scribes_scribe_id'})
    scribes_scribe_:scribe | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"pen"
        })
    pen:number;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"ink"
        })
    ink:number;
        

   
    @ManyToOne(type=>scribal_font_type, scribal_font_type=>scribal_font_type.form_of_writings,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scribal_font_type_id'})
    scribal_font_type_:scribal_font_type | null;


   
    @OneToOne(type=>char_of_writing, char_of_writing=>char_of_writing.form_of_writing_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    char_of_writing:char_of_writing | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.form_of_writings,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
