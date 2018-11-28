import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {SQE_image} from "./SQE_image";


@Entity("image_to_image_map",{schema:"SQE_DEV"})
@Index("fk_image1_to_image_id",["image1_",])
@Index("fk_image2_to_image_id",["image2_",])
export class image_to_image_map {

    @PrimaryGeneratedColumn({ 
        name:"image_to_image_map_id"
        })
    image_to_image_map_id:number;
        

   
    @OneToOne(type=>SQE_image, SQE_image=>SQE_image.image_to_image_map,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'image1_id'})
    image1_:SQE_image | null;


   
    @OneToOne(type=>SQE_image, SQE_image=>SQE_image.image_to_image_map2,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'image2_id'})
    image2_:SQE_image | null;


    @Column("polygon",{ 
        nullable:false,
        name:"region_on_image1"
        })
    region_on_image1:string;
        

    @Column("polygon",{ 
        nullable:false,
        name:"region_on_image2"
        })
    region_on_image2:string;
        

    @Column("decimal",{ 
        nullable:false,
        default:"0.000",
        precision:6,
        scale:3,
        name:"rotation"
        })
    rotation:string;
        

    @Column("enum",{ 
        nullable:true,
        default:"NULL",
        enum:["IMAGE_TO_MASTER","BACK_TO_FRONT"],
        name:"map_type"
        })
    map_type:string | null;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        default:"0",
        name:"validated"
        })
    validated:boolean;
        

    @Column("datetime",{ 
        nullable:true,
        default:"current_timestamp()",
        name:"date_of_adding"
        })
    date_of_adding:Date | null;
        
}
