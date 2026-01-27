# Labs Práticos - Índice

Bem-vindo à seção de **Labs Práticos** do Cyber Knowledge Hub! Aqui você encontra ambientes hands-on para praticar conceitos de segurança cibernética.

## 🎯 Sobre os Labs

Os labs são ambientes práticos e isolados onde você pode:
- Experimentar técnicas de ataque e defesa
- Configurar ferramentas de segurança
- Simular cenários reais
- Desenvolver habilidades práticas

**Todos os labs são:**
- ✅ Gratuitos e open source
- ✅ Executados localmente (Docker)
- ✅ Seguros e isolados
- ✅ Com guias passo a passo

---

## 📚 Labs Disponíveis

### 🛡️ Security Lab: SIEM com Wazuh
**Nível:** Intermediário | **Tempo:** 2-3 horas

Configure um ambiente completo de SIEM para detectar ataques em tempo real.

**O que você vai aprender:**
- Configurar Wazuh Manager e Dashboard
- Coletar logs com Fluent Bit
- Criar regras de detecção customizadas
- Identificar ataques OWASP Top 10
- Analisar e responder a incidentes

**Tecnologias:** Wazuh, OpenSearch, Fluent Bit, Docker

[**Iniciar Lab →**](security-lab-wazuh.md)

---

## 🔜 Próximos Labs

### OWASP Top 10 Practice Lab
**Status:** Em desenvolvimento | **Previsão:** Fevereiro 2026

Pratique exploração e mitigação das 10 vulnerabilidades mais críticas.

**Tópicos:**
- Broken Access Control
- Injection (SQL, Command, LDAP)
- XSS e CSRF
- Insecure Deserialization
- E mais...

---

### Incident Response Simulation
**Status:** Planejado | **Previsão:** Março 2026

Simule resposta a incidentes reais de segurança.

**Cenários:**
- Ransomware Attack
- Data Breach Investigation
- DDoS Mitigation
- APT Detection

---

### Network Security Lab
**Status:** Planejado | **Previsão:** Março 2026

Configure e teste controles de segurança de rede.

**Exercícios:**
- Firewall rules
- IDS/IPS com Suricata
- VPN configuration
- Network segmentation

---

## 🎓 Níveis de Dificuldade

- **Iniciante** 🟢 - Conhecimento básico de Linux e redes
- **Intermediário** 🟡 - Experiência com ferramentas de segurança
- **Avançado** 🔴 - Conhecimento profundo de sistemas e protocolos

---

## 💻 Requisitos Gerais

### Hardware Mínimo
- **CPU:** 4 cores
- **RAM:** 8GB (recomendado 16GB)
- **Disco:** 20GB livres
- **SO:** Linux (Ubuntu/Debian recomendado)

### Software
- Docker e Docker Compose
- Git
- Navegador moderno
- Terminal/Shell

### Instalação Docker (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install docker.io docker-compose git -y
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🤝 Contribuindo

Quer criar um lab ou melhorar os existentes?

1. Fork o [repositório](https://github.com/augusto-cesar-dsr/cyber-knowledge-hub)
2. Crie seu lab em `content/labs/`
3. Siga o template dos labs existentes
4. Abra um Pull Request

**Diretrizes:**
- Ambiente deve ser reproduzível
- Instruções claras e passo a passo
- Exercícios práticos incluídos
- Troubleshooting documentado

---

## 📞 Suporte

Problemas com algum lab?

- 🐛 [Reportar Bug](https://github.com/augusto-cesar-dsr/cyber-knowledge-hub/issues)
- 💬 [Discussões](https://github.com/augusto-cesar-dsr/cyber-knowledge-hub/discussions)
- 📧 Contato via GitHub

---

## ⚖️ Aviso Legal

**IMPORTANTE:** Os labs são para fins educacionais apenas.

- ✅ Use apenas em ambientes controlados
- ✅ Não teste em sistemas sem autorização
- ✅ Respeite leis e regulamentos locais
- ❌ Não use para atividades maliciosas

O uso inadequado das técnicas ensinadas pode resultar em consequências legais.

---

**Bons estudos e mãos à obra! 🚀**
