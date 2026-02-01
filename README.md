Triggered+

Triggered+ is a small, system-agnostic Foundry VTT module that watches the chat log and performs actions when configured d20 roll results occur.

Triggered+ can monitor d20 rolls made by actors and, when conditions are met, either:

play a Sequencer animation, or

execute a Macro

This module is a fork and extension of the original Triggered module, inspired by a Reddit post showcasing Persona 5–style critical hit animations on Natural 20s.

Unlike the original project, Triggered+ is actively maintained and updated to support modern Foundry versions (v12+), expanded trigger logic, and improved reliability.

Usage

Conceptually, Triggered+ follows a simple rule:

When X does Y, do Z

X → a Foundry VTT Actor

Y → rolling a d20 that meets or exceeds a configured value

Z → playing a Sequencer animation and/or executing a Macro

Triggers are configured from the module settings menu.

Roll Logic

Triggers evaluate the final roll total (die + modifiers)

The kept d20 face value is also exposed for macros

Only one trigger fires per roll

Animations

If you are using a .webm animation, the file path must be relative to Foundry’s Data/ directory (e.g. modules/, worlds/, or JB2A paths).

Notes

Requires the Sequencer module

Designed to be lightweight and system-agnostic

Compatible with Foundry VTT v12+ (verified v13)