import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

export const metadata = {
  title: 'Gizlilik Politikası & KVKK | OLTVIA',
  description: 'OLTVIA Kişisel Verilerin Korunması, Veri Güvenliği ve Gizlilik Politikası Aydınlatma Metni',
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#14161A] text-[#F2F1ED] font-serif selection:bg-[#FF5A4D]/30 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Gizlilik Politikası & KVKK Metni</h1>
            <p className="text-xs text-[#9CA3AF] mt-1">6698 sayılı KVKK & GDPR Uyumlu • Güncelleme: 13 Ekim 2026</p>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8 text-sm text-[#9CA3AF] leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Veri Sorumlusu Sıfatı</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü ("GDPR") kapsamında, OLTVIA Eğitim Teknolojileri A.Ş. veri sorumlusu sıfatıyla hareket etmektedir. Kişisel verileriniz, aşağıda belirtilen amaçlar doğrultusunda hukuka ve dürüstlük kurallarına uygun şekilde işlenir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. İşlenen Kişisel Veri Kategorileri</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Kimlik & İletişim Verileri:</strong> Ad, soyad, e-posta adresi, telefon numarası, eğitim/sınıf seviyesi.</li>
              <li><strong>Pedagojik & Bilişsel Veriler:</strong> Sınav deneme netleri, soru çözüm süreleri, yanlış yapılan konu başlıkları, Sokratik yapay zeka ile yapılan soru-cevap geçmişi.</li>
              <li><strong>İşlem & Güvenlik Verileri:</strong> IP adresleri, çerez kayıtları, oturum saatleri, oturum süresi ve günlük seri (Streak) başarı kayıtları.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. Verilerin İşlenme Amaçları</h2>
            <p>
              Kişisel verileriniz; her öğrenciye özel yapay zeka hedef rotası oluşturmak, zayıf konu analizleri çıkarmak, öğretmen ve veli bilgilendirme raporlarını derlemek ve platform güvenliğini sağlamak amacıyla işlenmektedir. OLTVIA, öğrenci verilerini reklam ağlarıyla asla paylaşmaz ve hiçbir ticari üçüncü tarafa satmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Veri Güvenliği ve Şifreleme</h2>
            <p>
              Tüm hassas öğrenci ve kurum verileri AES-256 standardıyla veri tabanlarında şifreli saklanır. İnternet üzerinden aktarılan tüm veriler TLS 1.3 güvenlik katmanı ile korunur. Veri merkezlerimiz ISO 27001 Bilgi Güvenliği Yönetim Sistemi sertifikasyonuna sahiptir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. KVKK Madde 11 Kapsamındaki Haklarınız</h2>
            <p>
              Veri sahipleri olarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve silinmesini talep etme hakkına sahipsiniz. Başvurularınızı <span className="text-white font-mono">kvkk@oltvia.com</span> adresine güvenli elektronik imza veya kayıtlı e-posta adresinizden iletebilirsiniz.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#9CA3AF]/60">
          © {new Date().getFullYear()} OLTVIA INC. BEYOND WHAT YOU KNOW.
        </div>
      </div>
    </div>
  );
}
