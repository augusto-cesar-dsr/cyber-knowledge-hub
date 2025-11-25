// Main Application Controller
class CyberKnowledgeApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.modules = {};
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.registerModules();
        this.bindGlobalEvents();
        this.initializeApp();
    }
    
    showLoadingScreen() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
    }
    
    hideLoadingScreen() {
        document.body.style.opacity = '1';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    registerModules() {
        this.modules = {
            navigation: navigationManager,
            components: componentManager
        };
    }
    
    bindGlobalEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });
        
        this.monitorPerformance();
    }
    
    handleKeyboardShortcuts(e) {
        const sections = ['home', 'fundamentals', 'network-security', 'penetration-testing', 'incident-response', 'tools', 'resources', 'glossary'];
        if (e.key >= '1' && e.key <= '8') {
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.modules.navigation.showSection(sections[sectionIndex]);
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showSearchModal();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showHelpModal();
        }
    }
    
    handleGlobalError(error) {
        console.error('Global error:', error);
    }
    
    monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    // Performance metrics available for monitoring
                }, 0);
            });
        }
    }
    
    showSearchModal() {
        // Search functionality to be implemented
    }
    
    showHelpModal() {
        // Help functionality to be implemented
    }
    
    initializeApp() {
        this.isInitialized = true;
        this.hideLoadingScreen();
        // Application initialized successfully
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CyberKnowledgeApp();
});
