/* =========================================================================
   MTRREAL — OFERTAS E CUPONS
   =========================================================================
   Edite aqui para mudar cupons, valores mínimos e frete grátis.
   Não é preciso mexer em index.html, style.css ou script.js.

   CUPONS (coupons):
   code        -> o que o cliente digita (não diferencia maiúscula/minúscula)
   type        -> "percent" (porcentagem) | "fixed" (valor fixo em R$)
   value       -> 15 = 15% (percent)  |  20 = R$ 20,00 (fixed)
   minSubtotal -> compra mínima, em R$, para o cupom valer (soma das peças)
   promo       -> true = o carrinho mostra o aviso da oferta e, ao atingir o
                  mínimo, libera o código para o cliente usar com 1 clique.
                  false = cupom "escondido" (o cliente só usa se souber o código)

   FRETE GRÁTIS (freeShipping):
   minSubtotal -> compra mínima, em R$, para ganhar frete grátis
                  (use null para desligar)

   Os valores mínimos contam a soma das peças ANTES do desconto.
   ========================================================================= */

const OFFERS = {
  coupons: [
    { code: "MTRREAL15", type: "percent", value: 15, minSubtotal: 200, promo: true }
  ],
  freeShipping: { minSubtotal: 300 }
};
