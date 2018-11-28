import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char_roi} from "./sign_char_roi";


@Entity("roi_position",{schema:"SQE_DEV"})
export class roi_position {

    @PrimaryGeneratedColumn({ 
        name:"roi_position_id"
        })
    roi_position_id:number;
        

    @Column("longtext",{ 
        nullable:true,
        default:`'{"matrix":[[1,0,0],[0,1,0]]}'`,
        name:"transform_matrix"
        })
    transform_matrix:string | null;
        

   
    @OneToOne(type=>sign_char_roi, sign_char_roi=>sign_char_roi.roi_position_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_roi:sign_char_roi | null;

}
