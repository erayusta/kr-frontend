// Kampanya Radar - Akbank Kredi Kartı Sayfası Düzenleme Script'i
// Sadece belirtilen URL'de çalışır

(function() {
    'use strict';
    
    // URL kontrolü - sadece belirtilen sayfada çalış
    const baseURL = window.location.origin;
    const targetURL = `${baseURL}/kampanya/akbank-kredi-karti-basvurusu-icin-hemen-axess-wingse-basvur`;
    
    if (window.location.href !== targetURL) {
        console.log('Bu script sadece Akbank kredi kartı kampanya sayfasında çalışır');
        return;
    }
    
    // Sayfa düzenleme fonksiyonu
    let isProcessed = false; // İşlem yapıldığını takip et
    
    function applyPageFixes() {
        // Eğer zaten işlem yapıldıysa tekrar yapma
        if (isProcessed) {
            console.log('Sayfa düzenlemesi zaten yapıldı, tekrar çalıştırılmıyor');
            return;
        }
        
        let fixesApplied = 0;
        
        // 1. Fixed div'i gizle
        const fixedDiv = document.querySelector('.fixed.shadow-xl.bottom-0.right-0.w-full.md\\:max-w-xs.p-3.bg-white.rounded-t-lg.transition-transform.transform.translate-y-0.z-40');
        
        if (fixedDiv && fixedDiv.style.display !== 'none') {
            fixedDiv.style.display = 'none';
            console.log('Fixed div gizlendi');
            fixesApplied++;
        }
        
        // 2. A tag'ını 2. mt-5 div'inin üzerine taşı
        const aTag = document.querySelector('a[href*="akbank.com"]');
        const mt5Divs = document.querySelectorAll('div.mt-5');
        const mt5Div = mt5Divs[1]; // 2. mt-5 div'ini seç (index 1)
        
        if (aTag && mt5Div) {
            const container = mt5Div.parentElement;
            
            // A tag zaten doğru pozisyonda mı kontrol et
            const aSibling = aTag.nextElementSibling;
            
            if (aSibling !== mt5Div) {
                // A tag'ını 2. mt-5 div'inin parent container'ında, mt-5'in üzerine yerleştir
                container.insertBefore(aTag, mt5Div);
                console.log('A tag 2. mt-5 div\'inin üzerine taşındı');
                fixesApplied++;
            }
        } else {
            if (!aTag) console.log('A tag bulunamadı (akbank.com href ile aranıyor)');
            if (!mt5Div) console.log('2. mt-5 div bulunamadı');
        }
        
        // Eğer herhangi bir düzenleme yapıldıysa işareti koy
        if (fixesApplied > 0) {
            isProcessed = true;
            console.log(`Sayfa düzenlemesi tamamlandı (${fixesApplied} işlem)`);
            
            // Observer'ı durdur
            if (window.pageFixObserver) {
                window.pageFixObserver.disconnect();
                console.log('MutationObserver durduruldu');
            }
        }
    }

    // Sayfa yüklenme durumunu kontrol et ve uygun zamanda çalıştır
    if (document.readyState === 'loading') {
        // Sayfa hala yükleniyorsa DOMContentLoaded olayını bekle
        document.addEventListener('DOMContentLoaded', applyPageFixes);
    } else {
        // Sayfa zaten yüklenmişse hemen çalıştır
        applyPageFixes();
    }

    // Ek güvenlik için window.onload olayı da dinle
    window.addEventListener('load', function() {
        // Kısa bir gecikme ile tekrar çalıştır (dinamik içerik yüklenebilir)
        setTimeout(applyPageFixes, 500);
    });

    // MutationObserver ile dinamik değişiklikleri izle (isteğe bağlı)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Yeni elementler eklendiyse tekrar kontrol et
                setTimeout(applyPageFixes, 100);
            }
        });
    });

    // Observer'ı başlat
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Akbank kampanya sayfası düzenleme script\'i başlatıldı');

})();
