# Dokumen Software Requirements Specification (SRS)
**Proyek: Web Gym Management System**

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen Software Requirements Specification (SRS) ini bertujuan untuk mendefinisikan dan menjelaskan spesifikasi kebutuhan perangkat lunak secara komprehensif untuk proyek **Web Gym Management System**. Dokumen ini menjadi acuan utama bagi pengembang, penguji, dan pemangku kepentingan (stakeholder) dalam memahami fitur, fungsionalitas, dan batasan sistem yang dibangun.

### 1.2 Ruang Lingkup (Scope)
Sistem ini adalah aplikasi berbasis web *Client-Server* yang dirancang untuk mengotomatisasi operasional fasilitas kebugaran (gym). Sistem mencakup fitur manajemen anggota (member), pemesanan jadwal instruktur (*Personal Trainer*), pembelian paket langganan secara *online* via *payment gateway*, pencatatan kebugaran fisik (BMI), komunikasi interaktif (*Live Chat*), serta panel administrasi lengkap untuk staf dan pemilik gym.

### 1.3 Definisi dan Singkatan
*   **SRS**: Software Requirements Specification.
*   **SPA**: Single Page Application.
*   **API**: Application Programming Interface.
*   **PT**: Personal Trainer (Pelatih Pribadi).
*   **BMI**: Body Mass Index (Indeks Massa Tubuh).
*   **CRUD**: Create, Read, Update, Delete (operasi dasar basis data).
*   **JWT**: JSON Web Token (standar autentikasi token).

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk
Sistem dibangun menggunakan arsitektur terpisah (*decoupled architecture*):
1.  **Frontend (Client-Side)**: Dibangun menggunakan **React.js** (berbasis Vite) untuk menghasilkan antarmuka pengguna yang reaktif (SPA) dan responsif.
2.  **Backend (Server-Side)**: Dibangun menggunakan kerangka kerja **Laravel** yang beroperasi murni sebagai penyedia REST API untuk melayani permintaan data dari *frontend*.

### 2.2 Fungsi Utama Produk
Fungsi utama dari perangkat lunak ini meliputi:
*   Manajemen akun dan hak akses pengguna.
*   Penyajian katalog fasilitas, pelatih, dan paket harga secara publik.
*   Pemrosesan pembayaran digital paket langganan secara otomatis.
*   Manajemen penjadwalan sesi latihan antara member dan pelatih.
*   Pemantauan statistik pendapatan dan operasional harian.

### 2.3 Karakteristik Pengguna
Terdapat 3 (tiga) peran pengguna utama dalam sistem:
1.  **Admin (Manajemen/Resepsionis)**: Memiliki hak akses penuh untuk mengelola master data (harga, fasilitas, pegawai), memantau transaksi, serta mencatat pengunjung langsung (*walk-in*).
2.  **Trainer (Pelatih)**: Pengguna yang memantau jadwal sesi pelatihan (booking) yang ditugaskan kepada mereka dan memperbarui status pelaksanaannya.
3.  **Member (Pelanggan)**: Pengguna terdaftar yang melakukan pembelian langganan, melacak perkembangan tubuh (BMI), memesan jadwal pelatih, dan berinteraksi dengan layanan pelanggan (*Live Chat*).

### 2.4 Lingkungan Operasi
*   Sistem berjalan di atas peramban web modern (Google Chrome, Mozilla Firefox, Safari, Edge).
*   *Frontend* dan *Backend* dapat di-hosting di server berbasis Linux/Windows dengan dukungan PHP 8+ dan Node.js.
*   Basis data menggunakan sistem RDBMS (PostgreSQL / MySQL).

---

## 3. Fitur Sistem (Kebutuhan Fungsional)

### 3.1 Modul Autentikasi dan Profil
*   **SRS-F-01**: Sistem memungkinkan pengunjung mendaftarkan akun baru sebagai Member.
*   **SRS-F-02**: Sistem memfasilitasi proses otorisasi masuk (Login) dengan kredensial yang valid dan menerbitkan Token akses.
*   **SRS-F-03**: Sistem menyediakan fitur pemulihan kata sandi (*Forgot & Reset Password*) berbasis email.
*   **SRS-F-04**: Sistem memungkinkan pengguna yang telah *login* untuk memperbarui informasi profil mereka.

### 3.2 Modul Publik (Landing Page)
*   **SRS-F-05**: Sistem menampilkan daftar fasilitas dan peralatan gym yang tersedia kepada publik.
*   **SRS-F-06**: Sistem menampilkan profil *Personal Trainer* beserta keahliannya.
*   **SRS-F-07**: Sistem menampilkan daftar harga paket keanggotaan (*Membership Plans*) dan paket pelatihan (*PT Packages*).

