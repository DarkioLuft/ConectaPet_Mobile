export const parseWeight = (weight: string) => {
    return weight ? Number(Number(weight.replace(',', '.')).toFixed(2)) : undefined;
}

export const parseAge = (age: string) => {
    return age ? Number(age) : undefined;
}