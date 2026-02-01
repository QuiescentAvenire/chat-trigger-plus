// scripts/chat-trigger.js

Hooks.once('init', () => {
  console.log('Chat Trigger | init');

  Hooks.on('createChatMessage', async (message) => {

    // Only proceed on roll messages
    if (!message.isRoll) return;

    // Grab the first Roll instance (v12+)
    const [roll] = message.rolls;
    if (!roll) return;

    // Find the d20 DiceTerm
    const d20Term = roll.terms.find(t => t.faces === 20 && t.results?.length);
    if (!d20Term) return;

    // ——— Resolve the kept d20 face value (nat logic) ———
    let kept = d20Term.results.filter(r => r.active === true);

    if (kept.length === 0) {
      // Fallback for older Foundry discard logic
      kept = d20Term.results.filter(r => r.discarded === false);
    }

    if (kept.length === 0) {
      kept = d20Term.results;
    }

    const dieValue = kept.reduce((sum, r) => sum + r.result, 0);
    const totalValue = roll.total;

    console.log(
      'Chat Trigger | d20 face:',
      dieValue,
      '| roll total:',
      totalValue
    );
    // ————————————————————————————————————————————————

    // Resolve the speaker’s Actor
    const speakerActor = ChatMessage.getSpeakerActor(message.speaker);
    if (!speakerActor) return;

    // Find their Token on the canvas
    const token =
      canvas.tokens.get(message.speaker.token) ??
      canvas.tokens.placeables.find(t => t.actor?.id === speakerActor.id);

    if (!token) return;

    // Load your configured triggers
    const triggers = game.settings.get('chat-trigger', 'triggers') || [];
    console.log('Chat Trigger | Loaded triggers:', triggers);

    // Check each trigger and fire when actor + TOTAL meets threshold
    let triggered = false;

    for (const t of triggers) {
      if (triggered) break;
      if (t.actorId !== speakerActor.id) continue;

      const threshold = Number(t.triggerValue);
      if (Number.isNaN(threshold)) continue;

      // 🔥 CHANGE: dice + modifiers >= triggerValue
      if (totalValue < threshold) continue;

      console.log(
        `Chat Trigger | Trigger match! Actor=${speakerActor.name} ` +
        `Die=${dieValue} Total=${totalValue} Threshold=${threshold}`
      );

      // Play an animation if provided
      if (t.filePath) {
        new Sequence()
          .effect()
            .file(t.filePath)
            .atLocation(token)
          .play();
      }

      // Execute a Macro if provided
      if (t.macroId) {
        const macro = game.macros.get(t.macroId);
        if (macro) {
          await macro.execute(speakerActor, token, totalValue, dieValue);
        } else {
          ui.notifications.warn(
            `Chat Trigger | Macro ${t.macroId} not found`
          );
        }
      }

      triggered = true;
    }
  });
});

Hooks.once('ready', () => {
  console.log(
    `Chat Trigger | ready (Foundry v${game.version}, Sequencer v${game.modules.get('sequencer')?.version ?? 'N/A'})`
  );
});
