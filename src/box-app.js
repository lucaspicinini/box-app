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

        return this.itemQuant -= this.sobra
    }
}

class CaixaVariada {

    constructor(itens = [], itensPorCaixa) {        
        this.itemNome = itens.map((item) => item.nome)
        this.itemQuant = itens.map((item) => item.quantidade)
        this.itensPorCaixa = itensPorCaixa
        this.totalDeCaixas = 1
        this.sobra = 0
    }
}

// Global Variables and Control Functions

const listaCaixas = []
let listaRecursao = []
let listaSobras = []
let somaDeSobras = Number()

const produzirCaixaVariada = (caixa) => {

    let newCaixa = new CaixaVariada(listaSobras, caixa.itensPorCaixa)
    listaSobras = []
    listarCaixas(newCaixa)
}

const enableButtons = () => {

    calcBotao.removeAttribute("disabled")
    sobraBotao.removeAttribute("disabled")
}

const disableButtons = () => {
    
    calcBotao.setAttribute("disabled", "")
    sobraBotao.setAttribute("disabled", "")
}

const construtorDasSobras = (caixa) => {
    
    let obj = {}
    obj.nome = caixa.itemNome
    obj.quantidade = caixa.sobra
    listaSobras.push(obj)
    listaSobras.sort((a, b) => a.quantidade - b.quantidade);
}

const construtorDaRecursao = (sobraRecursao) => listaRecursao.push({...sobraRecursao})

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
        listaSobras,
        itensPorCaixaElt.valueAsNumber
        )
    listarCaixas(newCaixa)
    listaSobras = []
    somaDeSobras = 0
    exibirConstrutor(listaSobras, somaDeSobras)
    disableButtons()
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
            disableButtons()
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
        construtorDasSobras(caixa)
    }
    else if(somaDeSobras > caixa.itensPorCaixa) {
        construtorDasSobras(caixa)
        let diff = somaDeSobras - caixa.itensPorCaixa
        
        for (let i = 0; diff > 0;) {

            if(listaSobras[i].quantidade < diff) {
                diff -= listaSobras[i].quantidade
                construtorDaRecursao(listaSobras[i])
                listaSobras.shift()
            }
            else if(listaSobras[i].quantidade > diff) {
                let quantFinal = listaSobras[i].quantidade - diff
                listaSobras[i].quantidade = diff
                construtorDaRecursao(listaSobras[i])
                listaSobras[i].quantidade = quantFinal
                diff = 0
            } else {
                construtorDaRecursao(listaSobras[i])
                listaSobras.shift()
                diff = 0
            }
        }

        produzirCaixaVariada(caixa)
        listaRecursao.map((sobra) => caixaInit(sobra.nome, sobra.quantidade, caixa.itensPorCaixa))
        listaRecursao = []
    }
    else if(somaDeSobras === caixa.itensPorCaixa) {
        somaDeSobras = 0
        construtorDasSobras(caixa)
        produzirCaixaVariada(caixa)
    }
    
    exibirConstrutor(listaSobras, somaDeSobras)
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
    return listaCaixas.map((caixa, index) => boxlist.innerHTML += caixaParaLista(caixa, index))
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

function exibirConstrutor(listaSobras = [], somaDeSobras) {

    outputSobras.innerHTML = `Sobras: ${somaDeSobras}`
    outputConstrutor.innerHTML = ''    
    return listaSobras.map((item) => outputConstrutor.innerHTML += `<li class="list-group-item">${item.nome}: ${item.quantidade} unidades</li>`)
}