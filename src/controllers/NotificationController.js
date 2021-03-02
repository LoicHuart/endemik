const nodemailer = require("nodemailer");
const HolidaySchema = require("../models/Holiday");
const EmployeeSchema = require("../models/Employee");
const date = new Date();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILER_EMAIL, 
        pass: process.env.MAILER_PASSWORD, 
    },
})

async function mailOptions(to, subject, html) {
    return {
        from: '"Endemik" <Endemik@Endemik.com>',
        to: to,
        subject: subject,
        html: html
    };
}

async function sendMail(to, subject, html) {
    transporter.sendMail(await mailOptions(to, subject, html), function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

var NotificationController = {

    async HolidayRequestStatusUpdateToEmployee(HolidayId) {
        Holiday = await HolidaySchema.findById(HolidayId).populate("id_requester_employee");

        let html = `<b>Le status de votre demande de congée du ${date.toLocaleDateString(Holiday.starting_date)} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${Holiday.status}</b>`;
        html += `<br>`;
        html += `Demande de congé :`;
        sendMail(Holiday.id_requester_employee.mail, "Votre demande de congée a changé de status", html)
    },

    async HolidayRequestStatusUpdateToManager(HolidayId) {
        Holiday = await HolidaySchema.findById(HolidayId).populate({
            path: 'id_requester_employee',
            populate: {
                path: 'id_service',
                populate: {
                    path: 'id_manager'
                }
            }
        });
        let html = `<b>Le status de votre demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(Holiday.starting_date)} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${Holiday.status}</b>`;
        html += `<br>`;
        html += `Demande de congé :`;
        sendMail(Holiday.id_requester_employee.id_service.id_manager.mail, `Le status de votre demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} a changé`, html);
    },

    async NewHolidayRequestToRh(HolidayId) {
        Holiday = await HolidaySchema.findById(HolidayId).populate(
            'id_requester_employee'
        );
        EmployeeServiceRH = await EmployeeSchema.find({id_service: process.env.ID_SERVICE_RH});

        RHMail = EmployeeServiceRH.map((RH) => {
            return RH.mail;
        });
        let html = `<b>Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(Holiday.starting_date)} au ${date.toLocaleDateString(Holiday.ending_date)} est en attente de validation</b>`;
        html += `<br>`;
        html += `Demande de congé :`;
        sendMail(RHMail, `Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`, html);
    },

    async NewHolidayRequestToManager(HolidayId) {
        Holiday = await HolidaySchema.findById(HolidayId).populate({
            path: 'id_requester_employee',
            populate: {
                path: 'id_service',
                populate: {
                    path: 'id_manager'
                }
            }
        });
        let html = `<b>Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(Holiday.starting_date)} au ${date.toLocaleDateString(Holiday.ending_date)} est en attente de validation</b>`;
        html += `<br>`;
        html += `Demande de congé :`;
        sendMail(Holiday.id_requester_employee.id_service.id_manager.mail, `Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`, html);
    },

    async NewEmployeetoServiceToManager(EmployeeId) {
        Employee = await EmployeeSchema.findById(EmployeeId).populate({
            path: 'id_service',
            populate: {
                path: 'id_manager'
            }
        });
        let html = `<b>${Employee.lastName} ${Employee.firstName} vient de rejoindre votre service</b>`;
        sendMail(Employee.id_service.id_manager.mail, `${Employee.lastName} ${Employee.firstName} viens de rejoindre votre service`, html);
    },

    async NewEmployeeRegistedToDirection(EmployeeId) {
        Employee = await EmployeeSchema.findById(EmployeeId).populate({
            path: 'id_service',
            populate: {
                path: 'id_manager'
            }
        });
        EmployeeServiceDirection = await EmployeeSchema.find({id_service: process.env.ID_SERVICE_DIRECTION});
        DirectionMail = EmployeeServiceDirection.map((direction) => {
            return direction.mail;
        });
        let html = `<b>Un nouvel employé vient d'etre créé, ${Employee.lastName} ${Employee.firstName}, il rejoint le service ${Employee.id_service.name} manager par ${Employee.id_service.id_manager.lastName} ${Employee.id_service.id_manager.firstName}</b>`;
        sendMail(DirectionMail, `Un nouvelle employé viens d'etre créé, ${Employee.lastName} ${Employee.firstName}`, html);
    },

    async ForgotPassword(EmployeeId) {
        Employee = await EmployeeSchema.findById(EmployeeId).populate();

        

        let html = `<b>Bonjour ${Employee.firstName},`;
        html += `<br>`;
        html += `Voici le lien de réinitialisation de votre mot de passe : `;
        //faire un formulaire de réinitialisation de mot de passe 
        sendMail(EmployeeId, "Mot de passe oublié", html)
    }
};

module.exports = NotificationController;
