const express = require('express');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());  // Enable CORS for all routes el cors es: un mecanismo que permite que los recursos de una página web sean solicitados desde otro dominio distinto al que sirve la página. Esto es útil para permitir que tu frontend (que podría estar en un dominio diferente) pueda comunicarse con tu backend sin problemas de seguridad relacionados con el mismo origen.    

// cors para un frontend en localhost:3001 y backend en localhost:3000  
// app.use(cors({
//   origin: 'http://localhost:3001', // Reemplaza con la URL de tu frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
//   allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
// }));




app.use(express.json());



let todos = [
    { id: 1, title: 'leche', completed: false },
    { id: 2, title: 'pan', completed: false },
    { id: 3, title: 'Tomate', completed: false }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
    // console.log('Received a GET request at /');
});


app.get('/todos', (req, res) => {
    res.json({
        status: 200,
        message: 'lista de todos',
        data: todos
    });
    // console.log('Received a GET request at /todos');
});


app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        res.json({
            status: 200,
            message: 'todo encontrado',
            data: todo
        });
    } else {
        res.status(404).json({ status: 404, message: 'todo no encontrado' });
    }

});

// crear un nuevo todo
app.post('/todos', (req, res) => {
    // validar si viene el body
    if (!req.body) {
        return res.status(400).json({ status: 400, message: 'body is required' });
    }


    const { title } = req.body;
    if (title) {
        const newTodo = {
            id: todos.length + 1, 
            title,
            completed: false
        };
        todos.push(newTodo);
        res.status(201).json({
            status: 201,
            message: 'todo creado',
            data: newTodo
        });
    } else {
        res.status(400).json({ status: 400, message: 'title is required' });
    }
}); 

// actualizar un todo
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ status: 404, message: 'todo no encontrado' });
    }

    const { title, completed } = req.body;
    if (title !== undefined) {
        todo.title = title;
    }
    if (completed !== undefined) {
        todo.completed = completed;
    }

    res.json({
        status: 200,
        message: 'todo actualizado',
        data: todo
    });
});

// patch actualizar parcialmente un todo
app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ status: 404, message: 'todo no encontrado' });
    }

    const { title, completed } = req.body;
    if (title !== undefined) {
        todo.title = title;
    }
    if (completed !== undefined) {
        todo.completed = completed;
    }

    res.json({
        status: 200,
        message: 'todo actualizado parcialmente',
        data: todo
    });
});

// eliminar un todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
        const deletedTodo = todos.splice(index, 1)[0];
        res.json({ status: 200, message: 'todo eliminado', data: deletedTodo });
    } else {
        res.status(404).json({ status: 404, message: 'todo no encontrado' });
    }
});








app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});






