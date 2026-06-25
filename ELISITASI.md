# Dokumen Elisitasi Kebutuhan Sistem
**Proyek: Web Gym Management System (React & Laravel)**

---

## 1. Elisitasi Tahap I
Elisitasi tahap I merupakan daftar seluruh kebutuhan sistem (baik yang tercakup maupun di luar cakupan saat ini) yang diperoleh dari hasil observasi dan wawancara dengan stakeholder terkait (Pemilik Gym, Admin, Trainer, dan Member).

| No | Kebutuhan Sistem | Tipe Kebutuhan |
| :--- | :--- | :--- |
| 1 | Sistem menampilkan halaman publik dengan informasi fasilitas gym, pelatih, dan paket membership. | Fungsional |
| 2 | Memungkinkan pengunjung melakukan pendaftaran akun (Register) dan Login. | Fungsional |
| 3 | Memungkinkan pengguna memulihkan kata sandi yang lupa (Forgot & Reset Password). | Fungsional |
| 4 | Menampilkan Dashboard Member untuk melihat ringkasan langganan aktif, BMI, dan jadwal pelatih. | Fungsional |
| 5 | Memungkinkan member membeli paket langganan (Membership/PT) secara online. | Fungsional |
| 6 | Sistem memproses pembayaran otomatis terintegrasi dengan Payment Gateway (Midtrans). | Fungsional |
| 7 | Memungkinkan member mencatat dan melacak indeks massa tubuh (BMI Log) mereka. | Fungsional |
| 8 | Memungkinkan member melakukan pemesanan (Booking) sesi dengan Personal Trainer (PT) atau membatalkannya. | Fungsional |
| 9 | Memungkinkan member melakukan Live Chat dengan admin untuk bertanya seputar gym. | Fungsional |
| 10 | Memungkinkan member memperbarui data profil akun mereka. | Fungsional |
| 11 | Menampilkan Dashboard Admin yang memuat statistik jumlah member, langganan, dan data pengunjung. | Fungsional |
| 12 | Memungkinkan admin mengelola (CRUD) daftar harga dan paket Membership (Membership Plans). | Fungsional |
| 13 | Memungkinkan admin mengelola (CRUD) data fasilitas dan peralatan (Gym Features). | Fungsional |
| 14 | Memungkinkan admin mengelola (CRUD) data dan harga Personal Trainer Packages (PT Packages). | Fungsional |
| 15 | Memungkinkan admin mengelola (CRUD) data kepegawaian instruktur (Trainers). | Fungsional |
| 16 | Memungkinkan admin melihat daftar seluruh member dan riwayat langganan (Subscriptions) mereka. | Fungsional |
| 17 | Memungkinkan admin mengelola status langganan dan status booking member secara manual. | Fungsional |
| 18 | Memungkinkan admin mencatat data pengunjung langsung harian (Walk-In Logs). | Fungsional |
| 19 | Memungkinkan admin membalas pesan Live Chat yang masuk dari para member. | Fungsional |
| 20 | Menampilkan Dashboard Trainer untuk melihat jadwal sesi (Bookings) yang ditugaskan kepada mereka. | Fungsional |
| 21 | Memungkinkan Trainer memperbarui status sesi latihan (misal: Selesai). | Fungsional |
| 22 | Memungkinkan presensi kehadiran member di lokasi menggunakan scan Barcode / QR Code. | Fungsional |
| 23 | Memungkinkan sistem mengirim Push Notifications (Notifikasi aplikasi) ke smartphone member. | Fungsional |
| 24 | Menggunakan arsitektur Client-Server terpisah (Frontend React.js dan Backend REST API Laravel). | Non-Fungsional |
| 25 | Tampilan antarmuka yang responsif (Mobile-Friendly) agar nyaman dibuka dari HP maupun PC. | Non-Fungsional |
| 26 | Memiliki sistem autentikasi aman berbasis Token API (Sanctum/JWT) untuk setiap transaksi. | Non-Fungsional |
| 27 | Memiliki kontrol hak akses (Role-Based Access Control) ketat antara Admin, Trainer, dan Member. | Non-Fungsional |

