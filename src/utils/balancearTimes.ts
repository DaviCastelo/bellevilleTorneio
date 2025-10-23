import { Jogador, Time } from '@/types';

export function balancearTimes(jogadores: Jogador[]): Time[] {
  if (jogadores.length < 4) {
    throw new Error('É necessário pelo menos 4 jogadores para formar times');
  }

  // Ordena jogadores por nível (maior para menor)
  const ordenados = [...jogadores].sort((a, b) => b.nivel - a.nivel);
  
  // Cria 4 times vazios
  const times: Time[] = [
    { id: '1', nome: 'Verde', jogadores: [], gols: 0, assistencias: 0, pontos: 0, nivelMedio: 0, golsMarcados: 0, golsSofridos: 0 },
    { id: '2', nome: 'Amarelo', jogadores: [], gols: 0, assistencias: 0, pontos: 0, nivelMedio: 0, golsMarcados: 0, golsSofridos: 0 },
    { id: '3', nome: 'Branco', jogadores: [], gols: 0, assistencias: 0, pontos: 0, nivelMedio: 0, golsMarcados: 0, golsSofridos: 0 },
    { id: '4', nome: 'Azul', jogadores: [], gols: 0, assistencias: 0, pontos: 0, nivelMedio: 0, golsMarcados: 0, golsSofridos: 0 }
  ];

  // Distribui jogadores alternando entre os times
  for (let i = 0; i < ordenados.length; i++) {
    const timeIndex = i % 4;
    times[timeIndex].jogadores.push(ordenados[i]);
  }

  // Calcula nível médio de cada time
  times.forEach(time => {
    if (time.jogadores.length > 0) {
      const somaNiveis = time.jogadores.reduce((acc, jogador) => acc + jogador.nivel, 0);
      time.nivelMedio = Number((somaNiveis / time.jogadores.length).toFixed(1));
    }
  });

  return times;
}

export function calcularMediaNiveis(times: Time[]): number {
  const totalNiveis = times.reduce((acc, time) => acc + time.nivelMedio, 0);
  return Number((totalNiveis / times.length).toFixed(1));
}

export function verificarBalanceamento(times: Time[]): boolean {
  const medias = times.map(time => time.nivelMedio);
  const mediaGeral = calcularMediaNiveis(times);
  const diferencaMaxima = Math.max(...medias) - Math.min(...medias);
  
  // Considera balanceado se a diferença entre o maior e menor nível médio for <= 1.0
  return diferencaMaxima <= 1.0;
}
