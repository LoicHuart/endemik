const nodemailer = require("nodemailer");
const HolidaySchema = require("../models/Holiday");
const EmployeeSchema = require("../models/Employee");
const { populate } = require("../models/Holiday");
const date = new Date();
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs");

///

///

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

async function mailOptions(to, subject, html) {
  return {
    from: '"Endemik" <Endemik@Endemik.com>',
    to: to,
    subject: subject,
    html: html,
  };
}

async function sendMail(to, subject, headerHtml, bodyHtml, footerHtml) {
  const filePath = path.join(__dirname, "../templateMail/index.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = hbs.compile(source);

  const replacements = {
    header: headerHtml,
    body: bodyHtml,
    footer: footerHtml,
  };

  const htmlToSend = template(replacements);

  transporter.sendMail(
    await mailOptions(to, subject, htmlToSend),
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

    let header = `Le statut de votre demande de congé a changé`;
    let body = `Votre demande de congé du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} a changé de status : ${Holiday.status}.`;
    let footer = `La Direction`;
    sendMail(
      Holiday.id_requester_employee.mail,
      "Votre demande de congé a changé de statut !",
      header,
      body,
      footer
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
    let firstname = Holiday.id_requester_employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `Le statut de la demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName} a changé`;
    let body = `La demande de congé de ${firstname} ${
      Holiday.id_requester_employee.lastName
    } du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(Holiday.ending_date)} a changé de statut: ${
      Holiday.status
    }.`;
    let footer = `La Direction`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Le statut de la demande de congé de ${Holiday.id_requester_employee.lastName} !` +
        firstname +
        ` a changé`,
      header,
      body,
      footer
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
    let firstname = Holiday.id_requester_employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `Une nouvelle demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName}`;
    let body = `Une nouvelle demande de congé de ${firstname} ${
      Holiday.id_requester_employee.lastName
    } du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation.`;
    let footer = `La Direction`;
    sendMail(
      RHMail,
      `Une nouvelle demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName} est en attente de validation ! `,
      header,
      body,
      footer
    );
  },

  async NewEmployeetoServiceToManager(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    let firstname = Employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `${firstname} ${Employee.lastName} vient de rejoindre votre service`;
    let body = `${firstname} ${Employee.lastName}  vient de rejoindre votre service, souhaitez lui la bienvenue !`;
    let footer = `La Direction`;
    sendMail(
      Employee.id_service.id_manager.mail,
      `${firstname} ${Employee.lastName} vient de rejoindre votre service ! `,
      header,
      body,
      footer
    );
  },

  async NewEmployeeRegistedToEmployee(EmployeeId, password) {
    let Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });

    let firstname = Employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `Soyez la bienvenue !`;
    let body;
    body += `Voici les principales informations concernant votre compte :`;
    body += `Nom : ${Employee.lastName}`;
    //console.log(body);
    /*body += `Prénom : ${firstname}`;
    body += `Date de naissance : ${Employee.date_birth}`;
    body += `Numéro de téléphone : ${Employee.tel_nb}`;
    body += `Adresse mail : ${Employee.mail}`;
    body += `Mot de passe : ${password}`;
    body += `Adresse postale : ${Employee.street_nb} ${Employee.street}, ${Employee.city}`;
    body += `Numéro de sécurité sociale : ${Employee.social_security_number}`;
    body += `Service : ${Employee.id_service.name}`;
    body += `Manager : ${Employee.id_service.id_manager.firstName}`; */
    let footer = `La Direction`;
    sendMail(Employee.mail, `Votre compte a été crée !`, header, body, footer);
  },

  async NewEmployeeRegistedToDirection(EmployeeId) {
    Employee = await EmployeeSchema.findById(EmployeeId).populate({
      path: "id_service",
      populate: {
        path: "id_manager",
      },
    });
    let firstname = Employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let firstnameManager = Employee.id_service.id_manager.firstName;
    firstnameManager =
      firstnameManager.charAt(0).toUpperCase() +
      firstnameManager.substring(1).toLowerCase();
    EmployeeServiceDirection = await EmployeeSchema.find({
      id_service: process.env.ID_SERVICE_DIRECTION,
    });
    DirectionMail = EmployeeServiceDirection.map((direction) => {
      return direction.mail;
    });
    let header = `Un nouvel employé vient d'etre créé !`;
    let body = `Un nouvel employé vient d'etre créé, ${firstname} ${Employee.lastName}, il rejoint le service ${Employee.id_service.name} managé par ${firstnameManager} ${Employee.id_service.id_manager.lastName}.`;
    let footer = ``;
    sendMail(
      DirectionMail,
      `Un nouvel employé vient d'etre créé, ${firstname} ${Employee.lastName} !`,
      header,
      body,
      footer
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
    let firstname = Holiday.id_requester_employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `Nouvelle demande de congée !`;
    let body = `Une nouvelle demande de congée de ${
      Holiday.id_requester_employee.lastName
    } ${firstname} du ${date.toLocaleDateString(
      Holiday.starting_date
    )} au ${date.toLocaleDateString(
      Holiday.ending_date
    )} est en attente de validation.`;
    let footer = `La Direction`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${firstname} est en attente de validation !`,
      header,
      body,
      footer
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
    let firstname = Employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    if (!Employee) {
      res.status(400).send({
        message: "Error when send ForgotPassword",
        error: "Invalid employee mail",
      });
    } else {
      let header = `L'employé ${firstname} ${Employee.lastName}  a oublié son mot de passe`;
      sendMail(
        DirectionMail,
        `L'employé ${firstname} ${Employee.lastName} a oublié son mot de passe`,
        html
      );
      res.send({
        message: "mail has been send to direction",
      });
    }
  },

  async ForgotPasswordToEmployee(EmployeeId, password) {
    let Employee = await EmployeeSchema.findById(EmployeeId);
    let html = `Bonjour ${Employee.firstName},`;
    html += `Voici votre nouveau mot de passe : `;
    html += `${password}`;
    html += `Bonne journée, La Direction`;
    sendMail(
      Employee.mail,
      `${Employee.firstName}, voici votre nouveau mot de passe`,
      html
    );
  },
};

module.exports = NotificationController;
