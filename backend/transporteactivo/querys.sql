--Query que crea la vista con los stoptype generados.
--CREATE VIEW stop_types AS
SELECT	distinct(ls."STOPID"),
	min(case substring(l."SHORTNAME" from 1 for 1)
		when 'E' then 1
		when 'T' then 1
		when 'P' then 2
		when 'A' then 3
	end) as "STOPTYPE"
FROM "LINESTOPS" ls
JOIN "LINES" l ON ls."LINEID" = l."LINEID"
JOIN "STOPS" s ON ls."STOPID" = s."STOPID"
WHERE l."SHORTNAME" NOT LIKE 'R%'
GROUP BY ls."STOPID";


--Query inicial que podría ayudar para crear las paradas compuestas
SELECT	s."STOPID",
	s."LONGNAME",
	substring (s."LONGNAME" from '^(.*) [ABCDabcd][0-9]$') as NAME,
	substring (s."LONGNAME" from '^.* ([ABCDabcd][0-9])$') as GATE
FROM "STOPS" s
JOIN mio_miostops ms ON s."STOPID" = ms.stops_ptr_id
WHERE s."LONGNAME" ~* '.*[ABCD][0-9]$'
AND ms.tipo_parada = 1
ORDER BY s."LONGNAME";