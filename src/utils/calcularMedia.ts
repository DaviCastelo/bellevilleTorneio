import { Jogador, Time } from '@/types';

export function calcularMediaNivel(jogadores: Jogador[]): number {
  if (jogadores.length === 0) return 0;
  
  const somaNiveis = jogadores.reduce((acc, jogador) => acc + jogador.nivel, 0);
  return Number((somaNiveis / jogadores.length).toFixed(1));
}

export function calcularMediaGols(jogadores: Jogador[]): number {
  if (jogadores.length === 0) return 0;
  
  const totalGols = jogadores.reduce((acc, jogador) => acc + (jogador.gols || 0), 0);
  return Number((totalGols / jogadores.length).toFixed(1));
}

export function calcularMediaAssistencias(jogadores: Jogador[]): number {
  if (jogadores.length === 0) return 0;
  
  const totalAssistencias = jogadores.reduce((acc, jogador) => acc + (jogador.assistencias || 0), 0);
  return Number((totalAssistencias / jogadores.length).toFixed(1));
}

export function calcularSaldoGols(time: Time): number {
  return time.golsMarcados - time.golsSofridos;
}

export function ordenarTimesPorClassificacao(times: Time[]): Time[] {
  return [...times].sort((a, b) => {
    // Primeiro critério: pontos
    if (b.pontos !== a.pontos) {
      return b.pontos - a.pontos;
    }
    
    // Segundo critério: saldo de gols
    const saldoA = calcularSaldoGols(a);
    const saldoB = calcularSaldoGols(b);
    if (saldoB !== saldoA) {
      return saldoB - saldoA;
    }
    
    // Terceiro critério: gols marcados
    if (b.golsMarcados !== a.golsMarcados) {
      return b.golsMarcados - a.golsMarcados;
    }
    
    // Quarto critério: gols sofridos (menor é melhor)
    return a.golsSofridos - b.golsSofridos;
  });
}

export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

export function validarWhatsApp(whatsapp: string): boolean {
  // Remove todos os caracteres não numéricos
  const numeros = whatsapp.replace(/\D/g, '');
  // Verifica se tem entre 10 e 15 dígitos (formato brasileiro)
  return numeros.length >= 10 && numeros.length <= 15;
}

export function formatarWhatsApp(whatsapp: string): string {
  const numeros = whatsapp.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    // Formato: (XX) 9XXXX-XXXX
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } else if (numeros.length === 10) {
    // Formato: (XX) XXXX-XXXX
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  
  return whatsapp;
}
