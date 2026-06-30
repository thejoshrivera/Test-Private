import { CalibrationRecord, InstrumentSummary, DashboardKPIs, TrendDataPoint, HeatmapCell, ParetoEntry, Recommendation } from "./types";

// ─── Raw calibration records ────────────────────────────────────────────────
export const MOCK_RECORDS: CalibrationRecord[] = [
  // Pressure transmitter — consistent drift trending up
  { id: "r001", instrumentId: "PT-101", instrumentTag: "PT-101", instrumentName: "Pressure Transmitter A", location: "Unit 1 - Reactor Feed", manufacturer: "Emerson", model: "3051C", serialNumber: "SN-9021A", calibrationDate: "2024-01-15", nextCalibrationDate: "2024-07-15", technician: "Mike Torres", status: "pass", asFoundError: 0.12, asLeftError: 0.05, tolerance: 0.5, drift: 0.12, laborHours: 1.5, calibrationCost: 285, department: "Operations", category: "Pressure", riskLevel: "low" },
  { id: "r002", instrumentId: "PT-101", instrumentTag: "PT-101", instrumentName: "Pressure Transmitter A", location: "Unit 1 - Reactor Feed", manufacturer: "Emerson", model: "3051C", serialNumber: "SN-9021A", calibrationDate: "2024-07-15", nextCalibrationDate: "2025-01-15", technician: "Mike Torres", status: "pass", asFoundError: 0.21, asLeftError: 0.08, tolerance: 0.5, drift: 0.21, laborHours: 1.5, calibrationCost: 285, department: "Operations", category: "Pressure", riskLevel: "low" },
  { id: "r003", instrumentId: "PT-101", instrumentTag: "PT-101", instrumentName: "Pressure Transmitter A", location: "Unit 1 - Reactor Feed", manufacturer: "Emerson", model: "3051C", serialNumber: "SN-9021A", calibrationDate: "2025-01-15", nextCalibrationDate: "2025-07-15", technician: "Sarah Lee", status: "pass", asFoundError: 0.38, asLeftError: 0.10, tolerance: 0.5, drift: 0.38, laborHours: 1.5, calibrationCost: 290, department: "Operations", category: "Pressure", riskLevel: "medium" },
  { id: "r004", instrumentId: "PT-101", instrumentTag: "PT-101", instrumentName: "Pressure Transmitter A", location: "Unit 1 - Reactor Feed", manufacturer: "Emerson", model: "3051C", serialNumber: "SN-9021A", calibrationDate: "2025-07-12", nextCalibrationDate: "2026-01-12", technician: "Sarah Lee", status: "fail", asFoundError: 0.61, asLeftError: 0.12, tolerance: 0.5, drift: 0.61, laborHours: 2.5, calibrationCost: 420, department: "Operations", category: "Pressure", riskLevel: "high" },

  // Flow meter — repeated failures
  { id: "r005", instrumentId: "FT-205", instrumentTag: "FT-205", instrumentName: "Coriolis Flow Meter", location: "Unit 2 - Product Line", manufacturer: "Micro Motion", model: "F200", serialNumber: "SN-7732B", calibrationDate: "2024-02-10", nextCalibrationDate: "2024-08-10", technician: "Dave Kim", status: "fail", asFoundError: 0.72, asLeftError: 0.15, tolerance: 0.5, drift: 0.72, laborHours: 3.0, calibrationCost: 680, department: "Quality", category: "Flow", riskLevel: "high" },
  { id: "r006", instrumentId: "FT-205", instrumentTag: "FT-205", instrumentName: "Coriolis Flow Meter", location: "Unit 2 - Product Line", manufacturer: "Micro Motion", model: "F200", serialNumber: "SN-7732B", calibrationDate: "2024-08-10", nextCalibrationDate: "2025-02-10", technician: "Dave Kim", status: "fail", asFoundError: 0.81, asLeftError: 0.18, tolerance: 0.5, drift: 0.81, laborHours: 3.5, calibrationCost: 720, department: "Quality", category: "Flow", riskLevel: "critical" },
  { id: "r007", instrumentId: "FT-205", instrumentTag: "FT-205", instrumentName: "Coriolis Flow Meter", location: "Unit 2 - Product Line", manufacturer: "Micro Motion", model: "F200", serialNumber: "SN-7732B", calibrationDate: "2025-02-08", nextCalibrationDate: "2025-08-08", technician: "Sarah Lee", status: "fail", asFoundError: 0.95, asLeftError: 0.22, tolerance: 0.5, drift: 0.95, laborHours: 4.0, calibrationCost: 890, department: "Quality", category: "Flow", riskLevel: "critical" },
  { id: "r008", instrumentId: "FT-205", instrumentTag: "FT-205", instrumentName: "Coriolis Flow Meter", location: "Unit 2 - Product Line", manufacturer: "Micro Motion", model: "F200", serialNumber: "SN-7732B", calibrationDate: "2025-08-05", nextCalibrationDate: "2026-02-05", technician: "Mike Torres", status: "fail", asFoundError: 1.12, asLeftError: 0.28, tolerance: 0.5, drift: 1.12, laborHours: 4.5, calibrationCost: 980, department: "Quality", category: "Flow", riskLevel: "critical" },

  // Temperature sensor — very reliable
  { id: "r009", instrumentId: "TT-310", instrumentTag: "TT-310", instrumentName: "RTD Temperature Sensor", location: "Unit 3 - Heat Exchanger", manufacturer: "Yokogawa", model: "YTA510", serialNumber: "SN-4451C", calibrationDate: "2024-03-01", nextCalibrationDate: "2025-03-01", technician: "Anna Patel", status: "pass", asFoundError: 0.05, asLeftError: 0.02, tolerance: 0.5, drift: 0.05, laborHours: 1.0, calibrationCost: 190, department: "Maintenance", category: "Temperature", riskLevel: "low" },
  { id: "r010", instrumentId: "TT-310", instrumentTag: "TT-310", instrumentName: "RTD Temperature Sensor", location: "Unit 3 - Heat Exchanger", manufacturer: "Yokogawa", model: "YTA510", serialNumber: "SN-4451C", calibrationDate: "2025-03-01", nextCalibrationDate: "2026-03-01", technician: "Anna Patel", status: "pass", asFoundError: 0.04, asLeftError: 0.01, tolerance: 0.5, drift: 0.04, laborHours: 1.0, calibrationCost: 190, department: "Maintenance", category: "Temperature", riskLevel: "low" },

  // Level transmitter — overdue
  { id: "r011", instrumentId: "LT-415", instrumentTag: "LT-415", instrumentName: "Radar Level Transmitter", location: "Tank Farm - T4", manufacturer: "VEGA", model: "VEGAPULS 64", serialNumber: "SN-2290D", calibrationDate: "2024-06-01", nextCalibrationDate: "2025-06-01", technician: "James Wu", status: "overdue", asFoundError: 0.42, asLeftError: 0.18, tolerance: 0.5, drift: 0.42, laborHours: 2.0, calibrationCost: 380, department: "Operations", category: "Level", riskLevel: "high" },

  // Analytical instrument — high cost
  { id: "r012", instrumentId: "AT-520", instrumentTag: "AT-520", instrumentName: "Gas Chromatograph", location: "Lab 1 - Analytical", manufacturer: "Agilent", model: "7890B", serialNumber: "SN-8801E", calibrationDate: "2024-01-10", nextCalibrationDate: "2024-07-10", technician: "Dr. Chen", status: "pass", asFoundError: 0.08, asLeftError: 0.03, tolerance: 0.2, drift: 0.08, laborHours: 6.0, calibrationCost: 1850, department: "Quality", category: "Analytical", riskLevel: "low" },
  { id: "r013", instrumentId: "AT-520", instrumentTag: "AT-520", instrumentName: "Gas Chromatograph", location: "Lab 1 - Analytical", manufacturer: "Agilent", model: "7890B", serialNumber: "SN-8801E", calibrationDate: "2024-07-10", nextCalibrationDate: "2025-01-10", technician: "Dr. Chen", status: "pass", asFoundError: 0.09, asLeftError: 0.03, tolerance: 0.2, drift: 0.09, laborHours: 6.0, calibrationCost: 1900, department: "Quality", category: "Analytical", riskLevel: "low" },
  { id: "r014", instrumentId: "AT-520", instrumentTag: "AT-520", instrumentName: "Gas Chromatograph", location: "Lab 1 - Analytical", manufacturer: "Agilent", model: "7890B", serialNumber: "SN-8801E", calibrationDate: "2025-01-10", nextCalibrationDate: "2025-07-10", technician: "Dr. Chen", status: "pass", asFoundError: 0.07, asLeftError: 0.02, tolerance: 0.2, drift: 0.07, laborHours: 6.0, calibrationCost: 1900, department: "Quality", category: "Analytical", riskLevel: "low" },

  // Pressure gauge — medium risk
  { id: "r015", instrumentId: "PG-601", instrumentTag: "PG-601", instrumentName: "Pressure Gauge Utility", location: "Utility Room A", manufacturer: "Ashcroft", model: "T6500", serialNumber: "SN-3312F", calibrationDate: "2024-04-15", nextCalibrationDate: "2025-04-15", technician: "Mike Torres", status: "pass", asFoundError: 0.28, asLeftError: 0.10, tolerance: 1.0, drift: 0.28, laborHours: 0.75, calibrationCost: 145, department: "Maintenance", category: "Pressure", riskLevel: "low" },
  { id: "r016", instrumentId: "PG-601", instrumentTag: "PG-601", instrumentName: "Pressure Gauge Utility", location: "Utility Room A", manufacturer: "Ashcroft", model: "T6500", serialNumber: "SN-3312F", calibrationDate: "2025-04-15", nextCalibrationDate: "2026-04-15", technician: "Mike Torres", status: "pass", asFoundError: 0.35, asLeftError: 0.12, tolerance: 1.0, drift: 0.35, laborHours: 0.75, calibrationCost: 150, department: "Maintenance", category: "Pressure", riskLevel: "low" },

  // Thermocouple — trending failure
  { id: "r017", instrumentId: "TE-702", instrumentTag: "TE-702", instrumentName: "Type K Thermocouple", location: "Furnace Zone 2", manufacturer: "Honeywell", model: "TC-K", serialNumber: "SN-9980G", calibrationDate: "2024-05-20", nextCalibrationDate: "2024-11-20", technician: "Anna Patel", status: "pass", asFoundError: 0.18, asLeftError: 0.06, tolerance: 0.5, drift: 0.18, laborHours: 1.25, calibrationCost: 240, department: "Operations", category: "Temperature", riskLevel: "low" },
  { id: "r018", instrumentId: "TE-702", instrumentTag: "TE-702", instrumentName: "Type K Thermocouple", location: "Furnace Zone 2", manufacturer: "Honeywell", model: "TC-K", serialNumber: "SN-9980G", calibrationDate: "2024-11-20", nextCalibrationDate: "2025-05-20", technician: "Sarah Lee", status: "pass", asFoundError: 0.32, asLeftError: 0.09, tolerance: 0.5, drift: 0.32, laborHours: 1.25, calibrationCost: 245, department: "Operations", category: "Temperature", riskLevel: "medium" },
  { id: "r019", instrumentId: "TE-702", instrumentTag: "TE-702", instrumentName: "Type K Thermocouple", location: "Furnace Zone 2", manufacturer: "Honeywell", model: "TC-K", serialNumber: "SN-9980G", calibrationDate: "2025-05-20", nextCalibrationDate: "2025-11-20", technician: "Sarah Lee", status: "fail", asFoundError: 0.58, asLeftError: 0.14, tolerance: 0.5, drift: 0.58, laborHours: 2.0, calibrationCost: 380, department: "Operations", category: "Temperature", riskLevel: "high" },

  // Vortex flow meter — reliable
  { id: "r020", instrumentId: "FT-830", instrumentTag: "FT-830", instrumentName: "Vortex Flow Meter", location: "Unit 4 - Steam Header", manufacturer: "ABB", model: "FV4000", serialNumber: "SN-6640H", calibrationDate: "2024-09-01", nextCalibrationDate: "2025-09-01", technician: "Dave Kim", status: "pass", asFoundError: 0.11, asLeftError: 0.04, tolerance: 0.5, drift: 0.11, laborHours: 1.75, calibrationCost: 320, department: "Operations", category: "Flow", riskLevel: "low" },
  { id: "r021", instrumentId: "FT-830", instrumentTag: "FT-830", instrumentName: "Vortex Flow Meter", location: "Unit 4 - Steam Header", manufacturer: "ABB", model: "FV4000", serialNumber: "SN-6640H", calibrationDate: "2025-09-01", nextCalibrationDate: "2026-09-01", technician: "Dave Kim", status: "pass", asFoundError: 0.13, asLeftError: 0.05, tolerance: 0.5, drift: 0.13, laborHours: 1.75, calibrationCost: 325, department: "Operations", category: "Flow", riskLevel: "low" },

  // Differential pressure — overdue + high drift
  { id: "r022", instrumentId: "DPT-910", instrumentTag: "DPT-910", instrumentName: "Differential Pressure Xmtr", location: "Filter Station B", manufacturer: "Honeywell", model: "STD800", serialNumber: "SN-1123I", calibrationDate: "2024-08-15", nextCalibrationDate: "2025-02-15", technician: "James Wu", status: "overdue", asFoundError: 0.55, asLeftError: 0.20, tolerance: 0.5, drift: 0.55, laborHours: 1.5, calibrationCost: 280, department: "Maintenance", category: "Pressure", riskLevel: "high" },

  // pH analyzer — analytical, medium risk
  { id: "r023", instrumentId: "AT-1025", instrumentTag: "AT-1025", instrumentName: "pH Analyzer", location: "Effluent Treatment", manufacturer: "Mettler Toledo", model: "M700", serialNumber: "SN-5541J", calibrationDate: "2024-10-01", nextCalibrationDate: "2025-04-01", technician: "Dr. Chen", status: "pass", asFoundError: 0.22, asLeftError: 0.08, tolerance: 0.5, drift: 0.22, laborHours: 2.5, calibrationCost: 520, department: "Quality", category: "Analytical", riskLevel: "medium" },
  { id: "r024", instrumentId: "AT-1025", instrumentTag: "AT-1025", instrumentName: "pH Analyzer", location: "Effluent Treatment", manufacturer: "Mettler Toledo", model: "M700", serialNumber: "SN-5541J", calibrationDate: "2025-04-01", nextCalibrationDate: "2025-10-01", technician: "Dr. Chen", status: "pass", asFoundError: 0.29, asLeftError: 0.10, tolerance: 0.5, drift: 0.29, laborHours: 2.5, calibrationCost: 535, department: "Quality", category: "Analytical", riskLevel: "medium" },

  // Torque wrench — maintenance
  { id: "r025", instrumentId: "TW-1101", instrumentTag: "TW-1101", instrumentName: "Torque Wrench 100Nm", location: "Maintenance Shop", manufacturer: "Snap-on", model: "TECHANGLE", serialNumber: "SN-7730K", calibrationDate: "2025-01-05", nextCalibrationDate: "2026-01-05", technician: "Mike Torres", status: "pass", asFoundError: 0.15, asLeftError: 0.05, tolerance: 2.0, drift: 0.15, laborHours: 0.5, calibrationCost: 95, department: "Maintenance", category: "Mechanical", riskLevel: "low" },

  // Vibration sensor — high risk
  { id: "r026", instrumentId: "VT-1205", instrumentTag: "VT-1205", instrumentName: "Vibration Transmitter", location: "Compressor Train 1", manufacturer: "Bently Nevada", model: "3500/42M", serialNumber: "SN-8821L", calibrationDate: "2024-11-10", nextCalibrationDate: "2025-05-10", technician: "James Wu", status: "fail", asFoundError: 0.68, asLeftError: 0.25, tolerance: 0.5, drift: 0.68, laborHours: 3.5, calibrationCost: 950, department: "Reliability", category: "Vibration", riskLevel: "critical" },
  { id: "r027", instrumentId: "VT-1205", instrumentTag: "VT-1205", instrumentName: "Vibration Transmitter", location: "Compressor Train 1", manufacturer: "Bently Nevada", model: "3500/42M", serialNumber: "SN-8821L", calibrationDate: "2025-05-10", nextCalibrationDate: "2025-11-10", technician: "James Wu", status: "fail", asFoundError: 0.88, asLeftError: 0.30, tolerance: 0.5, drift: 0.88, laborHours: 4.0, calibrationCost: 1100, department: "Reliability", category: "Vibration", riskLevel: "critical" },

  // Multimeter — lab
  { id: "r028", instrumentId: "MM-1302", instrumentTag: "MM-1302", instrumentName: "Digital Multimeter", location: "Electrical Lab", manufacturer: "Fluke", model: "87V", serialNumber: "SN-3310M", calibrationDate: "2025-02-15", nextCalibrationDate: "2026-02-15", technician: "Anna Patel", status: "pass", asFoundError: 0.06, asLeftError: 0.02, tolerance: 0.5, drift: 0.06, laborHours: 0.75, calibrationCost: 140, department: "Maintenance", category: "Electrical", riskLevel: "low" },

  // Conductivity sensor
  { id: "r029", instrumentId: "CT-1401", instrumentTag: "CT-1401", instrumentName: "Conductivity Transmitter", location: "Water Treatment", manufacturer: "Endress+Hauser", model: "CLM223", serialNumber: "SN-4420N", calibrationDate: "2025-03-15", nextCalibrationDate: "2025-09-15", technician: "Dr. Chen", status: "pass", asFoundError: 0.19, asLeftError: 0.07, tolerance: 0.5, drift: 0.19, laborHours: 1.5, calibrationCost: 290, department: "Quality", category: "Analytical", riskLevel: "low" },

  // Pressure switch
  { id: "r030", instrumentId: "PS-1502", instrumentTag: "PS-1502", instrumentName: "Pressure Switch Safety", location: "High Pressure Line C", manufacturer: "Parker", model: "PS-400", serialNumber: "SN-6610O", calibrationDate: "2025-04-10", nextCalibrationDate: "2025-10-10", technician: "Mike Torres", status: "pass", asFoundError: 0.31, asLeftError: 0.12, tolerance: 0.5, drift: 0.31, laborHours: 1.25, calibrationCost: 235, department: "Safety", category: "Pressure", riskLevel: "medium" },

  // More records for richer trend data...
  { id: "r031", instrumentId: "PT-102", instrumentTag: "PT-102", instrumentName: "Pressure Transmitter B", location: "Unit 1 - Reactor Outlet", manufacturer: "Emerson", model: "3051C", serialNumber: "SN-9022A", calibrationDate: "2025-01-20", nextCalibrationDate: "2025-07-20", technician: "Sarah Lee", status: "pass", asFoundError: 0.14, asLeftError: 0.05, tolerance: 0.5, drift: 0.14, laborHours: 1.5, calibrationCost: 285, department: "Operations", category: "Pressure", riskLevel: "low" },
  { id: "r032", instrumentId: "TT-311", instrumentTag: "TT-311", instrumentName: "RTD Temperature Sensor B", location: "Unit 3 - Condenser", manufacturer: "Yokogawa", model: "YTA510", serialNumber: "SN-4452C", calibrationDate: "2025-02-01", nextCalibrationDate: "2026-02-01", technician: "Anna Patel", status: "pass", asFoundError: 0.06, asLeftError: 0.02, tolerance: 0.5, drift: 0.06, laborHours: 1.0, calibrationCost: 190, department: "Maintenance", category: "Temperature", riskLevel: "low" },
  { id: "r033", instrumentId: "FT-831", instrumentTag: "FT-831", instrumentName: "Magnetic Flow Meter", location: "Unit 4 - Cooling Water", manufacturer: "Endress+Hauser", model: "Promag W 800", serialNumber: "SN-6641H", calibrationDate: "2025-03-10", nextCalibrationDate: "2026-03-10", technician: "Dave Kim", status: "pass", asFoundError: 0.09, asLeftError: 0.03, tolerance: 0.5, drift: 0.09, laborHours: 2.0, calibrationCost: 380, department: "Operations", category: "Flow", riskLevel: "low" },
  { id: "r034", instrumentId: "LT-416", instrumentTag: "LT-416", instrumentName: "Ultrasonic Level Sensor", location: "Tank Farm - T5", manufacturer: "VEGA", model: "VEGASON 51", serialNumber: "SN-2291D", calibrationDate: "2024-12-15", nextCalibrationDate: "2025-12-15", technician: "James Wu", status: "pass", asFoundError: 0.25, asLeftError: 0.09, tolerance: 0.5, drift: 0.25, laborHours: 1.75, calibrationCost: 335, department: "Operations", category: "Level", riskLevel: "low" },
  { id: "r035", instrumentId: "AT-1026", instrumentTag: "AT-1026", instrumentName: "O2 Analyzer", location: "Combustion Unit", manufacturer: "Yokogawa", model: "ZR402G", serialNumber: "SN-5542J", calibrationDate: "2025-04-20", nextCalibrationDate: "2025-10-20", technician: "Dr. Chen", status: "pass", asFoundError: 0.17, asLeftError: 0.06, tolerance: 0.5, drift: 0.17, laborHours: 3.0, calibrationCost: 620, department: "Safety", category: "Analytical", riskLevel: "medium" },
];

