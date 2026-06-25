# Class Diagram - Web Gym Management System

Dokumen ini berisi kode **PlantUML** untuk **Class Diagram**. Diagram ini memetakan seluruh entitas (Tabel/Model Database) yang ada pada sistem Web Gym, lengkap beserta atribut (kolom), operasi (method), dan garis relasi yang menghubungkan satu kelas dengan kelas lainnya secara konseptual.

Silakan *copy-paste* kode di bawah ini ke Visual Paradigm atau editor PlantUML Anda:

```plantuml
@startuml
' Pengaturan Tema
skinparam classAttributeIconSize 0
hide circle
skinparam linetype ortho

' --- DEFINISI KELAS (ENTITAS) ---

class User {
  - id: Integer
  - nama_lengkap: String
  - email: String
  - password: Hash
  - role: Enum(Admin, Member, Trainer, Owner)
  - created_at: DateTime
  + register()
  + login()
  + updateProfile()
}

class Fasilitas {
  - id: Integer
  - nama_fasilitas: String
  - deskripsi: Text
  - foto_url: String
  + tambahFasilitas()
  + updateFasilitas()
}

class Paket {
  - id: Integer
  - nama_paket: String
  - tipe_paket: Enum(Membership, PersonalTrainer)
  - harga: Decimal
  - durasi_hari: Integer
  - kuota_sesi: Integer
  - deskripsi: Text
  + kelolaPaket()
  + getDetailPaket()
}

class Transaksi {
  - id: Integer
  - order_id: String
  - gross_amount: Decimal
  - payment_type: String
  - status_pembayaran: Enum(Pending, Settlement, Expire)
  - tanggal_transaksi: DateTime
  + buatTransaksi()
  + prosesWebhookMidtrans()
  + updateStatus()
}

class Langganan {
  - id: Integer
  - tanggal_mulai: Date
  - tanggal_selesai: Date
  - sisa_kuota_pt: Integer
  - status: Enum(Active, Expired)
  + cekMasaAktif()
  + kurangiKuotaPT()
}

class BookingPT {
  - id: Integer
  - tanggal_booking: Date
  - jam_mulai: Time
  - jam_selesai: Time
  - status: Enum(Scheduled, Completed, Canceled)
  + buatJadwal()
  + selesaikanSesi()
}

class BMILog {
  - id: Integer
  - tinggi_badan_cm: Float
  - berat_badan_kg: Float
  - bmi_score: Float
  - kategori_status: String
  - tanggal_catat: DateTime
  + hitungBMI()
  + simpanLog()
}

class PesanChat {
  - id: Integer
  - isi_pesan: Text
  - is_read: Boolean
  - waktu_kirim: DateTime
  + kirimPesan()
  + tandaiDibaca()
}

class WalkInLog {
  - id: Integer
  - nama_tamu: String
  - tujuan_kunjungan: String
  - waktu_datang: DateTime
  + catatTamu()
}

' --- RELASI ANTAR KELAS ---

' Relasi User dengan berbagai entitas
User "1" -- "0..*" Transaksi : melakukan >
User "1" -- "0..*" Langganan : memiliki >
User "1" -- "0..*" BMILog : mencatat >
User "1" -- "0..*" WalkInLog : dicatat oleh (Admin) >

' Relasi Booking PT melibatkan 2 tipe User (Member dan Trainer)
User "1" -- "0..*" BookingPT : memesan (Member) >
User "1" -- "0..*" BookingPT : melatih (Trainer) >

' Relasi Chat melibatkan Pengirim dan Penerima (Keduanya User)
User "1" -- "0..*" PesanChat : mengirim >
User "1" -- "0..*" PesanChat : menerima >

' Relasi Core System
Paket "1" -- "0..*" Langganan : merujuk pada <
Paket "1" -- "0..*" Transaksi : dibeli dalam >
Transaksi "1" -- "1" Langganan : mengaktifkan >

' Relasi Master Data
User "1" -- "0..*" Fasilitas : mengelola (Admin) >
User "1" -- "0..*" Paket : mengelola (Admin) >

@enduml
```