---

## 2. Elisitasi Tahap II (Metode MDI)
Metode MDI digunakan untuk mengklasifikasikan kebutuhan pada Elisitasi Tahap I ke dalam tiga kategori:
*   M (Mandatory): Kebutuhan wajib yang harus ada pada sistem.
*   D (Desirable): Kebutuhan penunjang yang diinginkan (nilai tambah).
*   I (Inessential): Kebutuhan di luar lingkup utama sistem saat ini atau ditunda ke pengembangan versi berikutnya.

| No | Kebutuhan Sistem | M | D | I |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Sistem menampilkan halaman publik dengan informasi fasilitas gym, pelatih, dan paket membership. | X | | |
| 2 | Memungkinkan pengunjung melakukan pendaftaran akun (Register) dan Login. | X | | |
| 3 | Memungkinkan pengguna memulihkan kata sandi yang lupa (Forgot & Reset Password). | | X | |
| 4 | Menampilkan Dashboard Member untuk melihat ringkasan langganan aktif, BMI, dan jadwal pelatih. | X | | |
| 5 | Memungkinkan member membeli paket langganan (Membership/PT) secara online. | X | | |
| 6 | Sistem memproses pembayaran otomatis terintegrasi dengan Payment Gateway (Midtrans). | X | | |
| 7 | Memungkinkan member mencatat dan melacak indeks massa tubuh (BMI Log) mereka. | X | | |
| 8 | Memungkinkan member melakukan pemesanan (Booking) sesi dengan Personal Trainer (PT) atau membatalkannya. | X | | |
| 9 | Memungkinkan member melakukan Live Chat dengan admin untuk bertanya seputar gym. | | X | |
| 10 | Memungkinkan member memperbarui data profil akun mereka. | X | | |
| 11 | Menampilkan Dashboard Admin yang memuat statistik jumlah member, langganan, dan data pengunjung. | X | | |
| 12 | Memungkinkan admin mengelola (CRUD) daftar harga dan paket Membership (Membership Plans). | X | | |
| 13 | Memungkinkan admin mengelola (CRUD) data fasilitas dan peralatan (Gym Features). | X | | |
| 14 | Memungkinkan admin mengelola (CRUD) data dan harga Personal Trainer Packages (PT Packages). | X | | |
| 15 | Memungkinkan admin mengelola (CRUD) data kepegawaian instruktur (Trainers). | X | | |
| 16 | Memungkinkan admin melihat daftar seluruh member dan riwayat langganan (Subscriptions) mereka. | X | | |
| 17 | Memungkinkan admin mengelola status langganan dan status booking member secara manual. | X | | |
| 18 | Memungkinkan admin mencatat data pengunjung langsung harian (Walk-In Logs). | X | | |
| 19 | Memungkinkan admin membalas pesan Live Chat yang masuk dari para member. | | X | |
| 20 | Menampilkan Dashboard Trainer untuk melihat jadwal sesi (Bookings) yang ditugaskan kepada mereka. | X | | |
| 21 | Memungkinkan Trainer memperbarui status sesi latihan (misal: Selesai). | X | | |
| 22 | Memungkinkan presensi kehadiran member di lokasi menggunakan scan Barcode / QR Code. | | | X |
| 23 | Memungkinkan sistem mengirim Push Notifications (Notifikasi aplikasi) ke smartphone member. | | | X |
| 24 | Menggunakan arsitektur Client-Server terpisah (Frontend React.js dan Backend REST API Laravel). | X | | |
| 25 | Tampilan antarmuka yang responsif (Mobile-Friendly) agar nyaman dibuka dari HP maupun PC. | X | | |
| 26 | Memiliki sistem autentikasi aman berbasis Token API (Sanctum/JWT) untuk setiap transaksi. | X | | |
| 27 | Memiliki kontrol hak akses (Role-Based Access Control) ketat antara Admin, Trainer, dan Member. | X | | |

