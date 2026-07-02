# 🤖 AI Interview Coach

An AI-powered mock interview platform that simulates real technical interviews using **Llama 3.3**, **LangChain**, and **Groq**. Candidates receive dynamically generated interview questions, instant AI-powered answer evaluation, and a comprehensive performance report after completing the interview.

---

## 🚀 Features

- 🧠 AI-generated interview questions (No hardcoded questions)
- 🎯 Multiple technical domains
- 📊 Three difficulty levels (Easy, Medium, Hard)
- 💬 AI-powered answer evaluation
- 📈 Final interview performance report
- 📝 Session history stored in MongoDB
- 🔄 Dynamic question generation with memory (prevents repeated questions)
- ⚡ FastAPI AI microservice architecture
- 🌐 Modern React frontend

---

# 🛠 Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI Service
- Python
- FastAPI
- LangChain
- Groq
- Llama 3.3 70B
- Pydantic

---

# 🏗 Architecture

```
                 React Frontend
                        │
                        ▼
               Express.js Backend
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
   MongoDB Database              FastAPI AI Service
                                        │
                                        ▼
                                  LangChain Chain
                                        │
                                        ▼
                                  Groq Llama 3.3
```

---

# ⚙ Project Workflow

### 1️⃣ Start Interview

- Select Domain
- Select Difficulty
- Backend creates a new interview session
- AI generates the first interview question

---

### 2️⃣ Interview Process

For every question:

Candidate Answer

↓

Express Backend

↓

FastAPI

↓

LangChain

↓

Groq Llama

↓

AI Evaluation

↓

Score + Feedback

↓

Stored in MongoDB

---

### 3️⃣ Next Question

Instead of using static questions:

- Previous questions are sent to the LLM
- AI generates a completely new question
- Prevents repeated questions
- Maintains interview progression

---

### 4️⃣ Final Report

After Question 5:

- All answers are collected
- Overall score is calculated
- AI generates

- Performance Summary
- Strengths
- Weak Areas
- Recommendations

---


# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AI-Interview-Coach.git

cd AI-Interview-Coach
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

## Backend

```bash
cd server

npm install

npm run dev
```

---

## AI Service

```bash
cd ai-service

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

python -m uvicorn main:app --reload --port 8000
```

---

# 🔐 Environment Variables

## server/.env

```env
PORT=5000

MONGO_URI=your_mongodb_connection

AI_SERVICE_URL=http://localhost:8000
```

---

## ai-service/.env

```env
GROQ_API_KEY=your_groq_api_key
```

---

# 🌟 Future Improvements

- 🎤 Voice-based Interviews
- 📊 Performance Dashboard
- 👤 User Authentication
- 🏢 Company-specific Interview Modes
- 📄 PDF Report Export
- 📈 Interview Progress Analytics

---

# 👨‍💻 Author

**Harsh Bhuteja**

- GitHub: https://github.com/cr-harsh
- LinkedIn: https://www.linkedin.com/in/harsh-bhuteja-063371249

---

## ⭐ If you found this project useful, consider giving it a star!