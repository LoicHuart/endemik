const nodemailer = require("nodemailer");
const HolidaySchema = require("../models/Holiday");
const EmployeeSchema = require("../models/Employee");
const { populate } = require("../models/Holiday");
const ServiceSchema = require("../models/Service");
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

async function sendMail(to, subject, headerHtml, bodyHtml, footerHtml, buttonHtml) {
  const filePath = path.join(__dirname, "../templateMail/index.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = hbs.compile(source);

  const replacements = {
    header: headerHtml,
    body: bodyHtml,
    button: buttonHtml,
    footer: footerHtml,
  };

  const htmlToSend = template(replacements);

  transporter.sendMail(
    await mailOptions(to, subject, htmlToSend),
    function (err, info) {
      if (err) {
        console.log("Error when sending a mail: "+ err);
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
    let body = [];
    body.push(
      `Votre demande de congé du ${date.toLocaleDateString(
        Holiday.starting_date
      )} au ${date.toLocaleDateString(
        Holiday.ending_date
      )} a changé de status : ${Holiday.status}.`
    );
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
    let body = [];
    body.push(
      `La demande de congé de ${firstname} ${
        Holiday.id_requester_employee.lastName
      } du ${date.toLocaleDateString(
        Holiday.starting_date
      )} au ${date.toLocaleDateString(
        Holiday.ending_date
      )} a changé de statut: ${Holiday.status}.`
    );

    let footer = `La Direction`;
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Le statut de la demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName} a changé`,
      header,
      body,
      footer
    );
  },

  async NewHolidayRequestToRh(HolidayId) {
    Holiday = await HolidaySchema.findById(HolidayId).populate(
      "id_requester_employee"
    );
    serviceRhId = await ServiceSchema.findOne({name: "rh"});
    EmployeeServiceRH = await EmployeeSchema.find({id_service: serviceRhId.id}).populate(
      "id_service"
    );
    RHMail = await EmployeeServiceRH.map((RH) => {
      return RH.mail;
    });
    let firstname = Holiday.id_requester_employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = `Une nouvelle demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName}`;
    let body = [];
    body.push(
      `Une nouvelle demande de congé de ${firstname} ${
        Holiday.id_requester_employee.lastName
      } du ${date.toLocaleDateString(
        Holiday.starting_date
      )} au ${date.toLocaleDateString(
        Holiday.ending_date
      )} est en attente de validation.`
    );
    let footer = `La Direction`;
    let button = []
    button.push({
      text: 'validée',
      url: `${process.env.URL_MAILLER}/api/holidays/status/validée/${HolidayId}`,
      color: '#15D636'
    })
    button.push({
      text: 'refusée',
      url: `${process.env.URL_MAILLER}/api/holidays/status/refusée/${HolidayId}`,
      color: '#FC4545'
    })
    sendMail(
      RHMail,
      `Une nouvelle demande de congé de ${firstname} ${Holiday.id_requester_employee.lastName} est en attente de validation ! `,
      header,
      body,
      footer,
      button
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
    let firstnameManager = Employee.id_service.id_manager.firstName;
    firstnameManager =
      firstnameManager.charAt(0).toUpperCase() +
      firstnameManager.substring(1).toLowerCase();
    let header = `${firstname} ${Employee.lastName} vient de rejoindre votre service`;
    let body = [];
    body.push(
      `${firstname} ${Employee.lastName} vient de rejoindre votre service, souhaitez lui la bienvenue !`
    );
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
    let firstnameManager = Employee.id_service.id_manager.firstName;
    firstnameManager =
      firstnameManager.charAt(0).toUpperCase() +
      firstnameManager.substring(1).toLowerCase();
    let city = Employee.city;
    city = city.charAt(0).toUpperCase() + city.substring(1).toLowerCase();
    let header = `Soyez la bienvenue !`;
    let body = [];
    body.push(`Voici les principales informations concernant votre compte :`);
    body.push(`Nom : ${Employee.lastName}`);
    body.push(`Prénom : ${firstname}`);
    body.push(`Date de naissance : ${Employee.date_birth}`);
    body.push(`Numéro de téléphone : ${Employee.tel_nb}`);
    body.push(`Adresse mail : ${Employee.mail}`);
    body.push(`Mot de passe : ${password}`);
    body.push(
      `Adresse postale : ${Employee.street_nb} ${Employee.street}, ${city}`
    );
    body.push(
      `Numéro de sécurité sociale : ${Employee.social_security_number}`
    );
    body.push(`Service : ${Employee.id_service.name}`);
    body.push(`Manageur : ${firstnameManager}`);
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
      id_service: serviceDirectionId.id,
    });
    DirectionMail = EmployeeServiceDirection.map((direction) => {
      return direction.mail;
    });
    let header = `Un nouvel employé vient d'etre créé !`;
    let body = [];
    body.push(
      `Un nouvel employé vient d'etre créé, ${firstname} ${Employee.lastName}, il rejoint le service ${Employee.id_service.name} managé par ${firstnameManager} ${Employee.id_service.id_manager.lastName}.`
    );
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
    let body = [];
    body.push(
      `Une nouvelle demande de congée de ${
        Holiday.id_requester_employee.lastName
      } ${firstname} du ${date.toLocaleDateString(
        Holiday.starting_date
      )} au ${date.toLocaleDateString(
        Holiday.ending_date
      )} est en attente de validation.`
    );
    let footer = `La Direction`;
    let button = []
    button.push({
      text: 'validée',
      url: `${process.env.URL_MAILLER}/api/holidays/status/validée/${HolidayId}`,
      color: '#15D636'
    })
    button.push({
      text: 'refusée',
      url: `${process.env.URL_MAILLER}/api/holidays/status/refusée/${HolidayId}`,
      color: '#FC4545'
    })
    sendMail(
      Holiday.id_requester_employee.id_service.id_manager.mail,
      `Une nouvelle demande de congée de ${Holiday.id_requester_employee.lastName} ${firstname} est en attente de validation !`,
      header,
      body,
      footer,
      button
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
      let header = `${firstname} a oublié son mot de passe, on a besoin de vous !`;
      let body = [];
      body.push(
        `L'employé ${firstname} ${Employee.lastName} a oublié son mot de passe`
      );
      let footer = `La Direction`;
      let button = []
      button.push({
        text: 'validée',
        url: `${process.env.URL_MAILLER}/api/holidays/status/validée/${HolidayId}`,
        color: '#15D636'
      })
      sendMail(
        DirectionMail,
        `L'employé ${firstname} ${Employee.lastName} a oublié son mot de passe`,
        header,
        body,
        footer,
        button
      );
      res.send({
        message: "mail has been send to direction",
      });
    }
  },

  async ForgotPasswordToEmployee(EmployeeId, password) {
    let Employee = await EmployeeSchema.findById(EmployeeId);
    let firstname = Employee.firstName;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase();
    let header = ``;
    let body = [];
    body.push(`Voici votre nouveau mot de passe : `);
    body.push(`${password}`);
    let footer = `La Direction`;
    sendMail(
      Employee.mail,
      `${firstname}, voici votre nouveau mot de passe`,
      header,
      body,
      footer
    );
  },
};

module.exports = NotificationController;
