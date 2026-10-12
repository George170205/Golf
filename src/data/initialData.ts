import { Tournament, Player, Team, Round, RoundResult, PointRule, AppSettings } from '../types/tournament';

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    "id": "tour_1",
    "name": "Torneo Los Santos 2026/27",
    "season": "2026-2027",
    "club": "Los Santos Golf Club",
    "description": "Campeonato Oficial con clasificación individual por categoría (Premiere, Elite, Advanced) y Copa LIV por Equipos.",
    "useHci80": true,
    "tiebreak": "putts",
    "status": "in_progress",
    "createdAt": "2026-08-01"
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    "id": "t_1",
    "name": "Beerdie Guys",
    "color": "#1F5A3A"
  },
  {
    "id": "t_2",
    "name": "Slicing Ninjas",
    "color": "#B8893B"
  },
  {
    "id": "t_3",
    "name": "Chapter 11",
    "color": "#0F4C75"
  },
  {
    "id": "t_4",
    "name": "Little Balls",
    "color": "#7E22CE"
  }
];

export const INITIAL_PLAYERS: Player[] = [
  {
    "id": "p_1",
    "name": "Albert Joel Martínez",
    "ghin": "2938261",
    "hci": 15.2,
    "category": "Premiere",
    "teamId": "t_1",
    "slot": 2
  },
  {
    "id": "p_2",
    "name": "Alberto Diaz",
    "ghin": "116210608",
    "hci": 18.2,
    "category": "Premiere",
    "teamId": "t_1",
    "slot": 1
  },
  {
    "id": "p_3",
    "name": "Cesar Nevarez",
    "ghin": "11627740",
    "hci": 18.0,
    "category": "Premiere",
    "teamId": "t_1",
    "slot": 3
  },
  {
    "id": "p_4",
    "name": "Daniel Cisneros",
    "ghin": "13131917",
    "hci": 17.7,
    "category": "Premiere",
    "teamId": "t_1",
    "slot": 4
  },
  {
    "id": "p_5",
    "name": "Daniel Martinez",
    "ghin": "12312564",
    "hci": 19.8,
    "category": "Premiere",
    "teamId": "t_2",
    "slot": 1
  },
  {
    "id": "p_6",
    "name": "David Martínez",
    "ghin": "11523111",
    "hci": 16.7,
    "category": "Premiere",
    "teamId": "t_2",
    "slot": 2
  },
  {
    "id": "p_7",
    "name": "Eddie Rodríguez",
    "ghin": "11999868",
    "hci": 10.2,
    "category": "Premiere",
    "teamId": "t_2",
    "slot": 3
  },
  {
    "id": "p_8",
    "name": "Joe Hernández",
    "ghin": "",
    "hci": 8.4,
    "category": "Premiere",
    "teamId": "t_2",
    "slot": 4
  },
  {
    "id": "p_9",
    "name": "Jorge Bache",
    "ghin": "11493763",
    "hci": 16.2,
    "category": "Premiere",
    "teamId": "t_3",
    "slot": 1
  },
  {
    "id": "p_10",
    "name": "Jorge Ojeda",
    "ghin": "13153034",
    "hci": 15.0,
    "category": "Premiere",
    "teamId": "t_3",
    "slot": 2
  },
  {
    "id": "p_11",
    "name": "Jose Luis Vazquez",
    "ghin": "252880",
    "hci": 6.6,
    "category": "Premiere",
    "teamId": "t_3",
    "slot": 3
  },
  {
    "id": "p_12",
    "name": "Luis Pisano",
    "ghin": "12118507",
    "hci": 13.6,
    "category": "Premiere",
    "teamId": "t_3",
    "slot": 4
  },
  {
    "id": "p_13",
    "name": "Patricio Orozco Loza",
    "ghin": "",
    "hci": 16.0,
    "category": "Premiere",
    "teamId": "t_4",
    "slot": 1
  },
  {
    "id": "p_14",
    "name": "Raul Inzunza",
    "ghin": "2932828",
    "hci": 15.0,
    "category": "Premiere",
    "teamId": "t_4",
    "slot": 2
  },
  {
    "id": "p_15",
    "name": "Rodolfo Sanchez",
    "ghin": "",
    "hci": 19.0,
    "category": "Premiere",
    "teamId": "t_4",
    "slot": 3
  },
  {
    "id": "p_16",
    "name": "Yasid Lopez",
    "ghin": "126612294",
    "hci": 15.8,
    "category": "Premiere",
    "teamId": "t_4",
    "slot": 4
  },
  {
    "id": "p_17",
    "name": "Aldo Acuña",
    "ghin": "",
    "hci": 24.0,
    "category": "Elite",
    "teamId": "t_1",
    "slot": 5
  },
  {
    "id": "p_18",
    "name": "Alfonso Nogueira",
    "ghin": "",
    "hci": 23.3,
    "category": "Elite",
    "teamId": "t_1",
    "slot": 6
  },
  {
    "id": "p_19",
    "name": "Antonio Sánchez",
    "ghin": "12844586",
    "hci": 24.6,
    "category": "Elite",
    "teamId": "t_1",
    "slot": 7
  },
  {
    "id": "p_20",
    "name": "Carlos del Rio Sr",
    "ghin": "2890167",
    "hci": 20.3,
    "category": "Elite",
    "teamId": "t_1",
    "slot": 8
  },
  {
    "id": "p_21",
    "name": "Carlos Figueroa",
    "ghin": "12549844",
    "hci": 21.6,
    "category": "Elite",
    "teamId": "t_1",
    "slot": 9
  },
  {
    "id": "p_22",
    "name": "Carlos Valencia",
    "ghin": "12659830",
    "hci": 22.1,
    "category": "Elite",
    "teamId": "t_2",
    "slot": 5
  },
  {
    "id": "p_23",
    "name": "Erick Rodríguez",
    "ghin": "12047391",
    "hci": 23.3,
    "category": "Elite",
    "teamId": "t_2",
    "slot": 7
  },
  {
    "id": "p_24",
    "name": "Fernando Diez",
    "ghin": "11617410",
    "hci": 20.8,
    "category": "Elite",
    "teamId": "t_2",
    "slot": 8
  },
  {
    "id": "p_25",
    "name": "Hassan Ali",
    "ghin": "",
    "hci": 26.0,
    "category": "Elite",
    "teamId": "t_2",
    "slot": 9
  },
  {
    "id": "p_26",
    "name": "Iván Becerra Serrano",
    "ghin": "",
    "hci": 23.0,
    "category": "Elite",
    "teamId": "t_3",
    "slot": 5
  },
  {
    "id": "p_27",
    "name": "Jorge Mazas",
    "ghin": "12690144",
    "hci": 24.9,
    "category": "Elite",
    "teamId": "t_3",
    "slot": 6
  },
  {
    "id": "p_28",
    "name": "Julio Brambila",
    "ghin": "",
    "hci": 26.0,
    "category": "Elite",
    "teamId": "t_3",
    "slot": 7
  },
  {
    "id": "p_29",
    "name": "Marco Carrillo",
    "ghin": "",
    "hci": 21.5,
    "category": "Elite",
    "teamId": "t_3",
    "slot": 8
  },
  {
    "id": "p_30",
    "name": "Marco Trujillo",
    "ghin": "11228110",
    "hci": 26.1,
    "category": "Elite",
    "teamId": "t_3",
    "slot": 9
  },
  {
    "id": "p_31",
    "name": "Miguel Camacho",
    "ghin": "12114482",
    "hci": 25.7,
    "category": "Elite",
    "teamId": "t_4",
    "slot": 6
  },
  {
    "id": "p_32",
    "name": "Pedro Gonzalez",
    "ghin": "13093472",
    "hci": 24.1,
    "category": "Elite",
    "teamId": "t_4",
    "slot": 7
  },
  {
    "id": "p_33",
    "name": "Rubén Aguayo",
    "ghin": "10947502",
    "hci": 20.3,
    "category": "Elite",
    "teamId": "t_4",
    "slot": 8
  },
  {
    "id": "p_34",
    "name": "Temoc Ortiz",
    "ghin": "",
    "hci": 24.0,
    "category": "Elite",
    "teamId": "t_2",
    "slot": 6
  },
  {
    "id": "p_35",
    "name": "Tomás Sánchez",
    "ghin": "11910789",
    "hci": 20.7,
    "category": "Elite",
    "teamId": "t_4",
    "slot": 9
  },
  {
    "id": "p_36",
    "name": "Ulises Araiza",
    "ghin": "12659216",
    "hci": 26.3,
    "category": "Elite",
    "teamId": "t_4",
    "slot": 5
  },
  {
    "id": "p_37",
    "name": "Alonso Lopez",
    "ghin": "2993335",
    "hci": 27.8,
    "category": "Advanced",
    "teamId": "t_1",
    "slot": 10
  },
  {
    "id": "p_38",
    "name": "Arturo Sanchez",
    "ghin": "12551319",
    "hci": 27.2,
    "category": "Advanced",
    "teamId": "t_1",
    "slot": 11
  },
  {
    "id": "p_39",
    "name": "Carlos del Río Jr",
    "ghin": "",
    "hci": 28.0,
    "category": "Advanced",
    "teamId": "t_1",
    "slot": 12
  },
  {
    "id": "p_40",
    "name": "David Lau",
    "ghin": "13173023",
    "hci": 28.0,
    "category": "Advanced",
    "teamId": "t_2",
    "slot": 10
  },
  {
    "id": "p_41",
    "name": "Enrique Sanchez",
    "ghin": "13127671",
    "hci": 30.0,
    "category": "Advanced",
    "teamId": "t_2",
    "slot": 11
  },
  {
    "id": "p_42",
    "name": "Esteban Fernández",
    "ghin": "12833723",
    "hci": 29.1,
    "category": "Advanced",
    "teamId": "t_2",
    "slot": 12
  },
  {
    "id": "p_43",
    "name": "Fabrizio Ghidoni",
    "ghin": "12662146",
    "hci": 26.8,
    "category": "Advanced",
    "teamId": "t_3",
    "slot": 10
  },
  {
    "id": "p_44",
    "name": "Gabriel Haro",
    "ghin": "",
    "hci": 27.2,
    "category": "Advanced",
    "teamId": "t_3",
    "slot": 11
  },
  {
    "id": "p_45",
    "name": "Juan Vega",
    "ghin": "13040185",
    "hci": 35.0,
    "category": "Advanced",
    "teamId": "t_3",
    "slot": 12
  },
  {
    "id": "p_46",
    "name": "Mariano Gutiérrez",
    "ghin": "13144680",
    "hci": 35.4,
    "category": "Advanced",
    "teamId": "t_4",
    "slot": 10
  },
  {
    "id": "p_47",
    "name": "Rafael Cisneros",
    "ghin": "12665998",
    "hci": 27.9,
    "category": "Advanced",
    "teamId": "t_4",
    "slot": 11
  },
  {
    "id": "p_48",
    "name": "Xavier Vela",
    "ghin": "13012447",
    "hci": 29.3,
    "category": "Advanced",
    "teamId": "t_4",
    "slot": 12
  },
  {
    "id": "p_49",
    "name": "Jean Paul Dugay",
    "ghin": "",
    "hci": 26.0,
    "category": "Elite",
    "teamId": null,
    "slot": null
  },
  {
    "id": "p_50",
    "name": "Sergio Lopez Techalott",
    "ghin": "",
    "hci": 28.0,
    "category": "Elite",
    "teamId": null,
    "slot": null
  },
  {
    "id": "p_51",
    "name": "Jose Valdovinos",
    "ghin": "",
    "hci": 19.0,
    "category": "Elite",
    "teamId": null,
    "slot": null
  }
];

