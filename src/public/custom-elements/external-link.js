const openLinkInNewTab = (linkToOpen, _this) => {
    const aLink = document.createElement('a');
    aLink.href = linkToOpen;
    aLink.target = '_blank';
    aLink.id = 'temp-link';
    _this.shadowRoot.appendChild(aLink);
    aLink.click();
    setTimeout(() => {
        this.shadowRoot.removeChild(_this.shadowRoot.getElementById('temp-link'));
    }, 100)
}

const DELIMITER = '&v='

class ExternalLink extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'link' && newValue) {
            const isUnique = decodeURI(newValue).indexOf(DELIMITER) > -1;
            const linkToOpen = isUnique ? decodeURI(newValue).split(DELIMITER)[0] : newValue;
            window.open(linkToOpen, "_blank");
        }
    }

    static get observedAttributes() {
        return ['link'];
    }
}

customElements.define('external-link', ExternalLink);