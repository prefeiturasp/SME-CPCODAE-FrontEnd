import { AbstractControl } from "@angular/forms";

export class CepCpfCnpjValidator {
    static cep(controle: AbstractControl) {
        if (!controle.value || controle.value.trim().length == 0)
            return null;

        const cep = controle.value.replace(/[^\d]+/g, '');
        const isValid = CepCpfCnpjValidator.checkIfCepIsValid(cep);

        if (isValid) return null;

        return { cepInvalido: true };
    }

    static cnpj(controle: AbstractControl) {
        if (!controle.value || controle.value.trim().length == 0)
            return null;

        const cnpj = controle.value.replace(/[^\d]+/g, '');
        const isValid = CepCpfCnpjValidator.checkIfCnpjIsValid(cnpj);

        if (isValid) return null;

        return { cnpjInvalido: true };
    }

    static cpf(controle: AbstractControl) {
        if (!controle.value || controle.value.trim().length == 0)
            return null;

        const cpf = controle.value.replace(/[^\d]+/g, '');
        const isValid = CepCpfCnpjValidator.checkIfCpfIsValid(cpf);

        if (isValid) return null;

        return { cpfInvalido: true };
    }

    static checkIfCepIsValid(cep: string) : boolean {
        if (cep == '' || cep.length != 8)
            return false;

        const regex = new RegExp('[0-9]{8}');

        // Elimina CEPs invalidos conhecidos
        if (cep == '00000000' ||
            cep == '11111111' ||
            cep == '22222222' ||
            cep == '33333333' ||
            cep == '44444444' ||
            cep == '55555555' ||
            cep == '66666666' ||
            cep == '77777777' ||
            cep == '88888888' ||
            cep == '99999999' ||
            !regex.test(cep)
        )
            return false;

        return true;
    }

    static checkIfCnpjIsValid(cnpj: string) : boolean {
        if (cnpj == '' || cnpj.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != parseInt(digitos.charAt(0)))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2)
                pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

        if (resultado != parseInt(digitos.charAt(1)))
            return false;

        return true;
    }

    static checkIfCpfIsValid(cpf: string) : boolean {
        if (cpf == '' || cpf.length != 11)
            return false;

        const regex = new RegExp('[0-9]{11}');

        // Elimina CPFs invalidos conhecidos
        if (cpf == '00000000000' ||
            cpf == '11111111111' ||
            cpf == '22222222222' ||
            cpf == '33333333333' ||
            cpf == '44444444444' ||
            cpf == '55555555555' ||
            cpf == '66666666666' ||
            cpf == '77777777777' ||
            cpf == '88888888888' ||
            cpf == '99999999999' ||
            !regex.test(cpf)
        )
            return false;

        let soma: number = 0;
        let resto: number;

        for (let i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
    }
}