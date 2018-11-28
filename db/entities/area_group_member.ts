import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {area_group} from "./area_group";


@Entity("area_group_member",{schema:"SQE_DEV"})
export class area_group_member {

   
    @OneToOne(type=>area_group, area_group=>area_group.area_group_member,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'area_group_id'})
    area_group_:area_group | null;


    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"area_id"
        })
    area_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"NULL",
        name:"area_type"
        })
    area_type:string | null;
        
}
