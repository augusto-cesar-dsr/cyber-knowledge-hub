// Simple Modal Functions
function openModal(contentPath, title) {
    if (!document.getElementById('content-modal')) {
        createModal();
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = '<div style="text-align:center; padding:2rem; color:#ccc;">Carregando...</div>';
    document.getElementById('content-modal').style.display = 'flex';
    
    // Mark as glossary if title contains "Glossário"
    const modal = document.getElementById('content-modal');
    if (title.includes('Glossário')) {
        modal.setAttribute('data-glossary', 'true');
    } else {
        modal.removeAttribute('data-glossary');
    }
    
    // Parse contentPath to get section and filename
    const [section, filename] = contentPath.split('/');
    
    // Use the existing markdown loader
    markdownLoader.loadMarkdownFile(section, filename + '.md')
        .then(result => {
            if (result && result.html) {
                document.getElementById('modal-body').innerHTML = result.html;
            } else {
                document.getElementById('modal-body').innerHTML = '<div style="text-align:center; padding:2rem; color:#ff6b6b;">Conteúdo não encontrado</div>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar:', error);
            document.getElementById('modal-body').innerHTML = '<div style="text-align:center; padding:2rem; color:#ff6b6b;">Erro ao carregar conteúdo</div>';
        });
}

function closeModal() {
    const modal = document.getElementById('content-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function formatMarkdown(text) {
    // Remove header metadata (YAML front matter between ---)
    text = text.replace(/^---[\s\S]*?---\s*\n?/m, '');
    
    // Remove any remaining empty lines at the start
    text = text.replace(/^\s*\n+/, '');
    
    // Remove first H1 title (already shown in modal header)
    text = text.replace(/^# .*?\n/m, '');
    
    // Handle code blocks first and protect them from other processing
    const codeBlocks = [];
    text = text.replace(/```[^\n]*\n([\s\S]*?)\n```/g, (match, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        const escapedCode = escapeHtml(code.trim());
        const blockId = `code-block-${Date.now()}-${codeBlocks.length}`;
        codeBlocks.push(`
            <div style="position:relative; margin:1rem 0;">
                <pre id="${blockId}" style="background:#2a2a2a; padding:1rem; border-radius:5px; overflow-x:auto; color:#fff; border-left:3px solid #00d4ff; margin:0;"><code>${escapedCode}</code></pre>
                <button onclick="copyCode('${blockId}')" style="position:absolute; top:0.5rem; right:0.5rem; background:#00d4ff; color:#000; border:none; padding:0.3rem 0.6rem; border-radius:3px; cursor:pointer; font-size:0.8rem;">Copiar</button>
            </div>
        `);
        return placeholder;
    });
    
    // Handle tables
    const lines = text.split('\n');
    let inTable = false;
    let tableRows = [];
    
    let result = lines.map(line => {
        // Table detection
        if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            tableRows.push(line);
            return ''; // Will be processed later
        } else if (inTable) {
            // End of table
            inTable = false;
            const tableHtml = formatTable(tableRows);
            tableRows = [];
            return tableHtml + processLine(line);
        }
        
        return processLine(line);
    }).join('').replace(/(<li[^>]*>.*<\/li>)/g, '<ul style="margin:1rem 0; padding-left:1.5rem;">$1</ul>')
    .replace(/<\/ul>\s*<ul[^>]*>/g, '');
    
    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        result = result.replace(`__CODE_BLOCK_${index}__`, block);
    });
    
    return result;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyCode(blockId) {
    const codeBlock = document.getElementById(blockId);
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const button = codeBlock.parentElement.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        button.style.background = '#28a745';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#00d4ff';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const button = codeBlock.parentElement.querySelector('button');
        button.textContent = 'Copiado!';
        setTimeout(() => button.textContent = 'Copiar', 2000);
    });
}

