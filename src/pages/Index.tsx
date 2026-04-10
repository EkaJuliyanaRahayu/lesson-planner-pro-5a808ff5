import { useNavigate } from "react-router-dom";
import { FilePlus, FileText, Trash2, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocuments, deleteDocument } from "@/lib/storage";
import { generateFullPDF } from "@/lib/pdf";
import { STAGE_LABELS } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState(getDocuments());

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDocs(getDocuments());
    toast.success("Dokumen dihapus");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistem Pembelajaran</h1>
              <p className="text-sm text-muted-foreground">Generate CP, TP, ATP & RPP</p>
            </div>
          </div>
          <Button onClick={() => navigate("/generate")}>
            <FilePlus className="h-4 w-4 mr-2" /> Generate Baru
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {docs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Belum Ada Dokumen</h2>
            <p className="text-muted-foreground mb-6">Mulai dengan membuat dokumen pembelajaran baru</p>
            <Button onClick={() => navigate("/generate")}>
              <FilePlus className="h-4 w-4 mr-2" /> Generate Baru
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Dokumen Tersimpan ({docs.length})</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{doc.mataPelajaran}</span>
                      <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Kelas {doc.kelas}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(["cp", "tp", "atp", "rpp"] as const).map((stage) => (
                        <span
                          key={stage}
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            doc.completedStages.includes(stage)
                              ? "bg-step-completed/15 text-step-completed"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {stage.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => generateFullPDF(doc)}>
                        <Download className="h-3 w-3 mr-1" /> Unduh
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
