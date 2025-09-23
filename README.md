# 🎲 n8n Random Number Generator

Um nó customizado para n8n que gera números verdadeiramente aleatórios entre um número mínimo e máximo usando a API do Random.org.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características](#-características)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Instalação Manual](#-instalação-manual)
- [Como Testar o Nó](#-como-testar-o-nó)
- [Desenvolvimento](#-desenvolvimento)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Solução de Problemas](#-solução-de-problemas)
- [Referências](#-referências)
- [Sobre o Desenvolvedor](#-sobre-o-desenvolvedor)

## 🎯 Sobre o Projeto

Este projeto implementa um nó customizado para n8n que integra com a API do [Random.org](https://www.random.org/) para gerar números verdadeiramente aleatórios. 

**Este foi meu primeiro contato com automação n8n** e foi extremamente gratificante concluir este desafio! Durante o desenvolvimento, aprendi muito sobre:
- Desenvolvimento de nós customizados para n8n
- TypeScript aplicado em automação
- Integração com APIs externas
- Docker e containerização
- Versionamento com Git e GitHub
- Gestão de projetos com [GitHub Projects](https://github.com/users/heitoroliveiro-dev/projects/4)

## ✨ Características

- 🎲 **Números verdadeiramente aleatórios** utilizando API externa Random.org
- 🔧 **Fácil configuração** com valores mínimo e máximo customizáveis
- 🐳 **Ambiente Docker** completo com PostgreSQL
- 📦 **Script automatizado** para instalação e execução
- 🛠️ **Desenvolvido em TypeScript** seguindo padrões do n8n

## 🔧 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Docker** (versão 20.10+)
  - [Guia de instalação oficial](https://docs.docker.com/get-docker/)
- **Docker Compose** (versão 2.0+)
  - [Guia de instalação oficial](https://docs.docker.com/compose/install/)
- **Node.js** (versão 18+)
  - [Download oficial](https://nodejs.org/)
- **Git**
  - [Download oficial](https://git-scm.com/)

### Verificar Instalação

```bash
# Verificar versões instaladas
docker --version
docker-compose --version
node --version
git --version
```

## 🚀 Instalação Rápida

### Método 1: Script Automatizado (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/heitoroliveiro-dev/n8n-node-random-generator.git
cd n8n-node-random-generator

# 2. Execute o script de instalação
chmod +x start.sh
./start.sh
```

O script automaticamente:
- ✅ Verifica dependências (Docker, Node.js)
- ✅ Instala dependências do projeto
- ✅ Compila o nó customizado
- ✅ Inicia containers Docker
- ✅ Verifica se tudo está funcionando
- ✅ Fornece instruções finais

### Acesso

Após a execução bem-sucedida, acesse:
- **n8n Interface**: http://localhost:5678
- **Banco PostgreSQL**: localhost:5432

## 📋 Instalação Manual

Se preferir fazer o setup manualmente:

### 1. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/heitoroliveiro-dev/n8n-node-random-generator.git
cd n8n-node-random-generator

# Entre na pasta do nó customizado
cd n8n-nodes-random-number-gen

# Instale as dependências
npm install

# Compile o nó customizado
npm run build

# Volte para a raiz
cd ..
```

### 2. Inicie os Containers

```bash
# Inicie o ambiente Docker
docker-compose up -d

# Verifique se os containers estão rodando
docker-compose ps
```

### 3. Verifique a Instalação

```bash
# Teste conectividade
curl -I http://localhost:5678

# Verifique logs (opcional)
docker-compose logs -f n8n
```

## 🧪 Como Testar o Nó

### 1. Acesse a Interface n8n

1. Abra seu navegador em: http://localhost:5678
2. Configure sua conta n8n (primeira execução)
3. Crie um novo workflow

### 2. Adicione o Nó Random Number Generator

1. Clique no botão **"+"** para adicionar um nó
2. Na barra de pesquisa, digite **"Random"** ou **"Random Number Generator"**
3. Selecione o nó **"True Random Numbers Generator"**

### 3. Configure o Nó

O nó possui as seguintes configurações:

- **Operation**: `Generate Random Integer` (padrão)
- **Minimum Value**: Valor mínimo (padrão: 1)
- **Maximum Value**: Valor máximo (padrão: 100)

### 4. Execute o Teste

1. Configure os valores desejados (ex: min=1, max=100)
2. Clique em **"Execute Node"** ou **"Test Step"**
3. Verifique o resultado na aba **"Output"**

### Exemplo de Saída

```json
{
  "operation": "randomInt",
  "minValue": 1,
  "maxValue": 100,
  "randomNumber": 42,
  "timestamp": "2025-09-22T23:45:00.000Z",
  "source": "Random.org"
}
```

## 🛠️ Desenvolvimento

### Ambiente de Desenvolvimento

Para modificar e desenvolver o nó:

```bash
# Entre na pasta do nó
cd n8n-nodes-random-number-gen

# Instale dependências
npm install

# Desenvolvimento com hot reload
npm run build:watch

# Ou compile uma vez
npm run build

# Verificar código
npm run lint
npm run lint:fix
```

### Estrutura do Código

```typescript
// nodes/Random/RandomNumberGen.node.ts
export class RandomNumberGen implements INodeType {
    description: INodeTypeDescription = {
        // Configuração da interface do nó
    };
    
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Lógica de execução
    }
}
```

### Comandos Úteis

```bash
# Recompilar após mudanças
cd n8n-nodes-random-number-gen && npm run build

# Reiniciar n8n
docker-compose restart n8n

# Ver logs em tempo real
docker-compose logs -f n8n

# Parar tudo
docker-compose down
```

## 📁 Estrutura do Projeto

```
n8n-node-random-generator/
├── docker-compose.yml          # Configuração Docker
├── start.sh                    # Script de instalação automática
├── README.md                   # Este arquivo
├── n8n/                        # Dados persistentes do n8n
└── n8n-nodes-random-number-gen/
    ├── package.json            # Configuração do pacote npm
    ├── tsconfig.json           # Configuração TypeScript
    ├── nodes/
    │   └── Random/
    │       ├── RandomNumberGen.node.ts  # Código principal do nó
    │       └── random.svg      # Ícone do nó
    └── dist/                   # Arquivos compilados (gerado)
        ├── package.json
        └── nodes/
            └── Random/
                ├── RandomNumberGen.node.js
                ├── RandomNumberGen.node.d.ts
                └── random.svg
```

## 🔧 Solução de Problemas

### Nó não aparece na interface

1. **Verifique se os arquivos estão sendo montados**:
   ```bash
   docker exec -it n8n-node-random-generator-n8n-1 ls -la /home/node/.n8n/custom/
   ```

2. **Recompile o nó**:
   ```bash
   cd n8n-nodes-random-number-gen && npm run build
   ```

3. **Reinicie o n8n**:
   ```bash
   docker-compose restart n8n
   ```

### Erro de permissões

```bash
# Ajustar permissões da pasta dist
sudo chown -R 1000:1000 n8n-nodes-random-number-gen/dist/
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs n8n
docker-compose logs postgres

# Verificar portas em uso
netstat -tulpn | grep :5678
```

### Erro na API Random.org

- Verifique sua conexão com a internet
- A API tem limite de requisições (considere implementar cache se necessário)
- Verifique os logs: `docker-compose logs n8n`

## 📚 Referências

Este projeto foi desenvolvido seguindo a documentação oficial do n8n:

### Documentação Principal
- [Creating Nodes - Programmatic Style](https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/)
- [Node Development Environment Requirements](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/#requirements)
- [Testing Nodes Locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)
- [n8n Node CLI Tool](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/)

### Recursos Adicionais
- [n8n Workflow Automation](https://docs.n8n.io/)
- [Random.org API Documentation](https://www.random.org/clients/http/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)

### Ferramentas e Metodologia
- **GitHub Projects** para gestão de tarefas: [Projeto n8n Random Generator](https://github.com/users/heitoroliveiro-dev/projects/4)
- **Inteligência Artificial** foi utilizada para:
  - Resumir e construir guias baseados na documentação do n8n
  - Auxiliar na solução de bugs e problemas técnicos
  - Orientação no desenvolvimento de custom nodes

## 👨‍💻 Sobre o Desenvolvedor

**Heitor Oliveiro** - Desenvolvedor Full Stack Júnior

Este projeto representa meu **primeiro contato com automação n8n** e foi uma experiência de aprendizado incrível! Durante o desenvolvimento, pude:

### 🎓 Aprendizados Principais
- **n8n**: Desenvolvimento de nós customizados, arquitetura de automação
- **TypeScript**: Aplicação prática em projetos de automação
- **Docker**: Containerização de aplicações complexas
- **APIs**: Integração com serviços externos (Random.org)
- **Gestão de Projetos**: Uso do GitHub Projects para organização de tarefas

### 🚀 Conhecimentos Reforçados
- **Git/GitHub**: Versionamento e colaboração
- **Node.js/npm**: Gerenciamento de dependências
- **Linux**: Comandos de sistema e troubleshooting

### 📈 Metodologia
O projeto foi organizado usando [GitHub Projects](https://github.com/users/heitoroliveiro-dev/projects/4), onde pude:
- Definir prioridades das tarefas
- Acompanhar progresso
- Organizar o desenvolvimento de forma estruturada
- Documentar problemas e soluções

**É extremamente gratificante concluir este desafio!** Cada obstáculo superado representou um novo aprendizado, desde a configuração inicial do ambiente até a implementação da lógica de negócio e resolução de problemas de deployment.

---

### 📞 Contato

- **Email**: heitoroliveiro.dev@outlook.com
- **GitHub**: [@heitoroliveiro-dev](https://github.com/heitoroliveiro-dev)
- **Repositório**: [n8n-node-random-generator](https://github.com/heitoroliveiro-dev/n8n-node-random-generator)

### 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

⭐ **Se gostou deste projeto, considere dar uma estrela no repositório!**