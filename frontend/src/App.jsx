import React, { useState, useEffect, useRef } from 'react';
import { Search, Scan, Plus, Check, Ticket, LayoutDashboard, Settings as SettingsIcon, User, Printer, FileText, MapPin, Clock, Building, Users, CheckCircle, XCircle, FileSpreadsheet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './index.css';

const API_URL = 'http://localhost:5000/api';

const GoatIcon = ({ size = 24, color = "currentColor", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <path d="M20,8.5A2.5,2.5 0 0,1 17.5,11C16.42,11 15.5,10.31 15.16,9.36C14.72,9.75 14.14,10 13.5,10C12.94,10 12.42,9.81 12,9.5C11.58,9.81 11.07,10 10.5,10C9.86,10 9.28,9.75 8.84,9.36C8.5,10.31 7.58,11 6.5,11A2.5,2.5 0 0,1 4,8.5C4,7.26 4.91,6.23 6.1,6.04C6.04,5.87 6,5.69 6,5.5A1.5,1.5 0 0,1 7.5,4C7.7,4 7.89,4.04 8.06,4.11C8.23,3.47 8.81,3 9.5,3C9.75,3 10,3.07 10.18,3.17C10.5,2.5 11.19,2 12,2C12.81,2 13.5,2.5 13.82,3.17C14,3.07 14.25,3 14.5,3C15.19,3 15.77,3.47 15.94,4.11C16.11,4.04 16.3,4 16.5,4A1.5,1.5 0 0,1 18,5.5C18,5.69 17.96,5.87 17.9,6.04C19.09,6.23 20,7.26 20,8.5M10,12A1,1 0 0,0 9,13A1,1 0 0,0 10,14A1,1 0 0,0 11,13A1,1 0 0,0 10,12M14,12A1,1 0 0,0 13,13A1,1 0 0,0 14,14A1,1 0 0,0 15,13A1,1 0 0,0 14,12M20.23,10.66C19.59,11.47 18.61,12 17.5,12C17.05,12 16.62,11.9 16.21,11.73C16.2,14.28 15.83,17.36 14.45,18.95C13.93,19.54 13.3,19.86 12.5,19.96V18H11.5V19.96C10.7,19.86 10.07,19.55 9.55,18.95C8.16,17.35 7.79,14.29 7.78,11.74C7.38,11.9 6.95,12 6.5,12C5.39,12 4.41,11.47 3.77,10.66C2.88,11.55 2,12 2,12C2,12 3,14 5,14C5.36,14 5.64,13.96 5.88,13.91C6.22,17.73 7.58,22 12,22C16.42,22 17.78,17.73 18.12,13.91C18.36,13.96 18.64,14 19,14C21,14 22,12 22,12C22,12 21.12,11.55 20.23,10.66Z" />
  </svg>
);

const AutoShrinkText = ({ text, className, align = 'center' }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;
    
    textEl.style.fontSize = '100%';
    let fontSize = 100;
    
    // Auto shrink loop
    while (textEl.scrollWidth > container.clientWidth && fontSize > 50) {
      fontSize -= 2;
      textEl.style.fontSize = `${fontSize}%`;
    }
  }, [text]);

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: align }}>
      <span ref={textRef} className={className} style={{ whiteSpace: 'nowrap' }}>
        {text}
      </span>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tiket', 'panitia', 'pengaturan'
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [settings, setSettings] = useState({
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
    waktu_pengambilan: "Rabu, 27-5-2026 (08:00 - 10:00)"
  });

  const [formData, setFormData] = useState({
    hari_tgl: '',
    pukul: '',
    tempat: "Masjid Mu'alimmin",
    penerima: ''
  });

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`);
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Gagal memuat data tiket');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings || settings)
      });
      toast.success('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan!');
    }
  };

  const handleToggleTicketStatus = async (id) => {
    try {
      const ticket = tickets.find(t => t.id === id);
      const newStatus = ticket.status === 'Belum Diambil' ? 'Sudah Diambil' : 'Belum Diambil';
      await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticket, status: newStatus })
      });
      fetchTickets();
      toast.success(`Status tiket diubah menjadi ${newStatus}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Gagal mengubah status tiket!');
    }
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'Belum Diambil' })
      });
      setShowAddModal(false);
      setFormData({ hari_tgl: '', pukul: '', tempat: settings.masjid_name, penerima: '' });
      fetchTickets();
      toast.success('Tiket berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error('Gagal menambahkan tiket!');
    }
  };

  const handlePrint = (type) => {
    setShowPrintMenu(false);
    
    if (type === 'xls') {
      let table = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Data Qurban</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">';
      table += '<thead><tr><th style="background-color:#0d9453;color:white;text-align:center">No</th><th style="background-color:#0d9453;color:white">Nama Penerima</th><th style="background-color:#0d9453;color:white">Status Pengambilan</th><th style="background-color:#0d9453;color:white">Waktu Pengambilan</th></tr></thead><tbody>';
      
      filteredTickets.forEach((t, i) => {
        table += `<tr><td style="text-align:center">${i+1}</td><td>${t.penerima}</td><td>${t.status}</td><td>${t.hari_tgl}, ${t.pukul || '-'}</td></tr>`;
      });
      table += '</tbody></table></body></html>';
      
      const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Data_Qurban_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Berhasil mengekspor ke Excel!');
      return;
    }

    if (type === 'pdf') {
      toast("Pilih 'Save as PDF' pada pilihan Destination/Printer", {
        icon: 'ℹ️',
        duration: 5000,
      });
    }
    setTimeout(() => window.print(), 300);
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const statTotal = tickets.length;
  const statDiambil = tickets.filter(t => t.status === 'Sudah Diambil').length;
  const statBelum = tickets.filter(t => t.status === 'Belum Diambil').length;

  const filteredTickets = tickets.filter(t => {
    if (filter !== 'Semua' && t.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (t.penerima && t.penerima.toLowerCase().includes(s)) ||
        (t.hari_tgl && t.hari_tgl.toLowerCase().includes(s)) ||
        (t.tempat && t.tempat.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        {/* Top Header Sticky */}
        <div className="top-header">
          <header className="header" style={{ justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoatIcon size={28} color="white" />
              <h1 className="title" style={{ margin: 0, fontSize: '24px' }}>e-Qurban</h1>
            </div>
            {activeTab === 'tiket' && (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowPrintMenu(!showPrintMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 600, color: 'white' }}
                >
                  <Printer size={18} /> Cetak
                </button>
                {showPrintMenu && (
                  <div style={{ position: 'absolute', top: '45px', right: '0', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', zIndex: 100, width: '150px', overflow: 'hidden', color: 'var(--text-primary)' }}>
                    <div onClick={() => handlePrint('kertas')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
                      <Printer size={16} /> Kertas
                    </div>
                    <div onClick={() => handlePrint('pdf')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
                      <FileText size={16} /> .pdf (Kupon)
                    </div>
                    <div onClick={() => handlePrint('xls')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <FileSpreadsheet size={16} /> .xls (Data)
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="subtitle" style={{ margin: 0 }}>
              {activeTab === 'dashboard' ? 'Ringkasan Informasi' : activeTab === 'tiket' ? 'Kelola tiket qurban' : activeTab === 'panitia' ? 'Data Panitia & TTD' : 'Pengaturan Kupon'}
            </p>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 500, display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Clock size={12} />
              <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}, {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')}</span>
            </div>
          </div>
        </div>

        {/* Sticky Controls for Tiket Tab */}
        {activeTab === 'tiket' && (
          <div style={{ padding: '20px 20px 10px 20px', backgroundColor: 'var(--bg-color)', zIndex: 30, flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="search-container" style={{ marginBottom: '16px' }}>
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Cari nama penerima atau tiket..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Scan className="scan-icon" size={18} />
            </div>

            <div className="filters" style={{ marginBottom: 0 }}>
              {['Semua', 'Belum Diambil', 'Sudah Diambil'].map(f => (
                <button 
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="main-content" style={activeTab === 'tiket' ? { paddingTop: '12px' } : {}}>
          {activeTab === 'dashboard' && (
            <div className="ticket-list">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                  <Users size={32} color="var(--primary-color)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{statTotal}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Penerima</div>
                </div>
                <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                  <CheckCircle size={32} color="#059669" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{statDiambil}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sudah Diambil</div>
                </div>
                <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px', gridColumn: '1 / span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <XCircle size={32} color="#d97706" />
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: '800' }}>{statBelum}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Belum Diambil</div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: '12px', marginBottom: '12px', fontSize: '16px' }}>Informasi Pengambilan</h3>
              
              <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Building size={20} color="var(--primary-color)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nama Masjid/Instansi</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{settings.masjid_name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={20} color="var(--primary-color)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lokasi Pengambilan</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{settings.lokasi}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={20} color="var(--primary-color)" style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Waktu Pengambilan</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{settings.waktu_pengambilan}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tiket' && (
            <>
              <div className="ticket-list">
                {filteredTickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    className={`ticket-card ${ticket.status === 'Sudah Diambil' ? 'taken' : ''}`}
                    onClick={() => handleToggleTicketStatus(ticket.id)}
                  >
                    <div className="ticket-icon">
                      <Ticket size={24} color={ticket.status === 'Sudah Diambil' ? '#94a3b8' : '#0d9453'} />
                    </div>
                    <div className="ticket-info">
                      <h3 className="ticket-title">{ticket.penerima || `Tiket #${ticket.id}`}</h3>
                      <p className="ticket-detail">Tgl: {ticket.hari_tgl}</p>
                      <p className="ticket-detail">Pukul: {ticket.pukul || '-'}</p>
                      <p className="ticket-detail">Tempat: {ticket.tempat}</p>
                      <p className={`ticket-status ${ticket.status === 'Belum Diambil' ? 'belum' : ''}`}>
                        {ticket.status}
                      </p>
                    </div>
                    <button 
                      className="action-btn" 
                      title={ticket.status === 'Sudah Diambil' ? 'Batal Menerima' : 'Tandai Diambil'}
                      style={
                        ticket.status === 'Belum Diambil' 
                          ? { backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#ef4444', boxShadow: 'none' } 
                          : { backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#22c55e', boxShadow: 'none' }
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTicketStatus(ticket.id);
                      }}
                    >
                      {ticket.status === 'Belum Diambil' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                    </button>
                  </div>
                ))}
                {filteredTickets.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
                    Tidak ada tiket ditemukan.
                  </div>
                )}
              </div>

            </>
          )}

          {activeTab === 'panitia' && (
            <div className="ticket-list">
              <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <h3 style={{ marginBottom: '16px' }}>Data Kepanitiaan</h3>
                
                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Nama Ketua Panitia</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.ketua_name}
                    onChange={e => setSettings({...settings, ketua_name: e.target.value})}
                    placeholder="Nama Ketua"
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Tanda Tangan Ketua (Gambar)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ttd_ketua')} />
                  {settings.ttd_ketua && <img src={settings.ttd_ketua} alt="TTD Ketua" style={{ height: '40px', marginTop: '10px' }} />}
                </div>

                <div className="form-group" style={{ width: '100%', marginTop: '16px' }}>
                  <label className="form-label">Nama Sekretaris</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.sekretaris_name}
                    onChange={e => setSettings({...settings, sekretaris_name: e.target.value})}
                    placeholder="Nama Sekretaris"
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Tanda Tangan Sekretaris (Gambar)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ttd_sekretaris')} />
                  {settings.ttd_sekretaris && <img src={settings.ttd_sekretaris} alt="TTD Sekretaris" style={{ height: '40px', marginTop: '10px' }} />}
                </div>

                <div className="form-group" style={{ width: '100%', marginTop: '16px' }}>
                  <label className="form-label">Stempel Panitia / Masjid (Gambar)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'stempel_image')} />
                  {settings.stempel_image && <img src={settings.stempel_image} alt="Stempel" style={{ height: '60px', marginTop: '10px' }} />}
                </div>

                <button 
                  onClick={() => saveSettings()} 
                  style={{ width: '100%', padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  <Check size={18} /> Simpan Panitia
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pengaturan' && (
            <div className="ticket-list">
              <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <h3 style={{ marginBottom: '16px' }}>Edit Teks Kupon & Info</h3>
                
                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Judul Kupon</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.ticket_title}
                    onChange={e => setSettings({...settings, ticket_title: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Sub Judul (Tahun/Info Tambahan)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.ticket_subtitle}
                    onChange={e => setSettings({...settings, ticket_subtitle: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Catatan Kaki (Footer)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.ticket_footer}
                    onChange={e => setSettings({...settings, ticket_footer: e.target.value})}
                  />
                </div>

                <hr style={{ width: '100%', margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Nama Masjid/Instansi</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.masjid_name}
                    onChange={e => setSettings({...settings, masjid_name: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Lokasi Pengambilan</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.lokasi}
                    onChange={e => setSettings({...settings, lokasi: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ width: '100%' }}>
                  <label className="form-label">Jam & Tanggal Pengambilan (Utk Dashboard)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.waktu_pengambilan}
                    onChange={e => setSettings({...settings, waktu_pengambilan: e.target.value})}
                  />
                </div>

                <button 
                  onClick={() => saveSettings()} 
                  style={{ width: '100%', padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                >
                  <Check size={18} /> Simpan Pengaturan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard className="nav-icon" />
          </div>
          <div className={`nav-item ${activeTab === 'tiket' ? 'active' : ''}`} onClick={() => setActiveTab('tiket')}>
            <Ticket className="nav-icon" />
          </div>

          <div className="center-btn-wrapper">
            <div className="center-btn" onClick={() => setShowAddModal(true)} title="Tambah Tiket">
              <Plus size={32} strokeWidth={2.5} />
            </div>
          </div>

          <div className={`nav-item ${activeTab === 'panitia' ? 'active' : ''}`} onClick={() => setActiveTab('panitia')}>
            <User className="nav-icon" />
          </div>
          <div className={`nav-item ${activeTab === 'pengaturan' ? 'active' : ''}`} onClick={() => setActiveTab('pengaturan')}>
            <SettingsIcon className="nav-icon" />
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Tambah Tiket Qurban</h2>
              <form onSubmit={handleAddTicket}>
                <div className="form-group">
                  <label className="form-label">Nama Penerima</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formData.penerima}
                    onChange={e => setFormData({...formData, penerima: e.target.value})}
                    placeholder="Misal: Budi Santoso"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Hari/Tgl</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('hidden-date-picker');
                        if (el && el.showPicker) {
                          el.showPicker();
                        } else if (el) {
                          el.click();
                        }
                      }}
                      style={{ color: 'var(--primary-color)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, fontWeight: 600 }}
                    >
                      📅 Pilih Kalender
                    </button>
                    <input 
                      id="hidden-date-picker"
                      type="date" 
                      style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', border: 'none', padding: 0, zIndex: -1 }} 
                      onChange={(e) => {
                        const dateStr = e.target.value;
                        if (dateStr) {
                          const date = new Date(dateStr);
                          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                          const dayName = days[date.getDay()];
                          setFormData({...formData, hari_tgl: `${dayName}, ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`});
                        }
                      }} 
                    />
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formData.hari_tgl}
                    onChange={e => setFormData({...formData, hari_tgl: e.target.value})}
                    placeholder="Misal: Rabu, 27-5-2026"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pukul</label>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'].map(waktu => (
                      <div 
                        key={waktu}
                        onClick={() => setFormData({...formData, pukul: waktu})}
                        style={{ padding: '6px 10px', borderRadius: '12px', border: `1px solid ${formData.pukul === waktu ? 'var(--primary-color)' : 'var(--border-color)'}`, backgroundColor: formData.pukul === waktu ? 'var(--primary-color)' : 'transparent', color: formData.pukul === waktu ? 'white' : 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                      >
                        {waktu}
                      </div>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.pukul}
                    onChange={e => setFormData({...formData, pukul: e.target.value})}
                    placeholder="Atau ketik manual"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tempat</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formData.tempat}
                    onChange={e => setFormData({...formData, tempat: e.target.value})}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Print Area (Hidden on screen, visible on print) */}
      <div className="print-area">
        {tickets.map(ticket => (
          <div className="coupon" key={`print-${ticket.id}`}>
            <div className="coupon-main">
              {/* Header */}
              <div className="coupon-header">
                <h2>{settings.ticket_title}</h2>
                <div className="header-divider"></div>
                <div className="masjid-name">{settings.masjid_name}</div>
              </div>
              
              {/* White Box for Details */}
              <div className="coupon-white-box">
                <div className="coupon-row">
                  <span className="coupon-label">Nama</span>
                  <div className="coupon-value" style={{ display: 'flex', overflow: 'hidden' }}>
                    <span style={{ marginRight: '4px' }}>:</span>
                    <AutoShrinkText align="flex-start" text={ticket.penerima || '-'} />
                  </div>
                </div>
                <div className="coupon-row">
                  <span className="coupon-label">Waktu</span>
                  <span className="coupon-value">: {ticket.hari_tgl}, {ticket.pukul || '-'}</span>
                </div>
                <div className="coupon-row">
                  <span className="coupon-label">Nomor</span>
                  <span className="coupon-value">: {String(ticket.id).padStart(3, '0')}</span>
                </div>
              </div>

              {/* Note below white box */}
              <div className="coupon-note">
                {settings.ticket_footer}
              </div>

              {/* Footer layout: Location left, Panitia right */}
              <div className="coupon-footer-bar">
                <div className="location-strip">
                  <div className="loc-title">
                    <MapPin size={12} style={{ marginRight: '4px' }} />
                    Lokasi:
                  </div>
                  <span>{settings.lokasi}</span>
                </div>
                <div className="panitia-strip">
                  <div className="panitia-signatures">
                    <div className="coupon-ttd">
                      <div className="ttd-title">Ketua Panitia</div>
                      <div className="ttd-space">
                        {settings.stempel_image && <img src={settings.stempel_image} className="stempel-img" />}
                        {settings.ttd_ketua && <img src={settings.ttd_ketua} className="ttd-img" />}
                      </div>
                      <AutoShrinkText className="ttd-name" text={settings.ketua_name || '(...............)'} />
                    </div>
                    <div className="coupon-ttd">
                      <div className="ttd-title">Sekretaris</div>
                      <div className="ttd-space">
                        {settings.ttd_sekretaris && <img src={settings.ttd_sekretaris} className="ttd-img" />}
                      </div>
                      <AutoShrinkText className="ttd-name" text={settings.sekretaris_name || '(...............)'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
