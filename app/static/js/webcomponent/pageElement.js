
class PageElements extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>     
                       
            
            </style>

            <div class="page-element">
            
                <div class="nom"></div>

                <div class="desc"></div>

                <div class="nav"></div>
                            
                <div class="elements">

                </div>

            </div>
        `;
    }

    connectedCallback() {
        const nomAtt = this.getAttribute('nom');
        const descAtt = this.getAttribute('desc');
        const catAtt = this.getAttribute('categories');

        const nav = this.shadowRoot.querySelector('.nav');
        const elts = this.shadowRoot.querySelector('.elements');
        
        if (nomAtt){
            this.shadowRoot.querySelector('.nom').innerHTML = nomAtt;
        }
        if (descAtt){
            this.shadowRoot.querySelector('.desc').innerHTML = descAtt;
        }
        if (catAtt){
            const navMenu = document.createElement('nav-menu');
            navMenu.setAttribute('elts', catAtt);
            elts.appendChild(navMenu);
        }
        

    }

}

customElements.define('page-elements', PageElements);
