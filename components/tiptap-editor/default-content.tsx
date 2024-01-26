export const defaultEditorContent = {
    type: 'doc',
    content: [
        {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'This is a heading' }],
        },
        {
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    marks: [
                        {
                            type: 'link',
                            attrs: {
                                href: 'https://www.bunkerdigital.co.uk/',
                                target: '_blank',
                            },
                        },
                    ],
                    text: 'BunkerDigital',
                },
                {
                    type: 'text',
                    text: ' is a digital agency based in Manchester. We build websites and apps for clients, and we also build our own products.',
                },
            ],
        },
        {
            type: 'image',
            attrs: {
                src: 'https://www.bunkerdigital.co.uk/mockups/laptop-with-code-open.webp',
                alt: 'picture of code on a laptop screen',
                title: 'picture of code on a laptop screen',
                width: 550,
                height: 412,
            },
        },
        {
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    marks: [
                        {
                            type: 'link',
                            attrs: {
                                href: 'https://www.bunkerdigital.co.uk/',
                                target: '_blank',
                            },
                        },
                    ],
                    text: 'BunkerDigital',
                },
                {
                    type: 'text',
                    text: ' is a digital agency based in Manchester. We build websites and apps for clients, and we also build our own products.',
                },
            ],
        },
        {
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    text: 'This is a paragraph',
                },
            ],
        },
    ],
};
