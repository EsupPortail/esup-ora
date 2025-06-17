DO $$
DECLARE
    current_table TEXT;
    order_counter INT := 10;
    new_category_id INT;
BEGIN
    IF current_database() <> 'ora_db' THEN
        RAISE EXCEPTION 'Ce script doit être exécuté dans la base de données ora_db.';
    END IF;
    INSERT INTO public.namespaces (id, libelle)       VALUES(1, 'CRUD resources');

    FOR current_table IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
     LOOP
        IF current_table LIKE '%prisma%' OR current_table LIKE '\_%' ESCAPE '\' THEN
            CONTINUE;
        END IF;

        INSERT INTO public.categorie (libelle, code, ordre, namespace_id)
        VALUES (current_table, 'code_' || current_table, order_counter, 1)
        RETURNING id INTO new_category_id;

        INSERT INTO public.privilege (libelle, code, ordre, categorie_id)
        VALUES 
            ('creer la resource ' || current_table, 'creer_' || current_table, order_counter, new_category_id ),
            ('consulter la resource '   || current_table, 'consulter_'   || current_table, order_counter + 10, new_category_id ),
            ('modifier la resource ' || current_table, 'modifier_' || current_table, order_counter + 20, new_category_id ),
            ('supprimer la resource ' || current_table, 'supprimer_' || current_table, order_counter + 30, new_category_id );
        order_counter := order_counter + 40;
    END LOOP;
END $$;

-- psql -U ora_db_god_administrator -d ora_security_db