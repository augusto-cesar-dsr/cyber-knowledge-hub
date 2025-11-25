---
title: Sqlmap - SQL Injection Automation
date: 2025-10-31
background: bg-[#1b3a2a]
tags:
  - sqlmap
  - sql-injection
  - web
  - pentest
categories:
  - Penetration Testing
intro: |
  O sqlmap é uma ferramenta open-source para detecção e exploração automatizada de vulnerabilidades de SQL Injection em aplicações web. Suporta múltiplos DBMS, vários métodos de injeção e módulos de extração e pós-exploração.
plugins:
  - copyCode
---

## Visão Geral

**Resumo:**  
sqlmap automatiza a tarefa de detectar e explorar falhas de SQL Injection, com suporte a técnicas error-based, boolean-based, time-based, UNION, stacked queries e outras. Fornece recursos para listar bancos, tabelas, colunas, fazer dumps e executar comandos remotos quando possível.

---

## Instalação Rápida

```bash
# clonar repositório oficial
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git
cd sqlmap

# executar (não requer instalação)
python3 sqlmap.py --help
```
