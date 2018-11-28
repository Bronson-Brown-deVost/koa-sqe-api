import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {position_in_stream_to_word_rel} from "./position_in_stream_to_word_rel";
import {scroll_version} from "./scroll_version";


@Entity("word",{schema:"SQE_DEV"})
@Index("old_word_idx",["qwb_word_id",])
export class word {

    @PrimaryGeneratedColumn({ 
        name:"word_id"
        })
    word_id:number;
        

    @Column("int",{ 
        nullable:true,
        default:"NULL",
        name:"qwb_word_id"
        })
    qwb_word_id:number | null;
        

    @Column("text",{ 
        nullable:true,
        default:"NULL",
        name:"commentary"
        })
    commentary:string | null;
        

   
    @OneToOne(type=>position_in_stream_to_word_rel, position_in_stream_to_word_rel=>position_in_stream_to_word_rel.word_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    position_in_stream_to_word_rel:position_in_stream_to_word_rel | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.words,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
