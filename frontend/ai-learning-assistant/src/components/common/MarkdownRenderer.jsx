import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-neutral max-w-none text-neutral-800 text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2 text-neutral-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-3 mb-2 text-neutral-800" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1 text-neutral-800" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mt-2 mb-1 text-neutral-800" {...props} />,
          
          // Paragraphs & Links
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-neutral-700 font-normal" {...props} />,
          a: ({ node, ...props }) => <a className="text-emerald-600 hover:text-emerald-700 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
          
          // Lists
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-neutral-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-neutral-700" {...props} />,
          li: ({ node, ...props }) => <li className="pl-0.5" {...props} />,
          
          // Text Styling
          strong: ({ node, ...props }) => <strong className="font-semibold text-neutral-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-neutral-800" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-emerald-500 bg-neutral-50 pl-4 py-1 italic my-3 text-neutral-600 rounded-r" {...props} />,
          
          // Code Highlighting Blocks
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 rounded-xl overflow-hidden border border-neutral-200 shadow-sm text-sm">
                <div className="bg-neutral-800 text-neutral-400 px-4 py-1.5 text-xs font-mono border-b border-neutral-700 flex justify-between items-center">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1rem', background: '#282a36' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-neutral-100 text-rose-600 px-1.5 py-0.5 rounded text-sm font-mono border border-neutral-200" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => <pre className="bg-transparent p-0 m-0" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;