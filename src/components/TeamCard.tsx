'use client';

import { Time } from '@/types';
import { calcularSaldoGols } from '@/utils/calcularMedia';
import { Trophy, Users, Target } from 'lucide-react';

interface TeamCardProps {
  time: Time;
  posicao?: number;
  showStats?: boolean;
}

export default function TeamCard({ time, posicao, showStats = true }: TeamCardProps) {
  const saldoGols = calcularSaldoGols(time);
  const corTime = {
    'Verde': 'bg-green-500',
    'Amarelo': 'bg-yellow-400',
    'Branco': 'bg-gray-200',
    'Azul': 'bg-blue-500'
  }[time.nome] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {posicao && (
            <div className="w-8 h-8 bg-verde-brasil text-white rounded-full flex items-center justify-center font-bold text-sm">
              {posicao}º
            </div>
          )}
          <div className={`w-4 h-4 rounded-full ${corTime}`}></div>
          <h3 className="font-bold text-lg text-gray-900">{time.nome}</h3>
        </div>
        
        {showStats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-verde-brasil">{time.pontos}</div>
            <div className="text-xs text-gray-500">pontos</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{time.jogadores.length} jogadores</span>
          <span className="text-gray-400">•</span>
          <span>Nível médio: {time.nivelMedio}</span>
        </div>

        {showStats && (
          <>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-green-600">{time.golsMarcados}</div>
                <div className="text-gray-500 text-xs">Gols</div>
              </div>
              <div>
                <div className="font-semibold text-red-600">{time.golsSofridos}</div>
                <div className="text-gray-500 text-xs">Sofridos</div>
              </div>
              <div>
                <div className={`font-semibold ${saldoGols >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saldoGols > 0 ? '+' : ''}{saldoGols}
                </div>
                <div className="text-gray-500 text-xs">Saldo</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{time.assistencias} assistências</span>
            </div>
          </>
        )}
      </div>

      {time.jogadores.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Jogadores:</div>
          <div className="flex flex-wrap gap-1">
            {time.jogadores.map((jogador, index) => (
              <span
                key={jogador.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {jogador.apelido || jogador.nome}
                {index < time.jogadores.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
