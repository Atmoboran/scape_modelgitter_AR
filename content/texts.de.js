// Every visible text of the app. Edit or translate this file to adapt the
// exhibit; index.html only holds data-t="path.to.key" placeholders that
// js/texts.js fills from here. Entries written as functions build a sentence
// around runtime values. Lines marked LOCAL refer to SCAPE° or its region
// (none in this app so far).
window.TEXTS = {
  lang: 'de',
  pageTitle: 'Modellgitter – wie eine Wettervorhersage entsteht',
  description: 'Wie entsteht eine Wettervorhersage? Messen, Kästchen, Mischen, Vorausrechnen – und die Rechengitter der Wettermodelle in 3D und AR.',

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
    lead: 'Wie entsteht eine Wettervorhersage? In fünf kurzen Schritten zum Ausprobieren – vom Thermometer bis zum Computer, der die ganze Erde in Kästchen teilt.'
  },

  // ---- chapter navigation (js/chapters.js) ----------------------------------
  navAria: 'Kapitel',
  chapters: {
    messen:        { nav: 'Messen', label: 'Schritt 1 von 5', title: 'Messen' },
    kaestchen:     { nav: 'Kästchen', label: 'Schritt 2 von 5', title: 'Kästchen' },
    mischen:       { nav: 'Mischen', label: 'Schritt 3 von 5', title: 'Mischen' },
    vorausrechnen: { nav: 'Vorausrechnen', label: 'Schritt 4 von 5', title: 'Voraus­rechnen' },
    gitter:        { nav: 'Die ganze Erde', label: 'Schritt 5 von 5', title: 'Die ganze Erde' }
  },
  chapterPager: {
    aria: 'Vorheriger und nächster Schritt',
    prevAria: name => 'Zurück zu: ' + name,
    nextAria: name => 'Weiter zu: ' + name,
    count: (n, total) => 'Schritt ' + n + ' / ' + total
  },
  fachwort: 'Fachwort',

  // ---- Schritt 1: Messen (js/ch-messen.js) ----------------------------------
  messen: {
    intro: 'Jede Wettervorhersage beginnt mit Messungen. Wetterstationen messen zum Beispiel die Temperatur – aber eben nur dort, wo sie stehen. Wie warm ist es dazwischen?',
    hint: 'An den gelben Fragezeichen steht keine Station. Schätze die Temperatur und löse auf.',
    badge: 'Wie warm ist es am Fragezeichen?',
    legend: '● Wetterstation',
    mountain: 'Berg',
    city: 'Stadt',
    which: {
      near: 'Fragezeichen 1: gleich neben einer Station',
      city: 'Fragezeichen 2: in der Stadt',
      mountain: 'Fragezeichen 3: auf dem Berg'
    },
    guessLabel: 'Dein Tipp',
    solve: 'Auflösen',
    next: 'Nächstes Fragezeichen',
    reset: 'Nochmal raten',
    ask: 'Schieb den Regler auf deinen Tipp und tippe auf „Auflösen“.',
    result: (g, r, d) => 'Dein Tipp: ' + g + ' °C. Echt: <b>' + r + ' °C</b>. ' + (d === 0 ? 'Genau richtig!' : 'Du lagst ' + d + ' °C daneben.'),
    lesson: {
      near: 'Nah an einer Station kann man gut schätzen.',
      city: 'Städte sind wärmer als ihre Umgebung – das sieht keine Station draußen auf dem Land.',
      mountain: 'Auf dem Berg ist es viel kälter, aber dort steht keine Station. Hier liegt man leicht daneben.'
    },
    count: (n, total) => n + ' von ' + total + ' aufgelöst',
    tasks: {
      near: 'Schätze die Temperatur neben der Station.',
      city: 'Schätze die Temperatur in der Stadt.',
      mountain: 'Schätze die Temperatur auf dem Berg.'
    },
    merke: 'Messungen gibt es nur an einzelnen Punkten. Dazwischen muss man schätzen – und je weiter weg die nächste Station ist, desto unsicherer wird die Schätzung.',
    term: '<b>Fachwort:</b> Das Schätzen zwischen Messpunkten heißt <b>Interpolation</b>.',
    more: {
      title: 'Wo wird überall gemessen?',
      body: '<p>In Deutschland betreibt der Deutsche Wetterdienst Hunderte Wetterstationen. Weltweit kommen Wetterballons, Flugzeuge, Schiffe, Bojen und vor allem <b>Satelliten</b> dazu.</p><p>Trotzdem bleiben große Lücken: über den Ozeanen, in Wüsten, im Gebirge – und vor allem hoch oben in der Luft. Das Wetter passiert ja nicht nur am Boden.</p>'
    }
  },

  // ---- Schritt 2: Kästchen (js/ch-kaestchen.js) -----------------------------
  kaestchen: {
    intro: 'Ein Computer kann nicht mit „überall“ rechnen. Darum teilt ein Wettermodell das Land in <b>Kästchen</b> auf – wie Pixel in einem Foto. In jedes Kästchen kommt genau <b>eine</b> Temperatur.',
    hint: 'Mach die Kästchen größer oder kleiner. Erkennst du den Berg und die Stadt noch?',
    sizeLabel: 'Kästchen',
    sizeName: ['sehr groß', 'groß', 'klein', 'sehr klein'],
    real: 'Echtes Wetter zeigen',
    mountain: 'Berg',
    city: 'Stadt',
    readCount: 'Anzahl Kästchen',
    readTime: 'Rechenzeit',
    time: ['1 Sekunde', '8 Sekunden', '1 Minute', '9 Minuten'],
    say: [
      'So grob verschwinden Berg und Stadt. Das Modell weiß nicht, dass es dort kälter oder wärmer ist.',
      'Der Berg ist zu ahnen, die Stadt noch nicht.',
      'Berg und Stadt sind gut zu erkennen.',
      'Fast wie in echt – aber der Computer braucht jetzt viel länger.'
    ],
    tasks: {
      coarse: 'Mach die Kästchen sehr groß. Was passiert mit dem Berg?',
      fine: 'Mach die Kästchen sehr klein.',
      real: 'Vergleiche mit dem echten Wetter.'
    },
    merke: 'Ein Wettermodell teilt die Luft in Kästchen – in jedem steht nur eine Zahl. Kleine Kästchen zeigen mehr Einzelheiten, aber der Computer muss viel mehr rechnen.',
    term: '<b>Fachwort:</b> Die Kästchen zusammen heißen <b>Rechengitter</b>, ihre Größe <b>Auflösung</b>.',
    more: {
      title: 'Wie groß sind die Kästchen in echt?',
      body: '<p>Beim Deutschen Wetterdienst sind die Kästchen für die ganze Welt etwa 13 km breit, für Deutschland etwa 2 km. Und sie liegen nicht nur nebeneinander, sondern auch <b>übereinander</b> – in vielen Schichten bis hoch in die Luft. Zusammen sind das hunderte Millionen Kästchen.</p><p>Halbiert man die Breite, braucht man viermal so viele Kästchen – und weil der Computer dann auch in kürzeren Zeitschritten rechnen muss, etwa achtmal so viel Rechenzeit. Darum stehen in Wetterdiensten einige der größten Computer der Welt.</p>'
    }
  },

  // ---- Schritt 3: Mischen (js/ch-mischen.js) --------------------------------
  mischen: {
    intro: 'Woher kommt die Zahl in jedem Kästchen? Aus <b>zwei</b> Quellen: der <b>Vorhersage</b>, die der Computer vorher für jetzt gerechnet hat – und den neuen <b>Messungen</b>. Beide sind nicht perfekt. Also werden sie gemischt.',
    hint: 'Die Vorhersage sagt 12 °C, die Messung zeigt 16 °C. Wie auf einer Wippe zählt das Genauere mehr. Ändere, wie gut Messung und Vorhersage sind.',
    deviceLabel: 'Gemessen mit',
    profi: 'Wetterstation',
    handy: 'Handy in der Sonne',
    ageLabel: 'Vorhersage von',
    gestern: 'vor 6 Stunden',
    woche: 'vor einer Woche',
    forecastAt: v => 'Vorhersage ' + v + '°',
    measuredAt: v => 'Messung ' + v + '°',
    result: v => 'Ins Kästchen: ' + v + ' °C',
    readMix: 'Ins Kästchen kommt',
    say: {
      profi: {
        gestern: 'Beide sind gut – die Wetterstation ist noch genauer, also zählt sie mehr.',
        woche: 'Eine Woche alte Vorhersage? Dann zählt fast nur die Messung.'
      },
      handy: {
        gestern: 'Ein Handy in der Sonne misst ungenau. Die frische Vorhersage zählt mehr.',
        woche: 'Beide sind ungenau. Die Mischung liegt irgendwo dazwischen.'
      }
    },
    tasks: {
      handy: 'Miss mit dem Handy statt mit der Wetterstation.',
      woche: 'Nimm die Vorhersage von vor einer Woche.',
      almost: 'Finde die Mischung, bei der fast nur die Messung zählt.'
    },
    merke: 'Wetterdienste mischen neue Messungen mit der letzten Vorhersage – wer genauer ist, zählt mehr. So bekommt jedes Kästchen einen guten Startwert, auch dort, wo gar nicht gemessen wird.',
    term: '<b>Fachwort:</b> Dieses Mischen heißt <b>Datenassimilation</b>.',
    more: {
      title: 'Wie oft wird gemischt?',
      body: '<p>Immer wieder: Der Computer rechnet eine Vorhersage für die nächsten Stunden. Dann kommen neue Messungen, werden mit dieser Vorhersage gemischt, und von dort aus wird wieder vorausgerechnet. Beim Deutschen Wetterdienst passiert das für Deutschland jede Stunde.</p><p>Eine Messung verbessert dabei nicht nur ihr eigenes Kästchen, sondern auch die Kästchen in der Nähe. So füllt die Vorhersage die Lücken, die du in Schritt 1 gesehen hast.</p>'
    }
  },

  // ---- Schritt 4: Vorausrechnen (js/ch-vorausrechnen.js) --------------------
  vorausrechnen: {
    intro: 'Jetzt rechnet der Computer in die Zukunft – in kleinen Schritten. Bei jedem Schritt fragt jedes Kästchen seine Nachbarn: Was bringt der Wind zu mir?',
    stepsAria: 'Teile',
    steps: { regen: '1 · Regen zieht', faecher: '2 · Wie sicher?' },
    badge: { regen: 'Starte die Uhr', faecher: 'Rechne eine Vorhersage' },
    regenHint: 'Eine Regenwolke kommt von Westen. Der Wind schiebt den Regen jede Stunde ein Kästchen weiter. Wann regnet es in der Stadt?',
    start: 'Uhr starten',
    pause: 'Anhalten',
    resume: 'Weiter',
    again: 'Nochmal',
    step: '+1 Stunde',
    reset: 'Zurück',
    wind: 'Wind',
    city: 'Stadt',
    clock: h => h + ' Uhr',
    readClock: 'Uhrzeit',
    readCity: 'In der Stadt',
    wet: 'Regen',
    dry: 'trocken',
    waiting: 'Noch ist es in der Stadt trocken.',
    arrived: h => 'Nach ' + h + ' Stunden ist der Regen in der Stadt angekommen.',
    fanHint: 'Niemand kennt das Wetter von jetzt perfekt. Darum rechnet der Computer viele Vorhersagen, jede mit einem winzig anderen Start. Tippe mehrmals auf „Vorhersage rechnen“.',
    add: 'Vorhersage rechnen',
    clear: 'Alle löschen',
    fanTitle: 'Temperatur in der Stadt',
    fanEmpty: 'Noch keine Vorhersage gerechnet',
    today: 'heute',
    dayN: d => 'Tag ' + d,
    sure: 'einig',
    unsure: 'unsicher',
    readRuns: 'Vorhersagen',
    readSure: 'Einig bis',
    untilDay: d => 'Tag ' + d,
    allDays: 'alle 10 Tage',
    tasks: {
      rain: 'Lass die Uhr laufen, bis es in der Stadt regnet.',
      fan: 'Rechne mindestens 5 Vorhersagen. Wann laufen sie auseinander?'
    },
    merke: 'Ein Wettermodell rechnet Schritt für Schritt in die Zukunft. Kleine Fehler am Anfang werden mit der Zeit größer. Darum rechnen Wetterdienste viele Vorhersagen gleichzeitig: Sind sie sich einig, ist die Vorhersage sicher.',
    term: '<b>Fachwort:</b> Viele Vorhersagen auf einmal nennt man <b>Ensemble</b>.',
    more: {
      title: 'Wie weit kann man das Wetter vorhersagen?',
      body: '<p>Für die nächsten Tage sind Vorhersagen heute sehr gut. Nach etwa einer Woche werden sie deutlich unsicherer, nach rund zwei Wochen weiß niemand mehr, ob es an einem bestimmten Tag regnet.</p><p>Das liegt nicht an schlechten Computern, sondern am Wetter selbst: Winzige Unterschiede wachsen immer weiter an. Man nennt das den <b>Schmetterlingseffekt</b>. Die Linien hier stammen aus einem Spielzeug-Wettermodell, das genau dieses Verhalten zeigt.</p>'
    }
  },

  // ---- Schritt 5: Die ganze Erde (js/app.js) --------------------------------
  gitter: {
    intro: 'Echte Wettermodelle legen ihre Kästchen um die ganze Erde – und in Schichten übereinander. Eine Kugel in Kästchen zu zerlegen, ist gar nicht so einfach. Hier siehst du neun Lösungen. Dreh sie mit dem Finger oder stell sie mit AR in deinen Raum.'
  },

  stripAria: 'Gitter auswählen',
  count: (n, total) => 'Gitter ' + n + ' von ' + total,

  stage: {
    alt: name => '3D-Modell: ' + name + ', aufgeschnitten, mit den Schichten übereinander',
    badge: 'Zieh am Gitter, um es zu drehen',
    error: 'Das 3D-Modell konnte nicht geladen werden. Lade die Seite neu.',
    fileError: 'Die 3D-Modelle laden nur, wenn die Seite über einen Webserver geöffnet wird (nicht per Doppelklick). Siehe README.'
  },
  hint: 'Zieh am Gitter, um es zu drehen. Mit zwei Fingern (am Computer: Strg + Mausrad) zoomst du hinein und siehst die Schichten übereinander.',

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
    note: '<p><b>Form der Kästchen:</b> So sieht ein Kästchen von oben aus. Nach oben sind die Kästchen in Schichten gestapelt.</p><p><b>Größe der Kästchen:</b> So breit ist ein Kästchen ungefähr. Je kleiner, desto genauer – und desto länger rechnet der Computer.</p>',
    institution: 'Wer nutzt es',
    type: 'Idee',
    cells: 'Form der Kästchen',
    resolution: 'Größe der Kästchen'
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
    text: 'Wettermodelle legen ihre Kästchen um die ganze Erde – und in vielen Schichten übereinander. Eine Kugel lässt sich nicht perfekt in gleich große Kästchen teilen. Darum hat jeder Wetterdienst seine eigene Lösung.'
  },

  topics: {
    what: {
      title: 'Warum Schichten übereinander?',
      body: '<p>Das Wetter passiert nicht nur am Boden. Wolken, Wind und Regen entstehen auch hoch oben in der Luft. Darum stapelt ein Wettermodell seine Kästchen in vielen Schichten übereinander – bis in über 50 km Höhe.</p><p>Wenn du ins 3D-Modell hineinzoomst, siehst du diese Schichten. Unten, wo das Wetter am meisten passiert, sind sie dünner, oben dicker.</p>'
    },
    why: {
      title: 'Warum gibt es so viele verschiedene Gitter?',
      body: '<p>Versuch einmal, einen Ball mit lauter gleich großen Kästchen zu bekleben, ohne Lücken und ohne Überlappungen. Das klappt nicht perfekt! Jedes Gitter ist ein anderer Kompromiss.</p><ul><li><b>Wie auf der Weltkarte</b> (Längen-Breiten-Gitter): einfach, aber an den Polen werden die Kästchen winzig schmal.</li><li><b>Aus einem Würfel</b> (Kubus-Sphäre): ein aufgeblasener Würfel mit sechs Seiten aus Vierecken.</li><li><b>Aus Dreiecken</b> (ICON): fast überall gleich groß – so macht es der Deutsche Wetterdienst.</li></ul>',
      figAria: 'Zeichnung: links eine Kugel aus Dreiecken, rechts eine Kugel aus Rauten',
      figCaption: 'Zwei Wege, eine Kugel in Kästchen zu teilen'
    },
    simplified: {
      title: 'Was ist an den 3D-Modellen vereinfacht?',
      body: '<p>Die Kästchen sind hier riesig gezeichnet und die Luftschicht viel zu dick – sonst könntest du nichts erkennen. Ein echtes Wettermodell hat Millionen Kästchen in jeder Schicht und oft 90 Schichten oder mehr.</p><p>Der Schnitt zeigt dir das Innere. In Wirklichkeit umschließt das Gitter die ganze Erde ohne Lücke.</p>'
    }
  },

  pager: {
    aria: 'Vorheriges und nächstes Gitter',
    prevAria: name => 'Vorheriges Gitter: ' + name,
    nextAria: name => 'Nächstes Gitter: ' + name
  },

  sources: 'Landschaft und Wetterdaten in den Schritten 1–4 sind ausgedacht. Die Vorhersage-Linien in Schritt 4 stammen aus dem Spielzeug-Wettermodell von Edward Lorenz (1963). Angaben zu den Modellen nach DWD, NOAA, ECMWF, NCAR und Météo-France. 3D-Anzeige: model-viewer (Google, Apache-Lizenz 2.0).',

  // The nine grids, in the order of the strip. name: heading and pager;
  // short: chip in the strip; ar: label of the AR button.
  grids: {
    icon: {
      name: 'ICON-Gitter (Dreiecke)',
      short: 'ICON',
      ar: 'ICON-Gitter in AR ansehen',
      institution: 'Deutscher Wetterdienst',
      type: 'Ein Ball aus 20 Dreiecken, immer feiner unterteilt',
      cells: 'Dreiecke',
      resolution: 'etwa 13 km',
      explain: 'Stell dir einen Ball aus 20 Dreiecken vor. Jedes Dreieck teilst du in kleinere Dreiecke, und die wieder, und wieder. So baut der Deutsche Wetterdienst sein Gitter. Der Vorteil: Die Kästchen sind überall auf der Erde fast gleich groß.'
    },
    cubedsphere: {
      name: 'Würfel-Gitter (Kubus-Sphäre)',
      short: 'Würfel',
      ar: 'Würfel-Gitter in AR ansehen',
      institution: 'US-Wetterdienst (Modell GFS)',
      type: 'Ein aufgeblasener Würfel',
      cells: 'Vierecke',
      resolution: 'etwa 13 km',
      explain: 'Nimm einen Würfel und blase ihn auf wie einen Luftballon, bis er rund ist. Übrig bleiben sechs gewölbte Seiten aus Vierecken. So rechnet zum Beispiel der Wetterdienst der USA.'
    },
    gaussian: {
      name: 'Gauß-Gitter',
      short: 'Gauß',
      ar: 'Gauß-Gitter in AR ansehen',
      institution: 'viele ältere Wettermodelle',
      type: 'Wie die Weltkarte, mit klug verteilten Breitenkreisen',
      cells: 'Rechtecke',
      resolution: 'je nach Modell',
      explain: 'Fast wie eine Weltkarte. Nur liegen die Breitenkreise nicht ganz gleichmäßig, sondern so, dass der Computer besonders schnell rechnen kann. Benannt nach dem Mathematiker Carl Friedrich Gauß.'
    },
    latlon: {
      name: 'Längen-Breiten-Gitter',
      short: 'Weltkarte',
      ar: 'Längen-Breiten-Gitter in AR ansehen',
      institution: 'viele Wettermodelle, vor allem früher',
      type: 'Wie die Linien auf einem Globus',
      cells: 'Rechtecke, an den Polen sehr schmal',
      resolution: 'je nach Modell',
      explain: 'Das einfachste Gitter: Es folgt den Linien, die du von jedem Globus kennst. Der Nachteil: Zu den Polen hin werden die Kästchen immer schmaler, bis sie sich in einem Punkt treffen.'
    },
    voronoi: {
      name: 'Waben-Gitter mit Lupe (Voronoi)',
      short: 'Lupe',
      ar: 'Voronoi-Gitter in AR ansehen',
      institution: 'Forschungsmodell MPAS (USA)',
      type: 'Kleine Kästchen nur dort, wo es wichtig ist',
      cells: 'Sechsecke, verschieden groß',
      resolution: 'von wenigen bis zu vielen Kilometern',
      explain: 'Dieses Gitter arbeitet wie eine Lupe: Über einem Gebiet, das besonders wichtig ist, sind die Kästchen klein, überall sonst groß. So spart der Computer Rechenzeit.'
    },
    hexicosahedral: {
      name: 'Sechseck-Gitter',
      short: 'Sechseck',
      ar: 'Sechseck-Gitter in AR ansehen',
      institution: 'Deutscher Wetterdienst (Modell GME, bis 2015)',
      type: 'Ein Ball aus Sechsecken, wie ein Fußball',
      cells: 'Sechsecke und 12 Fünfecke',
      resolution: 'zuletzt etwa 20 km',
      explain: 'Wie ein Fußball: lauter Sechsecke und genau zwölf Fünfecke. Mit diesem Gitter hat der Deutsche Wetterdienst bis 2015 gerechnet, bevor er zu den Dreiecken von ICON gewechselt ist.'
    },
    reducedgaussian: {
      name: 'Gauß-Gitter mit weniger Kästchen an den Polen',
      short: 'Gauß, sparsam',
      ar: 'Reduziertes Gauß-Gitter in AR ansehen',
      institution: 'Europäisches Wetterzentrum (ECMWF)',
      type: 'Wie das Gauß-Gitter, nur sparsamer',
      cells: 'Rechtecke, zu den Polen hin weniger',
      resolution: 'je nach Modell',
      explain: 'Eine schlaue Verbesserung des Gauß-Gitters: Nahe den Polen, wo wenig Platz ist, werden einfach weniger Kästchen pro Ring verwendet. Das spart Rechenzeit.'
    },
    stretched: {
      name: 'Gestrecktes Gitter',
      short: 'Gestreckt',
      ar: 'Gestrecktes Gitter in AR ansehen',
      institution: 'z. B. französischer Wetterdienst (Modell ARPEGE)',
      type: 'Gedreht und gezogen, fein über einem Land',
      cells: 'Rechtecke, verschieden groß',
      resolution: 'fein über dem Zielgebiet, grob auf der anderen Seite der Erde',
      explain: 'Das Gitter wird gedreht und wie ein Gummituch gezogen, bis die kleinsten Kästchen genau über einem Land liegen. Frankreich bekommt so feine Kästchen, die andere Seite der Erde grobe.'
    },
    yinyang: {
      name: 'Yin-Yang-Gitter',
      short: 'Yin-Yang',
      ar: 'Yin-Yang-Gitter in AR ansehen',
      institution: 'Forschungsmodelle',
      type: 'Zwei Teile wie bei einem Tennisball',
      cells: 'Rechtecke, nirgends gequetscht',
      resolution: 'je nach Modell',
      explain: 'Zwei gleiche Stücke, die zusammen den ganzen Ball bedecken – wie die Naht auf einem Tennisball. Keines der beiden Stücke reicht bis an einen Pol. So gibt es keine gequetschten Kästchen.'
    }
  }
};
