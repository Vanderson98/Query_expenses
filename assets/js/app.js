let resultadoDespesasConteudo = document.querySelector('.resultadoDespesas')
resultadoDespesasConteudo.style.display = "none"
let modalErro = document.querySelector('#erroGravacao')
let dataSpan = document.querySelector('#dataSpan')
let linha = document.querySelector('#tableBody')
let valorResultado = document.querySelector('.realResultado')
let valorReal = 0


// Mudar links menu
$('.consultaLink').attr('href', 'consulta.html') // Mudar href
$('.consultaLink').text('Consultar') // Mudar texto
$('.homeLink').attr('href', 'index.html') // Mudar href
$('.homeLink').text('Registrar') // Mudar texto

class Despesas {
   constructor(ano, mes, diaNumber, tipoDespesas, descricaoDespesas, valorDespesa) {
      this.ano = ano
      this.mes = mes
      this.diaNumber = diaNumber
      this.tipoDespesas = tipoDespesas
      this.descricaoDespesas = descricaoDespesas
      this.valorDespesa = valorDespesa
   }

   validarDespesa() {
      for (let x in this) {
         if (this[x] == undefined || this[x] == '' || this[x] == null) { // Ver se tem algo em branco
            return false
         }
      }
      return true
   }
}


// Pegar valores de inputs
let getValues = () => {
   let ano = document.querySelector('#ano')
   let mes = document.querySelector("#mes")
   let diaNumber = document.querySelector("#diaNumber")
   let tipoDespesas = document.querySelector('#tipoDespesas')
   let descricaoDespesas = document.querySelector('#descricaoDespesas')
   let valorDespesa = document.querySelector('#valorDespesa')
}

// Banco de dados despesas
class BDDespesas {
   // Pegar id
   constructor() {
      let id = localStorage.getItem('id')
      if (id === null) { // Se ID for igual a null, ele retornara 0
         localStorage.setItem('id', 0)
      }
   }

   // Setar id
   getProximoID() {
      let proximoID = localStorage.getItem('id')
      return parseInt(proximoID) + 1
   }

   // Gravar dados no Local Storage
   gravarDespesa = (d) => {

      // Pegar num ID
      let id = this.getProximoID()

      // Formar objeto com ID
      localStorage.setItem(`${id}`, JSON.stringify(d))

      // Adicionar mais ID
      localStorage.setItem('id', id)
   }

   // Recuperar registros de despesas
   recuperarRegistros() {
      let despesas = [] // Array despesas

      let id = localStorage.getItem(`id`) // Pegar ID

      for (let x = 1; x <= id; x++) {
         let despesa = JSON.parse(localStorage.getItem(x)) // Mostrar objeto
         if (despesa == null) { // Verificar despesa null
            continue
         } else {
            despesa.id = x // Implementar id nos objetos
            despesas.push(despesa)
         }
      }
      return despesas
   }

   pesquisar = (despesa) => {
      let despesasFiltradas = []
      despesasFiltradas = this.recuperarRegistros()
      // Filtrar

      // Mudar as despesas de number para string
      if (despesa.tipoDespesas == '1') {
         despesa.tipoDespesas = 'educação'
      } else if (despesa.tipoDespesas == '2') {
         despesa.tipoDespesas = 'lazer'
      } else if (despesa.tipoDespesas == '3') {
         despesa.tipoDespesas = 'investimento'
      }

      // Filtrar melhor
      for (let obj in despesa) {
         if (despesa[obj] != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d[obj] == despesa[obj])
         }
      }

      return despesasFiltradas
   }

   removerDespesa = (id) => {
      localStorage.removeItem(id)
   }
}
// Objeto para criar despesa
let bdDespesa = new BDDespesas()


