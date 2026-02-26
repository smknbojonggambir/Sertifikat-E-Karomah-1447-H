// ====== GANTI STRING DI BAWAH INI DENGAN URL WEB APP BARU ANDA ======
const scriptURL = 'https://script.google.com/macros/s/AKfycbyirBD6i2yNRnsWEgJG9HeE7_nbaC5nL-FAgyd71OwwRdIlP3wBgf4r1zXyKnyU14rOmw/exec'; 
// ===============================================================

async function cariSertifikat() {
    const inputNama = document.getElementById('input-nama').value;
    const pesanError = document.getElementById('pesan-error');
    const btnCari = document.getElementById('btn-cari');
    const wrapper = document.getElementById('document-wrapper');
    
    if (!inputNama) {
        pesanError.innerText = "Nama Lengkap tidak boleh kosong!";
        wrapper.style.display = 'none';
        return;
    }

    pesanError.innerText = "";
    btnCari.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mencari Data...';
    btnCari.disabled = true;

    try {
        const response = await fetch(`${scriptURL}?nama=${encodeURIComponent(inputNama)}`);
        const result = await response.json();

        if (result.status === 'success') {
            // Isi Data Sertifikat
            document.getElementById('cert-nama').innerText = result.data.nama;
            document.getElementById('cert-sebagai').innerText = result.data.sebagai;
            document.getElementById('cert-nomor').innerText = result.data.nomor;

            // Isi Data Laporan
            document.getElementById('lap-nama').innerText = result.data.nama;
            document.getElementById('lap-nomor').innerText = result.data.nomor;
            document.getElementById('lap-kedisiplinan').innerText = result.data.kedisiplinan;
            document.getElementById('lap-kelengkapan').innerText = result.data.kelengkapan;
            document.getElementById('lap-ibadah').innerText = result.data.ibadah;
            document.getElementById('lap-ratarata').innerText = result.data.ratarata;
            document.getElementById('lap-predikat').innerText = result.data.predikat;

            wrapper.style.display = 'flex'; // Munculkan dokumen
        } else {
            pesanError.innerText = "Maaf, Nama tidak ditemukan. Pastikan ejaan sesuai.";
            wrapper.style.display = 'none';
        }
    } catch (error) {
        pesanError.innerText = "Terjadi kesalahan sistem atau URL Web App bermasalah.";
        console.error("Fetch error: ", error);
        wrapper.style.display = 'none';
    }

    btnCari.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Cari Data';
    btnCari.disabled = false;
}

// Fungsi serbaguna untuk download Sertifikat & Laporan
function downloadGambar(canvasId, fileName, btnId) {
    const node = document.getElementById(canvasId);
    const btn = document.getElementById(btnId);
    const namaSiswa = document.getElementById('cert-nama').innerText;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    btn.disabled = true;

    // Scale 2 agar kualitas gambar tidak pecah saat diunduh
    html2canvas(node, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${fileName}_E-Karomah_${namaSiswa}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("Gagal mendownload: ", err);
        alert("Terjadi kesalahan saat mengunduh dokumen.");
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}
