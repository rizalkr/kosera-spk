'use client';

import React from 'react';

interface ChatMarkdownProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Strip a trailing unclosed markdown marker while tokens are still streaming
 * so the user never sees stray "**" or "`" flickering at the end of a line.
 */
export function sanitizeStreamingMarkdown(text: string, isStreaming: boolean): string {
  if (!isStreaming) return text;
  let cleaned = text;
  // Remove trailing dangling "**" or "*" if odd number of bold markers on the last line
  const lastNewline = cleaned.lastIndexOf('\n');
  const tail = cleaned.slice(lastNewline + 1);
  const boldCount = (tail.match(/\*\*/g) || []).length;
  if (boldCount % 2 === 1 && tail.endsWith('**')) {
    cleaned = cleaned.slice(0, -2);
  } else if (tail.endsWith('*') && !tail.endsWith('**')) {
    const singleStars = tail.replace(/\*\*/g, '').match(/\*/g) || [];
    if (singleStars.length % 2 === 1) {
      cleaned = cleaned.slice(0, -1);
    }
  }
  return cleaned;
}

/**
 * Render inline markdown (`**bold**`, `*italic*`, `` `code` ``) safely into React nodes
 * without using dangerouslySetInnerHTML.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match **bold**, `code`, or *italic* (non-greedy, single-line)
  const tokenRegex = /(\*\*[^*\n]+?\*\*|`[^`\n]+?`|\*[^*\n]+?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-[var(--ink-primary)]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="px-1 py-0.5 rounded-[5px] bg-[var(--bg-muted)] text-[var(--ink-primary)] font-mono text-[11px]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={`${keyPrefix}-i-${idx}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(token);
    }

    lastIndex = match.index + token.length;
    idx += 1;
  }

  if (lastIndex < text.length) {
    // Strip any leftover unmatched "**" so raw double-asterisks never leak visually
    const tail = text.slice(lastIndex).replace(/\*\*/g, '');
    if (tail) nodes.push(tail);
  }

  return nodes;
}

const ChatMarkdown = React.memo(function ChatMarkdown({
  content,
  isStreaming = false,
}: ChatMarkdownProps) {
  const displayText = sanitizeStreamingMarkdown(content, isStreaming);
  const lines = displayText.split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Heading lines (#, ##, ###)
    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      blocks.push(
        <h4
          key={`h-${i}`}
          className="text-xs font-bold text-[var(--ink-primary)] pt-1 first:pt-0"
        >
          {renderInline(headingMatch[1], `h-${i}`)}
        </h4>
      );
      i += 1;
      continue;
    }

    // Ordered list item (e.g. "1. **Kost Rahayu...**") optionally followed by indented bullet lines
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      const listItems: Array<{ num: string; title: string; subBullets: string[]; key: number }> = [];
      while (i < lines.length) {
        const curTrimmed = lines[i].trim();
        const om = curTrimmed.match(/^(\d+)\.\s+(.+)$/);
        if (om) {
          listItems.push({ num: om[1], title: om[2], subBullets: [], key: i });
          i += 1;
          // Collect indented sub-bullets belonging to this numbered item
          while (i < lines.length) {
            const subLine = lines[i];
            const subTrimmed = subLine.trim();
            const subBulletMatch = subTrimmed.match(/^[-*•]\s+(.+)$/);
            if (subBulletMatch && (/^\s+/.test(subLine) || listItems.length > 0)) {
              // Stop if the next line is a new numbered item or blank followed by non-bullet
              listItems[listItems.length - 1].subBullets.push(subBulletMatch[1]);
              i += 1;
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }

      blocks.push(
        <ol key={`ol-${listItems[0].key}`} className="space-y-2 my-1">
          {listItems.map((item) => (
            <li key={`oli-${item.key}`} className="space-y-1">
              <div className="flex items-start gap-1.5">
                <span className="font-mono-tabular font-semibold text-[var(--accent-primary)] shrink-0">
                  {item.num}.
                </span>
                <span className="flex-1">{renderInline(item.title, `oli-${item.key}`)}</span>
              </div>
              {item.subBullets.length > 0 && (
                <ul className="pl-4 space-y-0.5 text-[11.5px] text-[var(--ink-secondary)]">
                  {item.subBullets.map((sub, sIdx) => (
                    <li key={`sub-${item.key}-${sIdx}`} className="flex items-start gap-1.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--ink-secondary)]/60 shrink-0" />
                      <span className="flex-1">{renderInline(sub, `sub-${item.key}-${sIdx}`)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Unordered bullet list (- or *)
    if (/^[-*•]\s+/.test(trimmed)) {
      const bullets: Array<{ text: string; key: number }> = [];
      while (i < lines.length) {
        const bm = lines[i].trim().match(/^[-*•]\s+(.+)$/);
        if (!bm) break;
        bullets.push({ text: bm[1], key: i });
        i += 1;
      }

      blocks.push(
        <ul key={`ul-${bullets[0].key}`} className="space-y-1 my-1 pl-1">
          {bullets.map((b) => (
            <li key={`uli-${b.key}`} className="flex items-start gap-1.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]/70 shrink-0" />
              <span className="flex-1">{renderInline(b.text, `uli-${b.key}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Normal paragraph (combine consecutive plain lines)
    const paraLines: string[] = [];
    const startIdx = i;
    while (i < lines.length) {
      const cur = lines[i].trim();
      if (!cur || /^#{1,3}\s+/.test(cur) || /^\d+\.\s+/.test(cur) || /^[-*•]\s+/.test(cur)) {
        break;
      }
      paraLines.push(cur);
      i += 1;
    }

    blocks.push(
      <p key={`p-${startIdx}`} className="leading-relaxed">
        {renderInline(paraLines.join(' '), `p-${startIdx}`)}
      </p>
    );
  }

  return (
    <div className="space-y-1.5 text-xs leading-relaxed break-words">
      {blocks}
      {isStreaming && (
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-3.5 rounded-[1px] bg-[var(--accent-primary)] animate-pulse align-middle ml-0.5"
        />
      )}
    </div>
  );
});

export default ChatMarkdown;
