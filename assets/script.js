// URL base da API de câmbio, utilizada para buscar as cotações das moedas
const API_URL = "https://economia.awesomeapi.com.br/json/last/";

// Seleção dos elementos de entrada (inputs) para as diferentes moedas no HTML
const inputs = {
  usd: document.querySelector("#usd"), // Input para valores em dólar
  brl: document.querySelector("#brl"), // Input para valores em real
  eur: document.querySelector("#eur"), // Input para valores em euro
  ars: document.querySelector("#ars"), // Input para valores em peso argentino
};

// Objeto para armazenar as cotações obtidas da API
let exchangeRates = {};

// Função assíncrona para buscar cotações de moedas na API
async function fetchExchangeRates() {
  try {
    // Faz a requisição à API para obter as cotações de USD, EUR e ARS em relação ao BRL
    const response = await fetch(`${API_URL}USD-BRL,EUR-BRL,ARS-BRL`);
    const data = await response.json();

    // Armazena as cotações convertendo as strings para números (float)
    exchangeRates = {
      usdToBrl: parseFloat(data.USDBRL.bid), // Cotação de USD para BRL
      eurToBrl: parseFloat(data.EURBRL.bid), // Cotação de EUR para BRL
      arsToBrl: parseFloat(data.ARSBRL.bid), // Cotação de ARS para BRL
    };
  } catch (error) {
    // Tratamento de erros na requisição
    console.error("Erro ao buscar cotações:", error);
    alert("Erro ao buscar cotações. Por favor, tente novamente mais tarde.");
  }
}

// Chama a função para buscar as cotações assim que a página é carregada
fetchExchangeRates();

// Função para formatar valores como moeda, aceitando o código da moeda como parâmetro
function formatCurrency(value, currency) {
  const options = { style: "currency", currency }; // Formata usando o código da moeda
  return new Intl.NumberFormat("pt-BR", options).format(value); // Retorna o valor formatado
}

// Função para corrigir o formato do valor inserido pelo usuário (substitui vírgulas por pontos e trata valores inválidos)
function fixValue(value) {
  const fixedValue = parseFloat(value.replace(",", "."));
  return isNaN(fixedValue) ? 0 : fixedValue; // Retorna 0 se o valor não for válido
}

// Função genérica para converter valores de uma moeda para outra
function convertCurrency(from, to) {
  if (!exchangeRates) return; // Garante que as cotações estão disponíveis antes de prosseguir

  const value = fixValue(inputs[from].value); // Obtém e corrige o valor do input
  let result;

  if (from === "brl") {
    // Conversão de BRL para outra moeda
    result = value / exchangeRates[`${to}ToBrl`];
  } else if (to === "brl") {
    // Conversão de outra moeda para BRL
    result = value * exchangeRates[`${from}ToBrl`];
  } else {
    // Conversão entre duas moedas diferentes (não BRL)
    result =
      (value * exchangeRates[`${from}ToBrl`]) / exchangeRates[`${to}ToBrl`];
  }

  // Atualiza o valor no input da moeda de destino com o resultado formatado e o símbolo correspondente
  const currencyMap = { usd: "USD", brl: "BRL", eur: "EUR", ars: "ARS" };
  inputs[to].value = formatCurrency(result.toFixed(2), currencyMap[to]);
}

// Configuração de eventos para os inputs de moedas
Object.keys(inputs).forEach((from) => {
  // Quando o usuário digitar no input
  inputs[from].addEventListener("keyup", () => {
    Object.keys(inputs).forEach((to) => {
      if (from !== to) convertCurrency(from, to); // Converte para todas as outras moedas
    });
  });

  // Quando o usuário sair do input (evento blur)
  inputs[from].addEventListener("blur", () => {
    const currencyMap = { usd: "USD", brl: "BRL", eur: "EUR", ars: "ARS" };
    inputs[from].value = formatCurrency(
      fixValue(inputs[from].value),
      currencyMap[from]
    ); // Formata o valor final com o símbolo correspondente
  });
});
