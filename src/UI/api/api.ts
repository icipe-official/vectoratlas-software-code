export const fetchLocalText = async (filename: string) => {
    const res = await fetch(`http://localhost:3002/${filename}`);
    const text = await res.text();
    return text;
}

export const fetchApiText = async (url: string) => {
    const res = await fetch(`/vector-api/${url}`);
    const text = await res.text();
    return text;
}

export const fetchApiJson = async (url: string) => {
    const res = await fetch(`/vector-api/${url}`);
    const json = await res.json();
    return json;
}
