// Navigation Management - Simplified for Modal System
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.contentSections = document.querySelectorAll('.content-section');
        this.sidebar = document.getElementById('sidebar');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleInitialHash();
    }
    
    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.closeMobileMenu();
            });
        });
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
        
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    showSection(sectionId) {
        history.pushState(null, null, `#${sectionId}`);
        
        this.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        const targetNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        // Navigation completed
    }
    
    handleInitialHash() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'home';
        this.showSection(section);
    }
    
    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'home';
        this.showSection(section);
    }
    
    toggleMobileMenu() {
        this.sidebar.classList.toggle('mobile-open');
    }
    
    closeMobileMenu() {
        this.sidebar.classList.remove('mobile-open');
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            this.sidebar.classList.remove('mobile-open');
        }
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
}

// Initialize navigation manager
const navigationManager = new NavigationManager();

// Global functions
function showSection(sectionId) {
    if (navigationManager) {
        navigationManager.showSection(sectionId);
    }
}
