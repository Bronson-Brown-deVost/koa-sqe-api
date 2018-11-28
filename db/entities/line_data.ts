import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {line} from "./line";
import {scroll_version} from "./scroll_version";


@Entity("line_data",{schema:"SQE_DEV"})
@Index("fk_line_data_to_line_idx",["line_",])
export class line_data {

    @PrimaryGeneratedColumn({ 
        name:"line_data_id"
        })
    line_data_id:number;
        

   
    @OneToOne(type=>line, line=>line.line_data,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'line_id'})
    line_:line | null;


    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"'NULL'",
        name:"name"
        })
    name:string | null;
        

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.line_datas,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