// ─── Instrument Summaries ────────────────────────────────────────────────────
export const MOCK_INSTRUMENTS: InstrumentSummary[] = [
  {
    instrumentId: "PT-101", instrumentTag: "PT-101", instrumentName: "Pressure Transmitter A",
    location: "Unit 1 - Reactor Feed", manufacturer: "Emerson", model: "3051C",
    category: "Pressure", department: "Operations", riskLevel: "high",
    totalCalibrations: 4, failCount: 1, passRate: 75, avgDrift: 0.33, maxDrift: 0.61,
    lastCalibrationDate: "2025-07-12", nextCalibrationDate: "2026-01-12",
    totalCost: 1280, totalLaborHours: 7, driftTrend: [0.12, 0.21, 0.38, 0.61],
    isOverdue: false, consecutiveFailures: 1, predictedFailureDate: "2026-01-12",
  },
  {
    instrumentId: "FT-205", instrumentTag: "FT-205", instrumentName: "Coriolis Flow Meter",
    location: "Unit 2 - Product Line", manufacturer: "Micro Motion", model: "F200",
    category: "Flow", department: "Quality", riskLevel: "critical",
    totalCalibrations: 4, failCount: 4, passRate: 0, avgDrift: 0.90, maxDrift: 1.12,
    lastCalibrationDate: "2025-08-05", nextCalibrationDate: "2026-02-05",
    totalCost: 3270, totalLaborHours: 15, driftTrend: [0.72, 0.81, 0.95, 1.12],
    isOverdue: false, consecutiveFailures: 4, predictedFailureDate: "2025-11-01",
  },
  {
    instrumentId: "TT-310", instrumentTag: "TT-310", instrumentName: "RTD Temperature Sensor",
    location: "Unit 3 - Heat Exchanger", manufacturer: "Yokogawa", model: "YTA510",
    category: "Temperature", department: "Maintenance", riskLevel: "low",
    totalCalibrations: 2, failCount: 0, passRate: 100, avgDrift: 0.045, maxDrift: 0.05,
    lastCalibrationDate: "2025-03-01", nextCalibrationDate: "2026-03-01",
    totalCost: 380, totalLaborHours: 2, driftTrend: [0.05, 0.04],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "LT-415", instrumentTag: "LT-415", instrumentName: "Radar Level Transmitter",
    location: "Tank Farm - T4", manufacturer: "VEGA", model: "VEGAPULS 64",
    category: "Level", department: "Operations", riskLevel: "high",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.42, maxDrift: 0.42,
    lastCalibrationDate: "2024-06-01", nextCalibrationDate: "2025-06-01",
    totalCost: 380, totalLaborHours: 2, driftTrend: [0.42],
    isOverdue: true, consecutiveFailures: 0,
  },
  {
    instrumentId: "AT-520", instrumentTag: "AT-520", instrumentName: "Gas Chromatograph",
    location: "Lab 1 - Analytical", manufacturer: "Agilent", model: "7890B",
    category: "Analytical", department: "Quality", riskLevel: "low",
    totalCalibrations: 3, failCount: 0, passRate: 100, avgDrift: 0.08, maxDrift: 0.09,
    lastCalibrationDate: "2025-01-10", nextCalibrationDate: "2025-07-10",
    totalCost: 5650, totalLaborHours: 18, driftTrend: [0.08, 0.09, 0.07],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "PG-601", instrumentTag: "PG-601", instrumentName: "Pressure Gauge Utility",
    location: "Utility Room A", manufacturer: "Ashcroft", model: "T6500",
    category: "Pressure", department: "Maintenance", riskLevel: "low",
    totalCalibrations: 2, failCount: 0, passRate: 100, avgDrift: 0.315, maxDrift: 0.35,
    lastCalibrationDate: "2025-04-15", nextCalibrationDate: "2026-04-15",
    totalCost: 295, totalLaborHours: 1.5, driftTrend: [0.28, 0.35],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "TE-702", instrumentTag: "TE-702", instrumentName: "Type K Thermocouple",
    location: "Furnace Zone 2", manufacturer: "Honeywell", model: "TC-K",
    category: "Temperature", department: "Operations", riskLevel: "high",
    totalCalibrations: 3, failCount: 1, passRate: 67, avgDrift: 0.36, maxDrift: 0.58,
    lastCalibrationDate: "2025-05-20", nextCalibrationDate: "2025-11-20",
    totalCost: 865, totalLaborHours: 4.5, driftTrend: [0.18, 0.32, 0.58],
    isOverdue: false, consecutiveFailures: 1, predictedFailureDate: "2026-02-01",
  },
  {
    instrumentId: "FT-830", instrumentTag: "FT-830", instrumentName: "Vortex Flow Meter",
    location: "Unit 4 - Steam Header", manufacturer: "ABB", model: "FV4000",
    category: "Flow", department: "Operations", riskLevel: "low",
    totalCalibrations: 2, failCount: 0, passRate: 100, avgDrift: 0.12, maxDrift: 0.13,
    lastCalibrationDate: "2025-09-01", nextCalibrationDate: "2026-09-01",
    totalCost: 645, totalLaborHours: 3.5, driftTrend: [0.11, 0.13],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "DPT-910", instrumentTag: "DPT-910", instrumentName: "Differential Pressure Xmtr",
    location: "Filter Station B", manufacturer: "Honeywell", model: "STD800",
    category: "Pressure", department: "Maintenance", riskLevel: "high",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.55, maxDrift: 0.55,
    lastCalibrationDate: "2024-08-15", nextCalibrationDate: "2025-02-15",
    totalCost: 280, totalLaborHours: 1.5, driftTrend: [0.55],
    isOverdue: true, consecutiveFailures: 0,
  },
  {
    instrumentId: "AT-1025", instrumentTag: "AT-1025", instrumentName: "pH Analyzer",
    location: "Effluent Treatment", manufacturer: "Mettler Toledo", model: "M700",
    category: "Analytical", department: "Quality", riskLevel: "medium",
    totalCalibrations: 2, failCount: 0, passRate: 100, avgDrift: 0.255, maxDrift: 0.29,
    lastCalibrationDate: "2025-04-01", nextCalibrationDate: "2025-10-01",
    totalCost: 1055, totalLaborHours: 5, driftTrend: [0.22, 0.29],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "TW-1101", instrumentTag: "TW-1101", instrumentName: "Torque Wrench 100Nm",
    location: "Maintenance Shop", manufacturer: "Snap-on", model: "TECHANGLE",
    category: "Mechanical", department: "Maintenance", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.15, maxDrift: 0.15,
    lastCalibrationDate: "2025-01-05", nextCalibrationDate: "2026-01-05",
    totalCost: 95, totalLaborHours: 0.5, driftTrend: [0.15],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "VT-1205", instrumentTag: "VT-1205", instrumentName: "Vibration Transmitter",
    location: "Compressor Train 1", manufacturer: "Bently Nevada", model: "3500/42M",
    category: "Vibration", department: "Reliability", riskLevel: "critical",
    totalCalibrations: 2, failCount: 2, passRate: 0, avgDrift: 0.78, maxDrift: 0.88,
    lastCalibrationDate: "2025-05-10", nextCalibrationDate: "2025-11-10",
    totalCost: 2050, totalLaborHours: 7.5, driftTrend: [0.68, 0.88],
    isOverdue: false, consecutiveFailures: 2, predictedFailureDate: "2025-11-10",
  },
  {
    instrumentId: "MM-1302", instrumentTag: "MM-1302", instrumentName: "Digital Multimeter",
    location: "Electrical Lab", manufacturer: "Fluke", model: "87V",
    category: "Electrical", department: "Maintenance", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.06, maxDrift: 0.06,
    lastCalibrationDate: "2025-02-15", nextCalibrationDate: "2026-02-15",
    totalCost: 140, totalLaborHours: 0.75, driftTrend: [0.06],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "CT-1401", instrumentTag: "CT-1401", instrumentName: "Conductivity Transmitter",
    location: "Water Treatment", manufacturer: "Endress+Hauser", model: "CLM223",
    category: "Analytical", department: "Quality", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.19, maxDrift: 0.19,
    lastCalibrationDate: "2025-03-15", nextCalibrationDate: "2025-09-15",
    totalCost: 290, totalLaborHours: 1.5, driftTrend: [0.19],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "PS-1502", instrumentTag: "PS-1502", instrumentName: "Pressure Switch Safety",
    location: "High Pressure Line C", manufacturer: "Parker", model: "PS-400",
    category: "Pressure", department: "Safety", riskLevel: "medium",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.31, maxDrift: 0.31,
    lastCalibrationDate: "2025-04-10", nextCalibrationDate: "2025-10-10",
    totalCost: 235, totalLaborHours: 1.25, driftTrend: [0.31],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "PT-102", instrumentTag: "PT-102", instrumentName: "Pressure Transmitter B",
    location: "Unit 1 - Reactor Outlet", manufacturer: "Emerson", model: "3051C",
    category: "Pressure", department: "Operations", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.14, maxDrift: 0.14,
    lastCalibrationDate: "2025-01-20", nextCalibrationDate: "2025-07-20",
    totalCost: 285, totalLaborHours: 1.5, driftTrend: [0.14],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "TT-311", instrumentTag: "TT-311", instrumentName: "RTD Temperature Sensor B",
    location: "Unit 3 - Condenser", manufacturer: "Yokogawa", model: "YTA510",
    category: "Temperature", department: "Maintenance", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.06, maxDrift: 0.06,
    lastCalibrationDate: "2025-02-01", nextCalibrationDate: "2026-02-01",
    totalCost: 190, totalLaborHours: 1, driftTrend: [0.06],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "FT-831", instrumentTag: "FT-831", instrumentName: "Magnetic Flow Meter",
    location: "Unit 4 - Cooling Water", manufacturer: "Endress+Hauser", model: "Promag W 800",
    category: "Flow", department: "Operations", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.09, maxDrift: 0.09,
    lastCalibrationDate: "2025-03-10", nextCalibrationDate: "2026-03-10",
    totalCost: 380, totalLaborHours: 2, driftTrend: [0.09],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "LT-416", instrumentTag: "LT-416", instrumentName: "Ultrasonic Level Sensor",
    location: "Tank Farm - T5", manufacturer: "VEGA", model: "VEGASON 51",
    category: "Level", department: "Operations", riskLevel: "low",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.25, maxDrift: 0.25,
    lastCalibrationDate: "2024-12-15", nextCalibrationDate: "2025-12-15",
    totalCost: 335, totalLaborHours: 1.75, driftTrend: [0.25],
    isOverdue: false, consecutiveFailures: 0,
  },
  {
    instrumentId: "AT-1026", instrumentTag: "AT-1026", instrumentName: "O2 Analyzer",
    location: "Combustion Unit", manufacturer: "Yokogawa", model: "ZR402G",
    category: "Analytical", department: "Safety", riskLevel: "medium",
    totalCalibrations: 1, failCount: 0, passRate: 100, avgDrift: 0.17, maxDrift: 0.17,
    lastCalibrationDate: "2025-04-20", nextCalibrationDate: "2025-10-20",
    totalCost: 620, totalLaborHours: 3, driftTrend: [0.17],
    isOverdue: false, consecutiveFailures: 0,
  },
];

