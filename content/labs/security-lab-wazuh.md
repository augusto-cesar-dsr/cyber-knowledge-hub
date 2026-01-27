# Security Lab: SIEM com Wazuh e Detecção de Ameaças

## 🎯 Objetivo do Lab

Neste laboratório prático, você irá configurar um ambiente completo de **SIEM (Security Information and Event Management)** usando ferramentas open source para detectar e analisar ataques em tempo real contra uma aplicação web vulnerável.

**O que você vai aprender:**
- Configurar e operar um SIEM (Wazuh)
- Coletar e normalizar logs com Fluent Bit
- Criar regras customizadas de detecção
- Identificar ataques OWASP Top 10
- Analisar e responder a incidentes de segurança

**Nível:** Intermediário  
**Tempo estimado:** 2-3 horas  
**Pré-requisitos:** Conhecimento básico de Linux, Docker e redes

---

## 🏗️ Arquitetura do Lab

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│     CR-API      │───▶│  Fluent Bit  │───▶│   OpenSearch    │
│ (App Vulnerável)│    │ (Coleta Logs)│    │ (Armazenamento) │
└─────────────────┘    └──────────────┘    └─────────────────┘
                              │                      │
                              ▼                      │
┌─────────────────┐    ┌──────────────┐              │
│ Wazuh Dashboard │◀───│ Wazuh Manager│◀─────────────┘
│   (Interface)   │    │    (SIEM)    │
└─────────────────┘    └──────────────┘
```

**Componentes:**
- **CR-API**: Aplicação vulnerável (OWASP Top 10)
- **Fluent Bit**: Coleta e processa logs
- **OpenSearch**: Armazena eventos
- **Wazuh Manager**: SIEM/XDR para análise
- **Wazuh Dashboard**: Interface de monitoramento

---

## 📋 Pré-requisitos

### Requisitos de Sistema
- **SO**: Linux (Ubuntu/Debian recomendado)
- **RAM**: Mínimo 8GB (recomendado 16GB)
- **Disco**: 20GB livres
- **CPU**: 4 cores

### Software Necessário
```bash
# Docker e Docker Compose
sudo apt update
sudo apt install docker.io docker-compose git curl -y

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker-compose --version
```

### Portas Utilizadas
- `443` - Wazuh Dashboard (HTTPS)
- `8888` - CR-API Web Interface
- `9200/9201` - OpenSearch
- `1514` - Wazuh Manager (TCP)
- `514` - Wazuh Manager (UDP/Syslog)
- `55000` - Wazuh API

---

## 🚀 Instalação

### Passo 1: Clonar o Repositório

```bash
cd ~/labs
git clone https://github.com/augusto-cesar-dsr/integrador-ipog.git
cd integrador-ipog
```

### Passo 2: Setup Automatizado

```bash
# Executar script de configuração completa
chmod +x scripts/setup-complete.sh
./scripts/setup-complete.sh
```

**O script irá:**
1. Copiar configurações do backup
2. Gerar certificados SSL para Wazuh
3. Iniciar todos os containers Docker
4. Verificar saúde dos serviços

**Tempo estimado:** 5-10 minutos

### Passo 3: Verificar Instalação

```bash
# Verificar containers em execução
docker-compose ps

# Verificar integração
./scripts/check-integration.sh
```

**Saída esperada:**
```
✅ Wazuh Manager: Running
✅ Wazuh Dashboard: Running
✅ OpenSearch: Running
✅ Fluent Bit: Running
✅ CR-API: Running
```

---

## 🌐 Acessar os Serviços

### Wazuh Dashboard
- **URL**: https://localhost
- **Usuário**: `admin`
- **Senha**: `SecretPassword`

⚠️ **Nota**: Aceite o certificado SSL auto-assinado no navegador.

### CR-API (Aplicação Vulnerável)
- **URL**: http://localhost:8888
- Interface web da aplicação vulnerável

### OpenSearch
- **URL**: http://localhost:9201
- API para consulta de logs

---

## 🧪 Exercícios Práticos

### Exercício 1: SQL Injection

**Objetivo:** Detectar tentativa de SQL Injection

**Passo a passo:**
```bash
# 1. Executar ataque SQL Injection
curl "http://localhost:8888/identity/api/v2/user/dashboard/1' OR 1=1--"

# 2. Aguardar 10-15 segundos

