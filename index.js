
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const path = require("path");
const config = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

const MP3_PATH = path.join(__dirname, config.MP3_NAME);
let lastNotifyTime = 0;

client.on("ready", () => {
    console.log(`🎉 ${client.user.tag} botu başarıyla çalışıyor.`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    if (!newState.channel || !config.TARGET_VOICE_CHANNEL_IDS.includes(newState.channel.id)) return;

    const currentTime = Date.now();
    if (currentTime - lastNotifyTime < 5000) return;

    const connection = joinVoiceChannel({
        channelId: newState.channel.id,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(MP3_PATH);

    player.play(resource);
    connection.subscribe(player);

    player.on("idle", async () => {
        connection.destroy();

        try {
            await newState.member.send("⚠ **Şu an müsait bir yetkili bulunmamaktadır.**");
        } catch (err) {
            console.log("DM gönderilemedi:", err.message);
        }

        if (newState.channel) {
            await newState.member.voice.disconnect();
        }
    });

    const logChannel = await client.channels.fetch(config.LOG_CHANNEL_ID);
    if (logChannel) {
        logChannel.send(`<@&${config.MOD_ROLE_ID}> ⚠ **${newState.member.user.tag}** belirlenen ses kanalına katıldı!`);
    }

    lastNotifyTime = currentTime;
});

client.login(config.TOKEN);
