# Sequence Diagrams - Web Gym Management System (BCE Pattern)

Dokumen ini berisi kode **PlantUML** untuk Sequence Diagram yang telah disesuaikan dengan pola **Boundary-Control-Entity (BCE)**.
Teks isinya 100% mengikuti langkah-langkah yang ada di **Activity Diagram** yang kita buat sebelumnya.
(Catatan: Perintah `hide footbox` ditambahkan agar logo/aktor di bagian bawah diagram disembunyikan sesuai permintaan).

---

## 1. Sequence Diagram: Register
```plantuml
@startuml
hide footbox
actor Member
boundary "Form Register" as UI
control "Proses Register" as Ctrl
entity "Data Akun" as DB

Member -> UI: Buka halaman Register
UI --> Member: Tampilkan form pendaftaran
Member -> UI: Isi data (Nama, Email, Password) & Klik "Daftar"
UI -> Ctrl: Validasi input data
Ctrl -> DB: Simpan akun baru ke Database
DB --> Ctrl: [Berhasil Disimpan]
Ctrl --> UI: [Akun Tersimpan]
UI --> Member: Tampilkan notifikasi berhasil
UI --> Member: Arahkan ke halaman Login
@enduml
```

## 2. Sequence Diagram: Login
```plantuml
@startuml
hide footbox
actor Aktor
boundary "Form Login" as UI
control "Proses Login" as Ctrl
entity "Data Akun" as DB

Aktor -> UI: Buka halaman Login
UI --> Aktor: Tampilkan form Login
Aktor -> UI: Input Email dan Password & Klik "Masuk"
UI -> Ctrl: Cek kredensial di Database
Ctrl -> DB: Validasi kredensial
DB --> Ctrl: [Kredensial Sesuai]
Ctrl -> DB: Buat Token/Sesi Autentikasi
DB --> Ctrl: [Sesi Dibuat]
Ctrl --> UI: [Login Berhasil]
UI --> Aktor: Arahkan ke Dashboard sesuai Role (Peran)
@enduml
```

## 3. Sequence Diagram: Lihat Katalog Fasilitas & Paket
```plantuml
@startuml
hide footbox
actor Member
boundary "Halaman Katalog" as UI
control "Proses Katalog" as Ctrl
entity "Data Katalog" as DB

Member -> UI: Pilih menu Katalog Fasilitas/Paket
UI -> Ctrl: Ambil data Katalog dari Database
Ctrl -> DB: Ambil data
DB --> Ctrl: [Data Ditemukan]
Ctrl --> UI: [Data Katalog]
UI --> Member: Tampilkan daftar fasilitas dan harga paket
Member -> UI: Lihat detail fasilitas & paket harga
@enduml
```

## 4. Sequence Diagram: Beli Paket Langganan
```plantuml
@startuml
hide footbox
actor Member
boundary "Halaman Pembelian" as UI
control "Proses Pembelian" as Ctrl
entity "Data Transaksi" as DB

Member -> UI: Buka halaman Pembelian Paket
UI --> Member: Tampilkan pilihan Paket Membership/PT
Member -> UI: Pilih paket yang diinginkan & Klik "Beli/Checkout"
UI -> Ctrl: Simpan data Transaksi (Status: Pending)
Ctrl -> DB: Simpan Transaksi
DB --> Ctrl: [Transaksi Disimpan]
Ctrl -> Ctrl: Request token pembayaran ke Midtrans
Ctrl --> UI: [Token Pembayaran]
UI --> Member: Arahkan ke halaman Snap Payment Midtrans
@enduml
```

