import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Nexus',
  description: 'Nexus platformunu kullanma koşulları ve topluluk kuralları.',
};

export default function TermsPage() {
  return (
    <article className="panel data-card legal-page">
      <h1>Kullanım Koşulları</h1>
      <p><strong>Son güncelleme:</strong> 17 Kasım 2026</p>
      <p>Nexus’u kullanarak bu koşullara uymayı kabul edersin. Koşulları kabul etmiyorsan platformu kullanma.</p>

      <h2>Hesap ve güvenlik</h2>
      <p>Hesap kullanıcı adı ve şifreyle çalışır. Kullanıcı adını benzersiz seçmeli, şifreni korumalı ve hesabındaki etkinliklerden sorumlu olmalısın. E-posta ile şifre kurtarma şu an desteklenmediğinden şifreni güvenli yerde sakla. Başkasının kimliğine bürünemez veya başkasının hesabını izinsiz kullanamazsın.</p>

      <h2>İçerik ve davranış</h2>
      <p>Paylaştığın içerikten ve gerekli haklara sahip olmaktan sen sorumlusun. Yasa dışı, tehditkâr, taciz edici, nefret içeren, yanıltıcı, mahremiyeti ihlal eden, zararlı yazılım taşıyan veya başkasının fikri mülkiyetini ihlal eden içerik paylaşma. Spam, platform güvenliğini aşma girişimi, otomatik kötüye kullanım ve izinsiz veri toplama yasaktır.</p>
      <p>Gönderdiğin içerik üzerindeki hakların sende kalır. İçeriği platformda yayımlayarak Nexus’a hizmeti sunmak için içeriği barındırma, görüntüleme ve teknik olarak işleme konusunda sınırlı, münhasır olmayan izin verirsin. İçeriğini kaldırdığında bu izin, makul teknik yedekler ve yasal yükümlülükler saklı kalmak üzere sona erer.</p>

      <h2>Moderasyon</h2>
      <p>Nexus, kullanıcı raporlarını inceleyebilir ve koşulları veya güvenliği ihlal eden içeriği kaldırabilir; ihlalin ağırlığına göre hesabı kısıtlayabilir ya da askıya alabilir. Acil güvenlik veya yasal gerekliliklerde önceden bildirim mümkün olmayabilir.</p>

      <h2>Harici hizmetler ve AI</h2>
      <p>Dosya depolama ve AI gibi özellikler harici hizmetlere bağlı olabilir. Bu hizmetlerin kullanılabilirliği ve kendi koşulları Nexus’un kontrolü dışındadır. AI çıktıları tavsiye veya doğrulanmış bilgi olarak garanti edilmez; önemli kararları bağımsız olarak doğrula.</p>

      <h2>Hizmetin sunulması ve değişiklikler</h2>
      <p>Nexus’u geliştirebilir, geçici olarak durdurabilir veya özelliklerini değiştirebiliriz. Hizmet olduğu gibi sunulur; kesintisiz, hatasız veya her amaca uygun olacağına dair garanti verilmez. Koşullar güncellenebilir; güncel sürüm bu sayfada yayımlanır ve tarihi belirtilir.</p>

      <h2>İletişim</h2>
      <p>Resmi işletmeci iletişim bilgileri henüz belirlenmedi. Yasal bildirimler veya veri talepleri için uygulama sahibinin kullandığı hesap ya da proje üzerinden iletişim kurulmalıdır.</p>
    </article>
  );
}
