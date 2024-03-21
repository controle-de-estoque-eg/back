const calcularValores = async (lista_produtos) => {
  let valorVendaTotal = 0
  let valorCustoTotal = 0
  let descontoTotal = 0

  lista_produtos.forEach((produto) => {
    valorVendaTotal += produto.valor_venda * produto.quantidade_produto
    valorCustoTotal += produto.valor_custo * produto.quantidade_produto
    descontoTotal += produto.desconto
  })

  const lucroTotal = valorVendaTotal - valorCustoTotal

  return {
    valor_venda: valorVendaTotal,
    valor_custo: valorCustoTotal,
    lucro_total: lucroTotal,
    desconto_total: descontoTotal,
  }
}

module.exports = calcularValores
