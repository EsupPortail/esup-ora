import 'dotenv/config';
import inquirer from 'inquirer';
import { KeycloakService } from "../services/keycloak.service";
import { administrationController } from "../controllers/administration.controller";

async function run() {
    try {
        console.log("🔐 Connexion à Keycloak...");
        const auth = await KeycloakService.getToken();
        if (!auth.access_token) throw new Error("Impossible d'obtenir le token");

        const token = auth.access_token;

        // --- ÉTAPE 1 : Recherche de l'utilisateur ---
        const searchAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: "Entrez le username de l'utilisateur à rechercher :",
                validate: (input) => input.length > 0 || "Le nom d'utilisateur ne peut pas être vide."
            }
        ]);

        const user = await KeycloakService.getUserInformations(token, searchAnswer.username);

        if (!user || (Array.isArray(user) && user.length === 0)) {
            console.error("❌ Utilisateur non trouvé.");
            return;
        }

        const targetUser = Array.isArray(user) ? user[0] : user;

        console.log("\n--- INFOS UTILISATEUR ---");
        console.log(`Prénom/Nom : ${targetUser.firstName} ${targetUser.lastName}`);
        console.log(`Email      : ${targetUser.email}`);
        console.log(`EPPN       : ${targetUser.attributes?.eppn || 'N/A'}`);
        console.log(`ID         : ${targetUser.id}`);
        console.log("--------------------------\n");

        // --- ÉTAPE 2 : Récupération et Affichage des rôles ---
        console.log("⏳ Chargement des rôles disponibles...");
        const roles = await KeycloakService.getExistantsRoles(token).then(res => res.data);

        console.log("\n--- LISTE DES RÔLES DISPONIBLES ---");
        roles.forEach((r: any, index: number) => {
            // On affiche "1. nom_du_role"
            console.log(`${(index + 1).toString().padEnd(3)} | ${r.name}`);
        });
        console.log("------------------------------------\n");

        // --- ÉTAPE 3 : Choix par numéro et Confirmation ---
        const roleSelection = await inquirer.prompt([
            {
                type: 'input',
                name: 'index',
                message: "Entrez le NUMÉRO du rôle à attribuer :",
                validate: (input) => {
                    const num = parseInt(input);
                    return (num > 0 && num <= roles.length) || `Veuillez entrer un chiffre entre 1 et ${roles.length}`;
                }
            }
        ]);

        // On récupère l'objet rôle correspondant au numéro saisi
        const selectedRole = roles[parseInt(roleSelection.index) - 1];

        const confirmAnswer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                // Rappel du nom du rôle dans le message
                message: `Voulez-vous vraiment attribuer le rôle [${selectedRole.name}] ? Cela supprimera TOUS les rôles actuels de l'utilisateur.`,
                default: false
            }
        ]);

        if (confirmAnswer.confirm) {
            console.log(`⏳ Nettoyage des rôles actuels pour ${targetUser.username || targetUser.email}...`);
            
            // 1. Récupérer les rôles actuels
            const currentRoles = await KeycloakService.getRoleOfUser(token, targetUser.id);
            
            // 2. Suppression de l'existant
            if (currentRoles && currentRoles.length > 0) {
                await Promise.all(
                    roles.map(async (role: any) => 
                        await KeycloakService.removeRoleFromUser(token, targetUser.id, role.id)
                    )
                );
                console.log(`✅ ${currentRoles.length} ancien(s) rôle(s) supprimé(s).`);
            }

            // 3. Attribution du nouveau rôle
            console.log(`⏳ Attribution du rôle [${selectedRole.name}]...`);
            await KeycloakService.addRoleToUser(token, targetUser.id, selectedRole.id);
            
            console.log(`✨ Succès ! L'utilisateur possède désormais uniquement le rôle : ${selectedRole.name}`);
        } else {
            console.log("❌ Opération annulée.");
        }

        // --- ÉTAPE 4 : Déconnexion forcée (Optionnelle) ---
const logoutAnswer = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'forceLogout',
        message: `Voulez-vous forcer la déconnexion de l'utilisateur pour appliquer les changements immédiatement ?`,
        default: true
    }
]);

if (logoutAnswer.forceLogout) {
    console.log(`⏳ Révocation des sessions pour l'ID : ${targetUser.id}...`);
    // Note : on passe le token admin/service pour l'auth et l'ID de l'utilisateur cible
    await KeycloakService.revokeToken(token, targetUser.id);
    console.log(`✅ Sessions révoquées avec succès.`);
}

console.log(`\n✨ Opération terminée avec succès !`);

    } catch (error: any) {
        console.error("\n❌ Une erreur est survenue :");
        console.error(error.message);
    } finally {
        process.exit(0);
    }
}

run();