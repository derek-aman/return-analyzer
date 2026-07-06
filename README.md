# Return Reason Analyzer

An AI-powered tool that automatically classifies e-commerce return reasons from free-text customer comments into structured categories, at scale — so merchants don't have to manually tag thousands of returns.

## Problem

Merchants collect return reasons as unstructured free text ("item didn't fit", "wrong color sent", "changed my mind", etc.). Manually reading and categorizing thousands of these entries is slow and inconsistent, and makes it hard to spot patterns (e.g. sizing issues vs. quality issues) at a category level.

## Solution

Return Reason Analyzer ingests merchant return data (single entries or bulk CSV uploads), classifies each entry into one of 12 predefined categories using an LLM, and returns structured, analyzable output — without blocking on large batch jobs.

## Features

- **12-category AI classification** of return reasons using Groq LLaMA
- **Batch CSV processing** for merchants uploading large return histories
- **Async job queue** (Bull + Redis) so large batches don't time out the request or block new uploads
- **Real-time progress tracking** via WebSockets — see classification progress live instead of polling
- **Interactive UI** with a Three.js-powered hero section

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express |
| Database | MongoDB |
| Queue / Cache | Redis, Bull |
| AI Classification | Groq LLaMA API |
| Real-time updates | WebSockets |
| 3D / Visuals | Three.js |

## How It Works

1. **Upload** — a user submits a single return reason or a CSV of return history.
2. **Queue** — each entry (or batch) is pushed onto a Bull/Redis queue instead of being processed synchronously.
3. **Classify** — background workers send each return reason to the Groq LLaMA API, which maps it to one of 12 categories.
4. **Track** — as jobs complete, progress updates are pushed to the client over WebSockets in real time.
5. **Result** — classified data is stored in MongoDB and returned to the user as structured, filterable output.

## Why This Architecture

- **Queue-based processing** avoids request timeouts on large CSV uploads and keeps the API responsive under load.
- **WebSockets over polling** gives instant feedback on long-running batch jobs without repeated client-side requests hammering the server.
- **LLM-based classification** handles the variability and ambiguity of free-text reasons better than keyword/rule-based matching.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/derek-aman/return-analyzer.git
cd return-analyze

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

### Running Locally

```bash
# Start Redis (if running locally)
redis-server

# Start backend
cd backend
node server.js

# Start frontend
cd frontend
npm run dev
```