### 3.3 Modul Member
*   **SRS-F-08**: Sistem menyediakan *Dashboard* ringkasan yang menampilkan status langganan aktif dan jadwal sesi terdekat.
*   **SRS-F-09**: Sistem memungkinkan member melakukan transaksi pembelian/perpanjangan paket *Membership* atau *PT Packages*.
*   **SRS-F-10**: Sistem memungkinkan member memesan (*booking*) jadwal pelatihan untuk pelatih tertentu pada tanggal dan jam yang tersedia.
*   **SRS-F-11**: Sistem memungkinkan member mencatat, menyimpan, dan melihat riwayat perubahan BMI (*Body Mass Index*) mereka.
*   **SRS-F-12**: Sistem menyediakan fitur *Live Chat* agar member dapat mengirim dan menerima pesan secara real-time dengan Admin.

### 3.4 Modul Admin
*   **SRS-F-13**: Sistem menyajikan statistik jumlah member aktif, total pendapatan, dan grafik kunjungan di halaman *Dashboard Admin*.
*   **SRS-F-14**: Sistem memfasilitasi Admin untuk melakukan operasi CRUD (Tambah, Tampil, Ubah, Hapus) pada master data *Membership Plans* dan *PT Packages*.
*   **SRS-F-15**: Sistem memfasilitasi Admin untuk melakukan operasi CRUD pada daftar Fasilitas Gym (*Gym Features*).
*   **SRS-F-16**: Sistem memfasilitasi Admin untuk melakukan operasi CRUD pada data kepegawaian instruktur (*Trainers*).
*   **SRS-F-17**: Sistem memungkinkan Admin melihat daftar seluruh Member dan rincian transaksi langganan mereka (*Subscriptions*).
*   **SRS-F-18**: Sistem memungkinkan Admin mengelola secara manual (terima/tolak/batalkan) status langganan dan jadwal *booking*.
*   **SRS-F-19**: Sistem memungkinkan Admin mencatat pengunjung tamu yang datang ke lokasi secara langsung (*Walk-In Logs*).
*   **SRS-F-20**: Sistem menyediakan panel pusat pesan untuk membalas seluruh *Live Chat* yang masuk dari pelanggan.

### 3.5 Modul Trainer
*   **SRS-F-21**: Sistem menyediakan halaman *Dashboard* jadwal yang khusus menampilkan pesanan (*bookings*) yang ditugaskan kepada Trainer yang bersangkutan.
*   **SRS-F-22**: Sistem memungkinkan Trainer memperbarui status sesi latihan menjadi *Selesai* (*Completed*) apabila pelatihan telah dilaksanakan.

---

## 4. Kebutuhan Antarmuka Eksternal

### 4.1 Antarmuka Pengguna (User Interface)
*   **UI-01**: Desain antarmuka menggunakan pendekatan *Mobile-First* yang dapat menyesuaikan diri secara mulus di berbagai ukuran layar (layar penuh, tablet, ponsel pintar).
*   **UI-02**: Menggunakan *framework* CSS modern untuk memastikan konsistensi tipografi, warna, dan komponen visual antarmuka di seluruh halaman.

### 4.2 Antarmuka Perangkat Lunak (Software Interfaces)
*   **SI-01 - Midtrans API**: Sistem backend wajib terintegrasi dengan Application Programming Interface (API) dari Midtrans untuk mengarahkan pengguna ke halaman pembayaran (*Snap Page*).
*   **SI-02 - Webhook Midtrans**: Sistem memiliki *endpoint webhook* (`/api/midtrans/webhook`) yang mampu menerima dan memproses notifikasi (*HTTP POST request*) dari server Midtrans untuk memperbarui status transaksi secara otomatis di latar belakang.

---

## 5. Kebutuhan Non-Fungsional

### 5.1 Kinerja (Performance)
*   **NFR-01**: Waktu muat awal (*initial load time*) halaman *frontend* (SPA) tidak boleh melebihi 3 detik pada koneksi internet standar (4G/LTE).
*   **NFR-02**: Endpoint REST API *backend* harus mampu memproses dan merespons permintaan baca (*GET request*) dalam waktu kurang dari 500 milidetik.

### 5.2 Keamanan (Security)
*   **NFR-03**: Seluruh kata sandi pengguna harus disimpan ke dalam basis data dalam bentuk teks teracak (*hashed*) menggunakan algoritma enkripsi standar industri (Bcrypt).
*   **NFR-04**: Seluruh komunikasi antara *frontend* dan *backend* yang melibatkan pertukaran data pribadi harus diamankan menggunakan protokol lapisan transfer aman (HTTPS/SSL).
*   **NFR-05**: Rute API dilindungi oleh perangkat autentikasi Token (Sanctum/JWT) di mana *Header Request* wajib menyertakan token *Bearer* yang sah sebelum diizinkan mengakses data sensitif.

### 5.3 Ketersediaan dan Keandalan (Availability & Reliability)
*   **NFR-06**: Aplikasi web dirancang untuk dapat diakses kapan saja tanpa batasan waktu layanan operasional (24/7).
*   **NFR-07**: Kesalahan validasi *form* di sisi klien (frontend) maupun server (backend) harus dikembalikan dengan pesan peringatan yang ramah (*User Friendly Error Messages*) agar sistem tidak macet (*crash*).
