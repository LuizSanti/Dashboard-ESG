// const BASE_URL = "https://terrabrasilis.dpi.inpe.br/geoserver/ows?";
// const ANO = 2025; // ano que você quer filtrar
// let grafico = null; // variável global pra guardar o gráfico Chart.js

// // Função genérica para buscar dados WFS (retorna array de features)
// async function carregarDados(typeName) {
//   const url =
//     BASE_URL +
//     "service=WFS&version=1.0.0&request=GetFeature" +
//     `&typeName=${typeName}` +
//     "&outputFormat=application/json" +
//     `&CQL_FILTER=view_date >= '${ANO}-01-01' AND view_date <= '${ANO}-12-31'`;

//   const resp = await fetch(url);
//   if (!resp.ok) throw new Error("Erro na requisição: " + resp.status);
//   const json = await resp.json();
//   return json.features || [];
// }

// // Atualiza o card exibindo apenas o número de alertas
// function atualizarCard(totalAlertas) {
//   const el = document.getElementById("desmatamento-geral");
//   // mostra algo do tipo: 56.959 alertas
//   el.textContent = `${totalAlertas.toLocaleString("pt-BR")} alertas`;
// }

// // Monta o gráfico de barras (contagem por estado)
// function montarGrafico(featuresA, featuresC) {
//   const estados = {};

//   featuresA.forEach(f => {
//     const uf = (f.properties && (f.properties.uf || f.properties.UF)) || "N/A";
//     estados[uf] = estados[uf] || { amazonia: 0, cerrado: 0 };
//     estados[uf].amazonia++;
//   });

//   featuresC.forEach(f => {
//     const uf = (f.properties && (f.properties.uf || f.properties.UF)) || "N/A";
//     estados[uf] = estados[uf] || { amazonia: 0, cerrado: 0 };
//     estados[uf].cerrado++;
//   });

//   const labels = Object.keys(estados).sort();
//   const dadosA = labels.map(l => estados[l].amazonia);
//   const dadosC = labels.map(l => estados[l].cerrado);

//   if (grafico) grafico.destroy(); // se já existir, destrói antes de recriar
//   const ctx = document.getElementById("graficoDesmatamento").getContext("2d");
//   grafico = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels,
//       datasets: [
//         { label: "Amazônia", data: dadosA, backgroundColor: "#27ae60" },
//         { label: "Cerrado", data: dadosC, backgroundColor: "#e67e22" }
//       ]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         y: { beginAtZero: true }
//       }
//     }
//   });
// }

// // Função principal: busca os dois conjuntos, atualiza card e gráfico
// async function carregarBrasil() {
//   try {
//     const amazonia = await carregarDados("deter-amz:deter_amz");
//     const cerrado = await carregarDados("deter-cerrado-nb:deter_cerrado");

//     const total = amazonia.length + cerrado.length;
//     atualizarCard(total);
//     montarGrafico(amazonia, cerrado);
//   } catch (err) {
//     console.error(err);
//     const el = document.getElementById("desmatamento-geral");
//     if (el) el.textContent = "Erro ao carregar";
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   carregarBrasil();
// });

const BASE_URL = "https://terrabrasilis.dpi.inpe.br/geoserver/ows?";
const ANO = 2025;

async function carregarDados(typeName) {
  const url = 
    BASE_URL +
    "service=WFS&version=1.0.0&request=GetFeature" +
    `&typeName=${typeName}` +
    "&outputFormat=application/json" +
    `&CQL_FILTER=view_date >= '${ANO}-01-01' AND view_date <= '${ANO}-12-31'`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Erro na requisição: " + resp.status);
  const json = await resp.json();
  return json.features || [];
}

function atualizarCard(totalAlertas) {
  const el = document.getElementById("desmatamento-geral");
  el.textContent = `${totalAlertas.toLocaleString("pt-BR")} alertas`;
}

async function carregarBrasil() {
  try {
    const amazonia = await carregarDados("deter-amz:deter_amz")
    const cerrado = await carregarDados("deter-cerrado:deter_cerrado")

    const total = amazonia.length + cerrado.length
    atualizarCard(total);
  } catch (error) {
    console.log(error)
    const el = document.getElementById("desmatamento-geral")
    if (el) el.textContent = "Erro ao carregar"
  }
}

carregarBrasil();