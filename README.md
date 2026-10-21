# The Logic Lab – Interactive Algorithm Visualization Platform

> **Abstract** : The Logic Lab is an interactive learning platform that visualizes medium and hard algorithms through real-world applications. Using dynamic animations and step-by-step explanations, it helps users understand algorithm execution, analyze different paths, explore code, and learn how algorithms solve practical problems.

### Project Members
1. JHA AAYUSH SATISH  [ Team Leader ]
2. KAWALI SHASHVAT NILESH
3. MOKASHI ABRARKHAN ABDULGANI
4. TAYWADE OM SATISH

### Project Guides
    No guides assigned.

### Deployment Steps
Please follow the below steps to run this project.
1. Clone the repository and open the project folder.
   ```bash
   git clone <repository-url>
   cd the-logic-lab
   ```
2. Set up the database: install MySQL, create the schema (e.g. `logic_lab`) and import the SQL file from the `database/` folder.
3. Configure the backend: update the MySQL URL, username and password in the Java backend's configuration file.
4. Build the Java Servlet backend (Maven/Gradle, or your IDE) to generate the `.war` file and deploy it to Apache Tomcat (copy to `webapps/`), then start Tomcat.
5. Set up the frontend: install Node.js, then run:
   ```bash
   cd frontend
   npm install
   ```
6. Set the backend API URL (e.g. `http://localhost:8080/...`) in the frontend environment file.
7. Start the frontend:
   ```bash
   npm run dev
   ```
8. Open `http://localhost:3000` in your browser.

### Subject Details
- Class : SE (COMP) Div A - 2026-2027
- Subject : Full Stack Java Programming (FSJP)
- Project Type : Course Project

### Platform, Libraries and Frameworks used
1. [Next.js](https://nextjs.org)
2. [React](https://react.dev)
3. [GSAP](https://gsap.com)
4. [Java Servlets (Jakarta Servlet)](https://jakarta.ee/specifications/servlet/)
5. [Apache Tomcat](https://tomcat.apache.org)
6. [MySQL](https://www.mysql.com)
7. SVG for graph rendering, GitHub for collaboration, [Postman](https://www.postman.com) for API testing

### Dataset Used
No external dataset is used. Algorithm descriptions, sample graphs, example problems and practice questions are created by the team and stored in MySQL.

### References
- [https://nextjs.org/docs](https://nextjs.org/docs)
- [https://gsap.com/docs/v3/](https://gsap.com/docs/v3/)
- [https://tomcat.apache.org/tomcat-10.1-doc/](https://tomcat.apache.org/tomcat-10.1-doc/)
- [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
