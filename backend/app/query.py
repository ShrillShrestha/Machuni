
from chromadb.utils import embedding_functions
from chromadb.config import Settings
import chromadb
from pathlib import Path

# 1. Setup Chroma client (persistent)
base_path = Path(__file__).resolve().parent.parent
persist_path = base_path / ".chromadb"

chroma_client = chromadb.PersistentClient(
    path=str(persist_path),
    settings=Settings(anonymized_telemetry=False)
)

# 2. Load same embedding model used during ingest
sentence_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# 3. Load existing collection
collection = chroma_client.get_or_create_collection(
    name="immigration_docs",
    embedding_function=sentence_ef
)

# 4. Function to perform query
def query_immigration_docs(question: str, top_k: int = 5):
    results = collection.query(
        query_texts=[question],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    print(f"\n Top {top_k} results for your query: '{question}'\n")
    for i, (doc, meta) in enumerate(zip(documents, metadatas), start=1):
        print(f"{i}. Source: {meta['source']} |  Topic: {meta['topic']}")
        print(f" Snippet: {doc[:250]}...\n")

# 5. Main
if __name__ == "__main__":
    while True:
        q = input("Ask a question (or type 'exit'): ")
        if q.lower() in {"exit", "quit"}:
            break
        query_immigration_docs(q)
