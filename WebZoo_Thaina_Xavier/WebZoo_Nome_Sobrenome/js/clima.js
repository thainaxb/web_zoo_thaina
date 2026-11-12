function obterDicaClima(tempAtual, chanceChuva) {
  if (chanceChuva >= 50) {
    return "Dia chuvoso: leve capa de chuva. Alguns animais ficam mais ativos depois da chuva.";
  }
  if (tempAtual >= 28) {
    return "Dia quente: use protetor solar e boné e leve uma garrafa de água.";
  }
  if (tempAtual <= 17) {
    return "Dia frio: leve um agasalho. Vários animais gostam de tomar sol nas manhãs frias.";
  }
  return "Tempo firme: ótimo dia para percorrer todas as trilhas com calma.";
}

async function carregarPrevisaoTempo() {
  const container = document.getElementById("clima-resultado");
  const btnAtualizar = document.getElementById("btn-atualizar-clima");
  if (!container) return;

  if (btnAtualizar) btnAtualizar.disabled = true;
  container.textContent = "Consultando a previsão do tempo...";

  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-23.65&longitude=-46.62" +
    "&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=America%2FSao_Paulo";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Falha HTTP Open-Meteo");
    }

    const data = await response.json();
    const atual = data?.current?.temperature_2m;
    const maxima = data?.daily?.temperature_2m_max?.[0];
    const minima = data?.daily?.temperature_2m_min?.[0];
    const chuva = data?.daily?.precipitation_probability_max?.[0] ?? 0;

    if (typeof atual !== "number" || typeof maxima !== "number" || typeof minima !== "number") {
      throw new Error("Dados meteorológicos incompletos");
    }

    container.textContent = "";

    const pResumo = document.createElement("p");
    pResumo.textContent = `Agora: ${atual.toFixed(1)} °C. Máxima de ${maxima.toFixed(1)} °C e mínima de ${minima.toFixed(1)} °C. Chance de chuva: ${chuva}%.`;

    const pDica = document.createElement("p");
    const strongDica = document.createElement("strong");
    strongDica.textContent = "Dica para o passeio: ";
    pDica.appendChild(strongDica);
    pDica.appendChild(document.createTextNode(obterDicaClima(atual, chuva)));

    container.appendChild(pResumo);
    container.appendChild(pDica);
  } catch {
    container.textContent = "A previsão do tempo não está disponível no momento.";
  } finally {
    if (btnAtualizar) btnAtualizar.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnAtualizar = document.getElementById("btn-atualizar-clima");
  if (document.getElementById("clima-resultado")) {
    carregarPrevisaoTempo();
  }
  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", carregarPrevisaoTempo);
  }
});
