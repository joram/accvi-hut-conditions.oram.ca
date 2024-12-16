async function fetchFiles(date: Date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const bucketUrl = `https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/?prefix=webcam/${year}-${month}-${day}/`;

    try {
        const response = await fetch(bucketUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const text = await response.text();
        const fileList = parseFileList(text);
        return fileList
    } catch (err: any) {
        return []
    }
    return []
};

function parseFileList(data: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "application/xml");

    const keys = Array.from(doc.getElementsByTagName("Key")).map((node) =>
        node.textContent ? node.textContent : ""
    );
    return keys.filter((key) => key); // Remove empty keys
}

export { fetchFiles, parseFileList };
