'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatarTempo } from '@/utils/calcularMedia';

interface TimerProps {
  tempoInicial: number; // em segundos
  onTempoEsgotado?: () => void;
  onTempoAtualizado?: (tempo: number) => void;
  salvarEstado?: boolean;
  id?: string;
}

export default function Timer({ 
  tempoInicial, 
  onTempoEsgotado, 
  onTempoAtualizado,
  salvarEstado = false,
  id = 'timer'
}: TimerProps) {
  const [tempo, setTempo] = useState(tempoInicial);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Carrega estado salvo do localStorage
  useEffect(() => {
    if (salvarEstado && typeof window !== 'undefined') {
      const estadoSalvo = localStorage.getItem(`timer_${id}`);
      if (estadoSalvo) {
        const { tempo: tempoSalvo, isRunning: runningSalvo, isPaused: pausedSalvo } = JSON.parse(estadoSalvo);
        setTempo(tempoSalvo);
        setIsRunning(runningSalvo);
        setIsPaused(pausedSalvo);
      }
    }
  }, [salvarEstado, id]);

  // Salva estado no localStorage
  useEffect(() => {
    if (salvarEstado && typeof window !== 'undefined') {
      const estado = { tempo, isRunning, isPaused };
      localStorage.setItem(`timer_${id}`, JSON.stringify(estado));
    }
  }, [tempo, isRunning, isPaused, salvarEstado, id]);

  // Cria áudio para alerta sonoro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cria um beep simples usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioRef.current = {
        play: () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      } as any;
    }
  }, []);

  // Timer principal
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTempo(prevTempo => {
          const novoTempo = prevTempo - 1;
          
          if (novoTempo <= 0) {
            setIsRunning(false);
            setIsPaused(false);
            onTempoEsgotado?.();
            audioRef.current?.play();
            return 0;
          }
          
          onTempoAtualizado?.(novoTempo);
          return novoTempo;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onTempoEsgotado, onTempoAtualizado]);

  const iniciar = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pausar = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const retomar = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const zerar = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTempo(tempoInicial);
    onTempoAtualizado?.(tempoInicial);
  };

  const isTempoEsgotado = tempo === 0;
  const isTempoBaixo = tempo <= 60 && tempo > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className={`text-6xl font-mono font-bold mb-4 ${
        isTempoEsgotado 
          ? 'text-red-500' 
          : isTempoBaixo 
            ? 'text-orange-500' 
            : 'text-verde-brasil'
      }`}>
        {formatarTempo(tempo)}
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning && !isPaused && (
          <button
            onClick={iniciar}
            className="flex items-center gap-2 px-6 py-3 bg-verde-brasil text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            <Play className="w-5 h-5" />
            Iniciar
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={pausar}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Pause className="w-5 h-5" />
            Pausar
          </button>
        )}

        {isPaused && (
          <button
            onClick={retomar}
            className="flex items-center gap-2 px-6 py-3 bg-verde-brasil text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            <Play className="w-5 h-5" />
            Retomar
          </button>
        )}

        <button
          onClick={zerar}
          className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Zerar
        </button>
      </div>

      {isTempoEsgotado && (
        <div className="mt-4 text-red-500 font-medium">
          ⏰ Tempo esgotado!
        </div>
      )}

      {isTempoBaixo && !isTempoEsgotado && (
        <div className="mt-4 text-orange-500 font-medium">
          ⚠️ Tempo acabando!
        </div>
      )}
    </div>
  );
}
