const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Setup file upload with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'issue-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Data persistence
const DATA_FILE = path.join(__dirname, 'data.json');

let users = [];
let reports = [];
let contractors = [];
let budget = {};

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            return data;
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return { users: [], reports: [], contractors: [], budget: {} };
}

function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ users, reports, contractors, budget }, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

const initialData = loadData();
users = initialData.users || [];
reports = initialData.reports || [];
contractors = initialData.contractors || [];
budget = initialData.budget || {};
console.log(`Loaded ${users.length} users and ${reports.length} reports from disk.`);

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Admin Middleware
const authenticateAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = users.find(u => u.id === req.user.id);
    next();
};

// --- API Endpoints ---

// Root Route
app.get('/', (req, res) => {
    res.send('Civic Trust API is running! 🚀<br>Access data at <a href="/api/reports">/api/reports</a>');
});

// --- Upload Route ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// --- Auth Routes ---

app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
        role: 'citizen',
        score: 0
    };
    users.push(newUser);
    saveData();

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: 'citizen' }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: 'citizen', score: newUser.score } });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Current users in memory:', users.map(u => u.email));
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        score: user.score || 0
    };

    // Add admin-specific fields if user is admin
    if (user.role === 'admin') {
        userResponse.adminLevel = user.adminLevel;
        userResponse.assignedArea = user.assignedArea;
        userResponse.assignedZone = user.assignedZone;
    }

    res.json({ token, user: userResponse });
});

// --- Protected Routes ---

// Get all reports
app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// Create a new report
app.post('/api/reports', authenticateToken, (req, res) => {
    const newReport = {
        id: Date.now(),
        ...req.body,
        votes: 0,
        validationCount: 0,
        realVotes: 0,
        fakeVotes: 0,
        author: req.user.name
    };
    reports.unshift(newReport);
    saveData();
    res.status(201).json(newReport);
});

// Vote on a report
app.post('/api/reports/:id/vote', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    const report = reports.find(r => r.id == id);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    report.validationCount = (report.validationCount || 0) + 1;
    if (type === 'real') {
        report.realVotes = (report.realVotes || 0) + 1;
    } else {
        report.fakeVotes = (report.fakeVotes || 0) + 1;
    }

    saveData();
    res.json(report);
});

// Verify a fix
app.post('/api/reports/:id/verify', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { isFixed } = req.body;

    const report = reports.find(r => r.id == id);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    if (isFixed) {
        report.validationCount = (report.validationCount || 0) + 1;
        if (report.validationCount >= 3) {
            report.status = 'Resolved';
        }
    } else {
        report.validationCount = (report.validationCount || 0) + 1;
    }

    saveData();
    res.json(report);
});

// Get User Stats
app.get('/api/user', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);

    res.json({ score: user.score || 0, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Update User Score
app.post('/api/user/score', authenticateToken, (req, res) => {
    const { points } = req.body;

    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);

    user.score = (user.score || 0) + points;
    saveData();

    res.json({ score: user.score });
});

// --- Admin API Endpoints ---

// Dashboard Stats - WITH HIERARCHICAL FILTERING
app.get('/api/admin/stats', authenticateToken, authenticateAdmin, (req, res) => {
    // Filter reports based on admin level
    let filteredReports = reports;

    // L1 Admin (Ward level) - filter by assigned area
    if (req.admin.adminLevel === 'L1' && req.admin.assignedArea) {
        filteredReports = reports.filter(r =>
            r.area === req.admin.assignedArea || r.ward === req.admin.assignedArea
        );
    }
    // L2 Admin (Zone level) - filter by assigned zone  
    else if (req.admin.adminLevel === 'L2' && req.admin.assignedZone) {
        filteredReports = reports.filter(r => r.zone === req.admin.assignedZone);
    }
    // L3 Admin - sees all reports (no filter)

    const totalReports = filteredReports.length;
    const resolvedReports = filteredReports.filter(r => r.status === 'Resolved').length;
    const pendingReports = filteredReports.filter(r => r.status === 'In Progress' || r.status === 'Pending Validation').length;
    const citizens = users.filter(u => u.role === 'citizen').length;

    const activeContractors = (contractors || []).filter(c => c.status === 'Active').length;

    const slaCompliant = filteredReports.filter(r => {
        if (r.status === 'Resolved' && r.slaDeadline && r.resolvedAt) {
            return new Date(r.resolvedAt) <= new Date(r.slaDeadline);
        }
        return false;
    }).length;
    const slaRate = totalReports > 0 ? ((slaCompliant / totalReports) * 100).toFixed(1) : 0;

    res.json({
        totalComplaints: totalReports,
        resolvedIssues: resolvedReports,
        resolutionRate: totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0,
        pendingIssues: pendingReports,
        slaCompliance: parseFloat(slaRate),
        activeContractors: activeContractors,
        budget: budget || { allocated: 35000000, utilized: 24000000, percentage: 68.6 },
        citizens: citizens,
        // Include admin info to display on frontend
        adminInfo: {
            level: req.admin.adminLevel,
            name: req.admin.name,
            assignedArea: req.admin.assignedArea || 'N/A',
            assignedZone: req.admin.assignedZone || 'All Zones'
        }
    });
});

// Get all contractors
app.get('/api/admin/contractors', authenticateToken, authenticateAdmin, (req, res) => {
    res.json(contractors || []);
});

// Get all users (admin view)
app.get('/api/admin/users', authenticateToken, authenticateAdmin, (req, res) => {
    const citizenUsers = users.filter(u => u.role === 'citizen').map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        score: u.score || 0,
        reportsSubmitted: reports.filter(r => r.author === u.name).length,
        joinedAt: u.createdAt || 'N/A'
    }));
    res.json(citizenUsers);
});

// Update report status (admin only)
app.put('/api/admin/reports/:id/status', authenticateToken, authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const report = reports.find(r => r.id == id);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    if (status === 'Resolved') {
        report.resolvedAt = new Date().toISOString();
    }

    saveData();
    res.json(report);
});

// Assign report to contractor
app.put('/api/admin/reports/:id/assign', authenticateToken, authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { contractorId } = req.body;

    const report = reports.find(r => r.id == id);
    if (!report) {
        return res.status(404).json({ message: 'Report not found' });
    }

    report.assignedContractor = contractorId;
    report.assignedAt = new Date().toISOString();

    saveData();
    res.json(report);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Also accessible on your network!');
});
