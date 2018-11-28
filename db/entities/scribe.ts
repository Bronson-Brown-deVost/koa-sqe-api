import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {form_of_writing} from "./form_of_writing";
import {scroll_version} from "./scroll_version";


@Entity("scribe",{schema:"SQE_DEV"})
export class scribe {

    @PrimaryGeneratedColumn({ 
        name:"scribe_id"
        })
    scribe_id:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        default:"NULL",
        name:"description"
        })
    description:string | null;
        

    @Column("text",{ 
        nullable:true,
        default:"NULL",
        name:"commetary"
        })
    commetary:string | null;
        

   
    @OneToMany(type=>form_of_writing, form_of_writing=>form_of_writing.scribes_scribe_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    form_of_writings:form_of_writing[];
    

   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.scribes,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
