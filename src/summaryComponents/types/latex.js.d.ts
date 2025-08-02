declare module 'latex.js' {
  export function parse(
    latex: string,
    options?: { generator?: HtmlGenerator }
  ): {
    domFragment: () => DocumentFragment;
  };

  export class HtmlGenerator {
    constructor(options?: any);
    // Add other methods/properties if needed
  }
}