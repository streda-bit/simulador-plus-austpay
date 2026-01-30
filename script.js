// Taxas do plano PLUS
const rates = {
    visa_master: {
        debit: 2.50, pix: 2.50,
        credit: [5.63, 7.04, 7.65, 8.25, 8.95, 9.65, 10.40, 11.15, 11.75, 12.25, 13.15, 13.65, 15.15, 15.86, 16.57, 17.28, 17.99, 18.70, 19.70, 20.40, 21.00]
    },
    elo: {
        debit: 4.05, pix: 2.50,
        credit: [6.10, 7.92, 8.54, 9.10, 9.80, 10.50, 11.25, 12.00, 12.75, 13.50, 14.00, 14.75, 15.87, 16.57, 17.27, 17.98, 18.68, 19.39, 20.09, 20.40, 21.10]
    },
        amex: {
        debit: null, pix: 2.50,
        // Corrigido o 16.45 para 17.45 na posição 15 (index 14)
        credit: [6.75, 8.12, 8.82, 9.53, 10.23, 10.93, 11.83, 12.53, 13.23, 13.94, 14.64, 15.34, 16.04, 16.75, 17.45, 18.15, 18.86, 19.56, 20.25, 20.95, 21.65]
    },
    hiper: {
        debit: null, pix: 2.50,
        // Conferido: 15x (index 14) é 16.97, está correto no seu código original
        credit: [5.72, 7.62, 8.33, 9.33, 9.74, 10.35, 11.34, 12.04, 12.75, 13.75, 14.16, 14.86, 15.57, 16.27, 16.97, 17.68, 18.38, 19.09, 19.79, 20.49, 21.19]
    },
    cabal: {
        debit: 7.75, pix: 2.50,
        credit: [9.38, 10.02, 10.73, 11.44, 12.15, 12.85, 13.89, 14.59, 15.30, 16.00, 16.71, 17.41, 18.12, 18.82, 19.53, 20.23, 20.94, 21.64, null, null, null]
    }
};

// Elementos da tela
const els = {
    amount: document.getElementById('amount'),
    brand: document.getElementById('brand'),
    method: document.getElementById('method'),
    installments: document.getElementById('installments'),
    passFees: document.getElementById('passFees'),
    receiveAmount: document.getElementById('receiveAmount'),
    chargeAmount: document.getElementById('chargeAmount')
};

// Função principal que roda ao abrir o site
function init() {
    // 1. Cria as opções de 1x até 21x
    els.installments.innerHTML = '';
    for (let i = 1; i <= 21; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.text = i + 'x';
        els.installments.appendChild(opt);
    }

    // 2. Avisa o navegador para recalcular quando algo mudar
    [els.amount, els.brand, els.method, els.installments, els.passFees].forEach(el => 
        el.addEventListener('input', calculate)
    );
    
    // 3. Esconde parcelas se não for crédito
    els.method.addEventListener('change', () => {
        els.installments.style.display = els.method.value === 'credit' ? 'block' : 'none';
        calculate();
    });

    calculate();
}

// Lógica Matemática
function calculate() {
    let amount = parseFloat(els.amount.value) || 0;
    let rate = 0;
    
    // Busca a taxa correta no objeto 'rates'
    if (els.method.value === 'pix') rate = rates[els.brand.value].pix;
    else if (els.method.value === 'debit') rate = rates[els.brand.value].debit;
    else {
        // Se for crédito, pega pelo número da parcela (array começa em 0)
        let idx = parseInt(els.installments.value) - 1;
        let list = rates[els.brand.value].credit;
        if (list && list[idx] != null) rate = list[idx];
    }
    
    if (rate === null) rate = 0; // Proteção contra erro

    // Cálculos
    let charge = amount;
    let receive = amount;

    if (els.passFees.checked) {
        // Repasse: Cliente paga a mais (Cálculo Inverso para precisão)
        charge = amount / (1 - (rate / 100));
        receive = amount;
    } else {
        // Padrão: Desconta do valor original
        receive = amount - (amount * (rate / 100));
    }

    // Formata para Dinheiro (R$)
    els.receiveAmount.innerText = receive.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    els.chargeAmount.innerText = charge.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}


init();

