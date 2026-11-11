"use client";
import React from 'react';
import OltviaDashboardLayout from '../../components/OltviaDashboardLayout';

/**
 * Öğretmen Paneli Ana Sayfası:
 * - Üst Header: Shimmering OLTVIΛ logosu, Liquid Glass Arama Çubuğu, Eclipse Tema Butonu, Yuvarlak Bildirimler ve Öğretmen Profil Kapsülü
 * - Yan Menü: TEACHER rozeti, Sınıflarım, Ödev & Görev Takibi, Sınav Değerlendirme, OLTVIA ve Zümre menüleri
 */
export default function OgretmenPage() {
  return <OltviaDashboardLayout role="ogretmen" />;
}
