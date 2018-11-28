import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {sign} from "./sign";
import {position_in_stream_to_word_rel} from "./position_in_stream_to_word_rel";
import {scroll_version} from "./scroll_version";


@Entity("position_in_stream",{schema:"SQE_DEV"})
@Index("sign_next",["sign_","next_sign_",],{unique:true})
@Index("position_in_stream_next_sign_id_IDX",["sign_",])
@Index("fk_next_to_sign",["next_sign_",])
export class position_in_stream {

    @PrimaryGeneratedColumn({ 
        name:"position_in_stream_id"
        })
    position_in_stream_id:number;
        

   
    @OneToOne(type=>sign, sign=>sign.position_in_stream2,{  nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'sign_id'})
    sign_:sign | null;


   
    @OneToOne(type=>sign, sign=>sign.position_in_stream,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'next_sign_id'})
    next_sign_:sign | null;


   
    @OneToOne(type=>position_in_stream_to_word_rel, position_in_stream_to_word_rel=>position_in_stream_to_word_rel.position_in_stream_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    position_in_stream_to_word_rel:position_in_stream_to_word_rel | null;


   
    @ManyToMany(type=>scroll_version, scroll_version=>scroll_version.position_in_streams,{  nullable:false, })
    @JoinTable()
    scroll_versions:scroll_version[];
    
}
