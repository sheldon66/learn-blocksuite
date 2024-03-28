// Default BlockSuite editable blocks
import { PageEditorBlockSpecs } from "@blocksuite/blocks";
// The container for mounting block UI components
import {
  EditorHost,
  ShadowlessElement,
  WithDisposable,
} from "@blocksuite/block-std";
// The store for working with block tree
import { type Doc } from "@blocksuite/store";
import { createRef, type Ref, ref } from "lit/directives/ref.js";

// Standard lit framework primitives
import { css, html, nothing, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("simple-page-editor")
export class SimplePageEditor extends WithDisposable(ShadowlessElement) {
  static override styles = css`
    .affine-page-viewport {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      container-name: viewport;
      container-type: inline-size;
    }
  `;
  @property({ attribute: false })
  doc!: Doc;
  @property({ attribute: false })
  specs = PageEditorBlockSpecs;

  @property({ type: Boolean })
  hasViewport = true;

  private _host: Ref<EditorHost> = createRef<EditorHost>();
  get host() {
    return this._host.value as EditorHost;
  }
  override connectedCallback() {
    super.connectedCallback();
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.host.updateComplete;
    return result;
  }

  override render() {
    if (!this.doc.root) return nothing;
    return html`
      <div
        class=${
          this.hasViewport ? "affine-page-viewport" : "page-editor-container"
        }
      >
        <editor-host
          ${ref(this._host)}
          .doc=${this.doc}
          .specs=${this.specs}
        ></editor-host>
      </div>
      </div>
    `;
  }
}
