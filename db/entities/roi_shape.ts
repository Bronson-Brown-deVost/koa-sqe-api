import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign_char_roi} from "./sign_char_roi";


@Entity("roi_shape",{schema:"SQE_DEV"})
export class roi_shape {

    @PrimaryGeneratedColumn({ 
        name:"roi_shape_id"
        })
    roi_shape_id:number;
        

    @Column("polygon",{ 
        nullable:true,
        default:"NULL",
        name:"path"
        })
    path:string | null;
        

   
    @OneToOne(type=>sign_char_roi, sign_char_roi=>sign_char_roi.roi_shape_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_char_roi:sign_char_roi | null;

}
