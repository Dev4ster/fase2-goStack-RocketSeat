const express = require('express');

const server = express();

/* o
    o express tem várias formas de receber informacões como corpo da requisição uma delas é o json
    como a requisição está enviando um json é preciso dizer isso pro express.
*/

server.use(express.json());// fala pro express ler json agora // isso aqui é uma middleware


/*
*TRÊS TIPOS DE PARÂMETROS:
! QUERY PARAMS  => teste?=1 | req.query.teste
? ROUTE PARAMS => /users/1  | req.params.id
* REQUEST BODY => (POST, PUT) = {"NOME":"VICTOR"}

CRUD: CREATE, READ, UPDATE, DELETE

*/

const users = ["victor", "vetor", "teves"];

//*MIDDLEWARES

server.use((req, res, next) =>{
    console.time('Request');
	console.log(`Método: ${req.method}; URL: ${req.url}`);
	next();
	console.timeEnd('Request');
})

//*middleware que verifica se o usuário existe

function checkUserExist(req , res, next) {
    console.log(req.body.nome);
    console.log(!req.body.nome);
    console.log(!!req.body.nome);
    if(!req.body.nome){
        return res.status(400).json({error: "user not found"});
    }
    return next();
}

//* middleware que verifica se o user está presente no array

function checkUserInArray(req, res, next){
    const { id } = req.params;
    const user = users[id];
    if(! users[id]){
        return res.status(400).json({error: "user not exist in array"});
    }
    req.user = user;
    return next();
}

//*usuário por :id
server.get('/users/:id',checkUserInArray, (req, res)=>{
    res.json(req.user);
})

//*listagem de usuários
server.get('/users', (req, res) =>{
    res.json(users);
})

//*cadastro de usuário
server.post('/users',checkUserExist, (req, res) =>{
    const { nome } = req.body;
    users.push(nome);
    res.json(users);
})

//* edição de usuário

server.put('/users/:id',checkUserExist, (req, res) =>{
    const { id } = req.params;
    const { nome } = req.body;
    users[id] = nome;
    res.json(users[id]);
});


//*deletar usuário

server.delete('/users/:id', checkUserInArray, (req,  res) => {
    const { id } = req.params;
    users.splice(id, 1); // delete users[id]; -> se usar isso n apaga só fica null
    res.send();
})

server.listen(3000)