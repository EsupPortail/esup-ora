import { Pool } from 'pg';
import { Prisma, PrismaClient } from '../generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getParamsOfRequestResponse, Parser } from './parser.service';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../configs/logger';
import { time } from 'console';

type ModelName = keyof PrismaClient;

const pool = new Pool({ 
  connectionString: process.env.ORA_DATABASE_URL
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
let availableModels: string[] = [];

export const getAvailableModels = (): string[] => {
    if (availableModels.length > 0) return availableModels;
    
    availableModels = Object.keys(prisma).filter(
        (key) => !key.startsWith('$') && !key.startsWith('_')
    );
    return availableModels;
};

export function isPrismaEntity(entity: string): boolean {
    const models = getAvailableModels();
    return models.some(m => m.toLowerCase() === entity.toLowerCase());
}

export function getModel(baseRoute: string): any {
    const models = getAvailableModels();
    const modelKey = models.find(m => m.toLowerCase() === baseRoute.toLowerCase());
    return modelKey ? (prisma as any)[modelKey] : null;
}

export function getEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    return new Promise((resolve, reject) => {
        let include = {};
        if (reqParams.getParams) {
            const paramObject = Parser.transformObject(reqParams.getParams)
            if (paramObject.include) {
                include = paramObject.include;
            }
        }

        model.findUnique({
            where: {
                id: parseInt(reqParams.urlParams[0]),
            },
            include: include
        }).then((data: any) => {
            resolve(data)
        })
            .catch((error: any) => {
                reject(error)
            })

    })
}

export function getEntityCollection(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    return new Promise((resolve, reject) => {
        const paramObject = Parser.transformObject(reqParams.getParams);
        
        // Initialisation propre
        const opt: any = {
            where: paramObject.where || {},
            include: paramObject.include || {}
        };

        const modelName = reqParams.baseRoute; // ex: 'etablissement'
        
        // On ne rajoute le filtre que si le champ existe VRAIMENT
        if (isFieldExist(modelName, 'deleted_at')) {
            opt.where.deleted_at = null;
        }

        model.findMany(opt)
            .then(resolve)
            .catch(reject);
    });
}

export async function createEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    try {
        return await model.create({ data: reqParams.postParams });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error(
                'Un élément constitutif pour cet enseignement existe déjà dans cette période.'
            );
        }
        throw error;
    }
}

export function updateEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    delete reqParams.postParams.id;

    return model.update({
        where: {
            id: parseInt(reqParams.urlParams[0])
        },
        data: reqParams.postParams
    })
}

export function deleteEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    if (isFieldExist(model, 'deleted_at')) {
        return archiveEntity(model, reqParams);
    } else {
        return model.delete({
            where: {
                id: parseInt(reqParams.urlParams[0])
            }
        })
    }
}

export function archiveEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    return model.update({
        where: {
            id: parseInt(reqParams.urlParams[0])
        },
        data: {
            deleted_at: new Date()
        }
    })
}

/**
 * Vérifie si un champ existe dans le modèle
 * @param modelName Le nom du modèle (ex: 'User')
 * @param fieldToFind Le champ à chercher (ex: 'deleted_at')
 */
function isFieldExist(modelName: string, fieldToFind: string): boolean {
    const dmmf = (Prisma as any).dmmf || (prisma as any)._dmmf;
    if (!dmmf) return false;

    // Trouver le modèle en ignorant la casse
    const targetModel = dmmf.datamodel.models.find(
        (m: any) => m.name.toLowerCase() === modelName.toLowerCase()
    );

    if (!targetModel) {
        return false;
    }

    // Vérifier si le champ existe EXACTEMENT
    const exists = targetModel.fields.some((f: any) => f.name === fieldToFind);
    
    return exists;
}
function normalizeProperties(reqParams: getParamsOfRequestResponse): Record<string, string> {
    const model = getModel(reqParams.baseRoute)
    if (!model) {
        throw new Error(`Entity ${reqParams.baseRoute} not found in Prisma schema.`);
    }
    const normalizedProperties: Record<string, any> = {};

    for (const key in reqParams.getParams) {
        if (key in model.fields) {
            if (model.fields[key].type === 'Int') {
                normalizedProperties[key] = parseInt(reqParams.getParams[key]);
            } else {
                normalizedProperties[key] = reqParams.getParams[key];
            }
        }
    }
    const properties: Record<string, string> = {};
    return properties;
}

function handlePrismaError(error: any, req: Request, res: Response, next: NextFunction) {
    logger.error(`Prisma`, error);
    res.status(400).json({
        timestamp: time(),
        message: error.message,
        error: error
    });
}

export default {
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity
};