const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressMongoDb = require('express-mongo-db');

const app = express(); //Essa função importada da linha 1 cria um DAEMON, que está importando na rede.

//Use adiciona um recurso aquela a aplicação
app.use(expressMongoDb('mongodb://localhost/emails')); //Importada na linha 4 ele serve pra conectar o express e o mongo, e passa qual o endereço que está conectando. (localhost em e-mails.).
app.use(cors()); //Cors é CORS ORIGIN RESOURCE SHERE. Sem o cors voce pode ligar o backend e o front na mesma máquina, mas se estiverem em lugares diferentes você não poderá conectar. Quando você usa só o cors ela é publica, agora se quiser deixar privada coloca o nome e o IP para validar no CORS. Muitas vezes as API's prontas da internet dão problemas no cors.
app.use(bodyParser.json()); //Converter automaticamente o corpo de requisições (bodyParser) e respostas para JSON. TODAS as suas APIs utilizam o JSON terão que ter isso.
app.use(express.static('static')); //Express Static é onde irá atingir o front end e o static é o nome da pasta que está o arquivo front end.

/*A partir daqui começa a se verificas os end points, no caso faremos isso dos NOMES e EMAILS. O padrão é APP. MÉTODO DE HTTP. Utilizamos o padrão rest que so tem como metodo os GET (obter) POST (escrever) PUT () DELETE (apagar).

CRUD (Create (post) Read (get) Update (post) Delete (delete)) são funcionalidades que usam os metodos de HTTP entre parenteses, e para fazer a relação com o banco de dados ....*/

app.get('/emails', (req, res) => { //Primeiro parametro é um URI (/email), e o call back é requisição e resposta. Em req tem acesso ao que o front end enviou para você e o no res a resposta ddo backend.
    req.db.collection('cadastros').find({}).toArray((err, cadastros) => { //Só faz sentido por causa da linha 9. COLLECTION é um conjunto de documentos que fazem sentido juntos. A collection "cadastros" é do MONGO, se não tiver nenhuma lá ele criará uma com esse nome. FIND retorna uma sequencia de itens de uma coleção e o toArray transforma isso em um array de objetos para retornarmos para o front end(java script), além disso se passa um callback de (err, cadastro) (que no caso não esta passando nenhum erro)
        res.send(cadastros);//Esta enviando a linha de respostas
    });
});

app.get('/email/:nome', (req, res) => {

    //findOne -> só vai retornar o primeiro nome

    req.db.collection('cadastros').findOne({nome: req.params.nome}, (err, cadastro) => {
        return res.send(cadastro);
    });
});

app.post('/email/cadastrar', (req, res) => {
    if(!req.body.nome || !req.body.email){
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});

        //Quando da esse send o formato que ele está enviando é JSON, pois foi colocado que o bodyParser é JSON lá em cima.
    }

    req.db.collection('cadastros').insert(req.body, (err) => {
        if (err){
            console.log(err);
        }
        else{
            res.send({mensagem: 'Cadastro realizado com sucesso!'});
        }
    });
});

app.delete('/email/:nome'), (req, res) => {

    if(!req.params.nome){
        return res.status(400).send({mensagem: "Nome é obrigatório"});
    }
    req.db.collection('cadastros').deleteOne({nome: req.params.nome}, err => {

        if(err){
            console.log(err);
        }
        else{
            return res.send({mensagem: "Usuario removido com sucesso"});
        }
    });
}

//App listen indica o listen da aplicação.
app.listen(3000, () => console.log('Aplicação iniciada.'));