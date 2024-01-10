import ErrorCodes from "../errorHandler/enums.js";

export default (err, req, res, next) => {


    switch (err.code) {
        case ErrorCodes.INVALID_PARAMS:
            res.status(400).send({status: 'err', err: err});
            break;
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({status: 'err', err: err});
            break;
        default:
            res.status(500).send({status: 'err', err: 'Unhandled err'});
}
}