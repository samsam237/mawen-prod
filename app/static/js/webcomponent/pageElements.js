
class PageElements extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>     
                       
            
            </style>

            <div class="page-elements">
            
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
        const dataAtt = this.getAttribute('data');

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
            nav.appendChild(navMenu);
        }
        if (dataAtt){
            const data = JSON.parse(dataAtt);
            data.forEach(element => {
                const menuElement = document.createElement('menu-element');
                menuElement.setAttribute('nom', element.nom);
                menuElement.setAttribute('prix', element.prix);
                menuElement.setAttribute('image', element.image);
                elts.appendChild(menuElement);
            });
        }

    }

}

customElements.define('page-elements', PageElements);
