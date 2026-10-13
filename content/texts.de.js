// Every visible text of the app. Edit or translate this file to adapt the
// exhibit; index.html only holds data-t="path.to.key" placeholders that
// js/texts.js fills from here. Entries written as functions build a sentence
// around runtime values. Lines marked LOCAL refer to SCAPE° or its region
// (none in this app so far).
window.TEXTS = {
  lang: 'de',
  pageTitle: 'Modellgitter in AR',
  description: 'Erlebe die Rechengitter globaler Wettermodelle in 3D und in Augmented Reality.',

  // Texts of the shared kit (js/view.js, js/kit.js).
  kit: {
    viewToDesktop: 'Desktop-Ansicht',
    viewToMobile: 'Handy-Ansicht',
    viewToDesktopAria: 'Zur Desktop-Ansicht wechseln',
    viewToMobileAria: 'Zur Handy-Ansicht wechseln',
    fullscreenEnter: 'Vollbild',
    fullscreenExit: 'Vollbild beenden',
    infoAria: 'Erklärung anzeigen',
    merke: 'Merke',
    tasks: 'Aufgaben',
    merkeLocked: 'Löse die Aufgaben – dann erscheint hier, was du herausgefunden hast.',
    devLink: '(dev)'
  },

  poster: {
    headline: 'Modellgitter',
    lead: 'Ein Wettermodell zerlegt die Luft um die Erde in viele kleine Zellen – ein Gitter. Wähle ein Gitter und dreh es mit dem Finger.'
  },

  stripAria: 'Gitter auswählen',
  count: (n, total) => 'Gitter ' + n + ' von ' + total,

  stage: {
    alt: name => '3D-Modell: ' + name + ', aufgeschnitten, mit den Schichten übereinander',
    badge: 'Zieh am Gitter, um es zu drehen',
    error: 'Das 3D-Modell konnte nicht geladen werden. Lade die Seite neu.',
    fileError: 'Die 3D-Modelle laden nur, wenn die Seite über einen Webserver geöffnet wird (nicht per Doppelklick). Siehe README.'
  },
  hint: 'Zieh am Gitter, um es zu drehen. Mit zwei Fingern (am Computer: Strg + Mausrad) zoomst du hinein und siehst die Schichten.',

  ar: {
    sub: 'Öffnet deine Kamera',
    infoAria: 'Augmented Reality erklären',
    note: '<p><b>AR</b> heißt „Augmented Reality“, auf Deutsch: erweiterte Wirklichkeit. Die Kamera zeigt deinen Raum, und das Gitter steht mitten darin. Du kannst darum herumgehen und es von allen Seiten ansehen.</p><p>Das klappt auf den meisten Handys und Tablets (Android: Scene Viewer, iPhone/iPad: AR Quick Look).</p>',
    desk: 'Augmented Reality gibt es nur auf dem Handy oder Tablet: Öffne diese Seite dort und tippe auf „In AR ansehen“. Hier am Bildschirm kannst du das Gitter mit der Maus drehen und mit Strg + Mausrad heranzoomen.',
    failed: 'AR ließ sich auf diesem Gerät nicht starten. Das 3D-Modell oben kannst du trotzdem drehen.'
  },

  facts: {
    title: 'Steckbrief',
    infoAria: 'Steckbrief erklären',
    note: '<p><b>Zellform:</b> So sieht eine Zelle von oben aus. Nach oben ist jede Zelle in Schichten gestapelt.</p><p><b>Auflösung:</b> So weit liegen zwei Gitterpunkte auseinander. Je kleiner die Zahl, desto feiner das Gitter – und desto länger rechnet der Computer.</p>',
    institution: 'Wer nutzt es',
    type: 'Gittertyp',
    cells: 'Zellform',
    resolution: 'Auflösung'
  },

  tasks: {
    title: 'Aufgaben',
    turn: 'Dreh ein Gitter mit dem Finger oder der Maus.',
    zoom: 'Zoome so nah heran, dass du die Schichten einzeln siehst.',
    three: 'Schau dir mindestens drei verschiedene Gitter an.',
    progress: (n, total) => n + ' von ' + total + ' Gittern angesehen',
    done: 'Geschafft!'
  },
  merke: {
    title: 'Merke',
    text: 'Ein Wettermodell teilt die Luft um die Erde in viele kleine Zellen – auch übereinander, in Schichten. Für jede Zelle rechnet der Computer Wind, Temperatur und Feuchte aus. Kleine Zellen zeigen mehr Einzelheiten, brauchen aber mehr Rechenzeit.'
  },

  topics: {
    what: {
      title: 'Was ist ein Rechengitter?',
      body: '<p>Ein Wettermodell kann die Atmosphäre nicht als Ganzes berechnen – dafür ist sie zu komplex. Stattdessen zerlegen Forschende die Erdoberfläche in Millionen kleiner Zellen: ein Rechengitter.</p><p>Weil die Atmosphäre auch nach oben hin dick ist, wird jede dieser Flächen zusätzlich in mehrere Schichten übereinander unterteilt. Aus dem zweidimensionalen Gitter wird so ein dreidimensionales Raster aus Zellen. Für jede einzelne Zelle löst der Supercomputer die physikalischen Gleichungen von Wind, Temperatur und Feuchte – Zelle für Zelle, alle paar Minuten neu.</p><p>Je kleiner die Zellen, desto feiner die Details, die das Modell erfassen kann: von riesigen Tiefdruckgebieten bis hinunter zu einzelnen Gewitterzellen. Kleinere Zellen bedeuten aber auch mehr Rechenaufwand. Die Auflösung eines Modells ist deshalb immer ein Kompromiss zwischen Genauigkeit und Rechenzeit.</p>'
    },
    why: {
      title: 'Warum gibt es so viele verschiedene Gitter?',
      body: '<p>Eine Kugel lückenlos und gleichmäßig in Zellen aufzuteilen, ist überraschend schwierig – und jeder Wetterdienst hat dafür seine eigene Lösung entwickelt.</p><p>Das einfachste <b>Längen-Breiten-Gitter</b> legt Zellen entlang gleicher Grad-Abstände an, staucht sie dadurch aber an den Polen fast auf einen Punkt zusammen. Das <b>Gauß-Gitter</b> mildert dieses Problem, indem es die Breitenkreise nach einem mathematischen Verfahren anordnet – lange Zeit die Grundlage vieler spektraler Modelle. Die <b>Kubus-Sphäre</b>, wie sie das US-Modell GFS nutzt, projiziert stattdessen einen Würfel auf die Kugel und erhält so sechs nahezu gleichförmige Flächen aus Vierecken. Der Deutsche Wetterdienst wiederum setzt bei <b>ICON</b> auf ein Gitter aus lauter Dreiecken, die aus einem zwanzigflächigen Ikosaeder verfeinert werden – fast überall gleich groß, egal ob Äquator oder Pol.</p>',
      figAria: 'Schematische Darstellung eines Dreiecksgitters und eines rautenförmigen Gitters auf einer Kugel',
      figCaption: 'Zwei Wege, eine Kugel in Rechenzellen zu zerlegen – schematische Darstellung'
    },
    simplified: {
      title: 'Was ist an den 3D-Modellen vereinfacht?',
      body: '<p>Die Zellen sind hier viel größer und die Luftschicht viel dicker gezeichnet als in Wirklichkeit – sonst könntest du nichts erkennen. Ein echtes Wettermodell hat Millionen Zellen je Schicht und oft 90 Schichten oder mehr übereinander.</p><p>Der Schnitt durch das Modell zeigt, wie die Schichten übereinanderliegen. Im echten Modell gibt es keinen solchen Schnitt: Das Gitter umschließt die ganze Erde.</p>'
    }
  },

  pager: {
    aria: 'Vorheriges und nächstes Gitter',
    prevAria: name => 'Vorheriges Gitter: ' + name,
    nextAria: name => 'Nächstes Gitter: ' + name
  },

  sources: 'Angaben zu den Modellen nach DWD, NOAA, ECMWF, NCAR und Météo-France. 3D-Anzeige: model-viewer (Google, Apache-Lizenz 2.0).',

  // The nine grids, in the order of the strip. name: heading and pager;
  // short: chip in the strip; ar: label of the AR button.
  grids: {
    icon: {
      name: 'ICON-Gitter (Ikosaeder)',
      short: 'ICON',
      ar: 'ICON-Gitter in AR ansehen',
      institution: 'DWD',
      type: 'Ikosaeder-Dreiecksgitter mit Vertikalschichten',
      cells: 'Dreiecksprismen',
      resolution: '≈ 13 km horizontal · bis zu 90 Schichten vertikal',
      explain: 'Stell dir einen Fußball aus 20 Dreiecken vor, dessen Flächen du immer weiter in kleinere Dreiecke zerlegst. Genau so baut der Deutsche Wetterdienst sein Rechengitter für ICON – dadurch sind die Zellen überall auf der Erde fast gleich groß.'
    },
    cubedsphere: {
      name: 'Kubus-Sphäre',
      short: 'Kubus',
      ar: 'Kubus-Sphäre in AR ansehen',
      institution: 'u. a. NOAA (GFS)',
      type: 'Kubus-Sphäre (Cubed Sphere)',
      cells: 'Vierecke',
      resolution: '≈ 13 km horizontal, je Modellkonfiguration',
      explain: 'Nimm einen Würfel und blase ihn auf wie einen Ballon, bis er rund wird – übrig bleiben sechs leicht gewölbte Flächen aus viereckigen Zellen. So funktioniert die kubische Sphäre, zum Beispiel beim US-Modell GFS.'
    },
    gaussian: {
      name: 'Gauß-Gitter',
      short: 'Gauß',
      ar: 'Gauß-Gitter in AR ansehen',
      institution: 'spektrale Modelle',
      type: 'Gauß-Gitter (spektrales Transformationsgitter)',
      cells: 'Rechtecke, Breite variiert mit Breitengrad',
      resolution: 'modellabhängig',
      explain: 'Die Breitenkreise dieses Gitters liegen nicht einfach gleichmäßig verteilt, sondern nach einer mathematischen Formel – das macht bestimmte Berechnungen im Computer besonders effizient. Lange Zeit die Basis vieler globaler Wettermodelle.'
    },
    latlon: {
      name: 'Längen-Breiten-Gitter',
      short: 'Lat/Lon',
      ar: 'Längen-Breiten-Gitter in AR ansehen',
      institution: 'weit verbreitet, u. a. in älteren Modellen',
      type: 'Reguläres Längen-Breiten-Gitter',
      cells: 'Rechtecke, zu den Polen hin stark gestaucht',
      resolution: 'z. B. 0,25°–1°',
      explain: 'Das einfachste Gitter überhaupt: gleich viele Grad zwischen jeder Zeile und Spalte, wie auf einer Weltkarte. Der Nachteil: An den Polen drängen sich die Zellen auf einen winzigen Punkt zusammen.'
    },
    voronoi: {
      name: 'Adaptives Voronoi-Gitter',
      short: 'Voronoi',
      ar: 'Voronoi-Gitter in AR ansehen',
      institution: 'u. a. MPAS (NCAR)',
      type: 'Voronoi-Gitter mit variabler Auflösung',
      cells: 'Sechs- und Fünfecke, unterschiedlich groß',
      resolution: 'regional verfeinert, z. B. wenige bis mehrere Dutzend km',
      explain: 'Hier passt sich die Zellgröße der Situation an: fein aufgelöst über einem heranziehenden Sturm oder einer Gebirgskette, gröber über ruhigen Ozeanflächen. So spart das Modell Rechenzeit, ohne wichtige Details zu verpassen.'
    },
    hexicosahedral: {
      name: 'Hexagonal-Ikosaeder-Gitter',
      short: 'Hex',
      ar: 'Hexagonal-Ikosaeder-Gitter in AR ansehen',
      institution: 'z. B. GME (DWD, 1999–2015)',
      type: 'Hexagonal-Ikosaeder-Gitter',
      cells: 'Sechsecke, mit 12 Fünfecken',
      resolution: 'GME: zuletzt ≈ 20 km global',
      explain: 'Ähnlich wie beim ICON-Gitter, nur dass hier überwiegend Sechsecke statt Dreiecke die Kugel bedecken – wie bei einem Fußball. Der Deutsche Wetterdienst nutzte ein solches Gitter bis 2015 in seinem Vorgängermodell GME.'
    },
    reducedgaussian: {
      name: 'Reduziertes Gauß-Gitter',
      short: 'Red. Gauß',
      ar: 'Reduziertes Gauß-Gitter in AR ansehen',
      institution: 'u. a. ECMWF IFS (bis 2016)',
      type: 'Reduziertes Gauß-Gitter',
      cells: 'Rechtecke, Anzahl je Breitenkreis sinkt zu den Polen',
      resolution: 'modellabhängig',
      explain: 'Eine cleverere Variante des Gauß-Gitters: In der Nähe der Pole werden einfach weniger Zellen pro Breitenkreis verwendet, weil dort ohnehin weniger Platz ist. Das spart Rechenleistung, ohne die Genauigkeit stark zu beeinträchtigen.'
    },
    stretched: {
      name: 'Gestrecktes & rotiertes Gitter',
      short: 'Gestreckt',
      ar: 'Gestrecktes Gitter in AR ansehen',
      institution: 'z. B. ICON-D2 / COSMO (DWD), ARPEGE (Météo-France)',
      type: 'Gestrecktes, rotiertes Gitter',
      cells: 'Rechtecke, im Fokusgebiet am gleichmäßigsten',
      resolution: 'z. B. ICON-D2: 2 km über Deutschland',
      explain: 'Für Regionalmodelle wird das Gitter gedreht und zusammengestaucht, sodass die feinsten, gleichmäßigsten Zellen genau über dem interessierenden Gebiet liegen – zum Beispiel über Deutschland beim Modell ICON-D2.'
    },
    yinyang: {
      name: 'Yin-Yang-Gitter',
      short: 'Yin-Yang',
      ar: 'Yin-Yang-Gitter in AR ansehen',
      institution: 'u. a. in Forschungsmodellen',
      type: 'Yin-Yang-Gitter (zwei überlappende Panels)',
      cells: 'Rechtecke, ohne Pol-Singularität',
      resolution: 'modellabhängig',
      explain: 'Zwei identische, sich überlappende Gitterstücke – wie beim gleichnamigen Symbol – decken zusammen die ganze Kugel ab. Der Trick: Keines der beiden Stücke muss jemals einen Pol enthalten, wodurch das kniffligste Problem aller Kugelgitter einfach verschwindet.'
    }
  }
};
