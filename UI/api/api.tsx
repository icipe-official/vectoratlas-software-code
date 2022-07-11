import { VectorPoint } from "../data_types/vector_point";

export const getData = async () => {
    return {};
    const data = await fetch('http://localhost:3001');
    const text = await data.text();
    const value: [VectorPoint] = JSON.parse(text);
    return value;
}