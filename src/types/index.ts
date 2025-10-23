export interface Jogador {
  id: string;
  nome: string;
  sobrenome: string;
  apelido?: string;
  whatsapp: string;
  nivel: number; // 1–5
  gols?: number; // Estatísticas do torneio atual
  assistencias?: number; // Estatísticas do torneio atual
  golsTotal?: number; // Estatísticas totais acumuladas
  assistenciasTotal?: number; // Estatísticas totais acumuladas
}

export interface Time {
  id: string;
  nome: string; // Ex: "Verde", "Amarelo", "Branco", "Azul"
  jogadores: Jogador[];
  gols: number;
  assistencias: number;
  pontos: number;
  nivelMedio: number;
  golsMarcados: number;
  golsSofridos: number;
}

export interface Partida {
  id: string;
  timeA: string;
  timeB: string;
  golsA: number;
  golsB: number;
  tempoRestante: number;
  fase: 'inicial' | 'semifinal' | 'final';
  jogada: boolean;
  finalizada: boolean;
  partidaIda?: boolean; // true para ida, false para volta
  semifinalId?: number; // 1 ou 2 para identificar qual semifinal
}

export interface Torneio {
  id: string;
  times: Time[];
  partidas: Partida[];
  faseAtual: 'inicial' | 'semifinal' | 'final' | 'concluido';
  campeao?: string;
  iniciado: boolean;
}

export interface EstatisticasJogador {
  jogadorId: string;
  gols: number;
  assistencias: number;
  partidasJogadas: number;
}

export type NivelHabilidade = 1 | 2 | 3 | 4 | 5;

export const NIVEL_LABELS: Record<NivelHabilidade, string> = {
  1: 'Ruim',
  2: 'Fraco', 
  3: 'Intermediário',
  4: 'Avançado',
  5: 'Craque'
};

export const NIVEL_COLORS: Record<NivelHabilidade, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-green-500'
};
