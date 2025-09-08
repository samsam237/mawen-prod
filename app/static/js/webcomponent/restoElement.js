
class RestoElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .resto-element{
                    display: flex; flex-direction: row;
                    justify-content: space-between;
                    text-align: center; align-items: center
                    border-top: 1px solid #FFD700;
                    padding:0; margin:0;
                    max-width:100%; 
                }
                .resto-image{                    
                    width: 59rem; padding-bottom:0;
                }

                .resto-title{
                    font-size :2.5rem;
                }
                .resto-title span{
                    color: #FFD700;
                }

                .container{
                    flex : 1;  
                    height : 50%;                  
                }
                .container:first-child{
                    display: flex;
                    flex-direction:column;
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh;               
                }
                .container:last-child{
                    flex : 1;height : 100%;
                }

                .resto-button {
                    border-radius: 10px;
                    margin: 1rem;
                    border: none;
                    padding: 0.6rem;
                    font-size: 0.9rem;
                    font-weight: bold;
                    background-color: #FFD700;
                    transition: background-color 0.3s ease;
                }
                .resto-button:hover {
                    background-color: #555;
                    border-radius: 5px;
                    color: white;
                }

                .resto-description{
                    font-size: 1.3rem;
                }

                @media screen and (max-width: 800px){
                    .resto-element{
                        flex-direction: column;
                    }
                    .container .resto-image{
                        width : 100%;
                        padding-bottom:0;
                    }                    
                }
            </style>
            <div class="resto-element">
                <div class="container">
                    <div class="resto-title">
                        MAWEN <span>HOUSE</span>
                    </div>
                    <div class="resto-description"></div>
                    <button class="resto-button" type="button"></button>
                </div>

                <div class="container"> 
                    <img src="" class="resto-image" alt="resto-image" />
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const image = this.getAttribute('image');
        const description = this.getAttribute('description');
        const buttonText = this.getAttribute('button-text');

        if (image) {
            this.shadowRoot.querySelector('.resto-image').src = image;
        }
        if (description) {
            this.shadowRoot.querySelector('.resto-description').innerHTML = description.replace("\\n", "<br>");
        }
        if (buttonText) {
            this.shadowRoot.querySelector('.resto-button').textContent = buttonText;
        }else{
            this.shadowRoot.querySelector("resto-button").textContent = "Mawen Menu";
        }
    }

}

customElements.define('resto-element', RestoElement);
