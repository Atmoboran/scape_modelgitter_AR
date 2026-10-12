# SCAPE° — Modellgitter in AR

Die Rechengitter globaler Wettermodelle (ICON, Kubus-Sphäre, Gauß, Längen-
Breiten-Gitter, Voronoi, Hexagonal-Ikosaeder, reduziertes Gauß, gestreckt,
Yin-Yang) als 3D-Modelle mit Schnitt durch die Vertikalschichten – auf dem
Handy in Augmented Reality, am Desktop direkt auf der Seite zum Drehen.

## Benutzung
`index.html` über HTTPS ausliefern (z. B. GitHub Pages). AR (Kamera, Scene
Viewer, AR Quick Look) funktioniert nur über echtes HTTPS auf Handy oder
Tablet. Die 3D-Modelle liegen als `.glb` (Android/Web) und `.usdz` (iOS)
neben der Seite. Abhängigkeit: `<model-viewer>` von unpkg.com.

## Layout
- **Handy:** Gitter auswählen, „In AR ansehen“ öffnet die Kamera.
- **Desktop (ab 1000 px):** Das 3D-Modell steht links auf der Seite und lässt
  sich mit der Maus drehen; Gitterauswahl und Erklärungen rechts. Ein Hinweis
  erklärt, dass AR nur auf dem Handy oder Tablet geht.

## Gestaltung
Nach dem SCAPE°-Corporate-Design, getrennt vom übrigen Code im Ordner
`theme/` (Schrift, Farben, Wortmarke, Claim; siehe `theme/README.md`).
Für eine Version mit anderem Erscheinungsbild genügt es, `theme/` anzupassen.
Founders Grotesk wird genutzt, wenn installiert oder unter `theme/fonts/`
abgelegt, sonst Helvetica Neue / Inter / Arial.
