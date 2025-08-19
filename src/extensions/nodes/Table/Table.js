import { Node, mergeAttributes } from "@tiptap/core";
import { getNearestBlockDepth } from "../../../utils";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import debounce from "lodash.debounce";

const name = "table";
const tablePluginKey = new PluginKey("tablePluginKey");

// FIX: copy and paste

const createTableDOM = (HTMLAttributes, options) => {
  const blockDiv = document.createElement("div");
  const contentDiv = document.createElement("div");
  const table = document.createElement("table");
  table.className = "table";
  const tbody = document.createElement("tbody");
  tbody.className = "tbody";

  table.appendChild(tbody);
  contentDiv.appendChild(table);
  blockDiv.appendChild(contentDiv);

  Object.entries(mergeAttributes(HTMLAttributes, options.blockAttrs)).forEach(
    ([key, value]) => {
      blockDiv.setAttribute(key, value);
    }
  );

  Object.entries(options.contentAttrs).forEach(([key, value]) => {
    contentDiv.setAttribute(key, value);
  });

  return { blockDiv, tbody, table };
};

function createVerticalLine() {
  const line = document.createElement("div");
  line.style.cssText =
    "width: 2px; height: 100%; background: #0096ff; position: absolute; top: 0; left: 0; z-index: 100; transform: translateX(-50%); pointer-events: none;";
  line.contentEditable = false;
  return line;
}

const Table = Node.create({
  name,
  // IDEA: link color
  group: "block table",
  content: "tableRow+",
  resizable: true,

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      contentAttrs: {
        class: `content content-${name}`,
      },
    };
  },

  addAttributes() {
    return {
      contentType: {
        default: name,
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, view }) => {
      let currentNode = node;

      const { blockDiv, tbody, table } = createTableDOM(
        HTMLAttributes,
        this.options
      );

      let prevCellIndex = null;
      let prevSide = null;
      let prevCanProceed = null;

      const handleTableMouseMove = debounce((e) => {
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const cell = e.target.closest("td");
        if (!cell) return;

        const row = cell.parentNode;
        const cellIndex = Array.from(row.children).indexOf(cell);

        const rect = cell.getBoundingClientRect();
        const { clientX } = e;
        const { left, right } = rect;

        let result = { canProceed: false, side: null };
        if (cellIndex === 0 && Math.abs(clientX - right) <= 10) {
          result = { canProceed: true, side: "right", right };
        } else if (cellIndex !== 0 && Math.abs(clientX - right) <= 10) {
          result = { canProceed: true, side: "right", right };
        } else if (cellIndex !== 0 && Math.abs(clientX - left) <= 10) {
          result = { canProceed: true, side: "left", left };
        }

        const { canProceed, side } = result;

        if (!canProceed) return;

        const hoveredCells = [];

        // IDEA: got to be watchful when working with this (pos are relative)
        currentNode.descendants((node, pos, parent, index) => {
          // REVIEW:
          //   console.log({ name: node.type.name, pos });

          if (node.type.name === "tableCell" && index === cellIndex) {
            // TODO: what???
            hoveredCells.push({ node, pos: getPos() + pos + 1, ...result });

            return true;
          }
        });

        tr.setMeta("hoveredCells", hoveredCells);
        dispatch(tr);
      }, 16);

      const handleTableMouseLeave = () => {
        const tr = view.state.tr;
        const dispatch = view.dispatch;

        tr.setMeta("hoveredCells", null);
        dispatch(tr);
      };

      // FIX
      table.addEventListener("mousemove", handleTableMouseMove);
      table.addEventListener("mouseleave", handleTableMouseLeave);

      return {
        dom: blockDiv,
        contentDOM: tbody,
        update: (updatedNode) => {
          currentNode = updatedNode;

          return updatedNode.type === node.type;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    let prevSet = null;

    return [
      new Plugin({
        key: tablePluginKey,

        state: {
          init() {
            return null;
          },

          apply(tr, value) {
            const hoveredCells = tr.getMeta("hoveredCells");

            // TODO:
            console.log("apply");

            // FIX
            if (!hoveredCells) return null;

            return hoveredCells;
          },
        },

        props: {
          decorations: (state) => {
            const hoveredCells = tablePluginKey.getState(state);

            // TODO:
            console.log("decorations", hoveredCells);

            if (!hoveredCells) return DecorationSet.empty;

            const set = DecorationSet.create(
              state.doc,
              hoveredCells.map((params) => {
                const { node, pos, side } = params;
                return Decoration.node(pos, pos + node.nodeSize, {
                  class: side === "right" ? "right" : "left",
                });
              })
            );

            return set;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      insertTable:
        (rowCount = 2, columnCount = 4) =>
        // IDEA: view, editor, commands, can, chain
        ({ dispatch, state, tr }) => {
          const { selection } = state;
          const { $from } = selection;
          // REVIEW: when pressed, this is the paragraph
          const before = $from.before(getNearestBlockDepth($from));

          const cellNodes = [];
          for (let i = 0; i < columnCount; i++) {
            const cellNode = state.schema.nodes.tableCell.create();
            cellNodes.push(cellNode);
          }

          const rowNodes = [];
          for (let i = 0; i < rowCount; i++) {
            const rowNode = state.schema.nodes.tableRow.create({}, cellNodes);
            rowNodes.push(rowNode);
          }

          const tableNode = state.schema.nodes.table.create({}, rowNodes);

          tr.insert(before, tableNode);
          tr.setSelection(TextSelection.create(tr.doc, before + 3));

          dispatch(tr);

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      1: ({ editor }) => {
        return editor.commands.insertTable();
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }, { tag: "table" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.contentAttrs,
        ["table", { class: "table" }, ["tbody", { class: "tbody" }, 0]],
      ],
    ];
  },
});

export default Table;
