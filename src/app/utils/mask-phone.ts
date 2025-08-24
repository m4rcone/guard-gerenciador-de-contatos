export function maskPhone(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona DDD
    .replace(/(\d{5})(\d{4})$/, "$1-$2") // Celular com 9 dígitos
    .replace(/(\d{4})(\d{4})$/, "$1-$2"); // Fixo com 8 dígitos
}
