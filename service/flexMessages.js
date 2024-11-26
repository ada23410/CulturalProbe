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
                        text: '任務一：飲食紀錄',
                        weight: 'bold',
                        size: 'lg',
                    },
                    {
                        type: 'text',
                        text: '記錄您最近三天的飲食情況。',
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
                        style: 'primary',
                        action: {
                            type: 'message',
                            label: '查看詳細說明',
                            text: '查看任務一詳細說明',
                        },
                    },
                ],
            },
        },
        // 可以添加更多任務泡泡
    ],
});

module.exports = { generateTaskCarousel };
