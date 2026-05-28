import AstalCava from "gi://AstalCava";
import { createState } from "ags";
import GLib from "gi://GLib";

const blocks = [
  "\u2581",
  "\u2582",
  "\u2583",
  "\u2584",
  "\u2585",
  "\u2586",
  "\u2587",
  "\u2588",
];

const checkTimer = 10 * 1000;
const CAVA_BARS = 30;
const FPS = 120;
let isMusicPlaying = false;

export const CavaWidget = () => {
  const cava = AstalCava.get_default()!;

  cava.set_framerate(FPS);
  cava.set_bars(CAVA_BARS);

  const [visible, setVisible] = createState(false);
  const [visuals, setVisuals] = createState("");

  isMusicPlaying = !(cava.bars === 0 || cava.values.length === 0 || cava.values.every((v) => v < 0.001));

  GLib.timeout_add(GLib.PRIORITY_DEFAULT, checkTimer, () => {
    isMusicPlaying = !(cava.bars === 0 || cava.values.length === 0 || cava.values.every((v) => v < 0.001));
    return GLib.SOURCE_CONTINUE;
  });

  cava.connect("notify::values", ({ values }) => {
    if (isMusicPlaying) {
      setVisible(true);
      setVisuals(
        values
          .map(
            (val) => blocks[Math.min(Math.floor(val * 32), blocks.length - 1)],
          )
          .join(""),
      );
    } else {
      setVisible(false);
    }
  });

  return (
    <box cssName={"cava"} visible={visible}>
      <label label={visuals} />
    </box>
  );
};