# CS346 Semester Project Care Tracker Reporting and Management module

Care Tracker is a solution to assist Nursing students and teachers track clinical hour reports, progression towards
certification, and program accreditation.

This web project represents half of the Care Tracker solution. The clinical hour reports are entered and reviewed
via a mobile app. The web app is used to review student progress and manage system configuration. Students and
Teachers can use the website to view student progression towards nursing licensure. Managers can use the system
to control the values available in report dropdown fields (reports are created in the mobile app).

## Architecture

MVC is the separation of responsibilities to keep code manageable. Models interact with data and API endpoints. Views
deliver the user experience. The Controller connects views and models so that the UI and data can interact while remaining
agnostic to the other's implementation.

This project leverages MVC by:
All UI elements are client safe EJS views.
Data is saved and loaded via server side models.
The Controllers accept incoming traffic from the routes, then leverage models to populate the appropriate data fields
of the EJS views so that users can access what they need, but only what they are allowed.

## Local Setup Instructions

1. Clone the repository
2. Install dependencies: npm install
3. Create a .env file and add SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY as provided in the Supabase project.
4. Run the app: npm start
5. Visit http://localhost:3000

## Error Handling

Missing .env throw an immediate error and will intentionally prevent the system from starting until these values are provided.
Feedback for this error is routed to the terminal.

Authentication and Authorization errors are anticipated as the most common runtime errors. Database connectivity errors are
also possible. Try/Catch wrappers in controllers are used to prevent fatal service errors. In the event of error the UI is
redirected to an error feedback page and the error is logged to the terminal and database. If the database cannot be reached
a local log cache file is created and synced with the database first opportunity.
