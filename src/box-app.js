// HTML DOM Elements

let itemNomeElt = document.getElementById("itemNome")
let itemQuantElt = document.getElementById("itemQuant")
let itensPorCaixaElt = document.getElementById("itensPorCaixa")
let boxlist = document.getElementById("boxlist")

// Form Control

let divs = Array.from(document.getElementsByClassName('div-input'))
let form = Array.from(document.getElementsByTagName('input'))
let calcBotao = document.getElementById("calcBotao")
let sobraBotao = document.getElementById("sobraBotao")

// Elementos do Construtor na Tela

let outputSobras = document.getElementById("outputSobras")
let outputConstrutor = document.getElementById("outputConstrutor")

// Main Classes

class Caixa {

    constructor(itemNome, itemQuant, itensPorCaixa) {

        this.itemNome = itemNome
        this.itemQuant = itemQuant
        this.itensPorCaixa = itensPorCaixa
        this.totalDeCaixas = Math.trunc(itemQuant / itensPorCaixa)
        this.sobra = itemQuant % itensPorCaixa
    }

    tirarExcesso() {

        this.itemQuant = this.itemQuant - this.sobra
        return this.itemQuant
    }
}

class CaixaVariada {

    constructor(itemNome = [], itemQuant = [], itensPorCaixa) {        

        this.itemNome = itemNome
        this.itemQuant = itemQuant
        this.itensPorCaixa = itensPorCaixa
        this.totalDeCaixas = 1
        this.sobra = 0
    }
}

// Global Variables and Control Function

const listaCaixas = []
let itens = []
let sobras = []
let somaDeSobras = Number()

const zerarListas = () => {
    itens = []
    sobras = []
}

const adicionarNasListas = (caixa) => {
    itens.push(caixa.itemNome)
    sobras.push(caixa.sobra)
}

const enableButtons = () => {
    calcBotao.removeAttribute("disabled")
    sobraBotao.removeAttribute("disabled")
}

// Listeners

calcBotao.addEventListener("click", () => {

    buttonValidation()

    if(buttonValidation() == false){
        setTimeout(enableButtons, 1000)
    } else if(buttonValidation() == true) {
        let caixa = new Caixa(
            itemNomeElt.value,
            itemQuantElt.valueAsNumber,
            itensPorCaixaElt.valueAsNumber
            )
        filtro(caixa)
    }
})

sobraBotao.addEventListener("click", () => {

    let newCaixa = new CaixaVariada(
        itens,
        sobras,
        itensPorCaixaElt.valueAsNumber
        )
    listarCaixas(newCaixa)
    zerarListas()
    somaDeSobras = 0
    exibirConstrutor(itens, sobras, somaDeSobras)
    calcBotao.setAttribute("disabled", "")
    sobraBotao.setAttribute("disabled", "")
})

// Validation

form.forEach((input, index) => {
    
    input.addEventListener('focus', () => {
        divs[index].classList.add("was-validated")
    })

    input.addEventListener('focusout', () => {
        divs[index].classList.remove("was-validated")
    })
})

function buttonValidation() {

    form.forEach((input, index) => {
        
        if(input.value === "" || input.valueAsNumber === "" || input.valueAsNumber === 0) {

            divs[index].classList.add("was-validated")
            calcBotao.setAttribute("disabled", "")
            sobraBotao.setAttribute("disabled", "")
        }
    })

    const valid = divs.every((div) => {
        return !div.classList.contains("was-validated")
    })

    return valid
}

// Box Algorithm

function filtro(caixa) {

    if(caixa.totalDeCaixas === 0) {
        somarSobra(caixa)
    } else {
        caixa.tirarExcesso()
        if(caixa.sobra === 0) {
            listarCaixas(caixa)    
        } else {
            listarCaixas(caixa)
            somarSobra(caixa)
        }
    }
}

function somarSobra(caixa) {
    
    somaDeSobras += caixa.sobra

    if(somaDeSobras < caixa.itensPorCaixa) {
        adicionarNasListas(caixa)
    }
    else if(somaDeSobras > caixa.itensPorCaixa) {
        somaDeSobras -= caixa.sobra
        itens.push(caixa.itemNome)
        sobras.push(caixa.itensPorCaixa - somaDeSobras)
        somaDeSobras = caixa.sobra - (caixa.itensPorCaixa - somaDeSobras)
        let newCaixa = new CaixaVariada(itens, sobras, caixa.itensPorCaixa)
        zerarListas()
        listarCaixas(newCaixa)
        caixaInit(caixa.itemNome, somaDeSobras, caixa.itensPorCaixa)
    }
    else if(somaDeSobras === caixa.itensPorCaixa) {
        somaDeSobras = 0
        adicionarNasListas(caixa)
        let newCaixa = new CaixaVariada(itens, sobras, caixa.itensPorCaixa)
        listarCaixas(newCaixa)
        zerarListas()
    }

    exibirConstrutor(itens, sobras, somaDeSobras)
}

function caixaInit(itemNome, itemQuant, itensPorCaixa) {

    let caixaRecursao = new Caixa(itemNome, itemQuant, itensPorCaixa)
    somaDeSobras = 0
    filtro(caixaRecursao)
}

// HTML Render

function listarCaixas(caixa) {

    listaCaixas.push(caixa)
    boxlist.innerHTML = ''
    return listaCaixas.map((caixa, index) => {
        boxlist.innerHTML += caixaParaLista(caixa, index)
    })
}

function caixaParaLista(caixa, index) {
    
    return `
        <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${index + 1}° Remessa</h6>
                <small class="text-body-secondary">Conteúdo da(s) caixa(s): </small>
                <p class="text-body-secondary">${caixa.itemNome}</p>
                <p class="text-body-secondary">${caixa.itemQuant}</p>
                <p class="text-body-secondary">${caixa.totalDeCaixas}</p>
            </div>
        </li>
    `
}

function exibirConstrutor(itens, sobras, somaDeSobras) {
    
    outputSobras.innerHTML = `Sobras: ${somaDeSobras}`
    outputConstrutor.innerHTML = ''    
    return itens.map((item, index) => {
        outputConstrutor.innerHTML += construtorNaTela(item, sobras[index])
    })
}

function construtorNaTela(itens, sobras) {

    return `
        <li class="list-group-item">${itens}: ${sobras} unidades</li>
    `
}
