import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

// Charger QuillEditor dynamiquement côté client
const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

// Le module resize n'a besoin d'être enregistré qu'une seule fois par session ;
// le réenregistrer à chaque montage déclenche un warning "Overwriting modules/resize" de Quill.
let resizeModuleRegistered = false;

interface EditorProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, placeholder, onChange }) => {
  const [modules, setModules] = useState<any>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Charger Quill et le module de redimensionnement uniquement côté client
      const [{ Quill }, { default: QuillResizeImage }] = await Promise.all([
        import("react-quill-new"),
        import("quill-resize-image"),
      ]);

      if (cancelled) return;

      if (!resizeModuleRegistered) {
        Quill.register("modules/resize", QuillResizeImage);
        resizeModuleRegistered = true;
      }

      setModules({
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header dropdown
          [{ font: [] }], // Font family dropdown
          [{ size: ["small", false, "large", "huge"] }], // Font size dropdown
          ["bold", "italic", "underline", "strike"], // Toggle buttons
          [{ color: [] }, { background: [] }], // Color and background
          [{ script: "sub" }, { script: "super" }], // Subscript, superscript
          ["blockquote", "code-block"], // Blockquote, code block
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Lists
          [{ indent: "-1" }, { indent: "+1" }], // Indent
          [{ direction: "rtl" }], // Text direction
          [{ align: [] }], // Alignment
          ["link", "image"], // Link, image
          ["clean"], // Clear formatting
        ],
        resize: {
          locale: {},
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Si les modules ne sont pas encore configurés, ne rien rendre
  if (!modules.toolbar) {
    return null;
  }

  return (
    <QuillEditor
      placeholder={placeholder}
      modules={modules}
      className={"focus-visible:border-ring focus-visible:ring-ring/50"}
      theme="snow"
      value={value}
      onChange={(content: string) => onChange(content)}
    />
  );
};

export default Editor;
