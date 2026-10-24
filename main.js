const { Plugin } = require("obsidian");

const HORIZONTAL_MARKER = /^\s*->(\d+)\s*/;
const VERTICAL_MARKER = /^\s*-\^(\d+)\s*/;
const TABLE_CAPTION_MARKER = /^\s*\[([^\[\]\n]+)\]\s*$/;

module.exports = class SimpleTableMergePlugin extends Plugin {
  onload() {
    this.registerMarkdownPostProcessor((root) => {
      this.processTableCaptions(root);
      root.querySelectorAll("table").forEach((table) => this.processTable(table));
      this.processImageCaptions(root);
    });
  }

  processTableCaptions(root) {
    root.querySelectorAll("table").forEach((table) => {
      if (table.querySelector(":scope > caption.stm-table-caption")) return;

      let previous = table.previousElementSibling;
      if (!previous || previous.tagName !== "P") return;

      const match = (previous.textContent || "").match(TABLE_CAPTION_MARKER);
      if (!match) return;

      const caption = document.createElement("caption");
      caption.className = "stm-table-caption";
      caption.textContent = match[1].trim();
      table.insertBefore(caption, table.firstChild);
      previous.remove();
    });
  }

  processImageCaptions(root) {
    root.querySelectorAll("img").forEach((img) => {
      if (img.closest("figure.stm-image-figure")) return;

      const captionText = (img.getAttribute("alt") || "").trim();
      if (!captionText) return;

      const parent = img.parentElement;
      if (!parent) return;

      const figure = document.createElement("figure");
      figure.className = "stm-image-figure";

      const figcaption = document.createElement("figcaption");
      figcaption.className = "stm-image-caption";
      figcaption.textContent = captionText;

      // Keep an Obsidian internal-link wrapper, when one exists, inside the figure.
      const imageNode = parent.tagName === "A" && parent.children.length === 1 ? parent : img;
      imageNode.parentNode.insertBefore(figure, imageNode);
      figure.appendChild(imageNode);
      figure.appendChild(figcaption);
    });
  }

  processTable(table) {
    const rows = Array.from(table.querySelectorAll("tr"));
    if (!rows.length) return;

    const horizontal = [];
    const vertical = [];

    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.children).filter((el) =>
        el.tagName === "TD" || el.tagName === "TH"
      );

      cells.forEach((cell, cellIndex) => {
        const originalText = cell.textContent || "";
        const hMatch = originalText.match(HORIZONTAL_MARKER);
        const vMatch = originalText.match(VERTICAL_MARKER);

        if (hMatch) {
          const span = Number(hMatch[1]);
          if (Number.isInteger(span) && span >= 2 && cellIndex + span <= cells.length) {
            horizontal.push({
              cell,
              span,
              covered: cells.slice(cellIndex + 1, cellIndex + span),
              content: originalText.replace(HORIZONTAL_MARKER, "").trim()
            });
          }
        } else if (vMatch) {
          const span = Number(vMatch[1]);
          if (Number.isInteger(span) && span >= 2 && rowIndex + span <= rows.length) {
            const covered = [];
            let valid = true;

            for (let offset = 1; offset < span; offset++) {
              const nextRowCells = Array.from(rows[rowIndex + offset].children).filter((el) =>
                el.tagName === "TD" || el.tagName === "TH"
              );
              const target = nextRowCells[cellIndex];

              if (!target || (target.textContent || "").trim() !== "") {
                valid = false;
                break;
              }
              covered.push(target);
            }

            if (valid) {
              vertical.push({
                cell,
                span,
                covered,
                content: originalText.replace(VERTICAL_MARKER, "").trim()
              });
            }
          }
        }
      });
    });

    vertical.forEach((merge) => {
      merge.cell.setAttribute("rowspan", String(merge.span));
      merge.cell.textContent = merge.content;
      merge.cell.classList.add("stm-merged-cell");
      merge.covered.forEach((cell) => cell.remove());
    });

    horizontal.forEach((merge) => {
      if (!merge.cell.parentElement) return;
      merge.cell.setAttribute("colspan", String(merge.span));
      merge.cell.textContent = merge.content;
      merge.cell.classList.add("stm-merged-cell");
      merge.covered.forEach((cell) => {
        if (cell.parentElement) cell.remove();
      });
    });

    table.classList.add("stm-table-processed");
  }
};
