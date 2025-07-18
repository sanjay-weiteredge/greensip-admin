// API utility for barcode endpoints

const API_BASE = "/api/barcodes";

export async function getAllBarcodes() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch barcodes");
  return res.json();
}

export async function generateBarcodes({ count, batchId, type }) {
  const res = await fetch(API_BASE + "/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, batchId, type }),
  });
  if (!res.ok) throw new Error("Failed to generate barcodes");
  return res.json();
} 