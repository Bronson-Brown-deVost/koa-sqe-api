import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {artefact} from "./artefact";
import {scroll_version} from "./scroll_version";


@Entity("artefact_data",{schema:"SQE_DEV"})
@Index("fk_artefact_data_to_artefact",["artefact_",])
export class artefact_data {

    @PrimaryGeneratedColumn({ 
        name:"artefact_data_id"
        })
    artefact_data_id:number;
        

   
    @ManyToOne(type=>artefact, artefact=>artefact.artefact_datas,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'artefact_id'})
    artefact_:artefact | null;


    @Column("text",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.artefact_datas,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
