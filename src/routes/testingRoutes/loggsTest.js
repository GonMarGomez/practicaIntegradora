import { Router} from 'express';

const router = Router();

router.get('/', async (req, res) => {

    req.logger.debug('Este es un mensaje de depuración (debug)');
    req.logger.http('Este es un mensaje de HTTP');
    req.logger.info('Este es un mensaje de información (info)');
    req.logger.warning('Este es un mensaje de advertencia (warning)');
    req.logger.error('Este es un mensaje de error');
    req.logger.fatal('Este es un mensaje fatal');

    res.send('Registros generados en /loggerTest');
});

export default router;