const nodemailer = require("nodemailer");
const HolidaySchema = require("../models/Holiday");
const EmployeeSchema = require("../models/Employee");
const Employee = require("../models/Employee");
const { populate } = require("../models/Holiday");
const date = new Date();
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

transporter.use('compile', hbs({
    viewEngine: 'express_handlebars',
    viewPath: './templateMail/'
}));

async function mailOptions(to, subject, html) {
  return {
    from: '"Endemik" <Endemik@Endemik.com>',
    to: to,
    subject: subject,
      html: html,
      attachments: [
          { filename: 'picture.JPG', path: './picutre.JPG' }
      ],
      template: 'index'
  };
}

/*transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log('Error : ', err);
    } else {
        console.log('Message sent');
    }
})*/

async function sendMail(to, subject, html) {
  transporter.sendMail(
    await mailOptions(to, subject, html),
    function (err, info) {
      if (err) {
        console.log("Error when sending a mail");
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

var NotificationController = {
  async HolidayRequestStatusUpdateToEmployee(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate(
      "id_requester_employee"
    );

    let html = `<b>Le status de votre demande de congé du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${
      Holiday.status
    }</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.mail,
      "Votre demande de congé a changé de status",
      html
    );
  },

  async HolidayRequestStatusUpdateToManager(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate({
      path: "id_requester_employee",
      populate: {
        path: "id_service",
        populate: {
          path: "id_manager",
        },
      },
    });
    let html = `<b>Le status de votre demande de congé de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${
      Holiday.status
    }</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Le status de votre demande de congé de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} a changé`,
      html
    );
  },

  async NewHolidayRequestToRh(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate(
      "id_requester_employee"
    );
    EmployeeServiceRH = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_RH,
    });

    RHMail = await EmployeeServiceRH.map((RH) => {
      return RH.mail;
    });
    let html = `<b>Une nouvelle demande de congé de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      RHMail,
      `Une nouvelle demande de congé de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`,
      html
    );
  },

  async NewHolidayRequestToManager(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate({
      path: "id_requester_employee",
      populate: {
        path: "id_service",
        populate: {
          path: "id_manager",
        },
      },
    });
    let html = `<b>Une nouvelle demande de congé de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Une nouvelle demande de congé de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`,
      html
    );
  },

  async NewEmployeetoServiceToManager(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    let html = `<b>${Employee.lastName} ${Employee.firstName} vient de rejoindre votre service</b>`;
    sendMail(
      Employee.id_service.id_manager.mail,
      `${Employee.lastName} ${Employee.firstName} vient de rejoindre votre service`,
      html
    );
  },

  async NewEmployeetoEmployee(EmployeeId, password) {
    let Employee = await EmployeeSchema.findById(EmployeeId);
    let html = `Voici les principales informations concernant votre compte :</br>`;

    sendMail(Employee.mail, `Votre compte a été crée !`, html);
  },

  async NewEmployeeRegistedToDirection(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    EmployeeServiceDirection = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_DIRECTION,
    });
    DirectionMail = EmployeeServiceDirection.map((direction) => {
      return direction.mail;
    });
    let html = `<b>Un nouvel employé vient d'etre créé, ${Employee.lastName} ${Employee.firstName}, il rejoint le service ${Employee.id_service.name} managé par ${Employee.id_service.id_manager.lastName} ${Employee.id_service.id_manager.firstName}</b>`;
    sendMail(
      DirectionMail,
      `Un nouvel employé vient d'etre créé, ${Employee.lastName} ${Employee.firstName}`,
      html
    );
  },

  async HolidayRequestStatusUpdateToEmployee(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate(
      "id_requester_employee"
    );

    let html = `<b>Le status de votre demande de congé du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${
      Holiday.status
    }</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.mail,
      "Votre demande de congé a changé de status",
      html
    );
  },

  async HolidayRequestStatusUpdateToManager(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate({
      path: "id_requester_employee",
      populate: {
        path: "id_service",
        populate: {
          path: "id_manager",
        },
      },
    });
    let html = `<b>Le status de votre demande de congé de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de status: ${
      Holiday.status
    }</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Le status de votre demande de congé de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} a changé`,
      html
    );
  },

  async NewHolidayRequestToRh(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate(
      "id_requester_employee"
    );
    EmployeeServiceRH = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_RH,
    });

    RHMail = await EmployeeServiceRH.map((RH) => {
      return RH.mail;
    });
    let html = `<b>Une nouvelle demande de congé de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      RHMail,
      `Une nouvelle demande de congé de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`,
      html
    );
  },

  async NewHolidayRequestToManager(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate({
      path: "id_requester_employee",
      populate: {
        path: "id_service",
        populate: {
          path: "id_manager",
        },
      },
    });
    let html = `<b>Une nouvelle demande de congée de ${
      Holiday.id_requester_employee.lastName
    } ${Holiday.id_requester_employee.firstName} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation</b>`;
    html += `<br>`;
    html += `Demande de congé :`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${Holiday.id_requester_employee.firstName} est en attente de validation`,
      html
    );
  },

  async NewEmployeetoServiceToManager(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    let html = `<b>${Employee.lastName} ${Employee.firstName} vient de rejoindre votre service</b>`;
    sendMail(
      Employee.id_service.id_manager.mail,
      `${Employee.lastName} ${Employee.firstName} vient de rejoindre votre service`,
      html
    );
  },

  async NewEmployeeRegistedToDirection(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    EmployeeServiceDirection = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_DIRECTION,
    });
    DirectionMail = EmployeeServiceDirection.map((direction) => {
      return direction.mail;
    });
    let html = `<b>Un nouvel employé vient d'etre créé, ${Employee.lastName} ${Employee.firstName}, il vient de rejoindre le service ${Employee.id_service.name} managé par ${Employee.id_service.id_manager.lastName} ${Employee.id_service.id_manager.firstName}</b>`;
    sendMail(
      DirectionMail,
      `Un nouvel employé vient d'etre créé, ${Employee.lastName} ${Employee.firstName}`,
      html
    );
  },

  async ForgotPasswordToDirection(req, res) {
    EmployeeServiceDirection = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_DIRECTION,
    });
    DirectionMail = EmployeeServiceDirection.map((direction) => {
      return direction.mail;
    });
    let Employee = await EmployeeSchema.findOne({ mail: req.params.mail });
    if (!Employee) {
      res.status(400).send({
        message: "Error when send ForgotPassword",
        error: "Invalid employee mail",
      });
      res.end();
    } else {
      let html = `<b>L'employé ${Employee.lastName} ${Employee.firstName} a oublié son mot de passe</b>`;
      sendMail(
        DirectionMail,
        `L'employé ${Employee.lastName} ${Employee.firstName} a oublié son mot de passe`,
        html
      );
      res.send({
        message: "mail has been send to direction",
      });
    }
  },

  async ForgotPasswordToEmployee(EmployeeId, password) {
    let Employee = await EmployeeSchema.findById(EmployeeId);
    console.log(Employee);
    let html = `<b>Bonjour ${Employee.firstName},</b>`;
    html += `<b>Voici votre nouveau mot de passe : </b>`;
    html += `<b>${password}</b>`;
    html += `<b>Bonne journée,</b> </b>La Direction`;
    sendMail(
      Employee.mail,
      `${Employee.firstName}, voici votre nouveau mot de passe`,
      html
    );
  },
};

module.exports = NotificationController;
