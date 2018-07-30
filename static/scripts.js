let campoNome = document.querySelector('#nome');
let campoEmail = document.querySelector('#email');
let botao = document.querySelector('button');
let lista = document.querySelector('ul');

function apagarItem(){

    let texto = this.previousElementSibling.innerHTML; //Colocou o innerHTML pois ele pega só o texto, mas só quero o nome.
    let nome = texto.split("-")[0];

    fetch(`http://localhost:3000/email/${nome.trim()}`,{
        method: 'DELETE'}).then(() => {
        carregar(); //Após apagar recarrega a página.
    })
}

botao.addEventListener('click', () => {
    let cadastro = {
        
        //Coloca o nome na variável nome (o mesmo com email)
        nome: campoNome.value,
        email: campoEmail.value
    }
    
    //Esvaziar os campos no HTML:
    
    campoNome.value = '';
    campoEmail.value = '';
    
    //Padrão exemplo de FETCH que sempre é utilizado
    
    fetch('http://localhost:3000/email/cadastrar', {
    method: 'POST', //Para o get não precisa preencher tudo isso aqui.
    body: JSON.stringify(cadastro),
    headers: {
        'Content-type': 'application/json'
    }
}).then(() => {
    carregar();   //Serve para atualizar os dados automaticamente
});
});

//Função carregar: está fazendo um fetch também. Mas como está fazendo com GET não precisa de todo aquele texto.

// ACESSA LOCAL HOST ACESSA O JSON LIMPA A TELA PARA CADA CADASTRO DA LISTA DE CADASTRO ELA MONTATELA AQUELE CADASTRO.
function montarTela(cadastro){
    let entrada = document.createElement('li'); //Cria um elemento LINHA
    let texto = document.createElement('span');
    texto.innerHTML = `${cadastro.nome} - ${cadastro.email}`;
    let botao = document.createElement('button');
    botao.innerHTML = "Apagar"; //Cria BOTAO
    botao.addEventListener('click', apagarItem);
    
    entrada.appendChild(texto);
    entrada.appendChild(botao);
    lista.appendChild(entrada); //Acrescenta o elemento na lista de filhos.
}


function carregar(){
    fetch('http://localhost:3000/emails').then(resposta => {
    return resposta.json();
}).then(cadastros => {
    
    lista.innerHTML = ''; //Limpa a lista para não ficar escrevendo todos os blocos de código novamente.
    
    for(let cadastro of cadastros){
        montarTela(cadastro); 
    }
});
}


carregar();
