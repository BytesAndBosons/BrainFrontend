// =========================================================
// Code Styling
// =========================================================
export interface Styler {
    getStylizedText: (text: string) => string;
}

export class CodeStyler implements Styler {

    static supportedLang: string[] = ["typescript", "javascript", "bash", "terraform", "prometheus", "yaml", "json", "java", "promql", "python", "c++", "dockerfile"];
    styler: Styler = new GenericCodeStyler([""], [""], [""], [""], [""]);

    // Snippet constructor
    constructor(protected codingLang: string) {

        let charsKeys: string[] = [" ", "(", ")", "[", "]", "{", "}", ",", ":", ";", "&lt;", "&gt;", "\n"];
        let colors: string[] = ["#7D808A", "#D19A66", "#98C379"];

        // Make sure codingLang is lowercase
        codingLang = codingLang.toLowerCase();

        switch (codingLang) {
            case "typescript":
                this.styler = new GenericCodeStyler(["//"], ["abstract", "await", "async", "try", "catch", "then", "basic", "const", "string", "switch", "v-if", "v-else", "v-for", "if", "else", "map", "while", "for", "number", "boolean", "void", "case", "return", "const", "function", "interface", "implements", "extends", "new", "class", "this", "super", "as", "import", "export", "from", "let", "default", "break", "array", "enum", "null", "undefined", "never", "any", "typeof", "of"], ["\"", "`", "\'"], charsKeys, colors);
                break;
            case "javascript":
                this.styler = new GenericCodeStyler(["//"], ["useActionState", "useTransition", "useContext", "useCallback", "useMemo", "use","useEffect", "useState","useRef", "await", "async", "try", "catch", "then", "basic", "const", "string", "switch", "if", "else", "while", "for", "number", "map", "boolean", "void", "case", "return", "const", "function", "interface", "implements", "extends", "new", "class", "this", "super", "as", "import", "export", "from", "let", "default", "break", "array", "enum", "null", "undefined", "never", "any", "typeof", "of"], ["\"", "`", "\'"], charsKeys, colors);
                break;
            case "c++":
                this.styler = new GenericCodeStyler(["//"], ["if", "return", "class", "else", "for", "public", "protected", "private", "const", "virtual", "void", "bool"], ["\"", "\'"], charsKeys, colors);
                break;
            case "bash":
                this.styler = new GenericCodeStyler(["#"], ["openssl", "minikube", "install", "podman", "kubeadm", "kubelet", "update", "containerd", "helm", "kubectl", "brew", "npm", "tsc", "terraform", "ansible", "config", "dump", "ping", "docker", "build", "push", "run", "docker-compose", "up", "down"], ["\"", "EOF"], charsKeys, colors);
                break;
            case "go":
                this.styler = new GenericCodeStyler(["//"], ["func", "package", "import", "Println", "int", "var", "bool", "string", "int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16", "uint32", "uint64", "float32", "float64", "complex64", "complex128", "for", "range", "map", "make", "struct", "type", "return", "append", "delete"], ["\""], charsKeys, colors);
                break;
            case "terraform":
                this.styler = new GenericCodeStyler(["#"], ["depends_on", "terraform", "backend", "resource", "variable","variables", "module", "output", "provider", "data", "locals", "local", "for", "in", "if", "import", "run", "provisioner", "lifecycle", "state", "moved"], ["\""], charsKeys, colors);
                break;
            case "prometheus":
                this.styler = new GenericCodeStyler(["#"], [], ["\""], charsKeys, colors);
                break;
            case "python":
                this.styler = new GenericCodeStyler(["#"], ["import", "from", "def", "if", "not", "for", "while", "class", "DataBlock", "ImageBlock", "CategoryBlock", "RandomSplitter", "Resize", "Path", "ResizeMethod", "RandomResizedCrop", "ClassificationInterpretation", "numpy", "pandas", "torch", "np", "pd", "df", "str", "int", "bytes", "float", "bool", "list", "tuple", "set", "dict", "Optional", "Union", "return", "async", "await"], ["\"", "\'"], charsKeys, colors);
                break;
            case "yaml":
                this.styler = new GenericCodeStyler(["#"], [], ["\"", "\'"], charsKeys, colors);
                break;
            case "java":
                this.styler = new GenericCodeStyler(["//"], ["new", "class", "static", "System", "out", "println", "String", "final", "void", "true", "false", "void", "boolean", "int", "return", "if", "else", "this", "public", "private", "protected", "sealed", "non-sealed"], ["\"", "\'"], charsKeys, colors);
                break;
            case "json":
                this.styler = new GenericCodeStyler(["#"], [], ["\"", "\'"], charsKeys, colors);
                break;
            case "promql":
                this.styler = new GenericCodeStyler(["#"], ["sum", "without", "delta", "avg", "rate"], ["\"", "\'"], charsKeys, colors);
                break;
            case "dockerfile":
                this.styler = new GenericCodeStyler(["#"], ["FROM", "LABEL", "RUN", "COPY", "WORKDIR", "ENTRYPOINT"], ["\"", "\'"], charsKeys, colors);
                break;
            case "shell":
                this.styler = new GenericCodeStyler(["#"], ["openssl", "minikube", "install", "podman", "kubeadm", "kubelet", "update", "containerd", "helm", "kubectl", "brew", "npm", "tsc", "terraform", "ansible", "config", "dump", "ping", "docker", "build", "push", "run", "docker-compose", "up", "down"], ["\"", "EOF"], charsKeys, colors);
                break;
            case "text":
                this.styler = new GenericCodeStyler(["#"], [], [], charsKeys, colors);
                break;
            case "generic":
                this.styler = new GenericCodeStyler(["#"], [], [], charsKeys, colors);
                break;
            default:
                this.styler = new GenericCodeStyler([], [], [], [], colors);
                break;
        }
    }

