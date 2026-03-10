require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('❌ Lipsesc DISCORD_TOKEN / CLIENT_ID / GUILD_ID în .env');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

/* =========================================================
   SANCTIUNI
========================================================= */

const PRINCIPALE = [
  { id: 'art1', label: 'Omorul', text: 'Art. 1 – Omorul\nSancțiune: $20.000 + 50 luni + cazier' },
  { id: 'art4', label: 'Lovirea', text: 'Art. 4 – Lovirea\nSancțiune: $2.500 + 15 luni + cazier' },
  { id: 'art5', label: 'Vătămare', text: 'Art. 5 – Vătămarea corporală\nSancțiune: $5.000 + 25 luni + cazier' },
  { id: 'art8', label: 'Lipsire libert.', text: 'Art. 8 – Lipsire de libertate\nSancțiune: $7.500 + 30 luni + cazier' },
  { id: 'art22', label: 'Furt', text: 'Art. 22 – Furt\nSancțiune: $7.500 + 30 luni + cazier' },
  { id: 'art23', label: 'Tâlhărie', text: 'Art. 23 – Tâlhărie\nSancțiune: $10.000 + 35 luni + cazier' },
  { id: 'art27', label: 'Jaf ostatic', text: 'Art. 27 – Jaf cu ostatic\nSancțiune: $15.000 + 30 luni + cazier' },
  { id: 'art28', label: 'Jaf armat', text: 'Art. 28 – Jaf armat\nSancțiune: $20.000 + 40 luni + cazier' },
  { id: 'art29', label: 'Spălare bani', text: 'Art. 29 – Spălare de bani\nSancțiune: $30.000 + 50 luni + cazier' },
  { id: 'art32', label: 'Refuz ID', text: 'Art. 32 – Refuz identificare\nSancțiune: $1.500 + 5 luni' },
  { id: 'art36', label: 'Ultraj', text: 'Art. 36 – Ultraj\nSancțiune: $10.000 + 30 luni + cazier' },
  { id: 'art40', label: 'Obstr. poliție', text: 'Art. 40 – Obstrucționare poliție\nSancțiune: $5.000 + 25 luni + cazier' },
  { id: 'art41', label: 'Fugă pe jos', text: 'Art. 41 – Fugă de poliție pe jos\nSancțiune: $7.500 + 15 luni + cazier' },
  { id: 'art45', label: 'Nerespectare', text: 'Art. 45 – Nerespectarea ordinului polițistului\nSancțiune: $7.500 + 15 luni' },
  { id: 'art50', label: 'Fără permis', text: 'Art. 50 – Conducere fără permis\nSancțiune: $2.500 + 10 luni + cazier' },
  { id: 'art51', label: 'Sub influență', text: 'Art. 51 – Conducere sub influență\nSancțiune: $4.000–$10.000 + suspendare permis' },
  { id: 'art52', label: 'Refuz testare', text: 'Art. 52 – Refuz testare\nSancțiune: $5.000 + 20 luni + cazier' },
  { id: 'art55', label: 'Fugă vehicul', text: 'Art. 55 – Fugă de poliție cu vehicul\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art66', label: 'Substanțe', text: 'Art. 66 – Substanțe interzise\nSancțiune: $3.000–$30.000 + 15–50 luni + cazier' },
  { id: 'art69', label: 'Arme mici', text: 'Art. 69 – Arme calibru mic\nSancțiune: $15.000 + 25 luni + cazier' },
  { id: 'art70', label: 'Arme mari', text: 'Art. 70 – Arme calibru mare\nSancțiune: $25.000 + 35 luni + cazier' },
  { id: 'art71', label: 'Trafic arme', text: 'Art. 71 – Trafic de arme\nSancțiune: $30.000 + 60 luni + cazier' },
  { id: 'art72', label: 'Grup infr.', text: 'Art. 72 – Grup infracțional\nSancțiune: $50.000 + 100 luni + cazier' },
  { id: 'art73', label: 'Lider grup', text: 'Art. 73 – Conducerea grupului infracțional\nSancțiune: $60.000 + 125 luni + cazier' },
];

