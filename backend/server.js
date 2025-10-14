const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const path = require('path')
const {errorHandler} = require('./middleware/errorMIddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 4000

// Connect to database
connectDB()

const app = express()

// middleware necessary to populate req.body properly in express routes
// allow us to send raw JSON 
// handling incoming request data/ json payloads (data inside)
app.use(express.json())
// handles form submissions
// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({extended: false}))

// Enable CORS for frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

// Root route - Simple Support Desk Interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Support Desk</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #0a0a0a; 
            color: #ffffff; 
            min-height: 100vh;
          }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 2.5em; font-weight: 700; margin-bottom: 10px; }
          .subtitle { color: #888; font-size: 1.1em; }
          
          .tabs { display: flex; gap: 10px; margin-bottom: 30px; }
          .tab { 
            padding: 12px 24px; 
            background: #1a1a1a; 
            border: 1px solid #333; 
            color: #fff; 
            cursor: pointer; 
            border-radius: 8px;
            transition: all 0.3s;
          }
          .tab.active { background: #ff6b35; border-color: #ff6b35; }
          .tab:hover { background: #333; }
          
          .content { background: #1a1a1a; padding: 30px; border-radius: 12px; border: 1px solid #333; }
          .form-group { margin-bottom: 20px; }
          .form-group label { display: block; margin-bottom: 8px; color: #ccc; }
          .form-group input, .form-group select, .form-group textarea { 
            width: 100%; 
            padding: 12px; 
            background: #2a2a2a; 
            border: 1px solid #444; 
            border-radius: 6px; 
            color: #fff; 
            font-size: 14px;
          }
          .form-group textarea { height: 120px; resize: vertical; }
          
          .btn { 
            background: #ff6b35; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 600;
            transition: background 0.3s;
          }
          .btn:hover { background: #e55a2b; }
          
          .tickets { margin-top: 30px; }
          .ticket { 
            background: #2a2a2a; 
            padding: 20px; 
            margin-bottom: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #ff6b35;
          }
          .ticket-header { display: flex; justify-content: between; align-items: center; margin-bottom: 10px; }
          .ticket-title { font-weight: 600; font-size: 1.1em; }
          .ticket-status { 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600;
          }
          .status-open { background: #ff6b35; color: white; }
          .status-closed { background: #666; color: white; }
          .ticket-meta { color: #888; font-size: 14px; margin-top: 8px; }
          
          .hidden { display: none; }
          
          @media (max-width: 768px) {
            .container { padding: 15px; }
            .tabs { flex-direction: column; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Support Desk</div>
            <div class="subtitle">Smart Ticket Management System</div>
            <div style="color: #666; font-size: 0.9em; margin-top: 10px;">Created by Edgar Guerrero</div>
          </div>
          
          <div class="tabs">
            <div class="tab active" onclick="showTab('create')">Create Ticket</div>
            <div class="tab" onclick="showTab('tickets')">My Tickets</div>
            <div class="tab" onclick="showTab('admin')">Admin</div>
          </div>
          
          <div id="create-tab" class="content">
            <h3 style="margin-bottom: 20px;">Create New Ticket</h3>
            <form onsubmit="createTicket(event)">
              <div class="form-group">
                <label>Subject</label>
                <input type="text" id="subject" required placeholder="Brief description of your issue">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea id="description" required placeholder="Please provide detailed information about your issue..."></textarea>
              </div>
              <div class="form-group">
                <label>Priority</label>
                <select id="priority">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select id="category">
                  <option value="">Auto-detect</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Performance">Performance</option>
                  <option value="Authentication">Authentication</option>
                  <option value="General">General</option>
                </select>
              </div>
              <button type="submit" class="btn">Create Ticket</button>
            </form>
          </div>
          
          <div id="tickets-tab" class="content hidden">
            <h3 style="margin-bottom: 20px;">My Tickets</h3>
            <div id="tickets-list">
              <div class="ticket">
                <div class="ticket-header">
                  <div class="ticket-title">Sample Ticket: Login Issues</div>
                  <span class="ticket-status status-open">Open</span>
                </div>
                <div class="ticket-meta">
                  Priority: High • Category: Authentication • Created: Today
                </div>
              </div>
            </div>
          </div>
          
          <div id="admin-tab" class="content hidden">
            <h3 style="margin-bottom: 20px;">Admin Dashboard</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
              <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 2em; font-weight: 700; color: #ff6b35;">12</div>
                <div style="color: #888;">Total Tickets</div>
              </div>
              <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 2em; font-weight: 700; color: #ff6b35;">8</div>
                <div style="color: #888;">Open Tickets</div>
              </div>
              <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 2em; font-weight: 700; color: #ff6b35;">4</div>
                <div style="color: #888;">Closed Tickets</div>
              </div>
            </div>
            <div style="color: #888; text-align: center;">
              Smart Bot Features: Auto-categorization, Priority Detection, Solution Suggestions
            </div>
          </div>
        </div>
        
        <script>
          function showTab(tabName) {
            // Hide all content
            document.querySelectorAll('.content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName + '-tab').classList.remove('hidden');
            event.target.classList.add('active');
          }
          
          function createTicket(event) {
            event.preventDefault();
            const subject = document.getElementById('subject').value;
            const description = document.getElementById('description').value;
            const priority = document.getElementById('priority').value;
            const category = document.getElementById('category').value;
            
            // Create ticket object
            const ticket = {
              subject,
              description,
              priority,
              category: category || 'Auto-detect',
              status: 'open',
              createdAt: new Date().toLocaleString()
            };
            
            // Add to tickets list (in real app, this would be sent to API)
            addTicketToList(ticket);
            
            // Reset form
            document.getElementById('subject').value = '';
            document.getElementById('description').value = '';
            document.getElementById('priority').value = 'medium';
            document.getElementById('category').value = '';
            
            // Show success message
            alert('Ticket created successfully!');
            
            // Switch to tickets tab
            showTab('tickets');
          }
          
          function addTicketToList(ticket) {
            const ticketsList = document.getElementById('tickets-list');
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket';
            ticketElement.innerHTML = \`
              <div class="ticket-header">
                <div class="ticket-title">\${ticket.subject}</div>
                <span class="ticket-status status-open">\${ticket.status}</span>
              </div>
              <div class="ticket-meta">
                Priority: \${ticket.priority} • Category: \${ticket.category} • Created: \${ticket.createdAt}
              </div>
            \`;
            ticketsList.insertBefore(ticketElement, ticketsList.firstChild);
          }
        </script>
      </body>
    </html>
  `)
})

// API Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/notes', require('./routes/noteRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))

// Serve static files from React build (if it exists)
const buildPath = path.join(__dirname, '../frontend/build')
const indexPath = path.join(buildPath, 'index.html')

try {
  // Check if build directory exists
  const fs = require('fs')
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
    
    // Catch all handler: send back React's index.html file for any non-API routes
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' })
      }
      
      // For all other routes, serve the React app
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error serving React app:', err)
          res.status(404).json({ error: 'React app not found' })
        }
      })
    })
  } else {
    console.log('Frontend build not found, serving API only')
    app.get('*', (req, res) => {
      res.status(404).json({ 
        error: 'Frontend not built yet', 
        message: 'Please build the frontend first' 
      })
    })
  }
} catch (error) {
  console.error('Error setting up static files:', error)
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
