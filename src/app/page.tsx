'use client';

import { useState, useEffect } from 'react';
import { Jogador, NIVEL_LABELS, NIVEL_COLORS } from '@/types';
import { StorageManager } from '@/utils/storage';
import { gerarId, validarWhatsApp, formatarWhatsApp } from '@/utils/calcularMedia';
import PlayerCard from '@/components/PlayerCard';
import Navigation from '@/components/Navigation';
import { Plus, Search, Users } from 'lucide-react';

export default function JogadoresPage() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadoresFiltrados, setJogadoresFiltrados] = useState<Jogador[]>([]);
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [jogadorEditando, setJogadorEditando] = useState<Jogador | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    apelido: '',
    whatsapp: '',
    nivel: 3
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  // Carrega jogadores do localStorage
  useEffect(() => {
    const jogadoresCarregados = StorageManager.getJogadores();
    setJogadores(jogadoresCarregados);
    setJogadoresFiltrados(jogadoresCarregados);
  }, []);

  // Filtra jogadores baseado na busca
  useEffect(() => {
    if (!busca.trim()) {
      setJogadoresFiltrados(jogadores);
    } else {
      const filtrados = jogadores.filter(jogador => {
        const nomeCompleto = `${jogador.nome} ${jogador.sobrenome}`.toLowerCase();
        const apelido = jogador.apelido?.toLowerCase() || '';
        const termoBusca = busca.toLowerCase();
        
        return nomeCompleto.includes(termoBusca) || apelido.includes(termoBusca);
      });
      setJogadoresFiltrados(filtrados);
    }
  }, [busca, jogadores]);

  const validarFormulario = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.sobrenome.trim()) {
      novosErros.sobrenome = 'Sobrenome é obrigatório';
    }

    if (!formData.whatsapp.trim()) {
      novosErros.whatsapp = 'WhatsApp é obrigatório';
    } else if (!validarWhatsApp(formData.whatsapp)) {
      novosErros.whatsapp = 'WhatsApp inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const limparFormulario = () => {
    setFormData({
      nome: '',
      sobrenome: '',
      apelido: '',
      whatsapp: '',
      nivel: 3
    });
    setErros({});
    setJogadorEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const novoJogador: Jogador = {
      id: jogadorEditando?.id || gerarId(),
      nome: formData.nome.trim(),
      sobrenome: formData.sobrenome.trim(),
      apelido: formData.apelido.trim() || undefined,
      whatsapp: formData.whatsapp.trim(),
      nivel: formData.nivel as 1 | 2 | 3 | 4 | 5,
      gols: 0,
      assistencias: 0
    };

    if (jogadorEditando) {
      StorageManager.updateJogador(jogadorEditando.id, novoJogador);
      setJogadores(prev => prev.map(j => j.id === jogadorEditando.id ? novoJogador : j));
    } else {
      StorageManager.addJogador(novoJogador);
      setJogadores(prev => [...prev, novoJogador]);
    }

    limparFormulario();
    setMostrarFormulario(false);
  };

  const handleEditar = (jogador: Jogador) => {
    setJogadorEditando(jogador);
    setFormData({
      nome: jogador.nome,
      sobrenome: jogador.sobrenome,
      apelido: jogador.apelido || '',
      whatsapp: jogador.whatsapp,
      nivel: jogador.nivel
    });
    setMostrarFormulario(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
      StorageManager.deleteJogador(id);
      setJogadores(prev => prev.filter(j => j.id !== id));
    }
  };

  const handleCancelar = () => {
    limparFormulario();
    setMostrarFormulario(false);
  };

  const gerarJogadoresAleatorios = () => {
    const nomes = [
      'João', 'Pedro', 'Carlos', 'Lucas', 'Gabriel', 'Rafael', 'Felipe', 'Diego', 'Bruno', 'André',
      'Marcos', 'Thiago', 'Daniel', 'Rodrigo', 'Eduardo', 'Fernando', 'Gustavo', 'Leonardo', 'Vinicius', 'Matheus'
    ];

    const sobrenomes = [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
      'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'
    ];

    const apelidos = [
      'Ney', 'Pelé', 'Ronaldinho', 'Kaká', 'Ronaldo', 'Romário', 'Zico', 'Sócrates', 'Falcão', 'Garrincha',
      'Tostão', 'Jairzinho', 'Rivelino', 'Carlos Alberto', 'Didi', 'Vavá', 'Mário', 'Ademir', 'Leônidas', 'Domingos'
    ];

    const niveis = [1, 2, 3, 4, 5];
    const probabilidades = [0.1, 0.2, 0.4, 0.2, 0.1]; // 10% nível 1, 20% nível 2, 40% nível 3, 20% nível 4, 10% nível 5

    function gerarNivel() {
      const random = Math.random();
      let acumulado = 0;
      
      for (let i = 0; i < niveis.length; i++) {
        acumulado += probabilidades[i];
        if (random <= acumulado) {
          return niveis[i];
        }
      }
      return 3; // fallback
    }

    function gerarJogador() {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      const temApelido = Math.random() < 0.7; // 70% chance de ter apelido
      const apelido = temApelido ? apelidos[Math.floor(Math.random() * apelidos.length)] : undefined;
      
      // Gerar WhatsApp brasileiro
      const ddd = Math.floor(Math.random() * 90) + 10; // 10-99
      const numero = Math.floor(Math.random() * 900000000) + 100000000; // 100000000-999999999
      const whatsapp = `(${ddd}) ${numero.toString().slice(0, 5)}-${numero.toString().slice(5)}`;
      
      return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        nome,
        sobrenome,
        apelido,
        whatsapp,
        nivel: gerarNivel(),
        gols: 0,
        assistencias: 0,
        golsTotal: 0,
        assistenciasTotal: 0
      };
    }

    // Gerar 20 jogadores
    const novosJogadores = [];
    for (let i = 0; i < 20; i++) {
      novosJogadores.push(gerarJogador());
    }

    // Adicionar aos jogadores existentes
    const jogadoresAtualizados = [...jogadores, ...novosJogadores];
    
    // Salvar no localStorage
    StorageManager.setJogadores(jogadoresAtualizados);
    setJogadores(jogadoresAtualizados);
    
    // Mostrar confirmação
    alert(`✅ 20 jogadores aleatórios criados com sucesso!\n\nDistribuição de níveis:\n- Nível 1: ${novosJogadores.filter(j => j.nivel === 1).length} jogadores\n- Nível 2: ${novosJogadores.filter(j => j.nivel === 2).length} jogadores\n- Nível 3: ${novosJogadores.filter(j => j.nivel === 3).length} jogadores\n- Nível 4: ${novosJogadores.filter(j => j.nivel === 4).length} jogadores\n- Nível 5: ${novosJogadores.filter(j => j.nivel === 5).length} jogadores`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚽ Gerenciar Jogadores
          </h1>
          <p className="text-gray-600">
            Cadastre e gerencie os jogadores do seu racha
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-verde-brasil" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Jogadores</p>
                <p className="text-2xl font-bold text-gray-900">{jogadores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">5</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cracks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jogadores.filter(j => j.nivel === 5).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nível Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jogadores.length > 0 
                    ? (jogadores.reduce((acc, j) => acc + j.nivel, 0) / jogadores.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar jogadores por nome ou apelido..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={gerarJogadoresAleatorios}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              🎲 Gerar 20 Jogadores
            </button>
            
            <button
              onClick={() => setMostrarFormulario(true)}
              className="btn-primary flex items-center gap-2 px-6 py-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Jogador
            </button>
          </div>
        </div>

        {/* Formulário */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {jogadorEditando ? 'Editar Jogador' : 'Novo Jogador'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className={`input-field ${erros.nome ? 'border-red-500' : ''}`}
                    placeholder="Digite o nome"
                  />
                  {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    value={formData.sobrenome}
                    onChange={(e) => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
                    className={`input-field ${erros.sobrenome ? 'border-red-500' : ''}`}
                    placeholder="Digite o sobrenome"
                  />
                  {erros.sobrenome && <p className="text-red-500 text-sm mt-1">{erros.sobrenome}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apelido
                  </label>
                  <input
                    type="text"
                    value={formData.apelido}
                    onChange={(e) => setFormData(prev => ({ ...prev, apelido: e.target.value }))}
                    className="input-field"
                    placeholder="Digite o apelido (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className={`input-field ${erros.whatsapp ? 'border-red-500' : ''}`}
                    placeholder="(11) 99999-9999"
                  />
                  {erros.whatsapp && <p className="text-red-500 text-sm mt-1">{erros.whatsapp}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Habilidade
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, nivel }))}
                      className={`p-3 rounded-lg text-center font-medium transition-colors ${
                        formData.nivel === nivel
                          ? `${NIVEL_COLORS[nivel as keyof typeof NIVEL_COLORS]} text-white`
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{nivel}</div>
                      <div className="text-xs">{NIVEL_LABELS[nivel as keyof typeof NIVEL_LABELS]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary">
                  {jogadorEditando ? 'Atualizar' : 'Adicionar'} Jogador
                </button>
                <button type="button" onClick={handleCancelar} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Jogadores */}
        <div className="space-y-4">
          {jogadoresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {busca ? 'Nenhum jogador encontrado' : 'Nenhum jogador cadastrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {busca 
                  ? 'Tente ajustar os termos de busca'
                  : 'Adicione o primeiro jogador para começar'
                }
              </p>
              {!busca && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="btn-primary"
                >
                  Adicionar Primeiro Jogador
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogadoresFiltrados.map((jogador) => (
                <PlayerCard
                  key={jogador.id}
                  jogador={jogador}
                  onEdit={handleEditar}
                  onDelete={handleExcluir}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