---

## 3. Elisitasi Tahap III (Metode TOE)
Kebutuhan berkategori Mandatory (M) dan Desirable (D) dari Tahap II dianalisis menggunakan metode TOE yang terdiri dari:
*   T (Technical): Tingkat kesulitan teknis implementasi (L=Low/Mudah, M=Middle/Sedang, H=High/Sulit).
*   O (Operational): Kemudahan pengoperasian bagi pengguna (L=Low/Mudah, M=Middle/Sedang, H=High/Sulit).
*   E (Economic): Estimasi biaya, waktu, dan infrastruktur (L=Low/Murah/Cepat, M=Middle/Sedang, H=High/Mahal).

*(Catatan: Kebutuhan nomor 22 dan 23 dibuang karena berstatus Inessential (I) pada tahap sebelumnya).*

| No | Kebutuhan Sistem | T | O | E | Keputusan |
| :---: | :--- | :---: | :---: | :---: | :---: |
| 1 | Sistem menampilkan halaman publik dengan informasi fasilitas gym, pelatih, dan paket membership. | L | L | L | Lolos |
| 2 | Memungkinkan pengunjung melakukan pendaftaran akun (Register) dan Login. | L | L | L | Lolos |
| 3 | Memungkinkan pengguna memulihkan kata sandi yang lupa (Forgot & Reset Password). | M | L | L | Lolos |
| 4 | Menampilkan Dashboard Member untuk melihat ringkasan langganan aktif, BMI, dan jadwal pelatih. | L | L | L | Lolos |
| 5 | Memungkinkan member membeli paket langganan (Membership/PT) secara online. | M | L | L | Lolos |
| 6 | Sistem memproses pembayaran otomatis terintegrasi dengan Payment Gateway (Midtrans). | M | L | M | Lolos |
| 7 | Memungkinkan member mencatat dan melacak indeks massa tubuh (BMI Log) mereka. | L | L | L | Lolos |
| 8 | Memungkinkan member melakukan pemesanan (Booking) sesi dengan Personal Trainer (PT) atau membatalkannya. | M | M | L | Lolos |
| 9 | Memungkinkan member melakukan Live Chat dengan admin untuk bertanya seputar gym. | M | L | M | Lolos |
| 10 | Memungkinkan member memperbarui data profil akun mereka. | L | L | L | Lolos |
| 11 | Menampilkan Dashboard Admin yang memuat statistik jumlah member, langganan, dan data pengunjung. | M | L | L | Lolos |
| 12 | Memungkinkan admin mengelola (CRUD) daftar harga dan paket Membership (Membership Plans). | L | L | L | Lolos |
| 13 | Memungkinkan admin mengelola (CRUD) data fasilitas dan peralatan (Gym Features). | L | L | L | Lolos |
| 14 | Memungkinkan admin mengelola (CRUD) data dan harga Personal Trainer Packages (PT Packages). | L | L | L | Lolos |
| 15 | Memungkinkan admin mengelola (CRUD) data kepegawaian instruktur (Trainers). | L | L | L | Lolos |
| 16 | Memungkinkan admin melihat daftar seluruh member dan riwayat langganan (Subscriptions) mereka. | L | L | L | Lolos |
| 17 | Memungkinkan admin mengelola status langganan dan status booking member secara manual. | L | L | L | Lolos |
| 18 | Memungkinkan admin mencatat data pengunjung langsung harian (Walk-In Logs). | L | L | L | Lolos |
| 19 | Memungkinkan admin membalas pesan Live Chat yang masuk dari para member. | M | L | M | Lolos |
| 20 | Menampilkan Dashboard Trainer untuk melihat jadwal sesi (Bookings) yang ditugaskan kepada mereka. | L | L | L | Lolos |
| 21 | Memungkinkan Trainer memperbarui status sesi latihan (misal: Selesai). | L | L | L | Lolos |
| 24 | Menggunakan arsitektur Client-Server terpisah (Frontend React.js dan Backend REST API Laravel). | M | L | L | Lolos |
| 25 | Tampilan antarmuka yang responsif (Mobile-Friendly) agar nyaman dibuka dari HP maupun PC. | M | L | L | Lolos |
| 26 | Memiliki sistem autentikasi aman berbasis Token API (Sanctum/JWT) untuk setiap transaksi. | M | L | L | Lolos |
| 27 | Memiliki kontrol hak akses (Role-Based Access Control) ketat antara Admin, Trainer, dan Member. | M | L | L | Lolos |

