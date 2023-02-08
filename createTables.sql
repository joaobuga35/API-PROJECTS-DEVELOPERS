CREATE TYPE OS AS ENUM ('Windows', 'Linux' , 'MacOS');

CREATE TABLE IF NOT EXISTS  developer_infos(
	id SERIAL PRIMARY KEY,
	developerSince date NOT NULL,
	preferredOS OS NOT NULL
);

DROP TABLE developer_infos ; 

CREATE TABLE IF NOT EXISTS  developer_infos(
	id SERIAL PRIMARY KEY,
	"developerSince" date NOT NULL,
	"preferredOS" OS NOT NULL
); 

CREATE TABLE IF NOT EXISTS  developers(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) UNIQUE NOT NULL 
); 

CREATE TABLE IF NOT EXISTS  projects(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT  NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE
); 

CREATE TABLE IF NOT EXISTS  technologies(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL 
); 

CREATE TABLE IF NOT EXISTS  projects_technologies(
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL
); 