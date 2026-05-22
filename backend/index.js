const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');
const settingsFile = path.join(__dirname, 'settings.json');

// Helper to read data
async function readData() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const defaultData = {
                tickets: []
            };
            await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        throw error;
    }
}

async function writeData(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

async function readSettings() {
    try {
        const data = await fs.readFile(settingsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const defaultSettings = {
                ketua_name: '',
                sekretaris_name: '',
                stempel_image: '',
                ttd_ketua: '',
                ttd_sekretaris: '',
                ticket_title: 'Kupon Daging Qurban',
                ticket_subtitle: '1447 H / 2026 M',
                ticket_footer: '*Harap dibawa saat pengambilan',
                masjid_name: "Masjid Mu'alimmin",
                lokasi: "Halaman Masjid Mu'alimmin",
                waktu_pengambilan: "Rabu, 27-5-2026 (08:00 - 10:00)",
                font_scale: 100
            };
            await fs.writeFile(settingsFile, JSON.stringify(defaultSettings, null, 2));
            return defaultSettings;
        }
        throw error;
    }
}

async function writeSettings(data) {
    await fs.writeFile(settingsFile, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await readSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        const settings = req.body;
        await writeSettings(settings);
        res.json({ message: 'Settings updated', settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all tickets
app.get('/api/tickets', async (req, res) => {
    try {
        const data = await readData();
        let tickets = data.tickets;
        
        const { status, search } = req.query;
        
        if (status && status !== 'Semua') {
            tickets = tickets.filter(t => t.status === status);
        }
        
        if (search) {
            const searchLower = search.toLowerCase();
            tickets = tickets.filter(t => 
                (t.penerima && t.penerima.toLowerCase().includes(searchLower)) ||
                (t.hari_tgl && t.hari_tgl.toLowerCase().includes(searchLower)) ||
                (t.tempat && t.tempat.toLowerCase().includes(searchLower))
            );
        }
        
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single ticket
app.get('/api/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const ticket = data.tickets.find(t => t.id === parseInt(req.params.id));
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create ticket
app.post('/api/tickets', async (req, res) => {
    try {
        const data = await readData();
        const { hari_tgl, pukul, tempat, penerima, status } = req.body;
        
        const newId = data.tickets.length > 0 ? Math.max(...data.tickets.map(t => t.id)) + 1 : 1;
        
        const newTicket = {
            id: newId,
            hari_tgl,
            pukul,
            tempat,
            penerima,
            status: status || 'Belum Diambil'
        };
        
        data.tickets.push(newTicket);
        await writeData(data);
        
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update ticket
app.put('/api/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const ticketIndex = data.tickets.findIndex(t => t.id === parseInt(req.params.id));
        
        if (ticketIndex === -1) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        const { hari_tgl, pukul, tempat, penerima, status } = req.body;
        
        data.tickets[ticketIndex] = {
            ...data.tickets[ticketIndex],
            hari_tgl: hari_tgl !== undefined ? hari_tgl : data.tickets[ticketIndex].hari_tgl,
            pukul: pukul !== undefined ? pukul : data.tickets[ticketIndex].pukul,
            tempat: tempat !== undefined ? tempat : data.tickets[ticketIndex].tempat,
            penerima: penerima !== undefined ? penerima : data.tickets[ticketIndex].penerima,
            status: status !== undefined ? status : data.tickets[ticketIndex].status
        };
        
        await writeData(data);
        res.json({ message: 'Ticket updated', ticket: data.tickets[ticketIndex] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete ticket
app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const ticketIndex = data.tickets.findIndex(t => t.id === parseInt(req.params.id));
        
        if (ticketIndex === -1) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        data.tickets.splice(ticketIndex, 1);
        await writeData(data);
        
        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
