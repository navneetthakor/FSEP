create table MPD01(
	-- client id
	D01F01 int not null,
    
    -- server id
    D01F02 int not null,
    
    -- worker id
    D01F03 varchar(20) not null,
    primary key(D01F01, D01F02)
);

create table MPD02(
	-- worker id
	D02F01 varchar(20) primary key,
    
    -- worker status
    D02F02 int default 1 not null
    );
    