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
    The response is formatted as an HTML fragment.
    """

    system_prompt = """
    [PERSONA]
    You are an expert AI assistant named 'Sahayogi', designed to help Nepali migrant workers. Your purpose is to provide safe, accurate, and helpful information based ONLY on the verified documents provided to you. You are supportive, clear, and professional. Your primary goal is to empower users with reliable information.
    
    # --- NEW SECTION START ---
    
    [OUTPUT FORMATTING]
    - **Format:** Respond in plain string format without any markdown or code blocks. DO NOT include any markdown or html tags!
    - **Example response:** This is the sample response. loream ipsum dolor sit amet. loream ipsum dolor sit amet. DO NOT have any context around responding in your response.
    
    # --- NEW SECTION END ---
    
    [CORE RULES]
    1.  **Strictly Grounded:** You MUST base your entire answer on the information found within the `<CONTEXT>` section.
    2.  **No Hallucinations:** If the answer is not in the `<CONTEXT>`, you MUST state that you cannot find the information in the provided documents, wrapped in `<p>` tags (e.g., `<p>I'm sorry, I could not find information about that.</p>`).
    3.  **Language Adherence:** You MUST respond in the language specified in the `<LANGUAGE>` filter.
    
    [INSTRUCTION LOGIC FLOW]
    (The rest of the prompt remains the same...)
    """
    # The rest of the function logic is identical to the previous version
    if filters is None:
        filters = {}
    filter_string = "\n".join([f"{key.replace('_', ' ').title()}: {value}" for key, value in filters.items()])
    if not filter_string:
        filter_string = "None"

    user_message = f"""
    Here is the information for the user's request. Please follow all rules in your system prompt, especially the HTML formatting rules.
    
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
        return response.json()["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"An API error occurred: {e}")
        return "<p>Sorry, I am having trouble connecting to the service.</p>"

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
            "model": "gemma3",  
            "prompt": prompt,
            "stream": True
        }
    )
    response.raise_for_status()
    return response.json()["response"]


def get_starter_questions(status: str, country: str, state: str, language: str = "English"):
    """
    Generates the top 5 most frequently asked questions from a knowledge base,
    respecting filters and language, and returns them as a JSON list.
    """

    context = ask_question(f"Give me top five questions for a user with {status} status living in country: {country} and state: {state}")
    system_prompt = """
    [PERSONA]
    Your purpose is to generate top 5 relavent question for the user based on their profile. The user profile includes their current visa status , country and state of residence. Try do be diverse with the questions you generate.
    

    [CORE RULES]
    1.  **Strictly Grounded:** You MUST base your entire answer on the information found within the <CONTEXT>.
    2.  **User Information:** You MUST use the user information provided <STATUS>, <COUNTRY>, <STATE> and <LANGUAGE> tags to generate the questions.
    3.  **Maximum character limit:** Each question should be concise and to the point NOT exceeding 70 characters.
    4.  **Format:** Each question should be separated by a pipe (|) character. Do not number the questions or use bullet points.

    [OUTPUT FORMATTING]
    Just output the questions, DO NOT add context when responding. Each question should be separated by a pipe (|) character. Do not include question number or new line characters. Each question should be concise and to the point NOT exceeding 70 characters.

    [EXAMPLE RESPONSE]
    What is an F1 visa?|How to apply for a Green Card?|What are the requirements for asylum?|How to renew a work permit?|What are the steps to citizenship?

    """

    user_message = f"""
    Here is the information for the user's request. Please follow all rules in your system prompt, especially the HTML formatting rules.
    
    <CONTEXT>
    {context}
    </CONTEXT>

    <STATUS>
    {status}
    </STATUS>

    <COUNTRY>
    {country}
    </COUNTRY>

    <STATE>
    {state}
    </STATE>

    <LANGUAGE>
    {language}
    </LANGUAGE>
    """

    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "gemma3",
                "stream": False,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            }
        )
        response.raise_for_status()
        print(response.json()["message"]["content"])  # Debugging line
        return response.json()["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"An API error occurred: {e}")
        return "<p>Sorry, I am having trouble connecting to the service.</p>"


# 5. CLI
if __name__ == "__main__":
    question = input("\n Enter your question: ")
    context = ask_question(question)
    print("\n Generating answer...\n")
    answer = generate_answer(context, question)

    print("\n Answer:\n")
    print(answer)
