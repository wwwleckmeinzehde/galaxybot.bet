import React from 'react';
import { Rocket, ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Layout';

function Section({
  title,
  children


}: {title: string;children: React.ReactNode;}) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-400">
        {children}
      </div>
    </section>);

}

function LegalShell({
  title,
  updated,
  children




}: {title: string;updated: string;children: React.ReactNode;}) {
  return (
    <div className="min-h-screen bg-space-900 text-slate-200">
      <header className="sticky top-0 z-50 w-full border-b border-space-700 bg-space-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-neon-magenta" />
            <span className="font-display text-xl font-bold tracking-wider text-white">
              GALAXYBOT<span className="text-neon-magenta">.BET</span>
            </span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-neon-magenta">

            <ArrowLeft className="h-4 w-4" />
            Zurück
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-slate-500">Stand: {updated}</p>

        <div className="mt-6 rounded-lg border border-neon-magenta/30 bg-neon-magenta/5 p-4 text-sm text-slate-300">
          🛰️ <strong>Satire-Hinweis:</strong> galaxybot.bet ist ein Spaßprojekt.
          Es gibt kein echtes Glücksspiel, kein echtes Geld und nichts zu
          gewinnen. „Galaxy Coins" (GC) sind wertlose Spielpunkte. Diese
          Dokumente sind bewusst überspitzt, meinen es bei den wichtigen Sachen
          (Daten, Alter, Haftung) aber durchaus ernst.
        </div>

        <div className="mt-8 space-y-8">{children}</div>
      </main>

      <Footer />
    </div>);

}

