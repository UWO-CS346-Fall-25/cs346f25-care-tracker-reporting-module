const allCourses = [
    { 
        id: 'CS346', 
        name: 'Web Development', 
        seats: 25, 
        instructor: 'Dr. Smith', 
        description: 'Advanced web application development using Node.js and Express.',
        students: ['Alice Johnson', 'Bob Williams', 'Charlie Brown'] 
    },
    { 
        id: 'CS420', 
        name: 'Software Engineering', 
        seats: 18, 
        instructor: 'Prof. Jones', 
        description: 'Principles of software design, testing, and project management.',
        students: ['David Lee', 'Eve Martinez', 'Frank White'] 
    },
    { 
        id: 'CS301', 
        name: 'Data Structures', 
        seats: 30, 
        instructor: 'Dr. Lee', 
        description: 'In-depth study of abstract data types and algorithm analysis.',
        students: ['Grace Hall', 'Henry King', 'Ivy Miller'] 
    }
];


// --- STATIC PAGE HANDLERS (PLACEHOLDERS) ---

/** GET /: Display the home page */
exports.getHome = async (req, res, next) => {
    try {
        res.render('index', {
            title: 'Home',
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

/** GET /about: Display the about page */
exports.getAbout = async (req, res, next) => {
    try {
        res.render('about', {
            title: 'About',
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

/** GET /students: Display the students page (placeholder) */
exports.getStudents = async (req, res, next) => {
    try {
        res.render('students', {
            title: 'Students',
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

/** GET /accreditationreport: Display the accreditation report page (placeholder) */
exports.getAccreditationReport = async (req, res, next) => {
    try {
        res.render('accreditationReport', {
            title: 'Accreditation Report',
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

/** GET /caretrackerconfig: Display the config page (placeholder) */
exports.getCareTrackerConfig = async (req, res, next) => {
    try {
        res.render('careTrackerConfig', {
            title: 'Care Tracker Configuration',
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

// --- DYNAMIC FUNCTIONALITY ---

/** GET /classes: Display the dynamic classes page with data */
exports.getClassesPage = async (req, res, next) => { 
    try {
        const dataForView = {
            title: "Available Courses (Dynamic)",
            courses: allCourses, // Use the defined mock data
            lastUpdated: new Date().toLocaleString(),
            user: res.locals.user || null,
            csrfToken: req.csrfToken()
        };
        res.render('classes', dataForView); 
    } catch (error) { next(error); }
};

/** GET /classReport?id=...: Display the report for a specific class */
exports.getClassReport = async (req, res, next) => {
    try {
        const courseId = req.query.id; 
        const course = allCourses.find(c => c.id === courseId);

        if (!course) {
            return res.status(404).render('error', {
                title: 'Class Not Found',
                message: `Course with ID "${courseId}" was not found.`,
                error: { status: 404 },
            });
        }
        res.render('classReport', {
            title: `Report for ${course.id}: ${course.name}`,
            course: course, 
            csrfToken: req.csrfToken(),
        });
    } catch (error) { next(error); }
};

/** GET /api/status: Returns system status information as JSON */
exports.getSystemStatus = (req, res) => {
    const status = {
        status: "OK",
        uptime: process.uptime(),
        message: "API is reachable!",
        timestamp: new Date().toISOString()
    };
    res.json(status); 
};