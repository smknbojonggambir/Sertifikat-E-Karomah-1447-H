async function cariData() {
    // Mengambil input dan menghapus spasi berlebih di awal/akhir
    const namaInput = document.getElementById("nama").value.trim();

    if (!namaInput) {
        alert("Masukkan nama terlebih dahulu!");
        return;
    }

    const url = "https://script.google.com/macros/s/AKfycbxr0X97Fzm5RnRZAusJ1WiCqXC-Oi2ruU5nW1_QI9wrcdqBwJAnoxQg5nG_DPK1vU-pnw/exec?nama=" + encodeURIComponent(namaInput);

    try {
        // Mengambil data dari server
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Gagal terhubung ke server.");
        }

        const text = await response.text();

        if (text === "Not Found") {
            alert("Nama tidak ditemukan!");
            return;
        }

        // Parsing JSON dan memanggil fungsi PDF
        const data = JSON.parse(text);
        await generatePDF(data);
        
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Terjadi kesalahan saat mengambil data: " + error.message);
    }
}

async function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape");

    try {
        // Background & Logo 
        // Pastikan file gambar "background.jpg" dan "logo-smk.png" ada di folder yang sama
        doc.addImage("background.jpg", "JPEG", 0, 0, 297, 210);
        doc.addImage("logo-smk.png", "PNG", 135, 20, 30, 30);

        // Header (Menggunakan format alignment modern jsPDF)
        doc.setFont("times", "bold");
        doc.setFontSize(28);
        doc.text("SERTIFIKAT PENGHARGAAN", 148, 60, { align: "center" });

        doc.setFontSize(18);
        doc.text("Kegiatan E-Karomah", 148, 75, { align: "center" });
        doc.text("SMK Negeri Bojonggambir", 148, 85, { align: "center" });
        doc.text("1447 H / 2026 M", 148, 95, { align: "center" });

        // Nama
        doc.setFontSize(24);
        doc.text(data.nama, 148, 115, { align: "center" });

        // Nilai
        doc.setFontSize(16);
        doc.text("Kedisiplinan : " + data.kedisiplinan, 70, 135);
        doc.text("Kelengkapan : " + data.kelengkapan, 70, 145);
        doc.text("Ibadah : " + data.ibadah, 70, 155);
        doc.text("Rata-rata : " + data.rata, 70, 165);
        doc.text("Predikat : " + data.predikat, 70, 175);

        // Nomor Sertifikat
        doc.setFontSize(12);
        doc.text("Nomor: " + data.nomor, 20, 20);

        // TTD Ketua
        doc.addImage("ttd-ketua.png", "PNG", 60, 170, 40, 20);
        doc.text("Ali Maulana, S.Pd.", 60, 195);

        // TTD Kepala Sekolah
        doc.addImage("ttd-kepsek.png", "PNG", 200, 170, 40, 20);
        doc.text("Iman Rahmat, S. Pd. I", 200, 195);

        // QR Verifikasi
        const verifikasiURL = "https://smknbojonggambir.github.io/Sertifikat-E-Karomah-1447-H/verifikasi.html?nomor=" + data.nomor;
        
        // Menggunakan fungsi helper Promise untuk menunggu QR Code selesai digenerate
        const qrDataUrl = await getQRCodeDataURL(verifikasiURL);
        doc.addImage(qrDataUrl, "PNG", 250, 20, 30, 30);
        
        // Simpan PDF
        doc.save(`Sertifikat-${data.nama}.pdf`);

    } catch (error) {
        console.error("Gagal membuat PDF:", error);
        alert("Terjadi kesalahan saat membuat PDF. Pastikan file gambar ttd/background/logo tersedia di lokasi yang benar.");
    }
}

// --- Fungsi Helper untuk QR Code ---
function getQRCodeDataURL(text) {
    return new Promise((resolve, reject) => {
        const qrDiv = document.createElement("div");
        new QRCode(qrDiv, {
            text: text,
            width: 100,
            height: 100
        });

        // Tunggu sedikit waktu agar QRCode.js selesai membuat elemen canvas
        setTimeout(() => {
            const canvas = qrDiv.querySelector("canvas");
            if (canvas) {
                resolve(canvas.toDataURL("image/png"));
            } else {
                // Fallback untuk browser lama
                const img = qrDiv.querySelector("img");
                if (img && img.src) {
                    resolve(img.src);
                } else {
                    reject(new Error("Gagal mengekstrak gambar QR Code"));
                }
            }
        }, 100);
    });
}
