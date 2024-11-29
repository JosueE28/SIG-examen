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

const Internship = Schema('Internship', {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    benefits: { type: String },
    applyLink: { type: String },
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
const Curriculum = Schema('Curriculum', {
    _id: { type: String, required: true, default: () => crypto.randomUUID() },  // Usar crypto.randomUUID para generar el ID
    name: { type: String },
    email: { type: String },
    telefono: { type: String },
    ubicacion: { type: String },
    perfil: { type: String },
    experience: { type: Array },
    education: { type: String },
    skills: { type: Array },
});


export class curriculumRepository {
    static async getCurriculum() {
        try {
            
            const curriculums = await Curriculum.find(); 

            return curriculums;
        } catch (error) {
            throw new Error('Error al obtener los currículums');
        }
    }
    static async saveCurriculum(data = {}) {
        const {
            name,
            email,
            telefono,
            ubicacion,
            perfil,
            experience,
            education,
            skills
        } = data;
    
        try {
            if (!name) {
                throw new Error('El nombre es obligatorio para actualizar un currículum');
            }
    
            console.log('Datos a actualizar:', data);
    
            // Buscar el currículum existente por nombre
            const existingCurriculum = await Curriculum.findOne({ name });
            console.log('Currículum existente:', existingCurriculum);
    
            if (existingCurriculum) {
                // Actualizar el currículum existente
                existingCurriculum.email = email || existingCurriculum.email;
                existingCurriculum.telefono = telefono || existingCurriculum.telefono;
                existingCurriculum.ubicacion = ubicacion || existingCurriculum.ubicacion;
                existingCurriculum.perfil = perfil || existingCurriculum.perfil;
                existingCurriculum.experience = experience || existingCurriculum.experience;
                existingCurriculum.education = education || existingCurriculum.education;
                existingCurriculum.skills = skills || existingCurriculum.skills;
    
                await existingCurriculum.save();
                console.log('Currículum actualizado:', existingCurriculum);
                return existingCurriculum;
            } else {
                // Si no existe, devolver un error
                throw new Error(`No se encontró un currículum con el nombre: ${name}`);
            }
        } catch (error) {
            console.error('Error al actualizar el currículum:', error);
            throw new Error('Error al actualizar el currículum');
        }
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
export { Internship, Curriculum };