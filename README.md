# EarthPulse AI — Java 21

Spring Boot 3.5 / Java 21 environmental-awareness website with separate user and administrator workspaces.

## Run locally (Windows)
1. Install JDK 21, Maven 3.9+ and MySQL.
2. Extract the ZIP and open PowerShell in `EarthPulseAI_Java21`.
3. Easiest: run `Set-ExecutionPolicy -Scope Process Bypass` and then `./run-windows.ps1`. It securely prompts for the MySQL and admin passwords, then starts the app. Alternatively, set the environment variables manually:

```powershell
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:APP_ADMIN_EMAIL="your-admin-email@example.com"
$env:APP_ADMIN_PASSWORD="YOUR_STRONG_ADMIN_PASSWORD"

# Optional second administrator
$env:APP_ADMIN2_EMAIL="second-admin-email@example.com"
$env:APP_ADMIN2_PASSWORD="SECOND_STRONG_ADMIN_PASSWORD"

mvn clean spring-boot:run
```

4. Open `http://localhost:8080`.
5. Use `http://localhost:8080/admin/login` for the separate admin login.

The configured admin email/password accounts are promoted to `ROLE_ADMIN` at startup. Regular user registration never creates an admin account. Both admins use the same starter PIN in this package; use a different salted PIN hash if separate PINs are required for production.

## Admin Control Center
- Overview cards link to their corresponding sections.
- User Management lists registered accounts, role, registration time, last successful sign-in and connection IP.
- Login Activity shows the latest 30 successful sign-ins.
- Community Reports and WasteWatch Reports are separate review sections with status controls.
- Saved report coordinates open as Google Maps pins.
- Alerts are generated from submissions still awaiting review.
- Admin pages and admin report APIs require both an ADMIN role and a successful PIN verification in the admin login flow.

## Data and privacy
- Database credentials are read from environment variables and are not committed to `application.properties`.
- Back up MySQL before running schema updates. Hibernate uses `ddl-auto=update`.
- New WasteWatch submissions store the signed-in user's email. Older submissions may not have an email because that field was not previously saved.
- Login history stores the connection IP and timestamp. IP is not a precise GPS location or a verified city/street address.
- Exact GPS location is only available when a user explicitly shares it. Report maps display only coordinates or addresses actually submitted by the reporter.
- The user dashboard no longer injects a second toolbar/language selector or a hard-coded Pune weather/map panel. The dashboard has one language selector.

## Other integrations
- Air-quality and weather modules use external modelled services where indicated on the page.
- Maps and live external services require internet access.
- AI assistance requires `AI_API_KEY`.

## Build and tests
Run `mvn clean test` before deployment. The preparation environment used for this package does not have Maven installed, so the Maven build and browser/database end-to-end flow could not be executed here. Validate locally with JDK 21 and Maven.
