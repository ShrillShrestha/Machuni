from flask import Flask
from flask_cors import CORS
from custom_type import *
import json
from request_parser import parse_request
from query import ask_question, generate_answer, generate_answer_with_context, get_starter_questions
import re

app = Flask(__name__)
app.config['WTF_CSRF_ENABLED'] = False
CORS(app)

@app.route('/chat', methods=['POST'])
@parse_request(ChatRequest)
def chat(data: ChatRequest):
    question = data.question

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