# 3. Verificar alerta no Wazuh
docker-compose exec wazuh.manager tail -n 20 /var/ossec/logs/alerts/alerts.json | grep -i "sql"
```

**No Dashboard Wazuh:**
1. Acesse: Security Events → Events
2. Filtro: `rule.id: 100001`
3. Observe: Level 12, SQL Injection detected

**Análise:**
- **Rule ID**: 100001
- **Severidade**: Critical (Level 12)
- **Padrão detectado**: `OR 1=1`
- **Ação recomendada**: Bloquear IP, investigar sessão

---

### Exercício 2: Cross-Site Scripting (XSS)

**Objetivo:** Identificar tentativa de XSS

```bash
# 1. Executar ataque XSS
curl -X POST "http://localhost:8888/identity/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(\"xss\")</script>","password":"test"}'

# 2. Verificar detecção
./scripts/check-alerts.sh | grep -i xss
```

**Análise no Dashboard:**
- **Rule ID**: 100002
- **Severidade**: High (Level 10)
- **Padrão**: `<script>` tag detectada
- **Impacto**: Possível roubo de sessão

---

### Exercício 3: Path Traversal

**Objetivo:** Detectar tentativa de acesso a arquivos do sistema

```bash
# 1. Tentar acessar /etc/passwd
curl "http://localhost:8888/../../etc/passwd"

# 2. Tentar com encoding
curl "http://localhost:8888/..%2f..%2fetc%2fpasswd"

# 3. Verificar alertas
docker-compose logs fluent-bit | grep -i "path traversal"
```

**Análise:**
- **Rule ID**: 100005
- **Severidade**: High (Level 10)
- **Padrões**: `../`, `/etc/passwd`, `..%2f`

---

### Exercício 4: Brute Force Attack

**Objetivo:** Detectar múltiplas tentativas de login

```bash
# 1. Executar script de brute force
for i in {1..15}; do
  curl -X POST "http://localhost:8888/identity/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"admin@test.com\",\"password\":\"wrong$i\"}"
  sleep 1
done

# 2. Verificar correlação de eventos
./scripts/check-alerts.sh | grep -i "brute force"
```

**Análise:**
- **Rule ID**: 100007
- **Severidade**: Medium (Level 8)
- **Trigger**: 10+ falhas em 60 segundos
- **Tipo**: Correlação de eventos

---

### Exercício 5: Command Injection

**Objetivo:** Detectar tentativa de execução de comandos

```bash
# 1. Tentar injetar comando
curl "http://localhost:8888/api/test?cmd=; cat /etc/passwd"

# 2. Variação com backticks
curl "http://localhost:8888/api/test?cmd=\$(whoami)"

# 3. Verificar detecção
docker-compose exec wazuh.manager grep -i "command injection" \
  /var/ossec/logs/alerts/alerts.json | tail -5
```

**Análise:**
- **Rule ID**: 100006
- **Severidade**: Critical (Level 12)
- **Padrões**: `; cat`, `$(`, backticks

---

## 📊 Análise de Logs

### Consultar OpenSearch

```bash
# Ver últimos 10 eventos
curl -s "localhost:9201/crapi-logs*/_search?size=10&sort=@timestamp:desc" | jq

# Buscar SQL Injection
curl -s "localhost:9201/crapi-logs*/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match": {
        "message": "SQL Injection"
      }
    }
  }' | jq '.hits.hits[]._source'

# Contar eventos por tipo
curl -s "localhost:9201/crapi-logs*/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "size": 0,
    "aggs": {
      "attack_types": {
        "terms": {
          "field": "attack_type.keyword"
        }
      }
    }
  }' | jq '.aggregations'
```

### Monitorar em Tempo Real

```bash
# Seguir logs do Wazuh
docker-compose exec wazuh.manager tail -f /var/ossec/logs/alerts/alerts.json

# Seguir logs do Fluent Bit
docker-compose logs -f fluent-bit

