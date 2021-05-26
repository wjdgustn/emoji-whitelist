module.exports = {
    info: {
        name: 'debugemoji',
        description: '이모지 관련 설정입니다.',
        options: [
            {
                name: "permission",
                description: "이모지를 사용할 수 있는 역할을 관리합니다.",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "add",
                        description: "이모지를 사용할 수 있는 역할을 추가합니다.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "emojiname",
                                description: "권한을 설정할 이모지의 이름을 입력합니다.",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "user",
                                description: "이모지를 사용할 권한을 부여할 역할을 입력합니다.",
                                type: "ROLE",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "remove",
                        description: "이모지를 사용할 수 있는 역할을 제거합니다.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "emojiname",
                                description: "권한을 설정할 이모지의 이름을 입력합니다.",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "user",
                                description: "이모지를 사용할 권한을 제거할 역할을 입력합니다.",
                                type: "ROLE",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "list",
                        description: "이모지를 사용할 수 있는 역할의 목록을 표시합니다.",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "emojiname",
                                description: "역할 목록을 볼 이모지의 이름을 입력합니다.",
                                type: "STRING",
                                required: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    handler: async interaction => {
        console.log(interaction.member.permissions.has('MANAGE_EMOJIS'));
        if(!interaction.member.permissions.has('MANAGE_EMOJIS')) {
            return interaction.reply('권한이 없습니다.', {
                ephemeral: true
            });
        }

        const action = interaction.options[0].options[0].name;
        const emojiname = interaction.options[0].options[0].options[0].value;

        const emoji = interaction.guild.emojis.cache.find(e => e.name == emojiname);
        if(!emoji) {
            return interaction.reply('해당 이름의 이모지를 찾지 못했습니다.', {
                ephemeral: true
            });
        }

        if(action == 'list') {
            const roles = emoji.roles.cache;
            const list = [];

            let index = 1;
            roles.forEach(r => {
                list.push(`${index}: ${r.name}`);
                index++;
            });

            return interaction.reply(list.join('\n'), {
                ephemeral: true
            });
        }

        const mention = interaction.options[0].options[0].options[1].value;

        const role = interaction.guild.roles.cache.find(r => r.id == mention);

        if(action == 'add') emoji.roles.add(role);
        else if(action == 'remove') emoji.roles.remove(role);
        else {
            return interaction.reply('명령이 잘못되었습니다.', {
                ephemeral: true
            });
        }

        interaction.reply(`${role.name} 역할에게${action == 'add' ? '' : '서'} ${emoji.name} 사용 권한을 ${action == 'add' ? '부여' : '제거'}했습니다.`, {
            ephemeral: false
        });
    }
}