from flask import Flask, request
from flask_cors import CORS
import custom_type as ct
from flask_pydantic import validate
import json

app = Flask(__name__)
CORS(app)

@app.route('/chat')
def home():
    chat_response = ct.ChatResponse("This is a sample response from ChatResponse")
    return chat_response.to_dict()

@app.route('/queries', methods=['POST'])
def queries():
    queries = ["What is an F1 visa?", "How to apply for a Green Card?"]
    return ct.personalizedQueryResponse(queries).to_dict()

@app.route('/recommendations', methods=['POST'])
def recommendations():
    data = request.get_json()
    with open('../data/events.json', 'r') as file:
        content = file.read()
        events_data = json.loads(content)
        events = []
        for event in events_data:
            location = ct.Location(
                venue_name=event['location']['venue_name'],
                address=event['location']['address'],
                city=event['location']['city'],
                state=event['location']['state'],
                is_virtual=event['location']['is_virtual']
            )
            organizer = ct.Organizer(
                name=event['organizer']['name'],
                type=event['organizer']['type'],
                contact_email=event['organizer']['contact_email'],
                website=event['organizer']['website']
            )
            event_obj = ct.Event(
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
    recommendation_response = ct.RecommendationResponse(events)
    return recommendation_response.to_dict() # Convert to dict for JSON serialization

@app.route('/faqs', methods=['POST'])
@validate()
def faqs():
    data = request.get_json()
    status = data['status']
    faqResponse = ct.FaqResponse([])
    try:
        with open('../data/faqs.json', 'r') as file:
            content = file.read()
            faqs_data = json.loads(content)
            for faq in faqs_data:
                if (faq['visa_type'] == status):
                    qaPair = ct.qaPair(faq['question'], faq['answer'])
                    faqResponse.faqs.append(qaPair)
            
    except FileNotFoundError:
        return {"error": "FAQs data file not found."}, 500
    
    return faqResponse.to_dict()

if __name__ == '__main__':
    app.run(debug=True)