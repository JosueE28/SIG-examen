import express from 'express'
import { PORT } from './src/config/config.js' 
import { userRepository, chatRepository,Internship } from './src/repository/user-repository.js'
import path from 'path';
import { Server } from 'socket.io'
import { createServer } from 'node:http';
import bcrypt from 'bcrypt'
import crypto from 'crypto'; // Importación del módulo crypto


const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery:{

    }
})




io.on('connection', async (socket)=>{
    console.log('te conectaste')

    
    try {
        const messages = await chatRepository.getMessages();
        socket.emit('chat history', messages); 
    } catch (error) {
        console.error('Error al obtener el historial de mensajes:', error);
        socket.emit('error', 'No se pudo cargar el historial de mensajes.');
    }



    socket.on('set username', (username) => {
        if (!username) {
            console.error('Username no proporcionado por el cliente.');
            socket.emit('error', 'Debe proporcionar un nombre de usuario.');
            return;
        }
        socket.username = username;
        console.log('Username recibido:', username);
    });

    socket.on('chat message', async ({ username, message }) => {
        if (!username || !message) {
            socket.emit('error', 'Nombre de usuario o mensaje no proporcionado.');
            return;
        }
    
        try {
            const savedMessage = await chatRepository.saveMessage({ username, message });
            io.emit('chat message', savedMessage); 
        } catch (error) {
            socket.emit('error', 'Error al guardar el mensaje.');
            console.error('Error guardando el mensaje:', error);
        }
    });
 
    

})



app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'views')));

app.use(express.static(process.cwd())); 
app.get('/index', (req, res) =>{
    res.sendFile(path.join(process.cwd(), 'views', 'estudiante','index.html'));
})
app.get('/indexempresa', (req, res) =>{
    res.sendFile(path.join(process.cwd(), 'views', 'empresa','indexempresa.html'));
})


app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views','login.html'));;
});

app.get('/curriculumvista', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'estudiante', 'curriculumvista.html'));;
});

app.get('/crearpasantia', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'empresa', 'crearpasantia.html'));;
});




app.get('/register', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views','registro.html'));
});

app.get('/chat2', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'empresa', 'chat2.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'estudiante','chat.html'));
});


app.post('/login', async (req, res) =>{
    const { username, password } = req.body 

    try{
        const user = await userRepository.login({username, password})
        res.send({user})


    }catch(error){
        res.status(401).send(error.message)

    }
})


app.post('/register', async (req, res) => {
    const { username, password, select } = req.body 
    let select1;

    if (select == 1) {
        select1 = 'empresa';
    } else if (select == 2) {
        select1 = 'estudiante';
    }
    try{
        const id = await userRepository.create({username, password, select1})

        res.send({id})

    }catch(error){
        res.status(400).send(error.message)
    }
})




app.post('/saveInternship', async (req, res) => {
    const { title, company, location, duration, description, requirements, benefits, applyLink } = req.body;

    try {
        const newInternship = await Internship.create({
            _id: crypto.randomUUID(),
            title,
            company,
            location,
            duration,
            description,
            requirements,
            benefits,
            applyLink,
        });
        await newInternship.save();
        res.status(201).send(newInternship);

        res.status(201).send(newInternship);
    } catch (error) {
        console.error('Error al guardar la pasantía:', error);
        res.status(500).send('Error al guardar la pasantía.');
    }
});

app.get('/internships', async (req, res) => {
    try {
        const internships = await Internship.find();
        res.send(internships);
    } catch (error) {
        console.error('Error al obtener pasantías:', error);
        res.status(500).send('Error al obtener pasantías.');
    }
});

app.put('/updateInternship/:id', async (req, res) => {
    const { title, company, location, duration, description, requirements, benefits, applyLink } = req.body;
    const { id } = req.params; 

    try {
        const internship = await Internship.findOne({ _id: id });

        if (!internship) {
            return res.status(404).send('Pasantía no encontrada');
        }

        internship.title = title || internship.title;
        internship.company = company || internship.company;
        internship.location = location || internship.location;
        internship.duration = duration || internship.duration;
        internship.description = description || internship.description;
        internship.requirements = requirements || internship.requirements;
        internship.benefits = benefits || internship.benefits;
        internship.applyLink = applyLink || internship.applyLink;

        await internship.save();

        res.send(internship);
    } catch (error) {
        console.error('Error al actualizar la pasantía:', error);
        res.status(500).send('Error al actualizar la pasantía.');
    }
});
app.post('/logout', (req, res) =>{})
app.post('/protected', (req, res) =>{})

server.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})