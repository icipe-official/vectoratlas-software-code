import ReactMarkdown from 'react-markdown';

// Display-only fix for mojibake: a UTF-8 non-breaking space read as
// Latin-1 shows up as "Â". Real fix is correcting the stored data.
export const cleanText = (text: string) => text.replace(/Â[\u00A0 ]?/g, ' ');

// Renders Markdown inline without a <p> wrapper, so table cells and
// cards keep their layout.
export const InlineMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => <>{children}</>,
    }}
  >
    {cleanText(children)}
  </ReactMarkdown>
);
