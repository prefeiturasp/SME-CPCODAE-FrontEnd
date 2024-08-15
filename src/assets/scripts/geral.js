function convertToNumber(param) {
    const value = param.toString();
    if (isNaN(+value)) {
        const newValue = replaceAll(replaceAll(value, '.', ''), ',', '.');

        if (isNaN(+newValue))
            return 'Valor inválido';

        return newValue;
    }

    return value;
}

function convertToSlug(text) {
    return text.toLowerCase()
               .replace(/ /g, '-')
               .replace(/[^\w-]+/g, '');
}

function downloadFile(url, filename) {
    var a = document.createElement('A');    
    a.href = url;
    a.download = filename || url.substr(url.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadFileCSV(csv, filename) {
    var a = document.createElement('A');

    var universalBOM = "\uFEFF";
    var url = 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csv);
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function findLastIndexOf (array, key, value) {
    for(let i = array.length - 1; i >= 0; i--) {
        if(array[i][key] === value)
            return i;
    }

    return -1;
};

function focusOnFormError(controls) {
    for (const key of Object.keys(controls)) {
        if (controls[key].invalid) {
          const invalidControl = $(`[formcontrolname="${key}"]`);
          invalidControl.focus();
          break;
       }
  }
}

function formatDate(date) {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1).toString().padStart(2, '0');
    const day = '' + d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return [year, month, day].join('-');
}

function formatDateTime(date) {
    const d = new Date(date);
    
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');
    const second = d.getSeconds().toString().padStart(2, '0');

    const formattedDate = formatDate(date);
    
    return `${formattedDate}T${[hour, minute, second].join(':')}`;
}

function formatDate_ddMMyyyy(date, separator) {
    separator = separator || '/';

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [day, month, year].join(separator);
}

function formatDate_yyyyMMddHHmmss(date) {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1).toString().padStart(2, '0');
    const day = '' + d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}${second}`;
}

function getCsvSeparator(csvFile) {
    const rows = csvFile.split("\n").filter(r => r.length > 0);

    const semiColonSeparator = ';';
    let numCols = rows[0].split(semiColonSeparator).length;

    let consistent = numCols > 1 && rows.every(function(row) {
        return row.split(semiColonSeparator).length === numCols;
    });

    if (consistent)
        return semiColonSeparator;

    const commaSeparator = ',';
    numCols = rows[0].split(commaSeparator).length;
    consistent = numCols > 1 && rows.every(function(row) {
        return row.split(commaSeparator).length === numCols;
    });

    if (consistent)
        return commaSeparator;

    return null;
}

function getDateWithoutTime(date) {
    return new Date(date.setHours(0, 0, 0, 0));
}

function getDuplicatedLinesFromArray (values, index) {
    const result = values.reduce((acc, currentItem) => {
        acc[currentItem[index]] = ++acc[currentItem[index]] || 0;
        return acc;
    }, {});

    return values.filter(i => result[i[index]]);
}

function getDuplicatedLinesFromObject (values, key) {
    const result = values.reduce((acc, currentItem) => {
        acc[currentItem[key]] = ++acc[currentItem[key]] || 0;
        return acc;
    }, {});

    return values.filter(i => result[i[key]]);
}

function groupByKey (array, key) {
    const result = array.reduce(function (acc, item) {
        acc[item[key]] = acc[item[key]] || [];
        acc[item[key]].push(item);
        return acc;
    }, Object.create(null));

    return result;
}

function isEmpty(obj)
{
    return obj === null || obj === undefined || obj === '' || obj.toString().trim() === '' || isObjectEmpty(obj);
}

function isObjectEmpty(obj)
{
    if (typeof obj !== 'object')
        return false;

    for (var key in obj)
    {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function maskCnpj(cnpj) {
    const cnpjOnlyNumbers = onlyNumbers(cnpj).padStart(14, '0');
    return cnpjOnlyNumbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function onlyNumbers(text) {
    if (isEmpty(text))
        return '';

    return text.replace(/\D/g, '');
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace).replace(/(?:\\[rn]|[\r\n]+)+/g, "");
}

function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

function sort_by(list_of_arguments)
{
    var default_cmp = function (pA, pB)
    {
        var a = (typeof pA === 'string') ? pA.toLowerCase() : pA;
        var b = (typeof pB === 'string') ? pB.toLowerCase() : pB;

        if (!isEmpty(a) && typeof (a.localeCompare) === 'function')
            return a.localeCompare(b);

        if (a == b) return 0;
        return a < b ? -1 : 1;
    };

    function getCmpFunc(primer, reverse)
    {
        var dfc = default_cmp, // closer in scope
            cmp = default_cmp;
        if (primer)
        {
            cmp = function (a, b)
            {
                return dfc(primer(a), primer(b));
            };
        }
        if (reverse)
        {
            return function (a, b)
            {
                return -1 * cmp(a, b);
            };
        }
        return cmp;
    }

    var fields = [],
        n_fields = list_of_arguments.length,
        field, name, reverse, cmp;

    // preprocess sorting options
    for (var i = 0; i < n_fields; i++)
    {
        field = list_of_arguments[i];
        if (typeof field === 'string')
        {
            name = field;
            cmp = default_cmp;
        }
        else
        {
            name = field.name;
            cmp = getCmpFunc(field.primer, field.reverse);
        }
        fields.push({
            name: name,
            cmp: cmp
        });
    }

    // final comparison function
    return function (A, B)
    {
        var name, result;

        for (var i = 0; i < n_fields; i++)
        {
            result = 0;
            field = fields[i];
            name = field.name;

            result = field.cmp(A[name], B[name]);
            if (result !== 0) break;
        }

        return result;
    };
}

function textTransformCapitalize(str) {
    if (isEmpty(str))
        return '';

    const arr = str.split(' ');
    return arr.map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      }).join(' ');
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function uniqueByKey(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

function validateCpfFormat(cpf) {
    if (!cpf)
        return false;
    
    cpf = cpf.toString().replace(/\D/g, '');
    
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    var result = true;
    
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    
    return result;
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}