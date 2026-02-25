## 2026-02-24 10:36 +0100 - Hero: Inhalte und Bullet-Overlay angepasst
- Hero-Headline, Subheadline und primären CTA-Text gemäß Vorgabe aktualisiert.
- Sekundären CTA-Text `Leistungen ansehen` unverändert beibehalten.
- Bulletpoints als echte HTML-Liste (`ul/li`) in ein Overlay unten rechts über der Hero-Animation verschoben.
- Responsives Verhalten ergänzt: Overlay wird auf mobilen Viewports unter die Animation gestackt.
- Trust-Ribbon-Text auf `Individuell entwickelt · Festpreis · Keine versteckten Kosten · Berlin-basiert` angepasst.
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
- Verifikation (Commands):
  - `rg -n "Wenn gewachsene Excel-Prozesse kritisch werden|Kostenfreies Erstgespräch zur Prozessmodernisierung|Berlin-basiert|hero-points-overlay" components/hero.html css/styles.css`
  - `git diff -- components/hero.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 11:06 +0100 - Hero auf Full-Bleed-Background refactored
- Hero von Split-Layout auf Full-Bleed-Animation im Hintergrund umgestellt.
- Textbereich als zentraler Container davor gesetzt; Lesbarkeit über dezentes Overlay erhöht.
- H1/Subheadline/CTA/Microcopy gemäß Vorgabe aktualisiert.
- Bulletpoints als `ul/li` ohne sichtbaren Kasten in den Content-Container integriert.
- Hero-spezifische Alt-Styles entfernt (`hero-grid`, Overlay-Panel, doppelte mobile Hero-Caps).
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Excel-Wildwuchs stabilisieren|Erstgespräch buchen|Kostenfrei · 30 Min · unverbindlich|hero-bg|hero-points" components/hero.html css/styles.css`
  - `git diff -- components/hero.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 11:22 +0100 - Hero: Overlay entfernt, Full-Height, tsParticles-Netzwerk
- Dunkles Hero-Overlay entfernt; Hintergrund wirkt wieder deutlich heller.
- Hero auf Full-Height zurückgestellt (`min-height: 100vh`) und Content-Spacing angepasst.
- Alte manuelle Canvas-Hero-Animation ersetzt durch tsParticles (`@tsparticles/engine` + `@tsparticles/slim` via ESM CDN).
- Animation dezent konfiguriert (langsame Bewegung, dünne Linien, moderate Dichte; auf Mobile ruhiger).
- `prefers-reduced-motion` berücksichtigt (Bewegung stark reduziert/gestoppt).
- Hero-spezifische Alt-Styles/Strukturen für alte Canvas/Fallback-Overlay entfernt.
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "network-bg|Excel-Wildwuchs stabilisieren|Erstgespräch buchen|min-height:100vh|tsparticles|prefers-reduced-motion" components/hero.html css/styles.css js/main.js`
  - `git diff -- components/hero.html css/styles.css js/main.js CHANGES_CODEX.md`

## 2026-02-24 11:31 +0100 - Hero Frosted Glass Optimierung
- Hero-Textbereich um eine dezente `hero-glass`-Fläche ergänzt (halbtransparent, ohne harten Kastenstil).
- Progressive Enhancement umgesetzt: Standard mit transluzentem Hintergrund, Blur nur bei Support via `@supports`.
- `backdrop-filter` und `-webkit-backdrop-filter` für Safari im Hero-Textcontainer ergänzt.
- Hero bleibt Full-Height (`min-height: 100vh`), Mobile-Padding für Lesbarkeit angepasst.
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-glass|data-testid='hero-glass'|backdrop-filter|-webkit-backdrop-filter|min-height:100vh" components/hero.html css/styles.css`
  - `git diff -- components/hero.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 11:39 +0100 - Hero Lesbarkeit: Text-Shield + leichtes Overlay
- Sichtbaren Hero-Panel/Kasten entfernt (`hero-glass` entfällt), Content bleibt ohne Card-Anmutung.
- Textnahen Shield ergänzt (`hero-text-shield`): weiches Gradient via `::before` + optionales Backdrop-Blur (progressive enhancement).
- Leichtes helles Overlay über dem Animationslayer ergänzt (`hero-soft-overlay`) zur Beruhigung der Bewegung.
- Netzwerk-Animation weiter reduziert: geringere Dichte, langsamere Bewegung, niedrigere Node-/Line-Opacity.
- Mobile zusätzlich beruhigt (niedrigere Canvas-Opacity, angepasster Shield-Inset).
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-text-shield|hero-soft-overlay|hero-bg canvas|network-bg|speed =|density =|opacity: \{ value" components/hero.html css/styles.css js/main.js`
  - `git diff -- components/hero.html css/styles.css js/main.js CHANGES_CODEX.md`

