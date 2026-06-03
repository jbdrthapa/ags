import GObject from "gi://GObject";
import app from "ags/gtk4/app"
import { WindowName } from "../constants";

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

        // Connect to the native Astal IPC request server
        app.connect("request", (app, request, response) => {
            // 1. Parse incoming text (Strings can be plain text or structured JSON)
            const command = request[0];

            switch (command) {
                case "launch-menu":

                    // Todo launch the menu window
                    app.get_window(WindowName.modulesLeft).show();
                    
                    response("SUCCESS: Launching menu");
                    break;

                default:
                    // Always return a failure fallback so the calling shell doesn't hang
                    response(`ERROR: Unknown custom command '${command}'`);
                    break;
            }
        });

    }
}

const IPCService = GObject.registerClass({ Properties: IPCServiceProperties, }, InternalIPCService);

export default IPCService;