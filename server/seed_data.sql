INSERT INTO
  `Cohorts` (`id`, `name`, `startDate`, `endDate`, `timestamp`)
VALUES
  (
    'cohort-001',
    'Cohort 2021',
    '2021-09-01',
    '2024-06-30',
    NOW()
  ),
  (
    'cohort-002',
    'Cohort 2022',
    '2022-09-01',
    '2025-06-30',
    NOW()
  ),
  (
    'cohort-003',
    'Cohort 2023',
    '2023-09-01',
    '2026-06-30',
    NOW()
  ),
  (
    'cohort-004',
    'Cohort 2024',
    '2024-09-01',
    '2027-06-30',
    NOW()
  ),
  (
    'cohort-005',
    'Cohort 2025',
    '2025-09-01',
    '2028-06-30',
    NOW()
  );


INSERT INTO
  `Faculties` (`id`, `name`, `timestamp`)
VALUES
  ('faculty-001', 'Faculty of Science', NOW()),
  ('faculty-002', 'Faculty of Engineering', NOW()),
  ('faculty-003', 'Faculty of Arts', NOW()),
  ('faculty-004', 'Faculty of Medicine', NOW()),
  ('faculty-005', 'Faculty of Business', NOW());


INSERT INTO
  `Venues` (`id`, `name`, `location`, `capacity`, `timestamp`)
VALUES
  (
    'venue-001',
    'Foyers (when booked with Lecture Theatre)',
    '101.001',
    120,
    NOW()
  ),
  ('venue-002', 'The Hub', '500.1101', 150, NOW()),
  (
    'venue-003',
    'Standard Tutorial Rooms (Flat Floor Basic) I',
    '102.002',
    50,
    NOW()
  ),
  (
    'venue-004',
    'Standard Tutorial Rooms (Flat Floor Basic) II',
    '103.003',
    45,
    NOW()
  ),
  (
    'venue-005',
    'Meeting Rooms',
    '500.3101, 4103 & 4301',
    30,
    NOW()
  ),
  (
    'venue-006',
    'Shilbury Lecture Theatres',
    '204.233, 204.234',
    100,
    NOW()
  ),
  (
    'venue-007',
    'Watson Lecture Theatre I',
    '307.101',
    140,
    NOW()
  ),
  (
    'venue-008',
    'Watson Lecture Theatre II',
    '307.102',
    140,
    NOW()
  ),
  (
    'venue-009',
    'Case Study Room',
    '408.2038',
    40,
    NOW()
  ),
  (
    'venue-010',
    'Robertson II Lecture Theatre',
    '201.413',
    130,
    NOW()
  ),
  (
    'venue-011',
    'Hollis Lecture Theatre 1',
    '401.001',
    110,
    NOW()
  ),
  (
    'venue-012',
    'Collaborative Learning Spaces',
    '104.004',
    70,
    NOW()
  ),
  (
    'venue-013',
    'B418 Collaborative Learning Spaces & Studio Spaces',
    '105.005',
    85,
    NOW()
  ),
  (
    'venue-014',
    'Jones Lecture Theatre',
    '402.220',
    115,
    NOW()
  ),
  (
    'venue-015',
    'Watson Lecture Theatre III',
    '307.103',
    140,
    NOW()
  ),
  (
    'venue-016',
    'Informal Spaces',
    '410.115 Chill Out Island',
    25,
    NOW()
  ),
  (
    'venue-017',
    'Informal Spaces',
    '410.116 The Snug',
    25,
    NOW()
  ),
  (
    'venue-018',
    'Informal Spaces',
    '410.C203 Lobby Lounge',
    25,
    NOW()
  ),
  ('venue-019', 'Informal Spaces', '410.301', 25, NOW()),
  (
    'venue-020',
    'Informal Spaces',
    '410.314 Studio',
    25,
    NOW()
  ),
  (
    'venue-021',
    'Informal Spaces',
    '410.428 Studio',
    25,
    NOW()
  ),
  (
    'venue-022',
    'BankWest Lecture Theatre',
    '200A.220',
    130,
    NOW()
  ),
  (
    'venue-023',
    'Exhibition Space',
    '500.1102AB:EX',
    100,
    NOW()
  ),
  (
    'venue-024',
    'Collaborative Learning Spaces',
    '106.006',
    60,
    NOW()
  ),
  (
    'venue-025',
    'Hollis Lecture Theatre 2',
    '401.002',
    110,
    NOW()
  ),
  (
    'venue-026',
    'B418 Exhibition Space',
    '418.112',
    90,
    NOW()
  ),
  ('venue-027', 'Informal Spaces', '107.007', 20, NOW()),
  (
    'venue-028',
    'Lance Twomey Lecture Theatre',
    '408.1019',
    150,
    NOW()
  ),
  (
    'venue-029',
    'Norman Dufty Lecture Theatre',
    '210.102',
    120,
    NOW()
  ),
  (
    'venue-030',
    'Lecture Theatre',
    '213.101',
    135,
    NOW()
  ),
  (
    'venue-031',
    'Tim Winton Lecture Theatre',
    '213.104',
    135,
    NOW()
  ),
  (
    'venue-032',
    'Ken Hall Lecture Theatre',
    '403.101',
    125,
    NOW()
  ),
  ('venue-033', '410.101:CT', '410.101', 35, NOW()),
  (
    'venue-034',
    'B418 Informal Spaces',
    '418.202 Blue Carpet',
    20,
    NOW()
  ),
  (
    'venue-035',
    'B418 Informal Spaces',
    '418.301 Blue Carpet',
    20,
    NOW()
  ),
  (
    'venue-036',
    'Haydn Williams Lecture Theatre',
    '405.201',
    130,
    NOW()
  ),
  ('venue-037', '410.201:CT', '410.201', 35, NOW()),
  (
    'venue-038',
    'Elizabeth Jolley Lecture Theatre',
    '210.101',
    130,
    NOW()
  );