// ─── KPIs ────────────────────────────────────────────────────────────────────
export const MOCK_KPIS: DashboardKPIs = {
  totalInstruments: 20,
  passRate: 71.4,
  failRate: 20.0,
  overdueRate: 8.6,
  avgDrift: 0.31,
  totalLaborHours: 82,
  estimatedAnnualCost: 187400,
  calibrationsThisMonth: 6,
  calibrationsThisQuarter: 18,
  criticalInstruments: 2,
};

// ─── Monthly trend data ───────────────────────────────────────────────────────
export const MOCK_TREND_DATA: TrendDataPoint[] = [
  { month: "Jan 2024", pass: 8, fail: 1, total: 9, avgDrift: 0.14, cost: 2590 },
  { month: "Feb 2024", pass: 6, fail: 2, total: 8, avgDrift: 0.22, cost: 2810 },
  { month: "Mar 2024", pass: 9, fail: 1, total: 10, avgDrift: 0.16, cost: 2350 },
  { month: "Apr 2024", pass: 8, fail: 1, total: 9, avgDrift: 0.19, cost: 2180 },
  { month: "May 2024", pass: 10, fail: 1, total: 11, avgDrift: 0.20, cost: 2760 },
  { month: "Jun 2024", pass: 7, fail: 2, total: 9, avgDrift: 0.28, cost: 2940 },
  { month: "Jul 2024", pass: 9, fail: 2, total: 11, avgDrift: 0.30, cost: 3120 },
  { month: "Aug 2024", pass: 6, fail: 3, total: 9, avgDrift: 0.35, cost: 3480 },
  { month: "Sep 2024", pass: 8, fail: 2, total: 10, avgDrift: 0.29, cost: 2890 },
  { month: "Oct 2024", pass: 9, fail: 1, total: 10, avgDrift: 0.24, cost: 2640 },
  { month: "Nov 2024", pass: 7, fail: 3, total: 10, avgDrift: 0.38, cost: 3750 },
  { month: "Dec 2024", pass: 8, fail: 2, total: 10, avgDrift: 0.32, cost: 3210 },
  { month: "Jan 2025", pass: 7, fail: 3, total: 10, avgDrift: 0.40, cost: 3820 },
  { month: "Feb 2025", pass: 6, fail: 4, total: 10, avgDrift: 0.45, cost: 4150 },
  { month: "Mar 2025", pass: 8, fail: 2, total: 10, avgDrift: 0.36, cost: 3310 },
  { month: "Apr 2025", pass: 7, fail: 3, total: 10, avgDrift: 0.41, cost: 3680 },
  { month: "May 2025", pass: 6, fail: 4, total: 10, avgDrift: 0.47, cost: 4290 },
  { month: "Jun 2025", pass: 5, fail: 4, total: 9, avgDrift: 0.52, cost: 4580 },
];

