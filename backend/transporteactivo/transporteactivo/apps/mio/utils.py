# -*- coding: utf-8 -*-
from django.db import connection
# import json


def search_sql(query):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT
            "STOPS"."LONGNAME" as "nombre"
        FROM "mio_miostops"
        INNER JOIN
            "STOPS" ON ("mio_miostops"."stops_ptr_id" = "STOPS"."STOPID")
        WHERE
            UPPER("STOPS"."LONGNAME"::text) LIKE UPPER(%s)
        UNION
        SELECT
            "LINES"."SHORTNAME"
        FROM
            "LINES"
        WHERE UPPER("LINES"."SHORTNAME"::text) LIKE UPPER(%s)
    ''', ['%' + query + '%', '%' + query + '%'])

    desc = cursor.description
    result = [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]
    return result
