from chromadb import PersistentClient
from chromadb.config import Settings
from pathlib import Path
import requests
import os
os.environ["CHROMA_TELEMETRY_DISABLED"] = "1"


# 1. Setup ChromaDB client
base_path = Path(__file__).resolve().parent.parent
persist_path = base_path / ".chromadb"

chroma_client = PersistentClient(
    path=str(persist_path),
    settings=Settings(anonymized_telemetry=False)
)

collection = chroma_client.get_collection(name="immigration_docs")

# 2. Ollama Embedding Function 
def ollama_embed(text):
    if isinstance(text, str):
        text = [text]  

    response = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "nomic-embed-text",
            "input": text
        }
    )
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(" HTTP Error:", e)
        print(" Response JSON:", response.json())
        raise

    print(" Ollama Response JSON:", response.json())  

    return response.json()["embeddings"][0]

# 3. Ask question and retrieve top chunks
def ask_question(question, n_results=5):
    embedding = ollama_embed(question)
    if isinstance(embedding[0], list):
        embedding = embedding[0]

    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results
    )

    documents = results['documents'][0]
    sources = results['metadatas'][0]

    context_text = "\n".join([f"[{i+1}] From {sources[i]['source']}:\n{doc}" for i, doc in enumerate(documents)])
    print("\n🔎 Top Matching Chunks:\n")
    print(context_text)

    return "\n".join(documents)  # This is used to have LLM answers instead of source paragraphs



# 4. Use Ollama LLM to generate answer
def generate_answer(context, question):
    prompt = f"""You are an immigration assistant for Nepali immigrants in the US. Use the context below to answer the question clearly and precisely.

### CONTEXT:
{context}

### QUESTION:
{question}

### ANSWER:"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",  
            "prompt": prompt,
            "stream": False
        }
    )
    response.raise_for_status()
    return response.json()["response"]

# 5. CLI
if __name__ == "__main__":
    question = input("\n Enter your question: ")
    context = ask_question(question)
    print("\n Generating answer...\n")
    answer = generate_answer(context, question)

    print("\n Answer:\n")
    print(answer)
