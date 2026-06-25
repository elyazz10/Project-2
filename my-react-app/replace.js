const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// Checkout.tsx
replaceInFile('src/pages/Checkout.tsx', [
    ["'16sesi'", "''"],
    ["${pkg.sessions}sesi", "${pkg.duration_months}"],
    ["${pkg.sessions} Sesi", "pkg.name"],
    ["parsed.sessions.match(/(\d+)/)", "parsed.pt_duration_months ? parsed.pt_duration_months.toString().match(/(\d+)/) : null"],
    ["setPtSessionsCount(parseInt(matchSesi[1]));", "setPtSessionsCount(parseInt(matchSesi[1]));"],
    ["Bonus Sesi PT:", "Bonus PT:"],
    ["+{freeSessions} Sesi (Gratis)", "+{freeSessions} Bulan (Gratis)"],
    ["{ptSessionsCount} Sesi", "{ptSessionsCount} Bulan"],
    ["Selesaikan pembayaran untuk menambahkan kuota sesi Personal Trainer Anda.", "Selesaikan pembayaran untuk mengaktifkan langganan Personal Trainer Anda."],
    ["Membeli Paket Sesi PT", "Membeli Paket PT"],
    ["Gratis {freeSessions} Sesi PT!", "Gratis {freeSessions} Bulan PT!"],
    ["Jumlah Sesi PT", "Durasi Paket PT"],
    ["Sesi (Rp 50.000 / Sesi)", "Bulan"],
    ["Total Akumulasi Sesi PT", "Total Durasi PT"],
    ["{ptSessionsCount + freeSessions} Sesi", "{ptSessionsCount + freeSessions} Bulan"],
    ["Pilih Personal Trainer (Sesi Gratis)", "Pilih Personal Trainer"],
    ["{freeSessions} Sesi (Gratis)", "{freeSessions} Bulan (Gratis)"],
    ["Biaya Trainer ({ptSessionsCount} Sesi):", "Biaya Trainer ({ptSessionsCount} Bulan):"]
]);

// MemberDashboard.tsx
replaceInFile('src/pages/dashboard/MemberDashboard.tsx', [
    ["useState('16sesi')", "useState('')"],
    ["<option value=\"4sesi\">4 Sesi (Rp 1.155.000)</option>", "<option value=\"1 Bulan PT\">1 Bulan PT</option>"],
    ["<option value=\"8sesi\">8 Sesi (Rp 2.072.700)</option>", "<option value=\"3 Bulan PT\">3 Bulan PT</option>"],
    ["<option value=\"16sesi\">16 Sesi (Rp 3.582.000)</option>", "<option value=\"6 Bulan PT\">6 Bulan PT</option>"],
    ["<option value=\"32sesi\">32 Sesi (Rp 6.352.000)</option>", "<option value=\"12 Bulan PT\">12 Bulan PT</option>"],
    ["<option value=\"48sesi\">48 Sesi (Rp 8.592.000)</option>", ""],
    ["<label className=\"block text-gray-400 mb-1.5 text-xs font-bold uppercase\">Pilih Jumlah Sesi</label>", "<label className=\"block text-gray-400 mb-1.5 text-xs font-bold uppercase\">Pilih Paket PT</label>"],
    ["Apakah Anda yakin ingin membatalkan booking sesi latihan ini? Kuota sesi Anda akan dikembalikan.", "Apakah Anda yakin ingin membatalkan booking latihan ini?"],
    ["Sesi booking pelatih berhasil dikirim!", "Booking pelatih berhasil dikirim!"]
]);

// PersonalTrainer.tsx
replaceInFile('src/pages/PersonalTrainer.tsx', [
    ["Pilih Sesi", "Pilih Paket"],
    ["<span className=\"text-xl font-bold text-white uppercase tracking-wide\">Sesi</span>", "<span className=\"text-xl font-bold text-white uppercase tracking-wide\">Bulan</span>"],
    ["Rp/ Sesi", "Rp/ Bulan"]
]);

// Membership.tsx
replaceInFile('src/pages/Membership.tsx', [
    ["Free 1-3 Sesi Coach/PT", "Free 1-3 Bulan Coach/PT"],
    ["Gratis 1 Sesi Personal Trainer", "Gratis 1 Bulan Personal Trainer"],
    ["Gratis 2 Sesi Personal Trainer", "Gratis 2 Bulan Personal Trainer"],
    ["Gratis 3 Sesi Personal Trainer", "Gratis 3 Bulan Personal Trainer"]
]);

// OwnerDashboard.tsx
replaceInFile('src/pages/dashboard/OwnerDashboard.tsx', [
    ["Jumlah Sesi dan Harga wajib diisi!", "Durasi dan Harga wajib diisi!"],
    ["'Paket Sesi PT'", "'Paket PT'"],
    ["Kelola sesi, statistik gym", "Kelola statistik gym"],
    ["Atur variasi jumlah sesi PT", "Atur variasi durasi paket PT"],
    ["Permintaan Sesi Trainer Masuk", "Permintaan Latihan Trainer Masuk"],
    ["Belum ada pesanan sesi yang terdaftar.", "Belum ada pesanan latihan yang terdaftar."],
    ["Paket Sesi PT", "Paket PT"],
    ["Contoh: Gratis 1 Sesi Personal Trainer", "Contoh: Gratis 1 Bulan Personal Trainer"],
    ["Jumlah Sesi", "Durasi (Bulan)"],
    ["Daftar Harga Sesi Personal Trainer", "Daftar Harga Paket PT"],
    ["Belum ada paket sesi PT yang ditambahkan.", "Belum ada paket PT yang ditambahkan."]
]);

console.log('Replacements completed.');