    // Get stylized text
    getStylizedText(text: string): string {
        return this.styler.getStylizedText(text);
    }
}


export class GenericCodeStyler {

    commSpanStart: string = "<span>";
    keySpanStart: string = "<span>";
    stringSpanStart: string = "<span>";

    // Constructor
    constructor(private commSigns: string[], private keyWords: string[], private stringSigns: string[], private charsKeys: string[], private colors: string[]) {
        this.commSpanStart = "<span style=\'color:" + this.colors[0] + "\'>";
        this.keySpanStart = "<span style=\'color:" + this.colors[1] + "\'>";
        this.stringSpanStart = "<span style=\'color:" + this.colors[2] + "\'>";
    }

    public getStylizedText(text: string): string {

        // Stylize the keywords defined in this.keyWords
        text = this.stylizeKeyWords(text);

        // Stylize strings 
        text = this.stylizeStrings(text);

        // Stylize comments
        text = this.stylizeComments(text);

        // Remove unwanted whitespaces
        text = this.eatWhiteSpaces(text);

        return text;

    }

    // Remove unwanted whitespaces
    protected eatWhiteSpaces(text: string): string {

        // If the text starts with an arbitrary number of whitespaces and a newline, remove them
        text = text.replace(/^\s*\n/, '');

        // Eat away whitespaces in beginning and determine linedepth
        let lineDepth: number = 0;
        while (text[0] == " ") {
            text = text.slice(1);
            lineDepth += 1;
        }

        // Eat away whitespaces at the end
        while (text[text.length - 1] == " " || text[text.length - 1] == "\n") {
            text = text.slice(0, -1);
        }

        // Eat away whitespaces after each newline to match linedepth
        text = text.replaceAll("\n" + " ".repeat(lineDepth-1), " \n");

        return text + " ";
    }

    // Stylize the keywords defined in this.keyWords
    protected stylizeKeyWords(text: string): string {
        for (const key of this.keyWords) {

            // Stylize the keywords if they are surrounded by two of the characters in this.charsKeys
            for (const c1 of this.charsKeys) {
                for (const c2 of this.charsKeys) {
                    text = text.replaceAll(c1 + key + c2, c1 + this.keySpanStart + key + "</span>" + c2);
                }
            }
        }

        return text;
    }

    // Stylize strings
    protected stylizeStrings(text: string): string {
        // Stylize strings
        text = text.replaceAll(this.keySpanStart, "<span>"); // since key words may already be stylized, I have to replace the <span ...> keywords

        for (const ssgn of this.stringSigns.reverse()) {
            let currentInd: number = text.indexOf(ssgn);

            let noLoops: number = 0;
            while (currentInd >= 0) {
                let currentEnd: number = text.indexOf(ssgn, currentInd + 1);

                if (!text.slice(currentInd, currentEnd).includes("\n") && currentEnd >= 0) {
                    let text_insertion: string = this.stringSpanStart + text.slice(currentInd, currentEnd + 1).replaceAll("<span>", "").replaceAll(this.stringSpanStart, "").replaceAll("</span>", "") + "</span>";
                    text = text.slice(0, currentInd) + text_insertion + text.slice(currentEnd + 1);
                    currentInd = currentInd + text_insertion.length;
                }

                currentInd = text.indexOf(ssgn, currentInd + 1);

                // Exit infinite loop if something goes wrong
                noLoops += 1;
                if (noLoops > 100) {
                    console.warn("Stuck in infinite loop. Exiting loop...");
                    break;
                }
            }
        }

        text = text.replaceAll("<span>", this.keySpanStart); //replacing back the <span ...> keywords
        return text;
    }

    // Stylize comments
    protected stylizeComments(text: string): string {
        for (const commSign of this.commSigns) {
            for (const prev of [" ", "\n"]) {
                let currentInd: number = text.indexOf(prev + commSign);

                let noLoops: number = 0;
                while (currentInd >= 0) {
                    let currentEnd: number = text.indexOf("\n", currentInd+1);
                    if (currentEnd == -1) {
                        currentEnd = text.length;
                    }

                    text = text.slice(0, currentInd+prev.length) + this.commSpanStart + text.slice(currentInd+prev.length, currentEnd).replaceAll(this.keySpanStart, "").replaceAll(this.stringSpanStart, "").replaceAll("</span>", "") + "</span>" + text.slice(currentEnd);

                    currentInd = currentInd + this.commSpanStart.length;
                    currentInd = text.indexOf(prev + commSign, currentInd + 1);

                    // Exit infinite loop if something goes wrong
                    noLoops += 1;
                    if (noLoops > 100) {
                        console.warn("Stuck in infinite loop. Exiting loop...");
                        break;
                    }
                }
            }

        }

        return text;
    }

}