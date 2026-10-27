# Database undangan dengan Google Sheets

Source Apps Script ada di `apps-script/Code.gs`. Spreadsheet yang dipakai:

https://docs.google.com/spreadsheets/d/1fakjb_1bk5JJkQQEruX2Shwo8Z8BdA4bMDQNImtZy4w/edit

## Pasang Apps Script

1. Buka spreadsheet dengan akun pemiliknya, pilih **Ekstensi → Apps Script**.
2. Ganti isi `Code.gs` di editor Apps Script dengan isi file di repo ini, lalu simpan.
3. Pilih fungsi `setupDatabase` dan klik **Jalankan**. Beri izin Google yang diminta. Fungsi ini membuat tab `Weddings`, `Guests`, `RSVPs`, `Wishes`, dan `Config` serta mempertahankan isi tab yang sudah ada.
4. Di **Setelan Project → Properti Skrip**, tambahkan properti `ADMIN_KEY` dengan kunci rahasia pilihan Anda, lalu klik **Simpan properti skrip**. Jangan masukkan kunci ke source aplikasi atau GitHub. Anda dapat menjalankan `setAdminKey` dari editor untuk memastikan properti sudah tersedia; fungsi tidak mengubah atau menampilkan nilainya.
5. Klik **Deploy → New deployment → Web app**. Set **Execute as: Me** dan **Who has access: Anyone**, lalu deploy dan salin URL Web App yang berakhiran `/exec`.
6. URL Apps Script dipakai aplikasi publik untuk menerima RSVP/ucapan dan membaca data. Karena aksesnya publik, jangan menaruh data sensitif lain di tab tersebut. Perubahan data undangan, daftar tamu, dan penghapusan data memerlukan kunci admin.

## Sambungkan aplikasi

Project sudah memakai URL Web App `/exec` yang dideploy. Jika memakai deployment Apps Script lain, atur `VITE_GOOGLE_APPS_SCRIPT_URL` di `.env.local` untuk lokal dan di konfigurasi build/hosting sebelum build ulang. URL endpoint bukan kunci admin; jangan memasukkan kunci admin ke variabel frontend.

Buka undangan dan klik ikon hati di footer. Masukkan kunci admin yang dibuat di langkah sebelumnya. Jika tab `Weddings` belum memiliki data undangan, aplikasi akan memindahkan data lokal perangkat tersebut beserta data awal ke spreadsheet. Perangkat lain selanjutnya membaca data dari spreadsheet saat halaman dimuat.

Jika kode Apps Script berubah, buat **New version** di menu **Deploy → Manage deployments → Edit**, lalu deploy ulang. URL Web App yang sama dapat dipertahankan.

## Catatan sinkronisasi

- Database cloud baru berisi data setelah Apps Script dibuat, dijalankan, dan dideploy; menambahkan URL saja tidak cukup.
- Migrasi pertama menyalin data lokal perangkat yang dipakai admin saat itu. Data localStorage dari perangkat lain tidak bisa diambil otomatis.
- RSVP dan ucapan disimpan ke spreadsheet; halaman mengambil snapshot terbaru saat dimuat. Data kontak tamu dan rincian RSVP hanya dikirim oleh endpoint setelah kunci admin tervalidasi. Browser tetap menyimpan salinan cache untuk kompatibilitas offline.
- Jika endpoint tidak tersedia atau gagal, halaman menampilkan error sinkronisasi dan RSVP/ucapan tidak diklaim berhasil tersimpan.
