
class PageMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style> 
                .menu-container{
                    margin:5px; width:100%;
                }    
                .nom{
                    border-bottom: #FFD700 2px solid;
                    width: 3.5rem;
                    font-size: 2rem;
                    margin-bottom:1.5rem;
                }   
                .desc{
                    margin-bottom:1.5rem;
                    margin-left:1.5rem;
                }    
                .elements {
                    display:flex; flex-direction:row; flex-wrap:wrap;
                    justify-content: space-around;
                }
                menu-element{
                    margin-top: 5px;
                }
            </style>

            <div class="menu-container">
            
                <div class="nom"></div>

                <div class="desc"></div>

                <div class="nav"></div>
                            
                <div class="elements">

                </div>

            </div>
        `;
        this.dataAtt = null;
        this.elts = null;
    }

    connectedCallback() {
        const nomAtt = this.getAttribute('nom');
        const descAtt = this.getAttribute('desc');
        const catAtt = this.getAttribute('categories');
        //this.dataAtt = getJSONFile( this.getAttribute('data') );
        const inputString = convertUnicodeEscapeToChar (this.getAttribute('data').replace(/``/g, '"').replace(/\\/g, "").slice(1, -1));
        /* console.log (inputString) */
        this.dataAtt = JSON.parse( inputString );

        const nav = this.shadowRoot.querySelector('.nav');
        this.elts = this.shadowRoot.querySelector('.elements');
        
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
        this.addEventListener('refresh-screen-data', this.handleEvent);
    }

    updateElements (cat){
        const myData = this.dataAtt[cat];
        this.elts.innerHTML = '';
        if (!myData) return
        myData.forEach(element => {
            const menuElement = document.createElement('menu-element');
            menuElement.setAttribute('nom', element.nom);
            menuElement.setAttribute('prix', element.prix);
            menuElement.setAttribute('image', element.image);
            this.elts.appendChild(menuElement);
        });
    }
    handleEvent(event) {
        /* console.log('Événement reçu:', event.detail);
        console.log (this.dataAtt)
        console.log (this.elts) */
        
        this.updateElements (event.detail);
    }    
}

customElements.define('page-menu', PageMenu);
