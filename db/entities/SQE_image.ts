import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {image_urls} from "./image_urls";
import {image_catalog} from "./image_catalog";
import {artefact_shape} from "./artefact_shape";
import {image_to_image_map} from "./image_to_image_map";
import {edition_catalog} from "./edition_catalog";


@Entity("SQE_image",{schema:"SQE_DEV"})
@Index("url_UNIQUE",["image_urls_","filename",],{unique:true})
@Index("fk_image_to_catalog",["image_catalog_",])
export class SQE_image {

    @PrimaryGeneratedColumn({ 
        name:"sqe_image_id"
        })
    sqe_image_id:number;
        

   
    @OneToOne(type=>image_urls, image_urls=>image_urls.sQE_image,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'image_urls_id'})
    image_urls_:image_urls | null;


    @Column("varchar",{ 
        nullable:false,
        length:128,
        default:"''''''",
        name:"filename"
        })
    filename:string;
        

    @Column("int",{ 
        nullable:false,
        default:"0",
        name:"native_width"
        })
    native_width:number;
        

    @Column("int",{ 
        nullable:false,
        default:"0",
        name:"native_height"
        })
    native_height:number;
        

    @Column("int",{ 
        nullable:false,
        default:"0",
        name:"dpi"
        })
    dpi:number;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"type"
        })
    type:number;
        

    @Column("smallint",{ 
        nullable:false,
        default:"445",
        name:"wavelength_start"
        })
    wavelength_start:number;
        

    @Column("smallint",{ 
        nullable:false,
        default:"704",
        name:"wavelength_end"
        })
    wavelength_end:number;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        default:"0",
        name:"is_master"
        })
    is_master:boolean;
        

   
    @ManyToOne(type=>image_catalog, image_catalog=>image_catalog.sQE_images,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'image_catalog_id'})
    image_catalog_:image_catalog | null;


   
    @OneToMany(type=>artefact_shape, artefact_shape=>artefact_shape.id_of_sqe_image,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    artefact_shapes:artefact_shape[];
    

   
    @OneToOne(type=>image_to_image_map, image_to_image_map=>image_to_image_map.image1_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    image_to_image_map:image_to_image_map | null;


   
    @OneToOne(type=>image_to_image_map, image_to_image_map=>image_to_image_map.image2_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    image_to_image_map2:image_to_image_map | null;


   
    @ManyToMany(type=>edition_catalog, edition_catalog=>edition_catalog.sQE_images,{  nullable:false, })
    @JoinTable()
    edition_catalogs:edition_catalog[];
    
}
