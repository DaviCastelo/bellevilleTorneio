'use client';

import { useState, useEffect } from 'react';
import { Jogador, Time } from '@/types';
import { StorageManager } from '@/utils/storage';
import { balancearTimes, verificarBalanceamento } from '@/utils/balancearTimes';
import PlayerCard from '@/components/PlayerCard';
import TeamCard from '@/components/TeamCard';
import Navigation from '@/components/Navigation';
import { gerarId } from '@/utils/calcularMedia';
import { Check, Users, Shuffle, Trophy, AlertCircle } from 'lucide-react';

export default function SelecaoPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState<string[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [timesSorteados, setTimesSorteados] = useState<Time[]>([]);
  const [mostrarTimes, setMostrarTimes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega dados do localStorage
  useEffect(() => {
    const jogadoresCarregados = StorageManager.getJogadores();
    const selecaoCarregada = StorageManager.getSelecao();
    const torneioCarregado = StorageManager.getTorneio();
    
    setJogadores(jogadoresCarregados);
    setJogadoresSelecionados(selecaoCarregada);
    
    if (torneioCarregado && torneioCarregado.times.length > 0) {
      setTimesSorteados(torneioCarregado.times);
      setMostrarTimes(true);
    }
  }, []);

  const handleSelecionarJogador = (jogadorId: string) => {
    if (jogadoresSelecionados.includes(jogadorId)) {
      // Remove da seleção
      const novaSelecao = jogadoresSelecionados.filter(id => id !== jogadorId);
      setJogadoresSelecionados(novaSelecao);
      StorageManager.setSelecao(novaSelecao);
    } else if (jogadoresSelecionados.length < 20) {
      // Adiciona à seleção
      const novaSelecao = [...jogadoresSelecionados, jogadorId];
      setJogadoresSelecionados(novaSelecao);
      StorageManager.setSelecao(novaSelecao);
    }
  };

  const handleSortearTimes = async () => {
    if (jogadoresSelecionados.length < 4) {
      alert('É necessário selecionar pelo menos 4 jogadores para formar times');
      return;
    }

    setIsLoading(true);

    try {
      // Simula um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const jogadoresParaSorteio = jogadores.filter(j => 
        jogadoresSelecionados.includes(j.id)
      ).map(jogador => ({
        ...jogador,
        gols: 0,
        assistencias: 0
      }));

      const timesBalanceados = balancearTimes(jogadoresParaSorteio);
      
      // Cria o torneio
      const torneio = {
        id: gerarId(),
        times: timesBalanceados,
        partidas: [],
        faseAtual: 'inicial' as const,
        iniciado: false
      };

      StorageManager.setTorneio(torneio);
      setTimesSorteados(timesBalanceados);
      setMostrarTimes(true);
      setTimes(timesBalanceados);

    } catch (error) {
      console.error('Erro ao sortear times:', error);
      alert('Erro ao sortear times. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComecarRacha = () => {
    if (timesSorteados.length === 0) return;

    // Não marca como iniciado aqui - será feito na página do racha
    // Redireciona para a página do racha
    window.location.href = '/racha';
  };

  const jogadoresSelecionadosLista = jogadores.filter(j => 
    jogadoresSelecionados.includes(j.id)
  );

  const isBalanceado = timesSorteados.length > 0 ? verificarBalanceamento(timesSorteados) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧩 Seleção de Jogadores
          </h1>
          <p className="text-gray-600">
            Selecione até 20 jogadores e sorteie times balanceados
          </p>
        </div>

        {/* Estatísticas da Seleção */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-verde-brasil" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jogadores Selecionados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jogadoresSelecionados.length}/20
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Times Formados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timesSorteados.length > 0 ? '4' : '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isBalanceado ? 'bg-green-500' : timesSorteados.length > 0 ? 'bg-orange-500' : 'bg-gray-400'
              }`}>
                <span className="text-white font-bold text-sm">
                  {isBalanceado ? '✓' : timesSorteados.length > 0 ? '!' : '?'}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balanceamento</p>
                <p className="text-lg font-bold text-gray-900">
                  {isBalanceado ? 'Equilibrado' : timesSorteados.length > 0 ? 'Desequilibrado' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleSortearTimes}
            disabled={jogadoresSelecionados.length < 4 || isLoading}
            className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sorteando...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                Sortear Times
              </>
            )}
          </button>

          {mostrarTimes && (
            <button
              onClick={handleComecarRacha}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Começar Racha
            </button>
          )}
        </div>

        {/* Avisos */}
        {jogadoresSelecionados.length < 4 && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Selecione pelo menos 4 jogadores para formar times</span>
          </div>
        )}

        {jogadoresSelecionados.length >= 20 && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Máximo de 20 jogadores selecionados</span>
          </div>
        )}

        {/* Times Sorteados */}
        {mostrarTimes && timesSorteados.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Times Sorteados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {timesSorteados.map((time, index) => (
                <TeamCard
                  key={time.id}
                  time={time}
                  posicao={index + 1}
                  showStats={false}
                />
              ))}
            </div>

            {/* Informações do Balanceamento */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Análise de Balanceamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Níveis Médios por Time:</h4>
                  <div className="space-y-2">
                    {timesSorteados.map((time, index) => (
                      <div key={time.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{time.nome}:</span>
                        <span className="font-medium">{time.nivelMedio}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status:</h4>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isBalanceado 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {isBalanceado ? (
                      <>
                        <Check className="w-4 h-4" />
                        Times Equilibrados
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Desequilíbrio Detectado
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Jogadores para Seleção */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Selecionar Jogadores
          </h2>
          
          {jogadores.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum jogador cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Cadastre jogadores na aba "Jogadores" primeiro
              </p>
              <a
                href="/"
                className="btn-primary"
              >
                Ir para Jogadores
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogadores.map((jogador) => {
                const isSelecionado = jogadoresSelecionados.includes(jogador.id);
                const podeSelecionar = !isSelecionado && jogadoresSelecionados.length < 20;
                
                return (
                  <div
                    key={jogador.id}
                    className={`relative cursor-pointer transition-all duration-200 ${
                      isSelecionado 
                        ? 'ring-2 ring-verde-brasil bg-green-50' 
                        : podeSelecionar 
                          ? 'hover:shadow-lg' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => podeSelecionar && handleSelecionarJogador(jogador.id)}
                  >
                    <PlayerCard
                      jogador={jogador}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      showActions={false}
                    />
                    
                    {isSelecionado && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-verde-brasil text-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    
                    {!podeSelecionar && !isSelecionado && (
                      <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium">
                          Máximo atingido
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
