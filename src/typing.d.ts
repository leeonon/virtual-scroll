type boxEle = HTMLElement | string | null;

type dataVal = HTMLElement | number | string;

interface style {
	[key: string]: number | string | undefined;
}
type newStyle = CSSProperties<style>;

type optionsData = {
	data: dataVal[];
	h: number;
};

type callBack = (e: MouseEvent) => void;

declare module '*.module.scss' {
	const classes: {
		[key: string]: string;
	};
	export default classes;
}

declare module '*.vue' {}
