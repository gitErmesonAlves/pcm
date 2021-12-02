class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for (let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if (despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)


	if (despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'text-success'

		//dialog de sucesso
		$('#exampleModal').modal('show')
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'text-danger'

		//dialog de erro
		$('#exampleModal').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}


	/*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaDespesas = document.getElementById("listaDespesas")
	listaDespesas.innerHTML = ''
	despesas.forEach(function (d) {

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		//Ajustar o tipo
		switch (d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			case '6': d.tipo = 'Outros'
				break

		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao

		let div = document.createElement('div')
		div.className = 'text-muted'
		let valor_number = parseFloat(d.valor)
		div.innerHTML = `<span>R$ ${valor_number},00</span>`
		linha.insertCell(3).append(div)
		console.log(valor_number)


		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function () {
			let id = this.id.replace('id_despesa_', '')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(d)
	})

}

// $(function(){ 
// 	$("#filtro").keyup(function( event ){
// 	  var texto = $(this).val();
	  
// 	  $(".bloco").each(function(){
// 		var resultado = $(this).text().toUpperCase().indexOf(' '+texto.toUpperCase());
		
// 		if(resultado < 0) {
// 		  $(this).fadeOut();
// 		}else {
// 		  $(this).fadeIn();
// 		}
// 	  }); 
  
// 	});
  
//   });



function pesquisarDespesa() {

	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	this.carregaListaDespesas(despesas, true)

}

function AdicionarFiltro(tabela, coluna) {
    var cols = $("#" + tabela + " thead tr:first-child th").length;
    if ($("#" + tabela + " thead tr").length == 1) {
        var linhaFiltro = "<tr>";
        for (var i = 0; i < cols; i++) {
            linhaFiltro += "<th></th>";
        }
        linhaFiltro += "</tr>";
 
        $("#" + tabela + " thead").append(linhaFiltro);
    }
 
    var colFiltrar = $("#" + tabela + " thead tr:nth-child(2) th:nth-child(" + coluna + ")");
 
    $(colFiltrar).html("<select class='tr_filter' id='filtroColuna_" + coluna.toString() + "'  class='filtroColuna'> </select>");
 
    var valores = new Array();
 
    $("#" + tabela + " tbody tr").each(function () {
        var txt = $(this).children("td:nth-child(" + coluna + ")").text();
        if (valores.indexOf(txt) < 0) {
            valores.push(txt);
        }
    });
    $("#filtroColuna_" + coluna.toString()).append("<option>TODOS</option>")
    for (elemento in valores) {
        $("#filtroColuna_" + coluna.toString()).append("<option>" + valores[elemento] + "</option>");
    }
 
    $("#filtroColuna_" + coluna.toString()).change(function () {
        var filtro = $(this).val();
        $("#" + tabela + " tbody tr").show();
        if (filtro != "TODOS") {
            $("#" + tabela + " tbody tr").each(function () {
                var txt = $(this).children("td:nth-child(" + coluna + ")").text();
                if (txt != filtro) {
                    $(this).hide();
                }
            });
        }
    });
 
};