INSERT INTO
  `Disciplines` (`id`, `name`, `facultyId`, `timestamp`)
VALUES
  (
    'discipline-001',
    'Discipline of Biology',
    'faculty-001',
    NOW()
  ),
  (
    'discipline-002',
    'Discipline of Mechanical Engineering',
    'faculty-002',
    NOW()
  ),
  (
    'discipline-003',
    'Discipline of Philosophy',
    'faculty-003',
    NOW()
  ),
  (
    'discipline-004',
    'Discipline of Clinical Medicine',
    'faculty-004',
    NOW()
  ),
  (
    'discipline-005',
    'Discipline of Finance',
    'faculty-005',
    NOW()
  );


INSERT INTO
  `Staff` (
    `id`,
    `firstname`,
    `lastname`,
    `email`,
    `disciplineId`,
    `timestamp`
  )
VALUES
  (
    'staff-001',
    'Albert',
    'Einstein',
    'albert.einstein@example.com',
    'discipline-001',
    NOW()
  ),
  (
    'staff-002',
    'Isaac',
    'Newton',
    'isaac.newton@example.com',
    'discipline-002',
    NOW()
  ),
  (
    'staff-003',
    'Marie',
    'Curie',
    'marie.curie@example.com',
    'discipline-003',
    NOW()
  ),
  (
    'staff-004',
    'Nikola',
    'Tesla',
    'nikola.tesla@example.com',
    'discipline-004',
    NOW()
  ),
  (
    'staff-005',
    'Ada',
    'Lovelace',
    'ada.lovelace@example.com',
    'discipline-005',
    NOW()
  ),
  (
    'staff-006',
    'Sie Teng',
    'Soh',
    'S.Soh@curtin.edu.au',
    'discipline-001',
    NOW()
  ),
  (
    'staff-007',
    'Johannes',
    'Herrmann',
    'Hannes.Herrmann@curtin.edu.au',
    'discipline-001',
    NOW()
  ),
  (
    'staff-008',
    'Reza',
    'Ryan',
    'reza.ryan@curtin.edu.au',
    'discipline-001',
    NOW()
  ),
  (
    'staff-009',
    'Ling',
    'Li',
    'L.Li@curtin.edu.au',
    'discipline-001',
    NOW()
  ),
  (
    'staff-010',
    'Duc-Son',
    'Pham',
    'Ducson.Pham@curtin.edu.au',
    'discipline-001',
    NOW()
  ),
  (
    'staff-011',
    'Md Redoan',
    'Mahmud',
    'mdredowan.mahmud@curtin.edu.au',
    'discipline-002',
    NOW()
  ),
  (
    'staff-012',
    'Nickson',
    'Karie',
    'Nickson.Karie@curtin.edu.au',
    'discipline-002',
    NOW()
  ),
  (
    'staff-013',
    'Mihai',
    'Lazarescu',
    'M.Lazarescu@curtin.edu.au',
    'discipline-002',
    NOW()
  ),
  (
    'staff-014',
    'Paul',
    'Hancock',
    'paul.hancock@curtin.edu.au',
    'discipline-002',
    NOW()
  ),
  (
    'staff-015',
    'Mahbuba',
    'Afrin',
    'mahbuba.afrin@curtin.edu.au',
    'discipline-002',
    NOW()
  ),
  (
    'staff-016',
    'Nimalika',
    'Fernando',
    'T.Fernando@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-017',
    'Sajib',
    'Mistry',
    'sajib.mistry@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-018',
    'Qilin',
    'Li',
    'Q.Lin@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-019',
    'Valerie',
    'Maxville',
    'V.Maxville@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-020',
    'Hui',
    'Xie',
    'hui.xie@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-021',
    'Senjian',
    'An',
    'S.An@curtin.edu.au',
    'discipline-003',
    NOW()
  ),
  (
    'staff-022',
    'David',
    'McMeekin',
    'David.Mcmeekin@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-023',
    'Arlen',
    'Brower',
    'Arlen.Brower@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-024',
    'Aneesh',
    'Krishna',
    'A.Krishna@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-025',
    'Kit Yan',
    'Chan',
    'kit.chan@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-026',
    'Nur',
    'Haldar',
    'nur.haldar@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-027',
    'David',
    'Cooper',
    'David.Cooper@curtin.edu.au',
    'discipline-004',
    NOW()
  ),
  (
    'staff-028',
    'Antoni',
    'Liang',
    'Antoni.Liang@curtin.edu.au',
    'discipline-005',
    NOW()
  );


