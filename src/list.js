import { LitElement, html, css } from "lit-element";

const list = new Array(10000).fill(null).map((key, index) => {
  return {
    text: `Item#${index}`,
    rowIndex: index
  };
});

class MyList extends LitElement {
  static get properties() {
    return {
      list: { type: Array },
      scrollTop: { type: Number },
      visibleHeight: { type: Number }
    };
  }

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }
      .container {
        position: relative;
        border: 1px solid #ccc;
        overflow-y: auto;
        height: calc(100vh);
      }
      ul {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        position: absolute;
        padding: 0 10px 0 10px;
        border-bottom: 1px solid #c1c;
        width: 100%;
        display: flex;
        align-items: center;
      }
    `;
  }

  constructor() {
    super();
    this.list = [];
    this.rowHeight = 50;
    this.scrollTop = 0;
    this.visibleHeight = 0;
    this.containerId = "container";
    this.overscanCount = 5;
    this.totalCount = list.length;
  }

  render() {
    return html`
      <div
        class="container"
        id="${this.containerId}"
        @scroll="${this.handleScroll}"
      >
        <ul style="height: ${this.totalCount * this.rowHeight}px">
          ${this.list.map(item => {
            const top = item.rowIndex * this.rowHeight;

            return html`
              <li
                style="height: ${this
                  .rowHeight}px;transform:translate(0, ${top}px)"
              >
                ${item.text}
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  isForward(oldVal, newVal) {
    return newVal > oldVal;
  }

  handleScroll(e) {
    const isForward = this.isForward(this.scrollTop, e.target.scrollTop);

    this.scrollTop = e.target.scrollTop;

    let startingIndex = this.getSize(this.scrollTop);
    let endIndex = this.getSize(this.getBottom());

    if (isForward) {
      endIndex += this.overscanCount;
    } else {
      startingIndex -= this.overscanCount;
    }

    startingIndex = startingIndex < 0 ? 0 : startingIndex;
    endIndex = endIndex > this.totalCount ? this.totalCount : endIndex;

    this.list = list.slice(startingIndex, endIndex);
  }

  getBottom() {
    return this.visibleHeight + this.scrollTop;
  }

  getSize(height) {
    return Math.floor(height / this.rowHeight);
  }

  firstUpdated() {
    this.visibleHeight = this.shadowRoot
      .getElementById(this.containerId)
      .getBoundingClientRect().height;
    this.list = list.slice(
      0,
      this.getSize(this.visibleHeight) + this.overscanCount
    );
  }

  shouldUpdate() {
    return true;
  }
}

customElements.define("my-list", MyList);
