'use client';

import { Jogador, NIVEL_LABELS, NIVEL_COLORS } from '@/types';
import { formatarWhatsApp } from '@/utils/calcularMedia';
import { Edit, Trash2, Phone } from 'lucide-react';

interface PlayerCardProps {
  jogador: Jogador;
  onEdit: (jogador: Jogador) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

export default function PlayerCard({ jogador, onEdit, onDelete, showActions = true }: PlayerCardProps) {
  const nomeCompleto = jogador.apelido 
    ? `${jogador.nome} "${jogador.apelido}" ${jogador.sobrenome}`
    : `${jogador.nome} ${jogador.sobrenome}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {nomeCompleto}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${NIVEL_COLORS[jogador.nivel as keyof typeof NIVEL_COLORS]}`}>
              {NIVEL_LABELS[jogador.nivel as keyof typeof NIVEL_LABELS]}
            </span>
            <span className="text-sm text-gray-600">
              Nível {jogador.nivel}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{formatarWhatsApp(jogador.whatsapp)}</span>
          </div>

          {((jogador.golsTotal || 0) > 0 || (jogador.assistenciasTotal || 0) > 0) && (
            <div className="flex gap-4 mt-2 text-sm">
              {(jogador.golsTotal || 0) > 0 && (
                <span className="text-green-600 font-medium">
                  ⚽ {jogador.golsTotal || 0} gols total
                </span>
              )}
              {(jogador.assistenciasTotal || 0) > 0 && (
                <span className="text-blue-600 font-medium">
                  🎯 {jogador.assistenciasTotal || 0} assistências total
                </span>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(jogador)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar jogador"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(jogador.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir jogador"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
