const codeTable = [
  // ---------------- Patient Gender ----------------
  {
    Code: 'M',
    CodeType: 'PatientGender',
    CodeGroup: 'Gender',
    CodeMeaning: 'Male',
  },
  {
    Code: 'F',
    CodeType: 'PatientGender',
    CodeGroup: 'Gender',
    CodeMeaning: 'Female',
  },
  {
    Code: 'NB',
    CodeType: 'PatientGender',
    CodeGroup: 'Gender',
    CodeMeaning: 'Non-binary',
  },
  {
    Code: 'U',
    CodeType: 'PatientGender',
    CodeGroup: 'Gender',
    CodeMeaning: 'Undisclosed',
  },

  // ---------------- Patient Race ----------------
  {
    Code: 'W',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'White',
  },
  {
    Code: 'B',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'Black or African American',
  },
  {
    Code: 'A',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'Asian',
  },
  {
    Code: 'N',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'American Indian or Alaska Native',
  },
  {
    Code: 'P',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'Native Hawaiian or Pacific Islander',
  },
  {
    Code: 'O',
    CodeType: 'PatientRace',
    CodeGroup: 'Race',
    CodeMeaning: 'Other / Multiracial',
  },

  // ---------------- Patient Life Category ----------------
  {
    Code: 'INF',
    CodeType: 'PatientLifeCat',
    CodeGroup: 'LifeStage',
    CodeMeaning: 'Infant (0–1)',
  },
  {
    Code: 'CH',
    CodeType: 'PatientLifeCat',
    CodeGroup: 'LifeStage',
    CodeMeaning: 'Child (2–12)',
  },
  {
    Code: 'ADO',
    CodeType: 'PatientLifeCat',
    CodeGroup: 'LifeStage',
    CodeMeaning: 'Adolescent (13–17)',
  },
  {
    Code: 'ADU',
    CodeType: 'PatientLifeCat',
    CodeGroup: 'LifeStage',
    CodeMeaning: 'Adult (18–64)',
  },
  {
    Code: 'GER',
    CodeType: 'PatientLifeCat',
    CodeGroup: 'LifeStage',
    CodeMeaning: 'Geriatric (65+)',
  },

  // ---------------- Diagnosis ----------------
  {
    Code: 'D001',
    CodeType: 'Diagnosis',
    CodeGroup: 'Physical',
    CodeMeaning: 'Hypertension',
  },
  {
    Code: 'D002',
    CodeType: 'Diagnosis',
    CodeGroup: 'Physical',
    CodeMeaning: 'Diabetes Mellitus Type 2',
  },
  {
    Code: 'D003',
    CodeType: 'Diagnosis',
    CodeGroup: 'MentalHealth',
    CodeMeaning: 'Depression',
  },
  {
    Code: 'D004',
    CodeType: 'Diagnosis',
    CodeGroup: 'Injury',
    CodeMeaning: 'Fracture – Upper Limb',
  },
  {
    Code: 'D005',
    CodeType: 'Diagnosis',
    CodeGroup: 'Infectious',
    CodeMeaning: 'Pneumonia',
  },

  // ---------------- Interventions ----------------
  {
    Code: 'I001',
    CodeType: 'Interventions',
    CodeGroup: 'Medication',
    CodeMeaning: 'Administer prescribed medication',
  },
  {
    Code: 'I002',
    CodeType: 'Interventions',
    CodeGroup: 'Education',
    CodeMeaning: 'Patient education on medication adherence',
  },
  {
    Code: 'I003',
    CodeType: 'Interventions',
    CodeGroup: 'Monitoring',
    CodeMeaning: 'Monitor vital signs',
  },
  {
    Code: 'I004',
    CodeType: 'Interventions',
    CodeGroup: 'Coordination',
    CodeMeaning: 'Coordinate interdisciplinary care plan',
  },
  {
    Code: 'I005',
    CodeType: 'Interventions',
    CodeGroup: 'Support',
    CodeMeaning: 'Provide emotional support to patient/family',
  },

  // ---------------- Encounter Type ----------------
  {
    Code: 'E001',
    CodeType: 'EncounterType',
    CodeGroup: 'Setting',
    CodeMeaning: 'Inpatient',
  },
  {
    Code: 'E002',
    CodeType: 'EncounterType',
    CodeGroup: 'Setting',
    CodeMeaning: 'Outpatient',
  },
  {
    Code: 'E003',
    CodeType: 'EncounterType',
    CodeGroup: 'Setting',
    CodeMeaning: 'Emergency',
  },
  {
    Code: 'E004',
    CodeType: 'EncounterType',
    CodeGroup: 'Setting',
    CodeMeaning: 'Telehealth',
  },
  {
    Code: 'E005',
    CodeType: 'EncounterType',
    CodeGroup: 'Setting',
    CodeMeaning: 'Community / Home Visit',
  },

  // ---------------- Intervention Level ----------------
  {
    Code: 'L1',
    CodeType: 'InterventionLevel',
    CodeGroup: 'Complexity',
    CodeMeaning: 'Basic care intervention',
  },
  {
    Code: 'L2',
    CodeType: 'InterventionLevel',
    CodeGroup: 'Complexity',
    CodeMeaning: 'Intermediate care intervention',
  },
  {
    Code: 'L3',
    CodeType: 'InterventionLevel',
    CodeGroup: 'Complexity',
    CodeMeaning: 'Advanced / critical care intervention',
  },

  // ---------------- Domain Competency ----------------
  {
    Code: 'C1',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Knowledge',
    CodeMeaning: 'Knowledge for Nursing Practice',
  },
  {
    Code: 'C2',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Care',
    CodeMeaning: 'Person-Centered Care',
  },
  {
    Code: 'C3',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Population',
    CodeMeaning: 'Population Health',
  },
  {
    Code: 'C4',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Scholarship',
    CodeMeaning: 'Scholarship for the Nursing Discipline',
  },
  {
    Code: 'C5',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Quality',
    CodeMeaning: 'Quality and Safety',
  },
  {
    Code: 'C6',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Partnerships',
    CodeMeaning: 'Interprofessional Partnerships',
  },
  {
    Code: 'C7',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Systems',
    CodeMeaning: 'Systems-Based Practice',
  },
  {
    Code: 'C8',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Technology',
    CodeMeaning: 'Informatics and Healthcare Technologies',
  },
  {
    Code: 'C9',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Professionalism',
    CodeMeaning: 'Professionalism',
  },
  {
    Code: 'C10',
    CodeType: 'DomainCompetency',
    CodeGroup: 'Leadership',
    CodeMeaning: 'Personal, Professional, and Leadership Development',
  },
];

exports.getCareTrackerConfig = async (req, res, next) => {
  try {
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes: codeTable,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /students/add
exports.addConfig = (req, res, next) => {
  try {
    const { codeType, codeGroup, code, codeMeaning } = req.body;

    if (!codeType || !codeGroup || !code || !codeMeaning) {
      return res.status(400).send('All fields are required.');
    }

    // Basic duplicate check
    const duplicate = codeTable.find(
      (c) =>
        c.Code.toUpperCase() === code.toUpperCase() && c.CodeType === codeType
    );
    if (duplicate) {
      return res.status(400).send('Duplicate code for this type.');
    }

    // Add new entry
    codeTable.push({
      Code: code.trim(),
      CodeType: codeType.trim(),
      CodeGroup: codeGroup.trim(),
      CodeMeaning: codeMeaning.trim(),
    });
    res.redirect('/careTrackerConfig'); // will show the updated list
  } catch (err) {
    next(err);
  }
};
