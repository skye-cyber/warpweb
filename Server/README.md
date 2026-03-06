# FileWarp Server

REST API backend for FileWarp operations with async task management and real-time updates.

## Features

- 🚀 **FastAPI** - Modern, fast web framework
- 📦 **Async Task Management** - Long-running operations handled asynchronously
- 🔄 **Real-time Updates** - WebSocket connections for progress monitoring
- 🎯 **Multiple Operations** - Support for document, audio, video, image, PDF, OCR operations
- 📊 **Progress Tracking** - Detailed progress with ETA calculation
- 🔒 **File Validation** - Input validation and permission checking
- 🐳 **Docker Support** - Easy deployment with Docker
- 📝 **Comprehensive API** - Well-documented REST endpoints

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/skye-cyber/warpweb.git
cd warpweb

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Run the server
python -m warpapp.main
```

## Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t warpweb .
docker run -p 8000:8000 warpweb
```

## Architecture Components
### 1. Core Backend Structure
```bash
Server/
├── warpapp/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── conversion.py   # All conversion endpoints
│   │   │   ├── pdf.py          # PDF operations
│   │   │   ├── audio.py         # Audio operations
│   │   │   ├── video.py         # Video operations
│   │   │   ├── image.py         # Image operations
│   │   │   └── system.py        # System status, version, etc.
│   │   └── dependencies.py      # Shared dependencies
│   ├── core/
│   │   ├── __init__.py
│   │   ├── interpreter.py       # Operation interpreter
│   │   ├── executor.py          # Execution engine
│   │   ├── task_manager.py      # Async task management
│   │   └── file_handler.py      # File path validation
│   ├── models/
│   │   ├── __init__.py
│   │   ├── requests.py          # Pydantic request models
│   │   ├── responses.py         # Response models
│   │   └── tasks.py             # Task status models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── conversion_service.py # Direct import mapping
│   │   ├── progress_service.py   # Progress tracking
│   │   └── websocket_manager.py  # WebSocket for real-time updates
│   └── utils/
│       ├── __init__.py
│       ├── validators.py         # Input validation
│       └── formatters.py         # Response formatting
├── config/
│   ├── __init__.py
│   └── settings.py               # App settings
├── logs/                          # Operation logs
├── uploads/                       # Temporary file storage (optional)
├── outputs/                       # Generated outputs
└── requirements.txt
```

## Usage
```shell
# Submit conversion task
curl -X POST http://localhost:8000/api/v1/conversion/submit \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "convert-doc",
    "input_paths": ["/path/to/document.docx"],
    "target_format": "pdf",
    "options": {"use_extras": false}
  }'

# Get task status
curl http://localhost:8000/api/v1/conversion/task/123e4567-e89b-12d3-a456-426614174000/status

# WebSocket connection for real-time updates
# ws://localhost:8000/api/v1/conversion/task/123e4567-e89b-12d3-a456-426614174000/ws
```

### Python usage
```python
import requests

# Submit a conversion task
response = requests.post(
    "http://localhost:8000/api/v1/conversion/submit",
    json={
        "operation": "convert-doc",
        "input_paths": ["/path/to/document.docx"],
        "target_format": "pdf"
    }
)
task_id = response.json()["task_id"]

# Check task status
status = requests.get(
    f"http://localhost:8000/api/v1/tasks/{task_id}/status"
)
print(status.json())
```
### WebSocket for Real-time Updates
```js
const ws = new WebSocket("ws://localhost:8000/api/v1/ws/task/{task_id}");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(`Progress: ${data.progress}% - ${data.message}`);
};
```
