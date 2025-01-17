require('dotenv').config;
const myNumber = process.env.myNumber + '@s.whatsapp.net';

const handler = async (sock, msg, from, args, msgInfoObj) => {

    const { groupAdmins, sendMessageWTyping, groupMetadata, botNumberJid } = msgInfoObj;

    if (!groupAdmins.includes(botNumberJid)) {
        return sendMessageWTyping(from, { text: `❌ I'm not admin here` }, { quoted: msg });
    }

    if (!msg.message.extendedTextMessage) {
        return sendMessageWTyping(from, { text: `*Mention or tag member.*` }, { quoted: msg });
    }

    const taggedJid = msg.message.extendedTextMessage.contextInfo.participant || msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

    if (taggedJid === groupMetadata.owner || taggedJid === myNumber || groupAdmins.includes(taggedJid)) {
        return sendMessageWTyping(from, { text: `❌ *Can't remove Bot/Owner/admin*` }, { quoted: msg });
    }

    try {
        await sock.groupParticipantsUpdate(from, [taggedJid], "remove").then(() => {
            sendMessageWTyping(from, { text: `✔️ *Removed*` }, { quoted: msg });
        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        sendMessageWTyping(from, { text: err.toString() }, { quoted: msg });
        console.log(err);
    }
};

module.exports.command = () => ({ cmd: ["remove","kick","ban"], handler });
