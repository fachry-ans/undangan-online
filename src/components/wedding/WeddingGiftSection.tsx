import React, { useState } from 'react';
import { CreditCard, Copy, Check, Gift, MapPin } from 'lucide-react';
import { WeddingData, BankAccount } from '../../types/wedding';
import { ScrollReveal } from '../common/ScrollReveal';

interface WeddingGiftSectionProps {
  wedding: WeddingData;
}

export const WeddingGiftSection: React.FC<WeddingGiftSectionProps> = ({ wedding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBankLogo = (bankName: string) => {
    const lower = bankName.toLowerCase();
    if (lower.includes('bca')) return '/images/logo-bca.png';
    if (lower.includes('mandiri')) return '/images/logo-mandiri.png';
    return null;
  };

  const bankAccounts: BankAccount[] =
    wedding.bankAccounts && wedding.bankAccounts.length > 0
      ? wedding.bankAccounts
      : [
          {
            id: 'bca-1',
            bankName: 'BCA (Bank Central Asia)',
            accountNumber: '8830918231',
            accountHolder: 'Abdi Dananjaya',
          },
          {
            id: 'mandiri-1',
            bankName: 'Bank Mandiri',
            accountNumber: '1370018829103',
            accountHolder: 'Lula Maheswari',
          },
        ];

  return (
    <section className="relative py-16 px-4 text-center max-w-[460px] mx-auto space-y-6 overflow-hidden">
      <div className="space-y-3">
        <ScrollReveal animation="fade-down" delay={100} duration={1200}>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E8D8BD]/40 text-[#B89B63] text-[11px] font-sans uppercase tracking-[3px] font-semibold">
            Tanda Kasih
          </div>
          <h2 className="text-[36px] sm:text-[42px] text-[#3A302B] font-serif font-normal leading-tight mt-1">
            Wedding Gift
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={250} duration={1200}>
          <p className="text-[13px] text-[#70635C] leading-relaxed max-w-sm mx-auto font-sans">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless melalui amplop digital berikut:
          </p>
        </ScrollReveal>
      </div>

      {/* Button to toggle gifts */}
      <ScrollReveal animation="zoom-in" delay={350} duration={1200}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-[12px] uppercase tracking-[1.5px] font-semibold shadow-lg btn-luxury-gradient transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          <Gift className="w-4 h-4 text-[#FAF7F0]" />
          <span>{isOpen ? 'Tutup Amplop Digital' : 'Kirim Hadiah / Amplop'}</span>
        </button>
      </ScrollReveal>

      {/* Amplop Digital Content */}
      {isOpen && (
        <div className="space-y-5 pt-4 transition-all duration-700">
          {bankAccounts.map((acc, index) => {
            const logo = getBankLogo(acc.bankName);
            const isCopied = copiedId === acc.id;

            return (
              <ScrollReveal
                key={acc.id || index}
                animation="fade-up"
                delay={index * 150}
                duration={1000}
                className="w-full"
              >
                <div className="p-6 rounded-3xl bg-white/95 border border-[#E8D8BD] shadow-[0_10px_30px_rgba(58,48,43,0.06)] flex flex-col items-center space-y-4">
                  {/* Bank Header */}
                  <div className="flex items-center justify-between w-full pb-3 border-b border-[#E8D8BD]/60">
                    <span className="text-[12px] font-semibold tracking-wider text-[#7D8B73] uppercase font-sans">
                      Transfer Bank
                    </span>
                    <CreditCard className="w-5 h-5 text-[#B89B63]" />
                  </div>

                  {logo && (
                    <div className="h-8 flex items-center justify-center py-1">
                      <img src={logo} alt={acc.bankName} className="h-full object-contain max-w-[120px]" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-[13px] font-sans font-medium text-[#70635C]">
                      {acc.bankName}
                    </p>
                    <p className="text-[22px] font-mono font-bold tracking-wider text-[#3A302B]">
                      {acc.accountNumber}
                    </p>
                    <p className="text-[13px] font-serif text-[#70635C] italic">
                      a.n. {acc.accountHolder}
                    </p>
                  </div>

                  <button
                    onClick={() => copyText(acc.accountNumber, acc.id)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#B89B63]/40 text-[#B89B63] text-[12px] font-semibold tracking-wider uppercase transition-all active:scale-95 cursor-pointer font-sans"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              </ScrollReveal>
            );
          })}

          {/* Physical gift address */}
          {wedding.giftAddress && (
            <ScrollReveal animation="fade-up" delay={300} duration={1000} className="w-full">
              <div className="p-6 rounded-3xl bg-white/95 border border-[#E8D8BD] shadow-[0_10px_30px_rgba(58,48,43,0.06)] space-y-3 text-left">
                <div className="flex items-center gap-2 text-[#7D8B73] pb-2 border-b border-[#E8D8BD]/60">
                  <MapPin className="w-4 h-4 text-[#B89B63]" />
                  <span className="text-[12px] font-semibold uppercase tracking-wider font-sans">
                    Kirim Kado Fisik
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[14px] font-serif font-bold text-[#3A302B]">
                    {wedding.giftAddress.recipient}
                  </p>
                  <p className="text-[12px] text-[#70635C] font-mono">
                    {wedding.giftAddress.phone}
                  </p>
                  <p className="text-[12px] text-[#70635C] leading-relaxed pt-1 font-sans">
                    {wedding.giftAddress.address}
                  </p>
                  {wedding.giftAddress.notes && (
                    <p className="text-[11px] text-[#B89B63] italic pt-1 font-sans">
                      * {wedding.giftAddress.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => copyText(wedding.giftAddress.address, 'address-gift')}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#B89B63]/40 text-[#B89B63] text-[11px] font-semibold tracking-wider uppercase transition-all active:scale-95 cursor-pointer font-sans"
                  >
                    {copiedId === 'address-gift' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Alamat Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Alamat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      )}
    </section>
  );
};
