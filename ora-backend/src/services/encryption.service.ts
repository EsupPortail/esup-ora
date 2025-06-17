import bcrypt from 'bcrypt';

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe:', error);
        throw error;
    }
}

export {
    hashPassword
};
