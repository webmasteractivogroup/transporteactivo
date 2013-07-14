-- Query que crea la vista con los stoptype generados.
CREATE OR REPLACE VIEW stop_types AS
SELECT  distinct(ls."STOPID"),
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

-- Modificacion Busqueda usando linevariant
CREATE OR REPLACE VIEW search AS
SELECT s."STOPID" AS id, s."LONGNAME" AS nombre, CAST(ms.tipo_parada AS varchar) AS extra, 'p' as tipo,
       CAST(s."DECIMALLATITUDE" AS varchar)  || ';' || CAST(s."DECIMALLONGITUDE" AS varchar) AS extra2, s."SHORTNAME" as linevariant
FROM "STOPS" s
JOIN mio_miostops ms ON ms.stops_ptr_id = s."STOPID"
UNION
SELECT lstops."LINEID" AS id , l."SHORTNAME" AS nombre,  l."DESCRIPTION" AS extra, 'r' as tipo, CAST(lstops."ORIENTATION" as varchar) as extra2, 
CAST(MIN(lstops."LINEVARIANT") as varchar) AS linevariant
FROM "LINESTOPS" lstops
INNER JOIN "LINES" l ON (lstops."LINEID" = l."LINEID") GROUP BY l."SHORTNAME", lstops."LINEID", l."DESCRIPTION", lstops."ORIENTATION" 
ORDER BY tipo DESC, nombre;








-- paradas por rutas
CREATE OR REPLACE VIEW paradas_por_ruta AS 
SELECT 
    "LINESARCS"."LINEARCID" as id , "LINESARCS"."LINEID" as lineid, "ARCS"."STOPS_STOPID_START" as stop_start_id, "STOPS"."LONGNAME" as stop_start_name, 
    "STOPS"."DECIMALLATITUDE" as stop_start_lat, "STOPS"."DECIMALLONGITUDE" as stop_start_lng, "ARCS"."STOPS_STOPID_END" as stop_end_id, T5."LONGNAME" as stop_end_name, 
    T5."DECIMALLATITUDE" as stop_end_lat, T5."DECIMALLONGITUDE" as stop_end_lng, "LINESARCS"."ARCSEQUENCE" as arcsequence, 
    "LINESARCS"."ORIENTATION" as orientation, "LINESARCS"."LINEVARIANT" as linevariant
FROM 
    "ARCS" LEFT OUTER JOIN "LINESARCS" ON ("ARCS"."ARCID" = "LINESARCS"."ARCID") 
    INNER JOIN "STOPS" ON ("ARCS"."STOPS_STOPID_START" = "STOPS"."STOPID") 
    INNER JOIN "STOPS" T5 ON ("ARCS"."STOPS_STOPID_END" = T5."STOPID")


-- GRANT ALL PRIVILEGES ON search TO transporteactivo;


-- Query inicial que podría ayudar para crear las paradas compuestas
SELECT  s."STOPID",
    s."LONGNAME",
    substring (s."LONGNAME" from '^(.*) [ABCDabcd][0-9]$') as NAME,
    substring (s."LONGNAME" from '^.* ([ABCDabcd][0-9])$') as GATE
FROM "STOPS" s
JOIN mio_miostops ms ON s."STOPID" = ms.stops_ptr_id
WHERE s."LONGNAME" ~* '.*[ABCD][0-9]$'
AND ms.tipo_parada = 1
ORDER BY s."LONGNAME";