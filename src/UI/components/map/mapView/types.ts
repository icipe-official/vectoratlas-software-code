// types.ts
import { Style } from 'ol/style';

export type speciesStyle = {
	species: string;
	color: string;
	defaultStyle: Style;
	selectedStyle: Style;
};
