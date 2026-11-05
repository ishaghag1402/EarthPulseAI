EARTHPULSE AI — ADMIN CONTROL CENTER UPDATE

ADMIN FEATURES
- Separate administrator login page at /admin/login. There is no public admin registration.
- Admin dashboard sections are separate and clickable: Overview, User Management, Login Activity, Community Reports, WasteWatch Reports, and Alerts & Notifications.
- User Management shows registered users, role, registration time, last successful sign-in time and last sign-in IP.
- Login Activity records the latest 30 successful sign-ins.
- Community and WasteWatch reports show reporter identity and saved address/coordinates. Map links open the exact coordinates saved with a report.
- Report status controls save changes to the database. Alerts are generated from reports still submitted/pending/under review.
- English, Hindi and Marathi selector appears once on the user dashboard; the extra injected dashboard toolbar/weather block was removed.

ADMIN LOGIN
- Configure APP_ADMIN_EMAIL and APP_ADMIN_PASSWORD for admin 1.
- Optional second admin: APP_ADMIN2_EMAIL and APP_ADMIN2_PASSWORD.
- Both configured accounts receive ROLE_ADMIN. Admin access additionally requires the fixed PIN at /admin/login.
- Do not share the PIN/password or commit them to a public repository. Change the PIN hash/salt and use HTTPS/rate-limiting before public deployment.

WINDOWS POWERSHELL SETUP
Easy option: in PowerShell, run `Set-ExecutionPolicy -Scope Process Bypass` and then `./run-windows.ps1`. The script securely prompts for MySQL and admin passwords and does not save them to files.

Manual option: open PowerShell in the EarthPulseAI_Java21 folder and set your own secrets for this terminal session:

$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:APP_ADMIN_EMAIL="your-admin-email@example.com"
$env:APP_ADMIN_PASSWORD="YOUR_STRONG_ADMIN_PASSWORD"
$env:APP_ADMIN2_EMAIL="second-admin-email@example.com"
$env:APP_ADMIN2_PASSWORD="SECOND_STRONG_ADMIN_PASSWORD"

Then run:
mvn clean spring-boot:run

Open:
http://localhost:8080/admin/login

DATABASE NOTES
- MySQL is configured by default. The password is intentionally not stored in application.properties.
- The database user needs permission to connect to earthpulse_db and create/update tables.
- Existing report rows are retained by Hibernate ddl-auto=update. Back up the database before running schema changes.
- New WasteWatch submissions store the authenticated account email. Older WasteWatch rows created before this update may not have an email because that information was never stored.
- Existing community report latitude/longitude values are shown as map links. If no coordinates were captured at submission time, the dashboard correctly shows Not shared.

LOCATION & ACTIVITY PRIVACY
- Login Activity records the connection IP and timestamp. An IP address is not an exact GPS location or guaranteed city address.
- Exact login location is not collected in the background. A user must explicitly grant browser geolocation for a feature that asks to share it.
- Report locations are the address/coordinates the reporter chose to submit.
- Login Activity means recent successful sign-ins, not a live list of currently open browser sessions.

BUILD
Requires JDK 21 and Maven 3.9+. Run mvn clean test to validate locally, then mvn clean spring-boot:run.


