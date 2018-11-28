import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {SQE_image} from "./SQE_image";


@Entity("image_urls",{schema:"SQE_DEV"})
export class image_urls {

    @Column("int",{ 
        nullable:false,
        primary:true,
        default:"0",
        name:"image_urls_id"
        })
    image_urls_id:number;
        

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:128,
        name:"url"
        })
    url:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:128,
        default:"'''''default.jpg'''''",
        name:"suffix"
        })
    suffix:string;
        

   
    @OneToOne(type=>SQE_image, SQE_image=>SQE_image.image_urls_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sQE_image:SQE_image | null;

}
