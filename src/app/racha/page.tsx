'use client';

import { useState, useEffect } from 'react';
import { Torneio, Partida, Jogador, Time } from '@/types';
import { StorageManager } from '@/utils/storage';
import { gerarId, ordenarTimesPorClassificacao } from '@/utils/calcularMedia';
import TeamCard from '@/components/TeamCard';
import Timer from '@/components/Timer';
import StatsSummary from '@/components/StatsSummary';
import Navigation from '@/components/Navigation';
import { 
  Play, 
  Pause, 
  Trophy, 
  Clock, 
  Target, 
  Users, 
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function RachaPage() {
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [partidaAtual, setPartidaAtual] = useState<Partida | null>(null);
  const [fase, setFase] = useState<'inicial' | 'semifinal' | 'final' | 'concluido'>('inicial');
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  // Carrega dados do localStorage
  useEffect(() => {
    const torneioCarregado = StorageManager.getTorneio();
    const jogadoresCarregados = StorageManager.getJogadores();
    
    if (torneioCarregado) {
      setTorneio(torneioCarregado);
      setFase(torneioCarregado.faseAtual);
    }
    
    setJogadores(jogadoresCarregados);
  }, []);

  // Gera partidas da fase inicial
  const gerarPartidasIniciais = (times: Time[]): Partida[] => {
    const partidas: Partida[] = [];
    
    // Cada time joga contra os outros 3 times
    for (let i = 0; i < times.length; i++) {
      for (let j = i + 1; j < times.length; j++) {
        partidas.push({
          id: gerarId(),
          timeA: times[i].id,
          timeB: times[j].id,
          golsA: 0,
          golsB: 0,
          tempoRestante: 420, // 7 minutos em segundos
          fase: 'inicial',
          jogada: false,
          finalizada: false
        });
      }
    }
    
    return partidas;
  };

  // Gera partidas das semifinais (ida e volta)
  const gerarPartidasSemifinais = (times: Time[]): Partida[] => {
    const classificacao = ordenarTimesPorClassificacao(times);
    
    return [
      // Semifinal 1 - Ida: 1º vs 4º
      {
        id: gerarId(),
        timeA: classificacao[0].id, // 1º lugar
        timeB: classificacao[3].id, // 4º lugar
        golsA: 0,
        golsB: 0,
        tempoRestante: 480, // 8 minutos em segundos
        fase: 'semifinal',
        jogada: false,
        finalizada: false,
        partidaIda: true,
        semifinalId: 1
      },
      // Semifinal 1 - Volta: 4º vs 1º
      {
        id: gerarId(),
        timeA: classificacao[3].id, // 4º lugar
        timeB: classificacao[0].id, // 1º lugar
        golsA: 0,
        golsB: 0,
        tempoRestante: 480,
        fase: 'semifinal',
        jogada: false,
        finalizada: false,
        partidaIda: false,
        semifinalId: 1
      },
      // Semifinal 2 - Ida: 2º vs 3º
      {
        id: gerarId(),
        timeA: classificacao[1].id, // 2º lugar
        timeB: classificacao[2].id, // 3º lugar
        golsA: 0,
        golsB: 0,
        tempoRestante: 480,
        fase: 'semifinal',
        jogada: false,
        finalizada: false,
        partidaIda: true,
        semifinalId: 2
      },
      // Semifinal 2 - Volta: 3º vs 2º
      {
        id: gerarId(),
        timeA: classificacao[2].id, // 3º lugar
        timeB: classificacao[1].id, // 2º lugar
        golsA: 0,
        golsB: 0,
        tempoRestante: 480,
        fase: 'semifinal',
        jogada: false,
        finalizada: false,
        partidaIda: false,
        semifinalId: 2
      }
    ];
  };

  // Gera partidas da final (ida e volta)
  const gerarPartidasFinal = (timeA: string, timeB: string): Partida[] => {
    return [
      // Final - Ida
      {
      id: gerarId(),
      timeA,
      timeB,
      golsA: 0,
      golsB: 0,
      tempoRestante: 480, // 8 minutos em segundos
      fase: 'final',
      jogada: false,
        finalizada: false,
        partidaIda: true
      },
      // Final - Volta
      {
        id: gerarId(),
        timeA: timeB,
        timeB: timeA,
        golsA: 0,
        golsB: 0,
        tempoRestante: 480,
        fase: 'final',
        jogada: false,
        finalizada: false,
        partidaIda: false
      }
    ];
  };

  const iniciarTorneio = () => {
    if (!torneio) return;

    // Zera as estatísticas dos jogadores para o novo torneio
    const jogadoresComStatsZeradas = jogadores.map(jogador => ({
      ...jogador,
      gols: 0,
      assistencias: 0
    }));

    // Atualiza os times com jogadores com estatísticas zeradas
    const timesComStatsZeradas = torneio.times.map(time => ({
      ...time,
      jogadores: time.jogadores.map(jogador => ({
        ...jogador,
        gols: 0,
        assistencias: 0
      })),
      gols: 0,
      assistencias: 0,
      pontos: 0,
      golsMarcados: 0,
      golsSofridos: 0
    }));

    const partidasIniciais = gerarPartidasIniciais(timesComStatsZeradas);
    const novoTorneio: Torneio = {
      ...torneio,
      times: timesComStatsZeradas,
      partidas: partidasIniciais,
      faseAtual: 'inicial' as const,
      iniciado: true
    };

    // Salva as estatísticas zeradas
    StorageManager.setJogadores(jogadoresComStatsZeradas);
    StorageManager.setTorneio(novoTorneio);
    setJogadores(jogadoresComStatsZeradas);
    setTorneio(novoTorneio);
    setFase('inicial');
  };

  const avancarFase = () => {
    if (!torneio) return;

    let novoTorneio = { ...torneio };
    let novaFase = fase;

    if (fase === 'inicial') {
      // Avança para semifinais
      const partidasSemifinais = gerarPartidasSemifinais(torneio.times);
      novoTorneio.partidas = [...torneio.partidas, ...partidasSemifinais];
      novoTorneio.faseAtual = 'semifinal' as const;
      novaFase = 'semifinal';
    } else if (fase === 'semifinal') {
      // Avança para final
      console.log('Tentando avançar das semifinais para final...');
      const vencedores = obterVencedoresSemifinais(torneio.partidas);
      console.log('Vencedores obtidos:', vencedores);
      
      if (vencedores.length === 2) {
        console.log('Criando partidas da final...');
        const partidasFinal = gerarPartidasFinal(vencedores[0], vencedores[1]);
        novoTorneio.partidas = [...torneio.partidas, ...partidasFinal];
      novoTorneio.faseAtual = 'final' as const;
      novaFase = 'final';
        console.log('Final criada com sucesso!');
      } else {
        console.log('Erro: Não foi possível obter 2 vencedores das semifinais');
      }
    } else if (fase === 'final') {
      // Torneio concluído
      const campeao = obterCampeaoFinal(torneio.partidas);
      if (campeao) {
        novoTorneio.campeao = campeao;
      novoTorneio.faseAtual = 'concluido' as const;
      novaFase = 'concluido';
      }
    }

    StorageManager.setTorneio(novoTorneio);
    setTorneio(novoTorneio);
    setFase(novaFase);
  };

  const atualizarPlacar = (partidaId: string, time: 'A' | 'B', operacao: 'incrementar' | 'decrementar') => {
    if (!torneio) return;

    const partidasAtualizadas = torneio.partidas.map(partida => {
      if (partida.id === partidaId) {
        const novoPlacar = { ...partida };
        if (time === 'A') {
          novoPlacar.golsA = Math.max(0, novoPlacar.golsA + (operacao === 'incrementar' ? 1 : -1));
        } else {
          novoPlacar.golsB = Math.max(0, novoPlacar.golsB + (operacao === 'incrementar' ? 1 : -1));
        }
        return novoPlacar;
      }
      return partida;
    });

    const novoTorneio = { ...torneio, partidas: partidasAtualizadas };
    StorageManager.setTorneio(novoTorneio);
    setTorneio(novoTorneio);
  };

  const finalizarPartida = (partidaId: string) => {
    if (!torneio) return;

    const novoTorneio = { ...torneio };

    const partidasAtualizadas = torneio.partidas.map(partida => {
      if (partida.id === partidaId) {
        const partidaFinalizada = { ...partida, finalizada: true };
        
        // Atualiza pontos dos times
        const timesAtualizados = torneio.times.map(time => {
          if (time.id === partida.timeA || time.id === partida.timeB) {
            const novoTime = { ...time };
            
            if (partida.timeA === time.id) {
              if (partida.golsA > partida.golsB) {
                novoTime.pontos += 3;
              } else if (partida.golsA === partida.golsB) {
                novoTime.pontos += 1;
              }
              novoTime.golsMarcados += partida.golsA;
              novoTime.golsSofridos += partida.golsB;
            } else {
              if (partida.golsB > partida.golsA) {
                novoTime.pontos += 3;
              } else if (partida.golsA === partida.golsB) {
                novoTime.pontos += 1;
              }
              novoTime.golsMarcados += partida.golsB;
              novoTime.golsSofridos += partida.golsA;
            }
            
            return novoTime;
          }
          return time;
        });

        novoTorneio.times = timesAtualizados;
        return partidaFinalizada;
      }
      return partida;
    });

    novoTorneio.partidas = partidasAtualizadas;
    StorageManager.setTorneio(novoTorneio);
    setTorneio(novoTorneio);
  };

  const atualizarGolsJogador = (jogadorId: string, operacao: 'incrementar' | 'decrementar') => {
    if (!torneio) return;

    const novoTorneio = { ...torneio };
    
    // Atualiza gols do jogador nos times
    novoTorneio.times = novoTorneio.times.map(time => ({
      ...time,
      jogadores: time.jogadores.map(jogador => {
        if (jogador.id === jogadorId) {
          const novoJogador = { ...jogador };
          novoJogador.gols = Math.max(0, (novoJogador.gols || 0) + (operacao === 'incrementar' ? 1 : -1));
          return novoJogador;
        }
        return jogador;
      })
    }));

    // Atualiza gols do jogador na lista global (torneio atual e total)
    const jogadoresAtualizados = jogadores.map(jogador => {
      if (jogador.id === jogadorId) {
        const novoJogador = { ...jogador };
        novoJogador.gols = Math.max(0, (novoJogador.gols || 0) + (operacao === 'incrementar' ? 1 : -1));
        
        // Atualiza estatísticas totais
        if (operacao === 'incrementar') {
          novoJogador.golsTotal = (novoJogador.golsTotal || 0) + 1;
        } else if (operacao === 'decrementar' && (novoJogador.golsTotal || 0) > 0) {
          novoJogador.golsTotal = Math.max(0, (novoJogador.golsTotal || 0) - 1);
        }
        
        return novoJogador;
      }
      return jogador;
    });

    StorageManager.setTorneio(novoTorneio);
    StorageManager.setJogadores(jogadoresAtualizados);
    setTorneio(novoTorneio);
    setJogadores(jogadoresAtualizados);
  };

  const atualizarAssistenciasJogador = (jogadorId: string, operacao: 'incrementar' | 'decrementar') => {
    if (!torneio) return;

    const novoTorneio = { ...torneio };
    
    // Atualiza assistências do jogador nos times
    novoTorneio.times = novoTorneio.times.map(time => ({
      ...time,
      jogadores: time.jogadores.map(jogador => {
        if (jogador.id === jogadorId) {
          const novoJogador = { ...jogador };
          novoJogador.assistencias = Math.max(0, (novoJogador.assistencias || 0) + (operacao === 'incrementar' ? 1 : -1));
          return novoJogador;
        }
        return jogador;
      })
    }));

    // Atualiza assistências do jogador na lista global (torneio atual e total)
    const jogadoresAtualizados = jogadores.map(jogador => {
      if (jogador.id === jogadorId) {
        const novoJogador = { ...jogador };
        novoJogador.assistencias = Math.max(0, (novoJogador.assistencias || 0) + (operacao === 'incrementar' ? 1 : -1));
        
        // Atualiza estatísticas totais
        if (operacao === 'incrementar') {
          novoJogador.assistenciasTotal = (novoJogador.assistenciasTotal || 0) + 1;
        } else if (operacao === 'decrementar' && (novoJogador.assistenciasTotal || 0) > 0) {
          novoJogador.assistenciasTotal = Math.max(0, (novoJogador.assistenciasTotal || 0) - 1);
        }
        
        return novoJogador;
      }
      return jogador;
    });

    StorageManager.setTorneio(novoTorneio);
    StorageManager.setJogadores(jogadoresAtualizados);
    setTorneio(novoTorneio);
    setJogadores(jogadoresAtualizados);
  };

  const getTimeById = (timeId: string): Time | undefined => {
    return torneio?.times.find(t => t.id === timeId);
  };

  const getPartidasDaFase = (faseAtual: 'inicial' | 'semifinal' | 'final' | 'concluido') => {
    if (!torneio) return [];
    
    if (faseAtual === 'inicial') {
      // Para fase inicial, retorna todas as partidas normalmente
      return torneio.partidas.filter(p => p.fase === faseAtual);
    } else if (faseAtual === 'semifinal') {
      // Para semifinais, agrupa ida e volta em um único card
      const semifinais = torneio.partidas.filter(p => p.fase === 'semifinal');
      const semifinaisAgrupadas = [];
      
      // Agrupa por semifinalId
      const semifinal1 = semifinais.filter(p => p.semifinalId === 1);
      const semifinal2 = semifinais.filter(p => p.semifinalId === 2);
      
      if (semifinal1.length > 0) {
        semifinaisAgrupadas.push(semifinal1[0]); // Usa a partida de ida como representante
      }
      if (semifinal2.length > 0) {
        semifinaisAgrupadas.push(semifinal2[0]); // Usa a partida de ida como representante
      }
      
      return semifinaisAgrupadas;
    } else if (faseAtual === 'final') {
      // Para final, agrupa ida e volta em um único card
      const finais = torneio.partidas.filter(p => p.fase === 'final');
      if (finais.length > 0) {
        return [finais[0]]; // Usa a partida de ida como representante
      }
      return [];
    }
    
    return [];
  };

  const getPartidasNaoFinalizadas = () => {
    if (!torneio) return [];
    return torneio.partidas.filter(p => !p.finalizada);
  };

  const podeAvancarFase = () => {
    if (!torneio) return false;
    const partidasDaFase = getPartidasDaFase(fase);
    return partidasDaFase.length > 0 && partidasDaFase.every(p => p.finalizada);
  };

  // Calcula placar agregado entre duas partidas (ida e volta)
  const calcularPlacarAgregado = (partidaIda: Partida, partidaVolta: Partida) => {
    // CORREÇÃO: Somar os gols do mesmo time nas duas partidas
    const golsTimeA = partidaIda.golsA + partidaVolta.golsA;
    const golsTimeB = partidaIda.golsB + partidaVolta.golsB;
    return { golsTimeA, golsTimeB };
  };

  // Obtém vencedores das semifinais baseado no placar agregado
  const obterVencedoresSemifinais = (partidas: Partida[]): string[] => {
    const semifinais = partidas.filter(p => p.fase === 'semifinal');
    const vencedores: string[] = [];

    console.log('Semifinais encontradas:', semifinais.length);
    console.log('Semifinais:', semifinais.map(p => ({
      id: p.id,
      semifinalId: p.semifinalId,
      partidaIda: p.partidaIda,
      finalizada: p.finalizada,
      timeA: p.timeA,
      timeB: p.timeB,
      golsA: p.golsA,
      golsB: p.golsB
    })));

    // Semifinal 1
    const semifinal1Ida = semifinais.find(p => p.semifinalId === 1 && p.partidaIda);
    const semifinal1Volta = semifinais.find(p => p.semifinalId === 1 && !p.partidaIda);
    
    console.log('Semifinal 1 - Ida:', semifinal1Ida);
    console.log('Semifinal 1 - Volta:', semifinal1Volta);
    
    if (semifinal1Ida && semifinal1Volta && semifinal1Ida.finalizada && semifinal1Volta.finalizada) {
      const placar = calcularPlacarAgregado(semifinal1Ida, semifinal1Volta);
      // CORREÇÃO: Comparar corretamente os gols agregados
      const vencedor1 = placar.golsTimeA > placar.golsTimeB ? semifinal1Ida.timeA : semifinal1Ida.timeB;
      vencedores.push(vencedor1);
      console.log('Vencedor Semifinal 1:', vencedor1, 'Placar:', placar);
      console.log('Time A (', semifinal1Ida.timeA, '):', placar.golsTimeA, 'gols');
      console.log('Time B (', semifinal1Ida.timeB, '):', placar.golsTimeB, 'gols');
    }

    // Semifinal 2
    const semifinal2Ida = semifinais.find(p => p.semifinalId === 2 && p.partidaIda);
    const semifinal2Volta = semifinais.find(p => p.semifinalId === 2 && !p.partidaIda);
    
    console.log('Semifinal 2 - Ida:', semifinal2Ida);
    console.log('Semifinal 2 - Volta:', semifinal2Volta);
    
    if (semifinal2Ida && semifinal2Volta && semifinal2Ida.finalizada && semifinal2Volta.finalizada) {
      const placar = calcularPlacarAgregado(semifinal2Ida, semifinal2Volta);
      // CORREÇÃO: Comparar corretamente os gols agregados
      const vencedor2 = placar.golsTimeA > placar.golsTimeB ? semifinal2Ida.timeA : semifinal2Ida.timeB;
      vencedores.push(vencedor2);
      console.log('Vencedor Semifinal 2:', vencedor2, 'Placar:', placar);
      console.log('Time A (', semifinal2Ida.timeA, '):', placar.golsTimeA, 'gols');
      console.log('Time B (', semifinal2Ida.timeB, '):', placar.golsTimeB, 'gols');
    }

    console.log('Vencedores finais:', vencedores);
    return vencedores;
  };

  // Obtém campeão da final baseado no placar agregado
  const obterCampeaoFinal = (partidas: Partida[]): string | null => {
    const finais = partidas.filter(p => p.fase === 'final');
    const finalIda = finais.find(p => p.partidaIda);
    const finalVolta = finais.find(p => !p.partidaIda);
    
    if (finalIda && finalVolta && finalIda.finalizada && finalVolta.finalizada) {
      const placar = calcularPlacarAgregado(finalIda, finalVolta);
      console.log('Final - Placar agregado:', placar);
      console.log('Time A (', finalIda.timeA, '):', placar.golsTimeA, 'gols');
      console.log('Time B (', finalIda.timeB, '):', placar.golsTimeB, 'gols');
      return placar.golsTimeA > placar.golsTimeB ? finalIda.timeA : finalIda.timeB;
    }
    
    return null;
  };

  if (!torneio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum torneio encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Vá para a aba &quot;Seleção&quot; para sortear os times primeiro
            </p>
            <a href="/selecao" className="btn-primary">
              Ir para Seleção
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Racha em Andamento
          </h1>
          <p className="text-gray-600">
            {fase === 'inicial' && 'Fase inicial - Todos contra todos'}
            {fase === 'semifinal' && 'Semifinais - 1º x 4º e 2º x 3º'}
            {fase === 'final' && 'Final - Melhor de dois jogos'}
            {fase === 'concluido' && 'Torneio concluído!'}
          </p>
        </div>

        {/* Status do Torneio */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-verde-brasil" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fase Atual</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{fase}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Partidas Jogadas</p>
                <p className="text-lg font-bold text-gray-900">
                  {torneio.partidas.filter(p => p.finalizada).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Partidas Restantes</p>
                <p className="text-lg font-bold text-gray-900">
                  {getPartidasNaoFinalizadas().length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Times</p>
                <p className="text-lg font-bold text-gray-900">{torneio.times.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        {!torneio.iniciado && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Iniciar Torneio
            </h2>
            <p className="text-gray-600 mb-4">
              Clique no botão abaixo para iniciar o torneio e gerar as partidas da fase inicial.
            </p>
            <button
              onClick={iniciarTorneio}
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              <Play className="w-5 h-5" />
              Iniciar Torneio
            </button>
          </div>
        )}

        {/* Avançar Fase */}
        {torneio.iniciado && podeAvancarFase() && fase !== 'concluido' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Todas as partidas da fase atual foram finalizadas!</span>
            </div>
            <button
              onClick={avancarFase}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Avançar Fase
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Campeão */}
        {fase === 'concluido' && torneio.campeao && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-8 text-center mb-6">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">🏆 Torneio Concluído! 🏆</h2>
              <p className="text-xl">
                Campeão: {getTimeById(torneio.campeao)?.nome}
              </p>
            </div>
            
            {/* Classificação Final */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Classificação Final
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ordenarTimesPorClassificacao(torneio.times).map((time, index) => {
                  const posicao = index + 1;
                  
                  return (
                    <div key={time.id} className={`p-4 rounded-lg border-2 ${
                      posicao === 1 ? 'border-yellow-400 bg-yellow-50' :
                      posicao === 2 ? 'border-gray-300 bg-gray-50' :
                      posicao === 3 ? 'border-orange-400 bg-orange-50' :
                      'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">
                          {posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : `${posicao}º`}
                        </span>
                        <span className="text-sm font-medium text-gray-600">{time.nome}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Pontos:</strong> {time.pontos}</p>
                        <p><strong>Saldo:</strong> {time.golsMarcados - time.golsSofridos}</p>
                        <p><strong>Gols:</strong> {time.golsMarcados}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Resultados da Fase Anterior */}
        {torneio.iniciado && fase !== 'inicial' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resultados da Fase {fase === 'semifinal' ? 'Inicial' : 'Semifinais'}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {torneio.times.map((time, index) => {
                  const classificacao = ordenarTimesPorClassificacao(torneio.times);
                  const posicao = classificacao.findIndex(t => t.id === time.id) + 1;
                  
                  return (
                    <div key={time.id} className={`p-4 rounded-lg border-2 ${
                      posicao === 1 ? 'border-yellow-400 bg-yellow-50' :
                      posicao === 2 ? 'border-gray-300 bg-gray-50' :
                      posicao === 3 ? 'border-orange-400 bg-orange-50' :
                      'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">
                          {posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : `${posicao}º`}
                        </span>
                        <span className="text-sm font-medium text-gray-600">{time.nome}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Pontos:</strong> {time.pontos}</p>
                        <p><strong>Saldo:</strong> {time.golsMarcados - time.golsSofridos}</p>
                        <p><strong>Gols:</strong> {time.golsMarcados}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Partidas da Fase Atual */}
        {torneio.iniciado && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Partidas da Fase {fase === 'inicial' ? 'Inicial' : fase === 'semifinal' ? 'Semifinais' : 'Final'}
            </h2>
            
            <div className="space-y-4">
              {getPartidasDaFase(fase).map((partida) => {
                const timeA = getTimeById(partida.timeA);
                const timeB = getTimeById(partida.timeB);
                
                if (!timeA || !timeB) return null;

                return (
                  <div key={partida.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {timeA.nome} vs {timeB.nome}
                      </h3>
                        <p className="text-sm text-gray-600">
                          Fase: {partida.fase === 'inicial' ? 'Inicial' : partida.fase === 'semifinal' ? 'Semifinal' : 'Final'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {partida.finalizada ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Finalizada
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            Em Andamento
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Placar */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                              {torneio.times.find(t => t.id === partida.timeA)?.nome}
                            </div>
                            <div className="text-4xl font-bold text-gray-900">
                              {partida.golsA}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-400">-</div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                              {torneio.times.find(t => t.id === partida.timeB)?.nome}
                            </div>
                            <div className="text-4xl font-bold text-gray-900">
                              {partida.golsB}
                            </div>
                          </div>
                        </div>
                        
                        {/* Placar Agregado para Semifinais e Final */}
                        {(partida.fase === 'semifinal' || partida.fase === 'final') && (
                          <div className="text-sm text-gray-600 mb-2">
                            {(() => {
                              const partidaIda = partida.partidaIda ? partida : 
                                torneio.partidas.find(p => p.semifinalId === partida.semifinalId && p.partidaIda && p.fase === partida.fase);
                              const partidaVolta = !partida.partidaIda ? partida : 
                                torneio.partidas.find(p => p.semifinalId === partida.semifinalId && !p.partidaIda && p.fase === partida.fase);
                              
                              if (partidaIda && partidaVolta && partidaIda.finalizada && partidaVolta.finalizada) {
                                // CORREÇÃO: Calcular placar agregado considerando a ordem consistente dos times
                                // Sempre usar os times da partida de ida como referência para manter ordem consistente
                                const timeAIda = partidaIda.timeA;
                                const timeBIda = partidaIda.timeB;
                                
                                // Calcular gols do time A (sempre o time da posição A da partida de ida)
                                const golsTimeA = partidaIda.golsA + partidaVolta.golsB; // Na volta, time A da ida vira time B
                                // Calcular gols do time B (sempre o time da posição B da partida de ida)  
                                const golsTimeB = partidaIda.golsB + partidaVolta.golsA; // Na volta, time B da ida vira time A
                                
                                const placar = { golsTimeA, golsTimeB };
                                
                                // Usar os times da partida de ida para exibição consistente
                                const timeA = torneio.times.find(t => t.id === timeAIda);
                                const timeB = torneio.times.find(t => t.id === timeBIda);
                                
                                // Determinar vencedor baseado no placar agregado
                                const timeAVenceu = placar.golsTimeA > placar.golsTimeB;
                                const timeBVenceu = placar.golsTimeB > placar.golsTimeA;
                                const empate = placar.golsTimeA === placar.golsTimeB;
                                
                                console.log('Placar Agregado Debug:');
                                console.log('Time A (', timeA?.nome, '):', placar.golsTimeA, 'gols');
                                console.log('Time B (', timeB?.nome, '):', placar.golsTimeB, 'gols');
                                console.log('Vencedor:', timeAVenceu ? timeA?.nome : timeBVenceu ? timeB?.nome : 'Empate');
                                
                                // Cores dos times
                                const coresTimes = {
                                  'Verde': 'text-green-600',
                                  'Amarelo': 'text-yellow-600', 
                                  'Branco': 'text-gray-600',
                                  'Azul': 'text-blue-600',
                                  'Vermelho': 'text-red-600',
                                  'Preto': 'text-gray-800'
                                };
                                
                                const corTimeA = coresTimes[timeA?.nome as keyof typeof coresTimes] || 'text-gray-600';
                                const corTimeB = coresTimes[timeB?.nome as keyof typeof coresTimes] || 'text-gray-600';
                                
                                return (
                                  <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                                    <div className="font-semibold text-blue-800 text-center mb-3">Placar Agregado</div>
                                    <div className="flex items-center justify-center gap-6">
                                      <div className="text-center">
                                        <div className="text-xs font-medium text-gray-600 mb-1">
                                          {timeA?.nome}
                                        </div>
                                        <div className={`text-2xl font-bold ${timeAVenceu ? 'text-green-600' : empate ? corTimeA : 'text-gray-500'}`}>
                                          {placar.golsTimeA}
                                        </div>
                                      </div>
                                      <div className="text-gray-500 font-bold text-xl">-</div>
                                      <div className="text-center">
                                        <div className="text-xs font-medium text-gray-600 mb-1">
                                          {timeB?.nome}
                                        </div>
                                        <div className={`text-2xl font-bold ${timeBVenceu ? 'text-green-600' : empate ? corTimeB : 'text-gray-500'}`}>
                                          {placar.golsTimeB}
                                        </div>
                                      </div>
                                    </div>
                                    {empate && (
                                      <div className="text-center text-sm text-gray-600 mt-2">
                                        ⚖️ Empate
                                      </div>
                                    )}
                                    {(timeAVenceu || timeBVenceu) && (
                                      <div className="text-center text-sm text-green-600 font-semibold mt-2">
                                        🏆 {timeAVenceu ? timeA?.nome : timeB?.nome} venceu!
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        )}
                        
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => atualizarPlacar(partida.id, 'A', 'incrementar')}
                              className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() => atualizarPlacar(partida.id, 'A', 'decrementar')}
                              className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-2 text-gray-400">|</span>
                            <button
                              onClick={() => atualizarPlacar(partida.id, 'B', 'incrementar')}
                              className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                            >
                              +
                            </button>
                            <button
                              onClick={() => atualizarPlacar(partida.id, 'B', 'decrementar')}
                              className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              -
                            </button>
                          </div>
                      </div>

                      {/* Timer */}
                      <div>
                        <Timer
                          tempoInicial={partida.tempoRestante}
                          salvarEstado={true}
                          id={`partida_${partida.id}`}
                        />
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2">
                        {(partida.fase === 'semifinal' || partida.fase === 'final') ? (
                          // Para semifinais e finais, mostrar botões separados para ida e volta
                          <div className="space-y-2">
                            {(() => {
                              const partidaIda = partida.partidaIda ? partida : 
                                torneio.partidas.find(p => p.semifinalId === partida.semifinalId && p.partidaIda && p.fase === partida.fase);
                              const partidaVolta = !partida.partidaIda ? partida : 
                                torneio.partidas.find(p => p.semifinalId === partida.semifinalId && !p.partidaIda && p.fase === partida.fase);
                              
                              return (
                                <>
                                  {/* Botão Partida 1 (Ida) */}
                                  {partidaIda && !partidaIda.finalizada && (
                                    <button
                                      onClick={() => finalizarPartida(partidaIda.id)}
                                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                      Finalizar Partida 1 (Ida)
                                    </button>
                                  )}
                                  
                                  {/* Botão Partida 2 (Volta) */}
                                  {partidaVolta && !partidaVolta.finalizada && (
                                    <button
                                      onClick={() => finalizarPartida(partidaVolta.id)}
                                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      Finalizar Partida 2 (Volta)
                                    </button>
                                  )}
                                  
                                  {/* Status das partidas */}
                                  <div className="text-xs text-gray-500 space-y-1">
                                    <p>Partida 1 (Ida): {partidaIda?.finalizada ? '✅ Finalizada' : '⏳ Em andamento'}</p>
                                    <p>Partida 2 (Volta): {partidaVolta?.finalizada ? '✅ Finalizada' : '⏳ Em andamento'}</p>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          // Para fase inicial, botão único
                          !partida.finalizada && (
                            <button
                              onClick={() => finalizarPartida(partida.id)}
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Finalizar Partida
                            </button>
                          )
                        )}
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>{timeA.nome}:</strong> {timeA.pontos} pontos</p>
                          <p><strong>{timeB.nome}:</strong> {timeB.pontos} pontos</p>
                        </div>
                      </div>
                    </div>

                    {/* Jogadores e Estatísticas Individuais */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Time A */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {timeA.nome}
                        </h4>
                        <div className="space-y-2">
                          {timeA.jogadores.map((jogador) => {
                            const jogadorCompleto = jogadores.find(j => j.id === jogador.id);
                            if (!jogadorCompleto) return null;
                            
                            return (
                              <div key={jogador.id} className="flex items-center justify-between bg-white rounded p-2">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {jogadorCompleto.nome} {jogadorCompleto.sobrenome}
                                    {jogadorCompleto.apelido && ` "${jogadorCompleto.apelido}"`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">⚽</span>
                                    <button
                                      onClick={() => atualizarGolsJogador(jogador.id, 'incrementar')}
                                      className="w-6 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                    >
                                      +
                                    </button>
                                    <span className="text-sm font-medium w-6 text-center">
                                      {jogador.gols || 0}
                                    </span>
                                    <button
                                      onClick={() => atualizarGolsJogador(jogador.id, 'decrementar')}
                                      className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                      -
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">🎯</span>
                                    <button
                                      onClick={() => atualizarAssistenciasJogador(jogador.id, 'incrementar')}
                                      className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                    >
                                      +
                                    </button>
                                    <span className="text-sm font-medium w-6 text-center">
                                      {jogador.assistencias || 0}
                                    </span>
                                    <button
                                      onClick={() => atualizarAssistenciasJogador(jogador.id, 'decrementar')}
                                      className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                      -
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time B */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {timeB.nome}
                        </h4>
                        <div className="space-y-2">
                          {timeB.jogadores.map((jogador) => {
                            const jogadorCompleto = jogadores.find(j => j.id === jogador.id);
                            if (!jogadorCompleto) return null;
                            
                            return (
                              <div key={jogador.id} className="flex items-center justify-between bg-white rounded p-2">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {jogadorCompleto.nome} {jogadorCompleto.sobrenome}
                                    {jogadorCompleto.apelido && ` "${jogadorCompleto.apelido}"`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">⚽</span>
                                    <button
                                      onClick={() => atualizarGolsJogador(jogador.id, 'incrementar')}
                                      className="w-6 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                    >
                                      +
                                    </button>
                                    <span className="text-sm font-medium w-6 text-center">
                                      {jogador.gols || 0}
                                    </span>
                                    <button
                                      onClick={() => atualizarGolsJogador(jogador.id, 'decrementar')}
                                      className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                      -
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">🎯</span>
                                    <button
                                      onClick={() => atualizarAssistenciasJogador(jogador.id, 'incrementar')}
                                      className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                    >
                                      +
                                    </button>
                                    <span className="text-sm font-medium w-6 text-center">
                                      {jogador.assistencias || 0}
                                    </span>
                                    <button
                                      onClick={() => atualizarAssistenciasJogador(jogador.id, 'decrementar')}
                                      className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                    >
                                      -
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Classificação e Estatísticas */}
        {torneio.iniciado && (
          <StatsSummary
            times={torneio.times}
            jogadores={jogadores}
            fase={fase}
          />
        )}
      </main>
    </div>
  );
}
