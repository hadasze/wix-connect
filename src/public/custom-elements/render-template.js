class HTMLCE extends HTMLElement {

    static get observedAttributes() {
        return ['html'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        //setTimeout reasone: it resolves the bug of: data is not loaded on 'preview sent communication' because things happens too fast.
        setTimeout(() => {
            if (name === 'html') {
                this.innerHTML = newValue;
            }
        }, 10);
    }
}

customElements.define('html-ce', HTMLCE);