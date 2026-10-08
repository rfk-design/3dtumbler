import React from 'react';
import {
  TumblerColor,
  ColorCategory,
  AestheticColorWheel,
} from './colorPalette2D';
import {
  StickerOption,
  CalligraphyStyleId,
  CalligraphyOrnamentId,
  createCustomCalligraphySticker,
  getStickerPreviewDataUrl,
} from './stickers3D';
import {
  StrawTopperVariant,
  KeychainVariant,
  StrapVariant,
  BootVariant,
  STRAW_TOPPER_VARIATIONS,
  KEYCHAIN_VARIATIONS,
  STRAP_VARIATIONS,
  BOOT_VARIATIONS,
  getAccessoryStudioPreviewUrl,
} from './accessories3D';
import {
  LaserEngravingConfig,
  LaserEngravingPlacement,
  LASER_ENGRAVING_STYLES,
  getLaserEngravingPreviewUrl,
} from './laserEngraving3D';

export interface CommunitySubmissionItem {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  modelName: string;
  colorName: string;
  colorHex: string;
  laserText: string;
  stickersCount: number;
  likes: number;
  presetTag: string;
  createdAt: string;
}

interface AssetSheetModalsProps {
  colors: TumblerColor[];
  selectedColor: TumblerColor;
  onSelectColor: (c: TumblerColor) => void;
  onSelectCustomColor: (hex: string, name: string) => void;
  isColorSheetOpen: boolean;
  setIsColorSheetOpen: (v: boolean) => void;

  isAccessoryFlatLayOpen: boolean;
  setIsAccessoryFlatLayOpen: (v: boolean) => void;
  accessories: { keychain: boolean; strap: boolean; topper: boolean; boot: boolean };
  topperVariant: StrawTopperVariant;
  setTopperVariant: (v: StrawTopperVariant) => void;
  keychainVariant: KeychainVariant;
  setKeychainVariant: (v: KeychainVariant) => void;
  strapVariant: StrapVariant;
  setStrapVariant: (v: StrapVariant) => void;
  bootVariant: BootVariant;
  setBootVariant: (v: BootVariant) => void;
  onToggleAccessory: (key: 'keychain' | 'strap' | 'topper' | 'boot', val: boolean) => void;

  isLaserSheetOpen: boolean;
  setIsLaserSheetOpen: (v: boolean) => void;
  laserEngraving: LaserEngravingConfig;
  setLaserEngraving: React.Dispatch<React.SetStateAction<LaserEngravingConfig>>;
  onFocusFrontView: () => void;
  setActiveTab: (tab: 'colors' | 'engraving' | 'stickers' | 'accessories') => void;

  isCalligraphySheetOpen: boolean;
  setIsCalligraphySheetOpen: (v: boolean) => void;
  customNameText: string;
  setCustomNameText: (v: string) => void;
  customCalligStyle: CalligraphyStyleId;
  setCustomCalligStyle: (v: CalligraphyStyleId) => void;
  customCalligOrnament: CalligraphyOrnamentId;
  customCalligColor: string;
  aestheticStickers: StickerOption[];
  activeSticker: StickerOption | null;
  onSelectSticker: (s: StickerOption) => void;

  isStickerSheetOpen: boolean;
  setIsStickerSheetOpen: (v: boolean) => void;
}

