import { LegalPage } from "@/components/legal-page";

export default function PrivacyPolicyScreen() {
  return <LegalPage eyebrow="Transparência" title="Política de Privacidade" updatedAt="22 de outubro de 2026" sections={[
    { title: "1. O que o Palavra Viva coleta", body: "O Palavra Viva pode armazenar preferências de tema, lembretes e o progresso da jornada diária, como atividades concluídas, sequência e dias de oração. Quando a pessoa usa o app sem criar uma conta, esses dados permanecem no dispositivo por meio do armazenamento local." },
    { title: "2. Liturgia diária", body: "Para exibir as leituras completas e atualizadas, o app consulta uma API pública de liturgia. A requisição usa a data escolhida pela pessoa. O Palavra Viva não envia nome, e-mail ou conteúdo pessoal para essa API." },
    { title: "3. Compartilhamento", body: "Ao tocar em Compartilhar no WhatsApp, o app abre o WhatsApp ou o navegador com o texto preparado. A entrega da mensagem depende do WhatsApp e da escolha da pessoa. O Palavra Viva não lê suas conversas." },
    { title: "4. Notificações e lembretes", body: "As preferências de horário e dias dos lembretes são armazenadas para que a experiência continue entre sessões. Notificações do sistema dependem da permissão concedida no dispositivo e podem ser desativadas a qualquer momento." },
    { title: "5. Segurança e retenção", body: "Adotamos medidas razoáveis para proteger os dados da jornada. A pessoa pode limpar os dados locais nas configurações do aparelho. Caso recursos de conta sejam ativados no futuro, as informações sobre acesso, retenção e exclusão serão atualizadas nesta página." },
    { title: "6. Contato", body: "Para dúvidas sobre privacidade, escreva para o canal de contato informado na loja ou no site do Palavra Viva. Não inclua dados sensíveis em uma mensagem de suporte." },
  ]} />;
}
