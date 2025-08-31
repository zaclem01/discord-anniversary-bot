const testIsAnniversary = ((joinDate, testDate) => {
    let isMonth = testDate.getMonth() === joinDate.getMonth();
    let isDay = testDate.getDate() === joinDate.getDate();
    let isAtLeastOneYear = testDate.getFullYear() > joinDate.getFullYear();

    return isMonth && isDay && isAtLeastOneYear;
});

const isAnniversary = (joinDate) => {
    const now = new Date();
    let isMonth = now.getMonth() === joinDate.getMonth();
    let isDay = now.getDate() === joinDate.getDate();
    let isAtLeastOneYear = now.getFullYear() > joinDate.getFullYear();

    return isMonth && isDay && isAtLeastOneYear;
}

const fetchAllMembers = async (guild) => {
    try {
        await guild.members.fetch();
        const members = guild.members.cache;
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

const getAnniversaries = (members, isInTest = false) => {
    const anniversaryMembers = members.filter(member => isInTest ? testIsAnniversary(member.user.createdAt, new Date('2025-01-11')) : isAnniversary(member.user.createdAt, new Date('2025-01-11')))

    const anniversaryList = anniversaryMembers.map(member => {
        const yearsAgo = new Date().getFullYear() - member.user.createdAt.getFullYear();
        return `🎉 Happy Discord Anniversary, ${member.user.username}! You've been on Discord for ${yearsAgo} years 🎉`;
    });

    return anniversaryList;
}

const anniversariesMessage = (anniversaryList) => {
    if (anniversaryList.length > 0) {
        return `**Discord Anniversaries Today:**\n${anniversaryList.join('\n')}`;
    }
        
    return 'No Discord anniversaries today.';
}

export const dailyAnniversaryCheck = async (client) => {
    try {
        console.log('Checking for server anniversaries...');
        
        // Loop through all servers the bot is in
        for (const guild of client.guilds.cache.values()) {
            const members = await fetchAllMembers(guild);
            const anniversaryList = getAnniversaries(members);

            // Find a general channel to post in
            const channel = guild.channels.cache.find(ch => ch.name.includes('town-of-beginnings') );

            if (channel) {
                await channel.send(anniversariesMessage(anniversaryList));
            }
        }

        console.log('Anniversary check complete.');
        
    } catch (error) {
        console.error('Error checking anniversaries:', error);
    }
}

export const anniversaryCommand = async (message, isInTest = false) => {
    const members = await fetchAllMembers(message.guild);
    const anniversaryList = getAnniversaries(members, isInTest);
    message.reply(anniversariesMessage(anniversaryList));
}