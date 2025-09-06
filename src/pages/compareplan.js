"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaCrown, FaBolt, FaShieldAlt, FaStar } from "react-icons/fa";
import { FiCheck, FiChevronDown, FiEye } from "react-icons/fi";
import Modal from "@/components/modal";

/* ----------------- Generic helpers ----------------- */
const toNum = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const clean = String(val).trim();
  if (/^\s*1\s*cr/i.test(clean)) return 100;
  return Number(clean.replace(/,/g, "").replace(/[^\d.]/g, "") || 0);
};

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(toNum(n));

const formatCoverage = (val) => {
  const n = toNum(val);
  return n === 100 ? "1 Cr" : `${n} Lakh`;
};

const getCheapestPremium = (plans) =>
  Array.isArray(plans) && plans.length
    ? Math.min(...plans.map((p) => toNum(p.premium)))
    : 0;

const allEqual = (arr) =>
  Array.isArray(arr) && arr.length ? arr.every((v) => v === arr[0]) : true;

const buildDiffMask = (plans, rows) => {
  const mask = {};
  rows.forEach((r) => {
    const vals = plans.map((p) => r.render(p));
    mask[r.key] = !allEqual(vals);
  });
  return mask;
};

const getPlanKey = (p) =>
  `${String(p?.productname || "")}|${String(p?.coverage || p?.idv || "")}|${String(
    p?.premium || ""
  )}`;

const isInternalHref = (href) => typeof href === "string" && href.startsWith("/");
const getBuyHref = (p) => {
  if (p?.route && isInternalHref(p.route)) return p.route;
  return p?.buyLink || "";
};

/* Convert various addon shapes → array<string> */
const addonsToArray = (addons) => {
  if (!addons) return [];
  if (Array.isArray(addons)) return addons.filter(Boolean).map(String);
  if (typeof addons === "object") {
    return Object.entries(addons)
      .filter(([, v]) => !!v)
      .map(([k]) => String(k));
  }
  const s = String(addons).trim();
  if (!s) return [];
  return s.split(/[|,]/).map((x) => x.trim()).filter(Boolean);
};

/* ----------------- Normalizers ----------------- */
const normalizeHealth = (p) => ({
  type: "health",
  company: p.company || p.insurer || "",
  productname: p.productname || p.planname || p.title || "",
  premium: p.premium ?? p.premiumAmount ?? "",
  coverage: p.coverage ?? p.sumInsured ?? "",
  tenure: p.tenure ?? p.policyTerm ?? "",
  features: {
    room: p.features?.room ?? p.room ?? "",
    preExisting: p.features?.preExisting ?? p.preExisting ?? p.ped ?? "",
    zeroDep: undefined,
    ncb: undefined,
  },
  addons: addonsToArray(p.addons),
  logo: p.logo || p.logoUrl || "",
  route: p.route || p.buyLink || "",
  buyLink: p.buyLink || "",
  id: p.id,
  popular: !!p.popular,
  recommended: !!p.recommended,
});

const normalizeMotor = (p) => ({
  type: "motor",
  company: p.company || p.insurer || p.title || "",
  productname: p.productname || p.title || "",
  premium: p.premium ?? p.minrange ?? p.price ?? "",
  idv: p.idv ?? p.IDV ?? "",
  tenure: p.tenure ?? p.coverd ?? p.policyTerm ?? "",
  features: {
    zeroDep:
      p.features?.zeroDep ??
      p.zeroDep ??
      p.addons?.zeroDep ??
      p.addons?.["Zero Depreciation"] ??
      false,
    ncb: p.features?.ncb ?? p.ncbPercent ?? p.ncb ?? p.addons?.ncbPercent ?? undefined,
    room: undefined,
    preExisting: undefined,
  },
  addons: addonsToArray(p.addons),
  logo: p.logo || p.logoUrl || "",
  route: p.route || p.buyLink || "",
  buyLink: p.buyLink || "",
  id: p.id,
  popular: !!p.popular,
  recommended: !!p.recommended,
});

