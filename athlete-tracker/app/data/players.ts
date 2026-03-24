export type Player = {
  id: string;
  name: string;
  position: string;
  number: string;
  hometown: string;
  nflDrafted: string | null;
  nflCareer: string | null;
  currentRole: string;
  currentSummary: string;
  currentLink: string | null;
  currentLinkLabel: string | null;
  imageInitials: string;
  status: "NFL Active" | "Post-Football Career" | "Coaching/Sports" | "Unknown";
};

export const players: Player[] = [
  {
    id: "derrick-henry",
    name: "Derrick Henry",
    position: "RB",
    number: "27",
    hometown: "Yulee, FL",
    nflDrafted: "2016 NFL Draft, Round 2, Pick 45 (Tennessee Titans)",
    nflCareer: "2016–present (Titans, Ravens, Bears)",
    currentRole: "NFL Running Back — Tennessee Titans",
    currentSummary:
      "Derrick Henry remains one of the most dominant running backs in NFL history. After winning the Heisman Trophy at Alabama in 2015, he was drafted by the Titans, where he became a two-time NFL rushing champion. He signed with the Baltimore Ravens in 2024 and had a historic season, posting over 1,900 rushing yards. He is widely considered the best power back of his generation.",
    currentLink: "https://www.pro-football-reference.com/players/H/HenrDe00.htm",
    currentLinkLabel: "Pro Football Reference",
    imageInitials: "DH",
    status: "NFL Active",
  },
  {
    id: "marlon-humphrey",
    name: "Marlon Humphrey",
    position: "CB",
    number: "26",
    hometown: "Hoover, AL",
    nflDrafted: "2017 NFL Draft, Round 1, Pick 16 (Baltimore Ravens)",
    nflCareer: "2017–present (Baltimore Ravens)",
    currentRole: "NFL Cornerback — Baltimore Ravens",
    currentSummary:
      "Marlon Humphrey has developed into one of the top cornerbacks in the NFL with the Baltimore Ravens. The son of former Alabama and NFL receiver Bobby Humphrey, Marlon is a two-time Pro Bowl selection and was named first-team All-Pro in 2019. He remains a cornerstone of Baltimore's defense and is active on social media, known for his candid personality off the field.",
    currentLink: "https://www.pro-football-reference.com/players/H/HumpMa00.htm",
    currentLinkLabel: "Pro Football Reference",
    imageInitials: "MH",
    status: "NFL Active",
  },
  {
    id: "o-j-howard",
    name: "O.J. Howard",
    position: "TE",
    number: "88",
    hometown: "Prattville, AL",
    nflDrafted: "2017 NFL Draft, Round 1, Pick 19 (Tampa Bay Buccaneers)",
    nflCareer: "2017–2023 (Buccaneers, Raiders, Texans, Patriots)",
    currentRole: "Free Agent / Pursuing Entrepreneurship",
    currentSummary:
      "O.J. Howard was one of the most hyped tight end prospects in recent memory after standout performances in Alabama's championship games. After a promising but injury-interrupted NFL career, Howard has transitioned his focus to business ventures and mentoring youth athletes. He has spoken publicly about mental health awareness and life after football, and remains engaged in the Alabama community.",
    currentLink: "https://twitter.com/ojhoward88",
    currentLinkLabel: "Twitter / X",
    imageInitials: "OJ",
    status: "Post-Football Career",
  },
  {
    id: "ryan-kelly",
    name: "Ryan Kelly",
    position: "C",
    number: "55",
    hometown: "Louisville, KY",
    nflDrafted: "2016 NFL Draft, Round 1, Pick 18 (Indianapolis Colts)",
    nflCareer: "2016–2023 (Indianapolis Colts)",
    currentRole: "Retired — Business & Community Work",
    currentSummary:
      "Ryan Kelly anchored the Indianapolis Colts' offensive line for seven seasons after being a first-round pick out of Alabama. He was the team's long-snapper and starting center, earning a Pro Bowl selection in 2018. After retiring in 2023, Kelly has been involved in charitable work in the Indianapolis area and is exploring business opportunities. He remains one of the most respected figures from the 2015 Alabama class.",
    currentLink: null,
    currentLinkLabel: null,
    imageInitials: "RK",
    status: "Post-Football Career",
  },
  {
    id: "jarran-reed",
    name: "Jarran Reed",
    position: "DT",
    number: "90",
    hometown: "Goldsboro, NC",
    nflDrafted: "2016 NFL Draft, Round 2, Pick 49 (Seattle Seahawks)",
    nflCareer: "2016–2022 (Seahawks, Chiefs, Packers)",
    currentRole: "Retired — Youth Football Coach",
    currentSummary:
      "Jarran Reed had a solid seven-year NFL career as a run-stuffing defensive tackle, including winning Super Bowl LIV with the Kansas City Chiefs in 2020. Since retiring, Reed has returned to North Carolina and has been coaching youth and high school football, giving back to the community that raised him. He is passionate about player development and mentoring young linemen.",
    currentLink: null,
    currentLinkLabel: null,
    imageInitials: "JR",
    status: "Coaching/Sports",
  },
  {
    id: "reggie-ragland",
    name: "Reggie Ragland",
    position: "LB",
    number: "19",
    hometown: "McCalla, AL",
    nflDrafted: "2016 NFL Draft, Round 2, Pick 41 (Buffalo Bills)",
    nflCareer: "2017–2021 (Bills, Chiefs, Lions)",
    currentRole: "Retired — Real Estate Investor",
    currentSummary:
      "Reggie Ragland was a dominant linebacker at Alabama and was projected to be a star in the NFL, but injuries derailed much of his career. After five seasons across several teams, he retired and has channeled his energy into real estate investment in the Birmingham, Alabama area. He has been open about financial literacy for athletes and occasionally speaks at events for current college players on the importance of planning for life after sports.",
    currentLink: null,
    currentLinkLabel: null,
    imageInitials: "RR",
    status: "Post-Football Career",
  },
  {
    id: "a-shawn-robinson",
    name: "A'Shawn Robinson",
    position: "DT",
    number: "86",
    hometown: "Fort Worth, TX",
    nflDrafted: "2016 NFL Draft, Round 2, Pick 46 (Detroit Lions)",
    nflCareer: "2016–present (Lions, Rams)",
    currentRole: "NFL Defensive Tackle — Los Angeles Rams",
    currentSummary:
      "A'Shawn Robinson has carved out a long NFL career as a run-stopping defensive tackle. After four seasons with the Detroit Lions, he joined the Los Angeles Rams, where he was part of the Super Bowl LVI championship team in 2022. Robinson is known for his consistency and professionalism, and has been a key rotational piece on some of the best defensive lines in the league.",
    currentLink: "https://www.pro-football-reference.com/players/R/RobiAs00.htm",
    currentLinkLabel: "Pro Football Reference",
    imageInitials: "AR",
    status: "NFL Active",
  },
  {
    id: "jonathan-allen",
    name: "Jonathan Allen",
    position: "DL",
    number: "93",
    hometown: "Leesburg, VA",
    nflDrafted: "2017 NFL Draft, Round 1, Pick 17 (Washington Commanders)",
    nflCareer: "2017–present (Washington Commanders)",
    currentRole: "NFL Defensive Lineman — Washington Commanders",
    currentSummary:
      "Jonathan Allen is widely regarded as one of the best defensive linemen of his generation. A three-time Pro Bowl selection with the Washington Commanders, Allen has been the anchor of Washington's defensive front since being drafted 17th overall in 2017. He was named the Outland Trophy winner at Alabama in 2016 after dominating college football. Allen is also known for his community outreach work in the Washington D.C. metro area.",
    currentLink: "https://www.pro-football-reference.com/players/A/AlleJo02.htm",
    currentLinkLabel: "Pro Football Reference",
    imageInitials: "JA",
    status: "NFL Active",
  },
  {
    id: "calvin-ridley",
    name: "Calvin Ridley",
    position: "WR",
    number: "3",
    hometown: "Pompano Beach, FL",
    nflDrafted: "2018 NFL Draft, Round 1, Pick 26 (Atlanta Falcons)",
    nflCareer: "2018–present (Falcons, Jaguars, Titans)",
    currentRole: "NFL Wide Receiver — Tennessee Titans",
    currentSummary:
      "Calvin Ridley is one of the most talented wide receivers of his era, known for his precise route running and contested catch ability. After a promising start with the Atlanta Falcons, his career was interrupted by a mental health break and later a gambling suspension. He returned with the Jacksonville Jaguars and then signed with the Tennessee Titans, showing he still has elite receiving ability. Ridley has been candid about prioritizing mental well-being, becoming an advocate for athlete mental health.",
    currentLink: "https://www.pro-football-reference.com/players/R/RidlCa00.htm",
    currentLinkLabel: "Pro Football Reference",
    imageInitials: "CR",
    status: "NFL Active",
  },
  {
    id: "deionte-thompson",
    name: "Deionte Thompson",
    position: "S",
    number: "14",
    hometown: "Orange, TX",
    nflDrafted: "2019 NFL Draft, Round 5, Pick 158 (Arizona Cardinals)",
    nflCareer: "2019–2022 (Cardinals, Falcons)",
    currentRole: "Pursuing Coaching Career",
    currentSummary:
      "Deionte Thompson had a four-year NFL career as a safety after being selected in the fifth round by the Arizona Cardinals in 2019. Since his playing days ended, Thompson has been working toward a coaching career, volunteering with high school programs in the Houston, Texas area. He has expressed interest in becoming a defensive backs coach at the college level and is working on his coaching credentials.",
    currentLink: null,
    currentLinkLabel: null,
    imageInitials: "DT",
    status: "Coaching/Sports",
  },
  {
    id: "kenyan-drake",
    name: "Kenyan Drake",
    position: "RB",
    number: "17",
    hometown: "Powder Springs, GA",
    nflDrafted: "2016 NFL Draft, Round 3, Pick 73 (Miami Dolphins)",
    nflCareer: "2016–2022 (Dolphins, Cardinals, Raiders, Ravens)",
    currentRole: "Retired — Media & Broadcasting",
    currentSummary:
      "Kenyan Drake had a memorable seven-year NFL career, highlighted by a stunning touchdown on the 'Miami Miracle' play in 2018 and a Pro Bowl season with the Arizona Cardinals in 2020. Since retiring, Drake has transitioned into media, appearing as a football analyst and commentator. He has a natural on-screen presence and has been pursuing opportunities in sports broadcasting and podcast hosting.",
    currentLink: "https://twitter.com/KDx32",
    currentLinkLabel: "Twitter / X",
    imageInitials: "KD",
    status: "Post-Football Career",
  },
  {
    id: "tj-yeldon",
    name: "T.J. Yeldon",
    position: "RB",
    number: "4",
    hometown: "Daphne, AL",
    nflDrafted: "2015 NFL Draft, Round 2, Pick 36 (Jacksonville Jaguars)",
    nflCareer: "2015–2020 (Jaguars, Bills, Patriots)",
    currentRole: "Retired — Personal Training & Fitness",
    currentSummary:
      "T.J. Yeldon was one of the most recruited running backs in Alabama history and had a solid six-year NFL career, primarily with the Jacksonville Jaguars. Since retiring, he has returned to Alabama and opened a personal training business, working with athletes of all ages. Yeldon remains active in the Daphne community where he grew up and is a regular presence at local high school football games.",
    currentLink: null,
    currentLinkLabel: null,
    imageInitials: "TY",
    status: "Post-Football Career",
  },
];
