import { visit } from 'unist-util-visit';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import unindent from 'unindent';

const metaRe = /^[^\(]*\(([^\)#]+)(?:#(\d+)(?:-(\d+))?)?\)[^\)]*$/;
const fileCache = new Map<string, Promise<string>>();

interface CodeNode extends Node {
  type: 'code';
  value: string;
  lang?: string;
  meta?: string;
}

interface FileInfo {
  path: string;
  startLine?: number;
  endLine?: number;
}

export const remarkCodeSource: Plugin = () => {
  return async (tree) => {
    const promises: Promise<void>[] = [];

    visit(tree, 'code', (node: CodeNode) => {
      if (node.meta) {
        const fileInfo = extractFileInfo(node.meta);
        if (fileInfo) {
          const promise = readFile(fileInfo.path).then((content) => {
            node.value = extractLines(content, fileInfo.startLine, fileInfo.endLine);
          });
          promises.push(promise);
        }
      }
    });

    await Promise.all(promises);
  };
};

function extractFileInfo(meta: string): FileInfo | undefined {
  const match = meta.match(metaRe);
  if (match) {
    return {
      path: match[1],
      startLine: match[2] ? parseInt(match[2], 10) : undefined,
      endLine: match[3] ? parseInt(match[3], 10) : undefined,
    };
  }
  return undefined;
}

function extractLines(content: string, startLine?: number, endLine?: number): string {
  if (startLine === undefined) {
    return trimTrailingBlankLines(content);
  }

  const lines = content.split('\n');
  const start = Math.max(0, startLine - 1);
  const end = endLine ? Math.min(lines.length, endLine) : start + 1;
  const extracted = lines.slice(start, end).join('\n');
  const trimmedContent = trimTrailingBlankLines(unindent(extracted));
  return trimmedContent;
}

function trimTrailingBlankLines(content: string): string {
  const lines = content.split('\n');
  let endIndex = lines.length;

  while (endIndex > 0 && lines[endIndex - 1].trim() === '') {
    endIndex -= 1;
  }
  const trimmedContent = lines.slice(0, endIndex).join('\n');
  
  return trimmedContent;
}

async function readFile(filePath: string): Promise<string> {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath)!;
  }

  const resolvedSourcePath = path.resolve(process.cwd(), filePath);
  const readFilePromise = fs.readFile(resolvedSourcePath, 'utf8')
    .catch((error) => {
      console.error(`Failed to read file: ${filePath}`, error);
      return `Error: Failed to read file ${filePath}`;
    });

  fileCache.set(filePath, readFilePromise);
  return readFilePromise;
}

export default remarkCodeSource;
