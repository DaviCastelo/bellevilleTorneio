import { Jogador, Torneio, Partida } from '@/types';

const STORAGE_KEYS = {
  JOGADORES: 'jogadores',
  TORNEIO: 'torneio',
  PARTIDAS: 'partidas',
  SELECAO: 'selecao'
} as const;

export class StorageManager {
  // Jogadores
  static getJogadores(): Jogador[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.JOGADORES);
    return data ? JSON.parse(data) : [];
  }

  static setJogadores(jogadores: Jogador[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.JOGADORES, JSON.stringify(jogadores));
  }

  static addJogador(jogador: Jogador): void {
    const jogadores = this.getJogadores();
    jogadores.push(jogador);
    this.setJogadores(jogadores);
  }

  static updateJogador(id: string, jogadorAtualizado: Jogador): void {
    const jogadores = this.getJogadores();
    const index = jogadores.findIndex(j => j.id === id);
    if (index !== -1) {
      jogadores[index] = jogadorAtualizado;
      this.setJogadores(jogadores);
    }
  }

  static deleteJogador(id: string): void {
    const jogadores = this.getJogadores();
    const jogadoresFiltrados = jogadores.filter(j => j.id !== id);
    this.setJogadores(jogadoresFiltrados);
  }

  // Torneio
  static getTorneio(): Torneio | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.TORNEIO);
    return data ? JSON.parse(data) : null;
  }

  static setTorneio(torneio: Torneio): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TORNEIO, JSON.stringify(torneio));
  }

  static clearTorneio(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.TORNEIO);
  }

  // Seleção
  static getSelecao(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SELECAO);
    return data ? JSON.parse(data) : [];
  }

  static setSelecao(jogadorIds: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SELECAO, JSON.stringify(jogadorIds));
  }

  static addJogadorSelecao(jogadorId: string): void {
    const selecao = this.getSelecao();
    if (!selecao.includes(jogadorId) && selecao.length < 20) {
      selecao.push(jogadorId);
      this.setSelecao(selecao);
    }
  }

  static removeJogadorSelecao(jogadorId: string): void {
    const selecao = this.getSelecao();
    const selecaoFiltrada = selecao.filter(id => id !== jogadorId);
    this.setSelecao(selecaoFiltrada);
  }

  static clearSelecao(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SELECAO);
  }

  // Partidas
  static getPartidas(): Partida[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PARTIDAS);
    return data ? JSON.parse(data) : [];
  }

  static setPartidas(partidas: Partida[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PARTIDAS, JSON.stringify(partidas));
  }

  static updatePartida(partidaId: string, partidaAtualizada: Partial<Partida>): void {
    const partidas = this.getPartidas();
    const index = partidas.findIndex(p => p.id === partidaId);
    if (index !== -1) {
      partidas[index] = { ...partidas[index], ...partidaAtualizada };
      this.setPartidas(partidas);
    }
  }

  // Limpar todos os dados
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
