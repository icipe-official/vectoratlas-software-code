export interface VectorPoint {
    species: string,
    prevalence: number,
    location: {
        type: string,
        coordinates: number[]
    }
};
