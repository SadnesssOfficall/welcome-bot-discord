
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
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
let activeChannelId = null;

client.once("ready", () => {
    console.log(`🎉 ${client.user.tag} botu başarıyla çalışıyor.`);

    // Botun durumunu ayarla
    client.user.setPresence({
        activities: [{ name: config.STATUS_TEXT || "Sunucu Dinleniyor 🎧" }],
        status: config.STATUS_MODE || "online", // online, idle, dnd, invisible
    });
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (oldChannel && !newChannel && oldChannel.id === activeChannelId) {
        const connection = getVoiceConnection(oldChannel.guild.id);
        const membersLeft = oldChannel.members.filter(m => !m.user.bot);
        if (membersLeft.size === 0 && connection) {
            connection.destroy();
            activeChannelId = null;

            const logChannel = await client.channels.fetch(config.LOG_CHANNEL_ID);
            if (logChannel) {
                logChannel.send(`🔇 **Bot**, ses kanalında kimse kalmadığı için kanaldan ayrıldı.`);
            }
        }
        return;
    }

    if (!newChannel || !config.TARGET_VOICE_CHANNEL_IDS.includes(newChannel.id)) return;

    if (activeChannelId === newChannel.id) return;

    const currentTime = Date.now();
    if (currentTime - lastNotifyTime < 5000) return;

    const connection = joinVoiceChannel({
        channelId: newChannel.id,
        guildId: newChannel.guild.id,
        adapterCreator: newChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(MP3_PATH);

    player.play(resource);
    connection.subscribe(player);
    activeChannelId = newChannel.id;

    player.on(AudioPlayerStatus.Idle, async () => {
        if (connection) connection.destroy();
        activeChannelId = null;

        try {
            await newChannel.guild.members.fetch(newState.id)
                .then(member => member.send("⚠ **Şu an müsait bir yetkili bulunmamaktadır.**"))
                .catch(err => console.log("DM gönderilemedi:", err.message));
        } catch {}

        if (newChannel) {
            await newState.member.voice.disconnect().catch(() => {});
        }
    });

    const logChannel = await client.channels.fetch(config.LOG_CHANNEL_ID);
    if (logChannel) {
        logChannel.send(`<@&${config.MOD_ROLE_ID}> ⚠ **${newState.member.user.tag}** belirlenen ses kanalına katıldı!`);
    }

    lastNotifyTime = currentTime;
});

client.login(config.TOKEN);