// ─── Heatmap ─────────────────────────────────────────────────────────────────
export const MOCK_HEATMAP: HeatmapCell[] = [
  { department: "Operations", category: "Pressure", riskScore: 7.2, instrumentCount: 4 },
  { department: "Operations", category: "Flow", riskScore: 4.1, instrumentCount: 3 },
  { department: "Operations", category: "Level", riskScore: 6.8, instrumentCount: 2 },
  { department: "Operations", category: "Temperature", riskScore: 5.5, instrumentCount: 2 },
  { department: "Quality", category: "Flow", riskScore: 9.5, instrumentCount: 1 },
  { department: "Quality", category: "Analytical", riskScore: 3.2, instrumentCount: 4 },
  { department: "Quality", category: "Pressure", riskScore: 2.8, instrumentCount: 1 },
  { department: "Maintenance", category: "Pressure", riskScore: 6.4, instrumentCount: 2 },
  { department: "Maintenance", category: "Temperature", riskScore: 1.5, instrumentCount: 2 },
  { department: "Maintenance", category: "Electrical", riskScore: 1.2, instrumentCount: 1 },
  { department: "Maintenance", category: "Mechanical", riskScore: 1.8, instrumentCount: 1 },
  { department: "Reliability", category: "Vibration", riskScore: 9.8, instrumentCount: 1 },
  { department: "Safety", category: "Pressure", riskScore: 4.5, instrumentCount: 1 },
  { department: "Safety", category: "Analytical", riskScore: 3.8, instrumentCount: 1 },
];

