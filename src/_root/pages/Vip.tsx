import { useToast } from "@/components/ui";
import { useUserContext } from "@/context/AuthContext";
import { api } from "@/lib/appwrite/config";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { array } from "zod";

const Vip = () => {
  const { user, isAuthenticated } = useUserContext()
  const [pricingPlans, setPricingPlans] = useState([])
  const toast = useToast()
  // const pricingPlans = [
  //   {
  //     paymentId: "cmeq7k5q50000ueeo2w2003j4",
  //     name: "Teste",
  //     price: "$0",
  //     period: "/mês",
  //     description: "Perfeito para começar",
  //     popular: false,
  //     gradient: "from-lime-400 to-lime-500",
  //     features: ["1 mês de acesso", "Todos os benefícios VIP"],
  //   },
  //   {
  //     paymentId: "prod_SvbKqFv0AeOH7b",
  //     name: "Starter",
  //     price: "$8",
  //     period: "/mês",
  //     description: "Perfeito para começar",
  //     popular: false,
  //     gradient: "from-lime-400 to-lime-500",
  //     features: ["1 mês de acesso", "Todos os benefícios VIP"],
  //   },
  //   {
  //     paymentId: "prod_SvbKDu7zBV9IE4",
  //     name: "Popular",
  //     price: "$6",
  //     period: "/mês",
  //     description: "Mais escolhido",
  //     popular: true,
  //     gradient: "from-lime-500 to-lime-600",
  //     features: ["3 meses de acesso", "25% de economia", "Todos os benefícios VIP"],
  //   },
  //   {
  //     paymentId: "prod_SvbKnBilDTp9Qy",
  //     name: "Pro",
  //     price: "$4",
  //     period: "/mês",
  //     description: "Melhor custo-benefício",
  //     popular: false,
  //     gradient: "from-lime-400 to-lime-600",
  //     features: ["6 meses de acesso", "50% de economia", "Todos os benefícios VIP"],
  //   },
  //   {
  //     paymentId: "prod_SvbKjB5vKY0d6j",
  //     name: "Elite",
  //     price: "$3",
  //     period: "/mês",
  //     description: "Máxima economia",
  //     popular: false,
  //     gradient: "from-lime-300 to-lime-500",
  //     features: ["12 meses de acesso", "62% de economia", "Todos os benefícios VIP"],
  //   },
  // ]

  const benefits = [
    {
      icon: "💰",
      title: "1.000 Simbucks iniciais",
      description:
        "Ganhe créditos virtuais para impulsionar suas publicações e desbloquear vantagens especiais na plataforma.",
      color: "from-lime-300 to-lime-400",
    },
    {
      icon: "✅",
      title: "Tag de Verificado & VIP",
      description: "Destaque-se na comunidade com selos exclusivos que comprovam sua relevância e apoio ao projeto.",
      color: "from-lime-400 to-lime-500",
    },
    {
      icon: "🌟",
      title: "Decoração de Avatar VIP",
      description: "Personalize seu perfil com molduras e efeitos únicos para seu avatar — visibilidade com estilo!",
      color: "from-lime-500 to-lime-600",
    },
    {
      icon: "⚡",
      title: "Download Rápido",
      description: "Baixe diretamente da home sem precisar acessar a página do post.",
      color: "from-lime-300 to-lime-500",
    },
    {
      icon: "🎞",
      title: "Perfil com GIF",
      description: "Adicione vida ao seu perfil com avatares animados.",
      color: "from-lime-400 to-lime-600",
    },
    {
      icon: "🗂",
      title: "Coleções Ilimitadas",
      description: "Organize e salve quantos mods quiser — sem limites.",
      color: "from-lime-300 to-lime-600",
    },
    {
      icon: "🎖",
      title: "Cargo VIP Discord",
      description:
        "Acesso a canais exclusivos no servidor da comunidade para suporte prioritário, sorteios e discussões privadas.",
      color: "from-lime-500 to-lime-600",
    },
    {
      icon: "📜",
      title: "Histórico Completo",
      description:
        "Visualize todo o seu histórico de downloads — VIPs têm acesso total, enquanto usuários comuns veem apenas os últimos 15.",
      color: "from-lime-400 to-lime-500",
    },
    {
      icon: "🚫",
      title: "Zero Anúncios",
      description: "Desfrute do site com uma experiência limpa, sem anúncios do Google AdSense.",
      color: "from-lime-300 to-lime-500",
    },
    {
      icon: "🔄",
      title: "Scroll Infinito",
      description: 'Explore conteúdos com infinite scroll — nada de cliques em "próxima página".',
      color: "from-lime-400 to-lime-600",
    },
  ]

  const fetchProducts = async () => {
    const products = await api.get('products')
    if (products && Array.isArray(products)) {
      setPricingPlans(products)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])


  const createCheckoutSession = async (productId: string, quantity: number) => {

    if (!isAuthenticated) {
      toast.toast({ title: "Você precisa estar logado." })
      return
    }

    const response = await api.post('create-checkout-session', {
      productId, quantity,
      customerId: user.email,
    })
    const { url } = response;

    if (url) {
      window.open(url, "_blank")
    } else {
      toast.toast({ title: "Falha ao processar compra." })
    }
  }

  return (
    <div className="flex h-screen w-full flex-col relative items-stretch justify-start overflow-y-auto">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-lime-300/10 pointer-events-none" />
      <div className="fixed animate-pulse top-0 left-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed animate-pulse bottom-0 right-1/4 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-lime-400">✨</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Experiência Premium</span>
              <span className="text-lime-500">✨</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              BECOME{" "}
              <span className="bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 bg-clip-text text-transparent">
                VIP
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Desbloqueie o poder completo da plataforma com recursos exclusivos, experiência sem anúncios e
              benefícios que transformam sua jornada.
            </p>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            className="mb-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Escolha seu plano</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Todos os planos incluem acesso completo aos benefícios VIP
              </p>
            </div>

            <div className="w-full flex flex-wrap gap-8 justify-center items-center">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative group w-[300px]"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-1">
                        <span>👑</span>
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative h-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-0 shadow-xl rounded-lg ${plan.popular ? "ring-2 ring-lime-500/50 scale-105" : ""} group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500`}
                    />

                    <div className="p-8 relative z-10">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

                        <div className="mb-8">
                          <span className="text-4xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                          <span className="text-gray-600 dark:text-gray-400 text-lg">{plan.period}</span>
                        </div>

                        <button
                          onClick={() => createCheckoutSession(plan.paymentId, 1)}
                          className={`w-full mb-6 bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:shadow-lime-500/25 transition-all duration-300 text-white border-0 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2`}
                        >
                          <span>⚡</span>
                          Começar Agora
                        </button>

                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-lime-500 mr-2">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            className="mb-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="text-4xl">🎁</span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  Benefícios Exclusivos
                </h2>
                <span className="text-4xl">🎁</span>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Cada benefício foi pensado para elevar sua experiência ao próximo nível
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  <div className="h-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-help overflow-hidden rounded-lg min-h-[160px]">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <div className="p-6 relative z-10 text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                        {benefit.title}
                      </h3>
                      <div className="flex items-center justify-center mt-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.color}`} />
                      </div>
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full w-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-lg rounded-lg shadow-xl text-sm max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                    <p className="leading-relaxed">{benefit.description}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white/95 dark:border-t-neutral-800/95" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Extra Content to Force Scroll */}
          <motion.div
            className="mb-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Por que escolher VIP?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Milhares de usuários já transformaram sua experiência. Veja alguns números impressionantes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-lg shadow-lg">
                <div className="text-4xl font-black text-lime-600 mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">Usuários VIP Ativos</div>
              </div>
              <div className="text-center p-8 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-lg shadow-lg">
                <div className="text-4xl font-black text-lime-500 mb-2">1M+</div>
                <div className="text-gray-600 dark:text-gray-300">Downloads Premium</div>
              </div>
              <div className="text-center p-8 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg rounded-lg shadow-lg">
                <div className="text-4xl font-black text-lime-400 mb-2">99%</div>
                <div className="text-gray-600 dark:text-gray-300">Satisfação dos Usuários</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-lime-500 via-lime-600 to-lime-700 border-0 shadow-2xl overflow-hidden rounded-2xl relative">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 p-16 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="inline-block mb-8 text-8xl"
                >
                  👑
                </motion.div>

                <h3 className="text-4xl lg:text-5xl font-black text-white mb-6">Pronto para a transformação?</h3>

                <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Junte-se a milhares de usuários que já descobriram o poder da experiência VIP. Sua jornada premium
                  começa agora.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="bg-white text-lime-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg flex items-center gap-2">
                    <span>⭐</span>
                    Começar Agora
                  </button>

                  <button className="border border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 backdrop-blur-lg rounded-lg flex items-center gap-2">
                    <span>🛡️</span>
                    Garantia 30 dias
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 mt-8 text-white/80">
                  <div className="flex items-center gap-2">
                    <span>♾️</span>
                    <span className="text-sm">Acesso ilimitado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span className="text-sm">Seguro e confiável</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Vip