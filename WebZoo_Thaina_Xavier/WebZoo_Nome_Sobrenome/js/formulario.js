function aplicarMascaraTelefone(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length > 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length > 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  if (digitos.length > 2) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  return digitos;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-participacao");
  if (!form) return;

  const inputCep = document.getElementById("cep");
  const inputTelefone = document.getElementById("telefone");
  const inputMensagem = document.getElementById("mensagem");
  const contadorMensagem = document.getElementById("contador-mensagem");
  const bannerSucesso = document.getElementById("mensagem-sucesso");

  inputCep?.addEventListener("input", () => {
    const digitos = inputCep.value.replace(/\D/g, "").slice(0, 8);
    inputCep.value = digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
  });

  inputTelefone?.addEventListener("input", () => {
    inputTelefone.value = aplicarMascaraTelefone(inputTelefone.value);
  });

  inputMensagem?.addEventListener("input", () => {
    if (contadorMensagem) {
      contadorMensagem.textContent = `${inputMensagem.value.length} / 500 caracteres`;
    }
  });

  function definirErro(campoId, erroId, mensagem) {
    const campo = document.getElementById(campoId);
    const erro = document.getElementById(erroId);
    if (!campo || !erro) return Boolean(mensagem);

    erro.textContent = mensagem;
    if (mensagem) {
      campo.setAttribute("aria-invalid", "true");
      return true;
    }
    campo.removeAttribute("aria-invalid");
    return false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (bannerSucesso) {
      bannerSucesso.hidden = true;
      bannerSucesso.textContent = "";
    }

    const primeiroInvalido = [];

    const nome = document.getElementById("nome").value.trim();
    if (!nome) {
      if (definirErro("nome", "erro-nome", "Preencha este campo.")) primeiroInvalido.push("nome");
    } else if (nome.split(/\s+/).length < 2) {
      if (definirErro("nome", "erro-nome", "Informe o nome completo.")) primeiroInvalido.push("nome");
    } else {
      definirErro("nome", "erro-nome", "");
    }

    const email = document.getElementById("email").value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email) {
      if (definirErro("email", "erro-email", "Preencha este campo.")) primeiroInvalido.push("email");
    } else if (!emailValido) {
      if (definirErro("email", "erro-email", "Informe um e-mail válido, como nome@exemplo.com.")) primeiroInvalido.push("email");
    } else {
      definirErro("email", "erro-email", "");
    }

    const cepDigitos = document.getElementById("cep").value.replace(/\D/g, "");
    if (cepDigitos.length !== 8) {
      if (definirErro("cep", "erro-cep", "Digite um CEP com 8 números.")) primeiroInvalido.push("cep");
    } else {
      definirErro("cep", "erro-cep", "");
    }

    [
      ["rua", "erro-rua"],
      ["numero", "erro-numero"],
      ["bairro", "erro-bairro"],
      ["cidade", "erro-cidade"],
      ["estado", "erro-estado"]
    ].forEach(([idCampo, idErro]) => {
      const valor = document.getElementById(idCampo).value.trim();
      if (!valor) {
        if (definirErro(idCampo, idErro, "Preencha este campo.")) primeiroInvalido.push(idCampo);
      } else {
        definirErro(idCampo, idErro, "");
      }
    });

    const assunto = document.getElementById("assunto").value;
    if (!assunto) {
      if (definirErro("assunto", "erro-assunto", "Selecione um assunto.")) primeiroInvalido.push("assunto");
    } else {
      definirErro("assunto", "erro-assunto", "");
    }

    const mensagem = document.getElementById("mensagem").value.trim();
    if (!mensagem) {
      if (definirErro("mensagem", "erro-mensagem", "Preencha este campo.")) primeiroInvalido.push("mensagem");
    } else if (mensagem.length < 10) {
      if (definirErro("mensagem", "erro-mensagem", "Escreva uma mensagem com pelo menos 10 caracteres.")) primeiroInvalido.push("mensagem");
    } else {
      definirErro("mensagem", "erro-mensagem", "");
    }

    const aceite = document.getElementById("aceite").checked;
    if (!aceite) {
      if (definirErro("aceite", "erro-aceite", "Preencha este campo.")) primeiroInvalido.push("aceite");
    } else {
      definirErro("aceite", "erro-aceite", "");
    }

    if (primeiroInvalido.length > 0) {
      document.getElementById(primeiroInvalido[0])?.focus();
      return;
    }

    if (bannerSucesso) {
      bannerSucesso.textContent = `Cadastro recebido! Obrigado por participar do WebZoo, ${nome}. Este formulário é demonstrativo: nenhum dado foi enviado ou armazenado.`;
      bannerSucesso.hidden = false;
      bannerSucesso.focus();
    }

    form.reset();
    if (contadorMensagem) contadorMensagem.textContent = "0 / 500 caracteres";
  });
});
