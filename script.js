const pinos = [document.getElementById("pino1"), document.getElementById("pino2"), document.getElementById("pino3")];
const discosContainer = pinos.map(pino => pino.querySelector(".discos-container"));
const numDiscosSelect = document.getElementById("numDiscos");
const iniciarJogoBtn = document.getElementById("iniciarJogo");
const movimentosSpan = document.getElementById("movimentos");
const minMovimentosSpan = document.getElementById("minMovimentos");
const mensagemDiv = document.getElementById("mensagem");

let numDiscos = 0;
let movimentos = 0;
let discoSelecionado = null;
let pinoOrigem = null;
let estadoJogo = []; // Representa o estado dos discos em cada pino

const coresDiscos = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
];

function calcularMinMovimentos(n) {
    return Math.pow(2, n) - 1;
}

function inicializarJogo() {
    numDiscos = parseInt(numDiscosSelect.value);
    movimentos = 0;
    discoSelecionado = null;
    pinoOrigem = null;
    estadoJogo = [[], [], []];

    movimentosSpan.textContent = movimentos;
    minMovimentosSpan.textContent = calcularMinMovimentos(numDiscos);
    mensagemDiv.textContent = "";
    mensagemDiv.classList.remove("vitoria");

    // Limpar pinos
    discosContainer.forEach(container => container.innerHTML = "");

    // Criar discos e adicionar ao primeiro pino
    for (let i = numDiscos; i >= 1; i--) {
        const disco = document.createElement("div");
        disco.classList.add("disco", `disco-${i}`);
        disco.dataset.tamanho = i;
        disco.style.width = `${60 + (i - 1) * 20}px`; // Ajustar largura baseada no tamanho
        disco.style.backgroundColor = coresDiscos[i - 1];
        discosContainer[0].appendChild(disco);
        estadoJogo[0].push(i);
    }

    // Reativar event listeners após vitória
    pinos.forEach(pino => pino.addEventListener("click", handleClickPino));
}

function podeMover(origem, destino) {
    const discosOrigem = estadoJogo[origem];
    const discosDestino = estadoJogo[destino];

    if (discosOrigem.length === 0) {
        return false; // Não há discos para mover na origem
    }

    const discoTopoOrigem = discosOrigem[discosOrigem.length - 1];

    if (discosDestino.length === 0) {
        return true; // Pino de destino vazio, pode mover
    }

    const discoTopoDestino = discosDestino[discosDestino.length - 1];

    return discoTopoOrigem < discoTopoDestino; // Só pode mover disco menor para cima de um maior
}

function moverDisco(origem, destino) {
    if (!podeMover(origem, destino)) {
        mensagemDiv.textContent = "Movimento inválido! Não é possível colocar um disco maior sobre um menor.";
        return false;
    }

    const discoMovidoTamanho = estadoJogo[origem].pop();
    estadoJogo[destino].push(discoMovidoTamanho);

    // Atualizar visualmente
    const discoElement = discosContainer[origem].lastElementChild;
    discosContainer[destino].appendChild(discoElement);

    movimentos++;
    movimentosSpan.textContent = movimentos;
    mensagemDiv.textContent = "";

    verificarVitoria();
    return true;
}

function verificarVitoria() {
    if (estadoJogo[2].length === numDiscos) {
        let mensagem = `Parabéns! Você venceu em ${movimentos} movimentos!`;
        if (movimentos === calcularMinMovimentos(numDiscos)) {
            mensagem += " (Movimentos mínimos alcançados!)";
        } else {
            mensagem += ` (Mínimo possível: ${calcularMinMovimentos(numDiscos)} movimentos)`;
        }
        mensagemDiv.textContent = mensagem;
        mensagemDiv.classList.add("vitoria");
        
        // Desabilitar cliques nos pinos após a vitória
        pinos.forEach(pino => pino.removeEventListener("click", handleClickPino));
    }
}

function handleClickPino(event) {
    const pinoClicado = event.currentTarget;
    const pinoIndex = pinos.indexOf(pinoClicado);

    if (!discoSelecionado) {
        // Selecionar disco
        const discoTopo = discosContainer[pinoIndex].lastElementChild;
        if (discoTopo) {
            discoSelecionado = discoTopo;
            pinoOrigem = pinoIndex;
            discoSelecionado.classList.add("selecionado");
            mensagemDiv.textContent = "Disco selecionado. Clique em outro pino para mover.";
        } else {
            mensagemDiv.textContent = "Pino vazio. Selecione um pino com discos.";
        }
    } else {
        // Mover disco
        const pinoDestino = pinoIndex;
        if (pinoOrigem === pinoDestino) {
            // Clicou no mesmo pino, deselecionar
            discoSelecionado.classList.remove("selecionado");
            discoSelecionado = null;
            pinoOrigem = null;
            mensagemDiv.textContent = "Seleção cancelada.";
        } else {
            if (moverDisco(pinoOrigem, pinoDestino)) {
                discoSelecionado.classList.remove("selecionado");
                discoSelecionado = null;
                pinoOrigem = null;
            } else {
                // Movimento inválido, manter disco selecionado
            }
        }
    }
}

// Adicionar event listeners
iniciarJogoBtn.addEventListener("click", inicializarJogo);
pinos.forEach(pino => pino.addEventListener("click", handleClickPino));

// Inicializar o jogo ao carregar a página
inicializarJogo();

