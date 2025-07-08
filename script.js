
function somenteNumeros(selector) {
  const input = document.querySelector(selector);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, ""); 
  });
}


somenteNumeros("#numeroOS");
somenteNumeros("#telefone");
somenteNumeros("#cnpj");


document.getElementById("btnAbrirOS").addEventListener("click", () => {
  const numeroOS = document.getElementById("numeroOS").value.trim();
  const tecnico = document.getElementById("tecnico").value.trim();
  const cliente = document.getElementById("cliente").value.trim();
  const cnpj = document.getElementById("cnpj").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const email = document.getElementById("email").value.trim();
  const data = document.getElementById("data").value.trim();

  if (!numeroOS || !tecnico || !cliente || !cnpj || !telefone || !endereco || !email || !data) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Digite um e-mail válido.");
    return;
  }


  const telefoneRegex = /^\d{10,11}$/;
  if (!telefoneRegex.test(telefone)) {
    alert("Digite um telefone válido (somente números).");
    return;
  }

 
  const cnpjRegex = /^\d{14}$/;
  if (!cnpjRegex.test(cnpj)) {
    alert("Digite um CNPJ válido com 14 números.");
    return;
  }

  const funcionalidadeSelecionada = document.querySelector('input[name="funcionalidade"]:checked');
  if (!funcionalidadeSelecionada) {
    alert("Selecione uma funcionalidade.");
    return;
  }

  const funcionalidade = funcionalidadeSelecionada.value.toLowerCase();

  const dadosOS = {
    numeroOS,
    tecnico,
    cliente,
    cnpj,
    telefone,
    endereco,
    email,
    data,
    funcionalidades: [funcionalidade]
  };

  localStorage.setItem("dadosOS", JSON.stringify(dadosOS));

  const rotas = {
    "pdv web automação": "ordem-servico.html",
    "c-plus": "cplus.html",
    "ezpoint": "ezpoint.html",
    "totvs": "totvs.html"
  };

  if (rotas[funcionalidade]) {
    window.location.href = rotas[funcionalidade];
  } else {
    window.location.href = "ordem-servico.html";
  }
});
