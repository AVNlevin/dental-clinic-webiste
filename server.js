/**
 * AuraDental Studio - Backend Server (Zero Dependencies)
 * Handles serving static client files and API bookings database.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STAFF_PIN = "2005"; // Staff authentication PIN

// Database setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data folder and bookings list exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf8');
}

// Helper: Serve Static Files from /public
function serveStaticFile(req, res) {
    // Prevent directory traversal attacks
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/') safeUrl = '/index.html';

    const filePath = path.join(__dirname, 'public', safeUrl);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
            return;
        }

        // Determine content-type
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Read and stream file
        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('500 Internal Server Error');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(content);
        });
    });
}

// Helper: Parse JSON Body
function parseJsonBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (err) {
            callback(err, null);
        }
    });
}

// Server Request Handler
const server = http.createServer((req, res) => {
    // Add CORS headers for developer environment flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-staff-pin');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    const parsedUrl = req.url.split('?')[0];

    // API Route: POST /api/bookings (Submit new appointment)
    if (parsedUrl === '/api/bookings' && req.method === 'POST') {
        parseJsonBody(req, (err, bookingData) => {
            if (err || !bookingData || !bookingData.patientName) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid booking data format' }));
                return;
            }

            // Load bookings
            fs.readFile(DB_FILE, 'utf8', (readErr, data) => {
                if (readErr) {
                    res.statusCode = 500;
                    res.end('Error loading database');
                    return;
                }

                const bookings = JSON.parse(data || '[]');
                bookings.push(bookingData);

                // Save back to file
                fs.writeFile(DB_FILE, JSON.stringify(bookings, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        res.statusCode = 500;
                        res.end('Error saving database');
                        return;
                    }
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, bookingId: bookingData.id }));
                });
            });
        });
        return;
    }

    // API Route: GET /api/bookings (Retrieve records list - Protected)
    if (parsedUrl === '/api/bookings' && req.method === 'GET') {
        const pinHeader = req.headers['x-staff-pin'];

        if (pinHeader !== STAFF_PIN) {
            res.statusCode = 401; // Unauthorized
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Access Denied: Incorrect staff PIN passcode' }));
            return;
        }

        // Return records
        fs.readFile(DB_FILE, 'utf8', (readErr, data) => {
            if (readErr) {
                res.statusCode = 500;
                res.end('Error reading records');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });
        return;
    }

    // API Route: POST /api/clear (Clear records list - Protected)
    if (parsedUrl === '/api/clear' && req.method === 'POST') {
        const pinHeader = req.headers['x-staff-pin'];

        if (pinHeader !== STAFF_PIN) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Access Denied: Incorrect staff PIN passcode' }));
            return;
        }

        // Empty database
        fs.writeFile(DB_FILE, JSON.stringify([]), 'utf8', (writeErr) => {
            if (writeErr) {
                res.statusCode = 500;
                res.end('Error clearing records');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Records cleared successfully' }));
        });
        return;
    }

    // Default: Serve Static Files
    serveStaticFile(req, res);
});

// Boot server
server.listen(PORT, () => {
    console.log(`[AuraDental Backend] Server is running at http://localhost:${PORT}`);
    console.log(`[AuraDental Backend] Database path: ${DB_FILE}`);
    console.log(`[AuraDental Backend] Staff Portal PIN: ${STAFF_PIN}`);
});