export const AssetSheetModals: React.FC<AssetSheetModalsProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  onSelectCustomColor,
  isColorSheetOpen,
  setIsColorSheetOpen,
  isAccessoryFlatLayOpen,
  setIsAccessoryFlatLayOpen,
  accessories,
  topperVariant,
  setTopperVariant,
  keychainVariant,
  setKeychainVariant,
  strapVariant,
  setStrapVariant,
  bootVariant,
  setBootVariant,
  onToggleAccessory,
  isLaserSheetOpen,
  setIsLaserSheetOpen,
  laserEngraving,
  setLaserEngraving,
  onFocusFrontView,
  setActiveTab,
  isCalligraphySheetOpen,
  setIsCalligraphySheetOpen,
  customNameText,
  setCustomNameText,
  customCalligStyle,
  setCustomCalligStyle,
  customCalligOrnament,
  customCalligColor,
  aestheticStickers,
  activeSticker,
  onSelectSticker,
  isStickerSheetOpen,
  setIsStickerSheetOpen,
}) => {
  return (
    <>
      {/* 2D Custom Color Palette Sheet Modal */}
      {isColorSheetOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-[20px] max-w-5xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  24-Color Studio Palette &amp; Custom Hue Wheel
                </h3>
                <p className="text-xs text-slate-500">
                  Select a curated pastel, earth, vibrant, or dark matte shade for your 3D tumbler.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsColorSheetOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 flex flex-col items-center">
                  <AestheticColorWheel
                    size={210}
                    selectedHex={selectedColor.hex}
                    onSelectCustomHex={onSelectCustomColor}
                  />
                </div>
                <div className="lg:col-span-8 space-y-5">
                  {(
                    [
                      { id: 'pastel', title: '01 · Soft Matte Pastel Tones' },
                      { id: 'earth', title: '02 · Earthy & Botanical Shades' },
                      { id: 'vibrant', title: '03 · Vibrant Studio Accents' },
                      { id: 'dark', title: '04 · Dark Muted & Charcoal Shades' },
                    ] as { id: ColorCategory; title: string }[]
                  ).map((group) => {
                    const groupSwatches = colors.filter((c) => c.category === group.id);
                    return (
                      <div key={group.id} className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-1">
                          {group.title}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {groupSwatches.map((swatch) => {
                            const isSelected =
                              selectedColor.hex.toUpperCase() === swatch.hex.toUpperCase();
                            return (
                              <button
                                key={swatch.id}
                                type="button"
                                onClick={() => {
                                  onSelectColor(swatch);
                                  setIsColorSheetOpen(false);
                                }}
                                className={`p-2 rounded-xl border transition flex items-center gap-2.5 text-left cursor-pointer bg-white ${
                                  isSelected
                                    ? 'border-pink-500 bg-pink-50/30'
                                    : 'border-slate-200/80 hover:border-pink-300'
                                }`}
                              >
                                <span
                                  className="w-9 h-9 rounded-lg shrink-0 border border-black/10 block"
                                  style={{ backgroundColor: swatch.hex }}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {swatch.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-slate-400 uppercase">
                                    {swatch.hex}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Accessories Catalog Modal */}
      {isAccessoryFlatLayOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-[20px] max-w-5xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  3D Tumbler Accessories Showcase (16 Variations)
                </h3>
                <p className="text-xs text-slate-500">
                  Toggle straw toppers, acrylic charms, woven handles, and protective silicone boots.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAccessoryFlatLayOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-6">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  01 · Silicone Straw Toppers (6 Variations)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {STRAW_TOPPER_VARIATIONS.map((item) => {
                    const active = accessories.topper && topperVariant === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setTopperVariant(item.id);
                          onToggleAccessory('topper', true);
                        }}
                        className={`p-2.5 rounded-xl border transition flex flex-col items-center text-center gap-1.5 cursor-pointer bg-white ${
                          active
                            ? 'border-pink-500 ring-2 ring-pink-100'
                            : 'border-slate-200/80 hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={getAccessoryStudioPreviewUrl(item.previewKey)}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-contain bg-white"
                        />
                        <span className="text-[11px] font-bold text-slate-800 leading-tight">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  02 · Keychains &amp; Charms (4 Variations)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {KEYCHAIN_VARIATIONS.map((item) => {
                    const active = accessories.keychain && keychainVariant === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setKeychainVariant(item.id);
                          onToggleAccessory('keychain', true);
                        }}
                        className={`p-3 rounded-xl border transition flex items-center gap-3 text-left cursor-pointer bg-white ${
                          active
                            ? 'border-pink-500 ring-2 ring-pink-100'
                            : 'border-slate-200/80 hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={getAccessoryStudioPreviewUrl(item.previewKey)}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-contain shrink-0 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                    03 · Carrying Straps (3 Variations)
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5">
                    {STRAP_VARIATIONS.map((item) => {
                      const active = accessories.strap && strapVariant === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setStrapVariant(item.id);
                            onToggleAccessory('strap', true);
                          }}
                          className={`p-2.5 rounded-xl border transition flex flex-col items-center text-center gap-1.5 cursor-pointer bg-white ${
                            active
                              ? 'border-pink-500 ring-2 ring-pink-100'
                              : 'border-slate-200/80 hover:border-pink-300'
                          }`}
                        >
                          <img
                            src={getAccessoryStudioPreviewUrl(item.previewKey)}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-contain bg-white"
                          />
                          <span className="text-[11px] font-bold text-slate-800 leading-tight">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                    04 · Silicone Bumper Boots (3 Variations)
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5">
                    {BOOT_VARIATIONS.map((item) => {
                      const active = accessories.boot && bootVariant === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setBootVariant(item.id);
                            onToggleAccessory('boot', true);
                          }}
                          className={`p-2.5 rounded-xl border transition flex flex-col items-center text-center gap-1.5 cursor-pointer bg-white ${
                            active
                              ? 'border-pink-500 ring-2 ring-pink-100'
                              : 'border-slate-200/80 hover:border-pink-300'
                          }`}
                        >
                          <img
                            src={getAccessoryStudioPreviewUrl(item.previewKey)}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-contain bg-white"
                          />
                          <span className="text-[11px] font-bold text-slate-800 leading-tight">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Laser Engraving Showcase Sheet Modal */}
      {isLaserSheetOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-[20px] max-w-5xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  3D Laser Engraving Typography Showcase
                </h3>
                <p className="text-xs text-slate-500">
                  Precision-etched into the powder coat to reveal raw brushed 18/8 stainless steel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLaserSheetOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {LASER_ENGRAVING_STYLES.map((st) => {
                  const isSelected = laserEngraving.enabled && laserEngraving.styleId === st.id;
                  const previewUrl = getLaserEngravingPreviewUrl(
                    st.sampleName,
                    st.id,
                    st.sampleBodyColor,
                    laserEngraving.placement
                  );
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setLaserEngraving({
                          enabled: true,
                          text: st.sampleName,
                          styleId: st.id,
                          placement: laserEngraving.placement,
                        });
                        onFocusFrontView();
                        setActiveTab('engraving');
                        setIsLaserSheetOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border transition flex flex-col items-center text-center gap-2 cursor-pointer bg-white ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-100'
                          : 'border-slate-200/80 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={previewUrl}
                        alt={st.name}
                        className="w-full h-36 object-contain rounded-lg"
                      />
                      <div className="text-xs font-bold text-slate-900">
                        {st.name} (&ldquo;{st.sampleName}&rdquo;)
                      </div>
                      <p className="text-[11px] text-slate-500">{st.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    placement: 'vertical-side' as LaserEngravingPlacement,
                    title: 'Vertical Alignment Along Side Body',
                    desc: 'Etched vertically along the tumbler contour.',
                  },
                  {
                    placement: 'horizontal-base' as LaserEngravingPlacement,
                    title: 'Horizontal Alignment Near Lower Base Rim',
                    desc: 'Centered horizontally above the stainless bottom collar.',
                  },
                ].map((item) => {
                  const previewUrl = getLaserEngravingPreviewUrl(
                    laserEngraving.text || 'Angelica',
                    laserEngraving.styleId,
                    selectedColor.hex,
                    item.placement
                  );
                  const active = laserEngraving.placement === item.placement;
                  return (
                    <button
                      key={item.placement}
                      type="button"
                      onClick={() => {
                        setLaserEngraving((prev) => ({
                          ...prev,
                          enabled: true,
                          placement: item.placement,
                        }));
                        onFocusFrontView();
                        setActiveTab('engraving');
                        setIsLaserSheetOpen(false);
                      }}
                      className={`p-4 rounded-xl border transition flex items-center gap-4 text-left cursor-pointer bg-white ${
                        active
                          ? 'border-pink-500 ring-2 ring-pink-100'
                          : 'border-slate-200/80 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={previewUrl}
                        alt={item.title}
                        className="w-28 h-28 object-contain rounded-lg shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900">{item.title}</div>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Name Calligraphy Sheet Modal */}
      {isCalligraphySheetOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-[20px] max-w-5xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Custom Name &amp; Calligraphy Typography Sheet
                </h3>
                <p className="text-xs text-slate-500">
                  Select a calligraphy name decal to place onto your 3D tumbler.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCalligraphySheetOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  maxLength={16}
                  value={customNameText}
                  onChange={(e) => setCustomNameText(e.target.value)}
                  placeholder="Type custom name..."
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-pink-500 w-44"
                />
                {[
                  { id: 'modern-soft-script' as CalligraphyStyleId, label: 'Soft Script' },
                  { id: 'minimalist-fine-cursive' as CalligraphyStyleId, label: 'Fine Cursive' },
                  { id: 'playful-brush' as CalligraphyStyleId, label: 'Playful Brush' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCustomCalligStyle(st.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      customCalligStyle === st.id
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const sticker = createCustomCalligraphySticker(
                    customNameText,
                    customCalligStyle,
                    customCalligOrnament,
                    customCalligColor
                  );
                  onSelectSticker(sticker);
                  setActiveTab('stickers');
                  setIsCalligraphySheetOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-pink-600 text-white text-xs font-semibold transition cursor-pointer"
              >
                Use &ldquo;{customNameText || 'Jessica'}&rdquo; Decal
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-white">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {aestheticStickers
                  .filter((s) => s.category === 'calligraphy')
                  .map((s) => {
                    const previewUrl = getStickerPreviewDataUrl(s);
                    const isSelected = activeSticker?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onSelectSticker(s);
                          setActiveTab('stickers');
                          setIsCalligraphySheetOpen(false);
                        }}
                        className={`p-3 rounded-xl border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-white ${
                          isSelected
                            ? 'border-pink-500 ring-2 ring-pink-100'
                            : 'border-slate-200/80 hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={previewUrl}
                          alt={s.name}
                          className="w-32 h-24 object-contain"
                        />
                        <span className="text-xs font-bold text-slate-800">{s.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Sticker Sheet Modal */}
      {isStickerSheetOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-[20px] max-w-5xl w-full max-h-[88dvh] flex flex-col border border-slate-200 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Complete Die-Cut Sticker Pack (44 Motifs)
                </h3>
                <p className="text-xs text-slate-500">
                  Click any sticker to activate placement mode on the 3D tumbler.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStickerSheetOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-white">
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3 place-items-center">
                {aestheticStickers.map((s) => {
                  const previewUrl = getStickerPreviewDataUrl(s);
                  const isSelected = activeSticker?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSticker(s);
                        setActiveTab('stickers');
                        setIsStickerSheetOpen(false);
                      }}
                      className={`p-2 rounded-xl border transition flex flex-col items-center justify-center gap-1 cursor-pointer w-full ${
                        isSelected
                          ? 'bg-pink-50 border-pink-500'
                          : 'bg-white border-slate-200/70 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={previewUrl}
                        alt={s.name}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
