# Database undangan dengan Google Sheets

Source Apps Script ada di `apps-script/Code.gs`. Spreadsheet yang dipakai:

https://docs.google.com/spreadsheets/d/1fakjb_1bk5JJkQQEruX2Shwo8Z8BdA4bMDQNImtZy4w/edit

## Pasang Apps Script

1. Buka spreadsheet dengan akun pemiliknya, pilih **Ekstensi → Apps Script**.
2. Ganti isi `Code.gs` di editor Apps Script dengan isi file di repo ini, lalu simpan.
3. Pilih fungsi `setupDatabase` dan klik **Jalankan**. Beri izin Google yang diminta. Fungsi ini membuat tab `Weddings`, `Guests`, `RSVPs`, `Wishes`, dan `Config` serta mempertahankan isi tab yang sudah ada.
4. Klik **Deploy → New deployment → Web app**. Set **Execute as: Me** dan **Who has access: Anyone**, lalu deploy dan salin URL Web App yang berakhiran `/exec`.
5. Endpoint Web App tanpa login mendukung undangan publik dan Admin Panel. Data tamu dan operasi edit dapat diakses siapa pun yang mengetahui URL endpoint; tombol admin yang disembunyikan bukan proteksi akses. Hindari menyimpan data sensitif, dan gunakan ini hanya jika kamu menerima risiko akses publik.

## Sambungkan aplikasi

Project sudah memakai URL Web App `/exec` yang dideploy. Jika memakai deployment Apps Script lain, atur `VITE_GOOGLE_APPS_SCRIPT_URL` di `.env.local` untuk lokal dan di konfigurasi build/hosting sebelum build ulang. URL endpoint bukan kunci admin; jangan memasukkan kunci admin ke variabel frontend.

Buka undangan dan klik ikon hati tersembunyi di footer untuk langsung masuk ke Admin Panel tanpa password aplikasi. Jika tab `Weddings` belum memiliki data, aplikasi menyalin data lokal perangkat tersebut ke spreadsheet saat pertama kali panel admin dibuka. Setelah mengubah source Apps Script, deploy ulang versi terbaru melalui **Deploy → Manage deployments → Edit** agar perubahan endpoint aktif.

Jika kode Apps Script berubah, buat **New version** di menu **Deploy → Manage deployments → Edit**, lalu deploy ulang. URL Web App yang sama dapat dipertahankan.

## Catatan sinkronisasi

- Database cloud baru berisi data setelah Apps Script dibuat, dijalankan, dan dideploy; menambahkan URL saja tidak cukup.
- Migrasi pertama menyalin data lokal perangkat yang dipakai admin saat itu. Data localStorage dari perangkat lain tidak bisa diambil otomatis.
- RSVP dan ucapan disimpan ke spreadsheet; halaman mengambil snapshot terbaru saat dimuat. Data kontak tamu dan rincian RSVP hanya dikirim oleh endpoint setelah kunci admin tervalidasi. Browser tetap menyimpan salinan cache untuk kompatibilitas offline.
- Jika endpoint tidak tersedia atau gagal, halaman menampilkan error sinkronisasi dan RSVP/ucapan tidak diklaim berhasil tersimpan.
