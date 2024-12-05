const API_URL = "https://economia.awesomeapi.com.br/json/last/";

let usdInput = document.querySelector("#usd");
let brlInput = document.querySelector("#brl");
let eurInput = document.querySelector("#eur");
let arsInput = document.querySelector("#ars");

// Cotaçoės obtidas da API
let exchangeRates = {};

// Função para buscar cotações na API
async function fetchExchangeRates() {
  try {
    const response = await fetch(
      `${API_URL}USD-BRL,EUR-BRL,ARS-BRL,USD-ARS,EUR-ARS,USD-EUR`
    );
    const data = await response.json();

    exchangeRates = {
      usdToBrl: parseFloat(data.USDBRL.bid),
      eurToBrl: parseFloat(data.EURBRL.bid),
      arsToBrl: parseFloat(data.ARSBRL.bid),
    };
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar:", error);
    alert(
      "Erro ao buscar cotação do dolar. Por favor, tente novamente mais tarde."
    );
  }
}

// Inicializar as cotações ao carregar a página
fetchExchangeRates();

usdInput.addEventListener("keyup", () => {
  convert("usd-to-brl");
});

brlInput.addEventListener("keyup", () => {
  convert("brl-to-usd");
});

arsInput.addEventListener("keyup", () => {
  convert("ars-to-brl");
});

brlInput.addEventListener("keyup", () => {
  convert("brl-to-ars");
});

eurInput.addEventListener("keyup", () => {
  convert("eur-to-brl");
});

brlInput.addEventListener("keyup", () => {
  convert("brl-to-eur");
});

usdInput.addEventListener("blur", () => {
  usdInput.value = formatCurrency(usdInput.value);
});

brlInput.addEventListener("blur", () => {
  brlInput.value = formatCurrency(brlInput.value);
});

arsInput.addEventListener("blur", () => {
  arsInput.value = formatCurrency(arsInput.value);
});

eurInput.addEventListener("blur", () => {
  eurInput.value = formatCurrency(eurInput.value);
});

function formatCurrency(value) {
  // ajustar o valor
  let fixedValue = fixValue(value);
  // utilizar função para formatação
  let options = {
    useGrouping: false,
    minimumFractionDigits: 2,
  };
  let formatter = new Intl.NumberFormat("pt-BR", options);
  // retorna o valor formatado
  return formatter.format(fixedValue);
}

function fixValue(value) {
  let fixedValue = value.replace(",", ".");
  let floatValue = parseFloat(fixedValue);
  if (floatValue == NaN) {
    floatValue = 0;
  }
  return floatValue;
}

// Função para conversões
function convert(type) {
  if (type === "usd-to-brl") {
    let fixedValue = fixValue(usdInput.value);
    let result = fixedValue * exchangeRates.usdToBrl;
    brlInput.value = formatCurrency(result.toFixed(2));
  }

  if (type === "brl-to-usd") {
    let fixedValue = fixValue(brlInput.value);
    let result = fixedValue / exchangeRates.usdToBrl;
    usdInput.value = formatCurrency(result.toFixed(2));
  }

  if (type === "ars-to-brl") {
    let fixedValue = fixValue(arsInput.value);
    let result = fixedValue * exchangeRates.arsToBrl;
    brlInput.value = formatCurrency(result.toFixed(2));
  }

  if (type === "brl-to-ars") {
    let fixedValue = fixValue(brlInput.value);
    let result = fixedValue / exchangeRates.arsToBrl;
    arsInput.value = formatCurrency(result.toFixed(2));
  }

  if (type === "eur-to-brl") {
    let fixedValue = fixValue(eurInput.value);
    let result = fixedValue * exchangeRates.eurToBrl;
    brlInput.value = formatCurrency(result.toFixed(2));
  }

  if (type === "brl-to-eur") {
    let fixedValue = fixValue(brlInput.value);
    let result = fixedValue / exchangeRates.eurToBrl;
    eurInput.value = formatCurrency(result.toFixed(2));
  }
}
