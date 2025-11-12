const model = require('../models/studentsModel');

const competencyData = [
  {
    domain: 'Domain 1: Knowledge for Nursing Practice',
    competencies: [
      {
        text: 'Demonstrate an understanding of the discipline of nursing’s distinct perspective and where shared perspectives exist with other disciplines.',
        complete: true,
      },
      {
        text: 'Apply theory and evidence-based practice knowledge from nursing, the arts, humanities, and other sciences.',
        complete: false,
      },
      {
        text: 'Demonstrate clinical judgment founded on a broad knowledge base.',
        complete: true,
      },
      {
        text: 'Integrate knowledge from nursing and other disciplines in the provision of safe, quality care.',
        complete: false,
      },
    ],
  },
  {
    domain: 'Domain 2: Person-Centered Care',
    competencies: [
      {
        text: 'Use a holistic, patient-centered approach when providing care.',
        complete: true,
      },
      {
        text: 'Partner with the patient, family, and/or care team in shared decision-making.',
        complete: false,
      },
      {
        text: 'Demonstrate respect for diversity, equity, and inclusion in the care of individuals.',
        complete: true,
      },
      {
        text: 'Provide care across the lifespan that is developmentally and culturally appropriate.',
        complete: false,
      },
      {
        text: 'Deliver evidence-based nursing interventions to promote health, prevent illness, and manage disease.',
        complete: true,
      },
      {
        text: 'Evaluate care outcomes with the patient, family, and/or care team.',
        complete: false,
      },
    ],
  },
  {
    domain: 'Domain 3: Population Health',
    competencies: [
      {
        text: 'Assess the health of individuals, families, communities, and populations using a socioecological framework.',
        complete: true,
      },
      {
        text: 'Apply knowledge of social determinants of health in the delivery of care.',
        complete: true,
      },
      {
        text: 'Collaborate with others to improve health outcomes for individuals and populations.',
        complete: false,
      },
      {
        text: 'Engage in health promotion and disease prevention strategies across populations.',
        complete: false,
      },
      {
        text: 'Advocate for policies that improve equitable health outcomes.',
        complete: true,
      },
    ],
  },
  {
    domain: 'Domain 4: Scholarship for the Nursing Discipline',
    competencies: [
      {
        text: 'Use evidence-based findings to inform clinical judgment and practice.',
        complete: true,
      },
      {
        text: 'Apply principles of research and evidence translation in practice.',
        complete: false,
      },
      {
        text: 'Identify practice questions that can be addressed through scholarly inquiry.',
        complete: false,
      },
      {
        text: 'Integrate scholarship into clinical practice and professional development.',
        complete: true,
      },
    ],
  },
  {
    domain: 'Domain 5: Quality and Safety',
    competencies: [
      {
        text: 'Apply quality improvement principles in the delivery of nursing care.',
        complete: false,
      },
      {
        text: 'Use data to monitor outcomes and inform care improvements.',
        complete: true,
      },
      {
        text: 'Demonstrate use of standardized practices to enhance safety and quality.',
        complete: false,
      },
      {
        text: 'Participate in the analysis of errors and near misses to improve systems of care.',
        complete: true,
      },
    ],
  },
  {
    domain: 'Domain 6: Interprofessional Partnerships',
    competencies: [
      {
        text: 'Communicate effectively with the healthcare team to provide coordinated care.',
        complete: true,
      },
      {
        text: 'Demonstrate respect for the unique roles and responsibilities of other team members.',
        complete: false,
      },
      {
        text: 'Work in partnership with interprofessional teams to achieve optimal care outcomes.',
        complete: true,
      },
      {
        text: 'Participate in conflict resolution and team-building strategies.',
        complete: false,
      },
    ],
  },
  {
    domain: 'Domain 7: Systems-Based Practice',
    competencies: [
      {
        text: 'Demonstrate an understanding of how healthcare systems influence practice.',
        complete: true,
      },
      {
        text: 'Apply knowledge of organizational structure, mission, vision, and values to professional practice.',
        complete: true,
      },
      {
        text: 'Participate in efforts to reduce healthcare costs while maintaining quality.',
        complete: false,
      },
      {
        text: 'Advocate for system changes that improve health equity and outcomes.',
        complete: true,
      },
    ],
  },
  {
    domain: 'Domain 8: Informatics and Healthcare Technologies',
    competencies: [
      {
        text: 'Use information and communication technologies in the delivery of care.',
        complete: true,
      },
      {
        text: 'Apply informatics in the documentation, evaluation, and coordination of care.',
        complete: false,
      },
      {
        text: 'Maintain ethical standards and patient confidentiality in the use of technology.',
        complete: true,
      },
      {
        text: 'Demonstrate digital literacy in accessing and evaluating health information.',
        complete: false,
      },
    ],
  },
  {
    domain: 'Domain 9: Professionalism',
    competencies: [
      {
        text: 'Demonstrate accountability for one’s own professional practice.',
        complete: true,
      },
      {
        text: 'Uphold ethical principles in all aspects of care.',
        complete: true,
      },
      {
        text: 'Advocate for the nursing profession and for patients.',
        complete: false,
      },
      {
        text: 'Demonstrate professional identity consistent with nursing’s core values.',
        complete: false,
      },
    ],
  },
  {
    domain: 'Domain 10: Personal, Professional, and Leadership Development',
    competencies: [
      {
        text: 'Demonstrate leadership skills in the provision of nursing care.',
        complete: true,
      },
      {
        text: 'Apply self-reflection and feedback for personal and professional growth.',
        complete: false,
      },
      {
        text: 'Exhibit resilience and well-being practices to sustain professional performance.',
        complete: true,
      },
      {
        text: 'Engage in lifelong learning to advance nursing practice.',
        complete: false,
      },
      {
        text: 'Demonstrate time management and organizational skills.',
        complete: true,
      },
      {
        text: 'Participate in mentoring and development of peers.',
        complete: false,
      },
    ],
  },
];

// Import models if needed
// const SomeModel = require('../models/SomeModel');

/**
 * GET /about
 * Display the about page
 */
exports.getStudents = async (req, res, next) => {
  try {
    const allStudents = await model.getAll();
    res.render('students', {
      title: 'Students',
      students: allStudents,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentByName = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'StudentByName',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
exports.getClassStudentByName = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    const classId = req.params.class_id;
    res.render('classStudentReport', {
      title: 'StudentByName',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      class_id: classId,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
exports.getSelfReport = async (req, res, next) => {
  try {
    const userId = '13652b4f-6f6a-41cc-a00c-22995b412870';
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('selfReport', {
      title: 'Student Report',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
