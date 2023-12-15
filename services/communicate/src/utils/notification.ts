import { TwilioService } from "../twilio/init";
import Expo, { ExpoPushMessage } from "expo-server-sdk";

//factory-method
interface Engine {
    send(body: string, title: string, to: string): Promise<void>
}
interface INotification {
    setBody(body: string): void;
    setTile(title: string): void;
    setTo(to: string): void;
    send(): Promise<void>
}


class NotificationImpl implements INotification {
    private body: string = "";
    private title: string = "";
    private to: string = "";
    private engine: Engine;
    constructor(engine: Engine) {
        this.engine = engine;
    }
    setBody(body: string) {
        this.body = body;
    }
    setTile(title: string) {
        this.title = title;
    }
    setTo(to: string) {
        this.to = to;
    }
    async send() {
        this.engine.send(this.body, this.title, this.to);
    }

}

class SMSEngine implements Engine {
    private twilioService: TwilioService;
    constructor(service: TwilioService) {
        this.twilioService = service;
    }
    async send(body: string, title: string, to: string) {
        try {
            const msg = await this.twilioService.sendSMS(to, body)
            console.log(msg.toJSON());

        } catch (error) {
            console.log("Error sms notification: ", error);
            throw error;
        }
    }
}

class ExpoEngine implements Engine {
    private expoService: Expo;
    constructor(service: any) {
        this.expoService = service;
    }
    async send(body: string, title: string, to: string) {
        try {
            const messages: ExpoPushMessage[] = [{
                to: to,
                sound: "default",
                body,
                title,
            }];
            await this.expoService.sendPushNotificationsAsync(messages);
        } catch (error) {
            console.log("Error expo notification: ", error);
            throw error;
        }
    }
}

export class NotificationFactory {
    static createNotification(type: "sms" |"expo", service: any): INotification {
        switch (type) {
            case "sms":
                return new NotificationImpl(new SMSEngine(service));
            case "expo":
                return new NotificationImpl(new ExpoEngine(service));
            default:
                throw new Error("Invalid notification type");
        }
    }
}