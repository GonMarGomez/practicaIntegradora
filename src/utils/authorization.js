export const authorization = (role) =>{
    return async (req, res, next) =>{
        if(!req.user) return res.status(401).send({error:"Unauthorized"});
        if(req.user.role!=role) return res.status(403).send({error:"No permissions"});
        next();
    }
}
export const authorizationForRoles = (allowedRoles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send({ error: "No permissions" });
        }

        next();
    };
};