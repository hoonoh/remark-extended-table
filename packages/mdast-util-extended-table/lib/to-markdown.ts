import type { Handle } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown, Options as gfmTableToMarkdownOptions } from 'mdast-util-gfm-table';
import type { Table, TableCell } from './types.js';

export type extendedTableToMarkdownOptions = gfmTableToMarkdownOptions;

function makeColspanCellNode(): TableCell {
  return {
    type: 'tableCell',
    // @ts-ignore
    children: [{ type: 'tableCellColspan', children: [] as string[] }],
  };
}

function makeRowspanCellNode(): TableCell {
  return {
    type: 'tableCell',
    // @ts-ignore
    children: [{ type: 'tableCellRowspan', children: [] as string[] }],
  };
}

export const extendedTableToMarkdown = (options?: extendedTableToMarkdownOptions) => {
  const tableHandler: Handle = (node: Table, parent, context, safeOptions) => {
    for (let i = 1; i < node.children.length; i++) {
      const row = node.children[i];

      let j = 0;
      while (j < row.children.length) {
        const cell = row.children[j];

        let offsetCol = 0;
        if (cell.colspan != null && cell.colspan > 1) {
          for (let k = 0; k < cell.colspan - 1; k++) {
            row.children.splice(j, 0, makeColspanCellNode());
            offsetCol += 1;
          }
        }

        if (cell.rowspan != null && cell.rowspan > 1) {
          for (let k = 0; k < cell.rowspan - 1; k++) {
            const targetRow = node.children[i + k + 1];
            for (let l = 0; l < (cell.colspan ? cell.colspan : 1); l++) {
              targetRow.children.splice(j + l, 0, makeRowspanCellNode());
            }
          }
        }

        j += 1 + offsetCol;
      }
    }
    return gfmTableToMarkdown(options).handlers!.table(node, parent, context, safeOptions);
  };

  const handleCellColspan: Handle = (_node, _parent, _context) => {
    return '>';
  };

  const handleCellRowspan: Handle = (_node, _parent, _context) => {
    return '^';
  };

  return {
    unsafe: [
      { character: '^', inConstruct: ['tableCell'] },
      { character: '>', inConstruct: ['tableCell'] },
    ],
    handlers: {
      table: tableHandler,
      tableCellColspan: handleCellColspan,
      tableCellRowspan: handleCellRowspan,
    },
  };
};