CREATE TYPE OS AS ENUM ('Windows', 'Linux' , 'MacOS');

CREATE TABLE IF NOT EXISTS  developer_infos(
	id SERIAL PRIMARY KEY,
	developerSince date NOT NULL,
	preferredOS OS NOT NULL
);

DROP TABLE developer_infos; 
DROP TABLE developers; 
DROP TABLE projects ; 
DROP TABLE projects_technologies ; 

CREATE TABLE IF NOT EXISTS  developer_infos(
	id SERIAL PRIMARY KEY,
	"developerSince" date NOT NULL,
	"preferredOS" OS NOT NULL
); 

CREATE TABLE IF NOT EXISTS  developers(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) UNIQUE NOT NULL,
	"developerInfoId" INTEGER UNIQUE,
	FOREIGN KEY ("developerInfoId") REFERENCES developer_infos(id) ON DELETE CASCADE
); 

ALTER TABLE developers ALTER COLUMN

CREATE TABLE IF NOT EXISTS  projects(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT  NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE,
	"developerId" INTEGER,
	FOREIGN KEY ("developerId") REFERENCES developers(id) ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS  technologies(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL 
); 

CREATE TABLE IF NOT EXISTS  projects_technologies(
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"technologyId" INTEGER,
	FOREIGN KEY ("technologyId") REFERENCES technologies(id),
	"projectId" INTEGER,
	FOREIGN KEY ("projectId") REFERENCES projects(id) ON DELETE CASCADE
); 

INSERT INTO 
	technologies(name) 
VALUES 
	('JavaScript'),
	('Python'),
	('React'),
	('Express.js'),
	('HTML'),
	('CSS'),
	('Django'),
	('PostgreSQL'),
	('MongoDB')
RETURNING
	*;

 	 	SELECT
            de.id as "developerID",
            de."name" as "name",
            de."email" as "email",
            de."developerInfoId" as "developerInfoId",
            dein."developerSince" as "developerSince",
            dein. "preferredOS" as "preferredOS"
        FROM
            developers de
        FULL JOIN
            developer_infos dein ON de."developerInfoId" = dein.id;
          
        SELECT
            de.id as "developerID",
            de."name" as "name",
            de."email" as "email",
            de."developerInfoId" as "developerInfoId",
            dein."developerSince" as "developerInfoDeveloperSince",
            dein. "preferredOS" as "developerInfoPreferredOS"
        FROM
            developers de
        FULL JOIN
            developer_infos dein ON de."developerInfoId" = dein.id
        WHERE 
            de.id = 5;
        
       INSERT INTO 
          developer_infos (%I)
       VALUES 
           (%L)
       RETURNING*;   
      
      SELECT * FROM projects p;
     
     INSERT INTO 
        projects ("name","description" ,"estimatedTime" ,"repository" ,"startDate" ,"developerId")
     VALUES 
         (  'Projeto 1',
		   'Projeto fullstack',
		   '2 dias',
		   'url.com.br',        
		  '2015-01-01T02:00:00.000Z',
		   3
		 );
		
	SELECT * FROM technologies t ;

		SELECT
			de.id as "developerID",
            de."name" as "name",
            de."email" as "email",
            de."developerInfoId" as "developerInfoId",
            dein."developerSince" as "developerInfoDeveloperSince",
            dein. "preferredOS" as "developerInfoPreferredOS",
            p.id as "projectID",
           	p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate",
            p."developerId" as "projectDeveloperID",
            t.id as "technologyID",
            t."name" as "technologyName"
        FROM
            developers de 
        LEFT JOIN
             developer_infos dein ON dein.id = de."developerInfoId"
        LEFT  JOIN 
        	projects p  ON p."developerId" = de.id
        LEFT JOIN 
        	projects_technologies pt ON pt."projectId" = p.id 
        LEFT JOIN 
        	technologies t ON pt."technologyId" = t.id
        WHERE de.id = 1;
       
       SELECT
            p.id as "projectID",
           	p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate",
            t.id as "technologyID",
            t."name" as "technologyName"
        FROM
            projects p  
        LEFT JOIN
             projects_technologies pt ON pt."projectId" = p.id
        LEFT  JOIN 
        	technologies t ON pt."technologyId" = t.id
        WHERE p.id = 1;
       
       SELECT 
            * 
       FROM 
            technologies
       WHERE   
            technologies.name = 'React'; 
           
   		SELECT
			t.id as "technologyID",
            t."name" as "technologyName",
            p.id as "projectID",
           	p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate"
        FROM
            technologies t 
        LEFT JOIN 
        	projects_technologies pt ON pt."technologyId" = t.id
        LEFT JOIN 
        	projects p  ON pt."projectId" = p.id
        WHERE p.id = 4;
           