import { NextFunction, Request, Response } from "express";
import { Parser, getParamsOfRequestResponse } from "../services/parser.service";
import { getModel, createEntity, deleteEntity, getEntity, getEntityCollection, updateEntity, isPrismaEntity } from "../services/prisma.service";
import { logger } from "../configs/logger";

const excludedEntity : Array<string> = [];

export class entityController {

  static handleRoute(req: Request, res: Response, next: NextFunction) {
    const reqParams = Parser.getParamsOfRequest(req);
    const entity = reqParams.baseRoute;

    if (excludedEntity.includes(entity) || !isPrismaEntity(entity)) {
      return next()
    }
    const model = getModel(entity);
    
    entityController.dispatchRequest(model, reqParams)
    .then((data) => {
      return res.status(200).json({
        message: 'Success',
        data: data
      });
    })
    .catch((error) => {
      return entityController.dispatchError(error, req, res, next);
    })
  }

  static dispatchRequest(model: any, reqParams: getParamsOfRequestResponse): Promise<any> {
    console.log(reqParams)
    return new Promise(async (resolve, reject) => {
      try {
        let data = null;
        switch (reqParams.method) {
          case 'GET':
            if(reqParams.urlParams.length > 0) {
              data = await getEntity(model, reqParams);
            } else {
              data = await getEntityCollection(model, reqParams);
            }
            break;
          case 'POST':
            data = await createEntity(model, reqParams);
            break;
          case 'PUT':
            data = await updateEntity(model, reqParams);
            break;
          case 'DELETE':
            data = await deleteEntity(model, reqParams);
            break;
          default:
            return reject(new Error('Method not allowed'));
        }
        if (data) {
          return resolve(data);
        }else {
          return reject(new Error('No data found'));
        }
      }
      catch (error) {
        return reject(error);
      }
    })
  }

  static dispatchError(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error('Prisma Error',err);
    return res.status(400).json({
      message: err.message,
      error: err
    });
  }

  static async parametreWithElement(req: Request, res: Response, next: NextFunction) {
    const reqParams = Parser.getParamsOfRequest(req);

    const entity = 'parametre'
    const model = getModel(entity);

    const parameter_values = []
    for (const key in reqParams.postParams.parametre_values) {
      console.log(key, reqParams.postParams.parametre_values[key])
      parameter_values.push({
        value: reqParams.postParams.parametre_values[key],
        parametre_element: {
          connect: {
            id: parseInt(key)
          }
        }
      })
    }
    console.log(parameter_values)
    const parametre = {
      libelle: reqParams.postParams.libelle,
      parametre_values: {
        create: parameter_values
      }
    }
    reqParams.postParams = parametre
    console.log(parametre)

    const data = await createEntity(model, reqParams);
    if (data) {
      return res.status(200).json({
        message: 'Success',
        data: data
      });
    }else {
      return res.status(200).json({
        message: 'Heu',
        data: data
      });
    }
  }

}

