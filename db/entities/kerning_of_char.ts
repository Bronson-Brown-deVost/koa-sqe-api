import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {char_of_writing} from "./char_of_writing";


@Entity("kerning_of_char",{schema:"SQE_DEV"})
export class kerning_of_char {

    @Column("smallint",{ 
        nullable:false,
        default:"0",
        name:"kerning"
        })
    kerning:number;
        

    @Column("char",{ 
        nullable:false,
        primary:true,
        length:1,
        name:"previous_char"
        })
    previous_char:string;
        

   
    @OneToOne(type=>char_of_writing, char_of_writing=>char_of_writing.kerning_of_char,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'chars_of_writing_char_of_writing_id'})
    chars_of_writing_char_of_writing_:char_of_writing | null;

}
