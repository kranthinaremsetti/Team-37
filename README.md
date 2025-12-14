# 🚀 **Automated Code Evaluation & Viva Assistance System**

> Empowering hackathon judges to evaluate faster, deeper, and more fairly through intelligent code analysis.

---

## 📌 **Problem Statement**

Hackathon judges must evaluate many team submissions within a very short time.
Manually reviewing each codebase is slow, inconsistent, and often incomplete. Judges struggle with:

* Understanding the overall code structure quickly
* Identifying important or complex parts of the project
* Assessing the team's conceptual understanding
* Preparing meaningful viva questions
* Maintaining fairness and consistency across all teams

These challenges lead to **evaluation fatigue**, biased scoring, and missed insights.

There is a clear need for a system that can **summarize, analyze, and highlight key aspects of a codebase**, enabling judges to **evaluate faster, deeper, and more fairly**.

---

## 💡 **Proposed Solution (Idea Overview)**

We propose an **Automated Code Evaluation & Viva Assistance System** designed to support judges with a structured and intelligent project-review pipeline.

---

### **1️⃣ Submission Intake**

Judges have two flexible input options:
1. **Paste a single GitHub repository URL** for instant individual analysis
2. **Upload a CSV spreadsheet** containing multiple team names and repository URLs for batch processing

The system automatically reads the project structure and essential metadata for all submissions.

---

### **2️⃣ Codebase Understanding**

The system provides a quick, high-level overview of the project, including:

* Files and folder layout
* Code organization patterns
* Documentation quality
* Presence of test scripts
* Basic complexity indicators

This gives judges a **fast and accurate snapshot** of the entire project.

---

### **3️⃣ Concept Analysis**

The system analyzes the implementation to detect:

* Algorithms used
* Data structures
* Logical workflows
* Core functionalities
* Design patterns
* API or service usage

This helps judges understand **what the team actually built** and the depth of their conceptual knowledge.

---

### **4️⃣ Key Insights Extraction**

The system highlights:

* Important or high-impact files
* Complex code segments
* Core implementation strengths
* Areas needing deeper review

This allows judges to focus their time on the **most meaningful parts** of a submission.

---

### **5️⃣ Viva Question Generator**

Based on the code structure and logic, the system generates **precise, targeted viva questions**, such as:

* "Why did you choose this approach?"
* "Explain the logic behind this function."
* "What alternative design would you consider?"

This ensures **quality and consistency** in viva evaluation across all teams.

---

### **6️⃣ Judge Summary Report**

The system produces a compact, judge-friendly summary that includes:

* Project overview
* Key technical insights
* Highlighted strengths and weaknesses
* Auto-generated viva questions

This enables judges to **evaluate projects faster and more fairly**.

---

## 🎯 **Outcome**

A streamlined, evidence-driven evaluation workflow that helps judges:

* ✅ Save significant review time
* ✅ Gain deeper insights into submissions
* ✅ Maintain fairness across all teams
* ✅ Conduct more meaningful viva sessions
* ✅ Rank projects with greater confidence

---

## 🏗️ **Technical Architecture**

### **System Components**

#### **1. Backend Service (`report_service/`)**
- **Framework**: FastAPI with async/await support
- **AI Engine**: Google Gemini 2.5 Pro
- **Architecture**: Modular processor-based pipeline

**Key Modules:**
- `main.py` - FastAPI application with `/generate-report` endpoint
- `models.py` - Pydantic models for request/response validation
- `llm.py` - Google Gemini AI integration layer
- `processors/` - 8 specialized analysis processors:
  - `problem.py` - Problem statement extraction
  - `solution.py` - Solution overview generation
  - `relevance.py` - Relevance assessment
  - `mastery.py` - Concept mastery evaluation
  - `strengths.py` - Project strengths identification
  - `weaknesses.py` - Weaknesses and gaps analysis
  - `scoring.py` - Rubric-based scoring engine
  - `viva.py` - Targeted interview question generation

#### **2. Middleware Server (`server.js`)**
- **Framework**: Express.js with CORS support
- **Database**: MongoDB for persistent storage
- **Purpose**: GitHub integration, batch processing, and request orchestration
- **Features**:
  - Single repository analysis (`/analyze`)
  - Batch CSV upload processing (`/api/analyze/batch`)
  - Team report retrieval (`/api/teams/:team_name`)
  - GitHub commit history extraction
  - Smart code snippet collection
  - Static metrics calculation
  - ASCII directory tree generation

#### **3. Frontend Application (`frontend/`)**
- **Framework**: React with modern hooks
- **Build Tool**: Parcel bundler
- **User Interface**:
  - **Dual Input Options**:
    1. **Paste GitHub URL** - Single repository instant analysis
    2. **Upload CSV Sheet** - Batch processing with team names and repository URLs
  - **Three-Tab Navigation**:
    - **Single Analysis**: Paste GitHub URL for immediate evaluation
    - **Batch Upload**: Upload CSV file with columns (teamName, repoUrl)
    - **View Reports**: Search and retrieve saved evaluations by team name
  - Interactive data visualizations (gauges, charts, language bars)
  - Comprehensive report sections with collapsible panels
  - Real-time progress indicators
  - Responsive design for all devices

