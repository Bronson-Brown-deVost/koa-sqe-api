import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char} from "./sign_char";
import {roi_shape} from "./roi_shape";
import {roi_position} from "./roi_position";
import {scroll_version} from "./scroll_version";


@Entity("sign_char_roi",{schema:"SQE_DEV"})
@Index("char_shape_position",["sign_char_","roi_shape_","roi_position_",],{unique:true})
@Index("fk_sign_area_to_sign_char_idx",["sign_char_",])
@Index("fk_sign_area_to_area_idx",["roi_shape_",])
@Index("fk_sign_area_to_area_position_idx",["roi_position_",])
export class sign_char_roi {

    @PrimaryGeneratedColumn({ 
        name:"sign_char_roi_id"
        })
    sign_char_roi_id:number;
        

   
    @OneToOne(type=>sign_char, sign_char=>sign_char.sign_char_roi,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_char_id'})
    sign_char_:sign_char | null;


   
    @OneToOne(type=>roi_shape, roi_shape=>roi_shape.sign_char_roi,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'roi_shape_id'})
    roi_shape_:roi_shape | null;


   
    @OneToOne(type=>roi_position, roi_position=>roi_position.sign_char_roi,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'roi_position_id'})
    roi_position_:roi_position | null;


    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"values_set"
        })
    values_set:number;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"exceptional"
        })
    exceptional:number;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.sign_char_rois,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
