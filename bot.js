const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');

const caminhoNumeros = path.join(__dirname, 'numeros.txt');
const caminhoErros = path.join(__dirname, 'erros.txt');
const pastaMensagens = path.join(__dirname, 'mensagens');

// Função delay (pausa)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Delay aleatório entre min e max (em milissegundos)
function delayAleatorio(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

// Ler mensagem de arquivo
function lerMensagem(caminho) {
  if (!fs.existsSync(caminho)) {
    console.error('❌ Arquivo de mensagem não encontrado:', caminho);
    process.exit(1);
  }
  return fs.readFileSync(caminho, 'utf8');
}

// Carregar todas as mensagens da pasta /mensagens
function carregarMensagens() {
  const mensagens = [];
  for (let i = 1; i <= 10; i++) {
    const arquivo = path.join(pastaMensagens, `${i}.txt`);
    mensagens.push(lerMensagem(arquivo));
  }
  return mensagens;
}

// Pega uma mensagem aleatória do array
function escolherMensagemAleatoria(mensagens) {
  const index = Math.floor(Math.random() * mensagens.length);
  return mensagens[index];
}

// Ler números do arquivo e retornar array limpo
function lerNumerosDoArquivo(caminho) {
  if (!fs.existsSync(caminho)) {
    console.error('❌ Arquivo de números não encontrado:', caminho);
    process.exit(1);
  }
  const conteudo = fs.readFileSync(caminho, 'utf8');
  const linhas = conteudo.split(/\r?\n/).map(linha => linha.trim());
  return linhas.filter(numero => numero.length > 0);
}

// Formatar número para padrão internacional com DDI 55 (Brasil)
function formatarNumero(numero) {
  let num = numero.replace(/\D/g, ''); // remove tudo que não for dígito
  if (!num.startsWith('55')) {
    num = '55' + num;
  }
  return num;
}

// Salvar erro em arquivo
function salvarErro(numero, erro) {
  const texto = `Número: ${numero} - Erro: ${erro}\n`;
  fs.appendFileSync(caminhoErros, texto, 'utf8');
}

// Função principal
async function start(client) {
  const mensagens = carregarMensagens();
  let numeros = lerNumerosDoArquivo(caminhoNumeros).map(formatarNumero);

  console.log(`🔎 Total de números: ${numeros.length}`);
  console.log(`📥 Mensagens carregadas: ${mensagens.length}`);

  for (const numero of numeros) {
    const mensagem = escolherMensagemAleatoria(mensagens);

    try {
      await client.sendText(`${numero}@c.us`, mensagem);
      console.log(`✅ Mensagem enviada para: ${numero}`);
    } catch (erro) {
      console.error(`❌ Erro ao enviar para ${numero}:`, erro.message || erro);
      salvarErro(numero, erro.message || erro);
    }

    const tempoEspera = delayAleatorio(30000, 120000); // 30s a 2min
    console.log(`⏳ Aguardando ${Math.round(tempoEspera / 1000)} segundos...`);
    await delay(tempoEspera);
  }

  console.log('🎉 Todas as mensagens foram enviadas ou tentadas!');
}

// Inicializa o venom
venom
  .create({
    session: 'iptv-bot',
    headless: true,
    useChrome: true,
    browserArgs: ['--no-sandbox'],
    disableSpins: true,
    disableWelcome: true,
    updatesLog: false
  })
  .then(client => start(client))
  .catch(erro => {
    console.error('❌ Erro ao iniciar o cliente:', erro);
  });
