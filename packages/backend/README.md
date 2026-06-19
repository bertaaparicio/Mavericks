# TalentMatchAI backend server



#SQL

CREATE TABLE jobposts (
    job_title TEXT,
    company_name TEXT,
    location TEXT,
    hiring_status TEXT,
    date TEXT, 
    seniority_level TEXT,
    job_function TEXT,
    employment_type TEXT,
    industry TEXT
);

\copy jobposts(job_title, company_name, location, hiring_status, date, seniority_level, job_function, employment_type, industry) FROM '/linkedin_job_posts_insights.csv' DELIMITER ',' CSV HEADER;

