const { Client, GatewayIntentBits, ActivityType, Events } = require('discord.js');

// Configuración
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GIVEAWAY_VOICE_CHANNEL = '1476392918364192778';
const ANNOUNCEMENT_CHANNEL = '1475908192436228146';

// Crear cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Cuando el bot está listo
client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot conectado como ${c.user.tag}`);
  console.log(`📊 Servidores: ${c.guilds.cache.size}`);
  
  // Establecer estado del bot
  client.user.setActivity('Sorteos en vivo 🎁', { type: ActivityType.Watching });
  
  // Actualizar estado cada 5 minutos
  setInterval(() => {
    const channel = client.channels.cache.get(GIVEAWAY_VOICE_CHANNEL);
    const memberCount = channel?.members?.size || 0;
    
    if (memberCount > 0) {
      client.user.setActivity(`${memberCount} participantes 🎰`, { type: ActivityType.Watching });
    } else {
      client.user.setActivity('Sorteos en vivo 🎁', { type: ActivityType.Watching });
    }
  }, 5 * 60 * 1000);
});

// Cuando alguien entra/sale del canal de voz
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  const joinedGiveawayChannel = !oldState.channelId && newState.channelId === GIVEAWAY_VOICE_CHANNEL;
  const leftGiveawayChannel = oldState.channelId === GIVEAWAY_VOICE_CHANNEL && newState.channelId !== GIVEAWAY_VOICE_CHANNEL;
  
  if (joinedGiveawayChannel) {
    const member = newState.member;
    console.log(`🎯 ${member.displayName} se unió al canal de sorteos`);
    
    // Actualizar estado del bot
    const channel = client.channels.cache.get(GIVEAWAY_VOICE_CHANNEL);
    const memberCount = channel?.members?.size || 0;
    client.user.setActivity(`${memberCount} participantes 🎰`, { type: ActivityType.Watching });
  }
  
  if (leftGiveawayChannel) {
    const member = oldState.member;
    console.log(`👋 ${member.displayName} salió del canal de sorteos`);
    
    // Actualizar estado del bot
    const channel = client.channels.cache.get(GIVEAWAY_VOICE_CHANNEL);
    const memberCount = channel?.members?.size || 0;
    
    if (memberCount > 0) {
      client.user.setActivity(`${memberCount} participantes 🎰`, { type: ActivityType.Watching });
    } else {
      client.user.setActivity('Sorteos en vivo 🎁', { type: ActivityType.Watching });
    }
  }
});

// Manejo de errores
client.on('error', (error) => {
  console.error('❌ Error del bot:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
});

// Conectar el bot
if (!TOKEN) {
  console.error('❌ ERROR: No se encontró DISCORD_BOT_TOKEN');
  console.error('Por favor configura la variable de entorno DISCORD_BOT_TOKEN');
  process.exit(1);
}

client.login(TOKEN)
  .then(() => console.log('🚀 Iniciando conexión...'))
  .catch((err) => {
    console.error('❌ Error al conectar:', err);
    process.exit(1);
  });