// ─── Pareto chart ─────────────────────────────────────────────────────────────
export const MOCK_PARETO: ParetoEntry[] = [
  { tag: "FT-205", name: "Coriolis Flow Meter", failCount: 4, cost: 3270, cumulative: 28.5 },
  { tag: "VT-1205", name: "Vibration Transmitter", failCount: 2, cost: 2050, cumulative: 46.4 },
  { tag: "AT-520", name: "Gas Chromatograph", failCount: 0, cost: 5650, cumulative: 61.2 },
  { tag: "PT-101", name: "Pressure Transmitter A", failCount: 1, cost: 1280, cumulative: 71.4 },
  { tag: "AT-1025", name: "pH Analyzer", failCount: 0, cost: 1055, cumulative: 80.6 },
  { tag: "VT-1205", name: "Vibration Transmitter", failCount: 2, cost: 980, cumulative: 89.1 },
  { tag: "TE-702", name: "Type K Thermocouple", failCount: 1, cost: 865, cumulative: 94.6 },
  { tag: "FT-830", name: "Vortex Flow Meter", failCount: 0, cost: 645, cumulative: 100 },
];

// ─── AI Recommendations ───────────────────────────────────────────────────────
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec001",
    instrumentId: "FT-205",
    instrumentTag: "FT-205",
    category: "replacement",
    title: "Replace Coriolis Flow Meter FT-205",
    problem: "FT-205 has failed 4 consecutive calibrations with drift accelerating from 0.72% to 1.12% — well above the 0.5% tolerance.",
    evidence: "4/4 calibration failures (2024–2025). Drift trend: +0.13% per 6-month interval. As-found error now 224% of tolerance.",
    businessImpact: "Flow measurement errors in the product line create quality risks, potential regulatory violations, and product rework costs estimated at $28,000/year.",
    estimatedSavings: 34000,
    recommendedAction: "Immediately replace FT-205 with new Micro Motion F200 or equivalent. Conduct root-cause analysis to determine if process conditions caused premature failure.",
    confidenceScore: 96,
    priority: "critical",
    affectedInstruments: ["FT-205"],
  },
  {
    id: "rec002",
    instrumentId: "VT-1205",
    instrumentTag: "VT-1205",
    category: "replacement",
    title: "Replace Vibration Transmitter VT-1205 on Compressor Train 1",
    problem: "VT-1205 has failed both calibrations on record with drift reaching 0.88%. Vibration monitoring on the compressor is unreliable.",
    evidence: "2/2 calibration failures. Drift: 0.68% → 0.88% (30% increase). Compressor Train 1 is a critical rotating asset.",
    businessImpact: "Loss of vibration monitoring on Compressor Train 1 creates unplanned shutdown risk. A single compressor failure event costs an estimated $180,000 in downtime and repair.",
    estimatedSavings: 85000,
    recommendedAction: "Replace VT-1205 immediately. Increase vibration monitoring frequency on Compressor Train 1 until replacement is complete. Review compressor health data.",
    confidenceScore: 91,
    priority: "critical",
    affectedInstruments: ["VT-1205"],
  },
  {
    id: "rec003",
    instrumentId: "PT-101",
    instrumentTag: "PT-101",
    category: "investigation",
    title: "Investigate Accelerating Drift in PT-101",
    problem: "PT-101 drift has increased steadily over 4 calibrations: 0.12% → 0.21% → 0.38% → 0.61%. The most recent calibration resulted in a fail.",
    evidence: "Linear drift increase: +0.16% per interval. Predicted drift at next calibration: ~0.77%. Process conditions in Unit 1 Reactor Feed should be reviewed.",
    businessImpact: "Reactor feed pressure measurement accuracy affects product yield and safety interlock reliability. Continued drift could trigger spurious shutdowns.",
    estimatedSavings: 12000,
    recommendedAction: "Inspect PT-101 for process contamination, impulse line blockages, or mechanical damage. Consider reducing calibration interval to 3 months until root cause is identified.",
    confidenceScore: 88,
    priority: "high",
    affectedInstruments: ["PT-101"],
  },
  {
    id: "rec004",
    instrumentId: "LT-415",
    instrumentTag: "LT-415",
    category: "maintenance",
    title: "Overdue Calibration: LT-415 Radar Level Transmitter",
    problem: "LT-415 is 1+ year overdue for calibration. Last calibrated June 2024, due June 2025. Tank Farm T4 level measurement may be unreliable.",
    evidence: "Calibration overdue by 12+ months. Pre-overdue drift was 0.42% — near the 0.5% tolerance limit.",
    businessImpact: "Inaccurate tank level measurement in Tank Farm T4 risks overfill, product loss, and environmental compliance issues.",
    estimatedSavings: 8500,
    recommendedAction: "Schedule LT-415 calibration immediately. Perform visual inspection of radar antenna for scaling or damage before calibration.",
    confidenceScore: 99,
    priority: "high",
    affectedInstruments: ["LT-415"],
  },
  {
    id: "rec005",
    instrumentId: "DPT-910",
    instrumentTag: "DPT-910",
    category: "maintenance",
    title: "Overdue Calibration: DPT-910 Differential Pressure Transmitter",
    problem: "DPT-910 is overdue since February 2025. Last calibration showed drift of 0.55% — already exceeding the 0.5% tolerance.",
    evidence: "Calibration overdue by 4+ months. Single calibration on record showed a fail-level drift. Filter Station B differential pressure indication is suspect.",
    businessImpact: "DPT-910 measures filter differential pressure. Inaccurate readings may lead to missed filter changeouts, reduced throughput, and potential equipment damage.",
    estimatedSavings: 6200,
    recommendedAction: "Prioritize DPT-910 calibration this week. Inspect filter condition and consider installing a redundant measurement point.",
    confidenceScore: 97,
    priority: "high",
    affectedInstruments: ["DPT-910"],
  },
  {
    id: "rec006",
    instrumentId: "AT-520",
    instrumentTag: "AT-520",
    category: "interval",
    title: "Extend GC AT-520 Calibration Interval to Annual",
    problem: "Gas Chromatograph AT-520 has demonstrated excellent stability across 3 semi-annual calibrations with average drift of 0.08% (tolerance: 0.2%).",
    evidence: "3/3 passes. Drift range: 0.07–0.09%. Drift uses only 40% of tolerance. No negative drift trend. Manufacturer data supports annual intervals for this model.",
    businessImpact: "Extending from 6-month to annual intervals would save approximately 3 labor days and $1,900 per year in direct calibration costs.",
    estimatedSavings: 1900,
    recommendedAction: "Extend AT-520 calibration interval to 12 months. Document interval change in calibration management system with drift history justification for audit trail.",
    confidenceScore: 82,
    priority: "medium",
    affectedInstruments: ["AT-520"],
  },
  {
    id: "rec007",
    instrumentId: "TE-702",
    instrumentTag: "TE-702",
    category: "investigation",
    title: "Investigate Drift Acceleration in Furnace Thermocouple TE-702",
    problem: "TE-702 drift has tripled in 18 months: 0.18% → 0.32% → 0.58%. The most recent calibration resulted in a failure.",
    evidence: "Drift growth: 78% → 81% increase per interval. Located in Furnace Zone 2 — high-temperature environment may be causing thermocouple wire degradation.",
    businessImpact: "Inaccurate furnace temperature measurement impacts product quality, energy efficiency, and combustion safety. Estimated quality cost risk: $9,000/year.",
    estimatedSavings: 9000,
    recommendedAction: "Inspect TE-702 for sheath damage, wire degradation, and junction integrity. Replace thermocouple if visual inspection reveals degradation. Consider upgrading to a more robust thermocouple type for this application.",
    confidenceScore: 85,
    priority: "high",
    affectedInstruments: ["TE-702"],
  },
  {
    id: "rec008",
    category: "cost",
    title: "Reduce Annual Calibration Cost Through Interval Optimization",
    problem: "Analysis indicates 7 instruments currently operating at tighter intervals than their performance history requires, resulting in excess calibration expenditure.",
    evidence: "Instruments TT-310, TT-311, FT-830, MM-1302 show <20% tolerance utilization over 12+ months. Combined they account for $1,225 in semi-annual calibration costs.",
    businessImpact: "Extending intervals for stable, low-drift instruments to annual calibrations would reduce total program cost by an estimated 8–12% without increasing risk.",
    estimatedSavings: 14800,
    recommendedAction: "Implement risk-based calibration interval review for all instruments with >3 calibration records and <40% tolerance utilization. Present findings to QA Manager for approval before adjustments.",
    confidenceScore: 79,
    priority: "medium",
    affectedInstruments: ["TT-310", "TT-311", "FT-830", "MM-1302"],
  },
];
