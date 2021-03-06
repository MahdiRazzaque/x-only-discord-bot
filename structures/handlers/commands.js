const { Perms } = require("../validation/permissions");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Command Loaded");

  CommandsArray = [];

  (await PG(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missing a name.");

    if (!command.type && !command.description)
      return Table.addRow(command.name, "🔸 FAILED", "Missing a description.");

    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else
        return Table.addRow(
          command.name,
          "🔸 FAILED",
          "Permission is invalid."
        );
    }

    client.commands.set(command.name, command);
    CommandsArray.push(command);

    if (!command.usage) {
      Table.addRow(command.name, "🔔 WARNING", "Missing a usage");
    } else {
      await Table.addRow(command.name, "🔹 SUCCESSFUL");
    }
  });

  console.log(Table.toString());

  // PERMISSIONS CHECK //
  client.on("ready", async () => {
    const MainGuild = await client.guilds.cache.get("883848283536101396");

    MainGuild.commands.set(CommandsArray).then(async (command) => {
      const Roles = (commandName) => {
        const cmdPerms = CommandsArray.find(
          (c) => c.name === commandName
        ).permission;
        if (!cmdPerms) return null;

        return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
      };

      const fullPermissions = command.reduce((accumulator, r) => {
        const roles = Roles(r.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((a, r) => {
          return [...a, { id: r.id, type: "ROLE", permission: true }];
        }, []);

        return [...accumulator, { id: r.id, permissions }];
      }, []);

      await MainGuild.commands.permissions.set({ fullPermissions });
    });
  });
};
