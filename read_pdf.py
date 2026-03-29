import fitz  # PyMuPDF
import sys
import glob

def extract_pdf(filepath, out_file):
    out_file.write(f"================================ {filepath} ================================\n")
    try:
        doc = fitz.open(filepath)
        for page in doc:
            out_file.write(page.get_text())
            out_file.write("\n")
    except Exception as e:
        out_file.write(f"Error reading {filepath}: {e}\n")

if __name__ == "__main__":
    with open("pdf_extracted.txt", "w", encoding="utf-8") as f:
        for p in ["PRD.pdf", "DESIGN.pdf", "TECHSTACK.pdf"]:
            extract_pdf(p, f)
