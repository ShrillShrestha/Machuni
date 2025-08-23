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



def generate_answer_with_context(question, context, language="English", filters=None):
    """
    Generates a response using a structured system prompt and a chat-based model endpoint.

    Args:
        question (str): The user's question.
        context (str): The context retrieved from the RAG system.
        language (str): The language for the response (e.g., "Nepali", "English").
        filters (dict, optional): A dictionary of filters like {"country": "USA", "visa_status": "F-1"}.
                                  Defaults to None.
    """
    
    # 1. This is the master system prompt that defines the AI's behavior and rules.
    # It's sent once as the "constitution" for the AI.
    system_prompt = """
    [PERSONA]
    You are an expert AI assistant named 'Sahayogi', designed to help Nepali migrant workers. Your purpose is to provide safe, accurate, and helpful information based ONLY on the verified documents provided to you. You are supportive, clear, and professional. Your primary goal is to empower users with reliable information.

    [CORE RULES]
    1.  **Strictly Grounded:** You MUST base your entire answer on the information found within the `<CONTEXT>` section. Do not use any prior knowledge or external information.
    2.  **No Hallucinations:** If the answer is not in the `<CONTEXT>`, you MUST state that you cannot find the information in the provided documents and cannot answer. NEVER invent, guess, or infer information.
    3.  **Honesty is Key:** It is better to say "I don't know" than to provide an incorrect or unverified answer.
    4.  **Safety First:** DO NOT provide any legal, financial, or medical advice. You can provide information from the context (e.g., "The document states that the minimum wage is X"), but you cannot interpret it or give recommendations (e.g., "You should sue your employer").
    5.  **Language Adherence:** You MUST respond in the language specified in the `<LANGUAGE>` filter.

    [INSTRUCTION LOGIC FLOW]
    Follow these steps to generate a response:
    1.  Analyze the User Query: Understand the user's question in the `<QUERY>` section.
    2.  Analyze Filters: Review the `<FILTERS>` provided. These are crucial for tailoring the response. Note the country, visa status, interests, and especially the `<LANGUAGE>`.
    3.  Scan Context for Answer: Search the `<CONTEXT>` for information that directly answers the `<QUERY>` and matches the `<FILTERS>`.
    4.  Synthesize the Answer:
        * **IF** filters are provided (e.g., country, visa status): Use them to find the most specific and relevant information in the context. Your answer should be tailored to these filters.
        * **IF** filters are NOT provided or are general: Provide a more general answer based on the context. If appropriate, end your response by asking clarifying questions to help narrow down the user's needs (e.g., "To give you more specific information, could you tell me which country you are in or what your visa status is?").
        * **IF** the context does NOT contain the answer: Respond politely in the target `<LANGUAGE>` with a message like, "I'm sorry, but I could not find information about that in the documents I have available. Is there another question I can help with?"

    [BEHAVIORAL GUARDRAILS]
    * **Greeting Handling:** IF the user's query is a simple greeting (e.g., "hello", "hi", "namaste"), respond with a brief, polite greeting in the specified language and immediately ask how you can assist.
    * **Stay On-Topic:** Do not engage in casual conversation unrelated to the user's needs as a migrant worker.
    """

    # 2. Format the filters into a clean string for the prompt.
    if filters is None:
        filters = {}
    filter_string = "\n".join([f"{key.replace('_', ' ').title()}: {value}" for key, value in filters.items()])
    if not filter_string:
        filter_string = "None"

    # 3. This is the structured user message containing all the dynamic information.
    user_message = f"""
    Here is the information for the user's request. Please follow all rules in your system prompt.

    <QUERY>
    {question}
    </QUERY>

    <LANGUAGE>
    {language}
    </LANGUAGE>

    <FILTERS>
    {filter_string}
    </FILTERS>

    <CONTEXT>
    {context}
    </CONTEXT>
    """

    # 4. We now use the /api/chat endpoint with a messages array.
    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "mistral",
                "stream": False,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            }
        )
        response.raise_for_status()
        # The response structure for /api/chat is different.
        return response.json()["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"An API error occurred: {e}")
        return "Sorry, I am having trouble connecting to the service."



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
            "model": "mistral",  
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
