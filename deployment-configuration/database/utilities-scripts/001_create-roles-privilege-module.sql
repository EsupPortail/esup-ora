CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(255) NOT NULL
);

CREATE TABLE namespaces (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL
);

CREATE TABLE categorie (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    ordre INT NOT NULL,
    namespace_id INT NOT NULL,
    FOREIGN KEY (namespace_id) REFERENCES namespaces(id)
);

CREATE TABLE privilege (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    ordre INT NOT NULL,
    categorie_id INT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

CREATE TABLE privilege_role_linker (
    role_id INT NOT NULL,
    privilege_id INT NOT NULL,
    PRIMARY KEY (role_id, privilege_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (privilege_id) REFERENCES privilege(id)
);

CREATE TABLE role_user_linker (
    id_user_keycloak VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (id_user_keycloak, role_id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);
