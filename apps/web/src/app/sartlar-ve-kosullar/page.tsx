import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Şartlar ve Koşullar | OLTVIA',
  description: 'OLTVIA Abonelik, Ödeme ve Hizmet Esasları Şartlar ve Koşullar Sözleşmesi',
};

export default function SartlarVeKosullarPage() {
  return (
    <div className="min-h-screen bg-[#14161A] text-[#E2E8F0] font-serif selection:bg-[#FF5A4D]/30 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#8B6CFF]/10 text-[#8B6CFF] border border-[#8B6CFF]/20">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Şartlar ve Koşullar</h1>
            <p className="text-xs text-[#9CA3AF] mt-1">Abonelik & Hizmet Esasları • Yürürlük Tarihi: 13 Ekim 2026</p>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-8 text-sm text-[#9CA3AF] leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Abonelik Paketleri ve Faturalandırma</h2>
            <p>
              OLTVIA; bireysel öğrencilere özel aylık ve yıllık B2C planlar ile eğitim kurumları, okullar ve kurs merkezleri için çok kullanıcılı B2B lisanslama paketleri sunar. Abonelik ücretleri kredi kartı veya banka transferi ile peşin tahsil edilir. Otomatik yenilenen aboneliklerde ücret kesintisi dönem başında gerçekleşir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Cayma Hakkı ve Dijital İçerik İade Esasları</h2>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca; anında ifa edilen dijital hizmetler ve yapay zeka destekli yazılımlar kapsamında kullanıcı platformu aktif olarak kullanmaya başladıktan sonra cayma hakkı istisna kapsamındadır. Bununla birlikte, teknik arızalardan kaynaklanan ve 72 saat içinde çözülemeyen durumlarda kullanıcıya orantılı ücret iadesi sağlanır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. Yapay Zeka Çıktıları ve Pedagojik Sorumluluk Sınırı</h2>
            <p>
              OLTVIA'nın Sokratik Yapay Zeka mentörü, öğrencinin soru çözme hızını, kavram kavrayışını ve çalışma disiplinini desteklemek üzere tasarlanmış ileri düzey bir pedagojik rehberdir. Yapay zekanın sağladığı yönlendirmeler resmi sınav başarısını doğrudan garanti eden hukuki bir taahhüt niteliğinde değildir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Mücbir Sebepler ve Sorumluluk Sınırı</h2>
            <p>
              Doğal afetler, siber saldırılar, altyapı sağlayıcılarından kaynaklanan küresel internet kesintileri gibi mücbir sebeplerden ötürü meydana gelebilecek aksaklıklardan OLTVIA sorumlu tutulamaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Yetkili Yargı Mercii</h2>
            <p>
              İşbu sözleşmenin uygulanmasından ve yorumlanmasından doğacak her türlü hukuki ihtilafta Türk Hukuku geçerli olup, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#9CA3AF]/60">
          © {new Date().getFullYear()} OLTVIA INC. TÜM HAKLARI SAKLIDIR.
        </div>
      </div>
    </div>
  );
}
