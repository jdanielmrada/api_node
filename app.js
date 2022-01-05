const express = require('express');
const express_ = require('express');

const { json } = require('express/lib/response');

const mysql_ = require('mysql');

const cors = require('cors');

const app = express_();
app.use(express.json());
app.use(cors());

// Conexion
const conexion = mysql_.createConnection({
    host: '127.0.0.1',
    user: 'BD',
    password: '',
    database: 'node_article'
})

conexion.connect((error) => {
    (error) ? console.log(error) : console.log('Conectado...');
});

// Routes
app.get('/', (req, res) => {
    res.send('Ruta de inicio');
});

app.get('/api/articles', (req, res) => {
    conexion.query('SELECT * FROM articles', (error, filas) => {
        (error) ? console.log(error) : res.send(filas);
    });
});

app.get('/api/articles/:id', (req, res) => {
    conexion.query('SELECT * FROM articles WHERE id = ? ', [req.params.id], (error, fila) => {
        (error) ? console.log(error) : res.send(fila);
    });
});

app.post('/api/articles', (req, res) => {
    let sql = "INSERT INTO articles SET ?";
    let data = {
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
    }
    conexion.query(sql, data, (error, results) => {
        (error) ? console.log(error) : res.send(results);
    });
});

app.put('/api/articles/:id', (req, res) => {
    let id = req.params.id,
        description = req.body.description,
        price = req.body.price,
        stock = req.body.stock,
        sql = "UPDATE articles SET description = ?, price = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [description, price, stock, id], (error, results) => {
        (error) ? console.log(error) : res.send(results);
    })

})

app.delete('/api/articles/:id', (req, res) => {
    conexion.query('DELETE FROM articles WHERE id = ?', [req.params.id], (error, filas) => {
        (error) ? console.log(error) : res.send(filas);
    });
})
// Puertos
let puerto = process.env.PUERTO || 3000; //Si no esta definido 3000

app.listen(puerto, () => {
    console.log("Servidor Ok, puerto:" + puerto);
});
