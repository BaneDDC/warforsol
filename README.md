# War For Sol High Scores Server

A simple Node.js + Express server for persisting high scores to a local JSON file.

## Features

- **GET /highscores** - Retrieve current high scores
- **POST /highscores** - Add new score to the list
- **Automatic sorting** - Keeps only top 10 scores
- **Input validation** - Validates player name and score
- **JSON file persistence** - Stores scores in `highscores.json`
- **Health check endpoint** - `/health` for deployment monitoring

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Development mode (with auto-restart):**
   ```bash
   npm run dev
   ```

The server will run on port 3000 by default, or use the `PORT` environment variable.

## API Endpoints

### GET /highscores
Returns the current top 10 high scores.

**Response:**
```json
[
  { "player": "ACE", "score": 10000 },
  { "player": "HERO", "score": 9000 },
  ...
]
```

### POST /highscores
Adds a new score to the list.

**Request Body:**
```json
{
  "player": "PLAYER_NAME",
  "score": 5000
}
```

**Response:**
Returns the updated top 10 scores list.

**Validation:**
- `player` must be a non-empty string
- `score` must be a valid positive number

### GET /health
Health check endpoint for deployment monitoring.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## File Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── highscores.json    # High scores data (auto-created)
└── README.md         # This file
```

## Deployment on Render

1. **Connect your repository** to Render
2. **Create a new Web Service**
3. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. **Deploy**

The server will automatically:
- Install dependencies
- Create `highscores.json` with default scores if it doesn't exist
- Start on the port provided by Render

## Default High Scores

The server initializes with these default scores:
- ACE: 10,000
- HERO: 9,000
- PILOT: 8,000
- STAR: 7,000
- FLYER: 6,000
- SHOOTER: 5,000
- WARRIOR: 4,000
- CHAMPION: 3,000
- LEGEND: 2,000
- MASTER: 1,000

## Integration with Game

To integrate with your game:

1. **Load scores on game start:**
   ```javascript
   fetch('/highscores')
     .then(response => response.json())
     .then(scores => {
       // Update your game's high scores display
     });
   ```

2. **Submit new score:**
   ```javascript
   fetch('/highscores', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ player: 'PLAYER_NAME', score: 5000 })
   })
   .then(response => response.json())
   .then(scores => {
     // Update display with new scores
   });
   ```