import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {artefact_data} from "./artefact_data";
import {artefact_position} from "./artefact_position";
import {artefact_shape} from "./artefact_shape";


@Entity("artefact",{schema:"SQE_DEV"})
export class artefact {

    @PrimaryGeneratedColumn({ 
        name:"artefact_id"
        })
    artefact_id:number;
        

   
    @OneToMany(type=>artefact_data, artefact_data=>artefact_data.artefact_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    artefact_datas:artefact_data[];
    

   
    @OneToMany(type=>artefact_position, artefact_position=>artefact_position.artefact_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    artefact_positions:artefact_position[];
    

   
    @OneToMany(type=>artefact_shape, artefact_shape=>artefact_shape.artefact_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    artefact_shapes:artefact_shape[];
    
}