// Cadastrar despesas
let cadastrarDespesas = () => {
   getValues()

   let despesa = new Despesas(ano.value,
      mes.value,
      diaNumber.value,
      tipoDespesas.value,
      descricaoDespesas.value,
      valorDespesa.value)


   $('#modalRegistroDespesa .modal-content').removeClass('bg-light') // Remover a classes
   $('#modalRegistroDespesa .modal-content').removeClass('bg-success')
   $('#modalRegistroDespesa .modal-content').removeClass('bg-danger')

   $('#modalRegistroDespesa').modal('show') // Mostrar modal

   $('#modalRegistroDespesa h5').addClass('text-uppercase') // Colocar textos em palavra maisculas
   // Criar despesas
   if (despesa.validarDespesa()) {
      // Consultar data
      if (diaNumber.value > 31) { // Mostrar modal caso a data seja errada
         $('#modalRegistroDespesa .modal-content').addClass('bg-danger')
         $('#modalRegistroDespesa h5').text('[erro]') // Adicionar o titulo ERRO
         $('#modalRegistroDespesa h4').text(`A data ${diaNumber.value} não existe, tente novamente!`) // Adicionar texto caso a data seja errada
      } else {
         $('#modalRegistroDespesa .modal-content').addClass('bg-success') // Adicionar a class success 
         $('#modalRegistroDespesa h5').text('Sucesso')
         $('#modalRegistroDespesa h4').text('Sua despesa foi adicionada com sucesso!')
         $('#modalRegistroDespesa .bg-success').on('click', modalClicked()) // Chamar função para apagar todos valores do input
         bdDespesa.gravarDespesa(despesa)

         modalClicked()
      }
   } else {
      // Dialog erro
      $('#modalRegistroDespesa .modal-content').addClass('bg-danger') // Adicionar a class danger
      $('#modalRegistroDespesa h5').text('[erro]') // Adicionar o titulo ERRO
      $('#modalRegistroDespesa h4').text('Preencha os dados corretamente e tente novamente!') // Inserir texto
   }
}

