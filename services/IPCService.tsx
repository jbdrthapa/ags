import GObject from "gi://GObject";
import app from "ags/gtk4/app"
import { AppListing } from "../widget/modules-left/AppListing"

const IPCServiceProperties = {

};

class InternalIPCService extends GObject.Object {
    static instance: InternalIPCService;
    static get_default() {
        if (!this.instance) this.instance = new InternalIPCService();
        return this.instance;
    }

    constructor() {
        super();

        let appListing = AppListing();

        app.connect("request", (app, request, response) => {
            const command = request[0];

            switch (command) {
                case "launch-apps":
                    appListing.toggle();
                    response("Launching apps");
                    break;

                default:
                    response(`ERROR: Unknown request command '${command}'`);
                    break;
            }
        });

    }
}

const IPCService = GObject.registerClass({ Properties: IPCServiceProperties, }, InternalIPCService);

export default IPCService;