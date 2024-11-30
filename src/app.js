const express = require('express');
const { Groq } = require('groq-sdk');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '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'
});

// Routes
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/chat', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about', { 
        error: 'About page is currently under development. Stay tuned for more details about Mindfullness and its mission!' 
    });
});

app.get('/contact', (req, res) => {
    res.redirect('mailto:mohammadizhan710@gmail.com');
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ 
                error: 'Invalid request format' 
            });
        }

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.8,
            stream: false
        });

        res.json({ 
            response: completion.choices[0].message 
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

app.post('/submit-contact', (req, res) => {
    res.status(503).render('contact', { 
        error: 'Contact submissions are currently unavailable. We apologize for the inconvenience.' 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
