export const transformDataForTableInverted = (roles, accesses) => {
    return accesses.map(access => {
      return {
        access: access.name, // Nom de l'accès
        roles: roles.map(role => ({
          name: role.name, 
          hasAccess: role.access.includes(access.id) // true si le rôle a cet accès
        }))
      };
    });
  };

  export const mockUpRoles = {
    "roles": [
        {
            id: 1,
            name: "Administrateur Technique",
            access: [1, 2, 3, 4, 5, 6]
        },
        {
            id: 2,
            name: "Administrateur Fonctionnel",
            access: [7, 8, 9, 10, 11, 12]
        },
        {
            id: 3,
            name: "Ingénieur Pédagogique",
            access: [13, 14]
        },
        {
            id: 4,
            name: "Enseignant",
            access: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        },
        {
            id: 5,
            name: "Observateur",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 6,
            name: "Administrateur Test 1",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 7,
            name: "Administrateur Test 2",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 8,
            name: "Administrateur Test 3",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 9,
            name: "Administrateur Test 4",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 10,
            name: "Administrateur Test 5",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 11,
            name: "Administrateur Test 6",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        },
        {
            id: 12,
            name: "Administrateur Test 7",
            access: [1, 2, 3, 4, 9, 10, 11, 12]
        }
    ]
};


export const mockUpAccess = {
    "access": [
        {
            id: 1,
            name: "Login",
        },
        {
            id: 2,
            name: "Logout",
        },
        {
            id: 3,
            name: "Lecture table BCC",
        },
        {
            id: 4,
            name: "Écriture table BCC",
        },
        {
            id: 5,
            name: "Suppression table BCC",
        },
        {
            id: 6,
            name: "Création table BCC",
        },
        {
            id: 7,
            name: "Lecture table XYZ",
        },
        {
            id: 8,
            name: "Écriture table XYZ",
        },
        {
            id: 9,
            name: "Suppression table XYZ",
        },
        {
            id: 10,
            name: "Création table XYZ",
        },
        {
            id: 11,
            name: "Lecture table Competence",
        },
        {
            id: 12,
            name: "Écriture table Competence",
        },
        {
            id: 13,
            name: "Suppression table Competence",
        },
        {
            id: 14,
            name: "Création table Competence",
        }
    ]
};