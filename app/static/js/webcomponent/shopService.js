class ShopService extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'description', 'image', 'button-text'];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: flex;
                    width: 100%;
                    margin: 20px auto;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .image-section {
                    flex: 1;
                }
                
                .image-section img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .content-section {
                    flex: 2;
                    display: flex;
                    flex-direction: column;
                }
                .content-section *{
                    margin: 0 auto;
                }
                
                .title {
                    font-size: 3.25rem;
                    margin-bottom: 25px;
                    margin-top:15px;
                }
                
                .message {
                    margin-top: 10px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                    font-size:1rem;
                }
                
                .action-button {
                    width:200px;
                    padding: 10px 20px;
                    background-color: #FFD700;
                    color: black;
                    font-weight: bold;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                @media screen and (max-width: 800px){
                    .container{
                        flex-direction: column-reverse;
                    }
                    .container img{
                        margin-top: 10px;
                        width : 100%;
                    }
                    .title {
                        font-size: 2rem;}
                }
                
            </style>
            
            <div class="container">
                <div class="image-section">
                    <img src="${this.getAttribute('image')}" alt="Service Image">
                </div>
                <div class="content-section">
                    <div class="title">${this.getAttribute('title')}</div>
                    <p class="message">${this.getAttribute('description')}</p>
                    <button class="action-button">${this.getAttribute('button-text')}</button>
                </div>
            </div>
        `;
    }
}

customElements.define('shop-service', ShopService);
