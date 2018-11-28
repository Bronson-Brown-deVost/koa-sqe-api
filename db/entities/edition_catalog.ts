import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {scroll} from "./scroll";
import {SQE_image} from "./SQE_image";
import {image_catalog} from "./image_catalog";


@Entity("edition_catalog",{schema:"SQE_DEV"})
@Index("unique_edition_entry",["edition_location_1","edition_location_2","edition_name","edition_side","edition_volume","composition",],{unique:true})
@Index("fk_edition_catalog_to_scroll_id",["scroll_",])
export class edition_catalog {

    @PrimaryGeneratedColumn({ 
        name:"edition_catalog_id"
        })
    edition_catalog_id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:128,
        default:"''''''",
        name:"composition"
        })
    composition:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        default:"''''''",
        name:"edition_name"
        })
    edition_name:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"edition_volume"
        })
    edition_volume:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"edition_location_1"
        })
    edition_location_1:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"edition_location_2"
        })
    edition_location_2:string | null;
        

    @Column("tinyint",{ 
        nullable:false,
        default:"0",
        name:"edition_side"
        })
    edition_side:number;
        

   
    @ManyToOne(type=>scroll, scroll=>scroll.edition_catalogs,{ onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'scroll_id'})
    scroll_:scroll | null;


   
    @ManyToMany(type=>SQE_image, SQE_image=>SQE_image.edition_catalogs)
    sQE_images:SQE_image[];
    

   
    @ManyToMany(type=>image_catalog, image_catalog=>image_catalog.edition_catalogs,{  nullable:false, })
    @JoinTable()
    image_catalogs:image_catalog[];
    
}
