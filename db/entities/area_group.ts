import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {area_group_member} from "./area_group_member";
import {scroll_version} from "./scroll_version";

interface moveDirectionSet {x: number, y: number}

@Entity("area_group",{schema:"SQE_DEV"})
export class area_group {

    @Column("int",{ 
        nullable:false,
        primary:true,
        name:"area_group_id"
        })
    area_group_id:number;
        

    @Column("int",{ 
        nullable:false,
        name:"area_id"
        })
    area_id:number;
        
    // TypeORM lacks the correct datatype "set"
    // Not sure how to fix this, but I don't know if we will use this table.
    @Column("varchar",{ 
        nullable:false,
        default:"''",
        name:"move_direction"
        })
    move_direction: moveDirectionSet;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"NULL",
        name:"name"
        })
    name:string | null;
        

    @Column("text",{ 
        nullable:true,
        default:"NULL",
        name:"commentary"
        })
    commentary:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        default:"NULL",
        name:"z_index"
        })
    z_index:number | null;
        

   
    @OneToOne(type=>area_group_member, area_group_member=>area_group_member.area_group_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    area_group_member:area_group_member | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.area_groups,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
