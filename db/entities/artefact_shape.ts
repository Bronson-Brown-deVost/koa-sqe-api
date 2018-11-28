import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {artefact} from "./artefact";
import {SQE_image} from "./SQE_image";
import {scroll_version} from "./scroll_version";


@Entity("artefact_shape",{schema:"SQE_DEV"})
@Index("fk_artefact_shape_to_sqe_image_idx",["id_of_sqe_image",])
@Index("fk_artefact_shape_to_artefact",["artefact_",])
export class artefact_shape {

    @PrimaryGeneratedColumn({ 
        name:"artefact_shape_id"
        })
    artefact_shape_id:number;
        

   
    @ManyToOne(type=>artefact, artefact=>artefact.artefact_shapes,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'artefact_id'})
    artefact_:artefact | null;


   
    @ManyToOne(type=>SQE_image, SQE_image=>SQE_image.artefact_shapes,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'id_of_sqe_image'})
    id_of_sqe_image:SQE_image | null;


    @Column("polygon",{ 
        nullable:true,
        default:"NULL",
        name:"region_in_sqe_image"
        })
    region_in_sqe_image:string | null;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.artefact_shapes,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
