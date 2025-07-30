const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HIGHSCORES_FILE = path.join(__dirname, 'highscores.json');

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files if needed

// Initialize highscores.json if it doesn't exist
async function initializeHighScores() {
    try {
        console.log('Checking for highscores.json file...');
        await fs.access(HIGHSCORES_FILE);
        console.log('highscores.json already exists');
        
        // Read and log the current scores
        const currentScores = await readHighScores();
        console.log('Current high scores:', currentScores);
        
    } catch (error) {
        // File doesn't exist, create it with default scores
        console.log('highscores.json not found, creating with default scores...');
        const defaultScores = [
            { player: 'ACE', score: 10000 },
            { player: 'HERO', score: 9000 },
            { player: 'PILOT', score: 8000 },
            { player: 'STAR', score: 7000 },
            { player: 'FLYER', score: 6000 },
            { player: 'SHOOTER', score: 5000 },
            { player: 'WARRIOR', score: 4000 },
            { player: 'CHAMPION', score: 3000 },
            { player: 'LEGEND', score: 2000 },
            { player: 'MASTER', score: 1000 }
        ];
        
        try {
            await fs.writeFile(HIGHSCORES_FILE, JSON.stringify(defaultScores, null, 2));
            console.log('Successfully created highscores.json with default scores');
            console.log('Default scores:', defaultScores);
        } catch (writeError) {
            console.error('Failed to create highscores.json:', writeError);
            throw writeError;
        }
    }
}

// Read high scores from file
async function readHighScores() {
    try {
        const data = await fs.readFile(HIGHSCORES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading highscores.json:', error);
        return [];
    }
}

// Write high scores to file
async function writeHighScores(scores) {
    try {
        await fs.writeFile(HIGHSCORES_FILE, JSON.stringify(scores, null, 2));
    } catch (error) {
        console.error('Error writing highscores.json:', error);
        throw error;
    }
}

// Validation function
function validateScore(player, score) {
    if (typeof player !== 'string' || player.trim().length === 0) {
        return { valid: false, error: 'Player name must be a non-empty string' };
    }
    
    if (typeof score !== 'number' || isNaN(score) || score < 0) {
        return { valid: false, error: 'Score must be a valid positive number' };
    }
    
    return { valid: true };
}

// GET /highscores - Return current high scores
app.get('/highscores', async (req, res) => {
    try {
        console.log('GET /highscores request received');
        console.log('Request headers:', req.headers);
        
        const scores = await readHighScores();
        console.log('Returning scores:', scores);
        
        res.json(scores);
    } catch (error) {
        console.error('Error getting high scores:', error);
        res.status(500).json({ error: 'Failed to retrieve high scores' });
    }
});

// POST /highscores - Add new score
app.post('/highscores', async (req, res) => {
    try {
        const { player, score } = req.body;
        
        // Validate input
        const validation = validateScore(player, score);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        
        // Read current scores
        const scores = await readHighScores();
        
        // Add new score
        scores.push({ player: player.trim(), score });
        
        // Sort by score (descending) and keep only top 10
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 10);
        
        // Write back to file
        await writeHighScores(topScores);
        
        // Return updated scores
        res.json(topScores);
        
    } catch (error) {
        console.error('Error adding high score:', error);
        res.status(500).json({ error: 'Failed to add high score' });
    }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
    try {
        await initializeHighScores();
        
        app.listen(PORT, () => {
            console.log(`High scores server running on port ${PORT}`);
            console.log(`GET /highscores - Retrieve high scores`);
            console.log(`POST /highscores - Add new score`);
            console.log(`Health check: /health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 