---

## 4. Final Draft Elisitasi
Merupakan hasil akhir yang memuat seluruh kebutuhan sistem yang disetujui untuk diimplementasikan sepenuhnya pada proyek Web Gym.

### 4.1 Kebutuhan Fungsional Final

| No | Deskripsi Kebutuhan Fungsional |
| :---: | :--- |
| 1 | Sistem menampilkan halaman publik dengan informasi fasilitas gym, pelatih, dan paket membership. |
| 2 | Memungkinkan pengunjung melakukan pendaftaran akun (Register) dan Login. |
| 3 | Memungkinkan pengguna memulihkan kata sandi yang lupa (Forgot & Reset Password). |
| 4 | Menampilkan Dashboard Member untuk melihat ringkasan langganan aktif, BMI, dan jadwal pelatih. |
| 5 | Memungkinkan member membeli paket langganan (Membership/PT) secara online. |
| 6 | Sistem memproses pembayaran otomatis terintegrasi dengan Payment Gateway (Midtrans). |
| 7 | Memungkinkan member mencatat dan melacak indeks massa tubuh (BMI Log) mereka. |
| 8 | Memungkinkan member melakukan pemesanan (Booking) sesi dengan Personal Trainer (PT) atau membatalkannya. |
| 9 | Memungkinkan member melakukan Live Chat dengan admin untuk bertanya seputar gym. |
| 10 | Memungkinkan member memperbarui data profil akun mereka. |
| 11 | Menampilkan Dashboard Admin yang memuat statistik jumlah member, langganan, dan data pengunjung. |
| 12 | Memungkinkan admin mengelola (CRUD) daftar harga dan paket Membership (Membership Plans). |
| 13 | Memungkinkan admin mengelola (CRUD) data fasilitas dan peralatan (Gym Features). |
| 14 | Memungkinkan admin mengelola (CRUD) data dan harga Personal Trainer Packages (PT Packages). |
| 15 | Memungkinkan admin mengelola (CRUD) data kepegawaian instruktur (Trainers). |
| 16 | Memungkinkan admin melihat daftar seluruh member dan riwayat langganan (Subscriptions) mereka. |
| 17 | Memungkinkan admin mengelola status langganan dan status booking member secara manual. |
| 18 | Memungkinkan admin mencatat data pengunjung langsung harian (Walk-In Logs). |
| 19 | Memungkinkan admin membalas pesan Live Chat yang masuk dari para member. |
| 20 | Menampilkan Dashboard Trainer untuk melihat jadwal sesi (Bookings) yang ditugaskan kepada mereka. |
| 21 | Memungkinkan Trainer memperbarui status sesi latihan (misal: Selesai). |

### 4.2 Kebutuhan Non-Fungsional Final

| No | Deskripsi Kebutuhan Non-Fungsional |
| :---: | :--- |
| 1 | Menggunakan arsitektur Client-Server terpisah (Frontend React.js dan Backend REST API Laravel). |
| 2 | Tampilan antarmuka yang responsif (Mobile-Friendly) agar nyaman dibuka dari HP maupun PC. |
| 3 | Memiliki sistem autentikasi aman berbasis Token API (Sanctum/JWT) untuk setiap transaksi. |
| 4 | Memiliki kontrol hak akses (Role-Based Access Control) ketat antara Admin, Trainer, dan Member. |