## 2026-02-24 11:46 +0100 - Hero Textblock transparent gesetzt
- Hintergrund/Shield des Hero-Textblocks entfernt (`hero-text-shield` ohne Pseudo-Element).
- Headline, Subheadline und Bulletpoints stehen nun auf transparentem Hintergrund.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-text-shield|::before" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 11:52 +0100 - Hero Overlay dezent dunkel
- Hero-Overlay auf dezentes dunkles Overlay umgestellt (`rgba(0,0,0,0.05)`).
- Mobile leicht angepasst (`rgba(0,0,0,0.06)`) für stabile Lesbarkeit.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-soft-overlay|rgba\(0,0,0,.05\)|rgba\(0,0,0,.06\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 11:58 +0100 - Hero Typografie und vertikale Abstände feinjustiert
- Hero-Titel auf größeren Viewports auf eine Zeile gesetzt (`white-space: nowrap`), auf kleineren Viewports wieder normal umbrechbar.
- Vertikale Abstände im Hero vergrößert:
  - zwischen Title und Subtitle
  - zwischen Subtitle und Bulletpoints
  - zwischen Bulletpoints und Buttons
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-copy \\.display|hero-copy \\.lead|hero-points|cta-row" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 12:03 +0100 - Hero Abstand Bullets zu Buttons angepasst
- Abstand zwischen Bulletpoints und Buttons im Hero auf Desktop auf `40px` erhöht.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-points\{.*40px|hero-points" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 12:07 +0100 - Hero Abstand Subtitle zu Bulletpoints auf 40px
- Desktop-Abstand zwischen Subtitle und Bulletpoints im Hero auf `40px` erhöht.
- Mobile-Abstand bewusst kompakter belassen (`1.25rem`) für bessere Lesbarkeit auf kleinen Screens.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-copy \\.lead\{margin:0 0 40px\}|hero-copy \\.lead\{margin:0 0 1.25rem\}" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 12:13 +0100 - Hero Titel explizit in zwei Zeilen gesetzt
- Hero-H1 mit expliziten Zeilen (`hero-title-line`) umgesetzt:
  - Zeile 1: `Gewachsene Tools`
  - Zeile 2: `professionell weiterentwickeln`
- `white-space: nowrap` beim Hero-Titel entfernt, damit der gewünschte Umbruch sicher greift.
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-title-line|Gewachsene Tools|professionell weiterentwickeln|hero-copy \\.display" components/hero.html css/styles.css`
  - `git diff -- components/hero.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 12:18 +0100 - Navbar-Logo auf assets/logo.svg korrigiert
- JS-Logo-Fix getrennt: Navbar/Brand-Logo wird auf `/assets/logo.svg` gesetzt.
- Footer-Logo bleibt korrekt auf `/assets/footer-logo.svg`.
- Geänderte Dateien:
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "assets/logo\.svg|assets/footer-logo\.svg|fixLogo" js/main.js components/header.html components/footer.html`
  - `git diff -- js/main.js CHANGES_CODEX.md`

## 2026-02-24 12:25 +0100 - Neue Symptome/Reifegrad-Sektion unter Hero
- Neue statische Partial-Datei `components/symptome.html` erstellt.
- Section enthält: Titel + Einleitung, 4-stufige Reifegrad-Skala, „Typisch ab Stufe 3“-Diagnoseblöcke, Abschlusszeile + dezenten Link-CTA.
- Stufe 3 („Kritisches System“) visuell leicht betont.
- Einbindung direkt unter dem Hero über bestehendes `data-include`-Pattern ergänzt.
- Isolierte Styles für die neue Sektion ergänzt (Desktop horizontal, Mobile vertikal/gestapelt), ohne Card-Optik.
- Geänderte Dateien:
  - `components/symptome.html`
  - `index.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "symptome|data-include=\"components/symptome.html\"|Von Hilfstool zur Anwendung" components/symptome.html index.html css/styles.css`
  - `git diff -- components/symptome.html index.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 12:55 +0100 - Symptome-Sektion Optimierung: Skala, Titel, CTA
- Titel auf `Vom Tool zum System.` geändert und dekorative Unterstreichung in dieser Sektion entfernt.
- Reifegrad-Skala visuell korrigiert:
  - Linie durch Kreismitten ausgerichtet
  - Stufen 1/2 als schwächeres Outline, Stufe 3 gefüllt (CI), Stufe 4 stärkeres Outline
  - Desktop-Pfeil am Linienende ergänzt.
- Mobile-Vertikalvariante überarbeitet:
  - durchgehende vertikale Linie mit Pfeil nach unten
  - Punkte mittig auf der Linie, Labels rechts sauber ausgerichtet.
- Vertikale Abstände erhöht (Titel→Intro, Intro→Skala, Skala→Kicker, Diagnose→Abschlusssatz).
- Abschlusssatz stärker gewichtet (größer + semibold) und mit mehr Abstand platziert.
- Textlink-CTA durch Primary-Button ersetzt: `Prozess prüfen lassen`.
- Geänderte Dateien:
  - `components/symptome.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Vom Tool zum System|symptome-scale::before|symptome-scale::after|is-critical|symptome-outro|symptome-cta" components/symptome.html css/styles.css`
  - `git diff -- components/symptome.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 13:07 +0100 - Symptome-Skala Ausrichtung + Titelstil korrigiert
- Reifegrad-Skala so angepasst, dass Nodes auf Desktop exakt auf der horizontalen Linie sitzen (Padding-Offset entfernt).
- Symptome-Titel wieder auf den Standard-Section-Stil zurückgestellt (Unterstrich aktiv).
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "symptome h2::after|symptome-scale\{|symptome-node|symptome-scale::before" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 13:14 +0100 - Symptome-Punkte: schwarzer Innenbereich
- Outline-Punkte der Reifegrad-Skala (außer Stufe 3) mit schwarzem Hintergrund gefüllt.
- Weißer Rand bleibt erhalten; Stufe 3 bleibt weiterhin in CI-Farbe hervorgehoben.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "\.symptome-node\{|background:#000|is-critical \\.symptome-node" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 13:28 +0100 - Mini-Optimierungen Symptome-Sektion (Pfeil/Spacing/Fokus)
- Pfeil/Linie der Skala dezenter gemacht: `rgba(255,255,255,.16)` statt `.22` (gleiche Strichstärke beibehalten).
- Abstand Skala → Diagnose-Kicker leicht erhöht:
  - Desktop: `margin-bottom` der Skala von `4rem` auf `4.75rem`
  - Mobile: von `3.2rem` auf `3.6rem`
- Skalenfokus geschärft: Stufe 1 & 2 leicht zurückgenommen (`opacity: .82`), Stufe 4 neutral, Stufe 3 bleibt dominant.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "symptome-scale::before|symptome-scale::after|symptome-scale\{|symptome-step:nth-child\(1\),|opacity:\.82|3\.6rem|4\.75rem" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 13:44 +0100 - Kompetenzen-Section → Fallstudie (Option A)
- Section-Titel und Intro auf das Maschinenbau-Fallbeispiel umgestellt.
- QM/Controlling-Doppelkarten entfernt und durch einen dominanten Fallstudien-Textblock ersetzt:
  - Das Problem
  - Unsere Vorgehensweise
  - Ergebnis nach 8 Wochen
- KPI-Kacheln (3er-Reihe) im bestehenden Layout beibehalten und inhaltlich auf die Fallstudie angepasst (`75 %`, `8 Wochen`, `24.500 €`).
- Section-Reihenfolge angepasst: `kompetenzen.html` direkt unter `symptome.html` eingebunden.
- Geänderte Dateien:
  - `components/kompetenzen.html`
  - `index.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Praxisbeispiel: Angebotskalkulation im Maschinenbau|kmp-case|24.500 €|data-include=\"components/kompetenzen.html\"" components/kompetenzen.html css/styles.css index.html`
  - `git diff -- components/kompetenzen.html index.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 14:02 +0100 - Fallstudie: große Klammer vor Vorgehens-/Ergebnis-Block
- In der Fallstudie (`kompetenzen`) einen dedizierten Text-Wrapper (`kmp-brace-block`) ergänzt.
- Vor dem Block unter „Unsere Vorgehensweise“ eine große dekorative linke Klammer per CSS-Pseudo-Element eingefügt.
- Klammer in Desktop/Mobile feinjustiert (Größe/Skalierung/Inset), ohne inhaltliche Änderungen.
- Geänderte Dateien:
  - `components/kompetenzen.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "kmp-brace-block|\{ Angebotskalkulation|Unsere Vorgehensweise|Ergebnis nach 8 Wochen" components/kompetenzen.html css/styles.css`
  - `git diff -- components/kompetenzen.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 14:12 +0100 - Klammerstil in Fallstudie korrigiert
- Dekorative Klammer von geschwungener `{`-Optik auf geraden Bracket-Stil umgestellt (wie zuvor in der Section-Ästhetik).
- Position vor dem Textblock neu ausgerichtet (nicht mehr nach oben verrutscht).
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "kmp-brace-block|border-left:2px solid var\(--brand\)|border-top:2px solid var\(--brand\)|border-bottom:2px solid var\(--brand\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 14:20 +0100 - Spacing Feintuning Fallstudie (Intro → Problem)
- Vertikalen Abstand zwischen Intro-Absatz und „Das Problem“ erhöht (ruhigerer Einstieg).
- Umsetzung über `margin-top` am Fallstudien-Wrapper `.kmp-case`.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "\.kmp-case\{|margin-top:1rem" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-24 14:36 +0100 - Über uns: Texte geschärft
- „Über uns“-Einleitung auf Prozess-/Verantwortungsfokus umgestellt.
- Personentexte (Jan/Khanh) auf Projektrelevanz verdichtet.
- Rollen/Subheadlines und Schwerpunkte gemäß neuem Wording aktualisiert.
- Geänderte Dateien:
  - `components/ueber-uns.html`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Wir sind Jan Zedel und Khanh Tang|Wirtschaftsingenieur \(M\.Sc\.\) – Web- & Systemarchitektur|Wirtschaftsingenieurin \(M\.Sc\.\) – Prozessanalyse & Excel-Automation" components/ueber-uns.html`
  - `git diff -- components/ueber-uns.html CHANGES_CODEX.md`

## 2026-02-24 22:35 +0100 - Leistungen → Typische Modernisierungsszenarien (Textupdate)
- Section-Titel und Intro auf „Typische Modernisierungsszenarien“ umgestellt.
- Inhalte der 3 Cards auf Modernisierungsszenarien angepasst (Titel, Beschreibung, Bulletpoints).
- Tech-lastige Listenpunkte (React Native, KI-Features, Web3-nahe Begriffe) in dieser Section entfernt.
- Geänderte Dateien:
  - `components/leistungen.html`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Typische Modernisierungsszenarien|Komplexe Excel-Systeme strukturieren|Transparente Daten- und Reporting-Strukturen|Schrittweise Überführung in Webanwendungen" components/leistungen.html`
  - `git diff -- components/leistungen.html CHANGES_CODEX.md`

## 2026-02-24 23:01 +0100 - Abschluss-CTA implementiert
- Neue Abschluss-CTA-Section als eigene Partial-Datei `components/cta.html` hinzugefügt.
- Subtiler Hintergrund über bestehende CI-Variablen umgesetzt (`rgba(var(--brand-rgb), .05/.03)`).
- Horizontale Divider oben und unten via 1px Border ergänzt.
- Bestehenden Primary-Button-Style (`btn btn-cta`) für CTA verwendet.
- Einbindung direkt nach der FAQ-Sektion im bestehenden `data-include`-Pattern ergänzt.
- Geänderte Dateien:
  - `components/cta.html`
  - `index.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "components/cta.html|final-cta|final-cta-section|Unverbindliches Erstgespräch vereinbaren" index.html components/cta.html css/styles.css`
  - `git diff -- components/cta.html index.html css/styles.css CHANGES_CODEX.md`

## 2026-02-24 23:25 +0100 - Kontakt-Submit: CTA-Schrift angeglichen
- Schriftfamilie des Submit-Buttons „Anfrage senden“ im Kontaktformular an die übrigen CTA-Buttons angeglichen.
- Umsetzung lokal in der Kontaktformular-Action (`.contact-formv3 .actions .btn { font-family: inherit; }`).
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "contact-formv3 \\.actions \\.btn|Anfrage senden" css/styles.css components/kontakt.html`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:03 +0100 - Hero Titelumbruch hinter „professionell“ korrigiert
- Zweite Titelzeile (`professionell weiterentwickeln`) gegen unerwünschten Umbruch hinter „professionell“ abgesichert.
- Umsetzung über gezielte Klasse `hero-title-line-keep` mit `white-space: nowrap`.
- Kleiner Mobile-Fallback (`max-width:420px`) gesetzt, damit bei sehr schmalen Screens regulärer Umbruch möglich bleibt.
- Geänderte Dateien:
  - `components/hero.html`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-title-line-keep|professionell weiterentwickeln" components/hero.html css/styles.css`
  - `git diff -- components/hero.html css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:10 +0100 - Hero: zusätzlicher Abstand unter Title-Line
- Vertikalen Abstand unterhalb der Hero-Titelzeile um exakt 20px erhöht.
- Umsetzung über `margin-bottom: calc(1rem + 20px)` auf `.hero-copy .display`.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "\.hero-copy \\.display\{|calc\(1rem \+ 20px\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:16 +0100 - Hero: zweite Title-Line in Website-Grün
- Zweite Hero-Titelzeile (`hero-title-line-keep`) auf CI-Grün gesetzt (`color: var(--brand)`).
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero-title-line-keep|color:var\(--brand\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:34 +0100 - Navbar Scroll-Verhalten implementiert
- Scroll Direction Detection in bestehender Header-Logik integriert (kein doppelter Listener).
- Navbar blendet bei Scroll nach unten per `transform` aus und bei Scroll nach oben wieder ein.
- Sonderfälle umgesetzt: `scrollY <= 0` zeigt Navbar immer an; bei offenem Mobile-Menü bleibt Navbar sichtbar.
- Performance-optimiert via `requestAnimationFrame` + passivem Scroll-Listener.
- CSS ergänzt: `will-change: transform`; Hidden-State nutzt weiterhin `translateY(-110%)`.
- Geänderte Dateien:
  - `js/main.js`
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "initSmartHeader|requestAnimationFrame|lastScrollY|site-header\.hide|will-change:transform|position:fixed" js/main.js css/styles.css`
  - `git diff -- js/main.js css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:57 +0100 - Scroll-Indicator (Dot-Navigation) ergänzt
- Neue Component `components/scroll-indicator.html` mit 8 fokussierbaren Dot-Links ergänzt.
- IntersectionObserver-Scroll-Spy in bestehendes `js/main.js` integriert (aktive Section via `rootMargin: -40% 0px -50% 0px`).
- Smooth-Scroll per `scrollIntoView({ behavior: 'smooth' })` auf Dot-Klick ergänzt.
- `scroll-margin-top` für Zielsections gesetzt, damit die fixe Navbar Überschriften nicht verdeckt.
- Fehlende IDs ergänzt: `#hero`, `#symptome`.
- Mobile-Reduktion: Indicator unter `<=768px` ausgeblendet.
- Geänderte Dateien:
  - `components/scroll-indicator.html`
  - `components/hero.html`
  - `components/symptome.html`
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "scroll-indicator|scroll-dot|initScrollIndicator|rootMargin|scroll-margin-top|id='hero'|id='symptome'" components index.html css/styles.css js/main.js`
  - `git diff -- components/scroll-indicator.html components/hero.html components/symptome.html index.html css/styles.css js/main.js CHANGES_CODEX.md`

## 2026-02-25 01:07 +0100 - Scroll-Indicator: aktiver Dot zentriert skaliert
- Aktiver Dot wächst nun per `transform: scale(1.5)` statt über `width/height`.
- Dot-Achse stabilisiert durch `align-items: center` im Indicator-Container.
- Ergebnis: aktiver Punkt bleibt vertikal mittig auf einer Linie mit den übrigen Dots.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "scroll-indicator|align-items:center|scroll-dot\.is-active|scale\(1\.5\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-25 01:24 +0100 - Hero Mobile Spacing & Title Wrap Fix
- Vertikalen Abstand unter der fixed Navbar in kleineren Viewports erhöht (`.hero.section` mit zusätzlichem `padding-top` bei `max-width:980px`).
- Titel-Umbruch für kleinere Viewports abgesichert (`.hero-title-line-keep` auf `white-space: normal` bei `max-width:1024px`).
- Textfluss im Hero-Titel robust gemacht (`overflow-wrap: break-word; word-break: normal`) zur Vermeidung horizontalen Überlaufs.
- Desktop-Layout unverändert belassen.
- Geänderte Dateien:
  - `css/styles.css`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "hero\.section\{|padding-top:calc\(|hero-title-line-keep|overflow-wrap:break-word|word-break:normal|@media \(max-width:1024px\)" css/styles.css`
  - `git diff -- css/styles.css CHANGES_CODEX.md`

## 2026-02-25 00:52 +0100 - Mobile Navbar: Menü schließt nach Link-Klick
- Click-Handler für Links innerhalb der Navbar ergänzt, damit das Mobile-Menü bei geöffnetem Zustand sofort kollabiert.
- ARIA-State am Burger-Button wird beim Schließen konsistent auf `aria-expanded="false"` gesetzt.
- Bestehende Anchor-Logik erweitert, damit auch dort beim Schließen der korrekte ARIA-State gesetzt wird.
- Geänderte Dateien:
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `npm run dev`
  - Mobile-Viewport: Menü öffnen, jeden Navbar-Link anklicken, Schließen + Navigation prüfen.

## 2026-02-25 01:10 +0100 - SEO: Canonical/OG konsolidiert + FAQ Schema angeglichen
- Canonical- und `og:url`-Tags auf die kanonische Domain `https://quick-impact.de` konsolidiert.
- Unterseiten `impressum` und `datenschutz` auf eigene kanonische URLs umgestellt (nicht mehr Startseite).
- FAQ `FAQPage` JSON-LD in `index.html` 1:1 an die sichtbaren FAQ-Inhalte aus `components/faq.html` angepasst.
- Geänderte Dateien:
  - `index.html`
  - `impressum.html`
  - `datenschutz.html`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "rel=\"canonical\"|property=\"og:url\"|\"@type\":\"FAQPage\"|\"name\":\"Wie schnell können wir starten\?|\"name\":\"Was kostet ein typisches Projekt\?" index.html impressum.html datenschutz.html`
  - `git diff -- index.html impressum.html datenschutz.html CHANGES_CODEX.md`

## 2026-02-25 01:14 +0100 - SEO P0: Build-Time Prerender für Landingpage
- Build-Skript `scripts/prerender.js` ergänzt, das `data-include`-Platzhalter zur Build-Zeit mit `components/*.html` auflöst.
- Build-Pipeline für Vercel ergänzt (`buildCommand` + `outputDirectory: dist`) sowie `package.json` mit `build`-Script angelegt.
- Include-Loader in `js/main.js` als No-Op/Fallback optimiert: ohne Placeholders sofortiger Return.
- Geänderte Dateien:
  - `scripts/prerender.js`
  - `package.json`
  - `vercel.json`
  - `js/main.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `npm run build`
  - `rg -n "data-include|<section id='hero'|<section id='symptome'|<h1 class='display'" dist/index.html`

## 2026-02-25 01:26 +0100 - SEO: Redirects www→non-www (Vercel) + Sitemap lastmod
- In `vercel.json` host-basierten permanenten Redirect ergänzt: `www.quick-impact.de/*` → `https://quick-impact.de/*`.
- `http`→`https` nicht separat als Regel ergänzt, da Vercel TLS/HTTPS standardmäßig erzwingt.
- Build-Skript erweitert: `scripts/prerender.js` aktualisiert beim Build `dist/sitemap.xml` und setzt alle `lastmod`-Einträge auf das Build-Datum.
- Geänderte Dateien:
  - `vercel.json`
  - `scripts/prerender.js`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `npm run build`
  - `cat vercel.json`
  - `cat dist/sitemap.xml`
  - `ls -la dist | rg "robots.txt|sitemap.xml"`

## 2026-02-25 01:39 +0100 - SEO: Title/Description auf Modernisierung-Positionierung geschärft
- Title in `index.html` auf die aktuelle Positionierung „Modernisierung gewachsener Tools“ aktualisiert.
- Meta Description in `index.html` auf die neue Positionierung und Zielgruppe aktualisiert.
- OG/Twitter `title` und `description` mit den neuen Werten synchronisiert.
- Geänderte Dateien:
  - `index.html`
  - `CHANGES_CODEX.md`
- Verifikation (Commands):
  - `rg -n "Gewachsene Tools modernisieren" index.html`
  - `rg -n "Wir modernisieren gewachsene Excel- und Fachbereichs-Tools" index.html`
  - `rg -n "Quick Impact Programming – Excel-Automatisierung" index.html`
