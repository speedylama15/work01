import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

function processElementsRecursively(element, currentIndent) {
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    const tagName = child.tagName;

    let childIndent = currentIndent;

    // IDEA: If we encounter ul or ol, increment indent for their contents
    if (tagName === "UL" || tagName === "OL") {
      childIndent = currentIndent + 1;
    }

    // IDEA: Assign data-indent-level to all elements (except ul/ol containers)
    if (tagName !== "UL" && tagName !== "OL") {
      const indentLevel = Math.max(currentIndent, 0);
      child.setAttribute("data-indent-level", indentLevel);
      // FIX
      console.log(`${tagName}: level ${indentLevel}`);
    }

    processElementsRecursively(child, childIndent);
  }
}

const paste_handle_indent_level = Extension.create({
  name: "paste_handle_indent_level",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          transformPastedHTML(html, view) {
            if (!html.includes("<")) return html;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // IDEA: Start with -1 so first ul/ol will set indent to 0
            processElementsRecursively(doc.body, -1);

            return doc.body.innerHTML;
          },
        },
      }),
    ];
  },
});

export default paste_handle_indent_level;