# Dashboard em tempo real (Python)
./run-dashboard.sh
```

---

## 🎓 Desafios Avançados

### Desafio 1: Criar Regra Customizada
Crie uma regra para detectar tentativas de upload de arquivos maliciosos (`.php`, `.jsp`, `.asp`).

**Dica:** Edite `/wazuh/single-node/config/wazuh_cluster/rules/crapi_enhanced.xml`

### Desafio 2: Correlação de Eventos
Configure uma regra que detecte:
1. Falha de autenticação
2. Seguida de SQL Injection
3. Do mesmo IP
4. Em menos de 5 minutos

### Desafio 3: Resposta Automatizada
Configure o Wazuh para executar um script que:
- Bloqueia IP no firewall após 5 ataques
- Envia notificação por email
- Cria ticket no sistema de incidentes

### Desafio 4: Threat Hunting
Use o OpenSearch para encontrar:
- IPs com mais de 3 tipos diferentes de ataque
- Horários de pico de ataques
- Padrões de User-Agent suspeitos

---

## 🔧 Troubleshooting

### Problema: Wazuh não recebe logs

```bash
# Verificar conectividade UDP
echo "test message" | nc -u 172.20.0.8 514

# Verificar configuração do Fluent Bit
docker-compose exec fluent-bit cat /fluent-bit/etc/fluent-bit.conf

# Reiniciar pipeline
docker-compose restart fluent-bit wazuh.manager
```

### Problema: OpenSearch sem dados

```bash
# Verificar índices
curl "localhost:9201/_cat/indices?v"

# Verificar saúde do cluster
curl "localhost:9201/_cluster/health?pretty"

# Verificar logs do Fluent Bit
docker-compose logs fluent-bit | grep -i error
```

### Problema: Regras não funcionam

```bash
# Verificar sintaxe das regras
docker-compose exec wazuh.manager /var/ossec/bin/wazuh-logtest

# Listar regras carregadas
docker-compose exec wazuh.manager ls -la /var/ossec/etc/rules/

# Reiniciar Wazuh
docker-compose restart wazuh.manager
```

### Problema: Containers não iniciam

```bash
# Verificar logs
docker-compose logs --tail=50

# Verificar recursos
docker stats

# Limpar e reiniciar
docker-compose down -v
docker-compose up -d
```

---

## 📈 Métricas de Sucesso

Ao final do lab, você deve ter:

- ✅ Ambiente SIEM funcional
- ✅ 5+ tipos de ataques detectados
- ✅ Regras customizadas criadas
- ✅ Logs normalizados e armazenados
- ✅ Dashboard com visualizações
- ✅ Processo de resposta a incidentes documentado

---

## 🎯 Próximos Passos

1. **Integração com Threat Intelligence**
   - Adicionar feeds de IOCs
   - Correlacionar com MITRE ATT&CK

2. **Machine Learning**
   - Treinar modelos de detecção de anomalias
   - Baseline de comportamento normal

3. **Automação**
   - Playbooks de resposta automática
   - Integração com SOAR

4. **Compliance**
   - Relatórios PCI-DSS
   - Auditoria LGPD/GDPR

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Wazuh Documentation](https://documentation.wazuh.com/)
- [OpenSearch Docs](https://opensearch.org/docs/)
- [Fluent Bit Manual](https://docs.fluentbit.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Comunidade
- [Wazuh Slack](https://wazuh.com/community/join-us-on-slack/)
- [r/cybersecurity](https://reddit.com/r/cybersecurity)
- [GitHub Issues](https://github.com/augusto-cesar-dsr/integrador-ipog/issues)

### Certificações Relacionadas
- CompTIA Security+
- CEH (Certified Ethical Hacker)
- GIAC GSEC
- Wazuh Certified Professional

---

## 🤝 Contribuindo

Encontrou um bug ou tem sugestões? Abra uma issue no [repositório do lab](https://github.com/augusto-cesar-dsr/integrador-ipog).

---

## 📝 Checklist de Conclusão

- [ ] Ambiente instalado e funcionando
- [ ] Exercício 1: SQL Injection detectado
- [ ] Exercício 2: XSS detectado
- [ ] Exercício 3: Path Traversal detectado
- [ ] Exercício 4: Brute Force detectado
- [ ] Exercício 5: Command Injection detectado
- [ ] Logs consultados no OpenSearch
- [ ] Dashboard Wazuh explorado
- [ ] Regra customizada criada
- [ ] Troubleshooting praticado
- [ ] Desafio avançado completado

**Parabéns! 🎉** Você completou o Security Lab e agora tem experiência prática com SIEM e detecção de ameaças.

---

**Tags:** `#siem` `#wazuh` `#threat-detection` `#owasp` `#hands-on` `#security-lab`
