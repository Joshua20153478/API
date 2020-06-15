const mongoose = require('mongoose');
const express =require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


var urlencodedParser = bodyParser.urlencoded({ extended: false }, { useUnifiedTopology: true } );

app.use ('/assets', express.static(__dirname + '/public'));

mongoose.connect('mongodb+srv://user:user@cluster0-fpbsg.mongodb.net/Comida?retryWrites=true&w=majority');


app.listen(port, ()=>{
    console.log('Listening')
});
var Schema = mongoose.Schema;


var SchemaInfo = new Schema({
    name: String,
    size: String,
    ingrediente: String,
    queso: String,
    pan: String,
}); 


var Pizzas = mongoose.model('pizzas', SchemaInfo);

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    Pizzas.find(function (err, data) {
        if (err) {
          console.log("No encontrado");
        } else {
          res.render('index', { data });
        }
      });
    });



app.get('/agregar1', (req, res) => {
    res.render('agregar1');
    });
    app.get('/resultados', (req, res) => {
      res.render('resultados');
      });
    app.get('/index', (req, res) => {
        res.render('index');
        });
        app.get('/editar1/:id', (req, res) => {
          res.render('editar1');
          });

          app.delete('/eliminar', urlencodedParser, (req, res) => {
            Pizzas.findOneAndRemove({ name: req.body.name }, function (err, data) {
                if (err) 
                {
                  console.log('error')
                } else {
                  console.log({_id: req.body._id}, {data})
                    res.render('eliminadoBien')
                }
            });
        });

        app.put('/editar1/:id', urlencodedParser, (req, res) => {
            Pizzas.findOneAndUpdate({ name: req.body.name, size: req.body.size }, function (err, data) {
                if (err) 
                {
                  console.log('error')
                } else {
                    res.render('editar1', { data });
                }
            });
        });

        app.post('/agregar1', urlencodedParser, (req, res) => {
                Pizzas.find({ name: req.body.name }, function (err, data) {
                    if (err) 
                    {
                      console.log('error')
                    } 
                    else {
                      if (data.length > 0) 
                      {
                        res.render("yaRegistrado");
                      }
                      else {
                        var Comida = Pizzas({
                          name: req.body.name,
                          size: req.body.size,
                          ingrediente: req.body.ingrediente,
                          queso: req.body.queso,
                          pan: req.body.pan
                        });
                        Comida.save((err) => {
                          if (err) {
                            console.log("algo salió mal");
                          } else {
                            Pizzas.find({ name: req.body.name }, function (err, data) {
                                if (err) {
                                  console.log("No encontrado");
                                } else {
                                  res.render('resultados', { data });
                                }
                              });
                          }
                        });
                      }
                    }
                  });
                });

       app.get('/buscar1', (req, res) => {
        res.render('buscar1');
        });
    app.post('/buscar1', urlencodedParser, (req, res) => {
            Pizzas.find({ name: req.body.name, size: req.body.size }, function (err, data) {
                if (err) {
                    res.render('noEncontrado');
                } else {
                    res.render('index', { data });
                }
            });
        });