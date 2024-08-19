export const PublicCallStatusEnum = {
    aberta: { id: 0, text: 'Aberta' },
    emAndamento:  { id: 1, text: 'Em Andamento' },
    aprovada: { id: 2, text: 'Documentos Analisados' },
    homologada: { id: 3, text: 'Homologada' },
    contratada: { id: 4, text: 'Contratada' },
    cronogramaExecutado: { id: 5, text: 'Cronograma Executado' },
    suspensa: { id: 6, text: 'Suspensa' },
    cancelada : { id: 7, text: 'Cancelada' },
    deserta : { id: 8, text: 'Deserta' }
} as const

export type PublicCallStatusEnum = keyof typeof PublicCallStatusEnum;