---

## 📂 **Project Structure**

```
Team-37/
├── README.md                      # Project documentation
├── GUIDELINES.md                  # Development guidelines
├── package.json                   # Node.js dependencies
├── server.js                      # Express middleware server
├── src/                           # Middleware source code
│   ├── routes/                    # Express routes
│   │   ├── analyzeRouter.js       # Single repo analysis
│   │   ├── batchAnalyzeRoutes.js  # Batch CSV processing
│   │   └── reportRoutes.js        # Team report retrieval
│   ├── controllers/               # Business logic
│   │   ├── analyzeController.js
│   │   └── batchAnalyzeController.js
│   ├── services/                  # Core services
│   │   ├── githubService.js       # GitHub API integration
│   │   ├── repoFetcherService.js  # Repository cloning
│   │   ├── snippetExtractorService.js
│   │   ├── staticCheck.js         # Static analysis
│   │   ├── asciiTreeService.js    # Directory tree generation
│   │   ├── spreadsheetParserService.js
│   │   └── friendBackendService.js # FastAPI communication
│   ├── models/                    # MongoDB schemas
│   │   └── TeamReport.js          # Team evaluation schema
│   └── utils/                     # Helper functions
├── report_service/                # FastAPI backend
│   ├── main.py                    # API endpoints
│   ├── models.py                  # Pydantic models
│   ├── llm.py                     # Gemini AI integration
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables
│   ├── processors/                # Analysis processors
│   │   ├── problem.py             # Problem statement
│   │   ├── solution.py            # Solution overview
│   │   ├── relevance.py           # Relevance analysis
│   │   ├── mastery.py             # Concept mastery
│   │   ├── strengths.py           # Strengths identification
│   │   ├── weaknesses.py          # Weakness detection
│   │   ├── scoring.py             # Rubric-based scoring
│   │   └── viva.py                # Question generation
│   └── utils/                     # Utility functions
└── frontend/                      # React frontend
    ├── src/
    │   ├── App.js                 # Main app with tab navigation
    │   ├── index.js               # Entry point
    │   ├── components/            # React components
    │   │   ├── Header.js          # App header
    │   │   ├── BatchUpload.js     # CSV upload interface
    │   │   ├── Gauge.js           # Score visualization
    │   │   ├── EvaluationTable.js # Scoring breakdown
    │   │   ├── VivaQuestions.js   # Question display
    │   │   ├── LanguagesBar.js    # Language chart
    │   │   ├── ContributorsChart.js
    │   │   └── StructureTree.js   # Directory tree
    │   └── api/                   # API integration
    ├── index.html
    └── package.json
```

---

## 🚀 **Setup & Installation**

### **Prerequisites**
- Python 3.12+
- Node.js 18+
- Google Gemini API Key

### **Backend Setup**

1. **Navigate to report service:**
   ```bash
   cd report_service
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Linux/Mac
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create `.env` file in root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=link
   PORT=3000
   ```

5. **Run the service:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### **Middleware Server Setup**

1. **Install Node dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   node server.js
   ```
   Server runs on `http://localhost:3000`

### **Frontend Setup**

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm start
   ```

---

## 🔧 **API Documentation**

### **1. POST /analyze** (Single Repository Analysis)

**Endpoint:** `http://localhost:3000/analyze`

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

**Response:** Returns complete analysis including languages, structure, stats, contributors, and AI-generated report.

---

### **2. POST /api/analyze/batch** (Batch CSV Upload)

**Endpoint:** `http://localhost:3000/api/analyze/batch`

**Request:** Multipart form-data with CSV file containing columns: `teamName`, `repoUrl`

**CSV Format:**
```csv
teamName,repoUrl
Team Alpha,https://github.com/user1/repo1
Team Beta,https://github.com/user2/repo2
```

**Response:**
```json
{
  "batch_id": "batch-1234567890",
  "total_teams": 2,
  "results": [
    {"team_name": "Team Alpha", "status": "success", "saved_to_db": true},
    {"team_name": "Team Beta", "status": "success", "saved_to_db": true}
  ]
}
```

---

### **3. GET /api/teams/:team_name** (Retrieve Team Report)

**Endpoint:** `http://localhost:3000/api/teams/Team%20Alpha`

**Response:** Returns saved team evaluation report from MongoDB.

---

### **4. POST /generate-report** (FastAPI Backend)

**Endpoint:** `http://localhost:8000/generate-report`

**Request Body:**
```json
{
  "worker_json": {
    "metadata": {
      "description": "Project description",
      "readme": "README content",
      "tech_stack": ["Python", "React"],
      "commits": [
        {
          "sha": "abc123",
          "message": "Initial commit",
          "date": "2025-12-14",
          "author": {"name": "Developer"}
        }
      ]
    },
    "snippets": [
      {
        "file": "main.py",
        "lines": [1, 50],
        "content": "Code content",
        "language": "python"
      }
    ],
    "static_metrics": {
      "total_files": 20,
      "total_lines": 1500,
      "total_commits": 15
    }
  },
  "jury_rubric": {
    "criteria": [
      {"name": "Code Quality", "weight": 0.3},
      {"name": "Innovation", "weight": 0.25},
      {"name": "Completeness", "weight": 0.25},
      {"name": "Documentation", "weight": 0.2}
    ]
  }
}
```

