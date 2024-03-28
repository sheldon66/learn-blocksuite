import "@blocksuite/presets/themes/affine.css";

import { createEmptyDoc } from "@blocksuite/presets";
import { Text } from "@blocksuite/store";
import { SimplePageEditor } from "./simple-page-editor";

(async () => {
  // Init editor with default block tree
  const doc = createEmptyDoc().init();
  const editor = new SimplePageEditor();
  editor.doc = doc;
  document.body.appendChild(editor);

  // Update block node with some initial text content
  const paragraphs = doc.getBlockByFlavour("affine:paragraph");
  const paragraph = paragraphs[0];
  doc.updateBlock(paragraph, { text: new Text("Hello World!") });
})();
