// Script para gerar 20 jogadores aleatórios
const nomes = [
  'João', 'Pedro', 'Carlos', 'Lucas', 'Gabriel', 'Rafael', 'Felipe', 'Diego', 'Bruno', 'André',
  'Marcos', 'Thiago', 'Daniel', 'Rodrigo', 'Eduardo', 'Fernando', 'Gustavo', 'Leonardo', 'Vinicius', 'Matheus'
];

const sobrenomes = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'
];

const apelidos = [
  'Ney', 'Pelé', 'Ronaldinho', 'Kaká', 'Ronaldo', 'Romário', 'Zico', 'Sócrates', 'Falcão', 'Garrincha',
  'Tostão', 'Jairzinho', 'Rivelino', 'Carlos Alberto', 'Didi', 'Vavá', 'Mário', 'Ademir', 'Leônidas', 'Domingos'
];

const niveis = [1, 2, 3, 4, 5];
const probabilidades = [0.1, 0.2, 0.4, 0.2, 0.1]; // 10% nível 1, 20% nível 2, 40% nível 3, 20% nível 4, 10% nível 5

function gerarNumeroAleatorio() {
  return Math.floor(Math.random() * 10000000000).toString();
}

function gerarNivel() {
  const random = Math.random();
  let acumulado = 0;
  
  for (let i = 0; i < niveis.length; i++) {
    acumulado += probabilidades[i];
    if (random <= acumulado) {
      return niveis[i];
    }
  }
  return 3; // fallback
}

function gerarJogador() {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  const temApelido = Math.random() < 0.7; // 70% chance de ter apelido
  const apelido = temApelido ? apelidos[Math.floor(Math.random() * apelidos.length)] : undefined;
  
  // Gerar WhatsApp brasileiro
  const ddd = Math.floor(Math.random() * 90) + 10; // 10-99
  const numero = Math.floor(Math.random() * 900000000) + 100000000; // 100000000-999999999
  const whatsapp = `(${ddd}) ${numero.toString().slice(0, 5)}-${numero.toString().slice(5)}`;
  
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    nome,
    sobrenome,
    apelido,
    whatsapp,
    nivel: gerarNivel(),
    gols: 0,
    assistencias: 0,
    golsTotal: 0,
    assistenciasTotal: 0
  };
}

// Gerar 20 jogadores
const jogadores = [];
for (let i = 0; i < 20; i++) {
  jogadores.push(gerarJogador());
}

// Salvar no localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('jogadores', JSON.stringify(jogadores));
  console.log('✅ 20 jogadores criados e salvos no localStorage!');
  console.log('Jogadores:', jogadores);
} else {
  console.log('Jogadores gerados:', JSON.stringify(jogadores, null, 2));
}

// Exportar para uso no console do navegador
if (typeof window !== 'undefined') {
  window.jogadoresGerados = jogadores;
  console.log('💡 Use window.jogadoresGerados para acessar os jogadores');
}
