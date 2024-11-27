import express from 'express'
import { PORT } from './src/config/config.js' 
import { userRepository, chatRepository } from './src/repository/user-repository.js'
import path from 'path';
import { Server } from 'socket.io'
import { createServer } from 'node:http';

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
app.get('/', (req, res) =>{
    res.sendFile(path.join(process.cwd(), 'views','index.html'));
})


app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views','login.html'));;
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views','registro.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views','chat.html'));
});
// En el archivo index.js (o el que gestiona los sockets)


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
app.post('/logout', (req, res) =>{})
app.post('/protected', (req, res) =>{})

server.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})