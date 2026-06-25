# Activity Diagrams - Web Gym Management System

Dokumen ini berisi kode **PlantUML** untuk Activity Diagram dari setiap Use Case pada Sistem Informasi Manajemen Web Gym. Silakan salin masing-masing blok kode ke editor PlantUML atau Visual Paradigm Anda.

---

## 1. Activity Diagram: Register
```plantuml
@startuml
|Member|
start
:Buka halaman Register;
|Sistem Web Gym|
:Tampilkan form pendaftaran;
|Member|
:Isi data (Nama, Email, Password);
:Klik tombol "Daftar";
|Sistem Web Gym|
:Validasi input data;
if (Data Valid?) then (Tidak)
  :Tampilkan pesan error validasi;
  |Member|
  :Perbaiki input data;
  detach
else (Ya)
  |Sistem Web Gym|
  :Simpan akun baru ke Database;
  :Tampilkan notifikasi berhasil;
  :Arahkan ke halaman Login;
endif
stop
@enduml
```

## 2. Activity Diagram: Login
```plantuml
@startuml
|Aktor (Member/Admin/Trainer/Owner)|
start
:Buka halaman Login;
|Sistem Web Gym|
:Tampilkan form Login;
|Aktor (Member/Admin/Trainer/Owner)|
:Input Email dan Password;
:Klik tombol "Masuk";
|Sistem Web Gym|
:Cek kredensial di Database;
if (Kredensial Sesuai?) then (Tidak)
  :Tampilkan pesan "Email/Password salah";
  detach
else (Ya)
  :Buat Token/Sesi Autentikasi;
  :Arahkan ke Dashboard sesuai Role (Peran);
endif
stop
@enduml
```

## 3. Activity Diagram: Lihat Katalog Fasilitas & Paket
```plantuml
@startuml
|Member|
start
:Pilih menu Katalog Fasilitas/Paket;
|Sistem Web Gym|
:Ambil data Katalog dari Database;
:Tampilkan daftar fasilitas dan harga paket;
|Member|
:Lihat detail fasilitas & paket harga;
stop
@enduml
```

## 4. Activity Diagram: Beli Paket Langganan
```plantuml
@startuml
|Member|
start
:Buka halaman Pembelian Paket;
|Sistem Web Gym|
:Tampilkan pilihan Paket Membership/PT;
|Member|
:Pilih paket yang diinginkan;
:Klik tombol "Beli/Checkout";
|Sistem Web Gym|
:Simpan data Transaksi (Status: Pending);
:Request token pembayaran ke Midtrans;
:Arahkan ke halaman Snap Payment Midtrans;
stop
@enduml
```

## 5. Activity Diagram: Pemrosesan Pembayaran (Midtrans)
```plantuml
@startuml
|Midtrans|
start
:Proses pembayaran dari Member selesai;
:Kirim pemberitahuan status pembayaran;
|Sistem Web Gym|
:Terima pemberitahuan;
:Cek keabsahan pemberitahuan;
if (Pemberitahuan Sah?) then (Tidak)
  :Tolak pemberitahuan;
  stop
else (Ya)
  :Cek status pembayaran;
  if (Pembayaran Lunas?) then (Ya)
    :Ubah status transaksi menjadi "Berhasil";
    :Aktifkan paket langganan Member;
  else (Tidak / Batal)
    :Ubah status transaksi menjadi "Gagal";
  endif
  :Kirim respon konfirmasi ke Midtrans;
endif
stop
@enduml
```

## 6. Activity Diagram: Booking Jadwal PT
```plantuml
@startuml
|Member|
start
:Pilih menu Booking Personal Trainer;
|Sistem Web Gym|
:Tampilkan daftar jadwal Trainer yang kosong;
|Member|
:Pilih Trainer, Tanggal, dan Jam;
:Klik tombol "Booking";
|Sistem Web Gym|
:Cek kuota/paket PT Member aktif;
if (Punya Kuota PT?) then (Tidak)
  :Tampilkan pesan error (Paket habis);
  detach
else (Ya)
  :Simpan data Booking ke Database (Status: Scheduled);
  :Tampilkan pesan booking sukses;
endif
stop
@enduml
```

