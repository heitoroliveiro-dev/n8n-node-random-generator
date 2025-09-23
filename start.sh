#!/bin/bash

# Script para inicializar o n8n com nó customizado Random Number Generator
# Autor: Heitor Oliveiro
# Descrição: Este script automatiza todo o processo de setup e inicialização

set -e  # Para o script se algum comando falhar

echo "🎲 n8n Random Number Generator - Setup Automático"
echo "=================================================="
echo ""

# Verifica se o Docker está instalado e rodando
echo "🔍 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    echo "   Visite: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

echo "✅ Docker OK"

# Verifica se o Docker Compose está disponível
echo "🔍 Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado."
    echo "   Visite: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker Compose OK"

# Verifica se o Node.js está instalado
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    echo "   Visite: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) OK"

# Para containers existentes (se houver)
echo ""
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null || echo "   Nenhum container para parar"

# Navega para a pasta do nó customizado
echo ""
echo "📁 Acessando pasta do nó customizado..."
if [ ! -d "n8n-nodes-random-number-gen" ]; then
    echo "❌ Pasta 'n8n-nodes-random-number-gen' não encontrada!"
    echo "   Certifique-se de estar na raiz do projeto."
    exit 1
fi

cd n8n-nodes-random-number-gen

# Instala as dependências do projeto
echo ""
echo "📦 Instalando dependências do nó customizado..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    exit 1
fi

npm install

# Compila o nó customizado (TypeScript -> JavaScript)
echo ""
echo "🔨 Compilando nó customizado (TypeScript -> JavaScript)..."
npm run build

# Verifica se a compilação foi bem-sucedida
if [ ! -d "dist" ]; then
    echo "❌ Falha na compilação! Pasta 'dist' não foi criada."
    exit 1
fi

if [ ! -f "dist/nodes/Random/RandomNumberGen.node.js" ]; then
    echo "❌ Arquivo do nó compilado não encontrado!"
    echo "   Esperado: dist/nodes/Random/RandomNumberGen.node.js"
    exit 1
fi

echo "✅ Nó customizado compilado com sucesso"

# Volta para a raiz do projeto
cd ..

# Verifica se docker-compose.yml existe
echo ""
echo "🔍 Verificando configuração Docker..."
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml não encontrado na raiz do projeto!"
    exit 1
fi

# Cria as pastas necessárias se não existirem
echo ""
echo "📁 Criando estrutura de pastas..."
mkdir -p n8n

# Inicia os containers
echo ""
echo "🚀 Iniciando n8n e PostgreSQL..."
docker-compose up -d

# Aguarda os containers iniciarem
echo ""
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verifica se os containers estão rodando
echo ""
echo "🔍 Verificando status dos containers..."
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Algum container falhou ao iniciar!"
    echo "   Execute 'docker-compose logs' para ver os erros"
    exit 1
fi

# Testa se o n8n está acessível
echo ""
echo "🔍 Testando conectividade com n8n..."
for i in {1..30}; do
    if curl -s -I http://localhost:5678 &> /dev/null; then
        echo "✅ n8n está online!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ n8n não respondeu após 30 tentativas"
        echo "   Execute 'docker-compose logs n8n' para verificar erros"
        exit 1
    fi
    echo "   Tentativa $i/30... aguardando..."
    sleep 2
done

# Sucesso!
echo ""
echo "🎉 Setup concluído com sucesso!"
echo "=================================================="
echo ""
echo "✅ n8n está rodando em: http://localhost:5678"
echo "✅ Nó 'Random Number Generator' está disponível"
echo ""
echo "📋 Próximos passos:"
echo "   1. Abra seu navegador em: http://localhost:5678"
echo "   2. Configure sua conta n8n"
echo "   3. Procure por 'Random Number Generator' na lista de nós"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Para parar:          docker-compose down"
echo "   Para ver logs:       docker-compose logs -f"
echo "   Para recompilar:     cd n8n-nodes-random-number-gen && npm run build"
echo ""
echo "🐛 Em caso de problemas:"
echo "   - Logs do n8n:       docker-compose logs n8n"
echo "   - Logs do PostgreSQL: docker-compose logs postgres"
echo "   - Status:            docker-compose ps"
echo ""