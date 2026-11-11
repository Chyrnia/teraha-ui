
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', { 
        style: 'currency', 
        currency: 'PYG', 
        maximumFractionDigits: 0 
    }).format(amount || 0);
};