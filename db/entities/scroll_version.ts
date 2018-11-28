import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {user} from "./user";
import {scroll_version_group} from "./scroll_version_group";
import {main_action} from "./main_action";
import {area_group} from "./area_group";
import {artefact_data} from "./artefact_data";
import {artefact_position} from "./artefact_position";
import {artefact_shape} from "./artefact_shape";
import {char_of_writing} from "./char_of_writing";
import {col_data} from "./col_data";
import {col_sequence} from "./col_sequence";
import {col_to_line} from "./col_to_line";
import {form_of_writing} from "./form_of_writing";
import {line_data} from "./line_data";
import {line_to_sign} from "./line_to_sign";
import {position_in_stream} from "./position_in_stream";
import {scribal_font_type} from "./scribal_font_type";
import {scribe} from "./scribe";
import {scroll_data} from "./scroll_data";
import {scroll_to_col} from "./scroll_to_col";
import {sign_char_attribute} from "./sign_char_attribute";
import {sign_char_commentary} from "./sign_char_commentary";
import {sign_char_roi} from "./sign_char_roi";
import {word} from "./word";


@Entity("scroll_version",{schema:"SQE_DEV"})
@Index("fk_scroll_version_to_user_idx",["user_",])
@Index("fk_scroll_version_tos_vg_idx",["scroll_version_group_",])
export class scroll_version {

    @PrimaryGeneratedColumn({ 
        name:"scroll_version_id"
        })
    scroll_version_id:number;
        

   
    @ManyToOne(type=>user, user=>user.scroll_versions,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'user_id'})
    user_:user | null;


   
    @ManyToOne(type=>scroll_version_group, scroll_version_group=>scroll_version_group.scroll_versions,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_version_group_id'})
    scroll_version_group_:scroll_version_group | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"may_write"
        })
    may_write:number;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"may_lock"
        })
    may_lock:number;
        

   
    @OneToMany(type=>main_action, main_action=>main_action.scroll_version_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    main_actions:main_action[];
    

   
    @ManyToMany(type=>area_group, area_group=>area_group.scroll_versions)
    area_groups:area_group[];
    

   
    @ManyToMany(type=>artefact_data, artefact_data=>artefact_data.scroll_versions)
    artefact_datas:artefact_data[];
    

   
    @ManyToMany(type=>artefact_position, artefact_position=>artefact_position.scroll_versions)
    artefact_positions:artefact_position[];
    

   
    @ManyToMany(type=>artefact_shape, artefact_shape=>artefact_shape.scroll_versions)
    artefact_shapes:artefact_shape[];
    

   
    @ManyToMany(type=>char_of_writing, char_of_writing=>char_of_writing.scroll_versions)
    char_of_writings:char_of_writing[];
    

   
    @ManyToMany(type=>col_data, col_data=>col_data.scroll_versions)
    col_datas:col_data[];
    

   
    @ManyToMany(type=>col_sequence, col_sequence=>col_sequence.scroll_versions)
    col_sequences:col_sequence[];
    

   
    @ManyToMany(type=>col_to_line, col_to_line=>col_to_line.scroll_versions)
    col_to_lines:col_to_line[];
    

   
    @ManyToMany(type=>form_of_writing, form_of_writing=>form_of_writing.scroll_versions)
    form_of_writings:form_of_writing[];
    

   
    @ManyToMany(type=>line_data, line_data=>line_data.scroll_versions)
    line_datas:line_data[];
    

   
    @ManyToMany(type=>line_to_sign, line_to_sign=>line_to_sign.scroll_versions)
    line_to_signs:line_to_sign[];
    

   
    @ManyToMany(type=>position_in_stream, position_in_stream=>position_in_stream.scroll_versions)
    position_in_streams:position_in_stream[];
    

   
    @ManyToMany(type=>scribal_font_type, scribal_font_type=>scribal_font_type.scroll_versions)
    scribal_font_types:scribal_font_type[];
    

   
    @ManyToMany(type=>scribe, scribe=>scribe.scroll_versions)
    scribes:scribe[];
    

   
    @ManyToMany(type=>scroll_data, scroll_data=>scroll_data.scroll_versions)
    scroll_datas:scroll_data[];
    

   
    @ManyToMany(type=>scroll_to_col, scroll_to_col=>scroll_to_col.scroll_versions)
    scroll_to_cols:scroll_to_col[];
    

   
    @ManyToMany(type=>sign_char_attribute, sign_char_attribute=>sign_char_attribute.scroll_versions)
    sign_char_attributes:sign_char_attribute[];
    

   
    @ManyToMany(type=>sign_char_commentary, sign_char_commentary=>sign_char_commentary.scroll_versions)
    sign_char_commentarys:sign_char_commentary[];
    

   
    @ManyToMany(type=>sign_char_roi, sign_char_roi=>sign_char_roi.scroll_versions)
    sign_char_rois:sign_char_roi[];
    

   
    @ManyToMany(type=>word, word=>word.scroll_versions)
    words:word[];
    
}
