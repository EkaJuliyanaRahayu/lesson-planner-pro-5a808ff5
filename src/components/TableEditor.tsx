import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TableRow } from "@/lib/types";

interface TableEditorProps {
  col1Label: string;
  col2Label: string;
  col3Label: string;
  col4Label: string;
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
}

export default function TableEditor({ col1Label, col2Label, col3Label, col4Label, rows, onChange }: TableEditorProps) {
  const addRow = () => {
    onChange([...rows, { id: crypto.randomUUID(), col1: "", col2: "", col3: "", col4: "" }]);
  };

  const deleteRow = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: "col1" | "col2" | "col3" | "col4", value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-3 text-left font-medium w-[160px]">{col1Label}</th>
              <th className="px-3 py-3 text-left font-medium">{col2Label}</th>
              <th className="px-3 py-3 text-left font-medium">{col3Label}</th>
              <th className="px-3 py-3 text-left font-medium">{col4Label}</th>
              <th className="px-3 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Belum ada data. Klik tombol "Tambah Baris" untuk menambahkan.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="px-2 py-2 align-top">
                  <Textarea
                    value={row.col1}
                    onChange={(e) => updateRow(row.id, "col1", e.target.value)}
                    placeholder={`${col1Label}...`}
                    className="border-border min-h-[60px] resize-y"
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <Textarea
                    value={row.col2}
                    onChange={(e) => updateRow(row.id, "col2", e.target.value)}
                    placeholder={`${col2Label}...`}
                    className="border-border min-h-[60px] resize-y"
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <Textarea
                    value={row.col3}
                    onChange={(e) => updateRow(row.id, "col3", e.target.value)}
                    placeholder={`${col3Label}...`}
                    className="border-border min-h-[60px] resize-y"
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <Textarea
                    value={row.col4}
                    onChange={(e) => updateRow(row.id, "col4", e.target.value)}
                    placeholder={`${col4Label}...`}
                    className="border-border min-h-[60px] resize-y"
                  />
                </td>
                <td className="px-2 py-2 align-top">
                  <Button variant="ghost" size="icon" onClick={() => deleteRow(row.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="outline" size="sm" onClick={addRow}>
        <Plus className="h-4 w-4 mr-1" /> Tambah Baris
      </Button>
    </div>
  );
}
