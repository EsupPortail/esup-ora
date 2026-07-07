import nodemailer, { Transporter } from "nodemailer";
import { logger } from "../configs/logger";

interface MailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
}
export class MailService {
    private static instance: MailService;
    private transporter: Transporter;

    private readonly doNotSend: boolean;
    private readonly redirect: boolean;
    private readonly redirectTo: string | undefined;
    private readonly fromEmail: string;
    private readonly fromName: string;

    private constructor() {
        const host = process.env.SMTP_HOST || "localhost";
        const port = parseInt(process.env.SMTP_PORT || "1025", 10);
        const user = process.env.SMTP_USER || undefined;
        const password = process.env.SMTP_PASSWORD || undefined;
        const useSSL = process.env.SMTP_SSL === "true";
        const connectionClass = process.env.SMTP_CONNECTION_CLASS || "plain";

        this.doNotSend = process.env.SMTP_DO_NOT_SEND === "true";
        this.redirect = process.env.SMTP_REDIRECT === "true";
        this.redirectTo = process.env.SMTP_REDIRECT_TO || undefined;
        this.fromEmail = process.env.SMTP_FROM_EMAIL || "noreply@example.com";
        this.fromName = process.env.SMTP_FROM_NAME || "";

        let auth: { user: string; pass: string } | undefined = undefined;
        if (user && password) {
            auth = { user, pass: password };
        }

        if (useSSL) {
            // SSL/TLS direct connection (typically port 465)
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: true,
                auth,
            });
        } else if (connectionClass === "tls") {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: false,
                requireTLS: true,
                auth,
            });
        } else {
            // Plain connection, no encryption (dev/mailhog)
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: false,
                ...(auth && { auth }),
                connectionTimeout: 5000,
                socketTimeout: 5000,
            });
        }

        logger.info(
            `MailService initialized. SSL: ${useSSL}, ConnectionClass: ${connectionClass}, DoNotSend: ${this.doNotSend}, Redirect: ${this.redirect}`
        );
    }

    public static getInstance(): MailService {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }

    public async sendMail(options: MailOptions): Promise<void> {
        if (this.doNotSend) {
            logger.info(`[MailService] SMTP_DO_NOT_SEND is true. Mail not sent.`, {
                to: options.to,
                subject: options.subject,
            });
            return;
        }

        const from = this.fromName
            ? `"${this.fromName}" <${this.fromEmail}>`
            : this.fromEmail;

        let to = options.to;
        let cc = options.cc;
        let bcc = options.bcc;

        if (this.redirect) {
            if (!this.redirectTo) {
                logger.warn(
                    "[MailService] SMTP_REDIRECT is true but SMTP_REDIRECT_TO is not set. Mail not sent."
                );
                return;
            }
            logger.info(
                `[MailService] Redirecting mail from [${to}] to [${this.redirectTo}]`
            );
            to = this.redirectTo;
            cc = undefined;
            bcc = undefined;
        }

        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                cc,
                bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });
            logger.info(`[MailService] Mail sent successfully. MessageId: ${info.messageId}`);
        } catch (error) {
            logger.error(`[MailService] Failed to send mail.`, { error, to, subject: options.subject });
            throw error;
        }
    }

    public async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            logger.info("[MailService] SMTP connection verified successfully.");
            return true;
        } catch (error) {
            logger.error("[MailService] SMTP connection verification failed.", { error });
            return false;
        }
    }
}