INSERT INTO
  `Units` (
    `id`,
    `name`,
    `unitCode`,
    `credit`,
    `disciplineId`,
    `staffId`,
    `timestamp`
  )
VALUES
  (
    'unit-001',
    'Advanced Computer Communications',
    'CNCO3002',
    25,
    'discipline-001',
    'staff-006',
    NOW()
  ),
  (
    'unit-002',
    'Specialist Computer Communication',
    'CNCO5002',
    25,
    'discipline-002',
    'staff-007',
    NOW()
  ),
  (
    'unit-003',
    'Capstone Computing Project 1',
    'ISAD3000',
    25,
    'discipline-003',
    'staff-008',
    NOW()
  ),
  (
    'unit-004',
    'Capstone Computing Project 2',
    'ISAD3001',
    25,
    'discipline-004',
    'staff-009',
    NOW()
  ),
  (
    'unit-005',
    'Cyber Security Concepts (NEW UNIT)',
    'ISEC1000',
    25,
    'discipline-005',
    'staff-010',
    NOW()
  ),
  (
    'unit-006',
    'Computer Communications',
    'CNCO2000',
    25,
    'discipline-001',
    'staff-011',
    NOW()
  ),
  (
    'unit-007',
    'Computer Project 2',
    'COMP3005',
    25,
    'discipline-002',
    'staff-012',
    NOW()
  ),
  (
    'unit-008',
    'Computer Science Project',
    'COMP6002',
    25,
    'discipline-003',
    'staff-013',
    NOW()
  ),
  (
    'unit-009',
    'Computing Topics',
    'COMP2005',
    25,
    'discipline-004',
    'staff-014',
    NOW()
  ),
  (
    'unit-010',
    'Cyber Crime and Security Enhanced Programming',
    'ISEC3004',
    25,
    'discipline-005',
    'staff-015',
    NOW()
  ),
  (
    'unit-011',
    'Cyber Security- Intrusion Detection System and Incident Handling',
    'ISEC3005',
    25,
    'discipline-001',
    'staff-016',
    NOW()
  ),
  (
    'unit-012',
    'Data Mining',
    'COMP3009',
    25,
    'discipline-002',
    'staff-017',
    NOW()
  ),
  (
    'unit-013',
    'Data Mining',
    'COMP5009',
    25,
    'discipline-003',
    'staff-018',
    NOW()
  ),
  (
    'unit-014',
    'Data Structures and Algorithms',
    'COMP1002',
    25,
    'discipline-004',
    'staff-019',
    NOW()
  ),
  (
    'unit-015',
    'Data Structures and Algorithms',
    'COMP5008',
    25,
    'discipline-005',
    'staff-020',
    NOW()
  ),
  (
    'unit-016',
    'Database Systems',
    'ISYS2014',
    25,
    'discipline-001',
    'staff-021',
    NOW()
  ),
  (
    'unit-017',
    'Database Systems',
    'ISYS5008',
    25,
    'discipline-002',
    'staff-022',
    NOW()
  ),
  (
    'unit-018',
    'Distributed Computing',
    'COMP3008',
    25,
    'discipline-003',
    'staff-023',
    NOW()
  ),
  (
    'unit-019',
    'Extended Distributed Computing',
    'COMP4002',
    25,
    'discipline-004',
    'staff-024',
    NOW()
  ),
  (
    'unit-020',
    'Advanced Distributed Computing',
    'COMP5002',
    25,
    'discipline-005',
    'staff-025',
    NOW()
  ),
  (
    'unit-021',
    'Foundations of Computer Science',
    'COMP1006',
    25,
    'discipline-001',
    'staff-026',
    NOW()
  ),
  (
    'unit-022',
    'Fundamental Concepts of Data Security',
    'ISEC2001',
    25,
    'discipline-002',
    'staff-027',
    NOW()
  ),
  (
    'unit-023',
    'Fundamental Concepts of Data Security',
    'ISEC5006',
    25,
    'discipline-003',
    'staff-028',
    NOW()
  ),
  (
    'unit-024',
    'Fundamentals of Programming',
    'COMP1005',
    25,
    'discipline-004',
    'staff-001',
    NOW()
  ),
  (
    'unit-025',
    'Fundamentals of Programming',
    'COMP5005',
    25,
    'discipline-005',
    'staff-002',
    NOW()
  ),
  (
    'unit-026',
    'Industrial Automation and Robotics',
    'ICTE4005',
    25,
    'discipline-001',
    'staff-003',
    NOW()
  ),
  (
    'unit-027',
    'Industrial Automation and Robotics',
    'ICTE5005',
    25,
    'discipline-002',
    'staff-004',
    NOW()
  ),
  (
    'unit-028',
    'Introduction to Autonomous Robots (NEW UNIT)',
    'ICTE4001',
    25,
    'discipline-003',
    'staff-005',
    NOW()
  ),
  (
    'unit-029',
    'Introduction to Software Engineering',
    'ISAD1000',
    25,
    'discipline-004',
    'staff-006',
    NOW()
  ),
  (
    'unit-030',
    'Introduction to Software Engineering',
    'ISAD5004',
    25,
    'discipline-005',
    'staff-007',
    NOW()
  ),
  (
    'unit-031',
    'Machine Perception',
    'COMP3007',
    25,
    'discipline-001',
    'staff-008',
    NOW()
  ),
  (
    'unit-032',
    'Mobile Application Development',
    'COMP2008',
    25,
    'discipline-002',
    'staff-009',
    NOW()
  ),
  (
    'unit-033',
    'Penetration Testing and Defence',
    'ISEC3002',
    25,
    'discipline-003',
    'staff-010',
    NOW()
  ),
  (
    'unit-034',
    'Penetration Testing and Defence (NEW UNIT)',
    'ISEC6005',
    25,
    'discipline-004',
    'staff-011',
    NOW()
  ),
  (
    'unit-035',
    'Planning and Handling Uncertainty in Machine Learning',
    'COMP6010',
    25,
    'discipline-005',
    'staff-012',
    NOW()
  ),
  (
    'unit-036',
    'Programming Design and Implementation',
    'COMP1007',
    25,
    'discipline-001',
    'staff-013',
    NOW()
  ),
  (
    'unit-037',
    'Programming Design and Implementation',
    'COMP5011',
    25,
    'discipline-002',
    'staff-014',
    NOW()
  ),
  (
    'unit-038',
    'Programming Languages',
    'COMP2007',
    25,
    'discipline-003',
    'staff-015',
    NOW()
  ),
  (
    'unit-039',
    'Advanced Computing Topics',
    'COMP5004',
    25,
    'discipline-004',
    'staff-016',
    NOW()
  ),
  (
    'unit-040',
    'Reinforcement Learning',
    'COMP6008',
    25,
    'discipline-005',
    'staff-017',
    NOW()
  ),
  (
    'unit-041',
    'Requirements Engineering',
    'CMPE2002',
    25,
    'discipline-001',
    'staff-018',
    NOW()
  ),
  (
    'unit-042',
    'Software Engineering Requirements and Specification',
    'ISAD6000',
    25,
    'discipline-002',
    'staff-019',
    NOW()
  ),
  (
    'unit-043',
    'Scalable Software Engineering',
    'ISAD6003',
    25,
    'discipline-003',
    'staff-020',
    NOW()
  ),
  (
    'unit-044',
    'Search and Logic Approaches in Machine Learning',
    'COMP6009',
    25,
    'discipline-004',
    'staff-021',
    NOW()
  ),
  (
    'unit-045',
    'Secure DevOps',
    'ISEC6000',
    25,
    'discipline-005',
    'staff-022',
    NOW()
  ),
  (
    'unit-046',
    'Software Engineering Concepts',
    'COMP3003',
    25,
    'discipline-001',
    'staff-023',
    NOW()
  ),
  (
    'unit-047',
    'Software Engineering Concepts',
    'COMP6007',
    25,
    'discipline-002',
    'staff-024',
    NOW()
  ),
  (
    'unit-048',
    'Theoretical Foundations of Computer Science',
    'COMP3002',
    25,
    'discipline-003',
    'staff-025',
    NOW()
  ),
  (
    'unit-049',
    'Unix and C Programming',
    'COMP1000',
    25,
    'discipline-004',
    'staff-026',
    NOW()
  ),
  (
    'unit-050',
    'Computer Science Project 1',
    'COMP6015',
    25,
    'discipline-005',
    'staff-027',
    NOW()
  ),
  (
    'unit-051',
    'Computer Science Project 2',
    'COMP6016',
    25,
    'discipline-001',
    'staff-028',
    NOW()
  ),
  (
    'unit-052',
    'Computing Honours Dissertation (NEW UNIT)',
    'COMP4003',
    25,
    'discipline-002',
    'staff-001',
    NOW()
  ),
  (
    'unit-053',
    'Research Methods for Advanced Engineering',
    'ENGR6008',
    25,
    'discipline-003',
    'staff-002',
    NOW()
  );