function formatTable(rows) {
    if (rows.length < 2) return '';
    
    const headerRow = rows[0].split('|').map(cell => cell.trim()).filter(cell => cell);
    const separatorRow = rows[1];
    const dataRows = rows.slice(2);
    
    let html = '<table style="width:100%; border-collapse:collapse; margin:1rem 0; background:#2a2a2a; border-radius:5px; overflow:hidden;">';
    
    // Header
    html += '<thead><tr>';
    headerRow.forEach(cell => {
        html += `<th style="padding:0.8rem; background:#333; color:#00d4ff; border-bottom:2px solid #00d4ff; text-align:left;">${cell}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    dataRows.forEach(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 0) {
            html += '<tr>';
            cells.forEach(cell => {
                html += `<td style="padding:0.8rem; color:#ccc; border-bottom:1px solid #444;">${formatInlineElements(cell)}</td>`;
            });
            html += '</tr>';
        }
    });
    html += '</tbody></table>';
    
    return html;
}

function processLine(line) {
    // Headers
    if (line.startsWith('### ')) {
        return `<h3 style="color:#00d4ff; margin:1.5rem 0 0.8rem 0; font-size:1.2rem;">${line.substring(4)}</h3>`;
    }
    if (line.startsWith('## ')) {
        return `<h2 style="color:#00d4ff; margin:2rem 0 1rem 0; font-size:1.4rem;">${line.substring(3)}</h2>`;
    }
    if (line.startsWith('# ')) {
        return `<h1 style="color:#00d4ff; margin:2rem 0 1rem 0; font-size:1.6rem;">${line.substring(2)}</h1>`;
    }
    
    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
        return `<li style="margin:0.3rem 0; color:#ccc; line-height:1.5;">${formatInlineElements(line.substring(2))}</li>`;
    }
    if (line.match(/^\d+\. /)) {
        return `<li style="margin:0.3rem 0; color:#ccc; line-height:1.5;">${formatInlineElements(line.replace(/^\d+\. /, ''))}</li>`;
    }
    
    // Empty lines
    if (line.trim() === '') {
        return '<br>';
    }
    
    // Regular paragraphs
    return `<p style="margin:0.8rem 0; line-height:1.6; color:#ccc;">${formatInlineElements(line)}</p>`;
}

function formatInlineElements(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="color:#ddd;">$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:#2a2a2a; padding:0.2rem 0.4rem; border-radius:3px; color:#00d4ff; font-family:monospace;">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#00d4ff; text-decoration:underline;" target="_blank">$1</a>');
}

function createModal() {
    const modalHTML = `
        <div id="content-modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.8); align-items:center; justify-content:center;">
            <div style="background:#1a1a1a; border:1px solid #333; border-radius:12px; width:90%; max-width:900px; max-height:90vh; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 2rem; border-bottom:1px solid #333; background:#2a2a2a; border-radius:12px 12px 0 0;">
                    <h2 id="modal-title" style="color:#00d4ff; margin:0; font-size:1.5rem;">Título</h2>
                    <button onclick="closeModal()" style="background:none; border:none; color:#ccc; font-size:1.5rem; cursor:pointer; padding:0.5rem; border-radius:50%; width:40px; height:40px;">&times;</button>
                </div>
                <div id="modal-body" style="padding:2rem; overflow-y:auto; flex:1; color:#fff;">
                    Conteúdo
                </div>
            </div>
        </div>
        <style>
            #modal-body ul {
                margin: 1rem 0;
                padding-left: 1.5rem;
                list-style-type: disc;
            }
            #modal-body ol {
                margin: 1rem 0;
                padding-left: 1.5rem;
                list-style-type: none;
            }
            #modal-body li {
                margin: 0.5rem 0;
                line-height: 1.6;
                color: #ccc;
            }
            #modal-body li strong {
                color: #fff;
            }
            #modal-body li em {
                color: #ddd;
            }
            #modal-body h1 {
                margin: 2rem 0 1.5rem 0;
                color: #00d4ff;
            }
            #modal-body h2 {
                margin: 2rem 0 1.2rem 0;
                color: #00d4ff;
                border-bottom: 2px solid #333;
                padding-bottom: 0.5rem;
            }
            #modal-body h3 {
                margin: 1.5rem 0 1rem 0;
                color: #00d4ff;
            }
            #modal-body p {
                margin: 1rem 0;
                line-height: 1.6;
            }
            /* Glossary specific styles - only when modal title contains "Glossário" */
            #content-modal:has(#modal-title:contains("Glossário")) #modal-body p strong,
            #content-modal[data-glossary="true"] #modal-body p strong {
                display: block;
                background: linear-gradient(135deg, #00d4ff20, #00d4ff10);
                border-left: 4px solid #00d4ff;
                padding: 0.8rem 1rem;
                margin: 1.5rem 0 0.5rem 0;
                border-radius: 0 8px 8px 0;
                color: #00d4ff;
                font-size: 1.1em;
                font-weight: 600;
            }
            #content-modal:has(#modal-title:contains("Glossário")) #modal-body p:has(strong),
            #content-modal[data-glossary="true"] #modal-body p:has(strong) {
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #333;
            }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('content-modal').onclick = function(e) {
        if (e.target === this) closeModal();
    };
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// Create modal when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createModal);
} else {
    createModal();
}
