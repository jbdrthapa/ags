import Gtk from "gi://Gtk?version=4.0";

export function PillWidget({
    title,
    detail,
    content,
}: {
    title: string;
    detail?: string;
    content: Gtk.Widget;
}) {

    const revealer = new Gtk.Revealer({
        reveal_child: false,
        transition_type: Gtk.RevealerTransitionType.SLIDE_DOWN,
    });

    const button = (
        <button cssName="pill-button">
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
                <image iconName="i" cssName="pill-button-image" />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label xalign={0} label={title} cssName="pill-button-name" />
                    {detail && (
                        <label xalign={0} label={detail} cssName="pill-button-detail" />
                    )}
                </box>
            </box>
        </button>
    ) as Gtk.Button;

    button.connect("clicked", () => {
        const current = revealer.get_reveal_child();
        revealer.set_reveal_child(!current);
    });

    revealer.set_child(content);

    return (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-container">
            {button}
            {revealer}
        </box>
    );
}
