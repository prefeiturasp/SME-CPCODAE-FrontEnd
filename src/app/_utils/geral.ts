export const checkInDateRange = (startDate: Date, endDate: Date, filterStart: Date, filterEnd: Date): boolean => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    filterStart = new Date(filterStart);
    filterEnd = new Date(filterEnd);
    
    return  (startDate >= filterStart && startDate <= filterEnd) ||
            (endDate >= filterStart && endDate <= filterEnd) ||
            (startDate <= filterStart && endDate >= filterEnd);
}

export const convertJsonToCSV = (items: any[]) => {
    const replacer = (key: string, value: string) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = [header.join(';'), ...items.map(row => header.map(fieldName => `=${JSON.stringify(row[fieldName], replacer)}`).join(';'))].join('\r\n');

    return csv;
}

export const copyToClipboard = (text: string) => {
    let localWindow = (<any>window);

    if (localWindow.clipboardData && localWindow.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return localWindow.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

export const filterByDateRange = (array: any[], filterStart: Date, filterEnd: Date): any[] => {
    filterStart = new Date(filterStart);
    filterEnd = new Date(filterEnd);
  
    return array.filter(item => {
      const itemStart = new Date(item.start);
      const itemEnd = new Date(item.end);
  
      // Verifica se o range do item se sobrepõe ao range do filtro.
      return (itemStart >= filterStart && itemStart <= filterEnd) ||
             (itemEnd >= filterStart && itemEnd <= filterEnd) ||
             (itemStart <= filterStart && itemEnd >= filterEnd);
    });
}

export const formatDateAsyyyyMMdd_HHmmss = (date: Date): string => {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const dia = String(date.getDate()).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
    const segundo = String(date.getSeconds()).padStart(2, '0');

    return `${ano}${mes}${dia}_${hora}${minuto}${segundo}`;
}

export const formatDateAsddMMyyyy = (date: Date, separator: string = '/'): string => {
    separator = separator || '/';

    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const dia = String(date.getDate()).padStart(2, '0');

    return `${dia}${separator}${mes}${separator}${ano}`;
}

export const formatDateAsddMMyyyyHHmm = (date: Date, separator: string = '/'): string => {
    separator = separator || '/';

    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const dia = String(date.getDate()).padStart(2, '0');
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');

    return `${dia}${separator}${mes}${separator}${ano} ${hora}:${minuto}`;
}

export const getAllIndexes = (arr: any[], position: number, value: string): number[] => {
    let indexes: number[] = [];

    for(let i = 0; i < arr.length; i++) {
        if (arr[i][position] === value)
            indexes.push(i);
    }

    return indexes;
};

export const getDateWithoutTime = (date: Date): Date => {
    return new Date(new Date(date).setHours(0,0,0,0));
}

export const isValidDate = (d: Date): boolean => {
    return d instanceof Date && !isNaN(d.getTime());
}

export const toQueryString = (params: any): string => {
    return Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '') // Filtra chaves não nulas/undefined
      .map(key => {
        let value = params[key];

        // Verifica se o valor é um objeto Date e o converte para string no formato ISO
        if (value instanceof Date) {
            value = value.toISOString();
        }
        
        if (Array.isArray(value)) { // Verifica se o valor é um array
            return value
              .map(arrayValue => `${encodeURIComponent(key)}=${encodeURIComponent(arrayValue)}`)
              .join('&');
        } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`; // Codifica chave e valor
        }
      })
      .join('&'); // Junta tudo com '&'
}

export const uuidv4 = (): string => {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
};
