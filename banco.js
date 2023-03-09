window.addEventListener('load', carregado);

var db = openDatabase('cadastroDeProduto', '1.0', "Cadastro de produtos", 2 * 1024 * 1024);

db.transaction(function(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY, nome TEXT, descricao TEXT, preco NUMBER, estoque INTEGER, data_exclusao DATE)");
})

function carregado(){
    listar();
}


function salvar(){
    var nome = document.getElementById('nome').value;
    var descricao = document.getElementById('descricao').value;
    var preco = document.getElementById('preco').value;
    var estoque = document.getElementById('estoque').value;
    var id = document.getElementById('id').value; 
    if(id){
        db.transaction(function(tx){
            tx.executeSql("UPDATE produto SET nome = ?, descricao =?, preco = ?, estoque = ? where id = ?", [nome, descricao, preco, estoque, id]);
        })
    } else {
        db.transaction(function(tx){
            tx.executeSql("INSERT INTO produto (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)", [nome, descricao, preco, estoque]);
        })
    }
    listar();
};

function listar(){
    var tabela = document.getElementById('listaAgenda')

    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM produto p WHERE p.data_exclusao IS NULL", [], (err, resultado) =>{
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                tr += '<tr>';
                tr += '<td align="center" onClick="return atualizar(' + rows[i].id + ')"><img src="edit.png" width = 20 height = 20></td>'
                tr += '<td align="center" onClick="return excluir(' + rows[i].id + ')"><img src="remove.png" width = 20 height = 20></td>'
                tr += '<td align="center">' + rows[i].nome + '</td>';
                tr += '<td align="center">' + rows[i].descricao + '</td>';
                tr += '<td align="center">' + rows[i].preco + '</td>';
                tr += '<td align="center">' + rows[i].estoque + '</td>';
                tr += '</tr>';
            }
            tabela.innerHTML = tr;
            
        }, null)
    })
    var nome = document.getElementById('nome').value = '';
    var descricao = document.getElementById('descricao').value = '';
    var preco = document.getElementById('preco').value = '';
    var estoque = document.getElementById('estoque').value = '';
}

function atualizar(_id){
    var id = document.getElementById('id');
    var nome = document.getElementById('nome');
    var descricao = document.getElementById('descricao');
    var preco = document.getElementById('preco');
    var estoque = document.getElementById('estoque');
    id.value = _id;
    db.transaction(function(tx){
        console.log(_id)
        tx.executeSql('SELECT * FROM produto p WHERE p.id = ?', [_id], function(tx, resultado){
            var rows = resultado.rows[0];
            nome.value = rows.nome;
            descricao.value = rows.descricao;
            preco.value = rows.preco;
            estoque.value = rows.estoque;
        })
    })
}


function excluir(_id){
    db.transaction(function(tx){
        console.log(id);
        var data = new Date();
        var dia = String(data.getDate()).padStart(2, '0');
        var mes = String(data.getMonth() + 1).padStart(2, '0');
        var ano = data.getFullYear();
        var dataAtual = dia + '/' + mes + '/' + ano; 
        tx.executeSql('UPDATE produto SET data_exclusao = ? WHERE id = ? ', [dataAtual, _id]);
    })
    listar()
}
