import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {external_font} from "./external_font";


@Entity("external_font_glyph",{schema:"SQE_DEV"})
@Index("char_idx",["unicode_char",],{unique:true})
@Index("fk_efg_to_external_font_idx",["external_font_",])
export class external_font_glyph {

    @PrimaryGeneratedColumn({ 
        name:"external_font_glyph_id"
        })
    external_font_glyph_id:number;
        

   
    @ManyToOne(type=>external_font, external_font=>external_font.external_font_glyphs,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'external_font_id'})
    external_font_:external_font | null;


    @Column("varbinary",{ 
        nullable:false,
        unique: true,
        length:4,
        name:"unicode_char"
        })
    unicode_char: ArrayBuffer;
        

    @Column("multipolygon",{ 
        nullable:false,
        name:"path"
        })
    path:string;
        

    @Column("smallint",{ 
        nullable:true,
        default:"NULL",
        name:"width"
        })
    width:number | null;
        

    @Column("smallint",{ 
        nullable:true,
        default:"NULL",
        name:"height"
        })
    height:number | null;
        
}
