import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {artefact} from "./artefact";
import {scroll_version} from "./scroll_version";


@Entity("artefact_position",{schema:"SQE_DEV"})
@Index("fk_artefact_position_to_artefact",["artefact_",])
export class artefact_position {

    @PrimaryGeneratedColumn({ 
        name:"artefact_position_id"
        })
    artefact_position_id:number;
        

   
    @ManyToOne(type=>artefact, artefact=>artefact.artefact_positions,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'artefact_id'})
    artefact_:artefact | null;


    @Column("longtext",{ 
        nullable:false,
        default:"'{matrix: [[1,0,0],[0,1,0]]}'",
        name:"transform_matrix"
        })
    transform_matrix:string;
        

    @Column("tinyint",{ 
        nullable:true,
        default:"NULL",
        name:"z_index"
        })
    z_index:number | null;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.artefact_positions,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
