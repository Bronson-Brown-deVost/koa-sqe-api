import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {line_to_sign} from "./line_to_sign";
import {position_in_stream} from "./position_in_stream";
import {sign_char} from "./sign_char";


@Entity("sign",{schema:"SQE_DEV"})
export class sign {

    @PrimaryGeneratedColumn({ 
        name:"sign_id"
        })
    sign_id:number;
        

   
    @OneToOne(type=>line_to_sign, line_to_sign=>line_to_sign.sign_,{ onDelete: 'CASCADE' ,onUpdate: 'NO ACTION' })
    line_to_sign:line_to_sign | null;


   
    @OneToOne(type=>position_in_stream, position_in_stream=>position_in_stream.next_sign_,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    position_in_stream:position_in_stream | null;


   
    @OneToOne(type=>position_in_stream, position_in_stream=>position_in_stream.sign_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    position_in_stream2:position_in_stream | null;


   
    @OneToMany(type=>sign_char, sign_char=>sign_char.sign_,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    sign_chars:sign_char[];
    
}
