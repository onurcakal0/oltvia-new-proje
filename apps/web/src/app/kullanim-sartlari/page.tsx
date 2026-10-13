import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Lock } from 'lucide-react';

export const metadata = {
  title: 'Kullanım Şartları | OLTVIA',
  description: 'OLTVIA Yapay Zeka Destekli Eğitim Platformu Kullanım Şartları ve Hizmet Kuralları',
};

export default function KullanimSartlariPage() {
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
          <div className="p-3 rounded-2xl bg-[#FF5A4D]/10 text-[#FF5A4D] border border-[#FF5A4D]/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Kullanım Şartları Sözleşmesi</h1>
            <p className="text-xs text-[#9CA3AF] mt-1">Yürürlük Tarihi: 13 Ekim 2026 • Versiyon 2.4</p>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8 text-sm text-[#9CA3AF] leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Taraflar ve Hizmetin Kapsamı</h2>
            <p>
              İşbu Kullanım Şartları Sözleşmesi, OLTVIA Eğitim Teknolojileri A.Ş. ("OLTVIA") ile platformu kullanan, web sitesini ziyaret eden veya mobil/web arayüzleri üzerinden Sokratik yapay zeka asistanından faydalanan Kullanıcı arasında akdedilmiştir. Platforma giriş yapan her kullanıcı bu şartları kabul etmiş sayılır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Kullanıcı Hesap Güvenliği</h2>
            <p>
              Kullanıcılar, sisteme kayıt olurken doğru ve güncel bilgiler vermekle yükümlüdür. Hesap bilgileri ve parolalar kişiye özeldir. Bir hesabın birden fazla yetkisiz kişi tarafından eşzamanlı olarak kullanılması, satılması veya ticari amaçla devredilmesi yasaktır. OLTVIA, güvenlik ihlali tespit edilen hesapları askıya alma hakkını saklı tutar.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. Kabul Edilebilir Kullanım ve Yasaklar</h2>
            <p>
              Platformdaki yapay zeka istem modelleri, soru çözüm mantıkları, grafiksel gelişim algoritmaları ve veri tabanları otomatik veri çekme (scraping), tersine mühendislik veya bot yazılımlar kullanılarak kopyalanamaz. Sistemde yer alan XP, rozet ve Streak mekanizmalarını hileli yöntemlerle manipüle etmek yasaktır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Fikri Mülkiyet Hakları</h2>
            <p>
              OLTVIA markası, logosu, tasarım arayüzleri, algoritmik yazılımları ve özgün içerikleri Fikir ve Sanat Eserleri Kanunu ile uluslararası telif mevzuatı çerçevesinde korunmaktadır. Yazılı izin olmaksızın çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Hizmette Değişiklik ve Süreklilik</h2>
            <p>
              OLTVIA, platform özelliklerini güncelleme, yeni pedagojik modeller ekleme veya teknik bakım çalışmaları nedeniyle geçici kesintiler yapma hakkına sahiptir. Kritik güncellemeler kullanıcılara kayıtlı e-posta adresleri üzerinden duyurulur.
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
