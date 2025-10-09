var chave_armazenamento = 'listas_tarefas_v1'

var tarefas = carregarDoLocalStorage()
atualizarTela()

function salvarNoLocalStorage() {
  localStorage.setItem(chave_armazenamento, JSON.stringify(tarefas))
}

function carregarDoLocalStorage() {
  var dadosSalvos = localStorage.getItem(chave_armazenamento)
  if (!dadosSalvos) return []
  return JSON.parse(dadosSalvos)
}

document.getElementById('formulario-adicionar').addEventListener('submit', function(e) {
  e.preventDefault()
  var campo = document.getElementById('entrada-tarefa')
  var texto = campo.value.trim()
  if (texto !== '') {
    adicionarTarefa(texto)
    campo.value = ''
  }
})

function adicionarTarefa(texto) {
  var novaTarefa = {
    id: Date.now().toString(),
    texto: texto,
    feita: false,
    criadaEm: new Date().toISOString()
  }
  tarefas.push(novaTarefa)
  salvarNoLocalStorage()
  atualizarTela()
}

function atualizarTela() {
  var areaLista = document.getElementById('lista-tarefas')
  areaLista.innerHTML = ''

  var tarefasFiltradas = filtrarTarefas()

  for (var i = 0; i < tarefasFiltradas.length; i++) {
    var t = tarefasFiltradas[i]

    var linha = document.createElement('div')
    linha.className = 'tarefa'

    var ladoEsquerdo = document.createElement('div')
    ladoEsquerdo.className = 'lado-esquerdo'

    var checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = t.feita
    checkbox.addEventListener('change', function(id) {
      return function() {
        alternarConclusao(id)
      }
    }(t.id))

    var textoTarefa = document.createElement('span')
    textoTarefa.textContent = t.texto
    if (t.feita) textoTarefa.className = 'concluida'

    ladoEsquerdo.appendChild(checkbox)
    ladoEsquerdo.appendChild(textoTarefa)

    var ladoDireito = document.createElement('div')

    var botaoEditar = document.createElement('button')
    botaoEditar.textContent = 'Editar'
    botaoEditar.className = 'botao-editar'
    botaoEditar.addEventListener('click', function(id, texto) {
      return function() {
        var novoTexto = prompt('Editar tarefa:', texto)
        if (novoTexto) editarTarefa(id, novoTexto)
      }
    }(t.id, t.texto))

    var botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = 'Excluir'
    botaoExcluir.className = 'botao-editar'
    botaoExcluir.addEventListener('click', function(id) {
      return function() {
        removerTarefa(id)
      }
    }(t.id))

    ladoDireito.appendChild(botaoEditar)
    ladoDireito.appendChild(botaoExcluir)

    linha.appendChild(ladoEsquerdo)
    linha.appendChild(ladoDireito)

    areaLista.appendChild(linha)
  }
}

function editarTarefa(id, novoTexto) {
  for (var i = 0; i < tarefas.length; i++) {
    if (tarefas[i].id === id) {
      tarefas[i].texto = novoTexto
      salvarNoLocalStorage()
      atualizarTela()
      return
    }
  }
}

function removerTarefa(id) {
  tarefas = tarefas.filter(function(tarefa) {
    return tarefa.id !== id
  })
  salvarNoLocalStorage()
  atualizarTela()
}

function alternarConclusao(id) {
  for (var i = 0; i < tarefas.length; i++) {
    if (tarefas[i].id === id) {
      tarefas[i].feita = !tarefas[i].feita
      salvarNoLocalStorage()
      atualizarTela()
      return
    }
  }
}

function filtrarTarefas() {
  var filtro = document.getElementById('filtro').value
  if (filtro === 'ativas') return tarefas.filter(t => !t.feita)
  if (filtro === 'concluidas') return tarefas.filter(t => t.feita)
  return tarefas
}

document.getElementById('filtro').addEventListener('change', atualizarTela)

document.getElementById('limpar-acoes').addEventListener('click', function() {
  if (confirm('Tem certeza que deseja excluir todas as tarefas?')) {
    tarefas = []
    salvarNoLocalStorage()
    atualizarTela()
  }
})