export const INITIAL_ROUNDS: Round[] = [
  {
    "id": "r_1",
    "number": 1,
    "name": "Jornada 1",
    "course": "Baja Country Club",
    "shortCourse": "BCC",
    "date": "2026-08-16",
    "status": "completed"
  },
  {
    "id": "r_2",
    "number": 2,
    "name": "Jornada 2",
    "course": "Real del Mar",
    "shortCourse": "RDM",
    "date": "2026-09-20",
    "status": "completed"
  },
  {
    "id": "r_3",
    "number": 3,
    "name": "Jornada 3",
    "course": "Club Campestre Tijuana",
    "shortCourse": "COR",
    "date": "2026-10-18",
    "status": "scheduled"
  },
  {
    "id": "r_4",
    "number": 4,
    "name": "Jornada 4",
    "course": "Bajamar Ocean Front",
    "shortCourse": "BAJ",
    "date": "2026-11-15",
    "status": "scheduled"
  },
  {
    "id": "r_5",
    "number": 5,
    "name": "Jornada 5",
    "course": "Club Campestre Tijuana",
    "shortCourse": "COR",
    "date": "2026-12-13",
    "status": "scheduled"
  }
];

export const INITIAL_RESULTS: RoundResult[] = [
  {
    "id": "res_r1_p_1",
    "roundId": "r_1",
    "playerId": "p_1",
    "gross": 91,
    "net": 79.0,
    "putts": 36,
    "points": 13.0,
    "ctp": true,
    "hciSnapshot": 15.2
  },
  {
    "id": "res_r1_p_16",
    "roundId": "r_1",
    "playerId": "p_16",
    "gross": 98,
    "net": 85.0,
    "putts": 33,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 15.8
  },
  {
    "id": "res_r1_p_14",
    "roundId": "r_1",
    "playerId": "p_14",
    "gross": 96,
    "net": 84.0,
    "putts": 35,
    "points": 12.0,
    "ctp": true,
    "hciSnapshot": 15.0
  },
  {
    "id": "res_r1_p_2",
    "roundId": "r_1",
    "playerId": "p_2",
    "gross": 88,
    "net": 73.0,
    "putts": 31,
    "points": 15.0,
    "ctp": false,
    "hciSnapshot": 18.2
  },
  {
    "id": "res_r1_p_5",
    "roundId": "r_1",
    "playerId": "p_5",
    "gross": 104,
    "net": 88.0,
    "putts": 41,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 19.8
  },
  {
    "id": "res_r1_p_7",
    "roundId": "r_1",
    "playerId": "p_7",
    "gross": 93,
    "net": 85.0,
    "putts": 36,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 10.2
  },
  {
    "id": "res_r1_p_8",
    "roundId": "r_1",
    "playerId": "p_8",
    "gross": 94,
    "net": 87.0,
    "putts": 33,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 8.4
  },
  {
    "id": "res_r1_p_23",
    "roundId": "r_1",
    "playerId": "p_23",
    "gross": 92,
    "net": 73.0,
    "putts": 31,
    "points": 15.0,
    "ctp": true,
    "hciSnapshot": 23.3
  },
  {
    "id": "res_r1_p_19",
    "roundId": "r_1",
    "playerId": "p_19",
    "gross": 94,
    "net": 74.0,
    "putts": 37,
    "points": 13.0,
    "ctp": false,
    "hciSnapshot": 24.6
  },
  {
    "id": "res_r1_p_35",
    "roundId": "r_1",
    "playerId": "p_35",
    "gross": 98,
    "net": 81.0,
    "putts": 35,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 20.7
  },
  {
    "id": "res_r1_p_36",
    "roundId": "r_1",
    "playerId": "p_36",
    "gross": 110,
    "net": 89.0,
    "putts": 34,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 26.3
  },
  {
    "id": "res_r1_p_22",
    "roundId": "r_1",
    "playerId": "p_22",
    "gross": 94,
    "net": 76.0,
    "putts": 36,
    "points": 12.0,
    "ctp": true,
    "hciSnapshot": 22.1
  },
  {
    "id": "res_r1_p_29",
    "roundId": "r_1",
    "playerId": "p_29",
    "gross": 107,
    "net": 90.0,
    "putts": 36,
    "points": 8.0,
    "ctp": false,
    "hciSnapshot": 21.5
  },
  {
    "id": "res_r1_p_17",
    "roundId": "r_1",
    "playerId": "p_17",
    "gross": 125,
    "net": 106.0,
    "putts": 49,
    "points": 4.0,
    "ctp": false,
    "hciSnapshot": 24.0
  },
  {
    "id": "res_r1_p_28",
    "roundId": "r_1",
    "playerId": "p_28",
    "gross": 111,
    "net": 90.0,
    "putts": 45,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 26.0
  },
  {
    "id": "res_r1_p_30",
    "roundId": "r_1",
    "playerId": "p_30",
    "gross": 118,
    "net": 97.0,
    "putts": 45,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 26.1
  },
  {
    "id": "res_r1_p_27",
    "roundId": "r_1",
    "playerId": "p_27",
    "gross": 118,
    "net": 98.0,
    "putts": 36,
    "points": 5.0,
    "ctp": false,
    "hciSnapshot": 24.9
  },
  {
    "id": "res_r1_p_48",
    "roundId": "r_1",
    "playerId": "p_48",
    "gross": 103,
    "net": 80.0,
    "putts": 45,
    "points": 12.0,
    "ctp": false,
    "hciSnapshot": 29.3
  },
  {
    "id": "res_r1_p_40",
    "roundId": "r_1",
    "playerId": "p_40",
    "gross": 102,
    "net": 80.0,
    "putts": 37,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 28.0
  },
  {
    "id": "res_r1_p_44",
    "roundId": "r_1",
    "playerId": "p_44",
    "gross": 99,
    "net": 77.0,
    "putts": 32,
    "points": 15.0,
    "ctp": true,
    "hciSnapshot": 27.2
  },
  {
    "id": "res_r1_p_47",
    "roundId": "r_1",
    "playerId": "p_47",
    "gross": 100,
    "net": 78.0,
    "putts": 38,
    "points": 13.0,
    "ctp": false,
    "hciSnapshot": 27.9
  },
  {
    "id": "res_r1_p_42",
    "roundId": "r_1",
    "playerId": "p_42",
    "gross": 112,
    "net": 89.0,
    "putts": 43,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 29.1
  },
  {
    "id": "res_r1_p_39",
    "roundId": "r_1",
    "playerId": "p_39",
    "gross": 104,
    "net": 82.0,
    "putts": 40,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 28.0
  },
  {
    "id": "res_r1_p_46",
    "roundId": "r_1",
    "playerId": "p_46",
    "gross": 113,
    "net": 85.0,
    "putts": 43,
    "points": 8.0,
    "ctp": true,
    "hciSnapshot": 35.4
  },
  {
    "id": "res_r1_p_38",
    "roundId": "r_1",
    "playerId": "p_38",
    "gross": 116,
    "net": 94.0,
    "putts": 39,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 27.2
  },
  {
    "id": "res_r1_p_45",
    "roundId": "r_1",
    "playerId": "p_45",
    "gross": 127,
    "net": 99.0,
    "putts": 42,
    "points": 5.0,
    "ctp": false,
    "hciSnapshot": 35.0
  },
  {
    "id": "res_r2_p_25",
    "roundId": "r_2",
    "playerId": "p_25",
    "gross": 90,
    "net": 75.0,
    "putts": 33,
    "points": 15.0,
    "ctp": false,
    "hciSnapshot": 15.0
  },
  {
    "id": "res_r2_p_48",
    "roundId": "r_2",
    "playerId": "p_48",
    "gross": 99,
    "net": 76.0,
    "putts": 40,
    "points": 15.0,
    "ctp": false,
    "hciSnapshot": 23.0
  },
  {
    "id": "res_r2_p_31",
    "roundId": "r_2",
    "playerId": "p_31",
    "gross": 98,
    "net": 77.0,
    "putts": 31,
    "points": 13.0,
    "ctp": false,
    "hciSnapshot": 21.0
  },
  {
    "id": "res_r2_p_20",
    "roundId": "r_2",
    "playerId": "p_20",
    "gross": 94,
    "net": 78.0,
    "putts": 38,
    "points": 12.0,
    "ctp": false,
    "hciSnapshot": 16.0
  },
  {
    "id": "res_r2_p_23",
    "roundId": "r_2",
    "playerId": "p_23",
    "gross": 97,
    "net": 78.0,
    "putts": 40,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 19.0
  },
  {
    "id": "res_r2_p_33",
    "roundId": "r_2",
    "playerId": "p_33",
    "gross": 95,
    "net": 79.0,
    "putts": 32,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 16.0
  },
  {
    "id": "res_r2_p_35",
    "roundId": "r_2",
    "playerId": "p_35",
    "gross": 96,
    "net": 79.0,
    "putts": 36,
    "points": 8.0,
    "ctp": false,
    "hciSnapshot": 17.0
  },
  {
    "id": "res_r2_p_1",
    "roundId": "r_2",
    "playerId": "p_1",
    "gross": 92,
    "net": 81.0,
    "putts": 38,
    "points": 15.0,
    "ctp": false,
    "hciSnapshot": 11.0
  },
  {
    "id": "res_r2_p_40",
    "roundId": "r_2",
    "playerId": "p_40",
    "gross": 103,
    "net": 81.0,
    "putts": 39,
    "points": 13.0,
    "ctp": false,
    "hciSnapshot": 22.0
  },
  {
    "id": "res_r2_p_16",
    "roundId": "r_2",
    "playerId": "p_16",
    "gross": 95,
    "net": 82.0,
    "putts": 33,
    "points": 13.0,
    "ctp": false,
    "hciSnapshot": 13.0
  },
  {
    "id": "res_r2_p_42",
    "roundId": "r_2",
    "playerId": "p_42",
    "gross": 105,
    "net": 82.0,
    "putts": 39,
    "points": 12.0,
    "ctp": false,
    "hciSnapshot": 23.0
  },
  {
    "id": "res_r2_p_32",
    "roundId": "r_2",
    "playerId": "p_32",
    "gross": 102,
    "net": 83.0,
    "putts": 37,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 19.0
  },
  {
    "id": "res_r2_p_3",
    "roundId": "r_2",
    "playerId": "p_3",
    "gross": 98,
    "net": 84.0,
    "putts": 35,
    "points": 12.0,
    "ctp": false,
    "hciSnapshot": 14.0
  },
  {
    "id": "res_r2_p_13",
    "roundId": "r_2",
    "playerId": "p_13",
    "gross": 98,
    "net": 85.0,
    "putts": 44,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 13.0
  },
  {
    "id": "res_r2_p_15",
    "roundId": "r_2",
    "playerId": "p_15",
    "gross": 100,
    "net": 85.0,
    "putts": 35,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 15.0
  },
  {
    "id": "res_r2_p_19",
    "roundId": "r_2",
    "playerId": "p_19",
    "gross": 104,
    "net": 85.0,
    "putts": 33,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 19.0
  },
  {
    "id": "res_r2_p_37",
    "roundId": "r_2",
    "playerId": "p_37",
    "gross": 108,
    "net": 86.0,
    "putts": 34,
    "points": 10.0,
    "ctp": false,
    "hciSnapshot": 22.0
  },
  {
    "id": "res_r2_p_14",
    "roundId": "r_2",
    "playerId": "p_14",
    "gross": 100,
    "net": 88.0,
    "putts": 42,
    "points": 8.0,
    "ctp": false,
    "hciSnapshot": 12.0
  },
  {
    "id": "res_r2_p_41",
    "roundId": "r_2",
    "playerId": "p_41",
    "gross": 112,
    "net": 88.0,
    "putts": 44,
    "points": 9.0,
    "ctp": false,
    "hciSnapshot": 24.0
  },
  {
    "id": "res_r2_p_6",
    "roundId": "r_2",
    "playerId": "p_6",
    "gross": 102,
    "net": 89.0,
    "putts": 38,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 13.0
  },
  {
    "id": "res_r2_p_5",
    "roundId": "r_2",
    "playerId": "p_5",
    "gross": 105,
    "net": 89.0,
    "putts": 40,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 16.0
  },
  {
    "id": "res_r2_p_38",
    "roundId": "r_2",
    "playerId": "p_38",
    "gross": 112,
    "net": 89.0,
    "putts": 35,
    "points": 8.0,
    "ctp": false,
    "hciSnapshot": 23.0
  },
  {
    "id": "res_r2_p_47",
    "roundId": "r_2",
    "playerId": "p_47",
    "gross": 114,
    "net": 92.0,
    "putts": 38,
    "points": 0,
    "ctp": false,
    "hciSnapshot": 22.0
  },
  {
    "id": "res_r2_p_44",
    "roundId": "r_2",
    "playerId": "p_44",
    "gross": 115,
    "net": 93.0,
    "putts": 40,
    "points": 7.0,
    "ctp": false,
    "hciSnapshot": 22.0
  },
  {
    "id": "res_r2_p_26",
    "roundId": "r_2",
    "playerId": "p_26",
    "gross": 114,
    "net": 96.0,
    "putts": 36,
    "points": 0,
    "ctp": false,
    "hciSnapshot": 18.0
  },
  {
    "id": "res_r2_p_36",
    "roundId": "r_2",
    "playerId": "p_36",
    "gross": 122,
    "net": 101.0,
    "putts": 40,
    "points": 6.0,
    "ctp": false,
    "hciSnapshot": 21.0
  },
  {
    "id": "res_r2_p_49",
    "roundId": "r_2",
    "playerId": "p_49",
    "gross": 116,
    "net": 90.0,
    "putts": 45,
    "points": 5.0,
    "ctp": false,
    "hciSnapshot": 26.0
  },
  {
    "id": "res_r2_p_50",
    "roundId": "r_2",
    "playerId": "p_50",
    "gross": 120,
    "net": 92.0,
    "putts": 44,
    "points": 4.0,
    "ctp": false,
    "hciSnapshot": 28.0
  },
  {
    "id": "res_r2_p_9",
    "roundId": "r_2",
    "playerId": "p_9",
    "gross": 115,
    "net": 102.0,
    "putts": 41,
    "points": 5.0,
    "ctp": false,
    "hciSnapshot": 13.0
  },
  {
    "id": "res_r2_p_18",
    "roundId": "r_2",
    "playerId": "p_18",
    "gross": 128,
    "net": 109.0,
    "putts": 45,
    "points": 3.0,
    "ctp": false,
    "hciSnapshot": 19.0
  },
  {
    "id": "res_r2_p_10",
    "roundId": "r_2",
    "playerId": "p_10",
    "gross": 130,
    "net": 116.0,
    "putts": 39,
    "points": 4.0,
    "ctp": false,
    "hciSnapshot": 14.0
  },
  {
    "id": "res_r2_p_34",
    "roundId": "r_2",
    "playerId": "p_34",
    "gross": 141,
    "net": 123.0,
    "putts": 46,
    "points": 3.0,
    "ctp": false,
    "hciSnapshot": 18.0
  },
  {
    "id": "res_r2_p_17",
    "roundId": "r_2",
    "playerId": "p_17",
    "gross": 141,
    "net": 126.0,
    "putts": 45,
    "points": 3.0,
    "ctp": false,
    "hciSnapshot": 15.0
  },
  {
    "id": "res_r2_p_51",
    "roundId": "r_2",
    "playerId": "p_51",
    "gross": 145,
    "net": 126.0,
    "putts": 47,
    "points": 0,
    "ctp": false,
    "hciSnapshot": 19.0
  }
];

