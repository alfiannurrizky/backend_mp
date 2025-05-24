langkah-langkah untuk menjalankan project ini

1. git clone https://github.com/alfiannurrizky/backend_mp.git
2. rename file .env.example menjadi .env
3. ubah value yang ada di file .env
4. jalankan npm install
5. jalankan "node seeders/dosenSeeder.js" untuk membuat akun dosen
6. jalankan "node seeders/mahasiswaSeeder.js" untuk membuat akun mahasiswa
7. lalu jalankan "npm run dev"

Route yang tersedia

| Method | Endpoint                                         | Role      | Deskripsi                                         |
| ------ | ------------------------------------------------ | --------- | ------------------------------------------------- |
| POST   | `http://localhost:5000/api/auth/login`           | Semua     | Login pengguna (mahasiswa atau dosen)             |
| POST   | `http://localhost:5000/api/auth/register`        | Mahasiswa | Registrasi akun baru mahasiswa                    |
| POST   | `http://localhost:5000/api/auth/submissions`     | Mahasiswa | Ajukan judul skripsi                              |
| GET    | `http://localhost:5000/api/auth/submissions/my`  | Mahasiswa | Lihat daftar dan status pengajuan skripsi sendiri |
| GET    | `http://localhost:5000/api/auth/submissions`     | Dosen     | Lihat semua pengajuan mahasiswa                   |
| PATCH  | `http://localhost:5000/api/auth/submissions/:id` | Dosen     | Update status pengajuan (ACC / Revisi / Pending)  |
