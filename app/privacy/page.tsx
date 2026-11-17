import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Nexus',
  description: 'Nexus kişisel verileri nasıl işler, saklar ve korur.',
};

export default function PrivacyPage() {
  return (
    <article className="panel data-card legal-page">
      <h1>Gizlilik Politikası</h1>
      <p><strong>Son güncelleme:</strong> 17 Kasım 2026</p>
      <p>Nexus; fikir paylaşmak, öğrenmek, topluluk kurmak ve projeleri sergilemek için sunulan bir sosyal platformdur. Bu politika, hizmet kullanılırken işlenen bilgileri açıklar.</p>

      <h2>İşlenen bilgiler</h2>
      <p>Hesap oluştururken kullanıcı adı ve şifre alınır. Kullanıcı adı, Supabase kimlik doğrulamasının teknik gereksinimi nedeniyle e-posta gönderimi yapılamayan dahili bir takma adresine dönüştürülür; gerçek e-posta adresi istenmez. Şifreyi kurtarmak için e-posta doğrulaması şu an sunulmamaktadır. Profilde paylaşılan ad, biyografi, bağlantılar; gönderiler, yorumlar, beğeniler, takipler, topluluk üyelikleri, projeler ve yüklenen dosyalar seçilen görünürlük ayarlarına göre işlenir.</p>
      <p>Hizmetin güvenliğini sağlamak ve hataları gidermek için teknik istek kayıtları işlenebilir.</p>

      <h2>Bilgileri kullanma amaçları</h2>
      <ul>
        <li>Hesabını ve oturumunu yönetmek.</li>
        <li>Topluluk özelliklerini, içerikleri, bildirimleri ve özel mesajları sunmak.</li>
        <li>Spam ve kötüye kullanımı önlemek, kullanıcı bildirimlerini incelemek.</li>
        <li>Sen talep ettiğinde Nexus AI yanıtı üretmek.</li>
        <li>Hizmetin çalışmasını ve performansını iyileştirmek.</li>
      </ul>

      <h2>AI özellikleri</h2>
      <p>Nexus AI’ye gönderdiğin metin, yanıt üretmek amacıyla yapılandırılmış harici yapay zekâ sağlayıcısına iletilebilir. Şifre veya hassas kişisel bilgi göndermemeni öneririz. AI yanıtları otomatik üretilir ve hatalı olabilir.</p>

      <h2>Saklama ve hizmet sağlayıcılar</h2>
      <p>Hesap ve uygulama verileri Supabase altyapısında saklanır; uygulama Render üzerinde sunulur. Yapılandırılmış AI sağlayıcısı yalnızca AI özelliğini kullandığında metin alır. Bu sağlayıcılar hizmeti çalıştırmak için gerekli verileri kendi sistemlerinde işleyebilir.</p>

      <h2>Görünürlük ve güvenlik</h2>
      <p>Herkese açık içerikler diğer ziyaretçilere gösterilebilir. Özel mesajlar yalnızca konuşmanın katılımcılarına gösterilmek üzere tasarlanmıştır. Erişim kontrolleri ve veritabanı politikaları uygulanır; internet üzerinden hiçbir aktarım veya depolama yöntemi mutlak güvenlik garantisi vermez.</p>

      <h2>Seçimlerin ve taleplerin</h2>
      <p>Profil bilgilerini güncelleyebilir, içeriklerini silebilir veya hesabının silinmesini talep edebilirsin. Gizlilik veya veri talepleri için uygulama sahibine, hizmeti kullandığın hesap ya da proje üzerinden ulaş. Resmi veri sorumlusu iletişim adresi henüz belirtilmemiştir.</p>

      <h2>Çocukların gizliliği ve değişiklikler</h2>
      <p>Nexus çocuklara yönelik bir hizmet değildir. Bu politika güncellenebilir; önemli değişikliklerde güncelleme tarihi değiştirilir.</p>
    </article>
  );
}
