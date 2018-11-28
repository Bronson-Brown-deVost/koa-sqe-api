import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {external_font_glyph} from "./external_font_glyph";


@Entity("external_font",{schema:"SQE_DEV"})
@Index("font_id_idx",["font_id",],{unique:true})
export class external_font {

    @PrimaryGeneratedColumn({ 
        name:"external_font_id"
        })
    external_font_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        unique: true,
        length:100,
        default:"NULL",
        name:"font_id"
        })
    font_id:string | null;
        

   
    @OneToMany(type=>external_font_glyph, external_font_glyph=>external_font_glyph.external_font_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    external_font_glyphs:external_font_glyph[];
    
}