export function Agb() {
  return (
    <LegalShell title="Allgemeine Geschäftsbedingungen" updated="Juni 2026">
      <Section title="1. Geltungsbereich">
        <p>
          Diese AGB gelten für die Nutzung der Website galaxybot.bet (im
          Folgenden „die Seite"). Mit dem Bestätigen des Begrüßungs-Popups oder
          der Nutzung der Seite stimmst du diesen AGB und der
          Datenschutzerklärung zu. Wenn du nicht zustimmst: einfach wegklicken
          und dein Leben weiterleben.
        </p>
      </Section>

      <Section title="2. Was die Seite ist (und was nicht)">
        <p>
          Die Seite ist ein satirisches Browser-Spiel rund um die (fiktive)
          Ausfallzeit eines erfundenen Discord-Bots. Es handelt sich{' '}
          <strong>nicht</strong> um Glücksspiel im Sinne des
          Glücksspielstaatsvertrags, da kein Einsatz mit Vermögenswert geleistet
          wird und kein Gewinn mit Vermögenswert erzielt werden kann.
        </p>
        <p>
          „Galaxy Coins" (GC) sind reine Spielpunkte ohne jeden realen,
          monetären, emotionalen oder spirituellen Wert. Sie können nicht
          gekauft, verkauft, ausgezahlt, getauscht oder beliehen werden.
        </p>
      </Section>

      <Section title="3. Alter">
        <p>
          Die Seite richtet sich an Personen ab 18 Jahren. Da hier ohnehin
          nichts Echtes passiert, dient dies vor allem dem guten Ton. Bist du
          jünger und liest das hier heimlich: mach deine Hausaufgaben.
        </p>
      </Section>

      <Section title="4. Spielkonto & Name">
        <p>
          Beim ersten Besuch wird dir lokal ein anonymes Spiel-Token zugewiesen,
          mit dem dein GC-Stand und deine Platzierung verwaltet werden. Dein
          Anzeigename wird automatisch aus zufälligen Wörtern erzeugt – du kannst
          ihn nicht selbst wählen, damit niemand auf dumme Ideen kommt.
        </p>
        <p>
          Spielstände und Bestenlisten werden ausschließlich im
          Arbeitsspeicher des Servers gehalten. Nach einem Server-Neustart sind
          sie weg. Das ist keine Bug, das ist Feature.
        </p>
      </Section>

      <Section title="5. Spielausgang & Fairness">
        <p>
          Der Ausgang jeder Wette wird serverseitig mit kryptografischer
          Zufälligkeit (HMAC-SHA256 über einen geheimen Server-Seed) bestimmt.
          Der Ausgang ist im Browser nicht vorhersagbar oder manipulierbar. Dass
          du trotzdem fast immer verlierst, liegt nicht am Code, sondern am
          Konzept.
        </p>
      </Section>

      <Section title="6. Haftungsausschluss">
        <p>
          Die Seite wird „wie besehen" und ohne jede Gewährleistung
          bereitgestellt. Wir haften nicht für entgangene (Fake-)Gewinne,
          verlorene Galaxy Coins, verletzten Stolz, Lebenszeit oder
          existenzielle Krisen, die beim Zusehen entstehen. Für Schäden haften
          wir nur bei Vorsatz und grober Fahrlässigkeit im Rahmen der
          gesetzlichen Vorgaben.
        </p>
      </Section>

      <Section title="7. Keine Verbindung zu Dritten">
        <p>
          Sämtliche Namen, Marken, Quoten, Beträge und Ereignisse sind frei
          erfunden. Es besteht keine Verbindung zu Discord, zu „GalaxyBot" oder
          zu realen Personen, Unternehmen oder funktionierender Software.
        </p>
      </Section>

      <Section title="8. Änderungen">
        <p>
          Wir können diese AGB jederzeit anpassen, weil uns gerade danach ist.
          Die jeweils aktuelle Fassung gilt ab Veröffentlichung auf dieser Seite.
        </p>
      </Section>
    </LegalShell>);

}

export function Datenschutz() {
  return (
    <LegalShell title="Datenschutzerklärung" updated="Juni 2026">
      <Section title="1. Kurzfassung">
        <p>
          Wir sammeln so wenig Daten wie irgend möglich – im Grunde gar keine
          personenbezogenen. Kein Tracking, keine Werbung, keine Weitergabe an
          Dritte. Es interessiert uns ehrlich gesagt nicht, wer du bist.
        </p>
      </Section>

      <Section title="2. Verantwortlicher">
        <p>
          Verantwortlich für diese Seite ist der Betreiber von galaxybot.bet.
          Kontakt über das{' '}
          <a
            href="https://wwwleckmeinzeh.de/impressum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-magenta underline-offset-2 hover:underline">

            Impressum
          </a>
          .
        </p>
      </Section>

      <Section title="3. Lokale Speicherung (localStorage)">
        <p>
          Damit das Spiel funktioniert, speichern wir in deinem Browser
          (localStorage) zwei Dinge:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Spiel-Token:</strong> eine zufällige, anonyme Kennung, mit
            der der Server deinen GC-Stand der aktuellen Sitzung zuordnet.
          </li>
          <li>
            <strong>Zustimmungs-Status:</strong> ob du das Begrüßungs-Popup
            bestätigt hast, damit es dich nicht ständig nervt.
          </li>
        </ul>
        <p>
          Diese Daten verbleiben in deinem Browser. Du kannst sie jederzeit
          löschen, indem du den Seitenspeicher / die Website-Daten in deinen
          Browser-Einstellungen leerst.
        </p>
      </Section>

      <Section title="4. Server & Spielstände">
        <p>
          Dein anonymer Spielstand (GC-Saldo, Zähler, zufälliger Name) wird
          ausschließlich flüchtig im Arbeitsspeicher des Servers gehalten,
          niemals dauerhaft gespeichert und nach einem Server-Neustart
          vollständig verworfen. Es gibt keine Datenbank.
        </p>
      </Section>

      <Section title="5. Server-Logs">
        <p>
          Beim Aufruf der Seite können technisch notwendige Verbindungsdaten
          (z. B. IP-Adresse, Zeitpunkt, angefragte Ressource) durch den
          Hosting-Server kurzzeitig verarbeitet werden, um die Seite auszuliefern
          und die Sicherheit zu gewährleisten. Eine Zusammenführung mit deiner
          Person findet nicht statt.
        </p>
      </Section>

      <Section title="6. Keine Cookies, kein Tracking">
        <p>
          Wir setzen keine Tracking-Cookies, keine Analyse-Tools und keine
          Werbenetzwerke ein. Es gibt nichts zu profilieren – höchstens deine
          Niederlagen.
        </p>
      </Section>

      <Section title="7. Deine Rechte">
        <p>
          Du hast nach DSGVO grundsätzlich Rechte auf Auskunft, Berichtigung,
          Löschung und Einschränkung der Verarbeitung. Da wir praktisch keine
          personenbezogenen Daten dauerhaft speichern, läuft eine Löschung
          meistens auf „Browser-Daten leeren" hinaus.
        </p>
      </Section>
    </LegalShell>);

}
