import type { Request,Response,RequestHandler,NextFunction } from "express"
const asyncHandler=(handler:RequestHandler):RequestHandler=>
{
    return async(req:Request,res:Response,next:NextFunction)=>
    {
      try {
        await handler(req,res,next)
      } catch (error:any) {
       return res.status(501).json({
         message:error.message
       })
      }  
    }
}
export default asyncHandler