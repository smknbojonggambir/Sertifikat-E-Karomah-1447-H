// ====== GANTI STRING DI BAWAH INI DENGAN URL WEB APP ANDA ======
const scriptURL = 'https://script.google.com/macros/s/AKfycbyuK7FNtQK5oXIEhlxTYnT34R4ELTtR1HSEd8g1L1wteGRwKWY9RlKcrFS2EJO97_HQYg/exec'; 
// ===============================================================

async function cariSertifikat() {
    const inputNama = document.getElementById('input-nama').value;
    const pesanError = document.getElementById('pesan-error');
    const btnCari = document.getElementById('btn-cari');
    const wrapper = document.getElementById('certificate-wrapper');
    
    // Validasi input kosong
    if (!inputNama) {
        pesanError.innerText = "Nama Lengkap tidak boleh kosong!";
        wrapper.style.display = 'none';
        return;
    }

    // Tampilan tombol saat loading
    pesanError.innerText = "";
    btnCari.innerText = "Mencari Data...";
    btnCari.disabled = true;

    try {
        // Ambil data (encodeURIComponent untuk mengatasi spasi pada nama)
        const response = await fetch(`${scriptURL}?nama=${encodeURIComponent(inputNama)}`);
        const result = await response.json();

        if (result.status === 'success') {
            // Tulis data ke sertifikat HTML
            document.getElementById('cert-nama').innerText = result.data.nama;
            document.getElementById('cert-sebagai').innerText = result.data.sebagai;
            document.getElementById('cert-nomor').innerText = result.data.nomor;

            // Munculkan sertifikat
            wrapper.style.display = 'block';
        } else {
            pesanError.innerText = "Maaf, Nama tidak ditemukan. Pastikan ejaan sesuai dengan data panitia.";
            wrapper.style.display = 'none';
        }
    } catch (error) {
        pesanError.innerText = "Terjadi kesalahan sistem atau URL Web App bermasalah. Coba lagi.";
        console.error("Fetch error: ", error);
        wrapper.style.display = 'none';
    }

    // Kembalikan tombol seperti semula
    btnCari.innerText = "Cari Sertifikat";
    btnCari.disabled = false;
}

function downloadSertifikat() {
    const certificateNode = document.getElementById('certificate-canvas');
    const btnDownload = document.getElementById('btn-download');
    const namaSiswa = document.getElementById('cert-nama').innerText;
    
    btnDownload.innerText = "Memproses Gambar...";
    btnDownload.disabled = true;

    // Convert HTML to Canvas lalu jadikan file JPG
    html2canvas(certificateNode, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Sertifikat_Karomah_${namaSiswa}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
        
        btnDownload.innerText = "Download Sertifikat (JPG)";
        btnDownload.disabled = false;
    }).catch(err => {
        console.error("Gagal mendownload: ", err);
        alert("Terjadi kesalahan saat mengunduh sertifikat.");
        btnDownload.innerText = "Download Sertifikat (JPG)";
        btnDownload.disabled = false;
    });
}
