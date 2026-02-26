declare module 'html-to-text' {
  export interface HtmlToTextOptions {
    wordwrap?: number | false;
    [key: string]: unknown;
  }

  export function htmlToText(html: string, options?: HtmlToTextOptions): string;
}
