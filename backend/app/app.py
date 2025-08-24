from flask import Flask, request, jsonify
from flask_cors import CORS

from backend.app.ingest import process_uploaded_pdfs
from custom_type import *
import json
from request_parser import parse_request
from query import ask_question, generate_answer, generate_answer_with_context, get_starter_questions
import re

app = Flask(__name__)
app.config['WTF_CSRF_ENABLED'] = False
CORS(app)
MAX_FILES = 3  # Updated to 3 files
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    """Checks if the file's extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
@app.route('/chat', methods=['POST'])
@parse_request(ChatRequest)
def chat(data: ChatRequest):
    question = data.question
    uploaded_files = request.files.getlist('files')
    # --- Validate File Count ---
    if len(uploaded_files) > MAX_FILES:
        return jsonify({"error": f"You can upload a maximum of {MAX_FILES} files."}), 400

    # --- Process and Validate Files ---
    file_contents = []
    for file in uploaded_files:
        if file and file.filename:
            # Check if the file is a PDF
            if not allowed_file(file.filename):
                return jsonify({"error": f"Invalid file type: '{file.filename}'. Only PDF files are allowed."}), 400

            file_contents.append(file.read())

    try:
        process_uploaded_pdfs(file_contents)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    context = ask_question(question)
    answer = generate_answer_with_context(question, context, data.language_preferance, {"status": data.status, "interests": data.interests, "country": data.country, "state": data.state})
    chat_response = ChatResponse(answer)
    return chat_response.to_dict()

@app.route('/queries', methods=['POST'])
@parse_request(PersonalizedQueryRequest)
def queries(data: PersonalizedQueryRequest):
    queries = get_starter_questions(data.status, data.country, data.state, data.language_preferance)
    json_list = re.split(r'\||\n', queries)
    return PersonalizedQueryResponse(json_list).to_dict()

@app.route('/recommendations', methods=['POST'])
@parse_request(RecommendationRequest)
def recommendations(data: RecommendationRequest):
    print("Received data:", data)
    with open('../data/events.json', 'r') as file:
        events_data = json.load(file)
        events = []
        for event in events_data:
            location = Location(
                venue_name=event['location']['venue_name'],
                address=event['location']['address'],
                city=event['location']['city'],
                state=event['location']['state'],
                is_virtual=event['location']['is_virtual']
            )
            organizer = Organizer(
                name=event['organizer']['name'],
                type=event['organizer']['type'],
                contact_email=event['organizer']['contact_email'],
                website=event['organizer']['website']
            )
            event_obj = Event(
                id=event['id'],
                name=event['name'],
                description=event['description'],
                start_datetime=event['start_datetime'],
                end_datetime=event['end_datetime'],
                location=location,
                category=event['category'],
                subcategory=event['subcategory'],
                tags=event['tags'],
                organizer=organizer,
                image_url=event['image_url']
            )
            events.append(event_obj)
    recommendation_response = RecommendationResponse(events)
    return recommendation_response.to_dict()

@app.route('/faqs', methods=['POST'])
@parse_request(FaqRequest)
def faqs(data: FaqRequest):
    print("Received data:", data)
    status = data.status
    faqResponse = FaqResponse([])
    try:
        with open('../data/faqs.json', 'r') as file:
            faqs_data = json.load(file)
            for faq in faqs_data:
                if (faq['visa_type'] == status):
                    qaPair = QAPair(faq['question'], faq['answer'])
                    faqResponse.faqs.append(qaPair)
            
    except FileNotFoundError:
        return {"error": "FAQs data file not found."}, 500
    
    return faqResponse.to_dict()

if __name__ == '__main__':
    app.run(debug=True)