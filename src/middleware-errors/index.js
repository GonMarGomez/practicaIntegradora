import ErrorCodes from "../errorHandler/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            console.log('Soy el error')
            res.status(400).send({status: 'error', error: error.name});
            break;
        case ErrorCodes.INVALID_PARAM:
            console.log('Soy el error')
            res.status(400).send({status: 'error', error: error.name});
            break;
        default:
            console.log('Soy el error')
            res.status(500).send({status: 'error', error: 'Unhandled error'});
    }
}