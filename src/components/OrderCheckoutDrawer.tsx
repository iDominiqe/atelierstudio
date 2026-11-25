import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  MapPin,
  PackageCheck,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import type {
  CustomOrderPayload,
  LanguageCode,
  PriceSummary,
  StudioMode,
} from '../types/studio';

interface OrderCheckoutDrawerProps {
  lang: LanguageCode;
  open: boolean;
  onClose: () => void;
  snapshotDataUrl: string;
  mode: StudioMode;
  artworkTitle: string;
  artFilterName: string;
  customCaption: string;
  configurationSummary: string[];
  priceSummary: PriceSummary;
  onDownloadSpecCard: () => void;
  onResetStudio: () => void;
}

export const OrderCheckoutDrawer: React.FC<OrderCheckoutDrawerProps> = ({
  lang,
  open,
  onClose,
  snapshotDataUrl,
  mode,
  artworkTitle,
  artFilterName,
  customCaption,
  configurationSummary,
  priceSummary,
  onDownloadSpecCard,
  onResetStudio,
}) => {
  const t = TRANSLATIONS[lang];
  const [customerName, setCustomerName] = useState('Elena Moraru');
  const [contactHandle, setContactHandle] = useState('+373 69 412 880 / @elena_art');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Chișinău, Str. Ștefan cel Mare 148, Apt. 24'
  );
  const [notes, setNotes] = useState('Gallery gift wrap + certificate of authenticity');
  const [submittedOrder, setSubmittedOrder] = useState<CustomOrderPayload | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Math.floor(1000 + Math.random() * 8999);
    const trackingId = `ATL-2026-${num}`;
    setSubmittedOrder({
      orderId: trackingId,
      createdAt: new Date().toLocaleString(),
      snapshotDataUrl,
      mode,
      artworkTitle,
      artFilterName,
      customCaption,
      configurationSummary,
      priceSummary,
      customerName: customerName.trim() || 'Studio Guest',
      contactHandle: contactHandle.trim() || 'Direct Studio Pickup',
      deliveryAddress: deliveryAddress.trim() || 'Chișinău Atelier Pickup',
      notes: notes.trim(),
    });
  };

  const handleClose = () => {
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/65 backdrop-blur-sm p-3 md:p-5">
      <div className="w-full max-w-lg h-full max-h-[92vh] studio-glass-elevated rounded-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              {t.checkoutBrandSub}
            </span>
            <h2 className="font-display font-bold text-lg text-white">
              {submittedOrder ? t.orderConfirmedTitle : t.checkoutTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 cursor-pointer"
            aria-label="Close checkout drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto studio-scroll p-5 space-y-4">
          {!submittedOrder ? (
            <form id="atelier-order-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Live 3D Snapshot Card */}
              <div className="rounded-2xl bg-stone-950/70 border border-white/10 p-3 flex gap-3.5 items-center">
                {snapshotDataUrl ? (
                  <img
                    src={snapshotDataUrl}
                    alt="3D Studio Preview Snapshot"
                    className="w-28 h-24 rounded-xl object-cover border border-amber-400/35 shrink-0"
                  />
                ) : (
                  <div className="w-28 h-24 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center text-[10px] text-stone-400 shrink-0">
                    3D Preview
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono uppercase">
                      {mode === 'canvas' ? t.modeBadgeCanvas : t.modeBadgeApparel}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {artworkTitle}
                  </div>
                  <div className="text-[11px] text-stone-300">
                    {t.stylePrefix}: {artFilterName}
                    {customCaption ? ` · “${customCaption}”` : ''}
                  </div>
                  <button
                    type="button"
                    onClick={onDownloadSpecCard}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 hover:text-amber-200 cursor-pointer pt-0.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>{t.savePreviewCard}</span>
                  </button>
                </div>
              </div>

              {/* Configuration Summary Pills */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  {t.selectedSpecsLabel}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {configurationSummary.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-stone-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Itemized Price Summary */}
              <div className="rounded-2xl bg-stone-950/60 border border-white/10 p-3 space-y-1.5">
                {priceSummary.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-stone-300">{item.label}</span>
                    <span className="font-mono text-stone-200">
                      {item.amount === 0
                        ? '€0'
                        : item.amount < 0
                        ? `-€${Math.abs(item.amount)}`
                        : `€${item.amount}`}
                    </span>
                  </div>
                ))}
                <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-200">
                    {t.totalLabel} ({priceSummary.quantity}{' '}
                    {priceSummary.quantity === 1 ? t.pieceSingular : t.piecePlural})
                  </span>
                  <span className="font-display font-extrabold text-xl text-amber-400">
                    €{priceSummary.grandTotal}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.fullNameLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl bg-stone-950/75 border border-white/15 focus:border-amber-400/70 outline-none px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.phoneTelegramLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="w-full rounded-xl bg-stone-950/75 border border-white/15 focus:border-amber-400/70 outline-none px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.deliveryAddressLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full rounded-xl bg-stone-950/75 border border-white/15 focus:border-amber-400/70 outline-none px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.productionNotesLabel}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl bg-stone-950/75 border border-white/15 focus:border-amber-400/70 outline-none px-3 py-2 text-xs text-white resize-none"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Confirmed Order Receipt */}
              <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/45 p-4 flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-200">
                    {t.orderQueuedTitle}
                  </div>
                  <p className="text-xs text-stone-300 mt-1">
                    {t.orderQueuedDescPre}{' '}
                    <span className="text-white font-semibold">
                      {submittedOrder.contactHandle}
                    </span>{' '}
                    {t.orderQueuedDescPost}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-stone-950/75 border border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-stone-400">
                      {t.trackingNumberLabel}
                    </div>
                    <div className="font-mono font-bold text-lg text-amber-400">
                      {submittedOrder.orderId}
                    </div>
                  </div>
                  <PackageCheck className="w-6 h-6 text-amber-400" />
                </div>

                {submittedOrder.snapshotDataUrl && (
                  <img
                    src={submittedOrder.snapshotDataUrl}
                    alt="Confirmed Custom Order"
                    className="w-full h-44 object-cover rounded-xl border border-white/15"
                  />
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/[0.04] rounded-xl p-2.5">
                    <div className="text-[10px] text-stone-400">{t.clientLabel}</div>
                    <div className="font-semibold text-white truncate">
                      {submittedOrder.customerName}
                    </div>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl p-2.5">
                    <div className="text-[10px] text-stone-400">{t.totalAmountLabel}</div>
                    <div className="font-mono font-bold text-amber-300">
                      €{submittedOrder.priceSummary.grandTotal}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-300 space-y-1">
                  <div>
                    <span className="text-stone-400">{t.deliveryLabel}:</span>{' '}
                    {submittedOrder.deliveryAddress}
                  </div>
                  <div>
                    <span className="text-stone-400">{t.specsLabel}:</span>{' '}
                    {submittedOrder.configurationSummary.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onDownloadSpecCard}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.downloadPreviewCard}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedOrder(null);
                    onResetStudio();
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold cursor-pointer"
                >
                  {t.createAnotherPiece}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {!submittedOrder && (
          <div className="p-4 border-t border-white/10 bg-stone-950/75 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-stone-400">
                {t.estDispatchLabel}
              </div>
              <div className="text-xs font-semibold text-white">
                {t.estDispatchValue}
              </div>
            </div>
            <button
              type="submit"
              form="atelier-order-form"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              {t.submitOrderBtn} · €{priceSummary.grandTotal}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
