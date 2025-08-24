# MaChuNi
![logo](https://github.com/user-attachments/assets/e1d362df-b028-4c8c-817a-31fa1d090627)

MaChuNi is a web app designed to help students and newcomers from Nepal adapt smoothly to life far away from home. Moving to a new country can feel overwhelming. MaChuNi aims to make the transition smoother by providing reliable information and fostering cultural connections.

## 👣 Walkthrough

https://github.com/user-attachments/assets/ca2fcf50-2ed7-403f-bca7-ead881a0ca29

## 🔑 Key Features
- **🤖 AI Chatbot for Newcomers**: Ask questions like “How do I open a bank account?” or “What is CPT/OPT?” and get clear, AI-powered answers tailored for Nepali students in the U.S.
- **🎉 Personalized Event Recommendations**: Discover nearby events, cultural activities, and community gatherings recommended based on your interests.
- **👫 Community & Culture**: Connect with people, discover local spots, and explore ways to assimilate smoothly into U.S. culture.

## ⚡ How It Works
- **Set Your Profile & Interests**: Users select their status, interests, and preferences using the sidebar filters to personalize their experience.
- **Ask Questions via Chatbot**: Users can chat with our AI-powered assistant to get answers on topics like banking, SIM cards, SSN, CPT/OPT, and more. Our ML system processes the query and provides the most reliable answer. If the confidence score is low, the question is forwarded to the community forum so experts can respond, ensuring trustworthy information.
- **Starter Questions for Beginners**: For newcomers, we provide a set of carefully curated starter questions to help them navigate their initial steps smoothly.
- **Discover Local Activities & Events**: A dedicated space lists personalized events and activities based on user interests. Users can browse for details and explore opportunities to connect with the community.

## 📋 Prerequisites
- Git
- Node and npm
- Python 3
- Ollama

## 🛠️ Tools and Libraries
- Flask
- React
- Tailwind
- Embedding model: nomic-embed-text
- Generative model: llama3
- ChromaDB

## 💻 How to run the project locally?
- Clone this repo to your local machine
- Move to the cloned repository

  ### 🎨 Steps to run frontend
  - Navigate to the `frontend` folder using `cd frontend` from your project folder
  - Run `npm install` to install necessary packages
  - Once all the packages are installed, run `npm run dev` to start your React app
  - Head to http://127.0.0.1:5173 in your browser to load the application portal
  
  ### ⚙️ Steps to run backend
  - Navigate to the `backend` folder using `cd backend` from your project folder
  - Create a Python virtual environment using `python3 -m venv <environment_name>`
  - Activate your virtual environment using `source <environment_name>/bin/activate`
  - Install the embedding model by running `ollama pull nomic-embed-text`
  - Install generative model by running `ollama pull mistral`
  - Run `pip install -r requirements.txt` to install all required modules
  - Navigate to the app folder using `cd app`
  - Run `flask run` to run your backend server

## ✨ Contributors 
Shoutout goes to these wonderful people:
- [Anuj Bhattarai](https://github.com/akin-bh) - Frontend + Presentation
- [Mandira Ghimire](https://github.com/mandiragh) - ML System
- [Shrill Shrestha](https://github.com/ShrillShrestha) - Backend Dev
- [Sujal Ratna Tamrakar](https://github.com/SujalRatnaTamrakar) - ML System
- [Tanusha Ayer](https://github.com/tanushaayer) - Frontend Dev


  
