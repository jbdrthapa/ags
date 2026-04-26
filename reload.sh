#!/bin/bash

env GDK_BACKEND=wayland ags quit 2>/dev/null; ags run

# & disown