import "@blocksuite/presets/themes/affine.css";
import {
  EditorHost,
  ShadowlessElement,
  WithDisposable,
} from "@blocksuite/block-std";
import { PageEditorBlockSpecs } from "@blocksuite/blocks";
import { noop } from "@blocksuite/global/utils";
import type { Doc } from "@blocksuite/store";
import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, type Ref, ref } from "lit/directives/ref.js";

import { AffineSchemas } from "@blocksuite/blocks/schemas";
import { DocCollection, Schema } from "@blocksuite/store";

export function createEmptyDoc() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  const doc = collection.createDoc();

  return {
    doc,
    init() {
      doc.load();
      const rootId = doc.addBlock("affine:page", {});
      doc.addBlock("affine:surface", {}, rootId);
      const noteId = doc.addBlock("affine:note", {}, rootId);
      doc.addBlock("affine:paragraph", {}, noteId);
      return doc;
    },
  };
}

noop(EditorHost);

@customElement("page-editor")
export class PageEditor extends WithDisposable(ShadowlessElement) {
  static override styles = css`
    page-editor {
      font-family: var(--affine-font-family);
      background: var(--affine-background-primary-color);
    }

    page-editor * {
      box-sizing: border-box;
    }

    @media print {
      page-editor {
        height: auto;
      }
    }

    .affine-page-viewport {
      position: relative;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      container-name: viewport;
      container-type: inline-size;
    }

    .page-editor-container {
      display: block;
      height: 100%;
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
    this._disposables.add(
      this.doc.slots.rootAdded.on(() => this.requestUpdate())
    );
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
        class=${this.hasViewport
          ? "affine-page-viewport"
          : "page-editor-container"}
      >
        <editor-host
          ${ref(this._host)}
          .doc=${this.doc}
          .specs=${this.specs}
        ></editor-host>
      </div>
    `;
  }
}

export const mount = async () => {
  // Init editor with default block tree
  const doc = createEmptyDoc().init();
  const editor = new PageEditor();
  editor.doc = doc;
  document.body.appendChild(editor);

  // Update block node with some initial text content
  const paragraphs = doc.getBlockByFlavour("affine:paragraph");
  const paragraph = paragraphs[0];
  doc.updateBlock(paragraph, { text: new Text("Hello World!") });
};
