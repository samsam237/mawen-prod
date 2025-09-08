class NavMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>    
                *{
                    font-family: Poppins;
                }
                li{
                    list-style-type: none;
                }
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
                .scroll-left {
                    left: 0;
                }
                .scroll-right {
                    right: 0;
                }
                .list-cat{
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
                .list-cat::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }
                .cat-elt{
                    padding: 10px 8px;
                    border-radius: 24px;
                    min-width: 70px;
                    text-align: center;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .cat-elt:hover{
                    background-color: #FFD700;
                    cursor: pointer;
                }
                .highlight{
                    background-color: #FFD700;
                }
                @media (max-width: 768px) {
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
                <ul class="list-cat"></ul>
                <button class="scroll-button scroll-right">→</button>
            </div>`;

        this.handleScroll = this.handleScroll.bind(this);
    }

    connectedCallback() {
        const eltAtt = this.getAttribute('elts');
        const listCat = this.shadowRoot.querySelector('.list-cat');
        const leftButton = this.shadowRoot.querySelector('.scroll-left');
        const rightButton = this.shadowRoot.querySelector('.scroll-right');
        
        if (eltAtt) {
            eltAtt.split(",").forEach(element => {
                var li = document.createElement('li');
                li.setAttribute('class', 'cat-elt');
                li.appendChild(document.createTextNode(element.trim()));
                listCat.appendChild(li);
            });

            const listItems = this.shadowRoot.querySelectorAll('.cat-elt');
            listItems.forEach(item => {
                item.addEventListener('click', () => {
                    listItems.forEach(li => li.classList.remove('highlight'));
                    item.classList.add('highlight');
                    this.emitEvent(item.innerHTML);
                    
                    // Scroll into view when clicked
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                });
            });
        }

        // Scroll buttons functionality
        leftButton.addEventListener('click', () => {
            listCat.scrollBy({
                left: -100,
                behavior: 'smooth'
            });
        });

        rightButton.addEventListener('click', () => {
            listCat.scrollBy({
                left: 100,
                behavior: 'smooth'
            });
        });

        // Handle scroll button visibility
        listCat.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleScroll);
        
        // Initial check for scroll buttons
        this.handleScroll();
    }

    handleScroll() {
        const listCat = this.shadowRoot.querySelector('.list-cat');
        const leftButton = this.shadowRoot.querySelector('.scroll-left');
        const rightButton = this.shadowRoot.querySelector('.scroll-right');

        // Show/hide scroll buttons based on scroll position
        const showLeftButton = listCat.scrollLeft > 0;
        const showRightButton = listCat.scrollLeft < (listCat.scrollWidth - listCat.clientWidth);

        leftButton.style.opacity = showLeftButton ? '1' : '0';
        rightButton.style.opacity = showRightButton ? '1' : '0';
        
        // Disable pointer events when buttons are hidden
        leftButton.style.pointerEvents = showLeftButton ? 'auto' : 'none';
        rightButton.style.pointerEvents = showRightButton ? 'auto' : 'none';
    }

    disconnectedCallback() {
        const listCat = this.shadowRoot.querySelector('.list-cat');
        listCat.removeEventListener('scroll', this.handleScroll);
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

customElements.define('nav-menu', NavMenu);