/* Infer type from data if not provided */
const inferTypeFromPlans = (arr) => {
  if (!Array.isArray(arr) || !arr.length) return "health";
  const one = arr[0];
  if ("idv" in one || "IDV" in one) return "motor";
  if ("coverage" in one || "sumInsured" in one) return "health";
  if ("title" in one && !("coverage" in one)) return "motor";
  return "health";
};

/* ----------------- Logo + Buttons ----------------- */
function Logo({ src, alt = "logo", className = "h-8 w-auto" }) {
  const finalSrc =
    typeof src === "string" && src.startsWith("http")
      ? src
      : `/images/health/vendorimage/${src || ""}`; // TODO: switch folder for motor if you store separately
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/images/health/placeholder-logo.svg";
      }}
    />
  );
}

function BuyNowButton({ href, className = "", children = "Buy Now" }) {
  if (!href) {
    return (
      <button type="button" disabled className={`pointer-events-none opacity-60 ${className}`}>
        {children}
      </button>
    );
  }
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/* --------------- Row builders per product type --------------- */
function buildHealthRows({ onOpenAddons, highestCoverage }) {
  return [
    {
      key: "coverage",
      label: "Coverage",
      render: (p) => formatCoverage(p.coverage),
      highlight: (p) => toNum(p.coverage) === highestCoverage,
      pretty: (p) => formatCoverage(p.coverage),
    },
    {
      key: "room",
      label: "Room Rent",
      render: (p) => (p.features && p.features.room) || "—",
      pretty: (p) => (p.features && p.features.room) || "—",
    },
    {
      key: "preExisting",
      label: "Pre-Existing Coverage",
      render: (p) => (p.features && p.features.preExisting) || "—",
      pretty: (p) => (p.features && p.features.preExisting) || "—",
    },
    {
      key: "addons",
      label: "Add-ons",
      render: (p) =>
        Array.isArray(p.addons) && p.addons.length
          ? p.addons.slice().sort().join(" | ")
          : "—",
      pretty: (p) => {
        const count = Array.isArray(p.addons) ? p.addons.length : 0;
        return count ? (
          <button
            type="button"
            onClick={() => onOpenAddons(p)}
            className="inline-flex items-center gap-2 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full hover:bg-indigo-50 text-xs font-medium"
            title="View add-ons"
          >
            <FiEye className="h-4 w-4" />
            View ({count})
          </button>
        ) : (
          <span className="text-xs italic text-slate-400">No add-ons</span>
        );
      },
    },
  ];
}

function buildMotorRows({ onOpenAddons, highestIDV }) {
  return [
    {
      key: "idv",
      label: "IDV",
      render: (p) => (p.idv ? `₹${formatINR(p.idv)}` : "—"),
      highlight: (p) => toNum(p.idv) === highestIDV,
      pretty: (p) => (p.idv ? `₹${formatINR(p.idv)}` : "—"),
    },
    {
      key: "zeroDep",
      label: "Zero Depreciation",
      render: (p) => {
        const val = p.features?.zeroDep;
        return val ? "Yes" : "No";
      },
      pretty: (p) => {
        const val = p.features?.zeroDep;
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              val ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {val ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      key: "ncb",
      label: "NCB",
      render: (p) => {
        const ncb = p.features?.ncb;
        if (ncb == null || ncb === "") return "—";
        const num = toNum(ncb);
        return num ? `${num}%` : String(ncb);
      },
      pretty: (p) => {
        const ncb = p.features?.ncb;
        if (ncb == null || ncb === "") return "—";
        const num = toNum(ncb);
        return num ? `${num}%` : String(ncb);
      },
    },
    {
      key: "addons",
      label: "Add-ons",
      render: (p) =>
        Array.isArray(p.addons) && p.addons.length
          ? p.addons.slice().sort().join(" | ")
          : "—",
      pretty: (p) => {
        const count = Array.isArray(p.addons) ? p.addons.length : 0;
        return count ? (
          <button
            type="button"
            onClick={() => onOpenAddons(p)}
            className="inline-flex items-center gap-2 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full hover:bg-indigo-50 text-xs font-medium"
            title="View add-ons"
          >
            <FiEye className="h-4 w-4" />
            View ({count})
          </button>
        ) : (
          <span className="text-xs italic text-slate-400">No add-ons</span>
        );
      },
    },
  ];
}

/* ----------------- Page ----------------- */
export default function ComparePage() {
  const [plans, setPlans] = useState([]);
  const [type, setType] = useState("health"); // "health" | "motor"
  const [diffOnly, setDiffOnly] = useState(false);

  const [addonsModal, setAddonsModal] = useState({ open: false, plan: null });

  // Load + normalize plans
  useEffect(() => {
    if (typeof window === "undefined") return;

    const qsType = new URLSearchParams(window.location.search).get("type");
    const ssType = sessionStorage.getItem("compareType");
    const t = (qsType || ssType || "health").toLowerCase();

    const typedKey = `comparePlans:${t}`;
    const rawTyped = sessionStorage.getItem(typedKey);
    const rawLegacy = sessionStorage.getItem("comparePlans");

    let parsed = [];
    try {
      if (rawTyped) parsed = JSON.parse(rawTyped);
      else if (rawLegacy) parsed = JSON.parse(rawLegacy);
    } catch (e) {
      console.warn("Could not parse compare plans:", e);
    }

    let finalType = t;
    if (!qsType && !ssType) {
      finalType = inferTypeFromPlans(parsed);
    }
    setType(finalType);

    const normalized =
      finalType === "motor" ? parsed.map(normalizeMotor) : parsed.map(normalizeHealth);

    setPlans(normalized);
  }, []);

  const cheapestPremium = useMemo(() => getCheapestPremium(plans), [plans]);

  const highestCoverage = useMemo(() => {
    if (type !== "health") return 0;
    const nums = plans.map((p) => toNum(p.coverage));
    return nums.length ? Math.max(...nums) : 0;
  }, [plans, type]);

  const highestIDV = useMemo(() => {
    if (type !== "motor") return 0;
    const nums = plans.map((p) => toNum(p.idv));
    return nums.length ? Math.max(...nums) : 0;
  }, [plans, type]);

  const rows = useMemo(() => {
    const onOpenAddons = (p) => setAddonsModal({ open: true, plan: p });
    return type === "motor"
      ? buildMotorRows({ onOpenAddons, highestIDV })
      : buildHealthRows({ onOpenAddons, highestCoverage });
  }, [type, highestCoverage, highestIDV]);

  const diffMask = useMemo(() => buildDiffMask(plans, rows), [plans, rows]);

  const handleProceedBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    const fallback =
      (typeof window !== "undefined" && sessionStorage.getItem("compareBack")) ||
      (type === "motor" ? "/motor" : "/health/common/illness");
    window.location.href = fallback;
  };

  if (!plans.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 italic">
        No plans selected for comparison.
      </div>
    );
  }

  const title =
    type === "motor" ? "Compare Motor Insurance Plans" : "Compare Health Insurance Plans";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      {/* Add-ons Modal */}
      <Modal
        isOpen={addonsModal.open}
        onClose={() => setAddonsModal({ open: false, plan: null })}
        title={`${addonsModal.plan?.productname || "Plan"} — Add-ons`}
        showCancelButton={false}
        showConfirmButton={false}
        width="max-w-2xl"
      >
        {Array.isArray(addonsModal.plan?.addons) && addonsModal.plan.addons.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {addonsModal.plan.addons.map((a, i) => (
              <li
                key={`${a}-${i}`}
                className="flex items-start gap-2 bg-indigo-50 text-indigo-900 px-3 py-2 rounded-md"
              >
                <FaCheckCircle className="text-green-600 mt-0.5" />
                <span className="text-sm font-medium">{a}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-500 italic">No add-ons available.</div>
        )}
      </Modal>

      {/* Hero / Summary */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_10%_0%,rgba(59,130,246,0.15),transparent),radial-gradient(600px_200px_at_90%_0%,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative px-4 md:px-10 lg:px-16 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center drop-shadow-sm">
            {title}
          </h1>

          {/* Plan chips */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {plans.map((p) => {
              const isCheapest = toNum(p.premium) === cheapestPremium;
              const buyHref = getBuyHref(p);
              return (
                <div
                  key={p.id ?? getPlanKey(p)}
                  className="group rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow hover:shadow-lg transition p-4 flex items-center gap-4"
                >
                  <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                    <Logo src={p.logo} alt={p.company} className="h-7 w-auto object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {p.productname}
                    </div>
                    <div className="text-xs text-indigo-700 font-bold">
                      ₹{p.premium}
                      {isCheapest && (
                        <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          <FaBolt className="h-3 w-3" />
                          Best Value
                        </span>
                      )}
                      {p.popular && (
                        <span className="ml-2 inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                          <FaStar className="h-3 w-3" />
                          Most Popular
                        </span>
                      )}
                      {p.recommended && !isCheapest && (
                        <span className="ml-2 inline-flex items-center gap-1 text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                          <FaCrown className="h-3 w-3" />
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>

                  <BuyNowButton
                    href={buyHref}
                    className="text-xs font-semibold rounded-lg px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700"
                  />
                </div>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setDiffOnly((v) => !v)}
              className={`inline-flex items-center gap-2 text-sm font-semibold rounded-full px-4 py-2 border transition ${
                diffOnly
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/80 text-slate-700 border-slate-200 hover:shadow"
              }`}
            >
              {diffOnly ? <FiCheck /> : <FiChevronDown />}
              {diffOnly ? "Showing Differences" : "Show Differences Only"}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet table */}
      <div className="hidden md:block px-4 md:px-10 lg:px-16 pb-28">
        <div className="overflow-x-auto rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-slate-200">
          <table className="min-w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="sticky top-0 z-10">
                <th className="bg-gradient-to-r from-sky-200 to-indigo-200 sticky left-0 p-5 font-bold text-slate-800 text-left rounded-tl-3xl shadow-md">
                  Features
                </th>
                {plans.map((p) => {
                  const buyHref = getBuyHref(p);
                  return (
                    <th key={p.id ?? getPlanKey(p)} className="p-5 text-center border-l bg-gradient-to-b from-white to-slate-50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200">
                          <Logo src={p.logo} alt={p.company} className="h-8 object-contain" />
                        </div>
                        <p className="font-bold text-blue-900 text-sm text-center">{p.productname}</p>
                        <p className={`font-extrabold text-xl ${toNum(p.premium) === cheapestPremium ? "text-emerald-600" : "text-indigo-700"}`}>
                          ₹{p.premium}
                        </p>
                        <BuyNowButton
                          href={buyHref}
                          className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow"
                        />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Premium row */}
              {!diffOnly && (
                <tr className="hover:bg-sky-50/50">
                  <td className="p-4 font-semibold sticky left-0 bg-white/70">Annual Premium</td>
                  {plans.map((p) => (
                    <td
                      key={p.id ?? getPlanKey(p)}
                      className={`p-4 text-center font-bold ${toNum(p.premium) === cheapestPremium ? "text-emerald-600" : "text-slate-700"}`}
                    >
                      ₹{p.premium}
                    </td>
                  ))}
                </tr>
              )}

              {/* Dynamic rows */}
              {(type === "motor"
                ? buildMotorRows({ onOpenAddons: (p) => setAddonsModal({ open: true, plan: p }), highestIDV })
                : buildHealthRows({ onOpenAddons: (p) => setAddonsModal({ open: true, plan: p }), highestCoverage })
              )
                .filter((r) => (diffOnly ? diffMask[r.key] : true))
                .map((r, idx) => (
                  <tr key={r.key} className={idx % 2 ? "bg-sky-50/40 hover:bg-sky-100/40" : "hover:bg-sky-50/40"}>
                    <td className={`p-4 font-semibold sticky left-0 ${idx % 2 ? "bg-sky-100/70" : "bg-white/70"}`}>
                      {r.label}
                    </td>
                    {plans.map((p) => {
                      const visual = r.pretty ? r.pretty(p) : r.render(p);
                      const isHighlight = r.highlight ? r.highlight(p) : false;
                      return (
                        <td
                          key={p.id ?? getPlanKey(p)}
                          className={`p-4 text-center ${isHighlight ? "bg-emerald-50 text-emerald-700 font-semibold rounded-lg" : ""}`}
                        >
                          {visual}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky CTA (desktop) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-2xl border border-indigo-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-sm md:text-base font-semibold text-slate-800">
              Secure your {type === "motor" ? "vehicle" : "health"} with the right protection.
              <span className="ml-2 text-indigo-700">Compare plans & proceed to buy.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center text-xs text-slate-500 gap-2">
                <FaShieldAlt className="text-emerald-600" />
                Trusted insurers • Quick purchase
              </div>
              <button
                type="button"
                onClick={handleProceedBack}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-5 py-2 shadow"
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden px-4 pb-8">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => setDiffOnly((v) => !v)}
            className={`inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 border transition ${
              diffOnly ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            {diffOnly ? <FiCheck /> : <FiChevronDown />}
            {diffOnly ? "Differences" : "Differences Only"}
          </button>
        </div>

        <div className="grid gap-6">
          {plans.map((p) => {
            const buyHref = getBuyHref(p);
            return (
              <div key={p.id ?? getPlanKey(p)} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-5 relative">
                {(p.recommended || p.popular) && (
                  <span className="absolute -top-3 right-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-[10px] px-2 py-1 rounded-full shadow-md">
                    {p.popular ? "Most Popular" : "Recommended"}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-2 rounded-xl shadow border border-slate-200">
                    <Logo src={p.logo} alt={p.company} className="h-8 w-auto" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-sm">{p.productname}</p>
                    <p className={`font-extrabold text-lg ${toNum(p.premium) === cheapestPremium ? "text-emerald-600" : "text-indigo-700"}`}>
                      ₹{p.premium}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {!diffOnly && (
                    <p>
                      <span className="font-semibold">Premium:</span> ₹{p.premium}
                    </p>
                  )}

                  {type === "motor" ? (
                    <>
                      <p>
                        <span className="font-semibold">IDV:</span> {p.idv ? `₹${formatINR(p.idv)}` : "—"}
                      </p>
                      <p>
                        <span className="font-semibold">Zero Depreciation:</span>{" "}
                        {p.features?.zeroDep ? "Yes" : "No"}
                      </p>
                      <p>
                        <span className="font-semibold">NCB:</span>{" "}
                        {(() => {
                          const ncb = p.features?.ncb;
                          if (ncb == null || ncb === "") return "—";
                          const num = toNum(ncb);
                          return num ? `${num}%` : String(ncb);
                        })()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span className="font-semibold">Coverage:</span> {formatCoverage(p.coverage)}
                      </p>
                      <p>
                        <span className="font-semibold">Room Rent:</span> {p.features?.room || "—"}
                      </p>
                      <p>
                        <span className="font-semibold">Pre-existing:</span> {p.features?.preExisting || "—"}
                      </p>
                    </>
                  )}

                  <div>
                    <span className="font-semibold">Add-ons:</span>{" "}
                    {Array.isArray(p.addons) && p.addons.length ? (
                      <button
                        type="button"
                        onClick={() => setAddonsModal({ open: true, plan: p })}
                        className="inline-flex items-center gap-1 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full hover:bg-indigo-50 text-xs font-medium ml-1"
                      >
                        <FiEye className="h-4 w-4" />
                        View ({p.addons.length})
                      </button>
                    ) : (
                      <span className="text-xs italic text-slate-400 ml-1">No add-ons</span>
                    )}
                  </div>
                </div>

                <BuyNowButton
                  href={buyHref}
                  className="w-full mt-4 block text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
