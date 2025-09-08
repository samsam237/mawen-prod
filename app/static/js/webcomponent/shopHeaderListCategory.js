//import DetailProduit from './detailProduit.js';
class shopHeaderListCategory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .nav-container {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }
                .scroll-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #525150;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    cursor: pointer;
                    z-index: 1;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.3s ease;
                    display: flex;
                }
                .scroll-button:hover {
                    background: #666;
                }
                .scroll-left {
                    left: 8px;
                }
                .scroll-right {
                    right: 8px;
                }
                .elements {
                    padding: 0;
                    display: flex;
                    flex-direction: row;
                    background-color: #52515059;
                    border-radius: 24px;
                    justify-content: space-between;
                    overflow-x: auto;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                    scroll-behavior: smooth;
                }
                .elements::-webkit-scrollbar {
                    display: none;
                }
                .element {
                    list-style-type: none;
                    padding: 10px 16px;
                    border: 1px solid #FFD700;
                    border-radius: 5px;
                    margin: 2px;                    
                    cursor: pointer;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .highlight {
                    background-color: #FFD700;
                    opacity: 0.75;
                }
                @media screen and (max-width: 800px) {
                    .scroll-button {
                        display: flex;
                    }
                    .list-cat {
                        padding: 0 40px;
                    }
                }
            </style>
            <div class="nav-container">
                <button class="scroll-button scroll-left">←</button>
                <ul class="elements"></ul>
                <button class="scroll-button scroll-right">→</button>
            </div>
        `;

        this.handleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
        const data = this.getAttribute('data');
        const elementsList = this.shadowRoot.querySelector('.elements');
        const leftButton = this.shadowRoot.querySelector('.scroll-left');
        const rightButton = this.shadowRoot.querySelector('.scroll-right');

        if (data) {
            data.split(",").forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.trim();
                li.classList.add('element');
                elementsList.appendChild(li);
                // li.addEventListener('click', () => {
                //     const detailProduit = new DetailProduit();
                //     detailProduit.setAttribute('data', category);
                //     document.body.appendChild(detailProduit);
                // });
                // li.addEventListener('click', () => {
                //     const detailProduit = document.createElement('detail-produit');
                //     detailProduit.setAttribute('data', category);
                //     document.body.appendChild(detailProduit);
                // });
                /* li.addEventListener('click', () => {
                    const detailProduit = new CustomEvent('detail-produit', { detail: category });
                    this.dispatchEvent(detailProduit);
                }); */
            });

            const listItems = this.shadowRoot.querySelectorAll('.element');
            listItems.forEach(item => {
                item.addEventListener('click', () => {
                    listItems.forEach(li => li.classList.remove('highlight'));
                    item.classList.add('highlight');
                    this.emitEvent(item.innerHTML);
                    
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start' // Utilise 'start' pour faire défiler vers le début de l'élément
                    });
                });
            });

            // Scroll button functionality
            leftButton.addEventListener('click', () => {
                elementsList.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                });
            });

            rightButton.addEventListener('click', () => {
                elementsList.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                });
            });

            // Scroll handling
            elementsList.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', this.handleScroll);
            this.handleScroll();
        }
    }

    handleScroll() {
        const elementsList = this.shadowRoot.querySelector('.elements');
        const leftButton = this.shadowRoot.querySelector('.scroll-left');
        const rightButton = this.shadowRoot.querySelector('.scroll-right');

        const showLeftButton = elementsList.scrollLeft > 0;
        const showRightButton = elementsList.scrollLeft < (elementsList.scrollWidth - elementsList.clientWidth);

        leftButton.style.opacity = showLeftButton ? '1' : '0';
        rightButton.style.opacity = showRightButton ? '1' : '0';
        
        leftButton.style.pointerEvents = showLeftButton ? 'auto' : 'none';
        rightButton.style.pointerEvents = showRightButton ? 'auto' : 'none';
    }

    disconnectedCallback() {
        const elementsList = this.shadowRoot.querySelector('.elements');
        elementsList.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
    }

    emitEvent(data) {
        const event = new CustomEvent('refresh-screen-data', {
            detail: data,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }
}

customElements.define('shop-header-list-category', shopHeaderListCategory);