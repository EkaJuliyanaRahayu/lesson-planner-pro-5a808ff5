import { useNavigate } from "react-router-dom";
import { FilePlus, FileText, Trash2, Download, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocuments, deleteDocument } from "@/lib/storage";
import { generateFullPDF, generateStagePDF } from "@/lib/pdf";
import { STAGE_LABELS, STAGES, DocumentRecord } from "@/lib/types";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Index() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState(getDocuments());

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDocs(getDocuments());
    toast.success("Dokumen dihapus");
  };

  // Group documents by kelas, then by mataPelajaran
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, DocumentRecord[]>> = {};
    for (const doc of docs) {
      if (!map[doc.kelas]) map[doc.kelas] = {};
      if (!map[doc.kelas][doc.mataPelajaran]) map[doc.kelas][doc.mataPelajaran] = [];
      map[doc.kelas][doc.mataPelajaran].push(doc);
    }
    return map;
  }, [docs]);

  const sortedKelas = Object.keys(grouped).sort();

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
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Dokumen Tersimpan ({docs.length})
            </h2>

            {sortedKelas.map((kelas) => (
              <Collapsible key={kelas} defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                  <h3 className="text-base font-semibold text-foreground">Kelas {kelas}</h3>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({Object.keys(grouped[kelas]).length} mata pelajaran)
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4 pl-7">
                  {Object.keys(grouped[kelas]).sort().map((mapel) => (
                    <div key={mapel} className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">{mapel}</h4>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {grouped[kelas][mapel].map((doc) => (
                          <Card key={doc.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-destructive hover:text-destructive h-7 w-7 p-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {/* Stage badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {STAGES.map((stage) => (
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

                              {/* Individual stage downloads */}
                              <div className="grid grid-cols-2 gap-1.5">
                                {STAGES.map((stage) => {
                                  const hasData = doc[stage].rows.length > 0;
                                  return (
                                    <Button
                                      key={stage}
                                      variant="outline"
                                      size="sm"
                                      disabled={!hasData}
                                      onClick={() => generateStagePDF(doc, stage)}
                                      className="text-xs h-7"
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      {stage.toUpperCase()}
                                    </Button>
                                  );
                                })}
                              </div>

                              {/* Full download */}
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full"
                                onClick={() => generateFullPDF(doc)}
                              >
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Unduh Semua
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
