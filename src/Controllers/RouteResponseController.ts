import {RouteResponse} from "../Interfaces/RouteResponse";
import {Response} from "express";


export class RouteResponseController implements RouteResponse {
    protected model: any;

    constructor(model: any) {
        this.model = model;
        this.init();
    }

    // @ts-ignore
    abstract init(): void;

    private sendResponse(res: Response, status: number, success: boolean, data?: any, message?: string) {
        return res.status(status).json({success, message, data})
    }


    protected handleSuccess(res: Response, data: any, message: string = "Success", status = 200) {
        return this.sendResponse(res, status, true, data, message);
    }

    protected handleError(res: Response, error: any, message: string = "An Error occurred: ", status = 500) {
        return this.sendResponse(res, status, false,null, message )
    }

}