let saldo = 10000;
let mesAtual = 1;
const meta = 11500;
const cdiAnual = 0.10; // Exemplo: CDI a 10% a.a.
const cdiMensal = cdiAnual / 12;

// Taxas anuais
const txCdb = 1.0; // 100% do CDI
const txPrefixado = 0.12; // 12% a.a.

// Elementos do DOM para atualizar
const saldoEl = document.getElementById('saldo');
const mesEl = document.getElementById('mes');
const escolhasEl = document.getElementById('escolhas');
const resultadoEl = document.getElementById('resultado');
const mensagemEl = document.getElementById('mensagem');

// Função para formatar o valor monetário
function formatarMoeda(valor) {
    return valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

// Inicializa a exibição
saldoEl.textContent = formatarMoeda(saldo);
document.getElementById('meta').textContent = formatarMoeda(meta);

// Função principal de investimento
function investir(tipoInvestimento) {
    let rendimentoMensal = 0;
    let mensagem;
    
    // --- Lógica de Renda Fixa ---
    if (tipoInvestimento === 'CDB') {
        // CDB Pós-Fixado: rende de acordo com o CDI
        rendimentoMensal = saldo * (txCdb * cdiMensal);
        mensagem = `Você investiu no CDB Pós-Fixado. O mercado de juros manteve-se estável, rendendo: R$ ${formatarMoeda(rendimentoMensal)}`;
    } else if (tipoInvestimento === 'Tesouro') {
        // Tesouro Prefixado: rende a taxa fixa
        const txMensalPrefixada = txPrefixado / 12;
        rendimentoMensal = saldo * txMensalPrefixada;
        
        // Simulação de marcação a mercado:
        if (mesAtual > 6 && Math.random() < 0.3) { // 30% de chance de oscilar
             // Se o investidor resgatar antes (simulado aqui como uma pequena penalidade)
             rendimentoMensal *= 0.8; // Perde 20% do rendimento potencial
             mensagem = `Você investiu no Tesouro Prefixado. No entanto, houve **oscilação de mercado** e você realizou um resgate antecipado, com um pequeno impacto no rendimento (${formatarMoeda(rendimentoMensal)}).`;
        } else {
             mensagem = `Você investiu no Tesouro Prefixado. O rendimento fixo do mês foi de: R$ ${formatarMoeda(rendimentoMensal)}`;
        }
    }
    
    saldo += rendimentoMensal;
    
    // Atualiza a interface
    escolhasEl.style.display = 'none';
    resultadoEl.style.display = 'block';
    mensagemEl.innerHTML = mensagem;
    saldoEl.textContent = formatarMoeda(saldo);
}

// Função para avançar o jogo
function proximoMes() {
    mesAtual++;

    if (mesAtual > 12) {
        finalizarJogo();
        return;
    }
    
    mesEl.textContent = mesAtual;
    
    // Reseta para a próxima escolha
    resultadoEl.style.display = 'none';
    escolhasEl.style.display = 'flex';
}

function finalizarJogo() {
    escolhasEl.style.display = 'none';
    resultadoEl.style.display = 'none';
    
    let resultadoFinal;
    if (saldo >= meta) {
        resultadoFinal = `<h2 style="color: green;">🎉 Vitória!</h2><p>Parabéns, você atingiu a meta de R$ ${formatarMoeda(meta)}! Seu saldo final foi de R$ ${formatarMoeda(saldo)}.</p>`;
    } else {
        resultadoFinal = `<h2 style="color: red;">😞 Derrota.</h2><p>Você não atingiu a meta de R$ ${formatarMoeda(meta)}. Seu saldo final foi de R$ ${formatarMoeda(saldo)}. Tente aprender mais sobre Renda Fixa e juros compostos!</p>`;
    }
    
    document.querySelector('.container').innerHTML = resultadoFinal;
}

// Nota: Em um jogo real, você criaria variáveis para o valor investido e o valor inicial, em vez de investir o saldo total. Esta é uma versão simplificada!
