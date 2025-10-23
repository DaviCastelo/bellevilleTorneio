'use client';

import { Jogador, Time } from '@/types';
import { Trophy, Target, Users, Award } from 'lucide-react';

interface StatsSummaryProps {
  times: Time[];
  jogadores: Jogador[];
  fase: 'inicial' | 'semifinal' | 'final' | 'concluido';
}

export default function StatsSummary({ times, jogadores, fase }: StatsSummaryProps) {
  // Ordena jogadores por gols
  const artilheiros = [...jogadores]
    .filter(j => (j.gols || 0) > 0)
    .sort((a, b) => (b.gols || 0) - (a.gols || 0))
    .slice(0, 5);

  // Ordena jogadores por assistências
  const garcons = [...jogadores]
    .filter(j => (j.assistencias || 0) > 0)
    .sort((a, b) => (b.assistencias || 0) - (a.assistencias || 0))
    .slice(0, 5);

  // Ordena times por classificação
  const classificacao = [...times].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    const saldoA = a.golsMarcados - a.golsSofridos;
    const saldoB = b.golsMarcados - b.golsSofridos;
    if (saldoB !== saldoA) return saldoB - saldoA;
    return b.golsMarcados - a.golsMarcados;
  });

  return (
    <div className="space-y-6">
      {/* Classificação Geral */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-verde-brasil" />
          Classificação Geral
        </h3>
        
        <div className="space-y-3">
          {classificacao.map((time, index) => (
            <div key={time.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-400 text-black' :
                  index === 1 ? 'bg-gray-300 text-black' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {index + 1}º
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{time.nome}</div>
                  <div className="text-sm text-gray-600">
                    {time.jogadores.length} jogadores • Nível médio: {time.nivelMedio}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-verde-brasil">{time.pontos}</div>
                <div className="text-sm text-gray-600">pontos</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artilheiros */}
      {artilheiros.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-500" />
            Artilheiros
          </h3>
          
          <div className="space-y-2">
            {artilheiros.map((jogador, index) => (
              <div key={jogador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {jogador.apelido || jogador.nome} {jogador.sobrenome}
                    </div>
                    <div className="text-sm text-gray-600">
                      {jogador.assistencias || 0} assistências
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-500">{jogador.gols}</div>
                  <div className="text-sm text-gray-600">gols</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garçons */}
      {garcons.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" />
            Garçons (Assistências)
          </h3>
          
          <div className="space-y-2">
            {garcons.map((jogador, index) => (
              <div key={jogador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {jogador.apelido || jogador.nome} {jogador.sobrenome}
                    </div>
                    <div className="text-sm text-gray-600">
                      {jogador.gols || 0} gols
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-500">{jogador.assistencias}</div>
                  <div className="text-sm text-gray-600">assistências</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo por Time */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-verde-brasil" />
          Resumo por Time
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {times.map(time => {
            const totalGols = time.jogadores.reduce((acc, j) => acc + (j.gols || 0), 0);
            const totalAssistencias = time.jogadores.reduce((acc, j) => acc + (j.assistencias || 0), 0);
            const saldoGols = time.golsMarcados - time.golsSofridos;
            
            return (
              <div key={time.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{time.nome}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pontos:</span>
                    <span className="font-medium">{time.pontos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nível médio:</span>
                    <span className="font-medium">{time.nivelMedio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gols marcados:</span>
                    <span className="font-medium text-green-600">{time.golsMarcados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gols sofridos:</span>
                    <span className="font-medium text-red-600">{time.golsSofridos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo:</span>
                    <span className={`font-medium ${saldoGols >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {saldoGols > 0 ? '+' : ''}{saldoGols}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assistências:</span>
                    <span className="font-medium text-blue-600">{totalAssistencias}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
