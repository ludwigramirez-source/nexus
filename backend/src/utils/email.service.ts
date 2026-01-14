import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';
import logger from '../config/logger';

let transporter: Transporter | null = null;

// Initialize email transporter
const initializeTransporter = () => {
  if (!config.email.host || !config.email.user || !config.email.pass) {
    logger.warn('Email configuration incomplete. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

transporter = initializeTransporter();

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!transporter || !config.email.enableNotifications) {
    logger.debug('Email sending skipped (disabled or not configured)');
    return false;
  }

  try {
    const mailOptions = {
      from: config.email.from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${mailOptions.to}`);
    return true;
  } catch (error) {
    logger.error('Email sending error:', error);
    return false;
  }
};

/**
 * Send request status change notification
 */
export const sendRequestStatusNotification = async (
  request: {
    id: string;
    title: string;
    status: string;
    requestedBy: string;
  },
  assignedUsers: Array<{ email: string; name: string }>,
  changedBy: { name: string; email: string }
): Promise<void> => {
  const recipients = [
    ...assignedUsers.map(u => u.email),
    ...config.email.adminEmails,
  ].filter((email, index, self) => self.indexOf(email) === index); // unique emails

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📋 Estado de Solicitud Actualizado</h2>
        </div>
        <div class="content">
          <p><strong>${changedBy.name}</strong> cambió el estado de una solicitud:</p>
          
          <h3>${request.title}</h3>
          
          <p>
            <strong>ID:</strong> ${request.id}<br>
            <strong>Solicitado por:</strong> ${request.requestedBy}<br>
            <strong>Nuevo estado:</strong> <span class="status-badge">${request.status}</span>
          </p>

          <a href="${config.cors.origin}/request-management-center?id=${request.id}" class="button">
            Ver Solicitud
          </a>

          <div class="footer">
            <p>Esta es una notificación automática de IPTEGRA Nexus.</p>
            <p>Si no deseas recibir estas notificaciones, contacta al administrador.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipients,
    subject: `[IPTEGRA Nexus] Solicitud actualizada: ${request.title}`,
    html,
    text: `El estado de la solicitud "${request.title}" ha sido cambiado a ${request.status} por ${changedBy.name}.`,
  });
};

/**
 * Send request assignment notification
 */
export const sendRequestAssignmentNotification = async (
  request: {
    id: string;
    title: string;
    description: string;
    priority: string;
  },
  assignedUser: { email: string; name: string },
  assignedBy: { name: string }
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .priority-high { color: #EF4444; font-weight: bold; }
        .priority-critical { color: #DC2626; font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Nueva Solicitud Asignada</h2>
        </div>
        <div class="content">
          <p>Hola <strong>${assignedUser.name}</strong>,</p>
          
          <p><strong>${assignedBy.name}</strong> te ha asignado una nueva solicitud:</p>
          
          <h3>${request.title}</h3>
          <p>${request.description}</p>
          
          <p>
            <strong>ID:</strong> ${request.id}<br>
            <strong>Prioridad:</strong> <span class="priority-${request.priority.toLowerCase()}">${request.priority}</span>
          </p>

          <a href="${config.cors.origin}/request-management-center?id=${request.id}" class="button">
            Ver Detalles
          </a>

          <div class="footer">
            <p>Esta es una notificación automática de IPTEGRA Nexus.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: assignedUser.email,
    subject: `[IPTEGRA Nexus] Nueva solicitud asignada: ${request.title}`,
    html,
    text: `Se te ha asignado una nueva solicitud: "${request.title}". Prioridad: ${request.priority}.`,
  });
};

export default {
  sendEmail,
  sendRequestStatusNotification,
  sendRequestAssignmentNotification,
};
