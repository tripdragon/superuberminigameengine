
let tmpl = `
<template id="ai-texttemp">
<div>
  <p>fish</p>
</div>
</template>
`;


class AITextInput extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));
  }
  // Element functionality written in here
}

customElements.define("ai-textinput", AITextInput);
