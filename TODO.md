# Tarefas Imediatas - Cyber Knowledge Hub

## 🎯 Próximos Passos para Implementar AGORA

Este documento lista as tarefas prioritárias para colocar o lab no ar.

---

## ✅ Tarefa 1: Adicionar Seção Labs na Navegação

### Arquivo: `index.html`

**Localizar a seção de navegação** (procure por `const sections = [...]`)

**Adicionar após a seção "Recursos":**

```javascript
{
    id: 'labs',
    title: 'Labs Práticos',
    icon: 'fa-flask',
    description: 'Ambientes hands-on para prática de segurança',
    subsections: [
        {
            id: 'security-lab-wazuh',
            title: 'Security Lab: SIEM com Wazuh',
            file: 'labs/security-lab-wazuh.md',
            tags: ['siem', 'wazuh', 'hands-on', 'intermediário']
        }
    ]
}
```

**Tempo:** 5 minutos

---

## ✅ Tarefa 2: Testar Carregamento do Lab

### Passos:

1. Abrir `index.html` no navegador
2. Clicar na nova seção "Labs Práticos"
3. Verificar se o conteúdo carrega corretamente
4. Testar links e navegação

**Tempo:** 5 minutos

---

## ✅ Tarefa 3: Atualizar README.md

### Adicionar na seção "Estrutura de Conteúdo":

```markdown
### 7. Labs Práticos
- Security Lab: SIEM com Wazuh
- OWASP Top 10 Practice (em breve)
- Incident Response Simulation (em breve)
- Network Security Lab (em breve)
```

**Tempo:** 2 minutos

---

## ✅ Tarefa 4: Criar Issue no GitHub

### Título: "Adicionar mais labs práticos"

### Descrição:
```markdown
## Labs Planejados

- [ ] OWASP Top 10 Practice Lab
- [ ] Incident Response Simulation
- [ ] Network Security Lab
- [ ] Malware Analysis Lab

## Prioridade
Médio prazo (1-2 meses)

## Ajuda Necessária
Contribuições são bem-vindas! Veja ROADMAP.md para detalhes.
```

**Tempo:** 3 minutos

---

## ✅ Tarefa 5: Commit e Push

```bash
cd /home/augusto/Documentos/projects/cyber_knowledge

git add .
git commit -m "feat: adicionar Security Lab Wazuh e roadmap do projeto

- Adicionar lab completo de SIEM com Wazuh
- Criar índice de labs práticos
- Documentar roadmap de desenvolvimento
- Adicionar tarefas imediatas

Closes #[número-da-issue]"

git push origin main
```

**Tempo:** 2 minutos

---

## ✅ Tarefa 6: Testar Lab Wazuh

### Verificar se o repositório do lab está acessível:

```bash
# Clonar em diretório temporário
cd /tmp
git clone https://github.com/augusto-cesar-dsr/integrador-ipog.git
cd integrador-ipog

# Verificar arquivos
ls -la

# Testar script de setup (opcional, se tiver Docker)
# ./scripts/setup-complete.sh
```

**Tempo:** 5 minutos

---

## ✅ Tarefa 7: Divulgar

### Onde compartilhar:

1. **LinkedIn**
   - Post sobre o novo lab
   - Mencionar tecnologias (Wazuh, Docker, SIEM)
   - Link para o site

2. **Twitter/X**
   - Tweet sobre o lançamento
   - Hashtags: #cybersecurity #infosec #SIEM #Wazuh

3. **Reddit**
   - r/cybersecurity
   - r/netsec
   - r/AskNetsec

4. **Discord/Slack**
   - Comunidades de segurança
   - Grupos de estudo

**Tempo:** 15 minutos

---

## 📊 Checklist Completo

- [ ] Adicionar seção Labs no index.html
- [ ] Testar carregamento no navegador
- [ ] Atualizar README.md
- [ ] Criar issue no GitHub
- [ ] Commit e push das mudanças
- [ ] Testar acesso ao repositório do lab
- [ ] Divulgar nas redes sociais
- [ ] Responder feedback inicial

---

## 🎯 Próximas Tarefas (Esta Semana)

### Conteúdo
- [ ] Escrever `linux-basico.md`
- [ ] Escrever `docker-security.md`
- [ ] Escrever `wireshark.md`

### Melhorias
- [ ] Adicionar busca básica (Ctrl+K)
- [ ] Melhorar responsividade mobile
- [ ] Adicionar dark/light mode toggle

### Comunidade
- [ ] Configurar GitHub Discussions
- [ ] Criar template de contribuição
- [ ] Adicionar código de conduta

---

## 💡 Dicas

1. **Foco no essencial**: Não tente fazer tudo de uma vez
2. **Teste sempre**: Cada mudança deve ser testada
3. **Documente**: Mantenha ROADMAP.md atualizado
4. **Peça feedback**: Compartilhe com a comunidade
5. **Seja consistente**: Commits regulares, mesmo que pequenos

---

## 📞 Precisa de Ajuda?

- Dúvidas técnicas: Abra uma issue
- Sugestões: Use GitHub Discussions
- Bugs: Reporte com detalhes

---

**Vamos começar! 🚀**

**Tempo total estimado:** ~40 minutos
