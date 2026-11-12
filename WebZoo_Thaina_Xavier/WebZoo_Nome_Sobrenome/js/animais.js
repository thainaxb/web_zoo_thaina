const STORAGE_FAVORITOS = "webzoo_animais_favoritos";

function lerFavoritos() {
  try {
    const salvo = localStorage.getItem(STORAGE_FAVORITOS);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
}

function salvarFavoritos(lista) {
  try {
    localStorage.setItem(STORAGE_FAVORITOS, JSON.stringify(lista));
  } catch {
    // Ignora falha de armazenamento em modo privado restrito
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll("#lista-animais .animal-card"));
  const selClasse = document.getElementById("filtro-classe");
  const selAlimentacao = document.getElementById("filtro-alimentacao");
  const selBioma = document.getElementById("filtro-bioma");
  const btnApenasFav = document.getElementById("btn-favoritos");
  const btnLimpar = document.getElementById("btn-limpar-filtros");
  const statusFiltros = document.getElementById("status-filtros");
  const msgVazia = document.getElementById("mensagem-vazia");

  let favoritos = lerFavoritos();
  let mostrarSomenteFavoritos = false;

  function atualizarBotoesFavoritos() {
    document.querySelectorAll(".btn-fav").forEach((btn) => {
      const id = btn.dataset.fav;
      const ativo = favoritos.includes(id);
      btn.setAttribute("aria-pressed", String(ativo));
      btn.textContent = ativo ? "Favoritado" : "Favoritar";
    });
  }

  function aplicarFiltros() {
    if (!selClasse || !selAlimentacao || !selBioma) return;

    const classe = selClasse.value;
    const alimentacao = selAlimentacao.value;
    const bioma = selBioma.value;
    let visiveis = 0;

    cards.forEach((card) => {
      const matchClasse = classe === "todos" || card.dataset.classe === classe;
      const matchAlim = alimentacao === "todos" || card.dataset.alimentacao === alimentacao;
      const biomasCard = (card.dataset.bioma || "").split(",");
      const matchBioma = bioma === "todos" || biomasCard.includes(bioma);
      const matchFav = !mostrarSomenteFavoritos || favoritos.includes(card.dataset.id);

      const exibir = matchClasse && matchAlim && matchBioma && matchFav;
      card.hidden = !exibir;
      if (exibir) visiveis += 1;
    });

    if (msgVazia) msgVazia.hidden = visiveis > 0;
    if (statusFiltros) {
      statusFiltros.textContent =
        visiveis === 1 ? "Exibindo 1 animal." : `Exibindo ${visiveis} animais.`;
    }
  }

  atualizarBotoesFavoritos();

  document.querySelectorAll(".btn-fav").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.fav;
      if (favoritos.includes(id)) {
        favoritos = favoritos.filter((item) => item !== id);
      } else {
        favoritos.push(id);
      }
      salvarFavoritos(favoritos);
      atualizarBotoesFavoritos();
      aplicarFiltros();
    });
  });

  [selClasse, selAlimentacao, selBioma].forEach((select) => {
    select?.addEventListener("change", aplicarFiltros);
  });

  btnApenasFav?.addEventListener("click", () => {
    mostrarSomenteFavoritos = !mostrarSomenteFavoritos;
    btnApenasFav.setAttribute("aria-pressed", String(mostrarSomenteFavoritos));
    aplicarFiltros();
  });

  btnLimpar?.addEventListener("click", () => {
    if (selClasse) selClasse.value = "todos";
    if (selAlimentacao) selAlimentacao.value = "todos";
    if (selBioma) selBioma.value = "todos";
    mostrarSomenteFavoritos = false;
    btnApenasFav?.setAttribute("aria-pressed", "false");
    aplicarFiltros();
  });

  // Integração com a API REST da Wikipédia (botão Saiba mais)
  document.querySelectorAll(".btn-wiki").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const verbete = btn.dataset.wiki;
      const target = document.getElementById(btn.dataset.target);
      if (!verbete || !target) return;

      if (!target.hidden && target.dataset.loaded === "true") {
        target.hidden = true;
        return;
      }

      target.hidden = false;
      btn.disabled = true;
      target.textContent = "Consultando resumo na Wikipédia...";

      try {
        const response = await fetch(
          `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(verbete)}`
        );
        if (!response.ok) {
          throw new Error("Erro HTTP Wikipédia");
        }

        const data = await response.json();
        if (!data.extract) {
          throw new Error("Resumo indisponível");
        }

        target.textContent = "";
        const pTexto = document.createElement("p");
        pTexto.textContent = data.extract;
        target.appendChild(pTexto);

        const pageUrl = data?.content_urls?.desktop?.page;
        if (pageUrl) {
          const link = document.createElement("a");
          link.href = pageUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "Ler artigo completo na Wikipédia";
          target.appendChild(link);
        }

        target.dataset.loaded = "true";
      } catch {
        target.textContent = "Não foi possível carregar o resumo da Wikipédia no momento.";
      } finally {
        btn.disabled = false;
      }
    });
  });
});
