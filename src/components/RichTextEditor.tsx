import React from "react";
import Editor, {
  BtnBold,
  BtnItalic,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import { Button } from "./ui/button";
import { Brain } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { improveExperienceWithAI } from "../actions/resume";
import { Loader2 } from "lucide-react";


type Props = {
  value: string;
  onChange: (value: string) => void;
};



function RichTextEditor({ value, onChange }: Props) {

  const [loading, setLoading] = useState(false);

  
  const onImprove = async () => {
    if (!value || value.replace(/<[^>]*>/g, "").length < 10) {
      toast.error("Please write some content before improving with AI");
      return;
    }

    try {
      setLoading(true);
      const improvedHtml = await improveExperienceWithAI(value);
      onChange(improvedHtml);
      toast.success("Experience improved with AI");
    } catch (err: any) {
      toast.error(err.message || "AI improvement failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-2">
        <label className="text-sm">Summary</label>
     <Button size="sm" className="cursor-pointer" onClick={onImprove} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Brain className="h-4 w-4 mr-1" />
          )}
          Improve with AI
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
