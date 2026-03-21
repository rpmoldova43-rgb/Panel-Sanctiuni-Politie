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
  { id: 'art1', label: 'Omor', text: 'Art.1 – Omor\nSancțiune: $20.000 + 50 luni + cazier' },
  { id: 'art3', label: 'Ucidere culpă', text: 'Art.3 – Ucidere culpă\nSancțiune: $6.000 + 25 luni + cazier' },
  { id: 'art5', label: 'Vătămare', text: 'Art.5 – Vătămare\nSancțiune: $5.000 + 25 luni + cazier' },
  { id: 'art8', label: 'Sechestrare', text: 'Art.8 – Sechestrare\nSancțiune: $7.500 + 30 luni + cazier' },
  { id: 'art10', label: 'Amenințare', text: 'Art.10 – Amenințare\nSancțiune: $2.000 + 10 luni' },
  { id: 'art11', label: 'Șantaj', text: 'Art.11 – Șantaj\nSancțiune: $3.500 + 20 luni' },
  { id: 'art16', label: 'Viol', text: 'Art.16 – Viol\nSancțiune: $4.000 + 15 luni + cazier' },
  { id: 'art17', label: 'Agres. sexuală', text: 'Art.17 – Agresiune sexuală\nSancțiune: $3.000 + 10 luni + cazier' },
  { id: 'art22', label: 'Furt', text: 'Art.22 – Furt\nSancțiune: $7.500 + 30 luni + cazier' },
  { id: 'art23', label: 'Tâlhărie', text: 'Art.23 – Tâlhărie\nSancțiune: $10.000 + 35 luni + cazier' },
  { id: 'art26', label: 'Înșelăciune', text: 'Art.26 – Înșelăciune\nSancțiune: $3.000 + 15 luni' },
  { id: 'art27', label: 'Jaf ostatic', text: 'Art.27 – Jaf cu ostatic\nSancțiune: $15.000 + 30 luni + cazier' },
  { id: 'art28', label: 'Jaf armat', text: 'Art.28 – Jaf armat\nSancțiune: $20.000 + 40 luni + cazier' },
  { id: 'art29', label: 'Spălare bani', text: 'Art.29 – Spălare de bani\nSancțiune: $30.000 + 50 luni + cazier' },
  { id: 'art30', label: 'Hack bancar', text: 'Art.30 – Hack bancar\nSancțiune: $10.000 + 20 luni + cazier' },
  { id: 'art36', label: 'Ultraj', text: 'Art.36 – Ultraj\nSancțiune: $10.000 + 30 luni + cazier' },
  { id: 'art37', label: 'Uzurpare', text: 'Art.37 – Uzurpare funcție\nSancțiune: $5.000 + 15 luni + cazier' },
  { id: 'art40', label: 'Obstrucționare', text: 'Art.40 – Obstrucționare\nSancțiune: $5.000 + 25 luni + cazier' },
  { id: 'art41', label: 'Fugă pe jos', text: 'Art.41 – Fugă de poliție pe jos\nSancțiune: $7.500 + 15 luni + cazier' },
  { id: 'art42', label: 'Evadare', text: 'Art.42 – Evadare\nSancțiune: $5.000 + 25 luni + cazier' },
  { id: 'art43', label: 'Mită', text: 'Art.43 – Mită\nSancțiune: $2.000 + 10 luni + cazier' },
  { id: 'art44', label: 'Abuz serviciu', text: 'Art.44 – Abuz în serviciu\nSancțiune: $6.000 + 15 luni + cazier' },
  { id: 'art46', label: 'Valori false', text: 'Art.46 – Valori false\nSancțiune: $15.000–$50.000 + 20–50 luni + cazier' },
  { id: 'art47', label: 'Ident. falsă', text: 'Art.47 – Identitate falsă\nSancțiune: $50.000 + 15 luni + cazier' },
  { id: 'art50', label: 'Fără permis', text: 'Art.50 – Fără permis\nSancțiune: $2.500 + 10 luni + cazier' },
  { id: 'art51', label: 'Sub influență', text: 'Art.51 – Sub influență\nSancțiune: $4.000–$10.000 + până la 15 luni + suspendare' },
  { id: 'art52', label: 'Refuz test', text: 'Art.52 – Refuz testare\nSancțiune: $5.000 + 20 luni + cazier' },
  { id: 'art55', label: 'Fugă vehicul', text: 'Art.55 – Fugă cu vehicul\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art57', label: 'Transport ilegal', text: 'Art.57 – Transport ilegal\nSancțiune: $15.000 + 20 luni + cazier' },
  { id: 'art60', label: 'Instigare', text: 'Art.60 – Instigare\nSancțiune: $7.500 + 20 luni + cazier' },
  { id: 'art67', label: 'Droguri', text: 'Art.67 – Droguri\nSancțiune: $3.000–$30.000 + 15–50 luni + cazier' },
  { id: 'art70', label: 'Arme mici', text: 'Art.70 – Arme mici\nSancțiune: $15.000 + 25 luni + cazier' },
  { id: 'art71', label: 'Arme mari', text: 'Art.71 – Arme mari\nSancțiune: $25.000 + 35 luni + cazier' },
  { id: 'art72', label: 'Trafic arme', text: 'Art.72 – Trafic de arme\nSancțiune: $30.000 + 60 luni + cazier' },
  { id: 'art73', label: 'Grup infr.', text: 'Art.73 – Grup infracțional\nSancțiune: $50.000 + 100 luni + cazier' },
  { id: 'art74', label: 'Lider grup', text: 'Art.74 – Lider grup infracțional\nSancțiune: $60.000 + 125 luni + cazier' },
];

