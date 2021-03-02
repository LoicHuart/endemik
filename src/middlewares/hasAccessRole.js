const EmployeeSchema = require("../models/Employee");

const hasAccessRole = (AuthorizedRole) => {
    return async (req, res, next) => {
        let matchRole = false;
        await AuthorizedRole.forEach(role => {
            if(role == req.employee.id_role.name) {
                matchRole = true;
            }
        });
        if(matchRole == true) {
            next();
        } else {
            res.status(401).send({
                message: "Unauthorised role"
            });
        }
    }
};

module.exports = hasAccessRole;