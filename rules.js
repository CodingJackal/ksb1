/*
 * Name = Name der Regel
 * action = show : nur anzeigen
 *          move : umbuchen
 * kostenstelle = involvierte Kostenstellen
 * kostenart = involvierte Kostenart
 * targetKst = bei action:move die Zielkostenstelle
 * (bei Angabe nur einer targetKst erfolgt Umbuchung nur auf diese,
 * bei mehreren eine 1:1 Umbuchung zur "kostenstelle")
 * percent = wie viel umgebucht wird
 */
ruleSet = [
  {
    name: "Alpha312",
    action: "move",
    kostenstelle: ["67413121", "67423122"],
    kostenart: ["42312000"],
    targetKst: ["67412001", "67422002"],
    percent: 100,
  },
  {
    name: "Beta371",
    action: "move",
    kostenstelle: ["674*"],
    kostenart: ["5*"],
    targetKst: ["67404998"],
    percent: 40,
  },
  {
    name: "Gamma997",
    action: "show",
    kostenstelle: ["67404200", "67411*"],
    kostenart: ["48*"],
    targetKst: ["67404998"],
    percent: 100,
  },
  {
    name: "Delta332",
    action: "show",
    kostenstelle: ["6745*", "67413711", "6744*"],
    kostenart: ["42120000", "5*"],
    targetKst: ["67404998"],
    percent: 100,
  },
];
