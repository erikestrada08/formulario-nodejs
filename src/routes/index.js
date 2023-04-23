const { Router } = require('express');
const router = Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const json_usuarios = fs.readFileSync('src/data.json', 'utf-8');
let usuarios = JSON.parse(json_usuarios);
const { body, validationResult } = require('express-validator');


router.get('/', (req, res) => {
    res.render('nuevo-registro.ejs');
})

//esta ruta es por defecto y renderiza la pagina con los usuarios listados
router.get('/index', (req, res) => {
    res.render('index.ejs', {
        usuarios
    });
})

router.post('/', [
    body('nombre', 'Ingrese nombre válido')
        .exists()
        .isLength({ min: 3 }),
    body('cedula', 'Ingrese una cédula válida')
        .exists()
        .isLength({ min: 8 })
        .isNumeric(),
    body('telefono', 'Ingrese un teléfono válido')
        .exists()
        .isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(req.body);
        // const valores = req.body;
        const validaciones = errors.array();
        console.log(validaciones);
        res.render('nuevo-registro.ejs',{validaciones:validaciones})
    }else{
        const { nombre, cedula, telefono } = req.body;
        if (!nombre || !cedula || !telefono) {
            res.status(400).send('Todos los campos son requeridos');
            return;//este codigo no es tan necesario ya que el formulario requiere este dato, sin embargo es mejor requerirlos desde el backend tambien
        }
        let nuevoUsuario = {
            id: uuidv4(),
            nombre,
            cedula,
            telefono
        }
        usuarios.push(nuevoUsuario);
    
        const json_usuarios = JSON.stringify(usuarios);
        fs.writeFileSync('src/data.json', json_usuarios, 'utf-8');    
        res.redirect('/');  
    }
})

router.get('/delete/:id', (req, res) => {
    usuarios = usuarios.filter(usuario => usuario.id != req.params.id);
    const json_usuarios = JSON.stringify(usuarios);
    fs.writeFileSync('src/data.json', json_usuarios, 'utf-8');
    res.redirect('/index');
})

router.get('/privacy',(req, res) => {
    res.render('politica-privacidad');
})

module.exports = router;