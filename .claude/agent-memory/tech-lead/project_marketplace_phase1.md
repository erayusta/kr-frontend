---
name: Marketplace Phase 1 Plan
description: Phase 1 marketplace development - product listing and detail pages, April 2026
type: project
---

Phase 1 marketplace hedefi: mevcut kampanya yapısına dokunmadan /fiyat-karsilastir (ürün liste) ve /urun/[id] (ürün detay) sayfalarını çalışır hale getirmek.

**Why:** KampanyaRadar'ın 1355 ürün verisini (fiyat geçmişi, mağaza karşılaştırması) doğrudan kullanıcıya açarak platform değerini artırmak. Mevcut ürün verisi kampanyalara bağlı olarak sunuluyor, bağımsız ürün sayfaları yok.

**How to apply:**
- Tüm değişiklikler ADDITIVE olmalı — mevcut migration, model, controller, route, sayfa, component'lara DOKUNULMAYACAK
- Kritik eksik: 1289/1355 üründe brand_id yok — SyncProductCatalog brand resolution iyileştirilmeli
- Ürün-kategori ilişkisi yok (product_category pivot yok) — Phase 1'de eklenmeli
- Products tablosunda slug yok — SEO-friendly URL için eklenmeli
- feature/marketplace branch'inde çalışılacak (hem backend hem frontend)
