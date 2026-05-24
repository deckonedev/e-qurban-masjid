# 🐐 e-Qurban (Aplikasi Manajemen Tiket & Kupon Qurban)

**e-Qurban** adalah aplikasi web modern dan responsif yang dirancang khusus untuk mempermudah panitia Idul Adha dalam mengelola data penerima daging qurban, mencetak kupon, serta memantau status pengambilan secara *real-time*.

Aplikasi ini mengusung desain *clean*, responsif, dan *mobile-friendly*, dengan fitur cetak tingkat lanjut yang dioptimalkan untuk ukuran kertas A4 secara sempurna.

---

## 🆕 Pembaruan Terbaru (Update)

- **Penyempurnaan Layout Cetak Kupon**:
  - Nomor antrean sekarang ditempatkan secara vertikal di bagian samping (stub) dengan 3 digit (contoh: 001) dan ukuran *font* ekstra besar agar sangat mudah terbaca.
  - Judul kupon kini dibuat *center* (rata tengah) dengan jarak spasi proporsional agar tidak menabrak baris detail pengambilan.
  - Mengganti ikon bawaan dengan logo/watermark kustom (`kambing.png`) di latar belakang (kanan) ber-opacity rendah yang memberikan kesan eksklusif dan estetik.
  - Penempatan area tanda tangan panitia ditarik sedikit ke atas, dan teks catatan tambahan dikunci secara statis pada bagian paling bawah halaman cetak kupon.
- **Auto-Shrink Cerdas pada Cetakan**: Memperbaiki dan memastikan bahwa teks `Nama`, `Waktu`, dan `Lokasi` yang kebetulan berukuran sangat panjang akan otomatis mengecil (auto-shrink) sehingga pas di dalam kupon tanpa terpotong sama sekali saat diprint.
- **Ekspor Data ke Excel (.xls)**: Menambahkan opsi baru pada menu Cetak untuk mengekspor data penerima (Nomor, Nama, Status, Waktu) langsung ke dalam format tabel Excel. Hasil ekspor secara cerdas menyesuaikan dengan pencarian dan filter yang sedang aktif.
- **Jam Digital Minimalis**: Menambahkan fitur jam dan tanggal digital *real-time* yang terintegrasi manis dan rapi di bagian *Header* utama.
- **Notifikasi Pintar (Toast)**: Menggantikan *alert* bawaan browser yang kaku dengan notifikasi modern dan interaktif menggunakan `react-hot-toast` untuk setiap aksi berhasil/gagal (simpan pengaturan, tambah tiket, ubah status).
- **Perbaikan Sinkronisasi Dashboard**: Memperbaiki bug di mana tab Dashboard salah menghitung statistik ketika tab Tiket sedang difilter. Pengambilan data sekarang selalu ditarik ulang secara penuh setiap berganti tab, dan proses filter/pencarian sepenuhnya dipindahkan ke memori *frontend* (Browser) sehingga perhitungan jauh lebih presisi dan cepat.

---

## ✨ Fitur Utama
- **🎫 Manajemen Kupon**: Tambah data penerima dengan mudah berkat fitur *quick select* (tombol pilihan cepat untuk waktu & kalender otomatis).
- **✅ Status Pengambilan Interaktif**: Ubah status tiket hanya dengan sekali klik (Ikon Silang Merah untuk 'Belum Diambil', Ceklis Hijau untuk 'Selesai').
- **⚙️ Konfigurasi Panitia & Identitas**: Ubah nama Masjid, lokasi pengambilan, serta nama Sekretaris & Ketua Panitia langsung dari aplikasi.
- **✍️ Dukungan Tanda Tangan Digital**: Anda dapat mengunggah gambar Tanda Tangan dan Stempel panitia yang akan otomatis dicetak pada kupon.
- **🖨️ Mesin Cetak Super Cerdas (Print Engine)**: 
  - Format kertas A4 (Memuat 6 kupon presisi per halaman).
  - *Pagination* otomatis (Mencetak ratusan tiket secara berurutan tanpa terpotong).
  - Algoritma *Auto-Shrink Text* (Nama penerima atau panitia yang terlalu panjang akan otomatis mengecil agar pas di dalam kupon).
  - Latar belakang hijau solid yang **dijamin** tidak akan hilang meskipun pengaturan *Background Graphics* di printer dimatikan.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js + Vite
- **Styling**: Vanilla CSS (dengan CSS Variables untuk tema) + Lucide React (Ikon)
- **Backend**: Node.js + Express.js
- **Database / Penyimpanan**: File JSON lokal (`data.json` untuk tiket & `settings.json` untuk konfigurasi), membuat aplikasi ini sangat ringan dan portabel tanpa perlu setup *database engine* (seperti MySQL/PostgreSQL).

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

Pastikan Anda sudah menginstal **Node.js** di perangkat Anda.

### 1. Menjalankan Backend
Masuk ke folder `backend`, instal *dependencies*, dan jalankan server:
```bash
cd backend
npm install
npm start
```
*(Backend akan berjalan di port `http://localhost:5000`)*

### 2. Menjalankan Frontend
Buka terminal baru, masuk ke folder `frontend`, instal *dependencies*, dan jalankan Vite Server:
```bash
cd frontend
npm install
npm run dev
```
*(Aplikasi web akan terbuka di `http://localhost:5173`)*

Atau, Anda cukup menggunakan *script batch* (jika menggunakan Windows):
Jalankan file `run_qurban.bat` yang ada di direktori utama.

---

## 📸 Tampilan Kupon Cetak

Sistem cetak aplikasi ini dirancang sedemikian rupa agar:
- Kupon dipagari oleh batas potong (garis putus-putus).
- Data identitas (Nama, Waktu, Nomor) tampil sangat jelas (Hitam Pekat).
- Latar belakang blok identitas dibuat berwarna hijau secara *hard-coded* menggunakan injeksi *image SVG base-64*, mengatasi bug dari *driver* printer (*Economy Mode*) yang sering menghapus warna latar.
- Tanda tangan diposisikan sesuai pakem surat resmi (Ketua di kiri, Sekretaris di kanan).

---

## 🤝 Kontribusi
Aplikasi ini dikembangkan untuk tujuan mempermudah kelancaran pelaksanaan penyembelihan dan pendistribusian daging Qurban di masjid-masjid dan instansi. Jika Anda memiliki saran atau ingin menambahkan fitur, silakan buat *Pull Request* atau sampaikan melalui *Issues*!

**Semoga Bermanfaat & Berkah!** 🕌
