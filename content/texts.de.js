// Every visible text of the app. Edit or translate this file to adapt the
// exhibit; index.html only holds data-t="path.to.key" placeholders that
// js/texts.js fills from here. Entries written as functions build a sentence
// around runtime values. Lines marked LOCAL refer to SCAPE° or its region
// (none in this app so far).
window.TEXTS = {
  lang: 'de',
  pageTitle: 'Modellgitter – vom Messwert zur Vorhersage',
  description: 'Warum Wettermodelle ein Gitter brauchen, wie aus Messstationen ein Gitter wird, wie Datenassimilation funktioniert – und die Rechengitter globaler Wettermodelle in 3D und AR.',

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
    lead: 'Wie wird aus einzelnen Messungen eine Wettervorhersage? In fünf Kapiteln vom Gitter über die Messstationen und die Datenassimilation bis zu den Rechengittern um die ganze Erde.'
  },

  // ---- chapter navigation (js/chapters.js) ----------------------------------
  navAria: 'Kapitel',
  chapters: {
    warum:        { nav: 'Warum ein Gitter?', label: 'Kapitel 1 von 5', title: 'Warum ein Gitter?' },
    stationen:    { nav: 'Stationen', label: 'Kapitel 2 von 5', title: 'Von Stationen zum Gitter' },
    assimilation: { nav: 'Assimilation', label: 'Kapitel 3 von 5', title: 'Messung trifft Modell' },
    vorhersage:   { nav: 'Vorhersage', label: 'Kapitel 4 von 5', title: 'Die Vorhersage' },
    gitter:       { nav: 'Gitter der Welt', label: 'Kapitel 5 von 5', title: 'Die Gitter der Welt' }
  },
  chapterPager: {
    aria: 'Vorheriges und nächstes Kapitel',
    prevAria: name => 'Vorheriges Kapitel: ' + name,
    nextAria: name => 'Nächstes Kapitel: ' + name,
    count: (n, total) => 'Kapitel ' + n + ' / ' + total
  },

  // ---- Kapitel 1: Warum ein Gitter? (js/ch-warum.js) -------------------------
  warum: {
    intro: 'Die Luft ist überall – ein Computer kann aber nur mit einer endlichen Liste von Zahlen rechnen. Darum zerlegt man die Luft in Kästchen, ähnlich wie ein Foto aus Pixeln besteht. Jedes Kästchen bekommt <b>eine</b> Temperatur, <b>einen</b> Wind, <b>eine</b> Feuchte.',
    hint: 'Tippe auf eine Zelle: Du siehst, mit welchen Nachbarn sie rechnet. Starte den Wind und vergleiche grobe und feine Gitter. Die gestrichelten Kreise zeigen, wo die warmen und kalten Gebiete wirklich sind.',
    badge: 'Tippe auf eine Zelle',
    resLabel: 'Gitter',
    wind: 'Wind',
    windStart: 'Wind starten',
    windStop: 'Wind anhalten',
    reset: 'Zurück auf Anfang',
    truth: 'Wirklichkeit zeigen',
    readCells: 'Zellen',
    readDx: 'Zellbreite',
    readCost: 'Rechenaufwand',
    readTime: 'Zeit',
    hours: n => n + ' h',
    cellNone: 'Tippe auf eine Zelle, um ihre Rechnung zu sehen.',
    cell: (c, l, o) => '<b>Diese Zelle:</b> ' + c + ' °C · links daneben: ' + l + ' °C · darüber: ' + o + ' °C',
    cellNext: (c, cx, l, cy, o, n, dt) => '<b>In ' + dt + ':</b> ' + c + ' − ' + cx + ' × (' + c + ' − ' + l + ') − ' + cy + ' × (' + c + ' − ' + o + ') = <b>' + n + ' °C</b>',
    tasks: {
      res: 'Stell das Gitter einmal ganz grob und einmal ganz fein.',
      wind: 'Starte den Wind und beobachte, was mit den Flecken passiert.',
      cell: 'Tippe auf eine Zelle und sieh dir ihre Rechnung an.'
    },
    merke: 'Ein Computer kennt nur Zahlen in Kästchen. Jede Zelle rechnet mit ihren Nachbarn aus, wie sich das Wetter in ihr ändert – dafür braucht es ein Gitter. Ein feines Gitter zeigt mehr Einzelheiten, kostet aber viel mehr Rechenzeit.',
    topics: {
      discrete: {
        title: 'Wie rechnet eine Zelle?',
        body: '<p>Die Physik beschreibt, wie sich das Wetter <i>verändert</i>. Für die Temperatur, die vom Wind verfrachtet wird, lautet die Gleichung sinngemäß:</p><p class="formula">Änderung der Temperatur pro Zeit = − Wind × Temperaturunterschied pro Strecke</p><p>Weht der Wind von links und ist es links kälter, wird es in der Zelle kälter. Auf dem Gitter wird aus dem „Unterschied pro Strecke“ ganz einfach der Unterschied zum Nachbarn, geteilt durch die Zellbreite Δx:</p><p class="formula">T<sub>neu</sub> = T<sub>alt</sub> − u · Δt / Δx · (T<sub>alt</sub> − T<sub>links</sub>)</p><p>u ist die Windgeschwindigkeit, Δt der Zeitschritt. Genau diese Rechnung siehst du, wenn du auf eine Zelle tippst. Echte Modelle rechnen so für Wind, Druck, Temperatur, Feuchte, Wolken – in allen drei Richtungen.</p>'
      },
      cost: {
        title: 'Warum werden feine Gitter so teuer?',
        body: '<p>Halbiert man die Zellbreite, braucht man in der Fläche <b>viermal</b> so viele Zellen (doppelt so viele in jede Richtung). Außerdem muss der Zeitschritt kleiner werden, sonst „springt“ der Wind in einem Schritt über eine ganze Zelle hinweg und die Rechnung wird instabil:</p><p class="formula">u · Δt / Δx &lt; 1</p><p>Das ergibt <b>achtmal</b> so viel Rechenarbeit – und mit feineren Schichten in der Höhe noch mehr. Deshalb ist die Auflösung immer ein Kompromiss zwischen Genauigkeit und Rechenzeit.</p>'
      },
      smear: {
        title: 'Warum verschmiert das grobe Gitter?',
        body: '<p>Ein warmes Gebiet, das kleiner als eine Zelle ist, kann das Gitter gar nicht darstellen – es wird mit seiner Umgebung gemittelt. Zusätzlich verwischt die einfache Rechenvorschrift scharfe Kanten mit jedem Schritt ein wenig („numerische Diffusion“). Auf einem feinen Gitter ist dieser Fehler viel kleiner. Moderne Modelle nutzen genauere Verfahren, ganz verschwindet das Problem aber nie.</p>'
      }
    }
  },

  // ---- Kapitel 2: Von Stationen zum Gitter (js/ch-stationen.js) --------------
  stationen: {
    intro: 'Gemessen wird nur an einzelnen Orten – an Wetterstationen. Das Modell braucht aber einen Wert in <b>jeder</b> Zelle. Die Lücken dazwischen füllt man durch <b>Interpolation</b>: Man schätzt aus den Stationen in der Nähe. Die Landschaft hier ist ausgedacht – darum kennen wir auch die „Wirklichkeit“ und können vergleichen.',
    hint: 'Wähle ein Verfahren. Tippe auf eine Station, um sie aus- oder einzuschalten, und auf eine Zelle, um zu sehen, woher ihr Wert kommt.',
    badge: 'Tippe auf eine Station oder Zelle',
    methodLabel: 'Verfahren',
    nearest: 'Nächste Station',
    idw: 'Gewichtet',
    viewLabel: 'Ansicht',
    interp: 'Gitter',
    truth: 'Wirklichkeit',
    diff: 'Abweichung',
    resLabel: 'Gitter',
    powerLabel: 'Nähe zählt',
    reset: 'Alle Stationen an',
    readActive: 'Stationen',
    readRms: 'Mittlere Abweichung',
    readMax: 'Größte Abweichung',
    activeOf: (n, total) => n + ' von ' + total,
    cellNone: 'Tippe auf eine Zelle, um zu sehen, woher ihr Wert kommt.',
    noStation: 'Ohne eine einzige Station weiß das Gitter gar nichts.',
    cell: (v, real) => '<b>Diese Zelle:</b> ' + v + ' °C · in Wirklichkeit: ' + real + ' °C',
    from: parts => 'Größte Anteile: ' + parts,
    share: (n, pct) => 'Station ' + n + ' ' + pct + ' %',
    place: { mountain: 'Gebirge', city: 'Stadt', valley: 'Tal' },
    tasks: {
      idw: 'Wechsle zum Verfahren „Gewichtet“.',
      off: 'Schalte eine Station aus. Wo ändert sich das Gitter am meisten?',
      cell: 'Tippe auf eine Zelle und sieh nach, welche Stationen sie bestimmen.',
      diff: 'Schau dir die Abweichung an: Wo liegt die Schätzung am weitesten daneben?'
    },
    merke: 'Zwischen den Stationen muss man schätzen. Bei der Interpolation zählen nahe Stationen mehr als ferne. Wo nur wenige Stationen stehen – im Gebirge, auf dem Meer – wird die Schätzung unsicher.',
    topics: {
      nearest: {
        title: 'Nächste Station: das Voronoi-Prinzip',
        body: '<p>Das einfachste Verfahren: Jede Zelle übernimmt den Wert der Station, die ihr am nächsten liegt. So entstehen Flächen mit harten Kanten – jede Fläche gehört genau einer Station. Diese Flächen heißen <b>Voronoi-Zellen</b>. Dasselbe Prinzip steckt im <a href="#voronoi">Voronoi-Gitter</a> mancher Wettermodelle.</p>'
      },
      idw: {
        title: 'Gewichteter Mittelwert: die Formel',
        body: '<p>Besser: Man mittelt <i>alle</i> Stationen, aber nahe zählen mehr. Jede Station i bekommt ein Gewicht w<sub>i</sub>, das mit der Entfernung d<sub>i</sub> kleiner wird:</p><p class="formula">w<sub>i</sub> = 1 / d<sub>i</sub><sup>p</sup> &nbsp;&nbsp;&nbsp; T<sub>Zelle</sub> = (w<sub>1</sub>·T<sub>1</sub> + w<sub>2</sub>·T<sub>2</sub> + …) / (w<sub>1</sub> + w<sub>2</sub> + …)</p><p>Die Zahl p stellst du mit dem Regler „Nähe zählt“ ein: Bei großem p bestimmt fast nur die nächste Station den Wert, bei kleinem p wird über weite Strecken gemittelt. Dieses Verfahren heißt <b>inverse Distanzgewichtung</b>.</p>'
      },
      pros: {
        title: 'Was machen Profis anders?',
        body: '<p>Fachleute nutzen mehr Wissen über das Wetter: <b>Kriging</b> schätzt aus den Daten, wie weit eine Messung „ausstrahlt“, und gibt zu jedem Wert gleich die Unsicherheit mit. Für die Temperatur rechnet man außerdem mit der <b>Höhe</b>: Pro 100 Meter wird es im Mittel etwa 0,65 °C kälter. Eine Station im Tal sagt darum wenig über den Gipfel daneben.</p>'
      },
      limits: {
        title: 'Warum reicht Interpolation nicht?',
        body: '<p>Interpolation weiß nur, was die Stationen messen. Über dem Meer, in Wüsten, im Gebirge und vor allem in der Höhe gibt es kaum Stationen – dort bleibt das Gitter geraten. Außerdem weiß sie nichts über Physik: Sie kann ein Gewitter oder eine Wetterfront zwischen zwei Stationen nicht „erfinden“. Darum kombinieren Wetterdienste Messungen mit dem Modell selbst – das ist das nächste Kapitel.</p>'
      }
    }
  },

  // ---- Kapitel 3: Datenassimilation (js/ch-assimilation.js) -----------------
  assim: {
    intro: 'Wetterdienste haben zwei Quellen: <b>neue Messungen</b> und die <b>letzte Vorhersage</b> des Modells für jetzt. Beide sind ungenau, aber auf verschiedene Weise. Die <b>Datenassimilation</b> verbindet sie zum besten Startzustand für die nächste Vorhersage – der <b>Analyse</b>.',
    stepsAria: 'Schritte',
    steps: { punkt: '1 · Ein Punkt', linie: '2 · Eine Linie', kreislauf: '3 · Der Kreislauf' },
    badge: {
      punkt: 'Tippe, um die Messung zu verschieben',
      linie: 'Tippe, um eine Messung hinzuzufügen',
      kreislauf: 'Starte den Kreislauf'
    },
    p: {
      hint: 'Das Modell sagt 14 °C, das Thermometer misst 17 °C. Wem glaubst du mehr? Die Regler stellen ein, wie unsicher Modell und Messung sind. Tippe in das Bild, um die Messung zu verschieben.',
      sbLabel: 'Modell unsicher',
      soLabel: 'Messung unsicher',
      model: v => 'Modell ' + v + '°',
      obs: v => 'Messung ' + v + '°',
      analysis: v => 'Analyse ' + v + '°',
      formula: (xb, k, y, xa) => 'Analyse = ' + xb + ' + ' + k + ' × (' + y + ' − ' + xb + ') = ' + xa + ' °C',
      readK: 'Gewicht der Messung',
      readXa: 'Analyse',
      readSa: 'Unsicherheit danach'
    },
    l: {
      hint: 'Eine Linie quer durch das Land, 1000 km lang. Die violette Kurve ist die Vorhersage, die orangen Punkte sind Messungen. Die grüne Analyse wird nur in der Nähe der Messungen korrigiert. Tippe, um Messungen hinzuzufügen oder zu entfernen.',
      soLabel: 'Messung unsicher',
      LLabel: 'Einflussradius',
      truth: 'Wirklichkeit',
      model: 'Modell (Vorhersage)',
      obs: 'Messung',
      analysis: 'Analyse',
      withDA: 'mit Messungen',
      free: 'ohne Messungen',
      readModel: 'Fehler Modell',
      readAna: 'Fehler Analyse',
      readN: 'Messungen'
    },
    c: {
      hint: 'Die Vorhersage läuft weiter. Alle paar Stunden kommen neue Messungen dazu und korrigieren sie (grün). Die gestrichelte Vorhersage bekommt nie neue Messungen. Unten siehst du den Fehler beider Läufe.',
      start: 'Kreislauf starten',
      pause: 'Anhalten',
      again: 'Noch einmal',
      restart: 'Neu starten',
      periodLabel: 'Messungen',
      every: h => 'alle ' + h + ' h',
      nLabel: 'Stationen',
      day: d => d === 0 ? 'Start' : d + ' Tg.',
      error: 'Fehler',
      time: (d, h) => 'Tag ' + d + ', ' + h + ' Uhr',
      readTime: 'Zeit',
      readDA: 'Fehler mit Messungen',
      readFree: 'Fehler ohne'
    },
    tasks: {
      trust: 'Schritt 1: Mach die Messung unsicherer als das Modell. Wohin rückt die Analyse?',
      add: 'Schritt 2: Füge dort eine Messung hinzu, wo das Modell am weitesten danebenliegt.',
      cycle: 'Schritt 3: Lass den Kreislauf mindestens fünf Tage laufen.'
    },
    merke: 'Datenassimilation verbindet zwei unvollständige Quellen: die letzte Vorhersage und neue Messungen. Jede wird nach ihrer Genauigkeit gewichtet. Das Ergebnis – die Analyse – ist der Start der nächsten Vorhersage, alle paar Stunden aufs Neue.',
    topics: {
      formula: {
        title: 'Die Formel hinter der Analyse',
        body: '<p>Für einen einzelnen Wert ist die Analyse ein gewichteter Mittelwert aus Modell x<sub>b</sub> und Messung y:</p><p class="formula">x<sub>a</sub> = x<sub>b</sub> + K · (y − x<sub>b</sub>) &nbsp;&nbsp;&nbsp; K = σ<sub>b</sub>² / (σ<sub>b</sub>² + σ<sub>o</sub>²)</p><p>σ<sub>b</sub> ist die Unsicherheit des Modells, σ<sub>o</sub> die der Messung. Der Klammerausdruck (y − x<sub>b</sub>) ist die <b>Überraschung</b>: um wie viel die Messung von der Vorhersage abweicht. Davon übernimmt die Analyse den Anteil K. Ist die Messung genau (σ<sub>o</sub> klein), ist K fast 1; ist sie ungenau, bleibt man nah am Modell.</p><p>Nebenbei wird die Analyse genauer als beide Quellen allein:</p><p class="formula">1/σ<sub>a</sub>² = 1/σ<sub>b</sub>² + 1/σ<sub>o</sub>²</p>'
      },
      field: {
        title: 'Von einem Punkt zu Millionen Zellen',
        body: '<p>Im echten Modell ist x<sub>b</sub> keine Zahl, sondern eine Liste mit hunderten Millionen Werten (alle Zellen, alle Größen), und es gibt Millionen Messungen. Die Formel sieht trotzdem gleich aus:</p><p class="formula">x<sub>a</sub> = x<sub>b</sub> + K · (y − H(x<sub>b</sub>))</p><p><b>H</b> übersetzt das Modell in das, was ein Messgerät sehen würde – zum Beispiel den Modellwert am Ort der Station oder die Strahlung, die ein Satellit messen würde. <b>K</b> enthält, wie weit und in welche Richtung eine Messung ihre Umgebung beeinflusst. Diese Reichweite stellst du in Schritt 2 mit dem Einflussradius ein. Sie hängt auch vom Wetter ab: Entlang einer Front reicht der Einfluss weiter als quer dazu.</p>'
      },
      sources: {
        title: 'Woher kommen die Messungen?',
        body: '<ul><li><b>Satelliten</b> liefern den allergrößten Teil der Daten: Strahlung, aus der sich Temperatur und Feuchte in verschiedenen Höhen ableiten lassen, dazu Wind aus Wolkenbewegungen.</li><li><b>Wetterballons</b> (Radiosonden) messen auf ihrem Weg nach oben Temperatur, Feuchte und Wind – zweimal täglich an vielen Orten der Welt.</li><li><b>Flugzeuge</b> melden Temperatur und Wind entlang ihrer Route.</li><li><b>Bodenstationen, Schiffe und Bojen</b> messen an der Oberfläche, <b>Radar</b> zeigt Niederschlag.</li></ul><p>Zusammen sind das viele Millionen Messwerte am Tag – und trotzdem bleibt der größte Teil der Atmosphäre ungemessen. Das Modell füllt die Lücken.</p>'
      },
      methods: {
        title: '3D-Var, 4D-Var, Ensemble-Kalman – was ist das?',
        body: '<p>Das sind verschiedene Wege, die Formel oben für riesige Datenmengen zu lösen. <b>3D-Var</b> sucht den Zustand, der zu Modell und Messungen gleichzeitig am besten passt. <b>4D-Var</b> berücksichtigt zusätzlich, <i>wann</i> gemessen wurde, und lässt das Modell durch ein Zeitfenster laufen (z. B. beim ECMWF). <b>Ensemble-Kalman-Filter</b> schätzen die Unsicherheit des Modells aus vielen parallelen Vorhersagen. Der DWD kombiniert für ICON Variations- und Ensembleverfahren (hybrides EnVar).</p>'
      }
    }
  },

  // ---- Kapitel 4: Vorhersage (js/ch-vorhersage.js) --------------------------
  vorhersage: {
    intro: 'Aus der Analyse rechnet das Modell in kleinen Zeitschritten in die Zukunft – Zelle für Zelle, mit den Gleichungen aus Kapitel 1. Doch das Wetter ist <b>chaotisch</b>: Winzige Fehler am Start wachsen mit der Zeit. Hier rechnet ein Spielzeug-Wetter mit nur drei Zahlen 30-mal, jedes Mal mit einem minimal anderen Start.',
    hint: 'Starte die Vorhersage. Oben siehst du, wo jeder der 30 Läufe gerade ist, unten den Verlauf einer Größe über die Zeit. Ändere die Unsicherheit am Start und vergleiche, wie lange die Läufe zusammenbleiben.',
    badge: 'Starte die Vorhersage',
    start: 'Vorhersage starten',
    pause: 'Anhalten',
    resume: 'Weiter',
    again: 'Noch einmal',
    restart: 'Neu starten',
    epsLabel: 'Unsicherheit am Start',
    epsName: ['winzig', 'sehr klein', 'klein', 'mittel', 'groß'],
    attractor: 'Zustand aller Läufe',
    wingL: 'Wetterlage A',
    wingR: 'Wetterlage B',
    spaghetti: 'Verlauf über die Zeit (Tage, Spielzeit)',
    limitLabel: d => 'brauchbar bis Tag ' + d,
    dayN: d => 'Tag ' + d,
    beyond: 'bis zum Ende',
    readTime: 'Zeit',
    readSpread: 'Streuung',
    readLimit: 'Brauchbar bis',
    tasks: {
      run: 'Starte die Vorhersage und beobachte die 30 Läufe.',
      small: 'Stell die Unsicherheit am Start auf „sehr klein“ oder „winzig“ und lass sie laufen.',
      big: 'Stell sie auf „mittel“ oder „groß“: Wann laufen die Läufe auseinander?'
    },
    merke: 'Das Wetter ist chaotisch: Kleine Fehler im Startzustand wachsen, bis die Vorhersage nicht mehr stimmt. Darum rechnen Wetterdienste viele leicht verschiedene Vorhersagen – ein Ensemble – und darum lohnt sich jede gute Messung: Je genauer die Analyse, desto weiter reicht die Vorhersage.',
    topics: {
      timestep: {
        title: 'Rechnen in Zeitschritten',
        body: '<p>Das Modell kennt den Zustand jetzt und berechnet daraus, wie schnell sich jede Größe ändert. Dann geht es einen kleinen Schritt Δt weiter:</p><p class="formula">Zustand(t + Δt) = Zustand(t) + Δt · Änderungsrate(t)</p><p>Das wiederholt sich viele tausend Mal. Bei ICON mit 13 km Zellbreite ist ein Zeitschritt nur etwa zwei Minuten lang – eine 7-Tage-Vorhersage sind also rund 5000 Schritte, jeder für hunderte Millionen Zellen.</p>'
      },
      butterfly: {
        title: 'Der Schmetterlingseffekt',
        body: '<p>Das Spielzeug-Wetter hier stammt vom Meteorologen Edward Lorenz (1963). Er hatte ein stark vereinfachtes Modell und bemerkte, dass eine winzige Rundung der Startwerte nach einiger Zeit zu einem völlig anderen Ergebnis führte. Daraus entstand das Bild vom Schmetterling, dessen Flügelschlag irgendwann über einen Sturm entscheiden kann.</p><p>Die Zeit ist hier nur „Spielzeit“ – das Prinzip ist aber dasselbe wie in echten Modellen: Heute sind Vorhersagen etwa eine Woche lang gut, und nach rund zwei Wochen sind sie kaum besser als das langjährige Mittel.</p>'
      },
      ensemble: {
        title: 'Ensemble-Vorhersagen',
        body: '<p>Weil man den Startzustand nie genau kennt, starten Wetterdienste viele Läufe mit leicht veränderten Analysen – ein <b>Ensemble</b>. Der DWD rechnet ICON-EPS mit 40 Läufen, das ECMWF sein Ensemble mit 51. Liegen die Läufe eng beieinander, ist die Vorhersage sicher; laufen sie auseinander, ist sie unsicher. Daraus entstehen Angaben wie „Regenwahrscheinlichkeit 70 %“.</p>'
      },
      loop: {
        title: 'Wie hängt alles zusammen?',
        body: '<ol><li><b>Gitter</b>: Die Luft wird in Zellen zerlegt (Kapitel 1).</li><li><b>Messungen</b> kommen von Stationen, Ballons, Flugzeugen und Satelliten (Kapitel 2).</li><li><b>Datenassimilation</b> verbindet sie mit der letzten Vorhersage zur Analyse (Kapitel 3).</li><li><b>Vorhersage</b>: Von der Analyse aus rechnet das Modell in die Zukunft (dieses Kapitel).</li><li>Wenige Stunden später geht es mit neuen Messungen wieder von vorne los.</li></ol><p>Wie die großen Wetterdienste ihr Gitter um die ganze Erde legen, siehst du im letzten Kapitel – in 3D und in Augmented Reality.</p>'
      }
    }
  },

  // ---- Kapitel 5: Die Gitter der Welt (js/app.js) ---------------------------
  gitter: {
    intro: 'Eine Kugel lückenlos in Zellen zu zerlegen, ist schwierig – jeder Wetterdienst hat dafür seine eigene Lösung. Wähle ein Gitter, dreh es mit dem Finger und stell es mit AR in deinen Raum.'
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

  sources: 'Alle Wetterdaten in den Kapiteln 1–4 sind ausgedacht (synthetisch). Spielzeug-Wetter in Kapitel 4: Lorenz-Modell (1963). Angaben zu den Modellen nach DWD, NOAA, ECMWF, NCAR und Météo-France. 3D-Anzeige: model-viewer (Google, Apache-Lizenz 2.0).',

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
