import React, { useState, useMemo } from 'react';
import { X, Search, FileText, Check, ShieldAlert, Scale, Download, Printer, ExternalLink } from 'lucide-react';

interface RegulatoryComplianceProps {
  activeDoc: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export default function RegulatoryCompliance({ activeDoc, onClose }: RegulatoryComplianceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'privacy' | 'terms'>('privacy');

  // Sync state tab with external triggers
  React.useEffect(() => {
    if (activeDoc) {
      setCurrentTab(activeDoc);
    }
  }, [activeDoc]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = (docType: 'privacy' | 'terms') => {
    const content = docType === 'privacy' ? privacyTextContent : termsTextContent;
    const title = docType === 'privacy' 
      ? "DUMAPICKLE_6200_PRIVACY_POLICY_RA10173.txt" 
      : "DUMAPICKLE_6200_TERMS_OF_SERVICE.txt";
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!activeDoc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 sm:p-6 font-sans">
      <div 
        id="compliance-modal-container"
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Modal Top Ribbon Header */}
        <div className="bg-emerald-950 px-6 py-4.5 border-b-2 border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900 rounded-xl">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                DUMAPICKLE 6200 Compliance Center
              </h2>
              <p className="text-[10px] text-emerald-300 font-medium tracking-wide">
                Official Regulatory Agreements · Negros Oriental Regional League
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="p-1.5 px-3 bg-emerald-900 hover:bg-emerald-850 text-white rounded-lg transition text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => handleDownloadText(currentTab)}
              className="p-1.5 px-3 bg-emerald-900 hover:bg-emerald-850 text-white rounded-lg transition text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              title="Download TXT Copy"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-emerald-900 hover:bg-rose-700 hover:text-white text-emerald-300 rounded-lg transition cursor-pointer"
              title="Close modal"
              id="compliance-close-x"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Doc Tabs & Search Bar */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex bg-slate-200 dark:bg-slate-950 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => { setCurrentTab('privacy'); setSearchQuery(''); }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                currentTab === 'privacy'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🛡️ Privacy Policy (R.A. 10173)
            </button>
            <button
              onClick={() => { setCurrentTab('terms'); setSearchQuery(''); }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                currentTab === 'terms'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              📜 Terms & Standing Rules
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Article Body Content Scroll Pane */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
          {currentTab === 'privacy' ? (
            <div className="space-y-6 text-left selection:bg-emerald-100 selection:text-emerald-950">
              
              {/* PH Data Privacy Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-955 border border-emerald-150 dark:border-emerald-900 rounded-2xl p-4.5 flex gap-3 items-start">
                <ShieldAlert className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Republic Act No. 10173 Compliance Note
                  </h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-normal font-medium">
                    This Privacy Policy is designed in accordance with the <strong>Philippine Data Privacy Act of 2012 (R.A. 10173)</strong>, ensuring that all athletes, court owners, and visitors in Negros Oriental maintain full sovereignty over their personally identifiable information (PII).
                  </p>
                </div>
              </div>

              {/* Dynamic Body Content Highlighter */}
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-5">
                <Highlighter search={searchQuery}>
                  {`### ARTICLE I: GENERAL PROVISIONS & DECLARATION OF POLICY

DumaPickle 6200 (referred to as the "League" or the "Platform") respects and values your data privacy rights. We recognize the importance of securing personal data collected from athletes, court coordinators, facility owners, and temporary spectators within Negros Oriental (including Dumaguete City, Valencia, Sibulan, and surrounding 6200 municipalities).

We pledge to process your personal data adhering strictly to the core transparency principles of transparency, legitimate purpose, and proportionality as instituted under R.A. 10173.

---

### ARTICLE II: INFORMATION COLLECTED, PROCESSED, AND RETAINED

To enable smooth league rankings, match logging, ELO progression, and venue reservations, DumaPickle 6200 collects the following explicit data categories:

1. **Member Identity Credentials:** Full Human Name, Gender Class (Male, Female, or other classifications necessary for division matching), Hometown City/Province, and selected avatar styling configurations.
2. **DUPR Performance Metrics:** Simulated or verified DUPR ratings, ELO history charts, total aggregate Wins, total aggregate Losses, and active match log declarations.
3. **Contact and Session Metadata:** Active mobile telephone numbers, email credentials, security and audit trail logs, IP addresses, and standard operational operator log strings.
4. **Curator Registration Particulars:** Court venue ownership tags, street address locations, facility characteristics (indoor/outdoor, light availability), and hourly currency rental schedules.

All sensitive data is logged into standard local memory matrices under structural variables and stored in client-side secure browser local storage frameworks ('p6200_players', 'p6200_courts', 'p6200_bookings'). No commercial exchange or monetization of your credentials will ever be authorized.

---

### ARTICLE III: PURPOSE OF PERSONAL DATA COLLECTION

All collected datasets are handled exclusively for the following specified, explicit, and legitimate endeavors:
- To coordinate match rankings and live tournament brackets fairly.
- To compute Elo rating dynamics (DUPR increases by +0.05 on match wins and reduces proportionally on match losses).
- To enable athletes to seamlessly request court reservations with verified curators.
- To audit administrative decisions and verify platform integrity through the centralized audit reporting console.
- To allow users to mask their profile information publicly utilizing the "Privacy / Hide" toggler under the athlete registration console.

---

### ARTICLE IV: SECURITY MEASURES & STRUCTURAL INTEGRITY

DumaPickle 6200 implements robust technical, organizational, and physical safeguards designed to secure gathered records from accidental destruction, unauthorized disclosure, or unapproved modification:
1. **Server Proxy Architecture:** All external operations proxy through secured pipelines where keys are isolated away from browsers.
2. **Activity Ledger Audits:** Administrative updates, court purges, user role shifts, and configuration revisions generate instant chronological listings in the System Analytics & Audit logs database, preventing arbitrary profile tampering.
3. **Strict Local Isolation:** Data resides securely in localized state architectures and sandboxed memory layers, conforming with regional cybersecurity best-practices.

---

### ARTICLE V: RIGHTS OF THE DATA SUBJECT

Pursuant to Section 16 of the Philippine Data Privacy Act of 2012, all registered athletes and managers are conferred with the following non-negotiable rights:
- **Right to Access & Inspection:** You may instantly review your entire profile, ranking standing, match records, and bookings in real-time.
- **Right to Rectification:** You can modify your name, rating rating, and gender representation through the profile setup controls.
- **Right to Erasure (To Be Forgotten):** You may request complete deletion of your records. Active SuperAdmins can delete any athlete listing entirely or purge obsolete court metadata, fully clearing all historical rows from local structures.
- **Right to Object / Restrict:** By checking the "Hidden Profile" option inside the database ledger, your standing and details will be masked from public view while preserving structural integrity for rating history.

For inquiries, rectifications, or full erasure execution, you may file an escalation directly with the designated Data Protection Officer at: **privacy@dumapickle-6200.ph**.`}
                </Highlighter>
              </div>

            </div>
          ) : (
            <div className="space-y-6 text-left selection:bg-emerald-100 selection:text-emerald-950">
              
              {/* Standings Rules Banner */}
              <div className="bg-amber-50 dark:bg-amber-955 border border-amber-150 dark:border-amber-900 rounded-2xl p-4.5 flex gap-3 items-start">
                <Check className="w-5 h-5 text-amber-650 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-905 dark:text-amber-300">
                    DUMAPICKLE 6200 Standing Regulation Rules
                  </h4>
                  <p className="text-[10px] text-slate-605 dark:text-slate-300 leading-normal font-medium">
                    This governing framework enforces fair play, sportsmanship, and coordinate safety guidelines within our collective venues in Negros Oriental. Accessing other modules signifies full binding agreement.
                  </p>
                </div>
              </div>

              {/* Terms Body Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-5">
                <Highlighter search={searchQuery}>
                  {`### ARTICLE I: LEAGUE STANDINGS & ELO INTEGRITY

1. **Standard Match Reporting:** All reported scores and matches must reflect authentic physical matches played in authorized Negros Oriental facilities.
2. **Calculation Protocol:** Rankings rely on standard ELO-based mathematical updates. Registered player ratings adjust incrementally:
   - Winners receive a permanent +0.05 increment to their aggregate rating (capped at 6.0 DUPR).
   - Losers receive a proportional decrease of -0.05 ELO points to protect ranking tier divisions.
3. **Prohibition of Fraudulent Submissions:** Log entry of fictional matches, collusive scoring, or rating manipulations is strictly prohibited. Any verified fraudulent logger will be subject to swift suspension, classification modifications, or permanent profile termination by an active SuperAdmin operator.

---

### ARTICLE II: FACILITY BOOKINGS, SURCHARGES, AND FEES

1. **Reservation Commitments:** Court bookings placed via the venue details portal constitute direct, binding reservation request submissions to local court owners (Curators).
2. **Pricing Transparency:** Listed rates in Philippine Pesos (₱) represent active rental structures defined directly by the curators. Players must settle currency fees directly with the venue staff in accordance with selected cycles (hourly or session flat-rates).
3. **Lighting Surcharges:** Play durations that overlap into evenings require adherence to the LED night lighting surcharges where applicable. It is the responsibility of the athlete to check whether a court includes "Evening Lights" prior to reservation requests.
4. **Cancellation Policy:** Standard booking adjustments require a minimum 24-hour notification directly to the court curator. Failure to attend booked slots without notification can result in booking privilege suspensions.

---

### ARTICLE III: MEDICAL WAIVER, RELEASE & LIABILITY DISCLAIMER

1. **Physical Fitness Confirmation:** Pickleball is an fast-paced physical racket sport. Program participants and athletes warrant that they possess high physiological capacity, proper hydration preparation, and appropriate court athletic footwear prior to taking the courts.
2. **Assumption of Risk:** Users knowingly, freely, and voluntarily assume all risks, both known and unknown, associated with court play. DumaPickle 6200 serves strictly as an interactive listing platform and is NOT liable for:
   - Physical injuries, ball strikes, paddle impacts, slips, or cardiovascular strains.
   - Heat exhaustion or dehydration arising from extreme Negros weather parameters.
   - Theft, loss, or physical damage to rackets, bags, garments, or vehicles parked within regional arenas.
3. **Dispute Resolution:** Any on-court dispute regarding line calls, kitchen faults, or scoring arguments must be solved amicably by players on site. Unresolved rank-log disputes may be submitted to the SuperAdmin operator for binding resolution.

---

### ARTICLE IV: ADMINISTRATIVE AUTHORITY & SUPERADMIN OPERATORS

1. **Ultimate Oversight:** SuperAdmin Operators maintain full command over all platform listings. This includes the administrative power to:
   - Purge obsolete or fraudulent court and participant accounts.
   - Overwrite ratings and wins history when correction is demanded by audit results.
   - Override pending owner requests and directly modify court details.
2. **Accountability Logs:** For transparency, every administrative modification—including member profile edits, rating overrides, court purges, and settings updates—is recorded in the System logs chronologically. Users can inspect these lists via the SuperAdmin Analytics page.`}
                </Highlighter>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer Bottom Controls */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-wider font-extrabold">
            <span>Last Updated: May 2026</span>
            <span>·</span>
            <span className="text-emerald-600">Active Regulatory Revision 2.4</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-600/20"
          >
            I Acknowledge Agreements
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline content highlight wrapper for accurate search navigation
interface HighlighterProps {
  search: string;
  children: string;
}

function Highlighter({ search, children }: HighlighterProps) {
  const words = useMemo(() => {
    return children.split('\n');
  }, [children]);

  if (!search) {
    return <div className="leading-relaxed whitespace-pre-wrap">{children}</div>;
  }

  const normalizedSearch = search.toLowerCase();

  return (
    <div className="leading-relaxed whitespace-pre-wrap">
      {words.map((line, lineIdx) => {
        if (!line.toLowerCase().includes(normalizedSearch)) {
          return <p key={lineIdx} className="my-2">{line}</p>;
        }

        // Split line matching query
        const parts = line.split(new RegExp(`(${escapeRegExp(search)})`, 'gi'));
        return (
          <p key={lineIdx} className="my-2">
            {parts.map((part, partIdx) => {
              const isMatch = part.toLowerCase() === normalizedSearch;
              return isMatch ? (
                <mark key={partIdx} className="bg-amber-100 dark:bg-amber-900/60 dark:text-amber-200 text-slate-900 font-bold px-0.5 rounded">
                  {part}
                </mark>
              ) : (
                part
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Flat-text string variables for direct user copy downloads
const privacyTextContent = `DUMAPICKLE 6200 PRIVACY POLICY
In Compliance with the Republic Act No. 10173 (Philippine Data Privacy Act of 2012)
Last Updated: May 2026
--------------------------------------------------

ARTICLE I: GENERAL PROVISIONS & DECLARATION OF POLICY
DumaPickle 6200 (referred to as the "League" or the "Platform") respects and values your data privacy rights. We recognize the importance of securing personal data collected from athletes, court coordinators, facility owners, and temporary spectators within Negros Oriental (including Dumaguete City, Valencia, Sibulan, and surrounding 6200 municipalities).
We pledge to process your personal data adhering strictly to the core transparency principles of transparency, legitimate purpose, and proportionality as instituted under R.A. 10173.

ARTICLE II: INFORMATION COLLECTED, PROCESSED, AND RETAINED
To enable smooth league rankings, match logging, ELO progression, and venue reservations, DumaPickle 6200 collects the following explicit data categories:
1. Member Identity Credentials: Full Human Name, Gender Class, Hometown City/Province, and selected avatar styling configurations.
2. DUPR Performance Metrics: Simulated or verified DUPR ratings, total aggregate Wins, total aggregate Losses, and active match log declarations.
3. Contact and Session Metadata: Active mobile telephone numbers, email credentials, security and audit trail logs.
4. Curator Registration Particulars: Court venue ownership tags, street address locations, facility characteristics, and hourly currency rental schedules.

ARTICLE III: PURPOSE OF PERSONAL DATA COLLECTION
All collected datasets are handled exclusively for the following specified, explicit, and legitimate endeavors:
- To coordinate match rankings and live tournament brackets fairly.
- To compute Elo rating dynamics (DUPR increases by +0.05 on match wins and reduces proportionally on match losses).
- To enable athletes to seamlessly request court reservations with verified curators.
- To audit administrative decisions and verify platform integrity through the centralized audit reporting console.
- To allow users to mask their profile information publicly utilizing the "Privacy / Hide" toggler under the athlete registration console.

ARTICLE IV: SECURITY MEASURES & STRUCTURAL INTEGRITY
DumaPickle 6200 implements robust technical, organizational, and physical safeguards designed to secure gathered records from accidental destruction, unauthorized disclosure, or unapproved modification:
1. Server Proxy Architecture: All operations proxy through secured pipelines where keys are isolated away from browsers.
2. Activity Ledger Audits: Administrative updates, court purges, and settings updates generate instant chronological listings.

ARTICLE V: RIGHTS OF THE DATA SUBJECT
Pursuant to Section 16 of the Philippine Data Privacy Act of 2012, all registered athletes and managers are conferred with the following non-negotiable rights:
- Right to Access & Inspection: You may instantly review your entire profile, ranking standing, match records, and bookings in real-time.
- Right to Rectification: You can modify your name, rating rating, and gender representation through the profile setup controls.
- Right to Erasure: You may request complete deletion of your records.
- Right to Object: By checking the "Hidden Profile" option, your details will be masked from public view.

Designed & Hosted in Negros Oriental, Philippines.
Contact: privacy@dumapickle-6200.ph`;

const termsTextContent = `DUMAPICKLE 6200 TERMS OF SERVICE & REGULATIONS
Last Updated: May 2026
--------------------------------------------------

ARTICLE I: LEAGUE STANDINGS & ELO INTEGRITY
1. Standard Match Reporting: All reported scores and matches must reflect authentic physical matches played in authorized Negros Oriental facilities.
2. Calculation Protocol: Rankings rely on standard ELO-based mathematical updates. Player ratings adjust incrementally:
   - Winners receive a permanent +0.05 increment to their aggregate rating (capped at 6.0 DUPR).
   - Losers receive a proportional decrease of -0.05 ELO points to protect ranking tier divisions.
3. Prohibition of Fraudulent Submissions: Log entry of fictional matches, collusive scoring, or rating manipulations is strictly prohibited. Any verified fraudulent logger will be subject to swift suspension or permanent profile termination by an active SuperAdmin operator.

ARTICLE II: FACILITY BOOKINGS, SURCHARGES, AND FEES
1. Reservation Commitments: Court bookings placed via the venue details portal constitute direct, binding reservation request submissions to local court owners.
2. Pricing Transparency: Listed rates in Philippine Pesos (₱) represent active rental structures defined directly by the curators. Players must settle currency fees directly with the venue staff.
3. Lighting Surcharges: Play durations that overlap into evenings require adherence to the LED night lighting surcharges where applicable.
4. Cancellation Policy: Standard booking adjustments require a minimum 24-hour notification directly to the court curator.

ARTICLE III: MEDICAL WAIVER, RELEASE & LIABILITY DISCLAIMER
1. Physical Fitness Confirmation: Pickleball is an fast-paced physical racket sport. Program participants and athletes warrant that they possess high physiological capacity prior to taking the courts.
2. Assumption of Risk: Users knowingly, freely, and voluntarily assume all risks, both known and unknown, associated with court play. DumaPickle 6200 serves strictly as an interactive listing platform and is NOT liable for any direct, indirect, or accidental injuries, ball strikes, or physical altercations.
3. Dispute Resolution: Any on-court dispute regarding line calls, kitchen faults, or scoring arguments must be solved amicably by players on site.

ARTICLE IV: ADMINISTRATIVE AUTHORITY & SUPERADMIN OPERATORS
1. Ultimate Oversight: SuperAdmin Operators maintain full command over all platform listings.
2. Accountability Logs: For transparency, every administrative modification is recorded in the System logs chronologically.

DUMAPICKLE 6200 Regional League Division
Negros Oriental, Region 7, Philippines`;
