
let tmpl = `
<template id="ai-texttemp">
<div>
  <p>fish 2</p>
</div>
</template>
`;


class AITextInput extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    // shadowRoot.appendChild(tmpl.content.cloneNode(true));
    this.shadowRoot.innerHTML = `
      <style>
        p {
          color: green;
        }
        #boxwrapper{
          
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: repeat(1, 1fr);
          grid-column-gap: 0px;
          grid-row-gap: 0px;
          
        }
        button{
          padding: 1em;
        }
      </style>
      <div id="boxwrapper">
        <textarea id="magicbox" name="magicbox" placeholder="Code a story" cols="55" rows="8" minlength="10" maxlength="500" spellcheck></textarea>
        <button id="gobutton">Go!</button>
      </div>
    `;
    
  }
  
  connectedCallback(){
    
    const button = document.querySelector("ai-textinput").shadowRoot.getElementById("gobutton");
    const magicbox = document.querySelector("ai-textinput").shadowRoot.getElementById("magicbox");
    console.log("button", button);
    console.log("magicbox", magicbox);

    button.addEventListener("click", (x)=>{
      // console.log("?!?!?!?");
      // console.log(magicbox.value);
      this.dispatchEvent(new CustomEvent("send", {detail:magicbox.value}));
    });
    
  }
  
}

customElements.define("ai-textinput", AITextInput);
