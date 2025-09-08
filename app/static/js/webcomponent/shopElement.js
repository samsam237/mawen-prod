class shopElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .shop-element{
                    display: flex; flex-direction: column;
                    justify-content: space-between;
                    text-align: left; align-items: center;
                    font-size: 12px;
                    
                    padding:8px 15px;margin : 10px;
                    cursor: pointer;
                    background: #2C2A24;
                    border-radius: 8px;
                    width: 200px; height:300px;
                }
                .container{
                    height : 100%; width : 100%;
                    padding : 10px; padding-top:0;
                }
                .shop-title{
                    font-size: 1rem;
                }
                .shop-prix{
                    color: #FFD700;
                }
                .shop-image{
                    width: 200px; height: 220px;
                    margin: auto;
                }
                @media screen and (max-width: 800px){
                    .shop-element{
                        flex-direction: column-reverse;
                    }
                    .container .shop-image{
                        width : 100%;
                    }
                    
                }
            </style>
            <div class="shop-element">
                <div class="container"> 
                    <img src="" class="shop-image" alt="shop-image" />
                </div>
                <div class="container">
                    <div class="shop-title"></div>
                    <div class="shop-prix"></div>
                </div>
            </div>
        `;
    }
    connectedCallback() {
        const image = this.getAttribute('image');
        const description = this.getAttribute('description');
        const nom = this.getAttribute('nom');
        const prix = this.getAttribute('prix');
        if (image) {
            this.shadowRoot.querySelector('.shop-image').src = image;
        }
        if (nom) {
            this.shadowRoot.querySelector('.shop-title').textContent = nom;
        }
        if (prix) {
            this.shadowRoot.querySelector('.shop-prix').textContent = prix;
        }

        this.shadowRoot.querySelector('.shop-element').addEventListener('click', () => {
            const productComponent = document.createElement('detail-produit');
            productComponent.setAttribute('nom', nom);
            productComponent.setAttribute('prix', prix);
            productComponent.setAttribute('description', description);
            productComponent.setAttribute('image', image);
            
            this.shadowRoot.appendChild(productComponent)
            
        });
    }
}
customElements.define('shop-element', shopElement);