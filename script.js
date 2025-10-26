// Variáveis do Jogo
let capital = 10000;
let rodada = 1;
const MAX_RODADAS = 10;
let alocacaoFixa = 50;
let alocacaoVariavel = 50;

// Elementos do DOM
const capitalSpan = document.getElementById('capital');
const rodadaSpan = document.getElementById('rodada');
const rodadaTituloSpan = document.getElementById('rodada-titulo');
const alocacaoSpan = document.getElementById('alocacao');
const fixaInput = document.getElementById('fixa-input');
const variavelInput = document.getElementById('variavel-input');
const investirBtn = document.getElementById('investir-btn');
const gameArea = document.querySelector('.game-area');
const resultadoArea = document.querySelector('.resultado-area');
const resultadoTexto = document.getElementById('resultado-texto');
const proximaRodadaBtn = document.getElementById('proxima-rodada-btn');
const fimDeJogoDiv = document.querySelector('.fim-de-jogo');
const mensagemFinalP = document.getElementById('mensagem-final');
const reiniciarBtn = document.getElementById('reiniciar-btn');

// --- Funções de Lógica do Jogo ---

/**
 * Simula o retorno da Renda Fixa (Taxa de CDI/Selic)
 * Retorno estável e baixo risco.
 * @returns {number} Taxa de retorno em porcentagem (ex: 0.5% ao mês)
 */
function simularRendaFixa() {
    // Retorno mensal realista (0.5% a 0.8%)
    return (Math.random() * (0.8 - 0.5) + 0.5) / 100;
}

/**
 * Simula o retorno da Renda Variável (Ações/Fundos)
 * Retorno volátil (positivo ou negativo) e alto risco.
 * @returns {number} Taxa de retorno em porcentagem (ex: -5% a +10%)
 */
function simularRendaVariavel() {
    // Retorno volátil (-5% a +10%)
    return (Math.random() * (0.10 - (-0.05)) + (-0.05));
}

/**
 * Atualiza o placar e os valores na interface.
 */
function atualizarPlacar() {
    capitalSpan.textContent = capital.toFixed(2);
    rodadaSpan.textContent = rodada;
    rodadaTituloSpan.textContent = rodada;
    alocacaoSpan.textContent = `${alocacaoFixa}% Fixo | ${alocacaoVariavel}% Variável`;
    
    // Habilita/Desabilita botão
    const totalAlocacao = parseFloat(fixaInput.value) + parseFloat(variavelInput.value);
    investirBtn.disabled = totalAlocacao !== 100;
}

/**
 * Função principal para avançar uma rodada do jogo.
 */
function avancarRodada() {
    // 1. Coleta Alocação
    alocacaoFixa = parseFloat(fixaInput.value);
    alocacaoVariavel = parseFloat(variavelInput.value);

    // Validação final (deve ser 100% pelo estado do botão, mas é bom garantir)
    if (alocacaoFixa + alocacaoVariavel !== 100) {
        alert("A soma das alocações deve ser 100%!");
        return;
    }

    // 2. Cálculo dos Ganhos
    const capitalFixo = capital * (alocacaoFixa / 100);
    const capitalVariavel = capital * (alocacaoVariavel / 100);

    const taxaFixa = simularRendaFixa();
    const taxaVariavel = simularRendaVariavel();

    const ganhoFixo = capitalFixo * taxaFixa;
    const ganhoVariavel = capitalVariavel * taxaVariavel;
    const ganhoTotal = ganhoFixo + ganhoVariavel;

    // 3. Atualiza Capital
    const novoCapital = capital + ganhoTotal;
    const diferencaCapital = novoCapital - capital;
    capital = novoCapital;

    // 4. Exibe Resultado
    exibirResultado(taxaFixa, taxaVariavel, ganhoFixo, ganhoVariavel, diferencaCapital);

    // 5. Incrementa Rodada
    rodada++;
}

/**
 * Exibe o resultado da rodada e prepara para a próxima.
 * @param {number} taxaFixa - Taxa de retorno da Renda Fixa.
 * @param {number} taxaVariavel - Taxa de retorno da Renda Variável.
 * @param {number} ganhoFixo - Ganho monetário da Renda Fixa.
 * @param {number} ganhoVariavel - Ganho monetário da Renda Variável.
 * @param {number} diferencaCapital - Diferença total no capital.
 */
