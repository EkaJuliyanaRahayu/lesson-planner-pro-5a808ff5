export interface TableRow {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export interface StageData {
  rows: TableRow[];
}

export interface DocumentRecord {
  id: string;
  kelas: string;
  mataPelajaran: string;
  cp: StageData;
  tp: StageData;
  atp: StageData;
  rpp: StageData;
  completedStages: string[];
  createdAt: string;
}

export const KELAS_OPTIONS = ["10", "11", "12"] as const;

export const MATA_PELAJARAN_OPTIONS = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "Pendidikan Pancasila",
  "Seni Budaya",
  "PJOK",
  "Informatika",
] as const;

export const STAGE_LABELS: Record<string, { title: string; col1: string; col2: string; col3: string; col4: string }> = {
  cp: { title: "Capaian Pembelajaran (CP)", col1: "Elemen", col2: "Capaian Pembelajaran", col3: "Kompetensi", col4: "Ruang Lingkup/Materi" },
  tp: { title: "Tujuan Pembelajaran (TP)", col1: "Elemen", col2: "Tujuan Pembelajaran", col3: "Kompetensi", col4: "Ruang Lingkup/Materi" },
  atp: { title: "Alur Tujuan Pembelajaran (ATP)", col1: "Elemen", col2: "Alur Tujuan Pembelajaran", col3: "Kompetensi", col4: "Ruang Lingkup/Materi" },
  rpp: { title: "Rencana Pelaksanaan Pembelajaran (RPP)", col1: "Elemen", col2: "Rencana Pelaksanaan Pembelajaran", col3: "Kompetensi", col4: "Ruang Lingkup/Materi" },
};

export const STAGES = ["cp", "tp", "atp", "rpp"] as const;
