export const fetchLocalText = async (filename: string) => {
    const res = await fetch(`http://localhost:3000/${filename}`);
    const text = await res.text();
    return text;
}

export const fetchApiText = async (url: string) => {
    const res = await fetch(`/api/${url}`);
    const text = await res.text();
    return text;
}

export const fetchApiJson = async (url: string) => {
    const res = await fetch(`/api/${url}`);
    const json = await res.json();
    return json;
}