export const INITIAL_POINTS_RULES: PointRule[] = [
  {
    "place": 1,
    "points": 15
  },
  {
    "place": 2,
    "points": 13
  },
  {
    "place": 3,
    "points": 12
  },
  {
    "place": 4,
    "points": 10
  },
  {
    "place": 5,
    "points": 9
  },
  {
    "place": 6,
    "points": 8
  },
  {
    "place": 7,
    "points": 7
  },
  {
    "place": 8,
    "points": 6
  },
  {
    "place": 9,
    "points": 5
  },
  {
    "place": 10,
    "points": 4
  },
  {
    "place": 11,
    "points": 3
  },
  {
    "place": 12,
    "points": 3
  },
  {
    "place": 13,
    "points": 3
  },
  {
    "place": 14,
    "points": 3
  },
  {
    "place": 15,
    "points": 3
  },
  {
    "place": 16,
    "points": 3
  },
  {
    "place": 17,
    "points": 3
  },
  {
    "place": 18,
    "points": 3
  }
];

export const INITIAL_CTP_RULES: PointRule[] = [
  {
    "place": 1,
    "points": 10
  },
  {
    "place": 2,
    "points": 7
  },
  {
    "place": 3,
    "points": 5
  },
  {
    "place": 4,
    "points": 3
  }
];

export const INITIAL_LIV_RULES: PointRule[] = [
  {
    "place": 1,
    "points": 10
  },
  {
    "place": 2,
    "points": 7
  },
  {
    "place": 3,
    "points": 5
  },
  {
    "place": 4,
    "points": 3
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  activeTournamentId: 'tour_1',
  useHci80: true,
  tiebreak: 'putts',
  ctpBonusPoints: 1,
  theme: 'dark'
};
