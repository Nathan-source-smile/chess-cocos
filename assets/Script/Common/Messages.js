var MESSAGE_TYPE = {
  // Messages from Server to Client
  SC_START_GAME: "SC_START_GAME",
  SC_DRAW_BOARD: "SC_DRAW_BOARD",
  SC_ASK_PLAYER: "SC_ASK_PLAYER",
  SC_END_GAME: "SC_END_GAME",

  // Messsages from Client to Server
  CS_CLAIM_PASS: "CS_CLAIM_PASS",
  CS_RESTART_GAME: "CS_RESTART_GAME",
};

module.exports = MESSAGE_TYPE;