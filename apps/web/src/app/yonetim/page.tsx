"use client";
import React from 'react';
import OltviaDashboardLayout from '../../components/OltviaDashboardLayout';

/**
 * Yönetim & Okul İdaresi Paneli Ana Sayfası:
 * - Üst Header: Shimmering OLTVIΛ logosu, Liquid Glass Arama Çubuğu, Eclipse Tema Butonu, Yuvarlak Bildirimler ve Yönetici Profil Kapsülü
 * - Yan Menü: ADMIN rozeti, Kurumsal Genel Bakış, Sınıflar & Şubeler, Akademik Performans, OLTVIA, Zümre Takibi ve Kurumsal Rapor menüleri
 */
export default function YonetimPage() {
  return <OltviaDashboardLayout role="yonetim" />;
}
