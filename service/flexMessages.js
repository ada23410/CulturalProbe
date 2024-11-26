const generateTaskCarousel = () => ({
    type: 'carousel',
    contents: [
        {
            type: 'bubble',
            hero: {
                type: 'image',
                url: 'https://example.com/task1-image.jpg',
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover',
            },
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: '任務一：飲食調查',
                        weight: 'bold',
                        size: 'md',
                    },
                    {
                        type: 'text',
                        text: '請記錄您今天的飲食情況。',
                        size: 'sm',
                        wrap: true,
                        color: '#666666',
                    },
                ],
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'button',
                        style: 'link',
                        action: {
                            type: 'message',
                            label: '查看詳細說明',
                            text: '查看任務一詳細說明',
                        },
                    },
                ],
            },
        },
        // 增加其他任務泡泡
    ],
});

module.exports = { generateTaskCarousel };
