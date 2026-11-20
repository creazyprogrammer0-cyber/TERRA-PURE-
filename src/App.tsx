import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  Download,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
  Package,
  MapPin,
  FlaskConical,
  X,
  Plus,
  Minus,
  ClipboardCheck,
  ShieldCheck,
  Calendar,
  Scale
} from 'lucide-react';
import { BOTANICAL_LOTS, HERO_ESTATE_IMAGE, BotanicalLot } from './data/botanicalData';

export interface RequisitionItem {
  lot: BotanicalLot;
  mode: 'sample' | 'bulk';
  quantityKg: number;
}

export default function App() {
  // Interactive Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('All Lots');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyOrganicCertified, setOnlyOrganicCertified] = useState<boolean>(true);
  const [onlyUltraLowMoisture, setOnlyUltraLowMoisture] = useState<boolean>(false);
  const [gradeFilter, setGradeFilter] = useState<'all' | 'cat1' | 'ceremonial'>('all');

  // Active Inspected Lot for Traceability Ledger & Spec Sheet
  const [activeLotId, setActiveLotId] = useState<string>(BOTANICAL_LOTS[0].id);
  const [batchLookupInput, setBatchLookupInput] = useState<string>(BOTANICAL_LOTS[0].lotCode);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  // Sample & Bulk Procurement Drawer State
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([
    {
      lot: BOTANICAL_LOTS[0],
      mode: 'sample',
      quantityKg: 1
    }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Certificate of Analysis (COA) Modal State
  const [coaModalLot, setCoaModalLot] = useState<BotanicalLot | null>(null);

  // Toast Notification for Instant Downloads / Cart actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Requisition Order Submission Form State
  const [enterpriseName, setEnterpriseName] = useState<string>('Aethelgard Botanicals GmbH');
  const [buyerEmail, setBuyerEmail] = useState<string>('procurement@aethelgard.ch');
  const [destinationPort, setDestinationPort] = useState<string>('Zurich Bonded Air Cargo (ZRH)');
  const [incoterm, setIncoterm] = useState<'DDP' | 'CIF' | 'EXW'>('DDP');
  const [submittedManifestId, setSubmittedManifestId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  const activeLot = useMemo(
    () => BOTANICAL_LOTS.find((l) => l.id === activeLotId) || BOTANICAL_LOTS[0],
    [activeLotId]
  );

  const categories = ['All Lots', 'Fermented Cacao', 'Ceremonial Leaf', 'Stigma & Extracts', 'Distillates & Oils'];

  const filteredLots = useMemo(() => {
    return BOTANICAL_LOTS.filter((lot) => {
      const matchesCategory = selectedCategory === 'All Lots' || lot.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        lot.name.toLowerCase().includes(q) ||
        lot.lotCode.toLowerCase().includes(q) ||
        lot.originRegion.toLowerCase().includes(q) ||
        lot.botanicalName.toLowerCase().includes(q);

      const moistureVal = parseFloat(lot.moisturePercent);
      const matchesMoisture = !onlyUltraLowMoisture || moistureVal <= 6.0;

      const matchesOrganic =
        !onlyOrganicCertified ||
        lot.certifications.some((c) => c.toLowerCase().includes('organic') || c.toLowerCase().includes('ecocert'));

      const matchesGrade =
        gradeFilter === 'all' ||
        (gradeFilter === 'cat1' && (lot.grade.includes('AAA') || lot.grade.includes('Category I'))) ||
        (gradeFilter === 'ceremonial' && (lot.grade.includes('Ceremonial') || lot.grade.includes('GC-MS')));

      return matchesCategory && matchesQuery && matchesMoisture && matchesOrganic && matchesGrade;
    });
  }, [selectedCategory, searchQuery, onlyUltraLowMoisture, onlyOrganicCertified, gradeFilter]);

  const handleBatchLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = batchLookupInput.trim().toUpperCase();
    const found = BOTANICAL_LOTS.find(
      (l) =>
        l.lotCode.toUpperCase() === cleaned ||
        l.labCertificateId.toUpperCase() === cleaned ||
        l.lotCode.toUpperCase().includes(cleaned)
    );
    if (found) {
      setActiveLotId(found.id);
      setLookupFeedback(`Verified manifest loaded for ${found.lotCode} (${found.originRegion})`);
    } else {
      setLookupFeedback(`No active harvest lot matching "${batchLookupInput}". Try LOT-PE-2608-CR or LOT-JP-2605-UJ.`);
    }
  };

  const addToRequisition = (lot: BotanicalLot, mode: 'sample' | 'bulk') => {
    setSubmittedManifestId(null);
    setRequisitionItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.lot.id === lot.id && item.mode === mode);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantityKg:
            mode === 'sample'
              ? updated[existingIndex].quantityKg + 1
              : updated[existingIndex].quantityKg + 25
        };
        return updated;
      }
      return [
        ...prev,
        {
          lot,
          mode,
          quantityKg: mode === 'sample' ? 1 : 25
        }
      ];
    });
    triggerToast(
      mode === 'sample'
        ? `Added 250g Lab Assay Sample (${lot.lotCode}) to Requisition`
        : `Added 25kg Bulk Allocation (${lot.lotCode}) to Requisition`
    );
  };

  const updateRequisitionQty = (lotId: string, mode: 'sample' | 'bulk', delta: number) => {
    setRequisitionItems((prev) =>
      prev
        .map((item) => {
          if (item.lot.id === lotId && item.mode === mode) {
            const nextQty = item.quantityKg + delta;
            return nextQty > 0 ? { ...item, quantityKg: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as RequisitionItem[]
    );
  };

  const downloadOriginDossier = (lot: BotanicalLot) => {
    const content = [
      `TERRA PURE AGRO-PROCESSING & BOTANICAL PROVENANCE DOSSIER`,
      `==========================================================`,
      `Certificate ID : ${lot.labCertificateId}`,
      `Batch Lot Code : ${lot.lotCode}`,
      `Botanical Name : ${lot.botanicalName}`,
      `Commercial Name: ${lot.name}`,
      `Estate Origin  : ${lot.estateName} (${lot.originRegion})`,
      `Altitude       : ${lot.altitudeMeters}`,
      `Harvest Season : ${lot.harvestSeason}`,
      `Processing     : ${lot.processingMethod}`,
      `Purity Index   : ${lot.purityPercent}`,
      `Moisture Assay : ${lot.moisturePercent}`,
      `Active Assay   : ${lot.activeCompound}`,
      ``,
      `LABORATORY TRACEABILITY SPECIFICATIONS:`,
      ...lot.specs.map((s) => `- ${s.label.padEnd(38, ' ')}: ${s.value}`),
      ``,
      `CHAIN OF CUSTODY TIMELINE:`,
      ...lot.supplyChainTimeline.map(
        (step) =>
          `[${step.date}] ${step.stage} | ${step.location} (${step.coordinates}) | ${step.metricLabel}: ${step.metricValue}`
      )
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lot.lotCode}_TerraPure_COA.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded Certified Lab Dossier (${lot.lotCode}_TerraPure_COA.txt)`);
  };

  const totalRequisitionUsd = useMemo(() => {
    return requisitionItems.reduce((acc, item) => {
      const unitPrice = item.mode === 'sample' ? item.lot.samplePriceUsd : item.lot.pricePerKgUsd;
      return acc + unitPrice * item.quantityKg;
    }, 0);
  }, [requisitionItems]);

  const handleSubmitRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `REQ-TP-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedManifestId(randomCode);
    triggerToast(`Dispatch Manifest ${randomCode} confirmed for ${enterpriseName}`);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#1E201E] flex flex-col">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#161A17] text-white border border-[#1B4332] rounded-[8px] px-4 py-3 text-[13px] font-medium flex items-center gap-3 ambient-popover-shadow transition-transform duration-150"
        >
          <ShieldCheck className="w-4 h-4 text-[#86af99] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#c1c8c2] hover:text-white ml-2"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP BAR CONTRACT: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#F9F8F4]/95 backdrop-blur-sm border-b border-[#E2DFD7]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark in Playfair Display */}
          <a
            href="#top"
            className="font-editorial text-[24px] font-semibold tracking-[-0.02em] text-[#1B4332] whitespace-nowrap shrink-0"
          >
            Terra Pure
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#525B54]">
            <a
              href="#harvest-catalog"
              className="hover:text-[#1E201E] hover:underline underline-offset-8 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0"
            >
              Harvest Catalog
            </a>
            <a
              href="#traceability-ledger"
              className="hover:text-[#1E201E] hover:underline underline-offset-8 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0"
            >
              Traceability Ledger
            </a>
            <a
              href="#processing-standards"
              className="hover:text-[#1E201E] hover:underline underline-offset-8 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0"
            >
              Processing Standards
            </a>
            <a
              href="#design-system"
              className="hover:text-[#1E201E] hover:underline underline-offset-8 decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0"
            >
              Spec Matrix
            </a>
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#1B4332] hover:bg-[#161A17] text-white text-[14px] font-semibold px-6 py-3 rounded-[8px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sample &amp; Bulk Desk ({requisitionItems.length})
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* HERO SECTION: 12-Column Editorial Split + Provenance Dossier */}
        <section className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 pt-8 pb-14 lg:py-16 border-b border-[#E2DFD7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 7 Columns: Editorial Narrative & Direct Batch Verification */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 md:p-10">
              <div>
                {/* Regulatory & Origin Metadata Strip */}
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                    Origin Verified · Autumn/Winter 2026
                  </span>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] font-mono">
                    ISO-17025 / EU-848/21
                  </span>
                </div>

                {/* Display Headline: Playfair Display 56px desktop / 38px mobile */}
                <h1
                  className="font-editorial text-[38px] leading-[44px] tracking-[-0.01em] md:text-[54px] md:leading-[62px] md:tracking-[-0.02em] font-semibold text-[#1E201E] mb-6"
                  style={{ textWrap: 'balance' }}
                >
                  Single-estate botanical substrates with laboratory-grade provenance.
                </h1>

                <p className="text-[17px] leading-[27px] text-[#525B54] max-w-[62ch] mb-8">
                  Direct from high-altitude cooperative fermentaries and copper-still distilleries to formulation
                  laboratories. Every harvest lot is sealed with gas-chromatography purity assays, Karl Fischer moisture
                  profiles, and GPS parcel custody logs.
                </p>
              </div>

              {/* Interactive Batch Lookup Form & Primary CTAs */}
              <div className="pt-6 border-t border-[#E2DFD7]">
                <form onSubmit={handleBatchLookup} className="mb-5">
                  <label
                    htmlFor="hero-batch-input"
                    className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-2"
                  >
                    Instant Lot Code or COA Verification Lookup
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        id="hero-batch-input"
                        type="text"
                        value={batchLookupInput}
                        onChange={(e) => setBatchLookupInput(e.target.value)}
                        placeholder="Enter Lot ID (e.g. LOT-PE-2608-CR or LOT-JP-2605-UJ)"
                        className="w-full h-[44px] bg-[#FFFFFF] border border-[#E2DFD7] rounded-[8px] px-4 text-[15px] text-[#1E201E] font-mono terra-focus transition-shadow"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1B4332] hover:bg-[#161A17] text-white text-[14px] font-semibold px-6 h-[44px] rounded-[8px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Inspect Lot Ledger
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadOriginDossier(activeLot)}
                      className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[14px] font-semibold px-5 h-[44px] rounded-[8px] transition-colors duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Origin COA
                    </button>
                  </div>
                </form>

                {/* Quick Preset Lot Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#525B54]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54]">
                      Active Lots:
                    </span>
                    {BOTANICAL_LOTS.map((lot) => (
                      <button
                        key={lot.id}
                        type="button"
                        onClick={() => {
                          setActiveLotId(lot.id);
                          setBatchLookupInput(lot.lotCode);
                          setLookupFeedback(`Loaded active specification for ${lot.lotCode}`);
                        }}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] font-mono border transition-colors cursor-pointer ${
                          activeLotId === lot.id
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-[#F9F8F4] text-[#525B54] border-[#E2DFD7] hover:border-[#1B4332] hover:text-[#1E201E]'
                        }`}
                      >
                        {lot.lotCode}
                      </button>
                    ))}
                  </div>
                  {lookupFeedback && (
                    <span className="text-[12px] font-medium text-[#2D6A4F]">{lookupFeedback}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Estate Visual Showcase & Live Harvest Spec Overlay Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] overflow-hidden">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[290px] bg-[#161A17] overflow-hidden">
                <img
                  src={HERO_ESTATE_IMAGE}
                  alt="Alto Urubamba Highland Botanical Estate and Extraction Laboratory"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.06em] text-[#c1ecd4] mb-1">
                    <span>STATION 04 · QUILLABAMBA EXTRACTION LAB</span>
                    <span>12°51′48″S 72°41′35″W</span>
                  </div>
                  <p className="font-editorial text-[22px] leading-[28px] font-medium text-white">
                    Solar Parabolic Dehydration &amp; Small-Batch Hydro-Distillation
                  </p>
                </div>
              </div>

              {/* Hairline-Separated Harvest Telemetry Summary inside Hero Right Card */}
              <div className="p-6 bg-[#FFFFFF] border-t border-[#E2DFD7]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2DFD7]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54]">
                    CURRENT INSPECTED MANIFEST
                  </span>
                  <span className="rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F]">
                    {activeLot.grade}
                  </span>
                </div>

                <div className="divide-y divide-[#E2DFD7] text-[13px]">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#525B54]">Selected Botanical Lot</span>
                    <span className="font-semibold text-[#1E201E] font-mono tabular-nums">{activeLot.lotCode}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#525B54]">Origin Cooperative / Estate</span>
                    <span className="font-semibold text-[#1E201E]">{activeLot.estateName}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#525B54]">Botanical Purity / Karl Fischer Moisture</span>
                    <span className="font-semibold text-[#1E201E] font-mono tabular-nums">
                      {activeLot.purityPercent} · {activeLot.moisturePercent} H₂O
                    </span>
                  </div>
                  <div className="pt-2.5 flex items-center justify-between">
                    <span className="text-[#525B54]">Primary Bio-Active Marker</span>
                    <span className="font-semibold text-[#2D6A4F] font-mono tabular-nums">
                      {activeLot.activeCompound}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Quantitative Proof & Supply Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] mb-1">
                ANALYTICAL PURITY STANDARD
              </div>
              <div className="font-editorial text-[28px] leading-[34px] font-semibold text-[#1E201E] tabular-nums">
                99.91% Mean Assay
              </div>
              <div className="text-[13px] text-[#525B54] mt-1">
                Verified across 42 harvest lots via Zurich ICP-MS &amp; HPLC-DAD testing
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] mb-1">
                PESTICIDE &amp; HEAVY METAL SCREEN
              </div>
              <div className="font-editorial text-[28px] leading-[34px] font-semibold text-[#2D6A4F] tabular-nums">
                0.000 ppm Residue
              </div>
              <div className="text-[13px] text-[#525B54] mt-1">
                510-compound multi-residue gas chromatography non-detect compliance
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] mb-1">
                DIRECT ESTATE COMPENSATION
              </div>
              <div className="font-editorial text-[28px] leading-[34px] font-semibold text-[#1E201E] tabular-nums">
                +38.4% Above Fair-Trade
              </div>
              <div className="text-[13px] text-[#525B54] mt-1">
                Audited farm-gate contracts across 14 partner grower cooperatives
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] mb-1">
                COLD-CHAIN &amp; NITROGEN SEAL
              </div>
              <div className="font-editorial text-[28px] leading-[34px] font-semibold text-[#1E201E] tabular-nums">
                &lt; 72h Post-Assay
              </div>
              <div className="text-[13px] text-[#525B54] mt-1">
                Direct air-cargo dispatch from bonded regional vaults in Lima, Kyoto &amp; Zurich
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HARVEST LOT CATALOG & TECHNICAL FILTER CONTROLS */}
        <section id="harvest-catalog" className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 py-14 border-b border-[#E2DFD7]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#97472E] mb-2">
                01. Certified Botanical Inventory · Autumn/Winter 2026
              </div>
              <h2 className="font-editorial text-[30px] leading-[36px] md:text-[40px] md:leading-[48px] tracking-[-0.015em] font-medium text-[#1E201E]">
                Verified Harvest Lots &amp; Packaging Surfaces
              </h2>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-[#FFFFFF] text-[#1E201E] border border-[#E2DFD7] hover:bg-[#F9F8F4] hover:border-[#1B4332]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Filter Bar showcasing Input Fields, Checkboxes, and Radio Controls from Design Spec */}
          <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Input Field: height 44px, radius 8px, 1px border #E2DFD7 */}
              <div className="md:col-span-5">
                <label
                  htmlFor="catalog-search"
                  className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-1.5"
                >
                  Filter by Botanical Species, Origin Region, or Lot Number
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#525B54] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="catalog-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Criollo, Tencha, Crocus sativus, LOT-PE..."
                    className="w-full h-[44px] bg-[#FFFFFF] border border-[#E2DFD7] rounded-[8px] pl-10 pr-4 text-[15px] text-[#1E201E] terra-focus"
                  />
                </div>
              </div>

              {/* Checkboxes: 18px x 18px, border 1.5px solid #E2DFD7, radius 4px, active #1B4332 */}
              <div className="md:col-span-4 flex flex-col justify-center gap-2.5 md:border-l md:border-[#E2DFD7] md:pl-6">
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54]">
                  Compliance &amp; Moisture Thresholds
                </span>
                <div className="flex flex-wrap items-center gap-5">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-[#1E201E]">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={onlyOrganicCertified}
                      onClick={() => setOnlyOrganicCertified(!onlyOrganicCertified)}
                      className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors ${
                        onlyOrganicCertified
                          ? 'bg-[#1B4332] border-[1.5px] border-[#1B4332] text-white'
                          : 'bg-[#FFFFFF] border-[1.5px] border-[#E2DFD7]'
                      }`}
                    >
                      {onlyOrganicCertified && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                    <span>Organic / Ecocert Verified</span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-[#1E201E]">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={onlyUltraLowMoisture}
                      onClick={() => setOnlyUltraLowMoisture(!onlyUltraLowMoisture)}
                      className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors ${
                        onlyUltraLowMoisture
                          ? 'bg-[#1B4332] border-[1.5px] border-[#1B4332] text-white'
                          : 'bg-[#FFFFFF] border-[1.5px] border-[#E2DFD7]'
                      }`}
                    >
                      {onlyUltraLowMoisture && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                    <span>Moisture &le; 6.0%</span>
                  </label>
                </div>
              </div>

              {/* Radio Controls: 18px x 18px, radius 50%, active #1B4332 */}
              <div className="md:col-span-3 flex flex-col justify-center gap-2.5 md:border-l md:border-[#E2DFD7] md:pl-6">
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54]">
                  Assay Grade Tier
                </span>
                <div className="flex items-center gap-4">
                  {[
                    { id: 'all', label: 'All Tiers' },
                    { id: 'cat1', label: 'Cat I / AAA' },
                    { id: 'ceremonial', label: 'Lab / GC-MS' }
                  ].map((option) => (
                    <label
                      key={option.id}
                      className="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] font-medium text-[#1E201E]"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={gradeFilter === option.id}
                        onClick={() => setGradeFilter(option.id as 'all' | 'cat1' | 'ceremonial')}
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors ${
                          gradeFilter === option.id
                            ? 'bg-[#1B4332] border-[1.5px] border-[#1B4332]'
                            : 'bg-[#FFFFFF] border-[1.5px] border-[#E2DFD7]'
                        }`}
                      >
                        {gradeFilter === option.id && <span className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                      <span className="whitespace-nowrap">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Packaging Surface Cards Grid (2 Columns on Desktop for generous breathing room & tabular specs) */}
          {filteredLots.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-12 text-center">
              <p className="font-editorial text-[22px] text-[#1E201E] mb-2">
                No botanical harvest lots match the current technical filter parameters.
              </p>
              <p className="text-[15px] text-[#525B54] mb-6">
                Reset moisture or assay grade filters to inspect all four certified 2026 harvest lots.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Lots');
                  setSearchQuery('');
                  setOnlyUltraLowMoisture(false);
                  setOnlyOrganicCertified(false);
                  setGradeFilter('all');
                }}
                className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-3 rounded-[8px] cursor-pointer"
              >
                Reset Technical Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLots.map((lot) => {
                const isSelectedForInspection = lot.id === activeLotId;
                return (
                  <article
                    key={lot.id}
                    className={`bg-[#FFFFFF] border rounded-[12px] overflow-hidden flex flex-col justify-between transition-colors ${
                      isSelectedForInspection ? 'border-[#1B4332]' : 'border-[#E2DFD7]'
                    }`}
                  >
                    <div>
                      {/* 4:3 Botanical Imagery Header with Regulatory Badges */}
                      <div className="relative aspect-[16/10] bg-[#F4F4F0] border-b border-[#E2DFD7] overflow-hidden">
                        <img
                          src={lot.image}
                          alt={lot.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-[1.02]"
                        />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                          {/* Batch Code Chip: #F9F8F4 bg, 1px solid #E2DFD7, #525B54 text, label-sm */}
                          <span className="rounded-full px-3 py-1 bg-[#F9F8F4]/95 border border-[#E2DFD7] text-[#525B54] text-[11px] font-semibold uppercase tracking-[0.06em] font-mono">
                            {lot.lotCode}
                          </span>
                          {/* Organic / Origin Verified Pill Badge */}
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#FFFFFF]/95 border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-semibold uppercase tracking-[0.06em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                            {lot.certifications[0]}
                          </span>
                        </div>
                      </div>

                      {/* Card Body: Padding space-lg (1.5rem / 24px) */}
                      <div className="p-6">
                        {/* Header Narrative Segregated by Hairline Rule */}
                        <div className="pb-5 mb-5 border-b border-[#E2DFD7]">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-1.5">
                            <span>{lot.originRegion}</span>
                            <span className="font-mono">{lot.altitudeMeters}</span>
                          </div>
                          <h3 className="font-editorial text-[24px] leading-[30px] font-semibold text-[#1E201E] mb-1">
                            {lot.name}
                          </h3>
                          <p className="text-[13px] italic text-[#525B54] mb-3">{lot.botanicalName}</p>
                          <p className="text-[15px] leading-[22px] text-[#525B54]">{lot.editorialSummary}</p>
                        </div>

                        {/* Traceability Spec List: Alternating Hairline Rows (#E2DFD7) */}
                        <div className="divide-y divide-[#E2DFD7] text-[13px] mb-6 border-b border-[#E2DFD7]">
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-[#525B54]">Estate &amp; Parcel Provenance</span>
                            <span className="font-semibold text-[#1E201E] text-right">{lot.estateName}</span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-[#525B54]">Processing Protocol</span>
                            <span className="font-semibold text-[#1E201E] text-right">{lot.processingMethod}</span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-[#525B54]">Purity &amp; Moisture Assay</span>
                            <span className="font-semibold text-[#1E201E] font-mono tabular-nums">
                              Purity {lot.purityPercent} · Moisture {lot.moisturePercent}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-[#525B54]">Active Compound Standard</span>
                            <span className="font-semibold text-[#2D6A4F] font-mono tabular-nums">
                              {lot.activeCompound}
                            </span>
                          </div>
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <span className="text-[#525B54]">Wholesale Allocation &amp; Pricing</span>
                            <span className="font-semibold text-[#1E201E] font-mono tabular-nums">
                              ${lot.pricePerKgUsd.toFixed(2)} / kg · ({lot.availableBulkKg} kg bonded)
                            </span>
                          </div>
                        </div>

                        {/* Action Bar: Primary (#1B4332), Secondary Outlined (#E2DFD7), Accent Terracotta (#C86D51) */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => addToRequisition(lot, 'bulk')}
                              className="bg-[#1B4332] hover:bg-[#161A17] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Allocate 25kg Bulk
                            </button>
                            <button
                              type="button"
                              onClick={() => addToRequisition(lot, 'sample')}
                              className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Request 250g Sample (${lot.samplePriceUsd})
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLotId(lot.id);
                                document
                                  .getElementById('traceability-ledger')
                                  ?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="bg-[#FFFFFF] hover:bg-[#F9F8F4] text-[#1E201E] border border-[#E2DFD7] hover:border-[#1B4332] text-[13px] font-semibold px-3.5 py-2.5 rounded-[8px] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Inspect Ledger
                            </button>
                            <button
                              type="button"
                              onClick={() => setCoaModalLot(lot)}
                              className="bg-[#FFFFFF] hover:bg-[#F9F8F4] text-[#1E201E] border border-[#E2DFD7] hover:border-[#1B4332] text-[13px] font-semibold px-3 py-2.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                              title="View Lab Certificate of Analysis"
                            >
                              <FileText className="w-4 h-4 text-[#525B54]" />
                              <span>COA</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: INTERACTIVE SUPPLY CHAIN TRACEABILITY LEDGER & LABORATORY SPEC SHEET */}
        <section
          id="traceability-ledger"
          className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 py-14 border-b border-[#E2DFD7]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#2D6A4F] mb-2">
                02. Chain-of-Custody &amp; Laboratory Manifest
              </div>
              <h2 className="font-editorial text-[30px] leading-[36px] md:text-[40px] md:leading-[48px] tracking-[-0.015em] font-medium text-[#1E201E]">
                Interactive Batch Traceability Inspector
              </h2>
            </div>

            {/* Lot Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {BOTANICAL_LOTS.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  onClick={() => setActiveLotId(lot.id)}
                  className={`px-4 py-2.5 rounded-[8px] text-[12px] font-semibold font-mono uppercase tracking-[0.04em] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLot.id === lot.id
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-[#FFFFFF] text-[#525B54] border border-[#E2DFD7] hover:border-[#1B4332] hover:text-[#1E201E]'
                  }`}
                >
                  {lot.lotCode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Columns: Laboratory Assay & Traceability Spec List */}
            <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 mb-5 border-b border-[#E2DFD7]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full px-3 py-1 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[11px] font-semibold uppercase tracking-[0.06em] font-mono">
                      {activeLot.labCertificateId}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-semibold uppercase tracking-[0.06em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                      Assay Cleared {activeLot.labVerifiedDate}
                    </span>
                  </div>
                  <h3 className="font-editorial text-[26px] leading-[32px] font-semibold text-[#1E201E]">
                    {activeLot.name}
                  </h3>
                  <p className="text-[14px] text-[#525B54] mt-0.5">
                    {activeLot.estateName} · {activeLot.originRegion}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadOriginDossier(activeLot)}
                  className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download COA (.TXT)</span>
                </button>
              </div>

              <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54]">
                <span>PARAMETER / ANALYTICAL METHOD</span>
                <span>CERTIFIED RESULT</span>
              </div>

              {/* Traceability Spec List: Alternating hairline rows (#E2DFD7) */}
              <div className="divide-y divide-[#E2DFD7] border-t border-b border-[#E2DFD7] text-[14px] mb-6">
                {activeLot.specs.map((spec) => (
                  <div key={spec.label} className="py-3 flex items-center justify-between gap-4">
                    <span className="text-[#525B54]">{spec.label}</span>
                    <span className="font-semibold text-[#1E201E] font-mono tabular-nums text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Regulatory Pill Badges Reel */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] mb-3">
                  COMPLIANCE &amp; EXPORT CERTIFICATIONS
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeLot.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-semibold uppercase tracking-[0.06em]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: 4-Stage Chronological Agrarian & Processing Custody Log */}
            <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 md:p-8">
              <div className="pb-5 mb-5 border-b border-[#E2DFD7] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] block mb-1">
                    GEOSPATIAL HARVEST &amp; EXTRACTION LOG
                  </span>
                  <h3 className="font-editorial text-[24px] leading-[30px] font-semibold text-[#1E201E]">
                    4-Stage Agrarian Custody Timeline
                  </h3>
                </div>
                <span className="rounded-full px-3 py-1 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[11px] font-mono font-semibold">
                  {activeLot.altitudeMeters}
                </span>
              </div>

              <div className="divide-y divide-[#E2DFD7]">
                {activeLot.supplyChainTimeline.map((step) => (
                  <div key={step.stage} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-[15px] font-semibold text-[#1E201E]">{step.stage}</span>
                      <span className="rounded-full px-2.5 py-0.5 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[11px] font-mono font-semibold">
                        {step.date}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#525B54] mb-2">
                      <span>
                        {step.location} · <strong className="font-medium text-[#1E201E]">{step.operator}</strong>
                      </span>
                      <span className="font-mono text-[12px] text-[#525B54]">{step.coordinates}</span>
                    </div>

                    <div className="bg-[#F9F8F4] border border-[#E2DFD7] rounded-[8px] px-3.5 py-2 flex items-center justify-between text-[12px]">
                      <span className="text-[#525B54] font-medium">{step.metricLabel}</span>
                      <span className="font-mono font-semibold text-[#2D6A4F] tabular-nums">{step.metricValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: AGRO-PROCESSING STANDARDS & ENTERPRISE TESTIMONIAL PROOF */}
        <section
          id="processing-standards"
          className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 py-14 border-b border-[#E2DFD7]"
        >
          <div className="mb-8">
            <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-2">
              03. Agro-Industrial Protocol &amp; Partner Verification
            </div>
            <h2 className="font-editorial text-[30px] leading-[36px] md:text-[40px] md:leading-[48px] tracking-[-0.015em] font-medium text-[#1E201E]">
              Heritage Craftsmanship Meets Analytical Rigor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2DFD7]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54]">
                    PROTOCOL 01 · FERMENTATION
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#1B4332]">±0.2°C Thermal Log</span>
                </div>
                <h3 className="font-editorial text-[22px] leading-[28px] font-semibold text-[#1E201E] mb-3">
                  Anaerobic Hardwood &amp; Solar Parabolic Curing
                </h3>
                <p className="text-[15px] leading-[22px] text-[#525B54]">
                  Raw botanical harvests are stabilized at origin within 4 hours of picking. Digital core probes track
                  enzymatic fermentation kinetics before slow UV-filtered dehydration preserves volatile terpenes.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#E2DFD7] flex items-center justify-between text-[12px] font-mono text-[#525B54]">
                <span>RETENTION INDEX</span>
                <span className="text-[#2D6A4F] font-semibold">+94.2% Volatile Polyphenols</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2DFD7]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54]">
                    PROTOCOL 02 · ZURICH ASSAY
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#1B4332]">ISO/IEC 17025</span>
                </div>
                <h3 className="font-editorial text-[22px] leading-[28px] font-semibold text-[#1E201E] mb-3">
                  GC-MS Fingerprinting &amp; Heavy Metal Clearance
                </h3>
                <p className="text-[15px] leading-[22px] text-[#525B54]">
                  Every export batch undergoes inductively coupled plasma mass spectrometry (ICP-MS) for cadmium, lead,
                  arsenic, and mercury alongside 510-pesticide screening prior to vacuum nitrogen sealing.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-[#E2DFD7] flex items-center justify-between text-[12px] font-mono text-[#525B54]">
                <span>CONTAMINANT TOLERANCE</span>
                <span className="text-[#2D6A4F] font-semibold">Strict Non-Detect (0.000 ppm)</span>
              </div>
            </div>

            {/* Attributable Enterprise Testimonial with Concrete Before/After Outcome */}
            <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2DFD7]">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#97472E]">
                    PARTNER OUTCOME · FORMULATION LAB
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#2D6A4F]">Verified Partner</span>
                </div>
                <blockquote className="font-editorial text-[20px] leading-[28px] text-[#1E201E] mb-4">
                  “Switching our ceremonial tencha and saffron stigma procurement to Terra Pure reduced our incoming
                  quarantine lab rejection rate from 14.5% to 0.0% across 18 consecutive production quarters.”
                </blockquote>
              </div>
              <div className="pt-4 border-t border-[#E2DFD7]">
                <div className="text-[14px] font-semibold text-[#1E201E]">Dr. Lukas Vonlanthen</div>
                <div className="text-[12px] text-[#525B54]">
                  VP of Botanical Sourcing · Helvetia Phyto-Actives AG, Basel
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TERRA PURE DESIGN SYSTEM & MATERIAL SPEC MATRIX */}
        <section id="design-system" className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-2">
                04. System Architecture &amp; Visual Tokens
              </div>
              <h2 className="font-editorial text-[30px] leading-[36px] md:text-[40px] md:leading-[48px] tracking-[-0.015em] font-medium text-[#1E201E]">
                Terra Pure Specification Matrix
              </h2>
            </div>
            <span className="rounded-full px-3.5 py-1 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[11px] font-semibold uppercase tracking-[0.06em] font-mono">
              12-COL FLUID GRID · 1PX HAIRLINE (#E2DFD7)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Palette Tokens Card */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6">
              <div className="pb-4 mb-5 border-b border-[#E2DFD7] flex items-center justify-between">
                <h3 className="font-editorial text-[22px] leading-[28px] font-semibold text-[#1E201E]">
                  Botanical Substrate &amp; Chromatic Palette
                </h3>
                <span className="text-[12px] font-mono text-[#525B54]">Light Mode Default</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  { name: 'Deep Forest', hex: '#1B4332', role: 'Primary Action', dark: true },
                  { name: 'Raw Terracotta', hex: '#C86D51', role: 'Commerce Accent', dark: true },
                  { name: 'Verified Canopy', hex: '#2D6A4F', role: 'Organic Compliance', dark: true },
                  { name: 'Dark Soil', hex: '#161A17', role: 'Industrial Anchor', dark: true },
                  { name: 'Warm Alabaster', hex: '#F9F8F4', role: 'Base Canvas', dark: false },
                  { name: 'Elevated Surface', hex: '#FFFFFF', role: 'Inspection Card', dark: false },
                  { name: 'Hairline Rule', hex: '#E2DFD7', role: '1px Structural Border', dark: false },
                  { name: 'Muted Sage', hex: '#525B54', role: 'Metadata & Specs', dark: true }
                ].map((swatch) => (
                  <div
                    key={swatch.name}
                    className="border border-[#E2DFD7] rounded-[8px] overflow-hidden bg-[#F9F8F4]"
                  >
                    <div
                      className="h-14 px-3 py-2 flex items-end justify-between"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          swatch.dark ? 'text-white' : 'text-[#1E201E]'
                        }`}
                      >
                        {swatch.hex}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#FFFFFF] border-t border-[#E2DFD7]">
                      <div className="text-[13px] font-semibold text-[#1E201E]">{swatch.name}</div>
                      <div className="text-[11px] text-[#525B54]">{swatch.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Component Geometry Card */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-6 flex flex-col justify-between">
              <div>
                <div className="pb-4 mb-5 border-b border-[#E2DFD7] flex items-center justify-between">
                  <h3 className="font-editorial text-[22px] leading-[28px] font-semibold text-[#1E201E]">
                    Typographic Scale &amp; Geometry
                  </h3>
                  <span className="text-[12px] font-mono text-[#525B54]">Playfair + Plus Jakarta</span>
                </div>

                <div className="divide-y divide-[#E2DFD7] text-[13px]">
                  <div className="py-3 flex items-baseline justify-between gap-4">
                    <span className="font-editorial text-[24px] leading-[30px] font-semibold text-[#1E201E]">
                      Playfair Display
                    </span>
                    <span className="font-mono text-[12px] text-[#525B54]">56px / 40px / 28px · -0.02em</span>
                  </div>
                  <div className="py-3 flex items-baseline justify-between gap-4">
                    <span className="font-sans text-[16px] font-semibold text-[#1E201E]">
                      Plus Jakarta Sans
                    </span>
                    <span className="font-mono text-[12px] text-[#525B54]">18px / 15px / 13px · Tabular</span>
                  </div>
                  <div className="py-3 flex items-center justify-between gap-4">
                    <span className="text-[#525B54]">Cards &amp; Packaging Surfaces</span>
                    <span className="font-mono font-semibold text-[#1E201E]">12px (0.75rem) · 1px #E2DFD7</span>
                  </div>
                  <div className="py-3 flex items-center justify-between gap-4">
                    <span className="text-[#525B54]">Buttons &amp; Input Selectors</span>
                    <span className="font-mono font-semibold text-[#1E201E]">8px (0.5rem) · 44px Height</span>
                  </div>
                  <div className="py-3 flex items-center justify-between gap-4">
                    <span className="text-[#525B54]">Regulatory &amp; Batch Badges</span>
                    <span className="font-mono font-semibold text-[#2D6A4F]">9999px Full-Pill Geometry</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2DFD7] flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-[#1B4332] hover:bg-[#161A17] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors cursor-pointer"
                >
                  Primary (#1B4332)
                </button>
                <button
                  type="button"
                  onClick={() => setCoaModalLot(activeLot)}
                  className="bg-[#FFFFFF] hover:bg-[#F9F8F4] text-[#1E201E] border border-[#E2DFD7] hover:border-[#1B4332] text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors cursor-pointer"
                >
                  Technical (#E2DFD7)
                </button>
                <button
                  type="button"
                  onClick={() => downloadOriginDossier(activeLot)}
                  className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors cursor-pointer"
                >
                  Terracotta (#C86D51)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* INDUSTRIAL FOOTER: Dark Soil (#161A17) Anchor */}
      <footer className="bg-[#161A17] text-[#F1F1ED] border-t border-[#1B4332]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#2F312F]">
            <div className="md:col-span-5">
              <div className="font-editorial text-[26px] font-semibold text-white tracking-[-0.02em] mb-3">
                Terra Pure
              </div>
              <p className="text-[14px] leading-[22px] text-[#C1C8C2] max-w-md mb-4">
                Enterprise-to-consumer botanical origin platform. Direct cooperative harvest contracts, low-temperature
                bioprocessing, and Zurich ISO-17025 analytical verification.
              </p>
              <div className="text-[12px] font-mono text-[#86AF99]">
                ZURICH ANALYTICAL HUB · LIMA FERMENTARY · KYOTO MIKAGE MILL
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#86AF99] mb-3">
                ACTIVE HARVEST MANIFESTS
              </div>
              <ul className="space-y-2 text-[13px] text-[#C1C8C2] font-mono">
                {BOTANICAL_LOTS.map((lot) => (
                  <li key={lot.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLotId(lot.id);
                        document.getElementById('traceability-ledger')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {lot.lotCode} · {lot.category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#86AF99] mb-3">
                LABORATORY &amp; EXPORT COMPLIANCE
              </div>
              <p className="text-[13px] leading-[20px] text-[#C1C8C2] mb-4">
                All bulk and sample dispatches include physical Certificate of Analysis (COA), phytosanitary export
                clearance, and EUR.1 origin declarations.
              </p>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer"
              >
                Open Sample &amp; Bulk Desk
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#717973]">
            <span>© 2026 Terra Pure Botanical Supply AG. All harvest lots analytically verified.</span>
            <span className="font-mono">ISO 22000 · USDA ORGANIC · EU ECO-REG 848/21</span>
          </div>
        </div>
      </footer>

      {/* SAMPLE & BULK REQUISITION DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]">
          <div className="w-full max-w-xl bg-[#F9F8F4] h-full border-l border-[#E2DFD7] flex flex-col justify-between overflow-y-auto ambient-popover-shadow">
            <div>
              {/* Drawer Header */}
              <div className="p-6 bg-[#FFFFFF] border-b border-[#E2DFD7] flex items-center justify-between sticky top-0 z-10">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2D6A4F] block">
                    DIRECT ORIGIN DISPATCH DESK
                  </span>
                  <h2 className="font-editorial text-[24px] leading-[30px] font-semibold text-[#1E201E]">
                    Sample &amp; Bulk Allocation Manifest
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-9 h-9 rounded-[8px] border border-[#E2DFD7] bg-[#FFFFFF] hover:bg-[#F9F8F4] flex items-center justify-center text-[#1E201E] cursor-pointer"
                  aria-label="Close requisition desk"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6">
                {submittedManifestId && (
                  <div className="bg-[#FFFFFF] border border-[#2D6A4F] rounded-[12px] p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-semibold uppercase tracking-[0.06em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                        Allocation Reserved
                      </span>
                      <span className="font-mono text-[12px] font-semibold text-[#1E201E]">{submittedManifestId}</span>
                    </div>
                    <p className="text-[14px] text-[#1E201E] font-medium mb-1">
                      Bonded Dispatch Scheduled for {enterpriseName}
                    </p>
                    <p className="text-[13px] text-[#525B54]">
                      Pro-forma invoice, COA packet, and phytosanitary manifest transmitted to{' '}
                      <span className="font-mono text-[#1E201E]">{buyerEmail}</span> ({incoterm} · {destinationPort}).
                    </p>
                  </div>
                )}

                {/* Itemized Lots */}
                <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2DFD7]">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54]">
                      SELECTED HARVEST LOTS ({requisitionItems.length})
                    </span>
                    <span className="text-[11px] font-mono text-[#525B54]">NITROGEN-SEALED POUCH / DRUM</span>
                  </div>

                  {requisitionItems.length === 0 ? (
                    <p className="text-[14px] text-[#525B54] py-6 text-center">
                      No lots currently allocated. Select a 250g Lab Sample or 25kg Bulk Allocation from the catalog.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#E2DFD7]">
                      {requisitionItems.map((item) => {
                        const unitPrice =
                          item.mode === 'sample' ? item.lot.samplePriceUsd : item.lot.pricePerKgUsd;
                        const lineTotal = unitPrice * item.quantityKg;
                        const stepDelta = item.mode === 'sample' ? 1 : 25;

                        return (
                          <div key={`${item.lot.id}-${item.mode}`} className="py-3.5 first:pt-0 last:pb-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="rounded-full px-2.5 py-0.5 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[10px] font-mono font-semibold">
                                    {item.lot.lotCode}
                                  </span>
                                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#97472E]">
                                    {item.mode === 'sample' ? '250g Lab Assay Sample' : 'Bulk Industrial Allocation'}
                                  </span>
                                </div>
                                <div className="text-[15px] font-semibold text-[#1E201E]">{item.lot.name}</div>
                              </div>
                              <div className="font-mono text-[14px] font-semibold text-[#1E201E] tabular-nums">
                                ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[12px] text-[#525B54]">
                              <span className="font-mono">
                                ${unitPrice.toFixed(2)} / {item.mode === 'sample' ? 'unit (250g)' : 'kg'}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateRequisitionQty(item.lot.id, item.mode, -stepDelta)}
                                  className="w-7 h-7 rounded-[6px] border border-[#E2DFD7] bg-[#F9F8F4] hover:border-[#1B4332] flex items-center justify-center text-[#1E201E] cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono font-semibold text-[#1E201E] min-w-[54px] text-center tabular-nums">
                                  {item.quantityKg} {item.mode === 'sample' ? 'unit' : 'kg'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateRequisitionQty(item.lot.id, item.mode, stepDelta)}
                                  className="w-7 h-7 rounded-[6px] border border-[#E2DFD7] bg-[#F9F8F4] hover:border-[#1B4332] flex items-center justify-center text-[#1E201E] cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Enterprise Dispatch Configuration Form */}
                <form
                  id="requisition-form"
                  onSubmit={handleSubmitRequisition}
                  className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] p-5 space-y-4"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#525B54] pb-2 border-b border-[#E2DFD7]">
                    LABORATORY / CONSIGNEE CREDENTIALS
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-1.5">
                      Enterprise or Formulation Lab Entity
                    </label>
                    <input
                      type="text"
                      required
                      value={enterpriseName}
                      onChange={(e) => setEnterpriseName(e.target.value)}
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E2DFD7] rounded-[8px] px-4 text-[15px] text-[#1E201E] terra-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-1.5">
                      Quality Assurance / Procurement Email
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E2DFD7] rounded-[8px] px-4 text-[15px] text-[#1E201E] terra-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-1.5">
                      Bonded Destination Port / Receiving Facility
                    </label>
                    <input
                      type="text"
                      required
                      value={destinationPort}
                      onChange={(e) => setDestinationPort(e.target.value)}
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E2DFD7] rounded-[8px] px-4 text-[15px] text-[#1E201E] terra-focus"
                    />
                  </div>

                  <div>
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.04em] text-[#525B54] mb-2">
                      Commercial Incoterms (2026)
                    </span>
                    <div className="flex items-center gap-5">
                      {(['DDP', 'CIF', 'EXW'] as const).map((term) => (
                        <label
                          key={term}
                          className="inline-flex items-center gap-2 cursor-pointer text-[14px] font-medium text-[#1E201E]"
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={incoterm === term}
                            onClick={() => setIncoterm(term)}
                            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                              incoterm === term
                                ? 'bg-[#1B4332] border-[1.5px] border-[#1B4332]'
                                : 'bg-[#FFFFFF] border-[1.5px] border-[#E2DFD7]'
                            }`}
                          >
                            {incoterm === term && <span className="w-2 h-2 rounded-full bg-white" />}
                          </button>
                          <span className="font-mono">{term}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-[#FFFFFF] border-t border-[#E2DFD7]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-[#525B54]">Estimated Allocation Total (incl. COA &amp; Seal)</span>
                <span className="font-editorial text-[26px] font-semibold text-[#1E201E] tabular-nums">
                  ${totalRequisitionUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button
                type="submit"
                form="requisition-form"
                disabled={requisitionItems.length === 0}
                className="w-full bg-[#1B4332] hover:bg-[#161A17] disabled:opacity-50 text-white text-[15px] font-semibold py-3.5 px-6 rounded-[8px] transition-colors cursor-pointer"
              >
                Confirm Batch Requisition &amp; Generate Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE OF ANALYSIS (COA) INSPECTION MODAL */}
      {coaModalLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]">
          <div className="bg-[#FFFFFF] border border-[#E2DFD7] rounded-[12px] max-w-2xl w-full p-6 md:p-8 ambient-popover-shadow max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-[#E2DFD7]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-full px-3 py-0.5 bg-[#F9F8F4] border border-[#E2DFD7] text-[#525B54] text-[11px] font-mono font-semibold">
                    {coaModalLot.labCertificateId}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 bg-[#2D6A4F]/8 border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-semibold uppercase tracking-[0.06em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                    ISO/IEC 17025 Certified
                  </span>
                </div>
                <h3 className="font-editorial text-[26px] leading-[32px] font-semibold text-[#1E201E]">
                  Analytical Certificate of Analysis
                </h3>
                <p className="text-[13px] text-[#525B54]">
                  {coaModalLot.name} · {coaModalLot.botanicalName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCoaModalLot(null)}
                className="w-9 h-9 rounded-[8px] border border-[#E2DFD7] bg-[#FFFFFF] hover:bg-[#F9F8F4] flex items-center justify-center text-[#1E201E] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#E2DFD7] border-t border-b border-[#E2DFD7] text-[13px] mb-6">
              {coaModalLot.specs.map((spec) => (
                <div key={spec.label} className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-[#525B54]">{spec.label}</span>
                  <span className="font-mono font-semibold text-[#1E201E] tabular-nums">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-[12px] text-[#525B54]">
                Signed: <strong className="text-[#1E201E]">Dr. H. Lindqvist</strong> · Zurich Analytical Quality Lab
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => downloadOriginDossier(coaModalLot)}
                  className="bg-[#C86D51] hover:bg-[#97472E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-[8px] transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official COA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoaModalLot(null)}
                  className="bg-[#1B4332] hover:bg-[#161A17] text-white text-[13px] font-semibold px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
