const API_URL = "https://economia.awesomeapi.com.br/json/last/";

// Inputs de moeda
const inputs = {
  usd: document.querySelector("#usd"),
  brl: document.querySelector("#brl"),
  eur: document.querySelector("#eur"),
  ars: document.querySelector("#ars"),
};

// Cotaçoės obtidas da API
let exchangeRates = {};

// Função para buscar cotações na API
async function fetchExchangeRates() {
  try {
    const response = await fetch(`${API_URL}USD-BRL,EUR-BRL,ARS-BRL`);
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

// Formatação de valores
function formatCurrency(value) {
  const options = { minimumFractionDigits: 2, useGrouping: false };
  return new Intl.NumberFormat("pt-BR", options).format(value);
}

function fixValue(value) {
  const fixedValue = parseFloat(value.replace(",", "."));
  return isNaN(fixedValue) ? 0 : fixedValue;
}

// Funções genéricas para conversão
function convertCurrency(from, to) {
  if (!exchangeRates) return;

  const value = fixValue(inputs[from].value);
  let result;

  if (from === "brl") {
    result = value / exchangeRates[`${to}ToBrl`];
  } else if (to === "brl") {
    result = value * exchangeRates[`${from}ToBrl`];
  } else {
    result =
      (value * exchangeRates[`${from}ToBrl`]) / exchangeRates[`${to}ToBrl`];
  }

  inputs[to].value = formatCurrency(result.toFixed(2));
}

// Configuração de eventos genérica
Object.keys(inputs).forEach((from) => {
  inputs[from].addEventListener("keyup", () => {
    Object.keys(inputs).forEach((to) => {
      if (from !== to) convertCurrency(from, to);
    });
  });

  inputs[from].addEventListener("blur", () => {
    inputs[from].value = formatCurrency(fixValue(inputs[from].value));
  });
});
