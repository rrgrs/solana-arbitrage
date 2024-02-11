import * as nodemailer from 'nodemailer';
import { sendEmail } from './index';


jest.mock('../../env', () => ({
    smtpUsername: 'mockedUser',
    smtpPassword: 'mockedPass',
    smtpHost: 'mockedHost',
    smtpPort: 465,
    smtpFromEmail: 'test@email.com',
}))
jest.mock('nodemailer');

describe('sendEmail', () => {
    test('sends an email with specific options', async () => {
        const mockMsg = {
            toEmail: 'recipient@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
        };

        const mockTransportSendMail = jest.fn();

        jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
            sendMail: mockTransportSendMail,
        } as any);

        await sendEmail(mockMsg);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            pool: true,
            host: 'mockedHost',
            port: 465,
            secure: false,
            auth: { user: 'mockedUser', pass: 'mockedPass' },
        });

        expect(mockTransportSendMail).toHaveBeenCalledWith({
            from: 'test@email.com',
            to: mockMsg.toEmail,
            subject: mockMsg.subject,
            text: mockMsg.body,
        });
    });
});
