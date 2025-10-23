# ⚽ Gerenciador de Racha

Sistema web completo para gerenciar rachas de futebol com times balanceados, torneios e estatísticas detalhadas.

## 🚀 Funcionalidades

### 🏠 Aba "Jogadores"
- ✅ Cadastro completo de jogadores (nome, sobrenome, apelido, WhatsApp, nível de habilidade)
- ✅ Sistema de níveis de 1 a 5 (Ruim, Fraco, Intermediário, Avançado, Craque)
- ✅ CRUD completo (criar, editar, excluir jogadores)
- ✅ Busca por nome ou apelido
- ✅ Validação de dados e formatação automática
- ✅ Persistência local no navegador

### 🧩 Aba "Seleção"
- ✅ Seleção de até 20 jogadores
- ✅ Algoritmo inteligente de balanceamento de times
- ✅ Criação automática de 4 times equilibrados
- ✅ Análise de balanceamento com indicadores visuais
- ✅ Validação de quantidade mínima de jogadores

### 🏆 Aba "Racha" (Torneio)
- ✅ **Fase Inicial**: Todos contra todos (cada time joga 3 partidas)
- ✅ **Semifinais**: 1º x 4º e 2º x 3º
- ✅ **Final**: Melhor de dois jogos
- ✅ Sistema de pontuação (vitória = 3pts, empate = 1pt, derrota = 0pts)
- ✅ Classificação automática por pontos, saldo de gols e gols marcados

### ⏱️ Timer de Partidas
- ✅ **Fase inicial**: 7 minutos
- ✅ **Semifinais e finais**: 8 minutos
- ✅ Controles: Iniciar, Pausar, Zerar
- ✅ Alerta sonoro ao fim do tempo
- ✅ Estado salvo no localStorage

### 📊 Estatísticas Completas
- ✅ **Artilheiros**: Ranking de gols
- ✅ **Garçons**: Ranking de assistências
- ✅ **Classificação geral**: Pontos, saldo, gols marcados/sofridos
- ✅ **Resumo por time**: Nível médio, estatísticas detalhadas
- ✅ **Atualização em tempo real**

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização responsiva
- **Lucide React** - Ícones modernos
- **localStorage** - Persistência local (sem backend)

## 🎨 Design

- **Mobile-first**: Otimizado para celular
- **Tema Brasil**: Verde e amarelo
- **Responsivo**: Adapta-se a todas as telas
- **UX intuitiva**: Navegação por abas, feedback visual
- **Acessibilidade**: Contraste adequado, navegação por teclado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd gerenciador-racha

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Deploy na Vercel
```bash
# Build para produção
npm run build

# Deploy na Vercel
npx vercel --prod
```

## 📱 Como Usar

### 1. Cadastrar Jogadores
1. Vá para a aba "Jogadores"
2. Clique em "Adicionar Jogador"
3. Preencha os dados obrigatórios
4. Selecione o nível de habilidade (1-5)
5. Salve o jogador

### 2. Selecionar e Sortear Times
1. Vá para a aba "Seleção"
2. Selecione até 20 jogadores
3. Clique em "Sortear Times"
4. Verifique o balanceamento
5. Clique em "Começar Racha"

### 3. Gerenciar o Torneio
1. Vá para a aba "Racha"
2. Clique em "Iniciar Torneio"
3. Gerencie as partidas da fase inicial
4. Avance para semifinais e final
5. Acompanhe as estatísticas em tempo real

## 🧮 Algoritmo de Balanceamento

O sistema usa um algoritmo inteligente que:
1. Ordena jogadores por nível (maior para menor)
2. Distribui alternadamente entre os 4 times
3. Calcula nível médio de cada time
4. Verifica se o balanceamento está adequado (diferença ≤ 1.0)

## 💾 Armazenamento

Todos os dados são salvos localmente no navegador:
- `jogadores`: Lista de jogadores cadastrados
- `torneio`: Dados do torneio atual
- `selecao`: Jogadores selecionados
- `partidas`: Histórico de partidas
- `timer_*`: Estados dos timers

## 🔧 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Jogadores
│   ├── selecao/page.tsx   # Seleção
│   ├── racha/page.tsx     # Racha
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── PlayerCard.tsx     # Card do jogador
│   ├── TeamCard.tsx       # Card do time
│   ├── Timer.tsx          # Timer de partida
│   ├── StatsSummary.tsx   # Resumo de estatísticas
│   └── Navigation.tsx     # Navegação principal
├── types/                 # Definições TypeScript
│   └── index.ts          # Interfaces e tipos
└── utils/                 # Utilitários
    ├── balancearTimes.ts  # Algoritmo de balanceamento
    ├── storage.ts         # Gerenciamento do localStorage
    └── calcularMedia.ts   # Cálculos e formatações
```

## 🎯 Próximas Funcionalidades

- [ ] Exportar estatísticas para PDF
- [ ] Histórico de torneios anteriores
- [ ] Modo offline com Service Worker
- [ ] Compartilhamento de resultados
- [ ] Temas personalizáveis
- [ ] Modo torneio eliminatório simples

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

---

**Desenvolvido com ❤️ para a comunidade do futebol brasileiro! 🇧🇷⚽**
