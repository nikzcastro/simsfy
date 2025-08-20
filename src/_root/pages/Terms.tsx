import React, { useState } from "react";

const Terms = () => {
  const [activeTab, setActiveTab] = useState("terms");

  const termsContent = (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Termos de Serviço</h2>
      <p className="mb-4">
        Ao utilizar o nosso site de postagem de mods para The Sims, você
        concorda com os seguintes termos:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Os mods postados devem ser originais ou devidamente autorizados pelo
          criador.
        </li>
        <li>
          É proibido publicar conteúdo que viole direitos autorais ou leis
          aplicáveis.
        </li>
        <li>
          Reservamo-nos o direito de remover qualquer conteúdo que não cumpra
          nossas diretrizes.
        </li>
      </ul>
    </div>
  );

  const policyContent = (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 ">Política de Privacidade</h2>
      <p className="mb-4">
        Sua privacidade é importante para nós. Coletamos apenas informações
        necessárias para o funcionamento do site:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Dados de cadastro, como nome e e-mail, são armazenados com segurança.
        </li>
        <li>Usamos cookies para melhorar sua experiência no site.</li>
        <li>
          Você pode solicitar a exclusão de seus dados a qualquer momento.
        </li>
      </ul>
    </div>
  );

  return (
    <section className="w-full h-[50vh] flex justify-center items-center select-none">
      <div className="max-w-4xl mx-auto lg:min-w-[50vw] mt-10 bg-white/0 shadow-md rounded-lg overflow-hidden text-black dark:text-white">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 text-center py-2 font-semibold ${
              activeTab === "terms"
                ? "text-green-600 border-b-4 border-green-600"
                : "text-gray-500"
            }`}>
            Termos de Serviço
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`flex-1 text-center py-2 font-semibold ${
              activeTab === "policy"
                ? "text-green-600 border-b-4 border-green-600"
                : "text-gray-500"
            }`}>
            Política de Privacidade
          </button>
        </div>
        <div>{activeTab === "terms" ? termsContent : policyContent}</div>
      </div>
    </section>
  );
};

export default Terms;
