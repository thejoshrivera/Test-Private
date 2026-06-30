"use client";

import { useState, useCallback } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Papa from "papaparse";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  Table2,
} from "lucide-react";

interface ParsedRow {
  [key: string]: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rows: number;
  fields: string[];
}

const REQUIRED_FIELDS = ["instrumentTag", "calibrationDate", "status", "asFoundError", "tolerance"];
const RECOMMENDED_FIELDS = ["instrumentName", "location", "manufacturer", "drift", "laborHours", "calibrationCost"];
const SAMPLE_CSV = `instrumentTag,instrumentName,location,manufacturer,model,serialNumber,calibrationDate,nextCalibrationDate,technician,status,asFoundError,asLeftError,tolerance,drift,laborHours,calibrationCost,department,category
PT-201,Pressure Transmitter,Unit 5 Feed,Emerson,3051C,SN-1001,2025-06-01,2025-12-01,Mike Torres,pass,0.18,0.06,0.5,0.18,1.5,285,Operations,Pressure
FT-301,Flow Meter,Unit 5 Output,ABB,FV4000,SN-1002,2025-06-02,2025-12-02,Sarah Lee,fail,0.62,0.14,0.5,0.62,2.5,420,Quality,Flow`;

function validateCSV(data: ParsedRow[]): ValidationResult {
  if (!data.length) return { valid: false, errors: ["File contains no data rows."], warnings: [], rows: 0, fields: [] };

  const fields = Object.keys(data[0]);
  const errors: string[] = [];
  const warnings: string[] = [];

  const missingRequired = REQUIRED_FIELDS.filter((f) => !fields.includes(f));
  if (missingRequired.length > 0) {
    errors.push(`Missing required columns: ${missingRequired.join(", ")}`);
  }

  const missingRecommended = RECOMMENDED_FIELDS.filter((f) => !fields.includes(f));
  if (missingRecommended.length > 0) {
    warnings.push(`Missing recommended columns: ${missingRecommended.join(", ")} — some analytics will be limited.`);
  }

  let invalidDates = 0;
  let invalidStatus = 0;
  data.forEach((row) => {
    if (row.calibrationDate && isNaN(Date.parse(row.calibrationDate))) invalidDates++;
    if (row.status && !["pass", "fail", "overdue", "pending"].includes(row.status.toLowerCase())) invalidStatus++;
  });
  if (invalidDates > 0) warnings.push(`${invalidDates} rows have invalid date formats.`);
  if (invalidStatus > 0) warnings.push(`${invalidStatus} rows have unexpected status values (expected: pass, fail, overdue, pending).`);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    rows: data.length,
    fields,
  };
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return;
    }
    setFile(f);
    setImported(false);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as ParsedRow[];
        setParsedData(data);
        setValidation(validateCSV(data));
      },
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleImport = async () => {
    if (!parsedData || !validation?.valid) return;
    setImporting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setImporting(false);
    setImported(true);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calibration-data-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Topbar title="Import Data" subtitle="Upload calibration CSV files to import new records" />
      <div className="p-6 space-y-6 max-w-4xl">

        {/* Info */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">CSV Import Format</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Upload calibration records exported from Beamex CMX, Fluke MET/CAL, or any calibration management system.
                  Records are validated, analyzed, and merged into the intelligence platform.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Required: </span>
                    {REQUIRED_FIELDS.map((f) => (
                      <span key={f} className="mx-0.5 font-mono text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={downloadSample}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Sample CSV
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all",
            dragging ? "border-[#3b82f6] bg-[#3b82f6]/5" : "border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15]"
          )}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
              dragging ? "bg-[#3b82f6]/20 text-[#3b82f6]" : "bg-zinc-800 text-zinc-400"
            )}>
              <Upload className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-300">
              {dragging ? "Drop your CSV file here" : "Drag & drop a CSV file, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-zinc-600">Supports calibration exports from Beamex, Fluke, and custom formats</p>
          </div>
        </div>

        {/* Validation results */}
        {file && validation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validation.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                )}
                File Validation — {file.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Records</div>
                  <div className="text-xl font-bold text-white mt-1">{validation.rows}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Columns</div>
                  <div className="text-xl font-bold text-white mt-1">{validation.fields.length}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Status</div>
                  <div className="mt-1">
                    <Badge variant={validation.valid ? "pass" : "fail"}>
                      {validation.valid ? "Ready to Import" : "Errors Found"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {validation.errors.map((e) => (
                <div key={e} className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 mb-2 text-xs text-red-400">
                  <X className="h-3.5 w-3.5 shrink-0" />
                  {e}
                </div>
              ))}

              {/* Warnings */}
              {validation.warnings.map((w) => (
                <div key={w} className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 mb-2 text-xs text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {w}
                </div>
              ))}

              {/* Fields detected */}
              <div className="mt-4">
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Detected Columns</div>
                <div className="flex flex-wrap gap-1.5">
                  {validation.fields.map((f) => (
                    <span key={f} className={cn(
                      "font-mono text-[10px] px-2 py-0.5 rounded",
                      REQUIRED_FIELDS.includes(f) ? "bg-emerald-500/15 text-emerald-400" :
                      RECOMMENDED_FIELDS.includes(f) ? "bg-[#3b82f6]/15 text-[#3b82f6]" :
                      "bg-zinc-800 text-zinc-500"
                    )}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview table */}
              {parsedData && parsedData.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Table2 className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Preview (first 3 rows)</span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-zinc-900/50">
                          {validation.fields.slice(0, 8).map((f) => (
                            <th key={f} className="px-3 py-2 text-left font-semibold text-zinc-500 whitespace-nowrap">{f}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 3).map((row, i) => (
                          <tr key={i} className="border-b border-white/[0.03]">
                            {validation.fields.slice(0, 8).map((f) => (
                              <td key={f} className="px-3 py-2 text-zinc-400 whitespace-nowrap">{row[f] || "—"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import button */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleImport}
                  disabled={!validation.valid || importing || imported}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
                    imported
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      : "bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  {importing ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Importing...
                    </>
                  ) : imported ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {validation.rows} Records Imported
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import {validation.rows} Records
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setFile(null); setParsedData(null); setValidation(null); setImported(false); }}
                  className="rounded-xl border border-white/[0.06] px-5 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent imports placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "calibrations-q2-2025.csv", date: "2025-06-15", records: 35, status: "success" },
                { name: "unit2-audit-may2025.csv", date: "2025-05-20", records: 12, status: "success" },
                { name: "beamex-export-apr2025.csv", date: "2025-04-10", records: 28, status: "success" },
              ].map((imp) => (
                <div key={imp.name} className="flex items-center gap-4 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <FileText className="h-4 w-4 text-zinc-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-300">{imp.name}</div>
                    <div className="text-xs text-zinc-600">{imp.date} · {imp.records} records</div>
                  </div>
                  <Badge variant="pass">Imported</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