function exibirResultado(taxaFixa, taxaVariavel, ganhoFixo, ganhoVariavel, diferencaCapital) {
    gameArea.classList.add('hidden');
    resultadoArea.classList.remove('hidden');

    const statusClasse = diferencaCapital >= 0 ? 'ganho' : 'perda';
    const acaoVariavel = taxaVariavel >= 0 ? 'subiu' : 'caiu';

    let mensagem = `
        <p><strong>Cenário da Rodada:</strong></p>
        <ul>
            <li>Renda Fixa: <span class="ganho">+${(taxaFixa * 100).toFixed(2)}%</span> (Ganho: R$ ${ganhoFixo.toFixed(2)})</li>
            <li>Renda Variável: ${acaoVariavel} <span class="${statusClasse}">${(taxaVariavel * 100).toFixed(2)}%</span> (Ganho/Perda: R$ ${ganhoVariavel.toFixed(2)})</li>
        </ul>
        <p>Seu capital variou em: <span class="${statusClasse}">R$ ${diferencaCapital.toFixed(2)}</span>.</p>
        <p>Seu novo capital total é: R$ ${capital.toFixed(2)}.</p>
    `;
    resultadoTexto.innerHTML = mensagem;

    if (rodada > MAX_RODADAS) {
        finalizarJogo();
    } else {
        proximaRodadaBtn.classList.remove('hidden');
    }
}

/**
 * Finaliza o jogo e exibe a mensagem final.
 */
function finalizarJogo() {
    resultadoArea.classList.add('hidden');
    fimDeJogoDiv.classList.remove('hidden');

    const ganhoLiquido = capital - 10000;
    const statusFinal = ganhoLiquido >= 0 ? 'ganho' : 'perda';

    let mensagem = `
        <p>Você começou com R$ 10.000,00 e terminou com R$ ${capital.toFixed(2)}.</p>
        <p>Seu ganho/perda líquido foi de: <span class="${statusFinal}">R$ ${ganhoLiquido.toFixed(2)}</span>.</p>
    `;

    if (ganhoLiquido > 5000) {
        mensagem += '<p>Parabéns! Você é um **Investidor de Alto Nível**!</p>';
    } else if (ganhoLiquido > 0) {
        mensagem += '<p>Bom trabalho! Seu capital cresceu com sucesso.</p>';
    } else {
        mensagem += '<p>Não foi dessa vez. Revise suas escolhas e tente novamente!</p>';
    }
    
    mensagemFinalP.innerHTML = mensagem;
}

/**
 * Reseta o jogo para o estado inicial.
 */
function reiniciarJogo() {
    capital = 10000;
    rodada = 1;
    alocacaoFixa = 50;
    alocacaoVariavel = 50;
    fixaInput.value = 50;
    variavelInput.value = 50;

    fimDeJogoDiv.classList.add('hidden');
    gameArea.classList.remove('hidden');
    proximaRodadaBtn.classList.add('hidden');
    
    atualizarPlacar();
}

// --- Event Listeners ---

// 1. Botão "Investir"
investirBtn.addEventListener('click', avancarRodada);

// 2. Botão "Avançar"
proximaRodadaBtn.addEventListener('click', () => {
    resultadoArea.classList.add('hidden');
    gameArea.classList.remove('hidden');
    proximaRodadaBtn.classList.add('hidden');
    atualizarPlacar();
});

// 3. Botão "Reiniciar"
reiniciarBtn.addEventListener('click', reiniciarJogo);

// 4. Inputs (Para validação dinâmica de 100%)
[fixaInput, variavelInput].forEach(input => {
    input.addEventListener('input', () => {
        let fixa = parseFloat(fixaInput.value) || 0;
        let variavel = parseFloat(variavelInput.value) || 0;
        
        // Mantém a soma em 100% se um valor for alterado
        if (input.id === 'fixa-input') {
            variavelInput.value = 100 - fixa;
        } else {
            fixaInput.value = 100 - variavel;
        }
        
        atualizarPlacar(); // Chama a validação e atualização do placar
    });
});

// Inicia o jogo ao carregar
document.addEventListener('DOMContentLoaded', atualizarPlacar);