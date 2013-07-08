-- Query que crea la vista con los stoptype generados.
-- CREATE OR REPLACE VIEW stop_types AS
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

-- GRANT ALL PRIVILEGES ON stop_types TO transporteactivo;


-- Query que crea la vista para el autocompletado
CREATE OR REPLACE VIEW search AS
SELECT s."STOPID" AS id, s."LONGNAME" AS nombre, CAST(ms.tipo_parada AS varchar) AS extra, 'p' as tipo
FROM "STOPS" s
JOIN mio_miostops ms ON ms.stops_ptr_id = s."STOPID"
UNION
SELECT l."LINEID" AS id, l."SHORTNAME" AS nombre, l."DESCRIPTION" AS extra, 'r' as tipo
FROM "LINES" l
ORDER BY tipo DESC, nombre;

-- Modificacion query Busqueda
CREATE OR REPLACE VIEW search AS
SELECT s."STOPID" AS id, s."LONGNAME" AS nombre, CAST(ms.tipo_parada AS varchar) AS extra, 'p' as tipo,
       CAST(s."DECIMALLATITUDE" AS varchar)  || ';' || CAST(s."DECIMALLONGITUDE" AS varchar) AS extra2
FROM "STOPS" s
JOIN mio_miostops ms ON ms.stops_ptr_id = s."STOPID"
UNION
SELECT l."LINEID" AS id, l."SHORTNAME" AS nombre, l."DESCRIPTION" AS extra, 'r' as tipo, CAST(larcs."ORIENTATION" AS varchar) as extra2
FROM "LINES" l
JOIN "LINESARCS" larcs ON larcs."LINEID" = l."LINEID"
ORDER BY tipo DESC, nombre;


-- GRANT ALL PRIVILEGES ON search TO transporteactivo;


-- Query inicial que podría ayudar para crear las paradas compuestas
SELECT	s."STOPID",
	s."LONGNAME",
	substring (s."LONGNAME" from '^(.*) [ABCDabcd][0-9]$') as NAME,
	substring (s."LONGNAME" from '^.* ([ABCDabcd][0-9])$') as GATE
FROM "STOPS" s
JOIN mio_miostops ms ON s."STOPID" = ms.stops_ptr_id
WHERE s."LONGNAME" ~* '.*[ABCD][0-9]$'
AND ms.tipo_parada = 1
ORDER BY s."LONGNAME";