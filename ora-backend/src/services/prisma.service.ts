import { Prisma, PrismaClient } from '@prisma/client';
import { getParamsOfRequestResponse, Parser } from './parser.service';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../configs/logger';
import { time } from 'console';

type ModelName = keyof PrismaClient;
// type ModelDelegate = PrismaClient[ModelName];

const prisma = new PrismaClient();

export function getModel(baseRoute: string): any {
    return prisma[baseRoute as ModelName] as any
}

export function isPrismaEntity(entity: string): boolean {
    return entity in prisma
}

export function getEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    return new Promise((resolve, reject) => {
        let include = {};
        if(reqParams.getParams) {
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
        const opt = {
            where: {},
            include: {}
        } as any
        const paramObject = Parser.transformObject(reqParams.getParams)
        // console.log(JSON.stringify(Parser.transformObject(reqParams.getParams)))
        if(Object.keys(reqParams.getParams).length > 0) {
            for(const param in reqParams.getParams) {
                if(param.includes('where')) {
                    opt.where = paramObject.where ?? {}
                }
                if(param.includes('include')){
                    opt.include = paramObject.include ?? {}
                    // const includes = param.split('[')[1].split(']')[0]
                    // opt.include[includes] = (reqParams.getParams[param] === "true") ? true : false
                }
            }
        }
        console.log(opt)
        if (isFieldExist(model, 'deleted_at')) {
            opt.where.deleted_at = null;
        }
        model.findMany(opt).then((data: any) => {
            resolve(data)
        })
        .catch((error: any) => {
            reject(error)
        })
    })
}

export function createEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    return model.create({ data: reqParams.postParams })
}

export function updateEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    // remove id from postParams
    delete reqParams.postParams.id;
    
    return model.update({
        where: {
            id: parseInt(reqParams.urlParams[0])
        },
        data: reqParams.postParams
    })
}

export function deleteEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    
    // if model has a property deleted_at, we archive the entity instead of deleting it
    console.log(isFieldExist(model, 'deleted_at'))
    if (isFieldExist(model, 'deleted_at')) {
        return archiveEntity(model, reqParams);
    }else {
        return model.delete({
            where: {
                id: parseInt(reqParams.urlParams[0])
            }
        })
    }
}

// Do we need it ?
export function archiveEntity(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
        return model.update({
            where: {
                id: parseInt(reqParams.urlParams[0])
            },
            data: {
                // What property should be updated to archive the entity?
                deleted_at: new Date()
            }
        })
}

function isFieldExist(model: any, fieldToFind: string): boolean {
    const prismaModels = Prisma.dmmf.datamodel.models;
    for (const mod of prismaModels) {
        const modelName = mod.name as string;
        if (modelName === model.name) {
            for (const field of mod.fields) {
                const fieldName = field.name as string;
                if (fieldName === fieldToFind) {
                    return true;
                }
            }
        }
    }
    return false
}

function normalizeProperties(reqParams: getParamsOfRequestResponse): Record<string, string> {
    // const model = prisma.dm
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
        } else {
            // handlePrismaError(new Error(`Property ${key} not found in entity ${reqParams.baseRoute}.`), req, res, next);
        }
    }
    const properties: Record<string, string> = {};
    return properties;
}

// Custom handler for Prisma errors ?
function handlePrismaError(error: any, req: Request, res: Response, next: NextFunction) {
    logger.error(`Prisma`,error);
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