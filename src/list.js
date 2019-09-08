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

    let start = this.getPosition(this.scrollTop);
    let end = this.getPosition(this.getBottom());

    if (isForward) {
      end += this.overscanCount;
    } else {
      start -= this.overscanCount;
    }

    start = start < 0 ? 0 : start;
    end = end > this.totalCount ? this.totalCount : end;

    this.list = list.slice(start, end);
  }

  getBottom() {
    return this.visibleHeight + this.scrollTop;
  }

  getPosition(height) {
    return Math.floor(height / this.rowHeight);
  }

  firstUpdated() {
    this.visibleHeight = this.shadowRoot
      .getElementById(this.containerId)
      .getBoundingClientRect().height;
    this.list = list.slice(
      0,
      this.getPosition(this.visibleHeight) + this.overscanCount
    );
  }
}

customElements.define("my-list", MyList);