// Consultar despesa
let carregaListaDespesas = () => {
   let despesas = []
   despesas = bdDespesa.recuperarRegistros() // Metodo de recuperar despesas
   resultadoDespesasConteudo.style.display = "block" // Mostrar conteudo despesas


   despesas.forEach(function(d) { // Mostrar todas despesas
      let linhaDespesas = linha.insertRow() // Criar linha (TR)
      for (let i = 0; i <= 4; i++) {
         if (i == 0) {
            if (d.diaNumber < 10 && d.mes < 10) {
               linhaDespesas.insertCell(i).innerHTML = `0${d.diaNumber}/0${d.mes}/${d.ano}` // Mostrar data
            } else if (d.diaNumber < 10) {
               linhaDespesas.insertCell(i).innerHTML = `0${d.diaNumber}/${d.mes}/${d.ano}` // Mostrar data
            } else if (d.mes < 10) {
               linhaDespesas.insertCell(i).innerHTML = `${d.diaNumber}/0${d.mes}/${d.ano}` // Mostrar data
            } else {
               linhaDespesas.insertCell(i).innerHTML = `${d.diaNumber}/${d.mes}/${d.ano}` // Mostrar data
            }
         } else if (i == 1) {
            // Ver que tipo de despesa
            switch (parseInt(d.tipoDespesas)) {
               case 1:
                  d.tipoDespesas = 'Educação'
                  break
               case 2:
                  d.tipoDespesas = "lazer"
                  break
               case 3:
                  d.tipoDespesas = 'Investimento'
            }
            linhaDespesas.insertCell(i).innerHTML = `${d.tipoDespesas}` // Mostrar tipo de despesa
         } else if (i == 2) {
            linhaDespesas.insertCell(i).innerHTML = `${d.descricaoDespesas}` // Mostrar descrição
         } else if (i == 3) {
            let valor = parseInt(d.valorDespesa) * -1 // Transformar valor em int
            valorReal += valor // Adicionar o resultado de valor
            linhaDespesas.insertCell(i).innerHTML = `${valor.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}` // Mostrar valor formatado
         } else if (i == 4) {
            let buttonRemove = document.createElement('button') // Criar botão
            buttonRemove.className = 'btn btn-danger' // Adicionar a class btn e btn danger
            buttonRemove.innerHTML = '<i class="fa-solid fa-trash fa-xl"></i>' // Adicionar texto remover
            buttonRemove.id = `IdDespesa${d.id}` // Adicionar id no button
            buttonRemove.onclick = () => { // Função para remover despesa
               mostrarModal('exclusao')
               let id = buttonRemove.id.replace('IdDespesa', '') // Tirar a palavra IdDespesa e deixar somente o ID
               bdDespesa.removerDespesa(id) // Remover despesa de acordo com Id
               setTimeout(() => {
                  window.location.reload() // Recarregar página
               }, 3200)
            }
            linhaDespesas.insertCell(i).append(buttonRemove) //  Mostrar botão
         }
      }
      valorResultado.innerHTML = valorReal.toLocaleString('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }) // Mostrar valor
   })
   adicionarClassesCol()
}

// Pesquisar despesas
let pesquisarDespesas = () => {
   getValues() // Pegar valores

   let despesa = new Despesas(
      ano.value,
      mes.value,
      diaNumber.value,
      tipoDespesas.value,
      descricaoDespesas.value,
      valorDespesa.value
   )
   mostrarModal('pesquisar')
   linha.innerHTML = ''

   bdDespesa.pesquisar(despesa)
   let despesas = []
   despesas = bdDespesa.pesquisar(despesa)

   despesas.forEach(function(d) { // Mostrar todas despesas
      let linhaDespesas = linha.insertRow() // Criar linha (TR)
      for (let i = 0; i <= 4; i++) {
         if (i == 0) {
            if (d.diaNumber < 10 && d.mes < 10) {
               linhaDespesas.insertCell(i).innerHTML = `0${d.diaNumber}/0${d.mes}/${d.ano}` // Mostrar data
            } else if (d.diaNumber < 10) {
               linhaDespesas.insertCell(i).innerHTML = `0${d.diaNumber}/${d.mes}/${d.ano}` // Mostrar data
            } else if (d.mes < 10) {
               linhaDespesas.insertCell(i).innerHTML = `${d.diaNumber}/0${d.mes}/${d.ano}` // Mostrar data
            } else {
               linhaDespesas.insertCell(i).innerHTML = `${d.diaNumber}/${d.mes}/${d.ano}` // Mostrar data
            }
         } else if (i == 1) {
            linhaDespesas.insertCell(i).innerHTML = `${d.tipoDespesas}` // Mostrar tipo de despesa
         } else if (i == 2) {
            linhaDespesas.insertCell(i).innerHTML = `${d.descricaoDespesas}` // Mostrar descrição
         } else if (i == 3) {
            let valor = parseInt(d.valorDespesa) * -1 // Transformar valor em int
            valorReal = valor // Adicionar o resultado de valor
            linhaDespesas.insertCell(i).innerHTML = `${valor.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}` // Mostrar valor formatado
         } else if (i == 4) {
            let buttonRemove = document.createElement('button') // Criar botão
            buttonRemove.className = 'btn btn-danger' // Adicionar a class btn e btn danger
            buttonRemove.innerHTML = '<i class="fa-solid fa-trash fa-xl"></i>' // Adicionar texto remover
            buttonRemove.id = `IdDespesa${d.id}` // Adicionar id no button
            buttonRemove.onclick = () => { // Função para remover despesa
               mostrarModal('exclusao')
               let id = buttonRemove.id.replace('IdDespesa', '') // Tirar a palavra IdDespesa e deixar somente o ID
               bdDespesa.removerDespesa(id) // Remover despesa de acordo com Id
               setTimeout(() => {
                  window.location.reload() // Recarregar página
               }, 3200)
            }
            linhaDespesas.insertCell(i).append(buttonRemove) //  Mostrar botão
         }
      }
      valorResultado.innerHTML = valorReal.toLocaleString('pt-BR', {
         style: 'currency',
         currency: 'BRL'
      }) // Mostrar valor
   })
   adicionarClassesCol()
}

let adicionarClassesCol = () => {
   $('#tableBody tr').addClass('row') // Adicionar a classe row na coluna
   $('#tableBody td').addClass('col-sm-2 text-center') // Adicionar a class col-sm-2 em todas linhas
}

let modalClicked = () => {
   // Limpando formulario
   $('#diaNumber').val('')
   $('#ano').val('')
   $('#mes').val('')
   $('#tipoDespesas').val('')
   $('#descricaoDespesas').val('')
   $('#valorDespesa').val('')
}

let mostrarModal = (acao) => {
   $('#modalRegistroDespesa .modal-body .spinner-border').remove() // Aparecer somente um spinner
   $('#modalRegistroDespesa').modal('show') // Mostrar modal
   $('#modalRegistroDespesa .modal-content').removeClass('bg-light') // Retirar class light
   $('#modalRegistroDespesa .modal-body').append(`<div class="spinner-border text-info" role="status"></div>`) // Adicionar o spinner
   $('#modalRegistroDespesa .modal-content .modal-body').css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
   }) // Alinhar tudo
   $('#modalRegistroDespesa .btn-light').css({
      display: 'none'
   }) // Tirar botão
   $('#modalRegistroDespesa h5').addClass('text-center') // Alinhar texto no centro
   $('#modalRegistroDespesa h4').css({
      display: 'none'
   }) // Tirar o segundo texto
   if (acao == 'pesquisar') {
      $('#modalRegistroDespesa .modal-content').addClass('bg-primary') // Adicionar class info
      $('#modalRegistroDespesa h5').text('Carregando...') // Trocar
   } else if (acao == 'exclusao') {
      $('#modalRegistroDespesa .modal-content').addClass('bg-danger')
      $('#modalRegistroDespesa .modal-body div').removeClass('text-info')
      $('#modalRegistroDespesa .modal-body div').addClass('text-light')
      $('#modalRegistroDespesa h5').text('Estamos excluindo!')
   }
   let mostrarButton = setTimeout(() => {
      $('#modalRegistroDespesa').modal('hide') // Esconder modal após 3 segundos
   }, 3000)

   // Limpando formulario
   modalClicked()
}