INSERT INTO
  `Unit_Sessions` (
    `id`,
    `unit_id`,
    `session_type`,
    `duration_hours`,
    `capacity`
  )
VALUES
  ('us-001', 'unit-001', 'lecture', 2, 100),
  ('us-002', 'unit-001', 'tutorial', 1, 30),
  ('us-003', 'unit-002', 'lecture', 2, 100),
  ('us-004', 'unit-002', 'lab', 2, 20),
  ('us-005', 'unit-003', 'lecture', 2, 100),
  ('us-006', 'unit-003', 'tutorial', 1, 30),
  ('us-007', 'unit-003', 'lab', 1, 20),
  ('us-008', 'unit-004', 'lecture', 2, 100),
  ('us-009', 'unit-004', 'tutorial', 1, 30),
  ('us-010', 'unit-004', 'lab', 2, 20),
  ('us-011', 'unit-005', 'lecture', 2, 100),
  ('us-012', 'unit-005', 'tutorial', 1, 30),
  ('us-013', 'unit-005', 'lab', 2, 25),
  ('us-014', 'unit-006', 'lecture', 1, 100),
  ('us-015', 'unit-006', 'tutorial', 1, 30),
  ('us-016', 'unit-007', 'lecture', 2, 80),
  ('us-017', 'unit-007', 'tutorial', 1, 25),
  ('us-018', 'unit-008', 'lecture', 2, 90),
  ('us-019', 'unit-008', 'tutorial', 1, 30),
  ('us-020', 'unit-009', 'lecture', 2, 100),
  ('us-021', 'unit-009', 'tutorial', 1, 35),
  ('us-022', 'unit-010', 'lecture', 2, 90),
  ('us-023', 'unit-010', 'tutorial', 1, 30),
  ('us-024', 'unit-011', 'lecture', 2, 100),
  ('us-025', 'unit-011', 'lab', 2, 25),
  ('us-026', 'unit-012', 'lecture', 2, 95),
  ('us-027', 'unit-012', 'tutorial', 1, 30),
  ('us-028', 'unit-013', 'lecture', 2, 85),
  ('us-029', 'unit-013', 'tutorial', 1, 30),
  ('us-030', 'unit-014', 'lecture', 1, 75),
  ('us-031', 'unit-014', 'tutorial', 1, 25),
  ('us-032', 'unit-015', 'lecture', 1, 80),
  ('us-033', 'unit-015', 'tutorial', 1, 25),
  ('us-034', 'unit-016', 'lecture', 2, 90),
  ('us-035', 'unit-016', 'tutorial', 1, 30),
  ('us-036', 'unit-017', 'lecture', 1, 85),
  ('us-037', 'unit-017', 'tutorial', 1, 20),
  ('us-038', 'unit-018', 'lecture', 2, 100),
  ('us-039', 'unit-018', 'tutorial', 1, 30),
  ('us-040', 'unit-019', 'lecture', 1, 95),
  ('us-041', 'unit-019', 'tutorial', 1, 25),
  ('us-042', 'unit-020', 'lecture', 2, 90),
  ('us-043', 'unit-020', 'tutorial', 1, 30),
  ('us-044', 'unit-021', 'lecture', 1, 85),
  ('us-045', 'unit-021', 'tutorial', 1, 30),
  ('us-046', 'unit-022', 'lecture', 2, 90),
  ('us-047', 'unit-022', 'tutorial', 1, 30),
  ('us-048', 'unit-023', 'lecture', 2, 100),
  ('us-049', 'unit-023', 'tutorial', 1, 25),
  ('us-050', 'unit-024', 'lecture', 1, 90),
  ('us-051', 'unit-024', 'tutorial', 1, 30),
  ('us-052', 'unit-025', 'lecture', 1, 85),
  ('us-053', 'unit-025', 'tutorial', 1, 25),
  ('us-054', 'unit-026', 'lecture', 1, 100),
  ('us-055', 'unit-026', 'tutorial', 1, 30),
  ('us-056', 'unit-027', 'lecture', 2, 90),
  ('us-057', 'unit-027', 'tutorial', 1, 30),
  ('us-058', 'unit-028', 'lecture', 1, 85),
  ('us-059', 'unit-028', 'tutorial', 1, 25),
  ('us-060', 'unit-029', 'lecture', 2, 100),
  ('us-061', 'unit-029', 'tutorial', 1, 30),
  ('us-062', 'unit-030', 'lecture', 1, 90),
  ('us-063', 'unit-030', 'tutorial', 1, 30),
  ('us-064', 'unit-031', 'lecture', 2, 100),
  ('us-065', 'unit-031', 'tutorial', 1, 25),
  ('us-066', 'unit-032', 'lecture', 2, 95),
  ('us-067', 'unit-032', 'tutorial', 1, 30),
  ('us-068', 'unit-033', 'lecture', 1, 80),
  ('us-069', 'unit-033', 'tutorial', 1, 25),
  ('us-070', 'unit-034', 'lecture', 2, 85),
  ('us-071', 'unit-034', 'tutorial', 1, 30),
  ('us-072', 'unit-035', 'lecture', 1, 100),
  ('us-073', 'unit-035', 'tutorial', 1, 25),
  ('us-074', 'unit-036', 'lecture', 2, 100),
  ('us-075', 'unit-036', 'tutorial', 1, 30),
  ('us-076', 'unit-037', 'lecture', 1, 85),
  ('us-077', 'unit-037', 'tutorial', 1, 25),
  ('us-078', 'unit-038', 'lecture', 1, 90),
  ('us-079', 'unit-038', 'tutorial', 1, 30),
  ('us-080', 'unit-039', 'lecture', 2, 100),
  ('us-081', 'unit-039', 'tutorial', 1, 25),
  ('us-082', 'unit-040', 'lecture', 1, 95),
  ('us-083', 'unit-040', 'tutorial', 1, 30),
  ('us-084', 'unit-041', 'lecture', 1, 85),
  ('us-085', 'unit-041', 'tutorial', 1, 25),
  ('us-086', 'unit-042', 'lecture', 2, 90),
  ('us-087', 'unit-042', 'tutorial', 1, 30),
  ('us-088', 'unit-043', 'lecture', 2, 100),
  ('us-089', 'unit-043', 'tutorial', 1, 25),
  ('us-090', 'unit-044', 'lecture', 1, 90),
  ('us-091', 'unit-044', 'tutorial', 1, 30),
  ('us-092', 'unit-045', 'lecture', 2, 85),
  ('us-093', 'unit-045', 'tutorial', 1, 25),
  ('us-094', 'unit-046', 'lecture', 1, 100),
  ('us-095', 'unit-046', 'tutorial', 1, 30),
  ('us-096', 'unit-047', 'lecture', 2, 95),
  ('us-097', 'unit-047', 'tutorial', 1, 30),
  ('us-098', 'unit-048', 'lecture', 1, 80),
  ('us-099', 'unit-048', 'tutorial', 1, 25),
  ('us-100', 'unit-049', 'lecture', 2, 90),
  ('us-101', 'unit-049', 'tutorial', 1, 30),
  ('us-102', 'unit-050', 'lecture', 1, 100),
  ('us-103', 'unit-050', 'tutorial', 1, 25),
  ('us-104', 'unit-051', 'lecture', 2, 100),
  ('us-105', 'unit-051', 'tutorial', 1, 30),
  ('us-106', 'unit-052', 'lecture', 1, 85),
  ('us-107', 'unit-052', 'tutorial', 1, 25),
  ('us-108', 'unit-053', 'lecture', 2, 90),
  ('us-109', 'unit-053', 'tutorial', 1, 30);



INSERT INTO
  `Clash_Free_Sets` (`set`, `ref_type`, `cohortId`, `staffId`)
VALUES
  (
    'CNCO3002, CNCO5002, ISAD3000',
    'cohort',
    'cohort-001',
    NULL
  ),
  (
    'ISAD3001, ISEC1000, CNCO2000',
    'cohort',
    'cohort-002',
    NULL
  ),
  (
    'COMP3005, COMP6002, COMP2005, ISEC3004',
    'staff',
    NULL,
    'staff-012'
  ),
  (
    'ISEC3005, COMP3009, COMP5009',
    'staff',
    NULL,
    'staff-017'
  ),
  (
    'COMP1002, COMP5008, ISYS2014',
    'cohort',
    'cohort-003',
    NULL
  );