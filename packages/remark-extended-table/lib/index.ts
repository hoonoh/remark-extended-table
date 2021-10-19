import type { Processor } from 'unified';
import { extendedTable } from 'micromark-extension-extended-table';
import {
  extendedTableFromMarkdown,
  extendedTableToMarkdown,
  extendedTableToMarkdownOptions,
} from 'mdast-util-extended-table';
export { extendedTableHandler, extendedTableHandlers } from 'mdast-util-extended-table';

export function remarkExtendedTable(
  this: Processor,
  options?: extendedTableToMarkdownOptions,
): void {
  const data = this.data();

  add('micromarkExtensions', extendedTable);
  add('fromMarkdownExtensions', extendedTableFromMarkdown);
  add('toMarkdownExtensions', extendedTableToMarkdown(options));

  function add(field: string, value: any) {
    if (data[field] == null) {
      data[field] = [];
    }
    const list = data[field];
    if (!(list instanceof Array)) {
      throw new Error(`expect data[${field}] is array`);
    }
    list.push(value);
  }
}

export default remarkExtendedTable;