## 7. Activity Diagram: Pencatatan BMI Log
```plantuml
@startuml
|Member|
start
:Buka menu Pencatatan BMI;
|Sistem Web Gym|
:Tampilkan form input;
|Member|
:Input Tinggi Badan & Berat Badan;
:Klik "Simpan";
|Sistem Web Gym|
:Kalkulasi nilai BMI (Kurus / Ideal / Gemuk);
:Simpan ke Database sebagai Log;
:Tampilkan hasil nilai BMI ke layar;
:Tampilkan Grafik Perkembangan BMI terbaru;
|Member|
:Melihat hasil skor BMI mereka;
stop
@enduml
```

## 8. Activity Diagram: Interaksi Live Chat
```plantuml
@startuml
|Member / Admin|
start
:Buka menu Live Chat;
|Sistem Web Gym|
:Ambil riwayat chat dari Database;
:Tampilkan antarmuka obrolan;
|Member / Admin|
:Ketik pesan teks;
:Klik tombol "Kirim";
|Sistem Web Gym|
:Simpan pesan ke Database;
:Mendorong (Push) pesan ke antarmuka penerima;
stop
@enduml
```

## 9. Activity Diagram: Lihat Laporan Statistik Dashboard
```plantuml
@startuml
|Owner / Admin|
start
:Buka halaman Dashboard Utama;
|Sistem Web Gym|
:Agregasi data pendapatan, member aktif, dan sesi PT;
:Tampilkan dalam format angka & grafik visual;
|Owner / Admin|
:Pilih filter rentang waktu (Bulan/Tahun);
|Sistem Web Gym|
:Refresh data sesuai filter;
stop
@enduml
```

## 10. Activity Diagram: Kelola Master Data
```plantuml
@startuml
|Admin|
start
:Pilih menu Master Data (Paket/Fasilitas);
|Sistem Web Gym|
:Tampilkan tabel Master Data;
|Admin|
:Pilih aksi (Tambah/Ubah/Hapus);
if (Aksi?) then (Tambah/Ubah)
  |Sistem Web Gym|
  :Tampilkan form data;
  |Admin|
  :Input data dan klik "Simpan";
  |Sistem Web Gym|
  :Validasi dan simpan ke Database;
else (Hapus)
  |Admin|
  :Klik "Hapus";
  |Sistem Web Gym|
  :Hapus data dari Database;
endif
|Sistem Web Gym|
:Refresh tabel data;
:Tampilkan pesan sukses;
stop
@enduml
```

## 11. Activity Diagram: Kelola Transaksi & Member
```plantuml
@startuml
|Admin|
start
:Pilih menu Transaksi/Member;
|Sistem Web Gym|
:Tampilkan daftar transaksi/member;
|Admin|
:Cari atau filter data;
:Klik opsi "Ubah Status Manual";
|Sistem Web Gym|
:Tampilkan opsi pilihan status;
|Admin|
:Pilih status baru dan "Simpan";
|Sistem Web Gym|
:Perbarui status di Database;
:Tampilkan pesan sukses;
stop
@enduml
```

## 12. Activity Diagram: Catat Pengunjung Walk-In
```plantuml
@startuml
|Admin|
start
:Pilih menu Catat Kunjungan (Walk-In);
|Sistem Web Gym|
:Tampilkan form pengunjung tamu;
|Admin|
:Input nama, tujuan, dan waktu kedatangan;
:Klik tombol "Catat";
|Sistem Web Gym|
:Simpan log kehadiran ke Database;
:Tampilkan notifikasi berhasil;
stop
@enduml
```

## 13. Activity Diagram: Update Status Sesi Latihan
```plantuml
@startuml
|Trainer|
start
:Buka menu Jadwal Sesi Hari Ini;
|Sistem Web Gym|
:Tampilkan daftar jadwal booking;
|Trainer|
:Pilih sesi yang telah selesai dilaksanakan;
:Klik tombol "Selesai (Complete)";
|Sistem Web Gym|
:Ubah status Booking menjadi "Selesai";
:Kurangi sisa kuota PT pada akun Member;
:Tampilkan notifikasi berhasil;
stop
@enduml
```