const NEIMPORTANTE = [
  { id: 'art2', label: 'Det. sinuciderii', text: 'Art. 2 – Determinarea sinuciderii\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art3', label: 'Ucidere culpă', text: 'Art. 3 – Ucidere din culpă\nSancțiune: $6.000 + 25 luni + cazier' },
  { id: 'art7', label: 'Consum subst.', text: 'Art. 7 – Consum substanțe interzise\nSancțiune: $3.500 + 10 luni' },
  { id: 'art9', label: 'Insulte', text: 'Art. 9 – Insulte\nSancțiune: $2.000 + 10 luni' },
  { id: 'art10', label: 'Amenințare', text: 'Art. 10 – Amenințare\nSancțiune: $2.000 + 10 luni' },
  { id: 'art11', label: 'Șantaj', text: 'Art. 11 – Șantaj\nSancțiune: $3.500 + 20 luni' },
  { id: 'art12', label: 'Hărțuire', text: 'Art. 12 – Hărțuire\nSancțiune: $2.500 + 25 luni' },
  { id: 'art13', label: 'Muncă forțată', text: 'Art. 13 – Muncă forțată\nSancțiune: $13.000 + 25 luni + cazier' },
  { id: 'art14', label: 'Proxenetism', text: 'Art. 14 – Proxenetism\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art15', label: 'Cerșetorie', text: 'Art. 15 – Cerșetorie\nSancțiune: $3.500' },
  { id: 'art25', label: 'Distrugere', text: 'Art. 25 – Distrugere\nSancțiune: $2.500 + 10 luni' },
  { id: 'art31', label: 'Calomnie', text: 'Art. 31 – Calomnie\nSancțiune: $2.000 + 15 luni' },
  { id: 'art33', label: 'Apel fals', text: 'Art. 33 – Apel fals\nSancțiune: $3.000 + 10 luni' },
  { id: 'art37', label: 'Uzurpare', text: 'Art. 37 – Uzurpare funcție\nSancțiune: $5.000 + 15 luni + cazier' },
  { id: 'art58', label: 'Ordine publică', text: 'Art. 58 – Tulburarea ordinii publice\nSancțiune: $3.000' },
];

const SANCTION_MAP = new Map(
  [...PRINCIPALE, ...NEIMPORTANTE].map((x) => [x.id, x.text])
);

/* =========================================================
   HELPERS
========================================================= */

function chunkButtons(items, prefix, style, perRow = 5) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    const slice = items.slice(i, i + perRow);
    rows.push(
      new ActionRowBuilder().addComponents(
        slice.map((item) =>
          new ButtonBuilder()
            .setCustomId(`${prefix}_${item.id}`)
            .setLabel(item.label.slice(0, 80))
            .setStyle(style)
        )
      )
    );
  }
  return rows;
}

async function sendPanelInChunks(interaction, embeds, rows) {
  const rowChunks = [];
  for (let i = 0; i < rows.length; i += 5) {
    rowChunks.push(rows.slice(i, i + 5));
  }

  await interaction.reply({
    embeds,
    components: rowChunks[0] || [],
  });

  for (let i = 1; i < rowChunks.length; i++) {
    await interaction.followUp({
      components: rowChunks[i],
    });
  }
}

/* =========================================================
   SLASH COMMAND
========================================================= */

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('panel-sanctiuni')
      .setDescription('Trimite panelurile cu sancțiuni')
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log('✅ Comanda /panel-sanctiuni a fost înregistrată.');
}

/* =========================================================
   READY
========================================================= */

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

/* =========================================================
   INTERACTIONS
========================================================= */

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'panel-sanctiuni') {
        const principaleEmbed = new EmbedBuilder()
          .setColor(0xed4245)
          .setTitle('🚨 Sancțiuni principale')
          .setDescription(
            [
              'Apasă pe sancțiunea dorită.',
              '',
              'Butoanele roșii sunt pentru articolele importante.',
              'Botul îți răspunde imediat cu sancțiunea exactă.',
            ].join('\n')
          )
          .setFooter({ text: 'Moldova RP' });

        const alteEmbed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('📌 Alte sancțiuni')
          .setDescription(
            [
              'Dacă nu găsești sancțiunea în principale, folosește secțiunea aceasta.',
              '',
              'Butoanele albastre sunt pentru articolele mai puțin importante.',
            ].join('\n')
          )
          .setFooter({ text: 'Moldova RP' });

        const principaleRows = chunkButtons(PRINCIPALE, 'principal', ButtonStyle.Danger, 5);
        const neimportanteRows = chunkButtons(NEIMPORTANTE, 'other', ButtonStyle.Primary, 5);

        await sendPanelInChunks(interaction, [principaleEmbed], principaleRows);
        await interaction.followUp({
          embeds: [alteEmbed],
          components: neimportanteRows.slice(0, 5),
        });

        for (let i = 5; i < neimportanteRows.length; i += 5) {
          await interaction.followUp({
            components: neimportanteRows.slice(i, i + 5),
          });
        }
      }
      return;
    }

    if (interaction.isButton()) {
      let articleId = null;

      if (interaction.customId.startsWith('principal_')) {
        articleId = interaction.customId.replace('principal_', '');
      } else if (interaction.customId.startsWith('other_')) {
        articleId = interaction.customId.replace('other_', '');
      }

      if (!articleId) return;

      const sanction = SANCTION_MAP.get(articleId);
      if (!sanction) {
        return interaction.reply({
          content: '❌ Nu am găsit sancțiunea pentru acest articol.',
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x22c55e)
        .setTitle('✅ Sancțiune găsită')
        .setDescription(`\`\`\`\n${sanction}\n\`\`\``)
        .setFooter({ text: 'Aplicare sancțiune' });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error('❌ Eroare interactionCreate:', error);

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({
        content: '❌ A apărut o eroare.',
        ephemeral: true,
      }).catch(() => {});
    }

    return interaction.reply({
      content: '❌ A apărut o eroare.',
      ephemeral: true,
    }).catch(() => {});
  }
});

/* =========================================================
   START
========================================================= */

(async () => {
  try {
    await registerCommands();
    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Eroare la pornire:', error);
    process.exit(1);
  }
})();