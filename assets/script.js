let dolar = 6.4;

let usdInput = document.querySelector("#usd");
let brlInput = document.querySelector("#brl");

usdInput.addEventListener("keyup", () => {
  convert("usd-to-brl");
});

brlInput.addEventListener("keyup", () => {
  convert("brl-to-usd");
});

usdInput.value = "1000,00";
convert("usd-to-brl");

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

function convert(type) {
  if (type === "usd-to-brl") {
    // ajustar o valor
    let fixedValue = fixValue(usdInput.value);
    // converter o valor
    let result = fixedValue * dolar;
    result = result.toFixed(2);
    // mostra no campo o valor
    brlInput.value = formatCurrency(result);
  }

  if (type === "brl-to-usd") {
    // ajustar o valor
    let fixedValue = fixValue(brlInput.value);
    // converter o valor
    let result = fixedValue / dolar;
    result = result.toFixed(2);
    // mostra no campo o valor
    usdInput.value = formatCurrency(result);
  }
}
