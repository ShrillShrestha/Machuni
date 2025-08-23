import datetime
from pydantic import BaseModel

# /faq
class QAPair:
    def __init__(self, question: str, answer: str):
        self.question = question
        self.answer = answer
    
    def to_dict(self):
        return {"question": self.question, "answer": self.answer}

class FaqRequest(BaseModel):
    status: str
    language_preferance: str

class FaqResponse:
    def __init__(self, faqs: list[QAPair]):
        self.faqs = faqs
    
    def to_dict(self):
        return {"faqs": [faq.to_dict() for faq in self.faqs]}

# /persomalized-queries
class PersonalizedQueryRequest(BaseModel):
    status: str
    interests: list[str]
    country: str
    state: str 
    language_preferance: str

class PersonalizedQueryResponse:
    def __init__(self, queries: list[str]):
        self.queries = queries

    def to_dict(self):
        return {"queries": self.queries}

# /recommendations
class Location: 
    def __init__(self, venue_name: str, address: str, city: str, state: str, is_virtual: bool, virtual_link: str = None):
        self.venue_name = venue_name,
        self.address = address
        self.city = city
        self.state = state
        self.is_virtual = is_virtual
        self.virtual_link = virtual_link
    
    def to_dict(self):
        return {
            "venue_name": self.venue_name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "is_virtual": self.is_virtual
        }

class Organizer:
    def __init__(self, name: str, type: str, contact_email: str, website: str):
        self.name = name
        self.type = type
        self.contact_email = contact_email
        self.website = website
    
    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "contact_email": self.contact_email,
            "website": self.website
        }

class Event:
    def __init__(self, id: int, name: str, description: str, start_datetime: datetime, end_datetime: datetime, 
                 location: Location, category: str, subcategory: str, tags: list[str], organizer: Organizer, image_url: str):
        self.id = id
        self.name = name
        self.description = description
        self.start_datetime = start_datetime,
        self.end_datetime = end_datetime,
        self.location = location
        self.category = category
        self.subcategory = subcategory
        self.tags = tags
        self.organizer = organizer
        self.image_url = image_url
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "start_datetime": self.start_datetime,
            "end_datetime": self.end_datetime,
            "location": self.location.to_dict(),
            "category": self.category,
            "subcategory": self.subcategory,
            "tags": self.tags,
            "organizer": self.organizer.to_dict(),
            "image_url": self.image_url
        }

class RecommendationRequest(BaseModel):
    status: str
    interests: list[str]
    country: str
    state: str
    language_preferance: str

class RecommendationResponse:
    def __init__(self, events: list[Event]):
        self.events = events
    
    def to_dict(self):
        return {"events": [event.to_dict() for event in self.events]}

# /chat
class ChatRequest(BaseModel):
    status: str
    interests: list[str]
    country: str
    state: str
    language_preferance: str
    question: str
        
class ChatResponse:
    def __init__(self, answer: str):
        self.answer = answer
    
    def to_dict(self):
        return {"answer": self.answer}