const NEIMPORTANTE = [
  { id: 'art2', label: 'Înlesnire', text: 'Art.2 – Înlesnire sinucidere\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art4', label: 'Loviri', text: 'Art.4 – Loviri\nSancțiune: $2.500 + 15 luni + cazier' },
  { id: 'art6', label: 'Încăierare', text: 'Art.6 – Încăierare\nSancțiune: $7.500 + 35 luni + cazier' },
  { id: 'art7', label: 'Consum droguri', text: 'Art.7 – Consum droguri\nSancțiune: $3.500 + 10 luni' },
  { id: 'art9', label: 'Insulte', text: 'Art.9 – Insulte\nSancțiune: $2.000 + 10 luni' },
  { id: 'art12', label: 'Hărțuire', text: 'Art.12 – Hărțuire\nSancțiune: $2.500 + 25 luni' },
  { id: 'art13', label: 'Muncă forțată', text: 'Art.13 – Muncă forțată\nSancțiune: $13.000 + 25 luni + cazier' },
  { id: 'art14', label: 'Proxenetism', text: 'Art.14 – Proxenetism\nSancțiune: $7.500 + 25 luni + cazier' },
  { id: 'art15', label: 'Cerșetorie', text: 'Art.15 – Cerșetorie\nSancțiune: $3.500' },
  { id: 'art18', label: 'Hărțuire sex.', text: 'Art.18 – Hărțuire sexuală\nSancțiune: $1.500 + 7 luni' },
  { id: 'art19', label: 'Domiciliu', text: 'Art.19 – Violare domiciliu\nSancțiune: $1.500 + 7 luni' },
  { id: 'art20', label: 'Viață privată', text: 'Art.20 – Viață privată\nSancțiune: $2.000 + 15 luni' },
  { id: 'art21', label: 'Secret prof.', text: 'Art.21 – Secret profesional\nSancțiune: $5.000 + 20 luni + cazier' },
  { id: 'art24', label: 'Fraudă', text: 'Art.24 – Fraudă financiară\nSancțiune: $10.000 + 30 luni + cazier' },
  { id: 'art25', label: 'Distrugere', text: 'Art.25 – Distrugere\nSancțiune: $2.500 + 10 luni' },
  { id: 'art31', label: 'Calomnie', text: 'Art.31 – Calomnie\nSancțiune: $2.000 + 15 luni' },
  { id: 'art32', label: 'Fără ID', text: 'Art.32 – Fără identitate\nSancțiune: $1.500 + 5 luni' },
  { id: 'art33', label: 'Apel fals', text: 'Art.33 – Apel fals\nSancțiune: $3.000 + 10 luni' },
  { id: 'art34', label: 'Urmărire', text: 'Art.34 – Urmărire urgență\nSancțiune: $3.000 + 15 luni' },
  { id: 'art35', label: 'Fără licență', text: 'Art.35 – Fără licență\nSancțiune: $7.500' },
  { id: 'art38', label: 'Nedenunțare', text: 'Art.38 – Nedenunțare\nSancțiune: $3.000 + 15 luni' },
  { id: 'art39', label: 'Declarații false', text: 'Art.39 – Declarații false\nSancțiune: $5.000 + 15 luni' },
  { id: 'art45', label: 'Nerespectare', text: 'Art.45 – Nerespectare ordin\nSancțiune: $7.500 + 15 luni' },
  { id: 'art48', label: 'Fals intelectual', text: 'Art.48 – Fals intelectual\nSancțiune: $15.000 + 25 luni + cazier' },
  { id: 'art49', label: 'Fără nr.', text: 'Art.49 – Fără înmatriculare\nSancțiune: $3.500' },
  { id: 'art53', label: 'Părăsire', text: 'Art.53 – Părăsire accident\nSancțiune: $2.500 + 15 luni' },
  { id: 'art54', label: 'Blocare trafic', text: 'Art.54 – Blocare trafic\nSancțiune: $3.000' },
  { id: 'art56', label: 'Curse ilegale', text: 'Art.56 – Curse ilegale\nSancțiune: $5.000 + 10 luni' },
  { id: 'art58', label: 'Roșu', text: 'Art.58 – Trecere roșu\nSancțiune: $3.500' },
  { id: 'art59', label: 'Tulburare', text: 'Art.59 – Tulburare\nSancțiune: $3.000' },
  { id: 'art61', label: 'Incitare', text: 'Art.61 – Incitare ură\nSancțiune: $5.000 + 10 luni' },
  { id: 'art62', label: 'Indecență', text: 'Art.62 – Indecență\nSancțiune: $3.000 + 10 luni' },
  { id: 'art63', label: 'Kevlar', text: 'Art.63 – Kevlar\nSancțiune: $5.000 + 5 luni' },
  { id: 'art64', label: 'Obiecte ilegale', text: 'Art.64 – Obiecte ilegale\nSancțiune: $5.000–$12.500 + 10–30 luni + cazier' },
  { id: 'art65', label: 'Braconaj', text: 'Art.65 – Braconaj\nSancțiune: $10.000–$25.000 + 20–40 luni + cazier' },
  { id: 'art66', label: 'Muniție', text: 'Art.66 – Muniție\nSancțiune: $10.000–$15.000 + 30–50 luni + cazier' },
  { id: 'art68', label: 'Arme albe', text: 'Art.68 – Arme albe\nSancțiune: $5.000 + 15 luni + cazier' },
  { id: 'art69', label: 'Gloanțe', text: 'Art.69 – Gloanțe\nSancțiune: $3.000–$5.000 + 5–15 luni + cazier' },
  { id: 'art75', label: 'Drept tăcere', text: 'Art.75 – Dreptul la tăcere\nSancțiune: fără sancțiune' },
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
