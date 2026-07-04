import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding, createComputed } from "gnim";
import AstalBattery from "gi://AstalBattery?version=0.1";
import Utils from "../../utils";

export function PowerSettings() {

    const ab = AstalBattery.get_default();

    

    return (

        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Power Settings" halign={Gtk.Align.START} cssName="section-heading" />


        </box >

    );
}