## 5. Sequence Diagram: Pemrosesan Pembayaran (Midtrans)
```plantuml
@startuml
hide footbox
actor Midtrans
boundary "Endpoint Webhook" as UI
control "Proses Webhook" as Ctrl
entity "Data Transaksi" as DB
entity "Data Akun" as DB2

Midtrans -> UI: Kirim pemberitahuan status pembayaran
UI -> Ctrl: Cek keabsahan pemberitahuan
Ctrl -> Ctrl: Cek status pembayaran
Ctrl -> DB: Ubah status transaksi menjadi "Berhasil"
DB --> Ctrl: [Status Diubah]
Ctrl -> DB2: Aktifkan paket langganan Member
DB2 --> Ctrl: [Paket Aktif]
Ctrl --> UI: [Proses Selesai]
UI --> Midtrans: Kirim respon konfirmasi ke Midtrans
@enduml
```

## 6. Sequence Diagram: Booking Jadwal PT
```plantuml
@startuml
hide footbox
actor Member
boundary "Halaman Booking" as UI
control "Proses Booking" as Ctrl
entity "Data Booking" as DB

Member -> UI: Pilih menu Booking Personal Trainer
UI --> Member: Tampilkan daftar jadwal Trainer yang kosong
Member -> UI: Pilih Trainer, Tanggal, dan Jam & Klik "Booking"
UI -> Ctrl: Cek kuota/paket PT Member aktif
Ctrl -> DB: Simpan data Booking ke Database (Status: Scheduled)
DB --> Ctrl: [Booking Tersimpan]
Ctrl --> UI: [Booking Berhasil]
UI --> Member: Tampilkan pesan booking sukses
@enduml
```

## 7. Sequence Diagram: Pencatatan BMI Log
```plantuml
@startuml
hide footbox
actor Member
boundary "Form BMI" as UI
control "Proses BMI" as Ctrl
entity "Data BMI" as DB

Member -> UI: Buka menu Pencatatan BMI
UI --> Member: Tampilkan form input
Member -> UI: Input Tinggi Badan & Berat Badan & Klik "Simpan"
UI -> Ctrl: Kalkulasi nilai BMI (Kurus / Ideal / Gemuk)
Ctrl -> DB: Simpan ke Database sebagai Log
DB --> Ctrl: [Log Disimpan]
Ctrl --> UI: [Hasil Kalkulasi]
UI --> Member: Tampilkan hasil nilai BMI ke layar
UI --> Member: Tampilkan Grafik Perkembangan BMI terbaru
Member -> UI: Melihat hasil skor BMI mereka
@enduml
```

## 8. Sequence Diagram: Interaksi Live Chat
```plantuml
@startuml
hide footbox
actor Pengguna
boundary "Halaman Chat" as UI
control "Proses Chat" as Ctrl
entity "Data Pesan" as DB

Pengguna -> UI: Buka menu Live Chat
UI -> Ctrl: Ambil riwayat chat dari Database
Ctrl -> DB: Ambil riwayat chat
DB --> Ctrl: [Riwayat Chat]
Ctrl --> UI: [Data Chat]
UI --> Pengguna: Tampilkan antarmuka obrolan
Pengguna -> UI: Ketik pesan teks & Klik "Kirim"
UI -> Ctrl: Kirim pesan
Ctrl -> DB: Simpan pesan ke Database
DB --> Ctrl: [Pesan Disimpan]
Ctrl -> Ctrl: Mendorong (Push) pesan ke antarmuka penerima
@enduml
```

## 9. Sequence Diagram: Lihat Laporan Statistik Dashboard
```plantuml
@startuml
hide footbox
actor Owner_Admin
boundary "Halaman Dashboard" as UI
control "Proses Statistik" as Ctrl
entity "Data Laporan" as DB

Owner_Admin -> UI: Buka halaman Dashboard Utama
UI -> Ctrl: Agregasi data pendapatan, member aktif, dan sesi PT
Ctrl -> DB: Query agregasi
DB --> Ctrl: [Data Agregasi]
Ctrl --> UI: [Data Laporan]
UI --> Owner_Admin: Tampilkan dalam format angka & grafik visual
Owner_Admin -> UI: Pilih filter rentang waktu (Bulan/Tahun)
UI -> Ctrl: Request dengan filter
Ctrl -> DB: Query filter
DB --> Ctrl: [Data Filter]
Ctrl --> UI: [Data Baru]
UI --> Owner_Admin: Refresh data sesuai filter
@enduml
```

