import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {position_in_stream} from "./position_in_stream";
import {word} from "./word";


@Entity("position_in_stream_to_word_rel",{schema:"SQE_DEV"})
@Index("fk_sign_stream_has_words_sign_stream1_idx",["position_in_stream_",])
@Index("fk_rel_to_word_idx",["word_",])
export class position_in_stream_to_word_rel {

   
    @OneToOne(type=>position_in_stream, position_in_stream=>position_in_stream.position_in_stream_to_word_rel,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'position_in_stream_id'})
    position_in_stream_:position_in_stream | null;


   
    @OneToOne(type=>word, word=>word.position_in_stream_to_word_rel,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'word_id'})
    word_:word | null;


    @Column("tinyint",{ 
        nullable:true,
        default:"NULL",
        name:"position_in_word"
        })
    position_in_word:number | null;
        
}
