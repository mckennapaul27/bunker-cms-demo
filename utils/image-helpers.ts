export const sanitizeFileName = (filename: string) => {
    // Remove the file extension
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    // Replace spaces with dashes, remove non-alphanumeric characters (except dashes),
    // and convert to lowercase
    return nameWithoutExtension
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-]/g, '')
        .toLowerCase();
};

// Helper function to convert a ReadableStream to a Buffer
export const streamToBuffer = async (
    stream: ReadableStream
): Promise<string> => {
    const chunks = [];
    const reader = stream.getReader();

    let chunk;
    while (((chunk = await reader.read()), !chunk.done)) {
        chunks.push(chunk.value);
    }

    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString('base64');

    // Assuming the image is in JPEG format. Replace 'image/jpeg' with the correct MIME type if known.
    const dataUri = `data:image/jpeg;base64,${base64}`;

    return dataUri;
};
