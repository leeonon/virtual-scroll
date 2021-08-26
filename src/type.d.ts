type boxEle = HTMLElement | string | null

type dataVal = HTMLElement | number | string

type style = {
    [key: string]: number | string
}

type optionsData = {
    data: dataVal[];
    h: number
}


type callBack = (e: MouseEvent) => void;
