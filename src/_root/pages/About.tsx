import { motion } from "framer-motion";
import React from "react";

const About = () => {
  return (
    <section className="w-full h-full bg-gray-100 py-12 px-6 lg:px-20 select-none">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-bold text-center text-gray-800">
          Sobre o Nosso Site
        </h1>
        <p className="mt-6 text-lg text-gray-600 text-center">
          Bem-vindo à nossa plataforma! Aqui, celebramos a criatividade e a
          personalização. Nosso objetivo é conectar você a conteúdos exclusivos
          que transformam sua experiência digital, seja em jogos, design ou moda
          virtual.
        </p>

        {/* Cards section with animations */}
        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
          }}
        >
          {["Criações Únicas", "Comunidade Colaborativa", "Fácil Navegação"].map(
            (title, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1 + index * 0.5, // Animations with different durations
                  delay: index * 0.2, // Staggered animation
                }}
              >
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="mt-4 text-gray-600">
                  {title === "Criações Únicas" &&
                    "Explore uma ampla gama de criações personalizadas, desde casas impressionantes até roupas e acessórios únicos."}
                  {title === "Comunidade Colaborativa" &&
                    "Descubra o trabalho de criadores talentosos e compartilhe suas próprias ideias com uma comunidade global."}
                  {title === "Fácil Navegação" &&
                    "Nosso design intuitivo facilita a busca por conteúdo e inspirações criativas para todos os gostos."}
                </p>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800">Junte-se a Nós Hoje!</h3>
          <p className="mt-4 text-gray-600">
            Inscreva-se para acessar as melhores criações e faça parte de uma
            comunidade inovadora.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
