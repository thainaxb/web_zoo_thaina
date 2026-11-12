function formatarCep(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  if (digitos.length > 5) {
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  }
  return digitos;
}

async function consultarViaCep(cepLimpo) {
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!response.ok) {
    throw new Error("Erro HTTP ao consultar ViaCEP");
  }
  const data = await response.json();
  if (data.erro) {
    return null;
  }
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Consulta na página Visite
  const formVisita = document.getElementById("form-cep-visita");
  const inputVisita = document.getElementById("cep-visita");
  const btnVisita = document.getElementById("btn-buscar-cep-visita");
  const statusVisita = document.getElementById("cep-visita-status");

  if (inputVisita) {
    inputVisita.addEventListener("input", () => {
      inputVisita.value = formatarCep(inputVisita.value);
    });
  }

  if (formVisita && inputVisita && btnVisita && statusVisita) {
    formVisita.addEventListener("submit", async (event) => {
      event.preventDefault();
      const cepLimpo = inputVisita.value.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        statusVisita.textContent = "Digite um CEP com 8 números.";
        inputVisita.setAttribute("aria-invalid", "true");
        inputVisita.focus();
        return;
      }

      inputVisita.removeAttribute("aria-invalid");
      btnVisita.disabled = true;
      statusVisita.textContent = "Buscando endereço...";

      try {
        const endereco = await consultarViaCep(cepLimpo);
        if (!endereco) {
          statusVisita.textContent = "Não encontramos esse CEP. Confira os números e tente novamente.";
          return;
        }
        const rua = endereco.logradouro || "logradouro não informado";
        const bairro = endereco.bairro || "bairro não informado";
        statusVisita.textContent = `Você vai sair de ${rua}, ${bairro} - ${endereco.localidade}/${endereco.uf}.`;
      } catch {
        statusVisita.textContent = "Não foi possível consultar o CEP agora. Tente novamente em instantes.";
      } finally {
        btnVisita.disabled = false;
      }
    });
  }

  // 2. Autopreenchimento na página Participe
  const inputCepForm = document.getElementById("cep");
  const btnCepForm = document.getElementById("btn-buscar-cep-form");
  const erroCepForm = document.getElementById("erro-cep");

  async function preencherEnderecoFormulario() {
    if (!inputCepForm || !erroCepForm) return;
    const cepLimpo = inputCepForm.value.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      erroCepForm.textContent = "Digite um CEP com 8 números.";
      inputCepForm.setAttribute("aria-invalid", "true");
      inputCepForm.focus();
      return;
    }

    inputCepForm.removeAttribute("aria-invalid");
    if (btnCepForm) btnCepForm.disabled = true;
    erroCepForm.textContent = "Buscando endereço...";

    try {
      const endereco = await consultarViaCep(cepLimpo);
      if (!endereco) {
        erroCepForm.textContent = "Não encontramos esse CEP. Confira os números e tente novamente.";
        return;
      }
      erroCepForm.textContent = "";
      document.getElementById("rua").value = endereco.logradouro || "";
      document.getElementById("bairro").value = endereco.bairro || "";
      document.getElementById("cidade").value = endereco.localidade || "";
      document.getElementById("estado").value = endereco.uf || "";
      document.getElementById("numero").focus();
    } catch {
      erroCepForm.textContent = "Não foi possível consultar o CEP agora. Tente novamente em instantes.";
    } finally {
      if (btnCepForm) btnCepForm.disabled = false;
    }
  }

  if (btnCepForm) {
    btnCepForm.addEventListener("click", preencherEnderecoFormulario);
  }
});
