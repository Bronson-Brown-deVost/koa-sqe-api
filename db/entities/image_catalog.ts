import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {SQE_image} from "./SQE_image";
import {edition_catalog} from "./edition_catalog";


@Entity("image_catalog",{schema:"SQE_DEV"})
@Index("unique_catalog_entry",["catalog_number_1","catalog_number_2","catalog_side","institution",],{unique:true})
export class image_catalog {

    @PrimaryGeneratedColumn({ 
        name:"image_catalog_id"
        })
    image_catalog_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:128,
        default:"'NULL'",
        name:"institution"
        })
    institution:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"catalog_number_1"
        })
    catalog_number_1:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"catalog_number_2"
        })
    catalog_number_2:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        default:"0",
        name:"catalog_side"
        })
    catalog_side:number | null;
        

   
    @OneToMany(type=>SQE_image, SQE_image=>SQE_image.image_catalog_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sQE_images:SQE_image[];
    

   
    @ManyToMany(type=>edition_catalog, edition_catalog=>edition_catalog.image_catalogs)
    edition_catalogs:edition_catalog[];
    
}
