import DBLocal from 'db-local';
import crypto from "node:crypto"; 
import bcrypt from 'bcrypt'
const { Schema } = new DBLocal({ path:'src/models/db/'})

const User = Schema('User', {
    _id:{type:String, required: true},
    username:{type:String, required: true },
    password:{type:String, required:true},
    select:{type:String, required:true}
})
export class userRepository{
    static async create ({username, password, select1}) {
        Validation.username(username)
        Validation.password(password)

        

        const user = User.findOne({username})
        if (user) {
            throw new Error('Username already exists')
        }
    
        // Aquí no deberías comparar la contraseña con el valor en la base de datos
        // ya que estamos creando un nuevo usuario
    
        const id = crypto.randomUUID()
        const hashpass = await bcrypt.hash(password, 10)

        User.create({
            _id:id,
            username: username,
            password: hashpass,
            select: select1,
        }).save()

        return id

    }
    static async login ({username, password}) {
        Validation.username(username)
        Validation.password(password)
        
        const user = User.findOne({username})
        if (!user) throw new Error('username already exists')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('password is invalid')

            const { password: _, ...publicUser } = user
            return publicUser

    }

}


const ChatMessage = Schema('ChatMessage', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
});


export class chatRepository {
    static async saveMessage({ username, message }) {
        const msg = ChatMessage.create({
            _id: crypto.randomUUID(),
            username, 
            message,
            timestamp: new Date(),
        }).save();

        return msg;
    }

    static async getMessages() {
        const messages = await ChatMessage.find();
        return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
}
class Validation{
    static username(username){
        if(typeof username!== 'string') throw new Error('username must be a string')
        }
    static password(password){
        if(typeof password!== 'string') throw new Error('password must be a string')
        }
}