from pathlib import Path
import fitz  # PyMuPDF
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from chromadb import PersistentClient  
from langdetect import detect
import uuid
import re
import requests
import subprocess
import json
import os
os.environ["CHROMA_TELEMETRY_DISABLED"] = "1"


# 1. Clean text helper
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
    return text.strip()

# 2. Embedding Function class for Ollama
class OllamaEmbeddingFunction:
    def __init__(self, model="nomic-embed-text"):
        self.model = model
        self.url = "http://localhost:11434/api/embed"

    def __call__(self, input: list[str]) -> list[list[float]]:
        embeddings = []
        for text in input:
            response = requests.post(
                self.url,
                json={"model": self.model, "input": text}
            )
            response.raise_for_status()
            data = response.json()
            embeddings.append(data["embeddings"])
        return embeddings
    

# 3. Setup Persistent ChromaDB client
base_path = Path(__file__).resolve().parent.parent
persist_path = base_path / ".chromadb"

chroma_client = PersistentClient(
    path=str(persist_path),
    settings=Settings(anonymized_telemetry=False)
)

# 4. Create or load collection
embedding_function = OllamaEmbeddingFunction()

collection = chroma_client.get_or_create_collection(
    name="immigration_docs",
    embedding_function=embedding_function
)

# 5. Utility Functions
def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    return "\n".join([p.get_text() for p in doc])

def split_chunks(text, size=500):
    words = text.split()
    return [" ".join(words[i:i + size]) for i in range(0, len(words), size)]

def detect_lang(text):
    try:
        return detect(text)
    except:
        return "unknown"

def guess_topic_from_path(pdf_path):
    folder = pdf_path.parent.name.lower()
    fname = pdf_path.name.lower()

    if "bank" in folder or "account" in fname:
        return "banking"
    if "housing" in folder or "rent" in fname or "apartment" in fname:
        return "housing"
    if "immigration" in folder or "visa" in fname or "opt" in fname or "f1" in fname:
        return "immigration"
    if "tax" in folder or "irs" in fname or "social secur" in fname:
        return "taxation"
    if "driver" in folder or "driving" in folder or "dmv" in fname:
        return "driving"
    if "health" in folder or "medical" in fname or "insurance" in fname:
        return "health"
    if "faq" in folder or "frequently" in fname or "guide" in fname:
        return "faq"
    if "nepali" in folder or "consulate" in fname or "camp" in fname:
        return "nepali_info"
    if "student" in fname or "university" in fname:
        return "student_life"
    if "asylum" in fname:
        return "asylum"
    if "green card" in fname:
        return "green_card"
    return "general"

# 6. Process PDF and add to collection
def process_pdf(pdf_path):
    raw = extract_text(pdf_path)
    print(f" Processing: {pdf_path.name}")
    print(f" Characters: {len(raw)}")

    cleaned = clean_text(raw)
    chunks = split_chunks(cleaned)
    topic = guess_topic_from_path(pdf_path)

    embeddings = embedding_function(chunks)

    for i, chunk in enumerate(chunks):
        collection.add(
            documents=[chunk],
            embeddings=[embeddings[i][0]],
            metadatas=[{
                "source": pdf_path.name,
                "language": detect_lang(chunk),
                "topic": topic
            }],
            ids=[str(uuid.uuid4())]
        )

    print(f" Ingested {pdf_path.name}")
    print(f" Chunked into {len(chunks)} parts\n")

# 7. Run on all PDFs
pdf_dir = base_path / "data" / "PDFs"
pdf_files = list(pdf_dir.glob("**/*.pdf"))

if not pdf_files:
    print("No PDFs found! Please check the PDF folder path.")
else:
    for file in pdf_files:
        process_pdf(file)

print("Ingestion complete.")