## 10. Sequence Diagram: Kelola Master Data
```plantuml
@startuml
hide footbox
actor Admin
boundary "Form Master Data" as UI
control "Proses Master Data" as Ctrl
entity "Data Fasilitas" as DB

Admin -> UI: Pilih menu Master Data (Paket/Fasilitas)
UI -> Ctrl: Request tabel data
Ctrl -> DB: Query data
DB --> Ctrl: [Data Fasilitas]
Ctrl --> UI: [Tabel Master Data]
UI --> Admin: Tampilkan tabel Master Data
Admin -> UI: Pilih aksi & Input data lalu klik "Simpan"
UI -> Ctrl: Validasi dan simpan ke Database
Ctrl -> DB: Simpan data
DB --> Ctrl: [Data Tersimpan]
Ctrl --> UI: [Simpan Sukses]
UI --> Admin: Refresh tabel data & Tampilkan pesan sukses
@enduml
```

## 11. Sequence Diagram: Kelola Transaksi & Member
```plantuml
@startuml
hide footbox
actor Admin
boundary "Halaman Transaksi" as UI
control "Proses Transaksi" as Ctrl
entity "Data Transaksi" as DB

Admin -> UI: Pilih menu Transaksi/Member
UI -> Ctrl: Request daftar transaksi/member
Ctrl -> DB: Query transaksi
DB --> Ctrl: [Data Transaksi]
Ctrl --> UI: [Daftar Transaksi]
UI --> Admin: Tampilkan daftar transaksi/member
Admin -> UI: Cari/filter data & Klik "Ubah Status Manual"
UI --> Admin: Tampilkan opsi pilihan status
Admin -> UI: Pilih status baru dan "Simpan"
UI -> Ctrl: Perbarui status di Database
Ctrl -> DB: Update status
DB --> Ctrl: [Status Terupdate]
Ctrl --> UI: [Update Sukses]
UI --> Admin: Tampilkan pesan sukses
@enduml
```

## 12. Sequence Diagram: Catat Pengunjung Walk-In
```plantuml
@startuml
hide footbox
actor Admin
boundary "Form Walk-In" as UI
control "Proses Walk-In" as Ctrl
entity "Data Kunjungan" as DB

Admin -> UI: Pilih menu Catat Kunjungan (Walk-In)
UI --> Admin: Tampilkan form pengunjung tamu
Admin -> UI: Input nama, tujuan, waktu kedatangan & Klik "Catat"
UI -> Ctrl: Simpan log kehadiran ke Database
Ctrl -> DB: Simpan log
DB --> Ctrl: [Log Tersimpan]
Ctrl --> UI: [Simpan Sukses]
UI --> Admin: Tampilkan notifikasi berhasil
@enduml
```

## 13. Sequence Diagram: Update Status Sesi Latihan
```plantuml
@startuml
hide footbox
actor Trainer
boundary "Halaman Jadwal" as UI
control "Proses Jadwal" as Ctrl
entity "Data Booking" as DB

Trainer -> UI: Buka menu Jadwal Sesi Hari Ini
UI -> Ctrl: Request daftar jadwal
Ctrl -> DB: Query jadwal booking
DB --> Ctrl: [Data Jadwal]
Ctrl --> UI: [Daftar Jadwal]
UI --> Trainer: Tampilkan daftar jadwal booking
Trainer -> UI: Pilih sesi & Klik "Selesai (Complete)"
UI -> Ctrl: Ubah status Booking menjadi "Selesai"
Ctrl -> DB: Update status
DB --> Ctrl: [Status Diubah]
Ctrl -> DB: Kurangi sisa kuota PT pada akun Member
DB --> Ctrl: [Kuota Dikurangi]
Ctrl --> UI: [Update Sukses]
UI --> Trainer: Tampilkan notifikasi berhasil
@enduml
```
