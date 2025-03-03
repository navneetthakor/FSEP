use webpulse_stack;

create table wps01(
	-- id
	S01F01 int primary key,
    
    -- fname
    S01F02 varchar(30),
    
    -- lname
    S01F03 varchar(30),
    
    -- password
    S01F04 text,
    
    -- email
    S01F05 varchar(50),
    
    -- phone
    S01F06 varchar(10)
);

create table wps02(
	-- server id
    S02F01 int primary key,
    
    -- client id
    S02F02 int,
    
    -- server_url
    S02F03 varchar(50),
    
    -- server_status
    S02F04 varchar(10),
    
    foreign key (S02F02) references wps01(S01F01)
);




