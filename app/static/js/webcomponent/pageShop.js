
class pageShop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style> 
                .shop-container{
                    margin:5px; width:100%;
                }   
                .elements {
                    display:flex; flex-direction:row; flex-wrap:wrap;
                    justify-content: space-around;
                }
            </style>

            <div class="shop-container">
                            
                <div class="elements">

                </div>

            </div>
        `;
        this.elts = null;
        this.dataAtt = null;
    }

    connectedCallback() {
        const inputString = convertUnicodeEscapeToChar (this.getAttribute('data-shop').replace(/``/g, '"').replace("\\", "").replace("\\", "").slice(1, -1));
        this.dataAtt = JSON.parse( inputString );

        this.elts = this.shadowRoot.querySelector('.elements');
        
        this.handleEvent = this.handleEvent.bind(this);
        window.addEventListener('refresh-screen-data', this.handleEvent);    
    }

    //updateElements (elts, data, cat){
    updateElements (cat){
        //const parseData = JSON.parse(data);
        const parseData = this.dataAtt
        const myData = parseData[cat];
        this.elts.innerHTML = '';
        if (!myData) return
        myData.forEach(element => {
            const shopElement = document.createElement('shop-element');
            shopElement.classList.add('shop-element');
            shopElement.setAttribute('nom', element.nom);
            shopElement.setAttribute('prix', element["prix de vente"]);
            shopElement.setAttribute('image', element.image);
            this.elts.appendChild(shopElement);
        });
    }

    handleEvent(event) {
        /* console.log('Événement reçu:', event.detail);
        console.log (this.dataAtt)
        console.log (this.elts) */
        
        //this.updateElements (this.elts, this.dataAtt, event.detail);
        this.updateElements (event.detail);
    }  
}

customElements.define('page-shop', pageShop);