**Response:**
```json
{
  "problem_statement": "Clear problem statement...",
  "solution_overview": "Technical solution overview...",
  "relevance": "Relevance assessment...",
  "concept_mastery": "Concept mastery evaluation...",
  "strengths": [
    "Strength point 1",
    "Strength point 2",
    "Strength point 3"
  ],
  "weaknesses": [
    "Weakness point 1",
    "Weakness point 2"
  ],
  "evaluation": [
    {
      "criterion": "Code Quality",
      "weight": 0.3,
      "score": 8.5,
      "observations": "Detailed observations...",
      "strengths": "Specific strengths...",
      "weaknesses": "Specific weaknesses..."
    }
  ],
  "final_weighted_score": 85.5,
  "viva_questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  "final_verdict": "Overall assessment summary"
}
```

---

## 🎨 **Key Features**

### **Intelligent Code Analysis**
- 📊 Automated project structure analysis with ASCII tree visualization
- 🔍 Smart code snippet extraction with relevance ranking
- 📈 Static metrics calculation (files, lines, tests, TODOs)
- 🧠 AI-powered insight generation with Gemini 2.5 Pro
- 🌐 GitHub API integration for comprehensive metadata

### **Batch Processing**
- 📤 CSV file upload for multiple repositories
- 🔄 Parallel processing of team submissions
- 💾 MongoDB storage for persistent results
- 🔍 Team name-based report retrieval
- 📊 Batch analysis progress tracking

### **Fair & Consistent Evaluation**
- ⚖️ Rubric-based scoring system with customizable criteria
- 📝 Evidence-driven assessments from actual code
- 🎯 Consistent evaluation criteria across all teams
- 📊 Transparent scoring breakdown with detailed observations
- 🏆 Final verdict with weighted score calculation

### **Viva Question Generation**
- ❓ 8 targeted technical questions per project
- 🔬 Implementation-specific queries based on actual code
- 💡 Conceptual understanding tests
- 🎓 Difficulty-appropriate questions for depth verification

### **Judge-Friendly Interface**
- 🎯 **Dual Input Methods**:
  - 📝 **Paste GitHub URL** - Quick single repository analysis
  - 📤 **Upload CSV Sheet** - Batch process multiple teams at once
- 📋 Three-tab navigation (Single Analysis, Batch Upload, View Reports)
- ⚡ Real-time evaluation progress indicators
- 📊 Interactive visualizations (gauges, charts, language bars)
- 🎨 Clean, collapsible report sections
- 📱 Fully responsive design for all devices
- 🔄 Save and retrieve evaluations anytime
- 🔍 Search saved reports by team name

---

## 🛠️ **Technology Stack**

### **Backend**
- **FastAPI** - Modern async web framework
- **Google Gemini 2.5 Pro** - Advanced AI model
- **Pydantic** - Data validation
- **Python 3.12** - Core language
- **Uvicorn** - ASGI server

### **Middleware**
- **Express.js** - Web server framework
- **MongoDB** - NoSQL database for report storage
- **Mongoose** - MongoDB object modeling
- **Axios** - HTTP client
- **Multer** - File upload handling
- **CSV Parser** - Spreadsheet processing
- **Unzipper** - ZIP file processing

### **Frontend**
- **React** - UI library
- **Parcel** - Build tool
- **Axios** - API communication
- **Modern CSS** - Responsive styling

### **AI/ML**
- **Google Gemini API** - Natural language processing
- **LangChain** - Agent orchestration (optional)
- **Temperature tuning** - Response quality control

---

## 📊 **Evaluation Pipeline**

### **Single Repository Analysis**
```
GitHub Repo → Middleware Server → Report Service → Final Report
     ↓                    ↓                  ↓              ↓
  Extract            Process            Analyze        Generate
  Metadata           Files              with AI        Summary
```

### **Batch Processing Workflow**
```
CSV Upload → Parse Teams → Analyze Each Repo → Save to MongoDB → Retrieve Reports
     ↓             ↓              ↓                    ↓              ↓
  Upload      Extract URLs    Process All        Store Results   View Saved
  File        Team Names      Repositories       in Database     Evaluations
```

**Processing Steps:**
1. **Intake** - Repository cloning or CSV batch upload
2. **Parsing** - Code structure and metadata extraction
3. **Analysis** - 8 parallel AI processor evaluations
4. **Scoring** - Rubric-based weighted score calculation
5. **Generation** - Viva questions and final report creation
6. **Storage** - MongoDB persistence for batch results
7. **Delivery** - JSON response to frontend or database retrieval

---

## 🤝 **Team 37**

Built with ❤️ for Gen AI Hackathon 2025  
**JNTU Vijayanagaram, December 13-14, 2025**

---

