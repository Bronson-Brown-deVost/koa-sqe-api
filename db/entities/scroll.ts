import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {edition_catalog} from "./edition_catalog";
import {scroll_data} from "./scroll_data";
import {scroll_to_col} from "./scroll_to_col";
import {scroll_version_group} from "./scroll_version_group";


@Entity("scroll",{schema:"SQE_DEV"})
export class scroll {

    @PrimaryGeneratedColumn({ 
        name:"scroll_id"
        })
    scroll_id:number;
        

   
    @OneToMany(type=>edition_catalog, edition_catalog=>edition_catalog.scroll_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    edition_catalogs:edition_catalog[];
    

   
    @OneToMany(type=>scroll_data, scroll_data=>scroll_data.scroll_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    scroll_datas:scroll_data[];
    

   
    @OneToOne(type=>scroll_to_col, scroll_to_col=>scroll_to_col.scroll_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    scroll_to_col:scroll_to_col | null;


   
    @OneToMany(type=>scroll_version_group, scroll_version_group=>scroll_version_group.scroll_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    scroll_version_groups:scroll_version_group[];
    
}
