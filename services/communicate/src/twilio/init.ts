import twilioClient from "twilio";

export class TwilioService {
  private client: twilioClient.Twilio;
  constructor() {
    this.client = twilioClient(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
      {
        lazyLoading: true,
        logLevel: "debug",
      }
    );
  }
  async sendSMS(to: string, body: string) {
    try {
      const message = await this.client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      return message;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  getTwilioClient() {
    return this.client;
  }
}
